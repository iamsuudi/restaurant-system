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
  password: z.string().optional(),
})

type FormType = z.infer<typeof schema>

export function CreateDialog() {
  const { mutate, isSuccess, error } = query.createUserMutation()

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
      password: '',
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
        <DialogTrigger asChild>
          <Button className="">Create User</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-3/4 overflow-y-scroll space-y-5">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Write detail information about the user. Click save when
              you&apos;re done.
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
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField label="Password" placeholder="********" />
                )}
              />
            </div>

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <div>
                <form.AppForm>
                  <form.SubscribeButton label="Create" />
                </form.AppForm>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
