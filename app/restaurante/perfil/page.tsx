"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, getOTsByRestaurante, getEquiposByRestaurante } from '@/data/mock';
import {
  Building2, Phone, Mail, Clock, User, Edit3, Save, X,
  Shield, CreditCard, MapPin, FileText, Layers, ClipboardList,
  CheckCircle2, AlertCircle, Receipt, Landmark,
} from 'lucide-react';

// ─── CAMPO EDITABLE ───────────────────────────────────────────────────────────

function Campo({ label, value, editando, onChange, type = 'text', placeholder, mono = false }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      {editando ? (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors" />
      ) : (
        <p className={`text-sm font-medium text-[#0D0D0D] ${mono ? 'font-mono' : ''}`}>
          {value || <span className="text-gray-300 italic text-xs">Sin datos</span>}
        </p>
      )}
    </div>
  );
}

function Toggle({ label, value, editando, onChange }: {
  label: string; value: boolean; editando: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0 flex items-center justify-between">
      <p className="text-sm font-medium text-[#0D0D0D]">{label}</p>
      {editando ? (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#2698D1]' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ) : (
        <span className={`text-xs font-bold ${value ? 'text-green-600' : 'text-gray-400'}`}>
          {value ? 'Sí' : 'No'}
        </span>
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
  const [tab,      setTab]      = useState<'empresa' | 'fiscal' | 'retenciones' | 'pagos' | 'operaciones'>('empresa');

  const ots         = getOTsByRestaurante(restaurante.id);
  const equipos     = getEquiposByRestaurante(restaurante.id);
  const otsActivas  = ots.filter(o =>
    !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'].includes(o.estado)
  );

  const [form, setForm] = useState({
    // Empresa
    nombre:                  restaurante.nombre,
    razonSocial:             restaurante.razonSocial,
    cuit:                    restaurante.cuit,
    condicionIVA:            restaurante.legajo?.condicionIVA ?? '',
    domicilioFiscal:         restaurante.legajo?.domicilioFiscal ?? '',
    tipoEstablecimiento:     restaurante.legajo?.tipoEstablecimiento ?? '',
    direccion:               restaurante.direccion,
    zona:                    restaurante.zona,
    contactoNombre:          restaurante.contactoNombre,
    telefono:                restaurante.telefono,
    contactoPrincipalEmail:  restaurante.legajo?.contactoPrincipalEmail ?? '',
    contactoPrincipalCargo:  restaurante.legajo?.contactoPrincipalCargo ?? '',
    // Fiscal — IIBB
    numeroIIBB:              restaurante.legajo?.numeroIIBB ?? '',
    convenioMultilateral:    restaurante.legajo?.convenioMultilateral ?? false,
    jurisdiccionesIIBB:      restaurante.legajo?.jurisdiccionesIIBB ?? '',
    alicuotaIIBB:            restaurante.legajo?.alicuotaIIBB ?? '',
    // Retenciones
    esSujetoRetencion:       restaurante.legajo?.esSujetoRetencion ?? false,
    retencionGanancias:      restaurante.legajo?.retencionGanancias ?? '',
    retencionIVA:            restaurante.legajo?.retencionIVA ?? '',
    retencionIIBBPct:        restaurante.legajo?.retencionIIBBPct ?? '',
    // Pagos
    emailFacturas:           restaurante.legajo?.emailFacturas ?? '',
    metodoPago:              restaurante.legajo?.metodoPago ?? '',
    cbu:                     restaurante.legajo?.cbu ?? '',
    bancoOBilletera:         restaurante.legajo?.bancoOBilletera ?? '',
    // Operaciones
    horarioLV:               restaurante.legajo?.horarioLV ?? '',
    horarioSabado:           restaurante.legajo?.horarioSabado ?? '',
    horarioDomingo:          restaurante.legajo?.horarioDomingo ?? '',
    horarioPreferido:        restaurante.legajo?.horarioPreferido ?? '',
    horarioProhibido:        restaurante.legajo?.horarioProhibido ?? '',
    serviciosPorMes:         restaurante.legajo?.serviciosPorMes ?? '',
  });

  function f(key: keyof typeof form) {
    return (v: string | boolean) => setForm(prev => ({ ...prev, [key]: v }));
  }

  function handleSave() {
    setEditando(false);
    setToast('Perfil actualizado correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  const TIER_COLOR: Record<string, string> = {
    FREEMIUM:     'bg-gray-100 text-gray-700',
    CADENA_CHICA: 'bg-blue-100 text-blue-700',
    CADENA_GRANDE:'bg-yellow-100 text-yellow-700',
  };
  const TIER_LABEL: Record<string, string> = {
    FREEMIUM:     'Freemium',
    CADENA_CHICA: 'Cadena Chica',
    CADENA_GRANDE:'Cadena Grande',
  };

  const tabs = [
    { key: 'empresa',     label: 'Empresa',     icon: Building2  },
    { key: 'fiscal',      label: 'IIBB',         icon: Receipt    },
    { key: 'retenciones', label: 'Retenciones',  icon: Landmark   },
    { key: 'pagos',       label: 'Pagos',        icon: CreditCard },
    { key: 'operaciones', label: 'Operaciones',  icon: Clock      },
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-5xl">

          {/* ── HEADER ── */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D0D0D] text-white text-xl font-black shrink-0">
                {restaurante.nombre.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">{restaurante.nombre}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{restaurante.razonSocial} · CUIT {restaurante.cuit}</p>
                <div className="flex items-center gap-2 mt-1.5">
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

          {/* ── KPIs ── */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: 'OTs activas', value: otsActivas.length, icon: ClipboardList, color: 'text-blue-600' },
              { label: 'Equipos',     value: equipos.length,    icon: Layers,        color: 'text-gray-700' },
              { label: 'Total OTs',   value: ots.length,        icon: FileText,      color: 'text-gray-700' },
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

          {/* ── TABS ── */}
          <div className="mb-6 flex items-center gap-0 border-b border-gray-200 overflow-x-auto">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px ${
                    tab === t.key ? 'border-[#2698D1] text-[#2698D1]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}>
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB: EMPRESA ── */}
          {tab === 'empresa' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Datos del establecimiento</h3>
                  </div>
                  <Campo label="Nombre comercial"    value={form.nombre}              editando={editando} onChange={f('nombre') as (v: string) => void} />
                  <Campo label="Razón social"        value={form.razonSocial}         editando={editando} onChange={f('razonSocial') as (v: string) => void} />
                  <Campo label="CUIT"                value={form.cuit}                editando={editando} onChange={f('cuit') as (v: string) => void} mono />
                  <Campo label="Condición IVA"       value={form.condicionIVA}        editando={editando} onChange={f('condicionIVA') as (v: string) => void} />
                  <Campo label="Domicilio fiscal"    value={form.domicilioFiscal}     editando={editando} onChange={f('domicilioFiscal') as (v: string) => void} />
                  <Campo label="Tipo establecimiento" value={form.tipoEstablecimiento} editando={editando} onChange={f('tipoEstablecimiento') as (v: string) => void} />
                  <Campo label="Dirección operativa" value={form.direccion}           editando={editando} onChange={f('direccion') as (v: string) => void} />
                  <Campo label="Zona"                value={form.zona}                editando={editando} onChange={f('zona') as (v: string) => void} />
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Contacto principal</h3>
                  </div>
                  <Campo label="Nombre"  value={form.contactoNombre}        editando={editando} onChange={f('contactoNombre') as (v: string) => void} />
                  <Campo label="Cargo"   value={form.contactoPrincipalCargo} editando={editando} onChange={f('contactoPrincipalCargo') as (v: string) => void} />
                  <Campo label="Teléfono" value={form.telefono}             editando={editando} onChange={f('telefono') as (v: string) => void} type="tel" />
                  <Campo label="Email"   value={form.contactoPrincipalEmail} editando={editando} onChange={f('contactoPrincipalEmail') as (v: string) => void} type="email" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado del perfil</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Datos de empresa',  ok: !!form.razonSocial && !!form.cuit },
                      { label: 'CUIT verificado',   ok: !!restaurante.cuit },
                      { label: 'Email configurado', ok: !!form.contactoPrincipalEmail },
                      { label: 'IIBB completado',   ok: !!form.numeroIIBB },
                      { label: 'Datos bancarios',   ok: !!form.cbu },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        {item.ok
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <AlertCircle  className="h-4 w-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4">
                  <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                  <p className="text-sm font-bold text-[#2698D1] mb-1">Datos seguros</p>
                  <p className="text-xs text-blue-600">Información confidencial, solo usada para coordinar servicios SHUURI.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: IIBB ── */}
          {tab === 'fiscal' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Ingresos Brutos (IIBB)</h3>
                  </div>
                  <Campo label="Número de inscripción IIBB" value={form.numeroIIBB} editando={editando} onChange={f('numeroIIBB') as (v: string) => void} mono placeholder="Ej: 901-234567-8" />
                  <Campo label="Alícuota aplicable (%)"     value={form.alicuotaIIBB} editando={editando} onChange={f('alicuotaIIBB') as (v: string) => void} placeholder="Ej: 3.5" />
                  <Campo label="Jurisdicciones"             value={form.jurisdiccionesIIBB} editando={editando} onChange={f('jurisdiccionesIIBB') as (v: string) => void} placeholder="Ej: CABA, Buenos Aires, Córdoba" />
                  <Toggle label="Convenio Multilateral" value={form.convenioMultilateral} editando={editando} onChange={f('convenioMultilateral') as (v: boolean) => void} />
                </div>

                {form.convenioMultilateral && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm font-bold text-[#0D0D0D] mb-1">Régimen de Convenio Multilateral</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      El Convenio Multilateral distribuye la base imponible entre las jurisdicciones donde operás.
                      Asegurate de declarar todas las jurisdicciones activas para evitar diferencias al momento de la liquidación.
                    </p>
                  </div>
                )}

              </div>

              <div className="space-y-4">
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado IIBB</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'N° inscripción cargado', ok: !!form.numeroIIBB },
                      { label: 'Alícuota definida',      ok: !!form.alicuotaIIBB },
                      { label: 'Jurisdicciones',         ok: !!form.jurisdiccionesIIBB },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        {item.ok
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <AlertCircle  className="h-4 w-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mb-2" />
                  <p className="text-sm font-bold text-yellow-800 mb-1">Recordatorio fiscal</p>
                  <p className="text-xs text-yellow-700">
                    Los datos de IIBB son utilizados por SHUURI para la liquidación automática de retenciones en cada OT.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: RETENCIONES ── */}
          {tab === 'retenciones' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Condición frente a retenciones</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Indicá si tu establecimiento actúa como agente de retención. Esto determina cómo SHUURI aplica las retenciones en cada liquidación.
                  </p>
                  <Toggle label="Soy agente de retención" value={form.esSujetoRetencion} editando={editando} onChange={f('esSujetoRetencion') as (v: boolean) => void} />
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Alícuotas de retención</h3>
                  </div>

                  <div className="mb-3 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    Estos porcentajes se aplican sobre el monto de cada OT al momento de la liquidación.
                  </div>

                  <Campo
                    label="Retención Ganancias (%)"
                    value={form.retencionGanancias}
                    editando={editando}
                    onChange={f('retencionGanancias') as (v: string) => void}
                    placeholder="Ej: 2.5"
                  />
                  <Campo
                    label="Retención IVA (%)"
                    value={form.retencionIVA}
                    editando={editando}
                    onChange={f('retencionIVA') as (v: string) => void}
                    placeholder="Ej: 10.5"
                  />
                  <Campo
                    label="Retención IIBB (%)"
                    value={form.retencionIIBBPct}
                    editando={editando}
                    onChange={f('retencionIIBBPct') as (v: string) => void}
                    placeholder="Ej: 3.0"
                  />
                </div>

                {/* Resumen de retenciones aplicables */}
                {(form.retencionGanancias || form.retencionIVA || form.retencionIIBBPct) && (
                  <div className="rounded-xl border bg-white shadow-sm p-6">
                    <h3 className="font-bold text-[#0D0D0D] mb-4 text-sm">Simulación sobre $10.000</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Retención Ganancias', pct: parseFloat(form.retencionGanancias || '0') },
                        { label: 'Retención IVA',       pct: parseFloat(form.retencionIVA || '0') },
                        { label: 'Retención IIBB',      pct: parseFloat(form.retencionIIBBPct || '0') },
                      ].filter(r => r.pct > 0).map(r => (
                        <div key={r.label} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{r.label} ({r.pct}%)</span>
                          <span className="font-bold text-red-600">− ${(10000 * r.pct / 100).toFixed(0)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-black">
                        <span className="text-[#0D0D0D]">Total retenciones</span>
                        <span className="text-red-600">
                          − ${((parseFloat(form.retencionGanancias||'0') + parseFloat(form.retencionIVA||'0') + parseFloat(form.retencionIIBBPct||'0')) * 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4">
                  <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                  <p className="text-sm font-bold text-[#2698D1] mb-1">¿Por qué importa?</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    SHUURI aplica retenciones automáticamente en la liquidación de cada OT.
                    Si sos agente, deberás emitir constancias de retención al técnico o proveedor.
                  </p>
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Condición definida',    ok: true },
                      { label: '% Ganancias cargado',   ok: !!form.retencionGanancias },
                      { label: '% IVA cargado',         ok: !!form.retencionIVA },
                      { label: '% IIBB cargado',        ok: !!form.retencionIIBBPct },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        {item.ok
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <AlertCircle  className="h-4 w-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: PAGOS ── */}
          {tab === 'pagos' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Facturación y datos bancarios</h3>
                  </div>
                  <Campo label="Email de facturas" value={form.emailFacturas}   editando={editando} onChange={f('emailFacturas') as (v: string) => void} type="email" />
                  <Campo label="Método de pago"    value={form.metodoPago}      editando={editando} onChange={f('metodoPago') as (v: string) => void} />
                  <Campo label="Banco / Billetera" value={form.bancoOBilletera} editando={editando} onChange={f('bancoOBilletera') as (v: string) => void} />
                  <Campo label="CBU / CVU"         value={form.cbu}             editando={editando} onChange={f('cbu') as (v: string) => void} mono placeholder="22 dígitos" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4">
                  <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                  <p className="text-sm font-bold text-[#2698D1] mb-1">Datos encriptados</p>
                  <p className="text-xs text-blue-600">Tu información financiera está protegida y solo se usa para procesar pagos de servicios.</p>
                </div>
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado de pagos</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Email de facturas', ok: !!form.emailFacturas },
                      { label: 'CBU configurado',   ok: !!form.cbu },
                      { label: 'Método de pago',    ok: !!form.metodoPago },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        {item.ok
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <AlertCircle  className="h-4 w-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: OPERACIONES ── */}
          {tab === 'operaciones' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Horarios de atención</h3>
                </div>
                <Campo label="Lunes a viernes"  value={form.horarioLV}       editando={editando} onChange={f('horarioLV') as (v: string) => void}       placeholder="Ej: 08:00 – 23:00" />
                <Campo label="Sábados"          value={form.horarioSabado}   editando={editando} onChange={f('horarioSabado') as (v: string) => void}   placeholder="Ej: 09:00 – 22:00" />
                <Campo label="Domingos"         value={form.horarioDomingo}  editando={editando} onChange={f('horarioDomingo') as (v: string) => void}  placeholder="Ej: Cerrado" />
                <Campo label="Horario preferido para visitas" value={form.horarioPreferido} editando={editando} onChange={f('horarioPreferido') as (v: string) => void} placeholder="Ej: Mañana" />
                <Campo label="Horario prohibido" value={form.horarioProhibido} editando={editando} onChange={f('horarioProhibido') as (v: string) => void} placeholder="Ej: Fines de semana en servicio" />
                <Campo label="Servicios por mes" value={form.serviciosPorMes} editando={editando} onChange={f('serviciosPorMes') as (v: string) => void} placeholder="Ej: 4-6" />
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Locales</h3>
                </div>
                {restaurante.locales && restaurante.locales.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {restaurante.locales.map(local => (
                      <div key={local.id} className="py-3">
                        <p className="text-sm font-bold text-[#0D0D0D]">{local.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{local.direccion} · {local.zona}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Local único · {restaurante.direccion}</p>
                )}
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
