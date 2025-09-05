import { useFormContext } from './form-context'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function SubscribeButton({
  label,
  disabled,
}: {
  label: string
  disabled?: boolean
}) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          disabled={isSubmitting || !canSubmit || disabled}
          className="w-full hover:cursor-pointer"
        >
          {isSubmitting ? <Spinner /> : label}
        </Button>
      )}
    </form.Subscribe>
  )
}
