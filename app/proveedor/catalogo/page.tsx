"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES } from '@/data/mock';
import { RUBRO_LABELS, TODOS_LOS_RUBROS } from '@/types/shuuri';
import type { Rubro } from '@/types/shuuri';
import {
  Search, Package, Tag, X, ChevronDown,
  Star, CheckCircle2, AlertCircle, Zap,
} from 'lucide-react';

// ─── CATÁLOGO MOCK LOCAL ──────────────────────────────────────────────────────

interface ProductoCatalogo {
  id:          string;
  descripcion: string;
  marca:       string;
  modelo?:     string;
  rubro:       Rubro;
  tipo:        'repuesto' | 'equipamiento' | 'insumo';
  precioUSD:   number;
  stock:       'disponible' | 'bajo_stock' | 'sin_stock' | 'bajo_pedido';
  esDestacado: boolean;
  compatibilidad?: string;
}

const CATALOGO_P001: ProductoCatalogo[] = [
  { id: 'C001', descripcion: 'Quemador de gas tipo doble corona 8kW',            marca: 'Fagor',         rubro: 'gas_combustion',          tipo: 'repuesto',     precioUSD: 95,   stock: 'disponible',  esDestacado: true  },
  { id: 'C002', descripcion: 'Módulo de control electrónico Rational SCC 61',    marca: 'Rational',      rubro: 'calor_comercial',         tipo: 'repuesto',     precioUSD: 380,  stock: 'bajo_pedido', esDestacado: false, compatibilidad: 'Rational SCC 61/102' },
  { id: 'C003', descripcion: 'Cuchillo de corte Robot Coupe R201',              marca: 'Robot Coupe',   rubro: 'maquinaria_preparacion',  tipo: 'repuesto',     precioUSD: 45,   stock: 'disponible',  esDestacado: true  },
  { id: 'C004', descripcion: 'Filtro de grasa campana acero inoxidable 500x500', marca: 'Faema',         rubro: 'campanas_extraccion',     tipo: 'repuesto',     precioUSD: 55,   stock: 'disponible',  esDestacado: false },
  { id: 'C005', descripcion: 'Horno mixto 6 bandejas GN 1/1',                   marca: 'Convotherm',    rubro: 'calor_comercial',         tipo: 'equipamiento', precioUSD: 4800, stock: 'bajo_pedido', esDestacado: true  },
  { id: 'C006', descripcion: 'Termo resistencia sonda temperatura Fagor EVO',   marca: 'Fagor',         rubro: 'calor_comercial',         tipo: 'repuesto',     precioUSD: 38,   stock: 'disponible',  esDestacado: false, compatibilidad: 'Fagor EVO serie' },
  { id: 'C007', descripcion: 'Válvula solenoide gas 1/2" DN15 24V',             marca: 'Brahma',        rubro: 'gas_combustion',          tipo: 'repuesto',     precioUSD: 72,   stock: 'bajo_stock',  esDestacado: false },
  { id: 'C008', descripcion: 'Motor extractor campana 900m³/h',                 marca: 'S&P',           rubro: 'campanas_extraccion',     tipo: 'repuesto',     precioUSD: 210,  stock: 'disponible',  esDestacado: false },
];

const CATALOGO_P002: ProductoCatalogo[] = [
  { id: 'C020', descripcion: 'Compresor Tecumseh FH 2480Z 1/3HP R404A',         marca: 'Tecumseh',  rubro: 'frio_comercial', tipo: 'repuesto',     precioUSD: 180,  stock: 'disponible',  esDestacado: true  },
  { id: 'C021', descripcion: 'Gas refrigerante R404A 10kg (cilindro)',           marca: 'Honeywell', rubro: 'frio_comercial', tipo: 'insumo',       precioUSD: 45,   stock: 'disponible',  esDestacado: true  },
  { id: 'C022', descripcion: 'Termostato electrónico Eliwell ID 974',           marca: 'Eliwell',   rubro: 'frio_comercial', tipo: 'repuesto',     precioUSD: 95,   stock: 'disponible',  esDestacado: false },
  { id: 'C023', descripcion: 'Evaporador cámara frigorífica 400W',              marca: 'Rivacold',  rubro: 'frio_comercial', tipo: 'repuesto',     precioUSD: 220,  stock: 'bajo_stock',  esDestacado: false },
  { id: 'C024', descripcion: 'Gas refrigerante R600A 1kg (isobutano)',          marca: 'Linde',     rubro: 'frio_comercial', tipo: 'insumo',       precioUSD: 18,   stock: 'disponible',  esDestacado: false },
  { id: 'C025', descripcion: 'Condensador ventilado 1200W 220V',                marca: 'Embraco',   rubro: 'frio_comercial', tipo: 'repuesto',     precioUSD: 165,  stock: 'disponible',  esDestacado: false },
  { id: 'C026', descripcion: 'Moto ventilador cámara frigorífica 15W',         marca: 'Elgin',     rubro: 'frio_comercial', tipo: 'repuesto',     precioUSD: 42,   stock: 'disponible',  esDestacado: false },
  { id: 'C027', descripcion: 'Cámara frigorífica modular 6m² plug-in',         marca: 'Frider',    rubro: 'frio_comercial', tipo: 'equipamiento', precioUSD: 3200, stock: 'bajo_pedido', esDestacado: true  },
];

