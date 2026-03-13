"use client";
import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, ChevronDown, ChevronUp } from 'lucide-react';

// ─── DATOS ────────────────────────────────────────────────────────────────────

type TierKey = 'BASE' | 'CADENA_CHICA' | 'CADENA_GRANDE';

const TIERS: {
  key: TierKey;
  nombre: string;
  precio: string;
  periodo: string;
  comisionServicios: string;
  comisionRepuestos: string;
  usuarios: string;
  sucursales: string;
  para: string;
  cta: string;
  ctaHref: string;
  highlight: boolean;
  badge?: string;
}[] = [
  {
    key:               'BASE',
    nombre:            'Base',
    precio:            'Gratis',
    periodo:           '',
    comisionServicios: '30%',
    comisionRepuestos: '15%',
    usuarios:          '1',
    sucursales:        '1',
    para:              'Restaurante independiente',
    cta:               'Registrarse gratis',
    ctaHref:           '/registro',
    highlight:         false,
  },
  {
    key:               'CADENA_CHICA',
    nombre:            'Cadena Chica',
    precio:            'USD 75',
    periodo:           '/ local / mes',
    comisionServicios: '25%',
    comisionRepuestos: '15%',
    usuarios:          'Hasta 5 por local',
    sucursales:        'Hasta 10',
    para:              'Cadenas de 2 a 10 locales',
    cta:               'Empezar ahora',
    ctaHref:           '/registro',
    highlight:         true,
    badge:             'Más popular',
  },
  {
    key:               'CADENA_GRANDE',
    nombre:            'Cadena Grande',
    precio:            'USD 100',
    periodo:           '/ local / mes',
    comisionServicios: '20%',
    comisionRepuestos: '15%',
    usuarios:          'Ilimitados',
    sucursales:        'Ilimitadas',
    para:              'Cadenas de 10+ locales',
    cta:               'Hablar con el equipo',
    ctaHref:           'https://wa.me/5491100000000',
    highlight:         false,
  },
];

type FeatureValue = true | false | string;

interface Feature {
  label:      string;
  BASE:       FeatureValue;
  CADENA_CHICA: FeatureValue;
  CADENA_GRANDE: FeatureValue;
  proximamente?: boolean;
}

const FEATURES: Feature[] = [
  { label: 'Reporte de falla desde la app',              BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Asignación automática de técnico',           BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Coordinación de repuesto',                   BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Historial por equipo',                       BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Múltiples sucursales',                       BASE: false,     CADENA_CHICA: 'Hasta 10', CADENA_GRANDE: 'Ilimitadas' },
  { label: 'Múltiples usuarios',                         BASE: false,     CADENA_CHICA: 'Hasta 5',  CADENA_GRANDE: 'Ilimitados' },
  { label: 'Dashboard de estadísticas',                  BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: true },
  { label: 'Soporte prioritario',                        BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: true },
  { label: 'Técnicos fijos asignados',                   BASE: false,     CADENA_CHICA: 'Hasta 2',  CADENA_GRANDE: 'Ilimitados' },
  { label: 'Preventivo programado',                      BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: false, proximamente: true },
];

const FAQ_ITEMS = [
  {
    q: '¿Qué pasa si el restaurante no aprueba la cotización?',
    a: 'No se ejecuta ningún servicio y no hay cargo.',
  },
  {
    q: '¿Quién paga el repuesto?',
    a: 'El restaurante aprueba el presupuesto que incluye el repuesto. SHUURI coordina la compra.',
  },
  {
    q: '¿Puedo cambiar de plan?',
    a: 'Sí, en cualquier momento. El cambio se refleja en el próximo ciclo de facturación.',
  },
  {
    q: '¿Qué pasa si necesito más sucursales?',
    a: 'Cada sucursal adicional se factura al precio del plan vigente.',
  },
  {
    q: '¿Cómo funciona el modelo de mandato para proveedores?',
    a: 'SHUURI actúa como agente autorizado del proveedor. La venta es del proveedor, nosotros coordinamos la logística y cobramos una comisión sobre el valor.',
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function FeatureCell({ value, proximamente }: { value: FeatureValue; proximamente?: boolean }) {
  if (proximamente) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
        Próximamente
      </span>
    );
  }
  if (value === false) return <X className="h-4 w-4 text-gray-300 mx-auto" />;
  if (value === true)  return <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />;
  return <span className="text-xs font-semibold text-[#0D0D0D]">{value}</span>;
}

// ─── SECCIONES ────────────────────────────────────────────────────────────────

