// Kept separate from models/Application.ts on purpose: that model file has
// server-only side effects (nodemailer, R2) in its post-save hook, and any
// client component importing from it — even just for this constant — would
// drag those into the browser bundle.
export const APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
