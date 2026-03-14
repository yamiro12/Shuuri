"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PREGUNTAS = [
  {
    q: '¿Qué es el modelo mandato?',
    a: 'SHUURI actúa como tu agente comercial autorizado (contrato de mandato). Coordinamos la transacción, descontamos la comisión y te rendimos el neto. La venta queda registrada como tuya.',
  },
  {
    q: '¿Quién factura al cliente final?',
    a: 'Vos facturás al cliente final. SHUURI te factura a vos por la comisión de coordinación.',
  },
  {
    q: '¿Puedo establecer precios mínimos?',
    a: 'Sí. Definís los precios de tu catálogo. SHUURI no puede vender por debajo de tus precios.',
  },
  {
    q: '¿Hay exclusividad?',
    a: 'No. Podés vender por otros canales simultáneamente.',
  },
  {
    q: '¿Cómo sé si mi catálogo está generando ventas?',
    a: 'Desde tu panel de proveedor tenés dashboard con OCRs, conversión, y análisis de demanda por zona y rubro.',
  },
];

export default function FaqProveedores() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-black text-4xl text-[#0D0D0D] text-center mb-12">
          Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {PREGUNTAS.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
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
