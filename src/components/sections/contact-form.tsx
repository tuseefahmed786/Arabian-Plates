"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiPost } from "@/lib/services/api";

interface ContactFormState {
  fullName: string;
  email: string;
  department: "sales" | "buyer-support" | "seller-operations";
  subject: string;
  message: string;
}

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  department: "buyer-support",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      form.email.includes("@") &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setStatus({
        type: "error",
        message: "Please complete all required fields before submitting.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      await apiPost("/contact", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        department: form.department,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setStatus({
        type: "success",
        message: "Thanks, your message has been submitted. Our team will respond shortly.",
      });
      setForm(initialState);
    } catch {
      setStatus({
        type: "error",
        message: "Submission failed. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Full Name
          <input
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Your full name"
            autoComplete="name"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Department
          <select
            value={form.department}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                department: event.target.value as ContactFormState["department"],
              }))
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="sales">Sales Team</option>
            <option value="buyer-support">Buyer Support</option>
            <option value="seller-operations">Seller Operations</option>
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Subject
          <input
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="How can we help?"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Message
        <textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          rows={6}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder="Share your request details..."
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Send Message"}
      </button>

      {status.message ? (
        <p
          className={`text-sm ${
            status.type === "error" ? "text-rose-700" : "text-emerald-700"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
