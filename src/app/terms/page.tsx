import type { Metadata } from "next";
import { company, contact } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms that apply to using the Somokolon Labs website, including content ownership and the limits of what this site represents.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="2026-07-31"
      intro={`These terms apply to your use of somokolonlabs.com. They cover the website only — client work is governed by a separate signed agreement.`}
    >
      <h2>Using this site</h2>
      <p>
        You are welcome to read, link to, and share anything published here. You
        may not attempt to disrupt the site, probe it for vulnerabilities without
        permission, or use automated tools in a way that degrades it for others.
        If you want to test our security, contact us first and we will talk.
      </p>

      <h2>Content and accuracy</h2>
      <p>
        Product descriptions, technical notes, and stated results reflect our
        work at the time of writing. Products marked <em>In development</em> or{" "}
        <em>Prototype</em> are exactly that — they are not commitments to ship,
        and their behaviour may change. Nothing on this site is an offer, a
        warranty, or professional advice.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The {company.name} name, logo, written content, and site design belong to
        us. Source code we publish is licensed in its own repository — the
        licence file there governs, not this page. Third-party names and marks
        belong to their respective owners and appear here only to describe the
        technologies we work with.
      </p>

      <h2>Enquiries</h2>
      <p>
        Submitting the contact form starts a conversation; it does not create a
        contract or any obligation on either side. Scope, price, timeline, and
        ownership are agreed in writing before work begins.
      </p>

      <h2>External links</h2>
      <p>
        We link to third-party sites such as GitHub and LinkedIn. We do not
        control them and are not responsible for their content or their privacy
        practices.
      </p>

      <h2>Liability</h2>
      <p>
        This site is provided as-is. To the extent permitted by law, we are not
        liable for loss arising from reliance on its content or from any
        interruption in its availability.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Bangladesh.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: {company.name}, {contact.location} — email{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </LegalPage>
  );
}
