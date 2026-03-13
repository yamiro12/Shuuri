import { EstadoOT, Urgencia, CertificationStatus } from '@/types/shuuri';

const ESTADO_CONFIG: Record<EstadoOT, { label: string; color: string }> = {
  NUEVA:                         { label: 'Nueva',                color: 'bg-gray-100 text-gray-700' },
  EN_DIAGNOSTICO:                { label: 'En diagnóstico',       color: 'bg-yellow-100 text-yellow-800' },
  APROBADA_PENDIENTE_ASIGNACION: { label: 'Pendiente asignación', color: 'bg-orange-100 text-orange-700' },
  TECNICO_ASIGNADO:              { label: 'Técnico asignado',     color: 'bg-blue-100 text-blue-800' },
  EN_VISITA:                     { label: 'En visita',            color: 'bg-blue-200 text-blue-900' },
  COTIZACION_EMITIDA:            { label: 'Cotización emitida',   color: 'bg-purple-100 text-purple-800' },
  AUTORIZADA:                    { label: 'Autorizada',           color: 'bg-indigo-100 text-indigo-800' },
  REPUESTO_SOLICITADO:           { label: 'Repuesto solicitado',  color: 'bg-pink-100 text-pink-800' },
  EN_EJECUCION:                  { label: 'En ejecución',         color: 'bg-cyan-100 text-cyan-800' },
  PENDIENTE_CONFORMIDAD:         { label: 'Pend. conformidad',    color: 'bg-amber-100 text-amber-800' },
  CERRADA_CONFORME:              { label: 'Cerrada conforme',     color: 'bg-green-100 text-green-800' },
  CERRADA_SIN_CONFORMIDAD:       { label: 'Sin conformidad',      color: 'bg-red-100 text-red-800' },
  FACTURADA:                     { label: 'Facturada',            color: 'bg-teal-100 text-teal-800' },
  LIQUIDADA:                     { label: 'Liquidada',            color: 'bg-emerald-100 text-emerald-800' },
  CANCELADA:                     { label: 'Cancelada',            color: 'bg-gray-200 text-gray-500' },
};

const URGENCIA_CONFIG: Record<Urgencia, { label: string; color: string }> = {
  BAJA:    { label: 'Baja',    color: 'bg-gray-100 text-gray-600' },
  MEDIA:   { label: 'Media',   color: 'bg-yellow-100 text-yellow-700' },
  ALTA:    { label: 'Alta',    color: 'bg-orange-100 text-orange-700' },
  CRITICA: { label: 'Crítica', color: 'bg-red-100 text-red-700' },
};

const CERT_CONFIG: Record<CertificationStatus, { label: string; color: string }> = {
  vigente:    { label: 'Vigente',    color: 'bg-green-100 text-green-700' },
  por_vencer: { label: 'Por vencer', color: 'bg-yellow-100 text-yellow-700' },
  vencida:    { label: 'Vencida',    color: 'bg-red-100 text-red-700' },
};

export function EstadoBadge({ estado }: { estado: EstadoOT }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export function UrgenciaBadge({ urgencia }: { urgencia: Urgencia }) {
  const cfg = URGENCIA_CONFIG[urgencia];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export function CertBadge({ status }: { status: CertificationStatus }) {
  const cfg = CERT_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatUSD(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

