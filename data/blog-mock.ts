export interface BlogPost {
  id:             string;
  slug:           string;
  titulo:         string;
  extracto:       string;
  fecha:          string;
  categoria:      string;
  minutosLectura: number;
  imageAlt:       string;
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
];

export const CATEGORIAS = ['Todos', ...Array.from(new Set(BLOG_POSTS.map(p => p.categoria)))];
