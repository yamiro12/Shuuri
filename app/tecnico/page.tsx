"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { EstadoBadge, UrgenciaBadge, formatARS, formatDate } from '@/components/shared/utils';
import { OTS, TECNICOS, LIQUIDACIONES } from '@/data/mock';
import { AlertTriangle, Calendar, Wrench, DollarSign, Star, ShieldCheck, PercentCircle, ChevronRight, Banknote } from 'lucide-react';

const TASA_USD_ARS = 1050;

export default function TecnicoDashboard() {
  const searchParams = useSearchParams();
  const tecnicoId = searchParams.get('id') ?? 'T001';
  const TECNICO = TECNICOS.find(t => t.id === tecnicoId) ?? TECNICOS[0];

  const misOTs = useMemo(() => OTS.filter(o => o.tecnicoId === TECNICO.id), [TECNICO.id]);
  const liquidadoEsteMes = useMemo(() => {
    const mes = new Date().toISOString().slice(0, 7);
    return LIQUIDACIONES
      .filter(l => l.tecnicoId === TECNICO.id && l.fechaDevengado?.startsWith(mes))
      .reduce((s, l) => s + l.pagoTecnico * TASA_USD_ARS, 0);
  }, [TECNICO.id]);

  const activas = misOTs.filter(o => !['CERRADA_CONFORME','CERRADA_SIN_CONFORMIDAD','CANCELADA','LIQUIDADA'].includes(o.estado));
  const hoy = misOTs.filter(o => o.fechaVisitaProgramada?.startsWith(new Date().toISOString().slice(0, 10)));

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={TECNICO.nombre} actorId={tecnicoId} />
        <main className="page-main">

          {TECNICO.certStatusGlobal === 'por_vencer' && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
              <p className="text-sm font-medium text-yellow-800">
                Tenés <strong>1 certificación por vencer</strong>. Renovala para no ser bloqueado.
              </p>
              <Link href="/tecnico/perfil" className="ml-auto text-sm font-bold text-yellow-700 underline">Ver certificaciones</Link>
            </div>
          )}

          {TECNICO.bloqueado && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-sm font-medium text-red-800">
                <strong>Cuenta bloqueada.</strong> No podés recibir nuevas OTs hasta renovar tu documentación.
              </p>
              <Link href="/tecnico/perfil" className="ml-auto text-sm font-bold text-red-700 underline">Regularizar</Link>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Buen día, {TECNICO.nombre}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-600">{TECNICO.score} · {TECNICO.rubros.map(r => r).join(', ')}</span>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'OTs activas', value: activas.length, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Visitas hoy', value: hoy.length, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Liquidado este mes', value: formatARS(liquidadoEsteMes), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Score actual', value: TECNICO.score, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 rounded-xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="font-bold text-[#0D0D0D]">Mis OTs activas</h2>
                <Link href="/tecnico/ots" className="text-sm font-medium text-[#2698D1] hover:underline">Ver todas</Link>
              </div>
              <div className="divide-y">
                {activas.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-gray-400">No tenés OTs activas.</p>
                )}
                {activas.map(ot => (
                  <Link key={ot.id} href={`/tecnico/ots/${ot.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 w-16">{ot.id}</span>
                      <div>
                        <p className="text-sm font-medium text-[#0D0D0D]">{ot.equipoTipo}</p>
                        <p className="text-xs text-gray-400 capitalize">{ot.rubro}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UrgenciaBadge urgencia={ot.urgencia} />
                      <EstadoBadge estado={ot.estado} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">

              {/* ── PRÓXIMA LIQUIDACIÓN ── */}
              {(() => {
                const devengado = LIQUIDACIONES
                  .filter(l => l.tecnicoId === TECNICO.id && l.estado !== 'PAGADA')
                  .reduce((s, l) => s + l.pagoTecnico * TASA_USD_ARS, 0);
                const hoyDate = new Date();
                const dia = hoyDate.getDate();
                const mes = hoyDate.toLocaleString('es-AR', { month: 'long' });
                const proxDia = dia <= 15 ? 15 : new Date(hoyDate.getFullYear(), hoyDate.getMonth() + 1, 0).getDate();
                const diasRestantes = proxDia - dia;
                return devengado > 0 ? (
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-green-900 text-sm">Próxima liquidación</h3>
                    </div>
                    <p className="text-2xl font-black text-green-700">{formatARS(devengado)}</p>
                    <p className="text-xs text-green-600 mt-1">Devengado pendiente de acreditación</p>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white border border-green-200 px-3 py-2">
                      <span className="text-xs text-gray-500">Acreditación estimada</span>
                      <span className="text-xs font-bold text-green-700">
                        Día {proxDia} de {mes}
                        {diasRestantes > 0 ? ` · en ${diasRestantes}d` : ' · hoy'}
                      </span>
                    </div>
                    <Link href="/tecnico/liquidaciones" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-green-700 hover:text-green-800">
                      Ver liquidaciones <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : null;
              })()}

              {/* ── MI ESQUEMA DE COMISIONES ── */}
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PercentCircle className="h-5 w-5 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D] text-sm">Mi esquema de comisiones</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { tier: 'Freemium',      pct: '30%', cls: 'bg-gray-100 text-gray-600' },
                    { tier: 'Cadena chica',  pct: '25%', cls: 'bg-blue-100 text-blue-700' },
                    { tier: 'Cadena grande', pct: '20%', cls: 'bg-yellow-100 text-yellow-700' },
                  ].map(r => (
                    <div key={r.tier} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-xs text-gray-600">{r.tier}</span>
                      <span className={`text-xs font-black rounded-full px-2.5 py-0.5 ${r.cls}`}>
                        retención SHUURI {r.pct}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-[#2698D1]/20 bg-blue-50 px-3 py-2.5">
                  <p className="text-xs text-[#2698D1] font-medium leading-snug">
                    <strong>Periodicidad quincenal:</strong> pagos los días 15 y último de cada mes por OTs cerradas en cada quincena.
                  </p>
                </div>
                <Link href="/tecnico/liquidaciones" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-[#2698D1] hover:text-[#2698D1]/80">
                  Ver mi historial completo <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-[#2698D1]" />
                  <h3 className="font-bold text-[#0D0D0D] text-sm">Mis certificaciones</h3>
                </div>
                {TECNICO.certificaciones.map(cert => (
                  <div key={cert.id} className="mb-3 last:mb-0">
                    <p className="text-xs font-medium text-[#0D0D0D]">{cert.nombre}</p>
                    <p className="text-xs text-gray-400">Vence: {formatDate(cert.fechaVencimiento)}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${cert.estado === 'vigente' ? 'bg-green-100 text-green-700' : cert.estado === 'por_vencer' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {cert.estado === 'vigente' ? 'Vigente' : cert.estado === 'por_vencer' ? 'Por vencer' : 'Vencida'}
                    </span>
                  </div>
                ))}
                <Link href="/tecnico/perfil" className="mt-3 block text-xs font-medium text-[#2698D1] hover:underline">
                  Ver todas →
                </Link>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#0D0D0D] text-sm mb-3">Accesos rápidos</h3>
                <div className="space-y-2">
                  <Link href="/tecnico/agenda" className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors">
                    <Calendar className="h-4 w-4" /> Mi agenda
                  </Link>
                  <Link href="/tecnico/liquidaciones" className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors">
                    <DollarSign className="h-4 w-4" /> Liquidaciones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}