"use client";
import React, { useState, useRef, KeyboardEvent } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { TECNICOS, TAXONOMIA_SHUURI } from '@/data/mock';
import { LegajoTecnico, RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import { User, MapPin, Users, Star, Phone, CreditCard, FileText, Edit3, Save, CheckCircle, ShieldCheck, Calendar, Wrench, Plus, Trash2, X, ChevronDown, Tag } from 'lucide-react';

// ─── TIPOS ABM RUBROS ─────────────────────────────────────────────────────────

type NivelCert = 'certificacion_oficial' | 'experiencia_comprobable' | 'en_proceso';

interface RubroCert {
  id:        string;
  rubro:     string; // e.g. 'Coccion'
  categoria: string; // e.g. 'Hornos'
  subcats:   string[];
  marcas:    string[];
  nivel:     NivelCert;
}

const NIVEL_LABELS: Record<NivelCert, { label: string; cls: string }> = {
  certificacion_oficial:  { label: 'Certificación oficial',    cls: 'bg-green-50 text-green-700 border-green-200' },
  experiencia_comprobable:{ label: 'Experiencia comprobable',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  en_proceso:             { label: 'En proceso',               cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
};

const TECNICO = TECNICOS[0];

const LEGAJO_VACIO: LegajoTecnico = {
  tipoAlta: 'Técnico independiente (trabajo solo)',
  nombreORazonSocial: TECNICO.nombre,
  nombreComercial: '',
  cuit: '',
  condicionIVA: 'Monotributista',
  domicilioFiscal: '',
  zonaCobertura: ['CABA'],
  rubros: TECNICO.rubros,
  marcasCertificadas: '',
  tieneCertificacionesOficiales: 'No pero tengo experiencia comprobable',
  detalleCertificaciones: '',
  disponibilidadHoraria: ['Lunes a Viernes horario comercial'],
  serviciosPorDia: '2',
  cantidadTecnicos: '',
  relacionLaboral: 'No aplica, soy independiente',
  vehiculos: 'No aplica, soy independiente',
  herramientas: 'Cada técnico tiene las suyas',
  anosExperiencia: '5 a 10',
  clientesActuales: '',
  trabajaSubcontratista: 'No, trabajo directo con cliente final',
  paraQuien: '',
  seguroRC: 'Sí, vigente',
  matafuegoEPP: 'Sí, completo',
  contactoNombre: TECNICO.nombre,
  contactoCargo: '',
  contactoTel: '',
  contactoEmail: TECNICO.email,
  contactoOTs: '',
  emailLiquidaciones: TECNICO.email,
  cbu: '',
  aliasCbu: '',
  bancoOBilletera: '',
  tipoFactura: 'Sí, Factura C',
  plazoLiquidacion: 'Quincenal',
};

const SECCIONES = [
  { id: 'tipo',           label: 'Tipo de alta',      icon: User },
  { id: 'fiscal',         label: 'Datos fiscales',    icon: FileText },
  { id: 'cobertura',      label: 'Cobertura',         icon: MapPin },
  { id: 'rubros',         label: 'Mis Rubros',        icon: Wrench },
  { id: 'equipo',         label: 'Equipo de trabajo', icon: Users },
  { id: 'experiencia',    label: 'Experiencia',       icon: Star },
  { id: 'contacto',       label: 'Contacto',          icon: Phone },
  { id: 'facturacion',    label: 'Facturación',       icon: CreditCard },
  { id: 'certs',          label: 'Certificaciones',   icon: ShieldCheck },
  { id: 'integraciones',  label: 'Integraciones',     icon: Calendar },
];

const ZONAS = ['CABA', 'GBA Norte', 'GBA Sur', 'GBA Oeste', 'Interior Buenos Aires', 'Nacional'];

function Campo({ label, value, editando, onChange, tipo = 'text', placeholder = '' }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; tipo?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-xs font-bold text-gray-500">{label}</label>
      {editando ? (
        tipo === 'textarea' ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} placeholder={placeholder}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#2698D1] resize-none" />
        ) : (
          <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#2698D1]" />
        )
      ) : (
        <p className="text-sm font-medium text-[#0D0D0D]">
          {value || <span className="italic text-gray-300">Sin completar</span>}
        </p>
      )}
    </div>
  );
}

