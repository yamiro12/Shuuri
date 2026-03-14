'use client';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, LineChart,
} from 'recharts';

const CASHFLOW_DATA = [
  { mes: 'M7',  rev: 4350,   cos: 54540,  ebitda: -50190, caja: 249810  },
  { mes: 'M8',  rev: 4444,   cos: 49751,  ebitda: -45307, caja: 204503  },
  { mes: 'M9',  rev: 5764,   cos: 68674,  ebitda: -62911, caja: 141592  },
  { mes: 'M10', rev: 8252,   cos: 100726, ebitda: -92474, caja: 49119   },
  { mes: 'M11', rev: 12234,  cos: 104315, ebitda: -92081, caja: -42962  },
  { mes: 'M12', rev: 21700,  cos: 129360, ebitda: -107661,caja: -150623 },
  { mes: 'M13', rev: 45041,  cos: 163921, ebitda: -118880,caja: -269503 },
  { mes: 'M14', rev: 85706,  cos: 177297, ebitda: -91591, caja: -361094 },
  { mes: 'M15', rev: 166560, cos: 213095, ebitda: -46536, caja: -407629 },
  { mes: 'M16', rev: 292544, cos: 253936, ebitda: 38609,  caja: -369021 },
  { mes: 'M17', rev: 473276, cos: 307209, ebitda: 166067, caja: -202954 },
  { mes: 'M18', rev: 686662, cos: 370551, ebitda: 316111, caja: 113157  },
];

const MVP_BUDGET = [
  { concepto: 'Aporte Yair Levy Wald',          tipo: 'ingreso', monto: 25000 },
  { concepto: 'Aporte Sebastián Smulevich',      tipo: 'ingreso', monto: 25000 },
  { concepto: 'Legal — Founders + contratos',    tipo: 'egreso',  monto: 3500  },
  { concepto: 'C-Level (3 personas · 6 meses)',  tipo: 'egreso',  monto: 9000  },
  { concepto: 'Crombie · Middleware + Motor IA', tipo: 'egreso',  monto: 28900 },
  { concepto: 'Álamo SRL · Apps (2 meses)',      tipo: 'egreso',  monto: 20000 },
  { concepto: 'Infra: Fracttal + Odoo + AWS',    tipo: 'egreso',  monto: 7500  },
];

const HITOS = [
  { mes: 'M7 Sep-26',  titulo: 'Arranque operativo',          kpi: '28 clientes',           detalle: 'Rev: USD 4.350 · Costos: USD 54.500', highlight: false },
  { mes: 'M11 Feb-27', titulo: 'Primer mes negativo en caja', kpi: 'Caja: -USD 42.962',     detalle: 'Revenue: USD 12.234',                  highlight: false },
  { mes: 'M12 Feb-27', titulo: 'Escala visible',              kpi: '513 clientes',           detalle: 'Rev: USD 21.700',                      highlight: false },
  { mes: 'M13 Mar-27', titulo: '1.000+ clientes',             kpi: '1.030 gastronómicos',    detalle: '557 técnicos activos',                 highlight: false },
  { mes: 'M16 Jun-27', titulo: 'BREAKEVEN',                   kpi: 'EBITDA +USD 38.609',    detalle: 'Revenue: USD 292.544',                 highlight: true  },
  { mes: 'M18 Ago-27', titulo: 'Caja positiva',               kpi: 'USD 113.157 acumulado',  detalle: 'Revenue: USD 686.662',                 highlight: false },
];

const SUPUESTOS = [
  'Caja inicio M7: USD 300.000 (ronda F&F levantada)',
  'Cadena Grande: 5 locales promedio a USD 100/local/mes',
  'Cadena Chica: 2 locales promedio a USD 75/local/mes',
  'Técnicos: arrancan 45 en M7, escalan a 557 en M13',
  'Ratio repuestos/OT: 20% de las OTs requieren repuesto',
  'Conversión Freemium → pago: 10% de nuevos clientes del mes',
  'Budget marketing: 3% del revenue M7-M12, 10% desde M13',
  'Stack: Fracttal + Odoo + Motor SHUURI + Crombie middleware',
];

function fmtUSD(v: number) {
  return 'USD ' + Math.abs(Math.round(v)).toLocaleString('es-AR');
}

