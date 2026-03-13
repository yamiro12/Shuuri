"use client";

import React, { useState, useCallback, useRef, KeyboardEvent } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Upload,
  X,
  Building2,
  Phone,
  Truck,
  Package,
  BarChart3,
  CreditCard,
  FileText,
  CheckCircle2,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Tag,
} from "lucide-react";
import {
  VALIDACIONES,
  LABELS_ZONA_COBERTURA,
  RUBRO_LABELS,
  TODOS_LOS_RUBROS,
} from "@/types/shuuri";
import type { CondicionIVA, ZonaCobertura, Rubro } from "@/types/shuuri";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const PROVINCIAS = [
  "Buenos Aires","CABA","Catamarca","Chaco","Chubut","Córdoba",
  "Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja",
  "Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan",
  "San Luis","Santa Cruz","Santa Fe","Santiago del Estero",
  "Tierra del Fuego","Tucumán",
];

const TIPO_PROVEEDOR_LABELS: Record<string, string> = {
  fabricante:           "Fabricante",
  distribuidor_oficial: "Distribuidor oficial",
  importador:           "Importador",
  mayorista:            "Mayorista",
  service_autorizado:   "Service autorizado",
};
const TIPO_PROVEEDOR_KEYS = Object.keys(TIPO_PROVEEDOR_LABELS);

const CONDICION_IVA_OPTIONS: { value: CondicionIVA; label: string }[] = [
  { value: "responsable_inscripto", label: "Responsable Inscripto" },
  { value: "monotributista",        label: "Monotributista" },
  { value: "exento",                label: "Exento" },
];

const TRANSPORTISTAS_OPS = [
  "OCA","Andreani","Correo Argentino","Transporte Propio","Rapipago Envíos","Otro",
];

const CANT_SKUS_OPS = [
  { value: "1-50",     label: "1 – 50 productos" },
  { value: "51-200",   label: "51 – 200 productos" },
  { value: "201-500",  label: "201 – 500 productos" },
  { value: "501-2000", label: "501 – 2000 productos" },
  { value: "2001+",    label: "Más de 2000 productos" },
];

const FORMAS_PAGO_OPS = [
  "Transferencia bancaria",
  "Cheque",
  "Efectivo",
  "Cuenta corriente 30 días",
  "Cuenta corriente 60 días",
  "Tarjeta corporativa",
];

const ZONAS_COBERTURA = Object.entries(LABELS_ZONA_COBERTURA) as [ZonaCobertura, string][];

const TOTAL_STEPS = 7;

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type DocFiles = {
  constanciaAfip:          File | null;
  estatutoSocietario:      File | null;
  certificadoDistribuidor: File[];
  logotipoEmpresa:         File | null;
  catalogoGeneral:         File | null;
};

