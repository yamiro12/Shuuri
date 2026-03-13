import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin, Package, CreditCard, CheckCircle2,
  ClipboardList, UserCheck, Wrench, DollarSign,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Para técnicos | SHUURI',
  description: 'Trabajo constante en tu zona, repuesto coordinado antes de cada visita y cobro quincenal del 70% de cada servicio.',
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <span className="inline-flex bg-[#0D0D0D]/5 text-[#0D0D0D] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Para técnicos independientes y empresas técnicas
        </span>

        <h1 className="font-black text-5xl lg:text-6xl text-[#0D0D0D] leading-tight">
          Trabajo constante en tu zona.{' '}
          <span className="text-[#2698D1]">El repuesto llega antes que vos.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
          Sumarte a SHUURI es simple: ponés la capacidad técnica, nosotros ponemos
          los trabajos, los repuestos y la cobranza.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Sumarme como técnico
          </Link>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 rounded-full px-5 py-2.5">
          <DollarSign className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-sm font-semibold">Cobro quincenal garantizado · 70% de cada servicio</span>
        </div>

      </div>
    </section>
  );
}

// ─── PROPUESTAS DE VALOR ──────────────────────────────────────────────────────

const PROPUESTAS = [
  {
    icon:   MapPin,
    color:  'text-[#2698D1]',
    bg:     'bg-blue-50',
    titulo: 'Trabajos en tu zona y tu especialidad',
    texto:  'Sólo te asignamos órdenes en los rubros donde tenés certificación vigente. Nunca más trabajos que no podés hacer.',
  },
  {
    icon:   Package,
    color:  'text-green-600',
    bg:     'bg-green-50',
    titulo: 'El repuesto llega antes que vos',
    texto:  'SHUURI coordina con el proveedor. Cuando llegás al local, el repuesto ya está.',
  },
  {
    icon:   CreditCard,
    color:  'text-purple-600',
    bg:     'bg-purple-50',
    titulo: '70% de cada servicio, quincenal',
    texto:  'Facturás a SHUURI. Cobrás el 15 y el último de cada mes. Sin demoras.',
  },
];

function Propuestas() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Lo que SHUURI te da
          </h2>
          <p className="text-gray-500">Tres pilares que cambian la forma en que trabajás.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPUESTAS.map(({ icon: Icon, color, bg, titulo, texto }) => (
            <div key={titulo} className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${bg} mb-5`}>
                <Icon className={`h-7 w-7 ${color}`} />
              </div>
              <h3 className="font-bold text-xl text-[#0D0D0D] mb-3 leading-snug">{titulo}</h3>
              <p className="text-gray-500 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── CÓMO FUNCIONA PARA EL TÉCNICO ───────────────────────────────────────────

const PASOS = [
  {
    num:    1,
    icon:   UserCheck,
    titulo: 'Te sumás a la plataforma',
    texto:  'Completás el formulario de alta. Verificamos tus certificaciones y zona de cobertura.',
  },
  {
    num:    2,
    icon:   ClipboardList,
    titulo: 'Recibís órdenes de trabajo',
    texto:  'Por WhatsApp o desde la app. Solo en los rubros donde tenés certificación vigente.',
  },
  {
    num:    3,
    icon:   Wrench,
    titulo: 'Ejecutás el servicio',
    texto:  'Con el repuesto ya coordinado en el local. Documentás con fotos y cerrás la OT.',
  },
  {
    num:    4,
    icon:   DollarSign,
    titulo: 'Cobrás el 70% en la próxima liquidación',
    texto:  'Quincenal, el 15 y el último de cada mes. Facturás a SHUURI por el monto neto.',
  },
];

function ComoFunciona() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Cómo funciona para el técnico
          </h2>
          <p className="text-gray-500">Cuatro pasos desde que te sumás hasta que cobrás.</p>
        </div>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2698D1]/20 hidden sm:block" />

          <div className="space-y-8">
            {PASOS.map(({ num, icon: Icon, titulo, texto }) => (
              <div key={num} className="flex items-start gap-5">
                {/* Círculo numerado */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-sm">
                  {num}
                </div>
                {/* Contenido */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-[#2698D1]" />
                    <h3 className="font-bold text-[#0D0D0D]">{titulo}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── RUBROS Y CERTIFICACIONES ─────────────────────────────────────────────────

const RUBROS = [
  'Cocción', 'Refrigeración', 'Lavado', 'Cafetería',
  'Máquinas de hielo', 'Climatización', 'Tecnología',
];

function Rubros() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
          Rubros y certificaciones aceptados
        </h2>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto">
          Si tenés certificación de marca, priorizamos tu perfil para esos equipos.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {RUBROS.map(r => (
            <span
              key={r}
              className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-semibold"
            >
              {r}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── REQUISITOS ───────────────────────────────────────────────────────────────

const REQUISITOS = [
  'CUIT activo (monotributista o responsable inscripto)',
  'Seguro de responsabilidad civil vigente',
  'Experiencia comprobable en gastronomía',
  'Zona de cobertura definida',
];

function Requisitos() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Requisitos para sumarte
          </h2>
          <p className="text-gray-500">Simple y claro. Si cumplís esto, podés trabajar con SHUURI.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 space-y-4">
          {REQUISITOS.map(req => (
            <div key={req} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-[#0D0D0D] font-medium">{req}</p>
            </div>
          ))}
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
          Sumate a la red SHUURI
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Te contactamos en 48 horas para una entrevista técnica.
        </p>
        <Link
          href="/registro"
          className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
        >
          Registrarme como técnico
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TécnicosPage() {
  return (
    <>
      <Hero />
      <Propuestas />
      <ComoFunciona />
      <Rubros />
      <Requisitos />
      <CtaFinal />
    </>
  );
}
