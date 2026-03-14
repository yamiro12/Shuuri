import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Equipo | SHUURI',
  description: 'El equipo fundador de SHUURI: experiencia en gastronomía, tecnología y gestión.',
};

const TEAM = [
  {
    initials: 'YL',
    name: 'Yair Levy Wald',
    role: 'CEO & Co-Founder',
    color: 'blue' as const,
    bio: 'Empresario y estratega. Especialista en lanzamiento y escalado de marcas en Argentina y LatAm. Fundador de Levy Wald CMO. Director externo de marketing para PyMEs retail.',
    tags: ['Estrategia comercial', 'Marketing', 'Ventas', 'Go-to-market'],
    contact: 'yair@levywald.com',
    equity: '35.75% → 43.25%',
  },
  {
    initials: 'SS',
    name: 'Sebastián Smulevich',
    role: 'Co-Founder / Operaciones',
    color: 'teal' as const,
    bio: 'Background en Wiltec y Fermabras, dos empresas de servicios técnicos para equipamiento gastronómico. Entiende el mercado desde adentro: técnicos, proveedores y dueños de locales.',
    tags: ['Industria gastronómica', 'Red de técnicos', 'Proveedores', 'Operaciones'],
    equity: '33.25%',
  },
  {
    initials: 'KT',
    name: 'Kevin T.',
    role: 'CTO · Álamo SRL',
    color: 'amber' as const,
    bio: 'Lidera el desarrollo técnico a través de Álamo SRL. Responsable de la arquitectura, integración Fracttal ↔ Odoo y el motor SHUURI de asignación inteligente.',
    tags: ['Arquitectura', 'Fracttal', 'Odoo', 'Motor IA', 'Next.js'],
    equity: '1.5% → 5%',
  },
  {
    initials: 'HS',
    name: 'Hernán S. (Toro)',
    role: 'CFO',
    color: 'gray' as const,
    bio: 'Modelo financiero v15, proyecciones a 36 meses y estructura de costos. Maneja el cashflow operativo y la relación con inversores.',
    tags: ['Finanzas', 'Modeling', 'Cashflow', 'Inversores'],
    equity: '1.5% → 3.5%',
  },
  {
    initials: 'KA',
    name: 'Kate',
    role: 'Legal & Compliance',
    color: 'red' as const,
    bio: 'Estructura legal completa de SHUURI: contratos con técnicos y proveedores, modelo mandato, INPI, Founders Agreement y política de privacidad.',
    tags: ['Contratos', 'Modelo mandato', 'INPI', 'Compliance'],
    equity: undefined,
    contact: undefined,
  },
];

const COLOR_MAP = {
  blue:  { avatar: 'bg-blue-50 text-blue-800' },
  teal:  { avatar: 'bg-teal-50 text-teal-800' },
  amber: { avatar: 'bg-amber-50 text-amber-800' },
  gray:  { avatar: 'bg-gray-100 text-gray-700' },
  red:   { avatar: 'bg-red-50 text-red-800' },
};

const CAP_TABLE = [
  { name: 'Yair Levy Wald',      pct: 43.25, note: '',                  main: true },
  { name: 'Sebastián Smulevich', pct: 33.25, note: '',                  main: true },
  { name: 'Founders Pool',       pct: 13,    note: 'Pendiente asig.',   main: false },
  { name: 'ESOP',                pct: 15,    note: 'Pendiente asig.',   main: false },
  { name: 'Kevin T.',            pct: 5,     note: '→ 5% post-vesting', main: true },
  { name: 'Hernán S.',           pct: 3.5,   note: '→ 3.5% post-vesting', main: true },
];

const PARTNERS = [
  { name: 'Crombie',            desc: 'Middleware + Motor IA · USD 28.900 · entrega May-26' },
  { name: 'Álamo SRL',          desc: 'Desarrollo apps · USD 10.000/mes · Kevin T.' },
  { name: 'Fausto Geremia',     desc: 'Abogado estructurador · contratos y PI' },
  { name: 'Wiltec / Fermabras', desc: 'Red técnica y operativa · piloto AMBA' },
];

const STACK = [
  { name: 'Fracttal',              desc: 'CMMS · Gestión de mantenimiento y técnicos',       badge: 'CMMS',     badgeCls: 'bg-teal-100 text-teal-700' },
  { name: 'Odoo',                  desc: 'ERP · Facturación, clientes y proveedores',          badge: 'ERP',      badgeCls: 'bg-blue-100 text-blue-700' },
  { name: 'Motor SHUURI',          desc: 'Asignación IA, pricing y coordinación',              badge: 'Motor',    badgeCls: 'bg-purple-100 text-purple-700' },
  { name: 'Crombie',               desc: 'Middleware de integración Fracttal ↔ Odoo ↔ Motor', badge: 'Middleware',badgeCls: 'bg-orange-100 text-orange-700' },
  { name: 'Next.js + TypeScript',  desc: 'Frontend de paneles y sitio público',                badge: 'Frontend', badgeCls: 'bg-gray-100 text-gray-700' },
  { name: 'AWS',                   desc: 'Infraestructura cloud · ~USD 200/mes estimado',      badge: 'Infra',    badgeCls: 'bg-yellow-100 text-yellow-700' },
];

export default function EquipoPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <span className="inline-block text-xs font-semibold bg-blue-50 text-[#2698D1] px-3 py-1 rounded-full mb-4">
            Equipo fundador · Marzo 2026
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0D0D0D] mb-4">
            Las personas detrás de SHUURI
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Combinamos experiencia en operaciones gastronómicas, tecnología y gestión financiera.
            Entendemos el problema porque lo vivimos de cerca.
          </p>
        </div>
      </section>

      {/* GRID MIEMBROS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((m) => {
              const colors = COLOR_MAP[m.color];
              return (
                <div key={m.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shrink-0 ${colors.avatar}`}>
                      {m.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0D0D0D] leading-tight">{m.name}</p>
                      <p className="text-[#2698D1] text-sm font-medium">{m.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mt-2">{m.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {m.equity && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                        Equity: {m.equity}
                      </span>
                    )}
                    {m.contact && (
                      <a href={`mailto:${m.contact}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#2698D1] transition-colors">
                        <Mail className="h-3 w-3" />{m.contact}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAP TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-2">Estructura de equity</h2>
          <p className="text-gray-500 text-sm mb-8">
            Porcentajes post-vesting. La flecha indica el target al completar el período.
          </p>
          <div className="space-y-3">
            {CAP_TABLE.map(row => (
              <div key={row.name} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <span className="w-48 font-medium text-sm text-[#0D0D0D] shrink-0">{row.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${row.main ? 'bg-[#2698D1]' : 'bg-gray-300'}`}
                    style={{ width: `${(row.pct / 43.25) * 100}%` }}
                  />
                </div>
                <span className="text-[#2698D1] font-semibold text-sm w-32 text-right shrink-0">
                  {row.pct}%{row.note ? <span className="text-gray-400 font-normal text-xs ml-1">{row.note}</span> : null}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Founders Pool y ESOP pendientes de asignación.</p>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Partners técnicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PARTNERS.map(p => (
              <div key={p.name} className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-[#0D0D0D] mb-1">{p.name}</p>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Stack tecnológico</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STACK.map(s => (
              <div key={s.name} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badgeCls}`}>{s.badge}</span>
                </div>
                <p className="font-semibold text-[#0D0D0D] text-sm">{s.name}</p>
                <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
