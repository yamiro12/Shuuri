"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate } from '@/components/shared/utils';
import { PROVEEDORES, LIQUIDACIONES, getOTById } from '@/data/mock';
import {
  DollarSign, Clock, CheckCircle2, ChevronDown, ChevronUp,
  TrendingUp, FileText, AlertCircle, CreditCard,
} from 'lucide-react';

type Liq = typeof LIQUIDACIONES[number];

function EstadoLiqBadge({ estado }: { estado: string }) {
  const cfg: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PAGADA:         { label: 'Pagada',              cls: 'bg-green-100 text-green-700',   icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    PENDIENTE_PAGO: { label: 'Pendiente de pago',  cls: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3.5 w-3.5" /> },
    DEVENGADA:      { label: 'Devengada',           cls: 'bg-gray-100 text-gray-600',     icon: <TrendingUp className="h-3.5 w-3.5" /> },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-500', icon: null };
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  );
}

function FilaLiq({ liq }: { liq: Liq }) {
  const [expanded, setExpanded] = useState(false);
  const ot = getOTById(liq.otId);

  return (
    <div className={`border-b last:border-0 ${expanded ? 'bg-gray-50/50' : ''}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Icono */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
          liq.estado === 'PAGADA' ? 'bg-green-50' :
          liq.estado === 'PENDIENTE_PAGO' ? 'bg-yellow-50' : 'bg-gray-100'
        }`}>
          <DollarSign className={`h-5 w-5 ${
            liq.estado === 'PAGADA' ? 'text-green-500' :
            liq.estado === 'PENDIENTE_PAGO' ? 'text-yellow-500' : 'text-gray-400'
          }`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 font-mono">{liq.id}</span>
            <EstadoLiqBadge estado={liq.estado} />
          </div>
          <p className="text-sm font-medium text-[#0D0D0D]">OT {liq.otId}
            {ot && <span className="font-normal text-gray-400 ml-1">· {ot.equipoTipo} {ot.equipoMarca}</span>}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Devengado: {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
            {liq.fechaPago && <> · Pagado: {formatDate(liq.fechaPago)}</>}
          </p>
        </div>

        {/* Monto cobrado */}
        <div className="text-right shrink-0">
          <p className="text-sm font-black text-[#0D0D0D]">
            USD {liq.pagoProveedor ?? 0}
          </p>
          <p className="text-xs text-gray-400">A cobrar</p>
        </div>

        {/* Expand */}
        {expanded
          ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-300 shrink-0" />
        }
      </button>

      {/* DETALLE EXPANDIDO */}
      {expanded && (
        <div className="px-6 pb-5">
          <div className="rounded-xl bg-white border p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Desglose mandato</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Facturado total OT</span>
                <span className="font-medium text-gray-700">USD {liq.montoTotalFacturado}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Comisión SHUURI repuestos ({(liq.comisionRepuestosPct * 100).toFixed(0)}%)
                </span>
                <span className="font-medium text-red-500">− USD {liq.comisionRepuestos}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-black">
                <span className="text-[#0D0D0D]">Pago neto proveedor</span>
                <span className="text-green-600">USD {liq.pagoProveedor ?? 0}</span>
              </div>
            </div>

            {liq.estado === 'PENDIENTE_PAGO' && (
              <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-yellow-700">En proceso de liquidación</p>
                  <p className="text-xs text-yellow-600">Plazo: {PROVEEDORES.find(p => p.id === liq.proveedorId)?.legajo?.plazoLiquidacion ?? '72hs hábiles'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProveedorLiquidaciones() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const misLiqs = LIQUIDACIONES.filter(l => l.proveedorId === proveedorId);

  const totalCobrado  = misLiqs.filter(l => l.estado === 'PAGADA').reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);
  const totalPendiente = misLiqs.filter(l => l.estado === 'PENDIENTE_PAGO').reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);
  const totalComision  = misLiqs.reduce((s, l) => s + l.comisionRepuestos, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Liquidaciones</h1>
            <p className="text-sm text-gray-400 mt-0.5">{proveedor.nombre}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border bg-white shadow-sm p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-black text-[#0D0D0D]">USD {totalCobrado}</p>
              <p className="text-sm text-gray-500 mt-0.5">Total cobrado</p>
              <p className="text-xs text-gray-400 mt-1">{misLiqs.filter(l => l.estado === 'PAGADA').length} liquidaciones pagas</p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 mb-3">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-black text-[#0D0D0D]">{totalPendiente > 0 ? `USD ${totalPendiente}` : '—'}</p>
              <p className="text-sm text-gray-500 mt-0.5">Pendiente de cobro</p>
              <p className="text-xs text-gray-400 mt-1">Plazo: {proveedor.legajo?.plazoLiquidacion ?? '—'}</p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 mb-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-black text-[#0D0D0D]">USD {totalComision}</p>
              <p className="text-sm text-gray-500 mt-0.5">Comisiones SHUURI</p>
              <p className="text-xs text-gray-400 mt-1">{(15).toFixed(0)}% sobre repuestos despachados</p>
            </div>
          </div>

          {/* Datos bancarios */}
          <div className="mb-6 rounded-xl border bg-white shadow-sm p-5 flex items-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 shrink-0">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Cuenta de cobro registrada</p>
              <p className="text-sm font-medium text-[#0D0D0D]">{proveedor.legajo?.bancoOBilletera ?? '—'} · Alias: <span className="font-mono">{proveedor.legajo?.aliasCbu ?? '—'}</span></p>
              <p className="text-xs text-gray-400">{proveedor.legajo?.tipoFactura ?? '—'} · Email liquidaciones: {proveedor.legajo?.emailLiquidaciones ?? '—'}</p>
            </div>
          </div>

          {/* LISTA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4">
              <h2 className="font-bold text-[#0D0D0D]">Historial</h2>
              <p className="text-xs text-gray-400 mt-0.5">{misLiqs.length} liquidaciones · Expandí cada una para ver el desglose</p>
            </div>

            {misLiqs.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                <p className="font-bold text-gray-400">Sin liquidaciones todavía</p>
              </div>
            ) : (
              misLiqs.map(liq => <FilaLiq key={liq.id} liq={liq} />)
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