type FormData = {
  // Paso 1
  razonSocial: string;
  nombreComercial: string;
  cuit: string;
  condicionIVA: CondicionIVA | "";
  tipoProveedor: string[];
  anoFundacion: string;
  descripcionEmpresa: string;
  // Paso 2
  nombreContacto: string;
  cargoContacto: string;
  emailComercial: string;
  telefonoComercial: string;
  whatsappPedidos: string;
  emailAdministrativo: string;
  sitioWeb: string;
  // Paso 3
  zonasDespacho: ZonaCobertura[];
  despachoDesde: string;
  transportistas: string[];
  tiempoPreparacionDias: string;
  retiroEnDeposito: boolean;
  direccionDeposito: string;
  // Paso 4
  rubrosProvistos: Rubro[];
  marcasRepresentadas: string[];
  cantidadSKUsAproximada: string;
  tieneStockPropio: boolean;
  observacionesCatalogo: string;
  // Paso 5
  descuentoVolumenDisponible: boolean;
  plazoEntregaStandardDias: string;
  formasPago: string[];
  aceptaDevolucionDefectoFabrica: boolean;
  politicaDevolucion: string;
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

// ─── COMPONENTES ──────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
      <AlertCircle size={12} className="shrink-0" />{msg}
    </p>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function InputField({ label, value, onChange, error, placeholder, required, type = "text", maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; required?: boolean; type?: string; maxLength?: number;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`} />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({ label, value, onChange, error, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] transition ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`}>
        <option value="">Seleccioná una opción</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

function Toggle({ label, sublabel, value, onChange }: {
  label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full rounded-xl border border-gray-200 px-4 py-3 hover:border-gray-300 transition">
      <div className="text-left">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      {value
        ? <ToggleRight size={28} className="text-[#2698D1]" />
        : <ToggleLeft size={28} className="text-gray-300" />
      }
    </button>
  );
}

function CheckPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
        active ? "bg-[#2698D1] border-[#2698D1] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
      }`}>
      {active && <Check size={11} className="inline mr-1" />}{label}
    </button>
  );
}

function FileSlot({ label, required, file, onSet, onClear, error }: {
  label: string; required?: boolean; file: File | null;
  onSet: (f: File) => void; onClear: () => void; error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label required={required}>{label}</Label>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-green-700 truncate">
            <Check size={14} /><span className="truncate">{file.name}</span>
            <span className="text-xs text-green-500 shrink-0">({Math.round(file.size / 1024)} KB)</span>
          </div>
          <button type="button" onClick={onClear} className="text-green-500 hover:text-red-500 ml-2 shrink-0"><X size={14} /></button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className={`w-full flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-sm transition hover:bg-gray-50 ${
            error ? "border-red-300 text-red-400" : "border-gray-300 text-gray-400"
          }`}>
          <Upload size={15} /> Subir archivo (.pdf, .jpg, .png)
        </button>
      )}
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onSet(f); e.target.value = ""; }} />
      <FieldError msg={error} />
    </div>
  );
}

// ─── TAG INPUT ────────────────────────────────────────────────────────────────

function TagInput({ tags, onAdd, onRemove, error, placeholder }: {
  tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void;
  error?: string; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (v && !tags.includes(v)) { onAdd(v); setInput(""); }
  }
  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); add(); }
  }
  return (
    <div>
      <div className={`min-h-[42px] w-full rounded-lg border px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-[#2698D1] transition ${
        error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
      }`}>
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
            <Tag size={10} />{t}
            <button type="button" onClick={() => onRemove(t)} className="hover:text-red-500"><X size={10} /></button>
          </span>
        ))}
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
          onBlur={add}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none" />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── PASO 1: DATOS DE LA EMPRESA ─────────────────────────────────────────────

function Paso1({ data, onChange, onToggle, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void;
  onToggle: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Razón social" value={data.razonSocial} onChange={(v) => onChange("razonSocial", v)}
          error={errors.razonSocial} placeholder="La Empresa S.R.L." required />
        <InputField label="Nombre comercial" value={data.nombreComercial} onChange={(v) => onChange("nombreComercial", v)}
          error={errors.nombreComercial} placeholder="Nombre en el Marketplace" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="CUIT" value={data.cuit} onChange={(v) => onChange("cuit", v)}
          error={errors.cuit} placeholder="XX-XXXXXXXX-X" required />
        <SelectField label="Condición IVA" value={data.condicionIVA} onChange={(v) => onChange("condicionIVA", v)}
          error={errors.condicionIVA} options={CONDICION_IVA_OPTIONS} required />
      </div>

      <div>
        <Label required>Tipo de proveedor (mínimo 1)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {TIPO_PROVEEDOR_KEYS.map((k) => (
            <CheckPill key={k} label={TIPO_PROVEEDOR_LABELS[k]} active={data.tipoProveedor.includes(k)}
              onClick={() => onToggle("tipoProveedor", k)} />
          ))}
        </div>
        <FieldError msg={errors.tipoProveedor} />
      </div>

      <InputField label="Año de fundación (opcional)" value={data.anoFundacion}
        onChange={(v) => onChange("anoFundacion", v.replace(/\D/g, "").slice(0, 4))}
        placeholder="2005" maxLength={4} />

      <div>
        <Label required>Descripción de la empresa</Label>
        <textarea value={data.descripcionEmpresa} onChange={(e) => onChange("descripcionEmpresa", e.target.value)}
          maxLength={300} rows={3} placeholder="Contanos qué productos ofrecen, en qué rubros se especializan..."
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none transition ${
            errors.descripcionEmpresa ? "border-red-400 bg-red-50" : "border-gray-300"
          }`} />
        <div className="flex justify-between mt-0.5">
          <FieldError msg={errors.descripcionEmpresa} />
          <span className="text-xs text-gray-400 ml-auto">{data.descripcionEmpresa.length}/300</span>
        </div>
      </div>
    </div>
  );
}

// ─── PASO 2: CONTACTO COMERCIAL ───────────────────────────────────────────────

