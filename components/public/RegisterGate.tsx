"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

export interface RegisterGateProps {
  title?:    string;
  subtitle?: string;
  summary?:  React.ReactNode;
  ctaLabel?: string;
  onClose:   () => void;
  onSuccess?: (email: string) => void;
}

export default function RegisterGate({
  title    = '¡Casi listo!',
  subtitle = 'Creá tu cuenta gratuita para continuar. Tarda menos de 2 minutos.',
  summary,
  ctaLabel = 'Confirmar y crear cuenta',
  onClose,
  onSuccess,
}: RegisterGateProps) {
  const [tab,     setTab]     = useState<'register' | 'login'>('register');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";

  async function handleSubmit() {
    if (!email || !pass) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    console.log('[RegisterGate] MOCK —', tab === 'register' ? 'Registro' : 'Login', '| email:', email);
    setLoading(false);
    setSuccess(true);
    onSuccess?.(email);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Cerrar */}
        {!success && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}

        <div className="p-8">
          {success ? (
            /* ── Éxito ── */
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-5">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-black text-2xl text-[#0D0D0D] mb-3">¡Listo!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Tu cuenta fue creada. Podés acceder a tu panel para ver el estado.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Link
                  href="/demo"
                  className="block w-full text-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Ir a mi panel
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Seguir navegando
                </button>
              </div>
            </div>
          ) : (
            /* ── Formulario ── */
            <>
              {/* Ícono + título */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2698D1]/10 mb-4 mx-auto">
                <CheckCircle2 className="h-6 w-6 text-[#2698D1]" />
              </div>
              <h2 className="font-black text-xl text-[#0D0D0D] text-center mb-1">{title}</h2>
              <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">{subtitle}</p>

              {/* Summary */}
              {summary && (
                <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm">
                  {summary}
                </div>
              )}

              {/* Toggle */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'register' ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Crear cuenta
                </button>
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Ya tengo cuenta
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className={inputCls}
                />
                <input
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder={tab === 'register' ? 'Crear contraseña' : 'Contraseña'}
                  className={inputCls}
                />
              </div>

              <button
                type="button"
                disabled={loading || !email || !pass}
                onClick={handleSubmit}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-sm transition-colors"
              >
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                  : tab === 'register' ? ctaLabel : 'Iniciar sesión y continuar'
                }
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Es gratis · Sin tarjeta de crédito
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
