'use client';

import { useState } from 'react';

export default function PitchPage() {
  const [current, setCurrent] = useState(0);
  const total = 10;

  const NAV_ITEMS = [
    '01 Problema', '02 Mercado', '03 Solución', '04 Tecnología',
    '05 Modelo', '06 Tracción', '07 Competencia', '08 Proyecciones',
    '09 Equipo', '10 El ask',
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">

        {/* Barra de navegación superior */}
        <div className="flex gap-2 flex-wrap mb-8">
          {NAV_ITEMS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrent(i)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                current === i
                  ? 'bg-[#2698D1] text-white'
                  : 'border border-gray-200 text-gray-500 hover:border-[#2698D1] hover:text-[#2698D1]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="min-h-[480px]">
          {current === 0 && <Slide1 />}
          {current === 1 && <Slide2 />}
          {current === 2 && <Slide3 />}
          {current === 3 && <Slide4 />}
          {current === 4 && <Slide5 />}
          {current === 5 && <Slide6 />}
          {current === 6 && <Slide7 />}
          {current === 7 && <Slide8 />}
          {current === 8 && <Slide9 />}
          {current === 9 && <Slide10 />}
        </div>

        {/* Navegación inferior */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="text-sm font-medium text-gray-500 hover:text-[#0D0D0D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-400">{current + 1} / {total}</span>
          <button
            onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}
            className="text-sm font-medium text-gray-500 hover:text-[#0D0D0D] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </main>
  );
}

function SlideHeader({ n, titulo }: { n: string; titulo: string }) {
  return (
    <div className="mb-6">
      <span className="text-xs font-semibold text-[#2698D1] tracking-widest uppercase">{n}</span>
      <h2 className="text-2xl lg:text-3xl font-black text-[#0D0D0D] mt-1">{titulo}</h2>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── SLIDE 1: Problema ───────────────────────────────────────────────────────

function Slide1() {
  return (
    <div>
      <SlideHeader n="01 — El problema" titulo="El servicio técnico gastronómico en Argentina está completamente fragmentado." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <p className="font-bold text-[#0D0D0D] mb-2">Para el restaurante</p>
          <p className="text-gray-500 text-sm">Cuando algo falla, no sabe a quién llamar. No tiene registro del equipo, no tiene historial. Llama por WhatsApp y espera.</p>
        </Card>
        <Card>
          <p className="font-bold text-[#0D0D0D] mb-2">Para el técnico</p>
          <p className="text-gray-500 text-sm">Pierde viajes porque nadie coordinó el repuesto. Trabaja sin sistema, sin historial del activo y cobra de forma informal.</p>
        </Card>
        <Card>
          <p className="font-bold text-[#0D0D0D] mb-2">Para el proveedor</p>
          <p className="text-gray-500 text-sm">Vende a través de canales que no puede medir. No sabe cuándo falla un equipo que necesita sus repuestos.</p>
        </Card>
        <Card className="border-[#2698D1]/30 bg-[#EBF5FB]">
          <p className="font-bold text-[#2698D1] mb-2">El resultado</p>
          <p className="text-[#2698D1] text-sm">Un mercado de USD 500M sin sistema de coordinación. Tres actores desconectados. Una oportunidad enorme.</p>
        </Card>
      </div>
    </div>
  );
}

// ─── SLIDE 2: Mercado ────────────────────────────────────────────────────────

function Slide2() {
  const nums = [
    { n: '110.000+', label: 'establecimientos gastronómicos en Argentina' },
    { n: 'USD 500M',  label: 'mercado servicios técnicos estimado' },
    { n: '20.000+',  label: 'establecimientos en CABA/AMBA (mercado inicial)' },
    { n: '475',      label: 'proveedores de equipamiento identificados' },
    { n: '~20K',     label: 'técnicos potenciales en AMBA' },
    { n: '8',        label: 'rubros técnicos cubiertos desde el día 1' },
  ];
  return (
    <div>
      <SlideHeader n="02 — El mercado" titulo="Un mercado masivo, validado y sin solución sistémica." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {nums.map(item => (
          <Card key={item.label}>
            <p className="font-black text-2xl text-[#2698D1]">{item.n}</p>
            <p className="text-gray-500 text-xs mt-1">{item.label}</p>
          </Card>
        ))}
      </div>
      <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
        <strong className="text-[#0D0D0D]">SAM:</strong> USD 150M–400M (CABA/AMBA) ·{' '}
        <strong className="text-[#0D0D0D]">SOM año 1:</strong> USD 1.5M–5M
      </p>
    </div>
  );
}

// ─── SLIDE 3: Solución ───────────────────────────────────────────────────────

function Slide3() {
  return (
    <div>
      <SlideHeader n="03 — La solución" titulo="SHUURI: el sistema operativo del servicio técnico gastronómico." />
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Una plataforma que conecta los tres actores del ecosistema de mantenimiento gastronómico en tiempo real,
        con compliance regulatorio integrado y modelo de negocio que funciona para todos.
      </p>
      <div className="space-y-3">
        {[
          { actor: 'Para restaurantes', desc: 'OTs coordinadas, historial de activos, técnicos certificados asignados automáticamente.' },
          { actor: 'Para técnicos', desc: 'Pipeline de trabajo organizado, liquidación quincenal del 70%, reputación verificable.' },
          { actor: 'Para proveedores', desc: 'Canal de venta de repuestos integrado con las OTs activas, sin esfuerzo comercial.' },
          { actor: 'Compliance como diferencial', desc: 'Bloqueo automático de técnicos sin certificación vigente. Única plataforma que lo resuelve.' },
        ].map(item => (
          <Card key={item.actor} className="flex items-start gap-4">
            <span className="shrink-0 w-2 h-2 rounded-full bg-[#2698D1] mt-1.5" />
            <div>
              <p className="font-bold text-[#0D0D0D] text-sm">{item.actor}</p>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 4: Tecnología ─────────────────────────────────────────────────────

function Slide4() {
  return (
    <div>
      <SlideHeader n="04 — Tecnología" titulo="Fracttal + Odoo + Motor SHUURI. Integrado por Crombie." />
      <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-2xl">
        SHUURI no reinventa la rueda. Usamos Fracttal como CMMS para gestionar técnicos y órdenes de trabajo,
        y Odoo como ERP para facturación, clientes y proveedores. Crombie integra ambos sistemas con el motor
        propio de SHUURI: asignación inteligente, pricing dinámico y coordinación de repuestos.
      </p>

      {/* Diagrama */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 mb-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm text-center">
              <p className="text-xs text-gray-400 font-normal">CMMS</p>
              Fracttal
            </div>
            <span className="text-gray-400 font-mono text-lg">←→</span>
            <div className="bg-white border-2 border-[#2698D1]/30 rounded-xl px-5 py-3 font-semibold text-sm text-[#2698D1] shadow-sm text-center">
              <p className="text-xs text-[#2698D1]/60 font-normal">Middleware</p>
              Crombie
            </div>
            <span className="text-gray-400 font-mono text-lg">←→</span>
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm text-center">
              <p className="text-xs text-gray-400 font-normal">ERP</p>
              Odoo
            </div>
          </div>
          <span className="text-gray-400 font-mono">↑</span>
          <div className="bg-[#EBF5FB] border border-[#2698D1]/20 rounded-xl px-5 py-3 font-semibold text-sm text-[#2698D1] shadow-sm text-center">
            <p className="text-xs text-[#2698D1]/60 font-normal">Motor propio</p>
            Motor SHUURI IA
          </div>
          <span className="text-gray-400 font-mono">↑</span>
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm text-center">
            <p className="text-xs text-gray-400 font-normal">Frontend</p>
            Apps · Next.js
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
        Costo Crombie: <strong>USD 28.900</strong> · entrega Mayo 2026 · 3 tramos
      </div>
    </div>
  );
}

// ─── SLIDE 5: Modelo de negocio ──────────────────────────────────────────────

function Slide5() {
  const streams = [
    { n: '1', label: 'Comisión por OT coordinada',     desc: '30% freemium · 25% cadena chica · 20% cadena grande' },
    { n: '2', label: 'Suscripción mensual por local',  desc: 'USD 75/local/mes · USD 100/local/mes' },
    { n: '3', label: 'Comisión marketplace repuestos', desc: '15% sobre valor de cada orden de compra' },
    { n: '4', label: 'Comisión marketplace insumos',   desc: '10% sobre venta de productos e insumos' },
    { n: '5', label: 'ShuuriPro — proveedores premium',desc: 'USD 1.600/mes · comisión 0% · API abierta' },
    { n: '6', label: 'SaaS grandes cadenas',           desc: 'Suscripción fija por activo · cadenas 10+ locales' },
  ];
  return (
    <div>
      <SlideHeader n="05 — Modelo de negocio" titulo="6 streams de ingreso. Transaccional + SaaS recurrente." />
      <div className="space-y-2 mb-6">
        {streams.map(s => (
          <div key={s.n} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <span className="font-black text-[#2698D1] w-4 shrink-0">{s.n}.</span>
            <div>
              <p className="font-semibold text-[#0D0D0D] text-sm">{s.label}</p>
              <p className="text-gray-500 text-xs">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Tier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Precio</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Comisión OT</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Freemium',     'USD 0',              '30%'],
              ['Cadena Chica', 'USD 75/local/mes',   '25%'],
              ['Cadena Grande','USD 100/local/mes',  '20%'],
            ].map(([tier, precio, com]) => (
              <tr key={tier} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-semibold text-[#0D0D0D]">{tier}</td>
                <td className="px-4 py-3 text-[#2698D1] font-medium">{precio}</td>
                <td className="px-4 py-3 font-mono text-gray-700">{com}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SLIDE 6: Tracción ───────────────────────────────────────────────────────

function Slide6() {
  const items = [
    '30+ entrevistas con dueños de restaurantes validando el problema',
    'Red de técnicos de Wiltec/Fermabras (Sebi) como primer pool',
    'Crombie contratado · USD 28.900 · entrega May-26',
    'Álamo SRL activo · desarrollo apps en curso',
    'Founders Agreement firmado · base legal completa',
    'Registro marca SHUURI en INPI iniciado',
  ];
  return (
    <div>
      <SlideHeader n="06 — Tracción" titulo="En construcción. Los números que importan ya están." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {items.map(item => (
          <Card key={item}>
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </Card>
        ))}
      </div>
      <div className="bg-blue-50 border border-[#2698D1]/20 rounded-xl px-4 py-3 text-sm text-[#2698D1]">
        Piloto objetivo: primera OT con técnico y cliente real en <strong>Agosto 2026</strong>.
      </div>
    </div>
  );
}

// ─── SLIDE 7: Competencia ────────────────────────────────────────────────────

function Slide7() {
  const items = [
    { titulo: 'Competencia real hoy: el técnico de confianza sin sistema', desc: 'No hay un competidor directo. El mercado funciona con relaciones informales y WhatsApp.' },
    { titulo: 'GetNinjas / Workana: generalistas, sin certificaciones, sin gastronomía', desc: 'No tienen compliance, no entienden la industria, no coordinan repuestos.' },
    { titulo: 'ERPs y CMMS: herramientas internas, no marketplaces de coordinación', desc: 'Fracttal y Odoo son nuestros aliados tecnológicos, no competidores.' },
    { titulo: 'Por qué SHUURI gana: especialización + compliance + modelo mandato', desc: 'La combinación de industria específica + compliance + fiscalidad resuelta es única.' },
  ];
  return (
    <div>
      <SlideHeader n="07 — Competencia" titulo="No existe un competidor directo. La competencia es el caos." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => (
          <Card key={item.titulo}>
            <p className="font-bold text-[#0D0D0D] text-sm mb-2">{item.titulo}</p>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 8: Proyecciones ───────────────────────────────────────────────────

function Slide8() {
  const rows = [
    { mes: 'M7 Sep-26',  estado: 'Arranque',     clientes: '28 clientes',         extra: 'Rev USD 4.350',         highlight: false },
    { mes: 'M12 Feb-27', estado: 'Escala',        clientes: '513 clientes',        extra: 'Rev USD 21.700',        highlight: false },
    { mes: 'M13 Mar-27', estado: '1K+ clientes',  clientes: '1.030 gastronómicos', extra: '557 técnicos activos',  highlight: false },
    { mes: 'M16 Jun-27', estado: 'BREAKEVEN',     clientes: 'EBITDA +USD 38.600',  extra: '—',                     highlight: true  },
    { mes: 'M18 Ago-27', estado: 'Caja positiva', clientes: 'USD 113K acumulado',  extra: 'Rev USD 687K',          highlight: false },
  ];
  return (
    <div>
      <SlideHeader n="08 — Proyecciones" titulo="Breakeven en M16. Caja positiva en M18." />
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Mes', 'Estado', 'Métrica principal', 'Detalle'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.mes} className={`border-b border-gray-50 last:border-0 ${r.highlight ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs text-[#2698D1] font-semibold">{r.mes}</td>
                <td className="px-4 py-3 font-bold text-[#0D0D0D]">{r.estado}</td>
                <td className="px-4 py-3 text-gray-700">{r.clientes}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.extra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SLIDE 9: Equipo ─────────────────────────────────────────────────────────

function Slide9() {
  const members = [
    { initials: 'YL', name: 'Yair Levy Wald',      role: 'CEO & Co-Founder',      tags: ['Estrategia', 'Go-to-market'],     color: 'bg-blue-50 text-blue-800' },
    { initials: 'SS', name: 'Sebastián Smulevich',  role: 'Co-Founder / Ops',      tags: ['Red técnicos', 'Industria'],       color: 'bg-teal-50 text-teal-800' },
    { initials: 'KT', name: 'Kevin T.',              role: 'CTO · Álamo SRL',       tags: ['Fracttal', 'Odoo', 'Motor IA'],   color: 'bg-amber-50 text-amber-800' },
    { initials: 'HS', name: 'Hernán S. (Toro)',     role: 'CFO',                   tags: ['Finanzas', 'Modeling'],           color: 'bg-gray-100 text-gray-700' },
  ];
  return (
    <div>
      <SlideHeader n="09 — El equipo" titulo="Experiencia en el problema, no alrededor de él." />
      <div className="grid grid-cols-2 gap-4">
        {members.map(m => (
          <Card key={m.name} className="flex items-start gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shrink-0 ${m.color}`}>
              {m.initials}
            </div>
            <div>
              <p className="font-bold text-[#0D0D0D] text-sm">{m.name}</p>
              <p className="text-[#2698D1] text-xs font-medium mb-2">{m.role}</p>
              <div className="flex flex-wrap gap-1">
                {m.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 10: El ask ────────────────────────────────────────────────────────

function Slide10() {
  return (
    <div>
      <SlideHeader n="10 — El ask" titulo="Buscamos USD 300K para operar 24 meses hasta el breakeven." />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { valor: 'USD 300K',    label: 'Capital buscado' },
          { valor: '24 meses',   label: 'Runway proyectado' },
          { valor: 'Equity',     label: 'A conversar' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="font-black text-2xl text-[#2698D1]">{item.valor}</p>
            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Rubro', 'Monto estimado', '% del total'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Crombie middleware',        'USD 28.900',  '10%'],
              ['Álamo desarrollo apps',     '~USD 120K',   '40%'],
              ['RRHH C-Level 24 meses',     '~USD 60K',    '20%'],
              ['Legal + compliance',        '~USD 30K',    '10%'],
              ['Infra digital + marketing', '~USD 60K',    '20%'],
            ].map(([rubro, monto, pct]) => (
              <tr key={rubro} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-medium text-[#0D0D0D]">{rubro}</td>
                <td className="px-4 py-3 text-[#2698D1] font-mono font-semibold">{monto}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#EBF5FB] rounded-xl p-6 text-center">
        <p className="font-semibold text-[#2698D1] text-sm">
          yair@levywald.com · +54 9 11 5014 8932 · shuuri.levywald.com
        </p>
      </div>
    </div>
  );
}
