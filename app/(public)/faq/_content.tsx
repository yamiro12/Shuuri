"use client";
import React, { useState } from 'react';
import { ChevronDown, ChefHat, Wrench, Package, DollarSign, HelpCircle } from 'lucide-react';

// ─── DATOS ────────────────────────────────────────────────────────────────────

interface FaqItem { q: string; a: string }

const SECCIONES: {
  key:   string;
  label: string;
  icon:  React.ElementType;
  items: FaqItem[];
}[] = [
  {
    key:   'gastronomicos',
    label: 'Gastronómicos',
    icon:  ChefHat,
    items: [
      {
        q: '¿Qué tipo de establecimientos pueden usar SHUURI?',
        a: 'Cualquier establecimiento gastronómico: restaurantes, bares, hoteles, cafeterías, dark kitchens, comedores corporativos y más.',
      },
      {
        q: '¿Cómo solicito un técnico?',
        a: 'Desde la página "Solicitar técnico" o desde tu panel de cliente. Completás el rubro, describís la falla, cargás fotos si tenés y elegís urgencia. SHUURI asigna el técnico más adecuado.',
      },
      {
        q: '¿Qué pasa si el técnico no aparece?',
        a: 'SHUURI garantiza el cumplimiento de la visita. Si el técnico no aparece, asignamos uno nuevo sin costo adicional.',
      },
      {
        q: '¿El técnico viene con el repuesto?',
        a: 'Si el diagnóstico previo identificó un repuesto necesario, lo coordinamos con el proveedor antes de la visita. El repuesto llega junto con el técnico o antes.',
      },
      {
        q: '¿Cómo sé que el técnico está certificado?',
        a: 'Antes de asignar cualquier técnico verificamos que tenga certificación vigente para ese rubro específico. Podés ver su perfil antes de confirmar.',
      },
      {
        q: '¿Puedo elegir mi técnico de confianza?',
        a: 'Sí. Con los planes Cadena Chica y Cadena Grande podés asignar técnicos fijos preferidos por equipo o por rubro.',
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
    ],
  },
  {
    key:   'tecnicos',
    label: 'Técnicos',
    icon:  Wrench,
    items: [
      {
        q: '¿Cómo me sumo como técnico?',
        a: 'Completás el formulario de alta, subís tu documentación (matrícula, certificaciones) y esperás la verificación. El proceso toma entre 24 y 72 horas.',
      },
      {
        q: '¿Qué porcentaje cobro por cada servicio?',
        a: 'Cobrás el 70% del valor del servicio. Si activás el pago mensual (en lugar de quincenal), el porcentaje sube al 72%.',
      },
      {
        q: '¿Necesito tener monotributo?',
        a: 'Sí, mínimo categoría A activa para poder facturar a SHUURI.',
      },
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
        q: '¿Cuándo me pagan?',
        a: 'Con ciclo quincenal, el pago se acredita el día 15 y el último día de cada mes. Con ciclo mensual, el último día del mes.',
      },
    ],
  },
  {
    key:   'proveedores',
    label: 'Proveedores',
    icon:  Package,
    items: [
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
        q: '¿Cómo subo mi catálogo?',
        a: 'Podés cargar productos vía CSV/Excel, API REST o formulario manual desde tu panel. El alta del catálogo es gratuita.',
      },
      {
        q: '¿Cómo sé si mi catálogo está generando ventas?',
        a: 'Desde tu panel de proveedor tenés dashboard con OCRs, conversión y análisis de demanda por zona y rubro.',
      },
      {
        q: '¿Cuándo recibo el pago?',
        a: 'La rendición del neto se realiza dentro de las 48 horas de confirmado el pago del cliente.',
      },
    ],
  },
  {
    key:   'precios',
    label: 'Precios y planes',
    icon:  DollarSign,
    items: [
      {
        q: '¿Cuánto cuesta SHUURI para un restaurante independiente?',
        a: 'El plan Base es gratuito. Solo pagás una comisión del 30% sobre el valor del servicio cuando hay una reparación.',
      },
      {
        q: '¿Qué incluyen los planes de cadena?',
        a: 'Cadena Chica (USD 75/local/mes) baja la comisión al 25% y habilita hasta 10 sucursales y técnicos fijos. Cadena Grande (USD 100/local/mes) baja al 20% con sucursales y usuarios ilimitados.',
      },
      {
        q: '¿La comisión aplica también sobre los repuestos?',
        a: 'No. La comisión del plan (20%/25%/30%) aplica sobre el servicio técnico. Los repuestos tienen comisión fija del 15% en todos los planes.',
      },
      {
        q: '¿Puedo cambiar de plan?',
        a: 'Sí, en cualquier momento. El cambio se aplica al inicio del siguiente ciclo de facturación.',
      },
      {
        q: '¿Hay contrato de permanencia?',
        a: 'No. Los planes son mes a mes. Cancelás cuando querés sin penalidad.',
      },
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Transferencia bancaria (CBU/CVU) y tarjeta de crédito/débito. Para cadenas, también débito automático mensual.',
      },
      {
        q: '¿Hay descuento por pago anual?',
        a: 'Próximamente. Estamos implementando planes anuales con descuento. Podés anotarte en lista de espera desde la página de precios.',
      },
    ],
  },
  {
    key:   'general',
    label: 'General',
    icon:  HelpCircle,
    items: [
      {
        q: '¿Qué es SHUURI?',
        a: 'SHUURI es una plataforma de gestión técnica para la gastronomía. Conecta establecimientos gastronómicos con técnicos certificados y proveedores de repuestos en un solo flujo.',
      },
      {
        q: '¿En qué zonas operan?',
        a: 'Actualmente operamos en CABA y el Gran Buenos Aires. La expansión al interior del país está prevista para 2026.',
      },
      {
        q: '¿Cómo protegen mis datos?',
        a: 'Cumplimos con la Ley 25.326 de Protección de Datos Personales. Nunca vendemos datos a terceros. Podés consultar nuestra política de privacidad para más detalles.',
      },
      {
        q: '¿Hay una app móvil?',
        a: 'Próximamente. La plataforma actual es web-responsive. La app nativa iOS/Android está en desarrollo.',
      },
      {
        q: '¿Cómo puedo contactarlos?',
        a: 'Por WhatsApp al +54 9 11 5014-8932, por email a hola@shuuri.com.ar o desde el formulario de contacto en la web.',
      },
      {
        q: '¿Puedo integrar SHUURI con mi sistema de gestión?',
        a: 'Tenemos una API en desarrollo. Si usás Tango, Colppy, Odoo u otro sistema, contactanos para coordinar la integración.',
      },
    ],
  },
];

