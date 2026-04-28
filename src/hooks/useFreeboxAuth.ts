import { useCallback, useEffect, useRef, useState } from 'react'
import { checkTrack, requestAuthorization } from '../api/auth'
import { getAppToken, setAppToken } from '../api/client'
import { DEMO_TOKEN } from '../api/mock'

const STORAGE_KEY = 'iliadbox.app_token'
const DEMO_KEY = 'iliadbox.demo'
const AUTH_TIMEOUT_MS = 5 * 60 * 1000

export type AuthPhase =
  | 'idle'
  | 'requesting'
  | 'pending'
  | 'granted'
  | 'denied'
  | 'timeout'
  | 'error'

export type AuthState = {
  phase: AuthPhase
  trackId: number | null
  error: string | null
  hasToken: boolean
  demo: boolean
}

export function useFreeboxAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const isDemo = localStorage.getItem(DEMO_KEY) === '1'
    if (isDemo) {
      setAppToken(DEMO_TOKEN)
      return {
        phase: 'granted',
        trackId: null,
        error: null,
        hasToken: true,
        demo: true,
      }
    }
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) setAppToken(token)
    return {
      phase: token ? 'granted' : 'idle',
      trackId: null,
      error: null,
      hasToken: Boolean(token),
      demo: false,
    }
  })

  const pollRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => stopPolling, [])

  const startAuthorization = useCallback(async () => {
    stopPolling()
    setState({
      phase: 'requesting',
      trackId: null,
      error: null,
      hasToken: false,
      demo: false,
    })
    try {
      const { app_token, track_id } = await requestAuthorization()
      setState({
        phase: 'pending',
        trackId: track_id,
        error: null,
        hasToken: false,
        demo: false,
      })

      timeoutRef.current = window.setTimeout(() => {
        stopPolling()
        setState({
          phase: 'timeout',
          trackId: track_id,
          error: null,
          hasToken: false,
          demo: false,
        })
      }, AUTH_TIMEOUT_MS)

      pollRef.current = window.setInterval(async () => {
        try {
          const status = await checkTrack(track_id)
          if (status.status === 'granted') {
            stopPolling()
            localStorage.setItem(STORAGE_KEY, app_token)
            setAppToken(app_token)
            setState({
              phase: 'granted',
              trackId: track_id,
              error: null,
              hasToken: true,
              demo: false,
            })
          } else if (
            status.status === 'denied' ||
            status.status === 'timeout' ||
            status.status === 'unknown'
          ) {
            stopPolling()
            setState({
              phase: status.status === 'denied' ? 'denied' : 'timeout',
              trackId: track_id,
              error: null,
              hasToken: false,
              demo: false,
            })
          }
        } catch (e) {
          stopPolling()
          setState({
            phase: 'error',
            trackId: track_id,
            error: e instanceof Error ? e.message : String(e),
            hasToken: false,
            demo: false,
          })
        }
      }, 2000)
    } catch (e) {
      setState({
        phase: 'error',
        trackId: null,
        error: e instanceof Error ? e.message : String(e),
        hasToken: false,
        demo: false,
      })
    }
  }, [])

  const startDemo = useCallback(() => {
    stopPolling()
    localStorage.setItem(DEMO_KEY, '1')
    localStorage.removeItem(STORAGE_KEY)
    setAppToken(DEMO_TOKEN)
    setState({
      phase: 'granted',
      trackId: null,
      error: null,
      hasToken: true,
      demo: true,
    })
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(DEMO_KEY)
    setAppToken(null)
    setState({
      phase: 'idle',
      trackId: null,
      error: null,
      hasToken: false,
      demo: false,
    })
  }, [])

  return {
    state,
    startAuthorization,
    startDemo,
    reset,
    appToken: getAppToken(),
  }
}

export { STORAGE_KEY as APP_TOKEN_STORAGE_KEY }
