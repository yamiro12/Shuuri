"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, CheckCheck, Wrench, AlertTriangle, Package, Settings, DollarSign } from 'lucide-react';
import { NOTIFICACIONES } from '@/data/mock';
import type { Notificacion, TipoNotificacion } from '@/types/shuuri';

// ─── CONFIG POR TIPO ──────────────────────────────────────────────────────────

const TIPO_CONFIG: Record<TipoNotificacion, {
  label: string;
  icon: React.ElementType;
  dot: string;   // dot color class
  badge: string; // badge bg+text classes
}> = {
  ot:       { label: 'OT',        icon: Wrench,        dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
  falla:    { label: 'Falla',     icon: AlertTriangle, dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  repuesto: { label: 'Repuesto',  icon: Package,       dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  sistema:  { label: 'Sistema',   icon: Settings,      dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600' },
  pago:     { label: 'Pago',      icon: DollarSign,    dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700' },
};

// ─── HELPER ───────────────────────────────────────────────────────────────────

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Ahora';
  if (m < 60) return `Hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  const d = Math.floor(h / 24);
  return `Hace ${d}d`;
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface NotificacionesBellProps {
  actorId:   string;
  actorTipo: 'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR';
  bandejaHref: string; // e.g. '/restaurante/notificaciones'
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function NotificacionesBell({ actorId, actorTipo, bandejaHref }: NotificacionesBellProps) {
  const initialNotifs = NOTIFICACIONES.filter(
    n => n.actorId === actorId && n.actorTipo === actorTipo
  );

  const [notifs, setNotifs] = useState<Notificacion[]>(initialNotifs);
  const [open,   setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.leida).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
  }

  function markOneRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  }

  const recent = notifs.slice(0, 6); // show up to 6 in dropdown

  return (
    <div ref={ref} className="relative">
      {/* ── BELL BUTTON ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative ml-1 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Notificaciones"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        {unread === 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gray-300 ring-2 ring-white" />
        )}
      </button>

      {/* ── DROPDOWN ── */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0D0D0D]">Notificaciones</span>
              {unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#2698D1] hover:bg-blue-50 transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Marcar leídas
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Sin notificaciones
              </div>
            ) : (
              recent.map(n => {
                const cfg = TIPO_CONFIG[n.tipo];
                const Icon = cfg.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 border-b last:border-0 ${
                      !n.leida ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cfg.badge}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${!n.leida ? 'font-bold text-[#0D0D0D]' : 'font-medium text-gray-700'}`}>
                            {n.titulo}
                          </p>
                          <span className="shrink-0 text-[10px] text-gray-400">{formatRelative(n.fechaHora)}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {n.descripcion}
                        </p>
                        <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.badge}`}>
                          <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      {!n.leida && (
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-2">
            <Link
              href={bandejaHref}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-lg py-2 text-xs font-semibold text-[#2698D1] hover:bg-blue-50 transition-colors"
            >
              Ver todas las notificaciones →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
