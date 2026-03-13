"use client";
import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate, formatARS } from '@/components/shared/utils';
import { OTS, TECNICOS, RESTAURANTES, MOCK_ORDENES_COMPRA } from '@/data/mock';
import {
  ClipboardList, Wrench, Utensils, AlertTriangle,
  TrendingUp, CheckCircle2, Clock, XCircle, ChevronRight,
  ShoppingCart,
} from 'lucide-react';

// Estados cerrados/finales
const ESTADOS_CERRADOS = ['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','FACTURADA','LIQUIDADA','CANCELADA'] as const;

export default function AdminDashboard() {
  const otsActivas  = OTS.filter(o => !ESTADOS_CERRADOS.includes(o.estado as typeof ESTADOS_CERRADOS[number]));
  const otsCerradas = OTS.filter(o =>  ESTADOS_CERRADOS.includes(o.estado as typeof ESTADOS_CERRADOS[number]));

  const tecnicosActivos  = TECNICOS.filter(t => !t.bloqueado);
  const tecnicosBloqueados = TECNICOS.filter(t => t.bloqueado);
  const tecnicosAlerta   = TECNICOS.filter(t =>
    t.certStatusGlobal === 'vencida' || t.certStatusGlobal === 'por_vencer'
  );

  // Agrupación de OTs activas por estado
  const porEstado = otsActivas.reduce<Record<string, number>>((acc, o) => {
    acc[o.estado] = (acc[o.estado] ?? 0) + 1;
    return acc;
  }, {});

  const urgenciaCritica = OTS.filter(o => o.urgencia === 'CRITICA' && !ESTADOS_CERRADOS.includes(o.estado as typeof ESTADOS_CERRADOS[number]));

  // OCRs
  const ocrsActivas  = MOCK_ORDENES_COMPRA.filter(o => o.estado !== 'entregada_local' && o.estado !== 'cancelada');
  const montoEnTransito = ocrsActivas.reduce((s, o) => s + o.totalARS, 0);
  const now = new Date();
  const ocrsVencidas = ocrsActivas.filter(o => o.fechaEstimadaEntrega && new Date(o.fechaEstimadaEntrega) < now);
  const ocrsRecientes = [...MOCK_ORDENES_COMPRA].sort((a, b) => new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime()).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Dashboard Global</h1>
            <p className="text-gray-500">Visión general de la operación SHUURI</p>
          </div>

          {/* KPIs GLOBALES */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              { label: 'OTs activas',       value: otsActivas.length,       color: 'text-blue-600',   bg: 'bg-blue-50',   icon: ClipboardList },
              { label: 'OTs totales',       value: OTS.length,              color: 'text-gray-700',   bg: 'bg-gray-50',   icon: TrendingUp },
              { label: 'Técnicos activos',  value: tecnicosActivos.length,  color: 'text-green-600',  bg: 'bg-green-50',  icon: Wrench },
              { label: 'Restaurantes',      value: RESTAURANTES.length,     color: 'text-purple-600', bg: 'bg-purple-50', icon: Utensils },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* OTs POR ESTADO */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="font-bold text-[#0D0D0D]">OTs activas por estado</h2>
                <Link href="/admin/ots" className="text-xs font-bold text-[#2698D1] hover:underline flex items-center gap-1">
                  Ver todas <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-6">
                {Object.keys(porEstado).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Sin OTs activas</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(porEstado)
                      .sort((a, b) => b[1] - a[1])
                      .map(([estado, count]) => (
                        <div key={estado} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-gray-700 font-medium min-w-0 truncate">
                              {estado.replace(/_/g, ' ')}
                            </span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-[#2698D1] rounded-full"
                                style={{ width: `${(count / otsActivas.length) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-bold text-[#0D0D0D] w-6 text-right">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* OTs CERRADAS RESUMEN */}
              <div className="border-t px-6 py-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'Cerradas conformes',  value: OTS.filter(o => o.estado === 'CERRADA_CONFORME').length,          icon: CheckCircle2, color: 'text-green-600' },
                  { label: 'Sin conformidad',      value: OTS.filter(o => o.estado === 'CERRADA_SIN_CONFORMIDAD').length,   icon: XCircle,      color: 'text-red-500' },
                  { label: 'Canceladas',           value: OTS.filter(o => o.estado === 'CANCELADA').length,                icon: Clock,        color: 'text-gray-400' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <item.icon className={`h-5 w-5 mx-auto mb-1 ${item.color}`} />
                    <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="space-y-5">

              {/* ALERTAS COMPLIANCE */}
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-[#0D0D0D] text-sm">Compliance</h2>
                  <Link href="/admin/compliance" className="text-xs font-bold text-[#2698D1] hover:underline">Ver →</Link>
                </div>
                <div className="p-5 space-y-3">
                  {tecnicosAlerta.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Todo en orden</span>
                    </div>
                  ) : (
                    tecnicosAlerta.slice(0, 4).map(t => (
                      <div key={t.id} className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${t.certStatusGlobal === 'vencida' ? 'text-red-500' : 'text-amber-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-[#0D0D0D]">{t.nombre}</p>
                          <p className={`text-xs ${t.certStatusGlobal === 'vencida' ? 'text-red-500' : 'text-amber-600'}`}>
                            Cert. {t.certStatusGlobal === 'vencida' ? 'vencida' : 'por vencer'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {tecnicosAlerta.length > 4 && (
                    <p className="text-xs text-gray-400">+{tecnicosAlerta.length - 4} más</p>
                  )}
                </div>
              </div>

              {/* URGENCIAS CRÍTICAS */}
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-[#0D0D0D] text-sm">OTs críticas</h2>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                    {urgenciaCritica.length}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  {urgenciaCritica.length === 0 ? (
                    <p className="text-xs text-gray-400">Sin OTs críticas activas</p>
                  ) : (
                    urgenciaCritica.slice(0, 4).map(ot => (
                      <div key={ot.id} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#0D0D0D]">{ot.equipoTipo}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{ot.descripcionFalla}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TÉCNICOS */}
              <div className="rounded-xl border bg-white shadow-sm p-5">
                <h2 className="font-bold text-[#0D0D0D] text-sm mb-3">Técnicos</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Activos</span>
                    <span className="text-xs font-bold text-green-600">{tecnicosActivos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Bloqueados</span>
                    <span className="text-xs font-bold text-red-500">{tecnicosBloqueados.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Con alertas cert.</span>
                    <span className="text-xs font-bold text-amber-600">{tecnicosAlerta.length}</span>
                  </div>
                </div>
                <Link href="/admin/tecnicos"
                  className="mt-4 flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors">
                  Ver técnicos <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* ÓRDENES DE COMPRA REPUESTO */}
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-[#2698D1]" />
                    <h2 className="font-bold text-[#0D0D0D] text-sm">Repuestos activos</h2>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${ocrsActivas.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ocrsActivas.length}
                  </span>
                </div>

                {ocrsVencidas.length > 0 && (
                  <div className="flex items-center gap-2 border-b bg-red-50 px-5 py-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 font-bold">
                      {ocrsVencidas.length} pedido{ocrsVencidas.length > 1 ? 's' : ''} vencido{ocrsVencidas.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs text-gray-400">En tránsito</span>
                    <span className="text-sm font-black text-[#0D0D0D]">{formatARS(montoEnTransito)}</span>
                  </div>

                  {ocrsRecientes.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">Sin órdenes</p>
                  ) : (
                    <div className="space-y-2">
                      {ocrsRecientes.map(ocr => {
                        const vencida = ocr.fechaEstimadaEntrega && new Date(ocr.fechaEstimadaEntrega) < now && ocr.estado !== 'entregada_local' && ocr.estado !== 'cancelada';
                        return (
                          <Link key={ocr.id} href={`/proveedor/ordenes/${ocr.id}`}
                            className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-400 font-mono">{ocr.id}</p>
                              <p className="text-xs font-medium text-[#0D0D0D] truncate">OT {ocr.otId}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2 shrink-0">
                              {vencida && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                ocr.estado === 'entregada_local'      ? 'bg-green-100 text-green-700' :
                                ocr.estado === 'despachada'           ? 'bg-purple-100 text-purple-700' :
                                ocr.estado === 'confirmada_proveedor' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {ocr.estado === 'confirmada_proveedor' ? 'Confirmada' :
                                 ocr.estado === 'despachada' ? 'En camino' :
                                 ocr.estado === 'entregada_local' ? 'Entregada' : ocr.estado}
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
