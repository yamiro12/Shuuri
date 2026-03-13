"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import { TECNICOS, LIQUIDACIONES, RESTAURANTES, getOTById } from '@/data/mock';
import { Liquidacion } from '@/types/shuuri';
import { COMISION_SERVICIO, PCT_TECNICO, getTierLabel, getTierBadgeClass } from '@/lib/business';
import { DollarSign, TrendingUp, Clock, CheckCircle, ChevronDown, ChevronUp, FileText, PercentCircle, Info, Banknote, CalendarDays } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

// ─── ESQUEMA COMISIONES ────────────────────────────────────────────────────────

const TIERS_COMISION = [
  { tier: 'Freemium',      retencion: Math.round(COMISION_SERVICIO.FREEMIUM      * 100), neto: Math.round(PCT_TECNICO * 100), cls: 'bg-gray-100 text-gray-700',    badge: 'bg-gray-200 text-gray-600' },
  { tier: 'Cadena chica',  retencion: Math.round(COMISION_SERVICIO.CADENA_CHICA  * 100), neto: Math.round(PCT_TECNICO * 100), cls: 'bg-blue-50 text-blue-800',     badge: 'bg-blue-100 text-blue-700' },
  { tier: 'Cadena grande', retencion: Math.round(COMISION_SERVICIO.CADENA_GRANDE * 100), neto: Math.round(PCT_TECNICO * 100), cls: 'bg-yellow-50 text-yellow-800', badge: 'bg-yellow-100 text-yellow-700' },
];

const FAQ_ITEMS = [
  {
    q: '¿Cómo se calcula mi pago?',
    a: 'SHUURI cobra al cliente en tu nombre (modelo mandato). Descuenta su comisión según el tier del restaurante y te liquida el neto dos veces por mes.',
  },
  {
    q: '¿Qué diferencia hay entre quincenal y mensual?',
    a: 'Quincenal: recibes dos pagos al mes (día 15 y último día). Mensual: un solo pago el último día del mes. El monto total es el mismo, pero el quincenal mejora tu flujo de caja.',
  },
  {
    q: '¿Cómo se tratan los repuestos?',
    a: 'Los repuestos solicitados vía Marketplace tienen una comisión OCR del 15% que va al proveedor. Ese porcentaje NO se descuenta de tu mano de obra, son montos separados.',
  },
];

