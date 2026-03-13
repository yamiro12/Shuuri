"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import { OTS, TECNICOS, getRestauranteById } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Search, ChevronRight, Wrench, Clock,
  AlertTriangle, CheckCircle2, MapPin,
  Calendar, X, DollarSign,
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type OT = typeof OTS[number];
type TabFiltro = 'activas' | 'pendiente_conformidad' | 'cerradas' | 'todas';

const ESTADOS_ACTIVOS = ['TECNICO_ASIGNADO','EN_VISITA','COTIZACION_EMITIDA','AUTORIZADA','REPUESTO_SOLICITADO','EN_EJECUCION'];
const ESTADOS_CERRADOS = ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'];

// ─── CARD OT ─────────────────────────────────────────────────────────────────

function CardOT({ ot, tecnicoId }: { ot: OT; tecnicoId: string }) {
  const restaurante = getRestauranteById(ot.restauranteId);
  const esCritica   = ot.urgencia === 'CRITICA';
  const esPendConf  = ot.estado === 'PENDIENTE_CONFORMIDAD';
  const esCerrada   = ESTADOS_CERRADOS.includes(ot.estado);

  return (
    <Link href={`/tecnico/ots/${ot.id}?tecnicoId=${tecnicoId}`}>
      <div className={`group rounded-xl border bg-white shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all cursor-pointer overflow-hidden ${
        esCritica && !esCerrada ? 'border-red-200' :
        esPendConf ? 'border-orange-200' : ''
      }`}>
        {/* Franja urgencia */}
        <div className={`h-1 w-full ${
          ot.urgencia === 'CRITICA' ? 'bg-red-500' :
          ot.urgencia === 'ALTA'    ? 'bg-orange-400' :
          ot.urgencia === 'MEDIA'   ? 'bg-[#2698D1]' :
          'bg-gray-200'
        }`} />

        <div className="p-5">
          {/* Header card */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 font-mono">{ot.id}</span>
              <UrgenciaBadge urgencia={ot.urgencia} />
              <EstadoBadge estado={ot.estado} />
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] transition-colors shrink-0 mt-0.5" />
          </div>

          {/* Equipo */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 shrink-0">
              <Wrench className="h-5 w-5 text-gray-400" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#0D0D0D] truncate">
                {ot.equipoTipo}
                {ot.equipoMarca && <span className="font-normal text-gray-400 ml-1">{ot.equipoMarca}</span>}
              </p>
              <p className="text-xs text-gray-400">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">{ot.descripcionFalla}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            {/* Restaurante */}
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              <p className="text-xs text-gray-500 truncate">{restaurante?.nombre}</p>
              {restaurante?.zona && <span className="text-xs text-gray-300">· {restaurante.zona.split(' ')[0]}</span>}
            </div>

            {/* Precio o fecha */}
            {ot.cotizacion?.totalDefinitivo ? (
              <div className="flex items-center gap-1 shrink-0">
                <DollarSign className="h-3.5 w-3.5 text-green-500" />
                <p className="text-xs font-black text-green-600">{formatARS(ot.cotizacion.totalDefinitivo)}</p>
              </div>
            ) : (
              <div className="flex items-center gap-1 shrink-0">
                <Calendar className="h-3.5 w-3.5 text-gray-300" />
                <p className="text-xs text-gray-400">{formatDate(ot.fechaCreacion)}</p>
              </div>
            )}
          </div>

          {/* Alert conformidad */}
          {esPendConf && (
            <div className="mt-3 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2">
              <p className="text-xs font-bold text-orange-600">✍ Esperando firma de conformidad del cliente</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function TecnicoOTs() {
  const searchParams = useSearchParams();
  const tecnicoId    = searchParams.get('id') ?? 'T002';
  const tecnico      = TECNICOS.find(t => t.id === tecnicoId) ?? TECNICOS[1];

  const [tab,    setTab]    = useState<TabFiltro>('activas');
  const [buscar, setBuscar] = useState('');

  const todasOTs = OTS.filter(ot => ot.tecnicoId === tecnicoId);

  const otsFiltradas = useMemo(() => {
    let lista = todasOTs;

    if (tab === 'activas')              lista = lista.filter(ot => ESTADOS_ACTIVOS.includes(ot.estado));
    if (tab === 'pendiente_conformidad') lista = lista.filter(ot => ot.estado === 'PENDIENTE_CONFORMIDAD');
    if (tab === 'cerradas')              lista = lista.filter(ot => ESTADOS_CERRADOS.includes(ot.estado));

    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      lista = lista.filter(ot =>
        ot.id.toLowerCase().includes(q) ||
        ot.equipoTipo?.toLowerCase().includes(q) ||
        ot.descripcionFalla?.toLowerCase().includes(q)
      );
    }

    // Críticas primero, luego por fecha
    return [...lista].sort((a, b) => {
      const urgPrio: Record<string, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
      if (urgPrio[a.urgencia] !== urgPrio[b.urgencia])
        return urgPrio[a.urgencia] - urgPrio[b.urgencia];
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
  }, [todasOTs, tab, buscar]);

  const cuentas = {
    activas:               todasOTs.filter(ot => ESTADOS_ACTIVOS.includes(ot.estado)).length,
    pendiente_conformidad: todasOTs.filter(ot => ot.estado === 'PENDIENTE_CONFORMIDAD').length,
    cerradas:              todasOTs.filter(ot => ESTADOS_CERRADOS.includes(ot.estado)).length,
    todas:                 todasOTs.length,
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={tecnico.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={tecnico.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mis órdenes de trabajo</h1>
              <p className="text-sm text-gray-400 mt-0.5">{tecnico.nombre} · {todasOTs.length} OTs asignadas</p>
            </div>
            <Link
              href={`/tecnico/agenda?id=${tecnicoId}`}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:border-[#2698D1] transition-colors shadow-sm"
            >
              <Calendar className="h-4 w-4 text-[#2698D1]" />
              Ver agenda
            </Link>
          </div>

          {/* ALERTA CONFORMIDAD */}
          {cuentas.pendiente_conformidad > 0 && (
            <button
              onClick={() => setTab('pendiente_conformidad')}
              className="mb-6 w-full flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-left hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-orange-800">
                  {cuentas.pendiente_conformidad} OT{cuentas.pendiente_conformidad > 1 ? 's' : ''} esperando firma de conformidad
                </p>
                <p className="text-xs text-orange-600">El trabajo está finalizado. Pedile al cliente que firme para cerrar.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-orange-400" />
            </button>
          )}

          {/* TABS */}
          <div className="mb-5 flex items-center gap-1 rounded-xl border bg-white p-1 shadow-sm w-fit">
            {([
              { key: 'activas',               label: 'Activas',          count: cuentas.activas },
              { key: 'pendiente_conformidad', label: 'Pend. conformidad', count: cuentas.pendiente_conformidad, alert: true },
              { key: 'cerradas',              label: 'Cerradas',          count: cuentas.cerradas },
              { key: 'todas',                 label: 'Todas',             count: cuentas.todas },
            ] as { key: TabFiltro; label: string; count: number; alert?: boolean }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key ? 'bg-white/20 text-white' :
                  t.alert && t.count > 0 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* BÚSQUEDA */}
          <div className="mb-5 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              placeholder="Buscar por ID, equipo, falla…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1] transition-colors"
            />
            {buscar && (
              <button onClick={() => setBuscar('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* GRID OTs */}
          {otsFiltradas.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-gray-200" />
              <p className="font-bold text-gray-400">Sin OTs en esta vista</p>
              <p className="text-xs text-gray-300 mt-1">
                {buscar ? 'Intentá con otra búsqueda' : 'No hay OTs en este estado'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {otsFiltradas.map(ot => (
                <CardOT key={ot.id} ot={ot} tecnicoId={tecnicoId} />
              ))}
            </div>
          )}

          {otsFiltradas.length > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              {otsFiltradas.length} OT{otsFiltradas.length > 1 ? 's' : ''} · ordenadas por urgencia
            </p>
          )}

        </main>
      </div>
    </div>
  );
}