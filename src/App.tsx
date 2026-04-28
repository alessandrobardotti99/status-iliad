import { AuthScreen } from './components/AuthScreen'
import { Dashboard } from './components/Dashboard'
import { useFreeboxAuth } from './hooks/useFreeboxAuth'

function App() {
  const { state, startAuthorization, reset } = useFreeboxAuth()

  if (state.phase === 'granted' && state.hasToken) {
    return <Dashboard onLogout={reset} />
  }

  return (
    <AuthScreen state={state} onStart={startAuthorization} onReset={reset} />
  )
}

export default App
