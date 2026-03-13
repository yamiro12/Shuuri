import Link from 'next/link';
import {
  AlertTriangle, Wrench, Package, ClipboardList,
  ShieldCheck, CheckCircle2, UtensilsCrossed, UserCheck,
} from 'lucide-react';

// ─── SECCIÓN 1: HERO ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <span className="inline-flex bg-[#2698D1]/10 text-[#2698D1] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Plataforma de servicios técnicos para gastronomía
        </span>

        {/* H1 */}
        <h1 className="font-black text-5xl lg:text-6xl text-[#0D0D0D] leading-tight">
          Cuando se rompe algo en tu cocina,{' '}
          <span className="text-[#2698D1]">SHUURI</span> lo resuelve
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
          Conectamos restaurantes, técnicos certificados y proveedores de repuestos.
          Un solo lugar para coordinar, documentar y controlar el mantenimiento de tu equipamiento.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Registrarse gratis
          </Link>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg text-[#0D0D0D] hover:bg-gray-50 transition-colors"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Micro-copy */}
        <p className="text-sm text-gray-400 mt-4">
          Gratis para empezar · Sin tarjeta de crédito
        </p>

        {/* Actor pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
          {[
            { icon: UtensilsCrossed, label: 'Restaurantes',  color: 'bg-blue-50 text-[#2698D1]' },
            { icon: Wrench,          label: 'Técnicos',      color: 'bg-gray-100 text-gray-700' },
            { icon: Package,         label: 'Proveedores',   color: 'bg-green-50 text-green-700' },
          ].map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${color}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 2: DOLOR ─────────────────────────────────────────────────────────

const DOLOR_CARDS = [
  {
    icon:   AlertTriangle,
    color:  'text-amber-500',
    bg:     'bg-amber-50',
    titulo: 'No sabés a quién llamar cuando se rompe algo',
    texto:  'Dependés de un técnico de confianza que a veces aparece y a veces no. Mientras tanto, la cocina no funciona.',
  },
  {
    icon:   Wrench,
    color:  'text-[#2698D1]',
    bg:     'bg-blue-50',
    titulo: 'Llegás al local y el repuesto no está',
    texto:  'Perdés viajes, perdés tiempo, el cliente queda mal. Nadie coordinó nada antes de que llegues.',
  },
  {
    icon:   Package,
    color:  'text-green-600',
    bg:     'bg-green-50',
    titulo: 'Vendés a través de canales que no podés medir',
    texto:  'No tenés visibilidad de qué técnicos usan tus repuestos ni qué clientes tienen tus equipos instalados.',
  },
];

function Dolor() {
  return (
    <section id="problema" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-12">
          ¿Te reconocés en alguna de estas situaciones?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOLOR_CARDS.map(({ icon: Icon, color, bg, titulo, texto }) => (
            <div key={titulo} className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg} mb-5`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="font-bold text-lg text-[#0D0D0D] mb-3 leading-snug">{titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 3: CÓMO FUNCIONA ─────────────────────────────────────────────────

const PASOS = [
  {
    num:    '01',
    icon:   ClipboardList,
    titulo: 'El restaurante reporta la falla',
    texto:  'Desde la app, en 2 minutos. Con foto, equipo y descripción del problema.',
  },
  {
    num:    '02',
    icon:   ShieldCheck,
    titulo: 'SHUURI asigna el técnico correcto',
    texto:  'Con certificación vigente para ese equipo. El repuesto se coordina antes de la visita.',
  },
  {
    num:    '03',
    icon:   CheckCircle2,
    titulo: 'El trabajo queda documentado',
    texto:  'Fotos, diagnóstico, repuestos usados, conformidad del cliente. Todo en el sistema.',
  },
];

function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Cómo funciona SHUURI
          </h2>
          <p className="text-gray-500 text-lg">Tres actores, un sistema. Coordinado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PASOS.map(({ num, icon: Icon, titulo, texto }) => (
            <div key={num} className="flex flex-col">
              <div className="mb-5">
                <span className="inline-flex bg-[#2698D1] text-white font-black rounded-lg px-3 py-1 text-sm mb-4">
                  {num}
                </span>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2698D1]/10">
                    <Icon className="h-5 w-5 text-[#2698D1]" />
                  </div>
                  <h3 className="font-bold text-lg text-[#0D0D0D] leading-snug">{titulo}</h3>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 4: TIERS ─────────────────────────────────────────────────────────

const TIERS = [
  {
    nombre:   'Base',
    precio:   'USD 0',
    periodo:  '/ mes',
    comision: '30%',
    para:     'Restaurantes independientes',
    cta:      'Registrarse gratis',
    ctaHref:  '/registro',
    highlight: false,
  },
  {
    nombre:    'Cadena Chica',
    precio:    'USD 75',
    periodo:   '/ local / mes',
    comision:  '25%',
    para:      'Cadenas de 2 a 10 locales',
    cta:       'Empezar ahora',
    ctaHref:   '/registro',
    highlight: true,
    badge:     'Más popular',
  },
  {
    nombre:   'Cadena Grande',
    precio:   'USD 100',
    periodo:  '/ local / mes',
    comision: '20%',
    para:     'Cadenas de 10+ locales',
    cta:      'Hablar con el equipo',
    ctaHref:  'https://wa.me/5491100000000',
    highlight: false,
  },
];

function Tiers() {
  return (
    <section id="precios-resumen" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Empezá gratis, escalá cuando lo necesités
          </h2>
          <p className="text-gray-500 text-lg">Sin compromisos. Sin tarjeta de crédito para empezar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {TIERS.map(tier => (
            <div
              key={tier.nombre}
              className={`relative bg-white rounded-2xl p-8 transition-all ${
                tier.highlight
                  ? 'border-2 border-[#2698D1] shadow-lg scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex bg-[#2698D1] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {tier.badge}
                </span>
              )}

              <h3 className="font-black text-lg text-[#0D0D0D] mb-2">{tier.nombre}</h3>
              <p className="text-sm text-gray-500 mb-5">{tier.para}</p>

              <div className="mb-5">
                <span className="text-3xl font-black text-[#0D0D0D]">{tier.precio}</span>
                <span className="text-sm text-gray-400 ml-1">{tier.periodo}</span>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Comisión por servicio</p>
                <p className="text-xl font-black text-[#0D0D0D]">{tier.comision}</p>
              </div>

              <Link
                href={tier.ctaHref}
                className={`block w-full text-center rounded-xl py-3 text-sm font-bold transition-colors ${
                  tier.highlight
                    ? 'bg-[#2698D1] hover:bg-[#2698D1]/90 text-white'
                    : 'border border-gray-300 text-[#0D0D0D] hover:bg-gray-50'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/precios"
            className="text-sm font-semibold text-[#2698D1] hover:underline"
          >
            Ver comparativa completa →
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 5: CTA FINAL ─────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="font-black text-4xl text-white mb-6 leading-tight">
          Empezá hoy. La primera OT es gratis.
        </h2>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Creá tu cuenta en 2 minutos. Registrá tus equipos. Reportá tu primera falla.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            Registrarse gratis
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
          >
            Solicitar demo
          </Link>
        </div>

        <div className="mt-6">
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm underline underline-offset-2 transition-colors"
          >
            Hablar por WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <Dolor />
      <ComoFunciona />
      <Tiers />
      <CtaFinal />
    </>
  );
}
