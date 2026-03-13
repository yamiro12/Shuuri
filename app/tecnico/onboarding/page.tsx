'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import type { LegajoTecnico, Rubro } from '@/types/shuuri';
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
  'Identidad',
  'Forma de trabajo',
  'Operación',
  'Empresa',
  'Experiencia',
  'Seguridad',
  'Contacto',
  'Liquidaciones',
];

// ─── Estado inicial con valores por defecto ──────────────────────────────────

const INIT: Required<LegajoTecnico> = {
  nombreCompleto: '',
  dni: '',
  cuil: '',
  domicilio: '',
  telefono: '',
  email: '',
  tipoAlta: '',
  nombreORazonSocial: '',
  nombreComercial: '',
  condicionIVA: '',
  domicilioFiscal: '',
  zonaCobertura: [],
  disponibilidadHoraria: [],
  rubros: [],
  marcasCertificadas: '',
  tieneCertificacionesOficiales: '',
  detalleCertificaciones: '',
  serviciosPorDia: '',
  cantidadTecnicos: '',
  relacionLaboral: '',
  vehiculos: '',
  herramientas: '',
  anosExperiencia: '',
  clientesActuales: '',
  trabajaSubcontratista: '',
  paraQuien: '',
  seguroRC: '',
  matafuegoEPP: '',
  contactoNombre: '',
  contactoCargo: '',
  contactoTel: '',
  contactoEmail: '',
  contactoOTs: '',
  emailLiquidaciones: '',
  cbu: '',
  aliasCbu: '',
  bancoOBilletera: '',
  tipoFactura: '',
  plazoLiquidacion: '',
};

const ZONAS = [
  'CABA Norte', 'CABA Centro', 'CABA Sur', 'CABA Oeste',
  'GBA Norte', 'GBA Sur', 'GBA Oeste', 'GBA Este',
  'Resto AMBA',
];

