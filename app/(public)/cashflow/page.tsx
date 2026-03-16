import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cashflow | SHUURI",
  description:
    "Modelo financiero v5 · Capital USD 102K · Seed USD 500K · Breakeven M11 · Revenue M18 USD 993K · Caja M36 USD 21.7M",
}

// ── DATOS DEL MODELO FINAL v5 ────────────────────────────────────────────────
// Capital founders: USD 102K (USD 51K c/u)
// Álamo: USD 20K por hitos dentro del MVP — sin deuda diferida
// Seed M7: USD 500K (suficiente — BE M11, caja nunca negativa)
// Breakeven EBITDA: M11
// Clientes M18: 42.939 (objetivo 15K superado ×2.8)
// Técnicos M18: 5.000 (cap ARG alcanzado M12)
// Revenue M18: USD 993.236/mes
// Apertura país 1: M19 (M13 post-MVP)
// Caja mínima M7+: USD 338.189 (M10)
// Caja M36: USD 21.759.457

const MVP_ITEMS = [
  { label: "↑ Aporte Yair Levy Wald", value: "+51.000", type: "in" },
  { label: "↑ Aporte Sebastián Smulevich", value: "+51.000", type: "in" },
  { label: "↓ Legal — Founders Agreement + contratos", value: "-3.500", type: "out" },
  { label: "↓ C-Level (3 personas · 6 meses · USD 500/mes c/u)", value: "-9.000", type: "out" },
  { label: "↓ Duotach — Motor OT propio (160h/mes × USD 35 × 6m)", value: "-33.600", type: "out" },
  { label: "↓ Álamo SRL — apps + UI/UX + Odoo (por hitos M1-M6)", value: "-20.000", type: "out" },
  { label: "↓ Infra: Odoo + AWS + dominio + dev tools", value: "-4.200", type: "out" },
  { label: "↓ Seguros técnicos RC + accidentes", value: "-6.525", type: "out" },
  { label: "↓ Marketing + contingencia operativa", value: "-7.200", type: "out" },
  { label: "↓ Legales one-time (INPI + contratos)", value: "-7.300", type: "out" },
  { label: "Balance post-MVP (caja fin M6)", value: "+16.975", type: "balance" },
]

const HITOS = [
  {
    id: "M1",
    label: "Mar-26",
    title: "MVP arranca",
    sub: "Capital USD 102K · Duotach kickoff · Álamo hito M1",
    badge: "MVP",
    badgeColor: "bg-gray-700 text-white",
  },
  {
    id: "M7",
    label: "Sep-26",
    title: "★ SEED USD 500K",
    sub: "3 palancas activas · Pauta USD 20K · 2 comerciales B2B",
    badge: "SEED",
    badgeColor: "bg-[#2698D1] text-white",
  },
  {
    id: "M11",
    label: "Feb-27",
    title: "★ BREAKEVEN EBITDA",
    sub: "10.333 clientes · Revenue USD 213K",
    badge: "BE",
    badgeColor: "bg-green-700 text-white",
  },
  {
    id: "M12",
    label: "Mar-27",
    title: "★ 5.000 técnicos",
    sub: "13.925 clientes · Cap Argentina alcanzado",
    badge: "CAP",
    badgeColor: "bg-green-600 text-white",
  },
  {
    id: "M18",
    label: "Sep-27",
    title: "★ 42.939 clientes",
    sub: "Revenue USD 993K · Caja USD 1.385M",
    badge: "M18",
    badgeColor: "bg-green-700 text-white",
  },
  {
    id: "M19",
    label: "Oct-27",
    title: "✈ Apertura País 1",
    sub: "Revenue USD 1.165M · Caja USD 1.720M",
    badge: "LATAM",
    badgeColor: "bg-orange-600 text-white",
  },
  {
    id: "M36",
    label: "Feb-29",
    title: "★ Caja USD 21.7M",
    sub: "Revenue USD 5.348K/mes · EBITDA USD 2.011K/mes",
    badge: "M36",
    badgeColor: "bg-green-800 text-white",
  },
]

const SUPUESTOS = [
  "Capital founders: USD 102K (USD 51K Yair + USD 51K Sebi)",
  "Álamo cobra USD 20K dentro del MVP por hitos — sin deuda diferida, sin riesgo seed",
  "Seed USD 500K en M7 · suficiente · BE M11 · caja nunca negativa",
  "Cadena Grande: 5 locales promedio a USD 100/local/mes",
  "Cadena Chica: 2 locales promedio a USD 75/local/mes",
  "CAC freemium: USD 20 (era USD 100) vía outreach directo + técnicos como canal",
  "Pauta digital: USD 20K/mes M7-M12 · USD 30K/mes M13-M18 · 15% revenue M16+",
  "Técnicos reclutados activamente: 200/mes independiente de clientes",
  "CGs nuevos/mes: 8 (era 1) · CCs nuevos/mes: 40 (era 5-10)",
  "2 comerciales B2B dedicados desde M7 · USD 3.000/mes adicional",
  "Stack: Motor OT Duotach + Odoo + Apps Álamo + Claude API",
]

