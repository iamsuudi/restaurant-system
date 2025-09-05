import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/components/form/form-context'

export const Route = createFileRoute('/forget-password')({
  component: RouteComponent,
})

const emailSchema = z.object({
  email: z.string().email('Invalid e-mail address'),
})

type emailType = z.infer<typeof emailSchema>

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      email: '',
    } as emailType,
    onSubmit: async ({ value }) => {
      const fd = new FormData()
      fd.append('email', value.email)
      const res = await fetch('/api/v1/auth/forget-password', {
        method: 'POST',
        body: fd,
      })
      if (res.ok) {
        alert('Password reset link sent to your email.')
      } else {
        const errorResponse = await res.json()
        alert(errorResponse.error || 'Unknown error')
      }
      form.reset()
    },
    validators: {
      onChange: emailSchema,
    },
  })

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-10 max-w-sm shadow rounded-2xl bg-background">
          <h1 className="text-2xl font-bold mb-4">Forget Password</h1>
          <p className="mb-4 text-sm text-stone-600">
            Enter your email address to receive a link to reset your password.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField label="" placeholder="Enter your email" />
              )}
            />
            <form.AppForm>
              <form.SubscribeButton label="Send reset link" />
            </form.AppForm>
          </form>
        </div>
      </div>
    </>
  )
}
