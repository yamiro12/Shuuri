"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS } from '@/data/mock';
import {
  Clock, CheckCircle2, X, Calendar, CalendarDays,
  AlertCircle, Save, Apple, Chrome, Monitor,
  Info, ChevronDown, ChevronUp,
} from 'lucide-react';

const TECNICO = TECNICOS[0];

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

interface HorarioDia {
  activo: boolean;
  inicio: string;
  fin:    string;
}

type HorarioSemanal = Record<DiaSemana, HorarioDia>;

type PauseOption = 'hoy' | 'manana' | 'semana' | 'personalizado';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const DIAS: { key: DiaSemana; label: string; short: string }[] = [
  { key: 'lun', label: 'Lunes',     short: 'L' },
  { key: 'mar', label: 'Martes',    short: 'M' },
  { key: 'mie', label: 'Miércoles', short: 'X' },
  { key: 'jue', label: 'Jueves',    short: 'J' },
  { key: 'vie', label: 'Viernes',   short: 'V' },
  { key: 'sab', label: 'Sábado',    short: 'S' },
  { key: 'dom', label: 'Domingo',   short: 'D' },
];

const HORARIO_DEFECTO: HorarioSemanal = {
  lun: { activo: true,  inicio: '09:00', fin: '18:00' },
  mar: { activo: true,  inicio: '09:00', fin: '18:00' },
  mie: { activo: true,  inicio: '09:00', fin: '18:00' },
  jue: { activo: true,  inicio: '09:00', fin: '18:00' },
  vie: { activo: true,  inicio: '09:00', fin: '17:00' },
  sab: { activo: false, inicio: '09:00', fin: '13:00' },
  dom: { activo: false, inicio: '10:00', fin: '14:00' },
};

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange, size = 'md' }: { on: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm:  { track: 'h-5 w-9',   thumb: 'h-4 w-4',   translate: 'translate-x-4' },
    md:  { track: 'h-6 w-11',  thumb: 'h-5 w-5',   translate: 'translate-x-5' },
    lg:  { track: 'h-7 w-14',  thumb: 'h-6 w-6',   translate: 'translate-x-7' },
  };
  const s = sizes[size];
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex shrink-0 ${s.track} rounded-full transition-colors duration-200 focus:outline-none ${
        on ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 ${s.thumb} rounded-full bg-white shadow transition-transform duration-200 ${on ? s.translate : 'translate-x-0'}`} />
    </button>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#0D0D0D] px-4 py-3 shadow-xl animate-fade-in-up">
      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
      <span className="text-sm font-medium text-white">{msg}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function DisponibilidadPage() {
  // ── Disponibilidad inmediata ──
  const [disponible,    setDisponible]    = useState(true);
  const [pauseModal,    setPauseModal]    = useState(false);
  const [pauseOption,   setPauseOption]   = useState<PauseOption>('hoy');
  const [pauseDate,     setPauseDate]     = useState('');
  const [pausaHasta,    setPausaHasta]    = useState<string | null>(null);

  // ── Horario habitual ──
  const [horario, setHorario] = useState<HorarioSemanal>(HORARIO_DEFECTO);
  const [disponibleFeriados,  setDisponibleFeriados]  = useState(false);
  const [guardiaNoct,         setGuardiaNoct]         = useState(false);
  const [urgencias24,         setUrgencias24]         = useState(false);
  const [toast,               setToast]               = useState<string | null>(null);
  const [guardando,           setGuardando]           = useState(false);

  // ── Sincronización ──
  const [syncExpanded, setSyncExpanded] = useState(false);

  // ── Handlers ──
  function apgarDisponibilidad() {
    if (!disponible) {
      setDisponible(true);
      setPausaHasta(null);
      return;
    }
    setPauseModal(true);
  }

  function confirmarPausa() {
    let hasta = '';
    const hoy = new Date();
    if (pauseOption === 'hoy') {
      hasta = hoy.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    } else if (pauseOption === 'manana') {
      hoy.setDate(hoy.getDate() + 1);
      hasta = hoy.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    } else if (pauseOption === 'semana') {
      const fin = new Date(hoy);
      fin.setDate(hoy.getDate() + (5 - hoy.getDay()));
      hasta = fin.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    } else {
      hasta = pauseDate || 'fecha personalizada';
    }
    setPausaHasta(hasta);
    setDisponible(false);
    setPauseModal(false);
  }

  function setDia(dia: DiaSemana, field: keyof HorarioDia, value: boolean | string) {
    setHorario(prev => ({ ...prev, [dia]: { ...prev[dia], [field]: value } }));
  }

  async function guardarHorarios() {
    setGuardando(true);
    await new Promise(r => setTimeout(r, 900));
    setGuardando(false);
    setToast('Horarios guardados correctamente');
    setTimeout(() => setToast(null), 3000);
  }

  const diasActivos = DIAS.filter(d => horario[d.key].activo).length;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={TECNICO.nombre} />
        <main className="page-main">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── ENCABEZADO ── */}
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Disponibilidad</h1>
              <p className="text-sm text-gray-400 mt-0.5">Controlá cuándo podés recibir OTs y sincronizá tu agenda.</p>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* SECCIÓN 1 — TOGGLE INMEDIATO                                  */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-[#0D0D0D] mb-1">Estado actual</h2>
                  <p className="text-sm text-gray-400">
                    {disponible
                      ? 'Estás disponible para recibir nuevas OTs.'
                      : pausaHasta
                        ? `No disponible hasta el ${pausaHasta}.`
                        : 'No estás disponible para nuevas OTs.'}
                  </p>
                </div>

                {/* Toggle grande */}
                <button
                  onClick={apgarDisponibilidad}
                  className={`shrink-0 flex items-center gap-3 rounded-xl px-5 py-3 font-bold text-sm transition-all ${
                    disponible
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  {disponible
                    ? <><CheckCircle2 className="h-5 w-5" /> Disponible ahora</>
                    : <><X className="h-5 w-5" /> No disponible</>
                  }
                </button>
              </div>

              {/* Banner no disponible */}
              {!disponible && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-fade-in">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-800">No recibís asignaciones nuevas</p>
                    {pausaHasta && (
                      <p className="text-xs text-red-600 mt-0.5">Pausa activa hasta el {pausaHasta}.</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setDisponible(true); setPausaHasta(null); }}
                    className="shrink-0 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors"
                  >
                    Reactivar
                  </button>
                </div>
              )}

              {/* Info impacto */}
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Al desactivar tu disponibilidad, SHUURI no te asignará OTs nuevas. Las OTs en curso no se ven afectadas.
                  Tu estado se refleja en el dashboard y en la búsqueda de técnicos.
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* SECCIÓN 2 — HORARIOS HABITUALES                               */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-black text-[#0D0D0D]">Horarios habituales</h2>
                  <p className="text-sm text-gray-400">{diasActivos} día{diasActivos !== 1 ? 's' : ''} activo{diasActivos !== 1 ? 's' : ''} esta semana</p>
                </div>
                <div className="flex gap-1">
                  {DIAS.map(d => (
                    <div
                      key={d.key}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition-colors ${
                        horario[d.key].activo
                          ? 'bg-[#2698D1] text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {d.short}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grilla días */}
              <div className="space-y-2 mb-6">
                {DIAS.map(({ key, label }) => {
                  const dia = horario[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                        dia.activo ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                    >
                      {/* Toggle día */}
                      <Toggle on={dia.activo} onChange={v => setDia(key, 'activo', v)} size="sm" />

                      {/* Día label */}
                      <span className={`w-20 text-sm font-semibold ${dia.activo ? 'text-[#0D0D0D]' : 'text-gray-400'}`}>
                        {label}
                      </span>

                      {/* Horarios */}
                      {dia.activo ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={dia.inicio}
                            onChange={e => setDia(key, 'inicio', e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono outline-none focus:border-[#2698D1] w-28"
                          />
                          <span className="text-gray-400 text-sm">—</span>
                          <input
                            type="time"
                            value={dia.fin}
                            onChange={e => setDia(key, 'fin', e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono outline-none focus:border-[#2698D1] w-28"
                          />
                          <span className="text-xs text-gray-400 ml-1">
                            {(() => {
                              const [ih, im] = dia.inicio.split(':').map(Number);
                              const [fh, fm] = dia.fin.split(':').map(Number);
                              const mins = (fh * 60 + fm) - (ih * 60 + im);
                              if (mins <= 0) return '';
                              const h = Math.floor(mins / 60);
                              const m = mins % 60;
                              return m > 0 ? `${h}h ${m}m` : `${h}h`;
                            })()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic flex-1">No disponible</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Opciones adicionales */}
              <div className="border-t pt-5 space-y-3 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Opciones adicionales</p>
                {[
                  { label: 'Disponible en feriados',             sub: 'Podés recibir OTs los días feriados.',                   val: disponibleFeriados,  set: setDisponibleFeriados },
                  { label: 'Guardias nocturnas',                  sub: 'Aceptás trabajos fuera del horario habitual (20h–8h).', val: guardiaNoct,         set: setGuardiaNoct },
                  { label: 'Disponibilidad 24/7 para urgencias', sub: 'SHUURI puede asignarte OTs críticas en cualquier momento.', val: urgencias24, set: setUrgencias24 },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0D0D0D]">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.sub}</p>
                    </div>
                    <Toggle on={opt.val} onChange={opt.set} size="sm" />
                  </div>
                ))}
              </div>

              {/* Guardar */}
              <button
                onClick={guardarHorarios}
                disabled={guardando}
                className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-60 transition-colors shadow-sm"
              >
                {guardando
                  ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Guardando…</>
                  : <><Save className="h-4 w-4" /> Guardar horarios</>
                }
              </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* SECCIÓN 3 — SINCRONIZACIÓN DE CALENDARIOS                     */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl border bg-white overflow-hidden">
              <button
                onClick={() => setSyncExpanded(e => !e)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2698D1]/10">
                    <CalendarDays className="h-5 w-5 text-[#2698D1]" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[#0D0D0D]">Sincronización de calendarios</p>
                    <p className="text-sm text-gray-400">Conectá tu agenda para evitar conflictos de horario</p>
                  </div>
                </div>
                {syncExpanded
                  ? <ChevronUp className="h-5 w-5 text-gray-400" />
                  : <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </button>

              {syncExpanded && (
                <div className="border-t px-6 pb-6 pt-5 space-y-4 animate-fade-in">
                  <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-4 flex gap-3">
                    <Info className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      Al conectar tu calendario, SHUURI verá tus eventos y{' '}
                      <strong>no te asignará OTs cuando estés ocupado</strong>.
                      Tus eventos personales permanecen privados — solo se lee la disponibilidad.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Chrome,
                        nombre: 'Google Calendar',
                        desc: 'Sincronizá tu Google Calendar para que SHUURI respete tus compromisos. Ideal si ya organizás tus visitas técnicas ahí.',
                        color: 'text-red-500',
                        bg:    'bg-red-50',
                      },
                      {
                        icon: Monitor,
                        nombre: 'Microsoft Outlook / Teams',
                        desc: 'Conectá tu cuenta Microsoft para sincronizar reuniones y bloqueos de tiempo con tu agenda de OTs.',
                        color: 'text-blue-600',
                        bg:    'bg-blue-50',
                      },
                      {
                        icon: Apple,
                        nombre: 'Apple Calendar (iCal)',
                        desc: 'Integración con iCal para usuarios de iPhone y Mac. Tus eventos de Apple Calendar bloquean automáticamente tu disponibilidad.',
                        color: 'text-gray-700',
                        bg:    'bg-gray-100',
                      },
                    ].map(cal => (
                      <div key={cal.nombre} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cal.bg}`}>
                              <cal.icon className={`h-5 w-5 ${cal.color}`} />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#0D0D0D] mb-0.5">{cal.nombre}</p>
                              <p className="text-xs text-gray-400 leading-relaxed">{cal.desc}</p>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              disabled
                              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-400 cursor-not-allowed"
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              Conectar
                            </button>
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                              Próximamente
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
                    <Clock className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-400">Estamos trabajando en estas integraciones</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Serás notificado cuando estén disponibles. Por ahora, usá los horarios habituales para controlar tu disponibilidad.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ── MODAL PAUSA ───────────────────────────────────────────── */}
      {pauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <p className="font-black text-[#0D0D0D]">¿Hasta cuándo no estás disponible?</p>
              <button onClick={() => setPauseModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              {([
                { key: 'hoy',          label: 'Solo hoy',                      sub: 'Volvés a estar disponible mañana.' },
                { key: 'manana',       label: 'Hasta mañana',                  sub: 'Incluye el día de hoy y mañana.' },
                { key: 'semana',       label: 'Toda la semana',                sub: 'Hasta el viernes de esta semana.' },
                { key: 'personalizado',label: 'Elegir fecha',                  sub: '' },
              ] as { key: PauseOption; label: string; sub: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setPauseOption(opt.key)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                    pauseOption === opt.key
                      ? 'border-[#2698D1] bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <p className="text-sm font-bold text-[#0D0D0D]">{opt.label}</p>
                  {opt.sub && <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>}
                  {opt.key === 'personalizado' && pauseOption === 'personalizado' && (
                    <input
                      type="date"
                      value={pauseDate}
                      onChange={e => setPauseDate(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1]"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3 border-t px-6 py-4">
              <button
                onClick={() => setPauseModal(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPausa}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-colors"
              >
                Confirmar pausa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
