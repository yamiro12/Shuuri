"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { PROVEEDORES, OCS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Package, DollarSign, TrendingUp, CheckCircle2,
  Clock, Star, ArrowUpRight, Zap, Truck,
} from 'lucide-react';

// ─── DATA MOCK ────────────────────────────────────────────────────────────────

const VENTAS_MENSUALES = [
  { mes: 'Sep', ventas: 1200, ocs: 4 },
  { mes: 'Oct', ventas: 980,  ocs: 3 },
  { mes: 'Nov', ventas: 1560, ocs: 5 },
  { mes: 'Dic', ventas: 840,  ocs: 3 },
  { mes: 'Ene', ventas: 2100, ocs: 7 },
  { mes: 'Feb', ventas: 1780, ocs: 6 },
  { mes: 'Mar', ventas: 460,  ocs: 2 },
];

const FULFILLMENT = [
  { mes: 'Sep', pct: 88 },
  { mes: 'Oct', pct: 92 },
  { mes: 'Nov', pct: 85 },
  { mes: 'Dic', pct: 95 },
  { mes: 'Ene', pct: 91 },
  { mes: 'Feb', pct: 97 },
  { mes: 'Mar', pct: 100 },
];

const TOP_PRODUCTOS = [
  { nombre: 'Compresores',          ventas: 12, monto: 2160 },
  { nombre: 'Gas refrigerante',     ventas: 9,  monto: 405 },
  { nombre: 'Termostatos',          ventas: 7,  monto: 630 },
  { nombre: 'Kits filtros',         ventas: 5,  monto: 250 },
  { nombre: 'Válvulas expansión',   ventas: 4,  monto: 320 },
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

export default function ProveedorEstadisticas() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];
  const [rango, setRango] = useState<'3m' | '6m' | 'todo'>('6m');

  const misOCs  = OCS.filter(oc => oc.proveedorId === proveedorId);
  const misLiqs = LIQUIDACIONES.filter(l => l.proveedorId === proveedorId);

  const facturadoTotal   = misOCs.reduce((s, oc) => s + oc.montoTotal, 0);
  const cobradoTotal     = misLiqs.filter(l => l.estado === 'PAGADA').reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);
  const entregadas       = misOCs.filter(oc => oc.estado === 'ENTREGADA').length;
  const fulfillmentRate  = misOCs.length > 0 ? Math.round(entregadas / misOCs.length * 100) : 0;
  const dataMeses        = rango === '3m' ? VENTAS_MENSUALES.slice(-3) : rango === '6m' ? VENTAS_MENSUALES.slice(-6) : VENTAS_MENSUALES;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-sm text-gray-400">{proveedor.nombre} · ventas y performance logística</p>
            </div>
            <div className="flex items-center gap-2">
              {proveedor.esShuuriPro && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                  <Zap className="h-3 w-3" /> SHUURI Pro
                </span>
              )}
              <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
                {(['3m','6m','todo'] as const).map(r => (
                  <button key={r} onClick={() => setRango(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      rango === r ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}>{r}</button>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Órdenes totales',  value: misOCs.length,                              icon: Package,      color: 'text-[#2698D1]',  bg: 'bg-blue-50',   trend: '+3 este mes' },
              { label: 'Facturado total',  value: `USD ${facturadoTotal}`,                    icon: DollarSign,   color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
              { label: 'Cobrado',          value: cobradoTotal > 0 ? `USD ${cobradoTotal}` : '—', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Fulfillment rate', value: `${fulfillmentRate}%`,                       icon: Truck,        color: 'text-amber-600',  bg: 'bg-amber-50' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  {kpi.trend && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <ArrowUpRight className="h-3 w-3" />{kpi.trend}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-[#0D0D0D]">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">

            {/* Ventas mensuales */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Ventas y órdenes por mes</h3>
              <p className="text-xs text-gray-400 mb-5">Monto facturado y cantidad de OCs</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dataMeses}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2698D1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2698D1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipCustom prefix="USD " />} />
                  <Area type="monotone" dataKey="ventas" stroke="#2698D1" strokeWidth={2.5}
                    fill="url(#colorVentas)" dot={{ fill: '#2698D1', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fulfillment */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Fulfillment rate</h3>
              <p className="text-xs text-gray-400 mb-4">% entregas a tiempo</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={FULFILLMENT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipCustom suffix="%" />} />
                  <Line type="monotone" dataKey="pct" stroke="#10b981" strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
                <p className="text-2xl font-black text-green-700">{fulfillmentRate || 93}%</p>
                <p className="text-xs text-green-600">Promedio del período</p>
              </div>
            </div>
          </div>

          {/* Top productos + Rubros */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-4">Top productos vendidos</h3>
              <div className="space-y-3">
                {TOP_PRODUCTOS.map((p, i) => (
                  <div key={p.nombre} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500 shrink-0">{i+1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{p.nombre}</span>
                        <span className="text-gray-400">{p.ventas} uds · USD {p.monto}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div className="h-1.5 rounded-full bg-[#2698D1] transition-all"
                          style={{ width: `${(p.ventas / TOP_PRODUCTOS[0].ventas) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D0D0D] mb-4">Rubros activos</h3>
              <div className="space-y-2 mb-5">
                {proveedor.rubros.map(r => (
                  <div key={r} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#2698D1] shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{RUBRO_LABELS[r as Rubro]}</span>
                    <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-green-500" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4">
                <p className="text-xs font-bold text-[#2698D1] mb-1">Tiempo de entrega promedio</p>
                <p className="text-2xl font-black text-[#2698D1]">{proveedor.tiempoEntregaHs}hs</p>
                <p className="text-xs text-blue-500 mt-0.5">Desde confirmación de OC</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}