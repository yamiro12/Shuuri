import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Para proveedores | SHUURI',
  description: 'Tu catálogo conectado a los técnicos que ya están en el campo. SHUURI coordina el pedido, el técnico recibe el repuesto y vos cobrás la venta.',
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <span className="inline-flex bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Para distribuidores, fabricantes e importadores
        </span>

        <h1 className="font-black text-5xl lg:text-6xl text-[#0D0D0D] leading-tight">
          Tu catálogo conectado a los técnicos{' '}
          <span className="text-[#2698D1]">que ya están en el campo</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
          SHUURI actúa como tu agente comercial: coordinamos el pedido,
          el técnico recibe el repuesto en el local, y vos cobrás la venta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Sumar mi catálogo
          </Link>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg text-[#0D0D0D] hover:bg-gray-50 transition-colors"
          >
            Hablar con el equipo
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── QUÉ GANÁS ────────────────────────────────────────────────────────────────

const GANANCIAS = [
  {
    icon:   TrendingUp,
    color:  'text-[#2698D1]',
    bg:     'bg-blue-50',
    titulo: 'Canal de venta sin fricción',
    texto:  'Los técnicos de SHUURI ven tu catálogo cuando crean una OT. El pedido llega a vos con destino y fecha confirmada.',
  },
  {
    icon:   BarChart3,
    color:  'text-purple-600',
    bg:     'bg-purple-50',
    titulo: 'Visibilidad de tu equipamiento en el campo',
    texto:  'Sabés qué modelos están instalados, en qué locales, y cuándo se hicieron los últimos servicios. Datos que hoy no tenés.',
  },
  {
    icon:   ShieldCheck,
    color:  'text-green-600',
    bg:     'bg-green-50',
    titulo: 'Modelo mandato: sin complicaciones fiscales',
    texto:  'SHUURI actúa como tu agente autorizado. La venta es tuya. Nosotros coordinamos, vos facturás al cliente final.',
  },
];

function QueGanas() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Qué ganás sumándote a SHUURI
          </h2>
          <p className="text-gray-500">Tres ventajas concretas desde el primer pedido.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GANANCIAS.map(({ icon: Icon, color, bg, titulo, texto }) => (
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

// ─── MODELO ECONÓMICO ─────────────────────────────────────────────────────────

const MODELO_FILAS = [
  {
    concepto: 'Comisión sobre repuestos',
    valor:    '15% sobre el valor de la orden',
  },
  {
    concepto: 'Comisión sobre productos nuevos',
    valor:    '10% sobre el valor de la venta',
  },
  {
    concepto: 'ShuuriPro (plan premium proveedor)',
    valor:    'USD 1.600 / mes',
  },
];

function ModeloEconomico() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
            Modelo económico
          </h2>
          <p className="text-gray-500">Sin sorpresas. Comisión solo cuando hay una venta.</p>
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 px-6 py-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Concepto</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Valor</span>
          </div>
          {MODELO_FILAS.map(({ concepto, valor }, i) => (
            <div
              key={concepto}
              className={`grid grid-cols-2 px-6 py-4 ${i < MODELO_FILAS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-sm font-medium text-[#0D0D0D]">{concepto}</span>
              <span className="text-sm font-bold text-[#2698D1]">{valor}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Modelo mandato — la venta pertenece al proveedor. SHUURI cobra comisión por la coordinación.
        </p>

      </div>
    </section>
  );
}

// ─── INTEGRACIÓN ──────────────────────────────────────────────────────────────

const ERP_PILLS = ['SAP', 'Tango', 'Odoo', 'Colppy', 'API REST'];

function Integracion() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-4 py-1.5 text-xs font-bold mb-6">
          <Zap className="h-3.5 w-3.5" />
          En desarrollo
        </div>

        <h2 className="font-black text-3xl text-[#0D0D0D] mb-4">
          Integración con tu sistema de stock
        </h2>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto">
          Próximamente: conectá tu ERP o sistema de stock directamente con SHUURI.
          Sin carga manual, sin desincronización.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {ERP_PILLS.map(erp => (
            <span
              key={erp}
              className="bg-white border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-semibold"
            >
              {erp}
            </span>
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
          Sumá tu catálogo a SHUURI
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Registrá tu empresa y empezá a recibir pedidos de técnicos ya activos en la plataforma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            Registrar mi empresa
          </Link>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
          >
            Hablar con el equipo
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ProveedoresPage() {
  return (
    <>
      <Hero />
      <QueGanas />
      <ModeloEconomico />
      <Integracion />
      <CtaFinal />
    </>
  );
}
