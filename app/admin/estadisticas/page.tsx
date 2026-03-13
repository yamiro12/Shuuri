"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate } from '@/components/shared/utils';
import {
  OTS, TECNICOS, RESTAURANTES, LIQUIDACIONES, PROVEEDORES,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  TrendingUp, DollarSign, Wrench, Users, Star,
  AlertTriangle, CheckCircle, Clock, BarChart2, ChevronDown,
} from 'lucide-react';

// ─── CÁLCULOS GLOBALES ────────────────────────────────────────────────────────

const totalOTs          = OTS.length;
const otsActivas        = OTS.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado)).length;
const otsCerradas       = OTS.filter(o => ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD'].includes(o.estado)).length;
const otsLiquidadas     = OTS.filter(o => o.estado === 'LIQUIDADA').length;
const otsFacuturadas    = OTS.filter(o => o.estado === 'FACTURADA').length;
const otsCriticas       = OTS.filter(o => o.urgencia === 'CRITICA').length;
const otsSinAsignar     = OTS.filter(o => o.estado === 'APROBADA_PENDIENTE_ASIGNACION').length;

const totalFacturado    = LIQUIDACIONES.reduce((s, l) => s + l.montoTotalFacturado, 0);
const totalComisiones   = LIQUIDACIONES.reduce((s, l) => s + l.comisionTotal, 0);
const comisionesPagadas = LIQUIDACIONES.filter(l => l.estado === 'PAGADA').reduce((s, l) => s + l.comisionTotal, 0);
const comisionesPend    = LIQUIDACIONES.filter(l => l.estado !== 'PAGADA').reduce((s, l) => s + l.comisionTotal, 0);

// ARR proyectado: comisiones del mock × 12 meses (el mock representa ~1 mes de operación)
const arrProyectado     = totalComisiones * 12;

// Tasa de cierre: OTs cerradas / total OTs que llegaron a COTIZACION_EMITIDA o más
const otsAvanzadas      = OTS.filter(o => !['NUEVA','EN_DIAGNOSTICO','APROBADA_PENDIENTE_ASIGNACION','CANCELADA'].includes(o.estado)).length;
const tasaCierre        = otsAvanzadas > 0 ? Math.round((otsCerradas + otsLiquidadas + otsFacuturadas) / otsAvanzadas * 100) : 0;

// Técnicos
const tecnicosActivos   = TECNICOS.filter(t => !t.bloqueado).length;
const tecnicosBloqueados= TECNICOS.filter(t => t.bloqueado).length;
const scorePromedio     = Math.round(TECNICOS.reduce((s, t) => s + t.score, 0) / TECNICOS.length);

// Restaurantes por tier
const countTier = (tier: string) => RESTAURANTES.filter(r => r.tier === tier).length;

// OTs por rubro — top 5
const rubroCount: Partial<Record<Rubro, number>> = {};
OTS.forEach(ot => {
  rubroCount[ot.rubro as Rubro] = (rubroCount[ot.rubro as Rubro] ?? 0) + 1;
});
const rubrosSorted = (Object.entries(rubroCount) as [Rubro, number][])
  .sort((a, b) => b[1] - a[1]);
const maxRubroCount = rubrosSorted[0]?.[1] ?? 1;

// OTs por estado — para funnel
const estadoCount: Record<string, number> = {};
OTS.forEach(ot => { estadoCount[ot.estado] = (estadoCount[ot.estado] ?? 0) + 1; });

const FUNNEL_ESTADOS = [
  'NUEVA', 'EN_DIAGNOSTICO', 'APROBADA_PENDIENTE_ASIGNACION',
  'TECNICO_ASIGNADO', 'EN_VISITA', 'COTIZACION_EMITIDA',
  'AUTORIZADA', 'EN_EJECUCION', 'PENDIENTE_CONFORMIDAD',
  'CERRADA_CONFORME', 'FACTURADA', 'LIQUIDADA',
];

// ─── SUBCOMPONENTES ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color = '#2698D1', alert = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color?: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm ${alert ? 'border-red-200 bg-red-50/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
          <p className={`mt-1 text-3xl font-black ${alert ? 'text-red-600' : 'text-[#0D0D0D]'}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl`}
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function AdminEstadisticas() {
  const [periodoLabel] = useState('Últimos 30 días (mock)');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8 space-y-8">

          {/* TÍTULO */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-gray-400 text-sm">{periodoLabel}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-500 cursor-default">
              Período: mock MVP
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* ── FILA 1: KPIs FINANCIEROS ── */}
          <section>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Ingresos</p>
            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                label="ARR proyectado"
                value={`USD ${arrProyectado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                sub="Comisiones del período × 12"
                icon={TrendingUp}
                color="#2698D1"
              />
              <KpiCard
                label="Facturado total"
                value={`USD ${totalFacturado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                sub={`${LIQUIDACIONES.length} liquidaciones`}
                icon={DollarSign}
                color="#0D0D0D"
              />
              <KpiCard
                label="Comisiones SHUURI"
                value={`USD ${totalComisiones.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                sub={`Pagadas: USD ${comisionesPagadas.toFixed(0)}`}
                icon={BarChart2}
                color="#16a34a"
              />
              <KpiCard
                label="Comisiones pendientes"
                value={`USD ${comisionesPend.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                sub="Por liquidar"
                icon={Clock}
                color="#d97706"
                alert={comisionesPend > 30}
              />
            </div>
          </section>

          {/* ── FILA 2: KPIs OPERATIVOS ── */}
          <section>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Operaciones</p>
            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                label="OTs totales"
                value={String(totalOTs)}
                sub={`${otsActivas} activas`}
                icon={Wrench}
                color="#2698D1"
              />
              <KpiCard
                label="Tasa de cierre"
                value={`${tasaCierre}%`}
                sub="Cerradas / avanzadas"
                icon={CheckCircle}
                color="#16a34a"
              />
              <KpiCard
                label="Sin asignar"
                value={String(otsSinAsignar)}
                sub="Requieren técnico"
                icon={AlertTriangle}
                color="#dc2626"
                alert={otsSinAsignar > 0}
              />
              <KpiCard
                label="Críticas activas"
                value={String(otsCriticas)}
                sub="Urgencia CRITICA"
                icon={AlertTriangle}
                color="#dc2626"
                alert={otsCriticas > 0}
              />
            </div>
          </section>

          {/* ── FILA 3: RED ── */}
          <section>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Red</p>
            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                label="Restaurantes"
                value={String(RESTAURANTES.length)}
                sub={`${countTier('FREEMIUM')} free · ${countTier('CADENA_CHICA')} chica · ${countTier('CADENA_GRANDE')} grande`}
                icon={Users}
                color="#2698D1"
              />
              <KpiCard
                label="Técnicos activos"
                value={String(tecnicosActivos)}
                sub={`${tecnicosBloqueados} bloqueados por compliance`}
                icon={Wrench}
                color="#0D0D0D"
                alert={tecnicosBloqueados > 0}
              />
              <KpiCard
                label="Score promedio técnicos"
                value={String(scorePromedio)}
                sub="Sobre 100"
                icon={Star}
                color="#d97706"
              />
              <KpiCard
                label="Proveedores"
                value={String(PROVEEDORES.length)}
                sub={`${PROVEEDORES.filter(p => p.esShuuriPro).length} ShuuriPro`}
                icon={CheckCircle}
                color="#16a34a"
              />
            </div>
          </section>

          {/* ── GRILLA INFERIOR: rubros + funnel ── */}
          <div className="grid grid-cols-2 gap-6">

            {/* OTs por rubro */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-black text-[#0D0D0D]">OTs por rubro</h3>
              <div className="space-y-3">
                {rubrosSorted.map(([rubro, count]) => (
                  <div key={rubro}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{RUBRO_LABELS[rubro]}</span>
                      <span className="text-sm font-black text-[#0D0D0D]">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-[#2698D1] transition-all"
                        style={{ width: `${(count / maxRubroCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funnel de estados */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-black text-[#0D0D0D]">Distribución por estado</h3>
              <div className="space-y-2">
                {FUNNEL_ESTADOS.map(estado => {
                  const count = estadoCount[estado] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / totalOTs) * 100);
                  const isTerminal = ['LIQUIDADA', 'CERRADA_CONFORME'].includes(estado);
                  const isAlert    = ['NUEVA', 'APROBADA_PENDIENTE_ASIGNACION'].includes(estado);
                  return (
                    <div key={estado} className="flex items-center gap-3">
                      <div className="w-48 shrink-0">
                        <span className="text-xs font-medium text-gray-500">
                          {estado.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isTerminal ? 'bg-green-500' : isAlert ? 'bg-amber-400' : 'bg-[#2698D1]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-black text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── LIQUIDACIONES RECIENTES ── */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-black text-[#0D0D0D]">Liquidaciones recientes</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {['ID', 'OT', 'Facturado', 'Comisión SHUURI', 'Técnico neto', 'Estado', 'Fecha'].map(h => (
                    <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {LIQUIDACIONES.map(liq => (
                  <tr key={liq.id} className="hover:bg-gray-50">
                    <td className="py-3 text-xs font-bold text-gray-400">{liq.id}</td>
                    <td className="py-3 text-sm text-[#0D0D0D]">{liq.otId}</td>
                    <td className="py-3 text-sm font-bold text-[#0D0D0D]">USD {liq.montoTotalFacturado}</td>
                    <td className="py-3 text-sm text-[#2698D1] font-bold">USD {liq.comisionTotal.toFixed(2)}</td>
                    <td className="py-3 text-sm text-gray-600">USD {liq.pagoTecnico}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        liq.estado === 'PAGADA'
                          ? 'bg-green-100 text-green-700'
                          : liq.estado === 'PENDIENTE_PAGO'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {liq.estado.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-400">
                      {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t">
                <tr>
                  <td colSpan={2} className="pt-3 text-xs font-black uppercase text-gray-400">Total</td>
                  <td className="pt-3 text-sm font-black text-[#0D0D0D]">USD {totalFacturado}</td>
                  <td className="pt-3 text-sm font-black text-[#2698D1]">USD {totalComisiones.toFixed(2)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── PROYECCIÓN ARR ── */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-black text-[#0D0D0D]">Proyección ARR — escenarios</h3>
            <p className="mb-5 text-xs text-gray-400">
              Base: comisión promedio USD {(totalComisiones / LIQUIDACIONES.length).toFixed(0)} por OT liquidada
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'MVP — Año 1', clientes: 300, otsXmes: 2, color: '#2698D1' },
                { label: 'Expansión — Año 2', clientes: 1500, otsXmes: 2.5, color: '#0D0D0D' },
                { label: 'Regional — Año 3', clientes: 5000, otsXmes: 3, color: '#16a34a' },
              ].map(esc => {
                const comXot  = totalComisiones / LIQUIDACIONES.length;
                const arr     = Math.round(esc.clientes * esc.otsXmes * comXot * 12);
                return (
                  <div key={esc.label} className="rounded-xl border-2 p-5" style={{ borderColor: `${esc.color}30` }}>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{esc.label}</p>
                    <p className="mt-2 text-2xl font-black" style={{ color: esc.color }}>
                      USD {arr.toLocaleString('es-AR')}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {esc.clientes.toLocaleString()} clientes · {esc.otsXmes} OTs/mes/cliente
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
