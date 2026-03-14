import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DollarSign, MapPin, Package, CreditCard,
  CheckCircle2, Circle,
  ClipboardList, ShieldCheck, Smartphone, Wrench, Banknote,
  Flame, Thermometer, Droplets, Coffee, Snowflake, Wind, Monitor, Settings2,
  ArrowRight,
} from 'lucide-react';
import FaqTecnicos from './_faq';

export const metadata: Metadata = {
  title: 'SHUURI para Técnicos | Trabajo constante, cobro garantizado',
  description: 'Trabajo en tu zona, el repuesto llega antes que vos, cobrás el 70% quincenal. Sin cobrarle al cliente. Sin buscar repuestos.',
};

// ─── SECCIÓN 1: HERO ─────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-[#0D0D0D] text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h1 className="font-black text-5xl lg:text-6xl leading-tight">
          Trabajo constante en tu zona.
          <br />
          <span className="text-[#2698D1]">El repuesto llega antes que vos.</span>
        </h1>

        <p className="text-gray-300 text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          Sumarte a SHUURI es simple: ponés la capacidad técnica,
          nosotros ponemos los trabajos, los repuestos y la cobranza.
          Sin cobrarle al cliente. Sin buscar piezas. Sin papeleo.
        </p>

        {/* Badge económico */}
        <div className="flex justify-center mt-8">
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-full font-semibold text-sm">
            <DollarSign className="h-4 w-4" />
            Cobrás el 70% de cada servicio · Liquidación quincenal garantizada
          </span>
        </div>

        <div className="mt-10">
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Sumarme a la red SHUURI
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── SECCIÓN 2: PROPUESTA DE VALOR ───────────────────────────────────────────

