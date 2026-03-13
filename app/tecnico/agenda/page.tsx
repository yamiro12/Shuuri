"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/utils';
import { OTS, getRestauranteById } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  ChevronLeft, ChevronRight, MapPin, Clock,
  Wrench, AlertTriangle, CheckCircle, Calendar,
} from 'lucide-react';

// ─── TÉCNICO SIMULADO (en producción viene del auth) ─────────────────────────
const TECNICO_ID   = 'T002';
const TECNICO_NOMBRE = 'Alejandro Brizuela'; // T002 — Café + Bebidas + Lavado

// ─── HELPERS DE FECHA ─────────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=dom
  const diff = day === 0 ? -6 : 1 - day; // lunes como inicio
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.toLocaleDateString('es-AR', opts)} ${start.getFullYear()}`;
  }
  return `${start.toLocaleDateString('es-AR', opts)} – ${end.toLocaleDateString('es-AR', opts)} ${end.getFullYear()}`;
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DIAS_FULL   = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Franjas horarias de 8:00 a 19:00
const HORAS = Array.from({ length: 12 }, (_, i) => i + 8);

// ─── GENERAR OTs CON FECHAS RELATIVAS A HOY ───────────────────────────────────
// Las fechas del mock son históricas — las reemplazamos con fechas de la semana actual
// para que el calendario tenga contenido visible

function generarOTsConFechasActuales() {
  const hoy   = new Date();
  const lunes = startOfWeek(hoy);

  // OTs del técnico activo en estados que requieren visita
  const estadosActivos = [
    'TECNICO_ASIGNADO', 'EN_VISITA', 'COTIZACION_EMITIDA',
    'AUTORIZADA', 'REPUESTO_SOLICITADO', 'EN_EJECUCION', 'PENDIENTE_CONFORMIDAD',
  ];
  const otsBase = OTS.filter(o =>
    o.tecnicoId === TECNICO_ID && estadosActivos.includes(o.estado)
  );

  // Distribuir en días de la semana con horarios distintos
  const slots = [
    { diaOffset: 0, hora: 9 },   // lunes 9:00
    { diaOffset: 1, hora: 10 },  // martes 10:00
    { diaOffset: 2, hora: 14 },  // miércoles 14:00
    { diaOffset: 3, hora: 9 },   // jueves 9:00
    { diaOffset: 4, hora: 11 },  // viernes 11:00
  ];

  return otsBase.map((ot, idx) => {
    const slot = slots[idx % slots.length];
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + slot.diaOffset);
    fecha.setHours(slot.hora, 0, 0, 0);
    // Duración estimada según urgencia
    const duracionMin = ot.urgencia === 'CRITICA' ? 120 : ot.urgencia === 'ALTA' ? 90 : 60;
    return { ...ot, fechaVisitaReal: fecha, duracionMin };
  });
}

type OTAgenda = ReturnType<typeof generarOTsConFechasActuales>[number];

// ─── COLORES POR URGENCIA ─────────────────────────────────────────────────────
const urgenciaColor: Record<string, { bg: string; border: string; text: string }> = {
  CRITICA: { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700'    },
  ALTA:    { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  MEDIA:   { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-700'   },
  BAJA:    { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-600'   },
};

// ─── MODAL DETALLE OT ────────────────────────────────────────────────────────
function ModalOT({ ot, onClose }: { ot: OTAgenda; onClose: () => void }) {
  const router      = useRouter();
  const restaurante = getRestauranteById(ot.restauranteId);
  const col         = urgenciaColor[ot.urgencia] ?? urgenciaColor.BAJA;
  const horaFin     = new Date(ot.fechaVisitaReal);
  horaFin.setMinutes(horaFin.getMinutes() + ot.duracionMin);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">

        {/* Header coloreado */}
        <div className={`px-6 py-5 ${col.bg} border-b ${col.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400">{ot.id}</p>
              <h3 className="font-black text-[#0D0D0D] mt-0.5">
                {ot.equipoTipo} {ot.equipoMarca}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{RUBRO_LABELS[ot.rubro as Rubro]}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <UrgenciaBadge urgencia={ot.urgencia} />
              <EstadoBadge estado={ot.estado} />
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 space-y-4">

          {/* Hora y duración */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <Clock className="h-4 w-4 text-[#2698D1] shrink-0" />
            <div>
              <p className="text-sm font-black text-[#0D0D0D]">
                {ot.fechaVisitaReal.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                {' '}→{' '}
                {horaFin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-400">{ot.duracionMin} minutos estimados</p>
            </div>
          </div>

          {/* Restaurante / dirección */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <MapPin className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-[#0D0D0D]">{restaurante?.nombre}</p>
              <p className="text-xs text-gray-400">{restaurante?.direccion}</p>
              <p className="text-xs text-gray-400">{restaurante?.zona}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <Wrench className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">{ot.descripcionFalla}</p>
          </div>

          {/* Cotización fase 1 */}
          {ot.cotizacion?.estimacionMin > 0 && (
            <div className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-xs font-bold text-gray-400 mb-1">Estimación previa</p>
              <p className="text-sm font-black text-[#0D0D0D]">
                USD {ot.cotizacion.estimacionMin} – {ot.cotizacion.estimacionMax}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={() => { onClose(); router.push(`/tecnico/ots/${ot.id}?id=${TECNICO_ID}`); }}
            className="flex-1 rounded-lg bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90"
          >
            Ir a la OT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function TecnicoAgenda() {
  const hoy         = new Date();
  const [semanaBase, setSemanaBase] = useState(() => startOfWeek(hoy));
  const [otModal,    setOtModal]    = useState<OTAgenda | null>(null);
  const [vista,      setVista]      = useState<'semana' | 'lista'>('semana');

  const otsAgenda = useMemo(() => generarOTsConFechasActuales(), []);

  const diasSemana = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(semanaBase, i)),
    [semanaBase]
  );

  function otsDel(dia: Date) {
    return otsAgenda.filter(o => sameDay(o.fechaVisitaReal, dia));
  }

  function posicionEnGrid(hora: number, minutos: number) {
    // Cada hora = 60px. Top relativo a las 8:00
    return (hora - 8) * 60 + minutos;
  }

  const semanaActual = sameDay(semanaBase, startOfWeek(hoy));

  // Stats de la semana
  const otsSemana     = otsAgenda.filter(o => diasSemana.some(d => sameDay(o.fechaVisitaReal, d)));
  const otsCriticas   = otsSemana.filter(o => o.urgencia === 'CRITICA').length;
  const minutosTotal  = otsSemana.reduce((s, o) => s + o.duracionMin, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="TECNICO" userName={TECNICO_NOMBRE} />
      <div className="flex-1 ml-64">
        <Header userRole="TECNICO" userName={TECNICO_NOMBRE} />
        <main className="p-8">

          {/* TÍTULO + NAVEGACIÓN */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mi agenda</h1>
              <p className="text-gray-400 text-sm">{formatWeekRange(semanaBase)}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats rápidos */}
              <div className="flex items-center gap-4 rounded-xl border bg-white px-4 py-2.5 shadow-sm">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Esta semana</p>
                  <p className="font-black text-[#0D0D0D]">{otsSemana.length} OTs</p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div className="text-center">
                  <p className="text-xs text-gray-400">Tiempo est.</p>
                  <p className="font-black text-[#0D0D0D]">{Math.round(minutosTotal / 60)}hs</p>
                </div>
                {otsCriticas > 0 && (
                  <>
                    <div className="h-8 w-px bg-gray-100" />
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <p className="font-black text-red-600">{otsCriticas} crítica{otsCriticas > 1 ? 's' : ''}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Vista toggle */}
              <div className="flex rounded-lg border bg-white overflow-hidden">
                {(['semana', 'lista'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setVista(v)}
                    className={`px-4 py-2 text-sm font-bold transition-colors capitalize ${
                      vista === v ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {v === 'semana' ? 'Semana' : 'Lista'}
                  </button>
                ))}
              </div>

              {/* Navegación semanas */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSemanaBase(s => addDays(s, -7))}
                  className="rounded-lg border bg-white p-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                {!semanaActual && (
                  <button
                    onClick={() => setSemanaBase(startOfWeek(hoy))}
                    className="rounded-lg border bg-white px-3 py-2 text-xs font-bold text-[#2698D1] hover:bg-gray-50"
                  >
                    Hoy
                  </button>
                )}
                <button
                  onClick={() => setSemanaBase(s => addDays(s, 7))}
                  className="rounded-lg border bg-white p-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* ── VISTA SEMANA ── */}
          {vista === 'semana' && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">

              {/* Header días */}
              <div className="grid border-b" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                <div className="border-r bg-gray-50" />
                {diasSemana.map((dia, i) => {
                  const esHoy     = sameDay(dia, hoy);
                  const otsDelDia = otsDel(dia);
                  return (
                    <div
                      key={i}
                      className={`border-r px-2 py-3 text-center last:border-r-0 ${esHoy ? 'bg-[#2698D1]/5' : 'bg-gray-50'}`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-wide ${esHoy ? 'text-[#2698D1]' : 'text-gray-400'}`}>
                        {DIAS_SEMANA[i]}
                      </p>
                      <p className={`text-lg font-black mt-0.5 ${esHoy ? 'text-[#2698D1]' : 'text-[#0D0D0D]'}`}>
                        {dia.getDate()}
                      </p>
                      {otsDelDia.length > 0 && (
                        <div className="mt-1 flex justify-center gap-1">
                          {otsDelDia.map(o => (
                            <div
                              key={o.id}
                              className={`h-1.5 w-1.5 rounded-full ${
                                o.urgencia === 'CRITICA' ? 'bg-red-500' :
                                o.urgencia === 'ALTA'    ? 'bg-orange-400' :
                                'bg-[#2698D1]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid horario */}
              <div className="relative overflow-y-auto" style={{ maxHeight: '600px' }}>
                <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>

                  {/* Columna horas */}
                  <div className="border-r">
                    {HORAS.map(h => (
                      <div key={h} className="flex items-start justify-end pr-2 border-b" style={{ height: 60 }}>
                        <span className="text-xs text-gray-300 font-medium mt-1">{h}:00</span>
                      </div>
                    ))}
                  </div>

                  {/* Columnas días */}
                  {diasSemana.map((dia, diaIdx) => {
                    const esHoy     = sameDay(dia, hoy);
                    const otsDelDia = otsDel(dia);
                    return (
                      <div
                        key={diaIdx}
                        className={`relative border-r last:border-r-0 ${esHoy ? 'bg-[#2698D1]/3' : ''}`}
                        style={{ height: 60 * HORAS.length }}
                      >
                        {/* Líneas de hora */}
                        {HORAS.map(h => (
                          <div key={h} className="absolute w-full border-b border-gray-50" style={{ top: (h - 8) * 60 }} />
                        ))}

                        {/* Línea "ahora" */}
                        {esHoy && (() => {
                          const ahora  = new Date();
                          const top    = (ahora.getHours() - 8) * 60 + ahora.getMinutes();
                          if (top < 0 || top > 60 * HORAS.length) return null;
                          return (
                            <div
                              className="absolute left-0 right-0 z-10 flex items-center"
                              style={{ top }}
                            >
                              <div className="h-2 w-2 rounded-full bg-[#2698D1] -ml-1 shrink-0" />
                              <div className="flex-1 h-px bg-[#2698D1]" />
                            </div>
                          );
                        })()}

                        {/* Bloques OT */}
                        {otsDelDia.map(ot => {
                          const top    = posicionEnGrid(ot.fechaVisitaReal.getHours(), ot.fechaVisitaReal.getMinutes());
                          const height = Math.max(ot.duracionMin, 30);
                          const col    = urgenciaColor[ot.urgencia] ?? urgenciaColor.BAJA;
                          return (
                            <button
                              key={ot.id}
                              onClick={() => setOtModal(ot)}
                              className={`absolute left-1 right-1 rounded-lg border-l-4 px-2 py-1.5 text-left transition-all hover:opacity-90 hover:shadow-md overflow-hidden ${col.bg} ${col.border}`}
                              style={{ top: top + 2, height: height - 4 }}
                            >
                              <p className={`text-xs font-black truncate ${col.text}`}>
                                {ot.equipoTipo}
                              </p>
                              {height >= 50 && (
                                <p className="text-xs text-gray-500 truncate">{ot.id}</p>
                              )}
                              {height >= 70 && (
                                <p className="text-xs text-gray-400 truncate">
                                  {ot.fechaVisitaReal.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── VISTA LISTA ── */}
          {vista === 'lista' && (
            <div className="space-y-4">
              {diasSemana.map((dia, diaIdx) => {
                const otsDelDia = otsDel(dia);
                const esHoy     = sameDay(dia, hoy);
                if (otsDelDia.length === 0 && !esHoy) return null;
                return (
                  <div key={diaIdx}>
                    {/* Label día */}
                    <div className={`mb-2 flex items-center gap-3`}>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-black text-sm ${
                        esHoy ? 'bg-[#2698D1] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {dia.getDate()}
                      </div>
                      <p className={`font-black ${esHoy ? 'text-[#2698D1]' : 'text-gray-500'}`}>
                        {DIAS_FULL[diaIdx]}
                        {esHoy && <span className="ml-2 text-xs font-bold text-[#2698D1]">— Hoy</span>}
                      </p>
                    </div>

                    {otsDelDia.length === 0 ? (
                      <div className="ml-12 rounded-xl border border-dashed border-gray-200 py-4 text-center text-xs text-gray-300">
                        Sin visitas programadas
                      </div>
                    ) : (
                      <div className="ml-12 space-y-2">
                        {otsDelDia.map(ot => {
                          const restaurante = getRestauranteById(ot.restauranteId);
                          const col         = urgenciaColor[ot.urgencia] ?? urgenciaColor.BAJA;
                          const horaFin     = new Date(ot.fechaVisitaReal);
                          horaFin.setMinutes(horaFin.getMinutes() + ot.duracionMin);
                          return (
                            <button
                              key={ot.id}
                              onClick={() => setOtModal(ot)}
                              className={`w-full rounded-xl border-l-4 bg-white px-4 py-4 text-left shadow-sm hover:shadow-md transition-shadow ${col.border}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-400">{ot.id}</span>
                                    <UrgenciaBadge urgencia={ot.urgencia} />
                                    <EstadoBadge estado={ot.estado} />
                                  </div>
                                  <p className="font-black text-[#0D0D0D]">
                                    {ot.equipoTipo} {ot.equipoMarca}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {RUBRO_LABELS[ot.rubro as Rubro]}
                                  </p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                  <div className="flex items-center gap-1.5 justify-end">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-sm font-black text-[#0D0D0D]">
                                      {ot.fechaVisitaReal.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">{ot.duracionMin}min est.</p>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{restaurante?.nombre} · {restaurante?.zona}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {otsSemana.length === 0 && (
                <div className="rounded-xl border bg-white py-16 text-center">
                  <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                  <p className="font-bold text-gray-400">Sin visitas esta semana</p>
                  <p className="text-xs text-gray-300 mt-1">Navegá a otra semana o esperá nuevas asignaciones</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* MODAL */}
      {otModal && (
        <ModalOT ot={otModal} onClose={() => setOtModal(null)} />
      )}
    </div>
  );
}
