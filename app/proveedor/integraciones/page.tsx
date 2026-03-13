"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PROVEEDORES } from '@/data/mock';
import {
  Building2, Package, ShoppingCart, Truck, BarChart3,
  MessageCircle, Code2, Bell, BellOff, CheckCircle2,
  Zap, Lock, Globe, ArrowRight, Plug,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SeccionId = 'erp' | 'pim' | 'ecommerce' | 'logistica' | 'bi' | 'comunicacion';

interface IntegracionItem {
  id:          string;
  nombre:      string;
  logo:        string;
  descripcion: string;
}

interface Seccion {
  id:          SeccionId;
  label:       string;
  descripcion: string;
  icon:        React.ElementType;
  color:       string;
  bg:          string;
  items:       IntegracionItem[];
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SECCIONES: Seccion[] = [
  {
    id: 'erp', label: 'ERPs', icon: Building2,
    color: 'text-blue-600', bg: 'bg-blue-50',
    descripcion: 'Sincronizá órdenes de compra, stock y facturación con tu sistema de gestión.',
    items: [
      { id: 'tango',    nombre: 'Tango Gestión',    logo: '🟦', descripcion: 'Sincronizá compras, remitos y facturación automáticamente.' },
      { id: 'colppy',   nombre: 'Colppy',            logo: '🟩', descripcion: 'Conectá tu contabilidad y cuentas corrientes en tiempo real.' },
      { id: 'softland', nombre: 'Softland',          logo: '🔵', descripcion: 'Integrá inventario, ventas y logística en un solo flujo.' },
      { id: 'sap_b1',   nombre: 'SAP Business One',  logo: '🔷', descripcion: 'Conectá tu ERP SAP con el catálogo y órdenes SHUURI.' },
      { id: 'sap_s4',   nombre: 'SAP S/4HANA',       logo: '🔷', descripcion: 'Integración enterprise con módulos de MM y SD de SAP.' },
      { id: 'datalive', nombre: 'Datalive',           logo: '📊', descripcion: 'Sincronizá precios, stock y facturación electrónica.' },
      { id: 'bejerman', nombre: 'Bejerman',           logo: '🟣', descripcion: 'Conectá tu gestión comercial y financiera con SHUURI.' },
    ],
  },
  {
    id: 'pim', label: 'PIMs — Gestión de Catálogo', icon: Package,
    color: 'text-purple-600', bg: 'bg-purple-50',
    descripcion: 'Gestioná y sincronizá tu catálogo de productos desde una única fuente de verdad.',
    items: [
      { id: 'producteca', nombre: 'Producteca',  logo: '🛒', descripcion: 'Gestioná atributos, imágenes y precios de tu catálogo.' },
      { id: 'balcony',    nombre: 'Balcony',     logo: '🏗️', descripcion: 'Publicá y actualizá productos en múltiples canales.' },
      { id: 'plytix',     nombre: 'Plytix',      logo: '📦', descripcion: 'PIM colaborativo para gestión de ficha técnica y medios.' },
      { id: 'akeneo',     nombre: 'Akeneo',      logo: '🔶', descripcion: 'Plataforma PIM open-source para catálogos complejos.' },
      { id: 'saleslayer', nombre: 'Saleslayer',  logo: '🗂️', descripcion: 'Distribuí tu catálogo a múltiples plataformas de venta.' },
      { id: 'inriver',    nombre: 'inRiver',     logo: '🌊', descripcion: 'PIM enterprise para gestión de experiencia de producto.' },
    ],
  },
  {
    id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart,
    color: 'text-green-600', bg: 'bg-green-50',
    descripcion: 'Sincronizá tu catálogo SHUURI con tu tienda online: árbol de categorías, stock en tiempo real y precios.',
    items: [
      { id: 'shopify',    nombre: 'Shopify',     logo: '🛍️', descripcion: 'Sincronizá catálogo, stock y precios con tu tienda Shopify.' },
      { id: 'tiendanube', nombre: 'Tiendanube',  logo: '☁️', descripcion: 'Publicá productos SHUURI en tu tienda Tiendanube.' },
      { id: 'magento',    nombre: 'Magento',     logo: '🟠', descripcion: 'Integrá tu catálogo Adobe Commerce / Magento 2.' },
      { id: 'vtex',       nombre: 'VTEX',        logo: '🔵', descripcion: 'Conectá tu catálogo y stock con la plataforma VTEX.' },
      { id: 'woocommerce',nombre: 'WooCommerce', logo: '🟣', descripcion: 'Sincronizá productos y precios en tu tienda WordPress.' },
    ],
  },
  {
    id: 'logistica', label: 'Logística', icon: Truck,
    color: 'text-orange-600', bg: 'bg-orange-50',
    descripcion: 'Automatizá envíos, seguimiento y última milla directamente desde las órdenes de compra.',
    items: [
      { id: 'oca',             nombre: 'OCA',             logo: '🟡', descripcion: 'Generá guías OCA automáticamente al confirmar una OCR.' },
      { id: 'andreani',        nombre: 'Andreani',        logo: '🔴', descripcion: 'Integración con Andreani para envíos puerta a puerta.' },
      { id: 'correoarg',       nombre: 'Correo Argentino',logo: '🇦🇷', descripcion: 'Despacho con Correo Argentino desde la plataforma.' },
      { id: 'enviame',         nombre: 'Enviame',         logo: '📬', descripcion: 'Multi-carrier: elegí el transportista más conveniente.' },
      { id: 'pickit',          nombre: 'Pickit',          logo: '📦', descripcion: 'Red de puntos de retiro para última milla urbana.' },
      { id: 'chazki',          nombre: 'Chazki',          logo: '🚴', descripcion: 'Última milla express para envíos urgentes CABA/GBA.' },
      { id: 'rappi_biz',       nombre: 'Rappi Business',  logo: '🟠', descripcion: 'Entregas on-demand con flota Rappi para urgencias.' },
    ],
  },
  {
    id: 'bi', label: 'BI y Analytics', icon: BarChart3,
    color: 'text-indigo-600', bg: 'bg-indigo-50',
    descripcion: 'Exportá tus datos de ventas, stock y OCRs a tu herramienta de BI favorita.',
    items: [
      { id: 'powerbi',     nombre: 'Power BI',             logo: '📊', descripcion: 'Conectores para reportes de ventas, stock y comisiones.' },
      { id: 'tableau',     nombre: 'Tableau',               logo: '📈', descripcion: 'Dashboards avanzados con datos SHUURI en tiempo real.' },
      { id: 'looker',      nombre: 'Looker Studio',         logo: '🔍', descripcion: 'Reportes gratuitos vía Google Data Studio.' },
      { id: 'metabase',    nombre: 'Metabase',              logo: '🗃️', descripcion: 'Self-hosted BI con consultas SQL sobre tus datos.' },
    ],
  },
  {
    id: 'comunicacion', label: 'Comunicación', icon: MessageCircle,
    color: 'text-teal-600', bg: 'bg-teal-50',
    descripcion: 'Automatizá notificaciones y confirmaciones hacia tus clientes gastronómicos.',
    items: [
      { id: 'wa_business', nombre: 'WhatsApp Business API', logo: '💬', descripcion: 'Enviá confirmaciones de pedido, notificaciones de entrega y alertas de stock por WhatsApp.' },
    ],
  },
];

// ─── INTEGRATION CARD ─────────────────────────────────────────────────────────

function IntegracionCard({ item, notificado, onNotificar }: {
  item: IntegracionItem;
  notificado: boolean;
  onNotificar: () => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border text-xl">
          {item.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-bold text-[#0D0D0D] truncate">{item.nombre}</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide shrink-0">
              Próximamente
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-snug">{item.descripcion}</p>
        </div>
      </div>

      <button
        onClick={onNotificar}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
          notificado
            ? 'bg-green-50 border border-green-200 text-green-700 cursor-default'
            : 'border border-gray-200 text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] hover:bg-blue-50'
        }`}
        disabled={notificado}
      >
        {notificado
          ? <><CheckCircle2 className="h-3.5 w-3.5" /> Notificado</>
          : <><Bell className="h-3.5 w-3.5" /> Notificarme</>
        }
      </button>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function IntegracionesProveedor() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [notificados,   setNotificados]   = useState<Set<string>>(new Set());
  const [filtroSeccion, setFiltroSeccion] = useState<SeccionId | 'todas'>('todas');
  const [toast,         setToast]         = useState<string | null>(null);

  function toggleNotificar(id: string, nombre: string) {
    setNotificados(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else {
        next.add(id);
        showToast(`Te avisaremos cuando ${nombre} esté disponible`);
      }
      return next;
    });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const seccionesFiltradas = filtroSeccion === 'todas'
    ? SECCIONES
    : SECCIONES.filter(s => s.id === filtroSeccion);

  const totalNotificados = notificados.size;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} actorId={proveedorId} />
        <main className="page-main">

          {/* ── PAGE HEADER ── */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-black text-[#0D0D0D]">Integraciones</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Conectá tu ecosistema digital: ERP, PIM, logística, e-commerce y más.
                </p>
              </div>
              {totalNotificados > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2">
                  <Bell className="h-4 w-4 text-[#2698D1]" />
                  <span className="text-sm font-bold text-[#2698D1]">
                    {totalNotificados} integración{totalNotificados > 1 ? 'es' : ''} en lista de espera
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── API ABIERTA — CARD GRANDE ── */}
          <div className="mb-8 rounded-2xl border-2 border-[#2698D1]/40 bg-gradient-to-br from-[#2698D1]/5 to-blue-50 p-6 overflow-hidden relative">
            <div className="absolute right-6 top-4 opacity-5">
              <Code2 className="h-32 w-32 text-[#2698D1]" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2698D1]">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-[#0D0D0D]">SHUURI API Proveedor</h2>
                  <p className="text-xs text-gray-500">Conectá cualquier sistema con tu catálogo, stock, precios y órdenes de compra.</p>
                </div>
                <div className="flex gap-2 ml-0 sm:ml-auto flex-wrap">
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <Lock className="h-3 w-3" /> Disponible en plan premium
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Próximamente
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Catálogo & SKUs',       desc: 'CRUD completo de productos, precios y atributos' },
                  { label: 'Stock en tiempo real',   desc: 'Webhooks de disponibilidad por depósito o zona' },
                  { label: 'Órdenes de compra',      desc: 'Recibí OCRs, actualizá estado y seguimiento' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl border border-[#2698D1]/20 bg-white px-4 py-3">
                    <p className="text-xs font-bold text-[#2698D1] mb-0.5">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => toggleNotificar('api_proveedor', 'la API Proveedor')}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  notificados.has('api_proveedor')
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-[#2698D1] text-white hover:bg-[#2698D1]/90'
                }`}
                disabled={notificados.has('api_proveedor')}
              >
                {notificados.has('api_proveedor')
                  ? <><CheckCircle2 className="h-4 w-4" /> Notificado — te avisamos cuando esté disponible</>
                  : <><Bell className="h-4 w-4" /> Notificarme cuando esté disponible</>
                }
              </button>
            </div>
          </div>

          {/* ── FILTRO DE SECCIONES ── */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroSeccion('todas')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                filtroSeccion === 'todas'
                  ? 'bg-[#0D0D0D] text-white'
                  : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              <Plug className="h-3.5 w-3.5" /> Todas
            </button>
            {SECCIONES.map(s => (
              <button key={s.id}
                onClick={() => setFiltroSeccion(s.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                  filtroSeccion === s.id
                    ? 'bg-[#0D0D0D] text-white'
                    : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* ── SECCIONES ── */}
          <div className="space-y-8">
            {seccionesFiltradas.map(seccion => (
              <div key={seccion.id}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${seccion.bg}`}>
                    <seccion.icon className={`h-5 w-5 ${seccion.color}`} />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0D0D0D]">{seccion.label}</h2>
                    <p className="text-xs text-gray-500">{seccion.descripcion}</p>
                  </div>
                  <span className="ml-auto text-xs text-gray-400 shrink-0">
                    {seccion.items.length} integraciones
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {seccion.items.map(item => (
                    <IntegracionCard
                      key={item.id}
                      item={item}
                      notificado={notificados.has(item.id)}
                      onNotificar={() => toggleNotificar(item.id, item.nombre)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── FOOTER NOTE ── */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-3">
            <Zap className="h-5 w-5 text-[#2698D1] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#0D0D0D] mb-1">
                ¿Tu sistema no está en la lista?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Todas las integraciones están en desarrollo. Si usás un sistema que no aparece,
                escribinos a <span className="font-bold text-[#2698D1]">integraciones@shuuri.com</span> y
                lo priorizamos en el roadmap.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl animate-fade-in">
          🔔 {toast}
        </div>
      )}
    </div>
  );
}
