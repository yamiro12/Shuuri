"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, TECNICOS, OTS } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  UserCheck, Star, Wrench, MapPin, Phone, Mail,
  PlusCircle, X, ShieldCheck, AlertTriangle, ChevronDown,
} from 'lucide-react';

// ─── MOCK: simulación de técnicos fijos por restaurante ──────────────────────
// En producción esto vendría de la BD. Para el MVP, asignamos 2-3 técnicos fijos
// a algunos restaurantes.
const FIJOS_MOCK: Record<string, string[]> = {
  R001: ['T001', 'T002'],
  R002: ['T002', 'T003'],
  R003: ['T001', 'T003'],
  R006: ['T002'],
  R010: ['T001', 'T002', 'T003'],
};

const CERT_STATUS_CLS: Record<string, string> = {
  vigente:    'bg-green-100 text-green-700',
  por_vencer: 'bg-yellow-100 text-yellow-700',
  vencida:    'bg-red-100 text-red-700',
};

const CERT_STATUS_LABEL: Record<string, string> = {
  vigente:    'Certificado',
  por_vencer: 'Por vencer',
  vencida:    'Vencido',
};

export default function TecnicosFijosPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const fijoIds    = FIJOS_MOCK[restauranteId] ?? [];
  const [fijos, setFijos] = useState<string[]>(fijoIds);

  const tecnicosFijos = TECNICOS.filter(t => fijos.includes(t.id));

  // Filter state
  const [filtroRubro,  setFiltroRubro]  = useState<Rubro | 'todos'>('todos');
  const [filtroActivo, setFiltroActivo] = useState<'todos' | 'activos' | 'bloqueados'>('todos');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [searchAdd,    setSearchAdd]    = useState('');

  const filtered = useMemo(() => {
    let list = tecnicosFijos;
    if (filtroRubro !== 'todos')          list = list.filter(t => t.rubros.includes(filtroRubro));
    if (filtroActivo === 'activos')        list = list.filter(t => !t.bloqueado);
    if (filtroActivo === 'bloqueados')     list = list.filter(t =>  t.bloqueado);
    return list;
  }, [tecnicosFijos, filtroRubro, filtroActivo]);

  // Candidates to add (not already fijos)
  const candidates = useMemo(() =>
    TECNICOS.filter(t =>
      !fijos.includes(t.id) &&
      (searchAdd === '' || t.nombre.toLowerCase().includes(searchAdd.toLowerCase()) || t.rubros.some(r => RUBRO_LABELS[r].toLowerCase().includes(searchAdd.toLowerCase())))
    ), [fijos, searchAdd]);

  function removeFijo(id: string) {
    setFijos(prev => prev.filter(f => f !== id));
  }

  function addFijo(id: string) {
    setFijos(prev => [...prev, id]);
    setShowAddPanel(false);
    setSearchAdd('');
  }

  // OTs completadas por este restaurante con un técnico dado
  function otsConRestaurante(tecnicoId: string) {
    return OTS.filter(ot => ot.restauranteId === restauranteId && ot.tecnicoId === tecnicoId).length;
  }

  // Rubros cubiertos activos (not bloqueado)
  const rubrosCubiertos = useMemo(() => {
    const set = new Set<Rubro>();
    tecnicosFijos.filter(t => !t.bloqueado).forEach(t => t.rubros.forEach(r => set.add(r)));
    return set;
  }, [tecnicosFijos]);

  const rubrosFaltantes = TODOS_LOS_RUBROS.filter(r => !rubrosCubiertos.has(r));

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-5xl">

          {/* ── HEADER ── */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D] flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-[#2698D1]" />
                Mis Técnicos Fijos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {tecnicosFijos.length} técnico{tecnicosFijos.length !== 1 ? 's' : ''} asignado{tecnicosFijos.length !== 1 ? 's' : ''} ·{' '}
                {rubrosCubiertos.size} rubro{rubrosCubiertos.size !== 1 ? 's' : ''} cubierto{rubrosCubiertos.size !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowAddPanel(true)}
              className="flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2698D1] transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar técnico
            </button>
          </div>

          {/* ── COBERTURA ── */}
          {rubrosFaltantes.length > 0 && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0D0D]">Rubros sin cobertura fija</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {rubrosFaltantes.map(r => (
                      <span key={r} className="rounded-full bg-white border border-yellow-200 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        {RUBRO_LABELS[r]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FILTERS ── */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {/* Rubro selector */}
            <div className="relative">
              <select
                value={filtroRubro}
                onChange={e => setFiltroRubro(e.target.value as Rubro | 'todos')}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-gray-700 focus:border-[#2698D1] focus:outline-none"
              >
                <option value="todos">Todos los rubros</option>
                {TODOS_LOS_RUBROS.map(r => (
                  <option key={r} value={r}>{RUBRO_LABELS[r]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Estado */}
            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
              {([
                { key: 'todos',     label: 'Todos' },
                { key: 'activos',   label: 'Activos' },
                { key: 'bloqueados',label: 'Bloqueados' },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltroActivo(f.key)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors border-r last:border-r-0 ${
                    filtroActivo === f.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── LIST ── */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center py-16 text-gray-400">
              <UserCheck className="h-10 w-10 mb-3 opacity-20" />
              <p className="font-medium">Sin técnicos para este filtro</p>
              <p className="text-sm mt-1">Cambiá el filtro o agregá un técnico fijo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(t => (
                <div
                  key={t.id}
                  className={`rounded-xl border bg-white shadow-sm p-5 transition-all ${t.bloqueado ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${t.bloqueado ? 'bg-gray-400' : 'bg-[#2698D1]'}`}>
                      {t.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-[#0D0D0D]">{t.nombre}</h2>
                        <span className="text-xs text-gray-400">{t.id}</span>
                        {t.bloqueado && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Bloqueado</span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${CERT_STATUS_CLS[t.certStatusGlobal]}`}>
                          <ShieldCheck className="inline h-2.5 w-2.5 mr-0.5" />
                          {CERT_STATUS_LABEL[t.certStatusGlobal]}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" /> {t.zona}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" /> {t.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" /> {t.email}
                        </span>
                      </div>

                      {/* Rubros */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {t.rubros.map(r => (
                          <span
                            key={r}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              t.bloqueadoRubros.includes(r)
                                ? 'bg-red-50 text-red-500 line-through'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {RUBRO_LABELS[r]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Score + stats + remove */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-sm font-black text-[#0D0D0D]">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {t.score.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Wrench className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-[#0D0D0D]">{t.otsCompletadas}</span> OTs totales
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserCheck className="h-3 w-3 text-[#2698D1]" />
                        <span className="font-semibold text-[#0D0D0D]">{otsConRestaurante(t.id)}</span> con vos
                      </div>
                      <button
                        onClick={() => removeFijo(t.id)}
                        title="Quitar técnico fijo"
                        className="mt-1 rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* ── ADD PANEL ── */}
      {showAddPanel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAddPanel(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-[#0D0D0D]">Agregar técnico fijo</h2>
              <button onClick={() => setShowAddPanel(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-100">
              <input
                type="text"
                value={searchAdd}
                onChange={e => setSearchAdd(e.target.value)}
                placeholder="Buscar por nombre o rubro..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#0D0D0D] placeholder-gray-400 focus:border-[#2698D1] focus:outline-none focus:ring-1 focus:ring-[#2698D1]/30"
                autoFocus
              />
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {candidates.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">Sin resultados</div>
              ) : (
                candidates.map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-xs font-black text-white">
                      {t.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0D0D0D]">{t.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{t.rubros.map(r => RUBRO_LABELS[r]).join(' · ')}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-xs font-bold text-[#0D0D0D]">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {t.score.toFixed(1)}
                      </div>
                      <button
                        onClick={() => addFijo(t.id)}
                        className="rounded-lg bg-[#0D0D0D] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2698D1] transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
