"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatDate } from '@/components/shared/utils';
import {
  OTS, TECNICOS,
  getTecnicoById, getRestauranteById, getTecnicosDisponiblesParaRubro,
} from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, EstadoOT } from '@/types/shuuri';
import { Search, UserCheck, Zap, ChevronDown, X, AlertTriangle, CheckCircle } from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type OT = typeof OTS[number];

// Overrides locales: tecnicoId y/o estado modificados en sesión
type OTOverride  = { tecnicoId?: string; estado?: EstadoOT };
type OTOverrides = Record<string, OTOverride>;

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const TODOS_ESTADOS = [
  'NUEVA', 'EN_DIAGNOSTICO', 'APROBADA_PENDIENTE_ASIGNACION', 'TECNICO_ASIGNADO',
  'EN_VISITA', 'COTIZACION_EMITIDA', 'AUTORIZADA', 'REPUESTO_SOLICITADO',
  'EN_EJECUCION', 'PENDIENTE_CONFORMIDAD', 'CERRADA_CONFORME',
  'CERRADA_SIN_CONFORMIDAD', 'FACTURADA', 'LIQUIDADA', 'CANCELADA',
];

const TODOS_URGENCIA = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

// Estados a los que el admin puede avanzar manualmente
const TRANSICIONES: Record<string, string[]> = {
  NUEVA:                          ['EN_DIAGNOSTICO', 'CANCELADA'],
  EN_DIAGNOSTICO:                 ['APROBADA_PENDIENTE_ASIGNACION', 'CANCELADA'],
  APROBADA_PENDIENTE_ASIGNACION:  ['TECNICO_ASIGNADO', 'CANCELADA'],
  TECNICO_ASIGNADO:               ['EN_VISITA', 'CANCELADA'],
  EN_VISITA:                      ['COTIZACION_EMITIDA'],
  COTIZACION_EMITIDA:             ['AUTORIZADA', 'CANCELADA'],
  AUTORIZADA:                     ['REPUESTO_SOLICITADO', 'EN_EJECUCION'],
  REPUESTO_SOLICITADO:            ['EN_EJECUCION'],
  EN_EJECUCION:                   ['PENDIENTE_CONFORMIDAD'],
  PENDIENTE_CONFORMIDAD:          ['CERRADA_CONFORME', 'CERRADA_SIN_CONFORMIDAD'],
  CERRADA_CONFORME:               ['FACTURADA'],
  CERRADA_SIN_CONFORMIDAD:        ['FACTURADA'],
  FACTURADA:                      ['LIQUIDADA'],
};

// ─── MODAL DE ASIGNACIÓN ──────────────────────────────────────────────────────

