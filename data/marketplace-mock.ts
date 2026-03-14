export type Categoria    = 'Repuestos' | 'Equipos nuevos' | 'Equipos usados' | 'Insumos' | 'Consumibles';
export type Disponibilidad = 'en_stock' | 'bajo_pedido';

export interface MarketplaceProduct {
  id:                string;
  slug:              string;
  nombre:            string;
  descripcion:       string;
  precio_ars:        number;
  marca:             string;
  categoria:         Categoria;
  rubro:             string;
  disponibilidad:    Disponibilidad;
  tiempo_entrega_hs: number;
  proveedor_nombre:  string;
  compatibilidad?:   string[];
}

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // ── Cocción ──────────────────────────────────────────────────────────────
  {
    id: 'mp-001', slug: 'resistencia-electrica-horno-fagor',
    nombre: 'Resistencia eléctrica para horno Fagor', descripcion: 'Resistencia de repuesto para hornos industriales Fagor. Compatible con serie EVO y HM. Instalación directa, sin modificaciones.',
    precio_ars: 12500, marca: 'Fagor', categoria: 'Repuestos', rubro: 'coccion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'RepuestosPro S.A.',
    compatibilidad: ['Fagor EVO', 'Fagor HM', 'Fagor COK'],
  },
  {
    id: 'mp-002', slug: 'quemador-gas-modena-7kw',
    nombre: 'Quemador a gas Modena 7.5 kW', descripcion: 'Quemador industrial de alto rendimiento para cocinas profesionales. Llama estable y regulable. Conexión roscada 3/4".',
    precio_ars: 8900, marca: 'Modena', categoria: 'Repuestos', rubro: 'coccion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'Gastro Insumos',
    compatibilidad: ['Modena Pro', 'Modena Industrial'],
  },
  {
    id: 'mp-003', slug: 'termopar-horno-rational',
    nombre: 'Termopar para horno Rational SCC', descripcion: 'Sonda de temperatura original para hornos Rational SCC61 y SCC101. Tipo K, largo 300mm. Garantía de marca.',
    precio_ars: 3200, marca: 'Rational', categoria: 'Repuestos', rubro: 'coccion',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 72, proveedor_nombre: 'TechParts Argentina',
    compatibilidad: ['Rational SCC61', 'Rational SCC101', 'Rational CM61'],
  },
  // ── Refrigeración ────────────────────────────────────────────────────────
  {
    id: 'mp-004', slug: 'compresor-embraco-1hp-camara',
    nombre: 'Compresor Embraco 1HP para cámara frigorífica', descripcion: 'Compresor hermético Embraco para cámaras de frío comerciales. Alta eficiencia energética, gas R404A. Voltaje 220V.',
    precio_ars: 89000, marca: 'Embraco', categoria: 'Repuestos', rubro: 'refrigeracion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Fagor ER', 'Coreco', 'Infrico'],
  },
  {
    id: 'mp-005', slug: 'termostato-electronico-dixell',
    nombre: 'Termostato electrónico Dixell X20S', descripcion: 'Controlador de temperatura digital para equipos de frío comercial. Display LED, rango -50 a +150°C. Con sonda incluida.',
    precio_ars: 15600, marca: 'Dixell', categoria: 'Repuestos', rubro: 'refrigeracion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Universal'],
  },
  {
    id: 'mp-006', slug: 'filtro-deshidratador-soldable',
    nombre: 'Filtro deshidratador 1/2" soldable', descripcion: 'Filtro deshidratador para sistemas de refrigeración R404A/R134a. Elimina humedad y partículas del circuito frigorífico.',
    precio_ars: 2800, marca: 'Danfoss', categoria: 'Consumibles', rubro: 'refrigeracion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Universal'],
  },
  // ── Lavado ───────────────────────────────────────────────────────────────
  {
    id: 'mp-007', slug: 'resistencia-winterhalter-6kw',
    nombre: 'Resistencia calentamiento Winterhalter 6 kW', descripcion: 'Resistencia de calentamiento para lavavajillas industriales Winterhalter GT. Voltaje 380V trifásico. Original de fábrica.',
    precio_ars: 38500, marca: 'Winterhalter', categoria: 'Repuestos', rubro: 'lavado',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'RepuestosPro S.A.',
    compatibilidad: ['Winterhalter GT', 'Winterhalter GS'],
  },
  {
    id: 'mp-008', slug: 'bomba-lavado-electrolux',
    nombre: 'Bomba de lavado lavavajillas Electrolux', descripcion: 'Bomba de circulación para lavavajillas profesionales Electrolux serie Green & Clean. Motor 550W, 220V.',
    precio_ars: 24200, marca: 'Electrolux', categoria: 'Repuestos', rubro: 'lavado',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 72, proveedor_nombre: 'TechParts Argentina',
    compatibilidad: ['Electrolux GC', 'Electrolux WT'],
  },
  {
    id: 'mp-009', slug: 'dosificador-detergente-automatico',
    nombre: 'Dosificador de detergente automático', descripcion: 'Sistema dosificador peristáltico para lavavajillas industriales. Dosificación precisa de detergente y abrillantador.',
    precio_ars: 9800, marca: 'Winterhalter', categoria: 'Insumos', rubro: 'lavado',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'Gastro Insumos',
    compatibilidad: ['Universal'],
  },
  // ── Cafetería ────────────────────────────────────────────────────────────
  {
    id: 'mp-010', slug: 'valvula-solenoide-cafetera',
    nombre: 'Válvula solenoide 2 vías para cafetera', descripcion: 'Válvula solenoide de 2 vías para cafeteras profesionales. 220V/50Hz, presión máx. 15 bar. Conexión 1/8" macho.',
    precio_ars: 18400, marca: 'La Marzocco', categoria: 'Repuestos', rubro: 'cafeteria',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 72, proveedor_nombre: 'TechParts Argentina',
    compatibilidad: ['La Marzocco GB5', 'Synesso', 'Victoria Arduino'],
  },
  {
    id: 'mp-011', slug: 'junta-portafiltro-58mm',
    nombre: 'Junta de portafiltro cafetera 58mm', descripcion: 'Junta de silicona para grupo de cafetera profesional 58mm. Compatible con la mayoría de cafeteras de E61. Pack x5.',
    precio_ars: 1200, marca: 'Genérico', categoria: 'Consumibles', rubro: 'cafeteria',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'Gastro Insumos',
    compatibilidad: ['Universal 58mm'],
  },
  {
    id: 'mp-012', slug: 'grupo-cafetera-e61',
    nombre: 'Grupo E61 para cafetera profesional', descripcion: 'Grupo E61 completo para cafeteras de especialidad. Acero inoxidable 316L. Incluye duchas y juntas. Alto tráfico.',
    precio_ars: 125000, marca: 'Simonelli', categoria: 'Repuestos', rubro: 'cafeteria',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 96, proveedor_nombre: 'TechParts Argentina',
    compatibilidad: ['Nuova Simonelli Aurelia', 'Synesso MVP', 'Victoria Arduino Eagle'],
  },
  // ── Máq. hielo ───────────────────────────────────────────────────────────
  {
    id: 'mp-013', slug: 'ventilador-evaporador-hoshizaki',
    nombre: 'Ventilador evaporador Hoshizaki', descripcion: 'Motor ventilador para máquina de hielo Hoshizaki KM-50. 18W, 220V. Repuesto original de fábrica con garantía.',
    precio_ars: 22800, marca: 'Hoshizaki', categoria: 'Repuestos', rubro: 'maq_hielo',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 72, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Hoshizaki KM-50', 'Hoshizaki KM-100'],
  },
  {
    id: 'mp-014', slug: 'sonda-ntc-camara-hielo',
    nombre: 'Sonda NTC temperatura cámara de hielo', descripcion: 'Sensor de temperatura NTC 10K para cámaras de producción de hielo. Rango -40 a +80°C. Conector estándar.',
    precio_ars: 4500, marca: 'Scotsman', categoria: 'Repuestos', rubro: 'maq_hielo',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Scotsman F80', 'Manitowoc Q130', 'Universal NTC'],
  },
  {
    id: 'mp-015', slug: 'sensor-nivel-agua-maquina-hielo',
    nombre: 'Sensor de nivel de agua máquina de hielo', descripcion: 'Sensor de nivel para control de agua en máquinas de hielo comerciales. Flotador magnético con contacto reed.',
    precio_ars: 6700, marca: 'Manitowoc', categoria: 'Repuestos', rubro: 'maq_hielo',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'FrigoTécnica',
    compatibilidad: ['Manitowoc Q80', 'Manitowoc Q130', 'Scotsman F80'],
  },
  // ── Climatización ────────────────────────────────────────────────────────
  {
    id: 'mp-016', slug: 'motor-ventilador-fan-coil',
    nombre: 'Motor ventilador fan coil 150W', descripcion: 'Motor eléctrico de repuesto para unidades fan coil industriales. 150W, 220V, 1400 RPM. Eje 10mm.',
    precio_ars: 31200, marca: 'York', categoria: 'Repuestos', rubro: 'climatizacion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'ClimaTotal',
    compatibilidad: ['Universal fan coil 150W'],
  },
  {
    id: 'mp-017', slug: 'filtro-aire-acondicionado-g4',
    nombre: 'Filtro de aire acondicionado G4', descripcion: 'Filtro de polvo G4 para unidades de climatización comercial. 50x50cm. Pack x5 unidades. Cambio recomendado cada 3 meses.',
    precio_ars: 890, marca: 'Genérico', categoria: 'Consumibles', rubro: 'climatizacion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'ClimaTotal',
    compatibilidad: ['Universal G4'],
  },
  {
    id: 'mp-018', slug: 'capacitor-arranque-compresor',
    nombre: 'Capacitor de arranque compresor 50uF', descripcion: 'Capacitor electrolítico de arranque para compresores de A/C. 50uF ±10%, 450VAC. CBB65 encapsulado.',
    precio_ars: 2100, marca: 'Genérico', categoria: 'Repuestos', rubro: 'climatizacion',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 24, proveedor_nombre: 'ClimaTotal',
    compatibilidad: ['Universal 50uF'],
  },
  // ── Tecnología ───────────────────────────────────────────────────────────
  {
    id: 'mp-019', slug: 'terminal-pos-epson-tm-t20',
    nombre: 'Terminal POS Epson TM-T20', descripcion: 'Impresora fiscal térmica Epson TM-T20 para puntos de venta gastronómicos. USB + Serial. 200mm/s. Autocortador.',
    precio_ars: 87500, marca: 'Epson', categoria: 'Equipos nuevos', rubro: 'tecnologia',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'TecnoGastro',
    compatibilidad: ['Universal USB'],
  },
  {
    id: 'mp-020', slug: 'router-industrial-tp-link',
    nombre: 'Router industrial TP-Link TL-ER605', descripcion: 'Router industrial para locales gastronómicos. Gigabit, VPN, control de ancho de banda. Ideal para entornos con alta temperatura.',
    precio_ars: 45600, marca: 'TP-Link', categoria: 'Equipos nuevos', rubro: 'tecnologia',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'TecnoGastro',
    compatibilidad: ['Universal'],
  },
  {
    id: 'mp-021', slug: 'scanner-codigo-barras-zebra',
    nombre: 'Scanner código de barras Zebra DS2208', descripcion: 'Lector de código de barras 1D/2D para comandas y gestión de inventario. USB HID, 100 scans/seg. Cable 2.1m incluido.',
    precio_ars: 62000, marca: 'Zebra', categoria: 'Equipos nuevos', rubro: 'tecnologia',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'TecnoGastro',
    compatibilidad: ['Universal USB'],
  },
  // ── Especializados ───────────────────────────────────────────────────────
  {
    id: 'mp-022', slug: 'balanza-certificada-ohaus',
    nombre: 'Balanza certificada OHAUS Defender 3000', descripcion: 'Balanza industrial certificada INTI. Capacidad 60kg, precisión 10g. Acero inoxidable IP69K. Para uso en cocinas profesionales.',
    precio_ars: 198000, marca: 'OHAUS', categoria: 'Equipos nuevos', rubro: 'especializados',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 96, proveedor_nombre: 'EquipGastro',
    compatibilidad: ['Universal'],
  },
  {
    id: 'mp-023', slug: 'selladora-vacio-multivac',
    nombre: 'Selladora al vacío Multivac C12', descripcion: 'Envasadora al vacío de cámara para producción media. Ciclo 30 seg, 99% vacío, sellado doble. Acero inox 304. Cocinas y dark kitchens.',
    precio_ars: 245000, marca: 'Multivac', categoria: 'Equipos nuevos', rubro: 'especializados',
    disponibilidad: 'bajo_pedido', tiempo_entrega_hs: 96, proveedor_nombre: 'EquipGastro',
    compatibilidad: ['Universal'],
  },
  {
    id: 'mp-024', slug: 'picadora-carne-berkel',
    nombre: 'Picadora de carne industrial Berkel 12', descripcion: 'Picadora de carne profesional Berkel modelo 12. Motor 550W, picado fino y grueso. Acero inox, fácil limpieza. 30kg/h.',
    precio_ars: 312000, marca: 'Berkel', categoria: 'Equipos nuevos', rubro: 'especializados',
    disponibilidad: 'en_stock', tiempo_entrega_hs: 48, proveedor_nombre: 'EquipGastro',
    compatibilidad: ['Universal'],
  },
];

export const MP_CATEGORIAS    = ['Repuestos', 'Equipos nuevos', 'Equipos usados', 'Insumos', 'Consumibles'] as const;
export const MP_RUBROS        = ['coccion', 'refrigeracion', 'lavado', 'cafeteria', 'maq_hielo', 'climatizacion', 'tecnologia', 'especializados'] as const;
export const MP_RUBRO_LABELS: Record<string, string> = {
  coccion: 'Cocción', refrigeracion: 'Refrigeración', lavado: 'Lavado',
  cafeteria: 'Cafetería', maq_hielo: 'Máq. de hielo', climatizacion: 'Climatización',
  tecnologia: 'Tecnología', especializados: 'Especializados',
};
export const MP_MARCAS = [...new Set(MARKETPLACE_PRODUCTS.map(p => p.marca))].sort();
