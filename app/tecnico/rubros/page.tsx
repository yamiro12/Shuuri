"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Rubro, CertificationStatus } from '@/types/shuuri';
import {
  Tag, ShieldCheck, Clock, AlertTriangle, Plus, Trash2,
  ChevronDown, ChevronUp, Info,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TECNICO = TECNICOS[0];

const CERT_BADGE: Record<CertificationStatus, { label: string; icon: React.ElementType; cls: string }> = {
  vigente:    { label: 'Certificación vigente',   icon: ShieldCheck,    cls: 'bg-green-50 text-green-700 border-green-200' },
  por_vencer: { label: 'Por vencer',              icon: Clock,          cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  vencida:    { label: 'Vencida',                 icon: AlertTriangle,  cls: 'bg-red-50 text-red-700 border-red-200' },
};

const RUBRO_ICON_COLOR: Record<string, string> = {
  frio_comercial:           'bg-blue-100 text-blue-600',
  calor_comercial:          'bg-orange-100 text-orange-600',
  gas_combustion:           'bg-yellow-100 text-yellow-700',
  maquinaria_preparacion:   'bg-purple-100 text-purple-600',
  lavado_comercial:         'bg-cyan-100 text-cyan-700',
  cafe_bebidas:             'bg-amber-100 text-amber-700',
  pos_it:                   'bg-indigo-100 text-indigo-600',
  seguridad_cctv:           'bg-gray-100 text-gray-600',
  electricidad_tableros:    'bg-yellow-100 text-yellow-800',
  plomeria_agua:            'bg-sky-100 text-sky-700',
  campanas_extraccion:      'bg-slate-100 text-slate-600',
  infraestructura_edilicia: 'bg-stone-100 text-stone-600',
  automatizacion_iot:       'bg-emerald-100 text-emerald-700',
  incendio_seguridad:       'bg-red-100 text-red-600',
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function CertBadge({ estado }: { estado?: CertificationStatus }) {
  if (!estado) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium bg-gray-50 text-gray-500 border-gray-200">
        <Info className="h-3 w-3" />
        Sin certificación registrada
      </span>
    );
  }
  const { label, icon: Icon, cls } = CERT_BADGE[estado];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function RubroCard({
  rubro,
  certStatus,
  certDetail,
  onRemove,
}: {
  rubro: Rubro;
  certStatus?: CertificationStatus;
  certDetail?: string;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colorCls = RUBRO_ICON_COLOR[rubro] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {/* Icon + label */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${colorCls}`}>
            <Tag className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{RUBRO_LABELS[rubro]}</p>
            <CertBadge estado={certStatus} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {certDetail && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Ver detalle"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Quitar rubro"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expandable cert detail */}
      {expanded && certDetail && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-600">{certDetail}</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function MisRubrosPage() {
  const [rubros, setRubros]     = useState<Rubro[]>(TECNICO.rubros);
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);

  const disponibles = TODOS_LOS_RUBROS.filter(r => !rubros.includes(r));

  const certPorRubro = TECNICO.certPorRubro ?? {};

  // Match certificaciones detail text to rubro
  const detallePorRubro: Partial<Record<Rubro, string>> = {};
  TECNICO.certificaciones.forEach(cert => {
    cert.rubrosCubiertos.forEach(r => {
      if (!detallePorRubro[r]) {
        detallePorRubro[r] = `${cert.nombre} — ${cert.entidadEmisora} (vence ${cert.fechaVencimiento})`;
      }
    });
  });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleRemove(rubro: Rubro) {
    setRubros(prev => prev.filter(r => r !== rubro));
    showToast(`"${RUBRO_LABELS[rubro]}" quitado de tus rubros.`);
  }

  function handleAdd(rubro: Rubro) {
    setRubros(prev => [...prev, rubro]);
    setShowAdd(false);
    showToast(`"${RUBRO_LABELS[rubro]}" agregado. Recordá cargar tu certificación.`);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Rubros guardados correctamente.');
    }, 900);
  }

  // Stats
  const conCert     = rubros.filter(r => certPorRubro[r] === 'vigente').length;
  const porVencer   = rubros.filter(r => certPorRubro[r] === 'por_vencer').length;
  const sinCert     = rubros.filter(r => !certPorRubro[r]).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />

      <div className="flex flex-1 flex-col" style={{ marginLeft: 'var(--sidebar-w, 256px)' }}>
        <Header userRole="TECNICO" userName={TECNICO.nombre} />

        <main className="flex-1 p-4 sm:p-6 max-w-3xl">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Mis Rubros</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestioná las especialidades en las que estás habilitado para operar.
            </p>
          </div>

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{rubros.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total rubros</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-700">{conCert}</p>
              <p className="text-xs text-green-600 mt-0.5">Con cert. vigente</p>
            </div>
            <div className={`rounded-xl border px-4 py-3 text-center shadow-sm ${sinCert > 0 || porVencer > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
              <p className={`text-2xl font-bold ${sinCert > 0 || porVencer > 0 ? 'text-yellow-700' : 'text-gray-900'}`}>
                {sinCert + porVencer}
              </p>
              <p className={`text-xs mt-0.5 ${sinCert > 0 || porVencer > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                Atención requerida
              </p>
            </div>
          </div>

          {/* Info banner */}
          {sinCert > 0 && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Tenés <strong>{sinCert} rubro{sinCert > 1 ? 's' : ''}</strong> sin certificación registrada.
                SHUURI puede limitar la asignación de OTs en rubros no certificados.
              </p>
            </div>
          )}

          {/* Rubros list */}
          <div className="mb-4 space-y-2">
            {rubros.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                <Tag className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tenés rubros configurados.</p>
                <p className="text-xs text-gray-400 mt-1">Agregá al menos uno para recibir OTs.</p>
              </div>
            ) : (
              rubros.map(rubro => (
                <RubroCard
                  key={rubro}
                  rubro={rubro}
                  certStatus={certPorRubro[rubro]}
                  certDetail={detallePorRubro[rubro]}
                  onRemove={() => handleRemove(rubro)}
                />
              ))
            )}
          </div>

          {/* Add rubro */}
          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              disabled={disponibles.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Agregar rubro
            </button>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-blue-800">Seleccioná un rubro para agregar:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {disponibles.map(r => (
                  <button
                    key={r}
                    onClick={() => handleAdd(r)}
                    className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs ${RUBRO_ICON_COLOR[r] ?? 'bg-gray-100 text-gray-600'}`}>
                      <Tag className="h-3.5 w-3.5" />
                    </div>
                    {RUBRO_LABELS[r]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="mt-3 text-xs text-gray-400 hover:text-gray-600"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Save */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400">
              Los cambios impactan en la asignación de OTs dentro de las 24 hs.
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
