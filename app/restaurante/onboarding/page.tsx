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
  Building2,
  CreditCard,
  Users,
  FileText,
  Star,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  VALIDACIONES,
  COMISION_POR_TIER,
  SAAS_POR_TIER,
} from "@/types/shuuri";
import type { CondicionIVA, TipoEstablecimiento } from "@/types/shuuri";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

const CONDICION_IVA_LABELS: Record<CondicionIVA, string> = {
  responsable_inscripto: "Responsable Inscripto",
  monotributista: "Monotributista",
  exento: "Exento",
};

const TIPO_ESTABLECIMIENTO_LABELS: Record<TipoEstablecimiento, string> = {
  restaurante: "Restaurante",
  bar_cafe: "Bar / Café",
  hotel: "Hotel",
  catering_dark_kitchen: "Catering / Dark Kitchen",
  franquicia: "Franquicia",
  panaderia_heladeria: "Panadería / Heladería",
  otro: "Otro",
};

const TOTAL_STEPS = 8;

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Local = {
  id: string;
  nombreLocal: string;
  direccionLocal: string;
  capacidadComensales: string;
  superficieM2: string;
  tieneGas: boolean;
  tieneElectricidadTrifasica: boolean;
  observacionesLocal: string;
};

type DocFiles = {
  habilitacionMunicipal: File | null;
  constanciaAfip: File | null;
  dniTitular: File | null;
  logotipoMarca: File | null;
  fotosFachada: File[];
};

type FormData = {
  // Paso 1
  razonSocial: string;
  cuit: string;
  condicionIVA: CondicionIVA | "";
  tipoEstablecimiento: TipoEstablecimiento | "";
  nombreComercial: string;
  descripcionBreve: string;
  // Paso 2
  calle: string;
  numero: string;
  piso: string;
  depto: string;
  barrio: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  // Paso 3
  nombreContacto: string;
  cargoContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  whatsappContacto: string;
  horarioAtencion: string;
  // Paso 4
  banco: string;
  tipoCuenta: "caja_ahorro" | "cuenta_corriente" | "";
  cbu: string;
  alias: string;
  titularCuenta: string;
  cuitTitular: string;
  // Paso 6
  planSeleccionado: "base" | "cadena_chica" | "cadena_grande" | "";
};

type Errors = Partial<Record<string, string>>;

// ─── HELPERS DE VALIDACIÓN ────────────────────────────────────────────────────

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
function validateCP(v: string) {
  return /^\d{4}$/.test(v) ? "" : "Código postal: 4 dígitos";
}

// ─── COMPONENTES PEQUEÑOS ─────────────────────────────────────────────────────

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
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}
      >
        <option value="">{placeholder ?? "Seleccioná una opción"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition resize-none ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right mt-0.5">
          {value.length}/{maxLength}
        </p>
      )}
      <FieldError msg={error} />
    </div>
  );
}

// ─── PASO 1: DATOS DEL ESTABLECIMIENTO ───────────────────────────────────────

function Paso1({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Razón social"
          value={data.razonSocial}
          onChange={(v) => onChange("razonSocial", v)}
          error={errors.razonSocial}
          placeholder="Ej: La Cabrera S.R.L."
          required
        />
        <InputField
          label="Nombre comercial"
          value={data.nombreComercial}
          onChange={(v) => onChange("nombreComercial", v)}
          error={errors.nombreComercial}
          placeholder="Nombre visible en SHUURI"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="CUIT"
          value={data.cuit}
          onChange={(v) => onChange("cuit", v)}
          error={errors.cuit}
          placeholder="XX-XXXXXXXX-X"
          required
        />
        <SelectField
          label="Condición IVA"
          value={data.condicionIVA}
          onChange={(v) => onChange("condicionIVA", v)}
          error={errors.condicionIVA}
          options={Object.entries(CONDICION_IVA_LABELS).map(([k, l]) => ({ value: k, label: l }))}
          required
        />
      </div>
      <SelectField
        label="Tipo de establecimiento"
        value={data.tipoEstablecimiento}
        onChange={(v) => onChange("tipoEstablecimiento", v)}
        error={errors.tipoEstablecimiento}
        options={Object.entries(TIPO_ESTABLECIMIENTO_LABELS).map(([k, l]) => ({ value: k, label: l }))}
        required
      />
      <TextareaField
        label="Descripción breve"
        value={data.descripcionBreve}
        onChange={(v) => onChange("descripcionBreve", v)}
        error={errors.descripcionBreve}
        placeholder="Contanos sobre tu establecimiento (máx. 200 caracteres)"
        required
        maxLength={200}
      />
    </div>
  );
}

