import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export type InstallState = {
  available: boolean
  installed: boolean
  isIos: boolean
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unsupported'>
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true
}

function detectIos(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isIosDevice = /iPad|iPhone|iPod/.test(ua)
  const isIpadOs =
    ua.includes('Mac') && 'ontouchend' in document.documentElement
  return isIosDevice || isIpadOs
}

export function useInstallPrompt(): InstallState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  )
  const [installed, setInstalled] = useState(detectStandalone)
  const isIos = detectIos()

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferred) return 'unsupported' as const
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setDeferred(null)
    }
    return outcome
  }

  return {
    available: deferred !== null && !installed,
    installed,
    isIos,
    promptInstall,
  }
}
