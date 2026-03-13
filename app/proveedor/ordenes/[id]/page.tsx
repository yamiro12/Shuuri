"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate, formatARS } from '@/components/shared/utils';
import {
  OCS, PROVEEDORES, getOTById, getRestauranteById, getTecnicoById,
  MOCK_ORDENES_COMPRA, REPUESTOS_MKT,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, OrdenCompraRepuesto } from '@/types/shuuri';
import {
  ArrowLeft, Package, Truck, CheckCircle2,
  Clock, MapPin, Wrench, Building2,
  ChevronRight, X, AlertCircle, ShoppingCart,
} from 'lucide-react';

type OC = typeof OCS[number];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function EstadoBadgeOC({ estado }: { estado: string }) {
  const cfg: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    CONFIRMADA: { label: 'Confirmada — pendiente de despacho', cls: 'bg-blue-100 text-blue-800 border border-blue-200',    icon: <Clock className="h-4 w-4" /> },
    DESPACHADA: { label: 'Despachada — en camino',             cls: 'bg-purple-100 text-purple-800 border border-purple-200', icon: <Truck className="h-4 w-4" /> },
    ENTREGADA:  { label: 'Entregada al técnico',               cls: 'bg-green-100 text-green-800 border border-green-200',  icon: <CheckCircle2 className="h-4 w-4" /> },
    CANCELADA:  { label: 'Cancelada',                          cls: 'bg-red-100 text-red-800 border border-red-200',        icon: <X className="h-4 w-4" /> },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600', icon: null };
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${c.cls}`}>
      {c.icon}<span className="font-bold text-sm">{c.label}</span>
    </div>
  );
}

function EstadoBadgeOCR({ estado }: { estado: OrdenCompraRepuesto['estado'] }) {
  const cfg: Record<OrdenCompraRepuesto['estado'], { label: string; cls: string; icon: React.ReactNode }> = {
    pendiente:            { label: 'Pendiente de aprobación',    cls: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: <Clock className="h-4 w-4" /> },
    confirmada_proveedor: { label: 'Confirmada — en preparación', cls: 'bg-blue-100 text-blue-800 border border-blue-200',      icon: <Package className="h-4 w-4" /> },
    despachada:           { label: 'Despachada — en camino',      cls: 'bg-purple-100 text-purple-800 border border-purple-200', icon: <Truck className="h-4 w-4" /> },
    entregada_local:      { label: 'Entregada al local',          cls: 'bg-green-100 text-green-800 border border-green-200',   icon: <CheckCircle2 className="h-4 w-4" /> },
    cancelada:            { label: 'Cancelada',                   cls: 'bg-red-100 text-red-800 border border-red-200',         icon: <X className="h-4 w-4" /> },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600', icon: null };
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${c.cls}`}>
      {c.icon}<span className="font-bold text-sm">{c.label}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#0D0D0D] text-right">{value}</span>
    </div>
  );
}

// ─── DETALLE OC LEGACY ────────────────────────────────────────────────────────

