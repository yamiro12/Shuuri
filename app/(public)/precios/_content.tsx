"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, ChevronDown, ArrowRight } from 'lucide-react';

// ─── DATOS ────────────────────────────────────────────────────────────────────

type TierKey = 'BASE' | 'CADENA_CHICA' | 'CADENA_GRANDE';

const TIERS: {
  key: TierKey;
  nombre: string;
  precio: string;
  saas: number; // USD por local/mes
  periodo: string;
  comisionPct: number; // como decimal
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
    saas:              0,
    periodo:           '',
    comisionPct:       0.30,
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
    saas:              75,
    periodo:           '/ local / mes',
    comisionPct:       0.25,
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
    saas:              100,
    periodo:           '/ local / mes',
    comisionPct:       0.20,
    comisionServicios: '20%',
    comisionRepuestos: '15%',
    usuarios:          'Ilimitados',
    sucursales:        'Ilimitadas',
    para:              'Cadenas de 10+ locales',
    cta:               'Hablar con el equipo',
    ctaHref:           'https://wa.me/5491150148932',
    highlight:         false,
  },
];

type FeatureValue = true | false | string;

interface Feature {
  label: string;
  BASE: FeatureValue;
  CADENA_CHICA: FeatureValue;
  CADENA_GRANDE: FeatureValue;
  proximamente?: boolean;
}

