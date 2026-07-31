import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, GitFork, Scale, Container } from "lucide-react";
import { company, contact, openSourceRepos } from "@/lib/content";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Reveal } from "@/components/Reveal";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Open source",
  description:
    "Somokolon Labs builds in the open on GitHub. Browse the organization, the repositories behind our products, and how we run CI and releases.",
  alternates: { canonical: "/open-source" },
};

const practices = [
  {
    icon: GitFork,
    title: "CI on every push",
    description:
      "Typecheck, lint, and build run on every push and pull request through GitHub Actions. Main stays deployable.",
  },
  {
    icon: Container,
    title: "Containerized services",
    description:
      "Backend services ship with Dockerfiles and run as non-root in production images, so local and deployed behaviour match.",
  },
  {
    icon: Scale,
    title: "Licensed and documented",
    description:
      "Public repositories carry a licence, a README with setup steps, and an architecture note explaining how the pieces fit.",
  },
];

export default function OpenSourcePage() {
  return (
    <>
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Open source</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              We build in the open
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Our work lives under the{" "}
              <span className="font-semibold text-ink">{company.githubOrg}</span>{" "}
              organization on GitHub. Read the code, open an issue, or fork
              anything that&apos;s useful to you.
            </p>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
            >
              <GithubIcon size={18} />
              View the GitHub organization
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Repositories */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Repositories
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Some projects are still private while we clean up the history and
            documentation. Those are marked — nothing here links somewhere that
            404s.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {openSourceRepos.map((repo, i) => (
            <Reveal key={repo.name} delay={i * 0.04}>
              <li className="flex h-full flex-col rounded-2xl border border-border bg-white p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-ink">
                    <GithubIcon size={18} />
                    <span className="font-mono text-sm font-semibold">
                      {repo.name}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      repo.isPublic
                        ? "bg-accent/10 text-accent"
                        : "bg-background-soft text-ink-soft"
                    }`}
                  >
                    {repo.isPublic ? "Public" : "Coming soon"}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                  {repo.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <span className="text-xs font-medium text-ink-soft">
                    {repo.language}
                  </span>
                  {repo.isPublic ? (
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                    >
                      Open repository
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="text-sm text-ink-soft">Not yet public</span>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Engineering practices */}
      <section className="border-y border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">How we ship</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              The same pipeline behind every repository
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {practices.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <item.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link
              href="/products"
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              See what we&apos;ve built with it <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
