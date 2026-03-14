import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChefHat, Shield, Clock, DollarSign,
  X, CheckCircle2,
  ClipboardList, Search, FileText, Wrench, CheckSquare,
  Flame, Thermometer, Droplets, Coffee, Snowflake, Wind, Monitor, Settings2,
  Package, ArrowRight,
} from 'lucide-react';
import FaqGastronomicos from './_faq';

export const metadata: Metadata = {
  title: 'SHUURI para Restaurantes | Servicio técnico coordinado para gastronomía',
  description: 'Técnicos certificados para tu cocina. Repuesto coordinado antes de la visita. Sin llamadas perdidas. Sin sorpresas en el presupuesto. Empezá gratis.',
  keywords: 'servicio tecnico restaurante, reparacion cocina industrial, tecnico heladera restaurante, mantenimiento equipo gastronomico',
  openGraph: {
    title: 'SHUURI para Restaurantes | Servicio técnico coordinado',
    description: 'Técnicos certificados para tu cocina. Repuesto coordinado antes de la visita. Empezá gratis.',
    url: 'https://shuuri.com/gastronomicos',
  },
  alternates: {
    canonical: 'https://shuuri.com/gastronomicos',
  },
};

// ─── SECCIÓN 1: HERO ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <ChefHat className="h-4 w-4" />
          Para restaurantes, bares, hoteles y cafeterías
        </span>

        <h1 className="font-black text-5xl lg:text-6xl text-[#0D0D0D] leading-tight mb-4">
          Tu cocina no puede parar.
          <br />
          <span className="text-[#2698D1]">Nosotros nos aseguramos de que no pase.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
          SHUURI coordina todo el servicio técnico de tu equipamiento. Desde que reportás la falla
          hasta que firmás la conformidad. Con el repuesto en el local antes que el técnico.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link
            href="/solicitar-tecnico"
            className="inline-flex items-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Solicitar técnico ahora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-[#2698D1] text-[#0D0D0D] hover:text-[#2698D1] px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            Registrá tu local gratis
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {[
            { icon: Shield,     label: 'Técnico certificado'       },
            { icon: Clock,      label: 'Respuesta en horas'        },
            { icon: DollarSign, label: 'Sin costo de coordinación' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
              <Icon className="h-4 w-4 text-[#2698D1]" />
              {label}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 2: DOLOR ─────────────────────────────────────────────────────────

const DOLORES = [
  'El técnico no llega o llega sin herramientas',
  'Sin repuesto disponible — el equipo sigue roto',
  'No sabés cuánto gastaste en mantenimiento este mes',
  'Sin registro de historial por equipo',
  'Cotizaciones confusas que no entendés antes de aprobar',
  'Tiempo de respuesta impredecible en emergencias',
];

const SOLUCIONES = [
  'Técnico certificado para tu rubro, con disponibilidad verificada',
  'El repuesto llega al local antes que el técnico',
  'Dashboard de gastos en tiempo real, por equipo y por local',
  'Historial documentado con fotos y firma de conformidad',
  'Cotización transparente antes de que se ejecute cualquier trabajo',
  'Tiempo de respuesta garantizado según urgencia',
];

function Dolor() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-16">¿Te suena familiar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-red-50 rounded-2xl p-8">
            <p className="text-red-600 font-bold mb-6">Antes de SHUURI</p>
            <ul className="space-y-4">
              {DOLORES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                    <X className="h-3 w-3 text-red-500" />
                  </span>
                  <p className="text-sm text-[#0D0D0D] leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-2xl p-8">
            <p className="text-green-600 font-bold mb-6">Con SHUURI</p>
            <ul className="space-y-4">
              {SOLUCIONES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                  <p className="text-sm text-[#0D0D0D] leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 3: FLUJO ─────────────────────────────────────────────────────────

const FLUJO = [
  { num: 1, icon: ClipboardList, titulo: 'Reportar falla',          desc: 'Desde la app en 2 minutos. Foto, descripción y urgencia.',            tiempo: '2 min'          },
  { num: 2, icon: Search,        titulo: 'Diagnóstico inicial',     desc: 'Verificamos técnicos con certificación vigente para ese equipo.',      tiempo: '5 min'          },
  { num: 3, icon: FileText,      titulo: 'Cotización transparente', desc: 'Recibís el presupuesto. Aprobás o rechazás sin compromiso.',           tiempo: '1–4 hs'         },
  { num: 4, icon: Wrench,        titulo: 'Técnico en el local',     desc: 'Llega con el repuesto coordinado. Ejecuta el trabajo documentado.',    tiempo: 'Según urgencia' },
  { num: 5, icon: CheckSquare,   titulo: 'Conformidad y cierre',    desc: 'Firmás la conformidad. El historial del equipo se actualiza.',         tiempo: 'Al finalizar'   },
];

function Flujo() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-16">
          Así funciona para tu local
        </h2>

        {/* Desktop: alternado */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2698D1]/20 -translate-x-0.5" />
          <div className="space-y-10">
            {FLUJO.map(({ num, icon: Icon, titulo, desc, tiempo }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={num} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
                  {isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right">
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <h3 className="font-bold text-[#0D0D0D]">{titulo}</h3>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                      <span className="inline-block mt-2 text-xs font-semibold bg-[#2698D1]/10 text-[#2698D1] px-2 py-0.5 rounded-full">{tiempo}</span>
                    </div>
                  ) : <div />}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                    {num}
                  </div>
                  {!isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                        <h3 className="font-bold text-[#0D0D0D]">{titulo}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                      <span className="inline-block mt-2 text-xs font-semibold bg-[#2698D1]/10 text-[#2698D1] px-2 py-0.5 rounded-full">{tiempo}</span>
                    </div>
                  ) : <div />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2698D1]/20" />
          <div className="space-y-6">
            {FLUJO.map(({ num, icon: Icon, titulo, desc, tiempo }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                  {num}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-sm text-[#0D0D0D]">{titulo}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-[#2698D1]/10 text-[#2698D1] px-2 py-0.5 rounded-full">{tiempo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 4: RUBROS ────────────────────────────────────────────────────────

const RUBROS = [
  { icon: Flame,       label: 'Cocción'               },
  { icon: Thermometer, label: 'Refrigeración'          },
  { icon: Droplets,    label: 'Lavado'                 },
  { icon: Coffee,      label: 'Cafetería y bebidas'    },
  { icon: Snowflake,   label: 'Máquinas de hielo'      },
  { icon: Wind,        label: 'Climatización'          },
  { icon: Monitor,     label: 'Tecnología POS'         },
  { icon: Settings2,   label: 'Especializados'         },
];

function Rubros() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-12">
          Todos los equipos de tu cocina
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RUBROS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2698D1]/10">
                <Icon className="h-6 w-6 text-[#2698D1]" />
              </div>
              <span className="text-sm font-semibold text-[#0D0D0D] leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 5: PRECIOS ───────────────────────────────────────────────────────

const TIERS = [
  {
    nombre: 'Gratis',       badge: 'Para empezar',        badgeCls: 'bg-gray-100 text-gray-600',
    precio: 'Gratis',       periodo: 'para siempre',
    comision: '30%',        comCls: 'bg-orange-50 text-orange-700',
    highlight: false,       dark: false,
    features: [
      { l: 'Reportar fallas',           ok: true  },
      { l: 'Técnico certificado',        ok: true  },
      { l: 'Coordinación de repuesto',  ok: true  },
      { l: 'Historial por equipo',       ok: true  },
      { l: 'Múltiples sucursales',       ok: false },
      { l: 'Dashboard de estadísticas',  ok: false },
      { l: 'Técnicos fijos',             ok: false },
    ],
    cta: 'Empezar gratis',      ctaHref: '/registro',
    ctaCls: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  {
    nombre: 'Cadena Chica',  badge: 'Más popular',         badgeCls: '',
    precio: 'USD 75',        periodo: '/ local / mes',
    comision: '25%',         comCls: 'bg-blue-50 text-blue-700',
    highlight: true,         dark: false,
    features: [
      { l: 'Reportar fallas',           ok: true },
      { l: 'Técnico certificado',        ok: true },
      { l: 'Coordinación de repuesto',  ok: true },
      { l: 'Historial por equipo',       ok: true },
      { l: 'Hasta 10 sucursales',        ok: true },
      { l: 'Dashboard de estadísticas',  ok: true },
      { l: 'Técnicos fijos',             ok: true },
    ],
    cta: 'Empezar ahora',       ctaHref: '/registro',
    ctaCls: 'bg-[#2698D1] hover:bg-[#2698D1]/90 text-white',
  },
  {
    nombre: 'Cadena Grande', badge: 'Grandes operaciones', badgeCls: 'bg-gray-800 text-gray-300',
    precio: 'USD 100',       periodo: '/ local / mes',
    comision: '20%',         comCls: 'bg-green-900/50 text-green-400',
    highlight: false,        dark: true,
    features: [
      { l: 'Todo lo anterior',          ok: true },
      { l: 'Locales ilimitados',        ok: true },
      { l: 'API abierta',               ok: true },
      { l: 'Account manager',           ok: true },
      { l: 'SLA prioritario',           ok: true },
      { l: 'Preventivo programado',     ok: true },
      { l: 'Usuarios ilimitados',       ok: true },
    ],
    cta: 'Hablar con el equipo', ctaHref: 'https://wa.me/5491150148932',
    ctaCls: 'border border-gray-700 hover:border-gray-500 text-white',
  },
] as const;

function Precios() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-black text-4xl text-[#0D0D0D] mb-4">Elegí tu plan</h2>
          <p className="text-gray-500 text-lg">Empezá gratis. El SaaS es opcional y bajás la comisión.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-10">
          {TIERS.map(tier => (
            <div
              key={tier.nombre}
              className={`relative rounded-2xl p-8 ${
                tier.highlight
                  ? 'bg-white border-2 border-[#2698D1] shadow-lg md:scale-105'
                  : tier.dark
                  ? 'bg-[#0D0D0D] border border-gray-800'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {tier.highlight ? (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2698D1] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {tier.badge}
                </span>
              ) : (
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${tier.badgeCls}`}>
                  {tier.badge}
                </span>
              )}
              <h3 className={`font-black text-lg mb-2 ${tier.dark ? 'text-white' : 'text-[#0D0D0D]'}`}>{tier.nombre}</h3>
              <div className="mb-5">
                <span className={`font-black text-4xl ${tier.dark ? 'text-white' : 'text-[#0D0D0D]'}`}>{tier.precio}</span>
                <span className="text-sm text-gray-400 ml-1">{tier.periodo}</span>
              </div>
              <div className={`rounded-lg px-4 py-2.5 mb-5 ${tier.comCls}`}>
                <p className="text-xs opacity-70 mb-0.5">Comisión por servicio</p>
                <p className="font-black text-xl">{tier.comision}</p>
              </div>
              <ul className="space-y-2.5 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    {f.ok
                      ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      : <X className={`h-4 w-4 shrink-0 ${tier.dark ? 'text-gray-600' : 'text-gray-300'}`} />
                    }
                    <span className={`text-sm ${f.ok ? (tier.dark ? 'text-gray-200' : 'text-[#0D0D0D]') : (tier.dark ? 'text-gray-600' : 'text-gray-400')}`}>
                      {f.l}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={tier.ctaHref} className={`block w-full text-center rounded-xl py-3 text-sm font-bold transition-colors ${tier.ctaCls}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Mini cards técnicos y proveedores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Wrench className="h-5 w-5 text-[#2698D1]" />
            </div>
            <div>
              <h4 className="font-bold text-[#0D0D0D] mb-1">Técnicos</h4>
              <p className="text-sm text-gray-500">70% de cada servicio · Liquidación quincenal · Sin suscripción</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-[#0D0D0D] mb-1">Proveedores</h4>
              <p className="text-sm text-gray-500">15% comisión marketplace · 10% insumos · Modelo mandato</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/precios" className="text-sm font-semibold text-[#2698D1] hover:underline">
            Ver comparativa completa →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 7: CTA FINAL ─────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="bg-[#0D0D0D] py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-black text-4xl text-white mb-8">Empezá hoy. Gratis.</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/solicitar-tecnico"
            className="inline-flex items-center justify-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Solicitar técnico ahora
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center border border-gray-700 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
          >
            Registrá tu local
          </Link>
        </div>
        <a
          href="https://wa.me/5491150148932"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-gray-500 hover:text-gray-300 text-sm mt-5 transition-colors"
        >
          Hablar con el equipo →
        </a>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function GastronomicosPage() {
  return (
    <>
      <Hero />
      <Dolor />
      <Flujo />
      <Rubros />
      <Precios />
      <FaqGastronomicos />
      <CtaFinal />
    </>
  );
}
