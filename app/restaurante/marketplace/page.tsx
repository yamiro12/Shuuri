"use client";

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatARS } from '@/components/shared/utils';
import {
  EQUIPOS,
  getProductosMkt,
  getRepuestosMkt,
  getInsumosMkt,
  getRematesMkt,
} from '@/data/mock';
import type {
  ProductoMarketplace,
  Repuesto,
  Insumo,
  Remate,
  TipoSeller,
  CategoriaInsumo,
  Rubro,
} from '@/types/shuuri';
import { RUBRO_LABELS } from '@/types/shuuri';
import {
  ShoppingBag,
  Search,
  Star,
  Package,
  Wrench,
  Tag,
  Filter,
  X,
  ChevronRight,
  Clock,
  Gavel,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Zap,
  Truck,
  AlertCircle,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const RESTAURANTE_ID = 'R001';

const SELLER_LABELS: Record<TipoSeller, string> = {
  fabricante: 'Fabricante',
  representante: 'Representante',
  revendedor: 'Revendedor',
  importador: 'Importador',
  distribuidor: 'Distribuidor',
};

const CATEGORIA_LABELS: Record<CategoriaInsumo, string> = {
  comestibles: 'Comestibles',
  bebidas: 'Bebidas',
  descartables: 'Descartables',
  limpieza: 'Limpieza',
  manteleria: 'Mantelería',
  packaging: 'Packaging',
  preparacion: 'Preparación',
};

const CONDICION_CONFIG = {
  nuevo: { label: 'Nuevo', cls: 'bg-green-100 text-green-700' },
  usado: { label: 'Usado', cls: 'bg-amber-100 text-amber-700' },
  saldo: { label: 'Saldo', cls: 'bg-red-100 text-red-700' },
};

const RUBROS_MKT: Rubro[] = [
  'frio_comercial',
  'calor_comercial',
  'gas_combustion',
  'maquinaria_preparacion',
  'lavado_comercial',
  'cafe_bebidas',
  'pos_it',
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Tab = 'productos' | 'repuestos' | 'insumos';
type CarritoItem = {
  id: string;
  nombre: string;
  precio: number;
  tipo: 'producto' | 'repuesto' | 'insumo';
  cantidad: number;
};
type Pantalla = 'shop' | 'checkout' | 'exito';

// ─── COUNTDOWN HELPER ────────────────────────────────────────────────────────

function useCountdown(fechaCierre: string): string {
  const diff = new Date(fechaCierre).getTime() - Date.now();
  if (diff <= 0) return 'Cerrado';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────

function ProductCard({
  producto,
  onAgregar,
}: {
  producto: ProductoMarketplace;
  onAgregar: (item: Omit<CarritoItem, 'cantidad'>) => void;
}) {
  const condCfg = CONDICION_CONFIG[producto.condicion];
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 h-40 flex items-center justify-center">
        <Package className="w-16 h-16 text-gray-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${condCfg.cls}`}>
            {condCfg.label}
          </span>
          {producto.tiendaOficial && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              Tienda Oficial
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
          {producto.nombre}
        </h3>
        <p className="text-xs text-gray-500 mb-1">{producto.marca}</p>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">{producto.descripcion}</p>
        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900">{formatARS(producto.precio)}</p>
          <p className="text-xs text-gray-400 mb-2">+ 10% SHUURI al confirmar</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {producto.tipoSeller.map(s => SELLER_LABELS[s]).join(' / ')}
            </span>
            <span className="text-xs text-gray-500">Stock: {producto.stock}</span>
          </div>
          <button
            onClick={() =>
              onAgregar({ id: producto.id, nombre: producto.nombre, precio: producto.precio, tipo: 'producto' })
            }
            className="w-full flex items-center justify-center gap-2 bg-[#2698D1] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1e82b8] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPUESTO CARD ───────────────────────────────────────────────────────────

function RepuestoCard({
  repuesto,
  onAgregar,
}: {
  repuesto: Repuesto;
  onAgregar: (item: Omit<CarritoItem, 'cantidad'>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 h-32 flex items-center justify-center">
        <Wrench className="w-12 h-12 text-gray-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{repuesto.nombre}</h3>
        <p className="text-xs text-gray-500 mb-1">{repuesto.marca}</p>
        {repuesto.codigoFabricante && (
          <p className="text-xs text-gray-400 mb-2 font-mono">Cód: {repuesto.codigoFabricante}</p>
        )}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">{repuesto.descripcion}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {repuesto.compatibleMarcas.slice(0, 3).map(m => (
            <span key={m} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
              {m}
            </span>
          ))}
          {repuesto.compatibleMarcas.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              +{repuesto.compatibleMarcas.length - 3}
            </span>
          )}
        </div>
        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900">{formatARS(repuesto.precio)}</p>
          <p className="text-xs text-gray-400 mb-2">+ 15% SHUURI al confirmar</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              {RUBRO_LABELS[repuesto.rubro]}
            </span>
            <span className="text-xs text-gray-500">Stock: {repuesto.stock}</span>
          </div>
          <button
            onClick={() =>
              onAgregar({ id: repuesto.id, nombre: repuesto.nombre, precio: repuesto.precio, tipo: 'repuesto' })
            }
            className="w-full flex items-center justify-center gap-2 bg-[#2698D1] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1e82b8] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── INSUMO CARD ─────────────────────────────────────────────────────────────

function InsumoCard({
  insumo,
  onAgregar,
}: {
  insumo: Insumo;
  onAgregar: (item: Omit<CarritoItem, 'cantidad'>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 h-32 flex items-center justify-center">
        <Tag className="w-12 h-12 text-gray-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{insumo.nombre}</h3>
        <p className="text-xs text-gray-500 mb-1">{insumo.marca}</p>
        <p className="text-xs text-blue-600 font-medium mb-2">{insumo.unidad}</p>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-1">{insumo.descripcion}</p>
        {insumo.esPerecible && (
          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mb-2">
            <AlertCircle className="w-3 h-3" />
            Producto perecible
          </div>
        )}
        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900">{formatARS(insumo.precio)}</p>
          <p className="text-xs text-gray-400 mb-2">+ 10% SHUURI al confirmar</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {CATEGORIA_LABELS[insumo.categoria]}
            </span>
            <span className="text-xs text-gray-500">Stock: {insumo.stock}</span>
          </div>
          <button
            onClick={() =>
              onAgregar({ id: insumo.id, nombre: insumo.nombre, precio: insumo.precio, tipo: 'insumo' })
            }
            className="w-full flex items-center justify-center gap-2 bg-[#2698D1] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1e82b8] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REMATE CARD ─────────────────────────────────────────────────────────────

function RemateCard({
  remate,
  onOfertar,
  onComprar,
}: {
  remate: Remate;
  onOfertar: (r: Remate) => void;
  onComprar: (item: Omit<CarritoItem, 'cantidad'>) => void;
}) {
  const countdown = useCountdown(remate.fechaCierre);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {remate.tipo === 'subasta' ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                <Gavel className="w-3 h-3" />
                Subasta
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                <Tag className="w-3 h-3" />
                Precio Fijo
              </span>
            )}
            {remate.tipo === 'subasta' && remate.totalPujas !== undefined && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {remate.totalPujas} pujas
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{remate.titulo}</h3>
          <p className="text-sm text-gray-500 mb-3">{remate.descripcion}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Incluye</p>
        <ul className="space-y-1">
          {remate.items.map(item => (
            <li key={item.id} className="text-sm text-gray-700 flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              {item.nombre}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">
            {remate.tipo === 'subasta' ? 'Oferta actual' : 'Precio'}
          </p>
          <p className="text-2xl font-bold text-gray-900">{formatARS(remate.precioActual)}</p>
          {remate.tipo === 'subasta' && (
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
              <Clock className="w-3 h-3" />
              Cierra en {countdown}
            </div>
          )}
        </div>
        <div>
          {remate.tipo === 'subasta' ? (
            <button
              onClick={() => onOfertar(remate)}
              className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Gavel className="w-4 h-4" />
              Ofertar
            </button>
          ) : (
            <button
              onClick={() =>
                onComprar({ id: remate.id, nombre: remate.titulo, precio: remate.precioActual, tipo: 'producto' })
              }
              className="flex items-center gap-2 bg-[#2698D1] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1e82b8] transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [tab, setTab] = useState<Tab>('productos');
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [pantalla, setPantalla] = useState<Pantalla>('shop');
  const [notasCheckout, setNotasCheckout] = useState('');
  const [numeroPedido] = useState(() => `MP-${Math.floor(Math.random() * 90000) + 10000}`);
  const [toast, setToast] = useState<string | null>(null);

  // TAB PRODUCTOS
  const [busqProd, setBusqProd] = useState('');
  const [filtroRubro, setFiltroRubro] = useState<Rubro | 'todos'>('todos');
  const [filtroCondicion, setFiltroCondicion] = useState<'todos' | 'nuevo' | 'usado' | 'saldo'>('todos');
  const [filtroSeller, setFiltroSeller] = useState<TipoSeller | 'todos'>('todos');
  const [filtroTiendaOficial, setFiltroTiendaOficial] = useState(false);
  const [subSeccion, setSubSeccion] = useState<'todos' | 'usados_saldos' | 'remates'>('todos');

  // Modal remate/oferta
  const [remateModal, setRemateModal] = useState<Remate | null>(null);
  const [montoOferta, setMontoOferta] = useState('');

  // TAB REPUESTOS
  const [busqRep, setBusqRep] = useState('');
  const [filtroRubroRep, setFiltroRubroRep] = useState<Rubro | 'todos'>('todos');
  const [filtroMarcaRep, setFiltroMarcaRep] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string>('todos');

  // TAB INSUMOS
  const [busqIns, setBusqIns] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaInsumo | 'todos'>('todos');
  const [notificadoProximo, setNotificadoProximo] = useState(false);

  // ─── TOAST ──────────────────────────────────────────────────────────────────

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ─── CARRITO HELPERS ────────────────────────────────────────────────────────

  function agregarAlCarrito(item: Omit<CarritoItem, 'cantidad'>) {
    setCarrito(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...item, cantidad: 1 }];
    });
    showToast(`${item.nombre.slice(0, 30)}... agregado al carrito`);
  }

  function cambiarCantidad(id: string, delta: number) {
    setCarrito(prev =>
      prev
        .map(i => i.id === id ? { ...i, cantidad: Math.max(0, i.cantidad + delta) } : i)
        .filter(i => i.cantidad > 0)
    );
  }

  function removerItem(id: string) {
    setCarrito(prev => prev.filter(i => i.id !== id));
  }

  const subtotalProductos = carrito
    .filter(i => i.tipo === 'producto' || i.tipo === 'insumo')
    .reduce((s, i) => s + i.precio * i.cantidad, 0);
  const subtotalRepuestos = carrito
    .filter(i => i.tipo === 'repuesto')
    .reduce((s, i) => s + i.precio * i.cantidad, 0);
  const comisionProductos = subtotalProductos * 0.10;
  const comisionRepuestos = subtotalRepuestos * 0.15;
  const total = subtotalProductos + subtotalRepuestos + comisionProductos + comisionRepuestos;
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  // ─── FILTERED DATA ──────────────────────────────────────────────────────────

  const productos = useMemo(() => {
    let list = getProductosMkt();
    if (subSeccion === 'usados_saldos') list = list.filter(p => p.condicion === 'usado' || p.condicion === 'saldo');
    if (busqProd) list = list.filter(p =>
      p.nombre.toLowerCase().includes(busqProd.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqProd.toLowerCase())
    );
    if (filtroRubro !== 'todos') list = list.filter(p => p.rubro === filtroRubro);
    if (filtroCondicion !== 'todos') list = list.filter(p => p.condicion === filtroCondicion);
    if (filtroSeller !== 'todos') list = list.filter(p => p.tipoSeller.includes(filtroSeller));
    if (filtroTiendaOficial) list = list.filter(p => p.tiendaOficial);
    return list;
  }, [busqProd, filtroRubro, filtroCondicion, filtroSeller, filtroTiendaOficial, subSeccion]);

  const repuestos = useMemo(() => {
    let list = getRepuestosMkt();
    if (busqRep) list = list.filter(r =>
      r.nombre.toLowerCase().includes(busqRep.toLowerCase()) ||
      (r.codigoFabricante ?? '').toLowerCase().includes(busqRep.toLowerCase())
    );
    if (filtroRubroRep !== 'todos') list = list.filter(r => r.rubro === filtroRubroRep);
    if (filtroMarcaRep) list = list.filter(r => r.marca.toLowerCase().includes(filtroMarcaRep.toLowerCase()));
    if (equipoSeleccionado !== 'todos') {
      const eq = EQUIPOS.find(e => e.id === equipoSeleccionado);
      if (eq) {
        list = list.filter(r =>
          r.compatibleMarcas.some(m => m.toLowerCase().includes(eq.marca.toLowerCase())) ||
          r.compatibleModelos.some(m => eq.modelo.toLowerCase().includes(m.toLowerCase()))
        );
      }
    }
    return list;
  }, [busqRep, filtroRubroRep, filtroMarcaRep, equipoSeleccionado]);

  const insumos = useMemo(() => {
    let list = getInsumosMkt();
    if (busqIns) list = list.filter(i =>
      i.nombre.toLowerCase().includes(busqIns.toLowerCase()) ||
      i.marca.toLowerCase().includes(busqIns.toLowerCase())
    );
    if (filtroCategoria !== 'todos') list = list.filter(i => i.categoria === filtroCategoria);
    return list;
  }, [busqIns, filtroCategoria]);

  const remates = getRematesMkt().filter(r => r.estado === 'activo');
  const equiposRestaurante = EQUIPOS.filter(e => e.restauranteId === RESTAURANTE_ID);

  // ─── MODAL OFERTA ───────────────────────────────────────────────────────────

  const montoOfertaNum = parseFloat(montoOferta);
  const ofertaValida = remateModal !== null &&
    !isNaN(montoOfertaNum) &&
    montoOfertaNum > (remateModal.precioActual + (remateModal.pujaMinima ?? 0));

  // ─── PANTALLA EXITO ─────────────────────────────────────────────────────────

  if (pantalla === 'exito') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="RESTAURANTE" userName="Mi Restaurante" />
        <div className="flex-1 ml-64 flex flex-col">
          <Header userRole="RESTAURANTE" userName="Mi Restaurante" />
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-lg w-full text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido enviado!</h2>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-mono font-bold text-gray-700">{numeroPedido}</span>
              </div>
              <p className="text-gray-500 mb-8">
                El proveedor recibirá tu solicitud de cotización. Te contactaremos en menos de 24hs.
              </p>
              <button
                onClick={() => { setPantalla('shop'); setCarrito([]); }}
                className="w-full bg-[#2698D1] text-white font-semibold py-3 rounded-xl hover:bg-[#1e82b8] transition-colors"
              >
                Volver al marketplace
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ─── PANTALLA CHECKOUT ──────────────────────────────────────────────────────

  if (pantalla === 'checkout') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="RESTAURANTE" userName="Mi Restaurante" />
        <div className="flex-1 ml-64 flex flex-col">
          <Header userRole="RESTAURANTE" userName="Mi Restaurante" />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setPantalla('shop')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
              >
                ← Volver al marketplace
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mb-6">Solicitar cotización formal</h1>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
                <div className="space-y-3 mb-6">
                  {carrito.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.tipo} × {item.cantidad}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatARS(item.precio * item.cantidad)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal productos/insumos</span>
                    <span>{formatARS(subtotalProductos)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Comisión SHUURI 10%</span>
                    <span>{formatARS(comisionProductos)}</span>
                  </div>
                  {subtotalRepuestos > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal repuestos</span>
                        <span>{formatARS(subtotalRepuestos)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Comisión SHUURI 15%</span>
                        <span>{formatARS(comisionRepuestos)}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total estimado</span>
                    <span>{formatARS(total)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  Se emitirá Factura A al confirmar la cotización
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas adicionales para el proveedor
                </label>
                <textarea
                  value={notasCheckout}
                  onChange={e => setNotasCheckout(e.target.value)}
                  placeholder="Especificaciones adicionales, condiciones de entrega, preguntas..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1] resize-none"
                />
              </div>

              <button
                onClick={() => setPantalla('exito')}
                className="w-full bg-[#2698D1] text-white font-semibold py-3 rounded-xl hover:bg-[#1e82b8] transition-colors text-base"
              >
                Confirmar pedido
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ─── PANTALLA SHOP ──────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="RESTAURANTE" userName="Mi Restaurante" />
      <div className="flex-1 ml-64 flex flex-col">
        <Header userRole="RESTAURANTE" userName="Mi Restaurante" />
        <main className="flex-1 overflow-y-auto p-8">

          {/* ─── PAGE HEADER ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-[#2698D1]" />
                Marketplace SHUURI
              </h1>
              <p className="text-gray-500 mt-1">Productos, repuestos e insumos para tu operación</p>
            </div>
            <button
              onClick={() => setCarritoOpen(true)}
              className="relative flex items-center gap-2 bg-[#2698D1] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1e82b8] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Mi carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* ─── TABS ────────────────────────────────────────────────────── */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
            {(
              [
                { id: 'productos', label: 'Productos', icon: Package },
                { id: 'repuestos', label: 'Repuestos', icon: Wrench },
                { id: 'insumos', label: 'Insumos', icon: Tag },
              ] as const
            ).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === t.id ? 'bg-[#2698D1] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── TAB PRODUCTOS ───────────────────────────────────────────── */}
          {tab === 'productos' && (
            <div>
              {/* Sub-section pills */}
              <div className="flex gap-2 mb-6">
                {(
                  [
                    { id: 'todos', label: 'Todos' },
                    { id: 'usados_saldos', label: 'Usados & Saldos' },
                    { id: 'remates', label: 'Remates' },
                  ] as const
                ).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubSeccion(s.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      subSeccion === s.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {subSeccion !== 'remates' && (
                <>
                  {/* Filters */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />

                    {/* Búsqueda */}
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={busqProd}
                        onChange={e => setBusqProd(e.target.value)}
                        placeholder="Buscar producto o marca..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
                      />
                    </div>

                    {/* Rubro */}
                    <div className="relative">
                      <select
                        value={filtroRubro}
                        onChange={e => setFiltroRubro(e.target.value as Rubro | 'todos')}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1] bg-white"
                      >
                        <option value="todos">Todos los rubros</option>
                        {RUBROS_MKT.map(r => (
                          <option key={r} value={r}>{RUBRO_LABELS[r]}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Condición pills */}
                    <div className="flex gap-1">
                      {(['todos', 'nuevo', 'usado', 'saldo'] as const).map(c => (
                        <button
                          key={c}
                          onClick={() => setFiltroCondicion(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                            filtroCondicion === c
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {c === 'todos' ? 'Condición' : c}
                        </button>
                      ))}
                    </div>

                    {/* Tipo seller */}
                    <div className="relative">
                      <select
                        value={filtroSeller}
                        onChange={e => setFiltroSeller(e.target.value as TipoSeller | 'todos')}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1] bg-white"
                      >
                        <option value="todos">Tipo vendedor</option>
                        {(Object.entries(SELLER_LABELS) as [TipoSeller, string][]).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Toggle tienda oficial */}
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
                      <div
                        onClick={() => setFiltroTiendaOficial(v => !v)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${filtroTiendaOficial ? 'bg-amber-400' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filtroTiendaOficial ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                      <Star className={`w-3 h-3 ${filtroTiendaOficial ? 'fill-amber-400 stroke-amber-400' : 'text-gray-400'}`} />
                      Tienda oficial
                    </label>

                    {/* Clear */}
                    {(busqProd || filtroRubro !== 'todos' || filtroCondicion !== 'todos' || filtroSeller !== 'todos' || filtroTiendaOficial) && (
                      <button
                        onClick={() => {
                          setBusqProd('');
                          setFiltroRubro('todos');
                          setFiltroCondicion('todos');
                          setFiltroSeller('todos');
                          setFiltroTiendaOficial(false);
                        }}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Products grid */}
                  {productos.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No se encontraron productos con esos filtros.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {productos.map(p => (
                        <ProductCard key={p.id} producto={p} onAgregar={agregarAlCarrito} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {subSeccion === 'remates' && (
                <div className="space-y-5">
                  {remates.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay remates activos en este momento.</p>
                    </div>
                  ) : (
                    remates.map(r => (
                      <RemateCard
                        key={r.id}
                        remate={r}
                        onOfertar={rem => { setRemateModal(rem); setMontoOferta(''); }}
                        onComprar={agregarAlCarrito}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB REPUESTOS ───────────────────────────────────────────── */}
          {tab === 'repuestos' && (
            <div>
              {/* Mi activo */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-semibold">Buscar por mi activo</span>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <select
                    value={equipoSeleccionado}
                    onChange={e => setEquipoSeleccionado(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-blue-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
                  >
                    <option value="todos">Todos los equipos</option>
                    {equiposRestaurante.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.marca} {eq.modelo} — {eq.tipo}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {equipoSeleccionado !== 'todos' && (
                  <button
                    onClick={() => setEquipoSeleccionado('todos')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Quitar filtro
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={busqRep}
                    onChange={e => setBusqRep(e.target.value)}
                    placeholder="Buscar repuesto o código..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filtroRubroRep}
                    onChange={e => setFiltroRubroRep(e.target.value as Rubro | 'todos')}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1] bg-white"
                  >
                    <option value="todos">Todos los rubros</option>
                    {RUBROS_MKT.map(r => (
                      <option key={r} value={r}>{RUBRO_LABELS[r]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filtroMarcaRep}
                    onChange={e => setFiltroMarcaRep(e.target.value)}
                    placeholder="Filtrar por marca..."
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
                  />
                </div>
              </div>

              {repuestos.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron repuestos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {repuestos.map(r => (
                    <RepuestoCard key={r.id} repuesto={r} onAgregar={agregarAlCarrito} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB INSUMOS ─────────────────────────────────────────────── */}
          {tab === 'insumos' && (
            <div>
              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                <button
                  onClick={() => setFiltroCategoria('todos')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filtroCategoria === 'todos' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Todos
                </button>
                {(Object.entries(CATEGORIA_LABELS) as [CategoriaInsumo, string][]).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setFiltroCategoria(k)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filtroCategoria === k ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-6 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={busqIns}
                  onChange={e => setBusqIns(e.target.value)}
                  placeholder="Buscar insumo o marca..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2698D1]"
                />
              </div>

              {insumos.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron insumos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {insumos.map(i => (
                    <InsumoCard key={i.id} insumo={i} onAgregar={agregarAlCarrito} />
                  ))}
                </div>
              )}

              {/* Próximamente banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Próximamente: conexión directa con proveedores externos</p>
                    <p className="text-sm text-gray-500">Pedidos automáticos, facturación directa y trazabilidad total.</p>
                  </div>
                </div>
                <button
                  onClick={() => { setNotificadoProximo(true); showToast('¡Te notificaremos cuando esté disponible!'); }}
                  disabled={notificadoProximo}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 ${
                    notificadoProximo
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {notificadoProximo ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Te notificaremos!
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Notificarme
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── CARRITO SLIDE-IN ─────────────────────────────────────────────── */}
      {carritoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setCarritoOpen(false)}
          />
          {/* Panel */}
          <div className="w-full max-w-md bg-white shadow-xl flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#2698D1]" />
                <h2 className="font-bold text-gray-900">Mi carrito</h2>
                {totalItems > 0 && (
                  <span className="bg-[#2698D1] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={() => setCarritoOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {carrito.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrito.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-medium text-gray-900 leading-tight">{item.nombre}</p>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">{item.tipo}</p>
                        </div>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cambiarCantidad(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{formatARS(item.precio * item.cantidad)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {carrito.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-2">
                <div className="text-sm space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal productos/insumos</span>
                    <span>{formatARS(subtotalProductos)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Comisión SHUURI 10%</span>
                    <span>{formatARS(comisionProductos)}</span>
                  </div>
                  {subtotalRepuestos > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal repuestos</span>
                        <span>{formatARS(subtotalRepuestos)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>Comisión SHUURI 15%</span>
                        <span>{formatARS(comisionRepuestos)}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total estimado</span>
                  <span className="text-lg">{formatARS(total)}</span>
                </div>
                <button
                  onClick={() => { setPantalla('checkout'); setCarritoOpen(false); }}
                  className="w-full bg-[#2698D1] text-white font-semibold py-3 rounded-xl hover:bg-[#1e82b8] transition-colors mt-2"
                >
                  Solicitar cotización formal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL OFERTA REMATE ──────────────────────────────────────────── */}
      {remateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-600" />
                Realizar oferta
              </h3>
              <button onClick={() => setRemateModal(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{remateModal.titulo}</p>

            <div className="bg-purple-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Oferta actual</span>
                <span className="text-lg font-bold text-purple-700">{formatARS(remateModal.precioActual)}</span>
              </div>
              {remateModal.totalPujas !== undefined && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  {remateModal.totalPujas} pujas realizadas
                </div>
              )}
              {remateModal.pujaMinima && (
                <p className="text-xs text-gray-500 mt-1">
                  Oferta mínima: {formatARS(remateModal.precioActual + remateModal.pujaMinima)}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tu oferta (USD)</label>
              <input
                type="number"
                value={montoOferta}
                onChange={e => setMontoOferta(e.target.value)}
                placeholder={`Mín. ${remateModal.precioActual + (remateModal.pujaMinima ?? 0) + 1}`}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {montoOferta && !ofertaValida && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  La oferta debe superar {formatARS(remateModal.precioActual + (remateModal.pujaMinima ?? 0))}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRemateModal(null)}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setRemateModal(null);
                  setMontoOferta('');
                  showToast('¡Oferta enviada!');
                }}
                disabled={!ofertaValida}
                className={`flex-1 font-semibold py-2.5 rounded-xl transition-colors ${
                  ofertaValida
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Ofertar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
