import { CircleAlert } from 'lucide-react'

export const ErrorComponent = ({ error }: { error: Error | null }) => (
  <div className="text-destructive flex flex-col items-center">
    <CircleAlert className="size-16 opacity-80" />
    <p className="font-bold mt-4">Unable to fetch!</p>
    <p>{error?.message}</p>
  </div>
)
