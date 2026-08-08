'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { loginSchema, type LoginInput } from '@/lib/validation/auth'

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginInput) {
    setServerError(null)
    const { error } = await authClient.signIn.email({ email: values.email, password: values.password })
    if (error) {
      setServerError(error.message ?? 'Invalid email or password')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2.5 block text-[13px] font-semibold text-[#342d38]">Work email</label>
        <div className="group relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#aaa4ad] transition-colors group-focus-within:text-[#d71789]" /><input id="email" type="email" autoComplete="email" placeholder="you@movodream.com" {...register('email')} className="h-[54px] w-full rounded-xl border border-[#e6e2e7] bg-white pl-12 pr-4 text-sm text-[#251c2b] shadow-[0_2px_5px_rgba(30,20,35,0.02)] outline-none transition placeholder:text-[#b5b0b8] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" /></div>
        {errors.email && <p className="mt-2 text-xs font-medium text-[#c62850]">{errors.email.message}</p>}
      </div>
      <div>
        <div className="mb-2.5 flex items-center justify-between"><label htmlFor="password" className="text-[13px] font-semibold text-[#342d38]">Password</label><span className="text-[11px] font-medium text-[#aaa4ad]">Keep it private</span></div>
        <div className="group relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#aaa4ad] transition-colors group-focus-within:text-[#d71789]" /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" {...register('password')} className="h-[54px] w-full rounded-xl border border-[#e6e2e7] bg-white pl-12 pr-12 text-sm text-[#251c2b] shadow-[0_2px_5px_rgba(30,20,35,0.02)] outline-none transition placeholder:text-[#b5b0b8] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#aaa4ad] transition hover:bg-[#f8f3f7] hover:text-[#d71789]">{showPassword ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}</button></div>
        {errors.password && <p className="mt-2 text-xs font-medium text-[#c62850]">{errors.password.message}</p>}
      </div>
      {serverError && <p role="alert" className="rounded-xl border border-[#f4cbd5] bg-[#fff5f7] px-4 py-3 text-xs font-medium leading-5 text-[#b4234d]">{serverError}</p>}
      <button type="submit" disabled={isSubmitting} className="group mt-3 flex h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#241235] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(36,18,53,0.18)] transition hover:bg-[#351747] hover:shadow-[0_14px_28px_rgba(36,18,53,0.24)] focus:outline-none focus:ring-4 focus:ring-[#d71789]/20 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Signing in…' : 'Enter workspace'}{!isSubmitting && <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />}</button>
    </form>
  )
}