function DetalleOC({ oc, proveedor, estadoActual, onAvanzar, toast }: {
  oc: OC;
  proveedor: typeof PROVEEDORES[number];
  estadoActual: string;
  onAvanzar: (estado: string, msg: string) => void;
  toast: string | null;
}) {
  const ot          = getOTById(oc.otId);
  const restaurante = ot ? getRestauranteById(ot.restauranteId) : null;
  const tecnico     = ot?.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
  const totalItems  = oc.items.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0);
  const puedeDespachar = estadoActual === 'CONFIRMADA';

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-[#0D0D0D]">{oc.id}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Creada el {formatDate(oc.fechaCreacion)}
                {oc.fechaEntregaEstimada && ` · Entrega estimada: ${formatDate(oc.fechaEntregaEstimada)}`}
              </p>
            </div>
          </div>
          <EstadoBadgeOC estado={estadoActual} />
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="font-bold text-[#0D0D0D]">Ítems de la orden</h2>
            <p className="text-xs text-gray-400 mt-0.5">{oc.items.length} producto{oc.items.length > 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b">
            <p className="col-span-6 text-xs font-bold text-gray-400 uppercase tracking-wide">Descripción</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-center">Cant.</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-right">P. Unit.</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-right">Subtotal</p>
          </div>
          {oc.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b last:border-0 items-center">
              <div className="col-span-6">
                <p className="text-sm font-medium text-[#0D0D0D]">{item.descripcion}</p>
                <span className="inline-block mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {item.esRepuesto ? 'Repuesto' : 'Material'}
                </span>
              </div>
              <p className="col-span-2 text-sm text-gray-600 text-center font-medium">{item.cantidad}</p>
              <p className="col-span-2 text-sm text-gray-600 text-right">USD {item.precioUnitario}</p>
              <p className="col-span-2 text-sm font-black text-[#0D0D0D] text-right">USD {item.cantidad * item.precioUnitario}</p>
            </div>
          ))}
          <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-t">
            <span className="text-sm font-bold text-gray-600">Total orden</span>
            <span className="text-xl font-black text-[#0D0D0D]">USD {oc.montoTotal}</span>
          </div>
        </div>

        {puedeDespachar && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#2698D1] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#2698D1] mb-1">Instrucciones de despacho</p>
                <p className="text-sm text-gray-600 mb-2">SHUURI coordinará el retiro. Tené los ítems empaquetados y etiquetados.</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>📦 Empacar con protección adecuada para repuestos frágiles</p>
                  <p>🏷️ Etiquetar bultos con: <span className="font-mono font-bold">{oc.id} / {oc.otId}</span></p>
                  <p>🕐 Horario de despacho: {proveedor.legajo?.horarioDespacho ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {puedeDespachar && (
          <div className="rounded-xl border-2 border-[#2698D1]/30 bg-blue-50 p-5">
            <p className="text-xs font-bold text-[#2698D1] uppercase tracking-wide mb-3">Confirmar despacho</p>
            <p className="text-xs text-gray-500 mb-4">Una vez listos para retiro, confirmá el despacho.</p>
            <button onClick={() => onAvanzar('DESPACHADA', 'Despacho confirmado · Técnico notificado')}
              className="w-full rounded-xl bg-[#2698D1] px-4 py-3 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" /> Confirmar despacho
            </button>
          </div>
        )}
        {estadoActual === 'DESPACHADA' && (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 text-center">
            <Truck className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <p className="font-bold text-purple-700 text-sm">En camino</p>
            <p className="text-xs text-purple-500 mt-1">El técnico fue notificado</p>
          </div>
        )}
        {estadoActual === 'ENTREGADA' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <p className="font-bold text-green-700 text-sm">Entregada</p>
            <p className="text-xs text-green-500 mt-1">Confirmada por el técnico</p>
          </div>
        )}
        {ot && (
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">OT asociada</p>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0">
                <Wrench className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 font-mono">{ot.id}</p>
                <p className="text-sm font-bold text-[#0D0D0D]">{ot.equipoTipo} {ot.equipoMarca}</p>
                <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
              </div>
            </div>
            <InfoRow label="Falla"  value={ot.descripcionFalla?.substring(0, 60) + (ot.descripcionFalla?.length > 60 ? '…' : '')} />
            <InfoRow label="Estado" value={ot.estado.replace(/_/g, ' ')} />
          </div>
        )}
        {restaurante && (
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cliente final</p>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-gray-300 shrink-0" />
              <p className="text-sm font-bold text-[#0D0D0D]">{restaurante.nombre}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">{restaurante.direccion}</p>
            </div>
          </div>
        )}
        <div className="rounded-xl border bg-white shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Liquidación</p>
          <InfoRow label="Plazo"   value={proveedor.legajo?.plazoLiquidacion} />
          <InfoRow label="Factura" value={proveedor.legajo?.tipoFactura} />
          <InfoRow label="Banco"   value={proveedor.legajo?.bancoOBilletera} />
          <InfoRow label="Alias"   value={proveedor.legajo?.aliasCbu} />
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE OCR ──────────────────────────────────────────────────────────────

function DetalleOCR({ ocr, proveedor, estadoLocal, setEstadoLocal, showToast }: {
  ocr: OrdenCompraRepuesto;
  proveedor: typeof PROVEEDORES[number];
  estadoLocal: string | null;
  setEstadoLocal: (s: string) => void;
  showToast: (msg: string) => void;
}) {
  const [numSeg, setNumSeg] = useState(ocr.numeroSeguimiento ?? '');
  const estadoActual = (estadoLocal ?? ocr.estado) as OrdenCompraRepuesto['estado'];

  const ot          = getOTById(ocr.otId);
  const restaurante = getRestauranteById(ocr.restauranteId);
  const tecnico     = getTecnicoById(ocr.tecnicoId);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Columna principal */}
      <div className="col-span-2 space-y-5">
        {/* Estado */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pedido de Repuesto</span>
                {ocr.aprobadoAutomaticamente && (
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Pre-aprobado automáticamente</span>
                )}
              </div>
              <h1 className="text-xl font-black text-[#0D0D0D]">{ocr.id}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Creada el {formatDate(ocr.creadaEn)} · Por: {ocr.creadaPor}
                {ocr.fechaEstimadaEntrega && ` · Entrega est.: ${formatDate(ocr.fechaEstimadaEntrega)}`}
              </p>
            </div>
          </div>
          <EstadoBadgeOCR estado={estadoActual} />
        </div>

        {/* Ítems */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="font-bold text-[#0D0D0D]">Ítems del pedido</h2>
            <p className="text-xs text-gray-400 mt-0.5">{ocr.items.length} ítem{ocr.items.length > 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b">
            <p className="col-span-6 text-xs font-bold text-gray-400 uppercase tracking-wide">Descripción</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-center">Cant.</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-right">P. Unit. ARS</p>
            <p className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wide text-right">Total ARS</p>
          </div>
          {ocr.items.map((item, idx) => {
            const repuesto = item.repuestoId ? REPUESTOS_MKT.find(r => r.id === item.repuestoId) : null;
            const nombre   = repuesto?.nombre ?? item.descripcionLibre ?? `Ítem ${idx + 1}`;
            return (
              <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 border-b last:border-0 items-center">
                <div className="col-span-6">
                  <p className="text-sm font-medium text-[#0D0D0D]">{nombre}</p>
                  {item.repuestoId && <p className="text-xs text-gray-400 font-mono mt-0.5">{item.repuestoId}</p>}
                  {!item.repuestoId && !item.productoId && (
                    <span className="inline-block mt-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">Ítem libre</span>
                  )}
                </div>
                <p className="col-span-2 text-sm text-gray-600 text-center font-medium">{item.cantidad}</p>
                <p className="col-span-2 text-sm text-gray-600 text-right">{formatARS(item.precioUnitarioARS)}</p>
                <p className="col-span-2 text-sm font-black text-[#0D0D0D] text-right">{formatARS(item.totalARS)}</p>
              </div>
            );
          })}
          <div className="bg-gray-50 px-6 py-4 border-t space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>{formatARS(ocr.subtotalARS)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Comisión SHUURI (15%)</span><span>{formatARS(ocr.totalComisionARS)}</span>
            </div>
            <div className="flex justify-between font-black text-[#0D0D0D] pt-1.5 border-t">
              <span>Total ARS</span><span className="text-xl">{formatARS(ocr.totalARS)}</span>
            </div>
          </div>
        </div>

        {/* Logística */}
        {(ocr.numeroSeguimiento || ocr.transportista) && (
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <h2 className="font-bold text-[#0D0D0D] mb-4">Información logística</h2>
            <InfoRow label="Transportista"       value={ocr.transportista} />
            <InfoRow label="N° seguimiento"       value={ocr.numeroSeguimiento} />
            <InfoRow label="Entrega estimada"     value={ocr.fechaEstimadaEntrega ? formatDate(ocr.fechaEstimadaEntrega) : null} />
            <InfoRow label="Entrega real"         value={ocr.fechaEntregaReal ? formatDate(ocr.fechaEntregaReal) : null} />
          </div>
        )}

        {/* Panel en_preparacion: input seguimiento */}
        {estadoActual === 'confirmada_proveedor' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-bold text-[#2698D1] mb-3">Preparar envío</p>
            <label className="text-xs text-gray-500 mb-1 block">Número de seguimiento (opcional)</label>
            <input value={numSeg} onChange={e => setNumSeg(e.target.value)} placeholder="Ej: OCA-2026-123456"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] mb-3 bg-white" />
            <button
              onClick={() => { setEstadoLocal('despachada'); showToast('Pedido marcado como enviado · Técnico notificado'); }}
              className="w-full rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" /> Marcar como enviado
            </button>
          </div>
        )}
      </div>

      {/* Columna lateral */}
      <div className="space-y-5">
        {/* Acciones según estado */}
        {estadoActual === 'pendiente' && (
          <div className="rounded-xl border-2 border-[#2698D1]/30 bg-blue-50 p-5 space-y-3">
            <p className="text-xs font-bold text-[#2698D1] uppercase tracking-wide">Confirmar disponibilidad</p>
            <p className="text-xs text-gray-500">Verificá stock y disponibilidad antes de confirmar.</p>
            <button onClick={() => { setEstadoLocal('confirmada_proveedor'); showToast('Disponibilidad confirmada'); }}
              className="w-full rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Confirmar disponibilidad
            </button>
            <button onClick={() => { setEstadoLocal('cancelada'); showToast('Pedido rechazado'); }}
              className="w-full rounded-xl border border-red-200 text-red-500 py-2.5 text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2">
              <X className="h-4 w-4" /> Rechazar
            </button>
          </div>
        )}

        {estadoActual === 'despachada' && (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">En camino</p>
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-6 w-6 text-purple-500" />
              <div>
                <p className="font-bold text-purple-800 text-sm">Pedido despachado</p>
                {ocr.transportista && <p className="text-xs text-purple-600">{ocr.transportista}{ocr.numeroSeguimiento ? ` · ${ocr.numeroSeguimiento}` : ''}</p>}
              </div>
            </div>
            <button onClick={() => { setEstadoLocal('entregada_local'); showToast('Entrega confirmada · OT actualizada'); }}
              className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white hover:bg-green-600 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Confirmar entrega recibida
            </button>
          </div>
        )}

        {estadoActual === 'entregada_local' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <p className="font-bold text-green-700 text-sm">Entregado</p>
            <p className="text-xs text-green-600 mt-1">El repuesto fue recibido en el local</p>
          </div>
        )}

        {estadoActual === 'cancelada' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <X className="mx-auto h-8 w-8 text-red-400 mb-2" />
            <p className="font-bold text-red-600 text-sm">Cancelada</p>
          </div>
        )}

        {/* OT */}
        {ot && (
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">OT asociada</p>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 shrink-0">
                <Wrench className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 font-mono">{ot.id}</p>
                <p className="text-sm font-bold text-[#0D0D0D]">{ot.equipoTipo} {ot.equipoMarca}</p>
                <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
              </div>
            </div>
            <InfoRow label="Falla"  value={ot.descripcionFalla?.substring(0, 60) + (ot.descripcionFalla?.length > 60 ? '…' : '')} />
            <InfoRow label="Estado" value={ot.estado.replace(/_/g, ' ')} />
          </div>
        )}

        {/* Técnico */}
        {tecnico && (
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Técnico asignado</p>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2698D1]/10 text-sm font-black text-[#2698D1] shrink-0">
                {tecnico.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0D0D0D]">{tecnico.nombre}</p>
                <p className="text-xs text-gray-400">{tecnico.zona}</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurante */}
        {restaurante && (
          <div className="rounded-xl border bg-white shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Local destino</p>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-gray-300 shrink-0" />
              <p className="text-sm font-bold text-[#0D0D0D]">{restaurante.nombre}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">{restaurante.direccion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ProveedorOrdenDetalle() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [estadoLocal, setEstadoLocal] = useState<string | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Buscar primero en OCRs, luego en OCs legacy
  const ocr = MOCK_ORDENES_COMPRA.find(o => o.id === params.id);
  const oc  = !ocr ? OCS.find(o => o.id === params.id) : null;

  if (!ocr && !oc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-300 mb-2">Orden no encontrada</p>
          <Link href={`/proveedor/ordenes?id=${proveedorId}`} className="text-sm text-[#2698D1] hover:underline">
            ← Volver a mis órdenes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          <div className="mb-6 flex items-center gap-2">
            <Link href={`/proveedor/ordenes?id=${proveedorId}`}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#0D0D0D] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Órdenes
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-sm font-mono text-gray-500">{params.id as string}</span>
            {ocr && (
              <span className="rounded-full bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5">Pedido Repuesto</span>
            )}
          </div>

          {ocr && (
            <DetalleOCR
              ocr={ocr}
              proveedor={proveedor}
              estadoLocal={estadoLocal}
              setEstadoLocal={setEstadoLocal}
              showToast={showToast}
            />
          )}

          {oc && (
            <DetalleOC
              oc={oc}
              proveedor={proveedor}
              estadoActual={estadoLocal ?? oc.estado}
              onAvanzar={(estado, msg) => { setEstadoLocal(estado); showToast(msg); }}
              toast={toast}
            />
          )}

        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
