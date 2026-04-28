import type { Route } from '../hooks/useRoute'

type Props = {
  route: Route
  onNavigate: (to: Route) => void
  isLoggedIn: boolean
  onLogout?: () => void
  subtitle?: string
}

export function Header({
  route,
  onNavigate,
  isLoggedIn,
  onLogout,
  subtitle,
}: Props) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
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
            label="Home"
            active={route === 'home'}
            onClick={() => onNavigate('home')}
          />
          <NavLink
            label="Documentazione"
            active={route === 'docs'}
            onClick={() => onNavigate('docs')}
          />
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              className="text-[11px] text-gray-600 hover:text-black px-3 py-1.5 ml-2 border border-gray-300 hover:border-gray-400 uppercase tracking-wider transition-colors"
            >
              Disconnetti
            </button>
          )}
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
