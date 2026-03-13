"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES, TAXONOMIA_SHUURI } from '@/data/mock';
import { RUBRO_LABELS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Tag, Plus, Trash2, CheckCircle2, Clock, AlertCircle,
  Award, Upload, Info, X, ChevronDown, ChevronUp, Search,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type NivelRepresentacion =
  | 'fabricante_propio'
  | 'distribuidor_oficial'
  | 'importador_exclusivo'
  | 'representante_regional';

type EstadoVerificacion = 'verificado' | 'en_revision' | 'sin_verificar';

interface MarcaItem {
  id:      string;
  nombre:  string;
  nivel:   NivelRepresentacion;
  rubros:  Rubro[];
  estado:  EstadoVerificacion;
  docNombre?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const NIVEL_LABELS: Record<NivelRepresentacion, { label: string; cls: string }> = {
  fabricante_propio:      { label: 'Fabricante propio',      cls: 'bg-purple-100 text-purple-700' },
  distribuidor_oficial:   { label: 'Distribuidor oficial',   cls: 'bg-blue-100 text-blue-700' },
  importador_exclusivo:   { label: 'Importador exclusivo',   cls: 'bg-orange-100 text-orange-700' },
  representante_regional: { label: 'Representante regional', cls: 'bg-teal-100 text-teal-700' },
};

const ESTADO_CONFIG: Record<EstadoVerificacion, { label: string; icon: React.ElementType; cls: string; dot: string }> = {
  verificado:   { label: 'Verificado',   icon: CheckCircle2, cls: 'text-green-600',  dot: 'bg-green-500' },
  en_revision:  { label: 'En revisión',  icon: Clock,        cls: 'text-amber-600',  dot: 'bg-amber-400' },
  sin_verificar:{ label: 'Sin verificar',icon: AlertCircle,  cls: 'text-gray-400',   dot: 'bg-gray-300' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: EstadoVerificacion }) {
  const { label, icon: Icon, cls, dot } = ESTADO_CONFIG[estado];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-bold ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function RubroBadge({ rubro }: { rubro: Rubro }) {
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
      {RUBRO_LABELS[rubro] ?? rubro}
    </span>
  );
}

// ─── MARCA CARD ───────────────────────────────────────────────────────────────

function MarcaCard({ marca, onDelete }: { marca: MarcaItem; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const nivel = NIVEL_LABELS[marca.nivel];
  const esVerificada = marca.estado === 'verificado';

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        {/* Logo placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 border">
          <Tag className="h-6 w-6 text-gray-300" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-[#0D0D0D]">{marca.nombre}</h3>
              {esVerificada && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  <Award className="h-3 w-3" /> Tienda Oficial
                </span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${nivel.cls}`}>
                {nivel.label}
              </span>
            </div>
            <EstadoBadge estado={marca.estado} />
          </div>

          {/* Rubros */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {marca.rubros.map(r => <RubroBadge key={r} rubro={r} />)}
          </div>

          {/* Doc */}
          {marca.docNombre && (
            <p className="text-xs text-gray-400 mt-2">
              📎 {marca.docNombre}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(v => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-gray-50 px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Nivel de representación</p>
              <p className="font-bold text-[#0D0D0D]">{nivel.label}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Estado SHUURI</p>
              <EstadoBadge estado={marca.estado} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Documentación</p>
              <p className="font-medium text-[#0D0D0D]">{marca.docNombre ?? '—'}</p>
            </div>
          </div>

          {marca.estado === 'en_revision' && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700">
                En proceso de verificación. SHUURI validará tu documentación en hasta <strong>5 días hábiles</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ADD FORM ─────────────────────────────────────────────────────────────────

function AgregarMarcaForm({ onAgregar, onCancelar }: {
  onAgregar: (m: MarcaItem) => void;
  onCancelar: () => void;
}) {
  const [nombre,  setNombre]  = useState('');
  const [nivel,   setNivel]   = useState<NivelRepresentacion>('distribuidor_oficial');
  const [rubros,  setRubros]  = useState<Rubro[]>([]);
  const [docName, setDocName] = useState('');
  const [error,   setError]   = useState('');

  function toggleRubro(r: Rubro) {
    setRubros(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  function handleGuardar() {
    if (!nombre.trim()) { setError('El nombre de la marca es obligatorio.'); return; }
    if (rubros.length === 0) { setError('Seleccioná al menos un rubro.'); return; }
    onAgregar({
      id:       `marca_${Date.now()}`,
      nombre:   nombre.trim(),
      nivel,
      rubros,
      estado:   'en_revision',
      docNombre: docName || undefined,
    });
  }

  return (
    <div className="rounded-2xl border-2 border-[#2698D1]/40 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#2698D1]/20 bg-blue-50/60 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2698D1]/20">
          <Plus className="h-4 w-4 text-[#2698D1]" />
        </div>
        <h3 className="font-bold text-[#0D0D0D]">Agregar marca</h3>
        <button onClick={onCancelar} className="ml-auto text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Nombre de la marca <span className="text-red-400">*</span>
          </label>
          <input
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(''); }}
            placeholder="ej. Fagor, Danfoss, Tecumseh…"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2698D1]"
          />
        </div>

        {/* Nivel */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Nivel de representación <span className="text-red-400">*</span>
          </label>
          <select
            value={nivel}
            onChange={e => setNivel(e.target.value as NivelRepresentacion)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#2698D1] bg-white"
          >
            <option value="fabricante_propio">Fabricante propio</option>
            <option value="distribuidor_oficial">Distribuidor oficial</option>
            <option value="importador_exclusivo">Importador exclusivo</option>
            <option value="representante_regional">Representante regional</option>
          </select>
        </div>

        {/* Rubros */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Rubros aplicables <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TAXONOMIA_SHUURI.map(t => {
              const r   = t.rubro as Rubro;
              const sel = rubros.includes(r);
              return (
                <button key={r} type="button" onClick={() => toggleRubro(r)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold text-left transition-all ${
                    sel
                      ? 'border-[#2698D1] bg-blue-50 text-[#2698D1]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documentación */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Documentación de autorización
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDocName(`Autorización_${nombre || 'marca'}.pdf`)}
              className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-500 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
            >
              <Upload className="h-4 w-4" /> Subir documento
            </button>
            {docName ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-xs font-bold text-green-700 truncate max-w-[160px]">{docName}</span>
                <button onClick={() => setDocName('')} className="text-green-400 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400">PDF o JPG · máx. 5MB</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Carta de representación, certificado de distribución o factura de importación.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button onClick={onCancelar}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleGuardar}
            className="flex-1 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Agregar marca
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function MisMarcas() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  // Seed initial marcas from legajo
  const marcasIniciales: MarcaItem[] = (
    proveedor.legajo?.marcasRepresentadas
      ? proveedor.legajo.marcasRepresentadas.split(',').map((m, i) => ({
          id:     `seed_${i}`,
          nombre: m.trim(),
          nivel:  i === 0 ? ('fabricante_propio' as NivelRepresentacion) : ('distribuidor_oficial' as NivelRepresentacion),
          rubros: proveedor.rubros as Rubro[],
          estado: i === 0 ? ('verificado' as EstadoVerificacion) : ('en_revision' as EstadoVerificacion),
          docNombre: i === 0 ? 'Certificado_fabricante.pdf' : undefined,
        }))
      : []
  );

  const [marcas,      setMarcas]      = useState<MarcaItem[]>(marcasIniciales);
  const [showForm,    setShowForm]    = useState(false);
  const [buscar,      setBuscar]      = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoVerificacion | 'todas'>('todas');
  const [toast,       setToast]       = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function agregarMarca(m: MarcaItem) {
    setMarcas(prev => [m, ...prev]);
    setShowForm(false);
    showToast(`"${m.nombre}" agregada — en revisión por SHUURI`);
  }

  function eliminarMarca(id: string) {
    setMarcas(prev => prev.filter(m => m.id !== id));
  }

  const marcasFiltradas = marcas.filter(m => {
    const matchBuscar  = !buscar || m.nombre.toLowerCase().includes(buscar.toLowerCase());
    const matchEstado  = filtroEstado === 'todas' || m.estado === filtroEstado;
    return matchBuscar && matchEstado;
  });

  const stats = {
    total:      marcas.length,
    verificadas: marcas.filter(m => m.estado === 'verificado').length,
    enRevision: marcas.filter(m => m.estado === 'en_revision').length,
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
        <main className="page-main">

          {/* ── PAGE HEADER ── */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mis Marcas</h1>
              <p className="text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
                Declarar tus marcas oficiales permite que SHUURI te asigne OCRs de repuestos y
                te muestre como proveedor recomendado para esas marcas.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" /> Agregar marca
            </button>
          </div>

          {/* ── KPIs ── */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Total marcas',  value: stats.total,       icon: Tag,          bg: 'bg-blue-50',   color: 'text-blue-600' },
              { label: 'Verificadas',   value: stats.verificadas,  icon: CheckCircle2, bg: 'bg-green-50',  color: 'text-green-600' },
              { label: 'En revisión',   value: stats.enRevision,   icon: Clock,        bg: 'bg-amber-50',  color: 'text-amber-600' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${k.bg}`}>
                  <k.icon className={`h-5 w-5 ${k.color}`} />
                </div>
                <p className="text-2xl font-black text-[#0D0D0D]">{k.value}</p>
                <p className="text-sm text-gray-500">{k.label}</p>
              </div>
            ))}
          </div>

          {/* ── BANNER INFORMATIVO ── */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#2698D1]/20 bg-blue-50 px-5 py-4">
            <Info className="h-5 w-5 text-[#2698D1] shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-snug">
              Las marcas <strong>verificadas por SHUURI</strong> aparecen con badge&nbsp;
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                <Award className="h-3 w-3" /> Tienda Oficial
              </span>
              &nbsp;en el marketplace y tienen prioridad de asignación en OCRs.
              El proceso de verificación demora hasta <strong>5 días hábiles</strong>.
            </p>
          </div>

          {/* ── FORMULARIO AGREGAR ── */}
          {showForm && (
            <div className="mb-6">
              <AgregarMarcaForm
                onAgregar={agregarMarca}
                onCancelar={() => setShowForm(false)}
              />
            </div>
          )}

          {/* ── FILTROS ── */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                placeholder="Buscar marca…"
                className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1]"
              />
            </div>
            <div className="flex gap-2">
              {(['todas', 'verificado', 'en_revision', 'sin_verificar'] as const).map(f => (
                <button key={f} onClick={() => setFiltroEstado(f)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                    filtroEstado === f
                      ? 'bg-[#0D0D0D] text-white'
                      : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {f === 'todas' ? 'Todas' :
                   f === 'verificado' ? 'Verificadas' :
                   f === 'en_revision' ? 'En revisión' : 'Sin verificar'}
                </button>
              ))}
            </div>
          </div>

          {/* ── LISTA ── */}
          <div className="space-y-4">
            {marcasFiltradas.length === 0 ? (
              <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
                <Tag className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                <p className="text-sm font-bold text-gray-400">
                  {marcas.length === 0 ? 'Aún no declaraste ninguna marca.' : 'Sin resultados para este filtro.'}
                </p>
                {marcas.length === 0 && (
                  <button onClick={() => setShowForm(true)}
                    className="mt-4 flex items-center gap-2 mx-auto rounded-xl bg-[#2698D1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors">
                    <Plus className="h-4 w-4" /> Agregar primera marca
                  </button>
                )}
              </div>
            ) : (
              marcasFiltradas.map(m => (
                <MarcaCard key={m.id} marca={m} onDelete={() => eliminarMarca(m.id)} />
              ))
            )}
          </div>

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl animate-fade-in">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
