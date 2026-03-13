import { apiPost } from "@/lib/services/api";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin";
}) {
  return apiPost<AuthResult>("/auth/register", payload);
}

export async function login(payload: { email: string; password: string }) {
  return apiPost<AuthResult>("/auth/login", payload);
}
