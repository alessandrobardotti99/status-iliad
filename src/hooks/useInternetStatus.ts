import { useEffect, useState } from 'react'

export type InternetStatus = 'online' | 'offline'

/**
 * Best-effort indicator for WAN/Internet availability.
 *
 * Note: `navigator.onLine` does NOT guarantee actual internet reachability,
 * but it's a good UX hint to explain common cases (e.g. WAN down).
 */
export function useInternetStatus(): InternetStatus {
  const [status, setStatus] = useState<InternetStatus>(() =>
    navigator.onLine ? 'online' : 'offline',
  )

  useEffect(() => {
    const onOnline = () => setStatus('online')
    const onOffline = () => setStatus('offline')

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return status
}

