import type { Metadata } from 'next';
import BlogContent from './_content';

export const metadata: Metadata = {
  title: 'Blog — SHUURI',
  description:
    'Artículos sobre mantenimiento preventivo, gestión de cocinas industriales y tecnología para la gastronomía argentina. Guías prácticas para restaurantes, bares y cadenas.',
  keywords: [
    'blog mantenimiento gastronómico',
    'cocina industrial Argentina',
    'gestión restaurantes',
    'mantenimiento preventivo gastronomía',
  ],
};

export default function BlogPage() {
  return <BlogContent />;
}
