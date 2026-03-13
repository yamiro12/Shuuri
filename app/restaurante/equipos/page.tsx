'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Thermometer, Flame, Wind, Coffee, Wrench, Zap,
  Droplets, ShieldCheck, Cpu, ChevronRight, Plus,
  AlertTriangle, CheckCircle, Clock, XCircle,
  Calendar, Package, BarChart2, X,
} from 'lucide-react';
import { EQUIPOS, getOTsByRestaurante, RESTAURANTES } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Equipo, Rubro } from '@/types/shuuri';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';


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
    case 'operativo':
      return { label: 'Operativo', icon: <CheckCircle className="w-3.5 h-3.5" />, class: 'text-green-700 bg-green-50' };
    case 'en_servicio':
      return { label: 'En servicio', icon: <Clock className="w-3.5 h-3.5" />, class: 'text-amber-700 bg-amber-50' };
    case 'fuera_de_servicio':
      return { label: 'Fuera de servicio', icon: <XCircle className="w-3.5 h-3.5" />, class: 'text-red-700 bg-red-50' };
  }
}

function getPreventivoStatus(fecha?: string) {
  if (!fecha) return null;
  const diff = new Date(fecha).getTime() - Date.now();
  const days = Math.round(diff / 86400000);
  if (days < 0) return { label: `Vencido hace ${Math.abs(days)}d`, class: 'text-red-600', urgent: true };
  if (days <= 30) return { label: `Vence en ${days}d`, class: 'text-amber-600', urgent: true };
  return { label: `En ${days}d`, class: 'text-gray-500', urgent: false };
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EQUIPO_VACIO = { tipo: '', marca: '', modelo: '', rubro: 'frio_comercial' as Rubro };

export default function EquiposPage() {
  const searchParams = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const RESTAURANTE = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [equiposLocal, setEquiposLocal] = useState<Equipo[]>(
    () => EQUIPOS.filter(e => e.restauranteId === restauranteId)
  );
  const [modalOpen,   setModalOpen]   = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState(EQUIPO_VACIO);
  const [toast,       setToast]       = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const allOTs = getOTsByRestaurante(restauranteId);

  const filtrados = filtroEstado === 'todos'
    ? equiposLocal
    : equiposLocal.filter(e => e.estado === filtroEstado);

  const counts = {
    todos: equiposLocal.length,
    operativo: equiposLocal.filter(e => e.estado === 'operativo').length,
    en_servicio: equiposLocal.filter(e => e.estado === 'en_servicio').length,
    fuera_de_servicio: equiposLocal.filter(e => e.estado === 'fuera_de_servicio').length,
  };

  const preventivosUrgentes = equiposLocal.filter(e => {
    if (!e.proximoPreventivo) return false;
    const diff = new Date(e.proximoPreventivo).getTime() - Date.now();
    return diff < 30 * 86400000;
  }).length;

  function handleAgregarEquipo() {
    if (!nuevoEquipo.tipo || !nuevoEquipo.marca) return;
    const nuevo: Equipo = {
      id:              `EQ-NEW-${Date.now()}`,
      restauranteId:   restauranteId,
      tipo:            nuevoEquipo.tipo,
      marca:           nuevoEquipo.marca,
      modelo:          nuevoEquipo.modelo,
      serie:           '—',
      anioInstalacion: new Date().getFullYear(),
      rubro:           nuevoEquipo.rubro,
      garantiaVigente: false,
      otIds:           [],
      estado:          'operativo',
    };
    setEquiposLocal(prev => [...prev, nuevo]);
    setNuevoEquipo(EQUIPO_VACIO);
    setModalOpen(false);
    showToast(`Equipo "${nuevo.tipo} ${nuevo.marca}" agregado`);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={RESTAURANTE.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={RESTAURANTE.nombre} />
        <main className="p-8">
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mis equipos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {equiposLocal.length} equipos registrados · {allOTs.length} OTs históricas
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar equipo
        </button>
      </div>

      {/* Alert preventivos */}
      {preventivosUrgentes > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-medium">{preventivosUrgentes} equipo{preventivosUrgentes > 1 ? 's' : ''}</span> con preventivo próximo o vencido.
          </p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'operativo', label: 'Operativos' },
          { key: 'en_servicio', label: 'En servicio' },
          { key: 'fuera_de_servicio', label: 'Fuera de servicio' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFiltroEstado(f.key)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              filtroEstado === f.key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              filtroEstado === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[f.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtrados.map(equipo => {
          const estadoConf = getEstadoConfig(equipo.estado);
          const prevStatus = getPreventivoStatus(equipo.proximoPreventivo);
          const otCount = allOTs.filter(o => o.equipoId === equipo.id).length;
          const rubroColor = RUBRO_COLOR[equipo.rubro] || 'bg-gray-50 text-gray-700 border-gray-200';

          return (
            <Link
              key={equipo.id}
              href={`/restaurante/equipos/${equipo.id}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${rubroColor}`}>
                      {RUBRO_ICON[equipo.rubro]}
                      {RUBRO_LABELS[equipo.rubro]}
                    </span>
                    {equipo.garantiaVigente && (
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                        Garantía
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">{equipo.tipo}</h3>
                  <p className="text-sm text-gray-500">{equipo.marca} {equipo.modelo}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" />
              </div>

              {/* Info row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">N° de serie</p>
                  <p className="text-xs font-mono text-gray-600 truncate">{equipo.serie}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Año instalación</p>
                  <p className="text-xs text-gray-600">{equipo.anioInstalacion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">OTs históricas</p>
                  <p className="text-xs text-gray-600">{otCount}</p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${estadoConf.class}`}>
                    {estadoConf.icon}
                    {estadoConf.label}
                  </span>
                </div>
                {prevStatus && (
                  <div className={`flex items-center gap-1 text-xs ${prevStatus.class}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Prev. {prevStatus.label}</span>
                    {prevStatus.urgent && <AlertTriangle className="w-3 h-3" />}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay equipos en este estado.</p>
        </div>
      )}

      {/* Stats bottom */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        {[
          {
            label: 'Último servicio más antiguo',
            value: (() => {
              const sorted = equiposLocal
                .filter(e => e.fechaUltimoServicio)
                .sort((a, b) => new Date(a.fechaUltimoServicio!).getTime() - new Date(b.fechaUltimoServicio!).getTime());
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
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              {s.icon}
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR EQUIPO */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h3 className="font-black text-[#0D0D0D]">Agregar equipo</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Tipo de equipo *</label>
                <input
                  value={nuevoEquipo.tipo}
                  onChange={e => setNuevoEquipo(p => ({ ...p, tipo: e.target.value }))}
                  placeholder="Ej: Cámara frigorífica"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Marca *</label>
                <input
                  value={nuevoEquipo.marca}
                  onChange={e => setNuevoEquipo(p => ({ ...p, marca: e.target.value }))}
                  placeholder="Ej: Frider"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Modelo</label>
                <input
                  value={nuevoEquipo.modelo}
                  onChange={e => setNuevoEquipo(p => ({ ...p, modelo: e.target.value }))}
                  placeholder="Ej: CF-300"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Rubro</label>
                <select
                  value={nuevoEquipo.rubro}
                  onChange={e => setNuevoEquipo(p => ({ ...p, rubro: e.target.value as Rubro }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors bg-white"
                >
                  {TODOS_LOS_RUBROS.map(r => (
                    <option key={r} value={r}>{RUBRO_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarEquipo}
                disabled={!nuevoEquipo.tipo || !nuevoEquipo.marca}
                className="flex-1 rounded-lg bg-gray-900 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agregar equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
