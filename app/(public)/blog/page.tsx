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
  openGraph: {
    title: 'Blog — SHUURI',
    description: 'Guías y artículos sobre mantenimiento de cocinas industriales y gestión gastronómica en Argentina.',
    url: 'https://shuuri.com/blog',
  },
  alternates: {
    canonical: 'https://shuuri.com/blog',
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
