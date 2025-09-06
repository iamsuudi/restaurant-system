import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { DropZone } from './-dropzone'
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
    .min(5, 'Minimum 5 letters are required'),
  price: z
    .number({ message: 'Price is required' })
    .min(0, 'Price must be above 0'),
  description: z.string().optional(),
})

type FormType = z.infer<typeof schema>

export function CreateDialog() {
  const { mutate, isSuccess, error } = query.createMenu()
  const [documents, setDocuments] = useState<Array<File> | undefined>(undefined)

  const form = useAppForm({
    defaultValues: { name: '', price: 0, description: '' } as FormType,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      const fd = new FormData()
      if (value.name) fd.append('name', value.name)
      if (value.price) fd.append('price', value.price.toString())
      if (value.description) fd.append('description', value.description)
      if (documents && documents.length > 0) {
        fd.append('picture', documents[0])
      }
      mutate(fd)
    },
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successful!')
      form.reset()
      setDocuments([])
    } else if (error) {
      toast.error('Failed: ' + error.message)
    }
  }, [isSuccess, error])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="shadow-md">
            Create Menu
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-3/4 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Create Menu</DialogTitle>
            <DialogDescription>
              Write detail information about the menu. Click save when
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
                  <field.TextField label="Name" placeholder="Agelgil" />
                )}
              />
              <form.AppField
                name="price"
                children={(field) => (
                  <field.NumberField
                    label="Price"
                    step={0.01}
                    placeholder="$79.99"
                  />
                )}
              />
              <form.AppField
                name="description"
                children={(field) => (
                  <field.TextAreaField
                    label="Description"
                    placeholder="Some description about the menu"
                  />
                )}
              />
            </div>

            <DropZone file={documents} setFile={setDocuments} />

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <form.AppForm>
                <form.SubscribeButton
                  label="Create"
                  disabled={!documents || documents.length == 0}
                />
              </form.AppForm>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
