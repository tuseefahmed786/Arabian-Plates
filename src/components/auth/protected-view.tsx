"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SessionUser } from "@/lib/auth-client";
import { useAuthUser } from "@/lib/use-auth-user";

interface ProtectedViewProps {
  children: React.ReactNode;
  allowRoles?: Array<SessionUser["role"]>;
}

export function ProtectedView({ children, allowRoles }: ProtectedViewProps) {
  const router = useRouter();
  const user = useAuthUser();

  const isAuthorized =
    Boolean(user) &&
    (!allowRoles || (user ? allowRoles.includes(user.role) : false));

  useEffect(() => {
    if (!user) {
      router.replace("/auth?next=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (allowRoles && !allowRoles.includes(user.role)) {
      router.replace("/dashboard");
      return;
    }
  }, [allowRoles, router, user]);

  if (!isAuthorized) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}
