"use client";

import { useMemo, useState } from "react";
import { emirates } from "@/data/mock/content";
import { apiPost, apiPostForm } from "@/lib/services/api";
import { formatAed } from "@/lib/utils";

const steps = ["Plate Details", "Media", "Pricing", "Preview"];

export function SellWizard() {
  const [step, setStep] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<{ loading: boolean; message: string }>({ loading: false, message: "" });
  const [form, setForm] = useState({
    number: "",
    emirate: "Dubai",
    code: "A",
    price: "",
    description: "",
    featuredTier: "standard",
  });

  const previewPrice = useMemo(() => {
    const value = Number(form.price);
    return Number.isNaN(value) || value <= 0 ? "AED -" : formatAed(value);
  }, [form.price]);

  const submitListing = async () => {
    const token = localStorage.getItem("plate_access_token") ?? "";

    if (!token) {
      setSubmitState({ loading: false, message: "Please login first from the Login / Register page." });
      return;
    }

    setSubmitState({ loading: true, message: "Submitting listing..." });

    try {
      if (uploadFile) {
        const fd = new FormData();
        fd.append("file", uploadFile);
        await apiPostForm("/listings/upload-placeholder", fd, token);
      }

      await apiPost(
        "/listings",
        {
          emirate: form.emirate,
          city: form.emirate,
          plateCode: form.code,
          plateNumber: form.number,
          priceAED: Number(form.price || 0),
          negotiable: true,
          sellerType: "owner",
          plateType: form.featuredTier === "vip" ? "vip" : form.featuredTier === "featured" ? "premium" : "standard",
          description: form.description,
        },
        token,
      );

      setSubmitState({ loading: false, message: "Listing submitted successfully." });
    } catch (error) {
      setSubmitState({ loading: false, message: error instanceof Error ? error.message : "Failed to submit listing." });
    }
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((label, index) => (
          <div key={label} className={`rounded-xl px-3 py-2 text-sm ${index <= step ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Plate Number
            <input value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700" placeholder="7777" />
          </label>
          <label className="text-sm">
            Plate Code
            <input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700" placeholder="A" />
          </label>
          <label className="text-sm sm:col-span-2">
            Emirate
            <select value={form.emirate} onChange={(event) => setForm({ ...form, emirate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700">
              {emirates.map((emirate) => (
                <option key={emirate}>{emirate}</option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <input type="file" accept="image/*" className="hidden" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} />
          <p className="font-medium text-slate-900 dark:text-slate-100">Upload Plate Images</p>
          <p className="mt-1 text-sm text-slate-500">Click to choose one or more clear photos of the plate.</p>
          <p className="mt-2 text-xs text-slate-500">{uploadFile ? `Selected: ${uploadFile.name}` : "Select an image to continue."}</p>
        </label>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <label className="block text-sm">
            Asking Price (AED)
            <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700" placeholder="250000" />
          </label>
          <label className="block text-sm">
            Description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700" placeholder="Share plate condition and transfer notes." />
          </label>
          <div>
            <p className="text-sm font-medium">Featured Listing Options</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                ["standard", "Standard"],
                ["featured", "Featured"],
                ["vip", "VIP Spotlight"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, featuredTier: value })}
                  className={`rounded-xl border px-3 py-2 text-sm ${form.featuredTier === value ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900" : "border-slate-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Preview</p>
          <h3 className="mt-2 font-serif text-3xl text-slate-900 dark:text-slate-100">
            {form.code || "Code"} {form.number || "Number"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{form.emirate}</p>
          <p className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">{previewPrice}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{form.description || "Add key details buyers should know before making an offer."}</p>
          <p className="mt-2 text-xs text-slate-500">Tier: {form.featuredTier.toUpperCase()}</p>
        </div>
      ) : null}

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep((prev) => Math.max(0, prev - 1))} className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
          Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={() => setStep((prev) => Math.min(3, prev + 1))} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            Continue
          </button>
        ) : (
          <button type="button" disabled={submitState.loading} onClick={submitListing} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900">
            {submitState.loading ? "Submitting..." : "Submit Listing"}
          </button>
        )}
      </div>

      {submitState.message ? <p className="text-sm text-slate-600 dark:text-slate-300">{submitState.message}</p> : null}
    </div>
  );
}
