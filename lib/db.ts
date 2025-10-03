import mysql, { type ResultSetHeader } from "mysql2/promise"

// Database connection string using environment variables
const connectionString = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

// Create a MySQL connection pool for efficient query handling
const pool = mysql.createPool(connectionString)

/**
 * Tests the database connection on startup to ensure connectivity.
 * Logs success or failure to the console.
 */
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection()
    console.log("Database connected successfully")
    connection.release()
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

/**
 * Generic query function to execute SQL statements with parameters.
 * @param sql - The SQL query string.
 * @param params - Array of parameters to prevent SQL injection.
 * @returns Promise resolving to an array of results typed as T for SELECT, or a single ResultSetHeader for INSERT/UPDATE/DELETE.
 */
export async function query<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T extends { insertId: number } ? ResultSetHeader : T[]> {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T extends { insertId: number } ? ResultSetHeader : T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Interface for the components table
export interface Component {
  id: number
  content_data: string
  site: "com" | "org"
  created_at: string
  updated_at: string
  component_code: string
}

/**
 * Fetches a single component by its ID from the components table.
 * @param id - The component ID.
 * @returns Promise resolving to the component or undefined if not found.
 */
export async function getComponentById(id: number): Promise<Component | undefined> {
  const [component] = await query<Component>(`SELECT * FROM components WHERE id = ?`, [id])
  return component as Component | undefined
}

/**
 * Updates the content_data of a component by its ID.
 * @param id - The component ID.
 * @param contentData - The updated content data as an object.
 */
export async function updateComponent(id: number, contentData: object): Promise<void> {
  await query<ResultSetHeader>(`UPDATE components SET content_data = ? WHERE id = ?`, [JSON.stringify(contentData), id])
}

/**
 * Creates a new component in the components table.
 * @param contentData - The content data as an object.
 * @param site - The site identifier ('com' or 'org').
 * @param componentCode - The unique code for the component (e.g., 'About_Us').
 * @returns Promise resolving to the inserted component's ID.
 */
export async function createComponent(
  contentData: object,
  site: "com" | "org",
  componentCode: string,
): Promise<number> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO components (content_data, site, component_code) VALUES (?, ?, ?)`,
    [JSON.stringify(contentData), site, componentCode],
  )
  return result.insertId
}

// Interface for the pages table
export interface Page {
  id: number
  name: string | null
  slug: string | null
  tempname: string | null
  secs: string[] | null
  seo_content: string | null
  is_default: boolean
  created_at: string | null
  updated_at: string | null
}

// Raw type for pages table before parsing JSON fields
interface RawPage {
  id: number
  name: string | null
  slug: string | null
  tempname: string | null
  secs: string | null
  seo_content: string | null
  is_default: number
  created_at: string | null
  updated_at: string | null
}

/**
 * Fetches all pages from the pages table.
 * @returns Promise resolving to an array of Page objects with parsed secs field.
 */
export async function getPages(): Promise<Page[]> {
  const rawPages = await query<RawPage>("SELECT * FROM pages")
  return rawPages.map((rawPage) => ({
    ...rawPage,
    secs: rawPage.secs ? (JSON.parse(rawPage.secs) as string[]) : null,
    is_default: Boolean(rawPage.is_default),
  }))
}

/**
 * Fetches a page by its ID.
 * @param id - The page ID.
 * @returns Promise resolving to the page or undefined if not found.
 */
export async function getPageById(id: number): Promise<Page | undefined> {
  const [rawPage] = await query<RawPage>("SELECT * FROM pages WHERE id = ?", [id])
  if (!rawPage) return undefined
  return {
    ...rawPage,
    secs: rawPage.secs ? (JSON.parse(rawPage.secs) as string[]) : null,
    is_default: Boolean(rawPage.is_default),
  }
}

/**
 * Deletes a page by its ID.
 * @param id - The page ID.
 */
export async function deletePage(id: number): Promise<void> {
  await query<ResultSetHeader>("DELETE FROM pages WHERE id = ?", [id])
}

/**
 * Fetches components associated with a page by its ID.
 * @param pageId - The page ID.
 * @returns Promise resolving to an array of components linked via secs (component_code).
 */
export async function getPageComponents(pageId: number): Promise<Component[]> {
  const page = await getPageById(pageId)
  if (!page || !page.secs) return []

  const placeholders = page.secs.map(() => "?").join(", ")
  const sql = `SELECT * FROM components WHERE component_code IN (${placeholders})`
  return await query<Component>(sql, page.secs)
}

// Type for objects with JSON fields to be parsed
type JsonParseable = Record<string, unknown>

/**
 * Parses specified JSON fields in an object.
 * @param obj - The object containing JSON string fields.
 * @param fields - Array of field names to parse.
 * @returns The object with parsed fields typed as T.
 */
export function parseJsonFields<T extends JsonParseable>(obj: JsonParseable, fields: string[]): T {
  const parsed = { ...obj }
  for (const field of fields) {
    if (parsed[field] && typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field] as string)
      } catch (error) {
        console.error(`Error parsing JSON for field ${field}:`, error)
        parsed[field] = null
      }
    }
  }
  return parsed as T
}

// Interface for admin table
interface Admin {
  id: number
  email: string
  username: string
  password: string
  status: string
  fname: string | null
  sname: string | null
  last_login: string | null
  role_id?: number
  role_name?: string
}

/**
 * Fetches an admin by their username.
 * @param username - The admin's username.
 * @returns Promise resolving to the admin or undefined if not found.
 */
export async function getAdminByUsername(username: string): Promise<Admin | undefined> {
  const [admin] = await query<Admin>(`SELECT * FROM admins WHERE username = ?`, [username])
  return admin
}

/**
 * Fetches all active admins with their role names.
 * @returns Promise resolving to an array of admins.
 */
export async function getAdmins(): Promise<Admin[]> {
  return await query<Admin>(
    `SELECT a.*, r.name as role_name 
     FROM admins a 
     LEFT JOIN admin_role ar ON a.id = ar.admin_id 
     LEFT JOIN roles r ON ar.role_id = r.id 
     WHERE a.status != 'deleted'`,
  )
}

/**
 * Updates an admin's details by their ID.
 * @param id - The admin ID.
 * @param updates - Partial object with fields to update.
 */
export async function updateAdmin(
  id: string | number,
  updates: Partial<{
    username: string
    email: string
    fname: string
    sname: string
    dob: string
    position: string
    password: string
    status: string
    role: string
  }>,
): Promise<void> {
  let sql = "UPDATE admins SET "
  const params: (string | number)[] = []
  const updateFields: string[] = []

  for (const [key, value] of Object.entries(updates)) {
    if (key !== "role") {
      updateFields.push(`${key} = ?`)
      params.push(value)
    }
  }

  sql += updateFields.join(", ")
  sql += " WHERE id = ?"
  params.push(id)

  await query(sql, params)

  if (updates.role) {
    const [roleResult] = await query<{ id: number }>("SELECT id FROM roles WHERE name = ?", [updates.role])
    if (roleResult) {
      await query("UPDATE admin_role SET role_id = ? WHERE admin_id = ?", [roleResult.id, id])
    }
  }
}

/**
 * Creates an OTP entry for an email.
 * @param email - The email address.
 * @param otp - The one-time password.
 */
export async function createOtp(email: string, otp: string): Promise<void> {
  await query("INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [
    email,
    otp,
  ])
}

// Interface for OTP records
interface OtpRecord {
  id: number
  email: string
  otp: string
  expires_at: Date
}

/**
 * Verifies an OTP for an email, checking if it’s valid and not expired.
 * @param email - The email address.
 * @param otp - The OTP to verify.
 * @returns Promise resolving to the OTP record or undefined if invalid/expired.
 */
export async function verifyOtp(email: string, otp: string): Promise<OtpRecord | undefined> {
  const [otpRecord] = await query<OtpRecord>("SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()", [
    email,
    otp,
  ])
  return otpRecord
}

/**
 * Deletes an OTP by its ID.
 * @param id - The OTP ID.
 */
export async function deleteOtp(id: number): Promise<void> {
  await query("DELETE FROM otps WHERE id = ?", [id])
}

// Interface for permissions
interface Permission {
  name: string
}

/**
 * Fetches permissions for a role by its ID.
 * @param roleId - The role ID (null returns empty array).
 * @returns Promise resolving to an array of permissions.
 */
export async function getRolePermissions(roleId: number | null): Promise<Permission[]> {
  if (roleId === null || roleId === undefined) {
    return []
  }
  return await query<Permission>(
    `SELECT p.name 
     FROM permissions p 
     JOIN roles_permissions rp ON p.id = rp.permission_id 
     WHERE rp.role_id = ?`,
    [roleId],
  )
}

// Interface for roles
interface Role {
  description: string
  id: number
  name: string
}

/**
 * Fetches all roles from the roles table.
 * @returns Promise resolving to an array of roles.
 */
export async function getRoles(): Promise<Role[]> {
  return await query<Role>("SELECT * FROM roles")
}

/**
 * Executes a transaction with a provided callback.
 * @param callback - Function to execute within the transaction.
 * @returns Promise resolving to the callback’s result.
 */
export async function transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Alternative query function for team volunteer data (duplicate of query, consider merging).
 * @param sql - The SQL query string.
 * @param params - Array of parameters.
 * @returns Promise resolving to an array of results typed as T.
 */
export async function teamVolunter<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

/**
 * Fetches an admin by their ID with role information.
 * @param id - The admin ID.
 * @returns Promise resolving to the admin or undefined if not found.
 */
export async function getAdminById(id: number): Promise<Admin | undefined> {
  const [admin] = await query<Admin>(
    `SELECT a.*, r.name as role_name 
     FROM admins a 
     LEFT JOIN admin_role ar ON a.id = ar.admin_id 
     LEFT JOIN roles r ON ar.role_id = r.id 
     WHERE a.id = ?`,
    [id],
  )
  return admin
}

// Interface for query result metadata
export interface QueryResult {
  affectedRows: number
  insertId: number
  changedRows: number
}

// Interface for members_data table
export interface Member {
  id: number
  member_id: string
  member_data: {
    organizationName: string
    yearOfEstablishment: string
    country: string
    city: string
    contactPerson: string
    position: string
    Gender: string
    email: string
    phoneNumber: string
    mission: string
    activities: string
    members: string
    structure: string
    pastCollaboration: string
    futureCollaboration: string
    joinReason: string
    additionalInfo: string
  }
  status: string
  created_at: string
  updated_at: string
}

// Raw type for database query result (before JSON parsing)
interface RawMember {
  id: number
  member_id: string
  member_data: string // JSON as string from DB
  status: string
  created_at: string
  updated_at: string
}

/**
 * Fetches all active members from members_data.
 * @returns Promise resolving to an array of members with parsed member_data.
 */
export async function getMembers(): Promise<Member[]> {
  const rawMembers = await query<RawMember>("SELECT * FROM members_data WHERE status != 'deleted'")
  return rawMembers.map((rawMember) => {
    const parsedMemberData = JSON.parse(rawMember.member_data) as Member["member_data"]
    return {
      ...rawMember,
      member_data: parsedMemberData,
    }
  })
}

/**
 * Updates a member’s status by ID.
 * @param id - The member ID.
 * @param status - The new status.
 */
export async function updateMemberStatus(id: number, status: string): Promise<void> {
  await query("UPDATE members_data SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id])
}

/**
 * Creates a new admin with role assignment.
 * @param admin - Admin details including email, role, status, username, and password.
 * @returns Promise resolving to the inserted admin’s ID.
 * @throws Error if the role is not found.
 */
export async function createAdmin(admin: {
  email: string
  role: string
  status: string
  username: string
  password: string
}): Promise<number> {
  const [result] = await pool.execute(`INSERT INTO admins (email, username, password, status) VALUES (?, ?, ?, ?)`, [
    admin.email,
    admin.username,
    admin.password,
    admin.status,
  ])

  const insertResult = result as mysql.ResultSetHeader
  const adminId = insertResult.insertId

  const [roleResult] = await query<{ id: number }>("SELECT id FROM roles WHERE name = ?", [admin.role])

  if (roleResult) {
    await pool.execute("INSERT INTO admin_role (admin_id, role_id) VALUES (?, ?)", [adminId, roleResult.id])
  } else {
    throw new Error(`Role '${admin.role}' not found in roles table`)
  }

  return adminId
}

/**
 * Fetches an admin by their email with role information.
 * @param email - The admin’s email.
 * @returns Promise resolving to the admin or undefined if not found.
 */
export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const [admin] = await query<Admin>(
    `SELECT a.*, r.id as role_id, r.name as role_name 
     FROM admins a 
     LEFT JOIN admin_role ar ON a.id = ar.admin_id 
     LEFT JOIN roles r ON ar.role_id = r.id 
     WHERE a.email = ?`,
    [email],
  )
  return admin
}

// Test connection on startup (moved after all definitions)
testConnection()
