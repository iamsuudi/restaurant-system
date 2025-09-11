import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useAppForm } from '@/components/form/form-context'
import { query } from '@/hooks/query'

export const Route = createFileRoute('/_auth/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: me } = query.currentUserQuery()
  const { mutate, isPending, isSuccess, error } = query.updateUserInfoMutation(
    me!.id,
    true,
  )

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated!')
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  const form = useAppForm({
    defaultValues: {
      name: me?.name || '',
      email: me?.email || '',
      phone: me?.phone || '',
    } as { name?: string; email?: string; phone?: string },
    onSubmit: ({ value }) => mutate(value),
  })

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-screen-md w-full mx-auto p-10 space-y-10 bg-background rounded-xl my-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5 w-80 mx-auto"
        >
          <p className="text-xl font-bold">Personal Informations</p>
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Full Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => <field.TextField label="Email" />}
          />
          <form.AppField
            name="phone"
            children={(field) => <field.TextField label="Phone" />}
          />
          <form.AppForm>
            <form.SubscribeButton label="Update" disabled={isPending} />
          </form.AppForm>
        </form>
      </div>
    </div>
  )
}
