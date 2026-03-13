"use client";

import React, { useState, useCallback } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Upload,
  X,
  User,
  Phone,
  Wrench,
  CreditCard,
  FileText,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  Building2,
} from "lucide-react";
import {
  VALIDACIONES,
  LABELS_ZONA_COBERTURA,
} from "@/types/shuuri";
import type { CondicionIVA, ZonaCobertura } from "@/types/shuuri";
import { TAXONOMIA_SHUURI } from "@/data/mock";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

// Especialidades derivadas de TAXONOMIA_SHUURI (usamos el label de cada rubro)
const ESPECIALIDADES = TAXONOMIA_SHUURI.map(r => r.label);

const CATEGORIAS_MONOTRIBUTO = ["A","B","C","D","E","F","G","H","I","J","K"];

const CONDICION_IVA_OPTIONS: { value: CondicionIVA; label: string }[] = [
  { value: "responsable_inscripto", label: "Responsable Inscripto" },
  { value: "monotributista", label: "Monotributista" },
  { value: "exento", label: "Exento" },
];

const TOTAL_STEPS = 7;

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Certificacion = {
  id: string;
  tipo: string;
  entidadEmisora: string;
  numero: string;
  vencimiento: string;
  fotoDoc: File | null;
};

type Disponibilidad = {
  lunesAViernes: boolean;
  sabados: boolean;
  domingos: boolean;
  feriados: boolean;
  guardiaNocturna: boolean;
};

type DocsTecnico = {
  fotoDNIFrente: File | null;
  fotoDNIDorso: File | null;
  fotoPerfil: File | null;
  constanciaAfip: File | null;
  certificadosHabilitacion: File[];
  antecedentesLaborales: File | null;
};

type FormData = {
  // Paso 1
  nombre: string;
  apellido: string;
  dni: string;
  cuit: string;
  fechaNacimiento: string;
  nacionalidad: string;
  estadoCivil: string;
  // Paso 2
  email: string;
  telefono: string;
  whatsapp: string;
  direccion: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  // Paso 3
  especialidades: string[];
  experienciaAnios: string;
  descripcionProfesional: string;
  // Paso 4
  zonasCobertura: ZonaCobertura[];
  radioKmMaximo: string;
  disponibilidad: Disponibilidad;
  // Paso 5
  condicionFiscal: CondicionIVA | "";
  modalidadContratacion: "autonomo" | "relacion_dependencia" | "eventual" | "";
  categoriaMonotributo: string;
  fechaInicioMonotributo: string;
  // Paso 6
  banco: string;
  tipoCuenta: "caja_ahorro" | "cuenta_corriente" | "";
  cbu: string;
  alias: string;
  titularCuenta: string;
  cuitTitular: string;
};

type Errors = Partial<Record<string, string>>;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function validateCuit(v: string) {
  return VALIDACIONES.cuit.regex.test(v) ? "" : VALIDACIONES.cuit.mensaje;
}
function validateEmail(v: string) {
  return VALIDACIONES.email.regex.test(v) ? "" : VALIDACIONES.email.mensaje;
}
function validateTelefono(v: string) {
  return VALIDACIONES.telefono.regex.test(v) ? "" : VALIDACIONES.telefono.mensaje;
}
function validateCbu(v: string) {
  return VALIDACIONES.cbuCvu.regex.test(v) ? "" : VALIDACIONES.cbuCvu.mensaje;
}
function validateDNI(v: string) {
  return /^\d{7,8}$/.test(v) ? "" : "7 u 8 dígitos numéricos";
}
function validateCP(v: string) {
  return /^\d{4}$/.test(v) ? "" : "Código postal: 4 dígitos";
}

// ─── COMPONENTES COMPARTIDOS ──────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
      <AlertCircle size={12} className="shrink-0" />
      {msg}
    </p>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function InputField({
  label, value, onChange, error, placeholder, required, type = "text", maxLength,
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; required?: boolean;
  type?: string; maxLength?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({
  label, value, onChange, error, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}
      >
        <option value="">Seleccioná una opción</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

function FileSlot({
  label, required, file, onSet, onClear, error,
}: {
  label: string; required?: boolean; file: File | null;
  onSet: (f: File) => void; onClear: () => void; error?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label required={required}>{label}</Label>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-green-700 truncate">
            <Check size={14} />
            <span className="truncate">{file.name}</span>
            <span className="text-xs text-green-500 shrink-0">({Math.round(file.size / 1024)} KB)</span>
          </div>
          <button type="button" onClick={onClear} className="text-green-500 hover:text-red-500 ml-2 shrink-0">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button" onClick={() => ref.current?.click()}
          className={`w-full flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-sm transition hover:bg-gray-50 ${
            error ? "border-red-300 text-red-400" : "border-gray-300 text-gray-400"
          }`}
        >
          <Upload size={15} /> Subir archivo (.pdf, .jpg, .png)
        </button>
      )}
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onSet(f); e.target.value = ""; }} />
      <FieldError msg={error} />
    </div>
  );
}

