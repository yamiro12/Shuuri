'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, Clock, XCircle, AlertTriangle,
  Calendar, Package, Wrench, PlusCircle, ChevronRight,
  Shield, ShieldX, X, Zap, TrendingUp, User, RotateCcw,
  ShoppingBag, UserCheck, FileText, DollarSign,
} from 'lucide-react';
import { EQUIPOS, OTS, RESTAURANTES, getTecnicoById } from '@/data/mock';
import { RUBRO_LABELS, SAAS_POR_TIER, COMISION_POR_TIER } from '@/types/shuuri';
import { EstadoBadge, UrgenciaBadge, formatDate } from '@/components/shared/utils';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getEstadoConfig(estado: string) {
  switch (estado) {
    case 'operativo':         return { label: 'Operativo',        icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'text-green-700 bg-green-50 border-green-200' };
    case 'en_servicio':       return { label: 'En servicio',      icon: <Clock       className="w-3.5 h-3.5" />, cls: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'fuera_de_servicio': return { label: 'Fuera de servicio',icon: <XCircle     className="w-3.5 h-3.5" />, cls: 'text-red-700 bg-red-50 border-red-200' };
    default:                  return { label: estado, icon: null, cls: 'text-gray-600 bg-gray-50 border-gray-200' };
  }
}

type Frecuencia = 'mensual' | 'trimestral' | 'semestral' | 'anual';
const FRECUENCIA_MESES:  Record<Frecuencia, number> = { mensual: 1, trimestral: 3, semestral: 6, anual: 12 };
const FRECUENCIA_LABELS: Record<Frecuencia, string> = { mensual: 'Mensual', trimestral: 'Trimestral', semestral: 'Semestral', anual: 'Anual' };

function calcProximaFecha(frecuencia: Frecuencia): string {
  const d = new Date();
  d.setMonth(d.getMonth() + FRECUENCIA_MESES[frecuencia]);
  return d.toISOString().slice(0, 10);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function EquipoDetalle() {
  const { id }        = useParams<{ id: string }>();
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];
  const equipo        = EQUIPOS.find(e => e.id === id);

  const [tab,          setTab]          = useState<'historial' | 'costos' | 'info'>('historial');
  const [planPrev,     setPlanPrev]     = useState<{ frecuencia: Frecuencia; proximaFecha: string } | null>(
    () => equipo?.proximoPreventivo ? { frecuencia: 'anual', proximaFecha: equipo.proximoPreventivo } : null
  );
  const [modalPrev,    setModalPrev]    = useState(false);
  const [frecSelected, setFrecSelected] = useState<Frecuencia>('trimestral');
  const [modalUpgrade, setModalUpgrade] = useState(false);

  if (!equipo) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FA]">
        <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <div className="flex-1 sidebar-push">
          <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4 text-gray-500">
            <Package className="h-12 w-12 opacity-20" />
            <p className="font-semibold">Equipo no encontrado</p>
            <Link href={`/restaurante/equipos?id=${restauranteId}`} className="text-sm text-[#2698D1] hover:underline">← Volver a Mis Equipos</Link>
          </main>
        </div>
      </div>
    );
  }

  const esFreemium  = restaurante.tier === 'FREEMIUM';
  const estadoConf  = getEstadoConfig(equipo.estado);
  const urlReportar = `/restaurante/reportar?id=${restauranteId}&equipoId=${equipo.id}`;

  const otsEquipo = OTS
    .filter(o => o.equipoId === equipo.id)
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  const otsActivas = otsEquipo.filter(o =>
    !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado)
  );

  // Costos simulados (mock): suma $18.000 por OT cerrada
  const costoTotal   = otsEquipo.filter(o => ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(o.estado)).length * 18000;
  const costoPromedio = otsEquipo.length > 0 ? Math.round(costoTotal / Math.max(1, otsEquipo.filter(o => ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(o.estado)).length)) : 0;

  function confirmarPlan() {
    setPlanPrev({ frecuencia: frecSelected, proximaFecha: calcProximaFecha(frecSelected) });
    setModalPrev(false);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-4xl">

          {/* ── BACK ── */}
          <Link
            href={`/restaurante/equipos?id=${restauranteId}`}
            className="mb-5 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D0D0D] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Mis Equipos
          </Link>

          {/* ── EQUIPO HEADER ── */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-400">{equipo.id}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${estadoConf.cls}`}>
                    {estadoConf.icon} {estadoConf.label}
                  </span>
                  {equipo.garantiaVigente ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700">
                      <Shield className="w-3 h-3" /> Garantía vigente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
                      <ShieldX className="w-3 h-3" /> Sin garantía
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-black text-[#0D0D0D]">{equipo.tipo}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {equipo.marca}{equipo.modelo && ` · ${equipo.modelo}`}
                  {' · '}<span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{RUBRO_LABELS[equipo.rubro]}</span>
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>Serie: <span className="font-mono text-gray-600">{equipo.serie}</span></span>
                  <span>Instalado: <span className="text-gray-600">{equipo.anioInstalacion}</span></span>
                  {equipo.fechaUltimoServicio && (
                    <span>Último servicio: <span className="text-gray-600">{formatDate(equipo.fechaUltimoServicio)}</span></span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href={urlReportar}
                  className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d7ab8] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Reportar falla
                </Link>
                {esFreemium && (
                  <button
                    onClick={() => setModalUpgrade(true)}
                    className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    <Zap className="w-4 h-4" /> Mejorar plan
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── BOTONES COMERCIALES ── */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: RotateCcw,   label: 'Plan preventivo',  href: urlReportar,                                  cls: 'border-blue-100 bg-blue-50 hover:border-[#2698D1]/40' },
              { icon: ShoppingBag, label: 'Buscar repuestos', href: `/restaurante/marketplace?id=${restauranteId}`, cls: 'border-orange-100 bg-orange-50 hover:border-orange-300' },
              { icon: UserCheck,   label: 'Técnico fijo',     href: `/restaurante/tecnicos-fijos?id=${restauranteId}`, cls: 'border-gray-100 bg-white hover:border-gray-300' },
              { icon: FileText,    label: 'Ver OTs',          href: `/restaurante/ots?id=${restauranteId}`,        cls: 'border-gray-100 bg-white hover:border-gray-300' },
            ].map(cta => {
              const Icon = cta.icon;
              return (
                <Link key={cta.label} href={cta.href} className={`flex items-center gap-2.5 rounded-xl border p-3 transition-all shadow-sm ${cta.cls}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Icon className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  <span className="text-sm font-semibold text-[#0D0D0D]">{cta.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── PLAN PREVENTIVO ── */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#2698D1]" />
                <h2 className="text-sm font-bold text-[#0D0D0D]">Plan preventivo</h2>
              </div>
              <button
                onClick={() => setModalPrev(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
              >
                <PlusCircle className="h-3 w-3" /> {planPrev ? 'Cambiar' : 'Configurar'}
              </button>
            </div>
            {planPrev ? (
              <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#2698D1]">Activo — {FRECUENCIA_LABELS[planPrev.frecuencia]}</p>
                  <p className="flex items-center gap-1.5 mt-1 text-xs text-blue-600">
                    <Calendar className="h-3 w-3" />
                    Próxima visita: <span className="font-semibold">{formatDate(planPrev.proximaFecha)}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 px-4 py-4 text-center">
                <p className="text-sm text-gray-400">Sin plan preventivo configurado.</p>
                <button onClick={() => setModalPrev(true)} className="mt-1.5 text-xs font-bold text-[#2698D1] hover:underline">
                  Configurar ahora →
                </button>
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="mb-5 flex items-center gap-0 border-b border-gray-200">
            {[
              { key: 'historial', label: 'Historial OTs',  icon: Wrench      },
              { key: 'costos',    label: 'Costos',          icon: DollarSign  },
              { key: 'info',      label: 'Ficha técnica',   icon: FileText    },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                    tab === t.key ? 'border-[#2698D1] text-[#2698D1]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                  {t.key === 'historial' && otsActivas.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-black text-blue-700">{otsActivas.length}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── TAB: HISTORIAL ── */}
          {tab === 'historial' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {otsEquipo.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sin OTs registradas para este equipo</p>
                  <Link href={urlReportar} className="mt-2 inline-block text-xs font-bold text-[#2698D1] hover:underline">
                    Reportar primera falla →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {otsEquipo.map(ot => {
                    const tecnico = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
                    return (
                      <Link
                        key={ot.id}
                        href={`/restaurante/ots/${ot.id}?id=${restauranteId}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-gray-400">{ot.id}</span>
                            <EstadoBadge estado={ot.estado} />
                            <UrgenciaBadge urgencia={ot.urgencia} />
                          </div>
                          <p className="text-sm text-[#0D0D0D] line-clamp-1">{ot.descripcionFalla}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">{formatDate(ot.fechaCreacion)}</span>
                            {tecnico && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <User className="h-3 w-3" /> {tecnico.nombre}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: COSTOS ── */}
          {tab === 'costos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Gasto total',       value: `$${costoTotal.toLocaleString('es-AR')}`,    icon: DollarSign,  cls: 'text-[#0D0D0D]' },
                  { label: 'Costo promedio/OT',  value: `$${costoPromedio.toLocaleString('es-AR')}`, icon: TrendingUp,  cls: 'text-[#0D0D0D]' },
                  { label: 'OTs completadas',    value: String(otsEquipo.filter(o => ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(o.estado)).length), icon: CheckCircle, cls: 'text-green-600' },
                ].map(k => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${k.cls}`} />
                        <p className="text-xs text-gray-400">{k.label}</p>
                      </div>
                      <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                <p className="text-sm font-bold text-[#0D0D0D] mb-3">Desglose por OT</p>
                {otsEquipo.length === 0 ? (
                  <p className="text-sm text-gray-400">Sin historial de costos.</p>
                ) : (
                  <div className="space-y-2">
                    {otsEquipo.map(ot => {
                      const cerrada = ['CERRADA_CONFORME','FACTURADA','LIQUIDADA'].includes(ot.estado);
                      return (
                        <div key={ot.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-xs text-gray-400 shrink-0">{ot.id}</span>
                            <span className="text-gray-600 truncate">{ot.descripcionFalla}</span>
                          </div>
                          <span className={`shrink-0 font-bold ${cerrada ? 'text-[#0D0D0D]' : 'text-gray-300'}`}>
                            {cerrada ? `$${(18000).toLocaleString('es-AR')}` : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-center">
                <p className="text-xs text-gray-400">Costos estimados. Los valores reales se reflejan en la liquidación.</p>
              </div>
            </div>
          )}

          {/* ── TAB: FICHA TÉCNICA ── */}
          {tab === 'info' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: 'ID equipo',         value: equipo.id },
                  { label: 'Tipo',              value: equipo.tipo },
                  { label: 'Marca',             value: equipo.marca },
                  { label: 'Modelo',            value: equipo.modelo || '—' },
                  { label: 'N° de serie',        value: equipo.serie },
                  { label: 'Rubro',             value: RUBRO_LABELS[equipo.rubro] },
                  { label: 'Año de instalación', value: String(equipo.anioInstalacion) },
                  { label: 'Estado',            value: estadoConf.label },
                  { label: 'Garantía vigente',  value: equipo.garantiaVigente ? 'Sí' : 'No' },
                  { label: 'Último servicio',   value: formatDate(equipo.fechaUltimoServicio) },
                  { label: 'Próximo preventivo', value: formatDate(equipo.proximoPreventivo) },
                  { label: 'OTs registradas',   value: String(otsEquipo.length) },
                ].map(row => (
                  <div key={row.label} className="py-2 border-b border-gray-50 last:border-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{row.label}</p>
                    <p className="text-sm font-medium text-[#0D0D0D]">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL PREVENTIVO ── */}
      {modalPrev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalPrev(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h3 className="font-black text-[#0D0D0D]">{planPrev ? 'Cambiar frecuencia' : 'Plan preventivo'}</h3>
              <button onClick={() => setModalPrev(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-xs text-gray-500">Frecuencia de mantenimiento para <strong>{equipo.tipo}</strong>.</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(FRECUENCIA_LABELS) as Frecuencia[]).map(f => (
                  <button key={f} onClick={() => setFrecSelected(f)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-bold text-left transition-colors ${frecSelected === f ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <p>{FRECUENCIA_LABELS[f]}</p>
                    <p className="text-xs font-normal opacity-60 mt-0.5">Cada {FRECUENCIA_MESES[f]} {FRECUENCIA_MESES[f] === 1 ? 'mes' : 'meses'}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 pt-1">Próxima fecha estimada: <span className="font-semibold text-gray-600">{formatDate(calcProximaFecha(frecSelected))}</span></p>
            </div>
            <div className="flex gap-3 border-t px-6 py-4">
              <button onClick={() => setModalPrev(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={confirmarPlan} className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#1d7ab8] transition-colors">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL UPGRADE ── */}
      {modalUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalUpgrade(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-amber-500" /><h3 className="font-black text-[#0D0D0D]">Mejorar a Cadena Chica</h3></div>
              <button onClick={() => setModalUpgrade(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">Accedé a más beneficios para tu operación con <strong>Cadena Chica</strong>.</p>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2.5">
                {[
                  { icon: TrendingUp, text: `Comisión reducida al ${(COMISION_POR_TIER['CADENA_CHICA'] * 100).toFixed(0)}% (vs 30% Freemium)` },
                  { icon: Calendar,   text: `USD ${SAAS_POR_TIER['CADENA_CHICA']}/local/mes` },
                  { icon: Wrench,     text: 'Acceso prioritario a técnicos certificados' },
                  { icon: Shield,     text: 'Soporte dedicado SHUURI' },
                  { icon: RotateCcw,  text: 'Plan preventivo administrado incluido' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="text-sm text-amber-800">{text}</span>
                  </div>
                ))}
              </div>
              <div className="text-center rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-2xl font-black text-[#0D0D0D]">USD {SAAS_POR_TIER['CADENA_CHICA']}</p>
                <p className="text-xs text-gray-400 mt-0.5">por local · por mes + IVA</p>
              </div>
            </div>
            <div className="flex gap-3 border-t px-6 py-4">
              <button onClick={() => setModalUpgrade(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Ahora no</button>
              <Link href={`/restaurante/licencia?id=${restauranteId}`} className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors text-center">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
