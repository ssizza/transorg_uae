import { query } from "./index"

export interface Permission {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetches all permissions.
 */
export async function getPermissions(): Promise<Permission[]> {
  return await query<Permission>("SELECT * FROM permissions")
}

/**
 * Fetches permissions for a role by its ID.
 */
export async function getRolePermissions(roleId: number | null): Promise<Permission[]> {
  if (roleId === null || roleId === undefined) {
    return []
  }
  return await query<Permission>(
    `SELECT p.* 
     FROM permissions p 
     JOIN roles_permissions rp ON p.id = rp.permission_id 
     WHERE rp.role_id = ?`,
    [roleId],
  )
}

/**
 * Checks if a role has a specific permission.
 */
export async function hasPermission(roleId: number, permissionName: string): Promise<boolean> {
  const results = await query<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM permissions p 
     JOIN roles_permissions rp ON p.id = rp.permission_id 
     WHERE rp.role_id = ? AND p.name = ?`,
    [roleId, permissionName],
  )
  return results[0]?.count > 0
}
