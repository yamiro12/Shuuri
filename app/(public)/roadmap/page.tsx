import { CheckCircle2, Circle } from 'lucide-react';

export const metadata = {
  title: 'Roadmap | SHUURI',
  description: '16 Mar → 29 Ago 2026. 24 semanas para el MVP. Hitos verificables por Blueprint.',
};

const FASES = [
  {
    nombre: 'BP0 · BP1 — Fundación',
    periodo: 'Mar – Abr 2026 (S1–S4)',
    color: 'gray' as const,
    items: [
      'Founders Agreement v5.0 firmado',
      'Contratos operativos (Crombie, Álamo, Kevin, Toro)',
      'Google Workspace + GitHub + DNS',
      'Registro marca SHUURI en INPI',
      'Odoo inicializado + pipeline activo',
      'SOPs operativos documentados',
    ],
  },
  {
    nombre: 'BP2 — Construcción técnica',
    periodo: 'Abr – Jun 2026 (S4–S12)',
    color: 'blue' as const,
    items: [
      'Crombie Fase 1: arquitectura AWS',
      'Crombie Fase 2: integración Fracttal ↔ Odoo',
      'Crombie Fase 3: motor IA de asignación y pricing',
      'Álamo: diseño UX/UI apps gastronómico + técnico',
      'Álamo: desarrollo apps MVP',
      'QA + testing end-to-end',
    ],
  },
  {
    nombre: 'BP3 — Activación y piloto',
    periodo: 'Jun – Ago 2026 (S12–S24)',
    color: 'green' as const,
    items: [
      'Onboarding técnicos piloto (red Wiltec/Fermabras)',
      'Firma clientes piloto gastronómicos',
      'Primera OT real coordinada en AMBA',
      'Analytics + monitoreo en producción',
      'Iteración basada en datos reales',
    ],
  },
];

const COLOR_HEADER: Record<string, string> = {
  gray:  'bg-gray-100 text-gray-700',
  blue:  'bg-[#EBF5FB] text-[#2698D1]',
  green: 'bg-green-50 text-green-700',
};

const HITOS = [
  { semana: 'S3 · Mar 2026',  label: 'Base legal completa',        nota: 'Founders Agreement + contratos operativos firmados',   ok: true  },
  { semana: 'S4 · Abr 2026',  label: 'Infra interna operativa',    nota: 'Odoo + Google Workspace + repositorio + SOPs',          ok: true  },
  { semana: 'S10 · May 2026', label: 'Crombie entregado',          nota: 'Middleware Fracttal ↔ Odoo + Motor IA funcionando',     ok: false },
  { semana: 'S18 · Jul 2026', label: 'Apps MVP funcionales',       nota: 'App gastronómico + técnico · QA aprobado',              ok: false },
  { semana: 'S24 · Ago 2026', label: 'Primera OT real',            nota: 'Técnico real + cliente real + OT coordinada en AMBA',  ok: false },
  { semana: 'M7 · Sep 2026',  label: 'Operación comercial abierta',nota: '28 clientes activos · 45 técnicos · Rev: USD 4.350/mes',ok: false },
];

const ROADMAP_3_ANIOS = [
  { year: 'Año 1 · 2026–2027', titulo: 'MVP · CABA/AMBA',    kpi: '300–500 clientes',    detalle: 'USD 300K–500K ARR · Validación del modelo · Breakeven M16' },
  { year: 'Año 2 · 2027–2028', titulo: 'Expansión nacional', kpi: '2.000–3.000 clientes', detalle: 'Córdoba, Rosario, Mendoza · Serie A · Producto enterprise' },
  { year: 'Año 3 · 2028–2029', titulo: 'Expansión LATAM',    kpi: '10.000+ clientes',     detalle: 'Chile, Colombia, México · API para plataformas · USD 5M ARR' },
];

const STACK_ROWS = [
  ['CMMS',              'Fracttal · gestión de técnicos y OTs'],
  ['ERP',               'Odoo · facturación y gestión comercial'],
  ['Motor propio',      'SHUURI engine · asignación IA y pricing'],
  ['Middleware',        'Crombie · integración Fracttal ↔ Odoo ↔ Motor'],
  ['Apps',              'Next.js 14 + TypeScript · panel gastronómico y técnico'],
  ['Infraestructura',   'AWS · ~USD 200/mes estimado'],
  ['Proveedores tech',  'Álamo SRL (dev) + Crombie (middleware)'],
];

type GanttCell = { label: string; cls: string } | null;

