"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import { Save, RotateCcw, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';

// ─── CONFIGURACIÓN DEFAULT (refleja el modelo comercial real de SHUURI) ───────

const DEFAULT_CONFIG = {
  comisiones: {
    servicioFreemium:    30,
    servicioCadenaChica: 25,
    servicioCadenaGrande:20,
    repuestos:           15,
    equipamiento:        10,
  },
  saas: {
    cadenaChicaUSD:   75,
    cadenaGrandeUSD: 100,
  },
  shuuriPro: {
    precioMensualUSD: 1600,
  },
  sla: {
    criticaHoras:  4,
    altaHoras:    24,
    mediaHoras:   72,
    bajaHoras:   168,
  },
  liquidacion: {
    plazoTecnicoDias:    7,
    plazoProveedorDias: 14,
    retencionGarantiaPct: 5,
  },
  compliance: {
    diasAlertaVencimiento: 30,
    bloqueoAutomaticoVencida: true,
  },
};

type Config = typeof DEFAULT_CONFIG;

// ─── SUBCOMPONENTES ───────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-black text-[#0D0D0D]">{title}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
  );
}

function Field({
  label, value, onChange, suffix = '', min = 0, max = 100, step = 1, readonly = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {readonly ? (
          <span className="text-sm font-black text-gray-400">{value}{suffix}</span>
        ) : (
          <>
            <input
              type="number"
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={e => onChange(Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-right font-black text-[#0D0D0D] outline-none focus:border-[#2698D1] transition-colors"
            />
            {suffix && <span className="text-xs font-bold text-gray-400 w-6">{suffix}</span>}
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label, description, value, onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#2698D1]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function AdminConfiguracion() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [saved,  setSaved]  = useState(false);
  const [dirty,  setDirty]  = useState(false);

  function update<S extends keyof Config, K extends keyof Config[S]>(
    section: S, key: K, value: Config[S][K]
  ) {
    setConfig(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    // En producción: POST a API. En prototipo: simula guardado.
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setConfig(DEFAULT_CONFIG);
    setDirty(false);
    setSaved(false);
  }

  const c = config;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 sidebar-push">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO + ACCIONES */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Configuración</h1>
              <p className="text-gray-400 text-sm">Parámetros operativos del sistema SHUURI</p>
            </div>
            <div className="flex items-center gap-3">
              {dirty && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100"
                >
                  <RotateCcw className="h-4 w-4" /> Resetear
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!dirty}
                className="flex items-center gap-2 rounded-lg bg-[#0D0D0D] px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saved
                  ? <><CheckCircle className="h-4 w-4 text-green-400" /> Guardado</>
                  : <><Save className="h-4 w-4" /> Guardar cambios</>
                }
              </button>
            </div>
          </div>

          {dirty && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700">Tenés cambios sin guardar. Los cambios solo afectan al prototipo — no se persisten entre sesiones.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">

            {/* ── COMISIONES ── */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <SectionHeader
                title="Comisiones por tier"
                description="Porcentaje que retiene SHUURI sobre el monto facturado al cliente"
              />
              <Field label="Servicio — FREEMIUM"      value={c.comisiones.servicioFreemium}    onChange={v => update('comisiones','servicioFreemium',v)}    suffix="%" max={50} />
              <Field label="Servicio — Cadena Chica"  value={c.comisiones.servicioCadenaChica} onChange={v => update('comisiones','servicioCadenaChica',v)} suffix="%" max={50} />
              <Field label="Servicio — Cadena Grande" value={c.comisiones.servicioCadenaGrande}onChange={v => update('comisiones','servicioCadenaGrande',v)}suffix="%" max={50} />
              <Field label="Repuestos (todas las OCs)"value={c.comisiones.repuestos}           onChange={v => update('comisiones','repuestos',v)}           suffix="%" max={30} />
              <Field label="Equipamiento (mandato)"  value={c.comisiones.equipamiento}        onChange={v => update('comisiones','equipamiento',v)}        suffix="%" max={20} />
            </div>

            {/* ── SAAS + SHUURI PRO ── */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <SectionHeader
                title="SaaS & ShuuriPro"
                description="Suscripciones mensuales fijas en USD"
              />
              <Field label="SaaS — Cadena Chica (USD/local/mes)"  value={c.saas.cadenaChicaUSD}    onChange={v => update('saas','cadenaChicaUSD',v)}    suffix="USD" min={0} max={500} step={5} />
              <Field label="SaaS — Cadena Grande (USD/local/mes)" value={c.saas.cadenaGrandeUSD}   onChange={v => update('saas','cadenaGrandeUSD',v)}   suffix="USD" min={0} max={500} step={5} />
              <div className="mt-4 border-t pt-4">
                <SectionHeader
                  title="ShuuriPro (Proveedor)"
                  description="Suscripción mensual para proveedores con visibilidad prioritaria"
                />
                <Field label="Precio mensual ShuuriPro" value={c.shuuriPro.precioMensualUSD} onChange={v => update('shuuriPro','precioMensualUSD',v)} suffix="USD" min={0} max={5000} step={100} />
              </div>
            </div>

            {/* ── SLA ── */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <SectionHeader
                title="SLA por urgencia"
                description="Horas máximas desde la creación de la OT hasta la primera visita del técnico"
              />
              <Field label="CRÍTICA — primera visita en"  value={c.sla.criticaHoras}  onChange={v => update('sla','criticaHoras',v)}  suffix="hs" min={1}  max={24}  />
              <Field label="ALTA — primera visita en"     value={c.sla.altaHoras}     onChange={v => update('sla','altaHoras',v)}     suffix="hs" min={4}  max={72}  />
              <Field label="MEDIA — primera visita en"    value={c.sla.mediaHoras}    onChange={v => update('sla','mediaHoras',v)}    suffix="hs" min={24} max={168} />
              <Field label="BAJA — primera visita en"     value={c.sla.bajaHoras}     onChange={v => update('sla','bajaHoras',v)}     suffix="hs" min={48} max={336} />

              {/* Tabla resumen visual */}
              <div className="mt-4 rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-gray-400">Urgencia</th>
                      <th className="px-3 py-2 text-right font-bold text-gray-400">Límite</th>
                      <th className="px-3 py-2 text-right font-bold text-gray-400">En días</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { label: 'CRÍTICA', hs: c.sla.criticaHoras, color: 'text-red-600' },
                      { label: 'ALTA',    hs: c.sla.altaHoras,    color: 'text-orange-500' },
                      { label: 'MEDIA',   hs: c.sla.mediaHoras,   color: 'text-amber-500' },
                      { label: 'BAJA',    hs: c.sla.bajaHoras,    color: 'text-gray-500' },
                    ].map(r => (
                      <tr key={r.label}>
                        <td className={`px-3 py-2 font-black ${r.color}`}>{r.label}</td>
                        <td className="px-3 py-2 text-right font-bold text-[#0D0D0D]">{r.hs}hs</td>
                        <td className="px-3 py-2 text-right text-gray-400">{(r.hs / 24).toFixed(1)}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── LIQUIDACIÓN + COMPLIANCE ── */}
            <div className="space-y-6">

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Liquidaciones"
                  description="Plazos de pago y retención de garantía"
                />
                <Field label="Plazo pago técnico (días)"    value={c.liquidacion.plazoTecnicoDias}    onChange={v => update('liquidacion','plazoTecnicoDias',v)}    suffix="días" min={1} max={30} />
                <Field label="Plazo pago proveedor (días)"  value={c.liquidacion.plazoProveedorDias}  onChange={v => update('liquidacion','plazoProveedorDias',v)}  suffix="días" min={1} max={60} />
                <Field label="Retención de garantía"        value={c.liquidacion.retencionGarantiaPct}onChange={v => update('liquidacion','retencionGarantiaPct',v)}suffix="%"    min={0} max={20} />
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Compliance de certificaciones"
                  description="Reglas de alertas y bloqueos automáticos"
                />
                <Field
                  label="Días de alerta antes del vencimiento"
                  value={c.compliance.diasAlertaVencimiento}
                  onChange={v => update('compliance','diasAlertaVencimiento',v)}
                  suffix="días"
                  min={7}
                  max={90}
                />
                <Toggle
                  label="Bloqueo automático al vencer cert."
                  description="Impide asignación de OTs si la certificación del rubro está vencida"
                  value={c.compliance.bloqueoAutomaticoVencida}
                  onChange={v => update('compliance','bloqueoAutomaticoVencida',v)}
                />
                {!c.compliance.bloqueoAutomaticoVencida && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      <strong>Riesgo legal:</strong> desactivar el bloqueo automático puede permitir asignar técnicos sin certificaciones vigentes. SHUURI asume responsabilidad regulatoria sobre este punto.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* NOTA FOOTER */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-white px-6 py-4">
            <p className="text-xs text-gray-400">
              <strong className="text-gray-600">Nota prototipo:</strong> los cambios realizados aquí afectan la visualización en sesión pero no se persisten.
              En producción, esta página escribirá a la tabla <code className="bg-gray-100 px-1 rounded">system_config</code> vía API con auditoría de cambios.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
