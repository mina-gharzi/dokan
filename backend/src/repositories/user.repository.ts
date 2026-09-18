import { pool } from "../config/database";
import { User, UserRole } from "../types/user.types";

function mapRowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findByEmail(email: string): Promise<User | undefined> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] ? mapRowToUser(result.rows[0]) : undefined;
}

async function findById(id: string): Promise<User | undefined> {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] ? mapRowToUser(result.rows[0]) : undefined;
}

async function create(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.name, input.email, input.passwordHash, input.role]
  );
  return mapRowToUser(result.rows[0]);
}

async function findAll(limit: number, offset: number) {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

async function countAll(): Promise<number> {
  const result = await pool.query("SELECT COUNT(*) FROM users");
  return Number(result.rows[0].count);
}

async function updateRole(userId: string, role: string) {
  const result = await pool.query(
    "UPDATE users SET role = $1, updated_at = now() WHERE id = $2 RETURNING id, name, email, role",
    [role, userId]
  );
  return result.rows[0];
}

export const userRepository = {
  findByEmail,
  findById,
  create,
  findAll,
  countAll,
  updateRole,
};