const GANTT: { tarea: string; cols: GanttCell[] }[] = [
  {
    tarea: 'Estructura legal',
    cols: [
      { label: 'Legal', cls: 'bg-amber-100 text-amber-800' },
      null, null, null, null, null,
    ],
  },
  {
    tarea: 'Odoo + infra interna',
    cols: [
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      null, null, null, null,
    ],
  },
  {
    tarea: 'Crombie · middleware',
    cols: [
      { label: 'TECH', cls: 'bg-blue-100 text-blue-800' },
      { label: 'TECH', cls: 'bg-blue-100 text-blue-800' },
      { label: 'HITO', cls: 'bg-[#2698D1] text-white' },
      null, null, null,
    ],
  },
  {
    tarea: 'Álamo · apps MVP',
    cols: [
      null,
      { label: 'TECH', cls: 'bg-blue-100 text-blue-800' },
      { label: 'TECH', cls: 'bg-blue-100 text-blue-800' },
      { label: 'TECH', cls: 'bg-blue-100 text-blue-800' },
      { label: 'HITO', cls: 'bg-[#2698D1] text-white' },
      null,
    ],
  },
  {
    tarea: 'Registro INPI',
    cols: [
      { label: 'Legal', cls: 'bg-amber-100 text-amber-800' },
      null, null, null, null, null,
    ],
  },
  {
    tarea: 'Reclut. técnicos piloto',
    cols: [
      null,
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      null, null, null,
    ],
  },
  {
    tarea: 'Clientes piloto',
    cols: [
      null, null,
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      null,
    ],
  },
  {
    tarea: 'Marketing / landing',
    cols: [
      null,
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      { label: 'OPS', cls: 'bg-green-100 text-green-800' },
      null, null,
      { label: 'HITO', cls: 'bg-[#2698D1] text-white' },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-black text-[#0D0D0D] mb-4">
            16 Mar → 29 Ago 2026. 24 semanas para el MVP.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Hoja de ruta organizada en Blueprints (BP). Cada BP tiene tareas, responsables e hitos verificables.
            El arranque operativo es Septiembre 2026.
          </p>
        </div>
      </section>

      {/* TRES FASES */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FASES.map(f => (
              <div key={f.nombre} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-4 ${COLOR_HEADER[f.color]}`}>
                  <p className="font-black text-sm">{f.nombre}</p>
                  <p className="text-xs opacity-70 mt-0.5">{f.periodo}</p>
                </div>
                <ul className="p-5 space-y-2.5">
                  {f.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GANTT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Gantt · Mar–Ago 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 w-44">Tarea</th>
                  {['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'].map(m => (
                    <th key={m} className="px-3 py-3 font-semibold text-gray-500 text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GANTT.map(row => (
                  <tr key={row.tarea} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.tarea}</td>
                    {row.cols.map((cell, i) => (
                      <td key={i} className="px-2 py-3 text-center">
                        {cell ? (
                          <span className={`inline-block text-[10px] font-semibold px-2 py-1 rounded ${cell.cls}`}>
                            {cell.label}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 inline-block" /> TECH</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 inline-block" /> LEGAL</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> OPS</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2698D1] inline-block" /> HITO</span>
          </div>
        </div>
      </section>

      {/* HITOS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Hitos verificables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HITOS.map(h => (
              <div key={h.semana} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  {h.ok
                    ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    : <Circle className="h-4 w-4 text-[#2698D1] shrink-0" />}
                  <span className="text-[#2698D1] text-xs font-semibold">{h.semana}</span>
                </div>
                <p className="font-bold text-[#0D0D0D] text-sm mb-1">{h.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{h.nota}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISIÓN 3 AÑOS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Visión a 3 años</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP_3_ANIOS.map((r, i) => (
              <div key={r.year} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
                  i === 0 ? 'bg-blue-100 text-blue-700' :
                  i === 1 ? 'bg-teal-100 text-teal-700' :
                  'bg-purple-100 text-purple-700'
                }`}>{r.year}</span>
                <p className="font-black text-[#0D0D0D] mb-1">{r.titulo}</p>
                <p className="font-bold text-[#2698D1] text-sm mb-2">{r.kpi}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{r.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK TÉCNICO */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-6">Stack técnico del MVP</h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <table className="w-full text-sm">
              <tbody>
                {STACK_ROWS.map(([capa, desc]) => (
                  <tr key={capa} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-6 font-semibold text-[#0D0D0D] w-40 align-top">{capa}</td>
                    <td className="py-3 text-gray-500">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>
  );
}
