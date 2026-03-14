"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Minus, Plus } from 'lucide-react';
import { MARKETPLACE_PRODUCTS, MP_RUBRO_LABELS } from '@/data/marketplace-mock';
import RegisterGate from '@/components/public/RegisterGate';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = MARKETPLACE_PRODUCTS.find(p => p.slug === params.slug);

  const [cantidad,      setCantidad]      = useState(1);
  const [showGate,      setShowGate]      = useState(false);
  const [addedToCart,   setAddedToCart]   = useState(false);

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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/marketplace" className="hover:text-gray-600 transition-colors">Marketplace</Link>
          <span>›</span>
          <span className="text-gray-500">{MP_RUBRO_LABELS[product.rubro] ?? product.rubro}</span>
          <span>›</span>
          <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Imagen placeholder */}
          <div className="relative bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
            <Package className="h-20 w-20 text-gray-300" />
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
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {product.categoria}
              </span>
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {MP_RUBRO_LABELS[product.rubro] ?? product.rubro}
              </span>
            </div>

            <h1 className="font-black text-2xl text-[#0D0D0D] leading-snug mb-2">
              {product.nombre}
            </h1>
            <p className="text-sm text-gray-500 mb-1">{product.marca}</p>
            <p className="text-xs text-gray-400 mb-4">Por <span className="font-semibold">{product.proveedor_nombre}</span></p>

            {/* Precio */}
            <p className="font-black text-4xl text-[#0D0D0D] mb-2">
              $ {product.precio_ars.toLocaleString('es-AR')}
            </p>

            {/* Entrega */}
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <Truck className="h-4 w-4 text-[#2698D1]" />
              Entrega en {product.tiempo_entrega_hs}hs · {product.proveedor_nombre}
            </p>

            {/* Descripción */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.descripcion}</p>

            {/* Compatibilidad */}
            {product.compatibilidad && product.compatibilidad.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">Compatible con:</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibilidad.map(c => (
                    <span key={c} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-semibold text-[#0D0D0D]">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCantidad(c => Math.max(1, c - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-500" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{cantidad}</span>
                <button
                  onClick={() => setCantidad(c => c + 1)}
                  className="flex h-10 w-10 items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Total: <strong className="text-[#0D0D0D]">$ {total.toLocaleString('es-AR')}</strong>
              </span>
            </div>

            {/* Botón agregar */}
            {addedToCart ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 font-bold px-6 py-4 rounded-xl mb-4">
                <CheckCircle2 className="h-5 w-5" />
                ¡Agregado! Continuá comprando o finalizá.
              </div>
            ) : (
              <button
                onClick={() => { setShowGate(true); setAddedToCart(false); }}
                className="w-full bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-4 rounded-xl font-bold text-lg transition-colors mb-4"
              >
                Agregar al carrito
              </button>
            )}

            {/* Nota de registro */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                Para completar tu compra necesitás una cuenta SHUURI. Es gratis y tarda 2 minutos.
              </p>
              <Link
                href="/registro"
                className="inline-block mt-2 text-sm font-bold text-[#2698D1] hover:underline"
              >
                Crear cuenta gratis →
              </Link>
            </div>

          </div>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link href="/marketplace" className="text-sm text-[#2698D1] font-semibold hover:underline">
            ← Volver al marketplace
          </Link>
        </div>

      </div>

      {/* RegisterGate */}
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
    </div>
  );
}
