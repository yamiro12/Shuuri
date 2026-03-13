"use client";
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import { PROVEEDORES, LIQUIDACIONES, OTS, RESTAURANTES } from '@/data/mock';
import { COMISION_REPUESTOS, PCT_PROVEEDOR_REP } from '@/lib/business';
import {
  DollarSign, TrendingDown, CheckCircle2, Clock,
  Info, Package, ChevronDown, ChevronUp,
} from 'lucide-react';

type Liq = typeof LIQUIDACIONES[number];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    PAGADA:         { label: 'Pagada',            cls: 'bg-green-100 text-green-700' },
    PENDIENTE_PAGO: { label: 'Pendiente de pago', cls: 'bg-yellow-100 text-yellow-700' },
    DEVENGADA:      { label: 'Devengada',         cls: 'bg-blue-100 text-blue-700' },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.cls}`}>{c.label}</span>
  );
}

function FilaComision({ liq }: { liq: Liq }) {
  const [open, setOpen] = useState(false);
  const ot   = OTS.find(o => o.id === liq.otId);
  const rest = ot ? RESTAURANTES.find(r => r.id === ot.restauranteId) : undefined;

  const repBruto = ot?.cotizacion?.itemsRepuestos?.reduce(
    (s, i) => s + i.cantidad * i.precioUnitario, 0,
  ) ?? 0;

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="grid w-full grid-cols-7 items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors min-w-[700px]"
      >
        <span className="text-xs font-mono text-gray-400">{liq.id}</span>
        <span className="text-xs font-bold text-[#2698D1]">{liq.otId}</span>
        <span className="text-sm text-gray-600 truncate">{rest?.nombre ?? '—'}</span>
        <span className="text-sm text-gray-500">
          {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
        </span>
        <span className="text-sm text-red-500">− {formatARS(liq.comisionRepuestos)}</span>
        <span className="text-sm font-black text-green-700">{formatARS(liq.pagoProveedor ?? 0)}</span>
        <span className="flex items-center justify-between pr-2">
          <EstadoBadge estado={liq.estado} />
          {open
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-300" />}
        </span>
      </button>

      {open && (
        <div className="bg-gray-50 border-t px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Repuestos brutos */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Repuestos despachados</p>
              <div className="space-y-2">
                {ot?.cotizacion?.itemsRepuestos?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate pr-2">{item.descripcion} ×{item.cantidad}</span>
                    <span className="font-medium text-gray-700 shrink-0">{formatARS(item.precioUnitario * item.cantidad)}</span>
                  </div>
                )) ?? <p className="text-xs text-gray-400 italic">Sin repuestos en cotización</p>}
                {repBruto > 0 && (
                  <div className="border-t pt-2 flex justify-between text-sm font-bold">
                    <span>Total repuestos</span>
                    <span>{formatARS(repBruto)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comisión SHUURI */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Comisión SHUURI (OCR)</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total repuestos</span>
                  <span className="font-medium text-gray-700">{formatARS(repBruto)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tasa OCR ({Math.round(COMISION_REPUESTOS * 100)}%)</span>
                  <span className="font-medium text-red-500">− {formatARS(liq.comisionRepuestos)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-bold text-red-600">
                  <span>Comisión total</span>
                  <span>− {formatARS(liq.comisionRepuestos)}</span>
                </div>
              </div>
            </div>

            {/* Neto proveedor */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Tu liquidación</p>
              <div className="space-y-2">
                {liq.fechaDevengado && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Devengado</span><span>{formatDate(liq.fechaDevengado)}</span>
                  </div>
                )}
                {liq.fechaPago && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Acreditado</span><span>{formatDate(liq.fechaPago)}</span>
                  </div>
                )}
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-3 text-center mt-2">
                  <p className="text-xs text-green-600 font-medium">Neto a cobrar</p>
                  <p className="text-xl font-black text-green-700">{formatARS(liq.pagoProveedor ?? 0)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ProveedorComisiones() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const misLiqs = useMemo(
    () => LIQUIDACIONES.filter(l => l.proveedorId === proveedorId && (l.comisionRepuestos ?? 0) > 0),
    [proveedorId],
  );

  const totalComision  = misLiqs.reduce((s, l) => s + l.comisionRepuestos, 0);
  const totalNeto      = misLiqs.reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);
  const pagadas        = misLiqs.filter(l => l.estado === 'PAGADA');
  const pendientes     = misLiqs.filter(l => l.estado !== 'PAGADA');
  const totalPendiente = pendientes.reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="page-main">

          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Comisiones OCR</h1>
            <p className="text-sm text-gray-400 mt-0.5">{proveedor.nombre} · Modelo de comisiones sobre repuestos despachados</p>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Comisión retenida',
                value: formatARS(totalComision),
                sub:   `${Math.round(COMISION_REPUESTOS * 100)}% sobre repuestos`,
                icon:  TrendingDown,
                color: 'text-red-500',
                bg:    'bg-red-50',
              },
              {
                label: 'Neto cobrado',
                value: formatARS(totalNeto),
                sub:   `${Math.round(PCT_PROVEEDOR_REP * 100)}% del total repuestos`,
                icon:  DollarSign,
                color: 'text-green-600',
                bg:    'bg-green-50',
              },
              {
                label: 'Liquidaciones pagas',
                value: pagadas.length,
                sub:   'con repuestos despachados',
                icon:  CheckCircle2,
                color: 'text-blue-600',
                bg:    'bg-blue-50',
              },
              {
                label: 'Pendiente de cobro',
                value: totalPendiente > 0 ? formatARS(totalPendiente) : '—',
                sub:   `${pendientes.length} liquidación${pendientes.length !== 1 ? 'es' : ''} en proceso`,
                icon:  Clock,
                color: 'text-yellow-600',
                bg:    'bg-yellow-50',
              },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-black text-[#0D0D0D]">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Nota modelo OCR */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Modelo OCR (Orden de Compra de Repuestos):</strong> SHUURI retiene el {Math.round(COMISION_REPUESTOS * 100)}% del valor de repuestos como comisión de plataforma. Vos recibís el {Math.round(PCT_PROVEEDOR_REP * 100)}% neto. Esta comisión es independiente de la comisión de mano de obra que cobra SHUURI al técnico.
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center gap-3">
              <Package className="h-4 w-4 text-gray-400" />
              <div>
                <h2 className="font-bold text-[#0D0D0D]">Detalle por liquidación</h2>
                <p className="text-xs text-gray-400 mt-0.5">{misLiqs.length} liquidación{misLiqs.length !== 1 ? 'es' : ''} con repuestos · Expandí para ver el desglose</p>
              </div>
            </div>

            {misLiqs.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm italic">
                Sin liquidaciones con repuestos despachados todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 border-b bg-gray-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 min-w-[700px]">
                  <span>Liquidación</span>
                  <span>OT</span>
                  <span>Gastronómico</span>
                  <span>Devengado</span>
                  <span>Comisión SHUURI</span>
                  <span className="text-[#0D0D0D]">Neto proveedor</span>
                  <span>Estado</span>
                </div>
                {misLiqs.map(liq => <FilaComision key={liq.id} liq={liq} />)}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
