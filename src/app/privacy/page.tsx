import type { Metadata } from "next";
import { company, contact } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data the Somokolon Labs website collects, why, how long it is kept, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="2026-09-30"
      intro={`This policy covers ${company.name}'s website at somokolonlabs.com. It is written to be read, not to cover us — if something here is unclear, email us and we will explain it.`}
    >
      <h2>What we collect</h2>
      <p>Three things, and nothing else:</p>
      <ul>
        <li>
          <strong>Contact form submissions.</strong> When you use the contact or
          demo-request form we receive the name, email address, optional company
          name, and message you type. We use these only to reply to you.
        </li>
        <li>
          <strong>Chat messages.</strong> When you use the assistant (the chat
          button in the corner), the messages you type are sent to our AI
          provider so it can write a reply. We do not keep a transcript on our
          servers. The conversation is saved only in your own browser tab, and
          is cleared when you close the tab or press &ldquo;Start over&rdquo;.
          To stop abuse, we count how many messages each visitor sends using a
          one-way hash of their IP address, never the address itself; those
          counters expire within a day.
        </li>
        <li>
          <strong>Aggregate usage analytics.</strong> We record page views and
          basic performance measurements to understand which pages are useful.
          This is aggregated and does not identify you, and we do not set
          advertising or tracking cookies.
        </li>
      </ul>
      <p>
        We do not run accounts, we do not sell or share data with advertisers,
        and we do not build profiles of visitors.
      </p>

      <h2>Processors we rely on</h2>
      <p>
        Running a website means some third parties necessarily see traffic to it:
      </p>
      <ul>
        <li>
          Our hosting provider serves the site and keeps short-lived server logs
          that include IP addresses, as any web server does.
        </li>
        <li>
          Our email provider delivers contact-form submissions to our inbox.
        </li>
        <li>
          Our AI provider,{" "}
          <a href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html" rel="noreferrer" target="_blank">
            DeepSeek
          </a>
          , receives chat messages to generate replies. DeepSeek states that it
          processes and stores data in the People&apos;s Republic of China, and
          it handles messages under its own privacy policy. Please don&apos;t put
          personal or confidential information into the chat; use the contact
          form or email for that.
        </li>
        <li>
          A database provider stores the short-lived, hashed message counters
          described above.
        </li>
      </ul>
      <p>
        Each is used only for that purpose. No submission data is passed to
        anyone else.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiries stay in our email for as long as the conversation is
        commercially relevant, and are deleted on request. We keep no chat
        transcripts, and the message counters expire within a day. Analytics
        are aggregated and retained without any identifier tied to you.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us what we hold about you, ask for a correction, or ask us to
        delete it. Email{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a> and we will
        action it. You do not need to give a reason.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS. Form submissions are transmitted
        encrypted. To report a security issue, please see our{" "}
        <a href={`mailto:${company.securityEmail}`}>{company.securityEmail}</a>.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, we will update the date at the top of
        this page.
      </p>

      <h2>Contact</h2>
      <p>
        {company.name}, {contact.location}. Email{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </LegalPage>
  );
}
