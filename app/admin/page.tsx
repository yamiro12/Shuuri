"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Building2, Wrench, Truck, ClipboardList, TrendingUp, DollarSign } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import {
  OTS, TECNICOS, RESTAURANTES, PROVEEDORES, OCS as _OCS,
  MOCK_ORDENES_COMPRA, OTS_POR_MES, COMISION_POR_MES,
} from '@/data/mock';
import { SAAS_POR_TIER } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TASA_USD_ARS = 1050;
const ESTADOS_CERRADOS = ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'] as const;
type EstadoCerrado = typeof ESTADOS_CERRADOS[number];

const PIE_COLORS = ['#2698D1','#22c55e','#f59e0b','#a855f7','#ef4444','#6b7280'];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Periodo = 'mes' | 'trimestre' | 'semestre' | 'anio';

function getStart(p: Periodo): Date {
  const n = new Date();
  if (p === 'mes') return new Date(n.getFullYear(), n.getMonth(), 1);
  if (p === 'trimestre') return new Date(n.getFullYear(), n.getMonth() - 2, 1);
  if (p === 'semestre') return new Date(n.getFullYear(), n.getMonth() - 5, 1);
  return new Date(n.getFullYear(), 0, 1);
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function estadoBadgeClass(estado: string): string {
  const map: Record<string, string> = {
    NUEVA:                         'bg-sky-100 text-sky-700',
    EN_DIAGNOSTICO:                'bg-blue-100 text-blue-700',
    APROBADA_PENDIENTE_ASIGNACION: 'bg-indigo-100 text-indigo-700',
    TECNICO_ASIGNADO:              'bg-violet-100 text-violet-700',
    EN_VISITA:                     'bg-purple-100 text-purple-700',
    COTIZACION_EMITIDA:            'bg-amber-100 text-amber-700',
    AUTORIZADA:                    'bg-yellow-100 text-yellow-700',
    REPUESTO_SOLICITADO:           'bg-orange-100 text-orange-700',
    EN_EJECUCION:                  'bg-lime-100 text-lime-700',
    PENDIENTE_CONFORMIDAD:         'bg-teal-100 text-teal-700',
    CERRADA_CONFORME:              'bg-green-100 text-green-700',
    CERRADA_SIN_CONFORMIDAD:       'bg-red-100 text-red-700',
    FACTURADA:                     'bg-emerald-100 text-emerald-700',
    LIQUIDADA:                     'bg-green-200 text-green-800',
    CANCELADA:                     'bg-gray-100 text-gray-500',
    confirmada_proveedor:          'bg-blue-100 text-blue-700',
    despachada:                    'bg-purple-100 text-purple-700',
    entregada_local:               'bg-green-100 text-green-700',
    pendiente_aprobacion:          'bg-yellow-100 text-yellow-700',
    cancelada:                     'bg-gray-100 text-gray-500',
  };
  return map[estado] ?? 'bg-gray-100 text-gray-500';
}

// ─── STATIC WEEKLY MOCK (registros por semana) ─────────────────────────────
const WEEKLY_DATA = [
  { semana: 'S1 Ene', restaurantes: 2, tecnicos: 1, proveedores: 0 },
  { semana: 'S2 Ene', restaurantes: 1, tecnicos: 0, proveedores: 1 },
  { semana: 'S3 Ene', restaurantes: 3, tecnicos: 2, proveedores: 0 },
  { semana: 'S4 Ene', restaurantes: 1, tecnicos: 1, proveedores: 0 },
  { semana: 'S1 Feb', restaurantes: 2, tecnicos: 0, proveedores: 1 },
  { semana: 'S2 Feb', restaurantes: 0, tecnicos: 2, proveedores: 0 },
  { semana: 'S3 Feb', restaurantes: 1, tecnicos: 1, proveedores: 1 },
  { semana: 'S4 Feb', restaurantes: 2, tecnicos: 0, proveedores: 0 },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>('mes');

  // ── KPI Computations ──
  const tecnicosActivos = useMemo(
    () => TECNICOS.filter(t => !t.bloqueado),
    [],
  );

  const otsEnCurso = useMemo(
    () => OTS.filter(o => !ESTADOS_CERRADOS.includes(o.estado as EstadoCerrado)),
    [],
  );

  const arrEstimadoARS = useMemo(
    () => RESTAURANTES.reduce((s, r) => s + SAAS_POR_TIER[r.tier] * TASA_USD_ARS, 0),
    [],
  );

  const gmvMesARS = useMemo(
    () => (OTS_POR_MES[OTS_POR_MES.length - 1]?.ingresos ?? 0) * TASA_USD_ARS,
    [],
  );

  // ── Pie: OTs por estado ──
  const pieData = useMemo(() => {
    const byEstado = OTS.reduce<Record<string, number>>((acc, o) => {
      acc[o.estado] = (acc[o.estado] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(byEstado)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  }, []);

  // ── Bar: Revenue por mes ──
  const chartRevenue = useMemo(
    () => COMISION_POR_MES.slice(-6).map(e => ({
      mes: e.mes,
      Servicios: Math.round(e.servicios * TASA_USD_ARS),
      Repuestos:  Math.round(e.repuestos  * TASA_USD_ARS),
      SaaS:       Math.round(e.saas       * TASA_USD_ARS),
    })),
    [],
  );

  // ── Tabla 1: últimas 10 OTs ──
  const ultimas10OTs = useMemo(
    () => [...OTS]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 10),
    [],
  );

  // ── Tabla 2: técnicos con certs por vencer ──
  const tecnicosAlerta = useMemo(
    () => TECNICOS.filter(t => t.certStatusGlobal === 'por_vencer' || t.certStatusGlobal === 'vencida'),
    [],
  );

  // ── Tabla 3: OCRs activas ──
  const ocrsActivas = useMemo(
    () => MOCK_ORDENES_COMPRA.filter(
      o => o.estado !== 'entregada_local' && o.estado !== 'cancelada',
    ),
    [],
  );

  // ── CSV Export ──
  function handleExport() {
    const header = ['Mes', 'OTs total', 'Ingresos ARS', 'Comisión ARS'];
    const dataRows = OTS_POR_MES.map(e => [
      e.mes,
      e.total.toString(),
      (e.ingresos * TASA_USD_ARS).toFixed(0),
      (e.comision * TASA_USD_ARS).toFixed(0),
    ]);
    downloadCSV([header, ...dataRows], `reporte-mensual-admin.csv`);
  }

  // ── Helper: restaurante name from OT ──
  function restNombre(restauranteId: string): string {
    return RESTAURANTES.find(r => r.id === restauranteId)?.nombre ?? restauranteId;
  }

  // ── Helper: proveedor name ──
  function provNombre(proveedorId: string): string {
    return PROVEEDORES.find(p => p.id === proveedorId)?.nombre ?? proveedorId;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 sidebar-push">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* PAGE HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Dashboard Global</h1>
              <p className="text-gray-500 text-sm">Visión completa de la operación SHUURI</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={periodo}
                onChange={e => setPeriodo(e.target.value as Periodo)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
              >
                <option value="mes">Este mes</option>
                <option value="trimestre">Últimos 3 meses</option>
                <option value="semestre">Últimos 6 meses</option>
                <option value="anio">Este año</option>
              </select>
              <button
                onClick={handleExport}
                className="rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d7db0] transition-colors"
              >
                Exportar reporte mensual CSV
              </button>
            </div>
          </div>

          {/* KPIs ROW 1 */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            {[
              { label: 'Restaurantes activos', value: RESTAURANTES.length,     icon: Building2,     color: 'text-[#2698D1]', bg: 'bg-blue-50' },
              { label: 'Técnicos activos',     value: tecnicosActivos.length,  icon: Wrench,        color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Proveedores activos',  value: PROVEEDORES.length,      icon: Truck,         color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* KPIs ROW 2 */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: 'OTs en curso',      value: otsEnCurso.length,             icon: ClipboardList, color: 'text-amber-600',  bg: 'bg-amber-50',  format: false },
              { label: 'ARR estimado',       value: formatARS(arrEstimadoARS),     icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50', format: true },
              { label: 'GMV del mes (ARS)',  value: formatARS(gmvMesARS),          icon: DollarSign,    color: 'text-rose-600',    bg: 'bg-rose-50',    format: true },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className={`text-2xl font-black ${kpi.color} truncate`}>{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="mb-6 grid grid-cols-3 gap-6">

            {/* Revenue por mes */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="font-bold text-[#0D0D0D]">Revenue SHUURI por mes (ARS) — últimos 6 meses</h2>
              </div>
              <div className="p-6" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRevenue} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Servicios" fill="#2698D1" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Repuestos"  fill="#a855f7" stackId="a" />
                    <Bar dataKey="SaaS"       fill="#22c55e" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie: OTs por estado */}
            <div className="rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="font-bold text-[#0D0D0D]">OTs por estado</h2>
              </div>
              <div className="p-4" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        (percent ?? 0) > 0.05 ? (name ?? '') : ''
                      }
                      labelLine={false}
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Nuevos registros por semana */}
          <div className="mb-6 rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="font-bold text-[#0D0D0D]">Nuevos registros por semana</h2>
            </div>
            <div className="p-6" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="restaurantes" stroke="#2698D1" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="tecnicos"     stroke="#22c55e"  strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="proveedores"  stroke="#f59e0b"  strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLA 1: Últimas 10 OTs */}
          <div className="mb-6 rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-[#0D0D0D]">Últimas 10 OTs creadas</h2>
              <Link href="/admin/ots" className="text-xs font-bold text-[#2698D1] hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Gastronómico</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Rubro</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Urgencia</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Fecha creación</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Importe ARS</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimas10OTs.map(ot => (
                    <tr key={ot.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/ots/${ot.id}`}
                          className="font-mono text-xs text-[#2698D1] hover:underline">
                          {ot.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{restNombre(ot.restauranteId)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {ot.rubro ? (ot.rubro as Rubro).replace(/_/g, ' ') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${estadoBadgeClass(ot.estado)}`}>
                          {ot.estado.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          ot.urgencia === 'CRITICA' ? 'bg-red-100 text-red-700' :
                          ot.urgencia === 'ALTA'    ? 'bg-orange-100 text-orange-700' :
                          ot.urgencia === 'MEDIA'   ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {ot.urgencia ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(ot.fechaCreacion)}</td>
                      <td className="px-4 py-3 font-bold text-[#0D0D0D]">
                        {ot.cotizacion?.totalDefinitivo
                          ? formatARS(ot.cotizacion.totalDefinitivo * TASA_USD_ARS)
                          : '—'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLA 2: Técnicos con certs por vencer */}
          <div className="mb-6 rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-[#0D0D0D]">Técnicos con certificaciones por vencer</h2>
              <Link href="/admin/compliance" className="text-xs font-bold text-[#2698D1] hover:underline">
                Ver compliance →
              </Link>
            </div>
            {tecnicosAlerta.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Todas las certificaciones están en orden</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Técnico</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Estado cert.</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Rubros</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tecnicosAlerta.map(t => (
                      <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-[#0D0D0D]">{t.nombre}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            t.certStatusGlobal === 'vencida' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {t.certStatusGlobal === 'vencida' ? 'Vencida' : 'Por vencer'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {t.rubros.slice(0, 3).map((r: Rubro) => r.replace(/_/g, ' ')).join(', ')}
                          {t.rubros.length > 3 ? ` +${t.rubros.length - 3}` : ''}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/tecnicos/${t.id}`}
                            className="text-xs font-bold text-[#2698D1] hover:underline">
                            Ver perfil →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TABLA 3: OCRs activas */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-[#0D0D0D]">OCRs activas — repuestos en tránsito</h2>
              <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${ocrsActivas.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {ocrsActivas.length} activas
              </span>
            </div>
            {ocrsActivas.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin OCRs activas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">N° OCR</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">OT</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Proveedor</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Importe ARS</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Estado</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">Entrega estimada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrsActivas.map(ocr => (
                      <tr key={ocr.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{ocr.id}</td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/ots/${ocr.otId}`}
                            className="text-xs font-bold text-[#2698D1] hover:underline font-mono">
                            {ocr.otId}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{provNombre(ocr.proveedorId ?? '')}</td>
                        <td className="px-4 py-3 font-bold text-[#0D0D0D]">{formatARS(ocr.totalARS)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${estadoBadgeClass(ocr.estado)}`}>
                            {ocr.estado.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {ocr.fechaEstimadaEntrega ? formatDate(ocr.fechaEstimadaEntrega ?? '') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
