'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createUser } from '@/actions/users'
import { createUserSchema, type CreateUserInput } from '@/lib/validation/user'

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', role: 'admin' },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      reset({ name: '', email: '', password: '', role: 'admin' })
    }
  }

  async function onSubmit(values: CreateUserInput) {
    const result = await createUser(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Admin user created successfully')
    reset({ name: '', email: '', password: '', role: 'admin' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button>New user</Button>} />
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
        <DialogHeader className="border-b border-[#f0edf1] pb-3 min-w-0">
          <DialogTitle className="text-lg font-bold text-[#21182a]">Create admin user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Full name (e.g. John Doe)"
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="admin@movodream.com"
                autoComplete="off"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters (letters and numbers)"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 text-xs flex items-center justify-between">
              <span className="text-[#857c8b] font-medium">Access Level</span>
              <span className="font-bold text-[#d71789] bg-[#fce8f2] px-2.5 py-0.5 rounded-full border border-[#f7d4e5]">Administrator (Full Access)</span>
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting ? 'Creating…' : 'Create admin user'}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
