"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PREGUNTAS = [
  {
    q: '¿Qué pasa si el técnico no aparece?',
    a: 'SHUURI garantiza el cumplimiento de la visita. Si el técnico no aparece, asignamos uno nuevo sin costo adicional.',
  },
  {
    q: '¿El técnico viene con el repuesto?',
    a: 'Sí. Si el diagnóstico previo identificó un repuesto necesario, lo coordinamos con el proveedor antes de la visita.',
  },
  {
    q: '¿Cómo sé que el técnico está certificado?',
    a: 'Antes de asignar cualquier técnico, verificamos que tenga certificación vigente para ese rubro específico.',
  },
  {
    q: '¿Puedo elegir mi técnico de confianza?',
    a: 'Sí. Con Cadena Chica o Cadena Grande podés asignar técnicos fijos preferidos por equipo o por rubro.',
  },
  {
    q: '¿Qué pasa si no apruebo la cotización?',
    a: 'Si no aprobás el presupuesto, no se ejecuta ningún servicio y no hay cargo.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Por transferencia bancaria o CBU/CVU. SHUURI factura el servicio completo y liquida al técnico y al proveedor.',
  },
  {
    q: '¿Funciona en todo el país?',
    a: 'Estamos comenzando en CABA y GBA. En 2026 expandimos al interior.',
  },
  {
    q: '¿Qué tipos de establecimientos pueden usar SHUURI?',
    a: 'Cualquier establecimiento gastronómico: restaurantes, bares, hoteles, cafeterías, dark kitchens, comedores corporativos y más.',
  },
];

export default function FaqGastronomicos() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-12">
          Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {PREGUNTAS.map((item, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0D0D0D] text-sm pr-4">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
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
