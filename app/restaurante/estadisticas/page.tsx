"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import { OTS, TECNICOS, RESTAURANTES } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro, OrdenTrabajo } from '@/types/shuuri';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Download, ChevronRight, ChevronDown } from 'lucide-react';

const TASA = 1050;
const ESTADOS_CERRADOS = ['CERRADA_CONFORME', 'CERRADA_SIN_CONFORMIDAD', 'FACTURADA', 'LIQUIDADA', 'CANCELADA'];

type Periodo = '1m' | '3m' | '6m' | '12m';

function getStart(p: Periodo): Date {
  const n = new Date();
  const months = p === '1m' ? 1 : p === '3m' ? 3 : p === '6m' ? 6 : 12;
  return new Date(n.getFullYear(), n.getMonth() - (months - 1), 1);
}
function inPeriod(iso: string, start: Date): boolean { return new Date(iso) >= start; }

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function SectionCard({ title, onExport, children }: {
  title: string; onExport: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0D0D0D] text-base">{title}</h3>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>
      {children}
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const colors: Record<string, string> = {
    LIQUIDADA: 'bg-green-100 text-green-700',
    FACTURADA: 'bg-blue-100 text-blue-700',
    CERRADA_CONFORME: 'bg-emerald-100 text-emerald-700',
    CERRADA_SIN_CONFORMIDAD: 'bg-orange-100 text-orange-700',
    CANCELADA: 'bg-red-100 text-red-700',
  };
  const cls = colors[estado] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {estado.replace(/_/g, ' ')}
    </span>
  );
}

