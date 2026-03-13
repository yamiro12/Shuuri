'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import type { LegajoRestaurante } from '@/types/shuuri';

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Sel({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">-- Seleccioná --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Pasos ───────────────────────────────────────────────────────────────────

const PASOS = [
  'Datos fiscales',
  'Acceso al local',
  'Horarios',
  'Contactos',
  'Historial técnico',
  'Facturación',
];

// ─── Estado inicial ───────────────────────────────────────────────────────────

const INIT: Required<LegajoRestaurante> = {
  nombreComercial: '',
  razonSocial: '',
  cuit: '',
  condicionIVA: '',
  domicilioFiscal: '',
  tipoEstablecimiento: '',
  direccionLocal: '',
  horarioLV: '',
  horarioSabado: '',
  horarioDomingo: '',
  diasCierra: '',
  estacionamiento: '',
  sinAviso: '',
  horarioPreferido: '',
  horarioProhibido: '',
  notasAcceso: '',
  nombreContacto: '',
  cargoContacto: '',
  contactoPrincipalNombre: '',
  contactoPrincipalCargo: '',
  contactoPrincipalTel: '',
  contactoPrincipalEmail: '',
  contactoOperativoNombre: '',
  contactoOperativoCargo: '',
  contactoOperativoTel: '',
  tecnicoFijo: '',
  proveedorRepuestos: '',
  contratosMantenimiento: '',
  serviciosPorMes: '',
  frustracionMantenimiento: '',
  emailFacturas: '',
  metodoPago: '',
  cbu: '',
  aliasCbu: '',
  bancoOBilletera: '',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function RestauranteOnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [data, setData] = useState<Required<LegajoRestaurante>>(INIT);
  const [enviado, setEnviado] = useState(false);

  const set = (campo: keyof LegajoRestaurante, valor: string) =>
    setData((d) => ({ ...d, [campo]: valor }));

  const siguiente = () => setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  const anterior = () => setPaso((p) => Math.max(p - 1, 0));

  const enviar = () => {
    console.log('Legajo restaurante:', data);
    setEnviado(true);
    setTimeout(() => router.push('/restaurante'), 2000);
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">¡Legajo completado!</h2>
          <p className="text-gray-500">Redirigiendo al panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Alta de Establecimiento</h1>
          <p className="text-gray-500 mt-1">Completá el legajo de tu local para activar el servicio SHUURI.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {PASOS.map((p, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  i < paso
                    ? 'bg-green-500 border-green-500 text-white'
                    : i === paso
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {i < paso ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  i === paso ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}
              >
                {p}
              </span>
              {i < PASOS.length - 1 && (
                <div className={`w-4 h-0.5 ${i < paso ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Formulario por paso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
            {PASOS[paso]}
          </h2>

          {/* Paso 0 — Datos fiscales */}
          {paso === 0 && (
            <div className="space-y-4">
              <Campo label="Nombre comercial" value={data.nombreComercial} onChange={(v) => set('nombreComercial', v)} placeholder="La Parrilla de Juan" required />
              <Campo label="Razón social" value={data.razonSocial} onChange={(v) => set('razonSocial', v)} placeholder="García SA" />
              <Campo label="CUIT" value={data.cuit} onChange={(v) => set('cuit', v)} placeholder="30-12345678-9" required />
              <Sel
                label="Condición IVA"
                value={data.condicionIVA}
                onChange={(v) => set('condicionIVA', v)}
                options={[
                  { value: 'ri', label: 'Responsable Inscripto' },
                  { value: 'monotributo', label: 'Monotributista' },
                  { value: 'exento', label: 'Exento' },
                ]}
              />
              <Campo label="Domicilio fiscal" value={data.domicilioFiscal} onChange={(v) => set('domicilioFiscal', v)} placeholder="Av. Corrientes 1234, CABA" />
              <Sel
                label="Tipo de establecimiento"
                value={data.tipoEstablecimiento}
                onChange={(v) => set('tipoEstablecimiento', v)}
                options={[
                  { value: 'restaurante', label: 'Restaurante' },
                  { value: 'bar_cafe', label: 'Bar / Café' },
                  { value: 'panaderia', label: 'Panadería / Pastelería' },
                  { value: 'catering', label: 'Catering' },
                  { value: 'hotel', label: 'Hotel / Hospedaje' },
                  { value: 'club', label: 'Club / Complejo' },
                  { value: 'otro', label: 'Otro' },
                ]}
              />
            </div>
          )}

          {/* Paso 1 — Acceso al local */}
          {paso === 1 && (
            <div className="space-y-4">
              <Campo label="Dirección del local" value={data.direccionLocal} onChange={(v) => set('direccionLocal', v)} placeholder="Av. Corrientes 1234, CABA" required />
              <Sel
                label="¿Se puede ingresar sin aviso previo?"
                value={data.sinAviso}
                onChange={(v) => set('sinAviso', v)}
                options={[
                  { value: 'si', label: 'Sí, durante horario comercial' },
                  { value: 'no', label: 'No, siempre requiere aviso' },
                  { value: 'a_veces', label: 'Depende del horario' },
                ]}
              />
              <Sel
                label="¿Hay estacionamiento disponible?"
                value={data.estacionamiento}
                onChange={(v) => set('estacionamiento', v)}
                options={[
                  { value: 'calle_libre', label: 'Calle libre' },
                  { value: 'calle_limitada', label: 'Calle con restricciones' },
                  { value: 'playa_cerca', label: 'Playa de estacionamiento cercana' },
                  { value: 'propio', label: 'Estacionamiento propio' },
                  { value: 'difícil', label: 'Zona difícil, se recomienda moto' },
                ]}
              />
              <Campo
                label="Notas de acceso"
                value={data.notasAcceso}
                onChange={(v) => set('notasAcceso', v)}
                placeholder="Entrar por portón lateral, timbre en recepción, cámara en el techo..."
              />
            </div>
          )}

          {/* Paso 2 — Horarios */}
          {paso === 2 && (
            <div className="space-y-4">
              <Campo label="Horario L a V" value={data.horarioLV} onChange={(v) => set('horarioLV', v)} placeholder="8:00 a 23:00" />
              <Campo label="Horario Sábado" value={data.horarioSabado} onChange={(v) => set('horarioSabado', v)} placeholder="9:00 a 22:00" />
              <Campo label="Horario Domingo" value={data.horarioDomingo} onChange={(v) => set('horarioDomingo', v)} placeholder="Cerrado / 12:00 a 20:00" />
              <Campo label="Días que cierra" value={data.diasCierra} onChange={(v) => set('diasCierra', v)} placeholder="Lunes. Enero (vacaciones)." />
              <Campo label="Horario preferido para visitas técnicas" value={data.horarioPreferido} onChange={(v) => set('horarioPreferido', v)} placeholder="Lunes a Miércoles antes de las 11hs" />
              <Campo label="Horario prohibido para visitas" value={data.horarioProhibido} onChange={(v) => set('horarioProhibido', v)} placeholder="Viernes y sábados después de las 19hs" />
            </div>
          )}

          {/* Paso 3 — Contactos */}
          {paso === 3 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Contacto principal (decisiones)</p>
                <Campo label="Nombre" value={data.contactoPrincipalNombre} onChange={(v) => set('contactoPrincipalNombre', v)} placeholder="Nombre del dueño o gerente" required />
                <Campo label="Cargo" value={data.contactoPrincipalCargo} onChange={(v) => set('contactoPrincipalCargo', v)} placeholder="Dueño, Gerente general..." />
                <Campo label="Teléfono" value={data.contactoPrincipalTel} onChange={(v) => set('contactoPrincipalTel', v)} placeholder="+54 9 11 1234-5678" type="tel" />
                <Campo label="Email" value={data.contactoPrincipalEmail} onChange={(v) => set('contactoPrincipalEmail', v)} placeholder="juan@restaurante.com" type="email" />
              </div>
              <hr />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Contacto operativo (coordina visitas)</p>
                <Campo label="Nombre" value={data.contactoOperativoNombre} onChange={(v) => set('contactoOperativoNombre', v)} placeholder="Encargado o jefe de cocina" />
                <Campo label="Cargo" value={data.contactoOperativoCargo} onChange={(v) => set('contactoOperativoCargo', v)} placeholder="Encargado, Jefe de cocina..." />
                <Campo label="Teléfono" value={data.contactoOperativoTel} onChange={(v) => set('contactoOperativoTel', v)} placeholder="+54 9 11 8765-4321" type="tel" />
              </div>
            </div>
          )}

          {/* Paso 4 — Historial técnico */}
          {paso === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Esta información nos ayuda a asignar el técnico más adecuado.</p>
              <Campo label="¿Tienen técnico de cabecera?" value={data.tecnicoFijo} onChange={(v) => set('tecnicoFijo', v)} placeholder="Juan Pérez, Refrigeración Centro..." />
              <Campo label="¿Tienen proveedor de repuestos habitual?" value={data.proveedorRepuestos} onChange={(v) => set('proveedorRepuestos', v)} placeholder="Frider, IG Ingeniería..." />
              <Sel
                label="¿Tienen contratos de mantenimiento vigentes?"
                value={data.contratosMantenimiento}
                onChange={(v) => set('contratosMantenimiento', v)}
                options={[
                  { value: 'si_multiples', label: 'Sí, varios contratos' },
                  { value: 'si_uno', label: 'Sí, uno' },
                  { value: 'no', label: 'No' },
                  { value: 'vencido', label: 'Teníamos, está vencido' },
                ]}
              />
              <Sel
                label="Cantidad aproximada de servicios por mes"
                value={data.serviciosPorMes}
                onChange={(v) => set('serviciosPorMes', v)}
                options={[
                  { value: '1-2', label: '1-2 servicios' },
                  { value: '3-5', label: '3-5 servicios' },
                  { value: '6-10', label: '6-10 servicios' },
                  { value: '10+', label: 'Más de 10 servicios' },
                ]}
              />
              <Campo
                label="¿Qué te frustra del servicio técnico actual?"
                value={data.frustracionMantenimiento}
                onChange={(v) => set('frustracionMantenimiento', v)}
                placeholder="Demoran mucho, los técnicos no saben del equipo, los repuestos tardan..."
              />
            </div>
          )}

          {/* Paso 5 — Facturación */}
          {paso === 5 && (
            <div className="space-y-4">
              <Campo label="Email para recibir facturas" value={data.emailFacturas} onChange={(v) => set('emailFacturas', v)} placeholder="administracion@restaurante.com" type="email" required />
              <Sel
                label="Método de pago preferido"
                value={data.metodoPago}
                onChange={(v) => set('metodoPago', v)}
                options={[
                  { value: 'transferencia', label: 'Transferencia bancaria' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'mp', label: 'Mercado Pago' },
                ]}
              />
              <Campo label="CBU (opcional)" value={data.cbu} onChange={(v) => set('cbu', v)} placeholder="Para acreditación de notas de crédito" />
              <Campo label="Alias CBU" value={data.aliasCbu} onChange={(v) => set('aliasCbu', v)} placeholder="RESTAURANTE.PAGOS" />
              <Campo label="Banco o billetera" value={data.bancoOBilletera} onChange={(v) => set('bancoOBilletera', v)} placeholder="Banco Santander, Mercado Pago..." />
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={anterior}
            disabled={paso === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {paso < PASOS.length - 1 ? (
            <button
              onClick={siguiente}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={enviar}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" /> Enviar legajo
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Paso {paso + 1} de {PASOS.length}
        </div>
      </div>
    </div>
  );
}
