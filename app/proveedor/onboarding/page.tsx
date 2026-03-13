'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import type { LegajoProveedor } from '@/types/shuuri';
import { TODOS_LOS_RUBROS, RUBRO_LABELS } from '@/types/shuuri';

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

function ChipsMulti({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      onChange([...selected, val]);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selected.includes(o.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Pasos ───────────────────────────────────────────────────────────────────

const PASOS = [
  'Datos fiscales',
  'Catálogo',
  'Logística',
  'Contacto comercial',
  'Contacto logística',
  'Liquidaciones',
];

// ─── Estado inicial con valores por defecto ──────────────────────────────────

const INIT: Required<LegajoProveedor> = {
  nombreComercial: '',
  razonSocial: '',
  cuit: '',
  condicionIVA: '',
  domicilioFiscal: '',
  sitioWeb: '',
  tipoProveedor: '',
  rubros: [],
  marcas: '',
  tipoProductos: [],
  cantidadSKUs: '',
  catalogoDigital: '',
  frecuenciaPrecios: '',
  zonaCobertura: [],
  tiempoEntrega: '',
  logisticaPropia: '',
  tieneDeposito: '',
  direccionDeposito: '',
  horarioDespacho: '',
  comercialNombre: '',
  comercialCargo: '',
  comercialTel: '',
  comercialEmail: '',
  logisticaNombre: '',
  logisticaTel: '',
  logisticaEmail: '',
  emailLiquidaciones: '',
  cbu: '',
  aliasCbu: '',
  bancoOBilletera: '',
  plazoLiquidacion: '',
  tipoFactura: '',
  rubrosEspecializacion: '',
  marcasRepresentadas: ''
};

const ZONAS = [
  'CABA Norte', 'CABA Centro', 'CABA Sur', 'CABA Oeste',
  'GBA Norte', 'GBA Sur', 'GBA Oeste', 'GBA Este',
  'Interior Buenos Aires', 'Todo el país',
];

const TIPOS_PRODUCTO = [
  'Repuestos originales', 'Repuestos compatibles', 'Consumibles',
  'Equipos nuevos', 'Equipos reacondicionados', 'Herramientas', 'Insumos',
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProveedorOnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [data, setData] = useState<Required<LegajoProveedor>>(INIT);
  const [enviado, setEnviado] = useState(false);

  const set = (campo: keyof LegajoProveedor, valor: string) =>
    setData((d) => ({ ...d, [campo]: valor }));

  const setArr = (campo: keyof LegajoProveedor, valor: string[]) =>
    setData((d) => ({ ...d, [campo]: valor }));

  const siguiente = () => setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  const anterior = () => setPaso((p) => Math.max(p - 1, 0));

  const enviar = () => {
    console.log('Legajo proveedor:', data);
    setEnviado(true);
    setTimeout(() => router.push('/proveedor'), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Alta de Proveedor</h1>
          <p className="text-gray-500 mt-1">Completá tu legajo para operar en la red SHUURI.</p>
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
              <Campo label="Nombre comercial" value={data.nombreComercial} onChange={(v) => set('nombreComercial', v)} placeholder="Frider Repuestos" required />
              <Campo label="Razón social" value={data.razonSocial} onChange={(v) => set('razonSocial', v)} placeholder="Frider SA" />
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
                required
              />
              <Campo label="Domicilio fiscal" value={data.domicilioFiscal} onChange={(v) => set('domicilioFiscal', v)} placeholder="Av. Industria 4321, CABA" />
              <Campo label="Sitio web" value={data.sitioWeb} onChange={(v) => set('sitioWeb', v)} placeholder="https://www.empresa.com" />
              <Sel
                label="Tipo de proveedor"
                value={data.tipoProveedor}
                onChange={(v) => set('tipoProveedor', v)}
                options={[
                  { value: 'fabricante', label: 'Fabricante' },
                  { value: 'distribuidor', label: 'Distribuidor' },
                  { value: 'importador', label: 'Importador' },
                  { value: 'mayorista', label: 'Mayorista' },
                  { value: 'minorista', label: 'Minorista' },
                ]}
              />
            </div>
          )}

          {/* Paso 1 — Catálogo */}
          {paso === 1 && (
            <div className="space-y-5">
              <ChipsMulti
                label="Rubros que cubrís *"
                options={TODOS_LOS_RUBROS.map((r) => ({ value: r, label: RUBRO_LABELS[r] }))}
                selected={(data.rubros ?? []) as string[]}
                onChange={(v) => setArr('rubros', v)}
              />
              <ChipsMulti
                label="Tipo de productos"
                options={TIPOS_PRODUCTO.map((t) => ({ value: t, label: t }))}
                selected={data.tipoProductos ?? []}
                onChange={(v) => setArr('tipoProductos', v)}
              />
              <Campo label="Marcas que representás" value={data.marcas} onChange={(v) => set('marcas', v)} placeholder="Frider, Moretti, Irinox, Fagor..." />
              <Campo label="Cantidad aproximada de SKUs" value={data.cantidadSKUs} onChange={(v) => set('cantidadSKUs', v)} placeholder="500, 1000-2000..." />
              <Sel
                label="¿Tenés catálogo digital?"
                value={data.catalogoDigital}
                onChange={(v) => set('catalogoDigital', v)}
                options={[
                  { value: 'si_online', label: 'Sí, online (URL)' },
                  { value: 'si_pdf', label: 'Sí, PDF' },
                  { value: 'no', label: 'No' },
                  { value: 'en_desarrollo', label: 'En desarrollo' },
                ]}
              />
              <Sel
                label="Frecuencia de actualización de precios"
                value={data.frecuenciaPrecios}
                onChange={(v) => set('frecuenciaPrecios', v)}
                options={[
                  { value: 'diaria', label: 'Diaria' },
                  { value: 'semanal', label: 'Semanal' },
                  { value: 'quincenal', label: 'Quincenal' },
                  { value: 'mensual', label: 'Mensual' },
                  { value: 'variable', label: 'Variable (según tipo de cambio)' },
                ]}
              />
            </div>
          )}

          {/* Paso 2 — Logística */}
          {paso === 2 && (
            <div className="space-y-5">
              <ChipsMulti
                label="Zonas de cobertura / despacho *"
                options={ZONAS.map((z) => ({ value: z, label: z }))}
                selected={data.zonaCobertura ?? []}
                onChange={(v) => setArr('zonaCobertura', v)}
              />
              <Sel
                label="Tiempo de entrega promedio"
                value={data.tiempoEntrega}
                onChange={(v) => set('tiempoEntrega', v)}
                options={[
                  { value: 'same_day', label: 'Mismo día (stock CABA/GBA)' },
                  { value: '24hs', label: '24 horas hábiles' },
                  { value: '48hs', label: '48 horas hábiles' },
                  { value: '72hs', label: '72 horas hábiles' },
                  { value: '5-7d', label: '5-7 días hábiles' },
                  { value: 'importacion', label: 'Importación (15+ días)' },
                ]}
                required
              />
              <Sel
                label="¿Tienen logística propia?"
                value={data.logisticaPropia}
                onChange={(v) => set('logisticaPropia', v)}
                options={[
                  { value: 'si_flota', label: 'Sí, flota propia' },
                  { value: 'si_moto', label: 'Sí, mensajería propia' },
                  { value: 'no_correo', label: 'No, correo/courier' },
                  { value: 'mixto', label: 'Mixto (propia + terceros)' },
                ]}
              />
              <Sel
                label="¿Tienen depósito propio?"
                value={data.tieneDeposito}
                onChange={(v) => set('tieneDeposito', v)}
                options={[
                  { value: 'si', label: 'Sí' },
                  { value: 'no', label: 'No (cross-docking)' },
                  { value: 'tercerizado', label: 'Tercerizado' },
                ]}
              />
              {data.tieneDeposito === 'si' && (
                <Campo label="Dirección del depósito" value={data.direccionDeposito} onChange={(v) => set('direccionDeposito', v)} placeholder="Av. Logística 789, Zona Oeste" />
              )}
              <Campo label="Horario de despacho" value={data.horarioDespacho} onChange={(v) => set('horarioDespacho', v)} placeholder="L a V 8-17hs, Sáb 8-13hs" />
            </div>
          )}

          {/* Paso 3 — Contacto comercial */}
          {paso === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Contacto para cotizaciones, órdenes de compra y precios.</p>
              <Campo label="Nombre" value={data.comercialNombre} onChange={(v) => set('comercialNombre', v)} placeholder="María García" required />
              <Campo label="Cargo" value={data.comercialCargo} onChange={(v) => set('comercialCargo', v)} placeholder="Gerente Comercial, Ejecutivo de cuentas..." />
              <Campo label="Teléfono" value={data.comercialTel} onChange={(v) => set('comercialTel', v)} placeholder="+54 9 11 1234-5678" type="tel" />
              <Campo label="Email" value={data.comercialEmail} onChange={(v) => set('comercialEmail', v)} placeholder="ventas@empresa.com" type="email" required />
            </div>
          )}

          {/* Paso 4 — Contacto logística */}
          {paso === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Contacto para seguimiento de entregas y despachos.</p>
              <Campo label="Nombre" value={data.logisticaNombre} onChange={(v) => set('logisticaNombre', v)} placeholder="Carlos López" />
              <Campo label="Teléfono" value={data.logisticaTel} onChange={(v) => set('logisticaTel', v)} placeholder="+54 9 11 8765-4321" type="tel" />
              <Campo label="Email" value={data.logisticaEmail} onChange={(v) => set('logisticaEmail', v)} placeholder="logistica@empresa.com" type="email" />
            </div>
          )}

          {/* Paso 5 — Liquidaciones */}
          {paso === 5 && (
            <div className="space-y-4">
              <Campo label="Email para liquidaciones" value={data.emailLiquidaciones} onChange={(v) => set('emailLiquidaciones', v)} placeholder="administracion@empresa.com" type="email" required />
              <Campo label="CBU" value={data.cbu} onChange={(v) => set('cbu', v)} placeholder="0000000000000000000000" />
              <Campo label="Alias CBU" value={data.aliasCbu} onChange={(v) => set('aliasCbu', v)} placeholder="EMPRESA.COBROS" />
              <Campo label="Banco o billetera" value={data.bancoOBilletera} onChange={(v) => set('bancoOBilletera', v)} placeholder="Banco Galicia, BBVA..." />
              <Sel
                label="Tipo de factura"
                value={data.tipoFactura}
                onChange={(v) => set('tipoFactura', v)}
                options={[
                  { value: 'a', label: 'Factura A (RI a RI)' },
                  { value: 'b', label: 'Factura B (RI a consumidor final)' },
                  { value: 'c', label: 'Factura C (Monotributo)' },
                ]}
                required
              />
              <Sel
                label="Plazo de liquidación"
                value={data.plazoLiquidacion}
                onChange={(v) => set('plazoLiquidacion', v)}
                options={[
                  { value: '7d', label: '7 días hábiles' },
                  { value: '10d', label: '10 días hábiles' },
                  { value: '15d', label: '15 días hábiles' },
                  { value: '30d', label: '30 días hábiles' },
                ]}
              />
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