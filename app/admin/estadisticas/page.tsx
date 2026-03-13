"use client";
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import {
  OTS, TECNICOS, RESTAURANTES, PROVEEDORES, LIQUIDACIONES,
  OTS_POR_MES, COMISION_POR_MES, TOP_TECNICOS,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Users, Wrench, Building2, DollarSign, TrendingUp, Download, CheckCircle2, XCircle, Star, Package } from 'lucide-react';

const TASA = 1050;
type Periodo = '1m' | '3m' | '6m' | '12m';

function getStart(p: Periodo): Date {
  const n = new Date();
  const months = p === '1m' ? 1 : p === '3m' ? 3 : p === '6m' ? 6 : 12;
  return new Date(n.getFullYear(), n.getMonth() - (months - 1), 1);
}

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const CRECIMIENTO_MENSUAL = OTS_POR_MES.map((m, i) => ({
  mes: m.mes,
  restaurantes: Math.max(1, Math.floor(i * 0.8 + 2)),
  tecnicos: Math.max(0, Math.floor(i * 0.3 + 1)),
  proveedores: i % 3 === 0 ? 1 : 0,
}));

export default function AdminEstadisticas() {
  const [periodo, setPeriodo] = useState<Periodo>('6m');

  // ─── SECCIÓN 1: CRECIMIENTO ─────────────────────────────────────────────────

  const crecimientoFiltrado = useMemo(() => {
    const start = getStart(periodo);
    return CRECIMIENTO_MENSUAL.filter((m) => {
      const parts = m.mes.split(' ');
      const mesNum = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].indexOf(parts[0]);
      const anio = parseInt('20' + parts[1]);
      return new Date(anio, mesNum, 1) >= start;
    });
  }, [periodo]);

  function exportCrecimiento() {
    downloadCSV(
      ['Mes', 'Restaurantes nuevos', 'Técnicos nuevos', 'Proveedores nuevos'],
      crecimientoFiltrado.map(m => [m.mes, String(m.restaurantes), String(m.tecnicos), String(m.proveedores)]),
      'crecimiento_plataforma.csv'
    );
  }

  // ─── SECCIÓN 2: REVENUE ─────────────────────────────────────────────────────

  const revenueFiltrado = useMemo(() => {
    const start = getStart(periodo);
    return COMISION_POR_MES.filter((m) => {
      const parts = m.mes.split(' ');
      const mesNum = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].indexOf(parts[0]);
      const anio = parseInt('20' + parts[1]);
      return new Date(anio, mesNum, 1) >= start;
    }).map(m => ({
      mes: m.mes,
      Servicios: Math.round(m.servicios * TASA),
      Repuestos: Math.round(m.repuestos * TASA),
      SaaS: Math.round(m.saas * TASA),
      total: Math.round(m.total * TASA),
      _raw: m,
    }));
  }, [periodo]);

  const acumulado2026 = useMemo(() => {
    return COMISION_POR_MES
      .filter(m => m.mes.includes('26'))
      .reduce((s, m) => s + m.total, 0) * TASA;
  }, []);

  const resumenMeses = useMemo(() => {
    const last6 = COMISION_POR_MES.slice(-6);
    return last6.map((m, i) => {
      const prev = last6[i - 1];
      const totalARS = Math.round(m.total * TASA);
      const prevARS = prev ? Math.round(prev.total * TASA) : null;
      const pctVsPrev = prevARS && prevARS > 0
        ? (((totalARS - prevARS) / prevARS) * 100).toFixed(1)
        : '—';
      return {
        mes: m.mes,
        serviciosARS: Math.round(m.servicios * TASA),
        repuestosARS: Math.round(m.repuestos * TASA),
        saasARS: Math.round(m.saas * TASA),
        totalARS,
        pctVsPrev,
      };
    });
  }, []);

  function exportRevenue() {
    downloadCSV(
      ['Mes','Servicios ARS','Repuestos ARS','SaaS ARS','Total ARS','% vs anterior'],
      resumenMeses.map(m => [m.mes, String(m.serviciosARS), String(m.repuestosARS), String(m.saasARS), String(m.totalARS), String(m.pctVsPrev)]),
      'revenue_shuuri.csv'
    );
  }

  // ─── SECCIÓN 3: OPERACIONAL ─────────────────────────────────────────────────

  const resolucion = useMemo(() => {
    const conforme = OTS.filter(o => o.estado === 'CERRADA_CONFORME').length;
    const sinConf = OTS.filter(o => o.estado === 'CERRADA_SIN_CONFORMIDAD').length;
    const canceladas = OTS.filter(o => o.estado === 'CANCELADA').length;
    const total = conforme + sinConf;
    const pctConf = total > 0 ? Math.round(conforme / total * 100) : 0;
    const pctSin = total > 0 ? Math.round(sinConf / total * 100) : 0;
    return { conforme, sinConf, canceladas, total, pctConf, pctSin };
  }, []);

  const slaPorRubro = useMemo(() => {
    const map: Record<string, { dias: number[]; cerradas: number }> = {};
    OTS.forEach(ot => {
      if (!['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA'].includes(ot.estado)) return;
      if (!ot.fechaFinalizacion) return;
      const dias = (new Date(ot.fechaFinalizacion).getTime() - new Date(ot.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24);
      if (!map[ot.rubro]) map[ot.rubro] = { dias: [], cerradas: 0 };
      map[ot.rubro].dias.push(dias);
      map[ot.rubro].cerradas++;
    });
    return Object.entries(map).map(([rubro, v]) => {
      const avg = v.dias.reduce((s, d) => s + d, 0) / v.dias.length;
      const semaforo = avg < 3 ? 'green' : avg <= 7 ? 'amber' : 'red';
      return { rubro, cerradas: v.cerradas, avgDias: avg.toFixed(1), semaforo };
    });
  }, []);

  const topProveedores = useMemo(() => {
    const map: Record<string, { monto: number; count: number }> = {};
    LIQUIDACIONES.forEach(l => {
      if (!l.proveedorId) return;
      if (!map[l.proveedorId]) map[l.proveedorId] = { monto: 0, count: 0 };
      map[l.proveedorId].monto += l.montoTotalFacturado * TASA;
      map[l.proveedorId].count++;
    });
    return Object.entries(map)
      .map(([provId, v]) => {
        const prov = PROVEEDORES.find(p => p.id === provId);
        return { nombre: prov?.nombre ?? provId, montoARS: Math.round(v.monto), ocs: v.count };
      })
      .sort((a, b) => b.montoARS - a.montoARS)
      .slice(0, 5);
  }, []);

  function exportOperacional() {
    downloadCSV(
      ['Rubro','OTs cerradas','Días promedio','Semáforo'],
      slaPorRubro.map(s => [
        RUBRO_LABELS[s.rubro as Rubro] ?? s.rubro,
        String(s.cerradas),
        String(s.avgDias),
        s.semaforo,
      ]),
      'sla_por_rubro.csv'
    );
  }

  function exportTecnicos() {
    downloadCSV(
      ['#','Técnico','OTs','Facturado ARS','Comisión ARS','Score'],
      TOP_TECNICOS.slice(0,5).map((t, i) => [
        String(i + 1), t.nombre, String(t.ots),
        String(Math.round(t.facturado * TASA)),
        String(Math.round(t.comision * TASA)),
        String(t.score),
      ]),
      'top_tecnicos.csv'
    );
  }

  function exportProveedores() {
    downloadCSV(
      ['#','Proveedor','Monto ARS','OCs'],
      topProveedores.map((p, i) => [String(i + 1), p.nombre, String(p.montoARS), String(p.ocs)]),
      'top_proveedores.csv'
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* Título y filtro período */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-sm text-gray-400">Vista global de la plataforma SHUURI</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {(['1m','3m','6m','12m'] as Periodo[]).map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    periodo === p ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{p.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* ── SECCIÓN 1: CRECIMIENTO ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Crecimiento de la plataforma</h2>
              <button onClick={exportCrecimiento}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>

            {/* KPIs fila */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Restaurantes', value: RESTAURANTES.length, icon: Building2, color: 'text-[#2698D1]', bg: 'bg-blue-50' },
                { label: 'Técnicos', value: TECNICOS.length, icon: Wrench, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Proveedores', value: PROVEEDORES.length, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Churn', value: '0 bajas', icon: Users, color: 'text-gray-500', bg: 'bg-gray-100', note: true },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-xl border bg-gray-50 p-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg} mb-2`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <p className="text-2xl font-black text-[#0D0D0D]">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                  {kpi.note && <p className="text-[10px] text-gray-400 mt-0.5">Campo no disponible en mock</p>}
                </div>
              ))}
            </div>

            {/* LineChart */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Nuevos registros por mes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={crecimientoFiltrado} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: any) => [String(value), '']} />
                <Legend />
                <Line type="monotone" dataKey="restaurantes" stroke="#2698D1" strokeWidth={2.5} dot={{ fill: '#2698D1', r: 3 }} />
                <Line type="monotone" dataKey="tecnicos" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 3 }} />
                <Line type="monotone" dataKey="proveedores" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── SECCIÓN 2: REVENUE ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Revenue SHUURI</h2>
              <button onClick={exportRevenue}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>

            {/* Acumulado 2026 */}
            <div className="mb-6 rounded-xl bg-gradient-to-r from-[#2698D1]/10 to-blue-50 border border-blue-100 px-6 py-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2698D1]">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2698D1] uppercase tracking-wide mb-0.5">Acumulado 2026</p>
                <p className="text-3xl font-black text-[#0D0D0D]">{formatARS(acumulado2026)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Comisiones SHUURI en pesos (tasa USD {TASA})</p>
              </div>
            </div>

            {/* BarChart desglose */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Desglose de ingresos SHUURI por mes</h3>
            {revenueFiltrado.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">Sin datos para el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueFiltrado} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number | string) => formatARS(Number(v))} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={85} />
                  <Tooltip formatter={(value: any) => [formatARS(Number(value)), '']} />
                  <Legend />
                  <Bar dataKey="Servicios" fill="#2698D1" radius={[4,4,0,0]} stackId="a" />
                  <Bar dataKey="Repuestos" fill="#a855f7" radius={[0,0,0,0]} stackId="a" />
                  <Bar dataKey="SaaS" fill="#22c55e" radius={[4,4,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Tabla resumen últimos 6 meses */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mt-6 mb-3">Resumen últimos 6 meses</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {['Mes','Servicios','Repuestos','SaaS','Total','% vs anterior'].map(h => (
                      <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {resumenMeses.map(m => (
                    <tr key={m.mes} className="hover:bg-gray-50">
                      <td className="py-2 font-medium text-[#0D0D0D]">{m.mes}</td>
                      <td className="py-2 text-gray-600">{formatARS(m.serviciosARS)}</td>
                      <td className="py-2 text-gray-600">{formatARS(m.repuestosARS)}</td>
                      <td className="py-2 text-gray-600">{formatARS(m.saasARS)}</td>
                      <td className="py-2 font-bold text-[#0D0D0D]">{formatARS(m.totalARS)}</td>
                      <td className="py-2">
                        {m.pctVsPrev === '—' ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <span className={`text-xs font-bold ${parseFloat(m.pctVsPrev) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {parseFloat(m.pctVsPrev) >= 0 ? '+' : ''}{m.pctVsPrev}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SECCIÓN 3: OPERACIONAL ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Operacional</h2>
              <button onClick={exportOperacional}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV SLA
              </button>
            </div>

            {/* Tasa resolución */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Tasa de resolución de OTs</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-black text-green-700">{resolucion.pctConf}%</p>
                <p className="text-xs text-green-600 mt-0.5">Conforme ({resolucion.conforme} OTs)</p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-black text-red-600">{resolucion.pctSin}%</p>
                <p className="text-xs text-red-500 mt-0.5">Sin conformidad ({resolucion.sinConf} OTs)</p>
              </div>
              <div className="rounded-xl bg-gray-50 border p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 mb-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-black text-gray-600">{resolucion.canceladas}</p>
                <p className="text-xs text-gray-500 mt-0.5">Canceladas</p>
              </div>
            </div>

            {/* SLA por rubro */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">SLA promedio por rubro</h3>
            {slaPorRubro.length === 0 ? (
              <p className="text-sm text-gray-400 mb-6">Sin OTs cerradas con fecha de finalización</p>
            ) : (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b">
                      {['Rubro','OTs cerradas','Días promedio','Estado'].map(h => (
                        <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {slaPorRubro.map(s => (
                      <tr key={s.rubro} className="hover:bg-gray-50">
                        <td className="py-2 font-medium text-[#0D0D0D]">{RUBRO_LABELS[s.rubro as Rubro] ?? s.rubro}</td>
                        <td className="py-2 text-gray-600">{s.cerradas}</td>
                        <td className="py-2 text-gray-600">{s.avgDias} días</td>
                        <td className="py-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            s.semaforo === 'green' ? 'bg-green-100 text-green-700' :
                            s.semaforo === 'amber' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            <span className={`h-2 w-2 rounded-full ${
                              s.semaforo === 'green' ? 'bg-green-500' :
                              s.semaforo === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            {s.semaforo === 'green' ? 'OK' : s.semaforo === 'amber' ? 'En rango' : 'Excede SLA'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top 5 técnicos */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0D0D0D]">Top 5 técnicos por volumen</h3>
              <button onClick={exportTecnicos}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {['#','Técnico','OTs','Facturado ARS','Comisión ARS','Score'].map(h => (
                      <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {TOP_TECNICOS.slice(0,5).map((t, i) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">{i + 1}</span>
                      </td>
                      <td className="py-2 font-medium text-[#0D0D0D]">{t.nombre}</td>
                      <td className="py-2 text-gray-600">{t.ots}</td>
                      <td className="py-2 font-bold text-[#0D0D0D]">{formatARS(Math.round(t.facturado * TASA))}</td>
                      <td className="py-2 text-[#2698D1] font-bold">{formatARS(Math.round(t.comision * TASA))}</td>
                      <td className="py-2">
                        <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {t.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top 5 proveedores */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0D0D0D]">Top 5 proveedores por facturación</h3>
              <button onClick={exportProveedores}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
            {topProveedores.length === 0 ? (
              <p className="text-sm text-gray-400">Sin proveedores con liquidaciones</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['#','Proveedor','Monto ARS','OCs'].map(h => (
                        <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {topProveedores.map((p, i) => (
                      <tr key={p.nombre} className="hover:bg-gray-50">
                        <td className="py-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">{i + 1}</span>
                        </td>
                        <td className="py-2 font-medium text-[#0D0D0D]">{p.nombre}</td>
                        <td className="py-2 font-bold text-[#0D0D0D]">{formatARS(p.montoARS)}</td>
                        <td className="py-2 text-gray-600">{p.ocs}</td>
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
