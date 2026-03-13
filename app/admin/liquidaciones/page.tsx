"use client";
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import { LIQUIDACIONES, OTS, getTecnicoById, getRestauranteById, getOCsByOT } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  DollarSign, Clock, CheckCircle2, ChevronDown, ChevronRight,
  Plus, X, Wrench, Building2, User, AlertCircle, Zap,
  TrendingUp, Package, ArrowUpRight, FileText, CreditCard,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LiqFilter = 'todas' | 'DEVENGADA' | 'PENDIENTE_PAGO' | 'PAGADA';

type Liq = typeof LIQUIDACIONES[number];

interface LiqLocal extends Liq {
  _estadoOverride?: 'DEVENGADA' | 'PENDIENTE_PAGO' | 'PAGADA';
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const ESTADO_LIQ: Record<string, { badge: string; label: string; dot: string }> = {
  DEVENGADA:      { badge: 'bg-blue-100 text-blue-700',   label: 'Devengada',    dot: 'bg-blue-400' },
  PENDIENTE_PAGO: { badge: 'bg-amber-100 text-amber-700', label: 'Pend. pago',   dot: 'bg-amber-400' },
  PAGADA:         { badge: 'bg-green-100 text-green-700', label: 'Pagada',       dot: 'bg-green-400' },
};

// ─── MODAL CREAR LIQUIDACIÓN ──────────────────────────────────────────────────

function ModalCrearLiq({
  ot,
  onClose,
  onConfirm,
}: {
  ot: typeof OTS[number];
  onClose: () => void;
  onConfirm: (liq: Liq) => void;
}) {
  const tecnico     = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
  const restaurante = getRestauranteById(ot.restauranteId);
  const ocs         = getOCsByOT(ot.id);

  // Calcular comisiones desde cotización
  const mdo           = ot.cotizacion?.manoDeObra ?? 0;
  const totalRepuestos = ot.cotizacion?.itemsRepuestos?.reduce(
    (s, i) => s + i.cantidad * i.precioUnitario, 0
  ) ?? 0;
  const totalFacturado = ot.cotizacion?.totalDefinitivo ?? (mdo + totalRepuestos);

  // Tier cliente (simplificado: siempre FREEMIUM para el prototipo)
  const [pctServicio,  setPctServicio]  = useState(30);
  const [pctRepuestos, setPctRepuestos] = useState(15);

  const comisionServicio  = Math.round(mdo * pctServicio / 100 * 100) / 100;
  const comisionRepuestos = Math.round(totalRepuestos * pctRepuestos / 100 * 100) / 100;
  const comisionTotal     = comisionServicio + comisionRepuestos;
  const pagoTecnico       = mdo - comisionServicio;
  const pagoProveedor     = totalRepuestos > 0 ? totalRepuestos - comisionRepuestos : undefined;

  const [step, setStep] = useState<'resumen' | 'confirmar' | 'exito'>('resumen');

  function handleConfirm() {
    const nuevaLiq: Liq = {
      id: `LQ-${String(Date.now()).slice(-4)}`,
      otId: ot.id,
      tecnicoId: ot.tecnicoId ?? '',
      proveedorId: ocs[0]?.proveedorId,
      montoTotalFacturado: totalFacturado,
      comisionServicioPct: pctServicio / 100,
      comisionServicio,
      comisionRepuestosPct: pctRepuestos / 100,
      comisionRepuestos,
      comisionTotal,
      pagoTecnico,
      pagoProveedor,
      estado: 'DEVENGADA',
      fechaDevengado: new Date().toISOString(),
    };
    onConfirm(nuevaLiq);
    setStep('exito');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h3 className="font-black text-[#0D0D0D]">Crear liquidación</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ot.id} · {ot.equipoTipo} {ot.equipoMarca}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {step === 'exito' ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h4 className="text-xl font-black text-[#0D0D0D] mb-2">Liquidación creada</h4>
            <p className="text-sm text-gray-400 mb-1">Comisión SHUURI: <span className="font-bold text-[#2698D1]">USD {comisionTotal.toFixed(2)}</span></p>
            <p className="text-sm text-gray-400 mb-6">Pago al técnico: <span className="font-bold text-green-600">USD {pagoTecnico.toFixed(2)}</span></p>
            <button onClick={onClose}
              className="rounded-xl bg-[#0D0D0D] px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
              Cerrar
            </button>
          </div>
        ) : step === 'confirmar' ? (
          <div className="px-6 py-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-700">Confirmar liquidación</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Esto generará los pagos a técnico{pagoProveedor ? ' y proveedor' : ''} y registrará las comisiones de SHUURI.
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {[
                { label: 'OT',           val: ot.id,                           mono: true },
                { label: 'Total facturado', val: `USD ${totalFacturado.toFixed(2)}` },
                { label: 'Comisión SHUURI', val: `USD ${comisionTotal.toFixed(2)}` },
                { label: 'Pago técnico', val: `USD ${pagoTecnico.toFixed(2)}` },
                ...(pagoProveedor ? [{ label: 'Pago proveedor', val: `USD ${pagoProveedor.toFixed(2)}` }] : []),
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400">{row.label}</span>
                  <span className={`text-sm font-bold text-[#0D0D0D] ${(row as any).mono ? 'font-mono' : ''}`}>{row.val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('resumen')}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Volver
              </button>
              <button onClick={handleConfirm}
                className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors">
                Confirmar y crear
              </button>
            </div>
          </div>
        ) : (
          /* step === 'resumen' */
          <div className="px-6 py-5">
            {/* Info OT */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400">Técnico</p>
                </div>
                <p className="text-sm font-bold text-[#0D0D0D]">{tecnico?.nombre ?? ot.tecnicoId}</p>
                <p className="text-xs text-gray-400">{tecnico?.zona ?? '—'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400">Cliente</p>
                </div>
                <p className="text-sm font-bold text-[#0D0D0D]">{restaurante?.nombre ?? ot.restauranteId}</p>
                <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
              </div>
            </div>

            {/* Comisiones editables */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tasas de comisión</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-gray-400 mb-2">Servicio / MdO</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={10} max={40} step={5}
                      value={pctServicio}
                      onChange={e => setPctServicio(Number(e.target.value))}
                      className="flex-1 accent-[#2698D1]"
                    />
                    <span className="text-sm font-black text-[#2698D1] w-10 text-right">{pctServicio}%</span>
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-gray-400 mb-2">Repuestos</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={5} max={25} step={5}
                      value={pctRepuestos}
                      onChange={e => setPctRepuestos(Number(e.target.value))}
                      className="flex-1 accent-[#2698D1]"
                    />
                    <span className="text-sm font-black text-[#2698D1] w-10 text-right">{pctRepuestos}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen financiero */}
            <div className="rounded-xl border overflow-hidden mb-5">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Distribución del mandato</p>
              </div>
              <div className="divide-y">
                {[
                  { label: 'Mano de obra', val: mdo, color: 'text-gray-700' },
                  { label: 'Repuestos / materiales', val: totalRepuestos, color: 'text-gray-700' },
                ].filter(r => r.val > 0).map(row => (
                  <div key={row.label} className="flex justify-between px-4 py-2.5">
                    <span className="text-xs text-gray-500">{row.label}</span>
                    <span className={`text-xs font-bold ${row.color}`}>USD {row.val.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5 bg-blue-50">
                  <span className="text-xs font-bold text-[#2698D1]">⇒ Comisión SHUURI</span>
                  <span className="text-xs font-black text-[#2698D1]">USD {comisionTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 bg-green-50">
                  <span className="text-xs font-bold text-green-700">⇒ Pago técnico</span>
                  <span className="text-xs font-black text-green-700">USD {pagoTecnico.toFixed(2)}</span>
                </div>
                {pagoProveedor !== undefined && (
                  <div className="flex justify-between px-4 py-2.5 bg-purple-50">
                    <span className="text-xs font-bold text-purple-700">⇒ Pago proveedor</span>
                    <span className="text-xs font-black text-purple-700">USD {pagoProveedor.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-3 border-t bg-gray-50">
                  <span className="text-sm font-bold text-gray-700">Total facturado</span>
                  <span className="text-sm font-black text-[#0D0D0D]">USD {totalFacturado.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('confirmar')}
              disabled={totalFacturado === 0}
              className="w-full rounded-xl bg-[#0D0D0D] py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Revisar y confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FILA LIQUIDACIÓN ─────────────────────────────────────────────────────────

function LiqRow({
  liq,
  onMarcarPagada,
}: {
  liq: LiqLocal;
  onMarcarPagada: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const tecnico    = liq.tecnicoId ? getTecnicoById(liq.tecnicoId) : null;
  const estadoReal = liq._estadoOverride ?? liq.estado;
  const s          = ESTADO_LIQ[estadoReal] ?? ESTADO_LIQ['DEVENGADA'];

  const pctComision = liq.montoTotalFacturado > 0
    ? ((liq.comisionTotal / liq.montoTotalFacturado) * 100).toFixed(1)
    : '0.0';

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4">
          <button
            onClick={() => setExpandido(!expandido)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#2698D1] transition-colors"
          >
            {expandido
              ? <ChevronDown className="h-3.5 w-3.5" />
              : <ChevronRight className="h-3.5 w-3.5" />}
            {liq.id}
          </button>
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2698D1]/10 text-[#2698D1] text-xs font-black shrink-0">
              {tecnico
                ? tecnico.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2)
                : '??'}
            </div>
            <div>
              <p className="text-sm font-medium text-[#0D0D0D]">{tecnico?.nombre ?? liq.tecnicoId}</p>
              <p className="text-xs text-gray-400">{tecnico?.zona ?? '—'}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-4 text-sm text-gray-500 font-mono">{liq.otId}</td>
        <td className="px-4 py-4 text-sm font-medium text-gray-700">{formatARS(liq.montoTotalFacturado)}</td>
        <td className="px-4 py-4">
          <span className="text-sm font-bold text-[#2698D1]">{formatARS(liq.comisionTotal)}</span>
          <span className="ml-1 text-xs text-gray-400">({pctComision}%)</span>
        </td>
        <td className="px-4 py-4 text-sm font-black text-[#0D0D0D]">{formatARS(liq.pagoTecnico)}</td>
        <td className="px-4 py-4 text-xs text-gray-400">
          {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.badge}`}>{s.label}</span>
          </div>
        </td>

        <td className="px-4 py-4">
          {estadoReal !== 'PAGADA' && (
            <button
              onClick={() => onMarcarPagada(liq.id)}
              className="rounded-lg bg-[#0D0D0D] px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <CreditCard className="h-3 w-3" />
              Marcar pagada
            </button>
          )}
          {estadoReal === 'PAGADA' && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Pagada
            </span>
          )}
        </td>
      </tr>

      {/* DESGLOSE EXPANDIBLE */}
      {expandido && (
        <tr>
          <td colSpan={9} className="px-0 py-0 bg-gray-50/50">
            <div className="mx-4 mb-3 mt-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Desglose mandato — {liq.id}</p>
              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs text-gray-400 mb-1">Facturado al cliente</p>
                  <p className="text-xl font-black text-[#0D0D0D]">{formatARS(liq.montoTotalFacturado)}</p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Comis. servicio ({(liq.comisionServicioPct * 100).toFixed(0)}%)</span>
                      <span className="font-bold">{formatARS(liq.comisionServicio)}</span>
                    </div>
                    {liq.comisionRepuestos > 0 && (
                      <div className="flex justify-between text-gray-500">
                        <span>Comis. repuestos ({(liq.comisionRepuestosPct * 100).toFixed(0)}%)</span>
                        <span className="font-bold">{formatARS(liq.comisionRepuestos)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4">
                  <p className="text-xs text-[#2698D1] mb-1">Comisión SHUURI</p>
                  <p className="text-xl font-black text-[#2698D1]">{formatARS(liq.comisionTotal)}</p>
                  <div className="mt-3 text-xs text-blue-500">
                    <span className="font-bold">{pctComision}%</span> del total facturado
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-blue-200">
                    <div
                      className="h-1.5 rounded-full bg-[#2698D1]"
                      style={{ width: `${Math.min(parseFloat(pctComision), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs text-green-600 mb-1">Pago al técnico</p>
                  <p className="text-xl font-black text-green-700">{formatARS(liq.pagoTecnico)}</p>
                  {liq.pagoProveedor !== undefined && liq.pagoProveedor > 0 && (
                    <div className="mt-2 rounded-lg bg-purple-50 border border-purple-100 px-2.5 py-1.5">
                      <p className="text-xs text-purple-600">
                        + Proveedor: <span className="font-bold">{formatARS(liq.pagoProveedor)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-xs text-gray-400">
                <span>OT: <span className="font-bold text-gray-600 font-mono">{liq.otId}</span></span>
                <span>Devengado: <span className="font-medium text-gray-600">
                  {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
                </span></span>
                {liq.fechaPago && (
                  <span>Pagado: <span className="font-medium text-green-600">{formatDate(liq.fechaPago)}</span></span>
                )}
                <span>Estado: <span className={`font-bold ${estadoReal === 'PAGADA' ? 'text-green-600' : 'text-amber-600'}`}>{s.label}</span></span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AdminLiquidaciones() {
  const [filtro,    setFiltro]    = useState<LiqFilter>('todas');
  const [modalOT,   setModalOT]   = useState<typeof OTS[number] | null>(null);
  const [toast,     setToast]     = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, 'PAGADA'>>({});
  const [localLiqs, setLocalLiqs] = useState<Liq[]>([]);

  // OTs FACTURADAS sin liquidación
  const liquidadasOtIds = new Set([
    ...LIQUIDACIONES.map(l => l.otId),
    ...localLiqs.map(l => l.otId),
  ]);
  const otsPendientes = OTS.filter(
    ot => ot.estado === 'FACTURADA' && !liquidadasOtIds.has(ot.id)
  );

  // Unir liquidaciones base + locales
  const todasLiqs: LiqLocal[] = useMemo(() => [
    ...LIQUIDACIONES.map(l => ({
      ...l,
      _estadoOverride: overrides[l.id],
    })),
    ...localLiqs.map(l => ({
      ...l,
      _estadoOverride: overrides[l.id],
    })),
  ], [overrides, localLiqs]);

  const filtradas = filtro === 'todas'
    ? todasLiqs
    : todasLiqs.filter(l => (l._estadoOverride ?? l.estado) === filtro);

  // KPIs reactivos
  const totalFacturado  = todasLiqs.reduce((a, l) => a + l.montoTotalFacturado, 0);
  const totalComisiones = todasLiqs.reduce((a, l) => a + l.comisionTotal, 0);
  const totalPendiente  = todasLiqs
    .filter(l => (l._estadoOverride ?? l.estado) !== 'PAGADA')
    .reduce((a, l) => a + l.pagoTecnico + (l.pagoProveedor ?? 0), 0);

  const conteo = {
    todas:          todasLiqs.length,
    DEVENGADA:      todasLiqs.filter(l => (l._estadoOverride ?? l.estado) === 'DEVENGADA').length,
    PENDIENTE_PAGO: todasLiqs.filter(l => (l._estadoOverride ?? l.estado) === 'PENDIENTE_PAGO').length,
    PAGADA:         todasLiqs.filter(l => (l._estadoOverride ?? l.estado) === 'PAGADA').length,
  };

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleMarcarPagada(id: string) {
    setOverrides(prev => ({ ...prev, [id]: 'PAGADA' }));
    showToast('Liquidación marcada como pagada');
  }

  function handleCrearLiq(liq: Liq) {
    setLocalLiqs(prev => [liq, ...prev]);
    setModalOT(null);
    showToast(`Liquidación ${liq.id} creada · Comisión USD ${liq.comisionTotal.toFixed(0)}`);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Liquidaciones</h1>
              <p className="text-gray-500 text-sm">Desglose mandato · comisiones y pagos a técnicos y proveedores</p>
            </div>
            {otsPendientes.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-sm font-bold text-amber-700">
                  {otsPendientes.length} OT{otsPendientes.length > 1 ? 's' : ''} lista{otsPendientes.length > 1 ? 's' : ''} para liquidar
                </span>
              </div>
            )}
          </div>

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <DollarSign className="h-4 w-4 text-gray-600" />
              </div>
              <p className="text-2xl font-black text-[#0D0D0D]">{formatARS(totalFacturado)}</p>
              <p className="text-sm text-gray-500">Facturado total</p>
            </div>
            <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#2698D1]/10">
                <TrendingUp className="h-4 w-4 text-[#2698D1]" />
              </div>
              <p className="text-2xl font-black text-[#2698D1]">{formatARS(totalComisiones)}</p>
              <p className="text-sm text-[#2698D1]">Comisiones SHUURI</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-700">{formatARS(totalPendiente)}</p>
              <p className="text-sm text-amber-600">Pendiente de pago</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-black text-green-700">{conteo.PAGADA}</p>
              <p className="text-sm text-green-600">Liquidaciones pagadas</p>
            </div>
          </div>

          {/* OTs PENDIENTES DE LIQUIDAR */}
          {otsPendientes.length > 0 && (
            <div className="mb-6 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <h2 className="font-bold text-amber-800 text-sm">OTs listas para liquidar</h2>
                </div>
                <span className="text-xs text-amber-600">Estado: FACTURADA · sin liquidación generada</span>
              </div>
              <div className="divide-y divide-amber-100">
                {otsPendientes.map(ot => {
                  const tecnico     = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
                  const restaurante = getRestauranteById(ot.restauranteId);
                  const total       = ot.cotizacion?.totalDefinitivo ?? 0;
                  return (
                    <div key={ot.id} className="flex items-center gap-4 px-6 py-4 hover:bg-amber-50 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                        <Wrench className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-amber-700 font-mono">{ot.id}</span>
                          <span className="text-xs text-gray-500">{RUBRO_LABELS[ot.rubro as Rubro]}</span>
                        </div>
                        <p className="text-sm font-bold text-[#0D0D0D]">
                          {ot.equipoTipo} {ot.equipoMarca}
                        </p>
                        <p className="text-xs text-gray-400">
                          {restaurante?.nombre ?? ot.restauranteId}
                          {tecnico ? ` · ${tecnico.nombre}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0 mr-4">
                        <p className="text-sm font-black text-[#0D0D0D]">USD {total.toFixed(0)}</p>
                        <p className="text-xs text-gray-400">Total facturado</p>
                      </div>
                      <button
                        onClick={() => setModalOT(ot)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#0D0D0D] px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Crear liquidación
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FILTROS */}
          <div className="mb-4 flex items-center gap-2">
            {([
              { key: 'todas',          label: `Todas (${conteo.todas})` },
              { key: 'DEVENGADA',      label: `Devengadas (${conteo.DEVENGADA})` },
              { key: 'PENDIENTE_PAGO', label: `Pend. pago (${conteo.PENDIENTE_PAGO})` },
              { key: 'PAGADA',         label: `Pagadas (${conteo.PAGADA})` },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  filtro === tab.key
                    ? 'bg-[#0D0D0D] text-white'
                    : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TABLA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  {['Liq.', 'Técnico', 'OT', 'Facturado', 'Comisión', 'Pago neto', 'Fecha', 'Estado', 'Acción'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <DollarSign className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-sm text-gray-400 font-bold">Sin liquidaciones en esta categoría</p>
                    </td>
                  </tr>
                ) : (
                  filtradas.map(liq => (
                    <LiqRow
                      key={liq.id}
                      liq={liq}
                      onMarcarPagada={handleMarcarPagada}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* MODAL */}
      {modalOT && (
        <ModalCrearLiq
          ot={modalOT}
          onClose={() => setModalOT(null)}
          onConfirm={handleCrearLiq}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