// ─── PASO 1: DATOS PERSONALES ─────────────────────────────────────────────────

function Paso1({ data, onChange, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Nombre" value={data.nombre} onChange={(v) => onChange("nombre", v)}
          error={errors.nombre} placeholder="Juan" required />
        <InputField label="Apellido" value={data.apellido} onChange={(v) => onChange("apellido", v)}
          error={errors.apellido} placeholder="García" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="DNI" value={data.dni} onChange={(v) => onChange("dni", v.replace(/\D/g, "").slice(0,8))}
          error={errors.dni} placeholder="12345678" required maxLength={8} />
        <InputField label="CUIT" value={data.cuit} onChange={(v) => onChange("cuit", v)}
          error={errors.cuit} placeholder="XX-XXXXXXXX-X" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Fecha de nacimiento" value={data.fechaNacimiento}
          onChange={(v) => onChange("fechaNacimiento", v)}
          error={errors.fechaNacimiento} required type="date" />
        <InputField label="Nacionalidad" value={data.nacionalidad}
          onChange={(v) => onChange("nacionalidad", v)}
          error={errors.nacionalidad} placeholder="Argentina" required />
      </div>
      <SelectField
        label="Estado civil (opcional)" value={data.estadoCivil}
        onChange={(v) => onChange("estadoCivil", v)}
        options={[
          { value: "soltero", label: "Soltero/a" },
          { value: "casado", label: "Casado/a" },
          { value: "divorciado", label: "Divorciado/a" },
          { value: "viudo", label: "Viudo/a" },
          { value: "union_convivencial", label: "Unión convivencial" },
        ]}
      />
    </div>
  );
}

// ─── PASO 2: CONTACTO ─────────────────────────────────────────────────────────

function Paso2({ data, onChange, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Email" value={data.email} onChange={(v) => onChange("email", v)}
          error={errors.email} placeholder="juan@email.com" required type="email" />
        <InputField label="Teléfono" value={data.telefono} onChange={(v) => onChange("telefono", v)}
          error={errors.telefono} placeholder="11 1234-5678" required />
      </div>
      <InputField label="WhatsApp (opcional)" value={data.whatsapp}
        onChange={(v) => onChange("whatsapp", v)} placeholder="11 1234-5678" />
      <InputField label="Dirección" value={data.direccion} onChange={(v) => onChange("direccion", v)}
        error={errors.direccion} placeholder="Calle 123, Piso 2" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Localidad" value={data.localidad} onChange={(v) => onChange("localidad", v)}
          error={errors.localidad} placeholder="Buenos Aires" required />
        <SelectField label="Provincia" value={data.provincia}
          onChange={(v) => onChange("provincia", v)}
          error={errors.provincia}
          options={PROVINCIAS.map((p) => ({ value: p, label: p }))} required />
      </div>
      <InputField label="Código postal" value={data.codigoPostal}
        onChange={(v) => onChange("codigoPostal", v)}
        error={errors.codigoPostal} placeholder="1414" required maxLength={4} />
    </div>
  );
}

// ─── PASO 3: PERFIL PROFESIONAL ───────────────────────────────────────────────