// ─── PASO 2: UBICACIÓN ───────────────────────────────────────────────────────

function Paso2({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-3">
          <InputField
            label="Calle"
            value={data.calle}
            onChange={(v) => onChange("calle", v)}
            error={errors.calle}
            placeholder="Av. Corrientes"
            required
          />
        </div>
        <InputField
          label="Número"
          value={data.numero}
          onChange={(v) => onChange("numero", v)}
          error={errors.numero}
          placeholder="1234"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Piso"
          value={data.piso}
          onChange={(v) => onChange("piso", v)}
          placeholder="2° (opcional)"
        />
        <InputField
          label="Dpto"
          value={data.depto}
          onChange={(v) => onChange("depto", v)}
          placeholder="B (opcional)"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Barrio"
          value={data.barrio}
          onChange={(v) => onChange("barrio", v)}
          error={errors.barrio}
          placeholder="Palermo"
          required
        />
        <InputField
          label="Localidad"
          value={data.localidad}
          onChange={(v) => onChange("localidad", v)}
          error={errors.localidad}
          placeholder="Buenos Aires"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Provincia"
          value={data.provincia}
          onChange={(v) => onChange("provincia", v)}
          error={errors.provincia}
          options={PROVINCIAS.map((p) => ({ value: p, label: p }))}
          required
        />
        <InputField
          label="Código postal"
          value={data.codigoPostal}
          onChange={(v) => onChange("codigoPostal", v)}
          error={errors.codigoPostal}
          placeholder="1414"
          required
          maxLength={4}
        />
      </div>
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-[#2698D1] border border-[#2698D1] rounded-lg px-4 py-2 hover:bg-blue-50 transition"
      >
        <MapPin size={16} />
        Agregar ubicación en mapa (opcional)
      </button>
    </div>
  );
}

// ─── PASO 3: CONTACTO OPERATIVO ──────────────────────────────────────────────

function Paso3({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Nombre completo"
          value={data.nombreContacto}
          onChange={(v) => onChange("nombreContacto", v)}
          error={errors.nombreContacto}
          placeholder="Juan García"
          required
        />
        <InputField
          label="Cargo"
          value={data.cargoContacto}
          onChange={(v) => onChange("cargoContacto", v)}
          error={errors.cargoContacto}
          placeholder="Encargado / Socio"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Email"
          value={data.emailContacto}
          onChange={(v) => onChange("emailContacto", v)}
          error={errors.emailContacto}
          placeholder="contacto@restaurante.com"
          required
          type="email"
        />
        <InputField
          label="Teléfono"
          value={data.telefonoContacto}
          onChange={(v) => onChange("telefonoContacto", v)}
          error={errors.telefonoContacto}
          placeholder="11 1234-5678"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="WhatsApp (opcional)"
          value={data.whatsappContacto}
          onChange={(v) => onChange("whatsappContacto", v)}
          placeholder="11 1234-5678"
        />
        <InputField
          label="Horario de atención"
          value={data.horarioAtencion}
          onChange={(v) => onChange("horarioAtencion", v)}
          error={errors.horarioAtencion}
          placeholder="Lunes a Domingo 10:00-24:00"
          required
        />
      </div>
    </div>
  );
}

// ─── PASO 4: DATOS BANCARIOS ─────────────────────────────────────────────────

function Paso4({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Errors;
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
        <InputField
          label="Banco o billetera"
          value={data.banco}
          onChange={(v) => onChange("banco", v)}
          error={errors.banco}
          placeholder="Galicia / Mercado Pago"
          required
        />
        <SelectField
          label="Tipo de cuenta"
          value={data.tipoCuenta}
          onChange={(v) => onChange("tipoCuenta", v)}
          error={errors.tipoCuenta}
          options={[
            { value: "caja_ahorro", label: "Caja de ahorro" },
            { value: "cuenta_corriente", label: "Cuenta corriente" },
          ]}
          required
        />
      </div>
      <InputField
        label="CBU / CVU"
        value={data.cbu}
        onChange={(v) => onChange("cbu", v.replace(/\D/g, "").slice(0, 22))}
        error={errors.cbu}
        placeholder="22 dígitos numéricos"
        required
        maxLength={22}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Alias CBU (opcional)"
          value={data.alias}
          onChange={(v) => onChange("alias", v)}
          placeholder="mi.alias.banco"
        />
        <InputField
          label="Titular de la cuenta"
          value={data.titularCuenta}
          onChange={(v) => onChange("titularCuenta", v)}
          error={errors.titularCuenta}
          placeholder="Nombre del titular"
          required
        />
      </div>
      <InputField
        label="CUIT del titular"
        value={data.cuitTitular}
        onChange={(v) => onChange("cuitTitular", v)}
        error={errors.cuitTitular}
        placeholder="XX-XXXXXXXX-X"
        required
      />
    </div>
  );
}

// ─── PASO 5: LOCALES ─────────────────────────────────────────────────────────

function Paso5({
  locales,
  onAdd,
  onUpdate,
  onRemove,
  errors,
}: {
  locales: Local[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Local, value: string | boolean) => void;
  onRemove: (id: string) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-6">
      {locales.map((local, idx) => (
        <div
          key={local.id}
          className="rounded-xl border border-gray-200 bg-white p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#0D0D0D] text-sm">
              Local #{idx + 1}
            </h3>
            {locales.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(local.id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Nombre del local</Label>
              <input
                type="text"
                value={local.nombreLocal}
                onChange={(e) => onUpdate(local.id, "nombreLocal", e.target.value)}
                placeholder="Sucursal Palermo"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] ${
                  errors[`local_${local.id}_nombre`]
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <FieldError msg={errors[`local_${local.id}_nombre`]} />
            </div>
            <div>
              <Label required>Dirección</Label>
              <input
                type="text"
                value={local.direccionLocal}
                onChange={(e) => onUpdate(local.id, "direccionLocal", e.target.value)}
                placeholder="Av. Santa Fe 1234, CABA"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] ${
                  errors[`local_${local.id}_dir`]
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <FieldError msg={errors[`local_${local.id}_dir`]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Capacidad (comensales)</Label>
              <input
                type="number"
                min="1"
                value={local.capacidadComensales}
                onChange={(e) =>
                  onUpdate(local.id, "capacidadComensales", e.target.value)
                }
                placeholder="80"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
              />
            </div>
            <div>
              <Label>Superficie (m²)</Label>
              <input
                type="number"
                min="1"
                value={local.superficieM2}
                onChange={(e) =>
                  onUpdate(local.id, "superficieM2", e.target.value)
                }
                placeholder="200"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={local.tieneGas}
                onChange={(e) => onUpdate(local.id, "tieneGas", e.target.checked)}
                className="w-4 h-4 accent-[#2698D1]"
              />
              Tiene gas
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={local.tieneElectricidadTrifasica}
                onChange={(e) =>
                  onUpdate(local.id, "tieneElectricidadTrifasica", e.target.checked)
                }
                className="w-4 h-4 accent-[#2698D1]"
              />
              Electricidad trifásica
            </label>
          </div>
          <div>
            <Label>Observaciones</Label>
            <textarea
              value={local.observacionesLocal}
              onChange={(e) =>
                onUpdate(local.id, "observacionesLocal", e.target.value)
              }
              placeholder="Acceso por escalera trasera, portón azul..."
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 text-sm text-[#2698D1] border border-dashed border-[#2698D1] rounded-xl px-4 py-3 w-full justify-center hover:bg-blue-50 transition"
      >
        <Plus size={16} />
        Agregar otro local
      </button>
    </div>
  );
}

// ─── PASO 6: SUSCRIPCIÓN ─────────────────────────────────────────────────────

type PlanKey = "base" | "cadena_chica" | "cadena_grande";

const PLANES: {
  key: PlanKey;
  nombre: string;
  precio: string;
  comision: number;
  descripcion: string;
  badge?: string;
  features: string[];
}[] = [
  {
    key: "base",
    nombre: "Plan Base",
    precio: "USD 0/mes",
    comision: COMISION_POR_TIER.FREEMIUM * 100,
    descripcion: "Ideal para empezar",
    features: [
      "Sin mínimo de locales",
      "Acceso a red de técnicos certificados",
      "Panel de gestión de OTs",
      "Soporte por email",
    ],
  },
  {
    key: "cadena_chica",
    nombre: "Plan Cadena Chica",
    precio: `USD ${SAAS_POR_TIER.CADENA_CHICA}/local/mes`,
    comision: COMISION_POR_TIER.CADENA_CHICA * 100,
    descripcion: "Para 2 a 9 locales",
    badge: "Popular",
    features: [
      "2 a 9 locales",
      "Comisión reducida",
      "Soporte prioritario 48hs",
      "Informes mensuales",
    ],
  },
  {
    key: "cadena_grande",
    nombre: "Plan Cadena Grande",
    precio: `USD ${SAAS_POR_TIER.CADENA_GRANDE}/local/mes`,
    comision: COMISION_POR_TIER.CADENA_GRANDE * 100,
    descripcion: "Para 10 o más locales",
    features: [
      "10+ locales",
      "Mejor comisión de la plataforma",
      "Account Manager dedicado",
      "SLA garantizado",
    ],
  },
];

function Paso6({
  value,
  onChange,
  error,
}: {
  value: PlanKey | "";
  onChange: (v: PlanKey) => void;
  error?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANES.map((plan) => {
          const selected = value === plan.key;
          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => onChange(plan.key)}
              className={`relative text-left rounded-xl border-2 p-5 transition-all ${
                selected
                  ? "border-[#2698D1] ring-2 ring-[#2698D1]/30 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {plan.badge && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              {selected && (
                <span className="absolute top-3 left-3">
                  <CheckCircle2 size={18} className="text-[#2698D1]" />
                </span>
              )}
              <div className="mt-5">
                <p className="font-bold text-[#0D0D0D] text-base">{plan.nombre}</p>
                <p className="text-[#2698D1] font-black text-lg mt-1">{plan.precio}</p>
                <p className="text-xs text-gray-400 mt-0.5">Comisión: {plan.comision}%</p>
                <p className="text-xs text-gray-500 mt-2 mb-3">{plan.descripcion}</p>
                <ul className="space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Check size={11} className="text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── PASO 7: DOCUMENTACIÓN ───────────────────────────────────────────────────

type DocKey = "habilitacionMunicipal" | "constanciaAfip" | "dniTitular" | "logotipoMarca";

const DOC_CONFIG: { key: DocKey; label: string; required: boolean }[] = [
  { key: "habilitacionMunicipal", label: "Habilitación municipal", required: true },
  { key: "constanciaAfip", label: "Constancia AFIP", required: true },
  { key: "dniTitular", label: "DNI del titular", required: true },
  { key: "logotipoMarca", label: "Logotipo de la marca", required: false },
];

function FileSlot({
  label,
  required,
  file,
  onSet,
  onClear,
  error,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onSet: (f: File) => void;
  onClear: () => void;
  error?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label required={required}>{label}</Label>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-green-700 truncate">
            <Check size={14} />
            <span className="truncate">{file.name}</span>
            <span className="text-xs text-green-500 shrink-0">
              ({Math.round(file.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-green-500 hover:text-red-500 ml-2 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-sm transition hover:bg-gray-50 ${
            error ? "border-red-300 text-red-400" : "border-gray-300 text-gray-400"
          }`}
        >
          <Upload size={15} />
          Subir archivo (.pdf, .jpg, .png)
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSet(f);
          e.target.value = "";
        }}
      />
      <FieldError msg={error} />
    </div>
  );
}

function Paso7({
  docs,
  onSetDoc,
  onClearDoc,
  onAddFoto,
  onRemoveFoto,
  errors,
}: {
  docs: DocFiles;
  onSetDoc: (key: DocKey, f: File) => void;
  onClearDoc: (key: DocKey) => void;
  onAddFoto: (f: File) => void;
  onRemoveFoto: (idx: number) => void;
  errors: Errors;
}) {
  const fotosRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4">
      {DOC_CONFIG.map((d) => (
        <FileSlot
          key={d.key}
          label={d.label}
          required={d.required}
          file={docs[d.key]}
          onSet={(f) => onSetDoc(d.key, f)}
          onClear={() => onClearDoc(d.key)}
          error={errors[d.key]}
        />
      ))}

      <div>
        <Label>Fotos de fachada (opcional)</Label>
        {docs.fotosFachada.length > 0 && (
          <div className="space-y-2 mb-2">
            {docs.fotosFachada.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <span className="text-sm text-gray-600 truncate">{f.name}</span>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <span className="text-xs text-gray-400">
                    {Math.round(f.size / 1024)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFoto(i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => fotosRef.current?.click()}
          className="flex items-center gap-2 text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-lg px-3 py-3 w-full hover:bg-gray-50 transition"
        >
          <Upload size={15} />
          Agregar foto (.jpg, .png)
        </button>
        <input
          ref={fotosRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files ?? []).forEach(onAddFoto);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// ─── PASO 8: REVISIÓN ─────────────────────────────────────────────────────────

function AccordionSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-sm font-semibold text-[#0D0D0D] hover:bg-gray-100 transition"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-1">
          {children}
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="text-xs text-[#2698D1] hover:underline pt-1 block"
          >
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

const PLAN_LABELS: Record<PlanKey, string> = {
  base: "Plan Base (Freemium)",
  cadena_chica: "Plan Cadena Chica",
  cadena_grande: "Plan Cadena Grande",
};

function Paso8({
  data,
  locales,
  docs,
  onGoToStep,
}: {
  data: FormData;
  locales: Local[];
  docs: DocFiles;
  onGoToStep: (s: number) => void;
}) {
  return (
    <div className="space-y-3">
      <AccordionSection title="1. Datos del establecimiento" step={1} onEdit={onGoToStep}>
        <ReviewRow label="Razón social" value={data.razonSocial} />
        <ReviewRow label="Nombre comercial" value={data.nombreComercial} />
        <ReviewRow label="CUIT" value={data.cuit} />
        <ReviewRow label="Condición IVA" value={data.condicionIVA} />
        <ReviewRow label="Tipo" value={data.tipoEstablecimiento} />
      </AccordionSection>

      <AccordionSection title="2. Ubicación" step={2} onEdit={onGoToStep}>
        <ReviewRow
          label="Dirección"
          value={`${data.calle} ${data.numero}${data.piso ? `, ${data.piso}` : ""}`}
        />
        <ReviewRow label="Barrio" value={data.barrio} />
        <ReviewRow label="Localidad" value={data.localidad} />
        <ReviewRow label="Provincia" value={data.provincia} />
        <ReviewRow label="CP" value={data.codigoPostal} />
      </AccordionSection>

      <AccordionSection title="3. Contacto operativo" step={3} onEdit={onGoToStep}>
        <ReviewRow label="Contacto" value={data.nombreContacto} />
        <ReviewRow label="Cargo" value={data.cargoContacto} />
        <ReviewRow label="Email" value={data.emailContacto} />
        <ReviewRow label="Teléfono" value={data.telefonoContacto} />
        <ReviewRow label="Horario" value={data.horarioAtencion} />
      </AccordionSection>

      <AccordionSection title="4. Datos bancarios" step={4} onEdit={onGoToStep}>
        <ReviewRow label="Banco" value={data.banco} />
        <ReviewRow
          label="CBU"
          value={data.cbu.length >= 6 ? `...${data.cbu.slice(-6)}` : data.cbu}
        />
        <ReviewRow label="Titular" value={data.titularCuenta} />
      </AccordionSection>

      <AccordionSection title="5. Locales" step={5} onEdit={onGoToStep}>
        {locales.map((l, i) => (
          <ReviewRow
            key={l.id}
            label={`Local ${i + 1}`}
            value={`${l.nombreLocal} — ${l.direccionLocal}`}
          />
        ))}
      </AccordionSection>

      <AccordionSection title="6. Plan seleccionado" step={6} onEdit={onGoToStep}>
        <ReviewRow
          label="Plan"
          value={
            data.planSeleccionado
              ? PLAN_LABELS[data.planSeleccionado as PlanKey]
              : "—"
          }
        />
      </AccordionSection>

      <AccordionSection title="7. Documentación" step={7} onEdit={onGoToStep}>
        <ReviewRow
          label="Habilitación municipal"
          value={docs.habilitacionMunicipal?.name ?? "No subido"}
        />
        <ReviewRow
          label="Constancia AFIP"
          value={docs.constanciaAfip?.name ?? "No subido"}
        />
        <ReviewRow
          label="DNI titular"
          value={docs.dniTitular?.name ?? "No subido"}
        />
        {docs.fotosFachada.length > 0 && (
          <ReviewRow
            label="Fotos fachada"
            value={`${docs.fotosFachada.length} archivo(s)`}
          />
        )}
      </AccordionSection>
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
      <h2 className="text-2xl font-black text-[#0D0D0D] mb-3">¡Solicitud enviada!</h2>
      <p className="text-gray-500 max-w-sm leading-relaxed">
        Tu solicitud fue enviada con éxito. Un asesor SHUURI se comunicará con
        vos en{" "}
        <strong className="text-[#0D0D0D]">24–48 horas hábiles</strong> para
        completar el proceso.
      </p>
      <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 px-6 py-4 text-sm text-blue-700 max-w-sm">
        Mientras tanto, podés seguir usando SHUURI con funcionalidad limitada
        hasta que tu cuenta sea activada.
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  razonSocial: "", cuit: "", condicionIVA: "", tipoEstablecimiento: "",
  nombreComercial: "", descripcionBreve: "",
  calle: "", numero: "", piso: "", depto: "",
  barrio: "", localidad: "", provincia: "", codigoPostal: "",
  nombreContacto: "", cargoContacto: "", emailContacto: "",
  telefonoContacto: "", whatsappContacto: "", horarioAtencion: "",
  banco: "", tipoCuenta: "", cbu: "", alias: "", titularCuenta: "", cuitTitular: "",
  planSeleccionado: "",
};

const INITIAL_LOCAL = (): Local => ({
  id: crypto.randomUUID(),
  nombreLocal: "", direccionLocal: "",
  capacidadComensales: "", superficieM2: "",
  tieneGas: false, tieneElectricidadTrifasica: false,
  observacionesLocal: "",
});

const STEP_TITLES = [
  "Datos del establecimiento",
  "Ubicación",
  "Contacto operativo",
  "Datos bancarios",
  "Locales",
  "Suscripción",
  "Documentación",
  "Revisión y confirmación",
];

const STEP_ICONS: React.ElementType[] = [
  Building2, MapPin, Users, CreditCard, Building2, Star, FileText, Check,
];

export default function OnboardingRestaurante() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [locales, setLocales] = useState<Local[]>([INITIAL_LOCAL()]);
  const [docs, setDocs] = useState<DocFiles>({
    habilitacionMunicipal: null,
    constanciaAfip: null,
    dniTitular: null,
    logotipoMarca: null,
    fotosFachada: [],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const setField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // ── Validación por paso ───────────────────────────────────────────────────

  function validateStep(s: number): Errors {
    const e: Errors = {};

    if (s === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "Requerido";
      if (!form.nombreComercial.trim()) e.nombreComercial = "Requerido";
      if (!form.cuit.trim()) {
        e.cuit = "Requerido";
      } else {
        const err = validateCuit(form.cuit);
        if (err) e.cuit = err;
      }
      if (!form.condicionIVA) e.condicionIVA = "Seleccioná una opción";
      if (!form.tipoEstablecimiento) e.tipoEstablecimiento = "Seleccioná una opción";
      if (!form.descripcionBreve.trim()) e.descripcionBreve = "Requerido";
    }

    if (s === 2) {
      if (!form.calle.trim()) e.calle = "Requerido";
      if (!form.numero.trim()) e.numero = "Requerido";
      if (!form.barrio.trim()) e.barrio = "Requerido";
      if (!form.localidad.trim()) e.localidad = "Requerido";
      if (!form.provincia) e.provincia = "Seleccioná una provincia";
      if (!form.codigoPostal.trim()) {
        e.codigoPostal = "Requerido";
      } else {
        const err = validateCP(form.codigoPostal);
        if (err) e.codigoPostal = err;
      }
    }

    if (s === 3) {
      if (!form.nombreContacto.trim()) e.nombreContacto = "Requerido";
      if (!form.cargoContacto.trim()) e.cargoContacto = "Requerido";
      if (!form.emailContacto.trim()) {
        e.emailContacto = "Requerido";
      } else {
        const err = validateEmail(form.emailContacto);
        if (err) e.emailContacto = err;
      }
      if (!form.telefonoContacto.trim()) {
        e.telefonoContacto = "Requerido";
      } else {
        const err = validateTelefono(form.telefonoContacto);
        if (err) e.telefonoContacto = err;
      }
      if (!form.horarioAtencion.trim()) e.horarioAtencion = "Requerido";
    }

    if (s === 4) {
      if (!form.banco.trim()) e.banco = "Requerido";
      if (!form.tipoCuenta) e.tipoCuenta = "Seleccioná un tipo";
      if (!form.cbu.trim()) {
        e.cbu = "Requerido";
      } else {
        const err = validateCbu(form.cbu);
        if (err) e.cbu = err;
      }
      if (!form.titularCuenta.trim()) e.titularCuenta = "Requerido";
      if (!form.cuitTitular.trim()) {
        e.cuitTitular = "Requerido";
      } else {
        const err = validateCuit(form.cuitTitular);
        if (err) e.cuitTitular = err;
      }
    }

    if (s === 5) {
      locales.forEach((l) => {
        if (!l.nombreLocal.trim()) e[`local_${l.id}_nombre`] = "Requerido";
        if (!l.direccionLocal.trim()) e[`local_${l.id}_dir`] = "Requerido";
      });
    }

    if (s === 6) {
      if (!form.planSeleccionado) e.planSeleccionado = "Seleccioná un plan";
    }

    if (s === 7) {
      if (!docs.habilitacionMunicipal) e.habilitacionMunicipal = "Archivo requerido";
      if (!docs.constanciaAfip) e.constanciaAfip = "Archivo requerido";
      if (!docs.dniTitular) e.dniTitular = "Archivo requerido";
    }

    return e;
  }

  function handleNext() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
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
    setSending(true);
    await new Promise<void>((r) => setTimeout(r, 1500));
    setSending(false);
    setDone(true);
  }

  // ── Locales ───────────────────────────────────────────────────────────────

  function addLocal() {
    setLocales((prev) => [...prev, INITIAL_LOCAL()]);
  }

  function removeLocal(id: string) {
    setLocales((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLocal(id: string, field: keyof Local, value: string | boolean) {
    setLocales((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`local_${id}_nombre`];
      delete next[`local_${id}_dir`];
      return next;
    });
  }

  // ── Docs ──────────────────────────────────────────────────────────────────

  function setDoc(key: DocKey, f: File) {
    setDocs((prev) => ({ ...prev, [key]: f }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function clearDoc(key: DocKey) {
    setDocs((prev) => ({ ...prev, [key]: null }));
  }

  function addFoto(f: File) {
    setDocs((prev) => ({ ...prev, fotosFachada: [...prev.fotosFachada, f] }));
  }

  function removeFoto(idx: number) {
    setDocs((prev) => ({
      ...prev,
      fotosFachada: prev.fotosFachada.filter((_, i) => i !== idx),
    }));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (done) return <Exito />;

  const pct = Math.round((step / TOTAL_STEPS) * 100);
  const StepIcon = STEP_ICONS[step - 1];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      {/* HEADER BRAND */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-black text-xl text-[#2698D1] tracking-tight">SHUURI</span>
          <span className="text-xs text-gray-400 font-medium">
            / Registro de restaurante
          </span>
        </div>

        {/* PROGRESO */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <StepIcon size={16} className="text-[#2698D1]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">
                  Paso {step} de {TOTAL_STEPS}
                </p>
                <p className="font-bold text-[#0D0D0D] text-sm leading-tight">
                  {STEP_TITLES[step - 1]}
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-[#2698D1]">{pct}%</span>
          </div>

          {/* Barra animada */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2698D1] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Dots de paso */}
          <div className="flex justify-between mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i + 1 < step
                    ? "bg-[#2698D1]"
                    : i + 1 === step
                    ? "bg-[#2698D1] ring-2 ring-[#2698D1]/30"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENIDO DEL PASO */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {step === 1 && (
          <Paso1 data={form} onChange={setField} errors={errors} />
        )}
        {step === 2 && (
          <Paso2 data={form} onChange={setField} errors={errors} />
        )}
        {step === 3 && (
          <Paso3 data={form} onChange={setField} errors={errors} />
        )}
        {step === 4 && (
          <Paso4 data={form} onChange={setField} errors={errors} />
        )}
        {step === 5 && (
          <Paso5
            locales={locales}
            onAdd={addLocal}
            onUpdate={updateLocal}
            onRemove={removeLocal}
            errors={errors}
          />
        )}
        {step === 6 && (
          <Paso6
            value={form.planSeleccionado as PlanKey | ""}
            onChange={(v) => setField("planSeleccionado", v)}
            error={errors.planSeleccionado}
          />
        )}
        {step === 7 && (
          <Paso7
            docs={docs}
            onSetDoc={setDoc}
            onClearDoc={clearDoc}
            onAddFoto={addFoto}
            onRemoveFoto={removeFoto}
            errors={errors}
          />
        )}
        {step === 8 && (
          <Paso8
            data={form}
            locales={locales}
            docs={docs}
            onGoToStep={handleGoToStep}
          />
        )}
      </div>

      {/* NAVEGACIÓN */}
      <div className="w-full max-w-2xl mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#2698D1] text-white text-sm font-bold hover:bg-[#1f84b8] transition shadow-sm"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#2698D1] text-white text-sm font-bold hover:bg-[#1f84b8] transition shadow-sm disabled:opacity-60"
          >
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirmar y enviar solicitud
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
