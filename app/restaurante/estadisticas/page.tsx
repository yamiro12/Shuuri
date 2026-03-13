"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { RESTAURANTES, OTS, LIQUIDACIONES } from '@/data/mock';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Wrench, DollarSign, Clock,
  CheckCircle2, AlertTriangle, Star, ArrowUpRight,
} from 'lucide-react';

// ─── DATOS MOCK HISTÓRICOS ────────────────────────────────────────────────────

const MESES_OTS = [
  { mes: 'Sep', ots: 2, gasto: 180 },
  { mes: 'Oct', ots: 1, gasto: 95 },
  { mes: 'Nov', ots: 3, gasto: 410 },
  { mes: 'Dic', ots: 1, gasto: 130 },
  { mes: 'Ene', ots: 4, gasto: 520 },
  { mes: 'Feb', ots: 2, gasto: 240 },
  { mes: 'Mar', ots: 1, gasto: 90 },
];

const RUBROS_DIST = [
  { name: 'Frío comercial',    value: 5, color: '#2698D1' },
  { name: 'Calor / gas',       value: 3, color: '#0D0D0D' },
  { name: 'Café / bebidas',    value: 2, color: '#94a3b8' },
  { name: 'Lavado industrial', value: 2, color: '#64748b' },
  { name: 'Otros',             value: 2, color: '#cbd5e1' },
];

const TIEMPO_RESOLUCION = [
  { mes: 'Sep', dias: 3.2 },
  { mes: 'Oct', dias: 2.8 },
  { mes: 'Nov', dias: 4.1 },
  { mes: 'Dic', dias: 2.5 },
  { mes: 'Ene', dias: 3.8 },
  { mes: 'Feb', dias: 2.1 },
  { mes: 'Mar', dias: 1.9 },
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

function TooltipCustom({ active, payload, label, prefix = '', suffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-white px-3 py-2.5 shadow-lg text-xs">
      <p className="font-bold text-gray-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {prefix}{p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, color, bg, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; bg: string; trend?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600">
            <ArrowUpRight className="h-3 w-3" />{trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#0D0D0D]">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function RestauranteEstadisticas() {
  const searchParams = useSearchParams();
  const id           = searchParams.get('id') ?? 'R001';
  const restaurante  = RESTAURANTES.find(r => r.id === id) ?? RESTAURANTES[0];
  const [rango, setRango] = useState<'3m' | '6m' | '12m'>('6m');

  const misOTs   = OTS.filter(ot => ot.restauranteId === restaurante.id);
  const misLiqs  = LIQUIDACIONES.filter(l =>
    misOTs.some(ot => ot.id === l.otId)
  );

  const otsCerradas    = misOTs.filter(o => ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(o.estado));
  const otsEnCurso     = misOTs.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado));
  const gastoTotal     = misLiqs.reduce((s, l) => s + l.montoTotalFacturado, 0);
  const dataMeses      = rango === '3m' ? MESES_OTS.slice(-3) : rango === '6m' ? MESES_OTS.slice(-6) : MESES_OTS;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-sm text-gray-400">{restaurante.nombre} · histórico de servicios y gastos</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {(['3m','6m','12m'] as const).map(r => (
                <button key={r} onClick={() => setRango(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    rango === r ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{r}</button>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard label="OTs totales"      value={misOTs.length}          icon={Wrench}       color="text-[#2698D1]" bg="bg-blue-50"   sub="Desde el inicio" />
            <KpiCard label="En curso"          value={otsEnCurso.length}      icon={Clock}        color="text-amber-600" bg="bg-amber-50"  sub="Activas ahora" />
            <KpiCard label="Gasto total"       value={`USD ${gastoTotal}`}    icon={DollarSign}   color="text-purple-600" bg="bg-purple-50" trend="+12% vs mes ant." />
            <KpiCard label="Resueltas"         value={otsCerradas.length}     icon={CheckCircle2} color="text-green-600" bg="bg-green-50"  sub={`${misOTs.length > 0 ? Math.round(otsCerradas.length / misOTs.length * 100) : 0}% del total`} />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">

            {/* OTs por mes */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">OTs y gasto por mes</h3>
              <p className="text-xs text-gray-400 mb-5">Cantidad de servicios y monto facturado</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataMeses} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipCustom />} />
                  <Bar yAxisId="left"  dataKey="ots"   name="OTs"         fill="#2698D1" radius={[4,4,0,0]} />
                  <Bar yAxisId="right" dataKey="gasto" name="Gasto (USD)" fill="#0D0D0D" radius={[4,4,0,0]} opacity={0.15} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución por rubro */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Por rubro</h3>
              <p className="text-xs text-gray-400 mb-4">Distribución de servicios</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={RUBROS_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {RUBROS_DIST.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} OTs`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {RUBROS_DIST.map(r => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                      <span className="text-gray-500">{r.name}</span>
                    </div>
                    <span className="font-bold text-gray-700">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tiempo resolución */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Tiempo promedio de resolución</h3>
              <p className="text-xs text-gray-400 mb-5">Días desde apertura hasta cierre conforme</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={TIEMPO_RESOLUCION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 6]} />
                  <Tooltip content={<TooltipCustom suffix=" días" />} />
                  <Line type="monotone" dataKey="dias" stroke="#2698D1" strokeWidth={2.5}
                    dot={{ fill: '#2698D1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Métricas de servicio */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-4 text-sm">Métricas de servicio</h3>
              <div className="space-y-4">
                {[
                  { label: 'Conformidad',     val: 92,  color: 'bg-green-400' },
                  { label: 'Primer visita OK', val: 78,  color: 'bg-[#2698D1]' },
                  { label: 'SLA cumplido',    val: 85,  color: 'bg-purple-400' },
                  { label: 'Sin reincidencia', val: 94,  color: 'bg-amber-400' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">{m.label}</span>
                      <span className="font-bold text-gray-700">{m.val}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div className={`h-1.5 rounded-full ${m.color} transition-all duration-500`}
                        style={{ width: `${m.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-xl font-black text-[#0D0D0D]">4.7</span>
                </div>
                <p className="text-xs text-gray-400">Score promedio técnicos</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}