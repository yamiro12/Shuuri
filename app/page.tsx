"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, UtensilsCrossed, Package, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';

// ─── PERFILES DEMO ────────────────────────────────────────────────────────────

const PERFILES = [
  {
    rol:         'RESTAURANTE' as const,
    titulo:      'Restaurante / Cadena',
    subtitulo:   'Reportá fallas, seguí tus OTs, gestioná equipos',
    icon:        UtensilsCrossed,
    color:       '#2698D1',
    bgColor:     'bg-blue-50',
    borderColor: 'border-blue-200',
    ruta:        '/restaurante',
    usuarios: [
      { nombre: 'La Cabrera',           rol: 'FREEMIUM',      detalle: '1 local · Palermo',       id: 'R001' },
      { nombre: 'Café Martínez',        rol: 'CADENA_GRANDE',  detalle: '4 locales · AMBA',        id: 'R002' },
      { nombre: 'Don Julio',            rol: 'FREEMIUM',      detalle: '1 local · Palermo',       id: 'R005' },
    ],
  },
  {
    rol:         'TECNICO' as const,
    titulo:      'Técnico',
    subtitulo:   'Mirá tus OTs asignadas, agenda y liquidaciones',
    icon:        Wrench,
    color:       '#0D0D0D',
    bgColor:     'bg-gray-50',
    borderColor: 'border-gray-200',
    ruta:        '/tecnico',
    usuarios: [
      { nombre: 'Carlos Figueroa',    rol: 'Frío + Gas',          detalle: 'Habilitado · Score 94', id: 'T001' },
      { nombre: 'Alejandro Brizuela', rol: 'Café + Bebidas',      detalle: 'Habilitado · Score 89', id: 'T002' },
      { nombre: 'Sergio Peralta',     rol: 'Gas (bloqueado)',      detalle: '⚠ Cert. vencida',      id: 'T005' },
    ],
  },
  {
    rol:         'PROVEEDOR' as const,
    titulo:      'Proveedor',
    subtitulo:   'Gestioná órdenes de compra, catálogo y liquidaciones',
    icon:        Package,
    color:       '#16a34a',
    bgColor:     'bg-green-50',
    borderColor: 'border-green-200',
    ruta:        '/proveedor',
    usuarios: [
      { nombre: 'Lynch Cocinas Ind.',  rol: 'ShuuriPro',  detalle: 'Calor · Gas · Campanas', id: 'P001' },
      { nombre: 'Frider Refrigeración',rol: 'Estándar',   detalle: 'Frío Comercial',         id: 'P002' },
      { nombre: 'IG Ingeniería Gastr.',rol: 'Estándar',   detalle: 'Multi-rubro',            id: 'P003' },
    ],
  },
  {
    rol:         'SHUURI_ADMIN' as const,
    titulo:      'Admin SHUURI',
    subtitulo:   'Panel operativo completo — OTs, técnicos, compliance, liquidaciones',
    icon:        ShieldCheck,
    color:       '#7c3aed',
    bgColor:     'bg-purple-50',
    borderColor: 'border-purple-200',
    ruta:        '/admin',
    usuarios: [
      { nombre: 'SHUURI Admin', rol: 'Superadmin', detalle: 'Acceso total al sistema', id: 'ADMIN' },
    ],
  },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [entrando,     setEntrando]     = useState(false);

  function handleEntrar(ruta: string, perfilId: string) {
    setSeleccionado(perfilId);
    setEntrando(true);
    // Pasar el id del perfil como query param para que cada panel lo lea
    const destino = perfilId && perfilId !== 'ADMIN' && !perfilId.includes('_default')
      ? `${ruta}?id=${perfilId}`
      : ruta;
    setTimeout(() => router.push(destino), 600);
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2698D1]">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">SHUURI</span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/40">
          MVP · Demo
        </span>
      </div>

      {/* HERO */}
      <div className="px-8 pt-8 pb-10 text-center">
        <h1 className="text-4xl font-black text-white leading-tight">
          Coordinación técnica<br />
          <span className="text-[#2698D1]">para gastronomía</span>
        </h1>
        <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
          Seleccioná un perfil para explorar el prototipo. Cada rol tiene su propio panel.
        </p>
      </div>

      {/* CARDS */}
      <div className="flex-1 px-6 pb-12">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-4">
          {PERFILES.map(perfil => (
            <div
              key={perfil.rol}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            >
              {/* Header card */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${perfil.color}20` }}
                  >
                    <perfil.icon className="h-5 w-5" style={{ color: perfil.color }} />
                  </div>
                  <div>
                    <h3 className="font-black text-white">{perfil.titulo}</h3>
                    <p className="text-xs text-white/40">{perfil.subtitulo}</p>
                  </div>
                </div>
              </div>

              {/* Lista usuarios */}
              <div className="p-3 space-y-1.5">
                {perfil.usuarios.map(u => {
                  const isSelected  = seleccionado === u.id;
                  const isEntrando  = isSelected && entrando;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleEntrar(perfil.ruta, u.id)}
                      disabled={entrando}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                        isSelected
                          ? 'bg-white/10 ring-1 ring-white/20'
                          : 'hover:bg-white/10 bg-white/5'
                      } disabled:opacity-60`}
                    >
                      {/* Avatar */}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                        style={{ backgroundColor: `${perfil.color}25`, color: perfil.color }}
                      >
                        {u.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{u.nombre}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${perfil.color}20`, color: perfil.color }}
                          >
                            {u.rol}
                          </span>
                          <span className="text-xs text-white/30">{u.detalle}</span>
                        </div>
                      </div>

                      {/* Acción */}
                      <div className="shrink-0">
                        {isEntrando ? (
                          <div
                            className="h-5 w-5 rounded-full border-2 border-transparent animate-spin"
                            style={{ borderTopColor: perfil.color }}
                          />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white/20" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Entrar directo al panel (sin usuario específico) */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => handleEntrar(perfil.ruta, perfil.rol + '_default')}
                  disabled={entrando}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all disabled:opacity-40 border"
                  style={{
                    backgroundColor: `${perfil.color}20`,
                    color: perfil.color,
                    borderColor: `${perfil.color}30`,
                  }}
                >
                  Entrar al panel
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FLUJO CENTRAL */}
        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-white/10 bg-white/5 px-8 py-6">
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-white/30">
            Flujo central del prototipo
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { paso: '1', label: 'Restaurante reporta falla',     ruta: '/restaurante/reportar',    color: '#2698D1' },
              { paso: '2', label: 'Admin asigna técnico',           ruta: '/admin/ots',               color: '#7c3aed' },
              { paso: '3', label: 'Técnico ejecuta la visita',      ruta: '/tecnico/ots',             color: '#0D0D0D' },
              { paso: '4', label: 'Restaurante aprueba cotización', ruta: '/restaurante/ots',         color: '#2698D1' },
              { paso: '5', label: 'Admin liquida la OT',            ruta: '/admin/liquidaciones',     color: '#7c3aed' },
            ].map((p, i, arr) => (
              <React.Fragment key={p.paso}>
                <button
                  onClick={() => router.push(p.ruta)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors hover:bg-white/10"
                  style={{ color: p.color }}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.paso}
                  </span>
                  {p.label}
                </button>
                {i < arr.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-white/20 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
