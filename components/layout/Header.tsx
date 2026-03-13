"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types/shuuri';
import { Search, ChevronRight, Menu, LogOut, User, Settings } from 'lucide-react';
import NotificacionesBell from '@/components/NotificacionesBell';

interface HeaderProps {
  userRole:  UserRole;
  userName:  string;
  actorId?:  string;
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
  '/restaurante/notificaciones':     'Notificaciones',
  '/restaurante/sucursales':         'Mis Sucursales',
  '/restaurante/tecnicos-fijos':     'Mis Técnicos Fijos',
  '/restaurante/licencia':           'Mi Licencia',
  '/restaurante/usuarios':           'Usuarios & Accesos',
  '/restaurante/integraciones':      'Integraciones',
  // Técnico
  '/tecnico':                        'Dashboard',
  '/tecnico/agenda':                 'Mi agenda',
  '/tecnico/ots':                    'Mis OTs',
  '/tecnico/liquidaciones':          'Liquidaciones',
  '/tecnico/estadisticas':           'Estadísticas',
  '/tecnico/perfil':                 'Mi perfil',
  '/tecnico/onboarding':             'Onboarding',
  '/tecnico/notificaciones':         'Notificaciones',
  '/tecnico/disponibilidad':         'Disponibilidad',
  '/tecnico/rubros':                 'Mis Rubros',
  // Proveedor
  '/proveedor':                      'Dashboard',
  '/proveedor/ordenes':              'Órdenes de compra',
  '/proveedor/catalogo':             'Mi catálogo',
  '/proveedor/liquidaciones':        'Liquidaciones',
  '/proveedor/comisiones':           'Comisiones OCR',
  '/proveedor/estadisticas':         'Estadísticas',
  '/proveedor/perfil':               'Mi perfil',
  '/proveedor/onboarding':           'Onboarding',
  '/proveedor/notificaciones':       'Notificaciones',
  '/proveedor/mis-marcas':           'Mis Marcas',
  '/proveedor/mi-pagina':            'Mi Página',
  '/proveedor/licencia':             'Mi Licencia',
  '/proveedor/usuarios':             'Usuarios & Accesos',
  '/proveedor/integraciones':        'Integraciones',
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

function toggleMobileSidebar() {
  window.dispatchEvent(new Event('shuuri:toggle-mobile-sidebar'));
}

export default function Header({ userRole, userName, actorId }: HeaderProps) {
  const pathname    = usePathname();
  const portal      = PORTAL_LABELS[userRole];
  const pageLabel   = getPageLabel(pathname);
  const initials    = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bandejaHref = BANDEJA_HREF[userRole];

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const profileHref =
    userRole === 'RESTAURANTE' ? `/restaurante/perfil${actorId ? `?id=${actorId}` : ''}` :
    userRole === 'TECNICO'     ? '/tecnico/perfil' :
    userRole === 'PROVEEDOR'   ? '/proveedor/perfil' : '/admin';

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-gray-100/80 bg-white/96 px-4 sm:px-6 backdrop-blur-md">

      {/* ── LEFT ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* Hamburger — mobile only */}
        <button
          onClick={toggleMobileSidebar}
          aria-label="Abrir menú"
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="font-medium text-gray-400 shrink-0">{portal}</span>
          {pageLabel && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              <span className="font-semibold text-gray-800 truncate">{pageLabel}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── RIGHT ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

        {/* Search — hidden on mobile */}
        <button className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <Search className="h-3.5 w-3.5" />
          <span>Buscar...</span>
          <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-300 shadow-sm ring-1 ring-gray-200">
            ⌘K
          </kbd>
        </button>

        {/* Notification bell */}
        {actorId && bandejaHref && userRole !== 'SHUURI_ADMIN' && (
          <NotificacionesBell
            actorId={actorId}
            actorTipo={userRole as 'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR'}
            bandejaHref={bandejaHref}
          />
        )}

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-gray-100" />

        {/* User avatar + dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-50 transition-colors"
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black text-white shrink-0 ${AVATAR_COLORS[userRole]}`}>
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {userName.split(' ')[0]}
            </span>
          </button>

          {/* User dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-gray-200 bg-white shadow-lg py-1.5 z-50 animate-fade-in">
              {/* User info */}
              <div className="px-3 py-2 mb-1 border-b border-gray-100">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-[11px] text-gray-400">{PORTAL_LABELS[userRole]}</p>
              </div>

              <Link
                href={profileHref}
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 mx-1 px-2.5 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-gray-400" />
                Mi perfil
              </Link>

              {userRole === 'RESTAURANTE' && actorId && (
                <Link
                  href={`/restaurante/licencia?id=${actorId}`}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 mx-1 px-2.5 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-gray-400" />
                  Mi Licencia
                </Link>
              )}

              <div className="my-1 mx-2 h-px bg-gray-100" />

              <Link
                href="/"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 mx-1 px-2.5 py-2 rounded-lg text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
