import { Utensils, Wrench, Package } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Modelo de Negocio | SHUURI',
  description: 'Marketplace B2B2B de servicios técnicos para gastronomía. 6 streams de ingreso. Modelo transaccional + SaaS recurrente.',
};

const ACTORES = [
  {
    Icon: Utensils,
    nombre: 'Gastronómicos',
    desc: 'Restaurantes, bares, hoteles, cafeterías. El que paga por el servicio y necesita que su cocina no pare.',
    numero: '110.000+',
    label: 'establecimientos en Argentina',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    Icon: Wrench,
    nombre: 'Técnicos',
    desc: 'Independientes y empresas técnicas con certificación. Cobran el 70% del servicio, liquidación quincenal.',
    numero: '~20.000',
    label: 'técnicos potenciales en AMBA',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    Icon: Package,
    nombre: 'Proveedores',
    desc: 'Fabricantes, distribuidores e importadores. Canal de venta de repuestos coordinado con entrega confirmada.',
    numero: '475',
    label: 'proveedores identificados en Argentina',
    color: 'bg-amber-50 text-amber-600',
  },
];

const STREAMS = [
  {
    n: '1',
    nombre: 'Comisión por OT coordinada',
    desc: '30% freemium · 25% cadena chica · 20% cadena grande. Escala con el volumen de tickets.',
    badge: 'Stream principal',
    badgeCls: 'bg-blue-100 text-blue-700',
  },
  {
    n: '2',
    nombre: 'Suscripción mensual por local',
    desc: 'USD 75/local/mes cadena chica · USD 100/local/mes cadena grande. Recurrente predecible.',
    badge: 'Recurrente SaaS',
    badgeCls: 'bg-green-100 text-green-700',
  },
  {
    n: '3',
    nombre: 'Comisión marketplace repuestos',
    desc: '15% sobre el valor de cada orden de compra. Escala automáticamente con el volumen de OTs.',
    badge: 'Multiplicador',
    badgeCls: 'bg-teal-100 text-teal-700',
  },
  {
    n: '4',
    nombre: 'Comisión marketplace insumos',
    desc: '10% sobre venta de productos e insumos. Sin OT requerida, canal de venta adicional.',
    badge: 'Canal adicional',
    badgeCls: 'bg-amber-100 text-amber-700',
  },
  {
    n: '5',
    nombre: 'ShuuriPro — proveedores premium',
    desc: 'USD 1.600/mes. Comisión 0%, API abierta, visibilidad prioritaria. Para distribuidores y fabricantes grandes.',
    badge: 'B2B SaaS',
    badgeCls: 'bg-purple-100 text-purple-700',
  },
  {
    n: '6',
    nombre: 'SaaS grandes cadenas',
    desc: 'Suscripción fija por activo gestionado. Para cadenas de 10+ locales con flota de equipos.',
    badge: 'Enterprise',
    badgeCls: 'bg-gray-200 text-gray-700',
  },
];

const MOAT = [
  {
    titulo: 'Compliance regulatorio como barrera de entrada',
    desc: 'Bloqueo absoluto si el técnico no tiene certificación vigente. No puede replicarse sin el sistema de validación.',
  },
  {
    titulo: 'Historial de activos genera lock-in',
    desc: 'Cada OT suma datos al historial del equipo. El cliente no quiere perder ese registro al cambiar de plataforma.',
  },
  {
    titulo: 'Modelo mandato resuelve la fiscalidad argentina',
    desc: 'SHUURI actúa como agente comercial autorizado. Resuelve la complejidad fiscal que hace inviable el modelo reseller.',
  },
  {
    titulo: 'Red de técnicos certificados verificados',
    desc: 'Construir y verificar la red técnica lleva tiempo. Es una barrera operacional real para nuevos entrantes.',
  },
];

const FLYWHEEL = [
  'Más restaurantes',
  'Más OTs',
  'Mejor score técnicos',
  'Más catálogo proveedores',
  'Mejor marketplace',
];

