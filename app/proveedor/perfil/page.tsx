"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Building2, Phone, Mail, Clock, User, Edit3, Save, X,
  CheckCircle2, Shield, Package, Truck, CreditCard,
  MapPin, Zap, FileText, ChevronRight, AlertCircle,
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

export default function ProveedorPerfil() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [editando, setEditando] = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);
  const [tab,      setTab]      = useState<'empresa' | 'logistica' | 'rubros' | 'pagos'>('empresa');

  const [form, setForm] = useState({
    nombre:           proveedor.nombre,
    email:            proveedor.email ?? '',
    telefono:         proveedor.telefono ?? '',
    direccion:        proveedor.direccion ?? '',
    cuit:             proveedor.legajo?.cuit ?? '',
    tipoProveedor:    proveedor.legajo?.tipoProveedor ?? '',
    tiempoEntrega:    proveedor.legajo?.tiempoEntrega ?? '',
    horarioDespacho:  proveedor.legajo?.horarioDespacho ?? '',
    plazoLiquidacion: proveedor.legajo?.plazoLiquidacion ?? '',
    tipoFactura:      proveedor.legajo?.tipoFactura ?? '',
    banco:            proveedor.legajo?.bancoOBilletera ?? '',
    aliasCbu:         proveedor.legajo?.aliasCbu ?? '',
    comercialNombre:  proveedor.legajo?.comercialNombre ?? '',
    comercialCargo:   proveedor.legajo?.comercialCargo ?? '',
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

  const tabs = [
    { key: 'empresa',   label: 'Empresa' },
    { key: 'logistica', label: 'Logística' },
    { key: 'rubros',    label: `Rubros (${proveedor.rubros.length})` },
    { key: 'pagos',     label: 'Pagos' },
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D0D0D] text-white text-2xl font-black">
                  {proveedor.nombre.charAt(0)}
                </div>
                {proveedor.esShuuriPro && (
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 border-2 border-white">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-2xl font-black text-[#0D0D0D]">{proveedor.nombre}</h1>
                  {proveedor.esShuuriPro && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700">SHUURI Pro</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{proveedor.id} · {form.tipoProveedor || 'Proveedor'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Activo</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                    {proveedor.tiempoEntregaHs}hs entrega
                  </span>
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
                    <h3 className="font-bold text-[#0D0D0D]">Datos de la empresa</h3>
                  </div>
                  <Campo label="Razón social"     value={form.nombre}        editando={editando} onChange={f('nombre')} />
                  <Campo label="CUIT"             value={form.cuit}          editando={editando} onChange={f('cuit')} mono />
                  <Campo label="Tipo de proveedor" value={form.tipoProveedor} editando={editando} onChange={f('tipoProveedor')} />
                  <Campo label="Dirección"        value={form.direccion}     editando={editando} onChange={f('direccion')} />
                </div>

                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">Contacto comercial</h3>
                  </div>
                  <Campo label="Nombre"  value={form.comercialNombre} editando={editando} onChange={f('comercialNombre')} />
                  <Campo label="Cargo"   value={form.comercialCargo}  editando={editando} onChange={f('comercialCargo')} />
                  <Campo label="Email"   value={form.comercialEmail}  editando={editando} onChange={f('comercialEmail')}  type="email" />
                  <Campo label="Teléfono" value={form.comercialTel}   editando={editando} onChange={f('comercialTel')}   type="tel" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border bg-white shadow-sm p-5">
                  <h3 className="font-bold text-[#0D0D0D] mb-3 text-sm">Estado de cuenta</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Perfil completo',    ok: true },
                      { label: 'CUIT verificado',    ok: !!proveedor.legajo?.cuit },
                      { label: 'Rubros activos',     ok: proveedor.rubros.length > 0 },
                      { label: 'Datos bancarios',    ok: !!proveedor.legajo?.aliasCbu },
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
                  <p className="text-xs text-blue-600">Información confidencial, solo usada para coordinación de servicios SHUURI.</p>
                </div>

                {proveedor.esShuuriPro && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <Zap className="h-5 w-5 text-amber-600 mb-2" />
                    <p className="text-sm font-bold text-amber-700 mb-1">SHUURI Pro activo</p>
                    <p className="text-xs text-amber-600">Prioridad de asignación de OCs y visibilidad premium en el catálogo.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'logistica' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Logística y despacho</h3>
                </div>
                <Campo label="Tiempo de entrega"    value={form.tiempoEntrega}   editando={editando} onChange={f('tiempoEntrega')}   placeholder="Ej: 24-48hs" />
                <Campo label="Horario de despacho"  value={form.horarioDespacho} editando={editando} onChange={f('horarioDespacho')} placeholder="Ej: Lun-Vie 9-17hs" />
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Catálogo</h3>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-xs text-gray-400">SKUs activos</span>
                  <span className="text-sm font-bold text-[#0D0D0D]">{proveedor.legajo?.cantidadSKUs ?? '—'}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-xs text-gray-400">Logística propia</span>
                  <span className="text-sm font-bold text-[#0D0D0D]">{proveedor.legajo?.logisticaPropia ?? '—'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-700 mb-1">Horario crítico</p>
                  <p className="text-xs text-amber-600">SHUURI coordina retiros en base a tu horario de despacho. Mantenerlo actualizado evita demoras operativas.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'rubros' && (
            <div className="max-w-2xl">
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h3 className="font-bold text-[#0D0D0D]">Rubros habilitados</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Los rubros determinan para qué OTs podés recibir órdenes de compra.</p>
                </div>
                <div className="divide-y">
                  {proveedor.rubros.map(r => (
                    <div key={r} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="text-sm font-medium text-[#0D0D0D]">{RUBRO_LABELS[r as Rubro]}</span>
                      </div>
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">Activo</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400 px-1">
                Para agregar o quitar rubros contactá a tu ejecutivo SHUURI.
              </p>
            </div>
          )}

          {tab === 'pagos' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Datos bancarios</h3>
                </div>
                <Campo label="Banco / Billetera" value={form.banco}            editando={editando} onChange={f('banco')} />
                <Campo label="Alias / CBU"       value={form.aliasCbu}         editando={editando} onChange={f('aliasCbu')} mono />
                <Campo label="Tipo de factura"   value={form.tipoFactura}      editando={editando} onChange={f('tipoFactura')} />
                <Campo label="Plazo liquidación" value={form.plazoLiquidacion} editando={editando} onChange={f('plazoLiquidacion')} placeholder="Ej: 7 días post-entrega" />
              </div>

              <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
                <Shield className="h-5 w-5 text-[#2698D1] mb-2" />
                <p className="text-sm font-bold text-[#2698D1] mb-1">Datos bancarios encriptados</p>
                <p className="text-xs text-blue-600">Tu información financiera está protegida y solo se usa para procesar liquidaciones.</p>
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
