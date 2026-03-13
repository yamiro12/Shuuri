"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, EQUIPOS } from '@/data/mock';
import {
  Building2, MapPin, Phone, Mail, Clock, User,
  Edit3, Save, X, CheckCircle2, Shield, Wrench,
  ChevronRight, FileText, AlertCircle, Camera,
} from 'lucide-react';

// ─── CAMPO EDITABLE ───────────────────────────────────────────────────────────

function CampoEditable({ label, value, editando, onChange, type = 'text', placeholder }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {editando ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
        />
      ) : (
        <p className="text-sm font-medium text-[#0D0D0D]">{value || <span className="text-gray-300 italic">Sin datos</span>}</p>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function RestaurantePerfil() {
  const searchParams = useSearchParams();
  const id           = searchParams.get('id') ?? 'R001';
  const restaurante  = RESTAURANTES.find(r => r.id === id) ?? RESTAURANTES[0];
  const misEquipos   = EQUIPOS.filter(e => e.restauranteId === restaurante.id);

  const [editando, setEditando] = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);
  const [tab,      setTab]      = useState<'datos' | 'equipos' | 'preferencias'>('datos');

  // Datos editables — inicializados desde restaurante
  const [form, setForm] = useState({
    nombre:   restaurante.nombre,
    direccion: restaurante.direccion,
    telefono: restaurante.telefono,
    email:    restaurante.email ?? '',
    contacto: restaurante.legajo?.nombreContacto ?? '',
    cargo:    restaurante.legajo?.cargoContacto ?? '',
    cuit:     restaurante.legajo?.cuit ?? '',
    horario:  restaurante.legajo?.horarioPreferido ?? '',
    notas:    restaurante.legajo?.notasAcceso ?? '',
  });

  function handleSave() {
    setEditando(false);
    setToast('Perfil actualizado correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  function handleCancel() {
    setEditando(false);
    setForm({
      nombre:   restaurante.nombre,
      direccion: restaurante.direccion,
      telefono: restaurante.telefono,
      email:    restaurante.email ?? '',
      contacto: restaurante.legajo?.nombreContacto ?? '',
      cargo:    restaurante.legajo?.cargoContacto ?? '',
      cuit:     restaurante.legajo?.cuit ?? '',
      horario:  restaurante.legajo?.horarioPreferido ?? '',
      notas:    restaurante.legajo?.notasAcceso ?? '',
    });
  }

  const tabs = [
    { key: 'datos',        label: 'Datos del local' },
    { key: 'equipos',      label: `Equipos (${misEquipos.length})` },
    { key: 'preferencias', label: 'Preferencias de servicio' },
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D0D0D] text-white text-2xl font-black">
                  {restaurante.nombre.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 border-2 border-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">{restaurante.nombre}</h1>
                <p className="text-sm text-gray-400">{restaurante.id} · {restaurante.tipo ?? 'Gastronomía'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Activo</span>
                  {restaurante.legajo?.plan && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{restaurante.legajo?.plan ?? restaurante.tier}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editando ? (
                <>
                  <button onClick={handleCancel}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    <X className="h-3.5 w-3.5" /> Cancelar
                  </button>
                  <button onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors">
                    <Save className="h-3.5 w-3.5" /> Guardar cambios
                  </button>
                </>
              ) : (
                <button onClick={() => setEditando(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#0D0D0D] px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
                  <Edit3 className="h-3.5 w-3.5" /> Editar perfil
                </button>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? 'border-[#2698D1] text-[#2698D1]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>{t.label}</button>
            ))}
          </div>

          {tab === 'datos' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Datos del local */}
              <div className="col-span-2 space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Información del local</h3>
                  </div>
                  <CampoEditable label="Nombre del local" value={form.nombre}   editando={editando} onChange={v => setForm(f => ({...f, nombre: v}))} />
                  <CampoEditable label="Dirección"        value={form.direccion} editando={editando} onChange={v => setForm(f => ({...f, direccion: v}))} />
                  <CampoEditable label="Teléfono"         value={form.telefono} editando={editando} onChange={v => setForm(f => ({...f, telefono: v}))} type="tel" />
                  <CampoEditable label="Email"            value={form.email}    editando={editando} onChange={v => setForm(f => ({...f, email: v}))} type="email" />
                  <CampoEditable label="CUIT"             value={form.cuit}     editando={editando} onChange={v => setForm(f => ({...f, cuit: v}))} />
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Contacto operativo</h3>
                  </div>
                  <CampoEditable label="Nombre"  value={form.contacto} editando={editando} onChange={v => setForm(f => ({...f, contacto: v}))} />
                  <CampoEditable label="Cargo"   value={form.cargo}    editando={editando} onChange={v => setForm(f => ({...f, cargo: v}))} />
                </div>
              </div>

              {/* Panel lateral */}
              <div className="space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado de la cuenta</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Perfil completo',     ok: true },
                      { label: 'Documentación legal',  ok: !!restaurante.legajo?.cuit },
                      { label: 'Equipos registrados',  ok: misEquipos.length > 0 },
                      { label: 'Contacto verificado',  ok: !!restaurante.telefono },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className={`text-xs font-bold ${item.ok ? 'text-green-600' : 'text-gray-300'}`}>
                          {item.ok ? '✓' : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
                  <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                  <p className="text-sm font-bold text-[#2698D1] mb-1">Datos seguros</p>
                  <p className="text-xs text-blue-600">Tu información es confidencial y solo es utilizada por SHUURI para coordinación de servicios.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'equipos' && (
            <div className="grid grid-cols-2 gap-4">
              {misEquipos.length === 0 ? (
                <div className="col-span-2 rounded-xl border bg-white p-12 text-center shadow-sm">
                  <Wrench className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                  <p className="font-bold text-gray-400">Sin equipos registrados</p>
                </div>
              ) : (
                misEquipos.map(eq => (
                  <div key={eq.id} className="rounded-xl border bg-white shadow-sm p-5 hover:border-[#2698D1]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                        <Wrench className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                        eq.estado === 'operativo' ? 'bg-green-100 text-green-700' :
                        eq.estado === 'en_servicio' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>{eq.estado.replace('_',' ')}</span>
                    </div>
                    <p className="font-bold text-[#0D0D0D]">{eq.tipo}</p>
                    <p className="text-sm text-gray-500">{eq.marca} {eq.modelo}</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-400">
                      <p>Serie: <span className="font-mono font-bold">{eq.serie}</span></p>
                      <p>Instalado: {eq.anioInstalacion}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'preferencias' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Horarios y acceso</h3>
                </div>
                <CampoEditable label="Horario preferido para visitas" value={form.horario} editando={editando} onChange={v => setForm(f => ({...f, horario: v}))} placeholder="Ej: Lunes a viernes 9-12hs" />
                <CampoEditable label="Notas de acceso"                value={form.notas}   editando={editando} onChange={v => setForm(f => ({...f, notas: v}))}   placeholder="Ej: Tocar timbre, preguntar por Jorge" />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-700 mb-1">Horarios críticos</p>
                  <p className="text-xs text-amber-600">Mantené actualizado tu horario operativo para que SHUURI pueda coordinar visitas sin interrumpir el servicio.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
