"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminUsers, updateUserRole, AdminUser } from "@/lib/api";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "مشتری",
  SELLER: "فروشنده",
  ADMIN: "ادمین",
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getAdminUsers().then((res) => {
      setUsers(res.data);
      setIsLoading(false);
    });
  }, [user]);

  async function handleRoleChange(userId: string, newRole: string) {
    await updateUserRole(userId, newRole);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  }

  if (isLoading) return <p className="text-center py-10">در حال بارگذاری کاربران...</p>;

  return (
    <main className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">کاربران</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-start border-b">
            <th className="py-2">نام</th>
            <th>ایمیل</th>
            <th>نقش</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="CUSTOMER">{ROLE_LABELS.CUSTOMER}</option>
                  <option value="SELLER">{ROLE_LABELS.SELLER}</option>
                  <option value="ADMIN">{ROLE_LABELS.ADMIN}</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}