"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate, formatARS } from '@/components/shared/utils';
import { getProveedorById, OCS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS, Rubro } from '@/types/shuuri';
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Building2,
  Package, TrendingUp, Clock, CheckCircle, Star, Zap,
  CreditCard, Truck,
} from 'lucide-react';

const OC_COLOR: Record<string, string> = {
  PENDIENTE:  'bg-yellow-100 text-yellow-700',
  CONFIRMADA: 'bg-blue-100 text-blue-700',
  DESPACHADA: 'bg-purple-100 text-purple-700',
  ENTREGADA:  'bg-green-100 text-green-700',
  CANCELADA:  'bg-red-100 text-red-700',
};

export default function AdminProveedorDetalle({ params }: { params: { id: string } }) {
  const proveedor = getProveedorById(params.id);
  const [tab, setTab] = useState<'resumen'|'ordenes'|'legajo'>('resumen');

  if (!proveedor) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64 p-8">
        <p className="text-gray-500 mb-4">Proveedor no encontrado.</p>
        <Link href="/admin/proveedores" className="text-[#2698D1] text-sm font-bold">← Volver</Link>
      </div>
    </div>
  );

  const ocs = OCS.filter(oc => oc.proveedorId === proveedor.id);
  const liqs = LIQUIDACIONES.filter(lq => lq.proveedorId === proveedor.id);
  const ocsEntregadas = ocs.filter(oc => oc.estado === 'ENTREGADA');
  const montoTotal = ocs.reduce((a, oc) => a + oc.montoTotal, 0);
  const cobrado = liqs.filter(l => l.estado === 'PAGADA').reduce((a, l) => a + (l.pagoProveedor ?? 0), 0);
  const leg = proveedor.legajo;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8 max-w-5xl">

          <Link href="/admin/proveedores"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D0D0D] mb-6 w-fit">
            <ArrowLeft className="h-4 w-4" /> Proveedores
          </Link>

          {/* HEADER */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#0D0D0D] flex items-center justify-center text-white text-2xl font-black">
                  {proveedor.nombre.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-[#0D0D0D]">{proveedor.nombre}</h1>
                    {proveedor.esShuuriPro && (
                      <span className="flex items-center gap-1 rounded-full bg-[#2698D1] px-3 py-1 text-xs font-bold text-white">
                        <Zap className="h-3 w-3" /> SHUURI Pro
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{proveedor.razonSocial}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Truck className="h-3.5 w-3.5" /> {proveedor.tiempoEntregaHs}hs entrega
                    </span>
                    <span className="text-xs text-gray-400">{proveedor.id}</span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 space-y-1">
                {(proveedor.zonaDespacho ?? []).slice(0,2).map(z => (
                  <div key={z} className="flex items-center gap-1.5 justify-end">
                    <MapPin className="h-3.5 w-3.5" />{z}
                  </div>
                ))}
                {(proveedor.zonaDespacho ?? []).length > 2 && (
                  <div className="text-xs text-gray-400">+{(proveedor.zonaDespacho ?? []).length - 2} zonas más</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              {[
                { label:'Órdenes totales',  value:ocs.length,              icon:Package,      color:'text-blue-600' },
                { label:'Entregadas',       value:ocsEntregadas.length,    icon:CheckCircle,  color:'text-green-600' },
                { label:'Facturado',        value:formatARS(montoTotal),   icon:TrendingUp,   color:'text-[#2698D1]' },
                { label:'Cobrado',          value:formatARS(cobrado),      icon:CreditCard,   color:'text-purple-600' },
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
              { key:'resumen', label:'Resumen' },
              { key:'ordenes', label:'Órdenes de compra' },
              { key:'legajo',  label:'Legajo' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}>{t.label}</button>
            ))}
          </div>

          {/* RESUMEN */}
          {tab === 'resumen' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Datos generales</h2>
                <div className="space-y-3 text-sm">
                  {leg && [
                    { icon:Mail,      label:'Comercial',   val: leg.comercialEmail },
                    { icon:Phone,     label:'Tel. com.',   val: leg.comercialTel },
                    { icon:Globe,     label:'Web',         val: leg.sitioWeb },
                    { icon:Building2, label:'Dirección',   val: leg.domicilioFiscal },
                  ].filter(r => r.val).map(r => (
                    <div key={r.label} className="flex items-start gap-3">
                      <r.icon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-500 w-20 shrink-0">{r.label}</span>
                      <span className="font-medium text-[#0D0D0D] break-all">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Rubros</h2>
                <div className="space-y-2">
                  {proveedor.rubros.map(r => (
                    <div key={r} className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-[#0D0D0D]">
                      {RUBRO_LABELS[r]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 rounded-xl border bg-white shadow-sm p-6">
                <h2 className="font-black text-[#0D0D0D] mb-4">Últimas órdenes</h2>
                {ocs.length === 0 ? <p className="text-sm text-gray-400">Sin órdenes registradas.</p> : (
                  <div className="space-y-2">
                    {ocs.slice(0,5).map(oc => (
                      <div key={oc.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        <span className="font-mono font-bold text-[#0D0D0D]">{oc.id}</span>
                        <span className="text-gray-500 text-xs">OT: {oc.otId}</span>
                        <span className="text-gray-500">{formatARS(oc.montoTotal)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${OC_COLOR[oc.estado] ?? 'bg-gray-100'}`}>
                          {oc.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDENES */}
          {tab === 'ordenes' && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {ocs.length === 0 ? <div className="p-8 text-center text-gray-400">Sin órdenes de compra.</div> : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['OC','OT','Items','Monto','Fecha','Estado',''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ocs.map(oc => (
                      <tr key={oc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono font-bold">{oc.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{oc.otId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{oc.items.length} ítem(s)</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatARS(oc.montoTotal)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(oc.fechaCreacion)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${OC_COLOR[oc.estado] ?? 'bg-gray-100'}`}>
                            {oc.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/proveedor/ordenes/${oc.id}?id=${proveedor.id}`}
                            className="text-xs font-bold text-[#2698D1] hover:underline">Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
                    <div className="font-medium text-[#0D0D0D] break-words">
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </div>
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
