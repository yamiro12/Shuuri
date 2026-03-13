"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Wrench, Search, ChevronRight, MapPin, Star,
  AlertTriangle, CheckCircle2, XCircle, ShieldOff,
} from 'lucide-react';

const CERT_COLOR: Record<string, string> = {
  vigente:    'bg-green-100 text-green-700',
  por_vencer: 'bg-amber-100 text-amber-700',
  vencida:    'bg-red-100 text-red-700',
};
const CERT_LABEL: Record<string, string> = {
  vigente:    'Vigente',
  por_vencer: 'Por vencer',
  vencida:    'Vencida',
};

export default function AdminTecnicos() {
  const [busqueda,    setBusqueda]    = useState('');
  const [filtroCert,  setFiltroCert]  = useState<'todos' | 'vigente' | 'por_vencer' | 'vencida'>('todos');
  const [filtroBloque, setFiltroBloque] = useState<'todos' | 'activo' | 'bloqueado'>('todos');

  const filtrados = TECNICOS.filter(t => {
    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (!t.nombre.toLowerCase().includes(q) && !t.zona.toLowerCase().includes(q)) return false;
    }
    if (filtroCert !== 'todos' && t.certStatusGlobal !== filtroCert) return false;
    if (filtroBloque === 'activo'    && t.bloqueado)  return false;
    if (filtroBloque === 'bloqueado' && !t.bloqueado) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Técnicos</h1>
            <p className="text-gray-500">{filtrados.length} de {TECNICOS.length} técnicos</p>
          </div>

          {/* KPIs RÁPIDOS */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              { label: 'Total',           value: TECNICOS.length,                                            color: 'text-gray-700' },
              { label: 'Activos',         value: TECNICOS.filter(t => !t.bloqueado).length,                  color: 'text-green-600' },
              { label: 'Con cert. alerta',value: TECNICOS.filter(t => t.certStatusGlobal !== 'vigente').length, color: 'text-amber-600' },
              { label: 'Bloqueados',      value: TECNICOS.filter(t => t.bloqueado).length,                   color: 'text-red-500' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-4">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* FILTROS */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o zona..." className="text-sm outline-none w-52" />
            </div>

            <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
              {([
                { key: 'todos',     label: 'Todos' },
                { key: 'vigente',   label: 'Vigente' },
                { key: 'por_vencer',label: 'Por vencer' },
                { key: 'vencida',   label: 'Vencida' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setFiltroCert(tab.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    filtroCert === tab.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{tab.label}</button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
              {([
                { key: 'todos',     label: 'Todos' },
                { key: 'activo',    label: 'Activos' },
                { key: 'bloqueado', label: 'Bloqueados' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setFiltroBloque(tab.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    filtroBloque === tab.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{tab.label}</button>
              ))}
            </div>
          </div>

          {/* TABLA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Técnico</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Zona</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Rubros</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Certificaciones</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                      Sin resultados para la búsqueda
                    </td>
                  </tr>
                ) : filtrados.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0D0D0D]">{t.nombre}</p>
                          <p className="text-xs text-gray-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />{t.zona}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {t.rubros.slice(0, 2).map(r => (
                          <span key={r} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {RUBRO_LABELS[r as Rubro]}
                          </span>
                        ))}
                        {t.rubros.length > 2 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                            +{t.rubros.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {t.certStatusGlobal !== 'vigente' && (
                          <AlertTriangle className={`h-4 w-4 ${t.certStatusGlobal === 'vencida' ? 'text-red-500' : 'text-amber-500'}`} />
                        )}
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${CERT_COLOR[t.certStatusGlobal] ?? 'bg-gray-100 text-gray-600'}`}>
                          {CERT_LABEL[t.certStatusGlobal] ?? t.certStatusGlobal}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-[#0D0D0D]">{t.score}</span>
                        <span className="text-xs text-gray-400">({t.otsCompletadas} OTs)</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {t.bloqueado ? (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                          <ShieldOff className="h-3 w-3" /> Bloqueado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          <CheckCircle2 className="h-3 w-3" /> Activo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/tecnicos/${t.id}`}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors whitespace-nowrap">
                        Ver legajo <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
