import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export const metadata: Metadata = {
  title: 'SHUURI',
  description: 'Coordinación de servicios técnicos para gastronomía',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-[#0D0D0D]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
