import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  FileText,
  Upload,
  Link2,
  CheckCircle2,
} from 'lucide-react';
import FaqProveedores from './_faq';

export const metadata: Metadata = {
  title: 'Proveedores — Distribuí tus productos a través de SHUURI',
  description:
    'Conectá tu catálogo de repuestos, equipos e insumos con técnicos y establecimientos gastronómicos. Modelo mandato, comisión fija, cobranza garantizada.',
  keywords: [
    'proveedor repuestos gastronomía',
    'distribuidor equipos gastronómicos',
    'marketplace B2B gastronomía Argentina',
    'modelo mandato',
  ],
  openGraph: {
    title: 'Proveedores — Distribuí tus productos a través de SHUURI',
    description: 'Canal de venta sin inversión para repuestos y equipos gastronómicos. Comisión fija, cobranza garantizada.',
    url: 'https://shuuri.com/proveedores',
  },
  alternates: {
    canonical: 'https://shuuri.com/proveedores',
  },
};

const GANANCIAS = [
  {
    icon: TrendingUp,
    titulo: 'Canal de venta sin inversión',
    desc: 'Accedé a un canal activo de técnicos y gastronómicos sin esfuerzo comercial. Tus productos aparecen en el momento exacto de la OT.',
    color: 'text-[#2698D1]',
    bg: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    titulo: 'Visibilidad en campo',
    desc: 'Tus marcas se posicionan ante quien toma la decisión de compra: el técnico certificado en el momento del diagnóstico.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: ShieldCheck,
    titulo: 'Modelo mandato sin riesgo',
    desc: 'SHUURI actúa como tu agente comercial. Cobramos al cliente, descontamos comisión y te rendimos el neto. Sin riesgo de incobrables.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
] as const;

const MODELO = [
  { categoria: 'Repuestos', comision: '15 %', neto: '85 %', highlight: true },
  { categoria: 'Equipos nuevos', comision: '10 %', neto: '90 %', highlight: false },
  { categoria: 'Insumos', comision: '10 %', neto: '90 %', highlight: false },
] as const;

const PASOS = [
  { n: 1, titulo: 'Cargás tu catálogo', desc: 'Subís productos vía CSV, API o formulario. Vos controlás precios y stock.' },
  { n: 2, titulo: 'Técnico necesita una pieza', desc: 'Durante la OT, SHUURI muestra los repuestos compatibles de tu catálogo.' },
  { n: 3, titulo: 'Gastronómico aprueba cotización', desc: 'El cliente confirma el presupuesto. Se genera la orden de compra automáticamente.' },
  { n: 4, titulo: 'Vos facturás y entregás', desc: 'Emitís la factura al gastronómico. SHUURI te factura la comisión aparte.' },
  { n: 5, titulo: 'Rendición en 48 hs', desc: 'Recibís el neto dentro de las 48 hs de confirmado el pago.' },
] as const;

export default function ProveedoresPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2698D1] bg-blue-50 px-4 py-1.5 rounded-full mb-6">
              fabricantes · distribuidores · importadores
            </span>
            <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl text-[#0D0D0D] leading-none mb-6">
              Tu catálogo conectado{' '}
              <span className="text-[#2698D1] block mt-1">a los técnicos en el campo.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
              Cuando un técnico diagnostica un equipo, tu repuesto ya está ahí. Sin vendedores, sin
              llamadas, sin cobros en riesgo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-[#2698D1] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1d7aab] transition-colors"
              >
                Sumar mi catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#modelo"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-[#0D0D0D] font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Ver modelo económico
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { valor: '0', label: 'Costo de alta' },
              { valor: '48 hs', label: 'Rendición del neto' },
              { valor: '100 %', label: 'Precios controlados por vos' },
              { valor: '0', label: 'Exclusividad requerida' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-black text-3xl text-[#2698D1]">{s.valor}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ GANÁS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-4">
            ¿Qué ganás como proveedor?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Un canal de distribución que trabaja solo, con datos reales de demanda por zona y rubro.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {GANANCIAS.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.titulo} className="bg-white rounded-2xl p-8 border border-gray-100">
                  <div className={`inline-flex p-3 rounded-xl ${g.bg} mb-5`}>
                    <Icon className={`h-6 w-6 ${g.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0D0D0D] mb-3">{g.titulo}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODELO ECONÓMICO */}
      <section id="modelo" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-4">
              Modelo económico
            </h2>
            <p className="text-gray-500 text-center mb-12">
              Comisión fija por categoría. Sin sorpresas, sin variables ocultas.
            </p>

            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 font-semibold text-[#0D0D0D]">Categoría</th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-500">Comisión SHUURI</th>
                    <th className="text-center px-6 py-4 font-semibold text-[#0D0D0D]">Vos recibís</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELO.map((row) => (
                    <tr
                      key={row.categoria}
                      className={`border-b border-gray-50 ${row.highlight ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 font-medium text-[#0D0D0D]">{row.categoria}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{row.comision}</td>
                      <td className="px-6 py-4 text-center font-bold text-[#2698D1]">{row.neto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-[#0D0D0D] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">ShuuriPro para proveedores</p>
                <p className="text-sm text-gray-400 mt-1">
                  Posicionamiento destacado, analytics avanzados y API prioritaria.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-2xl">USD 1.600</p>
                <p className="text-xs text-gray-400">por año</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              * La venta queda registrada a nombre del proveedor. SHUURI actúa como agente
              comercial autorizado (contrato de mandato).
            </p>
          </div>
        </div>
      </section>

      {/* CÓMO FLUYE UN PEDIDO */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-4">
            Cómo fluye un pedido
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Desde el diagnóstico hasta la rendición, sin que tengas que gestionar nada.
          </p>

          {/* Desktop horizontal stepper */}
          <div className="hidden md:flex items-start gap-0">
            {PASOS.map((paso, i) => (
              <div key={paso.n} className="flex-1 flex flex-col items-center text-center px-3">
                <div className="relative flex items-center w-full justify-center mb-5">
                  {i > 0 && (
                    <div className="absolute right-1/2 top-5 w-full h-px bg-gray-200 -translate-y-1/2" />
                  )}
                  <div className="relative z-10 h-10 w-10 rounded-full bg-[#2698D1] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {paso.n}
                  </div>
                </div>
                <p className="font-bold text-sm text-[#0D0D0D] mb-2">{paso.titulo}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile vertical stepper */}
          <div className="md:hidden space-y-6 max-w-sm mx-auto">
            {PASOS.map((paso) => (
              <div key={paso.n} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#2698D1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {paso.n}
                  </div>
                  <div className="flex-1 w-px bg-gray-200 mt-2" />
                </div>
                <div className="pb-6">
                  <p className="font-bold text-sm text-[#0D0D0D] mb-1">{paso.titulo}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRACIÓN Y CATÁLOGO */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Opciones de carga */}
            <div>
              <h2 className="font-black text-3xl text-[#0D0D0D] mb-3">
                Cargá tu catálogo como quieras
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Tres formas de integrar tu inventario. Elegís según tu operación.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Upload,
                    titulo: 'CSV / Excel',
                    desc: 'Subís un archivo con nombre, código, precio y stock. Actualizamos tu catálogo en minutos.',
                  },
                  {
                    icon: Link2,
                    titulo: 'API REST',
                    desc: 'Conectás tu sistema de gestión directamente. Stock y precios en tiempo real.',
                  },
                  {
                    icon: FileText,
                    titulo: 'Formulario manual',
                    desc: 'Cargás producto por producto desde el panel. Ideal para catálogos chicos.',
                  },
                ].map((op) => {
                  const Icon = op.icon;
                  return (
                    <div key={op.titulo} className="flex gap-4 p-5 border border-gray-100 rounded-xl">
                      <div className="bg-blue-50 p-2.5 rounded-lg h-fit">
                        <Icon className="h-5 w-5 text-[#2698D1]" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0D0D0D] mb-1">{op.titulo}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{op.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integraciones próximas */}
            <div>
              <h2 className="font-black text-3xl text-[#0D0D0D] mb-3">
                Integraciones próximas
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Conectamos con los sistemas de gestión más usados en el rubro.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Tango Gestión',
                  'Colppy',
                  'Odoo',
                  'Bling (BR)',
                  'Nubox',
                  'Siigo',
                  'Shopify',
                  'WooCommerce',
                ].map((int) => (
                  <div
                    key={int}
                    className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg text-sm text-gray-500"
                  >
                    <CheckCircle2 className="h-4 w-4 text-gray-300 shrink-0" />
                    <span>{int}</span>
                    <span className="ml-auto text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">
                      pronto
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                ¿Usás otro sistema? Escribinos y lo priorizamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqProveedores />

      {/* CTA FINAL */}
      <section className="bg-[#0D0D0D] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            Tu catálogo merece estar{' '}
            <span className="text-[#2698D1]">donde se toma la decisión.</span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Alta gratuita. Sin exclusividad. Comisión solo cuando vendés.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-[#2698D1] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1d7aab] transition-colors"
            >
              Sumar mi catálogo gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/5491150148932?text=${encodeURIComponent('Hola, quiero saber más sobre sumar mi catálogo como proveedor en SHUURI.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Hablar con ventas
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
