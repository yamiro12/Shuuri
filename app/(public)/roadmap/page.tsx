import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roadmap | SHUURI",
  description:
    "Hoja de ruta SHUURI · MVP M1-M6 · Seed M7 · Breakeven M11 · 42.939 clientes M18 · País M19",
}

const GANTT = [
  { tarea: "Estructura legal + contratos", mar: "Legal", abr: "", may: "", jun: "", jul: "", ago: "" },
  { tarea: "Infra interna (Odoo + GWS + SOPs)", mar: "OPS", abr: "OPS", may: "", jun: "", jul: "", ago: "" },
  { tarea: "Duotach · Motor OT propio", mar: "TECH", abr: "TECH", may: "HITO", jun: "", jul: "", ago: "" },
  { tarea: "Álamo · Apps gastro + técnico", mar: "", abr: "TECH", may: "TECH", jun: "TECH", jul: "HITO", ago: "" },
  { tarea: "Registro INPI", mar: "Legal", abr: "", may: "", jun: "", jul: "", ago: "" },
  { tarea: "Reclutamiento técnicos piloto", mar: "", abr: "OPS", may: "OPS", jun: "", jul: "", ago: "" },
  { tarea: "Clientes piloto (Guapaletas + CGs)", mar: "", abr: "", may: "OPS", jun: "OPS", jul: "OPS", ago: "" },
  { tarea: "Marketing / landing", mar: "", abr: "OPS", may: "OPS", jun: "", jul: "", ago: "HITO" },
]

