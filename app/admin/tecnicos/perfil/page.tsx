"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS } from '@/data/mock';
import type { Rubro } from '@/types/shuuri';
import { RUBRO_LABELS } from '@/types/shuuri';

type FormAdminTecnico = {
  nombreCompleto: string; cuil: string; domicilio: string;
  telefono: string; email: string; tipoServicio: string;
  rubrosEspecializacion: string; zonaCobertura: string;
  disponibilidadHoraria: string; movilidad: string;
  cbu: string; aliasCbu: string; bancoOBilletera: string;
  condicionFiscal: string; tipoFactura: string; emailLiquidaciones: string;
};
import { User, Shield, CreditCard, Save, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

function Campo({ label, value, editando, onChange, mono = false, placeholder = '' }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; mono?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-44 shrink-0 pt-1">{label}</span>
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

export default function AdminTecnicoPerfilPage() {
  const tecnico = TECNICOS[0];

  const [editando, setEditando] = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);
  const [tab,      setTab]      = useState<'datos' | 'rubros' | 'pagos'>('datos');

  const [form, setForm] = useState<FormAdminTecnico>({
    nombreCompleto:    tecnico.nombre ?? '',
    cuil:              '',
    domicilio:         '',
    telefono:          tecnico.telefono ?? '',
    email:             tecnico.email ?? '',
    tipoServicio:      '',
    rubrosEspecializacion: (tecnico.rubros ?? []).map(r => RUBRO_LABELS[r]).join(', '),
    zonaCobertura:     tecnico.zona ?? '',
    disponibilidadHoraria: '',
    movilidad:         '',
    cbu:               '',
    aliasCbu:          '',
    bancoOBilletera:   '',
    condicionFiscal:   '',
    tipoFactura:       '',
    emailLiquidaciones: tecnico.email ?? '',
  });

  function f(key: keyof FormAdminTecnico) {
    return (v: string) => setForm(prev => ({ ...prev, [key]: v }));
  }

  function handleSave() {
    setEditando(false);
    setToast('Perfil actualizado correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  const TABS = [
    { key: 'datos',  label: 'Datos personales' },
    { key: 'rubros', label: `Rubros (${(tecnico.rubros ?? []).length})` },
    { key: 'pagos',  label: 'Pagos' },
  ] as const;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
        <main className="flex-1 overflow-y-auto p-6">

          {toast && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
              <CheckCircle className="h-4 w-4" />{toast}
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">{tecnico.nombre}</h1>
              <p className="text-sm text-gray-400 mt-0.5">Perfil del técnico</p>
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

          {/* Estado compliance */}
          {tecnico.bloqueado && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-700">Técnico bloqueado — certificaciones vencidas. No puede recibir nuevas OTs.</p>
            </div>
          )}

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

          {tab === 'datos' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Datos personales</h3>
                </div>
                <Campo label="Nombre completo"  value={form.nombreCompleto ?? ''}  editando={editando} onChange={f('nombreCompleto')} />
                <Campo label="CUIL"             value={form.cuil ?? ''}            editando={editando} onChange={f('cuil')} mono />
                <Campo label="Domicilio"        value={form.domicilio ?? ''}       editando={editando} onChange={f('domicilio')} />
                <Campo label="Teléfono"         value={form.telefono ?? ''}        editando={editando} onChange={f('telefono')} />
                <Campo label="Email"            value={form.email ?? ''}           editando={editando} onChange={f('email')} />
              </div>
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Operativo</h3>
                </div>
                <Campo label="Tipo de servicio"      value={form.tipoServicio ?? ''}       editando={editando} onChange={f('tipoServicio')} placeholder="Ej: Independiente / Empresa" />
                <Campo label="Zona de cobertura"     value={form.zonaCobertura ?? ''}      editando={editando} onChange={f('zonaCobertura')} />
                <Campo label="Disponibilidad"        value={form.disponibilidadHoraria ?? ''} editando={editando} onChange={f('disponibilidadHoraria')} placeholder="Ej: Lun-Vie 8-18hs" />
                <Campo label="Movilidad"             value={form.movilidad ?? ''}          editando={editando} onChange={f('movilidad')} placeholder="Ej: Vehículo propio" />
              </div>
            </div>
          )}

          {tab === 'rubros' && (
            <div className="max-w-2xl">
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h3 className="font-bold text-[#0D0D0D]">Rubros habilitados</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Los rubros determinan para qué OTs puede ser asignado este técnico.</p>
                </div>
                <div className="divide-y">
                  {(tecnico.rubros ?? []).map(r => {
                    const certStatus = (tecnico.certPorRubro ?? {})[r];
                    return (
                      <div key={r} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            certStatus === 'vencida' ? 'bg-red-400'
                            : certStatus === 'por_vencer' ? 'bg-yellow-400'
                            : 'bg-green-400'
                          }`} />
                          <span className="text-sm font-medium text-[#0D0D0D]">{RUBRO_LABELS[r as Rubro]}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          certStatus === 'vencida' ? 'bg-red-100 text-red-700'
                          : certStatus === 'por_vencer' ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                        }`}>
                          {certStatus === 'vencida' ? 'Vencida'
                          : certStatus === 'por_vencer' ? 'Por vencer'
                          : 'Vigente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400">Para agregar o quitar rubros contactá al equipo SHUURI.</p>
            </div>
          )}

          {tab === 'pagos' && (
            <div className="max-w-2xl space-y-5">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D]">Datos bancarios</h3>
                </div>
                <Campo label="Banco / Billetera"    value={form.bancoOBilletera ?? ''}    editando={editando} onChange={f('bancoOBilletera')} />
                <Campo label="Alias CBU"            value={form.aliasCbu ?? ''}           editando={editando} onChange={f('aliasCbu')} mono />
                <Campo label="Condición fiscal"     value={form.condicionFiscal ?? ''}    editando={editando} onChange={f('condicionFiscal')} placeholder="Ej: Monotributista" />
                <Campo label="Tipo de factura"      value={form.tipoFactura ?? ''}        editando={editando} onChange={f('tipoFactura')} placeholder="Ej: Factura C" />
                <Campo label="Email liquidaciones"  value={form.emailLiquidaciones ?? ''} editando={editando} onChange={f('emailLiquidaciones')} />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
