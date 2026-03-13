"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  ShieldOff, ShieldCheck, AlertTriangle,
  ChevronDown, ChevronRight, CheckCircle,
} from 'lucide-react';

type ComplianceFilter = 'todos' | 'bloqueados' | 'por_vencer' | 'ok';

function RubroComplianceRow({ rubro, estado }: { rubro: Rubro; estado: string }) {
  const estilos = {
    vigente:    { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  label: 'Vigente' },
    por_vencer: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Por vencer' },
    vencida:    { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       label: 'Vencida' },
  };
  const s = estilos[estado as keyof typeof estilos] ?? estilos.vencida;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${s.dot} shrink-0`} />
        <span className="text-xs text-gray-600">{RUBRO_LABELS[rubro]}</span>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.badge}`}>{s.label}</span>
    </div>
  );
}

function TecnicoComplianceCard({ tecnico }: { tecnico: typeof TECNICOS[0] }) {
  const [expandido, setExpandido] = useState(false);

  const rubrosConCert = Object.entries(tecnico.certPorRubro ?? {}) as [Rubro, string][];
  const rubrosVencidos   = rubrosConCert.filter(([, s]) => s === 'vencida');
  const rubrosPorVencer  = rubrosConCert.filter(([, s]) => s === 'por_vencer');
  const rubrosVigentes   = rubrosConCert.filter(([, s]) => s === 'vigente');

  const borderColor = tecnico.bloqueado
    ? 'border-red-200'
    : tecnico.certStatusGlobal === 'por_vencer'
    ? 'border-yellow-200'
    : 'border-green-200';

  const headerBg = tecnico.bloqueado
    ? 'bg-red-50'
    : tecnico.certStatusGlobal === 'por_vencer'
    ? 'bg-yellow-50'
    : 'bg-green-50';

  return (
    <div className={`rounded-xl border-2 ${borderColor} bg-white shadow-sm overflow-hidden`}>
      {/* HEADER */}
      <button
        onClick={() => setExpandido(!expandido)}
        className={`w-full flex items-center gap-4 px-5 py-4 ${headerBg} text-left`}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black shrink-0 ${
          tecnico.bloqueado ? 'bg-red-200 text-red-700'
          : tecnico.certStatusGlobal === 'por_vencer' ? 'bg-yellow-200 text-yellow-700'
          : 'bg-green-200 text-green-700'
        }`}>
          {tecnico.nombre.split(' ').map(n => n[0]).join('').substring(0,2)}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-[#0D0D0D]">{tecnico.nombre}</p>
            {tecnico.bloqueado ? (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                <ShieldOff className="h-3 w-3" /> BLOQUEADO
              </span>
            ) : tecnico.certStatusGlobal === 'por_vencer' ? (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700">
                <AlertTriangle className="h-3 w-3" /> Por vencer
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                <ShieldCheck className="h-3 w-3" /> Habilitado
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {tecnico.zona} · {rubrosVencidos.length > 0 ? `${rubrosVencidos.length} vencido(s)` : ''}
            {rubrosPorVencer.length > 0 ? ` · ${rubrosPorVencer.length} por vencer` : ''}
            {rubrosVencidos.length === 0 && rubrosPorVencer.length === 0 ? 'Todas las certs vigentes' : ''}
          </p>
        </div>

        {/* Indicadores rápidos */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <p className="text-lg font-black text-red-600">{rubrosVencidos.length}</p>
            <p className="text-xs text-gray-400">Vencidas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-yellow-600">{rubrosPorVencer.length}</p>
            <p className="text-xs text-gray-400">Por vencer</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-green-600">{rubrosVigentes.length}</p>
            <p className="text-xs text-gray-400">Vigentes</p>
          </div>
          {expandido
            ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
            : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          }
        </div>
      </button>

      {/* DETALLE EXPANDIBLE */}
      {expandido && (
        <div className="px-5 py-4 border-t">

          {/* Rubros bloqueados */}
          {rubrosVencidos.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold text-red-600 uppercase tracking-wide">
                Rubros bloqueados ({rubrosVencidos.length})
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {rubrosVencidos.map(([r]) => (
                  <RubroComplianceRow key={r} rubro={r} estado="vencida" />
                ))}
              </div>
            </div>
          )}

          {/* Rubros por vencer */}
          {rubrosPorVencer.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold text-yellow-600 uppercase tracking-wide">
                Por vencer ({rubrosPorVencer.length})
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {rubrosPorVencer.map(([r]) => (
                  <RubroComplianceRow key={r} rubro={r} estado="por_vencer" />
                ))}
              </div>
            </div>
          )}

          {/* Rubros vigentes */}
          {rubrosVigentes.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold text-green-600 uppercase tracking-wide">
                Vigentes ({rubrosVigentes.length})
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {rubrosVigentes.map(([r]) => (
                  <RubroComplianceRow key={r} rubro={r} estado="vigente" />
                ))}
              </div>
            </div>
          )}

          {/* Certificaciones individuales */}
          {tecnico.certificaciones.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                Certificaciones cargadas
              </p>
              <div className="space-y-2">
                {tecnico.certificaciones.map(cert => (
                  <div key={cert.id} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
                    cert.estado === 'vigente' ? 'border-green-100 bg-green-50' :
                    cert.estado === 'por_vencer' ? 'border-yellow-100 bg-yellow-50' :
                    'border-red-100 bg-red-50'
                  }`}>
                    <div>
                      <p className="text-sm font-medium text-[#0D0D0D]">{cert.nombre}</p>
                      <p className="text-xs text-gray-400">{cert.entidadEmisora} · Vence: {cert.fechaVencimiento}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      cert.estado === 'vigente' ? 'bg-green-200 text-green-800' :
                      cert.estado === 'por_vencer' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {cert.estado === 'vigente' ? 'Vigente' : cert.estado === 'por_vencer' ? 'Por vencer' : 'Vencida'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acción */}
          <div className="mt-4 flex justify-end">
            <Link href={`/tecnico/perfil?id=${tecnico.id}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors">
              Ver legajo completo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function AdminCompliance() {
  const [filtro, setFiltro] = useState<ComplianceFilter>('todos');

  const tecnicosBloqueados  = TECNICOS.filter(t => t.bloqueado);
  const tecnicosPorVencer   = TECNICOS.filter(t => !t.bloqueado && t.certStatusGlobal === 'por_vencer');
  const tecnicosOk          = TECNICOS.filter(t => !t.bloqueado && t.certStatusGlobal === 'vigente');

  const listado = filtro === 'bloqueados'  ? tecnicosBloqueados
    : filtro === 'por_vencer' ? tecnicosPorVencer
    : filtro === 'ok'         ? tecnicosOk
    : TECNICOS;

  // Orden: bloqueados primero, luego por_vencer, luego vigentes
  const ordenado = [...listado].sort((a, b) => {
    const peso = (t: typeof TECNICOS[0]) =>
      t.bloqueado ? 0 : t.certStatusGlobal === 'por_vencer' ? 1 : 2;
    return peso(a) - peso(b);
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="SHUURI_ADMIN" userName="SHUURI Admin" />
      <div className="flex-1 ml-64">
        <Header userRole="SHUURI_ADMIN" userName="Admin" />
        <main className="p-8">

          {/* TÍTULO */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Compliance</h1>
            <p className="text-gray-500">Estado de certificaciones por técnico</p>
          </div>

          {/* RESUMEN */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
              <p className="text-3xl font-black text-red-600">{tecnicosBloqueados.length}</p>
              <p className="text-sm font-bold text-red-600">Bloqueados</p>
              <p className="text-xs text-red-400 mt-0.5">No pueden recibir OTs</p>
            </div>
            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 text-center">
              <p className="text-3xl font-black text-yellow-600">{tecnicosPorVencer.length}</p>
              <p className="text-sm font-bold text-yellow-600">Por vencer</p>
              <p className="text-xs text-yellow-400 mt-0.5">Requieren renovación pronto</p>
            </div>
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center">
              <p className="text-3xl font-black text-green-600">{tecnicosOk.length}</p>
              <p className="text-sm font-bold text-green-600">Habilitados</p>
              <p className="text-xs text-green-400 mt-0.5">Todas las certs vigentes</p>
            </div>
          </div>

          {/* FILTROS */}
          <div className="mb-4 flex items-center gap-2">
            {([
              { key: 'todos',      label: `Todos (${TECNICOS.length})` },
              { key: 'bloqueados', label: `Bloqueados (${tecnicosBloqueados.length})` },
              { key: 'por_vencer', label: `Por vencer (${tecnicosPorVencer.length})` },
              { key: 'ok',         label: `Habilitados (${tecnicosOk.length})` },
            ] as const).map(tab => (
              <button key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  filtro === tab.key ? 'bg-[#0D0D0D] text-white' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* CARDS */}
          <div className="space-y-3">
            {ordenado.length === 0 ? (
              <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-400 italic">
                Sin técnicos en esta categoría.
              </div>
            ) : ordenado.map(t => (
              <TecnicoComplianceCard key={t.id} tecnico={t} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
