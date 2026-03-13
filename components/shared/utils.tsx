import { EstadoOT, Urgencia, CertificationStatus } from '@/types/shuuri';

// ─── ESTADO CONFIG ────────────────────────────────────────────────────────────

const ESTADO_CONFIG: Record<EstadoOT, { label: string; color: string; dot: string }> = {
  NUEVA:                         { label: 'Nueva',                dot: 'bg-gray-400',    color: 'bg-gray-100 text-gray-700 ring-gray-200/60' },
  EN_DIAGNOSTICO:                { label: 'En diagnóstico',       dot: 'bg-yellow-400',  color: 'bg-yellow-50 text-yellow-800 ring-yellow-200/60' },
  APROBADA_PENDIENTE_ASIGNACION: { label: 'Pend. asignación',     dot: 'bg-orange-400',  color: 'bg-orange-50 text-orange-700 ring-orange-200/60' },
  TECNICO_ASIGNADO:              { label: 'Técnico asignado',     dot: 'bg-blue-400',    color: 'bg-blue-50 text-blue-700 ring-blue-200/60' },
  EN_VISITA:                     { label: 'En visita',            dot: 'bg-blue-500',    color: 'bg-blue-100 text-blue-800 ring-blue-300/60' },
  COTIZACION_EMITIDA:            { label: 'Cotización emitida',   dot: 'bg-purple-400',  color: 'bg-purple-50 text-purple-700 ring-purple-200/60' },
  AUTORIZADA:                    { label: 'Autorizada',           dot: 'bg-indigo-400',  color: 'bg-indigo-50 text-indigo-700 ring-indigo-200/60' },
  REPUESTO_SOLICITADO:           { label: 'Repuesto solicitado',  dot: 'bg-pink-400',    color: 'bg-pink-50 text-pink-700 ring-pink-200/60' },
  EN_EJECUCION:                  { label: 'En ejecución',         dot: 'bg-cyan-500',    color: 'bg-cyan-50 text-cyan-700 ring-cyan-200/60' },
  PENDIENTE_CONFORMIDAD:         { label: 'Pend. conformidad',    dot: 'bg-amber-400',   color: 'bg-amber-50 text-amber-700 ring-amber-200/60' },
  CERRADA_CONFORME:              { label: 'Cerrada conforme',     dot: 'bg-green-500',   color: 'bg-green-50 text-green-700 ring-green-200/60' },
  CERRADA_SIN_CONFORMIDAD:       { label: 'Sin conformidad',      dot: 'bg-red-500',     color: 'bg-red-50 text-red-700 ring-red-200/60' },
  FACTURADA:                     { label: 'Facturada',            dot: 'bg-teal-400',    color: 'bg-teal-50 text-teal-700 ring-teal-200/60' },
  LIQUIDADA:                     { label: 'Liquidada',            dot: 'bg-emerald-500', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60' },
  CANCELADA:                     { label: 'Cancelada',            dot: 'bg-gray-300',    color: 'bg-gray-100 text-gray-400 ring-gray-200/60' },
};

// ─── URGENCIA CONFIG ──────────────────────────────────────────────────────────

const URGENCIA_CONFIG: Record<Urgencia, { label: string; color: string; dot: string }> = {
  BAJA:    { label: 'Baja',    dot: 'bg-gray-300',   color: 'bg-gray-50 text-gray-500 ring-gray-200/60' },
  MEDIA:   { label: 'Media',   dot: 'bg-yellow-400', color: 'bg-yellow-50 text-yellow-700 ring-yellow-200/60' },
  ALTA:    { label: 'Alta',    dot: 'bg-orange-400', color: 'bg-orange-50 text-orange-700 ring-orange-200/60' },
  CRITICA: { label: 'Crítica', dot: 'bg-red-500',    color: 'bg-red-100 text-red-700 ring-red-300/60 font-bold' },
};

// ─── CERT CONFIG ──────────────────────────────────────────────────────────────

const CERT_CONFIG: Record<CertificationStatus, { label: string; color: string; dot: string }> = {
  vigente:    { label: 'Vigente',    dot: 'bg-green-500',  color: 'bg-green-50 text-green-700 ring-green-200/60' },
  por_vencer: { label: 'Por vencer', dot: 'bg-yellow-400', color: 'bg-yellow-50 text-yellow-700 ring-yellow-200/60' },
  vencida:    { label: 'Vencida',    dot: 'bg-red-500',    color: 'bg-red-50 text-red-700 ring-red-200/60' },
};

// ─── BADGE BASE ───────────────────────────────────────────────────────────────

const BASE = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1';

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

export function EstadoBadge({ estado }: { estado: EstadoOT }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`${BASE} ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function UrgenciaBadge({ urgencia }: { urgencia: Urgencia }) {
  const cfg = URGENCIA_CONFIG[urgencia];
  return (
    <span className={`${BASE} ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function CertBadge({ status }: { status: CertificationStatus }) {
  const cfg = CERT_CONFIG[status];
  return (
    <span className={`${BASE} ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── FORMATTERS ───────────────────────────────────────────────────────────────

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
