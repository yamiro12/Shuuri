"use client";
import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle, Search, UserCheck, FileText,
  Package, Wrench, CheckCircle2, CreditCard,
} from 'lucide-react';

// ─── DATOS ────────────────────────────────────────────────────────────────────

const PASOS = [
  {
    num:    1,
    icon:   PlusCircle,
    titulo: 'El restaurante reporta la falla',
    texto:  'Desde la app, en 2 minutos. Con foto del equipo, descripción del problema y nivel de urgencia. Sin llamadas, sin WhatsApps perdidos.',
  },
  {
    num:    2,
    icon:   Search,
    titulo: 'Diagnóstico inicial',
    texto:  'SHUURI registra el problema, clasifica el rubro y verifica qué técnicos tienen certificación vigente para ese equipo en esa zona.',
  },
  {
    num:    3,
    icon:   UserCheck,
    titulo: 'Asignación del técnico',
    texto:  'El técnico correcto para ese equipo, en esa zona, con disponibilidad. El restaurante recibe el nombre, foto y datos del técnico asignado.',
  },
  {
    num:    4,
    icon:   FileText,
    titulo: 'Cotización',
    texto:  'El técnico emite la cotización desde la app. El restaurante la aprueba antes de que se ejecute cualquier trabajo. Sin sorpresas.',
  },
  {
    num:    5,
    icon:   Package,
    titulo: 'Coordinación del repuesto',
    texto:  'Si el trabajo requiere repuesto, SHUURI lo coordina con el proveedor. El repuesto llega al local antes que el técnico.',
  },
  {
    num:    6,
    icon:   Wrench,
    titulo: 'Ejecución del servicio',
    texto:  'El técnico ejecuta el trabajo. Documenta con fotos del antes y el después. Todo queda registrado en la OT.',
  },
  {
    num:    7,
    icon:   CheckCircle2,
    titulo: 'Conformidad y cierre',
    texto:  'El restaurante firma la conformidad. La OT se cierra. El historial del equipo se actualiza automáticamente.',
  },
  {
    num:    8,
    icon:   CreditCard,
    titulo: 'Liquidación',
    texto:  'SHUURI liquida al técnico y al proveedor dentro del ciclo quincenal. Todo el flujo de dinero es gestionado por la plataforma.',
  },
];

const ACTOR_TABS = [
  {
    key:    'restaurante',
    label:  'Restaurante',
    color:  'text-[#2698D1]',
    bg:     'bg-[#2698D1]',
    items: [
      'Reportás la falla desde la app en 2 minutos',
      'Recibís los datos del técnico asignado',
      'Aprobás la cotización antes de cualquier trabajo',
      'Firmás la conformidad al cierre del servicio',
      'Accedés al historial completo de tus equipos',
    ],
  },
  {
    key:    'tecnico',
    label:  'Técnico',
    color:  'text-[#0D0D0D]',
    bg:     'bg-[#0D0D0D]',
    items: [
      'Recibís la orden de trabajo con toda la info del equipo',
      'El repuesto ya está coordinado antes de tu visita',
      'Cargás el diagnóstico y la cotización desde la app',
      'Documentás el trabajo con fotos y cerrás la OT',
      'Cobrás el 70% del servicio en la próxima liquidación quincenal',
    ],
  },
  {
    key:    'proveedor',
    label:  'Proveedor',
    color:  'text-green-700',
    bg:     'bg-green-600',
    items: [
      'Recibís el pedido de repuesto con destino y fecha confirmada',
      'Despachás directo al local del restaurante',
      'SHUURI registra la entrega y el uso en la OT',
      'Cobrás la venta con la comisión OCR descontada',
      'Accedés a datos de qué equipos están instalados en el campo',
    ],
  },
];

// ─── SECCIONES ────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <section className="bg-white py-20 text-center border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex bg-[#2698D1]/10 text-[#2698D1] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Cómo funciona
        </span>
        <h1 className="font-black text-5xl text-[#0D0D0D] leading-tight mb-5">
          De la falla a la conformidad.{' '}
          <span className="text-[#2698D1]">En un solo sistema.</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Así funciona una Orden de Trabajo en SHUURI, paso a paso.
        </p>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-16">
          El flujo completo de una OT
        </h2>

        {/* Desktop: alternating left/right */}
        <div className="hidden md:block relative">
          {/* Central line */}
          <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-[#2698D1]/20" />

          <div className="space-y-10">
            {PASOS.map(({ num, icon: Icon, titulo, texto }) => {
              const isLeft = num % 2 !== 0;
              return (
                <div key={num} className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">

                  {/* Left slot */}
                  {isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-right">
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#0D0D0D]">{titulo}</h3>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{texto}</p>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Center circle */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                    {num}
                  </div>

                  {/* Right slot */}
                  {!isLeft ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]/10">
                          <Icon className="h-5 w-5 text-[#2698D1]" />
                        </div>
                        <h3 className="font-bold text-lg text-[#0D0D0D]">{titulo}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{texto}</p>
                    </div>
                  ) : (
                    <div />
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="md:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2698D1]/20" />
          <div className="space-y-6">
            {PASOS.map(({ num, icon: Icon, titulo, texto }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-white font-black text-sm shadow-md">
                  {num}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-[#2698D1]" />
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

function PorActor() {
  const [activo, setActivo] = useState(0);
  const tab = ACTOR_TABS[activo];

  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="font-black text-3xl text-[#0D0D0D] text-center mb-10">
          ¿Qué hace cada actor?
        </h2>

        {/* Tabs */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-8">
          {ACTOR_TABS.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActivo(i)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                activo === i
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
          <ul className="space-y-4">
            {tab.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[#0D0D0D] font-medium leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
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
          ¿Listo para probarlo?
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Creá tu cuenta en 2 minutos. La primera OT es gratis.
        </p>
        <Link
          href="/registro"
          className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHeader />
      <Timeline />
      <PorActor />
      <CtaFinal />
    </>
  );
}
