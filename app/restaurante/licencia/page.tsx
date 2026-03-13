"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES } from '@/data/mock';
import type { TierCliente } from '@/types/shuuri';
import {
  getTierLabel, getTierBadgeClass, getComisionServicioPct,
  getSuscripcionMensual, TIER_FEATURES,
} from '@/lib/business';

// Local helpers for readability
const comPct  = (t: TierCliente) => Math.round(getComisionServicioPct(t) * 100);
const saasUSD = (t: TierCliente) => getSuscripcionMensual(t) ?? 0;
import {
  Award, CheckCircle2, X, Zap, Building2, Users,
  BarChart3, UserCheck, ShoppingBag, HeadphonesIcon,
  ArrowRight, Star, CreditCard, CalendarDays,
} from 'lucide-react';

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────

interface PlanFeature { label: string; freemium: boolean | string; chica: boolean | string; grande: boolean | string; }

const FEATURES: PlanFeature[] = [
  { label: 'Reportar fallas',        freemium: true,           chica: true,              grande: true },
  { label: 'Seguimiento de OTs',     freemium: true,           chica: true,              grande: true },
  { label: 'Equipos registrados',    freemium: 'Hasta 5',      chica: 'Hasta 20',        grande: 'Ilimitados' },
  { label: 'Sucursales',             freemium: '1',            chica: 'Hasta 2',         grande: 'Ilimitadas' },
  { label: 'Usuarios del portal',    freemium: '1',            chica: 'Hasta 3',         grande: 'Ilimitados' },
  { label: 'Técnicos fijos',         freemium: false,          chica: 'Hasta 2',         grande: 'Ilimitados' },
  { label: 'Marketplace de repuestos', freemium: false,        chica: true,              grande: true },
  { label: 'Estadísticas avanzadas', freemium: false,          chica: false,             grande: true },
  { label: 'Exportación CSV',        freemium: false,          chica: true,              grande: true },
  { label: 'Integraciones (API)',     freemium: false,          chica: false,             grande: true },
  { label: 'Soporte prioritario',    freemium: false,          chica: false,             grande: true },
  { label: 'Liquidaciones automáticas', freemium: false,       chica: true,              grande: true },
  { label: 'Reportes de compliance', freemium: false,          chica: false,             grande: true },
];

