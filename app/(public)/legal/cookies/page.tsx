import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies | SHUURI',
  description: 'Política de cookies y tecnologías de seguimiento de SHUURI S.R.L.',
};

export default function CookiesPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Legal
        </span>
        <h1 className="font-black text-4xl text-[#0D0D0D] mb-6">
          Política de Cookies
        </h1>
        <p className="text-gray-500 leading-relaxed mb-4">
          Estamos preparando nuestra política de cookies y tecnologías de seguimiento.
        </p>
        <p className="text-gray-500 leading-relaxed mb-8">
          Para consultas, contactanos en{' '}
          <a
            href="mailto:contacto@shuuri.com"
            className="text-[#2698D1] hover:underline font-medium"
          >
            contacto@shuuri.com
          </a>
        </p>
        <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800 mb-8">
          SHUURI utiliza únicamente cookies técnicas necesarias para el funcionamiento de la plataforma.
          No utilizamos cookies de seguimiento de terceros sin consentimiento explícito.
        </div>
        <Link href="/" className="text-sm text-[#2698D1] font-semibold hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
