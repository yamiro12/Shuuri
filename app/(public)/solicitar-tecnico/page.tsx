"use client";
import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Flame, Thermometer, Droplets, Coffee, Snowflake, Wind, Monitor, Settings2,
  Camera, CheckCircle2, AlertTriangle, Clock, X, ArrowRight, ArrowLeft,
  Loader2, ShieldCheck, Package, FileText, Wrench, ShoppingBag, Check,
} from 'lucide-react';
import { getSugerenciasRepuesto, type RepuestoSugerido } from '@/lib/repuestos-sugeridos';
import type { MarketplaceProduct } from '@/data/marketplace-mock';
import { MarcaSearch, ModeloSearch } from '@/components/shared/CatalogSearch';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Urgencia = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type Horario  = 'manana' | 'mediodia' | 'tarde' | 'sin_preferencia';

interface FormState {
  rubro:       string;
  marca:       string;
  modelo:      string;
  direccion:   string;
  descripcion: string;
  foto:        File | null;
  fotoPreview: string | null;
  reincidente: boolean;
  ultimaVez:   string;
  urgencia:    Urgencia | '';
  horario:     Horario  | '';
  fecha:       string;
  nombre:      string;
  whatsapp:    string;
  email:       string;
  empresa:     string;
}

const INITIAL: FormState = {
  rubro: '', marca: '', modelo: '', direccion: '',
  descripcion: '', foto: null, fotoPreview: null,
  reincidente: false, ultimaVez: '',
  urgencia: '', horario: '', fecha: '',
  nombre: '', whatsapp: '', email: '', empresa: '',
};

// ─── DATOS ────────────────────────────────────────────────────────────────────

const RUBROS = [
  { id: 'coccion',        label: 'Cocción',         icon: Flame       },
  { id: 'refrigeracion',  label: 'Refrigeración',   icon: Thermometer },
  { id: 'lavado',         label: 'Lavado',          icon: Droplets    },
  { id: 'cafeteria',      label: 'Cafetería',       icon: Coffee      },
  { id: 'maq_hielo',      label: 'Máq. de hielo',   icon: Snowflake   },
  { id: 'climatizacion',  label: 'Climatización',   icon: Wind        },
  { id: 'tecnologia',     label: 'Tecnología',      icon: Monitor     },
  { id: 'especializados', label: 'Especializados',  icon: Settings2   },
];

const URGENCIAS = [
  {
    id:    'BAJA' as Urgencia,
    label: 'Baja',
    desc:  'Puede esperar algunos días',
    cls:   'border-gray-200 hover:border-gray-400',
    selCls:'border-gray-500 bg-gray-50',
    badge: 'bg-gray-100 text-gray-600',
  },
  {
    id:    'MEDIA' as Urgencia,
    label: 'Media',
    desc:  'Esta semana si es posible',
    cls:   'border-gray-200 hover:border-yellow-400',
    selCls:'border-yellow-500 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  {
    id:    'ALTA' as Urgencia,
    label: 'Alta',
    desc:  'Hoy o mañana',
    cls:   'border-gray-200 hover:border-orange-400',
    selCls:'border-orange-500 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    id:    'CRITICA' as Urgencia,
    label: 'Crítica',
    desc:  'Ahora mismo, la cocina parada',
    cls:   'border-gray-200 hover:border-red-300',
    selCls:'border-red-500 bg-red-50 shadow-md shadow-red-100',
    badge: 'bg-red-500 text-white animate-pulse',
  },
] as const;

const HORARIOS: { id: Horario; label: string }[] = [
  { id: 'manana',          label: 'Mañana (8-12)'    },
  { id: 'mediodia',        label: 'Mediodía (12-15)' },
  { id: 'tarde',           label: 'Tarde (15-18)'    },
  { id: 'sin_preferencia', label: 'Sin preferencia'  },
];

