/**
 * One-off migration: repoint seeded partner logos at their re-cropped,
 * cache-busted filenames (`<name>.webp` -> `<name>-v2.webp`).
 *
 * The client's originals for several partners were square canvases with the
 * wordmark in a thin band surrounded by dead margin, so the partners grid —
 * which sizes logos to the card width — rendered them a fraction of the size
 * of the others. The files were re-cropped to their ink bounds in place,
 * which meant the URLs had to change so cached copies of the old bitmaps get
 * evicted. Idempotent: rows already on `-v2` are left alone.
 */
import { connectDB } from '../src/lib/db'
import { Partner } from '../src/models/Partner'

async function main() {
  await connectDB()

  const partners = await Partner.find({ 'logo.url': { $regex: '^/assets/partners/' } })
  let updated = 0

  for (const partner of partners) {
    const url: string = partner.logo.url
    if (url.includes('-v2.webp')) {
      console.log(`${partner.name}: already current — skipping.`)
      continue
    }
    partner.logo.url = url.replace(/\.webp$/, '-v2.webp')
    await partner.save()
    updated++
    console.log(`${partner.name}: ${url} -> ${partner.logo.url}`)
  }

  console.log(`\nDone. ${updated} partner${updated === 1 ? '' : 's'} updated.`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
