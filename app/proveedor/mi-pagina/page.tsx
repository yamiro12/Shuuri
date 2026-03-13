"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES, TAXONOMIA_SHUURI } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Eye, Pencil, Globe, Award, Star, MapPin, Clock, Phone,
  Package, Upload, CheckCircle2, Lock, Info, AlertCircle,
  Building2, Tag, Zap, ChevronDown, ChevronUp, X, Plus,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PlanProveedor = 'freemium' | 'pro' | 'premium';
type TipoProveedorBadge = 'fabricante' | 'distribuidor_oficial' | 'distribuidor_multimarca' | 'importador' | 'otro';

interface PaginaData {
  nombreComercial: string;
  descripcion: string;
  tipo: TipoProveedorBadge;
  rubros: Rubro[];
  marcas: string[];
  zonas: string[];
  tiempoEntrega: string;
  contactoNombre: string;
  contactoWA: string;
  tiendaOficial: boolean;
  bannerColor: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PLAN_LABEL: Record<PlanProveedor, { label: string; cls: string }> = {
  freemium: { label: 'Freemium', cls: 'bg-gray-100 text-gray-600' },
  pro:      { label: 'Pro',      cls: 'bg-blue-100 text-blue-700' },
  premium:  { label: 'Premium',  cls: 'bg-yellow-100 text-yellow-700' },
};

const TIPO_LABEL: Record<TipoProveedorBadge, { label: string; cls: string }> = {
  fabricante:            { label: 'Fabricante',            cls: 'bg-purple-100 text-purple-700' },
  distribuidor_oficial:  { label: 'Distribuidor Oficial',  cls: 'bg-blue-100 text-blue-700' },
  distribuidor_multimarca:{ label: 'Distribuidor Multimarca', cls: 'bg-indigo-100 text-indigo-700' },
  importador:            { label: 'Importador',            cls: 'bg-orange-100 text-orange-700' },
  otro:                  { label: 'Proveedor',             cls: 'bg-gray-100 text-gray-600' },
};

const PLANES_FEATURES: Record<PlanProveedor, string[]> = {
  freemium: ['descripción breve (100 chars)', 'hasta 2 rubros'],
  pro:      ['descripción completa', 'rubros ilimitados', 'marcas representadas', 'contacto comercial'],
  premium:  ['productos destacados', 'banner personalizado', 'prioridad en marketplace'],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function RequiereUpgrade({ plan }: { plan: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5">
      <Lock className="h-4 w-4 text-gray-400 shrink-0" />
      <span className="text-xs text-gray-400">Requiere plan <strong className="text-gray-600">{plan}</strong></span>
    </div>
  );
}

function RubroBadge({ rubro }: { rubro: Rubro }) {
  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
      {RUBRO_LABELS[rubro] ?? rubro}
    </span>
  );
}

function MarcaTag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function ProductoCard({ nombre, marca, precio }: { nombre: string; marca: string; precio: number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-gray-50">
        <Package className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-sm font-bold text-[#0D0D0D] line-clamp-2">{nombre}</p>
      <p className="text-xs text-gray-400 mt-0.5">{marca}</p>
      <p className="text-sm font-black text-[#2698D1] mt-2">USD {precio}</p>
    </div>
  );
}

// ─── PLAN FEATURES ACCORDION ─────────────────────────────────────────────────

function PlanFeaturesCard({ plan }: { plan: PlanProveedor }) {
  const [open, setOpen] = useState(false);
  const { label, cls } = PLAN_LABEL[plan];
  return (
    <div className="rounded-xl border overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#2698D1]" />
          <span className="text-sm font-bold text-[#0D0D0D]">Tu plan actual</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{label}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && (
        <div className="border-t bg-gray-50 px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['freemium', 'pro', 'premium'] as PlanProveedor[]).map(p => {
              const isCurrent = p === plan;
              const isLocked  = ['freemium','pro','premium'].indexOf(p) > ['freemium','pro','premium'].indexOf(plan);
              return (
                <div key={p} className={`rounded-xl border p-3 ${isCurrent ? 'border-[#2698D1] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${PLAN_LABEL[p].cls}`}>{PLAN_LABEL[p].label}</span>
                    {isLocked && <Lock className="h-3.5 w-3.5 text-gray-300" />}
                    {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-[#2698D1]" />}
                  </div>
                  <ul className="space-y-1">
                    {PLANES_FEATURES[p].map(f => (
                      <li key={f} className={`flex items-center gap-1.5 text-xs ${isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`h-1 w-1 rounded-full shrink-0 ${isLocked ? 'bg-gray-200' : 'bg-[#2698D1]'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function MiPaginaProveedor() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const plan: PlanProveedor = proveedor.plan ?? 'freemium';

  // Derive initial data from proveedor legajo
  const marcasIniciales: string[] = proveedor.legajo?.marcasRepresentadas
    ? proveedor.legajo.marcasRepresentadas.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const tipoInicial: TipoProveedorBadge = (() => {
    const t = proveedor.legajo?.tipoProveedor?.toLowerCase() ?? '';
    if (t.includes('fabric')) return 'fabricante';
    if (t.includes('import')) return 'importador';
    if (t.includes('oficial')) return 'distribuidor_oficial';
    if (t.includes('multimarca')) return 'distribuidor_multimarca';
    if (t.includes('distribu')) return 'distribuidor_oficial';
    return 'otro';
  })();

  const [modo,    setModo]    = useState<'preview' | 'editar'>('preview');
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [marcaInput, setMarcaInput] = useState('');

  const [data, setData] = useState<PaginaData>({
    nombreComercial: proveedor.legajo?.nombreComercial ?? proveedor.nombre,
    descripcion:     proveedor.legajo?.rubrosEspecializacion ?? '',
    tipo:            tipoInicial,
    rubros:          proveedor.rubros as Rubro[],
    marcas:          marcasIniciales,
    zonas:           proveedor.legajo?.zonaCobertura ?? [],
    tiempoEntrega:   proveedor.legajo?.tiempoEntrega ?? '',
    contactoNombre:  proveedor.legajo?.comercialNombre ?? '',
    contactoWA:      String(proveedor.legajo?.comercialTel ?? ''),
    tiendaOficial:   proveedor.tiendaOficial ?? false,
    bannerColor:     '#2698D1',
  });

  // Editable draft
  const [draft, setDraft] = useState<PaginaData>({ ...data });

  function toggleRubro(r: Rubro) {
    setDraft(d => ({
      ...d,
      rubros: d.rubros.includes(r) ? d.rubros.filter(x => x !== r) : [...d.rubros, r],
    }));
  }

  function addMarca() {
    const m = marcaInput.trim();
    if (!m || draft.marcas.includes(m)) return;
    setDraft(d => ({ ...d, marcas: [...d.marcas, m] }));
    setMarcaInput('');
  }

  function removeMarca(m: string) {
    setDraft(d => ({ ...d, marcas: d.marcas.filter(x => x !== m) }));
  }

  async function guardar() {
    setSaving(true);
    await new Promise<void>(r => setTimeout(r, 1200));
    setData({ ...draft });
    setSaved(true);
    setSaving(false);
    setModo('preview');
    setTimeout(() => setSaved(false), 3500);
  }

  function cancelar() {
    setDraft({ ...data });
    setModo('preview');
  }

  const productos = (proveedor.catalogoItems ?? []).slice(0, 3);

  const descMax = plan === 'freemium' ? 100 : 500;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
        <main className="page-main">

          {/* ── PAGE HEADER ── */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mi Página Pública</h1>
              <p className="text-sm text-gray-500 mt-0.5">Así te ven los gastronómicos y técnicos en el marketplace</p>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> Cambios guardados
                </span>
              )}
              <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setModo('preview')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors ${
                    modo === 'preview' ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="h-4 w-4" /> Vista previa
                </button>
                <button
                  onClick={() => { setDraft({ ...data }); setModo('editar'); }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors border-l border-gray-200 ${
                    modo === 'editar' ? 'bg-[#2698D1] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Pencil className="h-4 w-4" /> Editar
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              MODO VISTA PREVIA
          ═══════════════════════════════════════════════════ */}
          {modo === 'preview' && (
            <div className="max-w-3xl space-y-5">

              {/* Portada */}
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-28 w-full" style={{ background: `linear-gradient(135deg, ${data.bannerColor}22, ${data.bannerColor}55)` }} />

                <div className="px-6 pb-6 -mt-10 relative">
                  {/* Logo */}
                  <div className="h-20 w-20 rounded-2xl border-4 border-white bg-white shadow-lg flex items-center justify-center mb-3">
                    <Building2 className="h-10 w-10 text-gray-300" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-xl font-black text-[#0D0D0D]">{data.nombreComercial}</h2>
                        {data.tiendaOficial && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                            <Award className="h-3 w-3" /> Tienda Oficial
                          </span>
                        )}
                      </div>
                      <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${TIPO_LABEL[data.tipo].cls}`}>
                        {TIPO_LABEL[data.tipo].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-700">4.8</span>
                      <span className="text-xs text-gray-400">(32 reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info principal */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-5">

                {/* Descripción */}
                {data.descripcion && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Sobre nosotros</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{data.descripcion}</p>
                  </div>
                )}

                {/* Rubros */}
                {data.rubros.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Rubros que cubrimos</p>
                    <div className="flex flex-wrap gap-2">
                      {data.rubros.map(r => <RubroBadge key={r} rubro={r} />)}
                    </div>
                  </div>
                )}

                {/* Marcas */}
                {data.marcas.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Marcas que representamos</p>
                    <div className="flex flex-wrap gap-2">
                      {data.marcas.map(m => <MarcaTag key={m} label={m} />)}
                    </div>
                  </div>
                )}

                {/* Logística */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.tiempoEntrega && (
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <Clock className="h-5 w-5 text-[#2698D1] shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Tiempo de entrega</p>
                        <p className="text-sm font-bold text-[#0D0D0D]">{data.tiempoEntrega}</p>
                      </div>
                    </div>
                  )}
                  {data.zonas.length > 0 && (
                    <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <MapPin className="h-5 w-5 text-[#2698D1] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400">Zonas de entrega</p>
                        <p className="text-sm font-bold text-[#0D0D0D]">{data.zonas.join(' · ')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mapa placeholder */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Cobertura geográfica</p>
                  <div className="h-40 rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200">
                    <MapPin className="h-8 w-8 text-gray-300" />
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                      Mapa interactivo — Próximamente
                    </span>
                  </div>
                </div>

                {/* Contacto */}
                {(data.contactoNombre || data.contactoWA) && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Contacto comercial</p>
                    <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 shrink-0">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        {data.contactoNombre && <p className="text-sm font-bold text-[#0D0D0D]">{data.contactoNombre}</p>}
                        {data.contactoWA && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="text-green-600 font-bold">WhatsApp</span> {data.contactoWA}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Productos destacados */}
              {productos.length > 0 && (
                <div className="rounded-2xl border bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0D0D0D]">Productos destacados</h3>
                    <span className="text-xs text-gray-400">del catálogo</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {productos.map(p => (
                      <ProductoCard key={p.id} nombre={p.nombre} marca={p.marca ?? '—'} precio={p.precio} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              MODO EDITAR
          ═══════════════════════════════════════════════════ */}
          {modo === 'editar' && (
            <div className="max-w-3xl space-y-5">

              {/* Plan features accordion */}
              <PlanFeaturesCard plan={plan} />

              {/* Sección: Identidad */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-5">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#2698D1]" /> Identidad
                </h3>

                {/* Logo upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-gray-300" />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" /> Cargar logo
                    </button>
                    <span className="text-xs text-gray-400">PNG o JPG · máx. 2MB</span>
                  </div>
                </div>

                {/* Nombre comercial */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nombre comercial</label>
                  <input
                    value={draft.nombreComercial}
                    onChange={e => setDraft(d => ({ ...d, nombreComercial: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2698D1]"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tipo de proveedor</label>
                  <select
                    value={draft.tipo}
                    onChange={e => setDraft(d => ({ ...d, tipo: e.target.value as TipoProveedorBadge }))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2698D1] bg-white"
                  >
                    <option value="fabricante">Fabricante</option>
                    <option value="distribuidor_oficial">Distribuidor Oficial</option>
                    <option value="distribuidor_multimarca">Distribuidor Multimarca</option>
                    <option value="importador">Importador</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Color banner */}
                {plan === 'premium' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Color de banner personalizado</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={draft.bannerColor}
                        onChange={e => setDraft(d => ({ ...d, bannerColor: e.target.value }))}
                        className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{draft.bannerColor}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Banner personalizado</label>
                    <RequiereUpgrade plan="Premium" />
                  </div>
                )}
              </div>

              {/* Sección: Descripción */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-3">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#2698D1]" /> Descripción
                </h3>
                {plan === 'freemium' ? (
                  <>
                    <textarea
                      value={draft.descripcion.slice(0, 100)}
                      onChange={e => setDraft(d => ({ ...d, descripcion: e.target.value.slice(0, 100) }))}
                      rows={3}
                      maxLength={100}
                      placeholder="Descripción breve del negocio…"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{draft.descripcion.length}/100 chars (plan freemium)</p>
                      <span className="text-xs text-blue-600 font-bold">Actualizá a Pro para 500 chars →</span>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      value={draft.descripcion}
                      onChange={e => setDraft(d => ({ ...d, descripcion: e.target.value.slice(0, descMax) }))}
                      rows={4}
                      maxLength={descMax}
                      placeholder="Describí tu negocio, especialización y propuesta de valor…"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] resize-none"
                    />
                    <p className="text-xs text-gray-400">{draft.descripcion.length}/{descMax} caracteres</p>
                  </>
                )}
              </div>

              {/* Sección: Rubros */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#2698D1]" /> Rubros que cubrís
                </h3>
                {plan === 'freemium' ? (
                  <>
                    <p className="text-xs text-amber-600">Plan Freemium: hasta 2 rubros</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TAXONOMIA_SHUURI.map(t => {
                        const rubro = t.rubro as Rubro;
                        const sel   = draft.rubros.includes(rubro);
                        const maxed = !sel && draft.rubros.length >= 2;
                        return (
                          <button key={rubro} onClick={() => !maxed && toggleRubro(rubro)} disabled={maxed}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left ${
                              sel ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]' :
                              maxed ? 'border-gray-100 text-gray-300 cursor-not-allowed' :
                              'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}>
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TAXONOMIA_SHUURI.map(t => {
                      const rubro = t.rubro as Rubro;
                      const sel   = draft.rubros.includes(rubro);
                      return (
                        <button key={rubro} onClick={() => toggleRubro(rubro)}
                          className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left ${
                            sel ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}>
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sección: Marcas */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#2698D1]" /> Marcas representadas
                </h3>
                {plan === 'freemium' ? (
                  <RequiereUpgrade plan="Pro" />
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 min-h-[36px]">
                      {draft.marcas.map(m => (
                        <MarcaTag key={m} label={m} onRemove={() => removeMarca(m)} />
                      ))}
                      {draft.marcas.length === 0 && (
                        <p className="text-xs text-gray-400 italic">Sin marcas cargadas</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={marcaInput}
                        onChange={e => setMarcaInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMarca())}
                        placeholder="Agregar marca (Enter)"
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1]"
                      />
                      <button onClick={addMarca}
                        className="flex items-center gap-1.5 rounded-xl bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors">
                        <Plus className="h-4 w-4" /> Agregar
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sección: Contacto */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#2698D1]" /> Contacto comercial
                </h3>
                {plan === 'freemium' ? (
                  <RequiereUpgrade plan="Pro" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Nombre del contacto</label>
                      <input value={draft.contactoNombre}
                        onChange={e => setDraft(d => ({ ...d, contactoNombre: e.target.value }))}
                        placeholder="ej. Fernando Lynch"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#2698D1]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">WhatsApp (con código de área)</label>
                      <input value={draft.contactoWA}
                        onChange={e => setDraft(d => ({ ...d, contactoWA: e.target.value }))}
                        placeholder="ej. 11-4867-0700"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#2698D1]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Sección: Tiempo de entrega y zonas */}
              <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2698D1]" /> Logística
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Tiempo de entrega habitual</label>
                  <input value={draft.tiempoEntrega}
                    onChange={e => setDraft(d => ({ ...d, tiempoEntrega: e.target.value }))}
                    placeholder="ej. 24-48hs hábiles"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#2698D1]" />
                </div>
              </div>

              {/* Sección: Productos destacados */}
              <div className="rounded-2xl border bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D0D0D] flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4 text-[#2698D1]" /> Productos destacados
                </h3>
                {plan !== 'premium' ? (
                  <RequiereUpgrade plan="Premium" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {productos.map(p => (
                      <ProductoCard key={p.id} nombre={p.nombre} marca={p.marca ?? '—'} precio={p.precio} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer disclaimer */}
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                <Info className="h-5 w-5 text-[#2698D1] shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 leading-snug">
                  Los cambios en tu página pública se reflejarán en el marketplace dentro de las <strong>24 horas</strong>.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pb-4">
                <button onClick={cancelar}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={guardar} disabled={saving}
                  className="flex-1 rounded-xl bg-[#2698D1] py-3 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {saving ? (
                    <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Guardar cambios</>
                  )}
                </button>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