function fmtK(v: number) {
  return Math.round(v / 1000) + 'K';
}

interface TooltipPayload { name: string; value: number; color: string; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-bold text-[#0D0D0D] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value < 0 ? '-' : ''}{fmtUSD(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function CashflowClient() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-black text-[#0D0D0D] mb-4">
            USD 300K en caja. Breakeven en M16.
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Modelo financiero v15 · horizonte M7–M18 · CABA/AMBA.
            Proyecciones basadas en supuestos validados por entrevistas de mercado.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Capital disponible (M7)', valor: 'USD 300K',  nota: 'Ronda F&F levantada' },
              { label: 'Runway proyectado',        valor: '~8 meses', nota: 'Sin revenue adicional' },
              { label: 'Breakeven EBITDA',         valor: 'M16',      nota: '+USD 38K ese mes' },
              { label: 'Revenue M18',              valor: 'USD 687K', nota: '+USD 316K EBITDA' },
            ].map(k => (
              <div key={k.label} className="bg-gray-50 rounded-2xl p-5">
                <p className="text-xs text-gray-400 mb-1">{k.label}</p>
                <p className="text-2xl font-black text-[#0D0D0D]">{k.valor}</p>
                <p className="text-xs text-gray-500 mt-1">{k.nota}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRÁFICO PRINCIPAL */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-black text-[#0D0D0D]">Revenue vs Costos vs EBITDA</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#2698D1] inline-block" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#EF4444] inline-block" /> Costos</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#10B981] inline-block" /> EBITDA</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={288}>
            <ComposedChart data={CASHFLOW_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rev" name="Revenue" fill="#2698D1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="cos" name="Costos"  fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Line dataKey="ebitda" name="EBITDA" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* TABLA MVP */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-black text-[#0D0D0D] mb-6">Presupuesto operativo MVP · Mar–Ago 2026</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Concepto</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Monto USD</th>
                </tr>
              </thead>
              <tbody>
                {MVP_BUDGET.map(r => (
                  <tr key={r.concepto} className="border-b border-gray-50 last:border-0">
                    <td className={`px-5 py-3 ${r.tipo === 'ingreso' ? 'text-[#2698D1] font-medium' : 'text-gray-700'}`}>
                      {r.tipo === 'ingreso' ? '↑ ' : '↓ '}{r.concepto}
                    </td>
                    <td className={`px-5 py-3 text-right font-mono font-semibold ${r.tipo === 'ingreso' ? 'text-[#2698D1]' : 'text-gray-700'}`}>
                      {r.tipo === 'ingreso' ? '+' : '-'}{r.monto.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-5 py-3 text-[#0D0D0D]">Balance post-MVP</td>
                  <td className="px-5 py-3 text-right font-mono text-[#2698D1]">~+1.100</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Crombie: tramo 1 (40%) en M1, tramo 2 (40%) en M2, tramo 3 (20%) en M3. Propuesta válida hasta 9/4/2026.
          </p>
        </div>
      </section>

      {/* HITOS */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-black text-[#0D0D0D] mb-6">Hitos financieros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HITOS.map(h => (
              <div key={h.mes} className={`rounded-2xl border-2 p-5 ${h.highlight ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white shadow-sm'}`}>
                <p className="text-xs font-semibold text-[#2698D1] mb-1">{h.mes}</p>
                <p className={`font-black text-base mb-1 ${h.highlight ? 'text-green-700' : 'text-[#0D0D0D]'}`}>{h.titulo}</p>
                <p className="font-semibold text-sm text-gray-700 mb-1">{h.kpi}</p>
                <p className="text-xs text-gray-500">{h.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRÁFICO CAJA */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-black text-[#0D0D0D] mb-6">Evolución de caja acumulada</h2>
          <ResponsiveContainer width="100%" height={192}>
            <LineChart data={CASHFLOW_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" label={{ value: 'Breakeven', position: 'right', fontSize: 11, fill: '#374151' }} />
              <Line dataKey="caja" name="Caja" stroke="#2698D1" strokeWidth={2} dot={{ r: 3 }} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SUPUESTOS */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-black text-[#0D0D0D] mb-4">Supuestos clave del modelo v15</h3>
            <ul className="space-y-2">
              {SUPUESTOS.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#2698D1] mt-0.5 shrink-0">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </main>
  );
}
