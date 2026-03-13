"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import {
  OTS,
  TECNICOS,
  RESTAURANTES,
  MOCK_ACTIVOS,
  getLiquidacionesByTecnico,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, OrdenTrabajo } from '@/types/shuuri';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  ClipboardList, TrendingUp, DollarSign, Calendar,
  Download, AlertTriangle, ChevronRight, Wrench,
  CheckCircle2, Star, ShieldCheck, Truck,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PIE_COLORS = ['#2698D1','#22c55e','#ef4444','#f59e0b','#a855f7','#f97316','#10b981','#6366f1'];
const TASA_USD_ARS = 1050;
const ESTADOS_CERRADOS = ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'mes' | 'trimestre' | 'semestre' | 'anio';

function getStart(p: Periodo): Date {
  const n = new Date();
  if (p === 'mes') return new Date(n.getFullYear(), n.getMonth(), 1);
  if (p === 'trimestre') return new Date(n.getFullYear(), n.getMonth() - 2, 1);
  if (p === 'semestre') return new Date(n.getFullYear(), n.getMonth() - 5, 1);
  return new Date(n.getFullYear(), 0, 1);
}

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-[#2698D1]',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`rounded-lg bg-gray-50 p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RestauranteDashboardPage() {
  const params = useSearchParams();
  const id = params.get('id') ?? 'R001';
  const restaurante = RESTAURANTES.find(r => r.id === id) ?? RESTAURANTES[0];

  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startYear  = new Date(now.getFullYear(), 0, 1);
  const startPeriod = useMemo(() => getStart(periodo), [periodo]);

  // OTs for this restaurante
  const myOTs = useMemo(
    () => OTS.filter((o: OrdenTrabajo) => o.restauranteId === restaurante.id),
    [restaurante.id],
  );

  // ── KPIs ──────────────────────────────────────────────────────────────────

  const otsActivas = useMemo(
    () => myOTs.filter(o => !ESTADOS_CERRADOS.includes(o.estado)).length,
    [myOTs],
  );

  const otsCerradasMes = useMemo(
    () => myOTs.filter(o =>
      ['CERRADA_CONFORME','LIQUIDADA','FACTURADA'].includes(o.estado) &&
      o.fechaFinalizacion &&
      new Date(o.fechaFinalizacion) >= startMonth,
    ).length,
    [myOTs, startMonth],
  );

  const gastoMesARS = useMemo(
    () => myOTs
      .filter(o =>
        ['CERRADA_CONFORME','LIQUIDADA','FACTURADA'].includes(o.estado) &&
        o.fechaFinalizacion &&
        new Date(o.fechaFinalizacion) >= startMonth,
      )
      .reduce((acc, o) => acc + (o.cotizacion.totalDefinitivo ?? 0) * TASA_USD_ARS, 0),
    [myOTs, startMonth],
  );

  const gastoAnioARS = useMemo(
    () => myOTs
      .filter(o =>
        ESTADOS_CERRADOS.includes(o.estado) &&
        o.fechaFinalizacion &&
        new Date(o.fechaFinalizacion) >= startYear,
      )
      .reduce((acc, o) => acc + (o.cotizacion.totalDefinitivo ?? 0) * TASA_USD_ARS, 0),
    [myOTs, startYear],
  );

  // ── Chart 1: Servicios por mes (últimos 6 meses) ──────────────────────────

  const serviciosPorMes = useMemo(() => {
    const months: { label: string; y: number; m: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('es-AR', { month: 'short' }),
        y: d.getFullYear(),
        m: d.getMonth(),
      });
    }
    return months.map(({ label, y, m }) => {
      const inMonth = myOTs.filter(o => {
        const d = new Date(o.fechaCreacion);
        return d.getFullYear() === y && d.getMonth() === m;
      });
      return {
        mes: label,
        completadas: inMonth.filter(o =>
          ['CERRADA_CONFORME','LIQUIDADA','FACTURADA'].includes(o.estado),
        ).length,
        canceladas: inMonth.filter(o => o.estado === 'CANCELADA').length,
        en_curso: inMonth.filter(o => !ESTADOS_CERRADOS.includes(o.estado)).length,
      };
    });
  }, [myOTs]);

  // ── Chart 2: Distribución por rubro (periodo seleccionado) ────────────────

  const distribucionRubro = useMemo(() => {
    const inPeriod = myOTs.filter(o => new Date(o.fechaCreacion) >= startPeriod);
    const map: Record<string, number> = {};
    inPeriod.forEach(o => {
      const label = RUBRO_LABELS[o.rubro as Rubro] ?? o.rubro;
      map[label] = (map[label] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [myOTs, startPeriod]);

  // ── Últimas 5 OTs ─────────────────────────────────────────────────────────

  const ultimasOTs = useMemo(
    () => [...myOTs]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 5),
    [myOTs],
  );

  // ── Activos ───────────────────────────────────────────────────────────────

  const activos = useMemo(
    () => MOCK_ACTIVOS.filter(
      (a: any) => a.restauranteId === restaurante.id || a.restauranteId === 'rest-001',
    ),
    [restaurante.id],
  );

  // ── CSV Export ────────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    const header = ['otId', 'fecha', 'activo', 'tecnico', 'estado', 'importeARS'];
    const rows = myOTs.map(o => {
      const tec = TECNICOS.find((t: any) => t.id === o.tecnicoId);
      const importe = o.cotizacion.totalDefinitivo != null
        ? String(Math.round(o.cotizacion.totalDefinitivo * TASA_USD_ARS))
        : '—';
      return [
        o.id,
        o.fechaCreacion.slice(0, 10),
        `${o.equipoTipo} ${o.equipoMarca}`,
        tec?.nombre ?? '—',
        o.estado,
        importe,
      ];
    });
    downloadCSV([header, ...rows], `ots-${restaurante.id}.csv`);
  };

  // ── Estado badge helper ───────────────────────────────────────────────────

  const estadoBadge = (estado: string) => {
    const MAP: Record<string, string> = {
      CERRADA_CONFORME:       'bg-green-100 text-green-800',
      LIQUIDADA:              'bg-emerald-100 text-emerald-800',
      FACTURADA:              'bg-teal-100 text-teal-800',
      CANCELADA:              'bg-gray-200 text-gray-500',
      CERRADA_SIN_CONFORMIDAD:'bg-red-100 text-red-800',
      EN_EJECUCION:           'bg-cyan-100 text-cyan-800',
      NUEVA:                  'bg-gray-100 text-gray-700',
    };
    const cls = MAP[estado] ?? 'bg-blue-100 text-blue-800';
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
        {estado.replace(/_/g, ' ')}
      </span>
    );
  };

  const activoBadge = (estado: string) => {
    const MAP: Record<string, string> = {
      operativo:          'bg-green-100 text-green-800',
      falla:              'bg-red-100 text-red-800',
      mantenimiento:      'bg-amber-100 text-amber-800',
      fuera_de_servicio:  'bg-gray-200 text-gray-500',
    };
    const cls = MAP[estado] ?? 'bg-gray-100 text-gray-600';
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
        {estado.replace(/_/g, ' ')}
      </span>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.contactoNombre} actorId={id} />

      <div className="sidebar-push flex-1 flex flex-col">
        <Header userRole="RESTAURANTE" userName={restaurante.contactoNombre} />

        <main className="flex-1 p-8 space-y-8">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{restaurante.nombre}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Resumen operativo · {restaurante.zona}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Period filter */}
              <select
                value={periodo}
                onChange={e => setPeriodo(e.target.value as Periodo)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
              >
                <option value="mes">Este mes</option>
                <option value="trimestre">Últimos 3 meses</option>
                <option value="semestre">Últimos 6 meses</option>
                <option value="anio">Este año</option>
              </select>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a7ab5] transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar resumen CSV
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-5">
            <KpiCard
              icon={ClipboardList}
              label="OTs activas"
              value={otsActivas}
              sub="en curso o pendientes"
              color="text-[#2698D1]"
            />
            <KpiCard
              icon={CheckCircle2}
              label="OTs cerradas este mes"
              value={otsCerradasMes}
              sub="conforme / facturada / liquidada"
              color="text-green-600"
            />
            <KpiCard
              icon={DollarSign}
              label="Gasto total este mes"
              value={formatARS(gastoMesARS)}
              sub="OTs cerradas en el mes"
              color="text-amber-600"
            />
            <KpiCard
              icon={TrendingUp}
              label="Gasto acumulado este año"
              value={formatARS(gastoAnioARS)}
              sub="OTs cerradas desde enero"
              color="text-purple-600"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-6">

            {/* Chart 1: Servicios por mes */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Servicios por mes — últimos 6 meses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviciosPorMes} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completadas" name="Completadas" fill="#22c55e" radius={[4,4,0,0]} />
                  <Bar dataKey="canceladas"  name="Canceladas"  fill="#ef4444" radius={[4,4,0,0]} />
                  <Bar dataKey="en_curso"    name="En curso"    fill="#2698D1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Distribución por rubro */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Distribución por rubro — {
                periodo === 'mes' ? 'este mes' :
                periodo === 'trimestre' ? 'últimos 3 meses' :
                periodo === 'semestre' ? 'últimos 6 meses' : 'este año'
              }</h2>
              {distribucionRubro.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                  Sin datos para el período seleccionado
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribucionRubro}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        (percent ?? 0) > 0.05 ? (name ?? '') : ''
                      }
                      labelLine={false}
                    >
                      {distribucionRubro.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Últimas 5 OTs */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Últimas 5 OTs</h2>
              <Link href="/restaurante/ots" className="text-xs text-[#2698D1] hover:underline flex items-center gap-1">
                Ver todas <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Activo</th>
                  <th className="px-6 py-3 text-left">Técnico</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-right">Importe</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ultimasOTs.map(ot => {
                  const tec = TECNICOS.find((t: any) => t.id === ot.tecnicoId);
                  const importe = ot.cotizacion.totalDefinitivo != null
                    ? formatARS(ot.cotizacion.totalDefinitivo * TASA_USD_ARS)
                    : '—';
                  return (
                    <tr key={ot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-600">{formatDate(ot.fechaCreacion)}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {ot.equipoTipo} <span className="text-gray-500 font-normal">{ot.equipoMarca}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{tec?.nombre ?? '—'}</td>
                      <td className="px-6 py-3">{estadoBadge(ot.estado)}</td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-900">{importe}</td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/restaurante/ots/${ot.id}`}
                          className="text-xs text-[#2698D1] hover:underline flex items-center gap-0.5 justify-end"
                        >
                          Ver <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {ultimasOTs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                      No hay OTs registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mis Activos */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-sm font-semibold text-gray-700">Mis Activos</h2>
              <p className="text-xs text-gray-400 mt-0.5">{activos.length} equipo{activos.length !== 1 ? 's' : ''} registrado{activos.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {activos.map((activo: any) => (
                <div key={activo.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-500 mt-0.5">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {activo.marca} {activo.modelo}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activo.categoria} · {activo.subcategoria}
                      </p>
                      {activo.ultimoService && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Último service: {formatDate(activo.ultimoService)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activoBadge(activo.estado)}
                    <Link
                      href={`/restaurante/reportar?activoId=${activo.id}`}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Reportar falla
                    </Link>
                  </div>
                </div>
              ))}
              {activos.length === 0 && (
                <p className="px-6 py-8 text-center text-gray-400 text-sm">
                  No hay activos registrados para este restaurante
                </p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
