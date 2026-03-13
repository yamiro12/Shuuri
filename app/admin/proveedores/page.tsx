"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES, OCS, LIQUIDACIONES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import { Search, X, ChevronDown, Package, Star, CheckCircle, Clock } from 'lucide-react';

type Proveedor = typeof PROVEEDORES[number];

export default function AdminProveedores() {
  const [busqueda,   setBusqueda]   = useState('');
  const [filtroRubro, setFiltroRubro] = useState('');
  const [expandido,  setExpandido]  = useState<string | null>(null);

  // Enriquecer cada proveedor con métricas calculadas del mock
  const proveedoresEnriquecidos = PROVEEDORES.map(p => {
    const ocs         = OCS.filter(o => o.proveedorId === p.id);
    const liqsProv    = LIQUIDACIONES.filter(l => l.proveedorId === p.id);
    const totalVentas = ocs.reduce((s, o) => s + o.montoTotal, 0);
    const ocsActivas  = ocs.filter(o => !['ENTREGADA', 'CANCELADA'].includes(o.estado)).length;
    const pagoNeto    = liqsProv.reduce((s, l) => s + (l.pagoProveedor ?? 0), 0);
    return { ...p, ocs, totalVentas, ocsActivas, pagoNeto };
  });

  const filtrados = proveedoresEnriquecidos.filter(p => {
    if (filtroRubro && !p.rubros.includes(filtroRubro as Rubro)) return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (!p.nombre.toLowerCase().includes(q) && !p.razonSocial.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hayFiltros = busqueda || filtroRubro;

  // KPIs globales
  const totalOCs     = OCS.length;
  const ocsActivas   = OCS.filter(o => !['ENTREGADA','CANCELADA'].includes(o.estado)).length;
  const totalCompras = OCS.reduce((s, o) => s + o.montoTotal, 0);
  const shuuriPros   = PROVEEDORES.filter(p => p.esShuuriPro).length;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8 space-y-6">

          {/* TÍTULO */}
          <div>
            <h1 className="text-2xl font-black text-[#0D0D0D]">Proveedores</h1>
            <p className="text-gray-400 text-sm">{PROVEEDORES.length} proveedores en la red</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Proveedores',     value: String(PROVEEDORES.length), sub: `${shuuriPros} ShuuriPro`,           icon: Package,      color: '#2698D1' },
              { label: 'OCs totales',     value: String(totalOCs),           sub: `${ocsActivas} activas`,             icon: Clock,        color: '#0D0D0D' },
              { label: 'Compras totales', value: `USD ${totalCompras}`,      sub: 'Suma de todas las OCs',             icon: CheckCircle,  color: '#16a34a' },
              { label: 'ShuuriPro',       value: String(shuuriPros),         sub: 'USD 1.600/mes c/u',                 icon: Star,         color: '#d97706' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{k.label}</p>
                    <p className="mt-1 text-3xl font-black text-[#0D0D0D]">{k.value}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{k.sub}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${k.color}15` }}>
                    <k.icon className="h-5 w-5" style={{ color: k.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar proveedor..."
                className="text-sm outline-none w-44"
              />
            </div>
            <div className="relative">
              <select
                value={filtroRubro}
                onChange={e => setFiltroRubro(e.target.value)}
                className="appearance-none rounded-lg border bg-white px-3 py-2 pr-8 text-sm outline-none cursor-pointer"
              >
                <option value="">Todos los rubros</option>
                {Object.entries(RUBRO_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {hayFiltros && (
              <button
                onClick={() => { setBusqueda(''); setFiltroRubro(''); }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                <X className="h-3.5 w-3.5" /> Limpiar
              </button>
            )}
          </div>

          {/* CARDS DE PROVEEDORES */}
          <div className="space-y-3">
            {filtrados.length === 0 ? (
              <div className="rounded-xl border bg-white py-12 text-center text-sm text-gray-400 italic">
                Sin resultados para los filtros seleccionados.
              </div>
            ) : filtrados.map(p => {
              const isExpanded = expandido === p.id;
              return (
                <div key={p.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">

                  {/* ROW PRINCIPAL */}
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandido(isExpanded ? null : p.id)}
                  >
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2698D1]/10 text-[#2698D1] text-sm font-black">
                      {p.nombre.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Nombre + razón social */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-[#0D0D0D]">{p.nombre}</p>
                        {p.esShuuriPro && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700 flex items-center gap-1">
                            <Star className="h-3 w-3" /> ShuuriPro
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{p.razonSocial}</p>
                    </div>

                    {/* Rubros */}
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {p.rubros.slice(0, 3).map(r => (
                        <span key={r} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {RUBRO_LABELS[r]}
                        </span>
                      ))}
                      {p.rubros.length > 3 && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                          +{p.rubros.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Métricas inline */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">OCs</p>
                        <p className="font-black text-[#0D0D0D]">{p.ocs.length}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Compras</p>
                        <p className="font-black text-[#0D0D0D]">USD {p.totalVentas}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Entrega</p>
                        <p className="font-black text-[#0D0D0D]">{p.tiempoEntregaHs}hs</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Zonas</p>
                        <p className="text-xs font-medium text-gray-600">{(p.zonaDespacho ?? []).slice(0, 2).join(', ')}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* DETALLE EXPANDIDO */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 px-6 py-5">
                      <div className="grid grid-cols-3 gap-6">

                        {/* Info general */}
                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-wide text-gray-400">Info general</p>
                          <div className="space-y-2">
                            <Row label="Zonas de despacho" value={(p.zonaDespacho ?? []).join(' · ')} />
                            <Row label="Tiempo de entrega" value={`${p.tiempoEntregaHs} horas`} />
                            <Row label="Plan" value={p.esShuuriPro ? 'ShuuriPro (USD 1.600/mes)' : 'Estándar'} highlight={p.esShuuriPro} />
                          </div>
                        </div>

                        {/* Rubros completos */}
                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-wide text-gray-400">Rubros cubiertos ({p.rubros.length})</p>
                          <div className="flex flex-wrap gap-1.5">
                            {p.rubros.map(r => (
                              <span key={r} className="rounded-full bg-white border border-gray-200 px-2.5 py-1 text-xs text-gray-600 font-medium">
                                {RUBRO_LABELS[r]}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* OCs recientes */}
                        <div>
                          <p className="mb-3 text-xs font-black uppercase tracking-wide text-gray-400">Órdenes de compra</p>
                          {p.ocs.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Sin OCs registradas</p>
                          ) : (
                            <div className="space-y-2">
                              {p.ocs.map(oc => (
                                <div key={oc.id} className="flex items-center justify-between rounded-lg bg-white border border-gray-100 px-3 py-2">
                                  <div>
                                    <p className="text-xs font-bold text-gray-600">{oc.id}</p>
                                    <p className="text-xs text-gray-400">OT: {oc.otId}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-black text-[#0D0D0D]">USD {oc.montoTotal}</p>
                                    <span className={`text-xs font-bold ${
                                      oc.estado === 'ENTREGADA' ? 'text-green-600'
                                      : oc.estado === 'DESPACHADA' ? 'text-blue-600'
                                      : oc.estado === 'CANCELADA' ? 'text-red-500'
                                      : 'text-amber-600'
                                    }`}>
                                      {oc.estado}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {p.pagoNeto > 0 && (
                                <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 flex justify-between">
                                  <span className="text-xs font-bold text-green-700">Pago neto acumulado</span>
                                  <span className="text-xs font-black text-green-700">USD {p.pagoNeto}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                      <div className="mt-4 flex justify-end border-t border-gray-200 pt-4">
                        <Link href={`/admin/proveedores/${p.id}`}
                          className="flex items-center gap-2 rounded-lg bg-[#0D0D0D] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D0D0D]/80 transition-colors">
                          Ver legajo completo →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className={`text-xs font-medium text-right ${highlight ? 'text-amber-700 font-black' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}
