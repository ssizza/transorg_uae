import mysql from "mysql2/promise"

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
 * @returns Promise resolving to query results.
 */
export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

/**
 * Executes a transaction with a provided callback.
 * @param callback - Function to execute within the transaction.
 * @returns Promise resolving to the callback's result.
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

// Test connection on startup
testConnection()

export { pool }
