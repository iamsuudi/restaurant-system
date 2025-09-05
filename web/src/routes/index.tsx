import * as React from 'react'
import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { BadgeAlert, ExternalLink, Eye, EyeOff, Utensils } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { currentUserQueryOptions, query } from '@/hooks/query'
import { useAppForm } from '@/components/form/form-context'

export const loginSchema = z.object({
  email: z.string().email('Invalid e-mail address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
const loginSearchSchema = z.object({
  redirect: z.string().optional().default('/dashboard'),
})

export const Route = createFileRoute('/')({
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    const data = await queryClient.fetchQuery(currentUserQueryOptions)
    if (data) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const search = useSearch({ from: '/' })
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState(false)
  const { mutate, isError, error } = query.loginMutation(() =>
    router.history.push(search.redirect),
  )

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      mutate(value)
    },
    validators: {
      onChange: loginSchema,
    },
  })

  return (
    <>
      <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <div className=" flex items-center gap-4">
              <Link to="/" aria-label="go home">
                <Utensils className="size-10 text-primary" />
              </Link>
              <div>
                <p className="text-lg font-bold">
                  <span>Samrat Restaurant</span>
                </p>
                <p className="text-sm">Welcome back! Sign in to continue</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label={'Email'}
                    placeholder="username@example.com"
                  />
                )}
              />

              <form.AppField
                name="password"
                children={(field) => (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={field.name}
                        className="text-sm text-title"
                      >
                        Password
                      </Label>
                      <Button asChild variant="link" size="sm">
                        <Link
                          to="/forget-password"
                          className="text-xs link intent-info variant-ghost"
                        >
                          Forgot your Password ?
                        </Link>
                      </Button>
                    </div>

                    <div className="relative flex">
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="**********"
                        className="input sz-md variant-mixed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 hover:cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>

                    {field.getMeta().isBlurred && (
                      <div className="text-xs text-destructive">
                        {field.state.meta.errors.map((err, i) => (
                          <div key={i} className="error">
                            {err?.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />

              <form.AppForm>
                <form.SubscribeButton label="Sign in" />
              </form.AppForm>

              {isError && (
                <Alert variant={'destructive'}>
                  <BadgeAlert className="w-4 h-4 " />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-sm text-center text-accent-foreground">
              Don't have an account ?
              <Button asChild variant="link" className="px-1 underline">
                <a href={`mailto:suudiabdulfetah@gmail.com`}>
                  Contact Admin
                  <ExternalLink className="size-4 inline" />
                </a>
              </Button>
            </p>
          </div>
        </form>
      </section>
    </>
  )
}
