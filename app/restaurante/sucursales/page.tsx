"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, EQUIPOS, OTS } from '@/data/mock';
import type { LocalRestaurante } from '@/types/shuuri';
import {
  Building2, MapPin, Phone, User, PlusCircle,
  Wrench, ChevronRight, AlertCircle, Zap,
} from 'lucide-react';

const TIER_LABEL: Record<string, string> = {
  FREEMIUM:     'Freemium',
  CADENA_CHICA: 'Cadena Chica',
  CADENA_GRANDE:'Cadena Grande',
};

export default function SucursalesPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  // Build sucursales list: cadenas have locales[], freemium uses restaurante itself
  const sucursales: LocalRestaurante[] = restaurante.locales?.length
    ? restaurante.locales
    : [{
        id:                    restaurante.id,
        nombre:                restaurante.nombre,
        direccion:             restaurante.direccion,
        zona:                  restaurante.zona,
        contactoNombre:        restaurante.contactoNombre,
        contactoTel:           restaurante.telefono,
      }];

  const isFreemium = restaurante.tier === 'FREEMIUM';

  // UI-only: modal state
  const [showAddModal, setShowAddModal] = useState(false);

  function equiposCount(localId: string) {
    // For freemium single sucursal the localId === restauranteId
    if (localId === restaurante.id) return EQUIPOS.filter(e => e.restauranteId === restauranteId).length;
    return EQUIPOS.filter(e => e.restauranteId === restauranteId).length; // mock: todos los equipos del restaurante
  }

  function otsActivasCount(localId: string) {
    return OTS.filter(
      ot => ot.restauranteId === restauranteId && ['abierta', 'asignada', 'en_progreso'].includes(ot.estado)
    ).length;
  }

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
                <Building2 className="h-6 w-6 text-[#2698D1]" />
                Mis Sucursales
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {sucursales.length} sucursal{sucursales.length !== 1 ? 'es' : ''} ·{' '}
                <span className={`font-semibold ${isFreemium ? 'text-gray-500' : 'text-[#2698D1]'}`}>
                  {TIER_LABEL[restaurante.tier]}
                </span>
              </p>
            </div>

            {!isFreemium && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2698D1] transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Agregar sucursal
              </button>
            )}
          </div>

          {/* ── FREEMIUM BANNER ── */}
          {isFreemium && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#2698D1] mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D0D0D]">Plan Freemium: 1 sucursal incluida</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Con Cadena Chica podés gestionar hasta 2 sucursales. Con Cadena Grande, ilimitadas.
                </p>
              </div>
              <Link
                href={`/restaurante/licencia?id=${restauranteId}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#2698D1] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1d7ab8] transition-colors"
              >
                <Zap className="h-3.5 w-3.5" />
                Mejorar plan
              </Link>
            </div>
          )}

          {/* ── GRID ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sucursales.map(s => (
              <Link
                key={s.id}
                href={`/restaurante/sucursales/${s.id}?id=${restauranteId}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[#2698D1]/40 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Building2 className="h-5 w-5 text-[#2698D1]" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] transition-colors" />
                </div>

                <h2 className="font-bold text-[#0D0D0D] text-sm mb-1 leading-tight">{s.nombre}</h2>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-start gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gray-400" />
                    <span className="leading-tight">{s.direccion}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">{s.zona}</span>
                  </div>
                  {(s.contactoNombre ?? s.contactoOperativoNombre) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span>{s.contactoNombre ?? s.contactoOperativoNombre}</span>
                    </div>
                  )}
                  {(s.contactoTel ?? s.contactoOperativoTel) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span>{s.contactoTel ?? s.contactoOperativoTel}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Wrench className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-semibold text-[#0D0D0D]">{equiposCount(s.id)}</span> equipos
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    <span className="font-semibold text-[#0D0D0D]">{otsActivasCount(s.id)}</span> OTs activas
                  </div>
                </div>
              </Link>
            ))}

            {/* Add card — only for paid tiers */}
            {!isFreemium && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 text-gray-400 transition-all hover:border-[#2698D1]/40 hover:text-[#2698D1]"
              >
                <PlusCircle className="h-8 w-8" />
                <span className="text-sm font-semibold">Nueva sucursal</span>
              </button>
            )}
          </div>

        </main>
      </div>

      {/* ── MODAL ADD (UI placeholder) ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-black text-[#0D0D0D] mb-1">Nueva sucursal</h2>
            <p className="text-sm text-gray-500 mb-5">Completá los datos del nuevo local.</p>

            <div className="space-y-3">
              {[
                { label: 'Nombre del local', placeholder: 'Ej: Sucursal Palermo' },
                { label: 'Dirección',         placeholder: 'Av. Santa Fe 1234, CABA' },
                { label: 'Zona / Barrio',     placeholder: 'Palermo' },
                { label: 'Contacto operativo',placeholder: 'Nombre y apellido' },
                { label: 'Teléfono',          placeholder: '11-XXXX-XXXX' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#0D0D0D] placeholder-gray-400 focus:border-[#2698D1] focus:outline-none focus:ring-1 focus:ring-[#2698D1]/30"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl bg-[#0D0D0D] py-2.5 text-sm font-semibold text-white hover:bg-[#2698D1] transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
