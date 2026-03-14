"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingTable, EmptyState } from '@/components/shared/states';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import { OTS, RESTAURANTES, getTecnicoById } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Search, Filter, PlusCircle, ChevronRight,
  Wrench, Clock, AlertCircle, CheckCircle2,
  Calendar, MapPin, X,
} from 'lucide-react';

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type OT = typeof OTS[number];

const ESTADOS_ACTIVOS  = ['NUEVA','EN_DIAGNOSTICO','APROBADA_PENDIENTE_ASIGNACION','TECNICO_ASIGNADO','EN_VISITA','COTIZACION_EMITIDA','AUTORIZADA','REPUESTO_SOLICITADO','EN_EJECUCION','PENDIENTE_CONFORMIDAD'];
const ESTADOS_CERRADOS = ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'];

type TabFiltro = 'todas' | 'activas' | 'esperando_accion' | 'cerradas';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function requiereAccion(ot: OT): boolean {
  return ot.estado === 'COTIZACION_EMITIDA' || ot.estado === 'PENDIENTE_CONFORMIDAD';
}

function getIconEstado(ot: OT) {
  if (ot.estado === 'CERRADA_CONFORME' || ot.estado === 'LIQUIDADA' || ot.estado === 'FACTURADA')
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (ot.urgencia === 'CRITICA')
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (requiereAccion(ot))
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  return <Clock className="h-4 w-4 text-[#2698D1]" />;
}

// ─── BADGE ACCIÓN REQUERIDA ───────────────────────────────────────────────────

function AccionBadge({ ot }: { ot: OT }) {
  if (ot.estado === 'COTIZACION_EMITIDA')
    return (
      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-black text-yellow-700">
        ⚡ Aprobá la cotización
      </span>
    );
  if (ot.estado === 'PENDIENTE_CONFORMIDAD')
    return (
      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-black text-orange-700">
        ✍ Firmá la conformidad
      </span>
    );
  return null;
}

// ─── FILA OT ─────────────────────────────────────────────────────────────────

