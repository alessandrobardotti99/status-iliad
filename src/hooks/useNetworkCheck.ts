import { useEffect, useState } from 'react'

const STORAGE_KEY = 'iliadbox.network_check'
const STORAGE_TTL_MS = 60_000

export type NetworkStatus = 'pending' | 'reachable' | 'unreachable'

type CachedCheck = {
  status: NetworkStatus
  ts: number
}

function readCache(): NetworkStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedCheck
    if (Date.now() - parsed.ts > STORAGE_TTL_MS) return null
    return parsed.status
  } catch {
    return null
  }
}

function writeCache(status: NetworkStatus) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status, ts: Date.now() } satisfies CachedCheck),
    )
  } catch {
    // ignore: quota exceeded or storage disabled
  }
}

/**
 * Probe the iliadbox via the same-origin proxy. A successful response (any
 * 2xx) means the proxy can reach the router → device is on the Iliad LAN.
 *
 * Always runs (subject to a 60s localStorage cache). The decision to act on
 * the result lives in the caller — e.g. in demo mode or on public pages
 * the network status is simply ignored.
 */
export function useNetworkCheck(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(
    () => readCache() ?? 'pending',
  )

  useEffect(() => {
    if (status !== 'pending') return

    let cancelled = false

    const check = async () => {
      try {
        const res = await fetch('/api/v8/login/', {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
          cache: 'no-store',
        })
        const next: NetworkStatus = res.ok ? 'reachable' : 'unreachable'
        if (!cancelled) {
          setStatus(next)
          writeCache(next)
        }
      } catch {
        if (!cancelled) {
          setStatus('unreachable')
          writeCache('unreachable')
        }
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [status])

  return status
}

export function clearNetworkCheckCache() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
