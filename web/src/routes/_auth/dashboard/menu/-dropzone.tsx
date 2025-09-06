import { toast } from 'sonner'
import { useState } from 'react'
import { Dropzone, DropzoneEmptyState } from '@/components/dropzone'

export const DropZone = ({
  file,
  setFile,
}: {
  file: Array<File> | undefined
  setFile: React.Dispatch<React.SetStateAction<Array<File> | undefined>>
}) => {
  const [error, setError] = useState<Error | undefined>()

  const handleDrop = (data: Array<File>) => {
    setError(undefined)
    setFile(data)
  }

  return (
    <div className="flex gap-5 py-5">
      <Dropzone
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        onDrop={handleDrop}
        onError={(err) => {
          toast.error(err.message)
          setError(err)
        }}
        src={file}
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

      {file && file.length > 0 && (
        <div className="flex flex-1">
          {file.map((f) => (
            <img
              key={f.name + f.lastModified}
              src={URL.createObjectURL(f)}
              className="flex-1 object-contain w-40 rounded"
            />
          ))}
        </div>
      )}
    </div>
  )
}
