type Step = {
  n: number
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    n: 1,
    title: 'L\'app si presenta alla iliadbox',
    body: "Quando avvii l'autenticazione, l'app dice alla iliadbox \"sono Iliad Network Monitor, posso entrare?\". La iliadbox prende nota della richiesta ma non risponde subito di sì.",
  },
  {
    n: 2,
    title: 'Devi confermare di persona sul router',
    body: "Sul piccolo schermo della iliadbox apparirà una scritta che chiede se accetti. Devi premere il tasto di conferma del router. Questo passaggio serve a dimostrare che sei davvero tu (un'app non può premere il tasto al posto tuo).",
  },
  {
    n: 3,
    title: 'La iliadbox consegna una "chiave"',
    body: "Una volta che hai confermato, la iliadbox dà all'app una chiave d'accesso personale. La chiave viene salvata sul tuo computer (solo nel browser) e non serve ripetere il passaggio del tasto le volte successive.",
  },
  {
    n: 4,
    title: 'L\'app legge i dati ogni pochi secondi',
    body: "Da quel momento l'app chiede alla iliadbox lo stato della connessione, la velocità e i dispositivi collegati. Aggiorna lo stato della linea ogni 5 secondi, l'elenco dispositivi ogni 15 e le info del router ogni 30.",
  },
]

export function HowItWorks() {
  return (
    <div className="bg-white border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Come funziona
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Il processo di connessione, in parole semplici
        </p>
      </div>

      <ol className="divide-y divide-gray-100">
        {STEPS.map((s) => (
          <li key={s.n} className="px-5 py-4 flex gap-4">
            <div className="shrink-0 w-7 h-7 border border-gray-300 flex items-center justify-center text-xs font-semibold text-black tabular-nums">
              {s.n}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-black mb-1">
                {s.title}
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <span className="font-semibold text-black uppercase tracking-wider">
            È sicuro? ·
          </span>{' '}
          La chiave d'accesso resta solo sul tuo computer. Nessun dato viene
          inviato a server esterni: tutto avviene tra il browser e la tua
          iliadbox, nella tua rete di casa. Puoi togliere l'autorizzazione
          quando vuoi dal pannello della iliadbox.
        </p>
      </div>
    </div>
  )
}