const CATALOGO_P003: ProductoCatalogo[] = [
  { id: 'C040', descripcion: 'Bomba vibradora ULKA EP5 230V 15W 48Hz',          marca: 'ULKA',               rubro: 'cafe_bebidas',           tipo: 'repuesto',     precioUSD: 65,   stock: 'disponible',  esDestacado: true  },
  { id: 'C041', descripcion: 'Kit juntas y sellos La Marzocco Linea PB/MP',     marca: 'La Marzocco',        rubro: 'cafe_bebidas',           tipo: 'repuesto',     precioUSD: 38,   stock: 'disponible',  esDestacado: true  },
  { id: 'C042', descripcion: 'Resistencia calefactora Winterhalter GS 630',     marca: 'Winterhalter',       rubro: 'lavado_comercial',       tipo: 'repuesto',     precioUSD: 110,  stock: 'disponible',  esDestacado: false, compatibilidad: 'GS 630/640' },
  { id: 'C043', descripcion: 'Grupo La Marzocco Linea Classic — revisión completa', marca: 'La Marzocco',    rubro: 'cafe_bebidas',           tipo: 'repuesto',     precioUSD: 285,  stock: 'bajo_pedido', esDestacado: false },
  { id: 'C044', descripcion: 'Detergente BackFlush Puly Caff 900gr',            marca: 'Puly Caff',          rubro: 'cafe_bebidas',           tipo: 'insumo',       precioUSD: 18,   stock: 'disponible',  esDestacado: false },
  { id: 'C045', descripcion: 'Electrobomba circuladora Winterhalter UC-M',      marca: 'Winterhalter',       rubro: 'lavado_comercial',       tipo: 'repuesto',     precioUSD: 190,  stock: 'disponible',  esDestacado: false },
  { id: 'C046', descripcion: 'Cafetera espresso La Marzocco Linea Classic 2G',  marca: 'La Marzocco',        rubro: 'cafe_bebidas',           tipo: 'equipamiento', precioUSD: 6800, stock: 'bajo_pedido', esDestacado: true  },
  { id: 'C047', descripcion: 'Lavavajillas de campana Winterhalter PT-M',       marca: 'Winterhalter',       rubro: 'lavado_comercial',       tipo: 'equipamiento', precioUSD: 5200, stock: 'bajo_pedido', esDestacado: true  },
];

const CATALOGOS: Record<string, ProductoCatalogo[]> = {
  P001: CATALOGO_P001,
  P002: CATALOGO_P002,
  P003: CATALOGO_P003,
};

