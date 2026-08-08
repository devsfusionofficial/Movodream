import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Globe2, ShieldCheck, Sparkles } from 'lucide-react'
import { LoginForm } from './login-form'

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-[#15121a] lg:grid lg:grid-cols-[minmax(420px,0.92fr)_minmax(520px,1.08fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#1b0d27] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Image src="/assets/images/taj-portrait.jpg" alt="A travel destination at golden hour" fill priority className="object-cover object-center opacity-40" sizes="50vw" />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(20,7,31,0.96)_4%,rgba(34,12,48,0.65)_48%,rgba(215,23,137,0.22)_100%)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur-md"><Sparkles className="h-5 w-5 text-[#ff7294]" /></div>
          <div><p className="text-lg font-semibold tracking-[-0.03em]">movodream</p><p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/55">admin workspace</p></div>
        </div>
        <div className="relative z-10 max-w-xl pb-6">
          <p className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-[#ff9ab2]"><span className="h-px w-8 bg-[#ff7294]" />Your world, in motion</p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.04] tracking-[-0.065em] xl:text-6xl">Shape the journeys people remember.</h1>
          <p className="mt-7 max-w-md text-[15px] leading-7 text-white/65">A calm, powerful space to curate content, guide travellers, and keep every detail of the Movodream experience moving forward.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-xs text-white/75 backdrop-blur-sm"><ShieldCheck className="h-4 w-4 text-[#ff9ab2]" />Secure workspace</div>
            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-xs text-white/75 backdrop-blur-sm"><Globe2 className="h-4 w-4 text-[#ff9ab2]" />Built for everywhere</div>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/12 pt-5 text-xs text-white/45"><span>© {new Date().getFullYear()} Movodream</span><Link href="/" className="flex items-center gap-1.5 transition hover:text-white">Explore the experience <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <Link href="/" className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#e8e1ea] bg-white px-3.5 py-2 text-xs font-semibold text-[#756b7b] shadow-sm transition hover:border-[#d71789] hover:text-[#b40d6d] sm:right-10 sm:top-8"><ArrowLeft className="h-3.5 w-3.5" />Back to website</Link>
        <div className="w-full max-w-[440px]">
          <div className="mb-12 flex items-center gap-3 lg:hidden"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#241235] text-[#ff7294]"><Sparkles className="h-5 w-5" /></div><div><p className="font-semibold tracking-[-0.03em]">movodream</p><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40">admin workspace</p></div></div>
          <div className="mb-10"><div className="mb-6 inline-flex items-center rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b40d6d]"><span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#d71789]" />Private access</div><h2 className="text-4xl font-semibold tracking-[-0.065em] text-[#1d1523] sm:text-[46px] sm:leading-[1.05]">Welcome back.</h2><p className="mt-4 max-w-sm text-[15px] leading-6 text-[#716b75]">Sign in to your workspace and keep the journey going.</p></div>
          <LoginForm />
          <p className="mt-10 text-center text-xs leading-5 text-[#918b94]">This is a private workspace for the Movodream team.<br />Need help? Contact your workspace administrator.</p>
        </div>
      </section>
    </main>
  )
}
