"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import {
  getOTById, getTecnicoById, getRestauranteById, getEquipoById, getOCsByOT,
  REPUESTOS_MKT, PROVEEDORES_MKT, PRODUCTOS_MKT, getOrdenesCompraRepuestoPorOT,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, EstadoOT, OrdenCompraRepuesto } from '@/types/shuuri';
import {
  ArrowLeft, MapPin, Wrench, Package,
  CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Camera, FileText,
  Phone, Building2, Play, Flag,
  DollarSign, Plus, Trash2, X,
  ShoppingCart, Search, Truck, ChevronLeft, Loader2,
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

// ─── MODAL SOLICITAR REPUESTO ─────────────────────────────────────────────────

const TASA_USD_ARS = 1050;
const COMISION_OCR_PCT = 15;

type ItemSel = {
  uid: string;
  tipo: 'repuesto' | 'producto' | 'libre';
  refId?: string;
  nombre: string;
  marca: string;
  precioARS: number;
  cantidad: number;
  compatible: boolean;
  rubro: string;
  proveedorId?: string;
};

function SolicitarRepuestoModal({ ot, onClose, onConfirm }: {
  ot: OT;
  onClose: () => void;
  onConfirm: (result: { items: ItemSel[]; proveedorId: string; subtotalARS: number; totalARS: number }) => void;
}) {
  const [step,       setStep]       = useState<1 | 2 | 3>(1);
  const [buscar,     setBuscar]     = useState('');
  const [selected,   setSelected]   = useState<ItemSel[]>([]);
  const [modoLibre,  setModoLibre]  = useState(false);
  const [libre,      setLibre]      = useState({ desc: '', qty: 1, precioARS: 0 });
  const [proveedorId,setProveedorId]= useState('');
  const [sending,    setSending]    = useState(false);

  const q = buscar.toLowerCase();

  const repFiltrados = useMemo(() =>
    REPUESTOS_MKT.filter(r => !q || r.nombre.toLowerCase().includes(q) || r.marca.toLowerCase().includes(q)),
    [q]);

  const prodFiltrados = useMemo(() =>
    PRODUCTOS_MKT.filter(p => !q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)).slice(0, 4),
    [q]);

  function isCompat(compatMarcas: string[], compatModelos: string[], compatActivos?: string[]) {
    if (ot.activoId && compatActivos?.includes(ot.activoId)) return true;
    if (ot.equipoMarca && compatMarcas.includes(ot.equipoMarca)) return true;
    if (ot.equipoModelo && compatModelos.includes(ot.equipoModelo)) return true;
    return false;
  }

  function addItem(item: ItemSel) {
    setSelected(prev => {
      const ex = prev.find(s => s.uid === item.uid);
      if (ex) return prev.map(s => s.uid === item.uid ? { ...s, cantidad: s.cantidad + 1 } : s);
      return [...prev, item];
    });
  }
  function removeItem(uid: string) { setSelected(prev => prev.filter(s => s.uid !== uid)); }
  function updateQty(uid: string, qty: number) {
    if (qty < 1) return;
    setSelected(prev => prev.map(s => s.uid === uid ? { ...s, cantidad: qty } : s));
  }
  function addLibre() {
    if (!libre.desc.trim() || libre.precioARS <= 0) return;
    addItem({ uid: `libre_${Date.now()}`, tipo: 'libre', nombre: libre.desc, marca: '—', precioARS: libre.precioARS, cantidad: libre.qty, compatible: false, rubro: '' });
    setLibre({ desc: '', qty: 1, precioARS: 0 });
    setModoLibre(false);
  }

  const rubrosSeleccionados = [...new Set(selected.map(s => s.rubro).filter(Boolean))];
  const proveedoresFiltrados = useMemo(() =>
    rubrosSeleccionados.length === 0
      ? PROVEEDORES_MKT
      : PROVEEDORES_MKT.filter(p => p.rubros.some(r => rubrosSeleccionados.includes(r))),
    [rubrosSeleccionados.join(',')]);

  const subtotalARS = selected.reduce((s, i) => s + i.cantidad * i.precioARS, 0);
  const comisionARS = Math.round(subtotalARS * COMISION_OCR_PCT / 100);
  const totalARS    = subtotalARS + comisionARS;

  async function handleConfirm() {
    setSending(true);
    await new Promise<void>(r => setTimeout(r, 1500));
    setSending(false);
    onConfirm({ items: selected, proveedorId, subtotalARS, totalARS });
  }

  const STEP_LABELS = ['Identificar repuestos', 'Seleccionar proveedor', 'Confirmar'];

  function ItemRow({ uid, nombre, marca, precio, stock, compat, onAdd }: { uid: string; nombre: string; marca: string; precio: number; stock: number; compat: boolean; onAdd: () => void }) {
    const inList = selected.find(s => s.uid === uid);
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-[#0D0D0D] truncate">{nombre}</p>
            {compat && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">Compatible</span>}
          </div>
          <p className="text-xs text-gray-400">{marca} · USD {precio}</p>
          <span className={`inline-block mt-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
          </span>
        </div>
        {inList ? (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => updateQty(uid, inList.cantidad - 1)} className="h-7 w-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm">−</button>
            <span className="text-sm font-bold w-6 text-center">{inList.cantidad}</span>
            <button onClick={() => updateQty(uid, inList.cantidad + 1)} className="h-7 w-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
            <button onClick={() => removeItem(uid)} className="ml-1 h-7 w-7 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center"><X className="h-3 w-3" /></button>
          </div>
        ) : (
          <button onClick={onAdd} className="shrink-0 flex items-center gap-1 rounded-lg bg-[#2698D1] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2698D1]/90">
            <Plus className="h-3.5 w-3.5" /> Agregar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="font-black text-[#0D0D0D]">Solicitar repuesto</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ot.id} · {ot.equipoTipo} {ot.equipoMarca ?? ''}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
        </div>

        {/* Steps */}
        <div className="flex border-b bg-gray-50">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 transition-colors ${step === i + 1 ? 'border-[#2698D1] text-[#2698D1]' : step > i + 1 ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'}`}>
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-black ${step > i + 1 ? 'bg-green-100 text-green-600' : step === i + 1 ? 'bg-blue-100 text-[#2698D1]' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {step === 1 && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar repuesto o producto…"
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1]" />
              </div>

              {repFiltrados.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Repuestos</p>
                  <div className="space-y-2">
                    {repFiltrados.map(r => (
                      <ItemRow key={r.id} uid={r.id} nombre={r.nombre} marca={r.marca} precio={r.precio} stock={r.stock}
                        compat={isCompat(r.compatibleMarcas, r.compatibleModelos, r.compatibleActivosIds)}
                        onAdd={() => addItem({ uid: r.id, tipo: 'repuesto', refId: r.id, nombre: r.nombre, marca: r.marca, precioARS: Math.round(r.precio * TASA_USD_ARS), cantidad: 1, compatible: isCompat(r.compatibleMarcas, r.compatibleModelos, r.compatibleActivosIds), rubro: r.rubro, proveedorId: r.proveedorId })} />
                    ))}
                  </div>
                </div>
              )}

              {prodFiltrados.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Productos del catálogo</p>
                  <div className="space-y-2">
                    {prodFiltrados.map(p => {
                      const uid = `prod_${p.id}`;
                      const compat = !!(ot.activoId && p.compatibleConActivos?.includes(ot.activoId));
                      return (
                        <ItemRow key={p.id} uid={uid} nombre={p.nombre} marca={p.marca} precio={p.precio} stock={p.stock}
                          compat={compat}
                          onAdd={() => addItem({ uid, tipo: 'producto', refId: p.id, nombre: p.nombre, marca: p.marca, precioARS: Math.round(p.precio * TASA_USD_ARS), cantidad: 1, compatible: compat, rubro: p.rubro ?? '', proveedorId: p.proveedorId })} />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-dashed border-gray-300 p-4">
                {modoLibre ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase">Ítem libre (sin catálogo)</p>
                    <input value={libre.desc} onChange={e => setLibre(l => ({ ...l, desc: e.target.value }))} placeholder="Descripción del repuesto / material"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1]" />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                        <input type="number" min={1} value={libre.qty} onChange={e => setLibre(l => ({ ...l, qty: Number(e.target.value) }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1]" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Precio est. ARS (referencial)</label>
                        <input type="number" min={0} value={libre.precioARS || ''} onChange={e => setLibre(l => ({ ...l, precioARS: Number(e.target.value) }))} placeholder="0"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1]" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addLibre} className="flex-1 rounded-lg bg-[#2698D1] py-2 text-xs font-bold text-white hover:bg-[#2698D1]/90">Agregar ítem</button>
                      <button onClick={() => setModoLibre(false)} className="px-4 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setModoLibre(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#2698D1] w-full justify-center py-1">
                    <Plus className="h-4 w-4" /> Agregar ítem libre (sin catálogo)
                  </button>
                )}
              </div>

              {selected.length > 0 && (
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs font-bold text-[#2698D1] mb-2">{selected.length} ítem{selected.length > 1 ? 's' : ''} seleccionado{selected.length > 1 ? 's' : ''}</p>
                  {selected.map(s => (
                    <div key={s.uid} className="flex justify-between text-xs py-1 border-b border-blue-100 last:border-0">
                      <span className="text-gray-600 truncate max-w-[60%]">{s.nombre} ×{s.cantidad}</span>
                      <span className="font-bold text-gray-700">{formatARS(s.cantidad * s.precioARS)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-gray-500">Seleccioná un proveedor para esta orden.</p>
              {proveedoresFiltrados.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin proveedores disponibles</p>
              ) : (
                <div className="space-y-3">
                  {proveedoresFiltrados.map(p => {
                    const sel = proveedorId === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => setProveedorId(p.id)}
                        className={`w-full text-left rounded-xl border-2 p-4 transition-all ${sel ? 'border-[#2698D1] bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#0D0D0D] text-sm">{p.nombre}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {p.tiposSeller?.[0] ?? 'Distribuidor'}
                              {p.tiempoEntregaHs ? ` · Entrega: ${p.tiempoEntregaHs}hs` : ''}
                            </p>
                            <p className="text-xs text-gray-400">Cubre: {p.rubros.slice(0, 2).map(r => RUBRO_LABELS[r as Rubro]).join(', ')}{p.rubros.length > 2 ? ` +${p.rubros.length - 2}` : ''}</p>
                          </div>
                          {sel ? <CheckCircle2 className="h-5 w-5 text-[#2698D1] shrink-0" /> : p.esShuuriPro ? <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PRO</span> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 leading-snug">
                  <strong>Esta orden fue pre-aprobada</strong> porque la OT ya tiene autorización del restaurante.
                  Se generará automáticamente al confirmar.
                </p>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <div className="border-b bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ítems</p>
                </div>
                {selected.map(s => (
                  <div key={s.uid} className="flex justify-between items-center px-4 py-3 border-b last:border-0 text-sm">
                    <div>
                      <p className="font-medium text-[#0D0D0D]">{s.nombre}</p>
                      <p className="text-xs text-gray-400">{s.marca} · ×{s.cantidad}</p>
                    </div>
                    <p className="font-bold text-[#0D0D0D]">{formatARS(s.cantidad * s.precioARS)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>{formatARS(subtotalARS)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Comisión SHUURI ({COMISION_OCR_PCT}%)</span><span>{formatARS(comisionARS)}</span>
                </div>
                <div className="flex justify-between font-black text-[#0D0D0D] border-t pt-2 mt-2">
                  <span>Total ARS</span><span className="text-lg">{formatARS(totalARS)}</span>
                </div>
              </div>

              {proveedorId && (
                <div className="flex items-center gap-2 text-sm text-gray-600 rounded-lg bg-gray-50 px-4 py-3">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span>Proveedor: <strong>{PROVEEDORES_MKT.find(p => p.id === proveedorId)?.nombre ?? proveedorId}</strong></span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 border-t px-6 py-4">
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
          )}
          <button onClick={onClose} className={`${step === 1 ? 'flex-1' : ''} rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 px-4`}>
            Cancelar
          </button>
          {step < 3 ? (
            <button
              onClick={() => { if (step === 1 && selected.length === 0) return; if (step === 2 && !proveedorId) return; setStep(s => (s + 1) as 1 | 2 | 3); }}
              disabled={(step === 1 && selected.length === 0) || (step === 2 && !proveedorId)}
              className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleConfirm} disabled={sending}
              className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-40 flex items-center justify-center gap-2">
              {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : <>Confirmar pedido <ShoppingCart className="h-4 w-4" /></>}
            </button>
          )}
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

  const [estadoLocal,      setEstadoLocal]      = useState<string | null>(null);
  const [showCotModal,     setShowCotModal]     = useState(false);
  const [showRepModal,     setShowRepModal]     = useState(false);
  const [toast,            setToast]            = useState<string | null>(null);
  const [cotLocal,         setCotLocal]         = useState<{ total: number; diagnostico: string } | null>(null);
  const [ocrCreada,        setOcrCreada]        = useState<OrdenCompraRepuesto | null>(null);

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

  const restaurante  = getRestauranteById(ot.restauranteId);
  const equipo       = ot.equipoId ? getEquipoById(ot.equipoId) : null;
  const ocs          = getOCsByOT(ot.id);
  const estadoActual = (estadoLocal ?? ot.estado) as EstadoOT;
  const ocrsDeOT     = [...getOrdenesCompraRepuestoPorOT(ot.id), ...(ocrCreada ? [ocrCreada] : [])];
  const ocrActiva    = ocrsDeOT[ocrsDeOT.length - 1] ?? null;

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
    <div className="flex min-h-screen bg-[#F7F8FA]">
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

              {/* Órdenes de compra (legacy) */}
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

              {/* Repuestos necesarios — visible en EN_DIAGNOSTICO */}
              {(estadoActual as string) === 'EN_DIAGNOSTICO' && (
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-[#2698D1]" />
                    Repuestos necesarios
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Identificaste que se necesitan repuestos. Podés solicitarlos directamente desde el marketplace de SHUURI.
                  </p>
                  <button
                    onClick={() => setShowRepModal(true)}
                    className="w-full rounded-xl border-2 border-[#2698D1] text-[#2698D1] py-3 text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Solicitar repuesto
                  </button>
                </div>
              )}

              {/* Pedido en curso — visible en REPUESTO_SOLICITADO */}
              {(estadoActual as string) === 'REPUESTO_SOLICITADO' && ocrActiva && (
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#2698D1]" />
                    Pedido en curso
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">N° seguimiento</span>
                      <span className="font-mono text-sm font-bold text-[#0D0D0D]">{ocrActiva.numeroSeguimiento ?? '—'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">Transportista</p>
                        <p className="text-sm font-bold text-[#0D0D0D]">{ocrActiva.transportista ?? '—'}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-0.5">Entrega estimada</p>
                        <p className="text-sm font-bold text-[#0D0D0D]">
                          {ocrActiva.fechaEstimadaEntrega ? formatDate(ocrActiva.fechaEstimadaEntrega) : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border">
                      <span className="text-xs text-gray-400">Estado</span>
                      <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                        ocrActiva.estado === 'entregada_local' ? 'bg-green-100 text-green-700' :
                        ocrActiva.estado === 'despachada' ? 'bg-purple-100 text-purple-700' :
                        ocrActiva.estado === 'confirmada_proveedor' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {ocrActiva.estado === 'confirmada_proveedor' ? 'Confirmado por proveedor' :
                         ocrActiva.estado === 'despachada' ? 'En camino' :
                         ocrActiva.estado === 'entregada_local' ? 'Entregado' :
                         ocrActiva.estado}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">OCR {ocrActiva.id} · Total: {formatARS(ocrActiva.totalARS)}</p>
                  </div>
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

      {/* MODAL SOLICITAR REPUESTO */}
      {showRepModal && (
        <SolicitarRepuestoModal
          ot={ot}
          onClose={() => setShowRepModal(false)}
          onConfirm={({ items, proveedorId, subtotalARS, totalARS }) => {
            const now = new Date().toISOString();
            const nuevaOcr: OrdenCompraRepuesto = {
              id: `ocr-${Date.now()}`,
              otId: ot.id,
              activoId: ot.activoId ?? '',
              restauranteId: ot.restauranteId,
              tecnicoId: tecnico.id,
              proveedorId,
              items: items.map(i => ({
                repuestoId: i.tipo === 'repuesto' ? i.refId : undefined,
                productoId: i.tipo === 'producto' ? i.refId : undefined,
                descripcionLibre: i.tipo === 'libre' ? i.nombre : undefined,
                cantidad: i.cantidad,
                precioUnitarioARS: i.precioARS,
                comisionShuuriPct: COMISION_OCR_PCT,
                comisionShuuriARS: Math.round(i.cantidad * i.precioARS * COMISION_OCR_PCT / 100),
                totalARS: Math.round(i.cantidad * i.precioARS * (1 + COMISION_OCR_PCT / 100)),
              })),
              subtotalARS,
              totalComisionARS: Math.round(subtotalARS * COMISION_OCR_PCT / 100),
              totalARS,
              aprobadoAutomaticamente: true,
              aprobadaEn: now,
              estado: 'confirmada_proveedor',
              creadaPor: 'tecnico',
              creadaEn: now,
              actualizadoEn: now,
            };
            setOcrCreada(nuevaOcr);
            setEstadoLocal('REPUESTO_SOLICITADO');
            setShowRepModal(false);
            showToast('Pedido enviado al proveedor');
          }}
        />
      )}

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