const CELL_STYLES: Record<string, string> = {
  TECH: "bg-blue-100 text-blue-800 text-xs font-semibold rounded px-2 py-1",
  Legal: "bg-purple-100 text-purple-800 text-xs font-semibold rounded px-2 py-1",
  OPS: "bg-yellow-100 text-yellow-800 text-xs font-semibold rounded px-2 py-1",
  HITO: "bg-green-200 text-green-900 text-xs font-bold rounded px-2 py-1",
  "": "text-gray-200 text-xs",
}

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="border-b border-gray-100 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#2698D1]">
            Roadmap
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            16 Mar → 29 Ago 2026.
            <br />
            24 semanas para el MVP.
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 leading-relaxed">
            Hoja de ruta organizada en Blueprints (BP). Cada BP tiene tareas, responsables e hitos
            verificables. El arranque operativo es Septiembre 2026.
          </p>
        </div>
      </section>

      {/* ── BPs ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                bp: "BP0 · BP1 — Fundación",
                period: "Mar – Abr 2026 (S1–S4)",
                items: [
                  "Founders Agreement v5.0 firmado",
                  "Contratos operativos (Álamo, Duotach, Kevin, Toro)",
                  "Google Workspace + GitHub + DNS",
                  "Registro marca SHUURI en INPI",
                  "Odoo inicializado + pipeline activo",
                  "SOPs operativos documentados",
                ],
              },
              {
                bp: "BP2 — Construcción técnica",
                period: "Abr – Jun 2026 (S4–S12)",
                items: [
                  "Duotach Fase 1: Motor OT core (M1-M2)",
                  "Duotach Fase 2: Gestión técnicos (M3)",
                  "Duotach Fase 3: Gestión gastros + App móvil (M4-M5)",
                  "Álamo: diseño UX/UI apps gastronómico + técnico",
                  "Álamo: desarrollo apps por hitos",
                  "QA + testing end-to-end",
                ],
              },
              {
                bp: "BP3 — Activación y piloto",
                period: "Jun – Ago 2026 (S12–S24)",
                items: [
                  "Onboarding técnicos piloto (red Wiltec/Fermabras)",
                  "Firma clientes piloto gastronómicos (Guapaletas + 6 más)",
                  "Primera OT real coordinada en AMBA",
                  "Analytics + monitoreo en producción",
                  "Iteración basada en datos reales",
                ],
              },
            ].map((bp) => (
              <div key={bp.bp} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <p className="mb-1 font-bold text-gray-900">{bp.bp}</p>
                <p className="mb-4 text-xs font-medium text-[#2698D1]">{bp.period}</p>
                <ul className="space-y-2">
                  {bp.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-gray-600">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GANTT ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Gantt · Mar–Ago 2026</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0D0D0D]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 w-64">
                    Tarea
                  </th>
                  {["Mar", "Abr", "May", "Jun", "Jul", "Ago"].map((m) => (
                    <th
                      key={m}
                      className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GANTT.map((row, i) => (
                  <tr key={row.tarea} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.tarea}</td>
                    {[row.mar, row.abr, row.may, row.jun, row.jul, row.ago].map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {cell ? (
                          <span className={CELL_STYLES[cell]}>{cell}</span>
                        ) : (
                          <span className="text-gray-200">·</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap text-xs">
            {[
              { label: "TECH", cls: "bg-blue-100 text-blue-800" },
              { label: "LEGAL", cls: "bg-purple-100 text-purple-800" },
              { label: "OPS", cls: "bg-yellow-100 text-yellow-800" },
              { label: "HITO", cls: "bg-green-200 text-green-900 font-bold" },
            ].map((l) => (
              <span key={l.label} className={`rounded px-2 py-1 font-medium ${l.cls}`}>
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HITOS VERIFICABLES ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Hitos verificables</h2>
          <div className="space-y-4">
            {[
              {
                id: "S3 · Mar-26",
                title: "Base legal completa",
                desc: "Founders Agreement v5 + contratos operativos (Álamo hitos, Duotach SAFE, Kevin equity, Toro equity) firmados",
                star: false,
                latam: false,
              },
              {
                id: "S4 · Abr-26",
                title: "Infra interna operativa",
                desc: "Odoo + Google Workspace + repositorio + SOPs. Pipeline CGs activo con Sebi.",
                star: false,
                latam: false,
              },
              {
                id: "M3 · May-26",
                title: "Motor OT core entregado",
                desc: "Duotach: Motor OT + gestión técnicos funcionando. Álamo hito M3 USD 5K liberado.",
                star: false,
                latam: false,
              },
              {
                id: "M4 · Jun-26",
                title: "Apps MVP funcionales",
                desc: "Álamo entrega apps gastronómico + técnico. OT end-to-end sin errores. Guapaletas como primer CG.",
                star: false,
                latam: false,
              },
              {
                id: "M6 · Ago-26",
                title: "Primera OT real + MVP cerrado",
                desc: "7+ clientes pagando · Revenue USD 3.500/mes · Caja fin MVP USD 16.975 · Pitch deck listo",
                star: false,
                latam: false,
              },
              {
                id: "M7 · Sep-26",
                title: "★ SEED USD 500K · Operación comercial abierta",
                desc: "3 palancas activas · Pauta USD 20K · 2 comerciales B2B · 200 técnicos/mes reclutados",
                star: true,
                latam: false,
              },
              {
                id: "M11 · Feb-27",
                title: "★ BREAKEVEN EBITDA",
                desc: "10.333 clientes activos · Revenue USD 213K · EBITDA positivo por primera vez",
                star: true,
                latam: false,
              },
              {
                id: "M12 · Mar-27",
                title: "★ 5.000 técnicos · Cap Argentina",
                desc: "13.925 clientes · Cap de técnicos en Argentina alcanzado",
                star: true,
                latam: false,
              },
              {
                id: "M18 · Sep-27",
                title: "★ 42.939 clientes · Revenue USD 993K",
                desc: "Objetivo 15.000 superado ×2.8 · Caja USD 1.385M acumulada",
                star: true,
                latam: false,
              },
              {
                id: "M19 · Oct-27",
                title: "✈ Apertura País 1",
                desc: "Setup USD 30K · Estructura LATAM activa · Revenue USD 1.165M",
                star: false,
                latam: true,
              },
            ].map((h) => (
              <div
                key={h.id}
                className={`flex gap-4 rounded-2xl p-5 ${
                  h.star
                    ? "bg-green-50 border border-green-100"
                    : h.latam
                    ? "bg-orange-50 border border-orange-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex-shrink-0 text-right w-28">
                  <p className="text-xs font-mono font-semibold text-gray-400">{h.id}</p>
                </div>
                <div>
                  <p
                    className={`font-bold ${
                      h.star ? "text-green-800" : h.latam ? "text-orange-800" : "text-gray-900"
                    }`}
                  >
                    {h.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIÓN A 3 AÑOS ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Visión a 3 años</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                year: "Año 1 · 2026–2027",
                sub: "MVP · CABA/AMBA",
                stat: "42.939 clientes",
                desc: "Breakeven M11 · Revenue USD 993K en M18 · 5.000 técnicos · País 1 abierto en M19",
                highlight: false,
              },
              {
                year: "Año 2 · 2027–2028",
                sub: "Expansión LATAM",
                stat: "77.000+ clientes",
                desc: "2 países LATAM · Revenue USD 2.4M/mes · Caja USD 5.5M · Serie A",
                highlight: true,
              },
              {
                year: "Año 3 · 2028–2029",
                sub: "Escala regional",
                stat: "119.000+ clientes",
                desc: "3 países LATAM · Revenue USD 5.3M/mes · Caja USD 21.7M · USD 5M ARR",
                highlight: false,
              },
            ].map((y) => (
              <div
                key={y.year}
                className={`rounded-2xl p-8 ${
                  y.highlight ? "bg-[#0D0D0D] text-white" : "bg-white border border-gray-100"
                }`}
              >
                <p
                  className={`mb-1 text-sm font-bold ${
                    y.highlight ? "text-[#2698D1]" : "text-gray-400"
                  }`}
                >
                  {y.year}
                </p>
                <p className={`mb-2 text-xs ${y.highlight ? "text-gray-400" : "text-gray-400"}`}>
                  {y.sub}
                </p>
                <p
                  className={`mb-4 text-2xl font-bold ${
                    y.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {y.stat}
                </p>
                <p className={`text-sm leading-relaxed ${y.highlight ? "text-gray-300" : "text-gray-500"}`}>
                  {y.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK TÉCNICO ── */}
      <section className="border-t border-gray-100 bg-[#0D0D0D] px-6 py-20 text-white md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold">Stack técnico del MVP</h2>
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            {[
              { layer: "Motor OT propio", tech: "Duotach", desc: "Motor de Órdenes de Trabajo — activo intelectual de SHUURI desde M1" },
              { layer: "ERP", tech: "Odoo Enterprise", desc: "Facturación, clientes, proveedores y comisiones" },
              { layer: "Apps gastronómico + técnico", tech: "Next.js + TypeScript · Álamo SRL", desc: "Paneles web + app móvil · desarrollo por hitos M1-M6" },
              { layer: "Infraestructura", tech: "AWS + Vercel", desc: "~USD 200/mes · escalable automáticamente" },
              { layer: "IA / asignación", tech: "Anthropic Claude API", desc: "Matching técnico-OT, clasificación, soporte automático" },
              { layer: "Proveedores tech", tech: "Duotach (Motor) · Álamo SRL (Apps)", desc: "Sin Crombie · Sin Fracttal · Todo es activo propio" },
            ].map((row, i) => (
              <div
                key={row.layer}
                className={`flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:gap-6 ${
                  i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                }`}
              >
                <p className="w-48 text-xs font-semibold uppercase tracking-wider text-gray-400 flex-shrink-0">
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
