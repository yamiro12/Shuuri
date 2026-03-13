"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import {
  PROVEEDORES, OCS, LIQUIDACIONES, MOCK_ORDENES_COMPRA,
  OTS_POR_MES,
} from '@/data/mock';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Package, DollarSign, TrendingUp, Download, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';

const TASA = 1050;
type Periodo = '1m' | '3m' | '6m' | '12m';

function getStart(p: Periodo): Date {
  const n = new Date();
  const months = p === '1m' ? 1 : p === '3m' ? 3 : p === '6m' ? 6 : 12;
  return new Date(n.getFullYear(), n.getMonth() - (months - 1), 1);
}

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ProveedorEstadisticas() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? 'P001';
  const proveedor = PROVEEDORES.find(p => p.id === id) ?? PROVEEDORES[0];
  const [periodo, setPeriodo] = useState<Periodo>('6m');

  const misOCs = useMemo(() => {
    const byProveedor = OCS.filter(oc => oc.proveedorId === id);
    return byProveedor.length > 0 ? byProveedor : OCS;
  }, [id]);

  // ─── SECCIÓN 1: VENTAS ──────────────────────────────────────────────────────

  const facturacionMensual = useMemo(() => {
    const start = getStart(periodo);
    return OTS_POR_MES.filter(m => {
      const parts = m.mes.split(' ');
      const mesNum = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].indexOf(parts[0]);
      const anio = parseInt('20' + parts[1]);
      return new Date(anio, mesNum, 1) >= start;
    }).map(m => ({ mes: m.mes, facturacion: Math.round(m.ingresos * TASA) }));
  }, [periodo]);

  const topProductos = useMemo(() => {
    const agg: Record<string, { unidades: number; totalARS: number }> = {};
    misOCs.forEach(oc => {
      oc.items.forEach(item => {
        const key = item.descripcion;
        if (!agg[key]) agg[key] = { unidades: 0, totalARS: 0 };
        agg[key].unidades += item.cantidad;
        agg[key].totalARS += item.cantidad * item.precioUnitario * TASA;
      });
    });
    return Object.entries(agg)
      .map(([nombre, v]) => ({ nombre, unidades: v.unidades, totalARS: Math.round(v.totalARS) }))
      .sort((a, b) => b.unidades - a.unidades)
      .slice(0, 10);
  }, [misOCs]);

  const conversionStats = useMemo(() => {
    const recibidos = misOCs.length;
    const entregadas = misOCs.filter(oc => oc.estado === 'ENTREGADA').length;
    const tasa = recibidos > 0 ? Math.round(entregadas / recibidos * 100) : 0;
    const ocrs = MOCK_ORDENES_COMPRA;
    const ocrsEntregadas = ocrs.filter(o => o.estado === 'entregada_local').length;
    const ocrsCanceladas = ocrs.filter(o => o.estado === 'cancelada').length;
    return { recibidos, entregadas, tasa, totalOcrs: ocrs.length, ocrsEntregadas, ocrsCanceladas };
  }, [misOCs]);

  function exportVentas() {
    downloadCSV(
      ['#', 'Producto', 'Unidades', 'Total ARS'],
      topProductos.map((p, i) => [String(i + 1), p.nombre, String(p.unidades), String(p.totalARS)]),
      'ventas_productos.csv'
    );
  }

  // ─── SECCIÓN 2: MARKETPLACE VS OCR ─────────────────────────────────────────

  const marketplaceData = useMemo(() => {
    return OTS_POR_MES.slice(-6).map(m => ({
      mes: m.mes,
      Marketplace: Math.round(m.ingresos * 0.6 * TASA),
      OCRs: Math.round(m.ingresos * 0.4 * TASA),
    }));
  }, []);

  const totalesMarketplace = useMemo(() => {
    const totalMkt = marketplaceData.reduce((s, m) => s + m.Marketplace, 0);
    const totalOcr = marketplaceData.reduce((s, m) => s + m.OCRs, 0);
    return { totalMkt, totalOcr };
  }, [marketplaceData]);

  function exportMarketplace() {
    downloadCSV(
      ['Mes', 'Marketplace ARS', 'OCRs ARS'],
      marketplaceData.map(m => [m.mes, String(m.Marketplace), String(m.OCRs)]),
      'marketplace_vs_ocr.csv'
    );
  }

  // ─── SECCIÓN 3: PERFORMANCE LOGÍSTICA ──────────────────────────────────────

  const logisticaStats = useMemo(() => {
    const ocrs = MOCK_ORDENES_COMPRA;
    const despachoTiempos = ocrs
      .filter(o => o.estado === 'despachada' || o.estado === 'entregada_local' || o.estado === 'confirmada_proveedor')
      .map(o => {
        const inicio = new Date(o.creadaEn);
        const fin = new Date(o.actualizadoEn);
        return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      });
    const avgDespacho = despachoTiempos.length > 0
      ? (despachoTiempos.reduce((s, d) => s + d, 0) / despachoTiempos.length).toFixed(1)
      : '—';

    const entregaTiempos = ocrs
      .filter(o => o.fechaEstimadaEntrega)
      .map(o => {
        const inicio = new Date(o.creadaEn);
        const fin = new Date(o.fechaEntregaReal ?? o.fechaEstimadaEntrega!);
        return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      });
    const avgEntrega = entregaTiempos.length > 0
      ? (entregaTiempos.reduce((s, d) => s + d, 0) / entregaTiempos.length).toFixed(1)
      : '—';

    const conAmbas = ocrs.filter(o => o.fechaEntregaReal && o.fechaEstimadaEntrega);
    const enPlazo = conAmbas.filter(o => new Date(o.fechaEntregaReal!) <= new Date(o.fechaEstimadaEntrega!)).length;
    const pctPlazo = conAmbas.length > 0 ? Math.round(enPlazo / conAmbas.length * 100) : null;

    return { avgDespacho, avgEntrega, pctPlazo, ocrs };
  }, []);

  function exportLogistica() {
    downloadCSV(
      ['ID', 'OT', 'Estado', 'Creada', 'Estimada', 'Real'],
      logisticaStats.ocrs.map(o => [
        o.id, o.otId, o.estado, o.creadaEn,
        o.fechaEstimadaEntrega ?? '—',
        o.fechaEntregaReal ?? '—',
      ]),
      'logistica_ocrs.csv'
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="page-main">

          {/* Título y filtro período */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-sm text-gray-400">{proveedor.nombre} · ventas y performance logística</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {(['1m','3m','6m','12m'] as Periodo[]).map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    periodo === p ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{p.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* ── SECCIÓN 1: VENTAS ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Ventas</h2>
              <button onClick={exportVentas}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>

            {/* KPIs rápidos */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'OCs recibidas', value: String(conversionStats.recibidos), icon: Package, color: 'text-[#2698D1]', bg: 'bg-blue-50' },
                { label: 'OCs entregadas', value: String(conversionStats.entregadas), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Tasa de conversión', value: `${conversionStats.tasa}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'OCRs totales', value: String(conversionStats.totalOcrs), icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-xl border bg-gray-50 p-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg} mb-2`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <p className="text-xl font-black text-[#0D0D0D]">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Tasa conversión detalle */}
            <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm">
              <span className="font-bold text-[#2698D1]">{conversionStats.tasa}% conversión</span>
              <span className="text-gray-500 ml-2">({conversionStats.entregadas}/{conversionStats.recibidos} OCs entregadas)</span>
              <span className="ml-4 text-gray-400">·</span>
              <span className="ml-4 text-gray-500">OCRs: {conversionStats.totalOcrs} total · {conversionStats.ocrsEntregadas} entregadas · {conversionStats.ocrsCanceladas} canceladas</span>
            </div>

            {/* Chart facturación mensual */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Facturación mensual (ARS)</h3>
            {facturacionMensual.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">Sin datos para el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={facturacionMensual} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number | string) => formatARS(Number(v))} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={85} />
                  <Tooltip formatter={(value: any) => [formatARS(Number(value)), 'Facturación']} />
                  <Bar dataKey="facturacion" fill="#2698D1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Top 10 productos */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mt-6 mb-3">Top 10 productos más vendidos</h3>
            {topProductos.length === 0 ? (
              <p className="text-sm text-gray-400">Sin datos de productos</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {['#','Producto','Unidades vendidas','Total ARS'].map(h => (
                        <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {topProductos.map((p, i) => (
                      <tr key={p.nombre} className="hover:bg-gray-50">
                        <td className="py-2 text-xs font-bold text-gray-400">{i + 1}</td>
                        <td className="py-2 font-medium text-[#0D0D0D]">{p.nombre}</td>
                        <td className="py-2 text-gray-600">{p.unidades}</td>
                        <td className="py-2 font-bold text-[#0D0D0D]">{formatARS(p.totalARS)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── SECCIÓN 2: MARKETPLACE VS OCR ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Marketplace vs OCRs</h2>
              <button onClick={exportMarketplace}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-bold text-[#2698D1] uppercase tracking-wide mb-1">Total Marketplace</p>
                <p className="text-2xl font-black text-[#0D0D0D]">{formatARS(totalesMarketplace.totalMkt)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Últimos 6 meses</p>
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Total OCRs</p>
                <p className="text-2xl font-black text-[#0D0D0D]">{formatARS(totalesMarketplace.totalOcr)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Últimos 6 meses</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Volumen mensual: Marketplace vs OCRs</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={marketplaceData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number | string) => formatARS(Number(v))} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={85} />
                <Tooltip formatter={(value: any) => [formatARS(Number(value)), '']} />
                <Legend />
                <Bar dataKey="Marketplace" fill="#2698D1" radius={[4,4,0,0]} />
                <Bar dataKey="OCRs" fill="#a855f7" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── SECCIÓN 3: PERFORMANCE LOGÍSTICA ── */}
          <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0D0D0D]">Performance logística</h2>
              <button onClick={exportLogistica}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" /> Exportar CSV
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: 'Tiempo prom. despacho',
                  value: `${logisticaStats.avgDespacho} días`,
                  icon: Clock,
                  color: 'text-[#2698D1]',
                  bg: 'bg-blue-50',
                },
                {
                  label: 'Tiempo prom. entrega total',
                  value: `${logisticaStats.avgEntrega} días`,
                  icon: Truck,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
                {
                  label: '% entregas en plazo',
                  value: logisticaStats.pctPlazo !== null ? `${logisticaStats.pctPlazo}%` : 'Sin datos',
                  icon: logisticaStats.pctPlazo !== null && logisticaStats.pctPlazo >= 80 ? CheckCircle2 : XCircle,
                  color: logisticaStats.pctPlazo !== null && logisticaStats.pctPlazo >= 80 ? 'text-green-600' : 'text-gray-400',
                  bg: logisticaStats.pctPlazo !== null && logisticaStats.pctPlazo >= 80 ? 'bg-green-50' : 'bg-gray-50',
                },
              ].map(s => (
                <div key={s.label} className="rounded-xl border bg-gray-50 p-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} mb-2`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className="text-xl font-black text-[#0D0D0D]">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabla OCRs */}
            <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Detalle de órdenes de compra de repuestos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {['ID OCR','OT','Estado','Fecha creación','Entrega estimada','Entrega real'].map(h => (
                      <th key={h} className="pb-2 text-left text-xs font-bold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logisticaStats.ocrs.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="py-2 text-xs font-bold text-gray-400">{o.id}</td>
                      <td className="py-2 font-medium text-[#0D0D0D]">{o.otId}</td>
                      <td className="py-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          o.estado === 'entregada_local' ? 'bg-green-100 text-green-700' :
                          o.estado === 'cancelada' ? 'bg-red-100 text-red-700' :
                          o.estado === 'despachada' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{o.estado.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-2 text-xs text-gray-500">{new Date(o.creadaEn).toLocaleDateString('es-AR')}</td>
                      <td className="py-2 text-xs text-gray-500">
                        {o.fechaEstimadaEntrega ? new Date(o.fechaEstimadaEntrega).toLocaleDateString('es-AR') : '—'}
                      </td>
                      <td className="py-2 text-xs text-gray-500">
                        {o.fechaEntregaReal ? new Date(o.fechaEntregaReal).toLocaleDateString('es-AR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