export default function CashflowPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="border-b border-gray-100 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#2698D1]">
            Modelo financiero v5 · Acelerado
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            USD 102K de capital propio.
            <br />
            Breakeven en M11.
          </h1>
          <p className="mb-10 max-w-2xl text-xl text-gray-500 leading-relaxed">
            Horizonte M1–M36 · Modelo acelerado · 3 palancas simultáneas. Capital founders cubre
            el MVP completo sin deuda. Seed USD 500K suficiente para escalar.
          </p>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Capital founders", value: "USD 102K", sub: "USD 51K c/u · sin deuda" },
              { label: "Seed M7", value: "USD 500K", sub: "Suficiente · no necesita más" },
              { label: "Breakeven EBITDA", value: "M11", sub: "7 meses antes que el plan base" },
              { label: "Caja M36", value: "USD 21.7M", sub: "Revenue USD 5.3M/mes" },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {k.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                <p className="mt-1 text-xs text-gray-400">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESUPUESTO MVP ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Presupuesto operativo MVP · Mar–Ago 2026
          </h2>
          <p className="mb-8 text-gray-500">
            Álamo cobra por hitos dentro del MVP — sin deuda diferida, sin riesgo si el seed se
            retrasa.
          </p>
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            {MVP_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-6 py-4 ${
                  item.type === "balance"
                    ? "bg-green-50 border-t-2 border-green-200"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm ${
                    item.type === "balance" ? "font-bold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    item.type === "in"
                      ? "text-green-600"
                      : item.type === "balance"
                      ? "text-green-700 text-base"
                      : "text-gray-700"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-blue-50 px-5 py-3 text-sm text-blue-700">
            <strong>★ Álamo SRL:</strong> cobra USD 20.000 en 5 cuotas por hitos (M1, M3, M4, M5,
            M6). Sin deuda diferida. Sin condición al seed. Si no entrega, no cobra.
          </div>
        </div>
      </section>

      {/* ── HITOS FINANCIEROS ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Hitos financieros</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {HITOS.map((h) => (
              <div
                key={h.id}
                className={`rounded-2xl p-5 ${
                  h.badge === "BE" || h.badge === "M18" || h.badge === "M36" || h.badge === "CAP"
                    ? "bg-green-50 border border-green-100"
                    : h.badge === "SEED"
                    ? "bg-blue-50 border border-blue-100"
                    : h.badge === "LATAM"
                    ? "bg-orange-50 border border-orange-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-400">{h.id} · {h.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${h.badgeColor}`}
                  >
                    {h.badge}
                  </span>
                </div>
                <p className="mb-1 font-bold text-gray-900 leading-snug">{h.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{h.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVOLUCIÓN M7-M36 ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Evolución M7–M36 · Modelo Acelerado
          </h2>
          <p className="mb-10 text-gray-500">
            3 palancas simultáneas: CAC freemium USD 20 · 200 técnicos/mes activos · 8 CGs/mes + 40
            CCs/mes
          </p>

          {/* Mini tabla de hitos clave */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="grid grid-cols-5 bg-[#0D0D0D] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Mes</span>
              <span className="text-right">Clientes</span>
              <span className="text-right">Técnicos</span>
              <span className="text-right">Revenue</span>
              <span className="text-right">Caja acum.</span>
            </div>
            {[
              { mes: "M7 · Sep-26", cli: "1.048", tec: "387", rev: "USD 21K", caja: "USD 440K", be: false },
              { mes: "M9 · Nov-26", cli: "4.671", tec: "1.623", rev: "USD 90K", caja: "USD 326K", be: false },
              { mes: "M11 · Feb-27", cli: "10.333", tec: "4.009", rev: "USD 213K", caja: "USD 329K", be: true },
              { mes: "M12 · Mar-27", cli: "13.925", tec: "5.000", rev: "USD 289K", caja: "USD 365K", be: false },
              { mes: "M18 · Sep-27", cli: "42.939", tec: "5.000", rev: "USD 993K", caja: "USD 1.386M", be: false },
              { mes: "M19 · Oct-27", cli: "47.966", tec: "5.000", rev: "USD 1.165M", caja: "USD 1.721M", be: false },
              { mes: "M25 · Abr-28", cli: "77.292", tec: "5.000", rev: "USD 2.435M", caja: "USD 5.534M", be: false },
              { mes: "M36 · Feb-29", cli: "119.591", tec: "5.000", rev: "USD 5.349M", caja: "USD 21.759M", be: false },
            ].map((row, i) => (
              <div
                key={row.mes}
                className={`grid grid-cols-5 px-6 py-4 text-sm ${
                  row.be
                    ? "bg-green-50 font-semibold"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
              >
                <span className={`font-medium ${row.be ? "text-green-800" : "text-gray-700"}`}>
                  {row.be ? "★ " : ""}{row.mes}
                </span>
                <span className="text-right text-gray-600">{row.cli}</span>
                <span className="text-right text-gray-600">{row.tec}</span>
                <span className={`text-right ${row.be ? "text-green-700" : "text-gray-600"}`}>
                  {row.rev}
                </span>
                <span className={`text-right font-semibold ${row.be ? "text-green-700" : "text-gray-900"}`}>
                  {row.caja}
                </span>
              </div>
            ))}
          </div>

          {/* Comparativa con modelo base */}
          <div className="rounded-2xl bg-[#0D0D0D] p-6 text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Comparativa: modelo base vs modelo acelerado
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { metric: "Seed requerida", base: "USD 500K", accel: "USD 500K", note: "Sin cambio" },
                { metric: "Breakeven", base: "M18", accel: "M11", note: "7 meses antes" },
                { metric: "Clientes M18", base: "7.212", accel: "42.939", note: "×6" },
                { metric: "Caja M36", base: "USD 4.97M", accel: "USD 21.74M", note: "×4.4" },
              ].map((c) => (
                <div key={c.metric} className="rounded-xl bg-gray-800 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {c.metric}
                  </p>
                  <p className="text-xs text-gray-500 line-through">{c.base}</p>
                  <p className="text-xl font-bold text-green-400">{c.accel}</p>
                  <p className="mt-1 text-xs text-gray-400">{c.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPUESTOS ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            Supuestos clave del modelo v5
          </h2>
          <ul className="space-y-3">
            {SUPUESTOS.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0D0D0D] text-xs text-white">
                  ·
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