const FEATURES: Feature[] = [
  { label: 'Reporte de falla desde la app',     BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Asignación automática de técnico',  BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Coordinación de repuesto',          BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Historial por equipo',              BASE: true,      CADENA_CHICA: true,       CADENA_GRANDE: true },
  { label: 'Múltiples sucursales',              BASE: false,     CADENA_CHICA: 'Hasta 10', CADENA_GRANDE: 'Ilimitadas' },
  { label: 'Múltiples usuarios',                BASE: false,     CADENA_CHICA: 'Hasta 5',  CADENA_GRANDE: 'Ilimitados' },
  { label: 'Dashboard de estadísticas',         BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: true },
  { label: 'Soporte prioritario',               BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: true },
  { label: 'Técnicos fijos asignados',          BASE: false,     CADENA_CHICA: 'Hasta 2',  CADENA_GRANDE: 'Ilimitados' },
  { label: 'Preventivo programado',             BASE: false,     CADENA_CHICA: false,      CADENA_GRANDE: false, proximamente: true },
];

const FAQ_ITEMS = [
  {
    q: '¿Qué pasa si el establecimiento no aprueba la cotización?',
    a: 'No se ejecuta ningún servicio y no hay cargo. El diagnóstico inicial queda registrado para futura referencia.',
  },
  {
    q: '¿Quién paga el repuesto?',
    a: 'El establecimiento aprueba el presupuesto que incluye el repuesto. SHUURI coordina la compra y la entrega con el proveedor.',
  },
  {
    q: '¿Puedo cambiar de plan?',
    a: 'Sí, en cualquier momento. El cambio se aplica al inicio del siguiente ciclo de facturación. Si bajás de plan, accedés a las funciones del nuevo plan desde el cambio.',
  },
  {
    q: '¿Qué pasa si necesito más sucursales que las del plan?',
    a: 'Cada sucursal adicional se factura al precio del plan vigente. Para volúmenes altos, contactanos para un precio especial.',
  },
  {
    q: '¿Cómo funciona el modelo de mandato para proveedores?',
    a: 'SHUURI actúa como agente autorizado del proveedor. La venta queda registrada a nombre del proveedor, quien factura al cliente. SHUURI descuenta su comisión y rinde el neto.',
  },
  {
    q: '¿La comisión se aplica sobre el total de la OT o solo el servicio?',
    a: 'La comisión del plan (20%/25%/30%) se aplica sobre el valor del servicio técnico. Los repuestos tienen su propia comisión fija del 15%, independiente del plan.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Transferencia bancaria (CBU/CVU) y tarjeta de crédito/débito. Para planes de cadena, también aceptamos débito automático mensual.',
  },
  {
    q: '¿Hay contrato de permanencia?',
    a: 'No. Los planes son mes a mes sin permanencia mínima. Podés cancelar en cualquier momento sin penalidad.',
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

function fmt(n: number) {
  return n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
}

// ─── SECCIONES ────────────────────────────────────────────────────────────────

function Header() {
  return (
    <section className="bg-white py-20 text-center border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-black text-5xl sm:text-6xl text-[#0D0D0D] mb-5 leading-tight">
          Precios simples. Sin sorpresas.
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Empezá gratis. Pagás comisión solo cuando hay un servicio.
          El SaaS es opcional para cadenas.
        </p>
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
                {[
                  { label: 'Comisión servicios', val: tier.comisionServicios },
                  { label: 'Comisión repuestos', val: tier.comisionRepuestos },
                  { label: 'Usuarios',           val: tier.usuarios },
                  { label: 'Sucursales',         val: tier.sucursales },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-bold text-[#0D0D0D]">{r.val}</span>
                  </div>
                ))}
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
                    ? 'bg-[#2698D1] hover:bg-[#1d7aab] text-white'
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

// ─── CALCULADORA ─────────────────────────────────────────────────────────────

function Calculadora() {
  const [locales, setLocales] = useState(3);
  const [gasto, setGasto] = useState(800); // USD por local/mes en servicios

  const resultados = useMemo(() => {
    return TIERS.map(t => {
      const saasTotal = t.saas * locales;
      const comisionTotal = t.comisionPct * gasto * locales;
      const total = saasTotal + comisionTotal;
      return { key: t.key, nombre: t.nombre, saasTotal, comisionTotal, total };
    });
  }, [locales, gasto]);

  const minTotal = Math.min(...resultados.map(r => r.total));
  const recommended = resultados.find(r => r.total === minTotal)!;

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-3">
          Calculá tu costo real
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Ajustá los valores según tu operación y mirá qué plan te conviene más.
        </p>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          {/* Sliders */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-bold text-[#0D0D0D]">Locales</label>
                <span className="font-black text-2xl text-[#2698D1]">{locales}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={locales}
                onChange={e => setLocales(Number(e.target.value))}
                className="w-full accent-[#2698D1]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span><span>10</span><span>20</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-bold text-[#0D0D0D]">
                  Gasto mensual en servicios / local
                </label>
                <span className="font-black text-2xl text-[#2698D1]">USD {fmt(gasto)}</span>
              </div>
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={gasto}
                onChange={e => setGasto(Number(e.target.value))}
                className="w-full accent-[#2698D1]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>USD 100</span><span>USD 1.500</span><span>USD 3.000</span>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resultados.map(r => {
              const isRecommended = r.key === recommended.key;
              return (
                <div
                  key={r.key}
                  className={`rounded-xl p-5 border-2 transition-all ${
                    isRecommended
                      ? 'border-[#2698D1] bg-blue-50'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm text-[#0D0D0D]">{r.nombre}</p>
                    {isRecommended && (
                      <span className="text-[10px] font-bold bg-[#2698D1] text-white px-2 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className={`font-black text-2xl mb-3 ${isRecommended ? 'text-[#2698D1]' : 'text-[#0D0D0D]'}`}>
                    USD {fmt(r.total)}
                    <span className="text-xs font-normal text-gray-400 ml-1">/mes</span>
                  </p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>SaaS</span>
                      <span className="font-medium">{r.saasTotal === 0 ? 'Gratis' : `USD ${fmt(r.saasTotal)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión</span>
                      <span className="font-medium">USD {fmt(r.comisionTotal)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            * El cálculo aplica solo a la comisión de servicios. Los repuestos tienen comisión fija del 15% en todos los planes.
          </p>
        </div>
      </div>
    </section>
  );
}

function TablaComparativa() {
  return (
    <section className="bg-gray-50 py-20">
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
                    {t.precio}
                    {t.periodo && <span className="font-normal text-gray-400"> {t.periodo}</span>}
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
                  className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
                >
                  <td className="px-6 py-3 text-gray-700">
                    <span className="flex items-center gap-2">
                      {feat.label}
                      {feat.proximamente && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
                          Próximamente
                        </span>
                      )}
                    </span>
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
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-12">
          Para técnicos y proveedores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Técnico */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <span className="inline-flex bg-blue-50 text-[#2698D1] text-xs font-bold px-3 py-1 rounded-full mb-5">
              Técnico
            </span>
            <div className="space-y-3 mb-8">
              {[
                { label: 'El técnico recibe',    valor: '70% de cada servicio' },
                { label: 'Suscripción mensual',  valor: 'Sin costo' },
                { label: 'Ciclo de pago',        valor: 'Quincenal (día 15 y último)' },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-[#0D0D0D]">{valor}</span>
                </div>
              ))}
            </div>
            <Link
              href="/tecnicos"
              className="flex items-center justify-center gap-2 w-full text-center rounded-xl border border-gray-300 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-white transition-colors"
            >
              Sumarme como técnico
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Proveedor */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <span className="inline-flex bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-5">
              Proveedor
            </span>
            <div className="space-y-3 mb-8">
              {[
                { label: 'Comisión repuestos',       valor: '15% sobre la orden' },
                { label: 'Comisión equipos/insumos', valor: '10% sobre la venta' },
                { label: 'ShuuriPro (premium)',       valor: 'USD 1.600 / año' },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-[#0D0D0D]">{valor}</span>
                </div>
              ))}
            </div>
            <Link
              href="/proveedores"
              className="flex items-center justify-center gap-2 w-full text-center rounded-xl border border-gray-300 py-3 text-sm font-bold text-[#0D0D0D] hover:bg-white transition-colors"
            >
              Sumar mi catálogo
              <ArrowRight className="h-3.5 w-3.5" />
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
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-12">
          Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 overflow-hidden bg-white">
              <button
                onClick={() => setAbierto(prev => prev === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-[#0D0D0D] hover:bg-gray-50 transition-colors"
              >
                {item.q}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 shrink-0 ml-4 transition-transform ${abierto === i ? 'rotate-180' : ''}`}
                />
              </button>
              {abierto === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
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
        <h2 className="font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
          Empezá gratis hoy
        </h2>
        <p className="text-gray-400 mb-10">
          Sin tarjeta de crédito. Sin permanencia mínima. Cancelás cuando quieras.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-2 bg-[#2698D1] hover:bg-[#1d7aab] text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            Registrarse gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`https://wa.me/5491150148932?text=${encodeURIComponent('Hola, tengo consultas sobre los planes de SHUURI.')}`}
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

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default function PreciosContent() {
  return (
    <>
      <Header />
      <Cards />
      <Calculadora />
      <TablaComparativa />
      <SeccionActores />
      <Faq />
      <CtaFinal />
    </>
  );
}