function Header() {
  return (
    <section className="bg-white py-20 text-center border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-black text-5xl text-[#0D0D0D] mb-5 leading-tight">
          Precios simples. Sin sorpresas.
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Empezá gratis. Pagás una comisión solo cuando hay un servicio.
          El SaaS es opcional para cadenas.
        </p>

        {/* Toggle visual (disabled) */}
        <div className="mt-10 inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1.5">
          <button className="px-5 py-2 rounded-lg bg-white text-sm font-bold text-[#0D0D0D] shadow-sm">
            Mensual
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-gray-400 cursor-not-allowed">
            Anual
            <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
              Próximamente
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Cards() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {TIERS.map(tier => (
            <div
              key={tier.key}
              className={`relative bg-white rounded-2xl p-8 ${
                tier.highlight
                  ? 'border-2 border-[#2698D1] shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex bg-[#2698D1] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {tier.badge}
                </span>
              )}

              <h3 className="font-black text-xl text-[#0D0D0D] mb-1">{tier.nombre}</h3>
              <p className="text-sm text-gray-500 mb-5">{tier.para}</p>

              <div className="mb-2">
                <span className="text-3xl font-black text-[#0D0D0D]">{tier.precio}</span>
                {tier.periodo && (
                  <span className="text-sm text-gray-400 ml-1">{tier.periodo}</span>
                )}
              </div>

              <div className="space-y-2 mb-6 mt-5 pt-5 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Comisión servicios</span>
                  <span className="font-bold text-[#0D0D0D]">{tier.comisionServicios}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Comisión repuestos</span>
                  <span className="font-bold text-[#0D0D0D]">{tier.comisionRepuestos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Usuarios</span>
                  <span className="font-bold text-[#0D0D0D]">{tier.usuarios}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sucursales</span>
                  <span className="font-bold text-[#0D0D0D]">{tier.sucursales}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-8">
                {FEATURES.map(f => {
                  const val = f[tier.key];
                  if (val === false && !f.proximamente) return null;
                  return (
                    <li key={f.label} className="flex items-center gap-2 text-sm text-gray-600">
                      {f.proximamente
                        ? <span className="h-4 w-4 shrink-0" />
                        : <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      }
                      {f.label}
                      {f.proximamente && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
                          Próximamente
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

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
      </div>
    </section>
  );
}

function TablaComparativa() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-10">
          Comparativa completa
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm rounded-xl overflow-hidden border border-gray-200">
            <thead>
              <tr className="bg-[#2698D1]/5 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 w-1/2">
                  Función
                </th>
                {TIERS.map(t => (
                  <th key={t.key} className="px-4 py-4 text-center text-xs font-bold text-[#0D0D0D]">
                    {t.nombre}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-100">
                <td className="px-6 py-3 text-xs text-gray-400">Precio</td>
                {TIERS.map(t => (
                  <td key={t.key} className="px-4 py-3 text-center text-xs font-bold text-[#0D0D0D]">
                    {t.precio}{t.periodo ? <span className="font-normal text-gray-400"> {t.periodo}</span> : ''}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-100">
                <td className="px-6 py-3 text-xs text-gray-400">Comisión servicios</td>
                {TIERS.map(t => (
                  <td key={t.key} className="px-4 py-3 text-center text-xs font-bold text-[#0D0D0D]">
                    {t.comisionServicios}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, i) => (
                <tr
                  key={feat.label}
                  className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-6 py-3 text-gray-700 flex items-center gap-2">
                    {feat.label}
                    {feat.proximamente && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </td>
                  {TIERS.map(t => (
                    <td key={t.key} className="px-4 py-3 text-center">
                      <FeatureCell value={feat[t.key]} proximamente={feat.proximamente} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}

function SeccionActores() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-12">
          Para proveedores y técnicos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Proveedor */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <span className="inline-flex bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-5">
              Proveedor
            </span>
            <div className="space-y-3 mb-8">
              {[
                { label: 'Comisión repuestos',    valor: '15% sobre el valor de la orden' },
                { label: 'Comisión productos',    valor: '10% sobre el valor de la venta' },
                { label: 'ShuuriPro (plan premium)', valor: 'USD 1.600 / mes' },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-[#0D0D0D]">{valor}</span>
                </div>
              ))}
            </div>
            <Link
              href="/proveedores"
              className="block w-full text-center rounded-xl border border-gray-300 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-gray-50 transition-colors"
            >
              Sumar mi catálogo →
            </Link>
          </div>

          {/* Técnico */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <span className="inline-flex bg-blue-50 text-[#2698D1] text-xs font-bold px-3 py-1 rounded-full mb-5">
              Técnico
            </span>
            <div className="space-y-3 mb-8">
              {[
                { label: 'El técnico recibe',      valor: '70% de cada servicio' },
                { label: 'Suscripción mensual',    valor: 'Sin costo' },
                { label: 'Ciclo de pago',          valor: 'Quincenal (día 15 y último)' },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-[#0D0D0D]">{valor}</span>
                </div>
              ))}
            </div>
            <Link
              href="/tecnicos"
              className="block w-full text-center rounded-xl border border-gray-300 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-gray-50 transition-colors"
            >
              Sumarme como técnico →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-12">
          Preguntas frecuentes
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setAbierto(prev => prev === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-bold text-[#0D0D0D] hover:bg-gray-50 transition-colors"
              >
                {item.q}
                {abierto === i
                  ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0 ml-4" />
                  : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-4" />
                }
              </button>
              {abierto === i && (
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-black text-4xl text-white mb-6 leading-tight">
          Empezá gratis hoy
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            Registrarse gratis
          </Link>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
          >
            Tengo dudas, quiero hablar
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PreciosPage() {
  return (
    <>
      <Header />
      <Cards />
      <TablaComparativa />
      <SeccionActores />
      <Faq />
      <CtaFinal />
    </>
  );
}
