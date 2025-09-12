import {
  Link,
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from '@tanstack/react-router'
import JsonView from '@uiw/react-json-view'
import { vscodeTheme } from '@uiw/react-json-view/vscode'
import _ from 'lodash'
import { Loader } from 'lucide-react'
import { query } from '@/hooks/query'
import { ErrorComponent } from '@/components/error-component'
import {
  ActionRenderer,
  DateRenderer,
  TargetRenderer,
} from '@/components/activity'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { RoleRender } from '@/components/role-render'

export const Route = createFileRoute('/_auth/dashboard/activity/$id')({
  beforeLoad: ({ params: { id } }) => {
    if (!id) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const { data: me } = query.currentUserQuery()
  const { data: log, isPending, error } = query.logQuery(id)

  return (
    <div className="w-full min-h-screen p-5">
      <div className="max-w-screen-sm space-y-20 w-full mx-auto p-5 bg-background rounded-xl shadow">
        <div className="relative">
          <h2 className="text-3xl font-semibold">Log Details</h2>
          <span className="text-gray-500 text-sm">
            View detailed information about the selected log.
          </span>
          {canGoBack && (
            <Button
              type="button"
              variant={'outline'}
              size={'sm'}
              className="px-5 absolute right-0 top-5"
              onClick={() => router.history.back()}
            >
              Go Back
            </Button>
          )}
        </div>

        {isPending && <Loader className="size-10 mx-auto animate-spin" />}
        {error && <ErrorComponent error={error} />}

        {log && (
          <div className="text-sm space-y-4">
            <p className="font-bold text-xl">Overview</p>
            <Separator />
            <div className="flex items-center gap-2">
              <p className="text-gray-500">Actor</p>
              <Link
                className="hover:underline hover:text-primary"
                to={
                  me?.id === log.actor_id
                    ? '/dashboard/profile'
                    : '/dashboard/users/$id'
                }
                params={{
                  id: log.actor_id,
                }}
              >
                {log.actor_name}
              </Link>
              <RoleRender role={log.actor_role.toLowerCase()} />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 mr-auto">Action</p>
              <ActionRenderer action={log.action_type} />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 mr-auto">Target</p>
              <TargetRenderer log={log} />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 mr-auto">Timestamp</p>
              <DateRenderer date={log.ts} />
            </div>
            <p className="font-bold text-xl mt-16">Changes</p>
            <Separator />
            <JsonView
              value={log.diff || { 'No changes': true }}
              style={vscodeTheme}
              displayObjectSize={false}
              displayDataTypes={false}
              enableClipboard={false}
              collapsed={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
