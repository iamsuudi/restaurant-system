import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Edit } from 'lucide-react'
import { useAppForm } from '@/components/form/form-context'
import { query } from '@/hooks/query'
import { Dropzone, DropzoneEmptyState } from '@/components/dropzone'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_auth/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: me } = query.currentUserQuery()
  const { mutate, isPending, isSuccess, error } = query.updateUserInfoMutation(
    me!.id,
    true,
  )
  const [files, setFiles] = useState<Array<File> | undefined>(undefined)
  const [editPicture, setEditPicture] = useState(false)

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
    onSubmit: ({ value }) => {
      const fd = new FormData()
      if (value.name) fd.append('name', value.name)
      if (value.email) fd.append('email', value.email)
      if (value.phone) fd.append('phone', value.phone)
      if (files && files.length > 0) {
        fd.append('picture', files[0])
      }
      mutate(fd)
    },
  })

  return (
    <div className="w-full min-h-screen p-5 overflow-y-hidden">
      <div className="max-w-screen-md w-full mx-auto bg-background rounded-xl my-10">
        <div className="max-w-96 mx-auto">
          <p className="text-xl font-bold">Picture</p>
          <Separator className="" />
        </div>
        {editPicture ? (
          <DropZone files={files} setFiles={setFiles} />
        ) : (
          <div className="w-fit relative mx-auto">
            <img
              src={`${import.meta.env.VITE_ASSETS_HOST}/${me?.picture}`}
              className="flex-1 object-contain rounded-full size-40 bg-secondary"
            />
            <button
              className="rounded absolute flex items-center size-6 bottom-1 -right-8 bg-background focus:scale-90 hover:scale-110"
              onClick={() => setEditPicture(true)}
            >
              <Edit className="size-5 mx-auto" />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5 w-96 mx-auto mt-10"
        >
          <div className="max-w-96 mx-auto">
            <p className="text-xl font-bold">Personal Informations</p>
            <Separator className="" />
          </div>
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

export const DropZone = ({
  files,
  setFiles,
}: {
  files: Array<File> | undefined
  setFiles: React.Dispatch<React.SetStateAction<Array<File> | undefined>>
}) => {
  const [error, setError] = useState<Error | undefined>()

  const handleDrop = (data: Array<File>) => {
    setError(undefined)
    setFiles(data)
  }

  return (
    <div className="flex flex-col-reverse items-center justify-center gap-5 py-5">
      <Dropzone
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        onDrop={handleDrop}
        onError={(err) => {
          toast.error(err.message)
          setError(err)
        }}
        src={files}
        maxFiles={1}
        maxSize={2 * 1024 * 1024}
        className="max-w-96 max-h-40 relative mx-auto flex-1"
      >
        <DropzoneEmptyState />
        {error && (
          <span className="text-destructive abolute bottom-0 text-xs">
            {error.message}
          </span>
        )}
      </Dropzone>

      {files && files.length > 0 && (
        <div className="flex flex-1 max-w-96">
          {files.map((file) => (
            <img
              key={file.name + file.lastModified}
              src={URL.createObjectURL(file)}
              className="flex-1 object-contain w-40 rounded"
            />
          ))}
        </div>
      )}
    </div>
  )
}
