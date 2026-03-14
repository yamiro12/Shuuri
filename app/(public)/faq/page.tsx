import type { Metadata } from 'next';
import FaqContent from './_content';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — SHUURI',
  description:
    'Centro de ayuda SHUURI. Todo lo que necesitás saber sobre la plataforma: preguntas para gastronómicos, técnicos, proveedores, planes y precios.',
  keywords: [
    'SHUURI FAQ',
    'preguntas frecuentes servicio técnico gastronomía',
    'ayuda SHUURI',
    'cómo funciona SHUURI',
  ],
  openGraph: {
    title: 'Preguntas frecuentes — SHUURI',
    description: 'Centro de ayuda. Todo lo que necesitás saber sobre SHUURI.',
    url: 'https://shuuri.com/faq',
  },
  alternates: {
    canonical: 'https://shuuri.com/faq',
  },
};

export default function FaqPage() {
  return <FaqContent />;
}
