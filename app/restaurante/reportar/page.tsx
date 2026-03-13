"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, EQUIPOS } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Wrench,
  AlertTriangle, Clock, Zap, Package,
  Camera, ChevronDown, MapPin, Info,
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Urgencia = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';
type Paso     = 1 | 2 | 3 | 4;

interface FormData {
  // Paso 1
  localId:       string;
  equipoId:      string;       // '' = equipo no registrado
  equipoTipo:    string;
  equipoMarca:   string;
  equipoModelo:  string;
  rubro:         Rubro | '';
  // Paso 2
  descripcion:   string;
  urgencia:      Urgencia | '';
  // Paso 3
  horarioAcceso: string;
  contactoNombre:string;
  contactoTel:   string;
  notas:         string;
}

const FORM_INICIAL: FormData = {
  localId: '', equipoId: '', equipoTipo: '', equipoMarca: '',
  equipoModelo: '', rubro: '', descripcion: '', urgencia: '',
  horarioAcceso: '', contactoNombre: '', contactoTel: '', notas: '',
};

// ─── URGENCIA CONFIG ──────────────────────────────────────────────────────────

const URGENCIAS: { key: Urgencia; label: string; sub: string; icon: React.ReactNode; color: string; border: string }[] = [
  {
    key:    'CRITICA',
    label:  'Crítica',
    sub:    'Operación detenida. Requiere atención inmediata.',
    icon:   <AlertTriangle className="h-5 w-5" />,
    color:  'text-red-600',
    border: 'border-red-400 bg-red-50',
  },
  {
    key:    'ALTA',
    label:  'Alta',
    sub:    'Impacto en el servicio. Atención en el día.',
    icon:   <Zap className="h-5 w-5" />,
    color:  'text-orange-600',
    border: 'border-orange-400 bg-orange-50',
  },
  {
    key:    'MEDIA',
    label:  'Media',
    sub:    'Funciona con limitaciones. Atención en 48hs.',
    icon:   <Clock className="h-5 w-5" />,
    color:  'text-yellow-600',
    border: 'border-yellow-400 bg-yellow-50',
  },
  {
    key:    'BAJA',
    label:  'Baja / Preventivo',
    sub:    'Sin impacto inmediato. Podemos coordinar.',
    icon:   <Wrench className="h-5 w-5" />,
    color:  'text-gray-600',
    border: 'border-gray-300 bg-gray-50',
  },
];

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────