function EsquemaComisiones() {
  const [periodo,    setPeriodo]    = useState<'quincenal' | 'mensual'>('quincenal');
  const [faqAbierto, setFaqAbierto] = useState<number | null>(null);
  const ejemploMdo = 100; // USD ejemplo

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <PercentCircle className="h-5 w-5 text-[#2698D1]" />
        <h2 className="font-bold text-[#0D0D0D]">Mi esquema de comisiones</h2>
      </div>

      <div className="p-6 space-y-6">

        {/* Periodicidad selector */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> Periodicidad de pago
          </p>
          <div className="flex gap-2 mb-4">
            {(['quincenal', 'mensual'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                  periodo === p
                    ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {p === 'quincenal' ? 'Quincenal' : 'Mensual'}
                {p === 'quincenal' && <span className="ml-2 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Recomendado</span>}
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-gray-50 border px-5 py-4">
            {periodo === 'quincenal' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Pago 1</p>
                  <p className="text-lg font-black text-[#0D0D0D]">Día 15</p>
                  <p className="text-xs text-gray-500">OTs cerradas 1–15</p>
                </div>
                <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Pago 2</p>
                  <p className="text-lg font-black text-[#0D0D0D]">Último día</p>
                  <p className="text-xs text-gray-500">OTs cerradas 16–fin</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Pago único mensual</p>
                <p className="text-lg font-black text-[#0D0D0D]">Último día del mes</p>
                <p className="text-xs text-gray-500">Todas las OTs cerradas en el mes</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de tasas */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            Retención por tier de cliente (ejemplo: MdO USD {ejemploMdo})
          </p>
          <div className="space-y-2">
            {TIERS_COMISION.map(t => (
              <div key={t.tier} className={`flex items-center justify-between rounded-xl px-4 py-3 ${t.cls}`}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{t.tier}</span>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${t.badge}`}>
                    SHUURI {t.retencion}%
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">USD {Math.round(ejemploMdo * t.neto / 100)}</p>
                  <p className="text-xs opacity-70">tu neto ({t.neto}%)</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Info className="h-3 w-3 shrink-0" />
            Los repuestos OCR tienen comisión independiente (15% al proveedor, no afecta tu MdO).
          </p>
        </div>

        {/* FAQ accordion */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Preguntas frecuentes</p>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl border overflow-hidden">
                <button
                  onClick={() => setFaqAbierto(prev => prev === i ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-gray-50 transition-colors text-left"
                >
                  {item.q}
                  {faqAbierto === i ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>
                {faqAbierto === i && (
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TecnicoLiquidaciones() {
  const searchParams = useSearchParams();
  const tecnicoId = searchParams.get('id') ?? 'T001';
  const TECNICO = TECNICOS.find(t => t.id === tecnicoId) ?? TECNICOS[0];
  const misLiquidaciones = useMemo(
    () => LIQUIDACIONES.filter(l => l.tecnicoId === TECNICO.id),
    [TECNICO.id]
  );

  const [expandida, setExpandida] = useState<string | null>(null);

  const totalNeto = misLiquidaciones.reduce((a, l) => a + l.pagoTecnico, 0);
  const pagadas = misLiquidaciones.filter(l => l.estado === 'PAGADA').length;
  const pendientes = misLiquidaciones.filter(l => l.estado !== 'PAGADA').length;
  const pctValues = useMemo(
    () => [...new Set(misLiquidaciones.map(l => Math.round(l.comisionServicioPct * 100)))].sort((a, b) => a - b),
    [misLiquidaciones],
  );
  const comisionLabel = pctValues.length === 0
    ? '—'
    : pctValues.length === 1
      ? `${pctValues[0]}%`
      : `Entre ${pctValues[0]}% y ${pctValues[pctValues.length - 1]}%`;

  const toggle = (id: string) => setExpandida(prev => prev === id ? null : id);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={TECNICO.nombre} />
        <main className="page-main">

          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Mis liquidaciones</h1>
            <p className="text-gray-500">Historial de pagos SHUURI → {TECNICO.nombre}</p>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total cobrado',     value: formatARS(totalNeto), icon: DollarSign,  color: 'text-blue-600',   bg: 'bg-blue-50' },
              { label: 'Pagadas',           value: pagadas,              icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50' },
              { label: 'Pendientes',        value: pendientes,           icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: pctValues.length > 1 ? 'Rango comisión SHUURI' : 'Comisión SHUURI', value: comisionLabel, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
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

          <EsquemaComisiones />

          {/* TABLA CON DESGLOSE */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0D0D0D]">Detalle de liquidaciones</h3>
              <p className="text-xs text-gray-400">Clic en una fila para ver el desglose completo</p>
            </div>

            {misLiquidaciones.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400 text-sm italic">
                Sin liquidaciones registradas aún.
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* HEADER TABLA */}
                <div className="grid grid-cols-8 border-b bg-gray-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 min-w-[800px]">
                  <span>Liquidación</span>
                  <span>OT</span>
                  <span>Tier cliente</span>
                  <span>Devengado</span>
                  <span>Total facturado</span>
                  <span>Comisión SHUURI</span>
                  <span className="text-[#0D0D0D]">Neto a cobrar</span>
                  <span>Estado</span>
                </div>

                {misLiquidaciones.map(liq => (
                  <div key={liq.id}>
                    <button
                      onClick={() => toggle(liq.id)}
                      className="grid w-full grid-cols-8 items-center border-b px-6 py-4 text-left hover:bg-gray-50 transition-colors min-w-[800px]"
                    >
                      <span className="text-xs font-bold text-gray-400">{liq.id}</span>
                      <span className="text-xs font-bold text-[#2698D1]">{liq.otId}</span>
                      <span>
                        {(() => {
                          const ot   = getOTById(liq.otId);
                          const rest = ot ? RESTAURANTES.find(r => r.id === ot.restauranteId) : undefined;
                          return rest?.tier
                            ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getTierBadgeClass(rest.tier)}`}>{getTierLabel(rest.tier)}</span>
                            : <span className="text-xs text-gray-400">—</span>;
                        })()}
                      </span>
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
              </div>
            )}
          </div>

          {/* NOTA 70% CONSTANTE */}
          <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-green-800">
              <strong>Tu pago es siempre el {Math.round(PCT_TECNICO * 100)}% del servicio,</strong> independientemente del tier del cliente. El tier afecta solo la comisión que retiene SHUURI — a vos siempre te corresponde el {Math.round(PCT_TECNICO * 100)}% de la mano de obra.
            </p>
          </div>

          {/* NOTA MANDATO */}
          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Modelo mandato:</strong> SHUURI actúa como agente comercial autorizado. Cobra al cliente en tu nombre y liquida el neto dentro de los plazos acordados. Comisión según tier del restaurante: {Math.round(COMISION_SERVICIO.FREEMIUM * 100)}% Freemium · {Math.round(COMISION_SERVICIO.CADENA_CHICA * 100)}% Cadena chica · {Math.round(COMISION_SERVICIO.CADENA_GRANDE * 100)}% Cadena grande.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
