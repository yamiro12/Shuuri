"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, ClipboardList, Wrench, Utensils,
  CreditCard, Calendar, Package, ShieldCheck, Users, LogOut,
  BarChart3, Settings, Truck, BookOpen, UserCircle, ShoppingBag,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { UserRole } from '@/types/shuuri';
import { useSidebarContext } from '@/context/SidebarContext';

const LS_KEY = 'shuuri-sidebar-collapsed';

interface SidebarProps { userRole: UserRole; userName: string; }
interface NavItem { label: string; href: string; icon: React.ElementType; badge?: string; }
interface NavGroup { group?: string; items: NavItem[]; }

const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  RESTAURANTE: [
    {
      items: [
        { label: 'Dashboard',       href: '/restaurante',              icon: LayoutDashboard },
        { label: 'Reportar falla',  href: '/restaurante/reportar',     icon: PlusCircle },
        { label: 'Mis OTs',         href: '/restaurante/ots',          icon: ClipboardList },
        { label: 'Mis Equipos',     href: '/restaurante/equipos',      icon: Utensils },
        { label: 'Marketplace',     href: '/restaurante/marketplace',  icon: ShoppingBag },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        { label: 'Estadísticas', href: '/restaurante/estadisticas', icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Mi perfil',  href: '/restaurante/perfil',     icon: UserCircle },
        { label: 'Onboarding', href: '/restaurante/onboarding', icon: Settings },
      ],
    },
  ],
  TECNICO: [
    {
      items: [
        { label: 'Dashboard', href: '/tecnico',        icon: LayoutDashboard },
        { label: 'Mi agenda', href: '/tecnico/agenda', icon: Calendar },
        { label: 'Mis OTs',   href: '/tecnico/ots',    icon: ClipboardList },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        { label: 'Mis liquidaciones', href: '/tecnico/liquidaciones', icon: CreditCard },
        { label: 'Estadísticas',      href: '/tecnico/estadisticas',  icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Mi perfil',  href: '/tecnico/perfil',     icon: UserCircle },
        { label: 'Onboarding', href: '/tecnico/onboarding', icon: Settings },
      ],
    },
  ],
  PROVEEDOR: [
    {
      items: [
        { label: 'Dashboard',         href: '/proveedor',          icon: LayoutDashboard },
        { label: 'Órdenes de compra', href: '/proveedor/ordenes',  icon: Package },
        { label: 'Mi catálogo',       href: '/proveedor/catalogo', icon: BookOpen },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        { label: 'Liquidaciones', href: '/proveedor/liquidaciones', icon: CreditCard },
        { label: 'Estadísticas',  href: '/proveedor/estadisticas',  icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Mi perfil',  href: '/proveedor/perfil',     icon: Truck },
        { label: 'Onboarding', href: '/proveedor/onboarding', icon: Settings },
      ],
    },
  ],
  SHUURI_ADMIN: [
    {
      items: [
        { label: 'Dashboard Global', href: '/admin',     icon: LayoutDashboard },
        { label: 'Todas las OTs',    href: '/admin/ots', icon: ClipboardList },
      ],
    },
    {
      group: 'Actores',
      items: [
        { label: 'Técnicos',     href: '/admin/tecnicos',     icon: Wrench },
        { label: 'Restaurantes', href: '/admin/restaurantes', icon: Utensils },
        { label: 'Proveedores',  href: '/admin/proveedores',  icon: Truck },
      ],
    },
    {
      group: 'Alta de actores',
      items: [
        { label: 'Alta Restaurante', href: '/restaurante/onboarding', icon: PlusCircle },
        { label: 'Alta Técnico',     href: '/tecnico/onboarding',     icon: PlusCircle },
        { label: 'Alta Proveedor',   href: '/proveedor/onboarding',   icon: PlusCircle },
      ],
    },
    {
      group: 'Operaciones',
      items: [
        { label: 'Compliance',    href: '/admin/compliance',    icon: ShieldCheck, badge: '1' },
        { label: 'Liquidaciones', href: '/admin/liquidaciones', icon: CreditCard },
        { label: 'Estadísticas',  href: '/admin/estadisticas',  icon: BarChart3 },
      ],
    },
    {
      group: 'Sistema',
      items: [
        { label: 'Integraciones', href: '/admin/integraciones', icon: Users },
        { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
      ],
    },
  ],
};

const ROLE_COLOR: Record<UserRole, string> = {
  RESTAURANTE:  'bg-orange-500',
  TECNICO:      'bg-blue-500',
  PROVEEDOR:    'bg-purple-500',
  SHUURI_ADMIN: 'bg-[#2698D1]',
};

const ROLE_ABBR: Record<UserRole, string> = {
  RESTAURANTE:  'RE',
  TECNICO:      'TC',
  PROVEEDOR:    'PR',
  SHUURI_ADMIN: 'AD',
};

export default function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname  = usePathname();
  const navGroups = NAV_CONFIG[userRole];

  // If a layout provides SidebarContext, use it (controlled); otherwise self-contained.
  const ctx = useSidebarContext();

  const [ownCollapsed, setOwnCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_KEY) === 'true';
    }
    return false;
  });

  const collapsed = ctx ? ctx.collapsed : ownCollapsed;
  const toggle    = ctx ? ctx.toggle    : () => setOwnCollapsed(c => !c);

  // Persist preference + update CSS variable for content margin (self-contained mode)
  useEffect(() => {
    if (!ctx) {
      localStorage.setItem(LS_KEY, String(collapsed));
    }
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '256px');
  }, [collapsed, ctx]);

  function isActive(href: string) {
    const roots = ['/restaurante', '/tecnico', '/proveedor', '/admin'];
    if (roots.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-[#0D0D0D] transition-[width] duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >

      {/* ── LOGO ─────────────────────────────────────────────── */}
      <div className={`flex h-14 shrink-0 items-center border-b border-white/5 ${collapsed ? 'justify-center' : 'gap-2.5 px-5'}`}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]">
          <span className="text-[10px] font-black text-white tracking-tight">SH</span>
        </div>
        {!collapsed && (
          <>
            <span className="text-base font-black tracking-tighter text-white">SHUURI</span>
            <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">
              MVP
            </span>
          </>
        )}
      </div>

      {/* ── TOGGLE BUTTON ────────────────────────────────────── */}
      <div className={`flex shrink-0 border-b border-white/5 py-2 ${collapsed ? 'justify-center' : 'justify-end px-3'}`}>
        <button
          onClick={toggle}
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
        >
          {collapsed
            ? <PanelLeftOpen  className="h-4 w-4" />
            : <PanelLeftClose className="h-4 w-4" />
          }
        </button>
      </div>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {navGroups.map((group, gi) => (
          <div key={gi}>

            {group.group && !collapsed && (
              <div className="mb-1.5 flex items-center gap-2 px-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 whitespace-nowrap">
                  {group.group}
                </span>
                <div className="h-px flex-1 bg-white/[0.04]" />
              </div>
            )}
            {group.group && collapsed && (
              <div className="mx-3 mb-1.5 h-px bg-white/[0.04]" />
            )}

            <div className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-lg py-2 text-sm transition-all duration-150 ${
                      collapsed ? 'justify-center px-0' : 'justify-between px-2'
                    } ${
                      active
                        ? 'bg-white/[0.08] text-white'
                        : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-200'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-[#2698D1]" />
                    )}

                    <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                      <item.icon
                        className={`h-[15px] w-[15px] shrink-0 transition-colors ${
                          active ? 'text-[#2698D1]' : 'text-gray-600 group-hover:text-gray-400'
                        }`}
                      />
                      {!collapsed && (
                        <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {item.badge && !collapsed && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                    {item.badge && collapsed && (
                      <span className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── USER + LOGOUT ────────────────────────────────────── */}
      <div className="shrink-0 border-t border-white/5 p-2">
        <div className={`mb-1 flex items-center rounded-lg px-2 py-2 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${ROLE_COLOR[userRole]}`}>
            {ROLE_ABBR[userRole]}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white leading-tight">{userName}</p>
              <p className="text-[10px] text-gray-500 capitalize leading-tight">
                {userRole.replace('SHUURI_', '').replace('_', ' ').toLowerCase()}
              </p>
            </div>
          )}
        </div>
        <Link
          href="/"
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={`flex w-full items-center rounded-lg px-2 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:bg-white/[0.04] hover:text-red-400 ${
            collapsed ? 'justify-center' : 'gap-2.5'
          }`}
        >
          <LogOut className="h-[15px] w-[15px] shrink-0" />
          {!collapsed && 'Cerrar sesión'}
        </Link>
      </div>

    </aside>
  );
}
