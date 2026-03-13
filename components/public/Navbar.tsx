"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: 'Precios',       href: '/precios' },
  { label: 'Blog',          href: '/blog' },
  { label: 'Gastronómicos', href: '/gastronomicos' },
  { label: 'Técnicos',      href: '/tecnicos' },
  { label: 'Proveedores',   href: '/proveedores' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="h-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-black text-xl text-[#0D0D0D] tracking-tight shrink-0">
          SHUURI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-[#0D0D0D] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-[#0D0D0D] transition-colors px-4 py-2"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-bold bg-[#2698D1] text-white px-4 py-2 rounded-lg hover:bg-[#2698D1]/90 transition-colors"
          >
            Registrarse gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-bold bg-[#2698D1] text-white rounded-lg hover:bg-[#2698D1]/90 transition-colors text-center"
              >
                Registrarse gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
