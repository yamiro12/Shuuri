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
  LIQUIDACIONES,
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
const TODAY = '2026-03-13';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'mes' | 'trimestre' | 'semestre' | 'anio';

function getStart(p: Periodo): Date {
  const n = new Date();
  if (p === 'mes') return new Date(n.getFullYear(), n.getMonth(), 1);
  if (p === 'trimestre') return new Date(n.getFullYear(), n.getMonth() - 2, 1);
  if (p === 'semestre') return new Date(n.getFullYear(), n.getMonth() - 5, 1);
  return new Date(n.getFullYear(), 0, 1);
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

const KPI_BG: Record<string, string> = {
  'text-[#2698D1]': 'bg-[#2698D1]/10',
  'text-green-600': 'bg-green-50',
  'text-amber-500': 'bg-amber-50',
  'text-red-500':   'bg-red-50',
  'text-purple-600':'bg-purple-50',
};

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-[#2698D1]',
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: { value: string; up: boolean };
}) {
  const bg = KPI_BG[color] ?? 'bg-gray-50';
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg ${bg} p-2 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-gray-500">{label}</span>
        </div>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#0D0D0D] leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── ESTADO BADGE ─────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: string }) {
  const MAP: Record<string, string> = {
    CERRADA_CONFORME:       'bg-green-100 text-green-800',
    LIQUIDADA:              'bg-emerald-100 text-emerald-800',
    FACTURADA:              'bg-teal-100 text-teal-800',
    CANCELADA:              'bg-gray-200 text-gray-500',
    CERRADA_SIN_CONFORMIDAD:'bg-red-100 text-red-800',
    EN_EJECUCION:           'bg-cyan-100 text-cyan-800',
    NUEVA:                  'bg-gray-100 text-gray-700',
    TECNICO_ASIGNADO:       'bg-blue-100 text-blue-800',
    EN_VISITA:              'bg-blue-200 text-blue-900',
    PENDIENTE_CONFORMIDAD:  'bg-amber-100 text-amber-800',
  };
  const cls = MAP[estado] ?? 'bg-blue-100 text-blue-800';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {estado.replace(/_/g, ' ')}
    </span>
  );
}

// ─── CERT BADGE ───────────────────────────────────────────────────────────────

