"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { CertBadge, formatDate, formatARS } from '@/components/shared/utils';
import { getTecnicoById, getOTsByTecnico, getLiquidacionByOT } from '@/data/mock';
import { RUBRO_LABELS, Rubro } from '@/types/shuuri';
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Shield,
  ShieldOff, ShieldCheck, AlertTriangle, Wrench,
  TrendingUp, Clock, CheckCircle, Lock, Unlock,
  FileText, ChevronDown, ChevronUp,
} from 'lucide-react';

const CERT_COLORS: Record<string, string> = {
  vigente:    'bg-green-50 border border-green-200 text-green-700',
  por_vencer: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
  vencida:    'bg-red-50 border border-red-200 text-red-700',
};

const ESTADO_OT_COLOR: Record<string, string> = {
  NUEVA:                   'bg-blue-100 text-blue-700',
  EN_DIAGNOSTICO:          'bg-purple-100 text-purple-700',
  TECNICO_ASIGNADO:        'bg-indigo-100 text-indigo-700',
  EN_VISITA:               'bg-orange-100 text-orange-700',
  COTIZACION_EMITIDA:      'bg-yellow-100 text-yellow-700',
  AUTORIZADA:              'bg-cyan-100 text-cyan-700',
  EN_EJECUCION:            'bg-blue-100 text-blue-700',
  CERRADA_CONFORME:        'bg-green-100 text-green-700',
  CERRADA_SIN_CONFORMIDAD: 'bg-red-100 text-red-700',
  FACTURADA:               'bg-teal-100 text-teal-700',
  LIQUIDADA:               'bg-gray-100 text-gray-700',
  CANCELADA:               'bg-red-100 text-red-700',
};

