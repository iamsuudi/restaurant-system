import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { Button } from './ui/button'

export const GoBack = () => {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <Button
      variant="outline"
      disabled={!canGoBack}
      onClick={() => router.history.back()}
    >
      Go Back
    </Button>
  )
}
