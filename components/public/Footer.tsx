import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Col 1: Logo + tagline */}
          <div>
            <span className="font-black text-xl text-[#0D0D0D] tracking-tight">SHUURI</span>
            <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
              Coordinación de servicios técnicos para gastronomía.
              Restaurantes, técnicos y proveedores en un solo sistema.
            </p>
          </div>

          {/* Col 2: Producto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Producto
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Cómo funciona', href: '/como-funciona' },
                { label: 'Precios',       href: '/precios' },
                { label: 'Blog',          href: '/blog' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#0D0D0D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Actores + Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Para vos
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Gastronómicos', href: '/gastronomicos' },
                { label: 'Técnicos',      href: '/tecnicos' },
                { label: 'Proveedores',   href: '/proveedores' },
                { label: 'Contacto',      href: '/contacto' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#0D0D0D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 SHUURI. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/terminos" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Términos
            </Link>
            <Link href="/privacidad" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
