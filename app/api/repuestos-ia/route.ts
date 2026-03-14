import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { rubro, marca, descripcion, catalogo } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json([]);

  const prompt = `Sos un experto en mantenimiento de equipamiento gastronómico industrial.
Analizá esta situación y sugerí los repuestos más probables.

EQUIPO: ${marca} - rubro ${rubro}
FALLA DESCRITA: ${descripcion}

CATÁLOGO DISPONIBLE (JSON):
${JSON.stringify(catalogo)}

TAREA: Del catálogo, identificá hasta 2 repuestos que probablemente sean necesarios para esta falla.
Considerá que puede ser ambiguo — si hay dos posibilidades distintas, incluí ambas.

Respondé ÚNICAMENTE con JSON válido, sin texto adicional:
[{"id": "id_del_producto", "razon": "explicación breve de 1 oración de por qué este repuesto"}]
Si no encontrás ninguno relevante, respondé: []`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const text: string = data.content?.[0]?.text ?? '[]';
    const parsed = JSON.parse(text);
    return NextResponse.json(Array.isArray(parsed) ? parsed : []);
  } catch {
    return NextResponse.json([]);
  }
}
