"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS, formatDate } from '@/components/shared/utils';
import {
  OTS, RESTAURANTES, PROVEEDORES, OCS, LIQUIDACIONES,
  MOCK_ORDENES_COMPRA, OTS_POR_MES,
  getLiquidacionesByProveedor,
} from '@/data/mock';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TASA_USD_ARS = 1050;

const STOCK_ALERTS = [
  { id: 'C002', nombre: 'Módulo control Rational SCC 61', stock: 2, minimo: 1 },
  { id: 'C007', nombre: 'Válvula solenoide gas DN15 24V', stock: 6, minimo: 2 },
  { id: 'C010', nombre: 'Resistencia Winterhalter GS 630', stock: 0, minimo: 1 },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Periodo = 'mes' | 'trimestre' | 'semestre' | 'anio';

function getStart(p: Periodo): Date {
  const n = new Date();
  if (p === 'mes') return new Date(n.getFullYear(), n.getMonth(), 1);
  if (p === 'trimestre') return new Date(n.getFullYear(), n.getMonth() - 2, 1);
  if (p === 'semestre') return new Date(n.getFullYear(), n.getMonth() - 5, 1);
  return new Date(n.getFullYear(), 0, 1);
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── BADGE HELPERS ────────────────────────────────────────────────────────────
function estadoBadgeClass(estado: string): string {
  const map: Record<string, string> = {
    ENTREGADA:             'bg-green-100 text-green-700',
    entregada_local:       'bg-green-100 text-green-700',
    CONFIRMADA:            'bg-blue-100 text-blue-700',
    confirmada_proveedor:  'bg-blue-100 text-blue-700',
    despachada:            'bg-purple-100 text-purple-700',
    PENDIENTE:             'bg-yellow-100 text-yellow-700',
    pendiente_aprobacion:  'bg-yellow-100 text-yellow-700',
    cancelada:             'bg-red-100 text-red-700',
    CANCELADA:             'bg-red-100 text-red-700',
  };
  return map[estado] ?? 'bg-gray-100 text-gray-500';
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ProveedorDashboard() {
  const searchParams = useSearchParams();
  const proveedorId = searchParams.get('id') ?? 'P001';
  const proveedor = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const start = useMemo(() => getStart(periodo), [periodo]);

  // ── KPI 1: Órdenes recibidas en período ──
  const ocsEnPeriodo = useMemo(
    () => OCS.filter(o => o.proveedorId === proveedorId && new Date(o.fechaCreacion) >= start),
    [proveedorId, start],
  );

  // ── KPI 2: Monto facturado ARS ──
  const montoFacturadoARS = useMemo(() => {
    const fromOCS = ocsEnPeriodo.reduce((s, o) => s + o.montoTotal * TASA_USD_ARS, 0);
    const fromOCR = MOCK_ORDENES_COMPRA
      .filter(o => o.proveedorId === proveedorId && new Date(o.creadaEn) >= start)
      .reduce((s, o) => s + o.totalARS, 0);
    return fromOCS + fromOCR;
  }, [ocsEnPeriodo, proveedorId, start]);

  // ── KPI 3: Comisiones SHUURI ARS ──
  const comisionesARS = useMemo(() => {
    const lqs = getLiquidacionesByProveedor(proveedorId);
    return lqs
      .filter(l => l.fechaDevengado && new Date(l.fechaDevengado) >= start)
      .reduce((s, l) => s + l.comisionTotal * TASA_USD_ARS, 0);
  }, [proveedorId, start]);

  // ── KPI 4: Productos activos ──
  const productosActivos = proveedor.legajo?.cantidadSKUs ?? (proveedor.catalogoItems?.length.toString() ?? '—');

  // ── Gráfico 1: Órdenes por mes (últimos 6) ──
  const chartOrdenesMes = useMemo(() => {
    const last6 = OTS_POR_MES.slice(-6);
    // Group OCS by month for this provider
    const ocsByMonth: Record<string, number> = {};
    OCS.filter(o => o.proveedorId === proveedorId).forEach(o => {
      const d = new Date(o.fechaCreacion);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      ocsByMonth[key] = (ocsByMonth[key] ?? 0) + 1;
    });
    const ocrByMonth: Record<string, number> = {};
    MOCK_ORDENES_COMPRA.filter(o => o.proveedorId === proveedorId).forEach(o => {
      const d = new Date(o.creadaEn);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      ocrByMonth[key] = (ocrByMonth[key] ?? 0) + 1;
    });

    // Map last 6 months from OTS_POR_MES
    const months = ['Abr 25','May 25','Jun 25','Jul 25','Ago 25','Sep 25','Oct 25','Nov 25','Dic 25','Ene 26','Feb 26','Mar 26'];
    const monthOffsets: Record<string, {year:number, month:number}> = {
      'Abr 25': {year:2025,month:3}, 'May 25': {year:2025,month:4}, 'Jun 25': {year:2025,month:5},
      'Jul 25': {year:2025,month:6}, 'Ago 25': {year:2025,month:7}, 'Sep 25': {year:2025,month:8},
      'Oct 25': {year:2025,month:9}, 'Nov 25': {year:2025,month:10}, 'Dic 25': {year:2025,month:11},
      'Ene 26': {year:2026,month:0}, 'Feb 26': {year:2026,month:1}, 'Mar 26': {year:2026,month:2},
    };

    return last6.map(entry => {
      const info = monthOffsets[entry.mes];
      const key = info ? `${info.year}-${info.month}` : '';
      const ordenes = info ? (ocsByMonth[key] ?? 0) : 0;
      const ocrs = info ? (ocrByMonth[key] ?? 0) : 0;
      // Fallback: if no proveedor data, use total as proxy
      const ordenesDisplay = (ordenes === 0 && ocrs === 0) ? Math.round(entry.total * 0.15) : ordenes;
      return { mes: entry.mes, Órdenes: ordenesDisplay, OCRs: ocrs };
    });
  }, [proveedorId]);

  // ── Gráfico 2: Top 5 productos / rubros ──
  const chartTopProductos = useMemo(() => {
    return OTS_POR_MES.length > 0
      ? [
          { nombre: 'Frío Comercial',       cantidad: 13 },
          { nombre: 'Calor Comercial',      cantidad: 10 },
          { nombre: 'Café y Bebidas',       cantidad: 4  },
          { nombre: 'Lavado Comercial',     cantidad: 3  },
          { nombre: 'Campanas',             cantidad: 2  },
        ]
      : [];
  }, []);

  // ── Tabla: últimas órdenes ──
  const ultimasOrdenes = useMemo(() => {
    type Row = {
      id: string; tipo: 'OC' | 'OCR'; restauranteNombre: string;
      importeARS: number; estado: string; fecha: string;
    };
    const rows: Row[] = [];

    OCS.filter(o => o.proveedorId === proveedorId).forEach(o => {
      const ot = OTS.find(t => t.id === o.otId);
      const rest = ot ? RESTAURANTES.find(r => r.id === ot.restauranteId) : undefined;
      rows.push({
        id: o.id, tipo: 'OC',
        restauranteNombre: rest?.nombre ?? '—',
        importeARS: o.montoTotal * TASA_USD_ARS,
        estado: o.estado,
        fecha: o.fechaCreacion,
      });
    });

    MOCK_ORDENES_COMPRA.filter(o => o.proveedorId === proveedorId).forEach(o => {
      const ot = OTS.find(t => t.id === o.otId);
      const rest = ot ? RESTAURANTES.find(r => r.id === ot.restauranteId) : undefined;
      rows.push({
        id: o.id, tipo: 'OCR',
        restauranteNombre: rest?.nombre ?? '—',
        importeARS: o.totalARS,
        estado: o.estado,
        fecha: o.creadaEn,
      });
    });

    return rows.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 8);
  }, [proveedorId]);

  // ── CSV Export ──
  function handleExport() {
    const header = ['Número', 'Tipo', 'Restaurante', 'Importe ARS', 'Estado', 'Fecha'];
    const dataRows = ultimasOrdenes.map(r => [
      r.id, r.tipo, r.restauranteNombre,
      r.importeARS.toFixed(2), r.estado, formatDate(r.fecha),
    ]);
    downloadCSV([header, ...dataRows], `reporte-proveedor-${proveedorId}.csv`);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="page-main">

          {/* HEADER ROW */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Dashboard Proveedor</h1>
              <p className="text-gray-500 text-sm">{proveedor.nombre}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={periodo}
                onChange={e => setPeriodo(e.target.value as Periodo)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
              >
                <option value="mes">Este mes</option>
                <option value="trimestre">Últimos 3 meses</option>
                <option value="semestre">Últimos 6 meses</option>
                <option value="anio">Este año</option>
              </select>
              <button
                onClick={handleExport}
                className="rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d7db0] transition-colors"
              >
                Exportar reporte CSV
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              {
                label: 'Órdenes recibidas',
                value: ocsEnPeriodo.length,
                sub: periodo === 'mes' ? 'este mes' : `últimos ${periodo === 'trimestre' ? '3' : periodo === 'semestre' ? '6' : '12'} meses`,
                color: 'text-[#2698D1]',
                bg: 'bg-blue-50',
              },
              {
                label: 'Monto facturado',
                value: formatARS(montoFacturadoARS),
                sub: 'ARS en el período',
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                label: 'Comisiones SHUURI',
                value: formatARS(comisionesARS),
                sub: 'ARS retenidas',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                label: 'Productos activos',
                value: productosActivos,
                sub: 'SKUs en catálogo',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl border bg-white shadow-sm p-5">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${kpi.bg} mb-3`}>
                  <span className={`text-lg font-black ${kpi.color}`}>#</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="mb-6 grid grid-cols-3 gap-6">

            {/* Gráfico 1: Órdenes por mes */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="font-bold text-[#0D0D0D]">Órdenes por mes — últimos 6 meses</h2>
              </div>
              <div className="p-6" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartOrdenesMes} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Órdenes" fill="#2698D1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="OCRs" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 2: Top 5 productos / rubros */}
            <div className="rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="font-bold text-[#0D0D0D]">Top 5 por rubro</h2>
              </div>
              <div className="p-6" style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartTopProductos}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#2698D1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Tabla + Alertas */}
          <div className="grid grid-cols-3 gap-6">

            {/* Tabla últimas órdenes */}
            <div className="col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="font-bold text-[#0D0D0D]">Últimas órdenes</h2>
                <Link href={`/proveedor/ordenes?id=${proveedorId}`}
                  className="text-xs font-bold text-[#2698D1] hover:underline">
                  Ver todas →
                </Link>
              </div>
              <div className="overflow-x-auto">
                {ultimasOrdenes.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Sin órdenes en el período</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Número</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Tipo</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Gastronómico</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Importe ARS</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Estado</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasOrdenes.map(row => (
                        <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-400">{row.id}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${row.tipo === 'OC' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {row.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{row.restauranteNombre}</td>
                          <td className="px-4 py-3 font-bold text-[#0D0D0D]">{formatARS(row.importeARS)}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${estadoBadgeClass(row.estado)}`}>
                              {row.estado.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Alertas de stock */}
            <div className="rounded-xl border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-bold text-[#0D0D0D]">Alertas de stock</h2>
                <p className="text-xs text-gray-400 mt-0.5">Productos que requieren atención</p>
              </div>
              <div className="p-5 space-y-4">
                {STOCK_ALERTS.map(item => {
                  const sinStock = item.stock === 0;
                  return (
                    <div key={item.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#0D0D0D] leading-tight">{item.nombre}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${sinStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {sinStock ? 'Sin stock' : 'Stock bajo'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Stock actual: <span className={`font-bold ${sinStock ? 'text-red-600' : 'text-orange-600'}`}>{item.stock}</span></span>
                        <span>Mínimo: {item.minimo}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${sinStock ? 'bg-red-500' : 'bg-orange-400'}`}
                          style={{ width: `${Math.min(100, (item.stock / (item.minimo * 3)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <Link href={`/proveedor/catalogo?id=${proveedorId}`}
                  className="block mt-2 text-center text-xs font-bold text-[#2698D1] hover:underline">
                  Gestionar catálogo →
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
