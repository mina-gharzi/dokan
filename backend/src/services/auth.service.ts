import argon2 from "argon2";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { SafeUser } from "../types/user.types";

class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as SafeUser["role"],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(input: RegisterInput) {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "This email is already registered");
  }

  const passwordHash = await argon2.hash(input.password);

  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "CUSTOMER", // ثبت‌نام عمومی همیشه Customer می‌سازد؛ ارتقا به Seller/Admin جای دیگری مدیریت می‌شود
  });

  const token = signToken({ userId: user.id, role: user.role });

  return { user: toSafeUser(user), token };
}

async function login(input: LoginInput) {
  const user = await userRepository.findByEmail(input.email);
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, input.password);
  if (!isPasswordValid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });

  return { user: toSafeUser(user), token };
}

export const authService = {
  register,
  login,
};

export { AppError };