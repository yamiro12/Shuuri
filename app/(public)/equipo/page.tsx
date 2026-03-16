"use client"

import type { Metadata } from "next"

// No se puede exportar metadata desde un Client Component
// Mover a layout o usar generateMetadata si hace falta SSR

const TEAM = [
  {
    initials: "YL",
    name: "Yair Levy Wald",
    role: "CEO & Co-Founder",
    bio: "Empresario y estratega. Especialista en lanzamiento y escalado de marcas en Argentina y LatAm. Fundador de Levy Wald CMO. Director externo de marketing para PyMEs retail.",
    tags: ["Estrategia comercial", "Marketing", "Ventas", "Go-to-market"],
    equity: "45%",
    equityNote: "fundacional → 36% post F&F",
    contact: "yair@levywald.com",
  },
  {
    initials: "SS",
    name: "Sebastián Smulevich",
    role: "Co-Founder · COO",
    bio: "Background en Wiltec y Fermabras, dos empresas de servicios técnicos para equipamiento gastronómico. Entiende el mercado desde adentro: técnicos, proveedores y dueños de locales.",
    tags: ["Industria gastronómica", "Red de técnicos", "Proveedores", "Operaciones"],
    equity: "35%",
    equityNote: "fundacional → 28% post F&F",
    contact: null,
  },
  {
    initials: "KT",
    name: "Kevin T.",
    role: "CTO · Álamo SRL",
    bio: "Lidera el desarrollo técnico. Responsable de la arquitectura del Motor OT propio (Duotach), la integración con Odoo y las apps de Álamo SRL.",
    tags: ["Arquitectura", "Odoo", "Motor IA", "Next.js"],
    equity: "5%",
    equityNote: "personal · vesting 4a/cliff 1a",
    contact: null,
  },
  {
    initials: "HS",
    name: "Hernán S. (Toro)",
    role: "CFO",
    bio: "Modelo financiero v5, proyecciones a 36 meses y estructura de costos. Maneja el cashflow operativo y la relación con inversores.",
    tags: ["Finanzas", "Modeling", "Cashflow", "Inversores"],
    equity: "3%",
    equityNote: "vesting 3a/cliff 6m",
    contact: null,
  },
  {
    initials: "KA",
    name: "Kate",
    role: "Legal & Compliance",
    bio: "Estructura legal completa de SHUURI: contratos con técnicos y proveedores, modelo mandato, INPI, Founders Agreement v5 y política de privacidad.",
    tags: ["Contratos", "Modelo mandato", "INPI", "Compliance"],
    equity: null,
    equityNote: null,
    contact: null,
  },
]

const CAP_TABLE = [
  { name: "Yair Levy Wald", pct: 45.0, pct_post: 36.0, bar: 45, note: "CEO · base + 10% rol" },
  { name: "Sebastián Smulevich", pct: 35.0, pct_post: 28.0, bar: 35, note: "COO · base" },
  { name: "Pool C-Levels futuros", pct: 5.0, pct_post: 4.0, bar: 5, note: "CAIO · COO ext · CSO · CMO" },
  { name: "Pool RRHH", pct: 4.2, pct_post: 3.4, bar: 4.2, note: "Empleados clave" },
  { name: "Kevin T.", pct: 5.0, pct_post: 4.0, bar: 5, note: "CTO personal · vesting 4a" },
  { name: "Toro (CFO)", pct: 3.0, pct_post: 2.4, bar: 3, note: "vesting 3a/cliff 6m" },
  { name: "Duotach", pct: 2.8, pct_post: 2.2, bar: 2.8, note: "Sweat equity · SAFE" },
  { name: "F&F Inversores (post seed)", pct: 0, pct_post: 20.0, bar: 0, note: "USD 500K @ USD 2M pre-money" },
]

const PARTNERS = [
  {
    name: "Duotach",
    desc: "Motor OT propio · 160h/mes · USD 5.600/mes + sweat equity 2.8%",
    tag: "Tech principal",
  },
  {
    name: "Álamo SRL",
    desc: "Desarrollo apps gastronómico + técnico + UI/UX + Odoo · USD 20K por hitos MVP",
    tag: "Apps & Odoo",
  },
  {
    name: "Fausto Geremia",
    desc: "Abogado estructurador · contratos, PI, Delaware y FA v5",
    tag: "Legal",
  },
  {
    name: "Wiltec / Fermabras",
    desc: "Red técnica y operativa · piloto AMBA · red de Sebi",
    tag: "Operaciones",
  },
]