export default function RestauranteEstadisticas() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? 'R001';
  const restaurante = RESTAURANTES.find(r => r.id === id) ?? RESTAURANTES[0];
  const [periodo, setPeriodo] = useState<Periodo>('6m');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const start = useMemo(() => getStart(periodo), [periodo]);

  const misOTs = useMemo(
    () => OTS.filter(ot => ot.restauranteId === restaurante.id && inPeriod(ot.fechaCreacion, start)),
    [restaurante.id, start]
  );

  // Sección 1 — Por activo (equipoTipo)
  const porActivo = useMemo(() => {
    const map = new Map<string, OrdenTrabajo[]>();
    misOTs.forEach(ot => {
      const key = ot.equipoTipo;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ot);
    });
    return Array.from(map.entries()).map(([equipoTipo, ots]) => {
      const fallas = ots.filter(o => o.urgencia === 'ALTA' || o.urgencia === 'CRITICA').length;
      const preventivos = ots.filter(o => o.urgencia === 'BAJA').length;
      const costoARS = ots.reduce((s, o) => s + (o.cotizacion.totalDefinitivo ?? 0) * TASA, 0);
      const finalizaciones = ots
        .map(o => o.fechaFinalizacion)
        .filter(Boolean)
        .sort()
        .reverse();
      const ultimoService = finalizaciones[0]?.slice(0, 10) ?? '—';
      return { equipoTipo, ots, fallas, preventivos, costoARS, ultimoService };
    });
  }, [misOTs]);

  // Sección 2 — Por rubro
  const porRubro = useMemo(() => {
    const map = new Map<Rubro, number>();
    misOTs.forEach(ot => {
      map.set(ot.rubro, (map.get(ot.rubro) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([rubro, cantidad]) => ({
      name: RUBRO_LABELS[rubro as Rubro],
      cantidad,
      rubro,
    })).sort((a, b) => b.cantidad - a.cantidad);
  }, [misOTs]);

  // Sección 3 — Por técnico
  const porTecnico = useMemo(() => {
    const map = new Map<string, OrdenTrabajo[]>();
    misOTs.forEach(ot => {
      const key = ot.tecnicoId ?? '';
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ot);
    });
    return Array.from(map.entries()).map(([tecnicoId, ots]) => {
      const tecnico = TECNICOS.find(t => t.id === tecnicoId);
      const importe = ots.reduce((s, o) => s + (o.cotizacion.totalDefinitivo ?? 0) * TASA, 0);
      return {
        tecnicoId,
        nombre: tecnico?.nombre ?? tecnicoId,
        rating: tecnico?.score ?? 0,
        otsRealizadas: ots.length,
        importeARS: importe,
      };
    }).sort((a, b) => b.otsRealizadas - a.otsRealizadas);
  }, [misOTs]);

  // Sección 4 — Tiempo promedio
  const tiempoPromedio = useMemo(() => {
    const map = new Map<Rubro, number[]>();
    misOTs.forEach(ot => {
      if (!ot.fechaFinalizacion) return;
      const dias = (new Date(ot.fechaFinalizacion).getTime() - new Date(ot.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24);
      if (!map.has(ot.rubro)) map.set(ot.rubro, []);
      map.get(ot.rubro)!.push(dias);
    });
    return Array.from(map.entries()).map(([rubro, vals]) => ({
      rubro,
      label: RUBRO_LABELS[rubro as Rubro],
      dias: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)),
    }));
  }, [misOTs]);

  const PERIODOS: Periodo[] = ['1m', '3m', '6m', '12m'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} />
        <main className="p-8">

          {/* Header + period filter */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Estadísticas</h1>
              <p className="text-sm text-gray-400">{restaurante.nombre} · histórico de servicios</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
              {PERIODOS.map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    periodo === p ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}>{p.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* Sección 1 — Por Activo */}
          <SectionCard
            title="Por Activo"
            onExport={() => downloadCSV(
              ['activo', 'totalOTs', 'fallas', 'preventivos', 'costoARS', 'ultimoService'],
              porActivo.map(r => [r.equipoTipo, String(r.ots.length), String(r.fallas), String(r.preventivos), String(Math.round(r.costoARS)), r.ultimoService]),
              'activos.csv'
            )}
          >
            {porActivo.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin datos en el período seleccionado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-gray-500">
                      <th className="text-left pb-2 font-semibold">Activo</th>
                      <th className="text-center pb-2 font-semibold">Total OTs</th>
                      <th className="text-center pb-2 font-semibold">Fallas</th>
                      <th className="text-center pb-2 font-semibold">Preventivos</th>
                      <th className="text-right pb-2 font-semibold">Costo total</th>
                      <th className="text-right pb-2 font-semibold">Último service</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {porActivo.map(row => (
                      <React.Fragment key={row.equipoTipo}>
                        <tr
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setExpandedRow(expandedRow === row.equipoTipo ? null : row.equipoTipo)}
                        >
                          <td className="py-3 font-medium text-[#0D0D0D]">{row.equipoTipo}</td>
                          <td className="py-3 text-center text-gray-600">{row.ots.length}</td>
                          <td className="py-3 text-center text-red-600 font-semibold">{row.fallas}</td>
                          <td className="py-3 text-center text-green-600 font-semibold">{row.preventivos}</td>
                          <td className="py-3 text-right text-gray-700 font-medium">{formatARS(row.costoARS)}</td>
                          <td className="py-3 text-right text-gray-500 text-xs">{row.ultimoService}</td>
                          <td className="py-3 text-center text-gray-400">
                            {expandedRow === row.equipoTipo
                              ? <ChevronDown className="h-4 w-4 inline" />
                              : <ChevronRight className="h-4 w-4 inline" />}
                          </td>
                        </tr>
                        {expandedRow === row.equipoTipo && (
                          <tr>
                            <td colSpan={7} className="bg-gray-50 px-4 pb-3 pt-2">
                              <p className="text-xs font-semibold text-gray-500 mb-2">Historial de OTs</p>
                              <div className="space-y-1.5">
                                {row.ots.map(ot => {
                                  const tec = TECNICOS.find(t => t.id === (ot.tecnicoId ?? ''));
                                  return (
                                    <div key={ot.id} className="flex items-center gap-3 text-xs">
                                      <span className="font-mono text-gray-400 w-16">{ot.id}</span>
                                      <span className="text-gray-500 w-24">{ot.fechaCreacion.slice(0, 10)}</span>
                                      <span className="text-gray-600 flex-1">{tec?.nombre ?? '—'}</span>
                                      <EstadoBadge estado={ot.estado} />
                                      <span className="text-right font-medium text-gray-700 w-28">
                                        {formatARS((ot.cotizacion.totalDefinitivo ?? 0) * TASA)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Sección 2 — Por Rubro */}
          <SectionCard
            title="Fallas por rubro"
            onExport={() => downloadCSV(
              ['rubro', 'cantidad'],
              porRubro.map(r => [r.name, String(r.cantidad)]),
              'rubros.csv'
            )}
          >
            {porRubro.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin datos en el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={porRubro} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip formatter={(value: any) => [String(value), '']} />
                  <Bar dataKey="cantidad" fill="#2698D1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* Sección 3 — Por Técnico */}
          <SectionCard
            title="Por Técnico"
            onExport={() => downloadCSV(
              ['tecnico', 'otsRealizadas', 'rating', 'importeARS'],
              porTecnico.map(r => [r.nombre, String(r.otsRealizadas), String(r.rating), String(Math.round(r.importeARS))]),
              'tecnicos.csv'
            )}
          >
            {porTecnico.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin datos en el período seleccionado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-gray-500">
                      <th className="text-left pb-2 font-semibold">Técnico</th>
                      <th className="text-center pb-2 font-semibold">OTs realizadas</th>
                      <th className="text-center pb-2 font-semibold">Rating</th>
                      <th className="text-right pb-2 font-semibold">Importe total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porTecnico.map(row => (
                      <tr key={row.tecnicoId} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium text-[#0D0D0D]">{row.nombre}</td>
                        <td className="py-3 text-center text-gray-600 font-bold">{row.otsRealizadas}</td>
                        <td className="py-3 text-center">
                          <span className="text-amber-500 font-bold">★ {row.rating}</span>
                        </td>
                        <td className="py-3 text-right font-medium text-gray-700">{formatARS(row.importeARS)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Sección 4 — Tiempo promedio de resolución */}
          <SectionCard
            title="Tiempo promedio de resolución por rubro"
            onExport={() => downloadCSV(
              ['rubro', 'diasPromedio'],
              tiempoPromedio.map(r => [r.label, String(r.dias)]),
              'tiempo_resolucion.csv'
            )}
          >
            {tiempoPromedio.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin OTs cerradas en el período</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-gray-500">
                      <th className="text-left pb-2 font-semibold">Rubro</th>
                      <th className="text-center pb-2 font-semibold">Días promedio</th>
                      <th className="text-left pb-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiempoPromedio.map(row => {
                      const verde = row.dias < 3;
                      const amarillo = row.dias >= 3 && row.dias <= 7;
                      const semColor = verde
                        ? 'bg-green-500'
                        : amarillo
                        ? 'bg-yellow-400'
                        : 'bg-red-500';
                      const textColor = verde
                        ? 'text-green-700'
                        : amarillo
                        ? 'text-yellow-700'
                        : 'text-red-700';
                      const label = verde ? 'Óptimo' : amarillo ? 'Aceptable' : 'Lento';
                      return (
                        <tr key={row.rubro} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium text-[#0D0D0D]">{row.label}</td>
                          <td className="py-3 text-center text-gray-700 font-bold">{row.dias}d</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block h-2.5 w-2.5 rounded-full ${semColor}`} />
                              <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

        </main>
      </div>
    </div>
  );
}