function Paso2({ data, onChange, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void; errors: Errors;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Nombre del contacto" value={data.nombreContacto} onChange={(v) => onChange("nombreContacto", v)}
          error={errors.nombreContacto} placeholder="Ana López" required />
        <InputField label="Cargo" value={data.cargoContacto} onChange={(v) => onChange("cargoContacto", v)}
          error={errors.cargoContacto} placeholder="Gerente Comercial" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Email comercial" value={data.emailComercial} onChange={(v) => onChange("emailComercial", v)}
          error={errors.emailComercial} placeholder="ventas@empresa.com" required type="email" />
        <InputField label="Teléfono comercial" value={data.telefonoComercial} onChange={(v) => onChange("telefonoComercial", v)}
          error={errors.telefonoComercial} placeholder="11 1234-5678" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="WhatsApp pedidos (opcional)" value={data.whatsappPedidos} onChange={(v) => onChange("whatsappPedidos", v)}
          placeholder="11 1234-5678" />
        <InputField label="Email administrativo (opcional)" value={data.emailAdministrativo}
          onChange={(v) => onChange("emailAdministrativo", v)} placeholder="admin@empresa.com" type="email" />
      </div>
      <InputField label="Sitio web (opcional)" value={data.sitioWeb} onChange={(v) => onChange("sitioWeb", v)}
        placeholder="https://www.empresa.com" />
    </div>
  );
}

// ─── PASO 3: COBERTURA OPERATIVA ─────────────────────────────────────────────

function Paso3({ data, onChange, onToggle, onSetBool, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void;
  onToggle: (f: keyof FormData, v: string) => void;
  onSetBool: (f: keyof FormData, v: boolean) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Zonas de despacho (mínimo 1)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {ZONAS_COBERTURA.map(([key, label]) => (
            <CheckPill key={key} label={label} active={data.zonasDespacho.includes(key)}
              onClick={() => onToggle("zonasDespacho", key)} />
          ))}
        </div>
        <FieldError msg={errors.zonasDespacho} />
      </div>

      <InputField label="Ciudad / localidad de despacho" value={data.despachoDesde}
        onChange={(v) => onChange("despachoDesde", v)}
        error={errors.despachoDesde} placeholder="Avellaneda, Buenos Aires" required />

      <div>
        <Label>Transportistas disponibles</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {TRANSPORTISTAS_OPS.map((t) => (
            <CheckPill key={t} label={t} active={data.transportistas.includes(t)}
              onClick={() => onToggle("transportistas", t)} />
          ))}
        </div>
      </div>

      <InputField label="Tiempo de preparación (días hábiles)" value={data.tiempoPreparacionDias}
        onChange={(v) => onChange("tiempoPreparacionDias", v.replace(/\D/g, ""))}
        error={errors.tiempoPreparacionDias}
        placeholder="Ej: 2" type="number" required />

      <Toggle label="Retiro en depósito disponible" sublabel="¿Los clientes pueden retirar personalmente?"
        value={data.retiroEnDeposito} onChange={(v) => onSetBool("retiroEnDeposito", v)} />

      {data.retiroEnDeposito && (
        <InputField label="Dirección del depósito" value={data.direccionDeposito}
          onChange={(v) => onChange("direccionDeposito", v)}
          error={errors.direccionDeposito} placeholder="Av. Industrial 1234, Avellaneda" required />
      )}
    </div>
  );
}

// ─── PASO 4: CATÁLOGO INICIAL ─────────────────────────────────────────────────

