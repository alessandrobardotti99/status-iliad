import { useEffect } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { ChangelogPage } from './components/ChangelogPage'
import { Dashboard } from './components/Dashboard'
import { DocsPage } from './components/DocsPage'
import { FeaturesPage } from './components/FeaturesPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HistoryPage } from './components/HistoryPage'
import { ParentalPage } from './components/ParentalPage'
import { PrivacyPage } from './components/PrivacyPage'
import { TermsPage } from './components/TermsPage'
import { useFreeboxAuth } from './hooks/useFreeboxAuth'
import { useRoute } from './hooks/useRoute'

function App() {
  const { state, startAuthorization, startDemo, reset } = useFreeboxAuth()
  const { route, navigate, replace } = useRoute()

  const isLoggedIn = state.phase === 'granted' && state.hasToken

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

      {route === 'privacy' ? (
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
        />
      )}

      <Footer />
    </div>
  )
}

export default App