function Propuesta() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="font-black text-4xl text-[#0D0D0D]">Lo que SHUURI hace por vos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Trabajo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 mb-5">
              <MapPin className="h-7 w-7 text-[#2698D1]" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-3">Trabajo en tu zona y especialidad</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Solo te asignamos OTs donde tenés certificación vigente para ese equipo.
              Trabajás en tu zona de cobertura sin desplazamientos innecesarios.
            </p>
            <span className="inline-block bg-[#2698D1]/10 text-[#2698D1] text-xs font-semibold px-3 py-1 rounded-full">
              Prioridad si tenés certificación oficial de marca
            </span>
          </div>

          {/* Card 2: Repuesto */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 mb-5">
              <Package className="h-7 w-7 text-[#2698D1]" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-3">El repuesto llega antes que vos</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              SHUURI coordina el pedido al proveedor cuando se genera la OT.
              Cuando llegás al local, el repuesto ya está esperándote.
              Sin más viajes perdidos.
            </p>
            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Sin más viajes perdidos
            </span>
          </div>

          {/* Card 3: Cobro */}
          <div className="bg-[#2698D1]/5 border border-[#2698D1]/20 rounded-2xl p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2698D1]/10 mb-5">
              <CreditCard className="h-7 w-7 text-[#2698D1]" />
            </div>
            <h3 className="font-black text-xl text-[#0D0D0D] mb-3">70% quincenal, garantizado</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Facturás a SHUURI. Cobrás el 15 y el último de cada mes.
            </p>

            {/* Tabla de cobro */}
            <div className="bg-white rounded-xl border border-[#2698D1]/20 overflow-hidden">
              <div className="grid grid-cols-3 bg-[#2698D1]/10 px-4 py-2">
                <span className="text-xs font-bold text-gray-500">Modalidad</span>
                <span className="text-xs font-bold text-gray-500 text-center">% neto</span>
                <span className="text-xs font-bold text-gray-500 text-right">Plazo</span>
              </div>
              {[
                { mod: 'Quincenal',          pct: '70%', dias: '≤ 5 días', highlight: true  },
                { mod: 'Mensual (+2% bonus)', pct: '72%', dias: '≤ 3 días', highlight: false },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 px-4 py-2.5 ${row.highlight ? 'bg-white' : 'bg-gray-50'}`}>
                  <span className="text-xs text-gray-600 font-medium">{row.mod}</span>
                  <span className="text-xs font-black text-[#2698D1] text-center">{row.pct}</span>
                  <span className="text-xs text-gray-500 text-right">{row.dias}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 3: CÓMO FUNCIONA ─────────────────────────────────────────────────

const PASOS = [
  { num: 1, icon: ClipboardList, titulo: 'Te das de alta',                   desc: 'Formulario online, 15 minutos.' },
  { num: 2, icon: ShieldCheck,   titulo: 'Verificamos tus certificaciones',  desc: 'Proceso en 48hs hábiles.' },
  { num: 3, icon: Smartphone,    titulo: 'Recibís OTs en tu zona',           desc: 'Por WhatsApp o desde la app.' },
  { num: 4, icon: Wrench,        titulo: 'Ejecutás el servicio',             desc: 'Con el repuesto ya coordinado.' },
  { num: 5, icon: Banknote,      titulo: 'Cobrás quincenal',                 desc: '70% acreditado sin demoras.' },
];

function ComoFunciona() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-16">Cómo funciona</h2>

        {/* Desktop: alternado */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2698D1]/20 -translate-x-0.5" />
          <div className="space-y-10">
            {PASOS.map(({ num, icon: Icon, titulo, desc }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={num} className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
                  {isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-right">
                      <div className="flex items-center justify-end gap-3 mb-1">
                        <h3 className="font-bold text-[#0D0D0D]">{titulo}</h3>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  ) : <div />}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                    {num}
                  </div>
                  {!isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                        <h3 className="font-bold text-[#0D0D0D]">{titulo}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{desc}</p>
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
            {PASOS.map(({ num, icon: Icon, titulo, desc }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                  {num}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-[#2698D1]" />
                    <h3 className="font-bold text-sm text-[#0D0D0D]">{titulo}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
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
  { icon: Flame,       label: 'Cocción'            },
  { icon: Thermometer, label: 'Refrigeración'       },
  { icon: Droplets,    label: 'Lavado'              },
  { icon: Coffee,      label: 'Cafetería'           },
  { icon: Snowflake,   label: 'Máq. de hielo'       },
  { icon: Wind,        label: 'Climatización'       },
  { icon: Monitor,     label: 'Tecnología'          },
  { icon: Settings2,   label: 'Especializados'      },
];

function Rubros() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-4">Rubros que cubrimos</h2>
        <p className="text-gray-500 text-center text-base mb-10 max-w-2xl mx-auto">
          Si tenés certificación oficial de marca, priorizamos tu perfil.
          Marcas como <strong className="text-[#0D0D0D]">Rational, Winterhalter, Fagor, La Marzocco</strong> tienen alta demanda.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RUBROS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-md hover:border-[#2698D1]/30 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2698D1]/10">
                <Icon className="h-6 w-6 text-[#2698D1]" />
              </div>
              <span className="text-sm font-semibold text-[#0D0D0D]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 5: REQUISITOS ────────────────────────────────────────────────────

const REQUISITOS_BASICOS = [
  'CUIT activo (monotributista mínimo)',
  'Seguro de responsabilidad civil vigente',
  'Experiencia comprobable en gastronomía',
  'Zona de cobertura definida',
  'Herramientas propias básicas del rubro',
];

const REQUISITOS_VALORADOS = [
  'Certificaciones de marca',
  'Vehículo propio',
  'Disponibilidad 24/7 para urgencias',
  'Equipo a cargo',
];

function Requisitos() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-12">
          ¿Qué necesitás para sumarte?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Requisitos básicos */}
          <div className="bg-gray-50 rounded-2xl p-7">
            <p className="font-bold text-[#0D0D0D] mb-5 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Requisitos básicos
            </p>
            <ul className="space-y-3">
              {REQUISITOS_BASICOS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Valorado */}
          <div className="bg-[#2698D1]/5 border border-[#2698D1]/20 rounded-2xl p-7">
            <p className="font-bold text-[#0D0D0D] mb-5 flex items-center gap-2">
              <Circle className="h-5 w-5 text-[#2698D1]" />
              Valorado (no excluyente)
            </p>
            <ul className="space-y-3">
              {REQUISITOS_VALORADOS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Circle className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-5 leading-relaxed">
              Cumplir con estos puntos eleva tu score en la plataforma y te da prioridad en la asignación de OTs.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── SECCIÓN 7: CTA FINAL ─────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section className="bg-[#2698D1] py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-black text-4xl text-white mb-4">Sumate a la red SHUURI</h2>
        <p className="text-blue-100 text-lg mb-10">
          Completá el formulario de alta. Te contactamos en 48hs para la entrevista técnica.
        </p>
        <Link
          href="/registro"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#2698D1] px-10 py-5 rounded-xl font-bold text-lg transition-colors"
        >
          Registrarme como técnico
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TecnicosPage() {
  return (
    <>
      <Hero />
      <Propuesta />
      <ComoFunciona />
      <Rubros />
      <Requisitos />
      <FaqTecnicos />
      <CtaFinal />
    </>
  );
}
