"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  Calendar, Wallet, Truck, FileText,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle, Info,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Integration {
  nombre: string;
  desc: string;
  logo: string;
  badge: 'proximamente' | 'requiere_config';
}

interface Section {
  id: string;
  titulo: string;
  subtitulo: string;
  icon: React.ElementType;
  integraciones: Integration[];
  nota?: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SECCIONES: Section[] = [
  {
    id: 'calendarios',
    titulo: 'Calendarios',
    subtitulo: 'Sincronizá OTs y visitas con los calendarios del equipo',
    icon: Calendar,
    integraciones: [
      { nombre: 'Google Calendar', logo: '📅', desc: 'Sincronización bidireccional de OTs y visitas técnicas.', badge: 'proximamente' },
      { nombre: 'Microsoft Outlook', logo: '📆', desc: 'Integración con Microsoft 365 para equipos corporativos.', badge: 'proximamente' },
      { nombre: 'Apple Calendar', logo: '🍎', desc: 'Conexión con iCal para dispositivos Apple.', badge: 'proximamente' },
    ],
  },
  {
    id: 'pagos',
    titulo: 'Medios de Pago',
    subtitulo: 'Procesá cobros y liquidaciones desde la plataforma',
    icon: Wallet,
    integraciones: [
      { nombre: 'MercadoPago', logo: '🔵', desc: 'Cobros a restaurantes, split automático y liquidaciones a técnicos.', badge: 'proximamente' },
      { nombre: 'MODO', logo: '💳', desc: 'Pagos instantáneos con débito interbancario para clientes argentinos.', badge: 'proximamente' },
    ],
  },
  {
    id: 'logistica',
    titulo: 'Logística',
    subtitulo: 'Gestión de envíos de repuestos y materiales',
    icon: Truck,
    integraciones: [
      { nombre: 'OCA', logo: '🚚', desc: 'Generación automática de guías para envío de repuestos.', badge: 'proximamente' },
      { nombre: 'Andreani', logo: '📦', desc: 'Tracking y gestión de envíos con Andreani.', badge: 'proximamente' },
      { nombre: 'Correo Argentino', logo: '✉️', desc: 'Envíos con Correo Argentino, ideal para piezas pequeñas.', badge: 'proximamente' },
    ],
  },
  {
    id: 'afip',
    titulo: 'Facturación AFIP',
    subtitulo: 'Emisión automática de comprobantes electrónicos',
    icon: FileText,
    nota: 'Esta integración requiere un certificado digital AFIP vigente asociado a la CUIT de SHUURI. El proceso de homologación puede demorar entre 5 y 10 días hábiles.',
    integraciones: [
      { nombre: 'AFIP Web Services (WSFE)', logo: '🏛️', desc: 'Emisión automática de facturas A, B y C contra el servicio WSFE de AFIP.', badge: 'requiere_config' },
      { nombre: 'Certificado Digital', logo: '🔐', desc: 'Gestión del certificado X.509 para autorización de comprobantes.', badge: 'requiere_config' },
    ],
  },
];

// ─── BADGE ────────────────────────────────────────────────────────────────────

function Badge({ tipo }: { tipo: Integration['badge'] }) {
  if (tipo === 'proximamente') {
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-500">
        Próximamente
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
      Requiere configuración
    </span>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ integration, onClose, isAfip }: {
  integration: Integration;
  onClose: () => void;
  isAfip: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{integration.logo}</span>
          <div>
            <h3 className="font-black text-[#0D0D0D]">{integration.nombre}</h3>
            <p className="text-xs text-gray-400">{integration.desc}</p>
          </div>
        </div>

        {isAfip ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-1">Requiere certificado digital AFIP</p>
                <p className="text-xs text-amber-700">
                  Para habilitar la emisión automática de comprobantes necesitás:
                </p>
                <ol className="mt-2 text-xs text-amber-700 space-y-1 list-decimal pl-4">
                  <li>Generar un certificado X.509 desde AFIP con la CUIT de SHUURI</li>
                  <li>Homologar el servicio WSFE en el ambiente de pruebas</li>
                  <li>Subir el certificado y clave privada en Configuración → AFIP</li>
                  <li>Activar el servicio productivo una vez aprobado por AFIP</li>
                </ol>
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  El proceso de homologación puede demorar entre 5 y 10 días hábiles.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-[#2698D1] mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Esta integración estará disponible próximamente. Cuando esté lista, podrás configurarla desde aquí con tu cuenta existente.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Cerrar
          </button>
          {isAfip && (
            <button onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg bg-[#2698D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#2698D1]/90 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
              Ir a AFIP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ACCORDION SECTION ───────────────────────────────────────────────────────

function AccordionSection({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<Integration | null>(null);
  const Icon = section.icon;
  const isAfipSection = section.id === 'afip';

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Icon className="h-4 w-4 text-[#2698D1]" />
          </div>
          <div>
            <p className="font-bold text-[#0D0D0D] text-sm">{section.titulo}</p>
            <p className="text-xs text-gray-400">{section.subtitulo}</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t">
          {section.nota && (
            <div className="mx-6 mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">{section.nota}</p>
            </div>
          )}
          <div className="divide-y">
            {section.integraciones.map(int => (
              <div key={int.nombre} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{int.logo}</span>
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D]">{int.nombre}</p>
                    <p className="text-xs text-gray-400">{int.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tipo={int.badge} />
                  <button
                    onClick={() => setActiveModal(int)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-[#2698D1] hover:text-[#2698D1] transition-colors"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModal && (
        <Modal
          integration={activeModal}
          onClose={() => setActiveModal(null)}
          isAfip={isAfipSection}
        />
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AdminIntegraciones() {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
      <div className="flex-1 sidebar-push">
        <Header userRole="SHUURI_ADMIN" userName="Admin SHUURI" />
        <main className="page-main">

          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#0D0D0D]">Integraciones</h1>
            <p className="text-gray-500 mt-1">Conectá SHUURI con herramientas externas de calendario, pago, logística y facturación.</p>
          </div>

          <div className="space-y-4">
            {SECCIONES.map(s => (
              <AccordionSection key={s.id} section={s} />
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#2698D1]/20 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#2698D1] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#2698D1] mb-1">¿Necesitás una integración personalizada?</p>
                <p className="text-xs text-blue-600">
                  Si tu negocio requiere una conexión específica con un ERP, sistema contable o plataforma de logística,
                  contactá al equipo técnico de SHUURI para evaluar una integración a medida.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
