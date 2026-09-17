export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// نسخه‌ای از User که هرگز نباید passwordHash داشته باشد — برای برگرداندن به Client
export type SafeUser = Omit<User, "passwordHash">;