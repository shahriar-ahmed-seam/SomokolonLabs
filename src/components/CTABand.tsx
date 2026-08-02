import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function CTABand() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Have a problem worth solving with software?
            </h2>
            <p className="mt-3 max-w-lg text-white/60">
              Tell us what you&apos;re building. We&apos;ll help you scope it, build it, and ship it.
            </p>
          </div>
          {/* Label differs from the header CTA on purpose — the same words
              three times on one page reads like a template. */}
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Get in touch
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
