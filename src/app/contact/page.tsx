import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { contact } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { LinkedinIcon } from "@/components/icons/BrandIcons";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Somokolon Labs to start a project.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const defaultMessage = product
    ? `Hi Somokolon Labs, I'd like to request a demo of ${product}. `
    : "";

  return (
    <>
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Contact us</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {product ? `Request a demo of ${product}` : "Let's build something together"}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {product
                ? "Fill in your details below and we'll set up a walkthrough of the product."
                : "Tell us about your project and we'll get back to you. Every message reaches the team directly."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Contact details */}
          <Reveal className="lg:col-span-2">
            <h2 className="text-xl font-bold text-ink">Get in touch</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Prefer to reach out directly? Use any of the channels below.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm text-ink-soft">Email</p>
                  <a href={`mailto:${contact.email}`} className="font-semibold text-ink hover:text-accent">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm text-ink-soft">Phone</p>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="font-semibold text-ink hover:text-accent">
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm text-ink-soft">Location</p>
                  <p className="font-semibold text-ink">{contact.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Connect</p>
              <div className="mt-4 flex gap-3">
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-3" delay={0.1}>
            <ContactForm defaultMessage={defaultMessage} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
