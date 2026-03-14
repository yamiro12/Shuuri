export interface BlogPost {
  id:             string;
  slug:           string;
  titulo:         string;
  extracto:       string;
  fecha:          string;
  categoria:      string;
  minutosLectura: number;
  imageAlt:       string;
  destacado?:     boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id:             '1',
    slug:           'costo-sin-mantenimiento-preventivo',
    titulo:         '¿Cuánto le cuesta realmente a un restaurante no tener mantenimiento preventivo?',
    extracto:       'Una heladera fuera de servicio en pleno servicio puede costar más que un año de mantenimiento. Analizamos los números reales de la inactividad no planificada.',
    fecha:          '2026-02-18',
    categoria:      'Gestión',
    minutosLectura: 6,
    imageAlt:       'Cocina industrial con equipos de refrigeración',
    destacado:      true,
  },
  {
    id:             '2',
    slug:           'como-elegir-tecnico-refrigeracion',
    titulo:         'Cómo elegir un técnico de refrigeración para tu local gastronómico',
    extracto:       'No todos los técnicos son iguales. Qué preguntar, qué certificaciones exigir y por qué la habilitación de marca hace la diferencia en equipos profesionales.',
    fecha:          '2026-02-05',
    categoria:      'Guías',
    minutosLectura: 4,
    imageAlt:       'Técnico revisando unidad de refrigeración comercial',
  },
  {
    id:             '3',
    slug:           'cinco-fallas-cocinas-industriales',
    titulo:         'Las 5 fallas más comunes en cocinas industriales y cómo prevenirlas',
    extracto:       'Desde resistencias de lavavajillas hasta compresores de cámaras frías: estas son las fallas que más paros generan y los hábitos que las evitan.',
    fecha:          '2026-01-22',
    categoria:      'Mantenimiento',
    minutosLectura: 5,
    imageAlt:       'Horno industrial abierto para mantenimiento',
  },
  {
    id:             '4',
    slug:           'repuesto-cuello-de-botella',
    titulo:         'Por qué el repuesto es el cuello de botella del servicio técnico en gastronomía',
    extracto:       'El técnico llega, diagnostica, y no puede reparar porque el repuesto no está. Este problema sistémico le cuesta millones al sector. Así lo resuelve SHUURI.',
    fecha:          '2026-01-10',
    categoria:      'Industria',
    minutosLectura: 7,
    imageAlt:       'Repuestos de equipamiento gastronómico ordenados en estante',
  },
  {
    id:             '5',
    slug:           'aprendizajes-primeras-entrevistas',
    titulo:         'SHUURI MVP: lo que aprendimos en las primeras 30 entrevistas con gastronómicos',
    extracto:       'Antes de escribir una línea de código, hablamos con 30 dueños y operadores de restaurantes. Esto es lo que nos dijeron — y cómo cambió el producto.',
    fecha:          '2025-12-15',
    categoria:      'SHUURI',
    minutosLectura: 8,
    imageAlt:       'Entrevista con operador de restaurante',
  },
  {
    id:             '6',
    slug:           'guia-mantenimiento-freidoras-industriales',
    titulo:         'Guía de mantenimiento para freidoras industriales: frecuencias y puntos críticos',
    extracto:       'Las freidoras son uno de los equipos que más fallas generan por falta de mantenimiento. Esta guía cubre frecuencias de limpieza, cambio de aceite y revisión de resistencias.',
    fecha:          '2026-03-01',
    categoria:      'Guías',
    minutosLectura: 5,
    imageAlt:       'Freidora industrial en cocina profesional',
  },
  {
    id:             '7',
    slug:           'tecnicos-certificados-marcas-gastronomia',
    titulo:         'Por qué los técnicos certificados por marca son el nuevo estándar en gastronomía',
    extracto:       'Rational, Winterhalter, Fagor, La Marzocco: cada marca tiene protocolos propios. Exploramos por qué la certificación específica importa y cómo el mercado está cambiando.',
    fecha:          '2026-02-24',
    categoria:      'Industria',
    minutosLectura: 6,
    imageAlt:       'Técnico certificado trabajando en horno Rational',
  },
  {
    id:             '8',
    slug:           'checklist-apertura-cocina-industrial',
    titulo:         'Check-list de mantenimiento antes de abrir una cocina industrial nueva',
    extracto:       'Inaugurar sin revisar cada equipo es apostar a que todo funcione. Esta lista de 24 puntos cubre refrigeración, cocción, lavado y ventilación antes del primer servicio.',
    fecha:          '2026-02-12',
    categoria:      'Mantenimiento',
    minutosLectura: 4,
    imageAlt:       'Cocina industrial lista para apertura',
  },
  {
    id:             '9',
    slug:           'modelo-mandato-proveedores-repuestos',
    titulo:         'Modelo mandato: cómo SHUURI conecta proveedores de repuestos con el punto de falla',
    extracto:       'En lugar de depender de un proveedor que quizás no tiene la pieza, SHUURI integra el catálogo en el flujo de la OT. Explicamos cómo funciona y qué gana cada parte.',
    fecha:          '2026-01-30',
    categoria:      'SHUURI',
    minutosLectura: 6,
    imageAlt:       'Diagrama de flujo de OT con proveedor integrado',
  },
  {
    id:             '10',
    slug:           'dark-kitchen-mantenimiento-operativo',
    titulo:         'Dark kitchens y mantenimiento: el desafío de operar sin sala sin descuidar la cocina',
    extracto:       'Las dark kitchens tienen ciclos de uso más intensivos que un restaurante tradicional. Esto cambia los tiempos de mantenimiento. Acá explicamos cómo adaptarlos.',
    fecha:          '2026-01-17',
    categoria:      'Gestión',
    minutosLectura: 5,
    imageAlt:       'Dark kitchen con múltiples marcas en operación',
  },
  {
    id:             '11',
    slug:           'cafe-especialidad-maquinas-mantenimiento',
    titulo:         'Café de especialidad: mantenimiento de máquinas La Marzocco y Nuova Simonelli',
    extracto:       'Una máquina de espresso de alta gama mal mantenida produce café mediocre. Guía de mantenimiento diario, semanal y mensual para cafeterías de especialidad.',
    fecha:          '2026-01-05',
    categoria:      'Guías',
    minutosLectura: 7,
    imageAlt:       'Máquina La Marzocco en café de especialidad',
  },
  {
    id:             '12',
    slug:           'primer-ano-cadena-restaurantes-mantenimiento',
    titulo:         'Qué aprendimos del mantenimiento en el primer año de una cadena de 5 locales',
    extracto:       'Entrevistamos al gerente de operaciones de una cadena porteña que sumó SHUURI en su segundo local. Números reales, errores y lo que cambiarían.',
    fecha:          '2025-12-28',
    categoria:      'Gestión',
    minutosLectura: 9,
    imageAlt:       'Gerente de operaciones revisando panel de mantenimiento',
  },
];

export const CATEGORIAS = ['Todos', ...Array.from(new Set(BLOG_POSTS.map(p => p.categoria)))];
