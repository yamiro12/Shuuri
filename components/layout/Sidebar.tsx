"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, ClipboardList, Wrench, Utensils,
  CreditCard, Calendar, Package, ShieldCheck, Users, LogOut,
  BarChart3, Settings, Truck, BookOpen, UserCircle, ShoppingBag
} from 'lucide-react';
import { UserRole } from '@/types/shuuri';

interface SidebarProps { userRole: UserRole; userName: string; }
interface NavItem { label: string; href: string; icon: React.ElementType; badge?: string; }
interface NavGroup { group?: string; items: NavItem[]; }

const NAV_CONFIG: Record<UserRole, NavGroup[]> = {
  RESTAURANTE: [
    {
      items: [
        { label: 'Dashboard',       href: '/restaurante',          icon: LayoutDashboard },
        { label: 'Reportar falla',  href: '/restaurante/reportar', icon: PlusCircle },
        { label: 'Mis OTs',         href: '/restaurante/ots',      icon: ClipboardList },
        { label: 'Mis Equipos',     href: '/restaurante/equipos',  icon: Utensils },
        { label: 'Marketplace',     href: '/restaurante/marketplace', icon: ShoppingBag },
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
        { label: 'Mi perfil',    href: '/restaurante/perfil',     icon: UserCircle },
        { label: 'Onboarding',   href: '/restaurante/onboarding', icon: Settings },
      ],
    },
  ],
  TECNICO: [
    {
      items: [
        { label: 'Dashboard',  href: '/tecnico',       icon: LayoutDashboard },
        { label: 'Mi agenda',  href: '/tecnico/agenda', icon: Calendar },
        { label: 'Mis OTs',    href: '/tecnico/ots',    icon: ClipboardList },
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
        { label: 'Mi perfil',       href: '/tecnico/perfil', icon: UserCircle },
        { label: 'Onboarding',      href: '/tecnico/onboarding', icon: Settings },
      ],
    },
  ],
  PROVEEDOR: [
    {
      items: [
        { label: 'Dashboard',       href: '/proveedor',          icon: LayoutDashboard },
        { label: 'Órdenes de compra', href: '/proveedor/ordenes', icon: Package },
        { label: 'Mi catálogo',     href: '/proveedor/catalogo', icon: BookOpen },
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
        { label: 'Técnicos',      href: '/admin/tecnicos',     icon: Wrench },
        { label: 'Restaurantes',  href: '/admin/restaurantes', icon: Utensils },
        { label: 'Proveedores',   href: '/admin/proveedores',  icon: Truck },
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
        { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
      ],
    },
  ],
};

export default function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const navGroups = NAV_CONFIG[userRole];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-[#0D0D0D] text-white">
      <div className="flex h-full flex-col px-3 py-4">

        <div className="mb-8 flex items-center px-4 py-2">
          <span className="text-2xl font-black tracking-tighter text-[#2698D1]">SHUURI</span>
          <span className="ml-2 rounded border border-[#2698D1] px-1.5 py-0.5 text-[10px] font-bold text-[#2698D1]">MVP</span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.group && (
                <p className="mb-1 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/restaurante' &&
                      item.href !== '/tecnico' &&
                      item.href !== '/proveedor' &&
                      item.href !== '/admin' &&
                      pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 ${
                        isActive ? 'bg-[#2698D1] text-white' : 'text-gray-400'
                      }`}>
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
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

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
              {userRole.replace('_', ' ')}
            </span>
            <p className="truncate text-sm font-bold text-white">{userName}</p>
          </div>
          <Link href="/"
            className="mt-1 flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10">
            <LogOut className="mr-3 h-4 w-4" />
            Cerrar Sesión
          </Link>
        </div>

      </div>
    </aside>
  );
}