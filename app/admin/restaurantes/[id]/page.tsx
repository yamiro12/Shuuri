"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate, formatARS } from '@/components/shared/utils';
import { getRestauranteById, getOTsByRestaurante, getEquiposByRestaurante } from '@/data/mock';
import { RUBRO_LABELS, Rubro } from '@/types/shuuri';
import {
  ArrowLeft, MapPin, Phone, Mail, Building2, CreditCard,
  Clock, CheckCircle, Package, TrendingUp, AlertTriangle,
} from 'lucide-react';

const TIER_COLOR: Record<string, string> = {
  FREEMIUM:      'bg-gray-100 text-gray-700',
  CADENA_CHICA:  'bg-blue-100 text-blue-700',
  CADENA_GRANDE: 'bg-purple-100 text-purple-700',
};
const OT_COLOR: Record<string, string> = {
  NUEVA:'bg-blue-100 text-blue-700', EN_DIAGNOSTICO:'bg-purple-100 text-purple-700',
  TECNICO_ASIGNADO:'bg-indigo-100 text-indigo-700', EN_VISITA:'bg-orange-100 text-orange-700',
  COTIZACION_EMITIDA:'bg-yellow-100 text-yellow-700', AUTORIZADA:'bg-cyan-100 text-cyan-700',
  EN_EJECUCION:'bg-blue-100 text-blue-700', CERRADA_CONFORME:'bg-green-100 text-green-700',
  CERRADA_SIN_CONFORMIDAD:'bg-red-100 text-red-700', FACTURADA:'bg-teal-100 text-teal-700',
  LIQUIDADA:'bg-gray-100 text-gray-700', CANCELADA:'bg-red-100 text-red-700',
};
const EQ_COLOR: Record<string, string> = {
  operativo:'bg-green-100 text-green-700',
  en_servicio:'bg-yellow-100 text-yellow-700',
  fuera_de_servicio:'bg-red-100 text-red-700',
  dado_de_baja:'bg-gray-100 text-gray-600',
};