function ModalAsignacion({
  ot,
  tecnicoActualId,
  onConfirm,
  onClose,
}: {
  ot: OT;
  tecnicoActualId: string | undefined;
  onConfirm: (tecnicoId: string) => void;
  onClose: () => void;
}) {
  const disponibles = getTecnicosDisponiblesParaRubro(ot.rubro as Rubro);
  const bloqueados  = TECNICOS.filter(t =>
    t.rubros.includes(ot.rubro as Rubro) && !disponibles.find(d => d.id === t.id)
  );
  const [seleccionado, setSeleccionado] = useState<string | null>(tecnicoActualId ?? null);
  const [confirmado, setConfirmado]     = useState(false);

  function handleConfirmar() {
    if (!seleccionado) return;
    setConfirmado(true);
    setTimeout(() => {
      onConfirm(seleccionado);
      onClose();
    }, 800);
  }

  const tecnicoSel = seleccionado ? getTecnicoById(seleccionado) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <p className="text-xs font-bold text-gray-400">{ot.id}</p>
            <h3 className="font-black text-[#0D0D0D]">Asignar técnico</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {ot.equipoTipo} {ot.equipoMarca} · {RUBRO_LABELS[ot.rubro as Rubro]}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Confirmación animada */}
        {confirmado ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-black text-[#0D0D0D]">Técnico asignado</p>
            <p className="text-sm text-gray-500">{tecnicoSel?.nombre} → OT {ot.id}</p>
            <p className="text-xs text-gray-400">Estado actualizado a TÉCNICO ASIGNADO</p>
          </div>
        ) : (
          <>
            {/* Lista técnicos */}
            <div className="px-6 py-4 max-h-80 overflow-y-auto">
              {disponibles.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-400" />
                  <p className="text-sm font-medium text-gray-600">Sin técnicos habilitados para este rubro</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Todos tienen certificaciones vencidas o no cubren {RUBRO_LABELS[ot.rubro as Rubro]}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Habilitados para {RUBRO_LABELS[ot.rubro as Rubro]} ({disponibles.length})
                  </p>
                  {disponibles.map(t => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                        seleccionado === t.id
                          ? 'border-[#2698D1] bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tecnico"
                        value={t.id}
                        checked={seleccionado === t.id}
                        onChange={() => setSeleccionado(t.id)}
                        className="accent-[#2698D1]"
                      />
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2698D1]/10 text-[#2698D1] text-xs font-black shrink-0">
                        {t.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#0D0D0D]">{t.nombre}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{t.zona}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{t.otsCompletadas} OTs</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs font-bold text-green-600">Score {t.score}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        ✓ Habilitado
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {bloqueados.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    No habilitados ({bloqueados.length})
                  </p>
                  {bloqueados.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 opacity-60"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 text-xs font-black shrink-0">
                        {t.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-600">{t.nombre}</p>
                        <p className="text-xs text-red-500">Cert. vencida para {RUBRO_LABELS[ot.rubro as Rubro]}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                        ✗ Bloqueado
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                disabled={!seleccionado}
                onClick={handleConfirmar}
                className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-5 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                {seleccionado
                  ? `Asignar a ${getTecnicoById(seleccionado)?.nombre.split(' ')[0]}`
                  : 'Seleccioná un técnico'
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MODAL DE CAMBIO DE ESTADO ────────────────────────────────────────────────

function ModalCambioEstado({
  ot,
  estadoActual,
  onConfirm,
  onClose,
}: {
  ot: OT;
  estadoActual: EstadoOT;
  onConfirm: (nuevoEstado: EstadoOT) => void;
  onClose: () => void;
}) {
  const transiciones = (TRANSICIONES[estadoActual] ?? []) as EstadoOT[];
  const [seleccionado, setSeleccionado] = useState<EstadoOT | null>(null);
  const [confirmado,   setConfirmado]   = useState(false);

  function handleConfirmar() {
    if (!seleccionado) return;
    setConfirmado(true);
    setTimeout(() => {
      onConfirm(seleccionado);
      onClose();
    }, 700);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <p className="text-xs font-bold text-gray-400">{ot.id}</p>
            <h3 className="font-black text-[#0D0D0D]">Cambiar estado</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Estado actual: <span className="font-bold">{estadoActual.replace(/_/g, ' ')}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {confirmado ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-black text-[#0D0D0D]">Estado actualizado</p>
            <p className="text-sm text-gray-500">{seleccionado?.replace(/_/g, ' ')}</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4">
              {transiciones.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400 italic">
                  No hay transiciones disponibles desde este estado.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Avanzar a:
                  </p>
                  {transiciones.map(estado => (
                    <label
                      key={estado}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
                        seleccionado === estado
                          ? estado === 'CANCELADA'
                            ? 'border-red-300 bg-red-50'
                            : 'border-[#2698D1] bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={seleccionado === estado}
                        onChange={() => setSeleccionado(estado)}
                        className="accent-[#2698D1]"
                      />
                      <span className={`text-sm font-bold ${
                        estado === 'CANCELADA' ? 'text-red-600' : 'text-[#0D0D0D]'
                      }`}>
                        {estado.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                disabled={!seleccionado}
                onClick={handleConfirmar}
                className={`rounded-lg px-5 py-2 text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  seleccionado === 'CANCELADA'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-[#0D0D0D] hover:bg-gray-800'
                }`}
              >
                Confirmar cambio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function AdminOTs() {
  const [busqueda,     setBusqueda]     = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroUrg,    setFiltroUrg]    = useState('');
  const [filtroRubro,  setFiltroRubro]  = useState('');

  // Estado local: overrides sobre el mock (asignaciones + cambios de estado)
  const [overrides, setOverrides] = useState<OTOverrides>({});

  // Modales
  const [otAsignar,  setOtAsignar]  = useState<OT | null>(null);
  const [otEstado,   setOtEstado]   = useState<OT | null>(null);

  // Notificación toast
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Aplicar override de asignación
  function handleAsignar(otId: string, tecnicoId: string) {
    setOverrides(prev => ({
      ...prev,
      [otId]: {
        ...prev[otId],
        tecnicoId,
        estado: 'TECNICO_ASIGNADO',
      },
    }));
    const t = getTecnicoById(tecnicoId);
    showToast(`${t?.nombre ?? tecnicoId} asignado a ${otId}`);
  }

  // Aplicar override de cambio de estado
  function handleCambioEstado(otId: string, nuevoEstado: EstadoOT) {
    setOverrides(prev => ({
      ...prev,
      [otId]: {
        ...prev[otId],
        estado: nuevoEstado,
      },
    }));
    showToast(`${otId} → ${nuevoEstado.replace(/_/g, ' ')}`);
  }

  // OTs con overrides aplicados — cast a OrdenTrabajo para mantener tipos fuertes
  const otsConOverrides = useMemo(() =>
    OTS.map(ot => {
      const ov = overrides[ot.id];
      if (!ov) return ot;
      return {
        ...ot,
        ...(ov.tecnicoId !== undefined ? { tecnicoId: ov.tecnicoId } : {}),
        ...(ov.estado    !== undefined ? { estado:    ov.estado    } : {}),
      };
    }),
    [overrides]
  );

  const slaBreachIds = new Set(
    OTS.filter(o => o.slaBreachAt && new Date(o.slaBreachAt) < new Date()).map(o => o.id)
  );

  const filtradas = otsConOverrides.filter(ot => {
    if (filtroEstado && ot.estado !== filtroEstado)                    return false;
    if (filtroUrg    && ot.urgencia !== filtroUrg)                     return false;
    if (filtroRubro  && ot.rubro !== (filtroRubro as Rubro))           return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      const r = getRestauranteById(ot.restauranteId);
      const t = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
      if (!ot.id.toLowerCase().includes(q) &&
          !ot.equipoTipo.toLowerCase().includes(q) &&
          !(r?.nombre.toLowerCase().includes(q)) &&
          !(t?.nombre.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const hayFiltros = busqueda || filtroEstado || filtroUrg || filtroRubro;
  const totalOverrides = Object.keys(overrides).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Órdenes de trabajo</h1>
              <p className="text-gray-500">{filtradas.length} de {OTS.length} OTs</p>
            </div>
            {totalOverrides > 0 && (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#2698D1]/10 px-3 py-1 text-xs font-bold text-[#2698D1]">
                  {totalOverrides} cambio{totalOverrides > 1 ? 's' : ''} en sesión
                </span>
                <button
                  onClick={() => setOverrides({})}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Resetear
                </button>
              </div>
            )}
          </div>

          {/* FILTROS */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar OT, equipo, restaurante..."
                className="text-sm outline-none w-48"
              />
            </div>

            <div className="relative">
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm outline-none cursor-pointer"
              >
                <option value="">Todos los estados</option>
                {TODOS_ESTADOS.map(e => (
                  <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={filtroUrg}
                onChange={e => setFiltroUrg(e.target.value)}
                className="appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm outline-none cursor-pointer"
              >
                <option value="">Todas las urgencias</option>
                {TODOS_URGENCIA.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={filtroRubro}
                onChange={e => setFiltroRubro(e.target.value)}
                className="appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm outline-none cursor-pointer"
              >
                <option value="">Todos los rubros</option>
                {Object.entries(RUBRO_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {hayFiltros && (
              <button
                onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroUrg(''); setFiltroRubro(''); }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                <X className="h-3.5 w-3.5" /> Limpiar
              </button>
            )}
          </div>

          {/* TABLA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  {['OT', 'Estado', 'Urgencia', 'Equipo / Rubro', 'Restaurante', 'Técnico', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 italic">
                      Sin resultados para los filtros seleccionados.
                    </td>
                  </tr>
                ) : filtradas.map(ot => {
                  const restaurante   = getRestauranteById(ot.restauranteId);
                  const tecnico       = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
                  const breach        = slaBreachIds.has(ot.id);
                  const sinAsignar    = ot.estado === 'APROBADA_PENDIENTE_ASIGNACION';
                  const tieneOverride = !!overrides[ot.id];
                  const puedeAvanzar  = !!(TRANSICIONES[ot.estado]?.length);

                  return (
                    <tr key={ot.id} className={`hover:bg-gray-50 transition-colors ${
                      breach ? 'bg-red-50/30' : tieneOverride ? 'bg-blue-50/20' : ''
                    }`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">{ot.id}</span>
                          {breach && <Zap className="h-3.5 w-3.5 text-red-500" />}
                          {tieneOverride && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2698D1]" title="Modificado en sesión" />
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <EstadoBadge estado={ot.estado} />
                      </td>

                      <td className="px-4 py-3">
                        <UrgenciaBadge urgencia={ot.urgencia} />
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#0D0D0D]">
                          {ot.equipoTipo} {ot.equipoMarca}
                        </p>
                        <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-[#0D0D0D]">{restaurante?.nombre ?? ot.restauranteId}</p>
                        <p className="text-xs text-gray-400">{restaurante?.zona}</p>
                      </td>

                      <td className="px-4 py-3">
                        {tecnico ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            <span className="text-sm text-[#0D0D0D]">{tecnico.nombre.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className={`text-xs font-bold ${sinAsignar ? 'text-amber-500' : 'text-gray-400'}`}>
                            {sinAsignar ? '⚠ Sin asignar' : '—'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatDate(ot.fechaCreacion)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/restaurante/ots/${ot.id}`}
                            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
                          >
                            Ver
                          </Link>

                          {/* Asignar — solo si no tiene técnico o está sin asignar */}
                          {(sinAsignar || !tecnico) && (
                            <button
                              onClick={() => setOtAsignar(ot)}
                              className="rounded-lg bg-[#2698D1] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
                            >
                              Asignar
                            </button>
                          )}

                          {/* Avanzar estado — si tiene transiciones disponibles */}
                          {puedeAvanzar && (
                            <button
                              onClick={() => setOtEstado(ot)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#0D0D0D] hover:text-[#0D0D0D] transition-colors"
                            >
                              Estado
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* MODAL ASIGNACIÓN */}
      {otAsignar && (
        <ModalAsignacion
          ot={otAsignar}
          tecnicoActualId={overrides[otAsignar.id]?.tecnicoId ?? otAsignar.tecnicoId}
          onConfirm={(tecnicoId) => handleAsignar(otAsignar.id, tecnicoId)}
          onClose={() => setOtAsignar(null)}
        />
      )}

      {/* MODAL CAMBIO ESTADO */}
      {otEstado && (
        <ModalCambioEstado
          ot={otEstado}
          estadoActual={(overrides[otEstado.id]?.estado ?? otEstado.estado) as EstadoOT}
          onConfirm={(nuevoEstado) => handleCambioEstado(otEstado.id, nuevoEstado)}
          onClose={() => setOtEstado(null)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-5 py-3 shadow-xl">
          <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
          <span className="text-sm font-bold text-white">{toast}</span>
        </div>
      )}
    </div>
  );
}
