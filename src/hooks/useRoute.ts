import { useEffect, useState } from 'react'

export type Route = 'home' | 'dashboard' | 'history' | 'docs'

function parseHash(): Route {
  const segment = window.location.hash.replace(/^#\/?/, '').split('/')[0]
  if (segment === 'docs') return 'docs'
  if (segment === 'dashboard') return 'dashboard'
  if (segment === 'history') return 'history'
  return 'home'
}

export function useRoute(): {
  route: Route
  navigate: (to: Route) => void
  replace: (to: Route) => void
} {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (to: Route) => {
    window.location.hash = to === 'home' ? '/' : `/${to}`
  }

  const replace = (to: Route) => {
    const hash = to === 'home' ? '/' : `/${to}`
    const url = `${window.location.pathname}${window.location.search}#${hash}`
    window.history.replaceState(null, '', url)
    setRoute(to)
  }

  return { route, navigate, replace }
}
