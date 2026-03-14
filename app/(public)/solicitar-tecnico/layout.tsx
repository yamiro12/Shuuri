import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitar técnico — SHUURI',
  description:
    'Solicitá un técnico certificado para tu equipo gastronómico. Diagnóstico, cotización y reparación coordinados por SHUURI.',
  keywords: [
    'solicitar técnico gastronomía',
    'reparación equipo cocina',
    'técnico certificado Buenos Aires',
    'servicio técnico restaurante',
  ],
};

export default function SolicitarTecnicoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
