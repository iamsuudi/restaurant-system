import { toast } from 'sonner'
import React, { useEffect, useRef, useState } from 'react'
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
    .min(5, 'Minimum 5 letters are required'),
  price: z
    .number({ message: 'Price is required' })
    .min(0, 'Price must be above 0'),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
})

type FormType = z.infer<typeof schema>

export function EditDialog({
  id,
  children,
}: {
  id: number
  children: React.ReactNode
}) {
  const { data } = query.getMenu(id)
  const { mutate, isSuccess, error } = query.updateMenu(id)

  const [documents, setDocuments] = useState<Array<File> | undefined>(undefined)
  const [current, setCurrent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useAppForm({
    defaultValues: {
      name: data?.name,
      price: data?.price,
      description: data?.description,
      ingredients: data?.ingredients,
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
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-md max-h-3/4 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>
              Edit detail information about the menu. Click save when
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
              <form.AppField name="ingredients" mode="array">
                {(field) => (
                  <div>
                    {/* Render list */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      {field.state.value?.map((item, idx) => (
                        <div
                          key={`${item}-${idx}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f3f4f6',
                            padding: '4px 8px',
                            borderRadius: 4,
                          }}
                        >
                          <p className="text-xs mr-2">{item}</p>
                          <button
                            type="button"
                            onClick={() => field.removeValue(idx)}
                            className="text-destructive"
                            aria-label="Remove Ingredient"
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
              {(!documents || documents.length == 0) && (
                <img
                  src={`${import.meta.env.VITE_ASSETS_HOST}/${data?.picture}`}
                  className="object-contain w-full h-44 rounded-xl block mt-5"
                />
              )}
            </div>

            <DropZone file={documents} setFile={setDocuments} />

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <form.AppForm>
                <form.SubscribeButton label="Save" />
              </form.AppForm>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
