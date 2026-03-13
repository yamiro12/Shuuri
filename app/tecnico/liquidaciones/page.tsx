"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import { TECNICOS, LIQUIDACIONES, getOTById } from '@/data/mock';
import { Liquidacion } from '@/types/shuuri';
import { DollarSign, TrendingUp, Clock, CheckCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const TECNICO = TECNICOS[0];
const MIS_LIQUIDACIONES = LIQUIDACIONES.filter(l => l.tecnicoId === TECNICO.id);

function EstadoBadgeLiq({ estado }: { estado: Liquidacion['estado'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    PAGADA:         { label: 'Pagada',         cls: 'bg-green-100 text-green-700' },
    PENDIENTE_PAGO: { label: 'Pendiente pago', cls: 'bg-yellow-100 text-yellow-700' },
    DEVENGADA:      { label: 'Devengada',      cls: 'bg-blue-100 text-blue-700' },
  };
  const { label, cls } = map[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function DesgloseFila({ liq }: { liq: Liquidacion }) {
  const ot = getOTById(liq.otId);
  const repuestosBruto = ot?.cotizacion?.itemsRepuestos?.reduce(
    (a, i) => a + i.precioUnitario * i.cantidad, 0
  ) ?? 0;

  return (
    <div className="bg-gray-50 border-t px-6 py-5">
      <div className="grid grid-cols-3 gap-6">

        {/* Facturado al cliente */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Facturado al cliente</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mano de obra</span>
              <span className="font-medium text-[#0D0D0D]">{formatARS(liq.montoTotalFacturado - repuestosBruto)}</span>
            </div>
            {repuestosBruto > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Repuestos</span>
                <span className="font-medium text-[#0D0D0D]">{formatARS(repuestosBruto)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>{formatARS(liq.montoTotalFacturado)}</span>
            </div>
          </div>
        </div>

        {/* Comisión SHUURI */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Comisión SHUURI (mandato)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Servicio ({Math.round(liq.comisionServicioPct * 100)}%)</span>
              <span className="font-medium text-red-500">- {formatARS(liq.comisionServicio)}</span>
            </div>
            {liq.comisionRepuestos > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Repuestos ({Math.round(liq.comisionRepuestosPct * 100)}%)</span>
                <span className="font-medium text-red-500">- {formatARS(liq.comisionRepuestos)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-sm font-bold text-red-600">
              <span>Total comisión</span>
              <span>- {formatARS(liq.comisionTotal)}</span>
            </div>
          </div>
        </div>

        {/* Neto técnico */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Tu liquidación</p>
          <div className="space-y-2">
            {liq.fechaDevengado && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>Devengado</span>
                <span>{formatDate(liq.fechaDevengado)}</span>
              </div>
            )}
            {liq.fechaPago && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>Acreditado</span>
                <span>{formatDate(liq.fechaPago)}</span>
              </div>
            )}
            <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-3 text-center mt-2">
              <p className="text-xs text-green-600 font-medium">Total a cobrar</p>
              <p className="text-xl font-black text-green-700">{formatARS(liq.pagoTecnico)}</p>
            </div>
          </div>
        </div>

      </div>

      {/* OT vinculada */}
      {ot && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 flex items-center gap-4">
          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1 grid grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-400 font-medium">OT</p>
              <p className="font-bold text-[#2698D1]">{ot.id}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Equipo</p>
              <p className="font-medium text-[#0D0D0D]">{ot.equipoTipo} {ot.equipoMarca}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Falla</p>
              <p className="font-medium text-[#0D0D0D] truncate">{ot.descripcionFalla}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Cierre</p>
              <p className="font-medium text-[#0D0D0D]">
                {ot.fechaFinalizacion ? formatDate(ot.fechaFinalizacion) : '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TecnicoLiquidaciones() {
  const [expandida, setExpandida] = useState<string | null>(null);

  const totalNeto = MIS_LIQUIDACIONES.reduce((a, l) => a + l.pagoTecnico, 0);
  const pagadas = MIS_LIQUIDACIONES.filter(l => l.estado === 'PAGADA').length;
  const pendientes = MIS_LIQUIDACIONES.filter(l => l.estado !== 'PAGADA').length;
  const comisionPctProm = MIS_LIQUIDACIONES.length > 0
    ? Math.round(MIS_LIQUIDACIONES.reduce((a, l) => a + l.comisionServicioPct, 0) / MIS_LIQUIDACIONES.length * 100)
    : 0;

  const toggle = (id: string) => setExpandida(prev => prev === id ? null : id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="TECNICO" userName={TECNICO.nombre} />
        <main className="p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Mis liquidaciones</h1>
            <p className="text-gray-500">Historial de pagos SHUURI → {TECNICO.nombre}</p>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {[
              { label: 'Total cobrado',     value: formatARS(totalNeto), icon: DollarSign,  color: 'text-blue-600',   bg: 'bg-blue-50' },
              { label: 'Pagadas',           value: pagadas,              icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50' },
              { label: 'Pendientes',        value: pendientes,           icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Comisión promedio', value: `${comisionPctProm}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-black text-[#0D0D0D]">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* TABLA CON DESGLOSE */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0D0D0D]">Detalle de liquidaciones</h3>
              <p className="text-xs text-gray-400">Clic en una fila para ver el desglose completo</p>
            </div>

            {MIS_LIQUIDACIONES.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400 text-sm italic">
                Sin liquidaciones registradas aún.
              </div>
            ) : (
              <>
                {/* HEADER TABLA */}
                <div className="grid grid-cols-7 border-b bg-gray-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span>Liquidación</span>
                  <span>OT</span>
                  <span>Devengado</span>
                  <span>Total facturado</span>
                  <span>Comisión SHUURI</span>
                  <span className="text-[#0D0D0D]">Neto a cobrar</span>
                  <span>Estado</span>
                </div>

                {MIS_LIQUIDACIONES.map(liq => (
                  <div key={liq.id}>
                    <button
                      onClick={() => toggle(liq.id)}
                      className="grid w-full grid-cols-7 items-center border-b px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-400">{liq.id}</span>
                      <span className="text-xs font-bold text-[#2698D1]">{liq.otId}</span>
                      <span className="text-sm text-gray-500">
                        {liq.fechaDevengado ? formatDate(liq.fechaDevengado) : '—'}
                      </span>
                      <span className="text-sm text-gray-600">{formatARS(liq.montoTotalFacturado)}</span>
                      <span className="text-sm text-red-500">- {formatARS(liq.comisionTotal)}</span>
                      <span className="text-sm font-black text-[#0D0D0D]">{formatARS(liq.pagoTecnico)}</span>
                      <span className="flex items-center justify-between pr-2">
                        <EstadoBadgeLiq estado={liq.estado} />
                        {expandida === liq.id
                          ? <ChevronUp className="h-4 w-4 text-gray-400" />
                          : <ChevronDown className="h-4 w-4 text-gray-400" />
                        }
                      </span>
                    </button>

                    {expandida === liq.id && <DesgloseFila liq={liq} />}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* NOTA MANDATO */}
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Modelo mandato:</strong> SHUURI actúa como agente comercial autorizado. Cobra al cliente en tu nombre y liquida el neto dentro de los plazos acordados. Comisión según tier del restaurante: 30% Freemium · 25% Cadena chica · 20% Cadena grande.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
