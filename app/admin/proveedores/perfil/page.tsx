"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES } from '@/data/mock';
import { Rubro } from '@/types/shuuri';
import { Building2, Package, MapPin, User, Phone, CreditCard, Save, Edit3, CheckCircle } from 'lucide-react';

const RUBRO_LABELS: Record<Rubro, string> = {
  frio_comercial: 'Frío Comercial',
  calor_comercial: 'Calor Comercial',
  gas_combustion: 'Gas / Combustión',
  maquinaria_preparacion: 'Maquinaria de Preparación',
  lavado_comercial: 'Lavado Comercial',
  cafe_bebidas: 'Café y Bebidas',
  pos_it: 'POS / IT',
  seguridad_cctv: 'Seguridad / CCTV',
  electricidad_tableros: 'Electricidad / Tableros',
  plomeria_agua: 'Plomería / Agua',
  campanas_extraccion: 'Campanas / Extracción',
  infraestructura_edilicia: 'Infraestructura Edilicia',
  automatizacion_iot: 'Automatización / IoT',
  incendio_seguridad: 'Incendio / Seguridad',
};

function Campo({ label, value, editando, onChange, mono = false, placeholder = '' }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; mono?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-40 shrink-0 pt-1">{label}</span>
      {editando ? (
        <input
          className={`flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 ${mono ? 'font-mono' : ''}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <span className={`flex-1 text-sm font-medium text-[#0D0D0D] text-right ${mono ? 'font-mono' : ''}`}>
          {value || <span className="text-gray-300 font-normal">—</span>}
        </span>
      )}
    </div>
  );
}

export default function AdminProveedorPerfilPage() {
  const proveedor = PROVEEDORES[0];

  const [editando, setEditando]   = useState(false);
  const [toast,    setToast]      = useState<string | null>(null);
  const [tab,      setTab]        = useState<'empresa' | 'logistica' | 'rubros' | 'pagos'>('empresa');

  const [form, setForm] = useState({
    nombre:           proveedor.nombre ?? '',
    razonSocial:      proveedor.razonSocial ?? '',
    cuit:             proveedor.cuit ?? '',
    telefono:         proveedor.telefono ?? '',
    email:            proveedor.email ?? '',
    tipoProveedor:    proveedor.legajo?.tipoProveedor ?? '',
    tiempoEntrega:    proveedor.legajo?.tiempoEntrega ?? '',
    horarioDespacho:  proveedor.legajo?.horarioDespacho ?? '',
    plazoLiquidacion: proveedor.legajo?.plazoLiquidacion ?? '',
    tipoFactura:      proveedor.legajo?.tipoFactura ?? '',
    banco:            proveedor.legajo?.bancoOBilletera ?? '',
    aliasCbu:         proveedor.legajo?.aliasCbu ?? '',
    comercialNombre:  proveedor.legajo?.comercialNombre ?? '',
    comercialEmail:   proveedor.legajo?.comercialEmail ?? '',
    comercialTel:     proveedor.legajo?.comercialTel ?? '',
  });

  function f(key: keyof typeof form) {
    return (v: string) => setForm(prev => ({ ...prev, [key]: v }));
  }

  function handleSave() {
    setEditando(false);
    setToast('Perfil actualizado correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  const TABS = [
    { key: 'empresa',   label: 'Empresa' },
    { key: 'logistica', label: 'Logística' },
    { key: 'rubros',    label: `Rubros (${proveedor.rubros?.length ?? 0})` },
    { key: 'pagos',     label: 'Pagos' },
  ] as const;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
        <main className="flex-1 overflow-y-auto p-6">

          {/* Toast */}
          {toast && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-top-2">
              <CheckCircle className="h-4 w-4" />{toast}
            </div>
          )}

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">{proveedor.nombre}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{proveedor.razonSocial} · Perfil del proveedor</p>
            </div>
            <div className="flex gap-2">
              {editando ? (
                <>
                  <button onClick={() => setEditando(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1a7ab8]">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                </>
              ) : (
                <button onClick={() => setEditando(true)} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  <Edit3 className="h-4 w-4" /> Editar
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-xl bg-white border border-gray-100 p-1 w-fit shadow-sm">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Empresa */}
          {tab === 'empresa' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Datos de la empresa</h3>
                </div>
                <Campo label="Nombre comercial"  value={form.nombre}       editando={editando} onChange={f('nombre')} />
                <Campo label="Razón social"       value={form.razonSocial}  editando={editando} onChange={f('razonSocial')} />
                <Campo label="CUIT"               value={form.cuit}         editando={editando} onChange={f('cuit')} mono />
                <Campo label="Tipo de proveedor"  value={form.tipoProveedor} editando={editando} onChange={f('tipoProveedor')} placeholder="Ej: Distribuidor oficial" />
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Contacto comercial</h3>
                </div>
                <Campo label="Nombre"   value={form.comercialNombre} editando={editando} onChange={f('comercialNombre')} />
                <Campo label="Email"    value={form.comercialEmail}  editando={editando} onChange={f('comercialEmail')} />
                <Campo label="Teléfono" value={form.comercialTel}    editando={editando} onChange={f('comercialTel')} />
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Zonas de despacho</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(proveedor.zonaDespacho ?? []).map(z => (
                    <span key={z} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#2698D1]">{z}</span>
                  ))}
                  {(proveedor.zonaDespacho ?? []).length === 0 && (
                    <span className="text-sm text-gray-300">Sin zonas definidas</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Logística */}
          {tab === 'logistica' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Logística y despacho</h3>
                </div>
                <Campo label="Tiempo de entrega"   value={form.tiempoEntrega}   editando={editando} onChange={f('tiempoEntrega')}   placeholder="Ej: 24-48hs" />
                <Campo label="Horario de despacho" value={form.horarioDespacho} editando={editando} onChange={f('horarioDespacho')} placeholder="Ej: Lun-Vie 9-17hs" />
              </div>
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Contacto general</h3>
                </div>
                <Campo label="Teléfono" value={form.telefono} editando={editando} onChange={f('telefono')} />
                <Campo label="Email"    value={form.email}    editando={editando} onChange={f('email')} />
              </div>
            </div>
          )}

          {/* Tab: Rubros */}
          {tab === 'rubros' && (
            <div className="max-w-2xl">
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h3 className="font-bold text-[#0D0D0D]">Rubros habilitados</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Los rubros determinan para qué OTs puede recibir órdenes de compra.</p>
                </div>
                <div className="divide-y">
                  {(proveedor.rubros ?? []).map(r => (
                    <div key={r} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="text-sm font-medium text-[#0D0D0D]">{RUBRO_LABELS[r]}</span>
                      </div>
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">Activo</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400">Para agregar o quitar rubros contactá al equipo SHUURI.</p>
            </div>
          )}

          {/* Tab: Pagos */}
          {tab === 'pagos' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Datos bancarios</h3>
                </div>
                <Campo label="Banco / Billetera"    value={form.banco}            editando={editando} onChange={f('banco')} />
                <Campo label="Alias CBU"            value={form.aliasCbu}         editando={editando} onChange={f('aliasCbu')} mono />
                <Campo label="Plazo de liquidación" value={form.plazoLiquidacion} editando={editando} onChange={f('plazoLiquidacion')} placeholder="Ej: 72hs hábiles" />
                <Campo label="Tipo de factura"      value={form.tipoFactura}      editando={editando} onChange={f('tipoFactura')} placeholder="Ej: Factura A" />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
