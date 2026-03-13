"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { login, register } from "@/lib/services/auth";
import { isAuthenticated, saveSession } from "@/lib/auth-client";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validate = () => {
    if (mode === "register" && fullName.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return "";
  };

  const submit = async () => {
    const validationMessage = validate();
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        mode === "register"
          ? await register({ fullName: fullName.trim(), email: email.trim(), password, role })
          : await login({ email, password });

      saveSession(response.data);

      const nextUrl = searchParams.get("next");
      const fallback = response.data.user.role === "admin" ? "/admin" : "/dashboard";

      setMessage(`${mode === "register" ? "Registration" : "Login"} successful. Redirecting...`);
      router.replace(nextUrl && nextUrl.startsWith("/") ? nextUrl : fallback);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const nextUrl = searchParams.get("next");
    router.replace(nextUrl && nextUrl.startsWith("/") ? nextUrl : "/dashboard");
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-serif text-3xl text-slate-900 dark:text-slate-100">{mode === "login" ? "Login" : "Register"}</h1>
      <p className="mt-2 text-sm text-slate-500">Connect your account to use save, offer, and seller actions.</p>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setMode("login")} className={`rounded-full px-4 py-2 text-sm ${mode === "login" ? "bg-slate-900 text-white" : "bg-slate-100"}`}>Login</button>
        <button onClick={() => setMode("register")} className={`rounded-full px-4 py-2 text-sm ${mode === "register" ? "bg-slate-900 text-white" : "bg-slate-100"}`}>Register</button>
      </div>

      <div className="mt-5 space-y-3">
        {mode === "register" ? (
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" autoComplete="name" />
        ) : null}
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" autoComplete="email" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" autoComplete={mode === "login" ? "current-password" : "new-password"} />

        {mode === "register" ? (
          <select value={role} onChange={(event) => setRole(event.target.value as "buyer" | "seller")} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        ) : null}

        <button disabled={loading} onClick={submit} className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
      </div>
    </div>
  );
}
