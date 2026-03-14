"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu, X, ChevronDown,
  Package, Settings2, Leaf,
  Info, DollarSign, UtensilsCrossed, Wrench, BookOpen, Store,
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type DropdownItem = {
  label: string;
  href:  string;
  icon:  React.ElementType;
};

type NavLink = {
  label:    string;
  href:     string;
  icon:     React.ElementType;
  dropdown?: DropdownItem[];
};

// ─── DATOS ────────────────────────────────────────────────────────────────────

const MARKETPLACE_DROPDOWN: DropdownItem[] = [
  { label: 'Ver repuestos',     href: '/marketplace?cat=repuestos', icon: Package   },
  { label: 'Ver equipos nuevos', href: '/marketplace?cat=equipos',  icon: Settings2 },
  { label: 'Ver insumos',       href: '/marketplace?cat=insumos',  icon: Leaf      },
];

const NAV_LINKS: NavLink[] = [
  { label: 'Cómo funciona',  href: '/como-funciona',  icon: Info            },
  { label: 'Marketplace',    href: '/marketplace',    icon: Store,  dropdown: MARKETPLACE_DROPDOWN },
  { label: 'Precios',        href: '/precios',        icon: DollarSign      },
  { label: 'Gastronómicos',  href: '/gastronomicos',  icon: UtensilsCrossed },
  { label: 'Técnicos',       href: '/tecnicos',       icon: Wrench          },
  { label: 'Proveedores',    href: '/proveedores',    icon: Package         },
  { label: 'Blog',           href: '/blog',           icon: BookOpen        },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="h-16 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0" aria-label="SHUURI — Inicio">
          <span className="font-black text-xl text-[#0D0D0D] tracking-tight">SHUURI</span>
          <span className="text-xs text-gray-400 font-normal ml-1 hidden lg:inline">
            · Servicios técnicos para gastronomía
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {NAV_LINKS.map(link => (
            link.dropdown ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  href={link.href}
                  aria-label={link.label}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#0D0D0D] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </Link>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 pt-1 w-52 z-50">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-lg py-1.5">
                      {link.dropdown.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.label}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#0D0D0D] hover:bg-gray-50 transition-colors"
                          >
                            <Icon className="h-4 w-4 text-[#2698D1]" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className="text-sm font-medium text-gray-600 hover:text-[#0D0D0D] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <span className="hidden md:flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
            Piloto activo
          </span>
          <Link
            href="/login"
            aria-label="Iniciar sesión"
            className="hidden md:block text-sm font-medium text-gray-600 hover:text-[#0D0D0D] transition-colors px-3 py-2"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/solicitar-tecnico"
            aria-label="Solicitar técnico"
            className="bg-[#2698D1] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#2698D1]/90 transition-colors"
          >
            Solicitar técnico
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">

            {/* Links con íconos */}
            <div className="space-y-0.5 mb-4">
              {NAV_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.label}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Soy... */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Soy...
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Gastronómico', href: '/gastronomicos', icon: UtensilsCrossed },
                  { label: 'Técnico',      href: '/tecnicos',      icon: Wrench          },
                  { label: 'Proveedor',    href: '/proveedores',   icon: Package         },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-label={`Soy ${item.label}`}
                      className="flex flex-col items-center gap-1 p-3 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center"
                    >
                      <Icon className="h-5 w-5 text-[#2698D1]" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link
                href="/solicitar-tecnico"
                onClick={() => setMobileOpen(false)}
                aria-label="Solicitar técnico"
                className="block px-4 py-3 text-sm font-bold bg-[#2698D1] text-white rounded-xl hover:bg-[#2698D1]/90 transition-colors text-center"
              >
                Solicitar técnico
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                aria-label="Iniciar sesión"
                className="block px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Iniciar sesión
              </Link>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4 pb-2">
              Plataforma de servicios técnicos para gastronomía
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
