"use client";
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { RESTAURANTES } from '@/data/mock';
import type { TierCliente } from '@/types/shuuri';
import {
  Users, PlusCircle, X, Shield, Eye, Pencil,
  Crown, AlertCircle, Zap, Mail, CheckCircle2,
  MoreVertical, UserCircle, Trash2,
} from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const TIER_LIMIT: Record<TierCliente, number> = {
  FREEMIUM:     1,
  CADENA_CHICA: 3,
  CADENA_GRANDE: Infinity,
};

const TIER_LIMIT_LABEL: Record<TierCliente, string> = {
  FREEMIUM:      '1 usuario',
  CADENA_CHICA:  'hasta 3 usuarios',
  CADENA_GRANDE: 'usuarios ilimitados',
};

type PortalRole = 'admin' | 'operativo' | 'lectura';

const ROLE_CONFIG: Record<PortalRole, { label: string; desc: string; icon: React.ElementType; cls: string }> = {
  admin:    { label: 'Administrador', desc: 'Acceso total: editar perfil, OTs, equipos y usuarios',   icon: Crown,   cls: 'bg-purple-100 text-purple-700' },
  operativo:{ label: 'Operativo',     desc: 'Puede reportar fallas y gestionar OTs, sin editar perfil', icon: Pencil,  cls: 'bg-blue-100 text-blue-700' },
  lectura:  { label: 'Solo lectura',  desc: 'Puede ver el estado de OTs y equipos, sin modificar nada', icon: Eye,     cls: 'bg-gray-100 text-gray-600' },
};

interface PortalUser {
  id: string;
  nombre: string;
  email: string;
  rol: PortalRole;
  activo: boolean;
  esOwner?: boolean;
}

// Mock inicial de usuarios por restaurante
const USUARIOS_MOCK: Record<string, PortalUser[]> = {
  R001: [
    { id: 'U001', nombre: 'Gastón Riveiro',  email: 'griveiro@lacabrera.com.ar', rol: 'admin',    activo: true, esOwner: true },
  ],
  R002: [
    { id: 'U001', nombre: 'Lucía Campos',    email: 'lcampos@cafemartinez.com.ar', rol: 'admin',    activo: true, esOwner: true },
    { id: 'U002', nombre: 'Diego Ortiz',      email: 'dortiz@cafemartinez.com.ar',  rol: 'operativo', activo: true },
    { id: 'U003', nombre: 'Valeria Soto',     email: 'vsoto@cafemartinez.com.ar',   rol: 'lectura',   activo: true },
  ],
  R006: [
    { id: 'U001', nombre: 'Lautaro Díaz',    email: 'ldiaz@burgerteca.com.ar', rol: 'admin',    activo: true, esOwner: true },
    { id: 'U002', nombre: 'Ana Torres',       email: 'atorres@burgerteca.com.ar', rol: 'operativo', activo: false },
  ],
};