const STACK = [
  { layer: "Motor OT", tech: "Duotach", desc: "Motor de Órdenes de Trabajo — activo propio" },
  { layer: "ERP", tech: "Odoo Enterprise", desc: "Facturación, clientes, proveedores" },
  { layer: "IA / asignación", tech: "Anthropic Claude API", desc: "Matching técnico-OT, soporte automático" },
  { layer: "Apps", tech: "Next.js + TypeScript", desc: "Paneles gastronómico y técnico" },
  { layer: "Infra", tech: "AWS + Vercel", desc: "~USD 200/mes estimado" },
]

export default function EquipoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="border-b border-gray-100 px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2698D1]">
            Equipo fundador · Marzo 2026
          </p>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Las personas detrás de SHUURI
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 leading-relaxed">
            Combinamos experiencia en operaciones gastronómicas, tecnología y gestión financiera.
            Entendemos el problema porque lo vivimos de cerca.
          </p>
        </div>
      </section>

      {/* ── TEAM CARDS ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                {/* Avatar */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0D0D0D] text-sm font-bold text-white">
                    {m.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{m.name}</p>
                    <p className="text-sm text-[#2698D1] font-medium">{m.role}</p>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-500 leading-relaxed">{m.bio}</p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Equity + contact */}
                {m.equity && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400">
                      Equity:{" "}
                      <span className="font-bold text-gray-700">{m.equity}</span>
                      {m.equityNote && (
                        <span className="text-gray-400"> · {m.equityNote}</span>
                      )}
                    </p>
                    {m.contact && (
                      <a
                        href={`mailto:${m.contact}`}
                        className="mt-1 block text-xs text-[#2698D1] hover:underline"
                      >
                        {m.contact}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAP TABLE ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Estructura de equity</h2>
          <p className="mb-8 text-gray-500 text-sm">
            Cap table v5 · Yair 45% / Sebi 35% / Pools 9.2% / Kevin 5% / Toro 3% / Duotach 2.8%
          </p>

          <div className="space-y-3">
            {CAP_TABLE.map((row) => (
              <div key={row.name} className="flex items-center gap-4">
                <div className="w-48 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{row.name}</p>
                  <p className="text-xs text-gray-400">{row.note}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2698D1] transition-all"
                      style={{ width: `${Math.min(row.bar * 2, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">
                    {row.pct > 0 ? `${row.pct}%` : "—"}
                  </span>
                  {row.pct_post > 0 && row.pct !== row.pct_post && (
                    <p className="text-xs text-gray-400">→ {row.pct_post}% post F&F</p>
                  )}
                  {row.pct === 0 && row.pct_post > 0 && (
                    <p className="text-xs text-gray-400">→ {row.pct_post}% post F&F</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 px-5 py-4 text-sm text-blue-700">
            <strong>Seed ronda M7:</strong> USD 500.000 @ USD 2M pre-money → inversores reciben
            20% post-dilución. Todos los actores actuales se diluyen proporcionalmente.
          </div>
        </div>
      </section>

      {/* ── PARTNERS TÉCNICOS ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Partners técnicos y legales</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PARTNERS.map((p) => (
              <div key={p.name} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-bold text-gray-900">{p.name}</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK TECNOLÓGICO ── */}
      <section className="border-t border-gray-100 bg-[#0D0D0D] px-6 py-20 text-white md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold">Stack tecnológico</h2>
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            {STACK.map((row, i) => (
              <div
                key={row.layer}
                className={`flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:gap-6 ${
                  i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                }`}
              >
                <p className="w-36 text-xs font-semibold uppercase tracking-wider text-gray-400 flex-shrink-0">
                  {row.layer}
                </p>
                <p className="font-semibold text-white">{row.tech}</p>
                <p className="text-sm text-gray-400 md:ml-auto">{row.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-600 text-center">
            Sin Crombie · Sin Fracttal · Motor OT es activo propio de SHUURI
          </p>
        </div>
      </section>
    </main>
  )
}
