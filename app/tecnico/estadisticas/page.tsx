"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { OTS, TECNICOS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, OrdenTrabajo } from '@/types/shuuri';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';

const TASA = 1050;
const ESTADOS_CERRADOS = ['CERRADA_CONFORME', 'CERRADA_SIN_CONFORMIDAD', 'FACTURADA', 'LIQUIDADA', 'CANCELADA'];
const COLORS = ['#2698D1', '#22c55e', '#ef4444', '#f59e0b', '#a855f7', '#f97316', '#10b981', '#6366f1'];

type Periodo = '1m' | '3m' | '6m' | '12m';

function getStart(p: Periodo): Date {
  const n = new Date();
  const months = p === '1m' ? 1 : p === '3m' ? 3 : p === '6m' ? 6 : 12;
  return new Date(n.getFullYear(), n.getMonth() - (months - 1), 1);
}
function inPeriod(iso: string, start: Date): boolean { return new Date(iso) >= start; }

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function SectionCard({ title, onExport, children }: {
  title: string; onExport: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0D0D0D] text-base">{title}</h3>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 p-5 flex flex-col justify-center">
      <p className={`text-3xl font-black ${color ?? 'text-[#0D0D0D]'}`}>{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// Build last 12 months labels
function getLast12Months(): { year: number; month: number; label: string }[] {
  const today = new Date();
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleString('es-AR', { month: 'short', year: '2-digit' });
    months.push({ year: d.getFullYear(), month: d.getMonth(), label });
  }
  return months;
}

export default function TecnicoEstadisticas() {
  const searchParams = useSearchParams();
  const tecnicoId = searchParams.get('id') ?? 'T001';
  const tecnico = TECNICOS.find(t => t.id === tecnicoId) ?? TECNICOS[0];
  const [periodo, setPeriodo] = useState<Periodo>('6m');

  const start = useMemo(() => getStart(periodo), [periodo]);
  const last12 = useMemo(() => getLast12Months(), []);

  const misOTs = useMemo(
    () => OTS.filter(ot => (ot.tecnicoId ?? '') === tecnico.id),
    [tecnico.id]
  );

  const misOTsPeriodo = useMemo(
    () => misOTs.filter(ot => inPeriod(ot.fechaCreacion, start)),
    [misOTs, start]
  );

  const misLiqs = useMemo(
    () => LIQUIDACIONES.filter(l => l.tecnicoId === tecnico.id),
    [tecnico.id]
  );

  // Sección 1 — Productividad

  // A: OTs completadas por mes (12 meses)
  const otsPorMes = useMemo(() => {
    return last12.map(({ year, month, label }) => {
      const completadas = misOTs.filter(ot => {
        if (!ESTADOS_CERRADOS.includes(ot.estado)) return false;
        if (ot.estado === 'CANCELADA') return false;
        const d = new Date(ot.fechaCreacion);
        return d.getFullYear() === year && d.getMonth() === month;
      }).length;
      return { mes: label, completadas };
    });
  }, [misOTs, last12]);

  // B: Tasa de conformidad
  const conformidad = useMemo(() => {
    const totalCerradas = misOTs.filter(ot =>
      ['CERRADA_CONFORME', 'CERRADA_SIN_CONFORMIDAD', 'FACTURADA', 'LIQUIDADA'].includes(ot.estado)
    );
    const conformes = totalCerradas.filter(ot => ot.estado === 'CERRADA_CONFORME').length;
    const sinConf = totalCerradas.filter(ot => ot.estado === 'CERRADA_SIN_CONFORMIDAD').length;
    const tasa = totalCerradas.length > 0 ? (conformes / totalCerradas.length) * 100 : 0;
    return { tasa: Math.round(tasa * 10) / 10, conformes, sinConf, total: totalCerradas.length };
  }, [misOTs]);

  // C: Tiempo promedio de ejecución (horas)
  const tiempoPromHoras = useMemo(() => {
    const vals = misOTsPeriodo
      .filter(ot => ot.fechaFinalizacion)
      .map(ot => (new Date(ot.fechaFinalizacion!).getTime() - new Date(ot.fechaCreacion).getTime()) / (1000 * 60 * 60));
    if (vals.length === 0) return null;
    return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1));
  }, [misOTsPeriodo]);

  const conformidadColor = conformidad.tasa >= 85
    ? 'text-green-600'
    : conformidad.tasa >= 70
    ? 'text-amber-500'
    : 'text-red-600';

  // Sección 2 — Ingresos

  // A: Liquidaciones por mes
  const liqPorMes = useMemo(() => {
    return last12.map(({ year, month, label }) => {
      const pago = misLiqs
        .filter(l => {
          if (!l.fechaDevengado) return false;
          const d = new Date(l.fechaDevengado);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((s, l) => s + l.pagoTecnico * TASA, 0);
      return { mes: label, pago: Math.round(pago) };
    });
  }, [misLiqs, last12]);

  // B: Mano de obra vs repuestos
  const desgloseIngresos = useMemo(() => {
    const ots = misOTsPeriodo;
    const manoDeObra = ots.reduce((s, ot) => s + ot.cotizacion.manoDeObra * TASA, 0);
    const repuestos = ots.reduce((s, ot) => {
      const r = ot.cotizacion.itemsRepuestos.reduce((sr, i) => sr + i.precioUnitario * i.cantidad, 0);
      return s + r * TASA;
    }, 0);
    return { manoDeObra: Math.round(manoDeObra), repuestos: Math.round(repuestos) };
  }, [misOTsPeriodo]);

  // C: Proyección próximo mes (últimas 3 liquidaciones por mes)
  const proyeccion = useMemo(() => {
    const last3months = getLast12Months().slice(-3);
    const totals = last3months.map(({ year, month }) => {
      return misLiqs
        .filter(l => {
          if (!l.fechaDevengado) return false;
          const d = new Date(l.fechaDevengado);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((s, l) => s + l.pagoTecnico * TASA, 0);
    });
    const avg = totals.reduce((s, v) => s + v, 0) / 3;
    return Math.round(avg);
  }, [misLiqs]);

  // Sección 3 — Por Rubro
  const porRubro = useMemo(() => {
    const map = new Map<Rubro, number>();
    misOTs.forEach(ot => {
      map.set(ot.rubro, (map.get(ot.rubro) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([rubro, value]) => ({
      name: RUBRO_LABELS[rubro as Rubro],
      value,
      rubro,
    })).sort((a, b) => b.value - a.value);
  }, [misOTs]);

  const PERIODOS: Periodo[] = ['1m', '3m', '6m', '12m'];

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={tecnico.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={tecnico.nombre} />
        <main className="p-8">

          {/* Header + period filter */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mis estadísticas</h1>
              <p className="text-sm text-gray-400">{tecnico.nombre} · rendimiento y facturación</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {PERIODOS.map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    periodo === p ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{p.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* Sección 1 — Productividad */}
          <SectionCard
            title="Productividad"
            onExport={() => downloadCSV(
              ['mes', 'completadas'],
              otsPorMes.map(r => [r.mes, String(r.completadas)]),
              'productividad.csv'
            )}
          >
            <div className="grid grid-cols-3 gap-6">
              {/* A: LineChart */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-3">OTs completadas por mes (12 meses)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={otsPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip formatter={(value: any) => [String(value), '']} />
                    <Line type="monotone" dataKey="completadas" stroke="#2698D1" strokeWidth={2.5}
                      dot={{ fill: '#2698D1', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* B + C: stats */}
              <div className="flex flex-col gap-4">
                {/* B: Tasa de conformidad */}
                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Tasa de conformidad</p>
                  <p className={`text-4xl font-black ${conformidadColor}`}>
                    {conformidad.tasa}%
                  </p>
                  <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                    <p>Conformes: <span className="font-bold text-green-600">{conformidad.conformes}</span></p>
                    <p>Sin conformidad: <span className="font-bold text-red-500">{conformidad.sinConf}</span></p>
                  </div>
                </div>
                {/* C: Tiempo promedio */}
                <StatCard
                  label="Tiempo prom. ejecución"
                  value={tiempoPromHoras !== null ? `${tiempoPromHoras}h` : '—'}
                  sub="Promedio en el período"
                />
              </div>
            </div>
          </SectionCard>

          {/* Sección 2 — Ingresos */}
          <SectionCard
            title="Ingresos"
            onExport={() => downloadCSV(
              ['mes', 'pagoARS'],
              liqPorMes.map(r => [r.mes, String(r.pago)]),
              'ingresos.csv'
            )}
          >
            <div className="grid grid-cols-3 gap-6">
              {/* A: Liquidaciones por mes */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-3">Liquidaciones por mes (ARS)</p>
                {liqPorMes.every(m => m.pago === 0) ? (
                  <p className="text-sm text-gray-400 py-8 text-center">Sin datos en el período seleccionado</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={liqPorMes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70}
                        tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: any) => [formatARS(Number(value)), 'Pago']} />
                      <Bar dataKey="pago" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* B + C: desglose + proyección */}
              <div className="flex flex-col gap-4">
                {/* B: Mano de obra vs repuestos */}
                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Desglose en el período</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mano de obra</span>
                      <span className="font-bold text-[#2698D1]">{formatARS(desgloseIngresos.manoDeObra)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Repuestos</span>
                      <span className="font-bold text-purple-600">{formatARS(desgloseIngresos.repuestos)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center font-bold">
                      <span className="text-gray-700">Total bruto</span>
                      <span className="text-[#0D0D0D]">{formatARS(desgloseIngresos.manoDeObra + desgloseIngresos.repuestos)}</span>
                    </div>
                  </div>
                </div>

                {/* C: Proyección */}
                <div className={`rounded-xl p-4 ${proyeccion > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border'}`}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Proyección próximo mes</p>
                  <p className={`text-xl font-black ${proyeccion > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                    {proyeccion > 0 ? formatARS(proyeccion) : '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Basado en promedio últimos 3 meses</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Sección 3 — Por Rubro */}
          <SectionCard
            title="Distribución por rubro"
            onExport={() => downloadCSV(
              ['rubro', 'cantidad'],
              porRubro.map(r => [r.name, String(r.value)]),
              'rubros.csv'
            )}
          >
            {porRubro.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin datos en el período seleccionado</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={porRubro}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }: any) =>
                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                      labelLine={false}
                    >
                      {porRubro.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [String(value), 'OTs']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {porRubro.map((r, i) => (
                    <div key={r.rubro} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-gray-600">{r.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{r.value} OTs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

        </main>
      </div>
    </div>
  );
}
