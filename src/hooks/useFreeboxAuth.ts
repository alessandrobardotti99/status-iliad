import { useCallback, useEffect, useRef, useState } from 'react'
import { checkTrack, requestAuthorization } from '../api/auth'
import { setAppToken, getAppToken } from '../api/client'

const STORAGE_KEY = 'iliadbox.app_token'

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
}

export function useFreeboxAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) setAppToken(token)
    return {
      phase: token ? 'granted' : 'idle',
      trackId: null,
      error: null,
      hasToken: Boolean(token),
    }
  })

  const pollRef = useRef<number | null>(null)

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
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
    })
    try {
      const { app_token, track_id } = await requestAuthorization()
      setState({
        phase: 'pending',
        trackId: track_id,
        error: null,
        hasToken: false,
      })

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
            })
          }
        } catch (e) {
          stopPolling()
          setState({
            phase: 'error',
            trackId: track_id,
            error: e instanceof Error ? e.message : String(e),
            hasToken: false,
          })
        }
      }, 2000)
    } catch (e) {
      setState({
        phase: 'error',
        trackId: null,
        error: e instanceof Error ? e.message : String(e),
        hasToken: false,
      })
    }
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    localStorage.removeItem(STORAGE_KEY)
    setAppToken(null)
    setState({
      phase: 'idle',
      trackId: null,
      error: null,
      hasToken: false,
    })
  }, [])

  return {
    state,
    startAuthorization,
    reset,
    appToken: getAppToken(),
  }
}

export { STORAGE_KEY as APP_TOKEN_STORAGE_KEY }