function StepIndicator({ paso, total = 4 }: { paso: Paso; total?: number }) {
  const PASOS = ['Equipo', 'Falla', 'Acceso', 'Confirmar'];
  return (
    <div className="flex items-center gap-0 mb-8">
      {PASOS.map((label, i) => {
        const num    = (i + 1) as Paso;
        const activo = num === paso;
        const hecho  = num < paso;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-all ${
                hecho  ? 'bg-green-500 text-white' :
                activo ? 'bg-[#2698D1] text-white ring-4 ring-[#2698D1]/20' :
                'bg-gray-100 text-gray-400'
              }`}>
                {hecho ? <CheckCircle2 className="h-5 w-5" /> : num}
              </div>
              <p className={`mt-1 text-xs font-bold ${activo ? 'text-[#2698D1]' : hecho ? 'text-green-500' : 'text-gray-300'}`}>
                {label}
              </p>
            </div>
            {i < PASOS.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-5 transition-colors ${hecho ? 'bg-green-300' : 'bg-gray-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ReportarFalla() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];
  const equipos       = EQUIPOS.filter(eq => eq.restauranteId === restauranteId);
  const locales       = restaurante.locales ?? [];

  const [paso,     setPaso]     = useState<Paso>(1);
  const [form,     setForm]     = useState<FormData>({ ...FORM_INICIAL, contactoNombre: restaurante.legajo?.contactoOperativoNombre ?? '' });
  const [enviado,    setEnviado]    = useState(false);
  const [enviando,   setEnviando]   = useState(false);
  const [otNuevaId,  setOtNuevaId]  = useState('');

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function seleccionarEquipo(equipoId: string) {
    if (equipoId === '') {
      set('equipoId', '');
      return;
    }
    const eq = equipos.find(e => e.id === equipoId);
    if (!eq) return;
    setForm(f => ({
      ...f,
      equipoId:    eq.id,
      equipoTipo:  eq.tipo,
      equipoMarca: eq.marca,
      equipoModelo:eq.modelo ?? '',
      rubro:       eq.rubro,
    }));
  }

  function puedeAvanzar(): boolean {
    if (paso === 1) return !!form.equipoTipo && !!form.rubro;
    if (paso === 2) return !!form.descripcion.trim() && !!form.urgencia;
    if (paso === 3) return true; // opcional
    return true;
  }

  async function enviar() {
    setEnviando(true);
    await new Promise(r => setTimeout(r, 1200));
    // Genera ID simulado para la nueva OT
    const nuevoId = `OT-${String(Date.now()).slice(-4)}`;
    setOtNuevaId(nuevoId);
    setEnviado(true);
  }

  // ── PANTALLA ÉXITO ──
  if (enviado) {
    const urgCfg = URGENCIAS.find(u => u.key === form.urgencia);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
        <div className="flex-1 ml-64">
          <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
          <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-[#0D0D0D] mb-2">OT creada</h2>
              {otNuevaId && (
                <p className="text-sm font-mono font-bold text-[#2698D1] mb-1">{otNuevaId}</p>
              )}
              <p className="text-gray-500 mb-6">
                Tu reporte fue enviado. Un técnico será asignado según la urgencia declarada.
              </p>

              <div className="rounded-xl border bg-white p-5 text-left mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Equipo</span>
                  <span className="font-bold text-[#0D0D0D]">{form.equipoTipo} {form.equipoMarca}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Urgencia</span>
                  <span className={`font-bold ${urgCfg?.color}`}>{urgCfg?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rubro</span>
                  <span className="font-medium text-gray-700">{RUBRO_LABELS[form.rubro as Rubro]}</span>
                </div>
                <div className="pt-2 border-t text-sm">
                  <span className="text-gray-400 block mb-1">Falla reportada</span>
                  <span className="text-gray-600 text-xs">{form.descripcion}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/restaurante/ots?id=${restauranteId}`}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 text-center transition-colors"
                >
                  Ver mis OTs
                </Link>
                <Link
                  href={`/restaurante?id=${restauranteId}`}
                  className="flex-1 rounded-xl bg-[#2698D1] py-3 text-sm font-bold text-white hover:bg-[#2698D1]/90 text-center transition-colors"
                >
                  Ir al panel
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-center gap-3">
            <Link
              href={`/restaurante?id=${restauranteId}`}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#0D0D0D] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <span className="text-gray-200">/</span>
            <h1 className="text-lg font-black text-[#0D0D0D]">Reportar falla</h1>
          </div>

          <div className="mx-auto max-w-xl">
            <StepIndicator paso={paso} />

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

              {/* ── PASO 1: EQUIPO ── */}
              {paso === 1 && (
                <div className="p-8">
                  <h2 className="text-lg font-black text-[#0D0D0D] mb-1">¿Qué equipo falló?</h2>
                  <p className="text-sm text-gray-400 mb-6">Seleccioná de tu inventario o ingresá uno nuevo</p>

                  {/* Selector equipo registrado */}
                  {equipos.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Elegir de mis equipos registrados
                      </label>
                      <div className="space-y-2">
                        {equipos.map(eq => (
                          <button
                            key={eq.id}
                            onClick={() => seleccionarEquipo(eq.id)}
                            className={`w-full rounded-xl border px-4 py-3.5 text-left transition-all ${
                              form.equipoId === eq.id
                                ? 'border-[#2698D1] bg-blue-50 ring-1 ring-[#2698D1]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm text-[#0D0D0D]">
                                  {eq.tipo}
                                  <span className="font-normal text-gray-400 ml-1">{eq.marca} {eq.modelo}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{RUBRO_LABELS[eq.rubro as Rubro]}</p>
                              </div>
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                form.equipoId === eq.id ? 'border-[#2698D1] bg-[#2698D1]' : 'border-gray-200'
                              }`}>
                                {form.equipoId === eq.id && <div className="h-2 w-2 rounded-full bg-white" />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="my-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-100" />
                        <p className="text-xs text-gray-400 font-medium">o ingresá manualmente</p>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                    </div>
                  )}

                  {/* Ingreso manual */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Tipo de equipo <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.equipoTipo}
                        onChange={e => set('equipoTipo', e.target.value)}
                        placeholder="Ej: Cámara frigorífica, Cafetera, Horno..."
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Marca</label>
                        <input
                          value={form.equipoMarca}
                          onChange={e => set('equipoMarca', e.target.value)}
                          placeholder="Ej: Frider, Rational..."
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Modelo</label>
                        <input
                          value={form.equipoModelo}
                          onChange={e => set('equipoModelo', e.target.value)}
                          placeholder="Opcional"
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Rubro / Categoría <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.rubro}
                          onChange={e => set('rubro', e.target.value as Rubro)}
                          className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors bg-white"
                        >
                          <option value="">Seleccioná un rubro…</option>
                          {TODOS_LOS_RUBROS.map(r => (
                            <option key={r} value={r}>{RUBRO_LABELS[r]}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {locales.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Local</label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <select
                            value={form.localId}
                            onChange={e => set('localId', e.target.value)}
                            className="w-full appearance-none rounded-lg border border-gray-200 pl-9 pr-4 py-3 text-sm outline-none focus:border-[#2698D1] bg-white"
                          >
                            <option value="">Sede principal</option>
                            {locales.map(l => (
                              <option key={l.id} value={l.id}>{l.nombre}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── PASO 2: FALLA ── */}
              {paso === 2 && (
                <div className="p-8">
                  <h2 className="text-lg font-black text-[#0D0D0D] mb-1">Describí la falla</h2>
                  <p className="text-sm text-gray-400 mb-6">Cuanto más detalle, más rápido el diagnóstico</p>

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                      ¿Qué está pasando? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.descripcion}
                      onChange={e => set('descripcion', e.target.value)}
                      rows={4}
                      placeholder="Ej: La cámara no enfría. La temperatura sube a 12°C en lugar de mantenerse en 2°C. Escuché un ruido raro antes de que dejara de funcionar…"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-300 mt-1 text-right">{form.descripcion.length} / 500</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                      Urgencia <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {URGENCIAS.map(u => (
                        <button
                          key={u.key}
                          onClick={() => set('urgencia', u.key)}
                          className={`w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                            form.urgencia === u.key ? u.border : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={form.urgencia === u.key ? u.color : 'text-gray-300'}>
                              {u.icon}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold text-sm ${form.urgencia === u.key ? u.color : 'text-gray-600'}`}>
                                {u.label}
                              </p>
                              <p className="text-xs text-gray-400">{u.sub}</p>
                            </div>
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              form.urgencia === u.key ? 'border-current bg-current' : 'border-gray-200'
                            } ${form.urgencia === u.key ? u.color : ''}`}>
                              {form.urgencia === u.key && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 3: ACCESO ── */}
              {paso === 3 && (
                <div className="p-8">
                  <h2 className="text-lg font-black text-[#0D0D0D] mb-1">Acceso y contacto</h2>
                  <p className="text-sm text-gray-400 mb-6">Para coordinar la visita del técnico</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Horario preferido de visita
                      </label>
                      <input
                        value={form.horarioAcceso}
                        onChange={e => set('horarioAcceso', e.target.value)}
                        placeholder={restaurante.legajo?.horarioPreferido ?? 'Ej: Lunes a jueves 9:00 - 12:00'}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                          Contacto en el local
                        </label>
                        <input
                          value={form.contactoNombre}
                          onChange={e => set('contactoNombre', e.target.value)}
                          placeholder="Nombre"
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <input
                          value={form.contactoTel}
                          onChange={e => set('contactoTel', e.target.value)}
                          placeholder={restaurante.telefono ?? '11-xxxx-xxxx'}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Notas adicionales para el técnico
                      </label>
                      <textarea
                        value={form.notas}
                        onChange={e => set('notas', e.target.value)}
                        rows={3}
                        placeholder="Ej: Tocar timbre en portería. El equipo está en el subsuelo..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors resize-none"
                      />
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex gap-3">
                      <Info className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        SHUURI coordinará la visita con el técnico asignado.
                        Te notificaremos por email con la fecha y hora confirmada.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 4: CONFIRMAR ── */}
              {paso === 4 && (
                <div className="p-8">
                  <h2 className="text-lg font-black text-[#0D0D0D] mb-1">Confirmá el reporte</h2>
                  <p className="text-sm text-gray-400 mb-6">Revisá los datos antes de enviar</p>

                  <div className="space-y-3 mb-6">
                    {/* Equipo */}
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Equipo</p>
                      <p className="font-bold text-[#0D0D0D]">
                        {form.equipoTipo}
                        {form.equipoMarca && <span className="font-normal text-gray-500 ml-1">{form.equipoMarca}</span>}
                        {form.equipoModelo && <span className="font-normal text-gray-400"> {form.equipoModelo}</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{RUBRO_LABELS[form.rubro as Rubro]}</p>
                    </div>

                    {/* Falla + urgencia */}
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Falla reportada</p>
                        {form.urgencia && (
                          <span className={`text-xs font-black ${URGENCIAS.find(u => u.key === form.urgencia)?.color}`}>
                            {URGENCIAS.find(u => u.key === form.urgencia)?.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{form.descripcion}</p>
                    </div>

                    {/* Acceso */}
                    {(form.horarioAcceso || form.contactoNombre || form.notas) && (
                      <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Acceso</p>
                        {form.horarioAcceso && <p className="text-xs text-gray-600 mb-0.5">⏰ {form.horarioAcceso}</p>}
                        {form.contactoNombre && <p className="text-xs text-gray-600 mb-0.5">👤 {form.contactoNombre} {form.contactoTel && `— ${form.contactoTel}`}</p>}
                        {form.notas && <p className="text-xs text-gray-500 mt-1 italic">{form.notas}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER NAVEGACIÓN */}
              <div className="flex items-center justify-between border-t px-8 py-5 bg-gray-50">
                <button
                  onClick={() => paso > 1 ? setPaso((paso - 1) as Paso) : router.push(`/restaurante?id=${restauranteId}`)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {paso === 1 ? 'Cancelar' : 'Atrás'}
                </button>

                {paso < 4 ? (
                  <button
                    onClick={() => puedeAvanzar() && setPaso((paso + 1) as Paso)}
                    disabled={!puedeAvanzar()}
                    className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={enviar}
                    disabled={enviando}
                    className="flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {enviando ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirmar reporte
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
