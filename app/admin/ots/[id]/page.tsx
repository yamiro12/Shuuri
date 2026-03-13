"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatDate, formatARS } from '@/components/shared/utils';
import { getOTById, getRestauranteById, getTecnicoById } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import {
  ArrowLeft, Building2, Wrench, Calendar, MapPin,
  Phone, Mail, Star, Package, ClipboardList,
} from 'lucide-react';

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0 flex items-start justify-between gap-4">
      <span className="text-xs text-gray-400 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium text-[#0D0D0D] text-right">{value || '—'}</span>
    </div>
  );
}

export default function AdminOTDetalle() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const ot      = getOTById(id);

  if (!ot) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FA]">
        <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
        <div className="flex-1 ml-64">
          <Header userRole="SHUURI_ADMIN" userName="Admin" />
          <main className="p-8 text-center">
            <p className="text-gray-500">OT no encontrada.</p>
            <Link href="/admin/ots" className="text-blue-600 text-sm mt-2 inline-block">← Volver a OTs</Link>
          </main>
        </div>
      </div>
    );
  }

  const restaurante = getRestauranteById(ot.restauranteId);
  const tecnico     = ot.tecnicoId ? getTecnicoById(ot.tecnicoId) : null;
  const cot         = ot.cotizacion;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* BREADCRUMB / BACK */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Volver a todas las OTs
          </button>

          {/* HEADER OT */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-mono text-sm text-gray-400">{ot.id}</span>
                  <EstadoBadge estado={ot.estado} />
                  <UrgenciaBadge urgencia={ot.urgencia} />
                </div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">{ot.equipoTipo}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {ot.equipoMarca}
                  {ot.equipoModelo && ` · ${ot.equipoModelo}`}
                  {' · '}
                  <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                    {RUBRO_LABELS[ot.rubro] ?? ot.rubro}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-5">

              {/* FALLA REPORTADA */}
              <section className="rounded-xl border bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="h-4 w-4 text-[#2698D1]" />
                  <h2 className="font-bold text-[#0D0D0D]">Falla reportada</h2>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{ot.descripcionFalla}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Creada: {formatDate(ot.fechaCreacion)}
                  </span>
                  {ot.fechaVisitaProgramada && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Calendar size={12} /> Visita: {formatDate(ot.fechaVisitaProgramada)}
                    </span>
                  )}
                  {ot.fechaFinalizacion && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Calendar size={12} /> Fin: {formatDate(ot.fechaFinalizacion)}
                    </span>
                  )}
                </div>
                {ot.notas && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 italic">
                    "{ot.notas}"
                  </div>
                )}
              </section>

              {/* COTIZACIÓN */}
              {(cot?.totalDefinitivo ?? 0) > 0 && (
                <section className="rounded-xl border bg-white shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-[#2698D1]" />
                    <h2 className="font-bold text-[#0D0D0D]">Cotización</h2>
                  </div>
                  {cot!.diagnosticoTecnico && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 mb-1">Diagnóstico técnico</p>
                      <p className="text-sm text-gray-700">{cot!.diagnosticoTecnico}</p>
                    </div>
                  )}
                  <DataRow label="Estimación (rango)" value={`${formatARS(cot!.estimacionMin)} – ${formatARS(cot!.estimacionMax)}`} />
                  <DataRow label="Mano de obra"       value={formatARS(cot!.manoDeObra)} />
                  <DataRow label="Total definitivo"   value={<span className="font-black text-[#0D0D0D]">{formatARS(cot!.totalDefinitivo ?? 0)}</span>} />
                  <DataRow label="Aprobada fase 1"    value={cot!.aprobadaFase1 ? '✓ Sí' : '✗ No'} />
                  <DataRow label="Aprobada fase 2"    value={cot!.aprobadaFase2 ? '✓ Sí' : '✗ No'} />
                </section>
              )}

            </div>

            {/* COLUMNA DERECHA */}
            <div className="space-y-5">

              {/* RESTAURANTE */}
              <section className="rounded-xl border bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-[#2698D1]" />
                  <h2 className="font-bold text-[#0D0D0D] text-sm">Restaurante</h2>
                </div>
                {restaurante ? (
                  <div className="space-y-2">
                    <p className="font-bold text-[#0D0D0D]">{restaurante.nombre}</p>
                    <p className="text-xs text-gray-400">{restaurante.razonSocial}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                      <MapPin size={11} /> {restaurante.zona}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={11} /> {restaurante.telefono}
                    </div>
                    <Link
                      href={`/admin/restaurantes/${restaurante.id}`}
                      className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
                    >
                      Ver legajo
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Restaurante no encontrado</p>
                )}
              </section>

              {/* TÉCNICO */}
              <section className="rounded-xl border bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-[#2698D1]" />
                  <h2 className="font-bold text-[#0D0D0D] text-sm">Técnico asignado</h2>
                </div>
                {tecnico ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 shrink-0">
                        {tecnico.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0D0D0D] text-sm">{tecnico.nombre}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-gray-400">{tecnico.score} · {tecnico.otsCompletadas} OTs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Mail size={11} /> {tecnico.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={11} /> {tecnico.zona}
                    </div>
                    <Link
                      href={`/admin/tecnicos/${tecnico.id}`}
                      className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
                    >
                      Ver legajo
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Sin técnico asignado</p>
                )}
              </section>

              {/* CONFORMIDAD */}
              {ot.conformidad && (
                <section className="rounded-xl border bg-white shadow-sm p-5">
                  <h2 className="font-bold text-[#0D0D0D] text-sm mb-3">Conformidad</h2>
                  <DataRow label="Firmado por" value={ot.conformidad.nombreFirmante} />
                  <DataRow label="DNI"         value={ot.conformidad.dniFirmante} />
                  {ot.conformidad.comentario && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 italic">
                      "{ot.conformidad.comentario}"
                    </div>
                  )}
                </section>
              )}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
