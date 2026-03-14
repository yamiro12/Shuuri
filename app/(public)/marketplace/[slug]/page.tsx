"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Package, Truck, CheckCircle2, Minus, Plus, ArrowLeft, Wrench,
  Star, X, ThumbsUp, Flame, Thermometer, Droplets, Coffee,
  Snowflake, Wind, Monitor, Settings2, ShoppingCart,
} from 'lucide-react';
import {
  MARKETPLACE_PRODUCTS, MP_RUBRO_LABELS, type MarketplaceProduct,
} from '@/data/marketplace-mock';
import RegisterGate from '@/components/public/RegisterGate';

// ─── VALORACIONES MOCK ────────────────────────────────────────────────────────

interface Valoracion {
  id:                 string;
  productoId:         string;
  autorNombre:        string;
  autorTipo:          'Restaurante' | 'Técnico';
  rating:             number;
  titulo:             string;
  comentario:         string;
  fecha:              string;
  verificada:         boolean;
  respuestaProveedor?: string;
  utiles:             number;
}

const VALORACIONES: Valoracion[] = [
  {
    id: 'v001', productoId: 'mp-007',
    autorNombre: 'Carlos Mendoza', autorTipo: 'Restaurante', rating: 5,
    titulo: 'Excelente repuesto, instalación rápida',
    comentario: 'Llegó el mismo día prometido. El técnico lo instaló sin problema y el lavavajillas quedó como nuevo. Muy conforme con el servicio.',
    fecha: '2026-02-15', verificada: true, utiles: 8,
    respuestaProveedor: 'Gracias Carlos, nos alegra que todo saliera perfecto. Quedamos a disposición.',
  },
  {
    id: 'v002', productoId: 'mp-007',
    autorNombre: 'Pablo Rivas', autorTipo: 'Técnico', rating: 4,
    titulo: 'Resistencia original, buena calidad',
    comentario: 'Repuesto original Winterhalter. La instalación es directa, sin modificaciones. Lleva 3 semanas funcionando sin inconvenientes.',
    fecha: '2026-01-28', verificada: true, utiles: 5,
  },
  {
    id: 'v003', productoId: 'mp-007',
    autorNombre: 'Laura Gómez', autorTipo: 'Restaurante', rating: 5,
    titulo: 'Perfecto, sin sorpresas',
    comentario: 'Proceso fácil a través de SHUURI. El precio es razonable para ser original de fábrica. Recomendado.',
    fecha: '2026-01-10', verificada: false, utiles: 3,
  },
  {
    id: 'v004', productoId: 'mp-004',
    autorNombre: 'Sebastián Ortiz', autorTipo: 'Técnico', rating: 5,
    titulo: 'Compresor Embraco legítimo',
    comentario: 'Trabajé con varios compresores Embraco y este es original. Rendimiento excelente. Ya instalé tres en distintos clientes.',
    fecha: '2026-02-20', verificada: true, utiles: 12,
    respuestaProveedor: 'Gracias Sebastián! Los compresores Embraco que manejamos son 100% originales con garantía de fábrica.',
  },
  {
    id: 'v005', productoId: 'mp-004',
    autorNombre: 'Hotel Belgrano', autorTipo: 'Restaurante', rating: 4,
    titulo: 'Buen producto, demora un poco',
    comentario: 'El compresor llegó en 28hs cuando prometían 24hs. Pero la calidad es buena y la instalación fue correcta.',
    fecha: '2026-01-20', verificada: true, utiles: 2,
  },
  {
    id: 'v006', productoId: 'mp-005',
    autorNombre: 'Roberto Ferrán', autorTipo: 'Técnico', rating: 5,
    titulo: 'Termostato preciso y fácil de programar',
    comentario: 'El Dixell X20S es el estándar del rubro. Instalación simple, sonda incluida, display claro. No hay mucho más que pedir.',
    fecha: '2026-02-05', verificada: true, utiles: 9,
  },
  {
    id: 'v007', productoId: 'mp-002',
    autorNombre: 'Parrilla Sur', autorTipo: 'Restaurante', rating: 5,
    titulo: 'Quemador potente y estable',
    comentario: 'Reemplazamos el quemador original de la cocina Modena y la diferencia es notable. Llama uniforme y sin problemas de encendido.',
    fecha: '2026-02-10', verificada: true, utiles: 6,
  },
  {
    id: 'v008', productoId: 'mp-010',
    autorNombre: 'Café del Centro', autorTipo: 'Restaurante', rating: 4,
    titulo: 'Válvula correcta, precio justo',
    comentario: 'Compatibilidad perfecta con nuestra La Marzocco GB5. El técnico la instaló en 20 minutos. Presión normal desde el día 1.',
    fecha: '2026-01-30', verificada: true, utiles: 4,
  },
  {
    id: 'v009', productoId: 'mp-012',
    autorNombre: 'Diego Martínez', autorTipo: 'Técnico', rating: 5,
    titulo: 'Grupo E61 impecable',
    comentario: 'Calidad premium. El acero inox 316L se nota en el acabado. Las duchas y juntas incluidas son de buena calidad. Para máquinas de alto tráfico.',
    fecha: '2026-02-18', verificada: true, utiles: 15,
    respuestaProveedor: 'Gracias Diego. El grupo E61 que ofrecemos está fabricado según spec original para garantizar compatibilidad.',
  },
];