function FilaOT({ ot, restauranteId }: { ot: OT; restauranteId: string }) {
  const tecnico = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
  const accion  = requiereAccion(ot);

  return (
    <Link href={`/restaurante/ots/${ot.id}?id=${restauranteId}`}>
      <div className={`group border-b last:border-b-0 px-6 py-4 hover:bg-blue-50/40 transition-colors cursor-pointer ${accion ? 'bg-yellow-50/30' : ''}`}>
        <div className="flex items-center gap-4">

          {/* Ícono estado */}
          <div className="shrink-0">{getIconEstado(ot)}</div>

          {/* Info principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-gray-400 font-mono">{ot.id}</span>
              <UrgenciaBadge urgencia={ot.urgencia} />
              <EstadoBadge estado={ot.estado} />
              <AccionBadge ot={ot} />
            </div>
            <p className="font-bold text-[#0D0D0D] truncate">
              {ot.equipoTipo}
              {ot.equipoMarca && <span className="font-normal text-gray-400 ml-1">{ot.equipoMarca}</span>}
              {ot.equipoModelo && <span className="font-normal text-gray-400"> {ot.equipoModelo}</span>}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{ot.descripcionFalla}</p>
          </div>

          {/* Técnico asignado */}
          <div className="hidden sm:block w-36 shrink-0">
            {tecnico ? (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500 shrink-0">
                  {tecnico.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 truncate">{tecnico.nombre.split(' ')[0]}</p>
                  <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]?.split(' ')[0]}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-300 italic">Sin asignar</p>
            )}
          </div>

          {/* Precio */}
          <div className="hidden md:block w-28 text-right shrink-0">
            {ot.cotizacion?.totalDefinitivo ? (
              <p className="text-sm font-black text-[#0D0D0D]">{formatARS(ot.cotizacion.totalDefinitivo)}</p>
            ) : ot.cotizacion?.estimacionMin && ot.cotizacion.estimacionMin > 0 ? (
              <p className="text-xs text-gray-400">
                ~USD {ot.cotizacion.estimacionMin}–{ot.cotizacion.estimacionMax}
              </p>
            ) : (
              <p className="text-xs text-gray-300">—</p>
            )}
          </div>

          {/* Fecha */}
          <div className="hidden lg:block w-24 text-right shrink-0">
            <p className="text-xs text-gray-400">{formatDate(ot.fechaCreacion)}</p>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] transition-colors shrink-0" />
        </div>
      </div>
    </Link>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function RestauranteOTs() {
  const searchParams   = useSearchParams();
  const restauranteId  = searchParams.get('id') ?? 'R001';
  const restaurante    = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const [tab,       setTab]       = useState<TabFiltro>('todas');
  const [buscar,    setBuscar]    = useState('');
  const [rubro,     setRubro]     = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  const todasOTs = OTS.filter(ot => ot.restauranteId === restauranteId);

  const otsFiltradas = useMemo(() => {
    let lista = todasOTs;

    // Filtro tab
    if (tab === 'activas')          lista = lista.filter(ot => ESTADOS_ACTIVOS.includes(ot.estado) && !requiereAccion(ot));
    if (tab === 'esperando_accion') lista = lista.filter(ot => requiereAccion(ot));
    if (tab === 'cerradas')         lista = lista.filter(ot => ESTADOS_CERRADOS.includes(ot.estado));

    // Filtro rubro
    if (rubro !== 'todos') lista = lista.filter(ot => ot.rubro === rubro);

    // Filtro búsqueda
    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      lista = lista.filter(ot =>
        ot.id.toLowerCase().includes(q) ||
        ot.equipoTipo?.toLowerCase().includes(q) ||
        ot.equipoMarca?.toLowerCase().includes(q) ||
        ot.descripcionFalla?.toLowerCase().includes(q)
      );
    }

    // Ordenar: acción requerida primero, luego por fecha desc
    return [...lista].sort((a, b) => {
      if (requiereAccion(a) && !requiereAccion(b)) return -1;
      if (!requiereAccion(a) && requiereAccion(b)) return 1;
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
  }, [todasOTs, tab, rubro, buscar]);

  const cuentas = {
    todas:           todasOTs.length,
    activas:         todasOTs.filter(ot => ESTADOS_ACTIVOS.includes(ot.estado) && !requiereAccion(ot)).length,
    esperando_accion: todasOTs.filter(requiereAccion).length,
    cerradas:        todasOTs.filter(ot => ESTADOS_CERRADOS.includes(ot.estado)).length,
  };

  const rubrosUsados = [...new Set(todasOTs.map(ot => ot.rubro))];

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="page-main">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mis órdenes de trabajo</h1>
              <p className="text-sm text-gray-400 mt-0.5">{restaurante.nombre} · {todasOTs.length} OTs en total</p>
            </div>
            <Link
              href={`/restaurante/reportar?id=${restauranteId}`}
              className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Reportar falla
            </Link>
          </div>

          {/* ALERTA ACCIÓN REQUERIDA */}
          {cuentas.esperando_accion > 0 && (
            <button
              onClick={() => setTab('esperando_accion')}
              className="mb-6 w-full flex items-center gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-left hover:bg-yellow-100 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-yellow-800">
                  {cuentas.esperando_accion} OT{cuentas.esperando_accion > 1 ? 's requieren' : ' requiere'} tu atención
                </p>
                <p className="text-xs text-yellow-600">Cotizaciones pendientes de aprobación o conformidades sin firmar</p>
              </div>
              <ChevronRight className="h-4 w-4 text-yellow-500" />
            </button>
          )}

          {/* TABS */}
          <div className="mb-4 flex items-center gap-1 rounded-xl border bg-white p-1 shadow-sm w-fit">
            {([
              { key: 'todas',            label: 'Todas',           count: cuentas.todas },
              { key: 'activas',          label: 'En curso',        count: cuentas.activas },
              { key: 'esperando_accion', label: 'Acción requerida', count: cuentas.esperando_accion, alert: true },
              { key: 'cerradas',         label: 'Cerradas',        count: cuentas.cerradas },
            ] as { key: TabFiltro; label: string; count: number; alert?: boolean }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key
                    ? 'bg-[#0D0D0D] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key
                    ? 'bg-white/20 text-white'
                    : t.alert && t.count > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* FILTROS */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                placeholder="Buscar por equipo, falla, ID…"
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1] transition-colors"
              />
              {buscar && (
                <button onClick={() => setBuscar('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {rubrosUsados.length > 1 && (
              <select
                value={rubro}
                onChange={e => setRubro(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]"
              >
                <option value="todos">Todos los rubros</option>
                {rubrosUsados.map(r => (
                  <option key={r} value={r}>{RUBRO_LABELS[r as Rubro]}</option>
                ))}
              </select>
            )}
          </div>

          {/* LISTA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {/* Header tabla */}
            <div className="grid border-b bg-gray-50 px-6 py-3" style={{ gridTemplateColumns: '1fr 144px 112px 96px 16px' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Equipo / Falla</p>
              <p className="hidden sm:block text-xs font-bold uppercase tracking-wider text-gray-400">Técnico</p>
              <p className="hidden md:block text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Total</p>
              <p className="hidden lg:block text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Fecha</p>
              <div />
            </div>

            {isLoading ? (
              <LoadingTable rows={5} cols={5} />
            ) : otsFiltradas.length === 0 ? (
              <EmptyState icon={Wrench} title="Sin OTs en esta vista" description={buscar ? 'Intentá con otra búsqueda' : 'Cambiá el filtro o reportá una nueva falla'} />
            ) : (
              otsFiltradas.map(ot => (
                <FilaOT key={ot.id} ot={ot} restauranteId={restauranteId} />
              ))
            )}
          </div>

          {otsFiltradas.length > 0 && (
            <p className="mt-3 text-xs text-gray-400 text-right">
              Mostrando {otsFiltradas.length} de {todasOTs.length} OTs
            </p>
          )}

        </main>
      </div>
    </div>
  );
}