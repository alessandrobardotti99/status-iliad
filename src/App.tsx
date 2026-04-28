import { useEffect } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { ChangelogPage } from './components/ChangelogPage'
import { Dashboard } from './components/Dashboard'
import { DocsPage } from './components/DocsPage'
import { FeaturesPage } from './components/FeaturesPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HistoryPage } from './components/HistoryPage'
import { LoadingScreen } from './components/LoadingScreen'
import { NetworkGate } from './components/NetworkGate'
import { ParentalPage } from './components/ParentalPage'
import { PrivacyPage } from './components/PrivacyPage'
import { TermsPage } from './components/TermsPage'
import { useFreeboxAuth } from './hooks/useFreeboxAuth'
import { useNetworkCheck } from './hooks/useNetworkCheck'
import { useRoute } from './hooks/useRoute'

const PUBLIC_ROUTES = new Set([
  'docs',
  'features',
  'changelog',
  'privacy',
  'terms',
])

function App() {
  const { state, startAuthorization, startDemo, reset, importToken } =
    useFreeboxAuth()
  const { route, navigate, replace } = useRoute()

  const isLoggedIn = state.phase === 'granted' && state.hasToken
  const isPublicRoute = PUBLIC_ROUTES.has(route)

  // Il check di rete gira sempre in background (con cache 60s in
  // localStorage). Decidiamo a valle se agire sul risultato: in modalità
  // demo o sulle pagine pubbliche ignoriamo il responso.
  const networkStatus = useNetworkCheck()
  const enforceNetwork = !state.demo && !isPublicRoute

  useEffect(() => {
    if (isLoggedIn && route === 'home') {
      replace('dashboard')
    } else if (
      !isLoggedIn &&
      (route === 'dashboard' || route === 'history' || route === 'parental')
    ) {
      replace('home')
    }
  }, [isLoggedIn, route, replace])

  const subtitle =
    route === 'docs'
      ? 'Documentazione'
      : route === 'history'
        ? 'Storico'
        : route === 'parental'
          ? 'Controllo Parentale'
          : route === 'privacy'
            ? 'Privacy'
            : route === 'terms'
              ? "Termini d'uso"
              : route === 'features'
                ? 'Funzionalità'
                : route === 'changelog'
                  ? 'Changelog'
                  : route === 'dashboard'
                    ? state.demo
                      ? 'Dashboard · Demo'
                      : 'Dashboard'
                    : 'Autenticazione iliadbox'

  const isDashboard = route === 'dashboard' && isLoggedIn
  const checkingNetwork = enforceNetwork && networkStatus === 'pending'
  const blockedByNetwork =
    enforceNetwork && networkStatus === 'unreachable'

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDashboard ? 'bg-neutral-100' : 'bg-neutral-100'
      }`}
    >
      <Header
        route={route}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        onLogout={isLoggedIn ? reset : undefined}
        subtitle={subtitle}
        demo={state.demo}
      />

      {checkingNetwork ? (
        <LoadingScreen />
      ) : blockedByNetwork ? (
        <NetworkGate onStartDemo={startDemo} onNavigate={navigate} />
      ) : route === 'privacy' ? (
        <PrivacyPage />
      ) : route === 'terms' ? (
        <TermsPage />
      ) : route === 'features' ? (
        <FeaturesPage />
      ) : route === 'changelog' ? (
        <ChangelogPage />
      ) : route === 'docs' ? (
        <DocsPage />
      ) : route === 'history' && isLoggedIn ? (
        <HistoryPage />
      ) : route === 'parental' && isLoggedIn ? (
        <ParentalPage />
      ) : isLoggedIn ? (
        <Dashboard demo={state.demo} />
      ) : (
        <AuthScreen
          state={state}
          onStart={startAuthorization}
          onStartDemo={startDemo}
          onReset={reset}
          onImportToken={importToken}
        />
      )}

      <Footer />
    </div>
  )
}

export default App