export default function AdminTecnicoDetalle({ params }: { params: { id: string } }) {
  const tecnico = getTecnicoById(params.id);
  const [tab, setTab] = useState<'perfil' | 'ots' | 'certs'>('perfil');
  const [bloqueado, setBloqueado] = useState(tecnico?.bloqueado ?? false);
  const [certExpanded, setCertExpanded] = useState<string | null>(null);

  if (!tecnico) return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64 p-8">
        <p className="text-gray-500 mb-4">Técnico no encontrado.</p>
        <Link href="/admin/tecnicos" className="text-[#2698D1] text-sm font-bold">← Volver</Link>
      </div>
    </div>
  );

  const ots        = getOTsByTecnico(tecnico.id);
  const otsActivas = ots.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','LIQUIDADA','CANCELADA','FACTURADA'].includes(o.estado));
  const otsCerradas = ots.filter(o => o.estado === 'CERRADA_CONFORME');
  const ingresoTotal = ots
    .filter(o => ['LIQUIDADA','FACTURADA'].includes(o.estado))
    .reduce((acc, o) => acc + (getLiquidacionByOT(o.id)?.pagoTecnico ?? 0), 0);

  const statusColor = bloqueado
    ? 'bg-red-50 border-red-200 text-red-700'
    : tecnico.certStatusGlobal === 'por_vencer'
      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
      : 'bg-green-50 border-green-200 text-green-700';

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8 max-w-5xl">

          <Link href="/admin/tecnicos"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D0D0D] mb-6 w-fit">
            <ArrowLeft className="h-4 w-4" /> Técnicos
          </Link>

          {/* HEADER */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#0D0D0D] flex items-center justify-center text-white text-xl font-black">
                  {tecnico.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#0D0D0D]">{tecnico.nombre}</h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{tecnico.zona}</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{tecnico.score}</span>
                    <span className="flex items-center gap-1"><Wrench className="h-3.5 w-3.5" />{tecnico.otsCompletadas} completadas</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${statusColor}`}>
                      {bloqueado
                        ? <><ShieldOff className="h-3.5 w-3.5" /> BLOQUEADO</>
                        : tecnico.certStatusGlobal === 'por_vencer'
                          ? <><AlertTriangle className="h-3.5 w-3.5" /> POR VENCER</>
                          : <><ShieldCheck className="h-3.5 w-3.5" /> HABILITADO</>}
                    </span>
                    <span className="text-xs text-gray-400">{tecnico.id}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setBloqueado(b => !b)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${
                  bloqueado ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}>
                {bloqueado ? <><Unlock className="h-4 w-4" />Desbloquear</> : <><Lock className="h-4 w-4" />Bloquear</>}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              {[
                { label: 'OTs activas',     value: otsActivas.length,     icon: Clock,       color: 'text-blue-600' },
                { label: 'OTs cerradas',    value: otsCerradas.length,    icon: CheckCircle, color: 'text-green-600' },
                { label: 'Ingreso acumulado', value: formatARS(ingresoTotal), icon: TrendingUp, color: 'text-[#2698D1]' },
                { label: 'Certificaciones', value: tecnico.certificaciones.length, icon: Shield, color: 'text-purple-600' },
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
            {([
              { key: 'perfil', label: 'Perfil' },
              { key: 'ots',   label: 'Órdenes de trabajo' },
              { key: 'certs', label: 'Certificaciones' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}>{t.label}</button>
            ))}
          </div>

          {/* PERFIL */}
          {tab === 'perfil' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Contacto</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: Mail,  label: 'Email',    val: tecnico.email },
                    { icon: Phone, label: 'Teléfono', val: tecnico.telefono },
                    { icon: MapPin, label: 'Zona',    val: tecnico.zona },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <r.icon className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-500 w-16">{r.label}</span>
                      <span className="font-medium text-[#0D0D0D]">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Rubros habilitados</h2>
                <div className="space-y-2">
                  {tecnico.rubros.map(r => (
                    <div key={r} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-sm font-medium">{RUBRO_LABELS[r]}</span>
                      <CertBadge status={(tecnico.certPorRubro ?? {})[r] ?? 'vencida'} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTS */}
          {tab === 'ots' && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {ots.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Sin órdenes de trabajo registradas.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['OT', 'Restaurante', 'Rubro', 'Estado', 'Fecha', 'Monto', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ots.map(ot => {
                      const liq = getLiquidacionByOT(ot.id);
                      return (
                        <tr key={ot.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono font-bold">{ot.id}</td>
                          <td className="px-4 py-3 text-sm">{ot.restauranteId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{RUBRO_LABELS[ot.rubro as Rubro] ?? ot.rubro}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ESTADO_OT_COLOR[ot.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                              {ot.estado.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ot.fechaCreacion)}</td>
                          <td className="px-4 py-3 text-sm font-medium">{liq ? formatARS(liq.pagoTecnico) : '—'}</td>
                          <td className="px-4 py-3">
                            <Link href="/admin/ots" className="text-xs font-bold text-[#2698D1] hover:underline">Ver OT</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CERTIFICACIONES */}
          {tab === 'certs' && (
            <div className="space-y-3">
              {tecnico.certificaciones.map(cert => {
                const open = certExpanded === cert.id;
                return (
                  <div key={cert.id} className={`rounded-xl border shadow-sm overflow-hidden ${CERT_COLORS[cert.estado] ?? 'bg-gray-50 border-gray-200'}`}>
                    <button className="w-full flex items-center justify-between p-4"
                      onClick={() => setCertExpanded(open ? null : cert.id)}>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 shrink-0" />
                        <div className="text-left">
                          <div className="font-bold text-[#0D0D0D]">{cert.nombre}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{cert.entidadEmisora}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CertBadge status={cert.estado} />
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>
                    {open && (
                      <div className="border-t bg-white p-4 grid grid-cols-3 gap-4 text-sm">
                        <div><div className="text-gray-400 text-xs mb-1">Emisión</div><div className="font-medium">{formatDate(cert.fechaEmision)}</div></div>
                        <div><div className="text-gray-400 text-xs mb-1">Vencimiento</div><div className="font-medium">{formatDate(cert.fechaVencimiento)}</div></div>
                        <div><div className="text-gray-400 text-xs mb-1">Tipo</div><div className="font-medium capitalize">{cert.tipo.replace(/_/g, ' ')}</div></div>
                        <div className="col-span-3">
                          <div className="text-gray-400 text-xs mb-1">Rubros cubiertos</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(cert.rubrosCubiertos ?? []).map(r => (
                              <span key={r} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                {RUBRO_LABELS[r]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
