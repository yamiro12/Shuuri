"use client";
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Package, Truck, X, SlidersHorizontal, ChevronDown, ShoppingCart, Wrench, ArrowLeft } from 'lucide-react';
import {
  MARKETPLACE_PRODUCTS, MP_CATEGORIAS, MP_RUBROS, MP_RUBRO_LABELS, MP_MARCAS,
  type MarketplaceProduct,
} from '@/data/marketplace-mock';
import RegisterGate from '@/components/public/RegisterGate';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface CartItem { producto: MarketplaceProduct; cantidad: number; }

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

// ─── SIDEBAR DE FILTROS ───────────────────────────────────────────────────────

interface FiltersState {
  categorias:     string[];
  rubros:         string[];
  marcas:         string[];
  disponibilidad: string;
  entrega:        string;
}

const FILTER_INIT: FiltersState = { categorias: [], rubros: [], marcas: [], disponibilidad: 'todos', entrega: 'todos' };

function SidebarFilters({ filters, setFilters }: {
  filters:    FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}) {
  function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
    return (
      <label className="flex items-center gap-2 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="h-4 w-4 rounded border-gray-300 text-[#2698D1] focus:ring-[#2698D1]"
        />
        <span className="text-sm text-gray-600">{label}</span>
      </label>
    );
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="border-b border-gray-100 pb-4 mb-4 last:border-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{title}</p>
        {children}
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0D0D0D] text-sm">Filtrar</h3>
          {(filters.categorias.length || filters.rubros.length || filters.marcas.length ||
            filters.disponibilidad !== 'todos' || filters.entrega !== 'todos') ? (
            <button
              onClick={() => setFilters(FILTER_INIT)}
              className="text-xs text-[#2698D1] hover:underline"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        <Section title="Categoría">
          {MP_CATEGORIAS.map(c => (
            <CheckRow
              key={c} label={c}
              checked={filters.categorias.includes(c)}
              onToggle={() => setFilters(f => ({ ...f, categorias: toggle(f.categorias, c) }))}
            />
          ))}
        </Section>

        <Section title="Rubro">
          {MP_RUBROS.map(r => (
            <CheckRow
              key={r} label={MP_RUBRO_LABELS[r] ?? r}
              checked={filters.rubros.includes(r)}
              onToggle={() => setFilters(f => ({ ...f, rubros: toggle(f.rubros, r) }))}
            />
          ))}
        </Section>

        <Section title="Marca">
          {MP_MARCAS.map(m => (
            <CheckRow
              key={m} label={m}
              checked={filters.marcas.includes(m)}
              onToggle={() => setFilters(f => ({ ...f, marcas: toggle(f.marcas, m) }))}
            />
          ))}
        </Section>

        <Section title="Disponibilidad">
          {[
            { id: 'todos',       label: 'Todos'       },
            { id: 'en_stock',    label: 'En stock'    },
            { id: 'bajo_pedido', label: 'Bajo pedido' },
          ].map(o => (
            <label key={o.id} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="disponibilidad"
                checked={filters.disponibilidad === o.id}
                onChange={() => setFilters(f => ({ ...f, disponibilidad: o.id }))}
                className="h-4 w-4 text-[#2698D1] focus:ring-[#2698D1]"
              />
              <span className="text-sm text-gray-600">{o.label}</span>
            </label>
          ))}
        </Section>

        <Section title="Entrega máxima">
          {[
            { id: 'todos', label: 'Cualquier plazo' },
            { id: '24',    label: 'Hasta 24hs'      },
            { id: '48',    label: 'Hasta 48hs'      },
            { id: '72',    label: 'Hasta 72hs'      },
          ].map(o => (
            <label key={o.id} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="entrega"
                checked={filters.entrega === o.id}
                onChange={() => setFilters(f => ({ ...f, entrega: o.id }))}
                className="h-4 w-4 text-[#2698D1] focus:ring-[#2698D1]"
              />
              <span className="text-sm text-gray-600">{o.label}</span>
            </label>
          ))}
        </Section>
      </div>
    </aside>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ p, onAddToCart, otMode = false, otContext = false, rubroOT = '', marcaOT = '' }: {
  p:           MarketplaceProduct;
  onAddToCart: (p: MarketplaceProduct) => void;
  otMode?:     boolean;
  otContext?:  boolean;
  rubroOT?:    string;
  marcaOT?:    string;
}) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAddToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const detailHref = otContext
    ? `/marketplace/${p.slug}?otContext=true&rubro=${rubroOT}&marca=${marcaOT}`
    : `/marketplace/${p.slug}`;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#2698D1]/25 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Imagen placeholder */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
        <Package className="h-12 w-12 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
        <span className={`absolute top-2 right-2 text-[11px] font-bold text-white px-2 py-0.5 rounded-full ${
          p.disponibilidad === 'en_stock' ? 'bg-green-500' : 'bg-amber-500'
        }`}>
          {p.disponibilidad === 'en_stock' ? 'En stock' : 'Bajo pedido'}
        </span>
        <div className="absolute inset-0 bg-[#2698D1]/0 group-hover:bg-[#2698D1]/5 transition-colors duration-200" />
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1">
        <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded mb-2">
          {p.categoria}
        </span>
        <h3 className="font-semibold text-sm text-[#0D0D0D] leading-tight line-clamp-2 mb-1 flex-1">
          {p.nombre}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{p.marca}</p>
        <p className="font-black text-lg text-[#0D0D0D]">
          $ {p.precio_ars.toLocaleString('es-AR')}
        </p>
        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1 mb-3">
          <Truck className="h-3 w-3" />
          {p.tiempo_entrega_hs}hs · {p.proveedor_nombre}
        </p>
        <div className="flex gap-2 mt-auto">
          <Link
            href={detailHref}
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] font-semibold text-xs px-3 py-2 rounded-lg transition-all"
          >
            Ver detalle
          </Link>
          <button
            onClick={handleAdd}
            className={`flex-1 font-semibold text-xs px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-[#2698D1]/10 hover:bg-[#2698D1] text-[#2698D1] hover:text-white'
            }`}
          >
            {added ? (
              '✓ Agregado'
            ) : otMode ? (
              <><Wrench className="h-3 w-3" /> Agregar a OT</>
            ) : (
              '+ Carrito'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────

function CheckoutModal({ cart, onClose }: { cart: CartItem[]; onClose: () => void }) {
  const [step, setStep] = useState<'carrito' | 'registro'>('carrito');
  const subtotal = cart.reduce((s, i) => s + i.producto.precio_ars * i.cantidad, 0);

  const summary = (
    <div className="space-y-2">
      {cart.map((item, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.producto.nombre}</span>
          <span className="font-semibold shrink-0">
            x{item.cantidad} · ${(item.producto.precio_ars * item.cantidad).toLocaleString('es-AR')}
          </span>
        </div>
      ))}
      <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold">$ {subtotal.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Envío</span>
          <span className="text-gray-400">A calcular</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-1 mt-1">
          <span>Total estimado</span>
          <span>$ {subtotal.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );

  if (step === 'registro') {
    return (
      <RegisterGate
        title="Crear cuenta para comprar"
        subtitle="Es gratis y tarda 2 minutos. Necesitás cuenta para procesar tu pedido."
        summary={summary}
        ctaLabel="Confirmar compra"
        onClose={onClose}
        onSuccess={email => { console.log('[Marketplace] Compra MOCK | email:', email, '| carrito:', cart); }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
        <div className="p-8">
          <h2 className="font-black text-xl text-[#0D0D0D] mb-5">Tu carrito</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">{summary}</div>
          <button
            onClick={() => setStep('registro')}
            className="w-full bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-4 rounded-xl font-bold transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function MarketplaceInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const otContext = searchParams.get('otContext') === 'true';
  const rubroOT   = searchParams.get('rubro') ?? '';
  const marcaOT   = searchParams.get('marca') ?? '';

  const [search,        setSearch]        = useState('');
  const [filters,       setFilters]       = useState<FiltersState>(FILTER_INIT);
  const [sort,          setSort]          = useState('relevancia');
  const [cart,          setCart]          = useState<CartItem[]>([]);
  const [bannerOpen,    setBannerOpen]    = useState(true);
  const [checkoutOpen,  setCheckoutOpen]  = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [estaLogueado,  setEstaLogueado]  = useState(false);
  const [gateProduct,   setGateProduct]   = useState<MarketplaceProduct | null>(null);

  // Pre-filtrar por rubro y marca en modo OT
  useEffect(() => {
    if (!otContext) return;
    setFilters(f => ({
      ...f,
      rubros:     rubroOT ? [rubroOT] : f.rubros,
      marcas:     marcaOT ? (MP_MARCAS.includes(marcaOT) ? [marcaOT] : f.marcas) : f.marcas,
      categorias: ['Repuestos'],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otContext, rubroOT, marcaOT]);

  // Filtrar + ordenar
  const productos = useMemo(() => {
    let list = MARKETPLACE_PRODUCTS.filter(p => {
      const q = search.toLowerCase();
      if (q && !p.nombre.toLowerCase().includes(q) && !p.descripcion.toLowerCase().includes(q) && !p.marca.toLowerCase().includes(q)) return false;
      if (filters.categorias.length && !filters.categorias.includes(p.categoria)) return false;
      if (filters.rubros.length    && !filters.rubros.includes(p.rubro))          return false;
      if (filters.marcas.length    && !filters.marcas.includes(p.marca))          return false;
      if (filters.disponibilidad !== 'todos' && p.disponibilidad !== filters.disponibilidad) return false;
      if (filters.entrega !== 'todos' && p.tiempo_entrega_hs > parseInt(filters.entrega)) return false;
      return true;
    });
    if (sort === 'precio_asc')  list = [...list].sort((a, b) => a.precio_ars - b.precio_ars);
    if (sort === 'precio_desc') list = [...list].sort((a, b) => b.precio_ars - a.precio_ars);
    return list;
  }, [search, filters, sort]);

  function agregarAlCarrito(p: MarketplaceProduct) {
    setCart(prev => {
      const existing = prev.find(i => i.producto.id === p.id);
      if (existing) return prev.map(i => i.producto.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { producto: p, cantidad: 1 }];
    });
    setBannerOpen(true);
  }

  function addToCart(p: MarketplaceProduct) {
    if (otContext) {
      sessionStorage.setItem('repuesto-seleccionado-ot', JSON.stringify({
        productoId: p.id,
        nombre:     p.nombre,
        precio:     p.precio_ars,
        slug:       p.slug,
      }));
      router.push('/solicitar-tecnico?step=3&repuestoAgregado=true');
      return;
    }
    if (!estaLogueado) {
      setGateProduct(p);
      return;
    }
    agregarAlCarrito(p);
  }

  const cartTotal   = cart.reduce((s, i) => s + i.producto.precio_ars * i.cantidad, 0);
  const cartCount   = cart.reduce((s, i) => s + i.cantidad, 0);
  const [cartBump,  setCartBump]  = useState(false);

  // Bump animation when cart count changes
  useEffect(() => {
    if (cartCount === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 400);
    return () => clearTimeout(t);
  }, [cartCount]);

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [
    ...filters.categorias.map(c => ({ label: c, onRemove: () => setFilters(f => ({ ...f, categorias: f.categorias.filter(x => x !== c) })) })),
    ...filters.rubros.map(r   => ({ label: MP_RUBRO_LABELS[r] ?? r, onRemove: () => setFilters(f => ({ ...f, rubros: f.rubros.filter(x => x !== r) })) })),
    ...filters.marcas.map(m   => ({ label: m, onRemove: () => setFilters(f => ({ ...f, marcas: f.marcas.filter(x => x !== m) })) })),
    ...(filters.disponibilidad !== 'todos' ? [{ label: filters.disponibilidad === 'en_stock' ? 'En stock' : 'Bajo pedido', onRemove: () => setFilters(f => ({ ...f, disponibilidad: 'todos' })) }] : []),
    ...(filters.entrega !== 'todos' ? [{ label: `≤${filters.entrega}hs`, onRemove: () => setFilters(f => ({ ...f, entrega: 'todos' })) }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Banner OT context */}
      {otContext && (
        <div className="bg-[#2698D1] text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 shrink-0" />
              <span>
                Estás buscando repuesto para tu OT
                {marcaOT && <> · Equipo: <strong>{marcaOT}</strong></>}
                {rubroOT && <> · Rubro: <strong>{MP_RUBRO_LABELS[rubroOT] ?? rubroOT}</strong></>}
              </span>
            </div>
            <button
              onClick={() => router.push('/solicitar-tecnico?step=3')}
              className="text-xs font-bold text-white underline underline-offset-2 shrink-0"
            >
              Volver al wizard ←
            </button>
          </div>
        </div>
      )}

      {/* Header oscuro */}
      <div className="bg-[#0D0D0D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-black text-4xl mb-2">
            {otContext
              ? (marcaOT ? `Repuestos para ${marcaOT}${rubroOT ? ` — ${MP_RUBRO_LABELS[rubroOT] ?? rubroOT}` : ''}` : 'Repuestos para tu OT')
              : 'Marketplace SHUURI'
            }
          </h1>
          <p className="text-gray-300 mb-6">
            {otContext
              ? 'Seleccioná el repuesto que necesitás. Se agregará directamente a tu OT.'
              : 'Repuestos, equipamiento e insumos para gastronomía. Con precio, disponibilidad y entrega coordinada.'
            }
          </p>
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar repuestos, equipos, insumos..."
              className="w-full bg-white rounded-xl pl-14 pr-6 py-4 text-[#0D0D0D] text-base focus:outline-none focus:ring-2 focus:ring-[#2698D1]/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mobile: botón filtros */}
        <button
          className="lg:hidden mb-4 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700"
          onClick={() => setSidebarOpen(o => !o)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {(filters.categorias.length + filters.rubros.length + filters.marcas.length) > 0 && (
            <span className="bg-[#2698D1] text-white text-xs rounded-full px-1.5 py-0.5">
              {filters.categorias.length + filters.rubros.length + filters.marcas.length}
            </span>
          )}
        </button>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden mb-4">
            <SidebarFilters filters={filters} setFilters={setFilters} />
          </div>
        )}

        <div className="flex gap-6 items-start">

          {/* Sidebar desktop */}
          <div className="hidden lg:block">
            <SidebarFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeChips.map((chip, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-[#2698D1]/10 text-[#2698D1] text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {chip.label}
                    <button onClick={chip.onRemove} className="hover:text-[#2698D1]/60 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {activeChips.length > 1 && (
                  <button
                    onClick={() => setFilters(FILTER_INIT)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
            )}

            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <strong className="text-[#0D0D0D]">{productos.length}</strong> resultado{productos.length !== 1 ? 's' : ''}
                {search && <span className="ml-1 text-gray-400">para "{search}"</span>}
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio_asc">Precio: menor a mayor</option>
                  <option value="precio_desc">Precio: mayor a menor</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {productos.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No encontramos productos con esos filtros.</p>
                <button
                  onClick={() => { setSearch(''); setFilters(FILTER_INIT); }}
                  className="mt-3 text-[#2698D1] text-sm font-semibold hover:underline"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {productos.map(p => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onAddToCart={addToCart}
                    otMode={otContext}
                    otContext={otContext}
                    rubroOT={rubroOT}
                    marcaOT={marcaOT}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart banner sticky */}
      {cart.length > 0 && bannerOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D] text-white px-4 py-4 shadow-2xl border-t border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#2698D1]/20 transition-transform duration-200 ${cartBump ? 'scale-125' : 'scale-100'}`}>
                {otContext ? <Wrench className="h-5 w-5 text-[#2698D1]" /> : <ShoppingCart className="h-5 w-5 text-[#2698D1]" />}
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2698D1] text-[10px] font-black text-white">
                  {cartCount}
                </span>
              </div>
              <p className="text-sm font-medium">
                {otContext ? (
                  <span className="font-bold">1 repuesto seleccionado para tu OT</span>
                ) : (
                  <>
                    <span className="font-bold">{cartCount} ítem{cartCount > 1 ? 's' : ''}</span>
                    <span className="text-gray-400 mx-1.5">·</span>
                    Total: <span className="font-black text-white">$ {cartTotal.toLocaleString('es-AR')}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => otContext ? router.push('/solicitar-tecnico?step=3') : setCheckoutOpen(true)}
                className="bg-[#2698D1] hover:bg-[#2698D1]/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-[#2698D1]/30"
              >
                {otContext ? 'Confirmar y volver al wizard →' : 'Finalizar compra →'}
              </button>
              <button
                onClick={() => setBannerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Cerrar banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {/* Gate de registro al agregar al carrito */}
      {gateProduct && (
        <RegisterGate
          title="Creá tu cuenta para comprar"
          subtitle="Es gratis y lleva 2 minutos. Accedés a precios B2B y envíos coordinados."
          summary={
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{gateProduct.nombre}</span>
                <span className="font-semibold">$ {gateProduct.precio_ars.toLocaleString('es-AR')}</span>
              </div>
            </div>
          }
          ctaLabel="Continuar"
          onClose={() => setGateProduct(null)}
          onSuccess={() => {
            setEstaLogueado(true);
            agregarAlCarrito(gateProduct);
            setGateProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#2698D1] border-t-transparent animate-spin" />
      </div>
    }>
      <MarketplaceInner />
    </Suspense>
  );
}