function Paso4({ data, onChange, onToggle, onAddMarca, onRemoveMarca, onSetBool, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void;
  onToggle: (f: keyof FormData, v: string) => void;
  onAddMarca: (m: string) => void; onRemoveMarca: (m: string) => void;
  onSetBool: (f: keyof FormData, v: boolean) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Rubros que provisionan (mínimo 1)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {TODOS_LOS_RUBROS.map((r) => (
            <CheckPill key={r} label={RUBRO_LABELS[r]} active={data.rubrosProvistos.includes(r)}
              onClick={() => onToggle("rubrosProvistos", r)} />
          ))}
        </div>
        <FieldError msg={errors.rubrosProvistos} />
      </div>

      <div>
        <Label required>Marcas representadas (mínimo 1)</Label>
        <p className="text-xs text-gray-400 mb-1">Escribí una marca y presioná Enter para agregar</p>
        <TagInput tags={data.marcasRepresentadas} onAdd={onAddMarca} onRemove={onRemoveMarca}
          error={errors.marcasRepresentadas} placeholder="Ej: Rational, True, Winterhalter..." />
      </div>

      <SelectField label="Cantidad de SKUs aproximada" value={data.cantidadSKUsAproximada}
        onChange={(v) => onChange("cantidadSKUsAproximada", v)}
        error={errors.cantidadSKUsAproximada}
        options={CANT_SKUS_OPS} required />

      <Toggle label="¿Tienen stock propio?" sublabel="Disponibilidad inmediata sin intermediarios"
        value={data.tieneStockPropio} onChange={(v) => onSetBool("tieneStockPropio", v)} />

      <div>
        <Label>Observaciones del catálogo (opcional)</Label>
        <textarea value={data.observacionesCatalogo} onChange={(e) => onChange("observacionesCatalogo", e.target.value)}
          rows={3} placeholder="Productos estacionales, restricciones de stock, mínimos de pedido..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none" />
      </div>
    </div>
  );
}

// ─── PASO 5: CONDICIONES COMERCIALES ─────────────────────────────────────────

function Paso5({ data, onChange, onToggle, onSetBool, errors }: {
  data: FormData; onChange: (f: keyof FormData, v: string) => void;
  onToggle: (f: keyof FormData, v: string) => void;
  onSetBool: (f: keyof FormData, v: boolean) => void;
  errors: Errors;
}) {
  return (
    <div className="space-y-5">
      <Toggle label="¿Ofrecen descuento por volumen?" sublabel="Precio escalonado según cantidad del pedido"
        value={data.descuentoVolumenDisponible} onChange={(v) => onSetBool("descuentoVolumenDisponible", v)} />

      <InputField label="Plazo de entrega estándar (días hábiles)" value={data.plazoEntregaStandardDias}
        onChange={(v) => onChange("plazoEntregaStandardDias", v.replace(/\D/g, ""))}
        error={errors.plazoEntregaStandardDias} placeholder="Ej: 3" type="number" required />

      <div>
        <Label>Formas de pago aceptadas</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {FORMAS_PAGO_OPS.map((f) => (
            <CheckPill key={f} label={f} active={data.formasPago.includes(f)}
              onClick={() => onToggle("formasPago", f)} />
          ))}
        </div>
      </div>

      <Toggle label="¿Aceptan devoluciones por defecto de fábrica?"
        sublabel="Política de garantía y reposición"
        value={data.aceptaDevolucionDefectoFabrica}
        onChange={(v) => onSetBool("aceptaDevolucionDefectoFabrica", v)} />

      {data.aceptaDevolucionDefectoFabrica && (
        <div>
          <Label>Política de devolución (opcional)</Label>
          <textarea value={data.politicaDevolucion} onChange={(e) => onChange("politicaDevolucion", e.target.value)}
            rows={3} placeholder="Plazo, condiciones, proceso de devolución..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none" />
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
        <SelectField label="Tipo de cuenta" value={data.tipoCuenta} onChange={(v) => onChange("tipoCuenta", v)}
          error={errors.tipoCuenta}
          options={[{ value: "caja_ahorro", label: "Caja de ahorro" }, { value: "cuenta_corriente", label: "Cuenta corriente" }]}
          required />
      </div>
      <InputField label="CBU / CVU" value={data.cbu}
        onChange={(v) => onChange("cbu", v.replace(/\D/g, "").slice(0, 22))}
        error={errors.cbu} placeholder="22 dígitos numéricos" required maxLength={22} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Alias CBU (opcional)" value={data.alias}
          onChange={(v) => onChange("alias", v)} placeholder="mi.alias.banco" />
        <InputField label="Titular de la cuenta" value={data.titularCuenta}
          onChange={(v) => onChange("titularCuenta", v)}
          error={errors.titularCuenta} placeholder="Nombre del titular" required />
      </div>
      <InputField label="CUIT del titular" value={data.cuitTitular} onChange={(v) => onChange("cuitTitular", v)}
        error={errors.cuitTitular} placeholder="XX-XXXXXXXX-X" required />
    </div>
  );
}

// ─── PASO 7: DOCUMENTACIÓN ────────────────────────────────────────────────────

type SingleDocKey = "constanciaAfip" | "estatutoSocietario" | "logotipoEmpresa" | "catalogoGeneral";

const SINGLE_DOCS: { key: SingleDocKey; label: string; required: boolean }[] = [
  { key: "constanciaAfip",     label: "Constancia AFIP",             required: true },
  { key: "estatutoSocietario", label: "Estatuto societario (SRL/SA)", required: false },
  { key: "logotipoEmpresa",    label: "Logotipo (PNG o JPG)",         required: false },
  { key: "catalogoGeneral",    label: "Catálogo de productos (PDF)",  required: false },
];

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
          <button type="button" onClick={() => onEdit(step)} className="text-xs text-[#2698D1] hover:underline pt-1 block">
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
      <span className="font-medium text-[#0D0D0D] text-xs text-right max-w-[60%] truncate">{value || "—"}</span>
    </div>
  );
}

