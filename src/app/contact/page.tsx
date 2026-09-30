import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { contact, products } from "@/lib/content";
import { LinkedinIcon } from "@/components/icons/BrandIcons";
import ContactForm from "@/components/ContactForm";
import CropMarks from "@/components/CropMarks";
import PageHero from "@/components/site/PageHero";
import { Eyebrow, FadeIn } from "@/components/site/motion";
import styles from "@/components/site/site.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Somokolon Labs to start a project.",
  alternates: { canonical: "/contact" },
};

const NEXT_STEPS = [
  { title: "We read it", body: "Every message reaches the team directly, not a ticket queue." },
  { title: "We reply", body: "Within a couple of business days, with questions or a time to talk." },
  { title: "We scope it", body: "A short call, then a written plan with milestones and a timeline." },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  // Only echo a product name we actually list, so the page can't be made to
  // display arbitrary text from a crafted link.
  const known = product ? products.find((p) => p.name === product)?.name : undefined;
  const defaultMessage = known ? `Hi Somokolon Labs, I'd like to request a demo of ${known}. ` : "";

  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    { icon: MapPin, label: "Studio", value: contact.location },
  ];

  return (
    <>
      <PageHero
        eyebrow={known ? "Request a demo" : "Contact"}
        title={known ? `See ${known}` : "Let's build something"}
        accent={known ? "in action." : "together."}
        scene="run"
        compact
        lead={
          known
            ? "Leave your details and we'll set up a walkthrough of the product, tailored to what you're working on."
            : "Tell us about your project and we'll get back to you. Every message reaches the team directly."
        }
      />

      <section className="bg-background-soft">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:py-28 lg:grid-cols-12">
          {/* Direct channels + what happens next */}
          <div className="lg:col-span-5">
            <FadeIn>
              <Eyebrow>Reach us directly</Eyebrow>
              <ul className="mt-8 space-y-3">
                {channels.map(({ icon: Glyph, label, value, href }) => {
                  const body = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-white">
                        <Glyph size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
                          {label}
                        </span>
                        <span className="mt-0.5 block truncate font-semibold text-ink">{value}</span>
                      </span>
                      {href && (
                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      )}
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="group relative flex items-center gap-4 border border-ink/10 bg-white p-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/20 hover:shadow-[0_20px_40px_-28px_rgba(11,21,36,0.45)]"
                        >
                          <CropMarks />
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 bg-white p-4 ring-1 ring-ink/10">
                          {body}
                        </div>
                      )}
                    </li>
                  );
                })}
                <li>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-4 border border-ink/10 bg-white p-4 transition-[border-color,box-shadow] duration-500 hover:border-ink/20 hover:shadow-[0_20px_40px_-28px_rgba(11,21,36,0.45)]"
                  >
                    <CropMarks />
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0a66c2] text-white">
                      <LinkedinIcon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
                        LinkedIn
                      </span>
                      <span className="mt-0.5 block font-semibold text-ink">Message us</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.1} className="mt-14">
              <h2 className={`${styles.display} text-xl font-semibold tracking-[-0.02em] text-ink`}>
                What happens next
              </h2>
              <ol className="mt-6 space-y-6">
                {NEXT_STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span
                      className={`${styles.display} flex h-8 w-8 shrink-0 items-center justify-center border border-ink/15 text-xs font-semibold text-ink`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>

          {/* Form */}
          <FadeIn delay={0.1} className="lg:col-span-7">
            <ContactForm defaultMessage={defaultMessage} />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
