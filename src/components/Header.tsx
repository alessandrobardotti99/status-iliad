import type { Route } from '../hooks/useRoute'
import { InstallButton } from './InstallButton'

type Props = {
  route: Route
  onNavigate: (to: Route) => void
  isLoggedIn: boolean
  onLogout?: () => void
  subtitle?: string
  demo?: boolean
}

export function Header({
  route,
  onNavigate,
  isLoggedIn,
  onLogout,
  subtitle,
  demo,
}: Props) {
  const primaryRoute: Route = isLoggedIn ? 'dashboard' : 'home'

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate(primaryRoute)}
          className="flex items-center gap-3 cursor-pointer focus:outline-none"
        >
          <img
            src="/img-logo/svg-editor-canvas.svg"
            alt="Iliad Network Monitor"
            className="h-8 w-auto"
          />
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-black uppercase tracking-wider leading-tight">
              Network Monitor
            </div>
            {subtitle && (
              <div className="text-[11px] text-gray-500 leading-tight">
                {subtitle}
              </div>
            )}
          </div>
        </button>

        <nav className="flex items-center gap-1">
          <NavLink
            label={isLoggedIn ? 'Dashboard' : 'Connessione'}
            active={route === primaryRoute}
            onClick={() => onNavigate(primaryRoute)}
          />
          {isLoggedIn && (
            <NavLink
              label="Storico"
              active={route === 'history'}
              onClick={() => onNavigate('history')}
            />
          )}
          {isLoggedIn && (
            <NavLink
              label="Parental"
              active={route === 'parental'}
              onClick={() => onNavigate('parental')}
            />
          )}
          {!isLoggedIn && (
            <NavLink
              label="Funzionalità"
              active={route === 'features'}
              onClick={() => onNavigate('features')}
            />
          )}
          {!isLoggedIn && (
            <NavLink
              label="Documentazione"
              active={route === 'docs'}
              onClick={() => onNavigate('docs')}
            />
          )}
          <div className="ml-2 flex items-center gap-2">
            <InstallButton />
            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className={`text-[11px] px-3 py-1.5 border uppercase tracking-wider rounded-[10px] transition-colors ${
                  demo
                    ? 'border-red-600 text-red-700 hover:bg-red-600 hover:text-white'
                    : 'border-gray-300 text-gray-600 hover:text-black hover:border-gray-400'
                }`}
              >
                {demo ? 'Esci dalla demo' : 'Disconnetti'}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

function NavLink({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors ${
        active
          ? 'text-black border-b-2 border-red-600'
          : 'text-gray-600 hover:text-black border-b-2 border-transparent'
      }`}
    >
      {label}
    </button>
  )
}
