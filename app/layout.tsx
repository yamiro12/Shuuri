import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shuuri.com'),
  title: {
    default: 'SHUURI — Plataforma de servicios para gastronomía',
    template: '%s | SHUURI',
  },
  description: 'Conectamos restaurantes con técnicos certificados y repuestos coordinados. Un solo sistema para coordinar, documentar y controlar todo el mantenimiento de tu equipamiento.',
  keywords: ['servicios técnicos', 'gastronomía', 'restaurante', 'mantenimiento equipos', 'técnicos certificados'],
  authors: [{ name: 'SHUURI' }],
  creator: 'SHUURI',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://shuuri.com',
    siteName: 'SHUURI',
    title: 'SHUURI — Plataforma de servicios para gastronomía',
    description: 'Conectamos restaurantes con técnicos certificados y repuestos coordinados.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SHUURI — Plataforma de servicios para gastronomía',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHUURI — Plataforma de servicios para gastronomía',
    description: 'Conectamos restaurantes con técnicos certificados y repuestos coordinados.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