export default function AdminRestauranteDetalle({ params }: { params: { id: string } }) {
  const restaurante = getRestauranteById(params.id);
  const [tab, setTab] = useState<'resumen'|'ots'|'equipos'|'legajo'>('resumen');

  if (!restaurante) return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 sidebar-push p-8">
        <p className="text-gray-500 mb-4">Gastronómico no encontrado.</p>
        <Link href="/admin/restaurantes" className="text-[#2698D1] text-sm font-bold">← Volver</Link>
      </div>
    </div>
  );

  const ots     = getOTsByRestaurante(restaurante.id);
  const equipos = getEquiposByRestaurante(restaurante.id);
  const abiertas = ots.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','LIQUIDADA','CANCELADA','FACTURADA'].includes(o.estado));
  const cerradas = ots.filter(o => o.estado === 'CERRADA_CONFORME');
  const eqOk     = equipos.filter(e => e.estado === 'operativo');
  // FIX: cotizacion.totalDefinitivo (no cotizacionFinal)
  const facturado = ots.reduce((a, o) => a + (o.cotizacion?.totalDefinitivo ?? 0), 0);
  const leg = restaurante.legajo;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 sidebar-push">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8 max-w-5xl">

          <Link href="/admin/restaurantes"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D0D0D] mb-6 w-fit">
            <ArrowLeft className="h-4 w-4" /> Gastronómicos
          </Link>

          {/* HEADER */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#0D0D0D] flex items-center justify-center text-white text-2xl font-black">
                  {restaurante.nombre.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#0D0D0D]">{restaurante.nombre}</h1>
                  <p className="text-sm text-gray-500">{restaurante.razonSocial}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${TIER_COLOR[restaurante.tier ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                      {restaurante.tier}
                    </span>
                    {(restaurante.cantidadLocales ?? 0) > 1 && (
                      <span className="text-xs text-gray-500">{restaurante.cantidadLocales} locales</span>
                    )}
                    <span className="text-xs text-gray-400">{restaurante.id}</span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5 justify-end"><MapPin className="h-3.5 w-3.5" />{restaurante.zona}</div>
                <div className="flex items-center gap-1.5 justify-end"><Phone className="h-3.5 w-3.5" />{restaurante.telefono}</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              {[
                { label:'OTs abiertas',   value:abiertas.length,               icon:Clock,       color:'text-blue-600' },
                { label:'OTs cerradas',   value:cerradas.length,               icon:CheckCircle, color:'text-green-600' },
                { label:'Equipos OK',     value:`${eqOk.length}/${equipos.length}`, icon:Package, color:'text-[#2698D1]' },
                { label:'Facturado',      value:formatARS(facturado),          icon:TrendingUp,  color:'text-purple-600' },
              ].map(k => (
                <div key={k.label} className="rounded-lg bg-gray-50 p-4">
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${k.color} mb-1`}>
                    <k.icon className="h-3.5 w-3.5" />{k.label}
                  </div>
                  <div className="text-xl font-black text-[#0D0D0D]">{k.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-1 rounded-lg border bg-white p-1 mb-6 w-fit">
            {(['resumen','ots','equipos','legajo'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-md px-4 py-2 text-sm font-bold capitalize transition-colors ${
                  tab === t ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}>{t === 'ots' ? 'Órdenes' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>

          {/* RESUMEN */}
          {tab === 'resumen' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Contacto</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { icon:Building2, label:'Dirección',   val:restaurante.direccion },
                    { icon:Phone,     label:'Teléfono',    val:restaurante.telefono },
                    { icon:Mail,      label:'Responsable', val:restaurante.contactoNombre },
                    { icon:CreditCard,label:'CUIT',        val:restaurante.cuit },
                  ].map(r => (
                    <div key={r.label} className="flex items-start gap-3">
                      <r.icon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-500 w-24 shrink-0">{r.label}</span>
                      <span className="font-medium text-[#0D0D0D]">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Últimas OTs</h2>
                {ots.length === 0 ? <p className="text-sm text-gray-400">Sin órdenes.</p> : (
                  <div className="space-y-2">
                    {ots.slice(0,5).map(ot => (
                      <div key={ot.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        <span className="font-mono font-bold text-[#0D0D0D]">{ot.id}</span>
                        <span className="text-gray-500 text-xs">{RUBRO_LABELS[ot.rubro as Rubro] ?? ot.rubro}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${OT_COLOR[ot.estado] ?? 'bg-gray-100'}`}>
                          {ot.estado.replace(/_/g,' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Equipos</h2>
                {equipos.length === 0 ? <p className="text-sm text-gray-400">Sin equipos.</p> : (
                  <div className="grid grid-cols-3 gap-3">
                    {equipos.map(eq => (
                      <div key={eq.id} className="rounded-lg border bg-gray-50 p-3">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-bold text-[#0D0D0D]">{eq.tipo}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${EQ_COLOR[eq.estado ?? 'operativo'] ?? 'bg-gray-100'}`}>
                            {(eq.estado ?? 'operativo').replace(/_/g,' ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{eq.marca} {eq.modelo}</div>
                        {(eq.estado ?? '') === 'fuera_de_servicio' && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium">
                            <AlertTriangle className="h-3 w-3" /> Requiere atención
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OTS */}
          {tab === 'ots' && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {ots.length === 0 ? <div className="p-8 text-center text-gray-400">Sin OTs.</div> : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['OT','Rubro','Estado','Técnico','Fecha','Monto',''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ots.map(ot => (
                      <tr key={ot.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono font-bold">{ot.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{RUBRO_LABELS[ot.rubro as Rubro] ?? ot.rubro}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${OT_COLOR[ot.estado] ?? 'bg-gray-100'}`}>
                            {ot.estado.replace(/_/g,' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{ot.tecnicoId ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ot.fechaCreacion)}</td>
                        {/* FIX: cotizacion.totalDefinitivo en lugar de cotizacionFinal */}
                        <td className="px-4 py-3 text-sm font-medium">
                          {ot.cotizacion?.totalDefinitivo ? formatARS(ot.cotizacion.totalDefinitivo) : '—'}
                        </td>
                        <td className="px-4 py-3"><Link href="/admin/ots" className="text-xs font-bold text-[#2698D1] hover:underline">Ver</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* EQUIPOS */}
          {tab === 'equipos' && (
            <div className="grid grid-cols-2 gap-4">
              {equipos.length === 0 ? <p className="text-sm text-gray-400">Sin equipos.</p> :
                equipos.map(eq => (
                  <div key={eq.id} className="rounded-xl border bg-white shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-black text-[#0D0D0D]">{eq.tipo}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{eq.marca} {eq.modelo}</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${EQ_COLOR[eq.estado ?? 'operativo'] ?? 'bg-gray-100'}`}>
                        {(eq.estado ?? 'operativo').replace(/_/g,' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      {/* FIX: serie (no nroSerie), anioInstalacion (no anoFabricacion), sin ubicacionEnLocal */}
                      {eq.serie && <div><span className="font-medium">Serie: </span>{eq.serie}</div>}
                      {eq.anioInstalacion && <div><span className="font-medium">Instalación: </span>{eq.anioInstalacion}</div>}
                      {eq.garantiaVigente !== undefined && (
                        <div><span className="font-medium">Garantía: </span>{eq.garantiaVigente ? 'Vigente' : 'Vencida'}</div>
                      )}
                      {eq.fechaUltimoServicio && (
                        <div><span className="font-medium">Último servicio: </span>{formatDate(eq.fechaUltimoServicio)}</div>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* LEGAJO */}
          {tab === 'legajo' && leg && (
            <div className="rounded-xl border bg-white shadow-sm p-6">
              <h2 className="font-black text-[#0D0D0D] mb-6">Legajo completo</h2>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-sm">
                {Object.entries(leg).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-gray-400 text-xs mb-0.5 capitalize">{k.replace(/([A-Z])/g,' $1').trim()}</div>
                    <div className="font-medium text-[#0D0D0D] break-words">{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
