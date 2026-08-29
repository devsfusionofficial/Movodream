/**
 * Seeds the database with the minimum data needed to start development:
 * the first admin account (created through Better Auth's own API so the
 * password hash is generated correctly, not a raw DB insert) plus, in later
 * phases, fixed categories/offices. Run with `npm run seed`.
 */
import { getAuth } from '../src/lib/auth'
import { connectDB } from '../src/lib/db'
import { Office } from '../src/models/Office'
import { Category } from '../src/models/Category'
import { Author } from '../src/models/Author'
import { Post } from '../src/models/Post'
import { Job } from '../src/models/Job'
import { Partner } from '../src/models/Partner'
import { slugify } from '../src/lib/utils'

// Node 20.12+/22 built-in — avoids adding a dotenv dependency for one script.
try {
  process.loadEnvFile('.env')
} catch {
  // .env not present (e.g. CI providing real env vars directly) — fine.
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.log('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin seed.')
    return
  }

  const auth = await getAuth()

  try {
    await auth.api.createUser({
      body: { email, password, name: 'Admin', role: 'admin' },
    })
    console.log(`Created admin user: ${email}`)
  } catch (err) {
    const code = (err as { body?: { code?: string } })?.body?.code
    if (code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
      console.log(`Admin user ${email} already exists — skipping.`)
      return
    }
    throw err
  }
}

async function seedOffices() {
  const offices = [
    { city: 'Delhi', slug: 'delhi', order: 1 },
    { city: 'Mumbai', slug: 'mumbai', order: 2 },
    { city: 'Amritsar', slug: 'amritsar', order: 3 },
    { city: 'Bengaluru', slug: 'bengaluru', order: 4 },
    { city: 'Dubai', slug: 'dubai', order: 5 },
    { city: 'Australia', slug: 'australia', order: 6 },
  ]

  for (const office of offices) {
    const existing = await Office.findOne({ slug: office.slug })
    if (existing) {
      console.log(`Office "${office.city}" already exists — skipping.`)
      continue
    }
    await Office.create({ ...office, status: 'live' })
    console.log(`Created office: ${office.city}`)
  }
}

const FIXED_CATEGORIES = [
  'Travel Technology',
  'Artificial Intelligence',
  'Future of Travel',
  'Tourism Trends',
  'Digital Transformation',
  'Industry Insights',
  'Company Updates',
]

async function seedCategories() {
  for (const name of FIXED_CATEGORIES) {
    const slug = slugify(name)
    const existing = await Category.findOne({ slug })
    if (existing) continue
    await Category.create({ name, slug })
    console.log(`Created category: ${name}`)
  }
}

async function seedBlogSamples() {
  let author = await Author.findOne({ name: 'Movodream Team' })
  if (!author) {
    author = await Author.create({
      name: 'Movodream Team',
      email: 'editorial@movodream.com',
      bio: 'Insights from the team building Movodream.',
    })
    console.log('Created author: Movodream Team')
  } else if (!author.email) {
    author.email = 'editorial@movodream.com'
    await author.save()
  }

  const aiCategory = await Category.findOne({ slug: slugify('Artificial Intelligence') })
  const futureCategory = await Category.findOne({ slug: slugify('Future of Travel') })

  const samples = [
    {
      title: 'How AI Is Rewriting the First Day of Trip Planning',
      excerpt:
        'From scattered tabs to a single conversation — what changes when an AI concierge handles the first draft of your itinerary.',
      contentHtml:
        '<p>Trip planning used to mean thirty browser tabs and a spreadsheet. Movodream starts from a conversation instead: tell it what kind of trip you want, and it drafts a real itinerary in minutes.</p><h2>Why this matters</h2><p>The first draft is the hardest part. AI removes the blank-page problem and leaves the fun part — refining — to you.</p>',
      categories: aiCategory ? [aiCategory._id] : [],
    },
    {
      title: 'The Future of Travel Is Contextual, Not Just Personalized',
      excerpt: 'Personalization tells you what you like. Contextual intelligence tells you what to do right now.',
      contentHtml:
        '<p>Personalization is old news — every app claims it. The next shift is contextual intelligence: guidance that adapts in real time to where you are, what time it is, and what just changed.</p><h2>From static to live</h2><p>That is the gap Movodream is built to close: not just a plan, but a plan that keeps up with you.</p>',
      categories: futureCategory ? [futureCategory._id] : [],
    },
  ]

  for (const sample of samples) {
    const existing = await Post.findOne({ title: sample.title })
    if (existing) {
      console.log(`Post "${sample.title}" already exists — skipping.`)
      continue
    }
    const post = new Post({
      title: sample.title,
      excerpt: sample.excerpt,
      contentHtml: sample.contentHtml,
      author: author._id,
      categories: sample.categories,
      status: 'published',
    })
    await post.save()
    console.log(`Created post: ${sample.title}`)
  }
}

