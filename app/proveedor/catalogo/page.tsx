"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS, TAXONOMIA_ACTIVOS } from '@/types/shuuri';
import type { Rubro, TipoPackaging, OrigenProducto, TemperaturaAlmacenamiento } from '@/types/shuuri';
import { formatARS } from '@/components/shared/utils';
import {
  Search, Package, X, ChevronDown, ChevronLeft, ChevronRight,
  Plus, Upload, Download, Pencil, Copy, Trash2, Power,
  Info, AlertTriangle, CheckCircle2,
} from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type EstadoProducto = 'activo' | 'inactivo' | 'descontinuado';

interface LogisticaInfo {
  ean13: string;
  pesoNeto: number;
  pesoBruto: number;
  largo: number;
  ancho: number;
  alto: number;
  tipoPackaging: TipoPackaging | '';
  unidadVenta: string;
  origen: OrigenProducto | '';
  paisOrigen: string;
  posicionArancelaria: string;
  temperatura: TemperaturaAlmacenamiento | '';
}

interface ProductoCatalogo {
  id: string;
  codigoInterno: string;
  nombre: string;
  descripcion: string;
  rubro: Rubro;
  categoria: string;
  subcategoria: string;
  marca: string;
  modelo: string;
  numeroParte: string;
  estado: EstadoProducto;
  precioARS: number;
  precioUSD: number;
  ivaIncluido: boolean;
  stockDisponible: number;
  stockMinimoAlerta: number;
  tiempoReposicionDias: number;
  compatibleConRubros: Rubro[];
  compatibleConMarcas: string[];
  descripcionCompatibilidad: string;
  logistica: LogisticaInfo;
  imagenes: string[];
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TASA = 1050;
const PER_PAGE = 10;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

let _seq = 200;
function newId() { return `CAT${++_seq}`; }

function emptyLogistica(): LogisticaInfo {
  return { ean13: '', pesoNeto: 0, pesoBruto: 0, largo: 0, ancho: 0, alto: 0, tipoPackaging: '', unidadVenta: 'Unidad', origen: '', paisOrigen: '', posicionArancelaria: '', temperatura: '' };
}

function emptyProducto(): ProductoCatalogo {
  return { id: '', codigoInterno: '', nombre: '', descripcion: '', rubro: 'frio_comercial', categoria: '', subcategoria: '', marca: '', modelo: '', numeroParte: '', estado: 'activo', precioARS: 0, precioUSD: 0, ivaIncluido: true, stockDisponible: 0, stockMinimoAlerta: 0, tiempoReposicionDias: 0, compatibleConRubros: [], compatibleConMarcas: [], descripcionCompatibilidad: '', logistica: emptyLogistica(), imagenes: [] };
}

function validateProducto(p: ProductoCatalogo): Record<string, string> {
  const err: Record<string, string> = {};
  if (!p.codigoInterno.trim()) err.codigoInterno = 'Campo requerido';
  if (!p.nombre.trim()) err.nombre = 'Campo requerido';
  if (!p.descripcion.trim()) err.descripcion = 'Campo requerido';
  if (!p.marca.trim()) err.marca = 'Campo requerido';
  if (!p.precioARS || p.precioARS <= 0) err.precioARS = 'Debe ser mayor a 0';
  if (p.stockDisponible < 0) err.stockDisponible = 'No puede ser negativo';
  if (p.logistica.ean13 && !/^\d{13}$/.test(p.logistica.ean13)) err.ean13 = 'Debe tener exactamente 13 dígitos';
  if (p.logistica.pesoNeto < 0) err.pesoNeto = 'No puede ser negativo';
  const dims = [p.logistica.largo, p.logistica.ancho, p.logistica.alto];
  const filled = dims.filter(d => d > 0).length;
  if (filled > 0 && filled < 3) err.dimensiones = 'Completar las 3 dimensiones o dejar todas en cero';
  return err;
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const SEED_CATALOGO: ProductoCatalogo[] = [
  { id: 'C001', codigoInterno: 'FAG-QUEM-001', nombre: 'Quemador de gas doble corona 8kW', descripcion: 'Quemador industrial doble corona 8kW para cocinas comerciales. Compatible con gas natural y GLP.', rubro: 'gas_combustion', categoria: 'Quemadores', subcategoria: 'Doble corona', marca: 'Fagor', modelo: 'QDC-8kW', numeroParte: 'FAG-78234', estado: 'activo', precioARS: 99750, precioUSD: 95, ivaIncluido: true, stockDisponible: 12, stockMinimoAlerta: 3, tiempoReposicionDias: 7, compatibleConRubros: ['gas_combustion', 'calor_comercial'], compatibleConMarcas: ['Fagor', 'Zanussi', 'Garland'], descripcionCompatibilidad: 'Compatible con cocinas Fagor EVO y Zanussi serie 700', logistica: { ean13: '7890123456789', pesoNeto: 1.2, pesoBruto: 1.8, largo: 25, ancho: 20, alto: 8, tipoPackaging: 'caja', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'España', posicionArancelaria: '7321.11.00', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C002', codigoInterno: 'RAT-MOD-SCC61', nombre: 'Módulo de control electrónico Rational SCC 61', descripcion: 'PCB de control principal para horno Rational SCC 61. Incluye firmware v4.2.1.', rubro: 'calor_comercial', categoria: 'Electrónica y control', subcategoria: 'PCB y módulos', marca: 'Rational', modelo: 'SCC 61', numeroParte: 'RAT-40.02.123', estado: 'activo', precioARS: 399000, precioUSD: 380, ivaIncluido: true, stockDisponible: 2, stockMinimoAlerta: 1, tiempoReposicionDias: 21, compatibleConRubros: ['calor_comercial'], compatibleConMarcas: ['Rational'], descripcionCompatibilidad: 'Exclusivo para Rational SCC 61 y SCC 102', logistica: { ean13: '', pesoNeto: 0.4, pesoBruto: 0.7, largo: 30, ancho: 22, alto: 5, tipoPackaging: 'caja', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Alemania', posicionArancelaria: '8537.10.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C003', codigoInterno: 'RC-CUCH-R201', nombre: 'Cuchillo de corte Robot Coupe R201', descripcion: 'Cuchillo original de acero inoxidable para cutter Robot Coupe R201. Filo doble.', rubro: 'maquinaria_preparacion', categoria: 'Accesorios', subcategoria: 'Cuchillas', marca: 'Robot Coupe', modelo: 'R201', numeroParte: '27127', estado: 'activo', precioARS: 47250, precioUSD: 45, ivaIncluido: true, stockDisponible: 8, stockMinimoAlerta: 2, tiempoReposicionDias: 10, compatibleConRubros: ['maquinaria_preparacion'], compatibleConMarcas: ['Robot Coupe'], descripcionCompatibilidad: 'R201, R201XL, R201 Ultra', logistica: { ean13: '3154280271272', pesoNeto: 0.15, pesoBruto: 0.25, largo: 18, ancho: 8, alto: 2, tipoPackaging: 'unitario', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Francia', posicionArancelaria: '8208.10.00', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C004', codigoInterno: 'FAE-FILT-500', nombre: 'Filtro de grasa campana 500x500 inox', descripcion: 'Filtro de grasa de acero inoxidable 500x500mm para campanas extractoras industriales. Lavable en lavavajillas.', rubro: 'campanas_extraccion', categoria: 'Filtros', subcategoria: 'Filtros de acero', marca: 'Faema', modelo: 'FG-500', numeroParte: 'FAE-9012', estado: 'activo', precioARS: 57750, precioUSD: 55, ivaIncluido: true, stockDisponible: 20, stockMinimoAlerta: 5, tiempoReposicionDias: 5, compatibleConRubros: ['campanas_extraccion'], compatibleConMarcas: ['Faema', 'Zanussi', 'Garland', 'Fagor'], descripcionCompatibilidad: 'Universal 500x500mm, verificar medidas', logistica: { ean13: '', pesoNeto: 0.6, pesoBruto: 0.8, largo: 52, ancho: 52, alto: 3, tipoPackaging: 'unitario', unidadVenta: 'Unidad', origen: 'nacional', paisOrigen: '', posicionArancelaria: '7326.90.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C005', codigoInterno: 'CON-HORNO-6GN', nombre: 'Horno mixto 6 bandejas GN 1/1', descripcion: 'Horno mixto Convotherm para 6 bandejas GN 1/1. Control electrónico, generador de vapor, sonda de temperatura.', rubro: 'calor_comercial', categoria: 'Hornos', subcategoria: 'Hornos mixtos', marca: 'Convotherm', modelo: 'OES 6.10', numeroParte: 'CON-OES610', estado: 'activo', precioARS: 5040000, precioUSD: 4800, ivaIncluido: true, stockDisponible: 1, stockMinimoAlerta: 0, tiempoReposicionDias: 45, compatibleConRubros: ['calor_comercial'], compatibleConMarcas: ['Convotherm'], descripcionCompatibilidad: '', logistica: { ean13: '', pesoNeto: 68, pesoBruto: 85, largo: 70, ancho: 75, alto: 65, tipoPackaging: 'pallet', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Alemania', posicionArancelaria: '8419.89.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C006', codigoInterno: 'FAG-TERMO-EVO', nombre: 'Termo resistencia sonda temperatura Fagor EVO', descripcion: 'Sonda NTC para control de temperatura en hornos y freidoras Fagor serie EVO.', rubro: 'calor_comercial', categoria: 'Electrónica y control', subcategoria: 'Sondas y sensores', marca: 'Fagor', modelo: 'EVO', numeroParte: 'FAG-T-NTC10K', estado: 'activo', precioARS: 39900, precioUSD: 38, ivaIncluido: true, stockDisponible: 15, stockMinimoAlerta: 4, tiempoReposicionDias: 7, compatibleConRubros: ['calor_comercial'], compatibleConMarcas: ['Fagor'], descripcionCompatibilidad: 'Serie EVO completa: EVO 700, EVO 900', logistica: { ean13: '', pesoNeto: 0.08, pesoBruto: 0.12, largo: 12, ancho: 6, alto: 3, tipoPackaging: 'unitario', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'España', posicionArancelaria: '9025.19.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C007', codigoInterno: 'BRA-VAL-DN15', nombre: 'Válvula solenoide gas 1/2" DN15 24V', descripcion: 'Válvula solenoide normalmente cerrada para gas. Bobina 24VAC/DC. Conexión BSP 1/2".', rubro: 'gas_combustion', categoria: 'Válvulas y reguladores', subcategoria: 'Válvulas solenoides', marca: 'Brahma', modelo: 'EG12', numeroParte: 'BRA-18029120', estado: 'activo', precioARS: 75600, precioUSD: 72, ivaIncluido: true, stockDisponible: 6, stockMinimoAlerta: 2, tiempoReposicionDias: 10, compatibleConRubros: ['gas_combustion'], compatibleConMarcas: ['Brahma', 'Dungs', 'Honeywell'], descripcionCompatibilidad: 'Universal BSP 1/2" - verificar bobina', logistica: { ean13: '', pesoNeto: 0.35, pesoBruto: 0.5, largo: 12, ancho: 8, alto: 8, tipoPackaging: 'unitario', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Italia', posicionArancelaria: '8481.20.00', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C008', codigoInterno: 'SP-MOTOR-900', nombre: 'Motor extractor campana 900m³/h', descripcion: 'Motor centrífugo para campana extractora. Caudal 900m³/h, monofásico 220V 50Hz.', rubro: 'campanas_extraccion', categoria: 'Motores y ventiladores', subcategoria: 'Motores centrífugos', marca: 'S&P', modelo: 'CJBM/4-180', numeroParte: 'SP-5145400600', estado: 'activo', precioARS: 220500, precioUSD: 210, ivaIncluido: true, stockDisponible: 4, stockMinimoAlerta: 1, tiempoReposicionDias: 14, compatibleConRubros: ['campanas_extraccion'], compatibleConMarcas: ['S&P', 'Soler & Palau'], descripcionCompatibilidad: '', logistica: { ean13: '', pesoNeto: 4.2, pesoBruto: 5.5, largo: 28, ancho: 28, alto: 22, tipoPackaging: 'caja', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'España', posicionArancelaria: '8414.59.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C009', codigoInterno: 'ULKA-BOMB-EP5', nombre: 'Bomba vibradora ULKA EP5 230V', descripcion: 'Bomba vibradora de repuesto para máquinas de espresso. 15W, 48Hz, 230V.', rubro: 'cafe_bebidas', categoria: 'Bombas y calderas', subcategoria: 'Bombas vibradoras', marca: 'ULKA', modelo: 'EP5', numeroParte: 'ULKA-EP5-230', estado: 'activo', precioARS: 68250, precioUSD: 65, ivaIncluido: true, stockDisponible: 25, stockMinimoAlerta: 5, tiempoReposicionDias: 5, compatibleConRubros: ['cafe_bebidas'], compatibleConMarcas: ['La Marzocco', 'Gaggia', 'Rocket', 'Nuova Simonelli'], descripcionCompatibilidad: 'Compatible con la mayoría de espresso grupos 1-3', logistica: { ean13: '8032057116522', pesoNeto: 0.2, pesoBruto: 0.3, largo: 14, ancho: 6, alto: 6, tipoPackaging: 'unitario', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Italia', posicionArancelaria: '8413.50.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C010', codigoInterno: 'WIN-RES-GS630', nombre: 'Resistencia calefactora Winterhalter GS 630', descripcion: 'Elemento resistivo de repuesto para lavavajillas Winterhalter GS 630 y GS 640. 3kW, 230V.', rubro: 'lavado_comercial', categoria: 'Elementos calefactores', subcategoria: 'Resistencias', marca: 'Winterhalter', modelo: 'GS 630/640', numeroParte: 'WIN-30000043', estado: 'inactivo', precioARS: 115500, precioUSD: 110, ivaIncluido: true, stockDisponible: 0, stockMinimoAlerta: 1, tiempoReposicionDias: 21, compatibleConRubros: ['lavado_comercial'], compatibleConMarcas: ['Winterhalter'], descripcionCompatibilidad: 'GS 630, GS 640 — verificar ficha técnica', logistica: { ean13: '', pesoNeto: 0.8, pesoBruto: 1.1, largo: 40, ancho: 15, alto: 10, tipoPackaging: 'caja', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Alemania', posicionArancelaria: '8516.80.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C011', codigoInterno: 'LM-KIT-LINEA', nombre: 'Kit juntas y sellos La Marzocco Linea PB/MP', descripcion: 'Kit completo de juntas y sellos de repuesto para La Marzocco Linea PB y MP. Incluye 10 piezas.', rubro: 'cafe_bebidas', categoria: 'Kits y repuestos', subcategoria: 'Kits de mantenimiento', marca: 'La Marzocco', modelo: 'Linea PB/MP', numeroParte: 'LM-KIT-ORB', estado: 'activo', precioARS: 39900, precioUSD: 38, ivaIncluido: true, stockDisponible: 18, stockMinimoAlerta: 5, tiempoReposicionDias: 7, compatibleConRubros: ['cafe_bebidas'], compatibleConMarcas: ['La Marzocco'], descripcionCompatibilidad: 'Linea PB 2G/3G y Linea MP', logistica: { ean13: '', pesoNeto: 0.05, pesoBruto: 0.1, largo: 10, ancho: 8, alto: 3, tipoPackaging: 'unitario', unidadVenta: 'Kit', origen: 'importado', paisOrigen: 'Italia', posicionArancelaria: '3926.90.90', temperatura: 'ambiente' }, imagenes: [] },
  { id: 'C012', codigoInterno: 'WIN-BOMB-UCM', nombre: 'Electrobomba circuladora Winterhalter UC-M', descripcion: 'Bomba de circulación de agua para lavavajillas Winterhalter UC-M. 220V 50Hz.', rubro: 'lavado_comercial', categoria: 'Bombas y motores', subcategoria: 'Bombas de circulación', marca: 'Winterhalter', modelo: 'UC-M', numeroParte: 'WIN-62002434', estado: 'descontinuado', precioARS: 199500, precioUSD: 190, ivaIncluido: true, stockDisponible: 1, stockMinimoAlerta: 0, tiempoReposicionDias: 30, compatibleConRubros: ['lavado_comercial'], compatibleConMarcas: ['Winterhalter'], descripcionCompatibilidad: 'UC-M, UC-L — series anteriores a 2020', logistica: { ean13: '', pesoNeto: 1.5, pesoBruto: 2.2, largo: 22, ancho: 18, alto: 14, tipoPackaging: 'caja', unidadVenta: 'Unidad', origen: 'importado', paisOrigen: 'Alemania', posicionArancelaria: '8413.70.90', temperatura: 'ambiente' }, imagenes: [] },
];

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: EstadoProducto }) {
  const cfg = {
    activo:       { label: 'Activo',        cls: 'bg-green-100 text-green-700' },
    inactivo:     { label: 'Inactivo',      cls: 'bg-gray-100 text-gray-500' },
    descontinuado:{ label: 'Descontinuado', cls: 'bg-red-50 text-red-500' },
  };
  const c = cfg[estado];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.cls}`}>{c.label}</span>;
}

function StockCell({ n }: { n: number }) {
  if (n === 0) return <span className="text-xs font-bold text-red-500">Sin stock</span>;
  if (n <= 3) return <span className="text-xs font-bold text-amber-600">{n} (bajo)</span>;
  return <span className="text-xs font-bold text-gray-700">{n}</span>;
}

// ─── ELIMINAR MODAL ───────────────────────────────────────────────────────────

function EliminarModal({ nombre, onConfirm, onCancel }: { nombre: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-bold text-[#0D0D0D]">Eliminar producto</p>
            <p className="text-xs text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          ¿Eliminás <span className="font-bold text-[#0D0D0D]">"{nombre}"</span> del catálogo?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AGREGAR / EDITAR MODAL ───────────────────────────────────────────────────

interface ModalProps {
  producto: ProductoCatalogo | null;
  onClose: () => void;
  onSave: (p: ProductoCatalogo) => void;
  existingCodigos: string[];
}

function AgregarEditarModal({ producto, onClose, onSave, existingCodigos }: ModalProps) {
  const isNew = !producto?.id;
  const [draft, setDraft] = useState<ProductoCatalogo>(() => producto ? { ...producto, logistica: { ...producto.logistica } } : emptyProducto());
  const [tab, setTab] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marcaTag, setMarcaTag] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(producto?.imagenes ?? []);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = producto ? { ...producto, logistica: { ...producto.logistica } } : emptyProducto();
    setDraft(p);
    setImagePreviews(p.imagenes);
    setImageFiles([]);
    setErrors({});
    setTab(0);
  }, [producto]);

  const up = (field: keyof ProductoCatalogo, value: unknown) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  const upLog = (field: keyof LogisticaInfo, value: unknown) =>
    setDraft(prev => ({ ...prev, logistica: { ...prev.logistica, [field]: value } }));

  // Cascade data
  const categorias = useMemo(
    () => [...new Set(TAXONOMIA_ACTIVOS.filter(e => e.rubro === draft.rubro).map(e => e.categoria))],
    [draft.rubro]
  );
  const subcategorias = useMemo(
    () => TAXONOMIA_ACTIVOS.filter(e => e.rubro === draft.rubro && e.categoria === draft.categoria).map(e => e.subcategoria),
    [draft.rubro, draft.categoria]
  );

  const addMarca = () => {
    const t = marcaTag.trim();
    if (t && !draft.compatibleConMarcas.includes(t)) {
      up('compatibleConMarcas', [...draft.compatibleConMarcas, t]);
      setMarcaTag('');
    }
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = [...imageFiles, ...Array.from(e.target.files ?? [])].slice(0, 5);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeImage = (i: number) => {
    const nf = imageFiles.filter((_, idx) => idx !== i);
    setImageFiles(nf);
    setImagePreviews(nf.map(f => URL.createObjectURL(f)));
  };

  // Tab error indicators
  const allErrors = validateProducto(draft);
  const TAB_FIELDS: string[][] = [
    ['codigoInterno', 'nombre', 'descripcion', 'marca'],
    ['precioARS', 'stockDisponible'],
    [],
    ['ean13', 'pesoNeto', 'dimensiones'],
    [],
  ];
  const tabHasError = TAB_FIELDS.map(fields => fields.some(f => f in allErrors));

  const handleSave = () => {
    const err = validateProducto(draft);
    // Also check duplicate codigo
    if (isNew && existingCodigos.includes(draft.codigoInterno.trim())) {
      err.codigoInterno = 'Código ya existe en el catálogo';
    }
    if (Object.keys(err).length > 0) {
      setErrors(err);
      // Jump to first tab with error
      const firstErrTab = TAB_FIELDS.findIndex(fields => fields.some(f => f in err));
      if (firstErrTab >= 0) setTab(firstErrTab);
      return;
    }
    const saved: ProductoCatalogo = {
      ...draft,
      id: draft.id || newId(),
      imagenes: imagePreviews,
    };
    onSave(saved);
  };

  const TABS = ['Identificación', 'Precios y Stock', 'Compatibilidad', 'Logística', 'Imágenes'];

  const numInput = (val: number, onChange: (n: number) => void, placeholder?: string) => (
    <input
      type="number"
      min="0"
      step="any"
      value={val || ''}
      placeholder={placeholder ?? '0'}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors"
    />
  );

  const selectCls = "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors";
  const inputCls = (err?: string) => `w-full rounded-lg border ${err ? 'border-red-400' : 'border-gray-200'} px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors`;
  const errMsg = (msg?: string) => msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;
  const label = (text: string, req?: boolean) => (
    <label className="block text-xs font-bold text-gray-500 mb-1">
      {text}{req && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-bold text-[#0D0D0D]">{isNew ? 'Agregar producto' : 'Editar producto'}</h2>
            {!isNew && <p className="text-xs text-gray-400 mt-0.5">{draft.codigoInterno} · {draft.nombre}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 gap-1 overflow-x-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`relative shrink-0 py-3 px-3 text-xs font-bold transition-colors border-b-2 ${
                tab === i ? 'border-[#2698D1] text-[#2698D1]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
              {tabHasError[i] && <span className="absolute top-2 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 space-y-4">

          {/* TAB 0: Identificación */}
          {tab === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Código interno', true)}
                  <input value={draft.codigoInterno} onChange={e => up('codigoInterno', e.target.value)}
                    className={inputCls(errors.codigoInterno)} placeholder="FAG-QUEM-001" />
                  {errMsg(errors.codigoInterno)}
                </div>
                <div>
                  {label('Estado')}
                  <div className="relative">
                    <select value={draft.estado} onChange={e => up('estado', e.target.value as EstadoProducto)} className={selectCls}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="descontinuado">Descontinuado</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                {label('Nombre del producto', true)}
                <input value={draft.nombre} onChange={e => up('nombre', e.target.value)}
                  className={inputCls(errors.nombre)} placeholder="Nombre descriptivo del producto" />
                {errMsg(errors.nombre)}
              </div>

              <div>
                {label('Descripción', true)}
                <textarea value={draft.descripcion} onChange={e => up('descripcion', e.target.value)} rows={3}
                  className={`w-full rounded-lg border ${errors.descripcion ? 'border-red-400' : 'border-gray-200'} px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors resize-none`}
                  placeholder="Descripción técnica del producto" />
                {errMsg(errors.descripcion)}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  {label('Rubro', true)}
                  <div className="relative">
                    <select value={draft.rubro} onChange={e => { up('rubro', e.target.value as Rubro); up('categoria', ''); up('subcategoria', ''); }} className={selectCls}>
                      {TODOS_LOS_RUBROS.map(r => <option key={r} value={r}>{RUBRO_LABELS[r]}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
                <div>
                  {label('Categoría')}
                  {categorias.length > 0 ? (
                    <div className="relative">
                      <select value={draft.categoria} onChange={e => { up('categoria', e.target.value); up('subcategoria', ''); }} className={selectCls}>
                        <option value="">Seleccionar</option>
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </div>
                  ) : (
                    <input value={draft.categoria} onChange={e => up('categoria', e.target.value)}
                      className={inputCls()} placeholder="Ej: Quemadores" />
                  )}
                </div>
                <div>
                  {label('Subcategoría')}
                  {subcategorias.length > 0 ? (
                    <div className="relative">
                      <select value={draft.subcategoria} onChange={e => up('subcategoria', e.target.value)} className={selectCls}>
                        <option value="">Seleccionar</option>
                        {subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </div>
                  ) : (
                    <input value={draft.subcategoria} onChange={e => up('subcategoria', e.target.value)}
                      className={inputCls()} placeholder="Ej: Doble corona" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  {label('Marca', true)}
                  <input value={draft.marca} onChange={e => up('marca', e.target.value)}
                    className={inputCls(errors.marca)} placeholder="Fagor" />
                  {errMsg(errors.marca)}
                </div>
                <div>
                  {label('Modelo')}
                  <input value={draft.modelo} onChange={e => up('modelo', e.target.value)}
                    className={inputCls()} placeholder="QDC-8kW" />
                </div>
                <div>
                  {label('N° de parte')}
                  <input value={draft.numeroParte} onChange={e => up('numeroParte', e.target.value)}
                    className={inputCls()} placeholder="FAG-78234" />
                </div>
              </div>
            </>
          )}

          {/* TAB 1: Precios y Stock */}
          {tab === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Precio ARS', true)}
                  <input type="number" min="0" step="0.01" value={draft.precioARS || ''}
                    onChange={e => up('precioARS', parseFloat(e.target.value) || 0)}
                    className={inputCls(errors.precioARS)} placeholder="0.00" />
                  {errMsg(errors.precioARS)}
                </div>
                <div>
                  {label('Precio USD')}
                  <input type="number" min="0" step="0.01" value={draft.precioUSD || ''}
                    onChange={e => up('precioUSD', parseFloat(e.target.value) || 0)}
                    className={inputCls()} placeholder="0.00" />
                  {draft.precioUSD > 0 && (
                    <p className="mt-1 text-xs text-gray-400">≈ {formatARS(draft.precioUSD * TASA)} al tipo de cambio {TASA}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => up('ivaIncluido', !draft.ivaIncluido)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${draft.ivaIncluido ? 'bg-[#2698D1]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${draft.ivaIncluido ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-600">IVA incluido en el precio</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  {label('Stock disponible', true)}
                  <input type="number" min="0" value={draft.stockDisponible || ''}
                    onChange={e => up('stockDisponible', parseInt(e.target.value) || 0)}
                    className={inputCls(errors.stockDisponible)} placeholder="0" />
                  {errMsg(errors.stockDisponible)}
                </div>
                <div>
                  {label('Stock mínimo alerta')}
                  {numInput(draft.stockMinimoAlerta, v => up('stockMinimoAlerta', v))}
                </div>
                <div>
                  {label('Reposición (días)')}
                  {numInput(draft.tiempoReposicionDias, v => up('tiempoReposicionDias', v))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Compatibilidad */}
          {tab === 2 && (
            <>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">La compatibilidad determina en qué OTs y búsquedas aparece este producto. Cuanto más completa, mejor posicionamiento en el marketplace.</p>
              </div>

              <div>
                {label('Rubros compatibles')}
                <div className="grid grid-cols-2 gap-2">
                  {TODOS_LOS_RUBROS.map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={draft.compatibleConRubros.includes(r)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...draft.compatibleConRubros, r]
                            : draft.compatibleConRubros.filter(x => x !== r);
                          up('compatibleConRubros', updated);
                        }}
                        className="h-3.5 w-3.5 accent-[#2698D1]"
                      />
                      <span className="text-xs text-gray-600">{RUBRO_LABELS[r]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                {label('Marcas compatibles')}
                <div className="flex gap-2 mb-2">
                  <input value={marcaTag} onChange={e => setMarcaTag(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMarca(); } }}
                    className={inputCls()} placeholder="Escribí una marca y Enter" />
                  <button onClick={addMarca} className="rounded-lg bg-[#2698D1] px-3 py-2 text-xs font-bold text-white hover:bg-[#1e7db0] transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {draft.compatibleConMarcas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {draft.compatibleConMarcas.map(m => (
                      <span key={m} className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                        {m}
                        <button onClick={() => up('compatibleConMarcas', draft.compatibleConMarcas.filter(x => x !== m))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {label('Descripción de compatibilidad')}
                <textarea value={draft.descripcionCompatibilidad}
                  onChange={e => up('descripcionCompatibilidad', e.target.value)} rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors resize-none"
                  placeholder="Ej: Compatible con hornos Rational SCC 61/102 y CombiMaster Plus" />
              </div>
            </>
          )}

          {/* TAB 3: Logística */}
          {tab === 3 && (
            <>
              <div>
                {label('EAN-13')}
                <input value={draft.logistica.ean13} onChange={e => upLog('ean13', e.target.value)}
                  className={inputCls(errors.ean13)} placeholder="1234567890123" maxLength={13} />
                {errMsg(errors.ean13)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Peso neto (kg)')}
                  {numInput(draft.logistica.pesoNeto, v => upLog('pesoNeto', v), '0.000')}
                  {errMsg(errors.pesoNeto)}
                </div>
                <div>
                  {label('Peso bruto (kg)')}
                  {numInput(draft.logistica.pesoBruto, v => upLog('pesoBruto', v), '0.000')}
                </div>
              </div>

              <div>
                {label('Dimensiones (cm) — Largo × Ancho × Alto')}
                <div className="grid grid-cols-3 gap-3">
                  {numInput(draft.logistica.largo, v => upLog('largo', v), 'Largo')}
                  {numInput(draft.logistica.ancho, v => upLog('ancho', v), 'Ancho')}
                  {numInput(draft.logistica.alto, v => upLog('alto', v), 'Alto')}
                </div>
                {errMsg(errors.dimensiones)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Tipo de packaging')}
                  <div className="relative">
                    <select value={draft.logistica.tipoPackaging} onChange={e => upLog('tipoPackaging', e.target.value as TipoPackaging | '')} className={selectCls}>
                      <option value="">Sin especificar</option>
                      <option value="unitario">Unitario</option>
                      <option value="caja">Caja</option>
                      <option value="pallet">Pallet</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
                <div>
                  {label('Unidad de venta')}
                  <input value={draft.logistica.unidadVenta} onChange={e => upLog('unidadVenta', e.target.value)}
                    className={inputCls()} placeholder="Unidad, Kit, Par…" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Origen')}
                  <div className="relative">
                    <select value={draft.logistica.origen} onChange={e => { upLog('origen', e.target.value); if (e.target.value !== 'importado') upLog('paisOrigen', ''); }} className={selectCls}>
                      <option value="">Sin especificar</option>
                      <option value="nacional">Nacional</option>
                      <option value="importado">Importado</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
                {draft.logistica.origen === 'importado' && (
                  <div>
                    {label('País de origen')}
                    <input value={draft.logistica.paisOrigen} onChange={e => upLog('paisOrigen', e.target.value)}
                      className={inputCls()} placeholder="Ej: Italia" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Posición arancelaria')}
                  <input value={draft.logistica.posicionArancelaria} onChange={e => upLog('posicionArancelaria', e.target.value)}
                    className={inputCls()} placeholder="Ej: 8413.50.90" />
                </div>
                <div>
                  {label('Temperatura de almacenamiento')}
                  <div className="relative">
                    <select value={draft.logistica.temperatura} onChange={e => upLog('temperatura', e.target.value as TemperaturaAlmacenamiento | '')} className={selectCls}>
                      <option value="">Sin especificar</option>
                      <option value="ambiente">Ambiente</option>
                      <option value="refrigerado">Refrigerado</option>
                      <option value="congelado">Congelado</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: Imágenes */}
          {tab === 4 && (
            <>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex gap-3">
                <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">Máximo 5 imágenes. La primera se usa como imagen principal en el marketplace.</p>
              </div>

              {imagePreviews.length < 5 && (
                <>
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 hover:border-[#2698D1] hover:bg-blue-50 transition-colors">
                    <Upload className="h-6 w-6 text-gray-300" />
                    <span className="text-sm font-bold text-gray-400">Subir imágenes</span>
                    <span className="text-xs text-gray-300">PNG, JPG, WEBP — máx. 5MB c/u</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />
                </>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">Principal</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex gap-1">
            {TABS.map((_, i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`h-1.5 rounded-full transition-all ${tab === i ? 'w-6 bg-[#2698D1]' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => tab > 0 ? setTab(tab - 1) : onClose()}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              {tab > 0 ? 'Anterior' : 'Cancelar'}
            </button>
            {tab < TABS.length - 1 ? (
              <button onClick={() => setTab(tab + 1)}
                className="rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1e7db0] transition-colors">
                Siguiente
              </button>
            ) : (
              <button onClick={handleSave}
                className="rounded-lg bg-[#0D0D0D] px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {isNew ? 'Agregar producto' : 'Guardar cambios'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProveedorCatalogo() {
  const searchParams  = useSearchParams();
  const proveedorId   = searchParams.get('id') ?? 'P001';
  const proveedor     = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [productos, setProductos] = useState<ProductoCatalogo[]>(SEED_CATALOGO);
  const [buscar,    setBuscar]    = useState('');
  const [filtRubro, setFiltRubro] = useState<string>('todos');
  const [filtEst,   setFiltEst]   = useState<string>('todos');
  const [filtCompat,setFiltCompat]= useState<string>('todos');
  const [page,      setPage]      = useState(1);

  // Modal state
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<ProductoCatalogo | null>(null);
  const [elimTarget, setElimTarget] = useState<ProductoCatalogo | null>(null);
  const [toast,      setToast]      = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtrados = useMemo(() => {
    let list = productos;
    if (filtRubro !== 'todos') list = list.filter(p => p.rubro === filtRubro);
    if (filtEst   !== 'todos') list = list.filter(p => p.estado === filtEst);
    if (filtCompat === 'con')  list = list.filter(p => p.compatibleConRubros.length > 0 || p.compatibleConMarcas.length > 0);
    if (filtCompat === 'sin')  list = list.filter(p => p.compatibleConRubros.length === 0 && p.compatibleConMarcas.length === 0);
    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigoInterno.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const order: Record<EstadoProducto, number> = { activo: 0, inactivo: 1, descontinuado: 2 };
      return (order[a.estado] - order[b.estado]) || a.nombre.localeCompare(b.nombre);
    });
  }, [productos, filtRubro, filtEst, filtCompat, buscar]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const pageData   = filtrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter change
  const setFilter = (fn: () => void) => { fn(); setPage(1); };

  const rubrosEnCatalogo = [...new Set(productos.map(p => p.rubro))];

  const handleSave = (p: ProductoCatalogo) => {
    setProductos(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      return idx >= 0 ? prev.map(x => x.id === p.id ? p : x) : [...prev, p];
    });
    setModalOpen(false);
    setEditTarget(null);
    showToast(p.id && productos.some(x => x.id === p.id) ? 'Producto actualizado' : 'Producto agregado al catálogo');
  };

  const handleToggle = (p: ProductoCatalogo) => {
    const nuevoEstado: EstadoProducto = p.estado === 'activo' ? 'inactivo' : 'activo';
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, estado: nuevoEstado } : x));
    showToast(nuevoEstado === 'activo' ? 'Producto activado' : 'Producto desactivado');
  };

  const handleDuplicate = (p: ProductoCatalogo) => {
    const copia: ProductoCatalogo = {
      ...p,
      id: newId(),
      codigoInterno: `${p.codigoInterno}-COPIA`,
      nombre: `${p.nombre} (copia)`,
      estado: 'inactivo',
    };
    setProductos(prev => [...prev, copia]);
    showToast('Producto duplicado como inactivo');
  };

  const handleEliminar = () => {
    if (!elimTarget) return;
    setProductos(prev => prev.filter(x => x.id !== elimTarget.id));
    setElimTarget(null);
    showToast('Producto eliminado del catálogo');
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (p: ProductoCatalogo) => { setEditTarget(p); setModalOpen(true); };

  const existingCodigos = productos.filter(p => p.id !== editTarget?.id).map(p => p.codigoInterno);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          {/* Toast */}
          {toast && (
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-4 py-3 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm font-bold text-white">{toast}</span>
            </div>
          )}

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Catálogo</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {proveedor.nombre} · {productos.length} productos
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => showToast('Importación CSV próximamente')}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-gray-300 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" /> Importar CSV
              </button>
              <button
                onClick={() => showToast('Exportación próximamente')}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-gray-300 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Exportar
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 rounded-lg bg-[#2698D1] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e7db0] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar producto
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={buscar} onChange={e => { setFilter(() => setBuscar(e.target.value)); }}
                placeholder="Buscar por nombre, código o marca…"
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm outline-none focus:border-[#2698D1] transition-colors" />
              {buscar && (
                <button onClick={() => setFilter(() => setBuscar(''))} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>

            <div className="relative">
              <select value={filtRubro} onChange={e => setFilter(() => setFiltRubro(e.target.value))}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]">
                <option value="todos">Todos los rubros</option>
                {rubrosEnCatalogo.map(r => <option key={r} value={r}>{RUBRO_LABELS[r as Rubro]}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            <div className="relative">
              <select value={filtEst} onChange={e => setFilter(() => setFiltEst(e.target.value))}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]">
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="descontinuado">Descontinuado</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            <div className="relative">
              <select value={filtCompat} onChange={e => setFilter(() => setFiltCompat(e.target.value))}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]">
                <option value="todos">Compatibilidad: todos</option>
                <option value="con">Con compatibilidad</option>
                <option value="sin">Sin compatibilidad</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            {(buscar || filtRubro !== 'todos' || filtEst !== 'todos' || filtCompat !== 'todos') && (
              <button
                onClick={() => { setBuscar(''); setFiltRubro('todos'); setFiltEst('todos'); setFiltCompat('todos'); setPage(1); }}
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" /> Limpiar
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
              {filtrados.length < productos.length && ` de ${productos.length}`}
            </p>
            <p className="text-xs text-gray-400">
              Pág. {page} de {totalPages}
            </p>
          </div>

          {/* Table */}
          {filtrados.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-gray-200" />
              <p className="font-bold text-gray-400">Sin productos en esta vista</p>
              <p className="text-xs text-gray-300 mt-1">Probá con otros filtros o agregá un producto</p>
            </div>
          ) : (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Categoría</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wide">Precio ARS</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Stock</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((p, i) => (
                    <tr key={p.id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-400">{p.codigoInterno}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm font-bold text-[#0D0D0D] truncate">{p.nombre}</p>
                        <p className="text-xs text-gray-400">{p.marca}{p.modelo ? ` · ${p.modelo}` : ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-gray-600">{RUBRO_LABELS[p.rubro]}</p>
                        {p.categoria && <p className="text-xs text-gray-400">{p.categoria}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-black text-[#0D0D0D]">{formatARS(p.precioARS)}</span>
                        {!p.ivaIncluido && <p className="text-xs text-gray-400">+ IVA</p>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StockCell n={p.stockDisponible} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <EstadoBadge estado={p.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            title="Editar"
                            className="rounded-lg p-1.5 hover:bg-blue-50 text-gray-400 hover:text-[#2698D1] transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            title="Duplicar"
                            className="rounded-lg p-1.5 hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggle(p)}
                            title={p.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            className={`rounded-lg p-1.5 transition-colors ${p.estado === 'activo' ? 'hover:bg-amber-50 text-gray-400 hover:text-amber-600' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setElimTarget(p)}
                            title="Eliminar"
                            className="rounded-lg p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3 bg-gray-50">
                  <p className="text-xs text-gray-400">
                    Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtrados.length)} de {filtrados.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg p-1.5 hover:bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition-colors ${n === page ? 'bg-[#2698D1] text-white' : 'border border-gray-200 text-gray-500 hover:bg-white'}`}>
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg p-1.5 hover:bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      {modalOpen && (
        <AgregarEditarModal
          producto={editTarget}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
          onSave={handleSave}
          existingCodigos={existingCodigos}
        />
      )}
      {elimTarget && (
        <EliminarModal
          nombre={elimTarget.nombre}
          onConfirm={handleEliminar}
          onCancel={() => setElimTarget(null)}
        />
      )}
    </div>
  );
}