export default function ModeloNegocioPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-black text-[#0D0D0D] mb-4">
            Un mercado de USD 500M. Un sistema que nadie armó todavía.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Marketplace B2B2B que coordina servicios técnicos entre restaurantes, técnicos certificados y proveedores de repuestos.
            Tres actores. Un sistema. Modelo transaccional con capa SaaS.
          </p>
        </div>
      </section>

      {/* LOS TRES ACTORES */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Los tres actores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACTORES.map(a => (
              <div key={a.nombre} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${a.color}`}>
                  <a.Icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-[#0D0D0D] mb-2">{a.nombre}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{a.desc}</p>
                <p className="font-black text-3xl text-[#2698D1]">{a.numero}</p>
                <p className="text-xs text-gray-400 mt-1">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 STREAMS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">6 streams de ingreso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STREAMS.map(s => (
              <div key={s.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-black text-gray-100">{s.n}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badgeCls}`}>{s.badge}</span>
                </div>
                <p className="font-bold text-[#0D0D0D] text-sm mb-2">{s.nombre}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-2">Tiers para gastronómicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { tier: 'Freemium',     precio: 'USD 0 / mes',         comision: '30%', desc: 'Para probar la plataforma.',          cls: 'border-gray-200' },
              { tier: 'Cadena Chica', precio: 'USD 75 / local / mes', comision: '25%', desc: 'Para cadenas de 2–9 locales.',        cls: 'border-[#2698D1]' },
              { tier: 'Cadena Grande',precio: 'USD 100 / local / mes',comision: '20%', desc: 'Para cadenas de 10+ locales.',        cls: 'border-gray-200' },
            ].map(t => (
              <div key={t.tier} className={`rounded-2xl border-2 ${t.cls} bg-white shadow-sm p-6`}>
                <p className="font-black text-[#0D0D0D] text-lg mb-1">{t.tier}</p>
                <p className="text-[#2698D1] font-bold text-xl mb-1">{t.precio}</p>
                <p className="text-gray-500 text-sm mb-3">{t.desc}</p>
                <p className="text-xs text-gray-400">Comisión por OT: <span className="font-bold text-gray-700">{t.comision}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/precios" className="text-sm text-[#2698D1] hover:underline font-medium">
              Ver comparativa completa →
            </Link>
          </div>
        </div>
      </section>

      {/* FLYWHEEL */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">El flywheel</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FLYWHEEL.map((nodo, i) => (
                <div key={nodo} className="flex items-center gap-2">
                  <span className="bg-[#EBF5FB] text-[#2698D1] font-semibold text-sm px-4 py-2 rounded-full border border-[#2698D1]/20">
                    {nodo}
                  </span>
                  {i < FLYWHEEL.length - 1 && <span className="text-gray-400 font-bold">→</span>}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">→</span>
                <span className="text-xs text-gray-400 border border-dashed border-gray-300 px-3 py-1.5 rounded-full">
                  vuelve al inicio ↩
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOAT */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-8">Por qué es difícil de replicar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOAT.map(m => (
              <div key={m.titulo} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="font-bold text-[#0D0D0D] mb-2">{m.titulo}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-black text-[#0D0D0D] mb-2">Arquitectura tecnológica</h2>
          <p className="text-gray-500 text-sm mb-8">
            SHUURI corre sobre Fracttal como CMMS y Odoo como ERP, integrados por el middleware Crombie y el motor propio de asignación IA.
          </p>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm">
                  Fracttal CMMS
                </div>
                <span className="text-gray-400 font-mono text-lg">←→</span>
                <div className="bg-[#EBF5FB] border border-[#2698D1]/30 rounded-xl px-5 py-3 font-semibold text-sm text-[#2698D1] shadow-sm">
                  Motor SHUURI
                </div>
                <span className="text-gray-400 font-mono text-lg">←→</span>
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm">
                  Odoo ERP
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-400 font-mono">↑</span>
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 font-semibold text-sm text-[#0D0D0D] shadow-sm">
                  Apps (Next.js)
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Crombie actúa como middleware entre Fracttal, Odoo y el Motor SHUURI</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
