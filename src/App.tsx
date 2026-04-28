import { AuthScreen } from './components/AuthScreen'
import { Dashboard } from './components/Dashboard'
import { DocsPage } from './components/DocsPage'
import { Header } from './components/Header'
import { useFreeboxAuth } from './hooks/useFreeboxAuth'
import { useRoute } from './hooks/useRoute'

function App() {
  const { state, startAuthorization, reset } = useFreeboxAuth()
  const { route, navigate } = useRoute()

  const isLoggedIn = state.phase === 'granted' && state.hasToken

  const subtitle =
    route === 'docs'
      ? 'Documentazione'
      : isLoggedIn
        ? 'Dashboard'
        : 'Autenticazione iliadbox'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        route={route}
        onNavigate={navigate}
        isLoggedIn={isLoggedIn}
        onLogout={isLoggedIn ? reset : undefined}
        subtitle={subtitle}
      />

      {route === 'docs' ? (
        <DocsPage />
      ) : isLoggedIn ? (
        <Dashboard />
      ) : (
        <AuthScreen
          state={state}
          onStart={startAuthorization}
          onReset={reset}
        />
      )}

      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center mt-auto">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
          Iliad Network Monitor · FreeboxOS API v8
        </p>
      </footer>
    </div>
  )
}

export default App
