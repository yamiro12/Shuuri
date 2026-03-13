'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Clock, AlertTriangle, CheckCircle2,
  Wrench, Package, Star,
  ThumbsUp, ThumbsDown,
  Info, Calendar, MapPin, Zap, Phone,
} from 'lucide-react';
import { getOTById, getTecnicoById } from '@/data/mock';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import { RUBRO_LABELS } from '@/types/shuuri';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function PriceTag({ label, value, sub, color = 'gray' }: {
  label: string; value: string; sub?: string;
  color?: 'gray' | 'amber' | 'green' | 'blue';
}) {
  const colors = {
    gray:  'bg-gray-50 border-gray-200 text-gray-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue:  'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${colors[color]}`}>
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

function TimelineDot({ active, done, warn }: { active?: boolean; done?: boolean; warn?: boolean }) {
  if (done)   return <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><CheckCircle2 size={10} className="text-white" /></div>;
  if (active) return <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 flex-shrink-0" />;
  if (warn)   return <div className="w-4 h-4 rounded-full bg-amber-400 flex-shrink-0" />;
  return <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />;
}

function TimelineStep({
  dot, label, sub, done, active, last, children,
}: {
  dot: React.ReactNode;
  label: string;
  sub?: string;
  done?: boolean;
  active?: boolean;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex gap-4 ${last ? '' : 'pb-6'}`}>
      <div className="flex flex-col items-center">
        <div className="mt-1">{dot}</div>
        {!last && <div className="w-0.5 bg-gray-100 flex-1 mt-2" />}
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-baseline gap-2">
          <p className={`text-sm font-semibold ${done ? 'text-green-700' : active ? 'text-blue-700' : 'text-gray-400'}`}>
            {label}
          </p>
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── ESTADO → FASE ───────────────────────────────────────────────────────────

type Fase = 'reporte' | 'fase1' | 'diagnostico' | 'fase2' | 'ejecucion' | 'cierre';

const FASE_MAP: Record<string, Fase> = {
  NUEVA:                         'reporte',
  EN_DIAGNOSTICO:                'reporte',
  APROBADA_PENDIENTE_ASIGNACION: 'fase1',
  TECNICO_ASIGNADO:              'fase1',
  EN_VISITA:                     'diagnostico',
  COTIZACION_EMITIDA:            'fase2',
  AUTORIZADA:                    'fase2',
  REPUESTO_SOLICITADO:           'ejecucion',
  EN_EJECUCION:                  'ejecucion',
  PENDIENTE_CONFORMIDAD:         'cierre',
  CERRADA_CONFORME:              'cierre',
  CERRADA_SIN_CONFORMIDAD:       'cierre',
  FACTURADA:                     'cierre',
  LIQUIDADA:                     'cierre',
  CANCELADA:                     'cierre',
};

const FASES_ORDEN: Fase[] = ['reporte', 'fase1', 'diagnostico', 'fase2', 'ejecucion', 'cierre'];

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function RestauranteOTDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ot = getOTById(id);

  const [cotAprobadaLocal, setCotAprobadaLocal] = useState(false);
  const [conformidadFirmada, setConformidadFirmada] = useState(false);

  if (!ot) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">OT no encontrada.</p>
        <Link href="/restaurante/ots" className="text-blue-600 text-sm mt-2 inline-block">← Volver</Link>
      </div>
    );
  }

  const tecnico    = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
  const cot        = ot.cotizacion;
  const faseActual = FASE_MAP[ot.estado] ?? 'reporte';
  const faseIdx    = FASES_ORDEN.indexOf(faseActual);

  const tieneEstimacion          = (cot?.estimacionMin ?? 0) > 0;
  const tieneCotizacion          = (cot?.totalDefinitivo ?? 0) > 0;
  const aprobadaFase2            = (cot?.aprobadaFase2 ?? false) || cotAprobadaLocal;
  const pendienteAprobacionFase2 = faseActual === 'fase2' && !aprobadaFase2;
  const slaBreach                = ot.slaBreachAt && new Date(ot.slaBreachAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Volver a Mis OTs
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm text-gray-400">{ot.id}</span>
                <EstadoBadge estado={ot.estado} />
                <UrgenciaBadge urgencia={ot.urgencia} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{ot.equipoTipo}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {ot.equipoMarca}
                {ot.equipoModelo && ` · ${ot.equipoModelo}`}
                {' · '}
                <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                  {RUBRO_LABELS[ot.rubro] ?? ot.rubro}
                </span>
              </p>
            </div>
            {slaBreach && (
              <div className="flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg border border-red-200">
                <Zap size={13} /> SLA vencido
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">

        {/* FALLA REPORTADA */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Falla reportada</h2>
          <p className="text-gray-800 leading-relaxed">{ot.descripcionFalla}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(ot.fechaCreacion)}
            </span>
            {ot.fechaVisitaProgramada && (
              <span className="flex items-center gap-1 text-blue-600">
                <Clock size={12} /> Visita: {formatDate(ot.fechaVisitaProgramada)}
              </span>
            )}
          </div>
        </section>

        {/* TIMELINE DOS FASES */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Proceso de la OT</h2>

          <div className="relative">
            <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-100" />
            <div className="space-y-0">

              {/* PASO 1 — REPORTE */}
              <TimelineStep
                dot={<TimelineDot done={faseIdx >= 1} active={faseIdx === 0} />}
                label="Reporte recibido"
                sub={formatDate(ot.fechaCreacion)}
                done={faseIdx >= 1}
                active={faseIdx === 0}
              />

              {/* PASO 2 — ESTIMACIÓN PREVIA */}
              <TimelineStep
                dot={<TimelineDot done={faseIdx >= 2 || (faseIdx >= 1 && tieneEstimacion)} active={faseIdx === 1 && !tieneEstimacion} warn={faseIdx === 1 && tieneEstimacion} />}
                label="Estimación previa"
                sub={tieneEstimacion ? formatDate(cot?.fechaEstimacion ?? '') : 'Pendiente de visita'}
                done={faseIdx >= 2 && tieneEstimacion}
                active={faseIdx <= 1}
              >
                {tieneEstimacion && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>Estimación referencial:</strong> calculada antes de la visita técnica, basada en la descripción del problema. El valor definitivo puede variar según el diagnóstico en sitio.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <PriceTag label="Estimación mínima" value={formatARS(cot!.estimacionMin)} sub="escenario optimista" color="amber" />
                      <PriceTag label="Estimación máxima" value={formatARS(cot!.estimacionMax)} sub="escenario complejo" color="amber" />
                    </div>
                    {cot?.aprobadaFase1 && (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                        <CheckCircle2 size={13} /> Estimación aceptada — técnico autorizado a realizar visita
                      </div>
                    )}
                  </div>
                )}
              </TimelineStep>

              {/* PASO 3 — DIAGNÓSTICO */}
              <TimelineStep
                dot={<TimelineDot done={faseIdx >= 3} active={faseIdx === 2} />}
                label="Diagnóstico en sitio"
                sub={
                  faseIdx >= 3
                    ? (cot?.fechaEmisionCotizacion ? `Completado ${formatDate(cot.fechaEmisionCotizacion)}` : 'Completado')
                    : faseIdx === 2 ? 'Técnico en visita' : 'Pendiente de visita'
                }
                done={faseIdx >= 3}
                active={faseIdx === 2}
              >
                {cot?.diagnosticoTecnico && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Informe del técnico</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{cot.diagnosticoTecnico}</p>
                  </div>
                )}
              </TimelineStep>

              {/* PASO 4 — COTIZACIÓN DEFINITIVA */}
              <TimelineStep
                dot={<TimelineDot done={aprobadaFase2} active={faseIdx === 3 && !aprobadaFase2} warn={pendienteAprobacionFase2} />}
                label="Cotización definitiva"
                sub={
                  tieneCotizacion
                    ? (aprobadaFase2 ? `Aprobada ${formatDate(cot?.fechaEmisionCotizacion ?? '')}` : 'Esperando tu aprobación')
                    : 'Pendiente de diagnóstico'
                }
                done={aprobadaFase2}
                active={faseIdx === 3 && !aprobadaFase2}
              >
                {tieneCotizacion && (
                  <div className="mt-2 space-y-3">

                    {(cot?.itemsRepuestos?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                          <Package size={12} /> Repuestos y materiales
                        </p>
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                          {cot!.itemsRepuestos.map((item, i) => (
                            <div key={item.id} className={`flex items-center justify-between px-3 py-2 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <span className="text-gray-700 flex-1">{item.descripcion}</span>
                              <span className="text-gray-400 text-xs mx-3">×{item.cantidad}</span>
                              <span className="font-medium text-gray-800">{formatARS(item.precioUnitario * item.cantidad)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                      <span className="text-gray-600 flex items-center gap-1.5"><Wrench size={13} /> Mano de obra</span>
                      <span className="font-medium text-gray-800">{formatARS(cot!.manoDeObra)}</span>
                    </div>

                    <PriceTag
                      label="Total definitivo"
                      value={formatARS(cot!.totalDefinitivo ?? 0)}
                      sub="precio final confirmado post-diagnóstico"
                      color={aprobadaFase2 ? 'green' : 'blue'}
                    />

                    {tieneEstimacion && cot?.totalDefinitivo != null && (() => {
                      const midEst = (cot.estimacionMin + cot.estimacionMax) / 2;
                      const diff   = cot.totalDefinitivo - midEst;
                      const pct    = Math.round((diff / midEst) * 100);
                      const dentro = cot.totalDefinitivo >= cot.estimacionMin && cot.totalDefinitivo <= cot.estimacionMax;
                      return (
                        <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border ${
                          dentro
                            ? 'bg-green-50 border-green-100 text-green-700'
                            : Math.abs(pct) <= 20
                              ? 'bg-amber-50 border-amber-100 text-amber-700'
                              : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                          {dentro ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                          {dentro
                            ? 'Cotización dentro del rango estimado'
                            : `Cotización ${pct > 0 ? '+' : ''}${pct}% vs. estimación inicial`
                          }
                        </div>
                      );
                    })()}

                    {pendienteAprobacionFase2 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setCotAprobadaLocal(true)}
                          className="flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors">
                          <ThumbsUp size={15} /> Aprobar trabajo
                        </button>
                        <button
                          onClick={() => router.back()}
                          className="flex items-center justify-center gap-2 bg-white text-red-600 text-sm font-semibold py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                          <ThumbsDown size={15} /> Rechazar
                        </button>
                      </div>
                    )}

                    {aprobadaFase2 && (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                        <CheckCircle2 size={13} /> Aprobado — trabajo autorizado
                      </div>
                    )}
                  </div>
                )}
              </TimelineStep>

              {/* PASO 5 — EJECUCIÓN */}
              <TimelineStep
                dot={<TimelineDot done={faseIdx >= 5} active={faseIdx === 4} />}
                label="Ejecución del trabajo"
                sub={faseIdx >= 5 ? 'Completado' : faseIdx === 4 ? 'En proceso' : 'Pendiente de aprobación'}
                done={faseIdx >= 5}
                active={faseIdx === 4}
              />

              {/* PASO 6 — CIERRE */}
              <TimelineStep
                dot={
                  <TimelineDot
                    done={['CERRADA_CONFORME', 'FACTURADA', 'LIQUIDADA'].includes(ot.estado)}
                    active={faseIdx === 5 && ot.estado !== 'CERRADA_CONFORME'}
                    warn={ot.estado === 'CERRADA_SIN_CONFORMIDAD'}
                  />
                }
                label="Cierre y conformidad"
                sub={
                  ot.estado === 'CERRADA_CONFORME'        ? `Conforme — ${formatDate(ot.fechaFinalizacion ?? '')}` :
                  ot.estado === 'CERRADA_SIN_CONFORMIDAD'  ? 'Cerrado sin conformidad' :
                  faseIdx === 5                            ? 'Pendiente de firma' : 'Pendiente'
                }
                done={['CERRADA_CONFORME', 'FACTURADA', 'LIQUIDADA'].includes(ot.estado)}
                active={faseIdx === 5}
                last
              >
                {ot.conformidad && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Firmado por</p>
                    <p className="text-gray-800">{ot.conformidad.nombreFirmante}</p>
                    {ot.conformidad.comentario && (
                      <p className="text-gray-500 text-xs mt-1 italic">"{ot.conformidad.comentario}"</p>
                    )}
                  </div>
                )}
                {ot.estado === 'PENDIENTE_CONFORMIDAD' && !conformidadFirmada && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500">El técnico finalizó el trabajo. ¿Confirmás que quedó resuelto?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConformidadFirmada(true)}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors">
                        <CheckCircle2 size={14} /> Dar conformidad
                      </button>
                      <button
                        onClick={() => setConformidadFirmada(true)}
                        className="flex items-center justify-center gap-2 bg-white text-red-600 text-sm font-semibold py-2.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                        <ThumbsDown size={14} /> Sin conformidad
                      </button>
                    </div>
                  </div>
                )}
                {conformidadFirmada && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                    <CheckCircle2 size={13} /> Conformidad registrada
                  </div>
                )}
              </TimelineStep>

            </div>
          </div>
        </section>

        {/* TÉCNICO ASIGNADO */}
        {tecnico && (
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Técnico asignado</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {tecnico.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{tecnico.nombre}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12} className="text-gray-200 fill-gray-200" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{tecnico.otsCompletadas} OTs completadas</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={11} /> {tecnico.zona}
                </p>
              </div>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl border border-blue-100 transition-colors flex-shrink-0">
                <Phone size={13} /> Contactar
              </button>
            </div>
          </section>
        )}

        {/* NOTAS */}
        {ot.notas && (
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notas internas</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{ot.notas}</p>
          </section>
        )}

      </div>
    </div>
  );
}