// ─── ACCORDION ITEM ───────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle, index }: {
  item:     FaqItem;
  isOpen:   boolean;
  onToggle: () => void;
  index:    number;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden bg-white transition-colors duration-200 ${isOpen ? 'border-[#2698D1]/30 shadow-sm' : 'border-gray-100'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/80 transition-colors"
      >
        <span className={`font-semibold text-sm pr-4 transition-colors duration-200 ${isOpen ? 'text-[#2698D1]' : 'text-[#0D0D0D]'}`}>
          {item.q}
        </span>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 shrink-0 ${isOpen ? 'bg-[#2698D1] rotate-180' : 'bg-gray-100'}`}>
          <ChevronDown className={`h-3.5 w-3.5 transition-colors duration-200 ${isOpen ? 'text-white' : 'text-gray-400'}`} />
        </div>
      </button>
      {/* Animated panel */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? '400px' : '0px' }}
      >
        <div className="px-6 pb-5 pt-0">
          <div className="w-8 h-0.5 bg-[#2698D1]/30 mb-3" />
          <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────

function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          index={i}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function FaqContent() {
  const [seccionActiva, setSeccionActiva] = useState('gastronomicos');
  const seccion = SECCIONES.find(s => s.key === seccionActiva)!;

  return (
    <>
      {/* HEADER */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2698D1] bg-blue-50 px-4 py-1.5 rounded-full mb-6">
            Centro de ayuda
          </span>
          <h1 className="font-black text-5xl sm:text-6xl text-[#0D0D0D] mb-5 leading-tight">
            Preguntas frecuentes
          </h1>
          <p className="text-xl text-gray-500">
            Todo lo que necesitás saber sobre SHUURI, ordenado por perfil.
          </p>
        </div>
      </section>

      {/* TABS + CONTENIDO */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {SECCIONES.map(s => {
              const Icon = s.icon;
              const isActive = s.key === seccionActiva;
              return (
                <button
                  key={s.key}
                  onClick={() => setSeccionActiva(s.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0D0D0D] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Acordeón */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = seccion.icon;
                return <Icon className="h-5 w-5 text-[#2698D1]" />;
              })()}
              <h2 className="font-black text-xl text-[#0D0D0D]">{seccion.label}</h2>
              <span className="text-xs text-gray-400 font-medium">{seccion.items.length} preguntas</span>
            </div>
            <Accordion items={seccion.items} />
          </div>

        </div>
      </section>

      {/* ¿NO ENCONTRASTE? */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-black text-2xl text-[#0D0D0D] mb-3">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Nuestro equipo responde en menos de 24 horas hábiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/5491150148932?text=${encodeURIComponent('Hola, tengo una consulta sobre SHUURI.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2698D1] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#1d7aab] transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <a
              href="mailto:hola@shuuri.com.ar"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-[#0D0D0D] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Enviar un email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