const EMPTY_FORM = { nombre: '', email: '', rol: 'operativo' as PortalRole };

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
  const searchParams  = useSearchParams();
  const restauranteId = searchParams.get('id') ?? 'R001';
  const restaurante   = RESTAURANTES.find(r => r.id === restauranteId) ?? RESTAURANTES[0];
  const tier          = restaurante.tier;
  const limit         = TIER_LIMIT[tier];

  const initial = useMemo(
    () => USUARIOS_MOCK[restauranteId] ?? [
      { id: 'U001', nombre: restaurante.contactoNombre, email: restaurante.legajo?.contactoPrincipalEmail ?? '', rol: 'admin' as PortalRole, activo: true, esOwner: true },
    ],
    [restauranteId]
  );

  const [usuarios,    setUsuarios]    = useState<PortalUser[]>(initial);
  const [showModal,   setShowModal]   = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [menuOpen,    setMenuOpen]    = useState<string | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);

  const atLimit    = usuarios.length >= limit;
  const canAddMore = !atLimit;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd() {
    if (!form.nombre || !form.email) return;
    const newUser: PortalUser = {
      id:     `U${Date.now()}`,
      nombre: form.nombre,
      email:  form.email,
      rol:    form.rol,
      activo: true,
    };
    setUsuarios(prev => [...prev, newUser]);
    setShowModal(false);
    setForm(EMPTY_FORM);
    showToast(`Usuario ${form.nombre} agregado`);
  }

  function handleRemove(id: string) {
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setMenuOpen(null);
    showToast('Usuario eliminado');
  }

  function handleToggleActivo(id: string) {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
    setMenuOpen(null);
  }

  function handleChangeRol(id: string, rol: PortalRole) {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol } : u));
    setMenuOpen(null);
    showToast('Rol actualizado');
  }

  const TIER_COLOR: Record<TierCliente, string> = {
    FREEMIUM:     'bg-gray-100 text-gray-700',
    CADENA_CHICA: 'bg-blue-100 text-blue-700',
    CADENA_GRANDE:'bg-yellow-100 text-yellow-700',
  };
  const TIER_LABEL: Record<TierCliente, string> = {
    FREEMIUM:     'Freemium',
    CADENA_CHICA: 'Cadena Chica',
    CADENA_GRANDE:'Cadena Grande',
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
      <div className="flex-1 sidebar-push">
        <Header userRole="RESTAURANTE" userName={restaurante.nombre} actorId={restauranteId} />
        <main className="p-8 max-w-4xl">

          {/* ── HEADER ── */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D] flex items-center gap-2">
                <Users className="h-6 w-6 text-[#2698D1]" />
                Usuarios & Accesos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} ·{' '}
                <span className={`font-semibold rounded-full px-2 py-0.5 text-xs ${TIER_COLOR[tier]}`}>
                  {TIER_LABEL[tier]}
                </span>
                {' '}· {TIER_LIMIT_LABEL[tier]}
              </p>
            </div>

            {canAddMore ? (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2698D1] transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Agregar usuario
              </button>
            ) : (
              <Link
                href={`/restaurante/licencia?id=${restauranteId}`}
                className="flex items-center gap-2 rounded-xl bg-[#2698D1] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d7ab8] transition-colors"
              >
                <Zap className="h-4 w-4" />
                Mejorar plan
              </Link>
            )}
          </div>

          {/* ── LIMIT BANNER ── */}
          {atLimit && tier !== 'CADENA_GRANDE' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D0D0D]">Límite de usuarios alcanzado</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Tu plan {TIER_LABEL[tier]} incluye {TIER_LIMIT_LABEL[tier]}.
                  {tier === 'FREEMIUM' && ' Pasate a Cadena Chica para agregar hasta 3 usuarios.'}
                  {tier === 'CADENA_CHICA' && ' Pasate a Cadena Grande para usuarios ilimitados.'}
                </p>
              </div>
              <Link
                href={`/restaurante/licencia?id=${restauranteId}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#2698D1] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1d7ab8] transition-colors"
              >
                <Zap className="h-3.5 w-3.5" /> Ver planes
              </Link>
            </div>
          )}

          {/* ── ROLES INFO ── */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {(Object.entries(ROLE_CONFIG) as [PortalRole, typeof ROLE_CONFIG[PortalRole]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const count = usuarios.filter(u => u.rol === key).length;
              return (
                <div key={key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.cls}`}>
                      <Icon className="h-3 w-3" /> {cfg.label}
                    </span>
                    <span className="text-lg font-black text-[#0D0D0D]">{count}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{cfg.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── USER LIST ── */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {usuarios.map((u, i) => {
              const cfg  = ROLE_CONFIG[u.rol];
              const Icon = cfg.icon;
              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 px-6 py-4 ${i < usuarios.length - 1 ? 'border-b border-gray-50' : ''} ${!u.activo ? 'opacity-50' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
                    u.esOwner ? 'bg-[#0D0D0D]' : 'bg-[#2698D1]'
                  }`}>
                    {u.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#0D0D0D]">{u.nombre}</p>
                      {u.esOwner && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                          Propietario
                        </span>
                      )}
                      {!u.activo && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-500">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" /> {u.email || '—'}
                    </p>
                  </div>

                  {/* Rol badge */}
                  <span className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.cls}`}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>

                  {/* Actions */}
                  {!u.esOwner && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {menuOpen === u.id && (
                        <div className="absolute right-0 top-8 z-20 w-52 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                          <div className="px-3 py-2 border-b border-gray-50">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Cambiar rol</p>
                          </div>
                          {(Object.keys(ROLE_CONFIG) as PortalRole[]).map(r => (
                            <button
                              key={r}
                              onClick={() => handleChangeRol(u.id, r)}
                              className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${u.rol === r ? 'font-bold text-[#2698D1]' : 'text-gray-700'}`}
                            >
                              {u.rol === r && <CheckCircle2 className="h-3.5 w-3.5 text-[#2698D1]" />}
                              {u.rol !== r && <span className="w-3.5" />}
                              {ROLE_CONFIG[r].label}
                            </button>
                          ))}
                          <div className="border-t border-gray-50">
                            <button
                              onClick={() => handleToggleActivo(u.id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <UserCircle className="h-3.5 w-3.5 text-gray-400" />
                              {u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                            </button>
                            <button
                              onClick={() => handleRemove(u.id)}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar usuario
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {u.esOwner && <div className="w-9" />}
                </div>
              );
            })}
          </div>

          {/* ── PERMISOS INFO ── */}
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2698D1]" />
                <h2 className="font-bold text-[#0D0D0D] text-sm">Permisos por rol</h2>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">Próximamente: granular</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 pr-4 text-left font-bold text-gray-400 uppercase tracking-wide">Acción</th>
                    {(Object.entries(ROLE_CONFIG) as [PortalRole, typeof ROLE_CONFIG[PortalRole]][]).map(([key, cfg]) => (
                      <th key={key} className="py-2 px-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 font-bold ${cfg.cls}`}>{cfg.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { accion: 'Ver OTs y equipos',       admin: true, operativo: true,  lectura: true  },
                    { accion: 'Reportar fallas',         admin: true, operativo: true,  lectura: false },
                    { accion: 'Gestionar OTs',           admin: true, operativo: true,  lectura: false },
                    { accion: 'Editar equipos',          admin: true, operativo: true,  lectura: false },
                    { accion: 'Ver estadísticas',        admin: true, operativo: true,  lectura: true  },
                    { accion: 'Editar perfil empresa',   admin: true, operativo: false, lectura: false },
                    { accion: 'Gestionar usuarios',      admin: true, operativo: false, lectura: false },
                    { accion: 'Ver datos bancarios',     admin: true, operativo: false, lectura: false },
                  ].map(row => (
                    <tr key={row.accion} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pr-4 text-gray-600">{row.accion}</td>
                      {(['admin', 'operativo', 'lectura'] as PortalRole[]).map(r => (
                        <td key={r} className="py-2.5 px-3 text-center">
                          {row[r]
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mx-auto" />
                            : <X className="h-3.5 w-3.5 text-gray-200 mx-auto" />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* ── ADD MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-black text-[#0D0D0D] mb-1">Nuevo usuario</h2>
            <p className="text-sm text-gray-500 mb-5">
              Podés agregar {limit === Infinity ? 'usuarios ilimitados' : `hasta ${limit} usuario${limit !== 1 ? 's' : ''}`} con tu plan {TIER_LABEL[tier]}.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Nombre completo</label>
                <input
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Juan García"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2698D1] focus:outline-none focus:ring-1 focus:ring-[#2698D1]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="usuario@empresa.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2698D1] focus:outline-none focus:ring-1 focus:ring-[#2698D1]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Rol</label>
                <div className="space-y-2">
                  {(Object.entries(ROLE_CONFIG) as [PortalRole, typeof ROLE_CONFIG[PortalRole]][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, rol: key }))}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                          form.rol === key
                            ? 'border-[#2698D1] bg-blue-50 ring-1 ring-[#2698D1]/30'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${cfg.cls}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#0D0D0D]">{cfg.label}</p>
                          <p className="text-xs text-gray-400">{cfg.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.nombre || !form.email}
                className="flex-1 rounded-xl bg-[#0D0D0D] py-2.5 text-sm font-bold text-white hover:bg-[#2698D1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agregar usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