const PLANS: { key: TierCliente; label: string; tagline: string; color: string; accent: string; ring: string }[] = [
  {
    key:     'FREEMIUM',
    label:   'Freemium',
    tagline: 'Para empezar sin costo',
    color:   'border-gray-200',
    accent:  'bg-gray-100 text-gray-700',
    ring:    'ring-gray-300',
  },
  {
    key:     'CADENA_CHICA',
    label:   'Cadena Chica',
    tagline: 'Para negocios en crecimiento',
    color:   'border-[#2698D1]',
    accent:  'bg-blue-100 text-blue-700',
    ring:    'ring-[#2698D1]',
  },
  {
    key:     'CADENA_GRANDE',
    label:   'Cadena Grande',
    tagline: 'Para operaciones multi-local',
    color:   'border-yellow-400',
    accent:  'bg-yellow-100 text-yellow-700',
    ring:    'ring-yellow-400',
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === false) return <X className="h-4 w-4 text-gray-300 mx-auto" />;
  if (value === true)  return <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />;
  return <span className="text-xs font-semibold text-[#0D0D0D]">{value}</span>;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LicenciaPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];
  const currentTier   = restaurante.tier;

  const [showUpgradeModal, setShowUpgradeModal] = useState<TierCliente | null>(null);
  const [upgraded, setUpgraded] = useState(false);

  const currentPlan = PLANS.find(p => p.key === currentTier)!;

  function canUpgradeTo(tier: TierCliente) {
    const order: TierCliente[] = ['FREEMIUM', 'CADENA_CHICA', 'CADENA_GRANDE'];
    return order.indexOf(tier) > order.indexOf(currentTier);
  }

  function handleUpgrade() {
    setShowUpgradeModal(null);
    setUpgraded(true);
    setTimeout(() => setUpgraded(false), 4000);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-5xl">

          {/* ── HEADER ── */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#0D0D0D] flex items-center gap-2 mb-1">
              <Award className="h-6 w-6 text-[#2698D1]" />
              Mi Licencia
            </h1>
            <p className="text-sm text-gray-500">Gestioná tu plan y conocé los beneficios disponibles.</p>
          </div>

          {/* ── PLAN ACTUAL ── */}
          <div className={`mb-8 rounded-2xl border-2 ${currentPlan.color} bg-white p-6 shadow-sm`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  currentTier === 'FREEMIUM' ? 'bg-gray-100' :
                  currentTier === 'CADENA_CHICA' ? 'bg-blue-50' : 'bg-yellow-50'
                }`}>
                  <Award className={`h-7 w-7 ${
                    currentTier === 'FREEMIUM' ? 'text-gray-500' :
                    currentTier === 'CADENA_CHICA' ? 'text-[#2698D1]' : 'text-yellow-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#0D0D0D]">{currentPlan.label}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${currentPlan.accent}`}>
                      Plan actual
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{currentPlan.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#0D0D0D]">
                  {saasUSD(currentTier) === 0 ? 'Gratis' : `USD ${saasUSD(currentTier)}`}
                </p>
                {saasUSD(currentTier) > 0 && <p className="text-xs text-gray-400">por mes + IVA</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Comisión por OT: <span className="font-bold text-[#0D0D0D]">{comPct(currentTier)}%</span>
                </p>
              </div>
            </div>

            {/* Suscripción activa */}
            {restaurante.suscripcionActivaDesde && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <CalendarDays className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>
                  Suscripción activa desde{' '}
                  <span className="font-bold text-[#0D0D0D]">
                    {new Date(restaurante.suscripcionActivaDesde).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                  </span>
                  {restaurante.cantidadLocalesSuscriptos != null && (
                    <> · <span className="font-bold text-[#0D0D0D]">{restaurante.cantidadLocalesSuscriptos}</span>{' '}
                    {restaurante.cantidadLocalesSuscriptos === 1 ? 'local suscripto' : 'locales suscriptos'}</>
                  )}
                </span>
              </div>
            )}

            {/* Highlights del plan actual */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Building2,   label: 'Sucursales',    value: currentTier === 'FREEMIUM' ? '1' : currentTier === 'CADENA_CHICA' ? 'Hasta 2' : 'Ilimitadas' },
                { icon: Users,       label: 'Usuarios',      value: currentTier === 'FREEMIUM' ? '1' : currentTier === 'CADENA_CHICA' ? 'Hasta 3' : 'Ilimitados' },
                { icon: UserCheck,   label: 'Técnicos fijos', value: currentTier === 'FREEMIUM' ? 'No incluido' : currentTier === 'CADENA_CHICA' ? 'Hasta 2' : 'Ilimitados' },
                { icon: ShoppingBag, label: 'Marketplace',   value: currentTier === 'FREEMIUM' ? 'No incluido' : 'Incluido' },
              ].map(h => {
                const Icon = h.icon;
                return (
                  <div key={h.label} className="rounded-xl bg-gray-50 p-3">
                    <Icon className="h-4 w-4 text-gray-400 mb-1.5" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">{h.label}</p>
                    <p className="text-sm font-bold text-[#0D0D0D] mt-0.5">{h.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── TIER FEATURES CARD ── */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-black text-[#0D0D0D] mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Lo que incluye tu plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { key: 'comisionServicio',      label: 'Comisión por servicio' },
                { key: 'suscripcionMensual',    label: 'Suscripción mensual' },
                { key: 'usuarios',              label: 'Usuarios del portal' },
                { key: 'sucursales',            label: 'Sucursales' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-bold text-[#0D0D0D]">{TIER_FEATURES[currentTier][key]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: 'preventivo',            label: 'Preventivo' },
                { key: 'dashboardEstadisticas', label: 'Estadísticas' },
                { key: 'tecnicosFijos',         label: 'Técnicos fijos' },
                { key: 'soportePrioritario',    label: 'Soporte prioritario' },
              ] as const).map(({ key, label }) => {
                const enabled = TIER_FEATURES[currentTier][key];
                return (
                  <div key={key} className={`flex flex-col items-center rounded-xl p-3 gap-1 ${enabled ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {enabled
                      ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                      : <X className="h-5 w-5 text-gray-300" />
                    }
                    <span className={`text-xs font-semibold ${enabled ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── UPGRADE CARDS ── */}
          {currentTier !== 'CADENA_GRANDE' && (
            <div className="mb-8">
              <h2 className="text-lg font-black text-[#0D0D0D] mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#2698D1]" />
                Mejorar plan
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {PLANS.filter(p => canUpgradeTo(p.key)).map(plan => (
                  <div
                    key={plan.key}
                    className={`relative rounded-2xl border-2 ${plan.color} bg-white p-6 shadow-sm`}
                  >
                    {plan.key === 'CADENA_GRANDE' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-0.5 text-[10px] font-black text-white">
                        <Star className="h-3 w-3 fill-white" /> MÁS POPULAR
                      </div>
                    )}

                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold mb-2 ${plan.accent}`}>
                          {plan.label}
                        </span>
                        <p className="text-sm text-gray-500">{plan.tagline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#0D0D0D]">
                          {saasUSD(plan.key) === 0 ? 'Gratis' : `USD ${saasUSD(plan.key)}`}
                        </p>
                        <p className="text-xs text-gray-400">/mes + IVA</p>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      Comisión por OT: <span className="font-bold text-[#0D0D0D]">{comPct(plan.key)}%</span>
                      <span className="text-green-600 font-bold">
                        (ahorras {comPct(currentTier) - comPct(plan.key)}%)
                      </span>
                    </div>

                    <ul className="mb-5 space-y-1.5">
                      {[
                        plan.key === 'CADENA_CHICA'
                          ? ['Hasta 2 sucursales', 'Hasta 3 usuarios', 'Marketplace incluido', 'Técnicos fijos', 'Exportación CSV']
                          : ['Sucursales ilimitadas', 'Usuarios ilimitados', 'Estadísticas avanzadas', 'Integraciones API', 'Soporte prioritario', 'Reportes compliance']
                      ][0].map(feat => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setShowUpgradeModal(plan.key)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
                        plan.key === 'CADENA_GRANDE'
                          ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                          : 'bg-[#2698D1] text-white hover:bg-[#1d7ab8]'
                      }`}
                    >
                      Contratar {plan.label}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TABLA COMPARATIVA ── */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-[#0D0D0D]">Comparación de planes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-6 text-left text-xs font-bold uppercase tracking-wide text-gray-400 w-1/2">Función</th>
                    {PLANS.map(p => (
                      <th key={p.key} className="py-3 px-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${p.accent} ${currentTier === p.key ? `ring-2 ${p.ring}` : ''}`}>
                          {p.label}
                        </span>
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2 px-6 text-xs text-gray-400">Costo mensual</td>
                    {PLANS.map(p => (
                      <td key={p.key} className="py-2 px-4 text-center text-xs font-bold text-[#0D0D0D]">
                        {saasUSD(p.key) === 0 ? 'Gratis' : `USD ${saasUSD(p.key)}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-2 px-6 text-xs text-gray-400">Comisión por OT</td>
                    {PLANS.map(p => (
                      <td key={p.key} className="py-2 px-4 text-center text-xs font-bold text-[#0D0D0D]">
                        {comPct(p.key)}%
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feat, i) => (
                    <tr key={feat.label} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="py-3 px-6 text-sm text-gray-700">{feat.label}</td>
                      <td className="py-3 px-4 text-center"><FeatureValue value={feat.freemium} /></td>
                      <td className="py-3 px-4 text-center"><FeatureValue value={feat.chica} /></td>
                      <td className="py-3 px-4 text-center"><FeatureValue value={feat.grande} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SOPORTE ── */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <HeadphonesIcon className="h-5 w-5 text-[#2698D1]" />
            </div>
            <div>
              <p className="font-bold text-[#0D0D0D] text-sm">¿Tenés dudas sobre qué plan elegir?</p>
              <p className="text-xs text-gray-500 mt-0.5">Contactá a nuestro equipo comercial y te ayudamos a encontrar el plan ideal para tu negocio.</p>
            </div>
            <button className="ml-auto shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
              Contactar ventas
            </button>
          </div>

        </main>
      </div>

      {/* ── UPGRADE MODAL ── */}
      {showUpgradeModal && (() => {
        const plan = PLANS.find(p => p.key === showUpgradeModal)!;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowUpgradeModal(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-5 text-center">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold mb-3 ${plan.accent}`}>
                  {plan.label}
                </span>
                <h2 className="text-xl font-black text-[#0D0D0D]">Contratar plan</h2>
                <p className="text-sm text-gray-500 mt-1">
                  USD {saasUSD(showUpgradeModal)}/mes + IVA · Comisión {comPct(showUpgradeModal)}%
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 mb-5 space-y-2">
                {[
                  { label: 'Establecimiento', value: restaurante.nombre },
                  { label: 'Plan actual',     value: currentPlan.label },
                  { label: 'Nuevo plan',      value: plan.label },
                  { label: 'Facturación',     value: `Mensual · USD ${saasUSD(showUpgradeModal)}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-semibold text-[#0D0D0D]">{row.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center mb-5">
                Al confirmar, aceptás los términos de servicio de SHUURI. El cambio de plan entra en vigencia de inmediato.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowUpgradeModal(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpgrade}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${
                    plan.key === 'CADENA_GRANDE' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-[#2698D1] hover:bg-[#1d7ab8]'
                  }`}
                >
                  Confirmar upgrade
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── TOAST ── */}
      {upgraded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          ¡Plan actualizado! El equipo de SHUURI te contactará para confirmar.
        </div>
      )}
    </div>
  );
}