function Paso7({ docs, onSetDoc, onClearDoc, onAddCertDist, onRemoveCertDist, errors, data, onGoToStep }: {
  docs: DocFiles;
  onSetDoc: (k: SingleDocKey, f: File) => void;
  onClearDoc: (k: SingleDocKey) => void;
  onAddCertDist: (f: File) => void;
  onRemoveCertDist: (i: number) => void;
  errors: Errors;
  data: FormData;
  onGoToStep: (s: number) => void;
}) {
  const certRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#0D0D0D]">Documentos</h3>
        {SINGLE_DOCS.map((d) => (
          <FileSlot key={d.key} label={d.label} required={d.required}
            file={docs[d.key]} onSet={(f) => onSetDoc(d.key, f)}
            onClear={() => onClearDoc(d.key)} error={errors[d.key]} />
        ))}

        {/* Certificados distribuidor múltiple */}
        <div>
          <Label>Certificados de distribuidor oficial (opcional)</Label>
          {docs.certificadoDistribuidor.length > 0 && (
            <div className="space-y-2 mb-2">
              {docs.certificadoDistribuidor.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-600 truncate">{f.name}</span>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className="text-xs text-gray-400">{Math.round(f.size / 1024)} KB</span>
                    <button type="button" onClick={() => onRemoveCertDist(i)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => certRef.current?.click()}
            className="flex items-center gap-2 text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-lg px-3 py-3 w-full hover:bg-gray-50 transition">
            <Upload size={15} /> Agregar certificado de distribución
          </button>
          <input ref={certRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden"
            onChange={(e) => { Array.from(e.target.files ?? []).forEach(onAddCertDist); e.target.value = ""; }} />
        </div>
      </div>

      {/* Resumen */}
      <div className="pt-2 space-y-3">
        <h3 className="text-sm font-bold text-[#0D0D0D]">Revisión de datos</h3>
        <AccordionSection title="1. Datos de la empresa" step={1} onEdit={onGoToStep}>
          <ReviewRow label="Razón social" value={data.razonSocial} />
          <ReviewRow label="Nombre comercial" value={data.nombreComercial} />
          <ReviewRow label="CUIT" value={data.cuit} />
          <ReviewRow label="Tipo proveedor" value={data.tipoProveedor.map(k => TIPO_PROVEEDOR_LABELS[k]).join(", ")} />
        </AccordionSection>
        <AccordionSection title="2. Contacto comercial" step={2} onEdit={onGoToStep}>
          <ReviewRow label="Contacto" value={`${data.nombreContacto} — ${data.cargoContacto}`} />
          <ReviewRow label="Email" value={data.emailComercial} />
          <ReviewRow label="Teléfono" value={data.telefonoComercial} />
        </AccordionSection>
        <AccordionSection title="3. Cobertura operativa" step={3} onEdit={onGoToStep}>
          <ReviewRow label="Zonas" value={data.zonasDespacho.map(z => LABELS_ZONA_COBERTURA[z]).join(", ")} />
          <ReviewRow label="Despacho desde" value={data.despachoDesde} />
          <ReviewRow label="Preparación" value={`${data.tiempoPreparacionDias} días`} />
        </AccordionSection>
        <AccordionSection title="4. Catálogo" step={4} onEdit={onGoToStep}>
          <ReviewRow label="Rubros" value={data.rubrosProvistos.map(r => RUBRO_LABELS[r]).join(", ")} />
          <ReviewRow label="Marcas" value={data.marcasRepresentadas.join(", ")} />
          <ReviewRow label="SKUs aprox." value={data.cantidadSKUsAproximada} />
        </AccordionSection>
        <AccordionSection title="5. Condiciones comerciales" step={5} onEdit={onGoToStep}>
          <ReviewRow label="Plazo entrega estándar" value={`${data.plazoEntregaStandardDias} días`} />
          <ReviewRow label="Formas de pago" value={data.formasPago.join(", ")} />
          <ReviewRow label="Desc. por volumen" value={data.descuentoVolumenDisponible ? "Sí" : "No"} />
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

// ─── PANTALLA ÉXITO ───────────────────────────────────────────────────────────

function Exito() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 size={44} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-[#0D0D0D] mb-3">¡Solicitud recibida!</h2>
      <p className="text-gray-500 max-w-sm leading-relaxed">
        Un asesor SHUURI revisará tu perfil en{" "}
        <strong className="text-[#0D0D0D]">48–72 horas hábiles</strong> para
        activar tu cuenta en el Marketplace.
      </p>
      <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 px-6 py-4 text-sm text-blue-700 max-w-sm">
        Una vez aprobado podrás cargar tu catálogo completo, gestionar pedidos y
        acceder a las métricas de ventas.
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  razonSocial: "", nombreComercial: "", cuit: "", condicionIVA: "",
  tipoProveedor: [], anoFundacion: "", descripcionEmpresa: "",
  nombreContacto: "", cargoContacto: "", emailComercial: "", telefonoComercial: "",
  whatsappPedidos: "", emailAdministrativo: "", sitioWeb: "",
  zonasDespacho: [], despachoDesde: "", transportistas: [],
  tiempoPreparacionDias: "", retiroEnDeposito: false, direccionDeposito: "",
  rubrosProvistos: [], marcasRepresentadas: [], cantidadSKUsAproximada: "",
  tieneStockPropio: false, observacionesCatalogo: "",
  descuentoVolumenDisponible: false, plazoEntregaStandardDias: "",
  formasPago: [], aceptaDevolucionDefectoFabrica: false, politicaDevolucion: "",
  banco: "", tipoCuenta: "", cbu: "", alias: "", titularCuenta: "", cuitTitular: "",
};

const STEP_TITLES = [
  "Datos de la empresa",
  "Contacto comercial",
  "Cobertura operativa",
  "Catálogo inicial",
  "Condiciones comerciales",
  "Datos bancarios",
  "Documentación y confirmación",
];

const STEP_ICONS: React.ElementType[] = [
  Building2, Phone, Truck, Package, BarChart3, CreditCard, FileText,
];

export default function OnboardingProveedor() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [docs, setDocs] = useState<DocFiles>({
    constanciaAfip: null, estatutoSocietario: null,
    certificadoDistribuidor: [], logotipoEmpresa: null, catalogoGeneral: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // ── Setters ───────────────────────────────────────────────────────────────

  const onChange = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const onSetBool = useCallback((field: keyof FormData, value: boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const onToggle = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => {
      const curr = prev[field] as string[];
      return {
        ...prev,
        [field]: curr.includes(value) ? curr.filter((v) => v !== value) : [...curr, value],
      };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  function addMarca(m: string) {
    setForm((prev) => ({ ...prev, marcasRepresentadas: [...prev.marcasRepresentadas, m] }));
    setErrors((prev) => ({ ...prev, marcasRepresentadas: undefined }));
  }
  function removeMarca(m: string) {
    setForm((prev) => ({ ...prev, marcasRepresentadas: prev.marcasRepresentadas.filter((x) => x !== m) }));
  }

  // ── Docs ──────────────────────────────────────────────────────────────────

  function setDoc(key: SingleDocKey, f: File) {
    setDocs((prev) => ({ ...prev, [key]: f }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
  function clearDoc(key: SingleDocKey) { setDocs((prev) => ({ ...prev, [key]: null })); }
  function addCertDist(f: File) { setDocs((prev) => ({ ...prev, certificadoDistribuidor: [...prev.certificadoDistribuidor, f] })); }
  function removeCertDist(i: number) { setDocs((prev) => ({ ...prev, certificadoDistribuidor: prev.certificadoDistribuidor.filter((_, j) => j !== i) })); }

  // ── Validación ────────────────────────────────────────────────────────────

  function validateStep(s: number): Errors {
    const e: Errors = {};

    if (s === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "Requerido";
      if (!form.nombreComercial.trim()) e.nombreComercial = "Requerido";
      if (!form.cuit.trim()) { e.cuit = "Requerido"; }
      else { const err = validateCuit(form.cuit); if (err) e.cuit = err; }
      if (!form.condicionIVA) e.condicionIVA = "Seleccioná una opción";
      if (form.tipoProveedor.length === 0) e.tipoProveedor = "Seleccioná al menos 1";
      if (!form.descripcionEmpresa.trim()) e.descripcionEmpresa = "Requerido";
    }
    if (s === 2) {
      if (!form.nombreContacto.trim()) e.nombreContacto = "Requerido";
      if (!form.cargoContacto.trim()) e.cargoContacto = "Requerido";
      if (!form.emailComercial.trim()) { e.emailComercial = "Requerido"; }
      else { const err = validateEmail(form.emailComercial); if (err) e.emailComercial = err; }
      if (!form.telefonoComercial.trim()) { e.telefonoComercial = "Requerido"; }
      else { const err = validateTelefono(form.telefonoComercial); if (err) e.telefonoComercial = err; }
    }
    if (s === 3) {
      if (form.zonasDespacho.length === 0) e.zonasDespacho = "Seleccioná al menos 1 zona";
      if (!form.despachoDesde.trim()) e.despachoDesde = "Requerido";
      if (!form.tiempoPreparacionDias.trim()) e.tiempoPreparacionDias = "Requerido";
      if (form.retiroEnDeposito && !form.direccionDeposito.trim()) e.direccionDeposito = "Ingresá la dirección del depósito";
    }
    if (s === 4) {
      if (form.rubrosProvistos.length === 0) e.rubrosProvistos = "Seleccioná al menos 1 rubro";
      if (form.marcasRepresentadas.length === 0) e.marcasRepresentadas = "Ingresá al menos 1 marca";
      if (!form.cantidadSKUsAproximada) e.cantidadSKUsAproximada = "Seleccioná un rango";
    }
    if (s === 5) {
      if (!form.plazoEntregaStandardDias.trim()) e.plazoEntregaStandardDias = "Requerido";
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
  function handleBack() { setErrors({}); setStep((s) => Math.max(s - 1, 1)); }
  function handleGoToStep(s: number) { setErrors({}); setStep(s); }

  async function handleSubmit() {
    const e = validateStep(7);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSending(true);
    await new Promise<void>((r) => setTimeout(r, 1500));
    setSending(false);
    setDone(true);
  }

  if (done) return <Exito />;

  const pct = Math.round((step / TOTAL_STEPS) * 100);
  const StepIcon = STEP_ICONS[step - 1];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center px-4 py-8">
      {/* HEADER */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-black text-xl text-[#2698D1] tracking-tight">SHUURI</span>
          <span className="text-xs text-gray-400 font-medium">/ Registro de proveedor</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <StepIcon size={16} className="text-[#2698D1]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Paso {step} de {TOTAL_STEPS}</p>
                <p className="font-bold text-[#0D0D0D] text-sm leading-tight">{STEP_TITLES[step - 1]}</p>
              </div>
            </div>
            <span className="text-sm font-black text-[#2698D1]">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2698D1] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
        {step === 1 && <Paso1 data={form} onChange={onChange} onToggle={onToggle} errors={errors} />}
        {step === 2 && <Paso2 data={form} onChange={onChange} errors={errors} />}
        {step === 3 && <Paso3 data={form} onChange={onChange} onToggle={onToggle} onSetBool={onSetBool} errors={errors} />}
        {step === 4 && (
          <Paso4 data={form} onChange={onChange} onToggle={onToggle}
            onAddMarca={addMarca} onRemoveMarca={removeMarca}
            onSetBool={onSetBool} errors={errors} />
        )}
        {step === 5 && <Paso5 data={form} onChange={onChange} onToggle={onToggle} onSetBool={onSetBool} errors={errors} />}
        {step === 6 && <Paso6 data={form} onChange={onChange} errors={errors} />}
        {step === 7 && (
          <Paso7 docs={docs} onSetDoc={setDoc} onClearDoc={clearDoc}
            onAddCertDist={addCertDist} onRemoveCertDist={removeCertDist}
            errors={errors} data={form} onGoToStep={handleGoToStep} />
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
            {sending ? (<><Loader2 size={16} className="animate-spin" /> Enviando...</>)
              : (<><Check size={16} /> Confirmar y enviar solicitud</>)}
          </button>
        )}
      </div>
    </div>
  );
}
