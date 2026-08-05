import type { Metadata } from 'next'
import { DocHelpCard } from '@/components/legal/DocActions'
import { DocBreadcrumb, DocHighlights, DocSections, DocSidebar, type DocSection } from '@/components/legal/DocShell'
import { DocToc } from '@/components/legal/DocToc'
import { DatabaseIcon, EyeIcon, LockIcon, ShieldCheckIcon } from '@/components/legal/icons'

export const metadata: Metadata = {
  title: 'Privacy Policy | Movodream',
  description: "Movodream's privacy policy — how we collect, use, and protect your information.",
  alternates: { canonical: '/privacy-policy' },
}

const HIGHLIGHTS = [
  { icon: <LockIcon />, title: 'Data Protected', copy: 'Your information is stored securely.' },
  { icon: <EyeIcon />, title: 'Transparent Process', copy: 'We are clear about what we collect.' },
  { icon: <DatabaseIcon />, title: 'Never Sold', copy: 'We do not sell your personal data.' },
  { icon: <ShieldCheckIcon />, title: 'Your Rights', copy: 'Access, correct or delete your data.' },
]

// Legal text ported verbatim from the live site's /privacy-policy page —
// already reviewed by the client, so it is restructured for layout but never
// reworded. Rendered as a continuous document (not accordions) so every
// clause is visible without a click, in-page find works, and the page reads
// like a legal document rather than a feature showcase.
const SECTIONS: DocSection[] = [
  {
    id: 'scope',
    title: 'Scope',
    body: (
      <p>
        This Privacy Policy applies to information collected through the Movodream company website (movodream.com).
        By using this Website, you agree to the terms of this Privacy Policy.
      </p>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: (
      <>
        <h3>2.1 Information You Provide</h3>
        <p>When you interact with our Website, you may provide:</p>
        <ul>
          <li>Name and email address (when requesting a demo or subscribing to updates)</li>
          <li>Company name and phone number (for business inquiries)</li>
          <li>Message content (when contacting us)</li>
        </ul>
        <h3>2.2 Information Collected Automatically</h3>
        <p>When you browse our Website, we automatically collect:</p>
        <ul>
          <li>Usage data: pages visited, time spent, links clicked</li>
          <li>Device information: IP address, browser type, operating system</li>
          <li>Referral source: how you arrived at our Website</li>
        </ul>
        <h3>2.3 Cookies</h3>
        <p>
          We use cookies to remember preferences, analyze traffic, and improve user experience. You may disable
          cookies through your browser settings.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to inquiries and demo requests</li>
          <li>Send updates about Movodream (with your consent)</li>
          <li>Analyze and improve our Website</li>
          <li>Monitor for security issues</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing Your Information',
    body: (
      <>
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul>
          <li>Service providers (analytics, email hosting, website hosting)</li>
          <li>Legal authorities (when required by law)</li>
        </ul>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention',
    body: (
      <>
        <p>
          We retain website visitor information in accordance with the Information Technology (Reasonable Security
          Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Generally:
        </p>
        <ul>
          <li>Contact form submissions: 12 months after last communication</li>
          <li>Analytics data: 26 months</li>
          <li>Newsletter subscribers: until you unsubscribe</li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <>
        <p>Under Indian law, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (subject to legal obligations)</li>
          <li>Withdraw consent for marketing communications</li>
        </ul>
        <p>
          To exercise these rights, contact us at: <a href="mailto:privacy@movodream.com">privacy@movodream.com</a>
        </p>
      </>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    body: (
      <p>
        Our Website may contain links to third-party websites. We are not responsible for their privacy practices.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We implement reasonable security practices as required under the Information Technology Act, 2000 and its
        corresponding rules.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    body: (
      <p>
        We may update this policy from time to time. The &ldquo;Last Updated&rdquo; date indicates when changes were
        made. Your continued use of the Website constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: 'grievance-officer',
    title: 'Grievance Officer',
    body: (
      <>
        <p>
          In compliance with the Information Technology Act, 2000 and the Information Technology (Intermediaries
          Guidelines) Rules, 2011, we have appointed a Grievance Officer:
        </p>
        <p>
          <strong>Name:</strong> Arjun Bali
          <br />
          <strong>Email:</strong> <a href="mailto:grievance@movodream.com">grievance@movodream.com</a>
          <br />
          <strong>Response Time:</strong> Within 30 days of receipt of complaint
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@movodream.com">privacy@movodream.com</a>
        <br />
        <strong>Website:</strong> <a href="https://movodream.com">movodream.com</a>
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <div className="doc-wrap">
        <div className="doc-topbar">
          <DocBreadcrumb trail={[{ label: 'Policies' }, { label: 'Privacy Policy' }]} />
        </div>

        <div className="doc-layout">
          <DocSidebar>
            <DocToc entries={SECTIONS} />
            <DocHelpCard />
          </DocSidebar>

          <main className="doc-main">
            <p className="doc-eyebrow">Effective from 20 December 2025</p>
            <h1>
              Privacy <span className="doc-accent">Policy</span>
            </h1>
            <p className="doc-lead">
              Your privacy matters to us. This policy explains what information we collect through movodream.com, how
              we use it, and the rights you have over it.
            </p>

            <DocHighlights items={HIGHLIGHTS} />
            <DocSections sections={SECTIONS} />
          </main>
        </div>
      </div>
    </div>
  )
}
