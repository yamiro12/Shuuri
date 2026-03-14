import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | SHUURI',
  description: 'Política de privacidad de SHUURI S.R.L. — protección de datos personales conforme Ley 25.326.',
};

export default function PrivacidadPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Legal
        </span>
        <h1 className="font-black text-4xl text-[#0D0D0D] mb-6">
          Política de Privacidad
        </h1>
        <p className="text-gray-500 leading-relaxed mb-4">
          Estamos preparando nuestra política de privacidad completa, en cumplimiento de la{' '}
          <strong className="text-[#0D0D0D]">Ley 25.326 de Protección de Datos Personales</strong>{' '}
          de la República Argentina.
        </p>
        <p className="text-gray-500 leading-relaxed mb-8">
          Mientras tanto, podés contactarnos ante cualquier consulta sobre el tratamiento de tus datos en{' '}
          <a
            href="mailto:contacto@shuuri.com"
            className="text-[#2698D1] hover:underline font-medium"
          >
            contacto@shuuri.com
          </a>
        </p>
        <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800 mb-8">
          <strong>SHUURI S.R.L.</strong> · CUIT: 30-XXXXXXXXX-X<br />
          Inscripto en AFIP · IVA Responsable Inscripto<br />
          Responsable del tratamiento de datos — Ley 25.326
        </div>
        <Link href="/" className="text-sm text-[#2698D1] font-semibold hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
