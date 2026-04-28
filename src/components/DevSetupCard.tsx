import { REPO_URL } from '../lib/links'

type Props = {
  className?: string
}

export function DevSetupCard({ className }: Props) {
  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-[10px] shadow-sm ${className ?? ''}`}
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="border-l-2 border-red-600 pl-3">
          <h2 className="text-[11px] font-semibold text-black uppercase tracking-wider">
            Setup Rapido (Repo)
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Per chi sa cos’è Git/Docker
          </p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-3">
        <p className="text-[12px] text-gray-700 leading-relaxed">
          Se vuoi usare la dashboard anche quando internet è giù, devi
          servirla in LAN (dal tuo Mac/PC). Qui trovi i comandi minimi.
        </p>

        <div className="text-[11px] text-gray-500">Docker (consigliato)</div>
        <div className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 whitespace-pre-wrap">
          {`git clone ${REPO_URL}
cd status-iliad
docker compose up -d`}
        </div>

        <div className="text-[11px] text-gray-500">Dev server</div>
        <div className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 whitespace-pre-wrap">
          {`pnpm install
pnpm dev`}
        </div>

        <div className="flex gap-2 pt-1">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 bg-black hover:bg-gray-800 text-white text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
          >
            Apri repo
          </a>
          <a
            href="#/docs"
            className="flex-1 text-center py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
          >
            Guida
          </a>
        </div>
      </div>
    </div>
  )
}

