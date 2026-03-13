"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, ClipboardList, Wrench, Utensils,
  CreditCard, Calendar, Package, ShieldCheck, Users, LogOut,
  BarChart3, Settings, Truck, BookOpen, UserCircle, ShoppingBag,
  PanelLeftClose, PanelLeftOpen, Bell, Building2, UserCheck, Award,
  ChevronDown, X, User, Clock, Tag, Globe, Plug, PercentCircle,
} from 'lucide-react';
import { UserRole, TierCliente, PlanProveedor } from '@/types/shuuri';
import { RESTAURANTES, PROVEEDORES } from '@/data/mock';
import { useSidebarContext } from '@/context/SidebarContext';

const LS_KEY = 'shuuri-sidebar-collapsed';

interface SidebarProps { userRole: UserRole; userName: string; actorId?: string; }
interface NavItem {
  label:      string;
  href:       string;
  icon:       React.ElementType;
  badge?:     string;
  planBadge?: string;
  primary?:   boolean;
}
interface NavGroup { group?: string; items: NavItem[]; }

const TIER_BADGE: Record<TierCliente, { label: string; cls: string }> = {
  FREEMIUM:     { label: 'Freemium',     cls: 'bg-gray-700/60 text-gray-400' },
  CADENA_CHICA: { label: 'Cadena Chica', cls: 'bg-blue-900/50 text-blue-300' },
  CADENA_GRANDE:{ label: 'Cadena Grande',cls: 'bg-yellow-900/40 text-yellow-400' },
};

const PLAN_PROVEEDOR_BADGE: Record<PlanProveedor, { label: string; cls: string }> = {
  freemium: { label: 'Freemium', cls: 'bg-gray-700/60 text-gray-400' },
  pro:      { label: 'Pro',      cls: 'bg-blue-900/50 text-blue-300' },
  premium:  { label: 'Premium',  cls: 'bg-yellow-900/40 text-yellow-400' },
};

const ROLE_COLOR: Record<UserRole, string> = {
  RESTAURANTE:  'bg-orange-500',
  TECNICO:      'bg-blue-500',
  PROVEEDOR:    'bg-purple-500',
  SHUURI_ADMIN: 'bg-[#2698D1]',
};

const ROLE_LABEL: Record<UserRole, string> = {
  RESTAURANTE:  'Gastronómico',
  TECNICO:      'Técnico',
  PROVEEDOR:    'Proveedor',
  SHUURI_ADMIN: 'Administrador',
};

