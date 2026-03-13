"use client";
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import { PROVEEDORES, OCS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Package, ShoppingCart, DollarSign, TrendingUp,
  ChevronRight, Star, Clock, CheckCircle2,
  AlertCircle, Truck, ArrowUpRight, Zap,
} from 'lucide-react';

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color, bg, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; bg: string; href?: string;
}) {
  const content = (
    <div className={`rounded-xl border bg-white p-5 shadow-sm ${href ? 'hover:border-[#2698D1]/40 hover:shadow-md transition-all cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        {href && <ArrowUpRight className="h-4 w-4 text-gray-300" />}
      </div>
      <p className="text-2xl font-black text-[#0D0D0D]">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// ─── ESTADO OC BADGE ──────────────────────────────────────────────────────────

function EstadoOCBadge({ estado }: { estado: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    CONFIRMADA: { label: 'Confirmada',  cls: 'bg-blue-100 text-blue-700' },
    DESPACHADA: { label: 'Despachada',  cls: 'bg-purple-100 text-purple-700' },
    ENTREGADA:  { label: 'Entregada',   cls: 'bg-green-100 text-green-700' },
    CANCELADA:  { label: 'Cancelada',   cls: 'bg-red-100 text-red-600' },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-500' };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.cls}`}>{c.label}</span>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ProveedorDashboard() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const misOCs   = OCS.filter(oc => oc.proveedorId === proveedorId);
  const misLiqs  = LIQUIDACIONES.filter(l => l.proveedorId === proveedorId);

  // KPIs
  const ocsActivas    = misOCs.filter(oc => oc.estado === 'CONFIRMADA' || oc.estado === 'DESPACHADA');
  const ocsEntregadas = misOCs.filter(oc => oc.estado === 'ENTREGADA');
  const montoTotal    = misOCs.reduce((s, oc) => s + oc.montoTotal, 0);
  const pendienteCobro = misLiqs.filter(l => l.estado === 'PENDIENTE_PAGO').reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);

  const ocsRecientes = [...misOCs].sort(
    (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  ).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-[#0D0D0D]">{proveedor.nombre}</h1>
                {proveedor.esShuuriPro && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-700">
                    <Zap className="h-3 w-3" /> SHUURI Pro
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {proveedor.legajo?.tipoProveedor ?? '—'} · {proveedor.legajo?.cantidadSKUs ?? '—'} SKUs
                · Entrega en {proveedor.tiempoEntregaHs}hs
              </p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <KpiCard
              label="Órdenes activas"
              value={ocsActivas.length}
              icon={ShoppingCart}
              color="text-[#2698D1]"
              bg="bg-blue-50"
              href={`/proveedor/ordenes?id=${proveedorId}`}
              sub="Confirmadas + despachadas"
            />
            <KpiCard
              label="Entregas completadas"
              value={ocsEntregadas.length}
              icon={CheckCircle2}
              color="text-green-600"
              bg="bg-green-50"
              href={`/proveedor/ordenes?id=${proveedorId}`}
            />
            <KpiCard
              label="Facturado total"
              value={`USD ${montoTotal}`}
              icon={DollarSign}
              color="text-purple-600"
              bg="bg-purple-50"
              sub="Todas las órdenes"
            />
            <KpiCard
              label="Pendiente de cobro"
              value={pendienteCobro > 0 ? `USD ${pendienteCobro}` : '—'}
              icon={Clock}
              color="text-orange-600"
              bg="bg-orange-50"
              href={`/proveedor/liquidaciones?id=${proveedorId}`}
              sub="En proceso de liquidación"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* OCs RECIENTES */}
            <div className="col-span-2">
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="font-bold text-[#0D0D0D]">Órdenes de compra recientes</h2>
                  <Link href={`/proveedor/ordenes?id=${proveedorId}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#2698D1] hover:underline">
                    Ver todas <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {ocsRecientes.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                    <p className="font-bold text-gray-400">Sin órdenes todavía</p>
                  </div>
                ) : (
                  <div>
                    {ocsRecientes.map(oc => (
                      <Link key={oc.id} href={`/proveedor/ordenes/${oc.id}?id=${proveedorId}`}>
                        <div className="flex items-center gap-4 border-b last:border-0 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-gray-400 font-mono">{oc.id}</span>
                              <EstadoOCBadge estado={oc.estado} />
                            </div>
                            <p className="text-sm font-medium text-[#0D0D0D] truncate">
                              {oc.items.map(i => i.descripcion).join(', ')}
                            </p>
                            <p className="text-xs text-gray-400">{oc.items.length} ítem{oc.items.length > 1 ? 's' : ''} · OT {oc.otId}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-[#0D0D0D]">USD {oc.montoTotal}</p>
                            <p className="text-xs text-gray-400">{formatDate(oc.fechaCreacion)}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] transition-colors shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PANEL LATERAL */}
            <div className="space-y-5">

              {/* Rubros */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Rubros activos</h3>
                <div className="space-y-1.5">
                  {proveedor.rubros.map(r => (
                    <div key={r} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <div className="h-2 w-2 rounded-full bg-[#2698D1] shrink-0" />
                      <span className="text-xs font-medium text-gray-600">{RUBRO_LABELS[r as Rubro]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datos operativos */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Operaciones</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Entrega',     val: proveedor.legajo?.tiempoEntrega ?? '—' },
                    { label: 'Despacho',    val: proveedor.legajo?.horarioDespacho ?? '—' },
                    { label: 'Logística',   val: proveedor.legajo?.logisticaPropia === 'Sí' ? 'Propia ✓' : 'Tercerizada' },
                    { label: 'Liquidación', val: proveedor.legajo?.plazoLiquidacion ?? '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-gray-400 shrink-0">{label}</span>
                      <span className="text-xs font-medium text-gray-700 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Contacto comercial</h3>
                <p className="text-sm font-bold text-[#0D0D0D]">{proveedor.legajo?.comercialNombre ?? '—'}</p>
                <p className="text-xs text-gray-400">{proveedor.legajo?.comercialCargo ?? '—'}</p>
                <p className="text-xs text-[#2698D1] mt-1">{proveedor.legajo?.comercialEmail ?? '—'}</p>
                <p className="text-xs text-gray-500">{proveedor.legajo?.comercialTel ?? '—'}</p>
              </div>

              {/* Quick links */}
              <div className="rounded-xl border bg-white shadow-sm p-4">
                <div className="space-y-1">
                  {[
                    { href: `/proveedor/ordenes?id=${proveedorId}`,       label: 'Mis órdenes',   icon: ShoppingCart },
                    { href: `/proveedor/catalogo?id=${proveedorId}`,      label: 'Catálogo',      icon: Package },
                    { href: `/proveedor/liquidaciones?id=${proveedorId}`, label: 'Liquidaciones', icon: DollarSign },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#2698D1] transition-colors">
                      <Icon className="h-4 w-4" />
                      {label}
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
