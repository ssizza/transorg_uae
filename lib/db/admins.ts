import { query } from "./index"
import type { ResultSetHeader } from "mysql2"

export interface Admin {
  id: number
  email: string
  username: string
  password: string
  status: "active" | "banned" | "pending" | "out of office" | "invited"
  fname: string | null
  sname: string | null
  dob: string | null
  position: string | null
  role_id: number | null
  last_login: string | null
  created_at: string
  updated_at: string
  role_name?: string
}

/**
 * Fetches an admin by their email with role information.
 */
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const results = await query<Admin>(
    `SELECT a.*, r.id as role_id, r.name as role_name 
     FROM admins a 
     LEFT JOIN roles r ON a.role_id = r.id 
     WHERE a.email = ?`,
    [email],
  )
  return results[0] || null
}

/**
 * Fetches an admin by their username.
 */
export async function getAdminByUsername(username: string): Promise<Admin | null> {
  const results = await query<Admin>(`SELECT * FROM admins WHERE username = ?`, [username])
  return results[0] || null
}

/**
 * Fetches an admin by their ID with role information.
 */
export async function getAdminById(id: number): Promise<Admin | null> {
  const results = await query<Admin>(
    `SELECT a.*, r.id as role_id, r.name as role_name 
     FROM admins a 
     LEFT JOIN roles r ON a.role_id = r.id 
     WHERE a.id = ?`,
    [id],
  )
  return results[0] || null
}

/**
 * Fetches all active admins with their role names.
 */
export async function getAdmins(): Promise<Admin[]> {
  return await query<Admin>(
    `SELECT a.*, r.name as role_name 
     FROM admins a 
     LEFT JOIN roles r ON a.role_id = r.id 
     WHERE a.status != 'deleted'`,
  )
}

/**
 * Creates a new admin with role assignment.
 */
export async function createAdmin(admin: {
  email: string
  role: string
  status: string
  username?: string
  password?: string
}): Promise<number> {
  const roleResults = await query<{ id: number }>("SELECT id FROM roles WHERE name = ?", [admin.role])

  if (!roleResults[0]) {
    throw new Error(`Role '${admin.role}' not found in roles table`)
  }

  const results = await query<ResultSetHeader>(
    `INSERT INTO admins (email, username, password, status, role_id) VALUES (?, ?, ?, ?, ?)`,
    [admin.email, admin.username || null, admin.password || null, admin.status, roleResults[0].id],
  )

  const insertResult = results[0] as unknown as ResultSetHeader
  return insertResult.insertId
}

/**
 * Updates an admin's details by their ID.
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
    last_login: string
  }>,
): Promise<void> {
  const updateFields: string[] = []
  const params: (string | number)[] = []

  let roleId: number | undefined

  if (updates.role) {
    const roleResults = await query<{ id: number }>("SELECT id FROM roles WHERE name = ?", [updates.role])
    if (roleResults[0]) {
      roleId = roleResults[0].id
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (key !== "role" && value !== undefined) {
      updateFields.push(`${key} = ?`)
      params.push(value)
    }
  }

  // Add role_id to update if role was provided
  if (roleId !== undefined) {
    updateFields.push(`role_id = ?`)
    params.push(roleId)
  }

  if (updateFields.length > 0) {
    params.push(id)
    await query(`UPDATE admins SET ${updateFields.join(", ")} WHERE id = ?`, params)
  }
}

/**
 * Updates admin's last login timestamp.
 */
export async function updateLastLogin(id: number): Promise<void> {
  await query("UPDATE admins SET last_login = NOW() WHERE id = ?", [id])
}