// ─── BARRA DE PROGRESO (5 pasos) ──────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pasos = ['Equipo', 'Falla', 'Repuesto', 'Urgencia', 'Contacto'];
  const pct   = ((step - 1) / (pasos.length - 1)) * 100;
  return (
    <div className="mb-8">
      <div className="relative h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#2698D1] rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-start">
        {pasos.map((label, i) => {
          const num    = i + 1;
          const active = num === step;
          const done   = num < step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center flex-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  done   ? 'bg-green-500 text-white shadow-sm' :
                  active ? 'bg-[#2698D1] text-white shadow-md shadow-[#2698D1]/30 scale-110' :
                           'bg-gray-100 text-gray-400'
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : num}
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 hidden sm:block transition-colors duration-300 ${
                  active ? 'text-[#2698D1]' : done ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Mapping marketplace rubros → shuuri rubro (para filtrar el catálogo)
const RUBRO_TO_SHUURI: Record<string, string> = {
  coccion:       'calor_comercial',
  refrigeracion: 'frio_comercial',
  lavado:        'lavado_comercial',
  cafeteria:     'cafe_bebidas',
  maq_hielo:     'frio_comercial',
  climatizacion: 'climatizacion_hvac',
  tecnologia:    'pos_it',
};

// ─── STEP 1: EQUIPO ───────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const [marcaId, setMarcaId] = useState('');
  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0D0D0D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";
  const rubroShuuri = RUBRO_TO_SHUURI[form.rubro] as string | undefined;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#0D0D0D] mb-3">¿Qué equipo falló? *</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RUBROS.map(({ id, label, icon: Icon }) => {
            const selected = form.rubro === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setForm(p => ({ ...p, rubro: id, marca: '', modelo: '' }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-150 ${
                  selected
                    ? 'border-[#2698D1] bg-[#2698D1]/8 text-[#2698D1] shadow-sm shadow-[#2698D1]/15 scale-[1.03]'
                    : 'border-gray-200 hover:border-[#2698D1]/40 hover:bg-gray-50 text-gray-500 hover:text-[#2698D1]'
                }`}
              >
                <Icon className={`h-6 w-6 transition-transform duration-150 ${selected ? 'scale-110' : ''}`} />
                <span className="text-xs font-semibold leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Marca del equipo *</label>
        <MarcaSearch
          value={form.marca}
          rubro={rubroShuuri}
          onChange={(nombre, id) => {
            setMarcaId(id);
            setForm(p => ({ ...p, marca: nombre, modelo: '' }));
          }}
          placeholder="Buscar marca…"
          inputCls={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Modelo (opcional)</label>
        <ModeloSearch
          value={form.modelo}
          marcaId={marcaId || undefined}
          onChange={v => setForm(p => ({ ...p, modelo: v }))}
          placeholder="Buscar modelo…"
          inputCls={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Dirección del local *</label>
        <input
          value={form.direccion}
          onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
          placeholder="Av. Corrientes 1234, CABA"
          className={inputCls}
        />
      </div>
    </div>
  );
}

// ─── STEP 2: FALLA ────────────────────────────────────────────────────────────

function Step2({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0D0D0D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";
  const fileRef  = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm(p => ({ ...p, foto: file, fotoPreview: preview }));
  }, [setForm]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">
          ¿Qué está pasando con el equipo? *
        </label>
        <textarea
          value={form.descripcion}
          onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
          rows={4}
          maxLength={500}
          placeholder="Ej: El horno no enciende, la heladera no enfría correctamente..."
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.descripcion.length}/500</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Foto del equipo (opcional)</label>
        {form.fotoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.fotoPreview} alt="Preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, foto: null, fotoPreview: null }))}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0] ?? null); }}
            className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#2698D1] rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors"
          >
            <Camera className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">Arrastrá una foto o hacé click</p>
            <p className="text-xs text-gray-400">JPG, PNG, HEIC hasta 10MB</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/heic"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.reincidente}
            onChange={e => setForm(p => ({ ...p, reincidente: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-[#2698D1] focus:ring-[#2698D1]"
          />
          <span className="text-sm font-medium text-[#0D0D0D]">Este equipo ya tuvo esta falla antes</span>
        </label>
        {form.reincidente && (
          <input
            value={form.ultimaVez}
            onChange={e => setForm(p => ({ ...p, ultimaVez: e.target.value }))}
            placeholder="¿Cuándo fue la última vez?"
            className="w-full mt-3 rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors"
          />
        )}
      </div>
    </div>
  );
}

// ─── STEP 3: REPUESTO ─────────────────────────────────────────────────────────

type OpcionRepuesto = 'elegir' | 'tecnico' | 'marketplace' | null;

function RepuestoCard({
  producto,
  seleccionado,
  onToggle,
  badgeIA,
  razonIA,
}: {
  producto:     MarketplaceProduct | RepuestoSugerido;
  seleccionado: boolean;
  onToggle:     () => void;
  badgeIA?:     boolean;
  razonIA?:     string;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className={`relative rounded-xl border-2 cursor-pointer p-4 text-left transition-all ${
          seleccionado
            ? 'border-[#2698D1] bg-[#2698D1]/5'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Checkmark */}
        {seleccionado && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#2698D1] text-white">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
        {/* Badge IA */}
        {badgeIA && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">IA</span>
          </div>
        )}
        {/* Imagen placeholder */}
        <div className="bg-gray-100 rounded-lg h-20 mb-3 flex items-center justify-center">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
        <p className="font-semibold text-sm text-[#0D0D0D] line-clamp-2 leading-tight mb-1">{producto.nombre}</p>
        <p className="text-xs text-gray-400 mb-2">{producto.proveedor_nombre}</p>
        <p className="font-black text-base text-[#0D0D0D]">$ {producto.precio_ars.toLocaleString('es-AR')}</p>
        <div className="flex items-center gap-1 mt-1 mb-2">
          <Package className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">{producto.tiempo_entrega_hs}hs entrega</span>
        </div>
        {producto.marca && (
          <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
            Compatible con {producto.marca}
          </span>
        )}
      </button>
      {razonIA && (
        <p className="mt-1 text-xs text-gray-400 italic px-1">{razonIA}</p>
      )}
    </div>
  );
}

function Step3({
  form,
  repuestosDB,
  repuestosIA,
  repuestosSeleccionados,
  setRepuestosSeleccionados,
  opcionRepuesto,
  setOpcionRepuesto,
  cargandoRepuestos,
  onIrMarketplace,
  onTecnicoEvalua,
}: {
  form:                      FormState;
  repuestosDB:               MarketplaceProduct[];
  repuestosIA:               RepuestoSugerido[];
  repuestosSeleccionados:    MarketplaceProduct[];
  setRepuestosSeleccionados: React.Dispatch<React.SetStateAction<MarketplaceProduct[]>>;
  opcionRepuesto:            OpcionRepuesto;
  setOpcionRepuesto:         React.Dispatch<React.SetStateAction<OpcionRepuesto>>;
  cargandoRepuestos:         boolean;
  onIrMarketplace:           () => void;
  onTecnicoEvalua:           () => void;
}) {
  function toggleRepuesto(p: MarketplaceProduct) {
    setRepuestosSeleccionados(prev => {
      const existe = prev.find(r => r.id === p.id);
      return existe ? prev.filter(r => r.id !== p.id) : [...prev, p];
    });
    setOpcionRepuesto('elegir');
  }

  const totalRepuestos = repuestosSeleccionados.reduce((s, p) => s + p.precio_ars, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg text-[#0D0D0D] mb-1">¿Necesitás alguno de estos repuestos?</h2>
        <p className="text-sm text-gray-500 mb-5">
          Basado en tu equipo {form.marca ? <strong>{form.marca}</strong> : 'seleccionado'}, estos son los repuestos más comunes para esta falla.
        </p>
      </div>

      {/* Skeleton de carga */}
      {cargandoRepuestos && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="h-4 w-4 text-[#2698D1] animate-spin" />
            <span className="text-sm text-gray-500">Buscando repuestos compatibles...</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-gray-200 animate-pulse h-40 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!cargandoRepuestos && (
        <>
          {/* Sección 1: repuestos DB */}
          {repuestosDB.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Repuestos compatibles con tu equipo
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {repuestosDB.map(p => (
                  <RepuestoCard
                    key={p.id}
                    producto={p}
                    seleccionado={!!repuestosSeleccionados.find(r => r.id === p.id)}
                    onToggle={() => toggleRepuesto(p)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sección 2: sugerencias IA */}
          {repuestosIA.length > 0 && (
            <div>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs rounded-full px-3 py-1 shrink-0">
                  Sugeridos por IA según la descripción de la falla
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {repuestosIA.map(p => (
                  <RepuestoCard
                    key={p.id}
                    producto={p}
                    seleccionado={!!repuestosSeleccionados.find(r => r.id === p.id)}
                    onToggle={() => toggleRepuesto(p)}
                    badgeIA
                    razonIA={p._razonIA}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ningún repuesto encontrado */}
          {repuestosDB.length === 0 && repuestosIA.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No encontramos repuestos específicos para este equipo en el catálogo.</p>
            </div>
          )}

          {/* Separador + opciones alternativas */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <button
              type="button"
              onClick={onIrMarketplace}
              className="w-full flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              Ir al marketplace a buscar otro repuesto
            </button>
            <button
              type="button"
              onClick={onTecnicoEvalua}
              className="w-full flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Wrench className="h-4 w-4 shrink-0" />
              No sé, que lo evalúe el técnico en la visita
            </button>
          </div>
        </>
      )}

      {/* Banner resumen selección */}
      {repuestosSeleccionados.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-green-600 shrink-0" />
            <span className="text-sm font-semibold text-green-800">
              {repuestosSeleccionados.length} repuesto{repuestosSeleccionados.length > 1 ? 's' : ''} seleccionado{repuestosSeleccionados.length > 1 ? 's' : ''}
            </span>
          </div>
          {repuestosSeleccionados.map(p => (
            <p key={p.id} className="text-xs text-green-700 ml-6 line-clamp-1">· {p.nombre}</p>
          ))}
          <p className="text-xs text-green-600 mt-2 ml-6 font-semibold">
            + Repuestos: $ {totalRepuestos.toLocaleString('es-AR')}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: URGENCIA ─────────────────────────────────────────────────────────

function Step4({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#0D0D0D] mb-3">Nivel de urgencia *</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {URGENCIAS.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => setForm(p => ({ ...p, urgencia: u.id }))}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                form.urgencia === u.id ? u.selCls : u.cls
              }`}
            >
              <span className={`inline-block shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${u.badge}`}>
                {u.label}
              </span>
              <span className="text-sm text-gray-600">{u.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#0D0D0D] mb-3">Horario preferido</p>
        <div className="flex flex-wrap gap-2">
          {HORARIOS.map(h => (
            <button
              key={h.id}
              type="button"
              onClick={() => setForm(p => ({ ...p, horario: h.id }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                form.horario === h.id
                  ? 'bg-[#2698D1] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">
          Fecha preferida (opcional)
        </label>
        <input
          type="date"
          value={form.fecha}
          onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors"
        />
      </div>
    </div>
  );
}

// ─── STEP 5: CONTACTO ─────────────────────────────────────────────────────────

function Step5({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0D0D0D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 bg-blue-50 rounded-xl px-4 py-3">
        Casi terminaste. Completá tus datos para coordinar el servicio.
      </p>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Nombre y apellido *</label>
        <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
          placeholder="Juan García" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">WhatsApp *</label>
        <input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
          placeholder="+549 11 1234-5678" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Email *</label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="juan@mirestaurante.com" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#0D0D0D] mb-1.5">Nombre del local o empresa *</label>
        <input value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))}
          placeholder="La Cabrera" className={inputCls} />
      </div>
    </div>
  );
}

// ─── MODAL DE REGISTRO ────────────────────────────────────────────────────────

function RegistroModal({
  form,
  repuestosSeleccionados,
  opcionRepuesto,
  onClose,
}: {
  form:                   FormState;
  repuestosSeleccionados: MarketplaceProduct[];
  opcionRepuesto:         OpcionRepuesto;
  onClose:                () => void;
}) {
  const [tab,      setTab]      = useState<'register' | 'login'>('register');
  const [regEmail, setRegEmail] = useState(form.email);
  const [regPass,  setRegPass]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [solNum,   setSolNum]   = useState('');

  const rubroLabel = RUBROS.find(r => r.id === form.rubro)?.label ?? form.rubro;
  const urgLabel   = form.urgencia
    ? URGENCIAS.find(u => u.id === form.urgencia)?.label ?? form.urgencia
    : '—';
  const dirCorta   = form.direccion.slice(0, 30) + (form.direccion.length > 30 ? '…' : '');
  const totalRepuestos = repuestosSeleccionados.reduce((s, p) => s + p.precio_ars, 0);

  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";

  async function handleConfirmar() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const num = `#SOL-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log('═══ NUEVA SOLICITUD SHUURI ═══');
    console.log('Solicitud:', num);
    console.log('Rubro:', form.rubro, '| Urgencia:', form.urgencia);
    console.log('Dirección:', form.direccion);
    console.log('Contacto:', form.nombre, '|', form.whatsapp, '|', form.email);
    console.log('Empresa:', form.empresa);
    console.log('Repuestos seleccionados:', repuestosSeleccionados.map(p => p.nombre));
    console.log('Opcion repuesto:', opcionRepuesto);
    setSolNum(num);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {!success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}

        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-5 animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="font-black text-2xl text-[#0D0D0D] mb-3">Solicitud enviada</h2>
              <p className="text-gray-500 leading-relaxed mb-2">
                Te contactaremos por WhatsApp en los próximos 30 minutos.
              </p>
              {repuestosSeleccionados.length > 0 && (
                <p className="text-xs text-gray-400 mb-2">
                  {repuestosSeleccionados.length} repuesto{repuestosSeleccionados.length > 1 ? 's' : ''} pre-solicitado{repuestosSeleccionados.length > 1 ? 's' : ''}
                </p>
              )}
              <p className="text-xs text-gray-400 mb-6">Número de solicitud: <strong>{solNum}</strong></p>
              <div className="flex flex-col gap-3 w-full">
                <Link href="/demo" className="block w-full text-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  Ver estado de mi solicitud
                </Link>
                <Link href="/" className="block w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition-colors">
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4 mx-auto">
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              </div>
              <h2 className="font-black text-2xl text-[#0D0D0D] text-center mb-2">¡Tu solicitud está lista!</h2>
              <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
                Creá tu cuenta gratuita para confirmarla.
                Un técnico certificado se asignará en minutos.
              </p>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rubro</span>
                  <span className="font-semibold text-[#0D0D0D]">{rubroLabel || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Urgencia</span>
                  <span className="font-semibold text-[#0D0D0D]">{urgLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dirección</span>
                  <span className="font-semibold text-[#0D0D0D] text-right max-w-[55%]">{dirCorta || '—'}</span>
                </div>

                {/* Repuestos en confirmación */}
                {repuestosSeleccionados.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Repuestos incluidos</p>
                    {repuestosSeleccionados.map(p => (
                      <div key={p.id} className="flex justify-between">
                        <span className="text-gray-500 text-xs line-clamp-1 flex-1 mr-2">{p.nombre}</span>
                        <span className="font-semibold text-xs shrink-0">$ {p.precio_ars.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500">Total repuestos</span>
                      <span className="text-xs font-black text-[#0D0D0D]">$ {totalRepuestos.toLocaleString('es-AR')}</span>
                    </div>
                    <p className="text-xs text-gray-400 italic">
                      Los repuestos se confirman una vez que el técnico valida el diagnóstico. Recibirás una notificación para aprobar la compra antes del cobro.
                    </p>
                  </div>
                )}

                {opcionRepuesto === 'tecnico' && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-3 py-2 text-xs">
                      El técnico evaluará si se necesita repuesto en la visita
                    </span>
                  </div>
                )}
              </div>

              {/* Toggle register / login */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'register' ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Crear cuenta
                </button>
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Ya tengo cuenta
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="Email"
                  className={inputCls}
                />
                <input
                  type="password"
                  value={regPass}
                  onChange={e => setRegPass(e.target.value)}
                  placeholder={tab === 'register' ? 'Crear contraseña' : 'Contraseña'}
                  className={inputCls}
                />
              </div>

              <button
                type="button"
                disabled={loading || !regEmail || !regPass}
                onClick={handleConfirmar}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-colors"
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                  : tab === 'register' ? 'Confirmar y crear cuenta' : 'Iniciar sesión y confirmar'
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function SidebarInfo() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#2698D1]" />
          ¿Por qué SHUURI?
        </h3>
        <ul className="space-y-3">
          {[
            'Técnico certificado para tu equipo específico',
            'El repuesto llega antes que el técnico',
            'Cotización antes de ejecutar — sin sorpresas',
            'Historial documentado con fotos',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#0D0D0D] mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#2698D1]" />
          Tiempo de respuesta
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { urg: 'CRÍTICA',  tiempo: '< 2 horas',    cls: 'bg-red-50   text-red-700'    },
            { urg: 'ALTA',     tiempo: 'Mismo día',     cls: 'bg-orange-50 text-orange-700' },
            { urg: 'MEDIA',    tiempo: '24–48hs',       cls: 'bg-yellow-50 text-yellow-700' },
            { urg: 'BAJA',     tiempo: 'Hasta 5 días',  cls: 'bg-gray-50  text-gray-700'   },
          ].map(item => (
            <div key={item.urg} className={`rounded-xl p-3 ${item.cls}`}>
              <p className="text-xs font-bold">{item.urg}</p>
              <p className="text-xs mt-0.5">{item.tiempo}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#0D0D0D] mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#2698D1]" />
          Sin costo por solicitar
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          Solicitar y recibir la cotización es gratis. Pagás solo si aprobás el presupuesto.
        </p>
        <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          Gratis para empezar
        </span>
      </div>
      <div className="bg-[#2698D1]/5 border border-[#2698D1]/20 rounded-2xl p-6">
        <Package className="h-5 w-5 text-[#2698D1] mb-3" />
        <p className="text-sm text-gray-700 italic leading-relaxed">
          &ldquo;Antes tardaba 3 días en conseguir un técnico. Con SHUURI llegó en 4 horas.&rdquo;
        </p>
        <p className="text-xs text-gray-400 mt-3">— Carlos M., restaurante Palermo</p>
      </div>
    </div>
  );
}

// ─── PAGE INNER ───────────────────────────────────────────────────────────────

function SolicitarTecnicoInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [step,      setStep]      = useState(1);
  const [form,      setForm]      = useState<FormState>(INITIAL);
  const [showModal, setShowModal] = useState(false);

  // Estado del paso 3 — repuestos
  const [repuestosDB,            setRepuestosDB]            = useState<MarketplaceProduct[]>([]);
  const [repuestosIA,            setRepuestosIA]            = useState<RepuestoSugerido[]>([]);
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<MarketplaceProduct[]>([]);
  const [cargandoRepuestos,      setCargandoRepuestos]      = useState(false);
  const [opcionRepuesto,         setOpcionRepuesto]         = useState<OpcionRepuesto>(null);

  // Al montar: leer retorno desde marketplace
  useEffect(() => {
    const repuestoAgregado = searchParams.get('repuestoAgregado') === 'true';
    const stepParam        = searchParams.get('step');

    if (repuestoAgregado) {
      const raw = sessionStorage.getItem('repuesto-seleccionado-ot');
      if (raw) {
        try {
          const repuesto = JSON.parse(raw) as { productoId: string; nombre: string; precio: number; slug: string };
          const producto: MarketplaceProduct = {
            id:                repuesto.productoId,
            slug:              repuesto.slug,
            nombre:            repuesto.nombre,
            descripcion:       '',
            precio_ars:        repuesto.precio,
            marca:             '',
            categoria:         'Repuestos',
            rubro:             form.rubro,
            disponibilidad:    'en_stock',
            tiempo_entrega_hs: 48,
            proveedor_nombre:  'SHUURI Marketplace',
          };
          sessionStorage.removeItem('repuesto-seleccionado-ot');
          setRepuestosSeleccionados([producto]);
          setOpcionRepuesto('elegir');
        } catch { /* ignore */ }
      }
      // Restaurar estado del wizard si se guardó
      const wizardRaw = sessionStorage.getItem('wizard-ot-state');
      if (wizardRaw) {
        try {
          const { form: savedForm } = JSON.parse(wizardRaw);
          setForm(savedForm);
          sessionStorage.removeItem('wizard-ot-state');
        } catch { /* ignore */ }
      }
      setStep(4); // Ir al paso de urgencia
      return;
    }

    if (stepParam) {
      const n = parseInt(stepParam);
      if (!isNaN(n) && n >= 1 && n <= 5) setStep(n);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar repuestos al llegar al paso 3
  async function cargarRepuestos() {
    setCargandoRepuestos(true);
    const resultado = await getSugerenciasRepuesto(form.rubro, form.marca, form.descripcion);
    setRepuestosDB(resultado.db);
    setRepuestosIA(resultado.ia);
    setCargandoRepuestos(false);
  }

  function handleIrMarketplace() {
    sessionStorage.setItem('wizard-ot-state', JSON.stringify({ form, step: 3, repuestosSeleccionados }));
    router.push(`/marketplace?otContext=true&rubro=${form.rubro}&marca=${encodeURIComponent(form.marca)}`);
  }

  function handleTecnicoEvalua() {
    setOpcionRepuesto('tecnico');
    setStep(4);
  }

  function handleNext() {
    if (step === 2) {
      setStep(3);
      cargarRepuestos();
    } else if (step < 5) {
      setStep(s => s + 1);
    } else {
      setShowModal(true);
    }
  }

  const canNext1 = !!form.rubro && !!form.marca.trim() && !!form.direccion.trim();
  const canNext2 = !!form.descripcion.trim();
  const canNext3 = true; // el repuesto es opcional
  const canNext4 = !!form.urgencia;
  const canNext5 = !!form.nombre.trim() && !!form.whatsapp.trim() && !!form.email.trim() && !!form.empresa.trim();

  const canNextMap: Record<number, boolean> = { 1: canNext1, 2: canNext2, 3: canNext3, 4: canNext4, 5: canNext5 };
  const canNext = canNextMap[step] ?? false;

  const stepTitles: Record<number, string> = {
    1: '¿Qué equipo falló?',
    2: 'Describí la falla',
    3: '¿Necesitás alguno de estos repuestos?',
    4: 'Urgencia y disponibilidad',
    5: 'Tus datos de contacto',
  };

  const nextLabel = step === 3
    ? repuestosSeleccionados.length > 0
      ? `Continuar con ${repuestosSeleccionados.length} repuesto${repuestosSeleccionados.length > 1 ? 's' : ''} →`
      : opcionRepuesto === 'tecnico'
        ? 'Continuar sin repuesto →'
        : 'Continuar →'
    : step === 5
      ? null
      : 'Siguiente';

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-gray-600">Solicitar técnico</span>
          </nav>
          <h1 className="font-black text-3xl text-[#0D0D0D]">Solicitar un técnico</h1>
          <p className="text-gray-500 mt-1">
            Completá el formulario. Un técnico certificado se asigna en minutos.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`grid gap-8 items-start ${step === 3 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[1fr_340px]'}`}>

          {/* Formulario */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <ProgressBar step={step} />

            {step !== 3 && (
              <h2 className="font-bold text-lg text-[#0D0D0D] mb-6">{stepTitles[step]}</h2>
            )}

            <div key={step} className="animate-in fade-in duration-200">
              {step === 1 && <Step1 form={form} setForm={setForm} />}
              {step === 2 && <Step2 form={form} setForm={setForm} />}
              {step === 3 && (
                <Step3
                  form={form}
                  repuestosDB={repuestosDB}
                  repuestosIA={repuestosIA}
                  repuestosSeleccionados={repuestosSeleccionados}
                  setRepuestosSeleccionados={setRepuestosSeleccionados}
                  opcionRepuesto={opcionRepuesto}
                  setOpcionRepuesto={setOpcionRepuesto}
                  cargandoRepuestos={cargandoRepuestos}
                  onIrMarketplace={handleIrMarketplace}
                  onTecnicoEvalua={handleTecnicoEvalua}
                />
              )}
              {step === 4 && <Step4 form={form} setForm={setForm} />}
              {step === 5 && <Step5 form={form} setForm={setForm} />}
            </div>

            {/* Navegación */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0D0D0D] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </button>
                ) : <div />}

                {step < 5 && nextLabel ? (
                  <button
                    type="button"
                    disabled={!canNext}
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    {nextLabel}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : step === 5 ? (
                  <button
                    type="button"
                    disabled={!canNext5}
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#2698D1] hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-black text-lg transition-all"
                  >
                    Confirmar solicitud
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
              {!canNext && (
                <p className="text-xs text-gray-400 text-right">
                  {step === 1 && 'Seleccioná un equipo, ingresá la marca y la dirección para continuar.'}
                  {step === 2 && 'Describí la falla para continuar.'}
                  {step === 4 && 'Seleccioná el nivel de urgencia para continuar.'}
                  {step === 5 && 'Completá todos tus datos de contacto para confirmar.'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar — solo en pasos distintos al 3 */}
          {step !== 3 && (
            <aside className="hidden lg:block">
              <SidebarInfo />
            </aside>
          )}

        </div>
      </div>

      {showModal && (
        <RegistroModal
          form={form}
          repuestosSeleccionados={repuestosSeleccionados}
          opcionRepuesto={opcionRepuesto}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SolicitarTecnicoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#2698D1] border-t-transparent animate-spin" />
      </div>
    }>
      <SolicitarTecnicoInner />
    </Suspense>
  );
}