function Sel({ label, value, editando, onChange, opciones }: {
  label: string; value: string; editando: boolean;
  onChange: (v: string) => void; opciones: string[];
}) {
  return (
    <div>
      <label className="mb-0.5 block text-xs font-bold text-gray-500">{label}</label>
      {editando ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#2698D1]">
          {opciones.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <span className="inline-block rounded-full bg-blue-50 border border-[#2698D1] px-3 py-1 text-xs font-medium text-[#2698D1]">
          {value || <span className="italic text-gray-300">Sin completar</span>}
        </span>
      )}
    </div>
  );
}

function ChipsMulti({ label, values, editando, opciones, onChange }: {
  label: string; values: string[]; editando: boolean;
  opciones: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (op: string) =>
    onChange(values.includes(op) ? values.filter(v => v !== op) : [...values, op]);
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-gray-500">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {editando ? opciones.map(op => (
          <button key={op} type="button" onClick={() => toggle(op)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              values.includes(op) ? 'bg-[#2698D1] border-[#2698D1] text-white' : 'border-gray-300 text-gray-600 hover:border-[#2698D1]'
            }`}>
            {op}
          </button>
        )) : values.length > 0 ? values.map(v => (
          <span key={v} className="rounded-full bg-blue-50 border border-[#2698D1] px-3 py-1 text-xs font-medium text-[#2698D1]">{v}</span>
        )) : <span className="italic text-xs text-gray-300">Sin completar</span>}
      </div>
    </div>
  );
}

// ─── TAG INPUT COMPONENT ─────────────────────────────────────────────────────

function TagInput({ tags, onChange, placeholder }: {
  tags: string[]; onChange: (t: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function add() {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    if (e.key === 'Backspace' && !input && tags.length > 0)
      onChange(tags.slice(0, -1));
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[40px] flex-wrap gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 cursor-text focus-within:border-[#2698D1] transition-colors"
    >
      {tags.map(t => (
        <span key={t} className="flex items-center gap-1 rounded-md bg-[#2698D1]/10 px-2 py-0.5 text-xs font-medium text-[#2698D1]">
          <Tag className="h-2.5 w-2.5" />{t}
          <button type="button" onClick={e => { e.stopPropagation(); onChange(tags.filter(x => x !== t)); }}
            className="hover:text-red-500 transition-colors">
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={add}
        placeholder={tags.length === 0 ? (placeholder ?? 'Escribí y presioná Enter…') : ''}
        className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
      />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TecnicoPerfil() {
  const [seccion, setSeccion] = useState('tipo');
  const [editando, setEditando] = useState(false);
  const [data, setData] = useState<LegajoTecnico>(LEGAJO_VACIO);
  const [guardado, setGuardado] = useState(false);

  // ── ABM Rubros state ──
  const [rubrosCerts, setRubrosCerts] = useState<RubroCert[]>([
    {
      id: '1', rubro: 'Refrigeracion', categoria: 'Heladeras',
      subcats: ['Heladera Vertical', 'Heladera Exhibidora'],
      marcas: ['True', 'Frider'], nivel: 'certificacion_oficial',
    },
    {
      id: '2', rubro: 'Coccion', categoria: 'Hornos',
      subcats: ['Horno Convector'],
      marcas: ['Rational', 'Unox'], nivel: 'experiencia_comprobable',
    },
  ]);

  // ── Formulario "agregar rubro" ──
  const [showForm, setShowForm] = useState(false);
  const [formRubro,    setFormRubro]    = useState('');
  const [formCat,      setFormCat]      = useState('');
  const [formSubcats,  setFormSubcats]  = useState<string[]>([]);
  const [formMarcas,   setFormMarcas]   = useState<string[]>([]);
  const [formNivel,    setFormNivel]    = useState<NivelCert>('experiencia_comprobable');
  const [formError,    setFormError]    = useState('');

  const set = (campo: keyof LegajoTecnico) => (valor: string) =>
    setData(prev => ({ ...prev, [campo]: valor }));

  const guardar = () => {
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  // Derived from TAXONOMIA_SHUURI
  const rubroOptions   = TAXONOMIA_SHUURI;
  const categorias     = rubroOptions.find(r => r.rubro === formRubro)?.categorias ?? [];
  const subcategorias  = categorias.find(c => c.nombre === formCat)?.subcategorias ?? [];

  function resetForm() {
    setFormRubro(''); setFormCat(''); setFormSubcats([]);
    setFormMarcas([]); setFormNivel('experiencia_comprobable');
    setFormError(''); setShowForm(false);
  }

  function agregarRubro() {
    if (!formRubro || !formCat) { setFormError('Elegí rubro y categoría.'); return; }
    if (formSubcats.length === 0) { setFormError('Seleccioná al menos una subcategoría.'); return; }
    const duplicado = rubrosCerts.some(r => r.rubro === formRubro && r.categoria === formCat);
    if (duplicado) { setFormError('Ya tenés configurado ese Rubro + Categoría.'); return; }
    setRubrosCerts(prev => [...prev, {
      id: String(Date.now()), rubro: formRubro, categoria: formCat,
      subcats: formSubcats, marcas: formMarcas, nivel: formNivel,
    }]);
    resetForm();
  }

  function eliminarRubro(id: string) {
    setRubrosCerts(prev => prev.filter(r => r.id !== id));
  }

  function toggleSubcat(sub: string) {
    setFormSubcats(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="TECNICO" userName={TECNICO.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="TECNICO" userName={TECNICO.nombre} />
        <main className="page-main">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Mi perfil</h1>
              <p className="text-gray-500">Legajo técnico completo</p>
            </div>
            <div className="flex items-center gap-3">
              {guardado && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> Guardado
                </div>
              )}
              {editando ? (
                <button onClick={guardar}
                  className="flex items-center gap-2 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90">
                  <Save className="h-4 w-4" /> Guardar cambios
                </button>
              ) : (
                <button onClick={() => setEditando(true)}
                  className="flex items-center gap-2 rounded-lg border border-[#2698D1] px-4 py-2 text-sm font-bold text-[#2698D1] hover:bg-blue-50">
                  <Edit3 className="h-4 w-4" /> Editar
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">

            {/* NAV LATERAL */}
            <div className="col-span-1 space-y-1">
              {SECCIONES.map(s => (
                <button key={s.id} onClick={() => setSeccion(s.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-left ${
                    seccion === s.id ? 'bg-[#2698D1] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <s.icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* CONTENIDO */}
            <div className="col-span-3 rounded-xl border bg-white p-6 shadow-sm">

              {/* TIPO */}
              {seccion === 'tipo' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Tipo de alta</h2>
                  <Sel label="¿Cómo operás?" value={data.tipoAlta} editando={editando} onChange={set('tipoAlta')}
                    opciones={['Técnico independiente (trabajo solo)', 'Empresa técnica (tengo técnicos a cargo)', 'Empresa que subcontrata técnicos para terceros']} />
                </div>
              )}

              {/* FISCAL */}
              {seccion === 'fiscal' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Datos fiscales</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Nombre completo o razón social" value={data.nombreORazonSocial} editando={editando} onChange={set('nombreORazonSocial')} />
                    <Campo label="Nombre comercial (si difiere)" value={data.nombreComercial} editando={editando} onChange={set('nombreComercial')} />
                    <Campo label="CUIT" value={data.cuit} editando={editando} onChange={set('cuit')} placeholder="20-00000000-0" />
                    <Sel label="Condición IVA" value={data.condicionIVA} editando={editando} onChange={set('condicionIVA')}
                      opciones={['Responsable Inscripto', 'Monotributista', 'Exento']} />
                  </div>
                  <Campo label="Domicilio fiscal" value={data.domicilioFiscal} editando={editando} onChange={set('domicilioFiscal')} tipo="textarea" />
                </div>
              )}

              {/* COBERTURA */}
              {seccion === 'cobertura' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Cobertura y capacidad</h2>
                  <ChipsMulti label="Zona de cobertura" values={data.zonaCobertura} editando={editando} opciones={ZONAS}
                    onChange={v => setData(prev => ({ ...prev, zonaCobertura: v }))} />
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">Rubros</label>
                    <div className="flex flex-wrap gap-1.5">
                      {editando ? TODOS_LOS_RUBROS.map(r => (
                        <button key={r} type="button"
                          onClick={() => {
                            const curr = data.rubros;
                            setData(prev => ({
                              ...prev,
                              rubros: curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r],
                            }));
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            data.rubros.includes(r) ? 'bg-[#2698D1] border-[#2698D1] text-white' : 'border-gray-300 text-gray-600 hover:border-[#2698D1]'
                          }`}>
                          {RUBRO_LABELS[r]}
                        </button>
                      )) : data.rubros.map(r => (
                        <span key={r} className="rounded-full bg-blue-50 border border-[#2698D1] px-3 py-1 text-xs font-medium text-[#2698D1]">
                          {RUBRO_LABELS[r]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Campo label="Marcas certificadas o especializadas" value={data.marcasCertificadas} editando={editando}
                    onChange={set('marcasCertificadas')} tipo="textarea" placeholder="Ej: Rational, Winterhalter, True..." />
                  <Sel label="¿Tenés certificaciones oficiales de marca?" value={data.tieneCertificacionesOficiales} editando={editando}
                    onChange={set('tieneCertificacionesOficiales')}
                    opciones={['Sí, una o varias', 'No pero tengo experiencia comprobable', 'Estoy en proceso de certificación']} />
                  {data.tieneCertificacionesOficiales === 'Sí, una o varias' && (
                    <Campo label="Detalle de certificaciones" value={data.detalleCertificaciones} editando={editando}
                      onChange={set('detalleCertificaciones')} tipo="textarea" placeholder="Marca y tipo de certificación" />
                  )}
                  <ChipsMulti label="Disponibilidad horaria" values={data.disponibilidadHoraria} editando={editando}
                    opciones={['Lunes a Viernes horario comercial', 'Sábados', 'Domingos y feriados', 'Nocturno', '24/7']}
                    onChange={v => setData(prev => ({ ...prev, disponibilidadHoraria: v }))} />
                  <Campo label="Servicios por día (aprox)" value={data.serviciosPorDia} editando={editando} onChange={set('serviciosPorDia')} />
                </div>
              )}

              {/* MIS RUBROS */}
              {seccion === 'rubros' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-black text-[#0D0D0D]">Mis Rubros</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Configurá tus especialidades con categoría, subcategorías y marcas certificadas.</p>
                    </div>
                    {!showForm && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#2698D1] px-3 py-2 text-xs font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Agregar rubro
                      </button>
                    )}
                  </div>

                  {/* FORMULARIO AGREGAR */}
                  {showForm && (
                    <div className="rounded-xl border-2 border-[#2698D1]/30 bg-blue-50/40 p-5 space-y-4">
                      <p className="text-sm font-bold text-[#0D0D0D]">Nuevo rubro</p>

                      {/* Cascada: Rubro → Categoría */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Rubro</label>
                          <div className="relative">
                            <select
                              value={formRubro}
                              onChange={e => { setFormRubro(e.target.value); setFormCat(''); setFormSubcats([]); }}
                              className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2698D1]"
                            >
                              <option value="">Elegí un rubro…</option>
                              {rubroOptions.map(r => (
                                <option key={r.rubro} value={r.rubro}>{r.label}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Categoría</label>
                          <div className="relative">
                            <select
                              value={formCat}
                              onChange={e => { setFormCat(e.target.value); setFormSubcats([]); }}
                              disabled={!formRubro}
                              className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2698D1] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Elegí categoría…</option>
                              {categorias.map(c => (
                                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Subcategorías */}
                      {formCat && subcategorias.length > 0 && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            Subcategorías <span className="text-red-400">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {subcategorias.map(sub => (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => toggleSubcat(sub)}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                                  formSubcats.includes(sub)
                                    ? 'border-[#2698D1] bg-[#2698D1] text-white'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#2698D1]/50'
                                }`}
                              >
                                {formSubcats.includes(sub) && <span className="mr-1">✓</span>}
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Marcas certificadas (tag input) */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                          Marcas certificadas <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                        </label>
                        <TagInput
                          tags={formMarcas}
                          onChange={setFormMarcas}
                          placeholder="Ej: Rational, Unox… presioná Enter"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Escribí la marca y presioná Enter para agregarla.</p>
                      </div>

                      {/* Nivel de certificación */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                          Nivel de certificación <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formNivel}
                            onChange={e => setFormNivel(e.target.value as NivelCert)}
                            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2698D1]"
                          >
                            <option value="certificacion_oficial">Certificación oficial de marca</option>
                            <option value="experiencia_comprobable">Experiencia comprobable</option>
                            <option value="en_proceso">En proceso de certificación</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Error */}
                      {formError && (
                        <p className="text-xs text-red-500 font-medium">{formError}</p>
                      )}

                      {/* Botones */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={agregarRubro}
                          className="flex items-center gap-1.5 rounded-lg bg-[#2698D1] px-4 py-2 text-xs font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" /> Agregar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LISTA DE RUBROS CONFIGURADOS */}
                  {rubrosCerts.length === 0 && !showForm && (
                    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
                      <Wrench className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-medium">Sin rubros configurados</p>
                      <p className="text-xs text-gray-300 mt-1">Agregá tus especialidades para recibir OTs.</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {rubrosCerts.map(rc => {
                      const rubroLabel = TAXONOMIA_SHUURI.find(r => r.rubro === rc.rubro)?.label ?? rc.rubro;
                      const nivel = NIVEL_LABELS[rc.nivel];
                      return (
                        <div key={rc.id} className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="font-bold text-sm text-[#0D0D0D]">{rubroLabel}</span>
                                <span className="text-gray-300">›</span>
                                <span className="font-semibold text-sm text-[#2698D1]">{rc.categoria}</span>
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${nivel.cls}`}>
                                  {nivel.label}
                                </span>
                              </div>

                              {/* Subcategorías */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {rc.subcats.map(s => (
                                  <span key={s} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 font-medium">
                                    {s}
                                  </span>
                                ))}
                              </div>

                              {/* Marcas */}
                              {rc.marcas.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mr-1">Marcas:</span>
                                  {rc.marcas.map(m => (
                                    <span key={m} className="rounded-md bg-[#2698D1]/10 px-2 py-0.5 text-[11px] text-[#2698D1] font-medium">
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Eliminar */}
                            <button
                              type="button"
                              onClick={() => eliminarRubro(rc.id)}
                              className="shrink-0 flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" /> Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {rubrosCerts.length > 0 && (
                    <p className="text-xs text-gray-400 text-center">
                      {rubrosCerts.length} rubro{rubrosCerts.length > 1 ? 's' : ''} configurado{rubrosCerts.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}

              {/* EQUIPO */}
              {seccion === 'equipo' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Equipo de trabajo</h2>
                  <p className="text-xs text-gray-400">Solo si sos empresa técnica o subcontratista</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Cantidad de técnicos en el equipo" value={data.cantidadTecnicos} editando={editando}
                      onChange={set('cantidadTecnicos')} placeholder="Dejar vacío si sos independiente" />
                    <Sel label="Relación laboral" value={data.relacionLaboral} editando={editando} onChange={set('relacionLaboral')}
                      opciones={['Relación de dependencia', 'Monotributistas', 'Ambos', 'No aplica, soy independiente']} />
                    <Sel label="Vehículos propios" value={data.vehiculos} editando={editando} onChange={set('vehiculos')}
                      opciones={['Sí, todos con vehículo', 'Algunos', 'No, usan transporte público', 'No aplica, soy independiente']} />
                    <Sel label="Herramientas" value={data.herramientas} editando={editando} onChange={set('herramientas')}
                      opciones={['La empresa provee todo', 'Cada técnico tiene las suyas', 'Mixto', 'No aplica, soy independiente']} />
                  </div>
                </div>
              )}

              {/* EXPERIENCIA */}
              {seccion === 'experiencia' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Experiencia</h2>
                  <Sel label="Años de experiencia" value={data.anosExperiencia} editando={editando} onChange={set('anosExperiencia')}
                    opciones={['Menos de 2', '2 a 5', '5 a 10', 'Más de 10']} />
                  <Campo label="Clientes actuales principales" value={data.clientesActuales} editando={editando}
                    onChange={set('clientesActuales')} tipo="textarea" placeholder="Restaurantes, hoteles, cadenas..." />
                  <Sel label="¿Trabajás como subcontratista?" value={data.trabajaSubcontratista} editando={editando}
                    onChange={set('trabajaSubcontratista')}
                    opciones={['Sí, soy service oficial de marca', 'Sí, trabajo para empresas que me asignan trabajos', 'No, trabajo directo con cliente final']} />
                  {data.trabajaSubcontratista.startsWith('Sí') && (
                    <Campo label="¿Para quién?" value={data.paraQuien} editando={editando} onChange={set('paraQuien')} tipo="textarea" />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <Sel label="Seguro de responsabilidad civil" value={data.seguroRC} editando={editando} onChange={set('seguroRC')}
                      opciones={['Sí, vigente', 'No', 'En trámite']} />
                    <Sel label="Matafuego y EPP" value={data.matafuegoEPP} editando={editando} onChange={set('matafuegoEPP')}
                      opciones={['Sí, completo', 'Parcial', 'No']} />
                  </div>
                </div>
              )}

              {/* CONTACTO */}
              {seccion === 'contacto' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Contacto</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Nombre del contacto principal" value={data.contactoNombre} editando={editando} onChange={set('contactoNombre')} />
                    <Campo label="Cargo (si es empresa)" value={data.contactoCargo} editando={editando} onChange={set('contactoCargo')}
                      placeholder="Ej: Dueño, Coordinador" />
                    <Campo label="Teléfono / WhatsApp" value={data.contactoTel} editando={editando} onChange={set('contactoTel')} />
                    <Campo label="Email" value={data.contactoEmail} editando={editando} onChange={set('contactoEmail')} />
                  </div>
                  <Campo label="Contacto para asignación de OTs (si es empresa)" value={data.contactoOTs} editando={editando}
                    onChange={set('contactoOTs')} placeholder="Nombre y teléfono de quien recibe las OTs" />
                </div>
              )}

              {/* FACTURACIÓN */}
              {seccion === 'facturacion' && (
                <div className="space-y-4">
                  <h2 className="font-black text-[#0D0D0D]">Facturación y cobros</h2>
                  <p className="text-xs text-gray-400">SHUURI cobra al cliente final y te liquida el 70% del servicio</p>
                  <Campo label="Email para recibir liquidaciones" value={data.emailLiquidaciones} editando={editando} onChange={set('emailLiquidaciones')} />
                  <Campo label="CVU / CBU (22 dígitos)" value={data.cbu} editando={editando} onChange={set('cbu')} placeholder="0000000000000000000000" />
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Alias CVU/CBU" value={data.aliasCbu} editando={editando} onChange={set('aliasCbu')} />
                    <Campo label="Banco o billetera" value={data.bancoOBilletera} editando={editando} onChange={set('bancoOBilletera')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Sel label="Tipo de factura a SHUURI" value={data.tipoFactura} editando={editando} onChange={set('tipoFactura')}
                      opciones={['Sí, Factura A', 'Sí, Factura B', 'Sí, Factura C', 'Necesito coordinar']} />
                    <Sel label="Plazo de liquidación" value={data.plazoLiquidacion} editando={editando} onChange={set('plazoLiquidacion')}
                      opciones={['Quincenal', 'Mensual', 'A definir con SHUURI']} />
                  </div>
                </div>
              )}

              {/* CERTIFICACIONES */}
              {seccion === 'certs' && (
                <div className="space-y-6">
                  <h2 className="font-black text-[#0D0D0D]">Certificaciones vigentes</h2>

                  {/* MAPA DE RUBROS */}
                  <div>
                    <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado por rubro</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TODOS_LOS_RUBROS.map(rubro => {
                        const certStatus = TECNICO.certPorRubro?.[rubro];
                        const tieneRubro = TECNICO.rubros.includes(rubro);

                        let estado: 'habilitado' | 'por_vencer' | 'bloqueado' | 'sin_cobertura' = 'sin_cobertura';
                        if (tieneRubro && certStatus) {
                          estado = certStatus === 'vigente' ? 'habilitado'
                            : certStatus === 'por_vencer' ? 'por_vencer'
                            : 'bloqueado';
                        }

                        const estilos = {
                          habilitado:    'border-green-200 bg-green-50',
                          por_vencer:    'border-yellow-200 bg-yellow-50',
                          bloqueado:     'border-red-200 bg-red-50',
                          sin_cobertura: 'border-gray-100 bg-gray-50',
                        };
                        const badgeEstilos = {
                          habilitado:    'bg-green-100 text-green-700',
                          por_vencer:    'bg-yellow-100 text-yellow-700',
                          bloqueado:     'bg-red-100 text-red-700',
                          sin_cobertura: 'bg-gray-100 text-gray-400',
                        };
                        const badgeLabel = {
                          habilitado:    '✓ Habilitado',
                          por_vencer:    '⚠ Por vencer',
                          bloqueado:     '✗ Bloqueado',
                          sin_cobertura: '— Sin cobertura',
                        };

                        return (
                          <div key={rubro} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${estilos[estado]}`}>
                            <span className={`text-xs font-medium ${estado === 'sin_cobertura' ? 'text-gray-400' : 'text-[#0D0D0D]'}`}>
                              {RUBRO_LABELS[rubro]}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeEstilos[estado]}`}>
                              {badgeLabel[estado]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ALERT RUBROS BLOQUEADOS */}
                  {TECNICO.bloqueado && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <span className="mt-0.5 shrink-0 text-base">⛔</span>
                      <div>
                        <p className="text-sm font-bold text-red-700">Técnico con rubros bloqueados</p>
                        <p className="text-xs text-red-600 mt-0.5">
                          No puede ser asignado a OTs de:{' '}
                          {TECNICO.bloqueadoRubros?.map(r => RUBRO_LABELS[r]).join(', ')}.
                          Renovar certificaciones para desbloquear.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CERTIFICACIONES INDIVIDUALES */}
                  <div>
                    <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Certificaciones cargadas</p>
                    {TECNICO.certificaciones.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No hay certificaciones cargadas.</p>
                    ) : (
                      <div className="space-y-3">
                        {TECNICO.certificaciones.map(cert => (
                          <div key={cert.id} className={`rounded-xl border p-4 ${
                            cert.estado === 'vigente'    ? 'border-green-200 bg-green-50' :
                            cert.estado === 'por_vencer' ? 'border-yellow-200 bg-yellow-50' :
                                                           'border-red-200 bg-red-50'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-sm text-[#0D0D0D]">{cert.nombre}</p>
                                <p className="text-xs text-gray-500">{cert.entidadEmisora}</p>
                                <p className="mt-1 text-xs text-gray-400">
                                  Emitida: {cert.fechaEmision} · Vence:{' '}
                                  <span className="font-medium">{cert.fechaVencimiento}</span>
                                </p>
                              </div>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                cert.estado === 'vigente'    ? 'bg-green-200 text-green-800' :
                                cert.estado === 'por_vencer' ? 'bg-yellow-200 text-yellow-800' :
                                                               'bg-red-200 text-red-800'
                              }`}>
                                {cert.estado === 'vigente'    ? 'Vigente' :
                                 cert.estado === 'por_vencer' ? 'Por vencer' : 'Vencida'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                    <p className="text-xs text-gray-400">Para cargar nuevas certificaciones, completá el onboarding.</p>
                  </div>
                </div>
              )}

              {/* INTEGRACIONES */}
              {seccion === 'integraciones' && (
                <div className="space-y-6">
                  <h2 className="font-black text-[#0D0D0D]">Integraciones</h2>
                  <p className="text-sm text-gray-500">Conectá SHUURI con tus calendarios para sincronizar visitas técnicas.</p>

                  <div className="space-y-3">
                    {[
                      { nombre: 'Google Calendar', desc: 'Sincronizá visitas y OTs con Google Calendar.', logo: '📅' },
                      { nombre: 'Microsoft Outlook', desc: 'Recibí recordatorios de OTs en tu calendario de Outlook.', logo: '📆' },
                      { nombre: 'Apple Calendar', desc: 'Integración con iCal para iPhone y Mac.', logo: '🍎' },
                    ].map(int => (
                      <div key={int.nombre} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{int.logo}</span>
                          <div>
                            <p className="text-sm font-bold text-[#0D0D0D]">{int.nombre}</p>
                            <p className="text-xs text-gray-400">{int.desc}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">Próximamente</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
                    <Calendar className="h-5 w-5 text-[#2698D1] mb-2" />
                    <p className="text-sm font-bold text-[#2698D1] mb-1">Más integraciones en camino</p>
                    <p className="text-xs text-blue-600">Estamos trabajando para que puedas gestionar tu agenda de SHUURI desde las herramientas que ya usás.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}