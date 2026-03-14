import type { Metadata } from 'next';
import PreciosContent from './_content';

export const metadata: Metadata = {
  title: 'Precios — SHUURI',
  description:
    'Planes simples para establecimientos gastronómicos. Empezá gratis con el plan Base o elegí Cadena Chica/Grande para cadenas. Calculá tu costo real con nuestra herramienta interactiva.',
  keywords: [
    'precios SHUURI',
    'plan mantenimiento gastronómico',
    'comisión servicio técnico',
    'cadena chica cadena grande',
  ],
  openGraph: {
    title: 'Precios — SHUURI',
    description: 'Planes simples para restaurantes. Empezá gratis. Sin permanencia.',
    url: 'https://shuuri.com/precios',
  },
  alternates: {
    canonical: 'https://shuuri.com/precios',
  },
};

export default function PreciosPage() {
  return <PreciosContent />;
}
