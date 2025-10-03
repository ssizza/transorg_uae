import { query } from "./index"

export interface Role {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetches all roles from the roles table.
 */
export async function getRoles(): Promise<Role[]> {
  return await query<Role>("SELECT * FROM roles")
}

/**
 * Fetches a role by its ID.
 */
export async function getRoleById(id: number): Promise<Role | null> {
  const results = await query<Role>("SELECT * FROM roles WHERE id = ?", [id])
  return results[0] || null
}

/**
 * Fetches a role by its name.
 */
export async function getRoleByName(name: string): Promise<Role | null> {
  const results = await query<Role>("SELECT * FROM roles WHERE name = ?", [name])
  return results[0] || null
}