async function seedJobSamples() {
  const samples = [
    {
      title: 'Frontend Engineer (Next.js)',
      department: 'Engineering',
      location: 'Delhi',
      employmentType: 'Full-time' as const,
      experience: '2-4 years',
      qualification: "Bachelor's in Computer Science or equivalent experience",
      skills: ['React', 'Next.js', 'TypeScript'],
      descriptionHtml:
        '<p>We are looking for a Frontend Engineer to help build the next generation of Movodream’s AI travel platform.</p>',
      responsibilitiesHtml:
        '<ul><li>Build and maintain user-facing features in Next.js</li><li>Collaborate with design and backend teams</li><li>Write clean, tested, maintainable code</li></ul>',
    },
  ]

  for (const sample of samples) {
    const existing = await Job.findOne({ title: sample.title })
    if (existing) {
      console.log(`Job "${sample.title}" already exists — skipping.`)
      continue
    }
    const job = new Job({ ...sample, status: 'published' })
    await job.save()
    console.log(`Created job: ${sample.title}`)
  }
}

// Logo files came directly from the client (client-docs/Partner Logos) —
// converted to webp and placed in public/assets/partners. No partner
// website URLs or categories were provided, so those fields are left unset
// rather than guessed.
//
// The `-v2` suffix is a cache buster. Several of the client's originals were
// square canvases with the wordmark in a thin band and large dead margins,
// which made them render far smaller than the rest of the row once the logo
// grid sized logos by width. They were re-cropped to their ink bounds; the
// filenames had to change so browsers and CDNs holding the old bitmaps at
// the previous URLs pick up the new ones. Bump the suffix again if these
// files are ever re-cropped.
const PARTNERS = [
  { name: 'AviationStack', logoFile: 'aviationstack-v2.webp' },
  { name: 'CleverTap', logoFile: 'clevertap-v2.webp' },
  { name: 'Embark', logoFile: 'embark-v2.webp' },
  { name: 'Equence', logoFile: 'equence-v2.webp' },
  { name: 'Gozo Cabs', logoFile: 'gozo-v2.webp' },
  { name: 'NetworkTechLab', logoFile: 'networktechlab-v2.webp' },
  { name: 'Novus Loyalty', logoFile: 'novus-v2.webp' },
  { name: 'Razorpay', logoFile: 'razorpay-v2.webp' },
  { name: 'Lepton', logoFile: 'lepton-v2.webp' },
]

async function seedPartners() {
  for (const [index, partner] of PARTNERS.entries()) {
    const existing = await Partner.findOne({ name: partner.name })
    if (existing) {
      console.log(`Partner "${partner.name}" already exists — skipping.`)
      continue
    }
    await Partner.create({
      name: partner.name,
      logo: { url: `/assets/partners/${partner.logoFile}` },
      order: index + 1,
    })
    console.log(`Created partner: ${partner.name}`)
  }
}

async function main() {
  await connectDB()
  await seedAdminUser()
  await seedOffices()
  await seedCategories()
  await seedBlogSamples()
  await seedJobSamples()
  await seedPartners()
  console.log('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
