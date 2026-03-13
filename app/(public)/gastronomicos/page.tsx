import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ClipboardList, Search, UserCheck, FileText,
  Package, Wrench, CheckCircle2, ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Para restaurantes | SHUURI',
  description: 'SHUURI coordina todo el servicio técnico de tu equipamiento gastronómico. Desde que reportás la falla hasta que firmás la conformidad.',
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <span className="inline-flex bg-[#2698D1]/10 text-[#2698D1] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Para dueños y operadores de restaurantes
        </span>

        <h1 className="font-black text-5xl lg:text-6xl text-[#0D0D0D] leading-tight">
          Tu cocina no puede parar.{' '}
          <span className="text-[#2698D1]">Nosotros nos encargamos</span>{' '}
          de que no pase.
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
          SHUURI coordina todo el servicio técnico de tu equipamiento.
          Desde que reportás la falla hasta que firmás la conformidad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Registrá tu restaurante gratis
          </Link>
          <a
            href="#beneficios"
            className="inline-flex items-center justify-center border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg text-[#0D0D0D] hover:bg-gray-50 transition-colors"
          >
            Ver cómo funciona
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Gratis para empezar · Sin tarjeta de crédito
        </p>

      </div>
    </section>
  );
}

// ─── LO QUE RESUELVE ──────────────────────────────────────────────────────────

const RESOLUCIONES = [
  {
    dolor:    'Llamás a alguien de confianza que a veces aparece y a veces no',
    solucion: 'Técnico asignado en minutos, con certificación vigente para ese equipo',
  },
  {
    dolor:    'El técnico llega y el repuesto no está. Perdés otro día',
    solucion: 'El repuesto se coordina con el proveedor antes de la visita',
  },
  {
    dolor:    'No sabés cuánto gastaste ni en qué. Nadie tiene registro',
    solucion: 'Historial completo por equipo, por local, por periodo. En tiempo real',
  },
];

function LoQueResuelve() {
  return (
    <section id="beneficios" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Del problema a la solución
          </h2>
          <p className="text-gray-500">Cada dolor que conocés, tiene una respuesta concreta en SHUURI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESOLUCIONES.map(({ dolor, solucion }, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="bg-red-50 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">El problema</p>
                <p className="text-sm font-semibold text-red-800 leading-relaxed">{dolor}</p>
              </div>
              <div className="bg-green-50 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">La solución</p>
                <p className="text-sm font-semibold text-green-800 leading-relaxed">{solucion}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── FLUJO DEL RESTAURANTE ────────────────────────────────────────────────────

const PASOS_FLUJO = [
  { num: 1, icon: ClipboardList, label: 'Reportar falla' },
  { num: 2, icon: Search,        label: 'Diagnóstico' },
  { num: 3, icon: FileText,      label: 'Cotización' },
  { num: 4, icon: Wrench,        label: 'Técnico en local' },
  { num: 5, icon: CheckCircle2,  label: 'Conformidad' },
];

function FlujoRestaurante() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Tu flujo de principio a fin
          </h2>
          <p className="text-gray-500">Cinco pasos. Todo dentro de la plataforma.</p>
        </div>

        {/* Desktop stepper */}
        <div className="hidden md:flex items-center justify-between">
          {PASOS_FLUJO.map(({ num, icon: Icon, label }, i) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2698D1]/10 mb-3">
                  <Icon className="h-6 w-6 text-[#2698D1]" />
                </div>
                <span className="text-xs font-bold text-[#2698D1] mb-1">{String(num).padStart(2, '0')}</span>
                <span className="text-sm font-semibold text-[#0D0D0D] text-center leading-tight">{label}</span>
              </div>
              {i < PASOS_FLUJO.length - 1 && (
                <ArrowRight className="h-5 w-5 text-gray-300 shrink-0 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-4">
          {PASOS_FLUJO.map(({ num, icon: Icon, label }) => (
            <div key={num} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2698D1]/10">
                <Icon className="h-5 w-5 text-[#2698D1]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2698D1]">Paso {num}</span>
                <p className="text-sm font-semibold text-[#0D0D0D]">{label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── EQUIPOS QUE CUBRIMOS ─────────────────────────────────────────────────────

const EQUIPOS = [
  'Cocción', 'Refrigeración', 'Lavado', 'Cafetería',
  'Máquinas de hielo', 'Climatización', 'Tecnología',
];

function EquiposCubrimos() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
          Equipos que cubrimos
        </h2>
        <p className="text-gray-500 mb-10">
          Técnicos certificados en todos los rubros de tu cocina.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {EQUIPOS.map(eq => (
            <span
              key={eq}
              className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-semibold"
            >
              {eq}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── PLANES ───────────────────────────────────────────────────────────────────

const PLANES = [
  {
    nombre:    'Base',
    precio:    'USD 0',
    periodo:   '/ mes',
    comision:  '30%',
    para:      'Restaurantes independientes',
    cta:       'Registrarse gratis',
    ctaHref:   '/registro',
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
    nombre:    'Cadena Grande',
    precio:    'USD 100',
    periodo:   '/ local / mes',
    comision:  '20%',
    para:      'Cadenas de 10+ locales',
    cta:       'Hablar con el equipo',
    ctaHref:   'https://wa.me/5491100000000',
    highlight: false,
  },
];

function Planes() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Planes para gastronómicos
          </h2>
          <p className="text-gray-500">Empezá gratis. Escalá cuando lo necesites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {PLANES.map(plan => (
            <div
              key={plan.nombre}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlight
                  ? 'border-2 border-[#2698D1] shadow-lg scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex bg-[#2698D1] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-black text-lg text-[#0D0D0D] mb-1">{plan.nombre}</h3>
              <p className="text-sm text-gray-500 mb-5">{plan.para}</p>
              <div className="mb-5">
                <span className="text-3xl font-black text-[#0D0D0D]">{plan.precio}</span>
                <span className="text-sm text-gray-400 ml-1">{plan.periodo}</span>
              </div>
              <div className="mb-6 rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Comisión por servicio</p>
                <p className="text-xl font-black text-[#0D0D0D]">{plan.comision}</p>
              </div>
              <Link
                href={plan.ctaHref}
                className={`block w-full text-center rounded-xl py-3 text-sm font-bold transition-colors ${
                  plan.highlight
                    ? 'bg-[#2698D1] hover:bg-[#2698D1]/90 text-white'
                    : 'border border-gray-300 text-[#0D0D0D] hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/precios" className="text-sm font-semibold text-[#2698D1] hover:underline">
            Ver comparativa completa →
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-black text-4xl text-white mb-6 leading-tight">
          Empezá gratis. Sin compromiso.
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Registrá tu restaurante, cargá tus equipos y reportá tu primera falla en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            Crear cuenta
          </Link>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function GastronómicosPage() {
  return (
    <>
      <Hero />
      <LoQueResuelve />
      <FlujoRestaurante />
      <EquiposCubrimos />
      <Planes />
      <CtaFinal />
    </>
  );
}