function CertBadge({ estado }: { estado: string }) {
  const MAP: Record<string, string> = {
    vigente:    'bg-green-100 text-green-700',
    por_vencer: 'bg-yellow-100 text-yellow-700',
    vencida:    'bg-red-100 text-red-700',
  };
  const cls = MAP[estado] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {estado.replace(/_/g, ' ')}
    </span>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TecnicoDashboardPage() {
  const params = useSearchParams();
  const id = params.get('id') ?? 'T001';
  const tecnico = TECNICOS.find((t: any) => t.id === id) ?? TECNICOS[0];

  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStr = TODAY;

  // OTs for this tecnico
  const myOTs = useMemo(
    () => OTS.filter((o: OrdenTrabajo) => o.tecnicoId === tecnico.id),
    [tecnico.id],
  );

  // Liquidaciones for this tecnico
  const myLiqs = useMemo(
    () => getLiquidacionesByTecnico(tecnico.id),
    [tecnico.id],
  );

  // ── KPIs ──────────────────────────────────────────────────────────────────

  const otsHoy = useMemo(() => {
    const hoy = myOTs.filter(o =>
      o.fechaVisitaProgramada?.startsWith(todayStr),
    );
    return hoy.length;
  }, [myOTs]);

  const otsCompletadasMes = useMemo(
    () => myOTs.filter(o =>
      ['CERRADA_CONFORME','LIQUIDADA','FACTURADA'].includes(o.estado) &&
      o.fechaFinalizacion &&
      new Date(o.fechaFinalizacion) >= startMonth,
    ).length,
    [myOTs, startMonth],
  );

  const liquidacionMesARS = useMemo(
    () => myLiqs
      .filter(l =>
        l.fechaDevengado &&
        new Date(l.fechaDevengado) >= startMonth,
      )
      .reduce((acc, l) => acc + l.pagoTecnico * TASA_USD_ARS, 0),
    [myLiqs, startMonth],
  );

  // ── Chart 1: OTs por semana (últimas 8 semanas) ───────────────────────────

  const otsPorSemana = useMemo(() => {
    const result: { semana: string; ots: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const count = myOTs.filter(o => {
        const d = new Date(o.fechaCreacion);
        return d >= weekStart && d <= weekEnd;
      }).length;
      result.push({ semana: `W${8 - i}`, ots: count });
    }
    return result;
  }, [myOTs]);

  // ── Chart 2: Ingresos mensuales (últimos 6 meses) ─────────────────────────

  const ingresosMensuales = useMemo(() => {
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
      const total = myLiqs
        .filter(l => {
          if (!l.fechaDevengado) return false;
          const d = new Date(l.fechaDevengado);
          return d.getFullYear() === y && d.getMonth() === m;
        })
        .reduce((acc, l) => acc + l.pagoTecnico * TASA_USD_ARS, 0);
      return { mes: label, ingresos: Math.round(total) };
    });
  }, [myLiqs]);

  // ── OTs pendientes hoy ────────────────────────────────────────────────────

  const otsPendientesHoy = useMemo(
    () => myOTs.filter(o => !ESTADOS_CERRADOS.includes(o.estado)),
    [myOTs],
  );

  // ── Calendario semanal (semana actual) ────────────────────────────────────

  const semanaActual = useMemo(() => {
    const days: { label: string; fecha: string; ots: OrdenTrabajo[] }[] = [];
    const LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const startOfWeek = new Date(now);
    // Set to Monday of current week
    const dow = (now.getDay() + 6) % 7; // 0=Mon
    startOfWeek.setDate(now.getDate() - dow);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayOTs = myOTs.filter(o => o.fechaVisitaProgramada?.startsWith(dateStr));
      days.push({ label: LABELS[i], fecha: dateStr, ots: dayOTs });
    }
    return days;
  }, [myOTs]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={tecnico.nombre} />

      <div className="sidebar-push flex-1 flex flex-col">
        <Header userRole="TECNICO" userName={tecnico.nombre} />

        <main className="flex-1 p-8 space-y-8">

          {/* Alert banner */}
          {(tecnico.certStatusGlobal === 'por_vencer' || tecnico.bloqueado) && (
            <div className={`flex items-start gap-4 rounded-xl border-l-4 p-4 shadow-sm ${
              tecnico.bloqueado
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
            }`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tecnico.bloqueado ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <AlertTriangle className={`h-5 w-5 ${tecnico.bloqueado ? 'text-red-500' : 'text-yellow-500'}`} />
              </div>
              <div className="flex-1">
                {tecnico.bloqueado ? (
                  <>
                    <p className="font-bold text-sm">Cuenta bloqueada</p>
                    <p className="text-xs mt-0.5 opacity-80">Tu cuenta está bloqueada. Contactá a soporte de SHUURI para más información.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-sm">Certificaciones por vencer</p>
                    <p className="text-xs mt-0.5 opacity-80">Tenés certificaciones próximas a vencer. Renovalas para seguir operando normalmente.</p>
                  </>
                )}
              </div>
              <Link
                href="/tecnico/perfil"
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  tecnico.bloqueado
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                }`}
              >
                Ver →
              </Link>
            </div>
          )}

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tecnico.nombre}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Panel técnico · {tecnico.zona}</p>
            </div>
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
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-5">
            <KpiCard
              icon={Calendar}
              label="OTs asignadas hoy"
              value={otsHoy || otsPendientesHoy.length}
              sub={otsHoy > 0 ? 'con visita programada hoy' : 'activas pendientes'}
              color="text-[#2698D1]"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Completadas este mes"
              value={otsCompletadasMes}
              sub="conforme / facturada / liquidada"
              color="text-green-600"
            />
            <KpiCard
              icon={DollarSign}
              label="Liquidación estimada mes"
              value={formatARS(liquidacionMesARS)}
              sub="según devengados del mes"
              color="text-amber-600"
            />
            <KpiCard
              icon={Star}
              label="Rating promedio"
              value={`★ ${tecnico.score.toFixed(1)}`}
              sub={`${tecnico.otsCompletadas} OTs completadas`}
              color="text-yellow-500"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-6">

            {/* Chart 1: OTs por semana */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">OTs creadas por semana — últimas 8 semanas</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={otsPorSemana}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="ots"
                    name="OTs"
                    stroke="#2698D1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#2698D1' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Ingresos mensuales */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Ingresos mensuales ARS — últimos 6 meses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ingresosMensuales} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: unknown) => formatARS(Number(v))} />
                  <Bar dataKey="ingresos" name="Ingresos ARS" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OTs pendientes hoy */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-sm font-semibold text-gray-700">OTs pendientes</h2>
              <p className="text-xs text-gray-400 mt-0.5">Órdenes activas asignadas a vos</p>
            </div>
            {otsPendientesHoy.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-400 text-sm">
                No hay OTs programadas para hoy
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Gastronómico</th>
                    <th className="px-6 py-3 text-left">Activo</th>
                    <th className="px-6 py-3 text-left">Hora visita</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {otsPendientesHoy.map(ot => {
                    const rest = RESTAURANTES.find((r: any) => r.id === ot.restauranteId);
                    const hora = ot.fechaVisitaProgramada
                      ? new Date(ot.fechaVisitaProgramada).toLocaleTimeString('es-AR', {
                          hour: '2-digit', minute: '2-digit',
                        })
                      : '—';
                    return (
                      <tr key={ot.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{rest?.nombre ?? ot.restauranteId}</td>
                        <td className="px-6 py-3 text-gray-600">{ot.equipoTipo}</td>
                        <td className="px-6 py-3 text-gray-600">{hora}</td>
                        <td className="px-6 py-3"><EstadoBadge estado={ot.estado} /></td>
                        <td className="px-6 py-3 text-right">
                          <Link
                            href={`/tecnico/ots/${ot.id}`}
                            className="text-xs text-[#2698D1] hover:underline flex items-center gap-0.5 justify-end"
                          >
                            Ver detalle <ChevronRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Calendario semanal */}
          <div className="rounded-2xl border bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Semana actual</h2>
            <div className="grid grid-cols-7 gap-3">
              {semanaActual.map(day => (
                <div key={day.fecha} className="flex flex-col gap-1.5">
                  <div className={`text-center pb-1.5 border-b ${
                    day.fecha === todayStr
                      ? 'border-[#2698D1]'
                      : 'border-gray-100'
                  }`}>
                    <p className={`text-xs font-semibold ${
                      day.fecha === todayStr ? 'text-[#2698D1]' : 'text-gray-500'
                    }`}>{day.label}</p>
                    <p className={`text-xs ${
                      day.fecha === todayStr ? 'text-[#2698D1] font-bold' : 'text-gray-400'
                    }`}>{day.fecha.slice(8)}</p>
                  </div>
                  <div className="space-y-1 min-h-[60px]">
                    {day.ots.map(ot => (
                      <Link
                        key={ot.id}
                        href={`/tecnico/ots/${ot.id}`}
                        className="block rounded-md bg-[#2698D1]/10 px-1.5 py-1 text-[10px] text-[#2698D1] font-medium truncate hover:bg-[#2698D1]/20 transition-colors"
                        title={`${ot.equipoTipo} — ${ot.restauranteId}`}
                      >
                        {ot.equipoTipo.slice(0, 12)}
                      </Link>
                    ))}
                    {day.ots.length === 0 && (
                      <p className="text-[10px] text-gray-300 text-center pt-2">—</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mis certificaciones */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2698D1]" />
              <h2 className="text-sm font-semibold text-gray-700">Mis certificaciones</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {tecnico.certificaciones.map((cert: any) => {
                const vence = new Date(cert.fechaVencimiento);
                const diffDays = Math.ceil((vence.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const porVencer = diffDays <= 30 && diffDays > 0;
                return (
                  <div key={cert.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      {porVencer && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      {!porVencer && (
                        <ShieldCheck className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          cert.estado === 'vigente' ? 'text-green-500' :
                          cert.estado === 'vencida' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{cert.nombre}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cert.entidadEmisora}</p>
                        {porVencer && (
                          <p className="text-xs text-amber-600 mt-0.5 font-medium">
                            Vence en {diffDays} día{diffDays !== 1 ? 's' : ''} — {formatDate(cert.fechaVencimiento)}
                          </p>
                        )}
                        {!porVencer && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Vence: {formatDate(cert.fechaVencimiento)}
                          </p>
                        )}
                      </div>
                    </div>
                    <CertBadge estado={cert.estado} />
                  </div>
                );
              })}
              {tecnico.certificaciones.length === 0 && (
                <p className="px-6 py-8 text-center text-gray-400 text-sm">
                  No hay certificaciones registradas
                </p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
