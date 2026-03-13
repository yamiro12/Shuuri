// TODO: Integrar con sistema de email/CRM (Kevin)

import { NextRequest, NextResponse } from 'next/server';

interface DemoRequestBody {
  nombre:   string;
  email:    string;
  telefono: string;
  empresa:  string;
  soy?:     string;
  locales?: string;
  mensaje?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: DemoRequestBody = await req.json();

    const { nombre, email, telefono, empresa } = body;

    // Validación de campos requeridos
    if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !empresa?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email, teléfono y empresa son requeridos.' },
        { status: 400 },
      );
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'El email no tiene un formato válido.' },
        { status: 400 },
      );
    }

    // Log formateado (reemplazar con envío real cuando Kevin integre el CRM)
    console.log('═══════════════════════════════════════');
    console.log('📋 NUEVA SOLICITUD DE DEMO — SHUURI');
    console.log('═══════════════════════════════════════');
    console.log(`  Nombre:   ${nombre}`);
    console.log(`  Email:    ${email}`);
    console.log(`  Teléfono: ${telefono}`);
    console.log(`  Empresa:  ${empresa}`);
    if (body.soy)     console.log(`  Rol:      ${body.soy}`);
    if (body.locales) console.log(`  Locales:  ${body.locales}`);
    if (body.mensaje) console.log(`  Mensaje:  ${body.mensaje}`);
    console.log(`  Fecha:    ${new Date().toISOString()}`);
    console.log('═══════════════════════════════════════');

    return NextResponse.json({ success: true, message: 'Solicitud recibida' });

  } catch (err) {
    console.error('[demo-request] Error procesando solicitud:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 400 },
    );
  }
}
