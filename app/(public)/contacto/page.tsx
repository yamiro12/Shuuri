"use client";
import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, Clock, MessageCircle, Loader2 } from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface FormData {
  nombre:   string;
  email:    string;
  telefono: string;
  empresa:  string;
  soy:      string;
  locales:  string;
  mensaje:  string;
}

const INITIAL: FormData = {
  nombre:   '',
  email:    '',
  telefono: '',
  empresa:  '',
  soy:      '',
  locales:  '',
  mensaje:  '',
};

// ─── FORM ─────────────────────────────────────────────────────────────────────

function ContactForm() {
  const [form,    setForm]    = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/demo-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Error inesperado');
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hubo un problema. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-5">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="font-black text-2xl text-[#0D0D0D] mb-3">
          ¡Recibimos tu solicitud!
        </h3>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          Te contactamos en 48 horas hábiles para coordinar una demo personalizada.
        </p>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0D0D0D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2698D1]/30 focus:border-[#2698D1] transition-colors";
  const labelCls = "block text-sm font-semibold text-[#0D0D0D] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Nombre completo *</label>
          <input
            name="nombre" value={form.nombre} onChange={handleChange}
            required placeholder="Juan García"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input
            name="email" type="email" value={form.email} onChange={handleChange}
            required placeholder="juan@mirestaurante.com"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Teléfono / WhatsApp *</label>
          <input
            name="telefono" value={form.telefono} onChange={handleChange}
            required placeholder="+54 11 1234-5678"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Empresa o nombre del local *</label>
          <input
            name="empresa" value={form.empresa} onChange={handleChange}
            required placeholder="La Cabrera"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Soy *</label>
          <select
            name="soy" value={form.soy} onChange={handleChange}
            required className={inputCls}
          >
            <option value="" disabled>Seleccioná una opción</option>
            <option value="dueno_gerente">Dueño o gerente de restaurante</option>
            <option value="tecnico">Técnico de gastronomía</option>
            <option value="proveedor">Proveedor de equipamiento</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Cantidad de locales</label>
          <select
            name="locales" value={form.locales} onChange={handleChange}
            className={inputCls}
          >
            <option value="" disabled>Seleccioná una opción</option>
            <option value="1">1 local</option>
            <option value="2-5">2 a 5 locales</option>
            <option value="6-20">6 a 20 locales</option>
            <option value="20+">Más de 20 locales</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>¿Qué necesitás?</label>
        <textarea
          name="mensaje" value={form.mensaje} onChange={handleChange}
          rows={4}
          placeholder="Contanos tu situación actual..."
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#2698D1] hover:bg-[#2698D1]/90 disabled:opacity-70 text-white py-3.5 rounded-xl font-bold transition-colors"
      >
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
          : 'Enviar solicitud'
        }
      </button>

      <p className="text-sm text-center text-gray-400">
        O escribinos directo por WhatsApp{' '}
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2698D1] font-semibold hover:underline"
        >
          →
        </a>
      </p>

    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ContactoPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

          {/* Columna izquierda — Formulario (60%) */}
          <div className="lg:col-span-3">
            <h1 className="font-black text-4xl text-[#0D0D0D] mb-3">
              Hablemos
            </h1>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Contanos sobre tu operación y te mostramos cómo SHUURI puede ayudarte.
            </p>
            <ContactForm />
          </div>

          {/* Columna derecha — Info (40%) */}
          <div className="lg:col-span-2 space-y-6 lg:pt-16">

            {/* Cards de contacto */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-5">

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200">
                  <Mail className="h-5 w-5 text-[#2698D1]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-[#0D0D0D]">contacto@shuuri.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/5491100000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Abrir chat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Horario</p>
                  <p className="text-sm font-semibold text-[#0D0D0D]">Lunes a viernes</p>
                  <p className="text-sm text-gray-500">9 a 18 hs (Argentina)</p>
                </div>
              </div>

            </div>

            {/* Separador + link login */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">¿Ya estás en la plataforma?</p>
              <Link
                href="/demo"
                className="text-sm font-bold text-[#2698D1] hover:underline"
              >
                Acceder al panel →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
