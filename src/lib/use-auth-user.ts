"use client";

import { useSyncExternalStore } from "react";
import { getUserServerSnapshot, getUserSnapshot, subscribeAuthSession } from "@/lib/auth-client";

export function useAuthUser() {
  return useSyncExternalStore(subscribeAuthSession, getUserSnapshot, getUserServerSnapshot);
}
