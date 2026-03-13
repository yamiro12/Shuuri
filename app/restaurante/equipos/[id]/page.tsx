'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, Clock, XCircle,
  AlertTriangle, Calendar, Package, Wrench,
  PlusCircle, ChevronRight, Shield, ShieldX,
  X, Zap, TrendingUp, User, RotateCcw,
} from 'lucide-react';
import { EQUIPOS, OTS, getRestauranteById, getTecnicoById } from '@/data/mock';
import { RUBRO_LABELS, SAAS_POR_TIER, COMISION_POR_TIER } from '@/types/shuuri';
import { EstadoBadge, UrgenciaBadge, formatDate } from '@/components/shared/utils';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getEstadoConfig(estado: string) {
  switch (estado) {
    case 'operativo':
      return { label: 'Operativo', icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'text-green-700 bg-green-50 border-green-200' };
    case 'en_servicio':
      return { label: 'En servicio', icon: <Clock className="w-3.5 h-3.5" />, cls: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'fuera_de_servicio':
      return { label: 'Fuera de servicio', icon: <XCircle className="w-3.5 h-3.5" />, cls: 'text-red-700 bg-red-50 border-red-200' };
    default:
      return { label: estado, icon: null, cls: 'text-gray-600 bg-gray-50 border-gray-200' };
  }
}

type Frecuencia = 'mensual' | 'trimestral' | 'semestral' | 'anual';

const FRECUENCIA_MESES: Record<Frecuencia, number> = {
  mensual:    1,
  trimestral: 3,
  semestral:  6,
  anual:      12,
};

const FRECUENCIA_LABELS: Record<Frecuencia, string> = {
  mensual:    'Mensual',
  trimestral: 'Trimestral',
  semestral:  'Semestral',
  anual:      'Anual',
};

function calcProximaFecha(frecuencia: Frecuencia): string {
  const d = new Date();
  d.setMonth(d.getMonth() + FRECUENCIA_MESES[frecuencia]);
  return d.toISOString().slice(0, 10);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function EquipoDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const equipo = EQUIPOS.find(e => e.id === id);

  // Plan preventivo — gestionado en estado local
  const [planPrev, setPlanPrev] = useState<{ frecuencia: Frecuencia; proximaFecha: string } | null>(
    () => equipo?.proximoPreventivo
      ? { frecuencia: 'anual', proximaFecha: equipo.proximoPreventivo }
      : null
  );
  const [modalPrev,    setModalPrev]    = useState(false);
  const [frecSelected, setFrecSelected] = useState<Frecuencia>('trimestral');
  const [modalUpgrade, setModalUpgrade] = useState(false);

  if (!equipo) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Equipo no encontrado.</p>
        <button onClick={() => router.back()} className="text-blue-600 text-sm mt-2 inline-block">← Volver</button>
      </div>
    );
  }

  const restaurante = getRestauranteById(equipo.restauranteId);
  const esFreemium  = restaurante?.tier === 'FREEMIUM';

  const otsEquipo = OTS
    .filter(o => o.equipoId === equipo.id)
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  const otsActivas = otsEquipo.filter(o =>
    !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado)
  );

  const estadoConf = getEstadoConfig(equipo.estado);

  function confirmarPlan() {
    setPlanPrev({ frecuencia: frecSelected, proximaFecha: calcProximaFecha(frecSelected) });
    setModalPrev(false);
  }

  // URL reportar con restauranteId + equipoId
  const urlReportar = `/restaurante/reportar?id=${equipo.restauranteId}&equipoId=${equipo.id}`;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Volver a Mis Equipos
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* ID + estado + garantía */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-xs text-gray-400">{equipo.id}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${estadoConf.cls}`}>
                  {estadoConf.icon}
                  {estadoConf.label}
                </span>
                {/* Badge garantía */}
                {equipo.garantiaVigente ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700">
                    <Shield size={12} /> Garantía vigente
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
                    <ShieldX size={12} /> Sin garantía
                  </span>
                )}
              </div>

              {/* Nombre equipo */}
              <h1 className="text-xl font-bold text-gray-900">{equipo.tipo}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {equipo.marca}
                {equipo.modelo && ` · ${equipo.modelo}`}
                {' · '}
                <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{RUBRO_LABELS[equipo.rubro]}</span>
              </p>

              {/* Serie + año */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Serie: <span className="font-mono text-gray-600">{equipo.serie}</span></span>
                <span>Instalado: <span className="text-gray-600">{equipo.anioInstalacion}</span></span>
                {equipo.fechaUltimoServicio && (
                  <span>Último servicio: <span className="text-gray-600">{formatDate(equipo.fechaUltimoServicio)}</span></span>
                )}
              </div>
            </div>

            {/* Acciones header */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href={urlReportar}
                className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
              >
                <PlusCircle size={15} /> Reportar falla
              </Link>
              {esFreemium && (
                <button
                  onClick={() => setModalUpgrade(true)}
                  className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <Zap size={15} /> Upgrade de tier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        {/* ── PLAN PREVENTIVO ──────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw size={15} className="text-[#2698D1]" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Plan preventivo</h2>
            </div>
            {!planPrev && (
              <button
                onClick={() => setModalPrev(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
              >
                <PlusCircle size={13} /> Agregar al plan
              </button>
            )}
          </div>

          {planPrev ? (
            <div className="flex items-start justify-between gap-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-[#2698D1]">Plan activo — {FRECUENCIA_LABELS[planPrev.frecuencia]}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-600">
                  <Calendar size={12} />
                  Próxima fecha: <span className="font-semibold">{formatDate(planPrev.proximaFecha)}</span>
                </div>
              </div>
              <button
                onClick={() => setModalPrev(true)}
                className="text-xs text-blue-500 hover:text-blue-700 underline shrink-0"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 px-4 py-4 text-center">
              <p className="text-sm text-gray-400">Sin plan preventivo configurado para este equipo.</p>
              <button
                onClick={() => setModalPrev(true)}
                className="mt-2 text-xs font-bold text-[#2698D1] hover:underline"
              >
                Configurar ahora →
              </button>
            </div>
          )}
        </section>

        {/* ── HISTORIAL OTs ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={15} className="text-[#2698D1]" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Historial de OTs</h2>
              <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">{otsEquipo.length}</span>
            </div>
            {otsActivas.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                {otsActivas.length} activa{otsActivas.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {otsEquipo.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin OTs registradas para este equipo</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {otsEquipo.map(ot => {
                const tecnico = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
                return (
                  <Link
                    key={ot.id}
                    href={`/restaurante/ots/${ot.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-gray-400">{ot.id}</span>
                        <EstadoBadge estado={ot.estado} />
                        <UrgenciaBadge urgencia={ot.urgencia} />
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-1">{ot.descripcionFalla}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{formatDate(ot.fechaCreacion)}</span>
                        {tecnico && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <User size={10} /> {tecnico.nombre}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* ── MODAL PLAN PREVENTIVO ─────────────────────────────────────────────── */}
      {modalPrev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h3 className="font-black text-[#0D0D0D]">
                {planPrev ? 'Cambiar frecuencia' : 'Agregar al plan preventivo'}
              </h3>
              <button onClick={() => setModalPrev(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              <p className="text-xs text-gray-500">Seleccioná la frecuencia de mantenimiento preventivo para <strong>{equipo.tipo}</strong>.</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(FRECUENCIA_LABELS) as Frecuencia[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFrecSelected(f)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors text-left ${
                      frecSelected === f
                        ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p>{FRECUENCIA_LABELS[f]}</p>
                    <p className="text-xs font-normal opacity-60 mt-0.5">
                      Cada {FRECUENCIA_MESES[f]} {FRECUENCIA_MESES[f] === 1 ? 'mes' : 'meses'}
                    </p>
                  </button>
                ))}
              </div>
              {frecSelected && (
                <p className="text-xs text-gray-400 pt-1">
                  Próxima fecha estimada: <span className="font-semibold text-gray-600">{formatDate(calcProximaFecha(frecSelected))}</span>
                </p>
              )}
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <button
                onClick={() => setModalPrev(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPlan}
                className="flex-1 rounded-lg bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL UPGRADE DE TIER ─────────────────────────────────────────────── */}
      {modalUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                <h3 className="font-black text-[#0D0D0D]">Upgrade a Cadena Chica</h3>
              </div>
              <button onClick={() => setModalUpgrade(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Pasá de Freemium a <strong>Cadena Chica</strong> y accedé a más beneficios para tu operación.
              </p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                <p className="text-xs font-black text-amber-700 uppercase tracking-wide">Beneficios Cadena Chica</p>
                {[
                  { icon: TrendingUp, text: `Comisión reducida al ${(COMISION_POR_TIER['CADENA_CHICA'] * 100).toFixed(0)}% (vs 30% Freemium)` },
                  { icon: Calendar,   text: `SaaS fijo: USD ${SAAS_POR_TIER['CADENA_CHICA']}/local/mes` },
                  { icon: Wrench,     text: 'Acceso prioritario a técnicos certificados' },
                  { icon: Shield,     text: 'Soporte dedicado SHUURI' },
                  { icon: RotateCcw,  text: 'Plan preventivo administrado incluido' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon size={14} className="text-amber-600 shrink-0" />
                    <span className="text-sm text-amber-800">{text}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                <p className="text-2xl font-black text-[#0D0D0D]">USD {SAAS_POR_TIER['CADENA_CHICA']}</p>
                <p className="text-xs text-gray-400 mt-0.5">por local · por mes</p>
                <p className="text-xs text-gray-500 mt-2">+ comisión {(COMISION_POR_TIER['CADENA_CHICA'] * 100).toFixed(0)}% sobre servicios coordinados</p>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <button
                onClick={() => setModalUpgrade(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Ahora no
              </button>
              <button
                onClick={() => setModalUpgrade(false)}
                className="flex-1 rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
              >
                Solicitar upgrade
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
