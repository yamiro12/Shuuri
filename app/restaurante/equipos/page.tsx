'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Thermometer, Flame, Wind, Coffee, Wrench, Zap,
  Droplets, ShieldCheck, Cpu, ChevronRight, Plus,
  AlertTriangle, CheckCircle, Clock, XCircle,
  Calendar, Package, BarChart2, X, LayoutGrid,
  List, Layers, ShoppingBag, RotateCcw,
} from 'lucide-react';
import { EQUIPOS, getOTsByRestaurante, RESTAURANTES } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Equipo, Rubro } from '@/types/shuuri';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const RUBRO_ICON: Record<string, React.ReactNode> = {
  frio_comercial:          <Thermometer className="w-4 h-4" />,
  calor_comercial:         <Flame className="w-4 h-4" />,
  gas_combustion:          <Flame className="w-4 h-4" />,
  maquinaria_preparacion:  <Wrench className="w-4 h-4" />,
  lavado_comercial:        <Droplets className="w-4 h-4" />,
  cafe_bebidas:            <Coffee className="w-4 h-4" />,
  pos_it:                  <Cpu className="w-4 h-4" />,
  seguridad_cctv:          <ShieldCheck className="w-4 h-4" />,
  electricidad_tableros:   <Zap className="w-4 h-4" />,
  plomeria_agua:           <Droplets className="w-4 h-4" />,
  campanas_extraccion:     <Wind className="w-4 h-4" />,
  infraestructura_edilicia:<Package className="w-4 h-4" />,
  automatizacion_iot:      <Cpu className="w-4 h-4" />,
  incendio_seguridad:      <ShieldCheck className="w-4 h-4" />,
};

const RUBRO_COLOR: Record<string, string> = {
  frio_comercial:          'bg-blue-50 text-blue-700 border-blue-200',
  calor_comercial:         'bg-orange-50 text-orange-700 border-orange-200',
  gas_combustion:          'bg-red-50 text-red-700 border-red-200',
  maquinaria_preparacion:  'bg-gray-50 text-gray-700 border-gray-200',
  lavado_comercial:        'bg-cyan-50 text-cyan-700 border-cyan-200',
  cafe_bebidas:            'bg-amber-50 text-amber-700 border-amber-200',
  pos_it:                  'bg-purple-50 text-purple-700 border-purple-200',
  seguridad_cctv:          'bg-green-50 text-green-700 border-green-200',
  electricidad_tableros:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  plomeria_agua:           'bg-teal-50 text-teal-700 border-teal-200',
  campanas_extraccion:     'bg-slate-50 text-slate-700 border-slate-200',
  infraestructura_edilicia:'bg-stone-50 text-stone-700 border-stone-200',
  automatizacion_iot:      'bg-violet-50 text-violet-700 border-violet-200',
  incendio_seguridad:      'bg-rose-50 text-rose-700 border-rose-200',
};

function getEstadoConfig(estado: Equipo['estado']) {
  switch (estado) {
    case 'operativo':      return { label: 'Operativo',        icon: <CheckCircle className="w-3.5 h-3.5" />, cls: 'text-green-700 bg-green-50' };
    case 'en_servicio':    return { label: 'En servicio',      icon: <Clock       className="w-3.5 h-3.5" />, cls: 'text-amber-700 bg-amber-50' };
    case 'fuera_de_servicio': return { label: 'Fuera de servicio', icon: <XCircle className="w-3.5 h-3.5" />, cls: 'text-red-700 bg-red-50' };
  }
}

