"use client";
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, EQUIPOS, OTS } from '@/data/mock';
import type { LocalRestaurante } from '@/types/shuuri';
import {
  Building2, MapPin, Phone, User, ArrowLeft, Wrench,
  ClipboardList, Pencil, CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react';

const ESTADO_OT: Record<string, { label: string; cls: string }> = {
  abierta:     { label: 'Abierta',      cls: 'bg-yellow-100 text-yellow-700' },
  asignada:    { label: 'Asignada',     cls: 'bg-blue-100 text-blue-700' },
  en_progreso: { label: 'En progreso',  cls: 'bg-purple-100 text-purple-700' },
  cerrada:     { label: 'Cerrada',      cls: 'bg-green-100 text-green-700' },
  cancelada:   { label: 'Cancelada',    cls: 'bg-gray-100 text-gray-500' },
};

export default function SucursalDetallePage() {
  const params        = useParams();
  const searchParams  = useSearchParams();
  const sucursalId    = params.id as string;
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  // Resolve sucursal data
  const sucursal: LocalRestaurante | undefined =
    restaurante.locales?.find(l => l.id === sucursalId) ??
    (sucursalId === restaurante.id
      ? { id: restaurante.id, nombre: restaurante.nombre, direccion: restaurante.direccion, zona: restaurante.zona, contactoNombre: restaurante.contactoNombre, contactoTel: restaurante.telefono }
      : undefined);

  const equipos = EQUIPOS.filter(e => e.restauranteId === restauranteId);
  const ots     = OTS.filter(ot => ot.restauranteId === restauranteId).slice(0, 8);

  const [editMode, setEditMode] = useState(false);

  if (!sucursal) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FA]">
        <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <div className="flex-1 sidebar-push">
          <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4 text-gray-500">
            <Building2 className="h-12 w-12 opacity-20" />
            <p className="font-semibold">Sucursal no encontrada</p>
            <Link href={`/restaurante/sucursales?id=${restauranteId}`} className="text-sm text-[#2698D1] hover:underline">
              ← Volver a Mis Sucursales
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-4xl">

          {/* ── BACK + TITLE ── */}
          <div className="mb-6">
            <Link
              href={`/restaurante/sucursales?id=${restauranteId}`}
              className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D0D0D] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Mis Sucursales
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D] flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-[#2698D1]" />
                  {sucursal.nombre}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {sucursal.direccion}
                </p>
              </div>
              <button
                onClick={() => setEditMode(e => !e)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  editMode
                    ? 'border-[#2698D1] bg-[#2698D1] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {editMode ? <CheckCircle2 className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {editMode ? 'Guardar' : 'Editar'}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* ── INFO CARD ── */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Datos del local</h2>
                <div className="space-y-3">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Zona</p>
                    {editMode
                      ? <input defaultValue={sucursal.zona} className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-[#2698D1] focus:outline-none" />
                      : <p className="text-sm font-medium text-[#0D0D0D]">{sucursal.zona}</p>
                    }
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Dirección</p>
                    {editMode
                      ? <input defaultValue={sucursal.direccion} className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-[#2698D1] focus:outline-none" />
                      : <p className="text-sm font-medium text-[#0D0D0D]">{sucursal.direccion}</p>
                    }
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">Contacto operativo</p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                      <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      {editMode
                        ? <input defaultValue={sucursal.contactoNombre ?? sucursal.contactoOperativoNombre ?? ''} className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-sm focus:border-[#2698D1] focus:outline-none" />
                        : <span>{sucursal.contactoNombre ?? sucursal.contactoOperativoNombre ?? '—'}</span>
                      }
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      {editMode
                        ? <input defaultValue={sucursal.contactoTel ?? sucursal.contactoOperativoTel ?? ''} className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-sm focus:border-[#2698D1] focus:outline-none" />
                        : <span>{sucursal.contactoTel ?? sucursal.contactoOperativoTel ?? '—'}</span>
                      }
                    </div>
                  </div>

                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                  <p className="text-2xl font-black text-[#0D0D0D]">{equipos.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                    <Wrench className="h-3 w-3" /> Equipos
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                  <p className="text-2xl font-black text-[#0D0D0D]">{ots.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                    <ClipboardList className="h-3 w-3" /> OTs totales
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Equipos */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-[#2698D1]" /> Equipos
                  </h2>
                  <Link
                    href={`/restaurante/equipos?id=${restauranteId}`}
                    className="text-xs text-[#2698D1] font-semibold hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>
                {equipos.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">Sin equipos registrados</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {equipos.slice(0, 5).map(eq => (
                      <div key={eq.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Wrench className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0D0D0D] truncate">{eq.marca} {eq.modelo}</p>
                          <p className="text-xs text-gray-400 truncate">{eq.tipo} · {eq.rubro}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          eq.estado === 'operativo' ? 'bg-green-100 text-green-700'
                          : eq.estado === 'en_servicio' ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-500'
                        }`}>
                          {eq.estado === 'operativo' ? 'Operativo' : eq.estado === 'en_servicio' ? 'En servicio' : 'Fuera de servicio'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* OTs recientes */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#2698D1]" /> OTs recientes
                  </h2>
                  <Link
                    href={`/restaurante/ots?id=${restauranteId}`}
                    className="text-xs text-[#2698D1] font-semibold hover:underline"
                  >
                    Ver todas
                  </Link>
                </div>
                {ots.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">Sin órdenes de trabajo</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {ots.map(ot => {
                      const cfg = ESTADO_OT[ot.estado] ?? { label: ot.estado, cls: 'bg-gray-100 text-gray-500' };
                      return (
                        <Link
                          key={ot.id}
                          href={`/restaurante/ots/${ot.id}?id=${restauranteId}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <ClipboardList className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#0D0D0D] truncate">{ot.descripcionFalla ?? `OT ${ot.id}`}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(ot.fechaCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