const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  RESTAURANTE: [], // built at render time
  PROVEEDOR:   [], // built at render time
  TECNICO: [
    {
      items: [
        { label: 'Dashboard',      href: '/tecnico',               icon: LayoutDashboard },
        { label: 'Mi agenda',      href: '/tecnico/agenda',        icon: Calendar },
        { label: 'Mis OTs',        href: '/tecnico/ots',           icon: ClipboardList },
        { label: 'Disponibilidad', href: '/tecnico/disponibilidad',icon: Clock },
        { label: 'Mis Rubros',     href: '/tecnico/rubros',        icon: Tag },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        { label: 'Liquidaciones', href: '/tecnico/liquidaciones', icon: CreditCard },
        { label: 'Estadísticas',  href: '/tecnico/estadisticas',  icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Notificaciones', href: '/tecnico/notificaciones', icon: Bell },
        { label: 'Mi perfil',      href: '/tecnico/perfil',         icon: UserCircle },
        { label: 'Onboarding',     href: '/tecnico/onboarding',     icon: Settings },
      ],
    },
  ],
  SHUURI_ADMIN: [
    {
      items: [
        { label: 'Dashboard',      href: '/admin',     icon: LayoutDashboard },
        { label: 'Todas las OTs',  href: '/admin/ots', icon: ClipboardList },
      ],
    },
    {
      group: 'Actores',
      items: [
        { label: 'Técnicos',      href: '/admin/tecnicos',     icon: Wrench },
        { label: 'Gastronómicos', href: '/admin/restaurantes', icon: Utensils },
        { label: 'Proveedores',   href: '/admin/proveedores',  icon: Truck },
      ],
    },
    {
      group: 'Alta de actores',
      items: [
        { label: 'Alta Gastronómico', href: '/restaurante/onboarding', icon: PlusCircle },
        { label: 'Alta Técnico',      href: '/tecnico/onboarding',     icon: PlusCircle },
        { label: 'Alta Proveedor',    href: '/proveedor/onboarding',   icon: PlusCircle },
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
        { label: 'Integraciones', href: '/admin/integraciones', icon: Package },
        { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
      ],
    },
  ],
};

export default function Sidebar({ userRole, userName, actorId }: SidebarProps) {
  const pathname = usePathname();

  // Tier-aware RESTAURANTE nav
  const tier: TierCliente | undefined =
    userRole === 'RESTAURANTE' && actorId
      ? RESTAURANTES.find(r => r.id === actorId)?.tier
      : undefined;

  // PROVEEDOR plan badge
  const proveedorPlan: PlanProveedor | undefined =
    userRole === 'PROVEEDOR' && actorId
      ? PROVEEDORES.find(p => p.id === actorId)?.plan
      : undefined;

  const restauranteGroups: NavGroup[] = [
    {
      items: [
        { label: 'Dashboard',      href: '/restaurante',          icon: LayoutDashboard },
        { label: 'Reportar falla', href: '/restaurante/reportar', icon: PlusCircle, primary: true },
      ],
    },
    {
      group: 'Operaciones',
      items: [
        { label: 'Mis OTs',        href: '/restaurante/ots',                                                        icon: ClipboardList },
        { label: 'Mis Equipos',    href: '/restaurante/equipos',                                                    icon: Utensils },
        { label: 'Mis Sucursales', href: `/restaurante/sucursales${actorId ? `?id=${actorId}` : ''}`,               icon: Building2 },
        { label: 'Notificaciones', href: '/restaurante/notificaciones',                                             icon: Bell },
      ],
    },
    {
      group: 'Servicio',
      items: [
        { label: 'Mis Técnicos Fijos', href: `/restaurante/tecnicos-fijos${actorId ? `?id=${actorId}` : ''}`, icon: UserCheck },
        { label: 'Marketplace',        href: '/restaurante/marketplace',                                      icon: ShoppingBag },
      ],
    },
    {
      group: 'Analítica',
      items: [
        { label: 'Estadísticas', href: '/restaurante/estadisticas', icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Mi perfil',          href: '/restaurante/perfil',                                                        icon: UserCircle },
        { label: 'Mi Licencia',        href: `/restaurante/licencia${actorId ? `?id=${actorId}` : ''}`,                    icon: Award, planBadge: tier },
        { label: 'Usuarios & Accesos', href: `/restaurante/usuarios${actorId ? `?id=${actorId}` : ''}`,                    icon: Users },
        { label: 'Integraciones',      href: `/restaurante/integraciones${actorId ? `?id=${actorId}` : ''}`,               icon: Package },
        { label: 'Onboarding',         href: '/restaurante/onboarding',                                                    icon: Settings },
      ],
    },
  ];

  const proveedorGroups: NavGroup[] = [
    {
      items: [
        { label: 'Dashboard',         href: '/proveedor',                                                  icon: LayoutDashboard },
        { label: 'Órdenes de compra', href: '/proveedor/ordenes',                                         icon: Package },
        { label: 'Mi catálogo',       href: '/proveedor/catalogo',                                        icon: BookOpen },
      ],
    },
    {
      group: 'Comercial',
      items: [
        { label: 'Mis Marcas', href: `/proveedor/mis-marcas${actorId ? `?id=${actorId}` : ''}`, icon: Tag },
        { label: 'Mi Página',  href: `/proveedor/mi-pagina${actorId ? `?id=${actorId}` : ''}`,  icon: Globe },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        { label: 'Liquidaciones', href: '/proveedor/liquidaciones', icon: CreditCard },
        { label: 'Comisiones',    href: '/proveedor/comisiones',    icon: PercentCircle },
        { label: 'Estadísticas',  href: '/proveedor/estadisticas',  icon: BarChart3 },
      ],
    },
    {
      group: 'Mi cuenta',
      items: [
        { label: 'Notificaciones',     href: '/proveedor/notificaciones',                                       icon: Bell },
        { label: 'Mi perfil',          href: '/proveedor/perfil',                                               icon: UserCircle },
        { label: 'Licencia',           href: `/proveedor/licencia${actorId ? `?id=${actorId}` : ''}`,           icon: Award, planBadge: proveedorPlan },
        { label: 'Usuarios & Accesos', href: `/proveedor/usuarios${actorId ? `?id=${actorId}` : ''}`,           icon: Users },
        { label: 'Integraciones',      href: `/proveedor/integraciones${actorId ? `?id=${actorId}` : ''}`,      icon: Plug },
        { label: 'Onboarding',         href: '/proveedor/onboarding',                                           icon: Settings },
      ],
    },
  ];

  const navGroups =
    userRole === 'RESTAURANTE' ? restauranteGroups :
    userRole === 'PROVEEDOR'   ? proveedorGroups   :
    NAV_CONFIG[userRole];

  // Collapse state — from context (portal layout) or self-managed
  const ctx = useSidebarContext();
  const [ownCollapsed, setOwnCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(LS_KEY) === 'true';
    return false;
  });
  const collapsed = ctx ? ctx.collapsed : ownCollapsed;
  const toggle    = ctx ? ctx.toggle    : () => setOwnCollapsed(c => !c);

  // Mobile drawer state (toggled by Header hamburger via custom event)
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMobileToggle() { setMobileOpen(o => !o); }
    window.addEventListener('shuuri:toggle-mobile-sidebar', handleMobileToggle);
    return () => window.removeEventListener('shuuri:toggle-mobile-sidebar', handleMobileToggle);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [userMenuOpen]);

  // Sync --sidebar-w CSS variable (desktop only)
  useEffect(() => {
    if (!ctx) localStorage.setItem(LS_KEY, String(collapsed));
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '256px');
    }
  }, [collapsed, ctx]);

  // On mount, ensure CSS variable is correct (SSR default is 256px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '256px');
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      document.documentElement.style.setProperty('--sidebar-w', '0px');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isActive(href: string) {
    const hrefPath = href.split('?')[0];
    const roots = ['/restaurante', '/tecnico', '/proveedor', '/admin'];
    if (roots.includes(hrefPath)) return pathname === hrefPath;
    return pathname === hrefPath || pathname.startsWith(hrefPath + '/');
  }

  const initials = userName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const profileHref =
    userRole === 'RESTAURANTE' ? `/restaurante/perfil${actorId ? `?id=${actorId}` : ''}` :
    userRole === 'TECNICO'     ? '/tecnico/perfil' :
    userRole === 'PROVEEDOR'   ? '/proveedor/perfil' : '/admin';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen flex-col
          border-r border-white/[0.06] bg-[#111111]
          transition-[transform,width] duration-300 ease-in-out
          w-[272px]
          ${collapsed ? 'md:w-16' : 'md:w-64'}
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >

        {/* ── LOGO + CONTROLS ──────────────────────────────────── */}
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3">
          {/* Logo mark */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2698D1]">
            <span className="text-[10px] font-black text-white tracking-tight">SH</span>
          </div>

          {/* Brand name — always visible on mobile, conditional on desktop */}
          <span className={`text-[15px] font-black tracking-tight text-white leading-none ${collapsed ? 'md:hidden' : ''}`}>
            SHUURI
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* MVP badge */}
            <span className={`rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500 ${collapsed ? 'md:hidden' : ''}`}>
              MVP
            </span>

            {/* Mobile: close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white/[0.07] hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Desktop: collapse toggle */}
            <button
              onClick={toggle}
              title={collapsed ? 'Expandir' : 'Colapsar'}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-white/[0.07] hover:text-gray-300 transition-colors"
            >
              {collapsed
                ? <PanelLeftOpen  className="h-[15px] w-[15px]" />
                : <PanelLeftClose className="h-[15px] w-[15px]" />
              }
            </button>
          </div>
        </div>

        {/* ── NAV ──────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-2 px-2" style={{ scrollbarWidth: 'none' }}>
          {navGroups.map((group, gi) => (
            <div key={gi} className="mb-0.5">

              {/* Section header */}
              {group.group && (
                <div className={`flex items-center gap-2 px-1 mb-1 mt-3`}>
                  {/* Label — hidden when desktop collapsed */}
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.13em] text-gray-600 whitespace-nowrap ${collapsed ? 'md:hidden' : ''}`}>
                    {group.group}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
              )}

              {/* Nav items */}
              <div className="space-y-px">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`
                        group relative flex items-center rounded-lg py-[7px] text-sm
                        transition-colors duration-100 select-none
                        px-2.5
                        ${collapsed ? 'md:justify-center md:px-0' : 'justify-between'}
                        ${
                          active
                            ? 'bg-white/[0.09] text-white'
                            : item.primary
                              ? 'text-[#2698D1] hover:bg-[#2698D1]/[0.12]'
                              : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-100'
                        }
                      `}
                    >
                      {/* Active left border */}
                      {active && (
                        <span className="absolute left-0 top-1/2 h-[18px] w-0.5 -translate-y-1/2 rounded-r-full bg-[#2698D1]" />
                      )}

                      {/* Icon + label */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className={`h-[15px] w-[15px] shrink-0 ${
                            active         ? 'text-[#2698D1]' :
                            item.primary   ? 'text-[#2698D1]' :
                            'text-gray-600 group-hover:text-gray-400'
                          }`}
                        />
                        <span className={`
                          truncate text-[13px] leading-none
                          ${active ? 'font-semibold' : 'font-medium'}
                          ${collapsed ? 'md:hidden' : ''}
                        `}>
                          {item.label}
                        </span>
                      </div>

                      {/* Badges (hidden when desktop collapsed) */}
                      {(item.badge || item.planBadge) && (
                        <div className={`flex items-center gap-1 shrink-0 ${collapsed ? 'md:hidden' : ''}`}>
                          {item.badge && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500/90 px-1 text-[9px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                          {item.planBadge && (() => {
                            const tb =
                              TIER_BADGE[item.planBadge as TierCliente] ??
                              PLAN_PROVEEDOR_BADGE[item.planBadge as PlanProveedor];
                            return tb ? (
                              <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${tb.cls}`}>
                                {tb.label}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      )}

                      {/* Collapsed badge dot (desktop only) */}
                      {item.badge && collapsed && (
                        <span className="absolute right-1.5 top-1.5 hidden md:block h-[7px] w-[7px] rounded-full bg-red-500 ring-1 ring-[#111111]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── USER FOOTER ──────────────────────────────────────── */}
        <div className="shrink-0 border-t border-white/[0.06] p-2" ref={userMenuRef}>

          {/* User dropdown */}
          {userMenuOpen && !collapsed && (
            <div className="absolute bottom-[72px] left-2 right-2 z-50 rounded-xl border border-white/[0.08] bg-[#1a1a1a] shadow-2xl py-1.5 animate-fade-in">
              <Link
                href={profileHref}
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg text-[12px] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5 text-gray-500" />
                Ver mi perfil
              </Link>
              {userRole === 'RESTAURANTE' && actorId && (
                <Link
                  href={`/restaurante/licencia?id=${actorId}`}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg text-[12px] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-gray-500" />
                  Mi Licencia
                </Link>
              )}
              <div className="my-1.5 mx-1.5 h-px bg-white/[0.06]" />
              <Link
                href="/"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg text-[12px] text-red-400 hover:bg-red-500/[0.1] hover:text-red-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </Link>
            </div>
          )}

          {/* User button */}
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            className={`
              w-full flex items-center rounded-xl
              px-2.5 py-2.5
              hover:bg-white/[0.05] transition-colors
              ${collapsed ? 'md:justify-center md:px-0' : 'gap-2.5'}
            `}
          >
            {/* Avatar */}
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${ROLE_COLOR[userRole]}`}>
              {initials}
            </div>

            {/* Name + role */}
            <div className={`flex-1 min-w-0 text-left ${collapsed ? 'md:hidden' : ''}`}>
              <p className="truncate text-[12px] font-semibold text-gray-200 leading-tight">{userName}</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{ROLE_LABEL[userRole]}</p>
            </div>

            {/* Chevron */}
            <ChevronDown className={`h-3.5 w-3.5 text-gray-600 shrink-0 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} ${collapsed ? 'md:hidden' : ''}`} />
          </button>
        </div>

      </aside>
    </>
  );
}
