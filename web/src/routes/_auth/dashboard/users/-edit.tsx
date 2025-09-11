import { toast } from 'sonner'
import { useEffect } from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/form/form-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { query } from '@/hooks/query'

const schema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Minimum 2 letters are required'),
  email: z
    .string({ message: 'Email is required' })
    .min(2, 'Minimum 2 letters are required'),
  phone: z
    .string({ message: 'Phone is required' })
    .min(2, 'Minimum 2 letters are required'),
  role: z.enum(['admin', 'kitchen', 'waiter']),
})

type FormType = z.infer<typeof schema>

export function EditDialog({
  id,
  children,
}: {
  id: number
  children: React.ReactNode
}) {
  const { data: user } = query.userQuery(id)
  const { mutate, isSuccess, error } = query.updateUserInfoMutation(id)

  const form = useAppForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'waiter',
    } as FormType,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      const fd = new FormData()
      if (value.name) fd.append('name', value.name)
      if (value.email) fd.append('email', value.email)
      if (value.phone) fd.append('phone', value.phone)
      fd.append('role', value.role)
      mutate(fd)
    },
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successful!')
      form.reset()
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-md space-y-5">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update information about the user. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-y-3 gap-x-10">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField label="Name" placeholder="John Doe" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    placeholder="example@example.com"
                  />
                )}
              />
              <form.AppField
                name="phone"
                children={(field) => (
                  <field.TextField label="Phone" placeholder="+1234567890" />
                )}
              />
              <form.AppField
                name="role"
                children={(field) => (
                  <field.SelectField
                    label="Role"
                    items={['admin', 'kitchen', 'waiter']}
                  />
                )}
              />
            </div>

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <div>
                <form.AppForm>
                  <form.SubscribeButton label="Update" />
                </form.AppForm>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
