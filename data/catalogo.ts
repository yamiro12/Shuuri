// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface MarcaCatalogo {
  id: string;
  nombre: string;
  rubros: string[];
  origen: string;
  tipoProveedor: 'fabricante' | 'importador' | 'distribuidor';
}

export interface ModeloCatalogo {
  id: string;
  marcaId: string;
  nombre: string;
  nombreCompleto: string;
  categoria: string;
  rubro: string;
  descripcionBreve?: string;
}

export interface ActivoCatalogo {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  rubro: string;
  rubrosLabel: string;
}

// ─── MARCAS PRECARGADAS ───────────────────────────────────────────────────────

export const MARCAS_CATALOGO: MarcaCatalogo[] = [
  // COCCIÓN
  { id: 'rational',        nombre: 'Rational',                 rubros: ['calor_comercial'],                                          origen: 'Alemania',        tipoProveedor: 'importador'   },
  { id: 'fagor',           nombre: 'Fagor Industrial',         rubros: ['calor_comercial','frio_comercial','lavado_comercial'],        origen: 'España',          tipoProveedor: 'importador'   },
  { id: 'unox',            nombre: 'Unox',                     rubros: ['calor_comercial'],                                          origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'modena',          nombre: 'Modena',                   rubros: ['calor_comercial'],                                          origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'moretti',         nombre: 'Moretti Forni',            rubros: ['calor_comercial'],                                          origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'giorik',          nombre: 'Giorik',                   rubros: ['calor_comercial'],                                          origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'brafh',           nombre: 'BRAFH',                    rubros: ['calor_comercial'],                                          origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'ig',              nombre: 'IG',                       rubros: ['calor_comercial'],                                          origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'solreal',         nombre: 'Sol Real',                 rubros: ['calor_comercial'],                                          origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'lynch',           nombre: 'Lynch',                    rubros: ['calor_comercial'],                                          origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  // REFRIGERACIÓN
  { id: 'frider',          nombre: 'Frider',                   rubros: ['frio_comercial'],                                           origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'frimaq',          nombre: 'Frimaq',                   rubros: ['frio_comercial'],                                           origen: 'Argentina',       tipoProveedor: 'fabricante'   },
  { id: 'klimasan',        nombre: 'Klimasan',                 rubros: ['frio_comercial'],                                           origen: 'Turquía',         tipoProveedor: 'importador'   },
  { id: 'zanussi',         nombre: 'Zanussi Professional',     rubros: ['frio_comercial','calor_comercial','lavado_comercial'],        origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'electrolux_prof', nombre: 'Electrolux Professional', rubros: ['frio_comercial','calor_comercial','lavado_comercial'],        origen: 'Suecia',          tipoProveedor: 'importador'   },
  // LAVADO
  { id: 'winterhalter',    nombre: 'Winterhalter',             rubros: ['lavado_comercial'],                                         origen: 'Alemania',        tipoProveedor: 'importador'   },
  { id: 'hobart',          nombre: 'Hobart',                   rubros: ['lavado_comercial'],                                         origen: 'EEUU',            tipoProveedor: 'importador'   },
  { id: 'meiko',           nombre: 'Meiko',                    rubros: ['lavado_comercial'],                                         origen: 'Alemania',        tipoProveedor: 'importador'   },
  { id: 'classeq',         nombre: 'Classeq',                  rubros: ['lavado_comercial'],                                         origen: 'Reino Unido',     tipoProveedor: 'importador'   },
  // CAFÉ Y BEBIDAS
  { id: 'lamarzocco',      nombre: 'La Marzocco',              rubros: ['cafe_bebidas'],                                             origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'simonelli',       nombre: 'Nuova Simonelli',          rubros: ['cafe_bebidas'],                                             origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'rancilio',        nombre: 'Rancilio',                 rubros: ['cafe_bebidas'],                                             origen: 'Italia',          tipoProveedor: 'importador'   },
  { id: 'jura',            nombre: 'Jura',                     rubros: ['cafe_bebidas'],                                             origen: 'Suiza',           tipoProveedor: 'importador'   },
  { id: 'mahlkonig',       nombre: 'Mahlkönig',                rubros: ['cafe_bebidas'],                                             origen: 'Alemania',        tipoProveedor: 'importador'   },
  // MÁQUINAS DE HIELO
  { id: 'scotsman',        nombre: 'Scotsman',                 rubros: ['frio_comercial'],                                           origen: 'EEUU',            tipoProveedor: 'importador'   },
  { id: 'manitowoc',       nombre: 'Manitowoc',                rubros: ['frio_comercial'],                                           origen: 'EEUU',            tipoProveedor: 'importador'   },
  { id: 'hoshizaki',       nombre: 'Hoshizaki',                rubros: ['frio_comercial'],                                           origen: 'Japón',           tipoProveedor: 'importador'   },
  { id: 'icematic',        nombre: 'Icematic',                 rubros: ['frio_comercial'],                                           origen: 'Italia',          tipoProveedor: 'importador'   },
  // CLIMATIZACIÓN
  { id: 'york',            nombre: 'York',                     rubros: ['climatizacion_hvac'],                                       origen: 'EEUU',            tipoProveedor: 'importador'   },
  { id: 'carrier',         nombre: 'Carrier',                  rubros: ['climatizacion_hvac'],                                       origen: 'EEUU',            tipoProveedor: 'importador'   },
  { id: 'daikin',          nombre: 'Daikin',                   rubros: ['climatizacion_hvac'],                                       origen: 'Japón',           tipoProveedor: 'importador'   },
  { id: 'midea',           nombre: 'Midea',                    rubros: ['climatizacion_hvac'],                                       origen: 'China',           tipoProveedor: 'importador'   },
  // TECNOLOGÍA / POS
  { id: 'epson',           nombre: 'Epson',                    rubros: ['pos_it'],                                                   origen: 'Japón',           tipoProveedor: 'importador'   },
  { id: 'bixolon',         nombre: 'Bixolon',                  rubros: ['pos_it'],                                                   origen: 'Corea',           tipoProveedor: 'importador'   },
  { id: 'ingenico',        nombre: 'Ingenico',                 rubros: ['pos_it'],                                                   origen: 'Francia',         tipoProveedor: 'importador'   },
  { id: 'kron',            nombre: 'Kron Electronics',         rubros: ['pos_it'],                                                   origen: 'Argentina',       tipoProveedor: 'fabricante'   },
];

// ─── MODELOS PRECARGADOS ──────────────────────────────────────────────────────

export const MODELOS_CATALOGO: ModeloCatalogo[] = [
  // Rational
  { id: 'rational-scc61',   marcaId: 'rational',     nombre: 'SCC 61',          nombreCompleto: 'Rational SCC 61 (6 GN 1/1)',        categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  { id: 'rational-scc101',  marcaId: 'rational',     nombre: 'SCC 101',         nombreCompleto: 'Rational SCC 101 (10 GN 1/1)',       categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  { id: 'rational-icp61',   marcaId: 'rational',     nombre: 'iCombi Pro 6-1/1',nombreCompleto: 'Rational iCombi Pro 6-1/1',          categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  { id: 'rational-icp101',  marcaId: 'rational',     nombre: 'iCombi Pro 10-1/1',nombreCompleto: 'Rational iCombi Pro 10-1/1',        categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  { id: 'rational-ics61',   marcaId: 'rational',     nombre: 'iCombi Classic 6', nombreCompleto: 'Rational iCombi Classic 6 GN 1/1', categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  // Unox
  { id: 'unox-xevc',        marcaId: 'unox',         nombre: 'XEVC-0621',       nombreCompleto: 'Unox XEVC-0621 ChefTop (6 GN 1/1)', categoria: 'Horno combinado',       rubro: 'calor_comercial'  },
  { id: 'unox-xeb',         marcaId: 'unox',         nombre: 'XEB 1005',        nombreCompleto: 'Unox XEB 1005 BakerTop 10 GN',       categoria: 'Horno panadero',        rubro: 'calor_comercial'  },
  // Winterhalter
  { id: 'wh-ptl',           marcaId: 'winterhalter', nombre: 'PT-L',            nombreCompleto: 'Winterhalter PT-L',                  categoria: 'Lavavajillas capota',   rubro: 'lavado_comercial' },
  { id: 'wh-ptm',           marcaId: 'winterhalter', nombre: 'PT-M',            nombreCompleto: 'Winterhalter PT-M',                  categoria: 'Lavavajillas capota',   rubro: 'lavado_comercial' },
  { id: 'wh-uc-l',          marcaId: 'winterhalter', nombre: 'UC-L',            nombreCompleto: 'Winterhalter UC-L',                  categoria: 'Lavavajillas bajo mesada', rubro: 'lavado_comercial' },
  { id: 'wh-gs302',         marcaId: 'winterhalter', nombre: 'GS 302',          nombreCompleto: 'Winterhalter GS 302',                categoria: 'Lavavajillas sin barrera', rubro: 'lavado_comercial' },
  { id: 'wh-uc-s',          marcaId: 'winterhalter', nombre: 'UC-S',            nombreCompleto: 'Winterhalter UC-S',                  categoria: 'Lavavajillas bajo mesada', rubro: 'lavado_comercial' },
  // Hobart
  { id: 'hobart-lxe',       marcaId: 'hobart',       nombre: 'LXe',             nombreCompleto: 'Hobart LXe',                        categoria: 'Lavavajillas capota',   rubro: 'lavado_comercial' },
  { id: 'hobart-cx10',      marcaId: 'hobart',       nombre: 'CX10',            nombreCompleto: 'Hobart CX10',                       categoria: 'Lavavajillas bajo mesada', rubro: 'lavado_comercial' },
  // Fagor
  { id: 'fagor-cg9-41',     marcaId: 'fagor',        nombre: 'CG9-41',          nombreCompleto: 'Fagor CG9-41 (4 quemadores)',       categoria: 'Cocina industrial',     rubro: 'calor_comercial'  },
  { id: 'fagor-hm-6',       marcaId: 'fagor',        nombre: 'HM-6',            nombreCompleto: 'Fagor HM-6 (6 quemadores)',         categoria: 'Cocina industrial',     rubro: 'calor_comercial'  },
  { id: 'fagor-co-202',     marcaId: 'fagor',        nombre: 'CO-202',          nombreCompleto: 'Fagor CO-202 (2 bandejas)',         categoria: 'Horno convector',       rubro: 'calor_comercial'  },
  // Modena
  { id: 'modena-fe91',      marcaId: 'modena',       nombre: 'FE 91',           nombreCompleto: 'Modena FE 91 Freidora 9L',         categoria: 'Freidora',              rubro: 'calor_comercial'  },
  { id: 'modena-px4',       marcaId: 'modena',       nombre: 'PX-4',            nombreCompleto: 'Modena PX-4 Plancha',              categoria: 'Plancha',               rubro: 'calor_comercial'  },
  // La Marzocco
  { id: 'lm-gs3',           marcaId: 'lamarzocco',   nombre: 'GS3 AV',          nombreCompleto: 'La Marzocco GS3 AV (2 grupos)',     categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  { id: 'lm-linea',         marcaId: 'lamarzocco',   nombre: 'Linea PB',        nombreCompleto: 'La Marzocco Linea PB (2 grupos)',   categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  { id: 'lm-strada',        marcaId: 'lamarzocco',   nombre: 'Strada',          nombreCompleto: 'La Marzocco Strada (2 grupos)',     categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  { id: 'lm-kb90',          marcaId: 'lamarzocco',   nombre: 'KB90',            nombreCompleto: 'La Marzocco KB90 (3 grupos)',       categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  // Nuova Simonelli
  { id: 'sim-aurelia',      marcaId: 'simonelli',    nombre: 'Aurelia Wave',    nombreCompleto: 'Nuova Simonelli Aurelia Wave (2G)', categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  { id: 'sim-appia',        marcaId: 'simonelli',    nombre: 'Appia Life',      nombreCompleto: 'Nuova Simonelli Appia Life (2G)',   categoria: 'Cafetera profesional',  rubro: 'cafe_bebidas'     },
  // Scotsman
  { id: 'scotsman-nc180',   marcaId: 'scotsman',     nombre: 'NC 180',          nombreCompleto: 'Scotsman NC 180 AS',               categoria: 'Máquina de hielo cubitos', rubro: 'frio_comercial' },
  { id: 'scotsman-mxg438',  marcaId: 'scotsman',     nombre: 'MXG 438',         nombreCompleto: 'Scotsman MXG 438 AS',              categoria: 'Máquina de hielo cubitos', rubro: 'frio_comercial' },
  // Hoshizaki
  { id: 'hosh-im-45',       marcaId: 'hoshizaki',    nombre: 'IM-45 NE',        nombreCompleto: 'Hoshizaki IM-45 NE',               categoria: 'Máquina de hielo cubitos', rubro: 'frio_comercial' },
  { id: 'hosh-im-130',      marcaId: 'hoshizaki',    nombre: 'IM-130 NE',       nombreCompleto: 'Hoshizaki IM-130 NE',              categoria: 'Máquina de hielo cubitos', rubro: 'frio_comercial' },
  // Frider
  { id: 'frider-gs600',     marcaId: 'frider',       nombre: 'GS-600',          nombreCompleto: 'Frider GS-600 Vertical 600L',       categoria: 'Heladera vertical',    rubro: 'frio_comercial'   },
  { id: 'frider-cf1200',    marcaId: 'frider',       nombre: 'CF-1200',         nombreCompleto: 'Frider CF-1200 Conservador',        categoria: 'Freezer vertical',     rubro: 'frio_comercial'   },
  { id: 'frider-bm2p',      marcaId: 'frider',       nombre: 'BM-2P',           nombreCompleto: 'Frider BM-2P Bajo Mesada 2 puertas', categoria: 'Heladera bajo mesada', rubro: 'frio_comercial' },
  // Frimaq
  { id: 'frimaq-cam6',      marcaId: 'frimaq',       nombre: 'CAM-6',           nombreCompleto: 'Frimaq CAM-6 Cámara Frigorífica 6m³', categoria: 'Cámara frigorífica', rubro: 'frio_comercial'  },
  // York
  { id: 'york-ys',          marcaId: 'york',         nombre: 'YS 12000',        nombreCompleto: 'York YS 12000 BTU Split',           categoria: 'Aire acondicionado',   rubro: 'climatizacion_hvac' },
  // Epson
  { id: 'epson-tmt20',      marcaId: 'epson',        nombre: 'TM-T20III',       nombreCompleto: 'Epson TM-T20III Impresora tickets',  categoria: 'Impresora tickets',    rubro: 'pos_it'           },
  { id: 'epson-tmt88',      marcaId: 'epson',        nombre: 'TM-T88VI',        nombreCompleto: 'Epson TM-T88VI Impresora tickets',   categoria: 'Impresora tickets',    rubro: 'pos_it'           },
];

// ─── ACTIVOS (tipos genéricos de equipos) ─────────────────────────────────────

export const ACTIVOS_CATALOGO: ActivoCatalogo[] = [
  // Cocción
  { id: 'horno-combinado',         nombre: 'Horno combinado',                   categoria: 'Horno',             subcategoria: 'Combinado',         rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'horno-convector',         nombre: 'Horno convector',                   categoria: 'Horno',             subcategoria: 'Convector',         rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'horno-pizzero',           nombre: 'Horno pizzero',                     categoria: 'Horno',             subcategoria: 'Pizzero',           rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'horno-panadero',          nombre: 'Horno panadero',                    categoria: 'Horno',             subcategoria: 'Panadero',          rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'cocina-industrial',       nombre: 'Cocina industrial',                 categoria: 'Cocina',            subcategoria: 'Industrial gas',    rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'freidora-gas',            nombre: 'Freidora a gas',                    categoria: 'Freidora',          subcategoria: 'Gas',               rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'freidora-electrica',      nombre: 'Freidora eléctrica',                categoria: 'Freidora',          subcategoria: 'Eléctrica',         rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'plancha-industrial',      nombre: 'Plancha / Griddle',                 categoria: 'Plancha',           subcategoria: 'Industrial',        rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'salamandra',              nombre: 'Salamandra',                        categoria: 'Salamandra',        subcategoria: 'Gas',               rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  { id: 'marmita',                 nombre: 'Marmita basculante',                categoria: 'Marmita',           subcategoria: 'Gas',               rubro: 'calor_comercial',    rubrosLabel: 'Cocción'         },
  // Refrigeración
  { id: 'heladera-vertical',       nombre: 'Heladera vertical',                 categoria: 'Heladera',          subcategoria: 'Vertical',          rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'heladera-bajo-mesada',    nombre: 'Heladera bajo mesada',              categoria: 'Heladera',          subcategoria: 'Bajo mesada',       rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'heladera-exhibidora',     nombre: 'Heladera exhibidora',               categoria: 'Heladera',          subcategoria: 'Exhibidora',        rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'freezer-vertical',        nombre: 'Freezer vertical',                  categoria: 'Freezer',           subcategoria: 'Vertical',          rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'freezer-horizontal',      nombre: 'Freezer horizontal',                categoria: 'Freezer',           subcategoria: 'Horizontal',        rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'camara-frigorifica',      nombre: 'Cámara frigorífica',                categoria: 'Cámara',            subcategoria: 'Frigorífica',       rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'vitrina-refrigerada',     nombre: 'Vitrina refrigerada',               categoria: 'Vitrina',           subcategoria: 'Refrigerada',       rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  { id: 'mesa-fria',               nombre: 'Mesa fría de trabajo',              categoria: 'Mesa fría',         subcategoria: 'Trabajo',           rubro: 'frio_comercial',     rubrosLabel: 'Refrigeración'   },
  // Lavado
  { id: 'lavavajillas-capota',     nombre: 'Lavavajillas capota',               categoria: 'Lavavajillas',      subcategoria: 'Capota',            rubro: 'lavado_comercial',   rubrosLabel: 'Lavado'          },
  { id: 'lavavajillas-bajo-mesada',nombre: 'Lavavajillas bajo mesada',          categoria: 'Lavavajillas',      subcategoria: 'Bajo mesada',       rubro: 'lavado_comercial',   rubrosLabel: 'Lavado'          },
  { id: 'lavavajillas-utensilios', nombre: 'Lavavajillas utensilios',           categoria: 'Lavavajillas',      subcategoria: 'Utensilios',        rubro: 'lavado_comercial',   rubrosLabel: 'Lavado'          },
  { id: 'lavavajillas-sin-barrera',nombre: 'Lavavajillas sin barrera / conveyor',categoria: 'Lavavajillas',     subcategoria: 'Sin barrera',       rubro: 'lavado_comercial',   rubrosLabel: 'Lavado'          },
  { id: 'lavamanos-pedal',         nombre: 'Lavamanos a pedal',                 categoria: 'Lavamanos',         subcategoria: 'Pedal',             rubro: 'lavado_comercial',   rubrosLabel: 'Lavado'          },
  // Café y bebidas
  { id: 'cafetera-profesional',    nombre: 'Cafetera profesional',              categoria: 'Cafetera',          subcategoria: 'Profesional',       rubro: 'cafe_bebidas',       rubrosLabel: 'Café y Bebidas'  },
  { id: 'molinillo-profesional',   nombre: 'Molinillo profesional',             categoria: 'Molinillo',         subcategoria: 'Profesional',       rubro: 'cafe_bebidas',       rubrosLabel: 'Café y Bebidas'  },
  { id: 'chopera',                 nombre: 'Chopera / tirador de cerveza',      categoria: 'Chopera',           subcategoria: 'Barril',            rubro: 'cafe_bebidas',       rubrosLabel: 'Café y Bebidas'  },
  { id: 'maquina-granizados',      nombre: 'Máquina de granizados',             categoria: 'Granizados',        subcategoria: 'Granizados',        rubro: 'cafe_bebidas',       rubrosLabel: 'Café y Bebidas'  },
  // Máquinas de hielo
  { id: 'maquina-hielo-cubitos',   nombre: 'Máquina de hielo cubitos',          categoria: 'Máquina de hielo',  subcategoria: 'Cubitos',           rubro: 'frio_comercial',     rubrosLabel: 'Máquinas de hielo' },
  { id: 'maquina-hielo-escamas',   nombre: 'Máquina de hielo escamas',          categoria: 'Máquina de hielo',  subcategoria: 'Escamas',           rubro: 'frio_comercial',     rubrosLabel: 'Máquinas de hielo' },
  // Climatización
  { id: 'split-frio-calor',        nombre: 'Aire acondicionado split',          categoria: 'Aire acondicionado', subcategoria: 'Split frío/calor',  rubro: 'climatizacion_hvac', rubrosLabel: 'Climatización'   },
  { id: 'campana-extractora',      nombre: 'Campana extractora',                categoria: 'Campana',           subcategoria: 'Extractora',        rubro: 'climatizacion_hvac', rubrosLabel: 'Climatización'   },
  { id: 'ventilacion-industrial',  nombre: 'Ventilación industrial',            categoria: 'Ventilación',       subcategoria: 'Industrial',        rubro: 'climatizacion_hvac', rubrosLabel: 'Climatización'   },
  // Tecnología
  { id: 'terminal-pos',            nombre: 'Terminal POS',                      categoria: 'POS',               subcategoria: 'Terminal',          rubro: 'pos_it',             rubrosLabel: 'Tecnología'      },
  { id: 'impresora-tickets',       nombre: 'Impresora de tickets',              categoria: 'Impresora',         subcategoria: 'Tickets',           rubro: 'pos_it',             rubrosLabel: 'Tecnología'      },
  { id: 'kds-comandera',           nombre: 'KDS / Comandera',                   categoria: 'KDS',               subcategoria: 'Display cocina',    rubro: 'pos_it',             rubrosLabel: 'Tecnología'      },
  { id: 'router-industrial',       nombre: 'Router / Switch industrial',        categoria: 'Red',               subcategoria: 'Router',            rubro: 'pos_it',             rubrosLabel: 'Tecnología'      },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getModelosByMarca(marcaId: string): ModeloCatalogo[] {
  return MODELOS_CATALOGO.filter(m => m.marcaId === marcaId);
}

export function getMarcasByRubro(rubro: string): MarcaCatalogo[] {
  return MARCAS_CATALOGO.filter(m => m.rubros.includes(rubro));
}

export function getActivosByRubro(rubro: string): ActivoCatalogo[] {
  return ACTIVOS_CATALOGO.filter(a => a.rubro === rubro);
}

export function buscarMarcas(texto: string, rubro?: string): MarcaCatalogo[] {
  const t = texto.toLowerCase().trim();
  if (!t) return rubro ? getMarcasByRubro(rubro).slice(0, 8) : [];
  const base = rubro ? getMarcasByRubro(rubro) : MARCAS_CATALOGO;
  return base.filter(m => m.nombre.toLowerCase().includes(t)).slice(0, 8);
}

export function buscarModelos(texto: string, marcaId?: string): ModeloCatalogo[] {
  const t = texto.toLowerCase().trim();
  const base = marcaId ? MODELOS_CATALOGO.filter(m => m.marcaId === marcaId) : MODELOS_CATALOGO;
  if (!t) return base.slice(0, 8);
  return base.filter(m =>
    m.nombreCompleto.toLowerCase().includes(t) || m.nombre.toLowerCase().includes(t)
  ).slice(0, 8);
}
