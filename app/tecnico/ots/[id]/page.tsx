"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import { getOTById, getTecnicoById, getRestauranteById, getEquipoById, getOCsByOT } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, EstadoOT } from '@/types/shuuri';
import {
  ArrowLeft, MapPin, Wrench, Package,
  CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Camera, FileText,
  Phone, Building2, Play, Flag,
  DollarSign, Plus, Trash2, X,
} from 'lucide-react';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

type OT = NonNullable<ReturnType<typeof getOTById>>;

function InfoRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className={`text-sm text-right text-[#0D0D0D] font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

// ─── ACCIONES POR ESTADO ──────────────────────────────────────────────────────

const ACCION_LABELS: Partial<Record<string, string>> = {
  TECNICO_ASIGNADO:    'Iniciar visita',
  EN_VISITA:           'Emitir cotización',
  AUTORIZADA:          'Iniciar ejecución',
  REPUESTO_SOLICITADO: 'Confirmar recepción de repuestos',
  EN_EJECUCION:        'Finalizar trabajo',
  PENDIENTE_CONFORMIDAD: 'Registrar conformidad',
};

// ─── MODAL COTIZACIÓN ─────────────────────────────────────────────────────────

interface ItemCot { desc: string; qty: number; precio: number; esRepuesto: boolean }

function ModalCotizacion({ ot, onClose, onConfirm }: {
  ot: OT;
  onClose: () => void;
  onConfirm: (items: ItemCot[], mdo: number, diag: string) => void;
}) {
  const [items,      setItems]      = useState<ItemCot[]>([
    { desc: '', qty: 1, precio: 0, esRepuesto: true },
  ]);
  const [mdo,        setMdo]        = useState(0);
  const [diagnostico,setDiagnostico] = useState('');

  function addItem() {
    setItems(i => [...i, { desc: '', qty: 1, precio: 0, esRepuesto: true }]);
  }
  function removeItem(idx: number) {
    setItems(i => i.filter((_, j) => j !== idx));
  }
  function updateItem(idx: number, k: keyof ItemCot, v: string | number | boolean) {
    setItems(prev => prev.map((it, j) => j === idx ? { ...it, [k]: v } : it));
  }

  const subtotalRepuestos = items.filter(i => i.esRepuesto).reduce((s, i) => s + i.qty * i.precio, 0);
  const subtotalOtros     = items.filter(i => !i.esRepuesto).reduce((s, i) => s + i.qty * i.precio, 0);
  const total             = subtotalRepuestos + subtotalOtros + mdo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="font-black text-[#0D0D0D]">Emitir cotización definitiva</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ot.id} · {ot.equipoTipo} {ot.equipoMarca}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Diagnóstico */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
              Diagnóstico técnico <span className="text-red-400">*</span>
            </label>
            <textarea
              value={diagnostico}
              onChange={e => setDiagnostico(e.target.value)}
              rows={3}
              placeholder="Describí el problema encontrado y el trabajo a realizar…"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] resize-none"
            />
          </div>

          {/* Ítems */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Repuestos y materiales</label>
              <button onClick={addItem} className="flex items-center gap-1 text-xs font-bold text-[#2698D1] hover:text-[#2698D1]/70">
                <Plus className="h-3.5 w-3.5" /> Agregar ítem
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 p-3">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      value={item.desc}
                      onChange={e => updateItem(idx, 'desc', e.target.value)}
                      placeholder="Descripción"
                      className="col-span-7 rounded-lg border border-gray-100 px-3 py-2 text-xs outline-none focus:border-[#2698D1]"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={e => updateItem(idx, 'qty', Number(e.target.value))}
                      min={1}
                      className="col-span-2 rounded-lg border border-gray-100 px-3 py-2 text-xs outline-none focus:border-[#2698D1] text-center"
                    />
                    <input
                      type="number"
                      value={item.precio || ''}
                      onChange={e => updateItem(idx, 'precio', Number(e.target.value))}
                      placeholder="USD"
                      className="col-span-2 rounded-lg border border-gray-100 px-3 py-2 text-xs outline-none focus:border-[#2698D1]"
                    />
                    <button onClick={() => removeItem(idx)} disabled={items.length === 1}
                      className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-400 disabled:opacity-30">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                      <input type="checkbox" checked={item.esRepuesto}
                        onChange={e => updateItem(idx, 'esRepuesto', e.target.checked)}
                        className="rounded" />
                      Repuesto (aplica comisión proveedor)
                    </label>
                    {item.qty > 0 && item.precio > 0 && (
                      <span className="ml-auto text-xs font-bold text-gray-500">
                        = USD {(item.qty * item.precio).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mano de obra */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Mano de obra (USD)</label>
            <input
              type="number"
              value={mdo || ''}
              onChange={e => setMdo(Number(e.target.value))}
              placeholder="0"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1]"
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Repuestos</span>
            <span>USD {subtotalRepuestos.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Otros materiales</span>
            <span>USD {subtotalOtros.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Mano de obra</span>
            <span>USD {mdo.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-black text-[#0D0D0D]">
            <span>Total</span>
            <span className="text-lg">USD {total.toFixed(0)}</span>
          </div>
        </div>

        <div className="flex gap-3 border-t px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => diagnostico.trim() && total > 0 && onConfirm(items, mdo, diagnostico)}
            disabled={!diagnostico.trim() || total === 0}
            className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed">
            Emitir cotización
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function TecnicoOTDetalle() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const tecnicoId    = searchParams.get('tecnicoId') ?? 'T002';
  const ot           = getOTById(params.id as string);
  const tecnico      = getTecnicoById(tecnicoId);

  const [estadoLocal,  setEstadoLocal]  = useState<string | null>(null);
  const [showCotModal, setShowCotModal] = useState(false);
  const [toast,        setToast]        = useState<string | null>(null);
  const [cotLocal,     setCotLocal]     = useState<{ total: number; diagnostico: string } | null>(null);

  if (!ot || !tecnico) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-300 mb-2">OT no encontrada</p>
          <Link href="/tecnico/ots" className="text-sm text-[#2698D1] hover:underline">← Volver a mis OTs</Link>
        </div>
      </div>
    );
  }

  const restaurante = getRestauranteById(ot.restauranteId);
  const equipo      = ot.equipoId ? getEquipoById(ot.equipoId) : null;
  const ocs         = getOCsByOT(ot.id);
  const estadoActual = (estadoLocal ?? ot.estado) as EstadoOT;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function avanzarEstado() {
    const SIGUIENTE: Record<string, string> = {
      TECNICO_ASIGNADO:     'EN_VISITA',
      AUTORIZADA:           'EN_EJECUCION',
      REPUESTO_SOLICITADO:  'EN_EJECUCION',
      EN_EJECUCION:         'PENDIENTE_CONFORMIDAD',
      PENDIENTE_CONFORMIDAD:'CERRADA_CONFORME',
    };
    const sig = SIGUIENTE[estadoActual as string];
    if (sig) {
      setEstadoLocal(sig);
      showToast(`Estado actualizado a ${sig.replace(/_/g,' ')}`);
    }
  }

  const accionLabel = ACCION_LABELS[estadoActual as string];
  const esCerrada   = (['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'] as string[]).includes(estadoActual);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="TECNICO" userName={tecnico.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="TECNICO" userName={tecnico.nombre} />
        <main className="p-8">

          {/* BREADCRUMB */}
          <div className="mb-6 flex items-center gap-2">
            <Link href={`/tecnico/ots?id=${tecnicoId}`}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#0D0D0D] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Mis OTs
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-sm font-mono text-gray-500">{ot.id}</span>
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* ── COLUMNA PRINCIPAL ── */}
            <div className="col-span-2 space-y-5">

              {/* Card principal */}
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className={`h-2 w-full ${
                  ot.urgencia === 'CRITICA' ? 'bg-red-500' :
                  ot.urgencia === 'ALTA' ? 'bg-orange-400' :
                  ot.urgencia === 'MEDIA' ? 'bg-[#2698D1]' : 'bg-gray-200'
                }`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-400 font-mono">{ot.id}</span>
                        <UrgenciaBadge urgencia={ot.urgencia} />
                        <EstadoBadge estado={estadoActual} />
                      </div>
                      <h1 className="text-xl font-black text-[#0D0D0D]">
                        {ot.equipoTipo}
                        {ot.equipoMarca && <span className="font-normal text-gray-400 ml-2">{ot.equipoMarca}</span>}
                        {ot.equipoModelo && <span className="font-normal text-gray-400"> {ot.equipoModelo}</span>}
                      </h1>
                      <p className="text-sm text-gray-400 mt-0.5">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
                    </div>
                  </div>

                  {/* Falla */}
                  <div className="rounded-xl bg-gray-50 p-4 mb-4">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Falla reportada</p>
                    <p className="text-sm text-gray-600">{ot.descripcionFalla}</p>
                  </div>

                  {/* Notas admin */}
                  {ot.notas && (
                    <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4 flex gap-3">
                      <FileText className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#2698D1] mb-1">Nota de SHUURI</p>
                        <p className="text-xs text-gray-600">{ot.notas}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnóstico / Cotización */}
              {(ot.cotizacion?.diagnosticoTecnico || cotLocal) && (
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2698D1]" />
                    Cotización
                  </h3>

                  {cotLocal ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400 mb-2">Diagnóstico</p>
                        <p className="text-sm text-gray-600">{cotLocal.diagnostico}</p>
                      </div>
                      <div className="flex justify-between items-center rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                        <span className="text-sm font-bold text-green-700">Total cotizado</span>
                        <span className="text-lg font-black text-green-700">USD {cotLocal.total}</span>
                      </div>
                      <p className="text-xs text-gray-400">Cotización emitida en esta sesión · pendiente de aprobación del cliente</p>
                    </div>
                  ) : ot.cotizacion?.diagnosticoTecnico ? (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400 mb-2">Diagnóstico</p>
                        <p className="text-sm text-gray-600">{ot.cotizacion.diagnosticoTecnico}</p>
                      </div>

                      {ot.cotizacion.itemsRepuestos && ot.cotizacion.itemsRepuestos.length > 0 && (
                        <div className="rounded-xl border p-4">
                          <p className="text-xs font-bold text-gray-400 mb-3">Ítems</p>
                          {ot.cotizacion.itemsRepuestos.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs py-1.5 border-b last:border-0">
                              <span className="text-gray-600">{item.descripcion}</span>
                              <span className="font-bold text-gray-700">USD {item.cantidad * item.precioUnitario}</span>
                            </div>
                          ))}
                          {ot.cotizacion.manoDeObra > 0 && (
                            <div className="flex justify-between text-xs py-1.5">
                              <span className="text-gray-600">Mano de obra</span>
                              <span className="font-bold text-gray-700">USD {ot.cotizacion.manoDeObra}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {ot.cotizacion.totalDefinitivo && (
                        <div className="flex justify-between items-center rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                          <span className="text-sm font-bold text-green-700">Total</span>
                          <span className="text-lg font-black text-green-700">{formatARS(ot.cotizacion.totalDefinitivo)}</span>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Órdenes de compra */}
              {ocs.length > 0 && (
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#2698D1]" />
                    Repuestos asignados
                  </h3>
                  {ocs.map(oc => (
                    <div key={oc.id} className="rounded-xl bg-gray-50 p-4 mb-3 last:mb-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400 font-mono">{oc.id}</span>
                        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                          oc.estado === 'ENTREGADA' ? 'bg-green-100 text-green-700' :
                          oc.estado === 'DESPACHADA' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{oc.estado}</span>
                      </div>
                      {oc.items.map((item, i) => (
                        <p key={i} className="text-xs text-gray-600">· {item.descripcion} (x{item.cantidad})</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── COLUMNA LATERAL ── */}
            <div className="space-y-5">

              {/* ACCIÓN PRINCIPAL */}
              {!esCerrada && (
                <div className="rounded-xl border-2 border-[#2698D1]/30 bg-blue-50 p-5">
                  <p className="text-xs font-bold text-[#2698D1] uppercase tracking-wide mb-3">Próxima acción</p>

                  {(estadoActual as string) === 'EN_VISITA' ? (
                    <button
                      onClick={() => setShowCotModal(true)}
                      className="w-full rounded-xl bg-[#2698D1] px-4 py-3 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Emitir cotización
                    </button>
                  ) : accionLabel ? (
                    <button
                      onClick={avanzarEstado}
                      className="w-full rounded-xl bg-[#0D0D0D] px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {(estadoActual as string) === 'TECNICO_ASIGNADO' && <Play className="h-4 w-4" />}
                      {(estadoActual as string) === 'EN_EJECUCION'     && <Flag className="h-4 w-4" />}
                      {(estadoActual as string) === 'PENDIENTE_CONFORMIDAD' && <CheckCircle2 className="h-4 w-4" />}
                      {accionLabel}
                    </button>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">Esperando acción del cliente o de SHUURI</p>
                  )}

                  <p className="text-xs text-gray-400 mt-2 text-center">Estado: {estadoActual.replace(/_/g, ' ')}</p>
                </div>
              )}

              {esCerrada && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <p className="font-bold text-green-700 text-sm">OT Cerrada</p>
                  <p className="text-xs text-green-600 mt-0.5">{estadoActual.replace(/_/g,' ')}</p>
                </div>
              )}

              {/* Datos del cliente */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cliente</p>
                {restaurante && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-300 shrink-0" />
                      <p className="text-sm font-bold text-[#0D0D0D]">{restaurante.nombre}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500">{restaurante.direccion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-300 shrink-0" />
                      <p className="text-xs text-gray-500">{restaurante.telefono}</p>
                    </div>
                    {restaurante.legajo?.horarioPreferido && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-300 shrink-0" />
                        <p className="text-xs text-gray-400">{restaurante.legajo?.horarioPreferido ?? '—'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Equipo */}
              {equipo && (
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Equipo</p>
                  <InfoRow label="Serie"     value={equipo.serie} mono />
                  <InfoRow label="Instalado" value={`${equipo.anioInstalacion}`} />
                  <InfoRow label="Último srv" value={equipo.fechaUltimoServicio ? formatDate(equipo.fechaUltimoServicio) : undefined} />
                </div>
              )}

              {/* Precio referencia */}
              {ot.cotizacion?.estimacionMin && ot.cotizacion.estimacionMin > 0 && (
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Estimación previa</p>
                  <p className="text-lg font-black text-[#0D0D0D]">
                    USD {ot.cotizacion.estimacionMin} – {ot.cotizacion.estimacionMax}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Rango informado al cliente antes de la visita</p>
                </div>
              )}

              {/* Fechas */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cronología</p>
                <InfoRow label="Creada"      value={formatDate(ot.fechaCreacion)} />
                <InfoRow label="Visita prog." value={ot.fechaVisitaProgramada ? formatDate(ot.fechaVisitaProgramada) : undefined} />
                <InfoRow label="Finalizada"  value={ot.fechaFinalizacion ? formatDate(ot.fechaFinalizacion) : undefined} />
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* MODAL COTIZACIÓN */}
      {showCotModal && (
        <ModalCotizacion
          ot={ot}
          onClose={() => setShowCotModal(false)}
          onConfirm={(items, mdo, diag) => {
            const total = items.reduce((s, i) => s + i.qty * i.precio, 0) + mdo;
            setCotLocal({ total, diagnostico: diag });
            setEstadoLocal('COTIZACION_EMITIDA');
            setShowCotModal(false);
            showToast(`Cotización emitida · USD ` + total);
          }}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
