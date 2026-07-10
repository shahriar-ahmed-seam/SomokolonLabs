"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background-soft p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Thanks for reaching out. We&apos;ll get back to you within a couple of business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Your name"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="you@company.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="company" className="text-sm font-medium text-ink">
            Company <span className="text-ink-soft">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            className="mt-2 w-full rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Your company"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-ink">
            What are you building? <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            defaultValue={defaultMessage}
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Tell us about your project, timeline, and goals."
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-accent">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
        {status !== "submitting" && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
