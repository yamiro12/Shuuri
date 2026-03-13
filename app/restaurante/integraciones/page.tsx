"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES } from '@/data/mock';
import type { TierCliente } from '@/types/shuuri';
import {
  CheckCircle2, AlertCircle, ArrowRight, Lock,
  Zap, RefreshCw, ExternalLink, Plus, X,
  ShoppingCart, Truck, DollarSign, BarChart3,
  Building2, Users, Package, Globe, Plug,
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type EstadoIntegracion = 'conectada' | 'error' | 'pendiente' | 'disponible' | 'bloqueada';
type CategoriaIntegracion = 'pos' | 'delivery' | 'contabilidad' | 'erp' | 'rrhh' | 'ecommerce';

interface Integracion {
  id:          string;
  nombre:      string;
  descripcion: string;
  logo:        string; // emoji placeholder
  categoria:   CategoriaIntegracion;
  estado:      EstadoIntegracion;
  tierMinimo:  TierCliente;
  ultimaSync?: string;
  destacada?:  boolean;
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const CATEGORIA_LABELS: Record<CategoriaIntegracion, string> = {
  pos:          'Punto de Venta',
  delivery:     'Delivery',
  contabilidad: 'Contabilidad',
  erp:          'ERP',
  rrhh:         'RRHH',
  ecommerce:    'E-commerce',
};

const CATEGORIA_ICON: Record<CategoriaIntegracion, React.ElementType> = {
  pos:          ShoppingCart,
  delivery:     Truck,
  contabilidad: DollarSign,
  erp:          Building2,
  rrhh:         Users,
  ecommerce:    Globe,
};

const TIER_ORDER: Record<TierCliente, number> = {
  FREEMIUM: 0, CADENA_CHICA: 1, CADENA_GRANDE: 2,
};

const TIER_LABELS: Record<TierCliente, string> = {
  FREEMIUM: 'Freemium', CADENA_CHICA: 'Cadena Chica', CADENA_GRANDE: 'Cadena Grande',
};

// ─── MOCK ─────────────────────────────────────────────────────────────────────

const INTEGRACIONES_BASE: Integracion[] = [
  {
    id: 'mercadopago', nombre: 'Mercado Pago', logo: '💙',
    descripcion: 'Vinculá pagos de OTs y repuestos directamente con tu cuenta MP.',
    categoria: 'pos', tierMinimo: 'FREEMIUM', estado: 'conectada',
    ultimaSync: 'hace 2 min', destacada: true,
  },
  {
    id: 'rappi', nombre: 'Rappi', logo: '🟠',
    descripcion: 'Sincronizá pedidos y alertas operativas con tu cuenta Rappi.',
    categoria: 'delivery', tierMinimo: 'FREEMIUM', estado: 'disponible',
    destacada: true,
  },
  {
    id: 'pedidosya', nombre: 'PedidosYa', logo: '🔴',
    descripcion: 'Vinculá eventos de entrega con el sistema de OTs.',
    categoria: 'delivery', tierMinimo: 'CADENA_CHICA', estado: 'disponible',
  },
  {
    id: 'ubereats', nombre: 'Uber Eats', logo: '⚫',
    descripcion: 'Conectá alertas de operación y mantenimiento con tu cuenta Uber Eats.',
    categoria: 'delivery', tierMinimo: 'CADENA_CHICA', estado: 'disponible',
  },
  {
    id: 'tango', nombre: 'Tango Gestión', logo: '🟢',
    descripcion: 'Exportá OTs, costos y liquidaciones a tu sistema contable Tango.',
    categoria: 'contabilidad', tierMinimo: 'CADENA_CHICA', estado: 'error',
    ultimaSync: 'hace 3 días',
  },
  {
    id: 'contaflex', nombre: 'ContaFlex', logo: '🔵',
    descripcion: 'Sincronización automática de gastos de mantenimiento.',
    categoria: 'contabilidad', tierMinimo: 'CADENA_CHICA', estado: 'disponible',
  },
  {
    id: 'bejerman', nombre: 'Bejerman', logo: '⚙️',
    descripcion: 'Integración ERP completa: activos, contratos, proveedores y facturas.',
    categoria: 'erp', tierMinimo: 'CADENA_GRANDE', estado: 'disponible',
    destacada: true,
  },
  {
    id: 'sap', nombre: 'SAP Business One', logo: '🔷',
    descripcion: 'Conectá tu instancia SAP para gestión avanzada de activos y costos.',
    categoria: 'erp', tierMinimo: 'CADENA_GRANDE', estado: 'disponible',
  },
  {
    id: 'bind', nombre: 'Bind ERP', logo: '🟡',
    descripcion: 'ERP cloud argentino con sincronización de proveedores y comprobantes.',
    categoria: 'erp', tierMinimo: 'CADENA_CHICA', estado: 'disponible',
  },
  {
    id: 'factorial', nombre: 'Factorial', logo: '👥',
    descripcion: 'Sincronizá el personal de cada sucursal con las OTs asignadas.',
    categoria: 'rrhh', tierMinimo: 'CADENA_GRANDE', estado: 'disponible',
  },
  {
    id: 'tiendanube', nombre: 'Tienda Nube', logo: '☁️',
    descripcion: 'Conectá tu tienda online con el inventario de equipos y repuestos.',
    categoria: 'ecommerce', tierMinimo: 'CADENA_CHICA', estado: 'disponible',
  },
  {
    id: 'api', nombre: 'API REST SHUURI', logo: '⚡',
    descripcion: 'Acceso completo a la API pública para integraciones personalizadas.',
    categoria: 'erp', tierMinimo: 'CADENA_GRANDE', estado: 'disponible',
    destacada: true,
  },
];

function applyTierToIntegraciones(lista: Integracion[], tier: TierCliente): Integracion[] {
  return lista.map(i => {
    if (TIER_ORDER[i.tierMinimo] > TIER_ORDER[tier]) {
      return { ...i, estado: 'bloqueada' };
    }
    return i;
  });
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: EstadoIntegracion }) {
  if (estado === 'conectada')
    return <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5"><CheckCircle2 className="h-3 w-3" />Conectada</span>;
  if (estado === 'error')
    return <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5"><AlertCircle className="h-3 w-3" />Error</span>;
  if (estado === 'pendiente')
    return <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-full px-2.5 py-0.5"><RefreshCw className="h-3 w-3" />Pendiente</span>;
  if (estado === 'bloqueada')
    return <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5"><Lock className="h-3 w-3" />Bloqueada</span>;
  return null;
}

// ─── MODAL CONECTAR ───────────────────────────────────────────────────────────

function ModalConectar({
  integracion, onClose,
}: { integracion: Integracion; onClose: () => void }) {
  const [paso, setPaso] = useState<'config' | 'ok'>('config');
  const [apiKey, setApiKey] = useState('');
  const [conectando, setConectando] = useState(false);

  async function conectar() {
    setConectando(true);
    await new Promise(r => setTimeout(r, 1400));
    setConectando(false);
    setPaso('ok');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integracion.logo}</span>
            <div>
              <p className="font-black text-[#0D0D0D]">{integracion.nombre}</p>
              <p className="text-xs text-gray-400">{CATEGORIA_LABELS[integracion.categoria]}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {paso === 'config' ? (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">{integracion.descripcion}</p>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                API Key / Token de acceso
              </label>
              <input
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Pegá tu clave de API aquí…"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-mono outline-none focus:border-[#2698D1] transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                Encontrás este dato en la sección Desarrolladores de tu cuenta {integracion.nombre}.
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 flex gap-2">
              <Zap className="h-4 w-4 text-[#2698D1] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                SHUURI sincronizará datos cada 5 minutos. Podés desconectar en cualquier momento.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={conectar}
                disabled={!apiKey.trim() || conectando}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2698D1] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {conectando ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Conectando…
                  </>
                ) : (
                  <>
                    <Plug className="h-4 w-4" />
                    Conectar
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="font-black text-[#0D0D0D] text-lg mb-1">¡Conectado!</p>
            <p className="text-sm text-gray-400 mb-6">
              {integracion.nombre} está sincronizando con SHUURI. La primera sincronización puede demorar unos minutos.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#0D0D0D] py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
            >
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function IntegracionesPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];
  const tier          = restaurante.tier;

  const integraciones = applyTierToIntegraciones(INTEGRACIONES_BASE, tier);

  const [filtro,    setFiltro]    = useState<CategoriaIntegracion | 'todas'>('todas');
  const [modal,     setModal]     = useState<Integracion | null>(null);

  const conectadas  = integraciones.filter(i => i.estado === 'conectada');
  const conError    = integraciones.filter(i => i.estado === 'error');
  const disponibles = integraciones.filter(i => i.estado === 'disponible');
  const bloqueadas  = integraciones.filter(i => i.estado === 'bloqueada');

  const filtradas = integraciones.filter(i => filtro === 'todas' || i.categoria === filtro);
  const categorias = Array.from(new Set(INTEGRACIONES_BASE.map(i => i.categoria))) as CategoriaIntegracion[];

  const tierUpgrade: TierCliente | null =
    tier === 'FREEMIUM' ? 'CADENA_CHICA' : tier === 'CADENA_CHICA' ? 'CADENA_GRANDE' : null;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-5xl mx-auto">

          {/* ── HEADER ── */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D] mb-1">Ecosistema digital</h1>
              <p className="text-sm text-gray-400">
                Conectá SHUURI con tus herramientas de trabajo. Todo en un solo lugar.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                tier === 'FREEMIUM'     ? 'bg-gray-100 text-gray-500' :
                tier === 'CADENA_CHICA' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {TIER_LABELS[tier]}
              </span>
              {tierUpgrade && (
                <Link
                  href={`/restaurante/licencia?id=${restauranteId}`}
                  className="text-xs font-bold text-[#2698D1] hover:underline flex items-center gap-1"
                >
                  Mejorar plan <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          {/* ── RESUMEN ESTADO ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Conectadas',  value: conectadas.length,  color: 'text-green-600', bg: 'bg-green-50',  icon: CheckCircle2 },
              { label: 'Con error',   value: conError.length,    color: 'text-red-600',   bg: 'bg-red-50',    icon: AlertCircle },
              { label: 'Disponibles', value: disponibles.length, color: 'text-[#2698D1]', bg: 'bg-blue-50',   icon: Plus },
              { label: 'Bloqueadas',  value: bloqueadas.length,  color: 'text-gray-400',  bg: 'bg-gray-100',  icon: Lock },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border bg-white p-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── ALERTA TIER ── */}
          {tierUpgrade && bloqueadas.length > 0 && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-800">
                  {bloqueadas.length} integracion{bloqueadas.length > 1 ? 'es bloqueadas' : ' bloqueada'} por tu plan actual
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Pasá a {TIER_LABELS[tierUpgrade]} para desbloquear delivery avanzado, ERP, RRHH y más.
                </p>
              </div>
              <Link
                href={`/restaurante/licencia?id=${restauranteId}`}
                className="shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-yellow-600 transition-colors"
              >
                Ver planes
              </Link>
            </div>
          )}

          {/* ── ALERTA ERROR ── */}
          {conError.length > 0 && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800">
                  {conError.map(i => i.nombre).join(', ')} — error de conexión
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  La sincronización falló. Revisá el token de acceso o intentá reconectar.
                </p>
              </div>
              <button
                onClick={() => { const i = conError[0]; if (i) setModal(i); }}
                className="shrink-0 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors"
              >
                Reconectar
              </button>
            </div>
          )}

          {/* ── FILTRO CATEGORÍA ── */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFiltro('todas')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                filtro === 'todas' ? 'bg-[#0D0D0D] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              Todas
            </button>
            {categorias.map(cat => {
              const Icon = CATEGORIA_ICON[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    filtro === cat ? 'bg-[#0D0D0D] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {CATEGORIA_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* ── GRID INTEGRACIONES ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtradas.map(integ => {
              const bloqueada  = integ.estado === 'bloqueada';
              const conectada  = integ.estado === 'conectada';
              const error      = integ.estado === 'error';
              const Icon       = CATEGORIA_ICON[integ.categoria];

              return (
                <div
                  key={integ.id}
                  className={`relative rounded-2xl border bg-white p-5 flex flex-col gap-4 transition-shadow ${
                    bloqueada ? 'opacity-60' : 'hover:shadow-md'
                  } ${integ.destacada && !bloqueada ? 'border-[#2698D1]/30' : 'border-gray-200'}`}
                >
                  {/* Badge destacada */}
                  {integ.destacada && !bloqueada && (
                    <span className="absolute -top-2 right-4 text-[10px] font-black uppercase tracking-wider bg-[#2698D1] text-white rounded-full px-2 py-0.5">
                      Popular
                    </span>
                  )}

                  {/* Tier lock badge */}
                  {bloqueada && (
                    <span className="absolute -top-2 right-4 text-[10px] font-black uppercase tracking-wider bg-gray-200 text-gray-500 rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      {TIER_LABELS[integ.tierMinimo]}
                    </span>
                  )}

                  {/* Header card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${bloqueada ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        {integ.logo}
                      </div>
                      <div>
                        <p className="font-black text-sm text-[#0D0D0D]">{integ.nombre}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Icon className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-400">{CATEGORIA_LABELS[integ.categoria]}</p>
                        </div>
                      </div>
                    </div>
                    <EstadoBadge estado={integ.estado} />
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{integ.descripcion}</p>

                  {/* Última sync */}
                  {integ.ultimaSync && !bloqueada && (
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Última sync: {integ.ultimaSync}
                    </p>
                  )}

                  {/* CTA */}
                  {bloqueada ? (
                    <Link
                      href={`/restaurante/licencia?id=${restauranteId}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
                    >
                      <Lock className="h-3 w-3" />
                      Mejorar plan para activar
                    </Link>
                  ) : conectada ? (
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                        <RefreshCw className="h-3 w-3" />
                        Sincronizar
                      </button>
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  ) : error ? (
                    <button
                      onClick={() => setModal(integ)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => setModal(integ)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2698D1] py-2 text-xs font-bold text-white hover:bg-[#2698D1]/90 transition-colors"
                    >
                      <Plug className="h-3 w-3" />
                      Conectar
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── API / DESARROLLO ── */}
          {tier === 'CADENA_GRANDE' && (
            <div className="mt-8 rounded-2xl border border-[#2698D1]/20 bg-gradient-to-br from-[#2698D1]/5 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2698D1]/10">
                <BarChart3 className="h-6 w-6 text-[#2698D1]" />
              </div>
              <div className="flex-1">
                <p className="font-black text-[#0D0D0D] mb-0.5">Integración personalizada</p>
                <p className="text-sm text-gray-400">
                  Con tu plan Cadena Grande tenés acceso a la API REST completa de SHUURI
                  y a un webhook configurable para cualquier sistema propio.
                </p>
              </div>
              <a
                href="#"
                className="shrink-0 flex items-center gap-2 rounded-xl border border-[#2698D1] px-4 py-2.5 text-sm font-bold text-[#2698D1] hover:bg-[#2698D1]/5 transition-colors"
              >
                <Package className="h-4 w-4" />
                Ver documentación
              </a>
            </div>
          )}

          {/* ── PLACEHOLDER COMING SOON ── */}
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm font-bold text-gray-400 mb-1">Más integraciones en camino</p>
            <p className="text-xs text-gray-300">
              Factura electrónica AFIP · Whatsapp Business · Google Calendar · Notion
            </p>
          </div>

        </main>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <ModalConectar
          integracion={modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
