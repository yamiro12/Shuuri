import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modelo de Negocio | SHUURI",
  description:
    "Marketplace B2B2B que coordina servicios técnicos entre restaurantes, técnicos certificados y proveedores de repuestos. Tres actores. Un sistema.",
}

export default function ModeloNegocioPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="border-b border-gray-100 bg-white px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#2698D1]">
            Modelo de negocio
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Un mercado de USD 500M.
            <br />
            Un sistema que nadie armó todavía.
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 leading-relaxed">
            Marketplace B2B2B que coordina servicios técnicos entre restaurantes, técnicos
            certificados y proveedores de repuestos. Tres actores. Un sistema. Modelo
            transaccional con capa SaaS.
          </p>
        </div>
      </section>

      {/* ── LOS TRES ACTORES ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Los tres actores</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Gastronómicos",
                desc: "Restaurantes, bares, hoteles, cafeterías. El que paga por el servicio y necesita que su cocina no pare.",
                stat: "110.000+",
                sub: "establecimientos en Argentina",
              },
              {
                label: "Técnicos",
                desc: "Independientes y empresas técnicas con certificación. Cobran el 70% del servicio, liquidación quincenal.",
                stat: "~20.000",
                sub: "técnicos potenciales en AMBA",
              },
              {
                label: "Proveedores",
                desc: "Fabricantes, distribuidores e importadores. Canal de venta de repuestos coordinado con entrega confirmada.",
                stat: "475",
                sub: "proveedores identificados en Argentina",
              },
            ].map((a) => (
              <div key={a.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2698D1]">
                  {a.label}
                </p>
                <p className="mb-6 text-gray-600 leading-relaxed">{a.desc}</p>
                <p className="text-3xl font-bold text-gray-900">{a.stat}</p>
                <p className="mt-1 text-sm text-gray-400">{a.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 STREAMS ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">6 streams de ingreso</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                n: "1",
                tag: "Stream principal",
                title: "Comisión por OT coordinada",
                desc: "30% freemium · 25% cadena chica · 20% cadena grande. Escala con el volumen de tickets.",
              },
              {
                n: "2",
                tag: "Recurrente SaaS",
                title: "Suscripción mensual por local",
                desc: "USD 75/local/mes cadena chica · USD 100/local/mes cadena grande. Recurrente predecible.",
              },
              {
                n: "3",
                tag: "Multiplicador",
                title: "Comisión marketplace repuestos",
                desc: "15% sobre el valor de cada orden de compra. Escala automáticamente con el volumen de OTs.",
              },
              {
                n: "4",
                tag: "Canal adicional",
                title: "Comisión marketplace insumos",
                desc: "10% sobre venta de productos e insumos. Sin OT requerida, canal de venta adicional.",
              },
              {
                n: "5",
                tag: "B2B SaaS",
                title: "ShuuriPro — proveedores premium",
                desc: "USD 1.600/mes. Comisión 0%, API abierta, visibilidad prioritaria. Para distribuidores y fabricantes grandes.",
              },
              {
                n: "6",
                tag: "Enterprise",
                title: "SaaS grandes cadenas",
                desc: "Suscripción fija por activo gestionado. Para cadenas de 10+ locales con flota de equipos.",
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-6">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0D0D0D] text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {s.tag}
                  </p>
                  <p className="mb-2 font-semibold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Tiers para gastronómicos</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                tier: "Freemium",
                price: "USD 0 / mes",
                com: "30%",
                desc: "Para probar la plataforma.",
                highlight: false,
              },
              {
                tier: "Cadena Chica",
                price: "USD 75 / local / mes",
                com: "25%",
                desc: "Para cadenas de 2–9 locales.",
                highlight: true,
              },
              {
                tier: "Cadena Grande",
                price: "USD 100 / local / mes",
                com: "20%",
                desc: "Para cadenas de 10+ locales.",
                highlight: false,
              },
            ].map((t) => (
              <div
                key={t.tier}
                className={`rounded-2xl p-8 ${
                  t.highlight
                    ? "bg-[#0D0D0D] text-white"
                    : "border border-gray-100 bg-white text-gray-900"
                }`}
              >
                <p
                  className={`mb-2 text-sm font-semibold uppercase tracking-widest ${
                    t.highlight ? "text-[#2698D1]" : "text-gray-400"
                  }`}
                >
                  {t.tier}
                </p>
                <p className={`mb-1 text-xl font-bold ${t.highlight ? "text-white" : ""}`}>
                  {t.price}
                </p>
                <p
                  className={`mb-4 text-sm ${t.highlight ? "text-gray-400" : "text-gray-400"}`}
                >
                  {t.desc}
                </p>
                <p
                  className={`text-sm font-medium ${
                    t.highlight ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Comisión por OT: <span className="font-bold">{t.com}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            <a href="/precios" className="text-[#2698D1] hover:underline">
              Ver comparativa completa →
            </a>
          </p>
        </div>
      </section>

      {/* ── FLYWHEEL ── */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">El flywheel</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-700">
            {[
              "Más restaurantes",
              "→",
              "Más OTs",
              "→",
              "Mejor score técnicos",
              "→",
              "Más catálogo proveedores",
              "→",
              "Mejor marketplace",
            ].map((item, i) =>
              item === "→" ? (
                <span key={i} className="text-[#2698D1] text-xl font-bold">
                  →
                </span>
              ) : (
                <span
                  key={i}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"
                >
                  {item}
                </span>
              )
            )}
            <span className="mt-2 w-full text-center text-xs text-gray-400">
              → vuelve al inicio ↩
            </span>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ES DIFÍCIL DE REPLICAR ── */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900">Por qué es difícil de replicar</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Compliance regulatorio como barrera de entrada",
                desc: "Bloqueo absoluto si el técnico no tiene certificación vigente. No puede replicarse sin el sistema de validación.",
              },
              {
                title: "Historial de activos genera lock-in",
                desc: "Cada OT suma datos al historial del equipo. El cliente no quiere perder ese registro al cambiar de plataforma.",
              },
              {
                title: "Modelo mandato resuelve la fiscalidad argentina",
                desc: "SHUURI actúa como agente comercial autorizado. Resuelve la complejidad fiscal que hace inviable el modelo reseller.",
              },
              {
                title: "Red de técnicos certificados verificados",
                desc: "Construir y verificar la red técnica lleva tiempo. Es una barrera operacional real para nuevos entrantes.",
              },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <p className="mb-2 font-semibold text-gray-900">{b.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARQUITECTURA TECNOLÓGICA ── */}
      <section className="border-t border-gray-100 bg-[#0D0D0D] px-6 py-20 text-white md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold">Arquitectura tecnológica</h2>
          <p className="mb-12 text-gray-400 leading-relaxed max-w-2xl">
            SHUURI corre sobre un motor OT propio desarrollado por Duotach, integrado con Odoo como
            ERP y las apps de Álamo SRL. Sin dependencias de terceros para la lógica core del negocio.
          </p>

          {/* Stack diagram */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
            {[
              { label: "Motor OT", sub: "Duotach", color: "bg-[#2698D1]" },
              { label: "←→", color: "" },
              { label: "Odoo ERP", sub: "Facturación", color: "bg-gray-700" },
              { label: "←→", color: "" },
              { label: "Apps", sub: "Next.js / Álamo", color: "bg-gray-700" },
            ].map((item, i) =>
              item.label === "←→" ? (
                <span key={i} className="text-gray-500 text-lg">
                  ←→
                </span>
              ) : (
                <div
                  key={i}
                  className={`rounded-lg px-5 py-3 text-center ${item.color}`}
                >
                  <p className="font-semibold text-white">{item.label}</p>
                  {item.sub && (
                    <p className="text-xs text-gray-300 mt-0.5">{item.sub}</p>
                  )}
                </div>
              )
            )}
          </div>

          {/* Stack table */}
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            {[
              { layer: "Motor OT propio", tech: "Duotach", desc: "Motor de órdenes de trabajo — activo intelectual de SHUURI" },
              { layer: "ERP", tech: "Odoo Enterprise", desc: "Facturación, clientes, proveedores, comisiones" },
              { layer: "Apps gastronómico + técnico", tech: "Next.js + TypeScript / Álamo SRL", desc: "Paneles y apps móvil — desarrollo por hitos" },
              { layer: "Infraestructura", tech: "AWS + Vercel", desc: "~USD 200/mes estimado en MVP" },
              { layer: "IA / asignación", tech: "Anthropic Claude API", desc: "Matching técnico-OT, clasificación equipos, soporte automático" },
            ].map((row, i) => (
              <div
                key={row.layer}
                className={`flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:gap-6 ${
                  i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                }`}
              >
                <p className="w-48 text-xs font-semibold uppercase tracking-wider text-gray-400 flex-shrink-0">
                  {row.layer}
                </p>
                <p className="font-semibold text-white">{row.tech}</p>
                <p className="text-sm text-gray-400 md:ml-auto">{row.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-600 text-center">
            Sin Crombie · Sin Fracttal · Motor OT es activo propio de SHUURI desde M1
          </p>
        </div>
      </section>
    </main>
  )
}
