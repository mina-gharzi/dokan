import { userRepository } from "../repositories/user.repository";
import { orderRepository } from "../repositories/order.repository";
import { AppError } from "./product.service";

const VALID_ROLES = ["CUSTOMER", "SELLER", "ADMIN"];


const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

async function listUsers(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [users, total] = await Promise.all([
    userRepository.findAll(limit, offset),
    userRepository.countAll(),
  ]);

  return {
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function changeUserRole(userId: string, role: string) {
  if (!VALID_ROLES.includes(role)) {
    throw new AppError(422, "INVALID_ROLE", `Role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }

  return userRepository.updateRole(userId, role);
}

async function listOrders(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    orderRepository.findAllOrders(limit, offset),
    orderRepository.countAllOrders(),
  ]);

  return {
    data: orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function changeOrderStatus(orderId: string, newStatus: string) {
  const order = await orderRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  const allowedNext = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      422,
      "INVALID_STATUS_TRANSITION",
      `Cannot change order status from ${order.status} to ${newStatus}`
    );
  }

  return orderRepository.updateStatus(orderId, newStatus);
}

export const adminService = {
  listUsers,
  changeUserRole,
  listOrders,
  changeOrderStatus,
};