import { useEffect, useState } from 'react'

export type Route = 'home' | 'docs'

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash === 'docs') return 'docs'
  return 'home'
}

export function useRoute(): {
  route: Route
  navigate: (to: Route) => void
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

  return { route, navigate }
}
