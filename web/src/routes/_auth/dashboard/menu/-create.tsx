import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
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
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Minimum 2 letters are required'),
  price: z
    .number({ message: 'Price is required' })
    .min(0, 'Price must be above 0'),
  category: z.enum(['appetizer', 'main', 'dessert', 'drink']),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
})

type FormType = z.infer<typeof schema>

export function CreateDialog() {
  const { mutate, isSuccess, error } = query.createMenu()
  const [documents, setDocuments] = useState<Array<File> | undefined>(undefined)
  const [current, setCurrent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useAppForm({
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: 'main',
      ingredients: [],
    } as FormType,
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
      fd.append('category', value.category)
      value.ingredients?.forEach((item) => fd.append('ingredients', item))
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
          <Button className="">Create Menu</Button>
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
                name="category"
                children={(field) => (
                  <field.SelectField
                    label="Category"
                    items={['appetizer', 'main', 'dessert', 'drink']}
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
              <form.AppField name="ingredients" mode="array">
                {(field) => (
                  <div>
                    {/* Render list */}
                    <div className="flex flex-wrap gap-2">
                      {field.state.value?.map((lang, idx) => (
                        <div
                          key={`${lang}-${idx}`}
                          className="flex items-center bg-secondary py-1 px-2 rounded"
                        >
                          <p className="text-xs mr-2">{lang}</p>
                          <button
                            type="button"
                            onClick={() => field.removeValue(idx)}
                            className="text-destructive"
                            aria-label="Remove ingredient"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* The single input */}
                    <Input
                      ref={inputRef}
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const trimmed = current.trim()
                          if (trimmed) {
                            field.pushValue(trimmed)
                            setCurrent('')
                            inputRef.current?.focus()
                          }
                        }
                      }}
                      placeholder="Type an ingredient and press Enter"
                      style={{ marginTop: 12 }}
                    />
                  </div>
                )}
              </form.AppField>
            </div>

            <DropZone file={documents} setFile={setDocuments} />

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <div>
                <form.AppForm>
                  <form.SubscribeButton
                    label="Create"
                    disabled={!documents || documents.length == 0}
                  />
                </form.AppForm>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
