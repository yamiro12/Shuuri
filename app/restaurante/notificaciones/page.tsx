"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES, NOTIFICACIONES } from '@/data/mock';
import type { Notificacion, TipoNotificacion } from '@/types/shuuri';
import {
  Bell, Wrench, AlertTriangle, Package, Settings, DollarSign,
  CheckCheck, Circle, Filter, Clock,
} from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const TIPO_CONFIG: Record<TipoNotificacion, {
  label: string; icon: React.ElementType; badge: string; dot: string;
}> = {
  ot:       { label: 'OT',        icon: Wrench,        badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  falla:    { label: 'Falla',     icon: AlertTriangle, badge: 'bg-red-100 text-red-700',     dot: 'bg-red-500' },
  repuesto: { label: 'Repuesto',  icon: Package,       badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  sistema:  { label: 'Sistema',   icon: Settings,      badge: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400' },
  pago:     { label: 'Pago',      icon: DollarSign,    badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const TODOS_TIPOS: Array<TipoNotificacion | 'todos'> = ['todos', 'ot', 'falla', 'repuesto', 'sistema', 'pago'];

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RestauranteNotificaciones() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];

  const initial = useMemo(
    () => NOTIFICACIONES.filter(n => n.actorId === restauranteId && n.actorTipo === 'RESTAURANTE'),
    [restauranteId]
  );

  const [notifs,      setNotifs]      = useState<Notificacion[]>(initial);
  const [filtroTipo,  setFiltroTipo]  = useState<TipoNotificacion | 'todos'>('todos');
  const [filtroLeida, setFiltroLeida] = useState<'todas' | 'no_leidas' | 'leidas'>('todas');

  const filtradas = useMemo(() => {
    let list = notifs;
    if (filtroTipo  !== 'todos')     list = list.filter(n => n.tipo  === filtroTipo);
    if (filtroLeida === 'no_leidas') list = list.filter(n => !n.leida);
    if (filtroLeida === 'leidas')    list = list.filter(n =>  n.leida);
    return list.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
  }, [notifs, filtroTipo, filtroLeida]);

  const unread = notifs.filter(n => !n.leida).length;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
  }

  function toggleRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: !n.leida } : n));
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-4xl">

          {/* ── TÍTULO ── */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D] flex items-center gap-2">
                <Bell className="h-6 w-6 text-[#2698D1]" />
                Notificaciones
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {unread > 0 ? (
                  <><span className="font-semibold text-[#0D0D0D]">{unread}</span> sin leer · {notifs.length} total</>
                ) : (
                  <>Todas leídas · {notifs.length} total</>
                )}
              </p>
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <CheckCheck className="h-4 w-4 text-[#2698D1]" />
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* ── FILTROS ── */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {/* Filtro tipo */}
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                {TODOS_TIPOS.map(t => (
                  <button
                    key={t}
                    onClick={() => setFiltroTipo(t)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors capitalize border-r last:border-r-0 ${
                      filtroTipo === t
                        ? 'bg-[#0D0D0D] text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'todos' ? 'Todos' : TIPO_CONFIG[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro leída */}
            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
              {([
                { key: 'todas',     label: 'Todas' },
                { key: 'no_leidas', label: 'Sin leer' },
                { key: 'leidas',    label: 'Leídas' },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltroLeida(f.key)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors border-r last:border-r-0 ${
                    filtroLeida === f.key
                      ? 'bg-[#0D0D0D] text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── LISTA ── */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden mb-6">
            {filtradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Bell className="h-10 w-10 mb-3 opacity-30" />
                <p className="font-medium">Sin notificaciones</p>
                <p className="text-sm mt-1">Cambiá los filtros para ver más</p>
              </div>
            ) : (
              filtradas.map(n => {
                const cfg  = TIPO_CONFIG[n.tipo];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 px-6 py-4 border-b last:border-0 transition-colors hover:bg-gray-50 ${
                      !n.leida ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.badge}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <p className={`text-sm ${!n.leida ? 'font-bold text-[#0D0D0D]' : 'font-medium text-gray-700'}`}>
                          {n.titulo}
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatFecha(n.fechaHora)}
                          </span>
                          <button
                            onClick={() => toggleRead(n.id)}
                            title={n.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                            className="rounded-md p-1 text-gray-300 hover:text-[#2698D1] transition-colors"
                          >
                            <Circle className={`h-3.5 w-3.5 ${!n.leida ? 'fill-blue-500 text-blue-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{n.descripcion}</p>
                      <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── CONFIGURACIÓN PLACEHOLDER ── */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-bold text-[#0D0D0D] text-sm">Configuración de notificaciones</h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                Próximamente
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Pronto podrás elegir qué notificaciones recibir por email, WhatsApp y push.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Email', 'WhatsApp', 'Push'].map(ch => (
                <span
                  key={ch}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                  {ch}
                </span>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
