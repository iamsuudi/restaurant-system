export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const opts = { ...init, credentials: 'include' as const } // always send cookies
  let resp = await fetch(input, opts)

  if (resp.status === 401) {
    // attempt refresh
    const refreshResp = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (!refreshResp.ok) {
      if (refreshResp.status == 500) throw new Error(refreshResp.statusText)
      if (refreshResp.status == 404) throw new Error('Route Not Found!')
      const errorResponse = await resp.json()
      throw new Error(errorResponse.error || 'Unknown error')
    }

    // got new access cookie → replay original request
    resp = await fetch(input, opts)
  }

  if (!resp.ok) {
    if (resp.status == 500) throw new Error(resp.statusText)
    if (resp.status == 404) throw new Error('Route Not Found!')
    const errorResponse = await resp.json()
    throw new Error(errorResponse.error || 'Unknown error')
  }

  return resp.json()
}
