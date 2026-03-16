"use client"

import { useState } from "react"

const SLIDES = [
  {
    id: "01",
    title: "El problema",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white leading-tight">
          El servicio técnico gastronómico en Argentina
          <br />
          está completamente fragmentado.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              who: "Para el restaurante",
              desc: "Cuando algo falla, no sabe a quién llamar. No tiene registro del equipo, no tiene historial. Llama por WhatsApp y espera.",
            },
            {
              who: "Para el técnico",
              desc: "Pierde viajes porque nadie coordinó el repuesto. Trabaja sin sistema, sin historial del activo y cobra de forma informal.",
            },
            {
              who: "Para el proveedor",
              desc: "Vende a través de canales que no puede medir. No sabe cuándo falla un equipo que necesita sus repuestos.",
            },
          ].map((p) => (
            <div key={p.who} className="rounded-2xl bg-white/10 p-6">
              <p className="mb-2 text-sm font-semibold text-[#2698D1]">{p.who}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-sm font-semibold text-gray-400 mb-1">El resultado</p>
          <p className="text-white leading-relaxed">
            Un mercado de <span className="font-bold text-[#2698D1]">USD 500M</span> sin sistema de
            coordinación. Tres actores desconectados. Una oportunidad enorme.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    title: "Mercado",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">El mercado existe y está validado.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { stat: "110.000+", label: "establecimientos gastronómicos en Argentina" },
            { stat: "20.000", label: "técnicos potenciales en AMBA" },
            { stat: "475", label: "proveedores identificados de repuestos" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 p-6 text-center">
              <p className="text-4xl font-bold text-[#2698D1]">{s.stat}</p>
              <p className="mt-2 text-sm text-gray-300">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "TAM (Argentina)", value: "USD 500M/año", sub: "Servicios técnicos + repuestos" },
            { label: "SAM (AMBA · Año 1)", value: "USD 80M/año", sub: "CABA + GBA · 20.000 establecimientos" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Solución",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">
          SHUURI coordina todo lo que hoy es caos.
        </h2>
        <p className="text-gray-300 leading-relaxed max-w-2xl">
          Marketplace B2B2B. El restaurante abre un ticket. El sistema asigna al técnico correcto
          con la certificación vigente para ese equipo. El repuesto llega coordinado. Todo queda
          registrado.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Compliance regulatorio embebido",
              desc: "Bloqueo absoluto si el técnico no tiene certificación vigente. No puede asignarse — no es una advertencia.",
            },
            {
              title: "Historial por activo",
              desc: "Cada OT suma datos al historial del equipo. El cliente no quiere perder ese registro.",
            },
            {
              title: "Modelo mandato",
              desc: "Resuelve la complejidad fiscal argentina. SHUURI actúa como agente comercial — paga impuestos solo sobre la comisión.",
            },
            {
              title: "Pricing probabilístico",
              desc: "Los servicios técnicos no son deterministicos. Dos fases: estimación previa + cotización definitiva post-diagnóstico.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/10 p-5">
              <p className="mb-1 font-semibold text-white">{f.title}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "04",
    title: "Tecnología",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">
          Stack propio. Sin dependencias de terceros para lo core.
        </h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {[
            { layer: "Motor OT", tech: "Duotach", desc: "Activo intelectual propio de SHUURI desde M1" },
            { layer: "ERP", tech: "Odoo Enterprise", desc: "Facturación, clientes, proveedores, comisiones" },
            { layer: "Apps", tech: "Next.js + TypeScript · Álamo SRL", desc: "Paneles gastronómico y técnico" },
            { layer: "IA / asignación", tech: "Anthropic Claude API", desc: "Matching, clasificación, soporte automático" },
            { layer: "Infraestructura", tech: "AWS + Vercel", desc: "~USD 200/mes estimado en MVP" },
          ].map((row, i) => (
            <div
              key={row.layer}
              className={`flex flex-col gap-1 px-5 py-3 md:flex-row md:items-center md:gap-6 ${
                i % 2 === 0 ? "bg-white/5" : "bg-white/10"
              }`}
            >
              <p className="w-36 text-xs font-semibold uppercase tracking-wider text-gray-400 flex-shrink-0">
                {row.layer}
              </p>
              <p className="font-semibold text-white">{row.tech}</p>
              <p className="text-xs text-gray-400 md:ml-auto">{row.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 text-center">
          Sin Crombie · Sin Fracttal · Motor OT es activo propio
        </p>
      </div>
    ),
  },
  {
    id: "05",
    title: "Modelo",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">
          6 streams de ingreso sobre la misma plataforma.
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { n: "1", title: "Comisión por OT", desc: "30% freemium · 25% CC · 20% CG", tag: "Principal" },
            { n: "2", title: "Suscripción SaaS", desc: "USD 75/local CC · USD 100/local CG", tag: "Recurrente" },
            { n: "3", title: "Comisión repuestos", desc: "15% sobre cada orden de compra", tag: "Marketplace" },
            { n: "4", title: "Comisión insumos", desc: "10% sobre venta sin OT", tag: "Canal adicional" },
            { n: "5", title: "ShuuriPro", desc: "USD 1.600/mes · proveedores premium", tag: "B2B SaaS" },
            { n: "6", title: "SaaS Enterprise", desc: "Por activo gestionado · cadenas grandes", tag: "Enterprise" },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 rounded-xl bg-white/10 p-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-xs font-bold text-white">
                {s.n}
              </span>
              <div>
                <p className="font-semibold text-white text-sm">{s.title}</p>
                <p className="text-xs text-gray-300">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "06",
    title: "Tracción",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">MVP activo. Modelo acelerado.</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "Mar-26", label: "Arranque MVP", sub: "Capital USD 102K founders" },
            { stat: "M11", label: "Breakeven EBITDA", sub: "Revenue USD 213K/mes" },
            { stat: "42.939", label: "Clientes en M18", sub: "Objetivo 15K superado ×2.8" },
            { stat: "USD 993K", label: "Revenue M18", sub: "×6 vs modelo base" },
          ].map((t) => (
            <div key={t.label} className="rounded-2xl bg-white/10 p-5 text-center">
              <p className="text-2xl font-bold text-[#2698D1]">{t.stat}</p>
              <p className="mt-1 text-sm font-semibold text-white">{t.label}</p>
              <p className="mt-1 text-xs text-gray-400">{t.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            3 palancas de aceleración
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "CAC USD 100 → USD 20", desc: "WhatsApp masivo + técnicos como canal" },
              { title: "200 técnicos/mes activos", desc: "Reclutamiento independiente de clientes" },
              { title: "8 CGs/mes + 40 CCs/mes", desc: "2 comerciales B2B desde M7" },
            ].map((p) => (
              <div key={p.title}>
                <p className="font-semibold text-white text-sm">{p.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-green-900/30 border border-green-500/20 p-4">
          <p className="text-green-400 font-semibold text-sm">★ Guapaletas — primer cliente CG confirmado</p>
          <p className="text-xs text-gray-400 mt-1">Piloto activo · comodato freezers en estaciones YPF</p>
        </div>
      </div>
    ),
  },
  {
    id: "07",
    title: "Competencia",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">No hay competidor directo en Argentina.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              cat: "WhatsApp informal",
              desc: "El mercado actual. Sin historial, sin garantía de certificación, sin trazabilidad.",
              risk: "Bajo · fácil de desplazar",
            },
            {
              cat: "Plataformas generalistas",
              desc: "GetNinjas, Taskrabbit. No verticalizados en gastronomía, sin compliance de gas/refrigeración.",
              risk: "Medio · fuera del nicho",
            },
            {
              cat: "Software de CMMS",
              desc: "Fracttal, Maintfy. B2B puro para el técnico, no conectan al restaurante ni al proveedor.",
              risk: "Bajo · complementario",
            },
          ].map((c) => (
            <div key={c.cat} className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 font-semibold text-white">{c.cat}</p>
              <p className="mb-3 text-sm text-gray-300 leading-relaxed">{c.desc}</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                {c.risk}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-[#2698D1]/30 p-5">
          <p className="text-sm font-semibold text-[#2698D1] mb-2">El moat de SHUURI</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Compliance regulatorio + historial de activos + red de técnicos verificados + modelo
            mandato. No son ventajas tecnológicas — son barreras operacionales que se acumulan con
            cada transacción.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "08",
    title: "Proyecciones",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Modelo acelerado. Caja nunca negativa.</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { mes: "M7", label: "Seed USD 500K", rev: "USD 21K/mes", caja: "USD 440K" },
            { mes: "M11", label: "★ Breakeven", rev: "USD 213K/mes", caja: "USD 329K" },
            { mes: "M18", label: "★ 42.939 clientes", rev: "USD 993K/mes", caja: "USD 1.386M" },
            { mes: "M36", label: "★ Scale LATAM", rev: "USD 5.349M/mes", caja: "USD 21.7M" },
          ].map((p) => (
            <div
              key={p.mes}
              className={`rounded-2xl p-5 ${
                p.mes === "M11" || p.mes === "M18" || p.mes === "M36"
                  ? "bg-green-900/30 border border-green-500/20"
                  : "bg-white/10"
              }`}
            >
              <p className="text-xs font-mono text-gray-400">{p.mes}</p>
              <p className="mt-1 font-bold text-white">{p.label}</p>
              <p className="mt-2 text-lg font-bold text-[#2698D1]">{p.rev}</p>
              <p className="text-xs text-gray-400 mt-0.5">Caja: {p.caja}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Capital total invertido
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Founders (Yair + Sebi)", value: "USD 102K" },
              { label: "Seed M7", value: "USD 500K" },
              { label: "Total", value: "USD 602K" },
              { label: "Caja M36", value: "USD 21.7M" },
              { label: "Múltiplo", value: "×36" },
            ].map((i) => (
              <div key={i.label}>
                <p className="text-xs text-gray-400">{i.label}</p>
                <p className="font-bold text-white">{i.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "09",
    title: "Equipo",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Equipo y cap table.</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              init: "YL",
              name: "Yair Levy Wald · CEO",
              eq: "45%",
              desc: "Estrategia comercial · marketing · go-to-market · fundador Levy Wald CMO",
            },
            {
              init: "SS",
              name: "Sebastián Smulevich · COO",
              eq: "35%",
              desc: "Wiltec + Fermabras · red de técnicos · proveedores · industria gastronómica",
            },
            {
              init: "KT",
              name: "Kevin T. · CTO",
              eq: "5%",
              desc: "Arquitectura · Motor OT · Odoo · apps Next.js · Álamo SRL",
            },
            {
              init: "HS",
              name: "Toro · CFO",
              eq: "3%",
              desc: "Modelo financiero v5 · proyecciones 36 meses · inversores",
            },
          ].map((m) => (
            <div key={m.name} className="flex gap-4 rounded-xl bg-white/10 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2698D1] text-xs font-bold text-white">
                {m.init}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-white text-sm">{m.name}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-[#2698D1]">
                    {m.eq}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Cap table completo (fundacional)
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              ["Yair", "45%"],
              ["Sebi", "35%"],
              ["Kevin", "5%"],
              ["Toro", "3%"],
              ["Duotach (sweat)", "2.8%"],
              ["Pool C-Levels", "5%"],
              ["Pool RRHH", "4.2%"],
            ].map(([name, pct]) => (
              <div key={name} className="text-center">
                <p className="font-bold text-white">{pct}</p>
                <p className="text-xs text-gray-400">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "10",
    title: "El ask",
    content: (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">USD 500K. Eso es todo lo que necesitamos.</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#2698D1]/20 border border-[#2698D1]/30 p-6">
            <p className="text-4xl font-bold text-[#2698D1]">USD 500K</p>
            <p className="mt-2 text-white font-semibold">Ronda seed · M7 · Sep-26</p>
            <p className="mt-1 text-sm text-gray-300">20% equity · USD 2M pre-money</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Por qué USD 500K es suficiente
            </p>
            {[
              "Breakeven EBITDA en M11 — antes de consumir el seed",
              "Caja mínima USD 338K — nunca toca negativo",
              "No depende de una segunda ronda para crecer",
              "Capital propio USD 102K ya cubre el MVP completo",
            ].map((r) => (
              <div key={r} className="flex gap-2 text-sm text-gray-300">
                <span className="text-green-400 flex-shrink-0">✓</span>
                {r}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Marketing + pauta", value: "USD 180K", sub: "M7-M18 · 3 palancas activas" },
            { label: "Tech + infra", value: "USD 160K", sub: "Duotach · Álamo post-MVP · cloud" },
            { label: "RRHH + operaciones", value: "USD 160K", sub: "Comerciales B2B · C-Levels · ops" },
          ].map((u) => (
            <div key={u.label} className="rounded-2xl bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                {u.label}
              </p>
              <p className="text-xl font-bold text-white">{u.value}</p>
              <p className="text-xs text-gray-400 mt-1">{u.sub}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-green-900/30 border border-green-500/20 p-5">
          <p className="text-green-400 font-semibold mb-2">Lo que el inversor obtiene</p>
          <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-300">
            <div>20% de una empresa que en M18 vale USD 15M → USD 3M</div>
            <div>Primera inversión en el OS del equipamiento gastronómico de LatAm</div>
            <div>Breakeven M11 — el runway no depende de una segunda ronda</div>
            <div>Modelo con 6 streams de ingreso y flywheel defensible</div>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm">
          Contacto:{" "}
          <a href="mailto:yair@levywald.com" className="text-[#2698D1] hover:underline">
            yair@levywald.com
          </a>{" "}
          · +54 9 11 5014-8932
        </p>
      </div>
    ),
  },
]

export default function PitchPage() {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* ── SLIDE NAV TABS ── */}
      <div className="border-b border-white/10 px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max mx-auto max-w-5xl">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                i === current
                  ? "bg-white text-[#0D0D0D]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-[10px] opacity-60">{s.id}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── SLIDE CONTENT ── */}
      <div className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-sm font-mono text-gray-600">
            {slide.id} — {slide.title}
          </p>
          {slide.content}
        </div>
      </div>

      {/* ── PREV / NEXT ── */}
      <div className="border-t border-white/10 px-6 py-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-gray-300 hover:border-white/50 hover:text-white disabled:opacity-30 transition-all"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-600 font-mono">
            {current + 1} / {SLIDES.length}
          </span>
          <button
            onClick={() => setCurrent(Math.min(SLIDES.length - 1, current + 1))}
            disabled={current === SLIDES.length - 1}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-gray-300 hover:border-white/50 hover:text-white disabled:opacity-30 transition-all"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </main>
  )
}