// ─── RUBRO COLORES E ÍCONOS ────────────────────────────────────────────────────

const RUBRO_COLORS: Record<string, string> = {
  coccion:       'bg-orange-100 text-orange-700',
  refrigeracion: 'bg-blue-100 text-blue-700',
  lavado:        'bg-cyan-100 text-cyan-700',
  cafeteria:     'bg-amber-100 text-amber-700',
  maq_hielo:     'bg-sky-100 text-sky-700',
  climatizacion: 'bg-teal-100 text-teal-700',
  tecnologia:    'bg-gray-100 text-gray-600',
  especializados:'bg-purple-100 text-purple-700',
};

const RUBRO_ICON_MAP: Record<string, React.ElementType> = {
  coccion: Flame, refrigeracion: Thermometer, lavado: Droplets,
  cafeteria: Coffee, maq_hielo: Snowflake, climatizacion: Wind,
  tecnologia: Monitor, especializados: Settings2,
};

// ─── STAR RATING ──────────────────────────────────────────────────────────────

function StarRow({ rating, interactive = false, onRate }: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`h-4 w-4 transition-colors ${
            n <= (interactive ? (hover || rating) : rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(n)}
        />
      ))}
    </div>
  );
}

// ─── MODAL NUEVA VALORACIÓN ───────────────────────────────────────────────────

function ModalValoracion({ onClose }: { onClose: () => void }) {
  const [rating,   setRating]   = useState(0);
  const [titulo,   setTitulo]   = useState('');
  const [comentario, setComentario] = useState('');
  const [enviado,  setEnviado]  = useState(false);

  function handleEnviar() {
    if (!rating || comentario.trim().length < 20) return;
    console.log('[Marketplace] Valoración MOCK:', { rating, titulo, comentario });
    setEnviado(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-[#0D0D0D]">Escribir valoración</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        {enviado ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-bold text-[#0D0D0D]">Tu valoración fue enviada para revisión</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#0D0D0D] mb-2">Tu calificación *</p>
              <StarRow rating={rating} interactive onRate={setRating} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D0D0D] mb-1">Título (opcional)</label>
              <input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Resume tu experiencia en una frase"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0D0D0D] mb-1">Comentario *</label>
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={4}
                placeholder="Mínimo 20 caracteres. Contá tu experiencia con el producto."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{comentario.length}/500</p>
            </div>
            <button
              disabled={!rating || comentario.trim().length < 20}
              onClick={handleEnviar}
              className="w-full bg-[#2698D1] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Enviar valoración
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RELATED CARD ─────────────────────────────────────────────────────────────

function RelatedCard({ p, otContext, rubroOT, marcaOT }: {
  p: MarketplaceProduct;
  otContext: boolean;
  rubroOT: string;
  marcaOT: string;
}) {
  const params = otContext ? `?otContext=true&rubro=${rubroOT}&marca=${marcaOT}` : '';
  return (
    <Link href={`/marketplace/${p.slug}${params}`}
      className="group bg-white rounded-xl border border-gray-100 hover:border-[#2698D1]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-3 flex gap-3 items-start"
    >
      <div className="bg-gray-100 rounded-lg h-14 w-14 flex items-center justify-center shrink-0">
        <Package className="h-6 w-6 text-gray-300 group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#0D0D0D] line-clamp-2 leading-tight">{p.nombre}</p>
        <p className="text-xs text-gray-400 mt-0.5">{p.marca}</p>
        <p className="font-black text-sm text-[#0D0D0D] mt-1">$ {p.precio_ars.toLocaleString('es-AR')}</p>
      </div>
    </Link>
  );
}

// ─── CONTENT (usa useSearchParams) ────────────────────────────────────────────

function ProductDetailContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const otContext = searchParams.get('otContext') === 'true';
  const rubroOT   = searchParams.get('rubro') ?? '';
  const marcaOT   = searchParams.get('marca') ?? '';
  const origen    = searchParams.get('origen') ?? 'publico'; // 'publico' | 'panel'

  const returnUrl = origen === 'panel'
    ? '/restaurante/reportar?step=3&repuestoAgregado=true'
    : '/solicitar-tecnico?step=3&repuestoAgregado=true';
  const wizardUrl = origen === 'panel'
    ? '/restaurante/reportar?step=3'
    : '/solicitar-tecnico?step=3';

  const product = MARKETPLACE_PRODUCTS.find(p => p.slug === slug);

  const [cantidad,     setCantidad]     = useState(1);
  const [tab,          setTab]          = useState<'descripcion' | 'especificaciones' | 'valoraciones'>('descripcion');
  const [showGate,     setShowGate]     = useState(false);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [utilesState,  setUtilesState]  = useState<Record<string, number>>({});

  const valoraciones = VALORACIONES.filter(v => v.productoId === product?.id);

  const avgRating = valoraciones.length
    ? Math.round(valoraciones.reduce((s, v) => s + v.rating, 0) / valoraciones.length * 10) / 10
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map(n => ({
    stars: n,
    count: valoraciones.filter(v => v.rating === n).length,
    pct:   valoraciones.length ? Math.round(valoraciones.filter(v => v.rating === n).length / valoraciones.length * 100) : 0,
  }));

  function handleAgregarOT() {
    if (!product) return;
    sessionStorage.setItem('repuesto-seleccionado-ot', JSON.stringify({
      productoId: product.id,
      nombre:     product.nombre,
      precio:     product.precio_ars,
      slug:       product.slug,
    }));
    router.push(returnUrl);
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h1 className="font-black text-2xl text-[#0D0D0D] mb-3">Producto no encontrado</h1>
          <p className="text-gray-500 mb-6">El producto que buscás no existe o fue removido.</p>
          <Link href="/marketplace" className="bg-[#2698D1] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2698D1]/90 transition-colors">
            Volver al marketplace
          </Link>
        </div>
      </div>
    );
  }

  const total = product.precio_ars * cantidad;
  const RubroIcon = RUBRO_ICON_MAP[product.rubro] ?? Package;
  const rubroColor = RUBRO_COLORS[product.rubro] ?? 'bg-gray-100 text-gray-600';

  const relatedProducts = MARKETPLACE_PRODUCTS.filter(p =>
    p.id !== product.id &&
    (p.rubro === product.rubro || p.marca === product.marca)
  ).slice(0, 4);

  const summary = (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 flex-1 mr-2 line-clamp-1">{product.nombre}</span>
        <span className="font-semibold shrink-0">x{cantidad}</span>
      </div>
      <div className="flex justify-between font-bold border-t border-gray-200 pt-1.5">
        <span>Total</span>
        <span>$ {total.toLocaleString('es-AR')}</span>
      </div>
      <p className="text-xs text-gray-400">+ comisión SHUURI 15%</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* OT CONTEXT BANNER */}
      {otContext && (
        <div className="bg-[#2698D1]/10 border-b border-[#2698D1]/30 py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4 text-[#2698D1] shrink-0" />
              <span className="text-[#2698D1] font-medium">
                Estás buscando un repuesto para tu OT
                {marcaOT && <> · Equipo: <strong>{marcaOT}</strong></>}
                {rubroOT && <> · Rubro: <strong>{MP_RUBRO_LABELS[rubroOT] ?? rubroOT}</strong></>}
              </span>
            </div>
            <Link
              href={wizardUrl}
              className="text-xs font-bold text-[#2698D1] hover:underline shrink-0"
            >
              Volver al wizard →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/marketplace" className="hover:text-gray-600 transition-colors">Marketplace</Link>
          <span>›</span>
          <span className="text-gray-500">{MP_RUBRO_LABELS[product.rubro] ?? product.rubro}</span>
          <span>›</span>
          <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* Imagen placeholder con ícono de rubro */}
          <div className={`relative rounded-2xl h-80 flex items-center justify-center overflow-hidden ${rubroColor.split(' ')[0].replace('text', 'bg').replace('-700', '-50').replace('-600', '-50')}`}
            style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
          >
            <RubroIcon className="h-24 w-24 text-gray-200" />
            <span className={`absolute top-4 right-4 text-xs font-bold text-white px-3 py-1 rounded-full ${
              product.disponibilidad === 'en_stock' ? 'bg-green-500' : 'bg-amber-500'
            }`}>
              {product.disponibilidad === 'en_stock' ? 'En stock' : 'Bajo pedido'}
            </span>
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${rubroColor}`}>
                <RubroIcon className="h-3 w-3" />
                {MP_RUBRO_LABELS[product.rubro] ?? product.rubro}
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {product.categoria}
              </span>
            </div>

            <h1 className="font-black text-2xl text-[#0D0D0D] leading-snug mb-1">{product.nombre}</h1>
            <p className="text-sm text-gray-500 mb-1">{product.marca}</p>
            <p className="text-xs text-gray-400 mb-3">Por <span className="font-semibold">{product.proveedor_nombre}</span></p>

            {/* Rating resumen */}
            {valoraciones.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRow rating={Math.round(avgRating)} />
                <span className="text-sm font-bold text-[#0D0D0D]">{avgRating}</span>
                <span className="text-xs text-gray-400">({valoraciones.length} valoraciones)</span>
              </div>
            )}

            {/* Precio */}
            <p className="font-black text-4xl text-[#0D0D0D] mb-2">
              $ {product.precio_ars.toLocaleString('es-AR')}
            </p>

            {/* Entrega */}
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <Truck className="h-4 w-4 text-[#2698D1]" />
              Entrega en {product.tiempo_entrega_hs}hs · {product.proveedor_nombre}
            </p>

            {/* Descripción corta */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.descripcion}</p>

            {/* Compatibilidad */}
            {product.compatibilidad && product.compatibilidad.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Compatible con:</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibilidad.map(c => (
                    <span key={c} className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      c.toLowerCase() === 'universal' || c.toLowerCase().includes('universal')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad — solo si no es OT context */}
            {!otContext && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold text-[#0D0D0D]">Cantidad:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setCantidad(c => Math.max(1, c - 1))}
                    className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus className="h-4 w-4 text-gray-500" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{cantidad}</span>
                  <button onClick={() => setCantidad(c => c + 1)}
                    className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: <strong className="text-[#0D0D0D]">$ {total.toLocaleString('es-AR')}</strong>
                </span>
              </div>
            )}

            {/* BOTÓN PRINCIPAL */}
            {otContext ? (
              <button
                onClick={handleAgregarOT}
                className="w-full bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-4 rounded-xl font-bold text-lg transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <Wrench className="h-5 w-5" />
                Agregar a mi OT
              </button>
            ) : addedToCart ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 font-bold px-6 py-4 rounded-xl mb-4">
                <CheckCircle2 className="h-5 w-5" />
                ¡Agregado! Continuá comprando o finalizá.
              </div>
            ) : (
              <button
                onClick={() => setShowGate(true)}
                className="w-full bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-4 rounded-xl font-bold text-lg transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </button>
            )}

            {/* Nota de cuenta — solo si no es OT context */}
            {!otContext && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  Para completar tu compra necesitás una cuenta SHUURI. Es gratis y tarda 2 minutos.
                </p>
                <Link href="/registro" className="inline-block mt-2 text-sm font-bold text-[#2698D1] hover:underline">
                  Crear cuenta gratis →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div className="flex border-b border-gray-100">
            {(['descripcion', 'especificaciones', 'valoraciones'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? 'text-[#2698D1] border-b-2 border-[#2698D1] -mb-px'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'descripcion' ? 'Descripción' : t === 'especificaciones' ? 'Especificaciones' : `Valoraciones ${valoraciones.length > 0 ? `(${valoraciones.length})` : ''}`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'descripcion' && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.descripcion}</p>
            )}

            {tab === 'especificaciones' && (
              <div className="space-y-3">
                {[
                  ['Categoría',     product.categoria],
                  ['Marca',         product.marca],
                  ['Rubro',         MP_RUBRO_LABELS[product.rubro] ?? product.rubro],
                  ['Disponibilidad',product.disponibilidad === 'en_stock' ? 'En stock' : 'Bajo pedido'],
                  ['Tiempo entrega',`${product.tiempo_entrega_hs} horas`],
                  ['Proveedor',     product.proveedor_nombre],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 font-medium">{k}</span>
                    <span className="font-semibold text-[#0D0D0D]">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'valoraciones' && (
              <div>
                {valoraciones.length === 0 ? (
                  <div className="text-center py-10">
                    <Star className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium mb-1">Todavía no hay valoraciones para este producto</p>
                    <p className="text-xs text-gray-400 mb-4">Sé el primero en compartir tu experiencia</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-[#2698D1] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#2698D1]/90 transition-colors"
                    >
                      Escribir valoración
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Resumen rating */}
                    <div className="flex items-start gap-8 mb-6 pb-6 border-b border-gray-100">
                      <div className="text-center">
                        <p className="font-black text-5xl text-[#0D0D0D]">{avgRating}</p>
                        <StarRow rating={Math.round(avgRating)} />
                        <p className="text-xs text-gray-400 mt-1">{valoraciones.length} reseñas</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {ratingDist.map(d => (
                          <div key={d.stars} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-3">{d.stars}</span>
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${d.pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8 text-right">{d.pct}%</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="hidden sm:block border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors shrink-0"
                      >
                        + Valorar
                      </button>
                    </div>

                    {/* Lista valoraciones */}
                    <div className="space-y-5">
                      {valoraciones.map(v => {
                        const initials = v.autorNombre.split(' ').map(n => n[0]).join('').substring(0, 2);
                        const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-amber-100', 'bg-rose-100'];
                        const bg = bgColors[v.autorNombre.charCodeAt(0) % bgColors.length];
                        return (
                          <div key={v.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black shrink-0 ${bg} text-gray-700`}>
                                {initials}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                  <span className="font-semibold text-sm text-[#0D0D0D]">{v.autorNombre}</span>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{v.autorTipo}</span>
                                  {v.verificada && (
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Compra verificada
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <StarRow rating={v.rating} />
                                  <span className="text-xs text-gray-400">{new Date(v.fecha).toLocaleDateString('es-AR')}</span>
                                </div>
                                {v.titulo && <p className="text-sm font-semibold text-[#0D0D0D] mb-1">{v.titulo}</p>}
                                <p className="text-sm text-gray-600 leading-relaxed">{v.comentario}</p>

                                {v.respuestaProveedor && (
                                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border-l-2 border-[#2698D1]/30">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Respuesta del proveedor:</p>
                                    <p className="text-xs text-gray-600">{v.respuestaProveedor}</p>
                                  </div>
                                )}

                                <button
                                  onClick={() => setUtilesState(prev => ({ ...prev, [v.id]: (prev[v.id] ?? v.utiles) + 1 }))}
                                  className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  ¿Útil? ({utilesState[v.id] ?? v.utiles})
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 sm:hidden w-full border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
                    >
                      + Escribir valoración
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COMPATIBILIDAD SECTION */}
        {product.compatibilidad && product.compatibilidad.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="font-black text-[#0D0D0D] mb-4">Compatible con estos equipos</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${rubroColor}`}>
                  <RubroIcon className="h-3.5 w-3.5" />
                  {MP_RUBRO_LABELS[product.rubro] ?? product.rubro}
                </span>
              </div>
              {product.compatibilidad.map(c => (
                <span key={c} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="font-black text-[#0D0D0D] mb-4">
              Otros repuestos para {product.marca} — {MP_RUBRO_LABELS[product.rubro] ?? product.rubro}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <RelatedCard
                  key={p.id}
                  p={p}
                  otContext={otContext}
                  rubroOT={rubroOT}
                  marcaOT={marcaOT}
                />
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          href={otContext ? `/marketplace?otContext=true&rubro=${rubroOT}&marca=${marcaOT}` : '/marketplace'}
          className="inline-flex items-center gap-1.5 text-sm text-[#2698D1] font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {otContext ? 'Volver al catálogo de repuestos' : 'Volver al marketplace'}
        </Link>

      </div>

      {/* REGISTER GATE (normal flow) */}
      {showGate && (
        <RegisterGate
          title="Agregar al carrito"
          subtitle="Necesitás cuenta SHUURI para comprar. Es gratis."
          summary={summary}
          ctaLabel="Confirmar y agregar"
          onClose={() => setShowGate(false)}
          onSuccess={() => {
            console.log('[Marketplace Detail] MOCK | producto:', product.nombre, '| cantidad:', cantidad);
            setShowGate(false);
            setAddedToCart(true);
          }}
        />
      )}

      {/* MODAL VALORACIÓN */}
      {showModal && <ModalValoracion onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ─── PAGE (con Suspense para useSearchParams) ─────────────────────────────────

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#2698D1] border-t-transparent animate-spin" />
      </div>
    }>
      <ProductDetailContent slug={params.slug} />
    </Suspense>
  );
}
