import { MARKETPLACE_PRODUCTS, type MarketplaceProduct } from '@/data/marketplace-mock';

export type RepuestoSugerido = MarketplaceProduct & { _razonIA?: string };

const PALABRAS_AMBIGUAS = [
  'ruido', 'no enciende', 'no enfría', 'no calienta', 'gotea',
  'no arranca', 'se apaga', 'error', 'falla intermitente', 'vibra',
  'hace ruido', 'no funciona', 'se traba', 'lento', 'raro', 'extraño',
  'pierde', 'chispas', 'olor', 'humo', 'caliente', 'no baja', 'no sube',
];

export function necesitaIA(descripcion: string, resultadosDB: number): boolean {
  if (resultadosDB < 3) return true;
  const desc = descripcion.toLowerCase();
  return PALABRAS_AMBIGUAS.some(p => desc.includes(p));
}

export function getRepuestosDB(rubro: string, marca: string): MarketplaceProduct[] {
  const marcaNorm = marca.toLowerCase().trim();
  return MARKETPLACE_PRODUCTS.filter(p => {
    if (p.categoria !== 'Repuestos') return false;
    const matchRubro = p.rubro === rubro;
    const matchMarca =
      p.marca.toLowerCase().includes(marcaNorm) ||
      (marcaNorm.length > 2 && marcaNorm.includes(p.marca.toLowerCase())) ||
      (p.compatibilidad?.some(c => c.toLowerCase().includes(marcaNorm)) ?? false);
    return matchRubro || matchMarca;
  }).slice(0, 6);
}

export async function getRepuestosIA(
  rubro: string,
  marca: string,
  descripcion: string,
  repuestosExistentes: MarketplaceProduct[],
): Promise<RepuestoSugerido[]> {
  const catalogo = MARKETPLACE_PRODUCTS
    .filter(p => p.categoria === 'Repuestos')
    .map(p => ({ id: p.id, nombre: p.nombre, rubro: p.rubro, marcas: p.compatibilidad }));

  try {
    const res = await fetch('/api/repuestos-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rubro, marca, descripcion, catalogo }),
    });
    if (!res.ok) return [];
    const sugerencias: { id: string; razon: string }[] = await res.json();
    const idsExistentes = repuestosExistentes.map(p => p.id);
    const resultados: RepuestoSugerido[] = [];
    for (const s of sugerencias) {
      if (idsExistentes.includes(s.id)) continue;
      const producto = MARKETPLACE_PRODUCTS.find(p => p.id === s.id);
      if (producto) resultados.push({ ...producto, _razonIA: s.razon });
    }
    return resultados;
  } catch {
    return [];
  }
}

export async function getSugerenciasRepuesto(
  rubro: string,
  marca: string,
  descripcion: string,
): Promise<{ db: MarketplaceProduct[]; ia: RepuestoSugerido[]; usandoIA: boolean }> {
  const resultadosDB = getRepuestosDB(rubro, marca);
  const usaIA = necesitaIA(descripcion, resultadosDB.length);
  const resultadosIA = usaIA
    ? await getRepuestosIA(rubro, marca, descripcion, resultadosDB)
    : [];
  return { db: resultadosDB, ia: resultadosIA, usandoIA: usaIA };
}
