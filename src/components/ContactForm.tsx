"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { contact } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function ContactForm({
  defaultMessage = "",
}: {
  defaultMessage?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const errorId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const value = (field: string) =>
      (form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement)
        .value;

    const data = {
      name: value("name"),
      email: value("email"),
      company: value("company"),
      message: value("message"),
      // Honeypot — left empty by humans, filled by bots.
      website: value("website"),
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
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background-soft p-12 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">Message received</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Thanks for reaching out. We&apos;ll get back to you within a couple of
          business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            className={inputClass}
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
            maxLength={200}
            autoComplete="email"
            className={inputClass}
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
            maxLength={160}
            autoComplete="organization"
            className={inputClass}
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
            maxLength={5000}
            defaultValue={defaultMessage}
            aria-describedby={status === "error" ? errorId : undefined}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your project, timeline, and goals."
          />
        </div>
      </div>

      {/*
        Honeypot. Hidden from sight and from assistive tech, and excluded from
        the tab order, so no real user can reach it — but bots that fill every
        field will trip it.
      */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* aria-live so the failure is announced, not just displayed. */}
      <div id={errorId} role="alert" aria-live="polite">
        {status === "error" && (
          <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
            <p className="text-sm text-accent">{error}</p>
            {/* Clickable escape hatch — a dead-end error message is no use. */}
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a
                href={`mailto:${contact.email}`}
                className="font-semibold text-ink underline decoration-ink/20 underline-offset-2 hover:text-accent"
              >
                {contact.email}
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink underline decoration-ink/20 underline-offset-2 hover:text-accent"
              >
                Message us on LinkedIn
              </a>
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
        {status !== "submitting" && <ArrowRight size={16} aria-hidden="true" />}
      </button>
    </form>
  );
}
