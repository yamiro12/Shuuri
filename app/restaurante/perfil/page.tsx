"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, getOTsByRestaurante, getEquiposByRestaurante } from '@/data/mock';
import {
  Building2, Phone, Mail, Clock, User, Edit3, Save, X,
  Shield, CreditCard, MapPin, FileText, Layers, ClipboardList,
  Link2, Calendar, Wallet,
} from 'lucide-react';

// ─── CAMPO EDITABLE ───────────────────────────────────────────────────────────

function Campo({ label, value, editando, onChange, type = 'text', placeholder, mono = false }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {editando ? (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors" />
      ) : (
        <p className={`text-sm font-medium text-[#0D0D0D] ${mono ? 'font-mono' : ''}`}>
          {value || <span className="text-gray-300 italic">Sin datos</span>}
        </p>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function RestaurantePerfil() {
  const searchParams   = useSearchParams();
  const restauranteId  = searchParams.get('id') ?? 'R001';
  const restaurante    = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const [editando, setEditando] = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);
  const [tab,      setTab]      = useState<'empresa' | 'operaciones' | 'pagos' | 'integraciones'>('empresa');

  const ots     = getOTsByRestaurante(restaurante.id);
  const equipos = getEquiposByRestaurante(restaurante.id);
  const otsActivas = ots.filter(o =>
    !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado)
  );

  const [form, setForm] = useState({
    nombre:                  restaurante.nombre,
    razonSocial:             restaurante.razonSocial,
    cuit:                    restaurante.cuit,
    telefono:                restaurante.telefono,
    direccion:               restaurante.direccion,
    zona:                    restaurante.zona,
    contactoNombre:          restaurante.contactoNombre,
    condicionIVA:            restaurante.legajo?.condicionIVA ?? '',
    horarioLV:               restaurante.legajo?.horarioLV ?? '',
    horarioSabado:           restaurante.legajo?.horarioSabado ?? '',
    contactoPrincipalEmail:  restaurante.legajo?.contactoPrincipalEmail ?? '',
    emailFacturas:           restaurante.legajo?.emailFacturas ?? '',
    metodoPago:              restaurante.legajo?.metodoPago ?? '',
    cbu:                     restaurante.legajo?.cbu ?? '',
    bancoOBilletera:         restaurante.legajo?.bancoOBilletera ?? '',
    horarioPreferido:        restaurante.legajo?.horarioPreferido ?? '',
  });

  function f(key: keyof typeof form) {
    return (v: string) => setForm(prev => ({ ...prev, [key]: v }));
  }

  function handleSave() {
    setEditando(false);
    setToast('Perfil actualizado correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  const TIER_LABEL: Record<string, string> = {
    FREEMIUM: 'Freemium',
    CADENA_CHICA: 'Cadena chica',
    CADENA_GRANDE: 'Cadena grande',
  };
  const TIER_COLOR: Record<string, string> = {
    FREEMIUM: 'bg-gray-100 text-gray-700',
    CADENA_CHICA: 'bg-blue-100 text-blue-700',
    CADENA_GRANDE: 'bg-purple-100 text-purple-700',
  };

  const tabs = [
    { key: 'empresa',        label: 'Empresa' },
    { key: 'operaciones',    label: 'Operaciones' },
    { key: 'pagos',          label: 'Pagos' },
    { key: 'integraciones',  label: 'Integraciones' },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D0D0D] text-white text-2xl font-black">
                {restaurante.nombre.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">{restaurante.nombre}</h1>
                <p className="text-sm text-gray-400">{restaurante.id} · {restaurante.razonSocial}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TIER_COLOR[restaurante.tier] ?? 'bg-gray-100 text-gray-600'}`}>
                    {TIER_LABEL[restaurante.tier] ?? restaurante.tier}
                  </span>
                  <span className="text-xs text-gray-400">{restaurante.cantidadLocales} local{restaurante.cantidadLocales !== 1 ? 'es' : ''}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editando ? (
                <>
                  <button onClick={() => setEditando(false)}
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

          {/* KPIs RÁPIDOS */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: 'OTs activas',  value: otsActivas.length,  icon: ClipboardList, color: 'text-blue-600' },
              { label: 'Equipos',      value: equipos.length,     icon: Layers,        color: 'text-gray-700' },
              { label: 'Total OTs',    value: ots.length,         icon: FileText,      color: 'text-gray-700' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                  tab === t.key ? 'border-[#2698D1] text-[#2698D1]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>{t.label}</button>
            ))}
          </div>

          {tab === 'empresa' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Datos del establecimiento</h3>
                  </div>
                  <Campo label="Nombre comercial" value={form.nombre}       editando={editando} onChange={f('nombre')} />
                  <Campo label="Razón social"      value={form.razonSocial}  editando={editando} onChange={f('razonSocial')} />
                  <Campo label="CUIT"              value={form.cuit}         editando={editando} onChange={f('cuit')} mono />
                  <Campo label="Condición IVA"     value={form.condicionIVA} editando={editando} onChange={f('condicionIVA')} />
                  <Campo label="Dirección"         value={form.direccion}    editando={editando} onChange={f('direccion')} />
                  <Campo label="Zona"              value={form.zona}         editando={editando} onChange={f('zona')} />
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Contacto principal</h3>
                  </div>
                  <Campo label="Nombre"    value={form.contactoNombre}         editando={editando} onChange={f('contactoNombre')} />
                  <Campo label="Teléfono"  value={form.telefono}               editando={editando} onChange={f('telefono')} type="tel" />
                  <Campo label="Email"     value={form.contactoPrincipalEmail} editando={editando} onChange={f('contactoPrincipalEmail')} type="email" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado de cuenta</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Perfil completo',   ok: true },
                      { label: 'CUIT verificado',   ok: !!restaurante.cuit },
                      { label: 'Email configurado', ok: !!form.contactoPrincipalEmail },
                      { label: 'Datos bancarios',   ok: !!form.cbu || !!form.bancoOBilletera },
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
                  <p className="text-xs text-blue-600">Información confidencial, solo usada para coordinar servicios SHUURI.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'operaciones' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Horarios</h3>
                </div>
                <Campo label="Lunes a viernes"  value={form.horarioLV}       editando={editando} onChange={f('horarioLV')}       placeholder="Ej: 8:00 – 23:00" />
                <Campo label="Sábados"          value={form.horarioSabado}   editando={editando} onChange={f('horarioSabado')}   placeholder="Ej: 9:00 – 22:00" />
                <Campo label="Horario preferido para visitas" value={form.horarioPreferido} editando={editando} onChange={f('horarioPreferido')} placeholder="Ej: Mañana" />
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Locales</h3>
                </div>
                {restaurante.locales && restaurante.locales.length > 0 ? (
                  <div className="divide-y">
                    {restaurante.locales.map(local => (
                      <div key={local.id} className="py-3">
                        <p className="text-sm font-bold text-[#0D0D0D]">{local.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{local.direccion} · {local.zona}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Local único</p>
                )}
              </div>
            </div>
          )}

          {tab === 'integraciones' && (
            <div className="max-w-2xl space-y-5">
              {/* MEDIOS DE PAGO */}
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Medios de pago</h3>
                </div>
                {[
                  { nombre: 'MercadoPago', desc: 'Conectá tu cuenta para pagar servicios y repuestos desde la plataforma.', logo: '🔵' },
                  { nombre: 'MODO', desc: 'Pagos instantáneos con débito interbancario argentino.', logo: '💳' },
                ].map(int => (
                  <div key={int.nombre} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{int.logo}</span>
                      <div>
                        <p className="text-sm font-bold text-[#0D0D0D]">{int.nombre}</p>
                        <p className="text-xs text-gray-400">{int.desc}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">Próximamente</span>
                  </div>
                ))}
              </div>

              {/* CALENDARIOS */}
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Calendarios</h3>
                </div>
                {[
                  { nombre: 'Google Calendar', desc: 'Sincronizá visitas técnicas programadas con tu Google Calendar.', logo: '📅' },
                  { nombre: 'Microsoft Outlook', desc: 'Recibí alertas de OTs en tu calendario de Outlook.', logo: '📆' },
                  { nombre: 'Apple Calendar', desc: 'Integración con iCal para dispositivos Apple.', logo: '🍎' },
                ].map(int => (
                  <div key={int.nombre} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{int.logo}</span>
                      <div>
                        <p className="text-sm font-bold text-[#0D0D0D]">{int.nombre}</p>
                        <p className="text-xs text-gray-400">{int.desc}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">Próximamente</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
                <Link2 className="h-5 w-5 text-[#2698D1] mb-2" />
                <p className="text-sm font-bold text-[#2698D1] mb-1">Más integraciones en camino</p>
                <p className="text-xs text-blue-600">Estamos trabajando para conectar SHUURI con las herramientas que ya usás en tu negocio.</p>
              </div>
            </div>
          )}

          {tab === 'pagos' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Facturación y pagos</h3>
                </div>
                <Campo label="Email de facturas" value={form.emailFacturas}    editando={editando} onChange={f('emailFacturas')}    type="email" />
                <Campo label="Método de pago"    value={form.metodoPago}       editando={editando} onChange={f('metodoPago')} />
                <Campo label="Banco / Billetera" value={form.bancoOBilletera}  editando={editando} onChange={f('bancoOBilletera')} />
                <Campo label="CBU"               value={form.cbu}              editando={editando} onChange={f('cbu')} mono />
              </div>

              <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
                <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                <p className="text-sm font-bold text-[#2698D1] mb-1">Datos bancarios encriptados</p>
                <p className="text-xs text-blue-600">Tu información financiera está protegida y solo se usa para procesar pagos de servicios.</p>
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