const HORARIOS = [
  'Lunes a Viernes 8-17', 'Lunes a Viernes 9-18', 'Lunes a Viernes 10-19',
  'Sábados', 'Domingos', 'Guardias 24hs',
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function TecnicoOnboardingPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [data, setData] = useState<Required<LegajoTecnico>>(INIT);
  const [enviado, setEnviado] = useState(false);

  const set = (campo: keyof LegajoTecnico, valor: string) =>
    setData((d) => ({ ...d, [campo]: valor }));

  const setArr = (campo: keyof LegajoTecnico, valor: string[]) =>
    setData((d) => ({ ...d, [campo]: valor }));

  const siguiente = () => setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  const anterior = () => setPaso((p) => Math.max(p - 1, 0));

  const enviar = () => {
    console.log('Legajo técnico:', data);
    setEnviado(true);
    setTimeout(() => router.push('/tecnico'), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Alta de Técnico</h1>
          <p className="text-gray-500 mt-1">Completá tu legajo para activar tu cuenta en SHUURI.</p>
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

          {/* Paso 0 — Identidad */}
          {paso === 0 && (
            <div className="space-y-4">
              <Campo label="Nombre completo" value={data.nombreCompleto} onChange={(v) => set('nombreCompleto', v)} placeholder="Juan Pérez" required />
              <Campo label="DNI" value={data.dni} onChange={(v) => set('dni', v)} placeholder="12.345.678" />
              <Campo label="CUIL" value={data.cuil} onChange={(v) => set('cuil', v)} placeholder="20-12345678-9" />
              <Campo label="Domicilio particular" value={data.domicilio} onChange={(v) => set('domicilio', v)} placeholder="Av. Corrientes 1234, CABA" />
              <Campo label="Teléfono celular" value={data.telefono} onChange={(v) => set('telefono', v)} placeholder="+54 9 11 1234-5678" type="tel" />
              <Campo label="Email" value={data.email} onChange={(v) => set('email', v)} placeholder="juan@ejemplo.com" type="email" required />
            </div>
          )}

          {/* Paso 1 — Forma de trabajo */}
          {paso === 1 && (
            <div className="space-y-4">
              <Sel
                label="Tipo de alta"
                value={data.tipoAlta}
                onChange={(v) => set('tipoAlta', v)}
                options={[
                  { value: 'monotributo', label: 'Monotributista' },
                  { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
                  { value: 'empresa', label: 'Empresa / SRL / SA' },
                ]}
                required
              />
              <Campo label="Nombre o Razón Social" value={data.nombreORazonSocial} onChange={(v) => set('nombreORazonSocial', v)} placeholder="Pérez Servicios SRL" required />
              <Campo label="Nombre comercial" value={data.nombreComercial} onChange={(v) => set('nombreComercial', v)} placeholder="Pérez Refrigeración" />
              <Sel
                label="Condición IVA"
                value={data.condicionIVA}
                onChange={(v) => set('condicionIVA', v)}
                options={[
                  { value: 'monotributo', label: 'Monotributista' },
                  { value: 'ri', label: 'Responsable Inscripto' },
                  { value: 'exento', label: 'Exento' },
                ]}
              />
              <Campo label="Domicilio fiscal" value={data.domicilioFiscal} onChange={(v) => set('domicilioFiscal', v)} placeholder="Calle 123, Ciudad" />
            </div>
          )}

          {/* Paso 2 — Operación */}
          {paso === 2 && (
            <div className="space-y-5">
              <ChipsMulti
                label="Rubros en los que trabajás *"
                options={TODOS_LOS_RUBROS.map((r) => ({ value: r, label: RUBRO_LABELS[r] }))}
                selected={data.rubros as string[]}
                onChange={(v) => setArr('rubros', v)}
              />
              <ChipsMulti
                label="Zonas de cobertura *"
                options={ZONAS.map((z) => ({ value: z, label: z }))}
                selected={data.zonaCobertura}
                onChange={(v) => setArr('zonaCobertura', v)}
              />
              <ChipsMulti
                label="Disponibilidad horaria"
                options={HORARIOS.map((h) => ({ value: h, label: h }))}
                selected={data.disponibilidadHoraria}
                onChange={(v) => setArr('disponibilidadHoraria', v)}
              />
              <Campo label="Marcas certificadas" value={data.marcasCertificadas} onChange={(v) => set('marcasCertificadas', v)} placeholder="Frider, Moretti, Irinox..." />
              <Sel
                label="¿Tenés certificaciones oficiales?"
                value={data.tieneCertificacionesOficiales}
                onChange={(v) => set('tieneCertificacionesOficiales', v)}
                options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]}
              />
              {data.tieneCertificacionesOficiales === 'si' && (
                <Campo label="Detalle de certificaciones" value={data.detalleCertificaciones} onChange={(v) => set('detalleCertificaciones', v)} placeholder="ENARGAS N° 1234, OPDS N° 5678..." />
              )}
              <Campo label="Servicios por día (capacidad)" value={data.serviciosPorDia} onChange={(v) => set('serviciosPorDia', v)} placeholder="3-4 servicios" />
            </div>
          )}

          {/* Paso 3 — Empresa */}
          {paso === 3 && (
            <div className="space-y-4">
              <Campo label="Cantidad de técnicos en el equipo" value={data.cantidadTecnicos} onChange={(v) => set('cantidadTecnicos', v)} placeholder="1, 2-5, 6-10..." />
              <Sel
                label="Relación laboral con técnicos"
                value={data.relacionLaboral}
                onChange={(v) => set('relacionLaboral', v)}
                options={[
                  { value: 'solo', label: 'Trabajo solo' },
                  { value: 'relacion_dependencia', label: 'En relación de dependencia' },
                  { value: 'contratados', label: 'Contratados / freelance' },
                  { value: 'mixto', label: 'Mixto' },
                ]}
              />
              <Campo label="Vehículos de trabajo" value={data.vehiculos} onChange={(v) => set('vehiculos', v)} placeholder="Auto propio, camioneta, moto..." />
              <Campo label="Herramientas / equipamiento destacado" value={data.herramientas} onChange={(v) => set('herramientas', v)} placeholder="Vacuómetro, multímetro, equipo de gas..." />
            </div>
          )}

          {/* Paso 4 — Experiencia */}
          {paso === 4 && (
            <div className="space-y-4">
              <Sel
                label="Años de experiencia"
                value={data.anosExperiencia}
                onChange={(v) => set('anosExperiencia', v)}
                options={[
                  { value: '1-2', label: '1-2 años' },
                  { value: '3-5', label: '3-5 años' },
                  { value: '6-10', label: '6-10 años' },
                  { value: '10+', label: 'Más de 10 años' },
                ]}
              />
              <Campo label="Clientes actuales (tipo / cantidad)" value={data.clientesActuales} onChange={(v) => set('clientesActuales', v)} placeholder="Restaurantes, hoteles, supermercados..." />
              <Sel
                label="¿Trabajás como subcontratista?"
                value={data.trabajaSubcontratista}
                onChange={(v) => set('trabajaSubcontratista', v)}
                options={[
                  { value: 'si', label: 'Sí' },
                  { value: 'no', label: 'No' },
                  { value: 'a_veces', label: 'A veces' },
                ]}
              />
              {data.trabajaSubcontratista !== 'no' && data.trabajaSubcontratista !== '' && (
                <Campo label="¿Para quién trabajás como subcontratista?" value={data.paraQuien} onChange={(v) => set('paraQuien', v)} placeholder="Empresa X, distribuidor Y..." />
              )}
            </div>
          )}

          {/* Paso 5 — Seguridad */}
          {paso === 5 && (
            <div className="space-y-4">
              <Sel
                label="¿Contás con seguro de responsabilidad civil?"
                value={data.seguroRC}
                onChange={(v) => set('seguroRC', v)}
                options={[
                  { value: 'si_vigente', label: 'Sí, vigente' },
                  { value: 'si_vencido', label: 'Sí, pero vencido' },
                  { value: 'no', label: 'No' },
                  { value: 'en_tramite', label: 'En trámite' },
                ]}
                required
              />
              <Sel
                label="¿Disponés de matafuego y EPP?"
                value={data.matafuegoEPP}
                onChange={(v) => set('matafuegoEPP', v)}
                options={[
                  { value: 'si_completo', label: 'Sí, completo' },
                  { value: 'si_parcial', label: 'Sí, parcialmente' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                <strong>Importante:</strong> Para ser asignado a servicios de gas, refrigeración o eléctrico, SHUURI verifica certificaciones oficiales vigentes. Sin ellas, el sistema bloquea automáticamente la asignación.
              </div>
            </div>
          )}

          {/* Paso 6 — Contacto */}
          {paso === 6 && (
            <div className="space-y-4">
              <Campo label="Nombre del contacto para OTs" value={data.contactoNombre} onChange={(v) => set('contactoNombre', v)} placeholder="Juan Pérez" required />
              <Campo label="Cargo" value={data.contactoCargo} onChange={(v) => set('contactoCargo', v)} placeholder="Técnico titular, Coordinador..." />
              <Campo label="Teléfono de contacto" value={data.contactoTel} onChange={(v) => set('contactoTel', v)} placeholder="+54 9 11 1234-5678" type="tel" />
              <Campo label="Email de contacto" value={data.contactoEmail} onChange={(v) => set('contactoEmail', v)} placeholder="operaciones@empresa.com" type="email" />
              <Sel
                label="¿Quién recibe las nuevas OTs?"
                value={data.contactoOTs}
                onChange={(v) => set('contactoOTs', v)}
                options={[
                  { value: 'mismo', label: 'Yo mismo (este contacto)' },
                  { value: 'otro', label: 'Otro integrante del equipo' },
                  { value: 'whatsapp', label: 'Por WhatsApp' },
                  { value: 'email', label: 'Solo por email' },
                ]}
              />
            </div>
          )}

          {/* Paso 7 — Liquidaciones */}
          {paso === 7 && (
            <div className="space-y-4">
              <Campo label="Email para liquidaciones" value={data.emailLiquidaciones} onChange={(v) => set('emailLiquidaciones', v)} placeholder="pagos@empresa.com" type="email" required />
              <Campo label="CBU" value={data.cbu} onChange={(v) => set('cbu', v)} placeholder="0000000000000000000000" />
              <Campo label="Alias CBU" value={data.aliasCbu} onChange={(v) => set('aliasCbu', v)} placeholder="EMPRESA.PAGOS" />
              <Campo label="Banco o billetera" value={data.bancoOBilletera} onChange={(v) => set('bancoOBilletera', v)} placeholder="Banco Galicia, Mercado Pago..." />
              <Sel
                label="Tipo de factura"
                value={data.tipoFactura}
                onChange={(v) => set('tipoFactura', v)}
                options={[
                  { value: 'c', label: 'Factura C (Monotributo)' },
                  { value: 'b', label: 'Factura B (RI a consumidor final)' },
                  { value: 'a', label: 'Factura A (RI a RI)' },
                ]}
              />
              <Sel
                label="Plazo de liquidación preferido"
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

        {/* Progreso */}
        <div className="mt-4 text-center text-xs text-gray-400">
          Paso {paso + 1} de {PASOS.length}
        </div>
      </div>
    </div>
  );
}