"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { TECNICOS, OTS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Star, TrendingUp, Wrench, DollarSign, CheckCircle2,
  Award, Clock, ArrowUpRight, Zap,
} from 'lucide-react';

// ─── DATA MOCK ────────────────────────────────────────────────────────────────

const INGRESOS_MENSUALES = [
  { mes: 'Sep', neto: 820,  ots: 6 },
  { mes: 'Oct', neto: 1050, ots: 7 },
  { mes: 'Nov', neto: 930,  ots: 6 },
  { mes: 'Dic', neto: 780,  ots: 5 },
  { mes: 'Ene', neto: 1240, ots: 9 },
  { mes: 'Feb', neto: 1380, ots: 10 },
  { mes: 'Mar', neto: 650,  ots: 4 },
];

const RADAR_PERFORMANCE = [
  { subject: 'Puntualidad',    A: 92 },
  { subject: 'Diagnóstico',    A: 88 },
  { subject: 'Comunicación',   A: 95 },
  { subject: 'Resolución',     A: 84 },
  { subject: 'Documentación',  A: 78 },
  { subject: 'Conformidades',  A: 91 },
];

const RUBROS_PERF = [
  { rubro: 'Frío comercial',    ots: 67, pct: 47 },
  { rubro: 'Calor / gas',       ots: 31, pct: 22 },
  { rubro: 'Campanas',          ots: 22, pct: 15 },
  { rubro: 'Lavado ind.',       ots: 14, pct: 10 },
  { rubro: 'Otros',             ots: 9,  pct: 6  },
];

function TooltipCustom({ active, payload, label, prefix = '', suffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-white px-3 py-2.5 shadow-lg text-xs">
      <p className="font-bold text-gray-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {prefix}{p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

export default function TecnicoEstadisticas() {
  const searchParams = useSearchParams();
  const tecnicoId    = searchParams.get('id') ?? 'T001';
  const tecnico      = TECNICOS.find(t => t.id === tecnicoId) ?? TECNICOS[0];
  const [rango, setRango] = useState<'3m' | '6m' | 'todo'>('6m');

  const misOTs  = OTS.filter(ot => ot.tecnicoId === tecnico.id);
  const misLiqs = LIQUIDACIONES.filter(l => l.tecnicoId === tecnico.id);

  const ingresoTotal   = misLiqs.reduce((s, l) => s + l.pagoTecnico, 0);
  const otsCerradas    = misOTs.filter(o => ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(o.estado));
  const otsEnCurso     = misOTs.filter(o => ['TECNICO_ASIGNADO','EN_VISITA','EN_EJECUCION','AUTORIZADA','REPUESTO_SOLICITADO'].includes(o.estado));
  const dataMeses      = rango === '3m' ? INGRESOS_MENSUALES.slice(-3) : rango === '6m' ? INGRESOS_MENSUALES.slice(-6) : INGRESOS_MENSUALES;
  const ingresoPromedio = dataMeses.length > 0 ? Math.round(dataMeses.reduce((s, m) => s + m.neto, 0) / dataMeses.length) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="TECNICO" userName={tecnico.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="TECNICO" userName={tecnico.nombre} />
        <main className="p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mis estadísticas</h1>
              <p className="text-sm text-gray-400">{tecnico.nombre} · rendimiento y facturación</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {(['3m','6m','todo'] as const).map(r => (
                <button key={r} onClick={() => setRango(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    rango === r ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{r}</button>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: 'OTs completadas', value: tecnico.otsCompletadas, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: '+8 este mes' },
              { label: 'Score',           value: tecnico.score,           icon: Star,         color: 'text-amber-500', bg: 'bg-amber-50', trend: '↑ 0.2' },
              { label: 'En curso',        value: otsEnCurso.length,       icon: Clock,        color: 'text-blue-600',  bg: 'bg-blue-50' },
              { label: 'Ingreso total',   value: `USD ${ingresoTotal}`,   icon: DollarSign,   color: 'text-purple-600', bg: 'bg-purple-50', trend: '+15%' },
              { label: 'Prom. mensual',   value: `USD ${ingresoPromedio}`,icon: TrendingUp,   color: 'text-[#2698D1]', bg: 'bg-blue-50' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  {kpi.trend && (
                    <span className="text-xs font-bold text-green-600">{kpi.trend}</span>
                  )}
                </div>
                <p className="text-2xl font-black text-[#0D0D0D]">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">

            {/* Ingresos y OTs por mes */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Ingresos netos y OTs por mes</h3>
              <p className="text-xs text-gray-400 mb-5">USD cobrado después de comisión SHUURI</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataMeses} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 15]} />
                  <Tooltip content={<TooltipCustom />} />
                  <Bar yAxisId="left"  dataKey="neto" name="USD neto" fill="#2698D1" radius={[4,4,0,0]} />
                  <Bar yAxisId="right" dataKey="ots"  name="OTs"      fill="#0D0D0D" radius={[4,4,0,0]} opacity={0.15} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar performance */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Performance</h3>
              <p className="text-xs text-gray-400 mb-2">Evaluación multidimensional</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={RADAR_PERFORMANCE}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar dataKey="A" stroke="#2698D1" fill="#2698D1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-xl font-black text-[#0D0D0D]">{tecnico.score}</span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Rubros + Certificaciones */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-4">OTs por rubro</h3>
              <div className="space-y-3">
                {RUBROS_PERF.map(r => (
                  <div key={r.rubro}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">{r.rubro}</span>
                      <span className="text-gray-400">{r.ots} OTs · {r.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-[#2698D1] transition-all duration-500"
                        style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-4">Certificaciones activas</h3>
              <div className="space-y-2">
                {tecnico.rubros.map(r => {
                  const estado = tecnico.certPorRubro[r as Rubro];
                  const ok     = estado === 'vigente';
                  const warn   = estado === 'por_vencer';
                  return (
                    <div key={r} className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      ok ? 'bg-green-50 border border-green-100' :
                      warn ? 'bg-amber-50 border border-amber-100' :
                      'bg-red-50 border border-red-100'
                    }`}>
                      <span className={`text-xs font-medium ${ok ? 'text-green-700' : warn ? 'text-amber-700' : 'text-red-700'}`}>
                        {RUBRO_LABELS[r as Rubro]}
                      </span>
                      <span className={`text-xs font-black ${ok ? 'text-green-600' : warn ? 'text-amber-600' : 'text-red-600'}`}>
                        {ok ? '✓ Vigente' : warn ? '⚠ Por vencer' : '✗ Vencida'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}