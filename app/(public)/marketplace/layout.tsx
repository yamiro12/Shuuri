import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace — Repuestos y equipos gastronómicos | SHUURI',
  description:
    'Comprá repuestos, equipos nuevos e insumos para tu cocina industrial. Catálogo con más de 200 productos de las principales marcas del sector.',
  keywords: [
    'marketplace repuestos gastronómicos',
    'equipos cocina industrial',
    'insumos gastronomía Argentina',
    'repuestos Rational Winterhalter',
  ],
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
