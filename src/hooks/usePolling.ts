import { useEffect, useRef, useState } from 'react'

export type PollingState<T> = {
  data: T | null
  error: string | null
  loading: boolean
}

export function usePolling<T>(
  fn: () => Promise<T>,
  intervalMs: number,
  enabled: boolean,
): PollingState<T> {
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    error: null,
    loading: enabled,
  })

  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const tick = async () => {
      try {
        const data = await fnRef.current()
        if (!cancelled) setState({ data, error: null, loading: false })
      } catch (e) {
        if (!cancelled) {
          setState((s) => ({
            data: s.data,
            error: e instanceof Error ? e.message : String(e),
            loading: false,
          }))
        }
      }
    }

    tick()
    const id = window.setInterval(tick, intervalMs)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [intervalMs, enabled])

  return state
}