function Paso3({ data, onChange, onToggleEsp, certs, onAddCert, onUpdateCert, onRemoveCert, errors }: {
  data: FormData;
  onChange: (f: keyof FormData, v: string) => void;
  onToggleEsp: (esp: string) => void;
  certs: Certificacion[];
  onAddCert: () => void;
  onUpdateCert: (id: string, f: keyof Certificacion, v: string | File | null) => void;
  onRemoveCert: (id: string) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-5">
      {/* Banner compliance */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
        <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>SHUURI verifica todas las certificaciones antes de activar tu cuenta.</strong>{" "}
          Sin certificaciones vigentes para un rubro, no podrás recibir OTs de ese rubro.
        </p>
      </div>

      {/* Especialidades — rubros de TAXONOMIA_SHUURI */}
      <div>
        <Label required>Rubros de especialización (mínimo 1)</Label>
        <p className="text-xs text-gray-400 mb-2">
          Seleccioná los rubros en los que trabajás. Podrás configurar categorías, subcategorías y marcas certificadas en tu perfil.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {ESPECIALIDADES.map((esp) => {
            const active = data.especialidades.includes(esp);
            return (
              <button
                key={esp} type="button"
                onClick={() => onToggleEsp(esp)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                  active
                    ? "bg-[#2698D1] border-[#2698D1] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {active && <Check size={12} className="inline mr-1" />}
                {esp}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.especialidades} />
      </div>

      <InputField label="Años de experiencia" value={data.experienciaAnios}
        onChange={(v) => onChange("experienciaAnios", v.replace(/\D/g, ""))}
        error={errors.experienciaAnios} placeholder="0" type="number" required />

      <div>
        <Label required>Descripción profesional</Label>
        <textarea
          value={data.descripcionProfesional}
          onChange={(e) => onChange("descripcionProfesional", e.target.value)}
          maxLength={500} rows={4}
          placeholder="Describí tu experiencia, marcas con las que trabajás, tipos de trabajo..."
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none transition ${
            errors.descripcionProfesional ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
        />
        <div className="flex justify-between mt-0.5">
          <FieldError msg={errors.descripcionProfesional} />
          <span className="text-xs text-gray-400 ml-auto">{data.descripcionProfesional.length}/500</span>
        </div>
      </div>

      {/* Certificaciones */}
      <div>
        <Label>Certificaciones</Label>
        <div className="space-y-3">
          {certs.map((cert, idx) => (
            <CertCard key={cert.id} cert={cert} idx={idx}
              onUpdate={onUpdateCert} onRemove={onRemoveCert} />
          ))}
        </div>
        <button type="button" onClick={onAddCert}
          className="mt-3 flex items-center gap-2 text-sm text-[#2698D1] border border-dashed border-[#2698D1] rounded-xl px-4 py-2.5 w-full justify-center hover:bg-blue-50 transition">
          <Plus size={15} /> Agregar certificación
        </button>
      </div>
    </div>
  );
}

function CertCard({ cert, idx, onUpdate, onRemove }: {
  cert: Certificacion; idx: number;
  onUpdate: (id: string, f: keyof Certificacion, v: string | File | null) => void;
  onRemove: (id: string) => void;
}) {
  const photoRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">Certificación #{idx + 1}</span>
        <button type="button" onClick={() => onRemove(cert.id)}
          className="text-red-400 hover:text-red-600 transition">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label required>Tipo / Nombre</Label>
          <input type="text" value={cert.tipo}
            onChange={(e) => onUpdate(cert.id, "tipo", e.target.value)}
            placeholder="Ej: ENARGAS, COPIME..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]" />
        </div>
        <div>
          <Label required>Entidad emisora</Label>
          <input type="text" value={cert.entidadEmisora}
            onChange={(e) => onUpdate(cert.id, "entidadEmisora", e.target.value)}
            placeholder="ENARGAS / COPIME..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]" />
        </div>
        <div>
          <Label>Número (opcional)</Label>
          <input type="text" value={cert.numero}
            onChange={(e) => onUpdate(cert.id, "numero", e.target.value)}
            placeholder="Nro. de matrícula / certificado"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]" />
        </div>
        <div>
          <Label>Vencimiento (opcional)</Label>
          <input type="date" value={cert.vencimiento}
            onChange={(e) => onUpdate(cert.id, "vencimiento", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]" />
        </div>
      </div>
      {/* Foto del documento */}
      <div>
        <Label>Foto / PDF del documento</Label>
        {cert.fotoDoc ? (
          <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-green-700 truncate">
              <Check size={13} />
              <span className="truncate">{cert.fotoDoc.name}</span>
            </div>
            <button type="button" onClick={() => onUpdate(cert.id, "fotoDoc", null)}
              className="text-green-500 hover:text-red-500 ml-2 shrink-0">
              <X size={13} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => photoRef.current?.click()}
            className="w-full flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-400 hover:bg-white transition">
            <Upload size={14} /> Adjuntar documento
          </button>
        )}
        <input ref={photoRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpdate(cert.id, "fotoDoc", f); e.target.value = ""; }} />
      </div>
    </div>
  );
}

// ─── PASO 4: ZONA DE COBERTURA ────────────────────────────────────────────────

const ZONAS_COBERTURA = Object.entries(LABELS_ZONA_COBERTURA) as [ZonaCobertura, string][];

function Paso4({ data, onToggleZona, onChange, errors }: {
  data: FormData;
  onToggleZona: (z: ZonaCobertura) => void;
  onChange: (f: keyof FormData, v: string) => void;
  errors: Errors;
}) {
  const { disponibilidad } = data;

  function toggleDisp(key: keyof Disponibilidad) {
    // We update through onChange with a synthetic approach — handled in parent
  }

  return (
    <div className="space-y-5">
      {/* Zonas */}
      <div>
        <Label required>Zonas de cobertura (mínimo 1)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {ZONAS_COBERTURA.map(([key, label]) => {
            const active = data.zonasCobertura.includes(key);
            return (
              <button key={key} type="button" onClick={() => onToggleZona(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition flex items-center gap-1.5 ${
                  active
                    ? "bg-[#2698D1] border-[#2698D1] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <MapPin size={12} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.zonasCobertura} />
      </div>

      <InputField label="Radio máximo (km, opcional)" value={data.radioKmMaximo}
        onChange={(v) => onChange("radioKmMaximo", v.replace(/\D/g, ""))}
        placeholder="Ej: 30" type="number" />

      {/* Disponibilidad */}
      <div>
        <Label required>Disponibilidad horaria</Label>
        <div className="space-y-2 mt-1">
          {(
            [
              ["lunesAViernes", "Lunes a Viernes"],
              ["sabados", "Sábados"],
              ["domingos", "Domingos"],
              ["feriados", "Feriados"],
              ["guardiaNocturna", "Guardia nocturna (emergencias)"],
            ] as [keyof Disponibilidad, string][]
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={disponibilidad[key]}
                onChange={(e) => onChange(`disp_${key}` as keyof FormData, e.target.checked ? "true" : "false")}
                className="w-4 h-4 accent-[#2698D1]" />
              <span className="text-sm text-gray-700">{label}</span>
              {key === "guardiaNocturna" && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                  +tarifa nocturna
                </span>
              )}
            </label>
          ))}
        </div>
        <FieldError msg={errors.disponibilidad} />
      </div>
    </div>
  );
}

// ─── PASO 5: CONDICIÓN LABORAL ────────────────────────────────────────────────

function Paso5({ data, onChange, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  const esMonotributista = data.condicionFiscal === "monotributista";
  return (
    <div className="space-y-5">
      <SelectField label="Condición fiscal" value={data.condicionFiscal}
        onChange={(v) => onChange("condicionFiscal", v)}
        error={errors.condicionFiscal}
        options={CONDICION_IVA_OPTIONS} required />

      <div>
        <Label required>Modalidad de contratación</Label>
        <div className="space-y-2 mt-1">
          {(
            [
              ["autonomo", "Autónomo / Independiente"],
              ["relacion_dependencia", "Relación de dependencia"],
              ["eventual", "Trabajo eventual"],
            ] as ["autonomo" | "relacion_dependencia" | "eventual", string][]
          ).map(([val, label]) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-200 hover:border-[#2698D1]/40 transition">
              <input type="radio" name="modalidad" value={val}
                checked={data.modalidadContratacion === val}
                onChange={() => onChange("modalidadContratacion", val)}
                className="w-4 h-4 accent-[#2698D1]" />
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>
        <FieldError msg={errors.modalidadContratacion} />
      </div>

      {/* Monotributo extra */}
      {esMonotributista && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-700">Datos de monotributo</p>
          <SelectField label="Categoría actual" value={data.categoriaMonotributo}
            onChange={(v) => onChange("categoriaMonotributo", v)}
            options={CATEGORIAS_MONOTRIBUTO.map((c) => ({ value: c, label: `Categoría ${c}` }))}
            error={errors.categoriaMonotributo} required />
          <InputField label="Fecha de inicio de actividad" value={data.fechaInicioMonotributo}
            onChange={(v) => onChange("fechaInicioMonotributo", v)}
            error={errors.fechaInicioMonotributo} required type="date" />
        </div>
      )}
    </div>
  );
}

// ─── PASO 6: DATOS BANCARIOS ─────────────────────────────────────────────────

function Paso6({ data, onChange, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700 flex items-start gap-2">
        <CreditCard size={16} className="shrink-0 mt-0.5" />
        <span>
          Tus datos bancarios se usan{" "}
          <strong>exclusivamente para liquidaciones mensuales</strong>. Nunca se
          comparten con terceros.
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Banco o billetera" value={data.banco} onChange={(v) => onChange("banco", v)}
          error={errors.banco} placeholder="Galicia / Mercado Pago" required />
        <SelectField label="Tipo de cuenta" value={data.tipoCuenta}
          onChange={(v) => onChange("tipoCuenta", v)}
          error={errors.tipoCuenta}
          options={[
            { value: "caja_ahorro", label: "Caja de ahorro" },
            { value: "cuenta_corriente", label: "Cuenta corriente" },
          ]} required />
      </div>
      <InputField label="CBU / CVU"
        value={data.cbu} onChange={(v) => onChange("cbu", v.replace(/\D/g, "").slice(0, 22))}
        error={errors.cbu} placeholder="22 dígitos numéricos" required maxLength={22} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Alias CBU (opcional)" value={data.alias}
          onChange={(v) => onChange("alias", v)} placeholder="mi.alias.banco" />
        <InputField label="Titular de la cuenta" value={data.titularCuenta}
          onChange={(v) => onChange("titularCuenta", v)}
          error={errors.titularCuenta} placeholder="Nombre del titular" required />
      </div>
      <InputField label="CUIT del titular" value={data.cuitTitular}
        onChange={(v) => onChange("cuitTitular", v)}
        error={errors.cuitTitular} placeholder="XX-XXXXXXXX-X" required />
    </div>
  );
}

// ─── PASO 7: DOCUMENTACIÓN ────────────────────────────────────────────────────

type DocKeyTecnico = "fotoDNIFrente" | "fotoDNIDorso" | "fotoPerfil" | "constanciaAfip" | "antecedentesLaborales";

const DOC_CONFIG_TECNICO: { key: DocKeyTecnico; label: string; required: boolean }[] = [
  { key: "fotoDNIFrente", label: "Foto DNI (frente)", required: true },
  { key: "fotoDNIDorso", label: "Foto DNI (dorso)", required: true },
  { key: "fotoPerfil", label: "Foto carnet / perfil", required: true },
  { key: "constanciaAfip", label: "Constancia AFIP", required: true },
  { key: "antecedentesLaborales", label: "Antecedentes laborales", required: false },
];

function Paso7({
  docs, onSetDoc, onClearDoc, onAddCertHab, onRemoveCertHab, errors,
  data, locales: _locales, onGoToStep,
  certs,
}: {
  docs: DocsTecnico;
  onSetDoc: (k: DocKeyTecnico, f: File) => void;
  onClearDoc: (k: DocKeyTecnico) => void;
  onAddCertHab: (f: File) => void;
  onRemoveCertHab: (i: number) => void;
  errors: Errors;
  data: FormData;
  locales?: never[];
  onGoToStep: (s: number) => void;
  certs: Certificacion[];
}) {
  const certHabRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-5">
      {/* Archivos requeridos */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#0D0D0D]">Documentos requeridos</h3>
        {DOC_CONFIG_TECNICO.map((d) => (
          <FileSlot key={d.key} label={d.label} required={d.required}
            file={docs[d.key]} onSet={(f) => onSetDoc(d.key, f)}
            onClear={() => onClearDoc(d.key)} error={errors[d.key]} />
        ))}
      </div>

      {/* Certificados habilitación múltiple */}
      <div>
        <Label>Certificados de habilitación (opcional)</Label>
        {docs.certificadosHabilitacion.length > 0 && (
          <div className="space-y-2 mb-2">
            {docs.certificadosHabilitacion.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-600 truncate">{f.name}</span>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <span className="text-xs text-gray-400">{Math.round(f.size / 1024)} KB</span>
                  <button type="button" onClick={() => onRemoveCertHab(i)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={() => certHabRef.current?.click()}
          className="flex items-center gap-2 text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-lg px-3 py-3 w-full hover:bg-gray-50 transition">
          <Upload size={15} /> Agregar certificado
        </button>
        <input ref={certHabRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden"
          onChange={(e) => { Array.from(e.target.files ?? []).forEach(onAddCertHab); e.target.value = ""; }} />
      </div>

      {/* Resumen acordeón */}
      <div className="pt-2 space-y-3">
        <h3 className="text-sm font-bold text-[#0D0D0D]">Revisión de datos</h3>
        <AccordionSection title="1. Datos personales" step={1} onEdit={onGoToStep}>
          <ReviewRow label="Nombre" value={`${data.nombre} ${data.apellido}`} />
          <ReviewRow label="DNI" value={data.dni} />
          <ReviewRow label="CUIT" value={data.cuit} />
          <ReviewRow label="Nacionalidad" value={data.nacionalidad} />
        </AccordionSection>
        <AccordionSection title="2. Contacto" step={2} onEdit={onGoToStep}>
          <ReviewRow label="Email" value={data.email} />
          <ReviewRow label="Teléfono" value={data.telefono} />
          <ReviewRow label="Localidad" value={`${data.localidad}, ${data.provincia}`} />
        </AccordionSection>
        <AccordionSection title="3. Perfil profesional" step={3} onEdit={onGoToStep}>
          <ReviewRow label="Especialidades" value={data.especialidades.join(", ")} />
          <ReviewRow label="Experiencia" value={`${data.experienciaAnios} años`} />
          <ReviewRow label="Certificaciones" value={`${certs.length} cargada(s)`} />
        </AccordionSection>
        <AccordionSection title="4. Zona de cobertura" step={4} onEdit={onGoToStep}>
          <ReviewRow label="Zonas" value={data.zonasCobertura.map(z => LABELS_ZONA_COBERTURA[z]).join(", ")} />
          {data.radioKmMaximo && <ReviewRow label="Radio máx." value={`${data.radioKmMaximo} km`} />}
        </AccordionSection>
        <AccordionSection title="5. Condición laboral" step={5} onEdit={onGoToStep}>
          <ReviewRow label="Condición fiscal" value={data.condicionFiscal} />
          <ReviewRow label="Modalidad" value={data.modalidadContratacion} />
        </AccordionSection>
        <AccordionSection title="6. Datos bancarios" step={6} onEdit={onGoToStep}>
          <ReviewRow label="Banco" value={data.banco} />
          <ReviewRow label="CBU" value={data.cbu.length >= 6 ? `...${data.cbu.slice(-6)}` : data.cbu} />
          <ReviewRow label="Titular" value={data.titularCuenta} />
        </AccordionSection>
      </div>
    </div>
  );
}

// ─── ACCORDION + REVIEW ───────────────────────────────────────────────────────

function AccordionSection({ title, step, onEdit, children }: {
  title: string; step: number; onEdit: (s: number) => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button type="button"
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-semibold text-[#0D0D0D] hover:bg-gray-100 transition"
        onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-1">
          {children}
          <button type="button" onClick={() => onEdit(step)}
            className="text-xs text-[#2698D1] hover:underline pt-1 block">
            Volver a editar
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="font-medium text-[#0D0D0D] text-xs text-right max-w-[60%] truncate">
        {value || "—"}
      </span>
    </div>
  );
}

// ─── PANTALLA ÉXITO ───────────────────────────────────────────────────────────

function Exito() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 size={44} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-[#0D0D0D] mb-3">¡Solicitud recibida!</h2>
      <p className="text-gray-500 max-w-sm leading-relaxed mb-4">
        Revisaremos tu perfil en{" "}
        <strong className="text-[#0D0D0D]">48 horas hábiles</strong>.
        Cuando sea aprobado, recibirás un email con tus credenciales.
      </p>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-6 py-4 text-sm text-amber-800 max-w-sm flex items-start gap-2">
        <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-500" />
        <span>
          Mientras tanto, verificamos tus certificaciones. Si falta algún documento te
          contactaremos por email.
        </span>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  nombre: "", apellido: "", dni: "", cuit: "", fechaNacimiento: "",
  nacionalidad: "", estadoCivil: "",
  email: "", telefono: "", whatsapp: "", direccion: "",
  localidad: "", provincia: "", codigoPostal: "",
  especialidades: [], experienciaAnios: "", descripcionProfesional: "",
  zonasCobertura: [], radioKmMaximo: "",
  disponibilidad: {
    lunesAViernes: true, sabados: false, domingos: false,
    feriados: false, guardiaNocturna: false,
  },
  condicionFiscal: "", modalidadContratacion: "",
  categoriaMonotributo: "", fechaInicioMonotributo: "",
  banco: "", tipoCuenta: "", cbu: "", alias: "", titularCuenta: "", cuitTitular: "",
};

const INITIAL_CERT = (): Certificacion => ({
  id: crypto.randomUUID(),
  tipo: "", entidadEmisora: "", numero: "", vencimiento: "", fotoDoc: null,
});

const STEP_TITLES = [
  "Datos personales",
  "Contacto",
  "Perfil profesional",
  "Zona de cobertura",
  "Condición laboral",
  "Datos bancarios",
  "Documentación y confirmación",
];

const STEP_ICONS: React.ElementType[] = [
  User, Phone, Wrench, MapPin, Building2, CreditCard, FileText,
];

export default function OnboardingTecnico() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [certs, setCerts] = useState<Certificacion[]>([]);
  const [docs, setDocs] = useState<DocsTecnico>({
    fotoDNIFrente: null, fotoDNIDorso: null, fotoPerfil: null,
    constanciaAfip: null, certificadosHabilitacion: [], antecedentesLaborales: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // ── Setters ───────────────────────────────────────────────────────────────

  const setField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => {
      // Disponibilidad handled via disp_ prefix
      if ((field as string).startsWith("disp_")) {
        const key = (field as string).replace("disp_", "") as keyof Disponibilidad;
        return {
          ...prev,
          disponibilidad: { ...prev.disponibilidad, [key]: value === "true" },
        };
      }
      return { ...prev, [field]: value };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  function toggleEspecialidad(esp: string) {
    setForm((prev) => ({
      ...prev,
      especialidades: prev.especialidades.includes(esp)
        ? prev.especialidades.filter((e) => e !== esp)
        : [...prev.especialidades, esp],
    }));
    setErrors((prev) => ({ ...prev, especialidades: undefined }));
  }

  function toggleZona(z: ZonaCobertura) {
    setForm((prev) => ({
      ...prev,
      zonasCobertura: prev.zonasCobertura.includes(z)
        ? prev.zonasCobertura.filter((x) => x !== z)
        : [...prev.zonasCobertura, z],
    }));
    setErrors((prev) => ({ ...prev, zonasCobertura: undefined }));
  }

  // ── Certificaciones ───────────────────────────────────────────────────────

  function addCert() { setCerts((prev) => [...prev, INITIAL_CERT()]); }

  function removeCert(id: string) { setCerts((prev) => prev.filter((c) => c.id !== id)); }

  function updateCert(id: string, field: keyof Certificacion, value: string | File | null) {
    setCerts((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  // ── Docs ──────────────────────────────────────────────────────────────────

  function setDoc(key: DocKeyTecnico, f: File) {
    setDocs((prev) => ({ ...prev, [key]: f }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  function clearDoc(key: DocKeyTecnico) { setDocs((prev) => ({ ...prev, [key]: null })); }
  function addCertHab(f: File) { setDocs((prev) => ({ ...prev, certificadosHabilitacion: [...prev.certificadosHabilitacion, f] })); }
  function removeCertHab(i: number) { setDocs((prev) => ({ ...prev, certificadosHabilitacion: prev.certificadosHabilitacion.filter((_, j) => j !== i) })); }

  // ── Validación ────────────────────────────────────────────────────────────

  function validateStep(s: number): Errors {
    const e: Errors = {};

    if (s === 1) {
      if (!form.nombre.trim()) e.nombre = "Requerido";
      if (!form.apellido.trim()) e.apellido = "Requerido";
      if (!form.dni.trim()) { e.dni = "Requerido"; }
      else { const err = validateDNI(form.dni); if (err) e.dni = err; }
      if (!form.cuit.trim()) { e.cuit = "Requerido"; }
      else { const err = validateCuit(form.cuit); if (err) e.cuit = err; }
      if (!form.fechaNacimiento) e.fechaNacimiento = "Requerido";
      if (!form.nacionalidad.trim()) e.nacionalidad = "Requerido";
    }

    if (s === 2) {
      if (!form.email.trim()) { e.email = "Requerido"; }
      else { const err = validateEmail(form.email); if (err) e.email = err; }
      if (!form.telefono.trim()) { e.telefono = "Requerido"; }
      else { const err = validateTelefono(form.telefono); if (err) e.telefono = err; }
      if (!form.direccion.trim()) e.direccion = "Requerido";
      if (!form.localidad.trim()) e.localidad = "Requerido";
      if (!form.provincia) e.provincia = "Seleccioná una provincia";
      if (!form.codigoPostal.trim()) { e.codigoPostal = "Requerido"; }
      else { const err = validateCP(form.codigoPostal); if (err) e.codigoPostal = err; }
    }

    if (s === 3) {
      if (form.especialidades.length === 0) e.especialidades = "Seleccioná al menos 1 especialidad";
      if (!form.descripcionProfesional.trim()) e.descripcionProfesional = "Requerido";
    }

    if (s === 4) {
      if (form.zonasCobertura.length === 0) e.zonasCobertura = "Seleccioná al menos 1 zona";
      const hayDisp = Object.values(form.disponibilidad).some(Boolean);
      if (!hayDisp) e.disponibilidad = "Seleccioná al menos 1 opción de disponibilidad";
    }

    if (s === 5) {
      if (!form.condicionFiscal) e.condicionFiscal = "Seleccioná una opción";
      if (!form.modalidadContratacion) e.modalidadContratacion = "Seleccioná una opción";
      if (form.condicionFiscal === "monotributista") {
        if (!form.categoriaMonotributo) e.categoriaMonotributo = "Seleccioná categoría";
        if (!form.fechaInicioMonotributo) e.fechaInicioMonotributo = "Requerido";
      }
    }

    if (s === 6) {
      if (!form.banco.trim()) e.banco = "Requerido";
      if (!form.tipoCuenta) e.tipoCuenta = "Seleccioná un tipo";
      if (!form.cbu.trim()) { e.cbu = "Requerido"; }
      else { const err = validateCbu(form.cbu); if (err) e.cbu = err; }
      if (!form.titularCuenta.trim()) e.titularCuenta = "Requerido";
      if (!form.cuitTitular.trim()) { e.cuitTitular = "Requerido"; }
      else { const err = validateCuit(form.cuitTitular); if (err) e.cuitTitular = err; }
    }

    if (s === 7) {
      if (!docs.fotoDNIFrente) e.fotoDNIFrente = "Archivo requerido";
      if (!docs.fotoDNIDorso) e.fotoDNIDorso = "Archivo requerido";
      if (!docs.fotoPerfil) e.fotoPerfil = "Archivo requerido";
      if (!docs.constanciaAfip) e.constanciaAfip = "Archivo requerido";
    }

    return e;
  }

  function handleNext() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleGoToStep(s: number) {
    setErrors({});
    setStep(s);
  }

  async function handleSubmit() {
    const e = validateStep(7);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSending(true);
    await new Promise<void>((r) => setTimeout(r, 1500));
    setSending(false);
    setDone(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (done) return <Exito />;

  const pct = Math.round((step / TOTAL_STEPS) * 100);
  const StepIcon = STEP_ICONS[step - 1];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center px-4 py-8">
      {/* HEADER */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-black text-xl text-[#2698D1] tracking-tight">SHUURI</span>
          <span className="text-xs text-gray-400 font-medium">/ Registro de técnico</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <StepIcon size={16} className="text-[#2698D1]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Paso {step} de {TOTAL_STEPS}</p>
                <p className="font-bold text-[#0D0D0D] text-sm leading-tight">
                  {STEP_TITLES[step - 1]}
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-[#2698D1]">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2698D1] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i + 1 < step ? "bg-[#2698D1]"
                : i + 1 === step ? "bg-[#2698D1] ring-2 ring-[#2698D1]/30"
                : "bg-gray-200"
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {step === 1 && <Paso1 data={form} onChange={setField} errors={errors} />}
        {step === 2 && <Paso2 data={form} onChange={setField} errors={errors} />}
        {step === 3 && (
          <Paso3 data={form} onChange={setField} onToggleEsp={toggleEspecialidad}
            certs={certs} onAddCert={addCert} onUpdateCert={updateCert}
            onRemoveCert={removeCert} errors={errors} />
        )}
        {step === 4 && (
          <Paso4 data={form} onToggleZona={toggleZona} onChange={setField} errors={errors} />
        )}
        {step === 5 && <Paso5 data={form} onChange={setField} errors={errors} />}
        {step === 6 && <Paso6 data={form} onChange={setField} errors={errors} />}
        {step === 7 && (
          <Paso7 docs={docs} onSetDoc={setDoc} onClearDoc={clearDoc}
            onAddCertHab={addCertHab} onRemoveCertHab={removeCertHab}
            errors={errors} data={form} onGoToStep={handleGoToStep} certs={certs} />
        )}
      </div>

      {/* NAVEGACIÓN */}
      <div className="w-full max-w-2xl mt-4 flex items-center justify-between">
        <button type="button" onClick={handleBack} disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft size={16} /> Anterior
        </button>

        {step < TOTAL_STEPS ? (
          <button type="button" onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#2698D1] text-white text-sm font-bold hover:bg-[#1f84b8] transition shadow-sm">
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={sending}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#2698D1] text-white text-sm font-bold hover:bg-[#1f84b8] transition shadow-sm disabled:opacity-60">
            {sending ? (
              <><Loader2 size={16} className="animate-spin" /> Enviando...</>
            ) : (
              <><Check size={16} /> Confirmar y enviar solicitud</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
