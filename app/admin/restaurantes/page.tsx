"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { RESTAURANTES, getOTsByRestaurante, getEquiposByRestaurante } from '@/data/mock';
import { Building2, Search, PlusCircle, ChevronRight, MapPin, Phone, Layers } from 'lucide-react';

const TIER_COLOR: Record<string, string> = {
  FREEMIUM: 'bg-gray-100 text-gray-700',
  CADENA_CHICA: 'bg-blue-100 text-blue-700',
  CADENA_GRANDE: 'bg-purple-100 text-purple-700',
};

export default function AdminRestaurantes() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTier, setFiltroTier] = useState<'todos' | 'FREEMIUM' | 'CADENA_CHICA' | 'CADENA_GRANDE'>('todos');

  const filtrados = RESTAURANTES.filter(r => {
    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (!r.nombre.toLowerCase().includes(q) && !r.zona.toLowerCase().includes(q)) return false;
    }
    if (filtroTier !== 'todos' && r.tier !== filtroTier) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Restaurantes</h1>
              <p className="text-gray-500">{filtrados.length} de {RESTAURANTES.length} establecimientos</p>
            </div>
            <Link href="/restaurante/onboarding"
              className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90">
              <PlusCircle className="h-4 w-4" /> Alta restaurante
            </Link>
          </div>

          {/* FILTROS */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o zona..." className="text-sm outline-none w-52" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
              {([
                { key: 'todos', label: 'Todos' },
                { key: 'FREEMIUM', label: 'Freemium' },
                { key: 'CADENA_CHICA', label: 'Cadena chica' },
                { key: 'CADENA_GRANDE', label: 'Cadena grande' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setFiltroTier(tab.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    filtroTier === tab.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPIs RÁPIDOS */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              { label: 'Total', value: RESTAURANTES.length, color: 'text-gray-700' },
              { label: 'Freemium', value: RESTAURANTES.filter(r => r.tier === 'FREEMIUM').length, color: 'text-gray-600' },
              { label: 'Cadena chica', value: RESTAURANTES.filter(r => r.tier === 'CADENA_CHICA').length, color: 'text-blue-600' },
              { label: 'Cadena grande', value: RESTAURANTES.filter(r => r.tier === 'CADENA_GRANDE').length, color: 'text-purple-600' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-4">
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* TABLA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Restaurante</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Contacto</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Zona</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Locales</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">OTs activas</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wide">Equipos</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                      Sin resultados para la búsqueda
                    </td>
                  </tr>
                ) : filtrados.map(r => {
                  const ots = getOTsByRestaurante(r.id);
                  const otsActivas = ots.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado));
                  const equipos = getEquiposByRestaurante(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0D0D0D]">{r.nombre}</p>
                            <p className="text-xs text-gray-400">{r.razonSocial}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{r.contactoNombre}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />{r.telefono}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />{r.zona}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TIER_COLOR[r.tier ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                          {r.tier}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 text-center">{r.cantidadLocales}</td>
                      <td className="px-4 py-4">
                        {otsActivas.length > 0 ? (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                            {otsActivas.length} activas
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Layers className="h-3.5 w-3.5 text-gray-400" />{equipos.length}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/restaurantes/${r.id}`}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors whitespace-nowrap">
                          Ver legajo <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
