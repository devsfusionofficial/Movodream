import type { Metadata } from 'next'
import { DocHelpCard } from '@/components/legal/DocActions'
import { DocBreadcrumb, DocHighlights, DocSections, DocSidebar, DocTip, type DocSection } from '@/components/legal/DocShell'
import { DocToc } from '@/components/legal/DocToc'
import { ScaleIcon, ShieldCheckIcon, SparkIcon, UserIcon } from '@/components/legal/icons'

export const metadata: Metadata = {
  title: 'Terms of Use | Movodream',
  description: "Movodream's terms of use governing access to and use of movodream.com.",
  alternates: { canonical: '/terms' },
}

const HIGHLIGHTS = [
  { icon: <UserIcon />, title: 'User First', copy: 'Your experience matters most.' },
  { icon: <ScaleIcon />, title: 'Fair & Clear', copy: 'Simple terms, clear commitments.' },
  { icon: <ShieldCheckIcon />, title: 'Secure Platform', copy: 'Built with trust and security.' },
  { icon: <SparkIcon />, title: 'Always Improving', copy: 'We evolve to serve you better.' },
]

// Legal text ported verbatim from the live site's /terms page — already
// reviewed by the client, so it is restructured for layout but never
// reworded. Sections 7 and 8 were rendered as `.content-notice` callouts in
// the previous markup; they are plain prose here since the whole section now
// sits in its own card.
const SECTIONS: DocSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: (
      <p>
        These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the Movodream company website
        (movodream.com). By using this Website, you agree to be bound by these Terms. If you do not agree, do not use
        this Website.
      </p>
    ),
  },
  {
    id: 'purpose',
    title: 'Purpose',
    body: (
      <p>
        This Website provides information about Movodream, including our AI travel technology, product features,
        company vision, and contact options.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: (
      <>
        <p>
          All content on this Website including text, graphics, logos, images, software, and trademarks is owned by
          Movodream or our licensors and is protected under the Copyright Act, 1957 and the Trade Marks Act, 1999 of
          India.
        </p>
        <p>You may not copy, modify, reproduce, or distribute Website content without prior written permission.</p>
      </>
    ),
  },
  {
    id: 'permitted-use',
    title: 'Permitted Use',
    body: (
      <>
        <p>You may use this Website to:</p>
        <ul>
          <li>Learn about Movodream and our technology</li>
          <li>Request a product demonstration</li>
          <li>Contact us for business inquiries</li>
          <li>Subscribe to updates</li>
        </ul>
        <h3>You may not use this Website to:</h3>
        <ul>
          <li>Violate any laws or regulations of India</li>
          <li>Transmit harmful code or viruses</li>
          <li>Interfere with Website operations</li>
          <li>Harass or harm others</li>
        </ul>
      </>
    ),
  },
  {
    id: 'demo-requests',
    title: 'Demo Requests',
    body: (
      <>
        <p>Submitting a demo request is voluntary. By submitting a request, you agree that:</p>
        <ul>
          <li>The information you provide is accurate</li>
          <li>We may contact you using that information</li>
          <li>Submitting a request does not create a binding agreement</li>
        </ul>
        <p>We reserve the right to decline any demo request at our discretion.</p>
      </>
    ),
  },
  {
    id: 'product-information',
    title: 'Product Information',
    body: (
      <p>
        Our Website describes features of the Movodream platform. The product is currently in development. Features
        described are subject to change without notice.
      </p>
    ),
  },
  {
    id: 'no-warranties',
    title: 'No Warranties',
    body: (
      <p>
        The Website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
        express or implied, including but not limited to accuracy, reliability, or uninterrupted access.
      </p>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    body: (
      <p>
        To the maximum extent permitted under Indian law, Movodream shall not be liable for any direct, indirect,
        incidental, special, or consequential damages arising from your use of this Website.
      </p>
    ),
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    body: (
      <p>
        You agree to indemnify and hold Movodream harmless from any claims, damages, or expenses arising from your
        violation of these Terms or your unlawful use of this Website.
      </p>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    body: (
      <p>
        This Website may contain links to third-party websites. We are not responsible for their content or
        practices.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    body: (
      <>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India, including the Indian
          Contract Act, 1872 and the Information Technology Act, 2000.
        </p>
        <p>
          Any disputes arising from these Terms or your use of this Website shall be subject to the exclusive
          jurisdiction of the courts in Delhi, India.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: (
      <>
        <p>
          We may update these Terms at any time. The &ldquo;Last Updated&rdquo; date indicates when changes were
          made. Your continued use of the Website constitutes acceptance of the updated Terms.
        </p>
        <DocTip>
          We recommend reviewing these terms periodically to stay informed about your rights and responsibilities.
        </DocTip>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <p>
        <strong>Email:</strong> <a href="mailto:legal@movodream.com">legal@movodream.com</a>
        <br />
        <strong>Website:</strong> <a href="https://movodream.com">movodream.com</a>
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="doc-wrap">
        <div className="doc-topbar">
          <DocBreadcrumb trail={[{ label: 'Policies' }, { label: 'Terms of Service' }]} />
        </div>

        <div className="doc-layout">
          <DocSidebar>
            <DocToc entries={SECTIONS} />
            <DocHelpCard />
          </DocSidebar>

          <main className="doc-main">
            <p className="doc-eyebrow">Effective from 23 December 2025</p>
            <h1>
              Terms of <span className="doc-accent">Service</span>
            </h1>
            <p className="doc-lead">
              These Terms of Service govern your use of Movodream&apos;s platform, products, and services. By
              accessing or using our platform, you agree to these terms.
            </p>

            <DocHighlights items={HIGHLIGHTS} />
            <DocSections sections={SECTIONS} />
          </main>
        </div>
      </div>
    </div>
  )
}
