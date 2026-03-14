import Link from 'next/link';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

// ─── ÍCONOS SOCIALES (SVG inline) ────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Grid 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Col 1: Identidad ── */}
          <div>
            <span className="font-black text-2xl text-white tracking-tight">SHUURI</span>
            <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
              Servicios técnicos para gastronomía. Coordinados.
            </p>
            <div className="mt-4 text-xs text-gray-500 leading-relaxed">
              <p>SHUURI S.R.L. · CUIT: 30-71234567-8</p>
              <p>Inscripto en AFIP · IVA Responsable Inscripto</p>
            </div>

            {/* Íconos sociales */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/5491150148932"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp SHUURI"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn SHUURI"
                title="Próximamente"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <LinkedInIcon className="h-4 w-4 text-gray-300" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram SHUURI"
                title="Próximamente"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <InstagramIcon className="h-4 w-4 text-gray-300" />
              </a>
            </div>
          </div>

          {/* ── Col 2: Plataforma ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Plataforma
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Cómo funciona',       href: '/como-funciona' },
                { label: 'Precios',              href: '/precios' },
                { label: 'Marketplace',          href: '/marketplace' },
                { label: 'Solicitar técnico',    href: '/solicitar-tecnico' },
                { label: 'Para gastronómicos',   href: '/gastronomicos' },
                { label: 'Para técnicos',        href: '/tecnicos' },
                { label: 'Para proveedores',     href: '/proveedores' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Empresa ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Equipo',            href: '/equipo' },
                { label: 'Modelo de Negocio', href: '/modelo-negocio' },
                { label: 'Cashflow',          href: '/cashflow' },
                { label: 'Pitch Deck',        href: '/pitch' },
                { label: 'Roadmap',           href: '/roadmap' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-800 my-3" />
            <ul className="space-y-2.5">
              {[
                { label: 'Blog',                  href: '/blog',    exists: true  },
                { label: 'Contacto',              href: '/contacto', exists: true  },
                { label: 'Sobre SHUURI',          href: '#',        exists: false },
                { label: 'Prensa',                href: '#',        exists: false },
                { label: 'Trabaja con nosotros',  href: '#',        exists: false },
              ].map(link => (
                <li key={link.label}>
                  {link.exists ? (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span
                      title="Próximamente"
                      className="text-sm text-gray-600 cursor-default flex items-center gap-1.5"
                    >
                      {link.label}
                      <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">pronto</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Soporte ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Soporte
            </h3>
            <ul className="space-y-2.5 mb-5">
              {[
                { label: 'FAQ',                     href: '/faq',                 exists: true  },
                { label: 'Centro de ayuda',          href: '#',                    exists: false },
                { label: 'Estado del sistema',       href: '#',                    exists: false },
                { label: 'Reportar un problema',     href: '/contacto',            exists: true  },
                { label: 'Política de privacidad',   href: '/legal/privacidad',    exists: true  },
                { label: 'Términos y condiciones',   href: '/legal/terminos',      exists: true  },
                { label: 'Cookies',                  href: '/legal/cookies',       exists: true  },
              ].map(link => (
                <li key={link.label}>
                  {link.exists ? (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span
                      title="Próximamente"
                      className="text-sm text-gray-600 cursor-default flex items-center gap-1.5"
                    >
                      {link.label}
                      <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">pronto</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Contacto directo */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Contacto directo
              </p>
              <p className="text-sm text-gray-400">contacto@shuuri.com</p>
              <p className="text-sm text-gray-400 mt-1">+54 9 11 5014-8932</p>
              <p className="text-xs text-gray-600 mt-1">Lun–Vie 9 a 18hs (Argentina)</p>
            </div>
          </div>

        </div>

        {/* ── Barra inferior ── */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

          {/* Copyright */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>© 2026 SHUURI S.R.L. Todos los derechos reservados.</p>
            <p>Plataforma regulada bajo las disposiciones de AFIP/ARCA.</p>
          </div>

          {/* Badges legales */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-lg">
              <Shield className="h-3.5 w-3.5" />
              Datos protegidos — Ley 25.326
            </span>
            <span className="flex items-center gap-1.5 bg-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              AFIP / ARCA Inscripto
            </span>
            <span className="flex items-center gap-1.5 bg-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-lg">
              <Lock className="h-3.5 w-3.5" />
              Transacciones seguras
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