// ─── STOCK BADGE ─────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: ProductoCatalogo['stock'] }) {
  const cfg = {
    disponible:  { label: 'Disponible',   cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
    bajo_stock:  { label: 'Bajo stock',   cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    sin_stock:   { label: 'Sin stock',    cls: 'bg-red-100 text-red-600',      dot: 'bg-red-500' },
    bajo_pedido: { label: 'Bajo pedido',  cls: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
  };
  const c = cfg[stock];
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${c.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── TIPO BADGE ───────────────────────────────────────────────────────────────

function TipoBadge({ tipo }: { tipo: ProductoCatalogo['tipo'] }) {
  const cfg = {
    repuesto:     { label: 'Repuesto',     cls: 'bg-blue-50 text-blue-600' },
    equipamiento: { label: 'Equipamiento', cls: 'bg-purple-50 text-purple-600' },
    insumo:       { label: 'Insumo',       cls: 'bg-amber-50 text-amber-700' },
  };
  const c = cfg[tipo];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.cls}`}>{c.label}</span>;
}

// ─── CARD PRODUCTO ────────────────────────────────────────────────────────────

function CardProducto({ p }: { p: ProductoCatalogo }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-all hover:border-[#2698D1]/30 overflow-hidden ${
      p.esDestacado ? 'ring-1 ring-amber-200' : ''
    }`}>
      {p.esDestacado && (
        <div className="flex items-center gap-1.5 bg-amber-50 px-4 py-1.5 border-b border-amber-100">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-600">Destacado</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 shrink-0">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <StockBadge stock={p.stock} />
          </div>
        </div>

        <p className="font-bold text-sm text-[#0D0D0D] leading-snug mb-1">{p.descripcion}</p>
        <p className="text-xs text-gray-400 mb-3">{p.marca}{p.modelo ? ` · ${p.modelo}` : ''}</p>

        {p.compatibilidad && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            <CheckCircle2 className="h-3 w-3 text-gray-300 shrink-0" />
            Compatible: {p.compatibilidad}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <TipoBadge tipo={p.tipo} />
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{RUBRO_LABELS[p.rubro]}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-mono">{p.id}</span>
          <span className="text-lg font-black text-[#0D0D0D]">USD {p.precioUSD}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ProveedorCatalogo() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];
  const catalogo     = CATALOGOS[proveedorId] ?? [];

  const [buscar, setBuscar] = useState('');
  const [rubro,  setRubro]  = useState<string>('todos');
  const [tipo,   setTipo]   = useState<string>('todos');
  const [soloStock, setSoloStock] = useState(false);

  const filtrados = useMemo(() => {
    let lista = catalogo;
    if (rubro !== 'todos') lista = lista.filter(p => p.rubro === rubro);
    if (tipo  !== 'todos') lista = lista.filter(p => p.tipo  === tipo);
    if (soloStock)         lista = lista.filter(p => p.stock === 'disponible' || p.stock === 'bajo_stock');
    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      lista = lista.filter(p =>
        p.descripcion.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.compatibilidad?.toLowerCase().includes(q)
      );
    }
    // Destacados primero
    return [...lista].sort((a, b) => (b.esDestacado ? 1 : 0) - (a.esDestacado ? 1 : 0));
  }, [catalogo, rubro, tipo, buscar, soloStock]);

  const rubrosEnCatalogo = [...new Set(catalogo.map(p => p.rubro))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Catálogo</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {proveedor.nombre} · {catalogo.length} productos · {proveedor.legajo?.cantidadSKUs ?? '—'} SKUs totales
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Actualización de precios</p>
              <p className="text-xs font-bold text-gray-600">{proveedor.legajo?.frecuenciaPrecios ?? '—'}</p>
            </div>
          </div>

          {/* MARCAS */}
          <div className="mb-6 rounded-xl border bg-white shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Marcas representadas</p>
            <p className="text-sm text-gray-600">{proveedor.legajo?.marcas ?? '—'}</p>
          </div>

          {/* FILTROS */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={buscar} onChange={e => setBuscar(e.target.value)}
                placeholder="Buscar producto, marca, modelo, compatibilidad…"
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1] transition-colors" />
              {buscar && (
                <button onClick={() => setBuscar('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>

            <div className="relative">
              <select value={rubro} onChange={e => setRubro(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]">
                <option value="todos">Todos los rubros</option>
                {rubrosEnCatalogo.map(r => (
                  <option key={r} value={r}>{RUBRO_LABELS[r as Rubro]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            <div className="relative">
              <select value={tipo} onChange={e => setTipo(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-[#2698D1]">
                <option value="todos">Todos los tipos</option>
                <option value="repuesto">Repuestos</option>
                <option value="equipamiento">Equipamiento</option>
                <option value="insumo">Insumos</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setSoloStock(!soloStock)}
                className={`relative h-5 w-9 rounded-full transition-colors ${soloStock ? 'bg-[#2698D1]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${soloStock ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">Solo con stock</span>
            </label>

            {(buscar || rubro !== 'todos' || tipo !== 'todos' || soloStock) && (
              <button
                onClick={() => { setBuscar(''); setRubro('todos'); setTipo('todos'); setSoloStock(false); }}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" /> Limpiar
              </button>
            )}
          </div>

          {/* RESULTADOS */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''}
              {filtrados.length < catalogo.length && ` de ${catalogo.length}`}
            </p>
            <p className="text-xs text-gray-400">
              {catalogo.filter(p => p.esDestacado).length} destacados
            </p>
          </div>

          {filtrados.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-gray-200" />
              <p className="font-bold text-gray-400">Sin productos en esta vista</p>
              <p className="text-xs text-gray-300 mt-1">Probá con otros filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtrados.map(p => <CardProducto key={p.id} p={p} />)}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
