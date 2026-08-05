import type { Metadata } from 'next'
import { DocHelpCard } from '@/components/legal/DocActions'
import { DocBreadcrumb, DocHighlights, DocSections, DocSidebar, DocTip, type DocSection } from '@/components/legal/DocShell'
import { DocToc } from '@/components/legal/DocToc'
import { ClockIcon, LockIcon, RefundIcon, ShieldCheckIcon } from '@/components/legal/icons'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Movodream',
  description: "Movodream's cancellation and refund policy for travel planning, consultation, and booking services.",
  alternates: { canonical: '/cancellation-policy' },
}

const HIGHLIGHTS = [
  { icon: <ShieldCheckIcon />, title: 'Transparent Process', copy: 'Clear terms with no hidden conditions.' },
  { icon: <ClockIcon />, title: 'Timely Support', copy: 'Our team is here to help at every step.' },
  { icon: <RefundIcon />, title: 'Fair Refunds', copy: 'Refunds are processed quickly and securely.' },
  { icon: <LockIcon />, title: 'Secure & Trusted', copy: 'Your payments and data stay protected.' },
]

// Legal text below is ported verbatim from the client's "Updated Cancellation
// policy for movodream.docx" — client-approved, not a draft, so it is
// restructured for layout but never reworded. Rendered as a continuous
// document rather than accordions so every clause is visible without a click
// and in-page find reaches all of it.
const SECTIONS: DocSection[] = [
  {
    id: 'planning-consultation',
    title: 'Travel Planning & Consultation Services',
    body: (
      <>
        <p>
          Movodream provides customized travel planning services, including but not limited to itinerary creation,
          destination recommendations, trip consultations, travel research, budgeting assistance, and related
          planning support.
        </p>
        <p>
          As these services involve dedicated effort, research, and customization by our travel experts, refund
          eligibility depends on the stage of service delivery.
        </p>
        <h3>Before Service Commencement</h3>
        <p>
          A customer may be eligible for a refund if a cancellation request is submitted before any planning work,
          consultation, itinerary preparation, research, or related service activity has commenced.
        </p>
        <h3>After Service Commencement</h3>
        <p>
          Once planning activities have begun, including consultations, destination research, itinerary drafting,
          recommendations, or any customization work, the service shall be considered partially or fully utilized.
          In such cases, refunds may not be available.
        </p>
        <h3>After Delivery of Planning Services</h3>
        <p>
          No refund shall be provided once any itinerary, travel plan, recommendations, consultation output, or
          related deliverables have been shared with the customer.
        </p>
      </>
    ),
  },
  {
    id: 'customer-cancellation',
    title: 'Customer-Initiated Cancellation',
    body: (
      <p>
        Customers may choose to discontinue or cancel their travel plans at any stage. However, cancellation of a
        trip or decision not to travel does not automatically qualify for a refund of planning or consultation fees
        already utilized in providing services.
      </p>
    ),
  },
  {
    id: 'third-party',
    title: 'Travel Bookings and Third-Party Services',
    body: (
      <>
        <p>
          Movodream may facilitate bookings for flights, hotels, buses, trains, cabs, sightseeing activities,
          experiences, attractions or other travel-related services offered by third-party providers.
        </p>
        <p>
          Cancellation, modification, refund eligibility, processing timelines, and applicable charges for such
          bookings shall be governed by the respective service provider&apos;s terms and conditions. Movodream does
          not control or guarantee the refund policies of airlines, hotels, transport operators, activity providers,
          or other third parties.
        </p>
        <p>
          Any refund received from a third-party supplier shall be subject to their approval and processing
          timelines.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Changes and Modification Requests',
    body: (
      <>
        <p>
          Customers may request modifications to their travel plans, itineraries, or bookings. Movodream will make
          reasonable efforts to accommodate such requests; however:
        </p>
        <ul>
          <li>Changes may be subject to availability</li>
          <li>Additional charges may apply</li>
          <li>Certain bookings may be non-changeable or may attract amendment fees imposed by service providers</li>
          <li>Significant modifications may require the creation of a new itinerary or service request</li>
        </ul>
      </>
    ),
  },
  {
    id: 'no-show',
    title: 'No-Show Policy',
    body: (
      <>
        <p>
          If a customer fails to attend a scheduled consultation, misses a confirmed booking, or does not utilize a
          service without prior notice, refunds may not be available.
        </p>
        <p>
          No-show charges imposed by airlines, hotels, transport operators, activity providers, or other suppliers
          shall be borne by the customer.
        </p>
      </>
    ),
  },
  {
    id: 'force-majeure',
    title: 'Supplier Cancellations and Force Majeure Events',
    body: (
      <>
        <p>
          Movodream shall not be held responsible for cancellations, disruptions, delays, or service failures caused
          by third-party suppliers or circumstances beyond reasonable control, including but not limited to:
        </p>
        <ul>
          <li>Natural disasters</li>
          <li>Extreme weather conditions</li>
          <li>Government restrictions</li>
          <li>Public health emergencies</li>
          <li>Civil unrest</li>
          <li>Strikes</li>
          <li>Transportation disruptions</li>
          <li>Technical failures of service providers</li>
        </ul>
        <p>Any refunds in such cases shall be subject to the policies of the respective supplier.</p>
      </>
    ),
  },
  {
    id: 'duplicate-payments',
    title: 'Duplicate Payments and Technical Errors',
    body: (
      <p>
        In the event of a duplicate transaction, payment processing error, or accidental overcharge, customers should
        contact Movodream support promptly. Verified duplicate or erroneous payments will be reviewed and refunded
        through the original payment method wherever applicable.
      </p>
    ),
  },
  {
    id: 'service-non-availability',
    title: 'Service Non-Availability',
    body: (
      <p>
        If Movodream is unable to provide a purchased service due to operational limitations and the service has not
        yet commenced, the customer may be eligible for a full or partial refund, depending on the circumstances.
      </p>
    ),
  },
  {
    id: 'refund-processing',
    title: 'Refund Processing',
    body: (
      <>
        <p>Where a refund is approved:</p>
        <ul>
          <li>Refunds shall be processed through the original mode of payment wherever feasible</li>
          <li>
            Processing timelines may vary depending on banks, payment gateways, financial institutions, and service
            providers
          </li>
          <li>Actual credit timelines are subject to the policies of the respective payment provider</li>
        </ul>
      </>
    ),
  },
  {
    id: 'fraudulent-claims',
    title: 'Fraudulent or Abusive Claims',
    body: (
      <>
        <p>Movodream reserves the right to decline refund requests where there is evidence of:</p>
        <ul>
          <li>Fraudulent activity</li>
          <li>Misrepresentation of facts</li>
          <li>Abuse of services</li>
          <li>Attempts to obtain planning deliverables or travel benefits and subsequently seek unjustified refunds</li>
          <li>Violation of Movodream&apos;s Terms &amp; Conditions</li>
        </ul>
      </>
    ),
  },
  {
    id: 'grievance',
    title: 'Grievance Redressal',
    body: (
      <>
        <p>
          Movodream is committed to maintaining high standards of customer service and addressing customer concerns
          in a fair and transparent manner.
        </p>
        <p>
          Customers may submit complaints, disputes, feedback, or grievances related to any service offered through
          the platform. Upon receipt of a grievance, Movodream shall review the matter and make reasonable efforts to
          investigate and resolve the issue appropriately.
        </p>
        <p>
          Customers are encouraged to provide complete details, including booking references, communication records,
          and any supporting information that may assist in the review process. Movodream reserves the right to
          request additional information where necessary for the investigation and resolution of a grievance.
        </p>
      </>
    ),
  },
  {
    id: 'customer-support',
    title: 'Customer Support',
    body: (
      <>
        <p>
          For assistance related to travel planning services, itinerary requests, bookings, modifications,
          cancellations, refunds, payment-related concerns, or general inquiries, customers may contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:support@movodream.com">support@movodream.com</a>
        </p>
        <p>
          Movodream will make reasonable efforts to respond to customer queries and support requests in a timely
          manner.
        </p>
      </>
    ),
  },
]

export default function CancellationPolicyPage() {
  return (
    <div className="legal-page">
      <div className="doc-wrap">
        <div className="doc-topbar">
          <DocBreadcrumb trail={[{ label: 'Policies' }, { label: 'Cancellation & Refund Policy' }]} />
        </div>

        <div className="doc-layout">
          <DocSidebar>
            <DocToc entries={SECTIONS} />
            <DocHelpCard />
          </DocSidebar>

          <main className="doc-main">
            <p className="doc-eyebrow">Effective from 23 December 2025</p>
            <h1>
              Cancellation &amp; <span className="doc-accent">Refund Policy</span>
            </h1>
            <p className="doc-lead">
              We believe in transparency and flexibility. This policy outlines the conditions under which
              cancellations and refunds are applicable for bookings and services made on Movodream.
            </p>

            <DocHighlights items={HIGHLIGHTS} />

            <div className="doc-section doc-prose">
              <p>
                At Movodream, we strive to provide personalized travel planning and related travel services designed
                around each customer&apos;s unique preferences and requirements. By purchasing any planning service,
                consultation, itinerary creation service, or travel-related offering through Movodream, you agree to
                the terms set forth below.
              </p>
            </div>

            <DocSections sections={SECTIONS} />

            <DocTip title="Service-specific terms take precedence">
              Each travel service, booking, itinerary, or promotional offering may be subject to specific
              cancellation and refund conditions communicated at the time of purchase. In the event of any conflict,
              the service-specific terms shall prevail over this general policy.
            </DocTip>
          </main>
        </div>
      </div>
    </div>
  )
}
