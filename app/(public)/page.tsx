import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Zap, ArrowRight,
  UtensilsCrossed, Wrench, Package,
  X, CheckCircle2,
  PlusCircle, UserCheck, FileText, CheckSquare,
  Truck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'SHUURI | Servicios técnicos para gastronomía',
  description: 'Conectamos restaurantes con técnicos certificados y repuestos coordinados. Un solo sistema para coordinar, documentar y controlar todo el mantenimiento de tu equipamiento.',
};

// ─── SECCIÓN 1: HERO ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#2698D1]/10 text-[#2698D1] text-sm font-semibold px-4 py-1.5 rounded-full">
            <Zap className="h-3.5 w-3.5" />
            Piloto activo en Buenos Aires
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-black text-5xl lg:text-7xl text-[#0D0D0D] leading-[1.05] text-center">
          Cuando algo falla en tu cocina,<br />
          <span className="text-[#2698D1]">SHUURI</span> lo resuelve.
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed text-center">
          Conectamos restaurantes con técnicos certificados y repuestos coordinados.
          Un solo sistema para coordinar, documentar y controlar todo el mantenimiento.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href="/solicitar-tecnico"
            className="inline-flex items-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
          >
            Solicitar técnico ahora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-[#2698D1] hover:text-[#2698D1] text-[#0D0D0D] px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            Ver marketplace
          </Link>
          <a
            href="#como-funciona"
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
          >
            Ver cómo funciona ↓
          </a>
        </div>

        {/* Proof strip */}
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-wrap justify-center gap-8 lg:gap-0">
          {[
            { num: '110.000+', desc: 'establecimientos gastronómicos en Argentina' },
            { num: '475+',     desc: 'proveedores de equipamiento identificados'   },
            { num: '8',        desc: 'rubros de equipamiento cubiertos'             },
            { num: '15',       desc: 'estados de tracking por Orden de Trabajo'     },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-8 lg:border-r lg:last:border-r-0 border-gray-200"
            >
              <span className="font-black text-2xl text-[#0D0D0D]">{item.num}</span>
              <span className="text-sm text-gray-500 mt-1 max-w-[140px]">{item.desc}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 2: TRES ACTORES ──────────────────────────────────────────────────

function TresActores() {
  return (
    <section id="actores" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-4xl text-[#0D0D0D]">
            Una plataforma. Tres actores.
          </h2>
          <p className="text-gray-500 text-lg mt-4">
            Cada uno con su panel, sus herramientas y su modelo económico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Gastronómicos */}
          <Link
            href="/gastronomicos"
            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all"
          >
            <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Restaurantes · Bares · Hoteles · Cafeterías
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 mb-5">
              <UtensilsCrossed className="h-7 w-7 text-amber-500" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-2">Para gastronómicos</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Reportá fallas, aprobá cotizaciones, controlá equipos.
              Sin llamadas perdidas. Sin técnicos que no llegan.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Gratis para empezar · Comisión 30% por servicio</p>
              <p className="text-xs text-[#2698D1] mt-1">Desde USD 75/mes bajás al 25%</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[#2698D1] font-semibold text-sm mt-5 group-hover:gap-2 transition-all">
              Soy gastronómico <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          {/* Técnicos */}
          <Link
            href="/tecnicos"
            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all"
          >
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Independientes · Empresas técnicas
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 mb-5">
              <Wrench className="h-7 w-7 text-[#2698D1]" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-2">Para técnicos</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Trabajo constante en tu zona. El repuesto llega antes que vos.
              Cobrás el 70% quincenal sin cobrarle al cliente.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">70% de cada servicio · Liquidación quincenal · Sin costo de suscripción</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[#2698D1] font-semibold text-sm mt-5 group-hover:gap-2 transition-all">
              Soy técnico <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          {/* Proveedores */}
          <Link
            href="/proveedores"
            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all"
          >
            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Fabricantes · Distribuidores · Importadores
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 mb-5">
              <Package className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-2">Para proveedores</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tu catálogo conectado a los técnicos que ya están en el campo.
              Cada OT es una oportunidad de venta de repuestos.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">15% comisión sobre repuestos · 10% sobre insumos · Modelo mandato</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[#2698D1] font-semibold text-sm mt-5 group-hover:gap-2 transition-all">
              Soy proveedor <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 3: PROBLEMA/SOLUCIÓN ─────────────────────────────────────────────

const DOLORES = [
  'Llamás al técnico y no atiende o no puede ir',
  'El técnico llega y el repuesto no está. Perdés el día',
  'No sabés cuánto gastaste en mantenimiento este mes',
  'No queda registro de qué se hizo en cada equipo',
  'El técnico te habla "técnico" y no entendés si es caro o barato',
  'La cocina parada mientras esperás al técnico',
];

const SOLUCIONES = [
  'Técnico certificado asignado en minutos, con disponibilidad verificada',
  'El repuesto está en el local antes que el técnico',
  'Dashboard de gastos en tiempo real, por equipo y por local',
  'Historial completo documentado con fotos y firma de conformidad',
  'Cotización transparente antes de que se ejecute cualquier trabajo',
  'Tiempo de respuesta garantizado por urgencia',
];

function ProblemaSolucion() {
  return (
    <section id="problema" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-16">
          ¿Te suena familiar?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Dolores */}
          <div className="bg-red-50 rounded-2xl p-8">
            <p className="text-red-600 font-bold text-base mb-6">Antes de SHUURI</p>
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

          {/* Soluciones */}
          <div className="bg-green-50 rounded-2xl p-8">
            <p className="text-green-600 font-bold text-base mb-6">Con SHUURI</p>
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

// ─── SECCIÓN 4: CÓMO FUNCIONA (simplificada) ─────────────────────────────────

const PASOS = [
  { num: '01', icon: PlusCircle,  titulo: 'Reportar',  desc: 'Desde la app en 2 minutos'                        },
  { num: '02', icon: UserCheck,   titulo: 'Asignar',   desc: 'Técnico certificado para ese equipo'              },
  { num: '03', icon: FileText,    titulo: 'Cotizar',   desc: 'Aprobás antes de que ejecuten'                    },
  { num: '04', icon: Wrench,      titulo: 'Ejecutar',  desc: 'Con el repuesto ya en el local'                   },
  { num: '05', icon: CheckSquare, titulo: 'Cerrar',    desc: 'Conformidad firmada. Todo documentado.'           },
];

function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-4xl text-[#0D0D0D] mb-4">Cómo funciona</h2>
          <p className="text-gray-500 text-lg">De la falla a la conformidad. Coordinado.</p>
        </div>

        {/* Desktop stepper */}
        <div className="hidden md:flex items-start gap-0">
          {PASOS.map(({ num, icon: Icon, titulo, desc }, i) => (
            <div key={num} className="flex-1 flex flex-col items-center text-center relative">
              {/* Conector */}
              {i < PASOS.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-[#2698D1]/20" />
              )}
              {/* Círculo */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md mb-4">
                {num}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2698D1]/10 mb-3">
                <Icon className="h-4 w-4 text-[#2698D1]" />
              </div>
              <h3 className="font-bold text-[#0D0D0D] text-sm">{titulo}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[110px]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile stepper */}
        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2698D1]/20" />
          <div className="space-y-6">
            {PASOS.map(({ num, icon: Icon, titulo, desc }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                  {num}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-sm text-[#0D0D0D]">{titulo}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/como-funciona"
            className="text-sm font-semibold text-[#2698D1] hover:underline"
          >
            Ver el flujo completo →
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 5: PRECIOS RESUMEN ───────────────────────────────────────────────

const TIERS = [
  {
    nombre:    'Gratis',
    badge:     'Para empezar',
    badgeCls:  'bg-gray-100 text-gray-600',
    precio:    'Gratis',
    periodo:   'para siempre',
    comision:  '30%',
    comCls:    'bg-orange-50 text-orange-700',
    highlight: false,
    dark:      false,
    features: [
      { label: 'Reportar fallas desde la app',     ok: true  },
      { label: 'Técnico certificado asignado',      ok: true  },
      { label: 'Coordinación de repuesto',          ok: true  },
      { label: 'Historial por equipo',              ok: true  },
      { label: 'Múltiples sucursales',              ok: false },
      { label: 'Dashboard de estadísticas',         ok: false },
      { label: 'Técnicos fijos asignados',          ok: false },
    ],
    cta:     'Empezar gratis',
    ctaHref: '/registro',
    ctaCls:  'bg-gray-900 hover:bg-gray-800 text-white',
  },
  {
    nombre:    'Cadena Chica',
    badge:     'Más popular',
    badgeCls:  'absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2698D1] text-white',
    precio:    'USD 75',
    periodo:   '/ local / mes',
    comision:  '25%',
    comCls:    'bg-blue-50 text-blue-700',
    highlight: true,
    dark:      false,
    features: [
      { label: 'Reportar fallas desde la app',     ok: true },
      { label: 'Técnico certificado asignado',      ok: true },
      { label: 'Coordinación de repuesto',          ok: true },
      { label: 'Historial por equipo',              ok: true },
      { label: 'Múltiples sucursales (hasta 10)',   ok: true },
      { label: 'Dashboard de estadísticas',         ok: true },
      { label: 'Técnicos fijos asignados',          ok: true },
    ],
    cta:     'Empezar ahora',
    ctaHref: '/registro',
    ctaCls:  'bg-[#2698D1] hover:bg-[#2698D1]/90 text-white',
  },
  {
    nombre:    'Cadena Grande',
    badge:     'Grandes operaciones',
    badgeCls:  'bg-gray-800 text-gray-300',
    precio:    'USD 100',
    periodo:   '/ local / mes',
    comision:  '20%',
    comCls:    'bg-green-900/50 text-green-400',
    highlight: false,
    dark:      true,
    features: [
      { label: 'Todo lo anterior',                  ok: true },
      { label: 'Locales ilimitados',                ok: true },
      { label: 'Técnicos fijos + API abierta',      ok: true },
      { label: 'Account manager dedicado',          ok: true },
      { label: 'SLA de respuesta prioritario',      ok: true },
      { label: 'Preventivo programado',             ok: true },
      { label: 'Usuarios ilimitados',               ok: true },
    ],
    cta:     'Hablar con el equipo',
    ctaHref: 'https://wa.me/5491100000000',
    ctaCls:  'border border-gray-700 hover:border-gray-500 text-white',
  },
] as const;

function PreciosResumen() {
  return (
    <section id="precios" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-4xl text-[#0D0D0D] mb-4">
            Empezá gratis. Pagás cuando hay servicio.
          </h2>
          <p className="text-gray-500 text-lg">
            Sin suscripción obligatoria para empezar. Sin tarjeta de crédito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
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
              {/* Badge */}
              {tier.highlight ? (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${tier.badgeCls}`}>
                  {tier.badge}
                </span>
              ) : (
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${tier.badgeCls}`}>
                  {tier.badge}
                </span>
              )}

              <h3 className={`font-black text-lg mb-2 ${tier.dark ? 'text-white' : 'text-[#0D0D0D]'}`}>
                {tier.nombre}
              </h3>

              <div className="mb-5 mt-1">
                <span className={`font-black text-4xl ${tier.dark ? 'text-white' : 'text-[#0D0D0D]'}`}>
                  {tier.precio}
                </span>
                <span className={`text-sm ml-1 ${tier.dark ? 'text-gray-400' : 'text-gray-400'}`}>
                  {tier.periodo}
                </span>
              </div>

              {/* Comisión badge */}
              <div className={`rounded-lg px-4 py-2.5 mb-5 ${tier.comCls}`}>
                <p className={`text-xs mb-0.5 ${tier.dark ? 'text-green-500/70' : 'text-gray-500'}`}>
                  Comisión por servicio
                </p>
                <p className="font-black text-xl">{tier.comision}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    {f.ok
                      ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      : <X className={`h-4 w-4 shrink-0 ${tier.dark ? 'text-gray-600' : 'text-gray-300'}`} />
                    }
                    <span className={`text-sm ${f.ok ? (tier.dark ? 'text-gray-200' : 'text-[#0D0D0D]') : (tier.dark ? 'text-gray-600' : 'text-gray-400')}`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`block w-full text-center rounded-xl py-3 text-sm font-bold transition-colors ${tier.ctaCls}`}
              >
                {tier.cta}
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

// ─── SECCIÓN 6: MARKETPLACE PREVIEW ──────────────────────────────────────────

const PRODUCTOS_PREVIEW = [
  {
    nombre:        'Resistencia para lavavajillas Winterhalter',
    marca:         'Winterhalter',
    categoria:     'Repuestos',
    rubro:         'Lavado',
    precio:        38500,
    disponibilidad: 'En stock',
    entrega:       '48hs',
    proveedor:     'RepuestosPro S.A.',
  },
  {
    nombre:        'Compresor para cámara frigorífica Tecumseh 1.5HP',
    marca:         'Tecumseh',
    categoria:     'Repuestos',
    rubro:         'Refrigeración',
    precio:        124900,
    disponibilidad: 'En stock',
    entrega:       '24hs',
    proveedor:     'FrigoTécnica',
  },
  {
    nombre:        'Quemador para cocina industrial Fagor 6 kW',
    marca:         'Fagor',
    categoria:     'Repuestos',
    rubro:         'Cocción',
    precio:        21300,
    disponibilidad: 'Bajo pedido',
    entrega:       '72hs',
    proveedor:     'Gastro Insumos',
  },
];

function MarketplacePreview() {
  return (
    <section id="marketplace" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-4xl text-[#0D0D0D] mb-4">
            Marketplace de repuestos y equipamiento
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Más de 10.000 SKUs de repuestos gastronómicos. Con precio y disponibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRODUCTOS_PREVIEW.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#2698D1]/30 transition-all"
            >
              {/* Placeholder imagen */}
              <div className="relative bg-gray-100 h-36 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-300" />
                <span className={`absolute top-3 right-3 text-xs font-bold text-white px-2 py-0.5 rounded-full ${
                  p.disponibilidad === 'En stock' ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  {p.disponibilidad}
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded mb-2">
                  {p.categoria} · {p.rubro}
                </span>
                <h3 className="font-semibold text-sm text-[#0D0D0D] leading-tight line-clamp-2 mb-1">
                  {p.nombre}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{p.marca}</p>
                <p className="font-black text-lg text-[#0D0D0D]">
                  $ {p.precio.toLocaleString('es-AR')}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Truck className="h-3 w-3" />
                  {p.entrega} · {p.proveedor}
                </p>
                <Link
                  href="/marketplace"
                  className="block w-full text-center bg-[#2698D1]/10 hover:bg-[#2698D1] text-[#2698D1] hover:text-white font-semibold text-sm px-4 py-2 rounded-lg mt-3 transition-all"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2698D1] hover:underline"
          >
            Explorar marketplace →
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            Para comprar necesitás cuenta SHUURI. Navegar es gratis.
          </p>
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 7: NÚMEROS ───────────────────────────────────────────────────────

function Numeros() {
  return (
    <section className="bg-[#2698D1] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '110.000+', desc: 'Establecimientos gastronómicos en Argentina' },
            { num: '475+',     desc: 'Proveedores de equipamiento identificados'   },
            { num: '8',        desc: 'Rubros técnicos cubiertos'                   },
            { num: '0',        desc: 'Costo fijo para empezar'                     },
          ].map((item, i) => (
            <div key={i}>
              <p className="font-black text-5xl text-white">{item.num}</p>
              <p className="text-blue-100 text-sm mt-2 leading-snug max-w-[140px] mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 8: CTA FINAL ─────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="font-black text-5xl text-white leading-tight mb-6">
          Empezá hoy. Gratis.
        </h2>
        <p className="text-gray-400 text-lg mt-4 leading-relaxed">
          La primera OT no tiene costo de coordinación.
          Registrate, cargá tus equipos, reportá tu primera falla.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/solicitar-tecnico"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-10 py-5 rounded-xl font-bold text-lg transition-colors"
          >
            Solicitar técnico ahora
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center border border-gray-700 hover:border-gray-500 text-white px-10 py-5 rounded-xl font-semibold transition-colors"
          >
            Registrarme gratis
          </Link>
        </div>

        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-gray-500 hover:text-gray-300 text-sm mt-6 transition-colors"
        >
          Hablar por WhatsApp →
        </a>

      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <TresActores />
      <ProblemaSolucion />
      <ComoFunciona />
      <PreciosResumen />
      <MarketplacePreview />
      <Numeros />
      <CtaFinal />
    </>
  );
}
