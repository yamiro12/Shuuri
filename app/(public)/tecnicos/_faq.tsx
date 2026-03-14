"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PREGUNTAS = [
  {
    q: '¿Tengo exclusividad con SHUURI?',
    a: 'No. Podés seguir trabajando con otros clientes o plataformas.',
  },
  {
    q: '¿Qué pasa si no puedo tomar una OT?',
    a: 'Podés rechazarla. Solo te descontamos puntos de score si rechazás más del 20% de las OTs asignadas.',
  },
  {
    q: '¿Cómo me aseguran que el cliente paga?',
    a: 'SHUURI cobra al cliente antes de confirmar la visita. Tu cobro está garantizado independientemente del comportamiento del cliente.',
  },
  {
    q: '¿Qué pasa si hay un reclamo del cliente?',
    a: 'Tenés 7 días de garantía de servicio. Evaluamos cada caso de forma objetiva con la documentación fotográfica de la OT.',
  },
  {
    q: '¿Necesito tener monotributo?',
    a: 'Sí, mínimo categoría A activa para poder facturar a SHUURI.',
  },
];

export default function FaqTecnicos() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-12">
          Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {PREGUNTAS.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
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