function getPreventivoStatus(fecha?: string) {
  if (!fecha) return null;
  const days = Math.round((new Date(fecha).getTime() - Date.now()) / 86400000);
  if (days < 0)   return { label: `Vencido hace ${Math.abs(days)}d`, cls: 'text-red-600',   urgent: true };
  if (days <= 30) return { label: `Vence en ${days}d`,              cls: 'text-amber-600', urgent: true };
  return           { label: `En ${days}d`,                           cls: 'text-gray-500',  urgent: false };
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EQUIPO_VACIO = { tipo: '', marca: '', modelo: '', rubro: 'frio_comercial' as Rubro };
type Vista = 'grid' | 'lista' | 'rubro';

// ─── CARD GRID ────────────────────────────────────────────────────────────────

function EquipoCard({ equipo, restauranteId, otCount }: { equipo: Equipo; restauranteId: string; otCount: number }) {
  const estadoConf  = getEstadoConfig(equipo.estado);
  const prevStatus  = getPreventivoStatus(equipo.proximoPreventivo);
  const rubroColor  = RUBRO_COLOR[equipo.rubro] || 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <Link
      href={`/restaurante/equipos/${equipo.id}?id=${restauranteId}`}
      className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#2698D1]/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${rubroColor}`}>
              {RUBRO_ICON[equipo.rubro]}
              {RUBRO_LABELS[equipo.rubro]}
            </span>
            {equipo.garantiaVigente && (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">Garantía</span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 truncate">{equipo.tipo}</h3>
          <p className="text-sm text-gray-500">{equipo.marca} {equipo.modelo}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2698D1] shrink-0 mt-1 transition-colors" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div><p className="text-gray-400 mb-0.5">N° serie</p><p className="font-mono text-gray-600 truncate">{equipo.serie}</p></div>
        <div><p className="text-gray-400 mb-0.5">Año</p><p className="text-gray-600">{equipo.anioInstalacion}</p></div>
        <div><p className="text-gray-400 mb-0.5">OTs</p><p className="text-gray-600">{otCount}</p></div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${estadoConf.cls}`}>
          {estadoConf.icon} {estadoConf.label}
        </span>
        {prevStatus && (
          <div className={`flex items-center gap-1 text-xs ${prevStatus.cls}`}>
            <Calendar className="w-3.5 h-3.5" />
            Prev. {prevStatus.label}
            {prevStatus.urgent && <AlertTriangle className="w-3 h-3" />}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── FILA LISTA ───────────────────────────────────────────────────────────────

function EquipoRow({ equipo, restauranteId, otCount }: { equipo: Equipo; restauranteId: string; otCount: number }) {
  const estadoConf = getEstadoConfig(equipo.estado);
  const prevStatus = getPreventivoStatus(equipo.proximoPreventivo);
  return (
    <Link
      href={`/restaurante/equipos/${equipo.id}?id=${restauranteId}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {RUBRO_ICON[equipo.rubro]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0D0D0D] truncate">{equipo.tipo}</p>
        <p className="text-xs text-gray-400">{equipo.marca} {equipo.modelo} · Serie {equipo.serie}</p>
      </div>
      <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${estadoConf.cls}`}>
        {estadoConf.icon} {estadoConf.label}
      </span>
      {prevStatus && (
        <span className={`hidden md:flex items-center gap-1 text-xs ${prevStatus.cls}`}>
          <Calendar className="w-3 h-3" /> {prevStatus.label}
        </span>
      )}
      <span className="text-xs text-gray-400">{otCount} OTs</span>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2698D1] shrink-0 transition-colors" />
    </Link>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function EquiposPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const RESTAURANTE   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const [vista,        setVista]        = useState<Vista>('grid');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroRubro,  setFiltroRubro]  = useState<Rubro | 'todos'>('todos');
  const [equiposLocal, setEquiposLocal] = useState<Equipo[]>(
    () => EQUIPOS.filter(e => e.restauranteId === restauranteId)
  );
  const [modalOpen,   setModalOpen]   = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState(EQUIPO_VACIO);
  const [toast,       setToast]       = useState<string | null>(null);

  const allOTs = getOTsByRestaurante(restauranteId);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const filtrados = useMemo(() => {
    let list = equiposLocal;
    if (filtroEstado !== 'todos') list = list.filter(e => e.estado === filtroEstado);
    if (filtroRubro  !== 'todos') list = list.filter(e => e.rubro  === filtroRubro);
    return list;
  }, [equiposLocal, filtroEstado, filtroRubro]);

  const counts = {
    todos:             equiposLocal.length,
    operativo:         equiposLocal.filter(e => e.estado === 'operativo').length,
    en_servicio:       equiposLocal.filter(e => e.estado === 'en_servicio').length,
    fuera_de_servicio: equiposLocal.filter(e => e.estado === 'fuera_de_servicio').length,
  };

  const preventivosUrgentes = equiposLocal.filter(e => {
    if (!e.proximoPreventivo) return false;
    return new Date(e.proximoPreventivo).getTime() - Date.now() < 30 * 86400000;
  }).length;

  // Rubros con equipos
  const rubrosConEquipos = useMemo(() =>
    TODOS_LOS_RUBROS.filter(r => equiposLocal.some(e => e.rubro === r)),
    [equiposLocal]
  );

  // Agrupado por rubro
  const porRubro = useMemo(() =>
    rubrosConEquipos.map(r => ({
      rubro: r,
      equipos: filtrados.filter(e => e.rubro === r),
    })).filter(g => g.equipos.length > 0),
    [filtrados, rubrosConEquipos]
  );

  function handleAgregarEquipo() {
    if (!nuevoEquipo.tipo || !nuevoEquipo.marca) return;
    const nuevo: Equipo = {
      id: `EQ-NEW-${Date.now()}`, restauranteId,
      tipo: nuevoEquipo.tipo, marca: nuevoEquipo.marca, modelo: nuevoEquipo.modelo,
      serie: '—', anioInstalacion: new Date().getFullYear(),
      rubro: nuevoEquipo.rubro, garantiaVigente: false, otIds: [], estado: 'operativo',
    };
    setEquiposLocal(prev => [...prev, nuevo]);
    setNuevoEquipo(EQUIPO_VACIO);
    setModalOpen(false);
    showToast(`Equipo "${nuevo.tipo} ${nuevo.marca}" agregado`);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={RESTAURANTE.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={RESTAURANTE.nombre} actorId={restauranteId} />
        <main className="page-main">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">Mis Equipos</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {equiposLocal.length} equipos · {allOTs.length} OTs históricas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/restaurante/marketplace?id=${restauranteId}`}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#2698D1]/40 hover:text-[#2698D1] transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Marketplace
                </Link>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2698D1] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Agregar equipo
                </button>
              </div>
            </div>

            {/* ── ALERTA PREVENTIVOS ── */}
            {preventivosUrgentes > 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 flex-1">
                  <span className="font-bold">{preventivosUrgentes} equipo{preventivosUrgentes > 1 ? 's' : ''}</span>{' '}
                  con preventivo próximo o vencido.
                </p>
                <Link
                  href={`/restaurante/reportar?id=${restauranteId}`}
                  className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
                >
                  Solicitar servicio
                </Link>
              </div>
            )}

            {/* ── BOTONES COMERCIALES ── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: RotateCcw,  label: 'Plan preventivo',       desc: 'Programar mantenimientos', href: `/restaurante/reportar?id=${restauranteId}`,   cls: 'border-blue-100 bg-blue-50 hover:border-[#2698D1]/40' },
                { icon: ShoppingBag,label: 'Comprar repuestos',     desc: 'Marketplace SHUURI',       href: `/restaurante/marketplace?id=${restauranteId}`, cls: 'border-orange-100 bg-orange-50 hover:border-orange-300' },
                { icon: Wrench,     label: 'Solicitar técnico',     desc: 'Reportar una falla',       href: `/restaurante/reportar?id=${restauranteId}`,   cls: 'border-gray-100 bg-white hover:border-gray-300' },
                { icon: BarChart2,  label: 'Ver estadísticas',      desc: 'Costos y tendencias',      href: `/restaurante/estadisticas?id=${restauranteId}`, cls: 'border-gray-100 bg-white hover:border-gray-300' },
              ].map(cta => {
                const Icon = cta.icon;
                return (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all shadow-sm ${cta.cls}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0D0D0D] truncate">{cta.label}</p>
                      <p className="text-xs text-gray-400 truncate">{cta.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── FILTROS + VISTA ── */}
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Estado */}
                {[
                  { key: 'todos',             label: 'Todos' },
                  { key: 'operativo',         label: 'Operativos' },
                  { key: 'en_servicio',       label: 'En servicio' },
                  { key: 'fuera_de_servicio', label: 'Fuera de servicio' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFiltroEstado(f.key)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      filtroEstado === f.key
                        ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {f.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${filtroEstado === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {counts[f.key as keyof typeof counts]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Vista selector */}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
                {([
                  { key: 'grid',  icon: LayoutGrid, title: 'Vista cuadrícula' },
                  { key: 'lista', icon: List,        title: 'Vista lista' },
                  { key: 'rubro', icon: Layers,      title: 'Agrupar por rubro' },
                ] as const).map(v => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.key}
                      title={v.title}
                      onClick={() => setVista(v.key)}
                      className={`rounded-md p-1.5 transition-colors ${vista === v.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── CONTENIDO SEGÚN VISTA ── */}

            {/* GRID */}
            {vista === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtrados.map(eq => (
                  <EquipoCard
                    key={eq.id}
                    equipo={eq}
                    restauranteId={restauranteId}
                    otCount={allOTs.filter(o => o.equipoId === eq.id).length}
                  />
                ))}
                {filtrados.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No hay equipos en este filtro.</p>
                  </div>
                )}
              </div>
            )}

            {/* LISTA */}
            {vista === 'lista' && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {filtrados.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No hay equipos en este filtro.</p>
                  </div>
                ) : (
                  filtrados.map(eq => (
                    <EquipoRow
                      key={eq.id}
                      equipo={eq}
                      restauranteId={restauranteId}
                      otCount={allOTs.filter(o => o.equipoId === eq.id).length}
                    />
                  ))
                )}
              </div>
            )}

            {/* POR RUBRO */}
            {vista === 'rubro' && (
              <div className="space-y-4">
                {porRubro.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No hay equipos en este filtro.</p>
                  </div>
                ) : (
                  porRubro.map(({ rubro, equipos: eqs }) => {
                    const rubroColor = RUBRO_COLOR[rubro] || 'bg-gray-50 text-gray-700 border-gray-200';
                    return (
                      <div key={rubro} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${rubroColor}`}>
                            {RUBRO_ICON[rubro]}
                            {RUBRO_LABELS[rubro]}
                          </span>
                          <span className="text-xs text-gray-400">{eqs.length} equipo{eqs.length !== 1 ? 's' : ''}</span>
                        </div>
                        {eqs.map(eq => (
                          <EquipoRow
                            key={eq.id}
                            equipo={eq}
                            restauranteId={restauranteId}
                            otCount={allOTs.filter(o => o.equipoId === eq.id).length}
                          />
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── STATS BAR ── */}
            <div className="grid grid-cols-3 gap-4 pt-1">
              {[
                {
                  label: 'Último servicio más antiguo',
                  value: (() => {
                    const sorted = equiposLocal.filter(e => e.fechaUltimoServicio).sort((a, b) => new Date(a.fechaUltimoServicio!).getTime() - new Date(b.fechaUltimoServicio!).getTime());
                    return sorted[0] ? formatDate(sorted[0].fechaUltimoServicio) : '—';
                  })(),
                  icon: <Clock className="w-4 h-4 text-gray-400" />,
                },
                {
                  label: 'Equipos con preventivo urgente',
                  value: String(preventivosUrgentes),
                  icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
                },
                {
                  label: 'OTs abiertas',
                  value: String(allOTs.filter(o => !['LIQUIDADA','FACTURADA','CANCELADA'].includes(o.estado)).length),
                  icon: <BarChart2 className="w-4 h-4 text-gray-400" />,
                },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-1">{s.icon}<p className="text-xs text-gray-500">{s.label}</p></div>
                  <p className="text-lg font-black text-[#0D0D0D]">{s.value}</p>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* ── MODAL AGREGAR ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h3 className="font-black text-[#0D0D0D]">Agregar equipo</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Tipo de equipo *', key: 'tipo',   placeholder: 'Ej: Cámara frigorífica' },
                { label: 'Marca *',          key: 'marca',  placeholder: 'Ej: Frider' },
                { label: 'Modelo',           key: 'modelo', placeholder: 'Ej: CF-300' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
                  <input
                    value={nuevoEquipo[f.key as keyof typeof nuevoEquipo] as string}
                    onChange={e => setNuevoEquipo(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Rubro</label>
                <select
                  value={nuevoEquipo.rubro}
                  onChange={e => setNuevoEquipo(p => ({ ...p, rubro: e.target.value as Rubro }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors bg-white"
                >
                  {TODOS_LOS_RUBROS.map(r => <option key={r} value={r}>{RUBRO_LABELS[r]}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t px-6 py-4">
              <button onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleAgregarEquipo} disabled={!nuevoEquipo.tipo || !nuevoEquipo.marca} className="flex-1 rounded-xl bg-[#0D0D0D] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{toast}
        </div>
      )}
    </div>
  );
}
