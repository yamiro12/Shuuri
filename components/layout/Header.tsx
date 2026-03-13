"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types/shuuri';
import { Search, ChevronRight } from 'lucide-react';
import NotificacionesBell from '@/components/NotificacionesBell';

interface HeaderProps {
  userRole: UserRole;
  userName: string;
  actorId?: string; // for notification filtering; if omitted, bell is hidden
}

const PORTAL_LABELS: Record<UserRole, string> = {
  RESTAURANTE:  'Gastronómico',
  TECNICO:      'Técnico',
  PROVEEDOR:    'Proveedor',
  SHUURI_ADMIN: 'Admin',
};

const PAGE_LABELS: Record<string, string> = {
  // Restaurante
  '/restaurante':                    'Dashboard',
  '/restaurante/reportar':           'Reportar falla',
  '/restaurante/ots':                'Mis OTs',
  '/restaurante/equipos':            'Mis Equipos',
  '/restaurante/marketplace':        'Marketplace',
  '/restaurante/estadisticas':       'Estadísticas',
  '/restaurante/perfil':             'Mi perfil',
  '/restaurante/onboarding':         'Onboarding',
  '/restaurante/dashboard':          'Dashboard',
  '/restaurante/notificaciones':     'Notificaciones',
  // Técnico
  '/tecnico':                        'Dashboard',
  '/tecnico/agenda':                 'Mi agenda',
  '/tecnico/ots':                    'Mis OTs',
  '/tecnico/liquidaciones':          'Liquidaciones',
  '/tecnico/estadisticas':           'Estadísticas',
  '/tecnico/perfil':                 'Mi perfil',
  '/tecnico/onboarding':             'Onboarding',
  '/tecnico/dashboard':              'Dashboard',
  '/tecnico/notificaciones':         'Notificaciones',
  // Proveedor
  '/proveedor':                      'Dashboard',
  '/proveedor/ordenes':              'Órdenes de compra',
  '/proveedor/catalogo':             'Mi catálogo',
  '/proveedor/liquidaciones':        'Liquidaciones',
  '/proveedor/estadisticas':         'Estadísticas',
  '/proveedor/perfil':               'Mi perfil',
  '/proveedor/onboarding':           'Onboarding',
  '/proveedor/dashboard':            'Dashboard',
  '/proveedor/notificaciones':       'Notificaciones',
  // Admin
  '/admin':                          'Dashboard',
  '/admin/ots':                      'Todas las OTs',
  '/admin/tecnicos':                 'Técnicos',
  '/admin/restaurantes':             'Gastronómicos',
  '/admin/proveedores':              'Proveedores',
  '/admin/compliance':               'Compliance',
  '/admin/liquidaciones':            'Liquidaciones',
  '/admin/estadisticas':             'Estadísticas',
  '/admin/integraciones':            'Integraciones',
  '/admin/configuracion':            'Configuración',
};

const AVATAR_COLORS: Record<UserRole, string> = {
  RESTAURANTE:  'bg-orange-500',
  TECNICO:      'bg-blue-500',
  PROVEEDOR:    'bg-purple-500',
  SHUURI_ADMIN: 'bg-[#2698D1]',
};

const BANDEJA_HREF: Partial<Record<UserRole, string>> = {
  RESTAURANTE: '/restaurante/notificaciones',
  TECNICO:     '/tecnico/notificaciones',
  PROVEEDOR:   '/proveedor/notificaciones',
};

function getPageLabel(pathname: string): string {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  const parts = pathname.split('/');
  if (parts.length >= 3) {
    const parent = parts.slice(0, -1).join('/');
    if (PAGE_LABELS[parent]) return PAGE_LABELS[parent];
  }
  return '';
}

export default function Header({ userRole, userName, actorId }: HeaderProps) {
  const pathname  = usePathname();
  const portal    = PORTAL_LABELS[userRole];
  const pageLabel = getPageLabel(pathname);
  const initials  = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bandejaHref = BANDEJA_HREF[userRole];

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur-sm">

      {/* ── LEFT: breadcrumb ───────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-medium text-gray-400">{portal}</span>
        {pageLabel && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="font-semibold text-gray-800">{pageLabel}</span>
          </>
        )}
      </div>

      {/* ── RIGHT: actions ─────────────────────────────────── */}
      <div className="flex items-center gap-1">

        {/* Search trigger */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:block">Buscar...</span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-300 shadow-sm ring-1 ring-gray-200 sm:block">
            ⌘K
          </kbd>
        </button>

        {/* Notification bell — only for portals with a bandeja */}
        {actorId && bandejaHref && userRole !== 'SHUURI_ADMIN' && (
          <NotificacionesBell
            actorId={actorId}
            actorTipo={userRole as 'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR'}
            bandejaHref={bandejaHref}
          />
        )}

        {/* Divider */}
        <div className="mx-2 h-5 w-px bg-gray-100" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black text-white ${AVATAR_COLORS[userRole]}`}>
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{userName.split(' ')[0]}</span>
        </div>

      </div>
    </header>
  );
}
