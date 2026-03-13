/**
 * SHUURI - Definiciones de Tipos Globales
 * Plataforma B2B2B de coordinación técnica gastronómica
 * v2.1 — Marzo 2026
 */

export type UserRole = 'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR' | 'SHUURI_ADMIN';

// ─── TIPOS BASE NUEVOS ────────────────────────────────────────────────────────
export type ZonaLocal =
  | 'cocina_caliente'
  | 'cocina_fria'
  | 'lavado'
  | 'barra_salon'
  | 'deposito'
  | 'climatizacion'
  | 'tecnologia'
  | 'especializado';

export type ZonaCobertura =
  | 'caba'
  | 'gba_norte'
  | 'gba_sur'
  | 'gba_oeste'
  | 'interior_bsas'
  | 'nacional';

export type CondicionIVA = 'responsable_inscripto' | 'monotributista' | 'exento';

export type TipoEstablecimiento =
  | 'restaurante'
  | 'bar_cafe'
  | 'hotel'
  | 'catering_dark_kitchen'
  | 'franquicia'
  | 'panaderia_heladeria'
  | 'otro';

export type TipoProveedor =
  | 'fabricante'
  | 'distribuidor_oficial'
  | 'distribuidor_multimarca'
  | 'importador'
  | 'otro';

export type TipoPackaging = 'unitario' | 'caja' | 'pallet';

export type OrigenProducto = 'nacional' | 'importado';

export type TemperaturaAlmacenamiento = 'ambiente' | 'refrigerado' | 'congelado';

// ─── TAXONOMÍA DE RUBROS (14 categorías) ────────────────────────────────────
export type Rubro =
  | 'frio_comercial'
  | 'calor_comercial'
  | 'gas_combustion'
  | 'maquinaria_preparacion'
  | 'lavado_comercial'
  | 'cafe_bebidas'
  | 'pos_it'
  | 'seguridad_cctv'
  | 'electricidad_tableros'
  | 'plomeria_agua'
  | 'campanas_extraccion'
  | 'infraestructura_edilicia'
  | 'automatizacion_iot'
  | 'incendio_seguridad';

export const TODOS_LOS_RUBROS: Rubro[] = [
  'frio_comercial', 'calor_comercial', 'gas_combustion',
  'maquinaria_preparacion', 'lavado_comercial', 'cafe_bebidas',
  'pos_it', 'seguridad_cctv', 'electricidad_tableros',
  'plomeria_agua', 'campanas_extraccion', 'infraestructura_edilicia',
  'automatizacion_iot', 'incendio_seguridad',
];

export const RUBRO_LABELS: Record<Rubro, string> = {
  frio_comercial:           'Frío Comercial',
  calor_comercial:          'Calor Comercial',
  gas_combustion:           'Gas y Combustión',
  maquinaria_preparacion:   'Maquinaria de Preparación',
  lavado_comercial:         'Lavado Comercial',
  cafe_bebidas:             'Café y Bebidas',
  pos_it:                   'POS e IT',
  seguridad_cctv:           'Seguridad y CCTV',
  electricidad_tableros:    'Electricidad y Tableros',
  plomeria_agua:            'Plomería y Agua',
  campanas_extraccion:      'Campanas y Extracción',
  infraestructura_edilicia: 'Infraestructura Edilicia',
  automatizacion_iot:       'Automatización e IoT',
  incendio_seguridad:       'Incendio y Seguridad',
};

// ─── TIPOS GENERALES ─────────────────────────────────────────────────────────
export type Urgencia = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type CertificationStatus = 'vigente' | 'por_vencer' | 'vencida';

// ─── ESTADOS OT (15 estados) ─────────────────────────────────────────────────
export type EstadoOT =
  | 'NUEVA'
  | 'EN_DIAGNOSTICO'
  | 'APROBADA_PENDIENTE_ASIGNACION'
  | 'TECNICO_ASIGNADO'
  | 'EN_VISITA'
  | 'COTIZACION_EMITIDA'
  | 'AUTORIZADA'
  | 'REPUESTO_SOLICITADO'
  | 'EN_EJECUCION'
  | 'PENDIENTE_CONFORMIDAD'
  | 'CERRADA_CONFORME'
  | 'CERRADA_SIN_CONFORMIDAD'
  | 'FACTURADA'
  | 'LIQUIDADA'
  | 'CANCELADA';

// ─── TIER DE CLIENTE ─────────────────────────────────────────────────────────
export type TierCliente = 'FREEMIUM' | 'CADENA_CHICA' | 'CADENA_GRANDE';

// ─── PLAN PROVEEDOR ──────────────────────────────────────────────────────────
export type PlanProveedor = 'freemium' | 'pro' | 'premium';

export const COMISION_POR_TIER: Record<TierCliente, number> = {
  FREEMIUM:      0.30,
  CADENA_CHICA:  0.25,
  CADENA_GRANDE: 0.20,
};

export const SAAS_POR_TIER: Record<TierCliente, number> = {
  FREEMIUM:      0,
  CADENA_CHICA:  75,
  CADENA_GRANDE: 100,
};

// ─── CERTIFICACIONES ─────────────────────────────────────────────────────────
export interface Certificacion {
  id: string;
  tipo: 'enargas' | 'refrigeracion_opds' | 'electrica_copime' | 'marca_oficial' | 'seguro_rc' | 'otro';
  nombre: string;
  entidadEmisora: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: CertificationStatus;
  rubrosCubiertos: Rubro[];
  documentoUrl: string;
}

// ─── ACTORES ─────────────────────────────────────────────────────────────────
export interface Restaurante {
  id: string;
  nombre: string;
  razonSocial: string;
  cuit: string;
  zona: string;
  direccion: string;
  contactoNombre: string;
  telefono: string;
  tier: TierCliente;
  cantidadLocales: number;
  suscripcionActivaDesde?: string;   // ISO date — presente solo en tiers de pago
  cantidadLocalesSuscriptos?: number;
  locales?: LocalRestaurante[];
  legajo?: LegajoRestaurante;
}

export interface LocalRestaurante {
  id: string;
  nombre: string;
  direccion: string;
  zona: string;
  // Soporta ambas variantes de nombre de campo
  contactoNombre?: string;
  contactoTel?: string;
  contactoOperativoNombre?: string;
  contactoOperativoTel?: string;
}

export interface Tecnico {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rubros: Rubro[];
  certificaciones: Certificacion[];
  certStatusGlobal: CertificationStatus;
  certPorRubro: Partial<Record<Rubro, CertificationStatus>>;
  bloqueado: boolean;
  bloqueadoRubros: Rubro[];
  score: number;
  otsCompletadas: number;
  zona: string;
  legajo?: LegajoTecnico;
}

export interface Proveedor {
  id: string;
  nombre: string;
  razonSocial: string;
  cuit?: string;
  telefono: string;
  email: string;
  direccion?: string;
  rubros: Rubro[];
  plan?: PlanProveedor;
  // Campos originales del type
  zonaDespacho?: string[];
  tiempoEntregaHs?: number;
  esShuuriPro?: boolean;
  // Campos del mock (legajo los provee)
  catalogoItems?: CatalogoItem[];
  legajo?: LegajoProveedor;
  // Marketplace
  tiposSeller?: TipoSeller[];
  shuuriPro?: boolean;
  tiendaOficial?: boolean;
  categoriaInsumo?: CategoriaInsumo;
  esProveedorInsumos?: boolean;
}

export interface CatalogoItem {
  id: string;
  nombre: string;
  precio: number;
  rubro: Rubro;
  marca?: string;
  modelo?: string;
  stock?: number;
}

// ─── ACTIVO ───────────────────────────────────────────────────────────────────
export interface Activo {
  id: string;
  rubro: Rubro;
  categoria: string;
  subcategoria: string;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  restauranteId: string;
  zonaLocal: ZonaLocal;
  estado: 'operativo' | 'falla' | 'mantenimiento' | 'fuera_de_servicio';
  proveedorCompra?: string;
  garantiaVigente?: string;
  anoCompraInstalacion?: number;
  valorCompraARS?: number;
  ultimoService?: string;
  contratMantenimientoVigente?: boolean;
  nombreProveedorMantenimiento?: string;
  problemasConocidos?: string;
  fotoEquipo: string[];
  fotoChapa: string[];
  fotosProblemas?: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface CategoriaActivo {
  rubro: Rubro;
  categoria: string;
  subcategoria: string;
  marcasComunes: string[];
}

// ─── EQUIPO / ACTIVO (legado) ─────────────────────────────────────────────────
export interface Equipo {
  id: string;
  restauranteId: string;
  localId?: string;
  tipo: string;
  marca: string;
  modelo: string;
  serie: string;
  anioInstalacion: number;
  rubro: Rubro;
  garantiaVigente: boolean;
  fechaUltimoServicio?: string;
  proximoPreventivo?: string;
  otIds: string[];
  estado: 'operativo' | 'en_servicio' | 'fuera_de_servicio';
}

// ─── PRECIOS Y COTIZACIONES ───────────────────────────────────────────────────
export interface ItemRepuesto {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  proveedorId?: string;
  esRepuesto?: boolean;
}

export interface Cotizacion {
  estimacionMin: number;
  estimacionMax: number;
  aprobadaFase1: boolean;
  fechaEstimacion?: string;
  diagnosticoTecnico?: string;
  itemsRepuestos: ItemRepuesto[];
  manoDeObra: number;
  totalDefinitivo?: number;
  aprobadaFase2: boolean;
  fechaEmisionCotizacion?: string;
}

// ─── ORDEN DE TRABAJO ────────────────────────────────────────────────────────
export interface OrdenTrabajo {
  id: string;
  restauranteId: string;
  localId?: string;
  equipoId?: string;
  activoId?: string;
  ordenesCompraRepuesto?: string[];
  tecnicoId?: string;
  equipoTipo: string;
  equipoMarca: string;
  equipoModelo?: string;
  rubro: Rubro;
  descripcionFalla: string;
  urgencia: Urgencia;
  fotosReporte: string[];
  estado: EstadoOT;
  cotizacion: Cotizacion;
  notas?: string;
  fechaCreacion: string;
  fechaVisitaProgramada?: string;
  fechaFinalizacion?: string;
  slaBreachAt?: string;
  conformidad?: {
    firmaUrl: string;
    nombreFirmante: string;
    dniFirmante: string;
    comentario?: string;
  };
}

// ─── ORDEN DE COMPRA ─────────────────────────────────────────────────────────
export interface OrdenCompra {
  id: string;
  otId: string;
  proveedorId: string;
  items: ItemRepuesto[];
  montoTotal: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'DESPACHADA' | 'ENTREGADA' | 'CANCELADA';
  fechaCreacion: string;
  fechaEntregaEstimada?: string;
}

// ─── ORDEN DE COMPRA DE REPUESTOS ────────────────────────────────────────────
export interface ItemOrdenCompra {
  repuestoId?: string;
  productoId?: string;
  descripcionLibre?: string;
  cantidad: number;
  precioUnitarioARS: number;
  comisionShuuriPct: number;
  comisionShuuriARS: number;
  totalARS: number;
}

export interface OrdenCompraRepuesto {
  id: string;
  otId: string;
  activoId: string;
  restauranteId: string;
  tecnicoId: string;
  proveedorId?: string;
  items: ItemOrdenCompra[];
  subtotalARS: number;
  totalComisionARS: number;
  totalARS: number;
  aprobadoAutomaticamente: true;
  aprobadaEn: string;
  estado: 'pendiente' | 'confirmada_proveedor' | 'despachada' | 'entregada_local' | 'cancelada';
  numeroSeguimiento?: string;
  transportista?: string;
  fechaEstimadaEntrega?: string;
  fechaEntregaReal?: string;
  recepcionConfirmadaEn?: string;
  recepcionConfirmadaPor?: string;
  creadaPor: 'tecnico' | 'admin';
  creadaEn: string;
  actualizadoEn: string;
}

// ─── LIQUIDACIÓN (MODELO MANDATO) ────────────────────────────────────────────
export interface Liquidacion {
  id: string;
  otId: string;
  tecnicoId: string;
  proveedorId?: string;
  montoTotalFacturado: number;
  comisionServicioPct: number;
  comisionServicio: number;
  comisionRepuestosPct: number;
  comisionRepuestos: number;
  comisionTotal: number;
  pagoTecnico: number;
  pagoProveedor?: number;
  estado: 'DEVENGADA' | 'PENDIENTE_PAGO' | 'PAGADA';
  fechaDevengado?: string;
  fechaPago?: string;
}

// ─── LEGAJOS (onboarding data) ───────────────────────────────────────────────
export interface LegajoRestaurante {
  nombreComercial: string;
  razonSocial: string;
  cuit: string;
  condicionIVA: string;
  domicilioFiscal: string;
  tipoEstablecimiento: string;
  // Dirección local (opcional para cadenas multi-local)
  direccionLocal?: string;
  horarioLV: string;
  horarioSabado: string;
  horarioDomingo: string;
  diasCierra: string;
  contactoPrincipalNombre: string;
  contactoPrincipalCargo: string;
  contactoPrincipalTel: string;
  contactoPrincipalEmail: string;
  // Contacto operativo (opcional — no siempre existe)
  contactoOperativoNombre?: string;
  contactoOperativoCargo?: string;
  contactoOperativoTel?: string;
  emailFacturas: string;
  metodoPago: string;
  cbu?: string;
  bancoOBilletera?: string;
  estacionamiento?: string;
  sinAviso?: string;
  horarioPreferido: string;
  horarioProhibido?: string;
  tecnicoFijo?: string;
  proveedorRepuestos?: string;
  contratosMantenimiento?: string;
  serviciosPorMes: string;
  frustracionMantenimiento?: string;
  // Campo plan (referencia al tier del restaurante)
  plan?: string;
  // Fiscal
  numeroIIBB?: string;
  convenioMultilateral?: boolean;
  jurisdiccionesIIBB?: string;
  alicuotaIIBB?: string;
  esSujetoRetencion?: boolean;
  retencionGanancias?: string;
  retencionIVA?: string;
  retencionIIBBPct?: string;
}

export interface LegajoTecnico {
  tipoAlta?: string;
  nombreORazonSocial?: string;
  nombreComercial?: string;
  cuit?: string;
  condicionIVA?: string;
  domicilioFiscal?: string;
  zonaCobertura?: string[];
  rubros?: Rubro[];
  marcasCertificadas?: string;
  tieneCertificacionesOficiales?: string;
  detalleCertificaciones?: string;
  disponibilidadHoraria?: string[];
  serviciosPorDia?: string;
  cantidadTecnicos?: string;
  relacionLaboral?: string;
  vehiculos?: string;
  herramientas?: string;
  anosExperiencia?: string;
  clientesActuales?: string;
  trabajaSubcontratista?: string;
  paraQuien?: string;
  seguroRC?: string;
  matafuegoEPP?: string;
  contactoNombre?: string;
  contactoCargo?: string;
  contactoTel?: string;
  contactoEmail?: string;
  contactoOTs?: string;
  emailLiquidaciones?: string;
  cbu?: string;
  aliasCbu?: string;
  bancoOBilletera?: string;
  tipoFactura?: string;
  plazoLiquidacion?: string;
}

export interface LegajoProveedor {
  nombreComercial?: string;
  razonSocial?: string;
  cuit?: string;
  condicionIVA?: string;
  domicilioFiscal?: string;
  sitioWeb?: string;
  tipoProveedor?: string;
  rubrosEspecializacion?: string;
  rubros?: Rubro[];
  marcas?: string;
  marcasRepresentadas?: string;
  tipoProductos?: string[];
  cantidadSKUs?: string;
  catalogoDigital?: string;
  frecuenciaPrecios?: string;
  zonaCobertura?: string[];
  tiempoEntrega?: string;
  logisticaPropia?: string;
  tieneDeposito?: string;
  direccionDeposito?: string;
  horarioDespacho?: string;
  comercialNombre?: string;
  comercialCargo?: string;
  comercialTel?: string;
  comercialEmail?: string;
  logisticaNombre?: string;
  logisticaTel?: string;
  logisticaEmail?: string;
  emailLiquidaciones?: string;
  cbu?: string;
  aliasCbu?: string;
  bancoOBilletera?: string;
  plazoLiquidacion?: string;
  tipoFactura?: string;
}

// ─── ATRIBUTOS LOGÍSTICOS ─────────────────────────────────────────────────────
export interface AtributosLogisticos {
  ean13?: string;
  ean14?: string;
  codigoProductoInterno: string;
  pesoNeto: number;
  pesoBruto: number;
  largo: number;
  ancho: number;
  alto: number;
  tipoPackaging: TipoPackaging;
  unidadVenta: string;
  origen: OrigenProducto;
  paisOrigen?: string;
  posicionArancelaria?: string;
  temperaturaAlmacenamiento?: TemperaturaAlmacenamiento;
}

// ─── MARKETPLACE ─────────────────────────────────────────────────────────────

export type TipoSeller =
  | 'fabricante'
  | 'representante'
  | 'revendedor'
  | 'importador'
  | 'distribuidor';

export type CategoriaInsumo =
  | 'comestibles'
  | 'bebidas'
  | 'descartables'
  | 'limpieza'
  | 'manteleria'
  | 'packaging'
  | 'preparacion';

export type TipoRemate = 'subasta' | 'precio_fijo';

export interface ProductoMarketplace {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  rubro?: Rubro;
  imagenUrl?: string;
  proveedorId: string;
  tipoSeller: TipoSeller[];
  tiendaOficial: boolean;
  condicion: 'nuevo' | 'usado' | 'saldo';
  stock: number;
  atributos: Record<string, string>;
  precioUSD?: number;
  imagenes?: string[];
  logistica?: AtributosLogisticos;
  compatibleConActivos?: string[];
  stockMinimo?: number;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface Repuesto {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  descripcion: string;
  proveedorId: string;
  compatibleCon: string[];
  compatibleMarcas: string[];
  compatibleModelos: string[];
  rubro: Rubro;
  stock: number;
  codigoFabricante?: string;
  compatibleActivosIds?: string[];
  reemplazaA?: string;
  logistica?: AtributosLogisticos;
  stockMinimo?: number;
  imagenUrl?: string;
  creadoEn?: string;
}

export interface Insumo {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  unidad: string;
  descripcion: string;
  categoria: CategoriaInsumo;
  proveedorId: string;
  esPerecible: boolean;
  stock: number;
  logistica?: AtributosLogisticos;
  stockMinimo?: number;
  imagenUrl?: string;
}

export interface Remate {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoRemate;
  items: ProductoMarketplace[];
  precioBase: number;
  precioActual: number;
  pujaMinima?: number;
  fechaCierre: string;
  proveedorId: string;
  estado: 'activo' | 'cerrado' | 'pendiente';
  totalPujas?: number;
}

// ─── INTEGRACIONES (settings placeholder) ────────────────────────────────────
export type EstadoIntegracion = 'no_conectado' | 'conectado' | 'error' | 'pendiente';

export interface IntegracionCalendario {
  tipo: 'google_calendar' | 'microsoft_outlook' | 'apple_calendar';
  estado: EstadoIntegracion;
  email?: string;
  ultimaSincronizacion?: string;
}

export interface IntegracionPago {
  tipo: 'mercadopago' | 'modo' | 'transferencia_bancaria';
  estado: EstadoIntegracion;
  alias?: string;
}

export interface IntegracionLogistica {
  tipo: 'oca' | 'andreani' | 'correo_argentino' | 'propia';
  estado: EstadoIntegracion;
  cuenta?: string;
}

export interface IntegracionStock {
  tipo: 'api_propia' | 'mercado_libre' | 'tienda_nube' | 'excel_csv';
  estado: EstadoIntegracion;
  endpoint?: string;
  ultimaActualizacion?: string;
}

// ─── LABELS ───────────────────────────────────────────────────────────────────
export const LABELS_ZONA_LOCAL: Record<ZonaLocal, string> = {
  cocina_caliente: 'Cocina caliente',
  cocina_fria:     'Cocina fría',
  lavado:          'Lavado',
  barra_salon:     'Barra / Salón',
  deposito:        'Depósito / Áreas técnicas',
  climatizacion:   'Climatización',
  tecnologia:      'Tecnología',
  especializado:   'Equipos especializados',
};

export const LABELS_ZONA_COBERTURA: Record<ZonaCobertura, string> = {
  caba:           'CABA',
  gba_norte:      'GBA Norte',
  gba_sur:        'GBA Sur',
  gba_oeste:      'GBA Oeste',
  interior_bsas:  'Interior Buenos Aires',
  nacional:       'Nacional',
};

// ─── TAXONOMÍA DE ACTIVOS ─────────────────────────────────────────────────────
export const TAXONOMIA_ACTIVOS: CategoriaActivo[] = [
  { rubro: 'calor_comercial',        categoria: 'Hornos',              subcategoria: 'Horno Convector',       marcasComunes: ['Rational', 'Unox', 'BRAFH'] },
  { rubro: 'calor_comercial',        categoria: 'Hornos',              subcategoria: 'Horno Pizzero',         marcasComunes: ['Forno.ar', 'Italforni', 'MGA'] },
  { rubro: 'calor_comercial',        categoria: 'Hornos',              subcategoria: 'Horno Pastelero',       marcasComunes: ['Sol Real', 'IG', 'BRAFH'] },
  { rubro: 'calor_comercial',        categoria: 'Cocinas',             subcategoria: 'Cocina Industrial Gas', marcasComunes: ['Lynch', 'IG', 'Sol Real', 'MGA'] },
  { rubro: 'calor_comercial',        categoria: 'Freidoras',           subcategoria: 'Freidora Gas',          marcasComunes: ['BRAFH', 'IG', 'Sol Real'] },
  { rubro: 'calor_comercial',        categoria: 'Freidoras',           subcategoria: 'Freidora Eléctrica',    marcasComunes: ['BRAFH', 'IG'] },
  { rubro: 'calor_comercial',        categoria: 'Planchas',            subcategoria: 'Plancha / Griddle',     marcasComunes: ['Lynch', 'IG', 'Sol Real'] },
  { rubro: 'frio_comercial',         categoria: 'Heladeras',           subcategoria: 'Heladera Vertical',     marcasComunes: ['True', 'Metalfrio', 'Briket', 'Inelro'] },
  { rubro: 'frio_comercial',         categoria: 'Heladeras',           subcategoria: 'Heladera Bajo Mesada',  marcasComunes: ['True', 'Metalfrio'] },
  { rubro: 'frio_comercial',         categoria: 'Heladeras',           subcategoria: 'Heladera Exhibidora',   marcasComunes: ['Frimaq', 'Frider', 'Briket'] },
  { rubro: 'frio_comercial',         categoria: 'Freezers',            subcategoria: 'Freezer Vertical',      marcasComunes: ['Briket', 'Inelro', 'Gafa'] },
  { rubro: 'frio_comercial',         categoria: 'Cámaras',             subcategoria: 'Cámara Frigorífica',    marcasComunes: ['Frio Sur', 'Frider'] },
  { rubro: 'frio_comercial',         categoria: 'Vitrinas',            subcategoria: 'Vitrina Refrigerada',   marcasComunes: ['Frimaq', 'Frider'] },
  { rubro: 'frio_comercial',         categoria: 'Máquinas de Hielo',   subcategoria: 'Fabricadora Cubitos',   marcasComunes: ['Scotsman', 'Hoshizaki', 'Diafana'] },
  { rubro: 'lavado_comercial',       categoria: 'Lavavajillas',        subcategoria: 'Lavavajillas Bajomesada', marcasComunes: ['Winterhalter', 'Hobart', 'Electrolux'] },
  { rubro: 'lavado_comercial',       categoria: 'Lavavajillas',        subcategoria: 'Lavavajillas Capota',   marcasComunes: ['Winterhalter', 'Hobart'] },
  { rubro: 'cafe_bebidas',           categoria: 'Cafeteras',           subcategoria: 'Cafetera Profesional',  marcasComunes: ['La Marzocco', 'Faema', 'La Cimbali', 'Rancilio'] },
  { rubro: 'cafe_bebidas',           categoria: 'Molinillos',          subcategoria: 'Molinillo Profesional', marcasComunes: ['Mazzer', 'Mahlkonig', 'Eureka'] },
  { rubro: 'campanas_extraccion',    categoria: 'Aire Acondicionado',  subcategoria: 'Split Frío/Calor',      marcasComunes: ['Samsung', 'LG', 'Midea', 'Surrey'] },
  { rubro: 'campanas_extraccion',    categoria: 'Extracción',          subcategoria: 'Campana Extractora',    marcasComunes: ['Soler & Palau', 'Lynch', 'IG'] },
  { rubro: 'pos_it',                 categoria: 'POS',                 subcategoria: 'Terminal POS',          marcasComunes: ['Oracle Micros', 'NCR Aloha'] },
  { rubro: 'pos_it',                 categoria: 'Red',                 subcategoria: 'Router / Switch',       marcasComunes: ['Ubiquiti', 'Mikrotik', 'TP-Link'] },
  { rubro: 'seguridad_cctv',         categoria: 'CCTV',                subcategoria: 'Cámara Seguridad',      marcasComunes: ['Hikvision', 'Dahua'] },
  { rubro: 'maquinaria_preparacion', categoria: 'Panadería',           subcategoria: 'Amasadora',             marcasComunes: ['Genérica'] },
  { rubro: 'maquinaria_preparacion', categoria: 'Pesaje',              subcategoria: 'Balanza Electrónica',   marcasComunes: ['Systel', 'CAS'] },
];

// ─── NOTIFICACIONES ───────────────────────────────────────────────────────────
export type TipoNotificacion = 'ot' | 'falla' | 'repuesto' | 'sistema' | 'pago';

export interface Notificacion {
  id:          string;
  actorId:     string;
  actorTipo:   'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR';
  titulo:      string;
  descripcion: string;
  tipo:        TipoNotificacion;
  fechaHora:   string;   // ISO 8601
  leida:       boolean;
}

// ─── VALIDACIONES ─────────────────────────────────────────────────────────────
export const VALIDACIONES = {
  cuit:     { regex: /^\d{2}-\d{8}-\d{1}$/, mensaje: 'Formato requerido: XX-XXXXXXXX-X' },
  cbuCvu:   { regex: /^\d{22}$/, mensaje: 'Debe tener exactamente 22 dígitos' },
  email:    { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensaje: 'Email inválido' },
  telefono: { regex: /^(\+54|0054|54)?[\s-]?(?:11|[2-9]\d{2,3})[\s-]?\d{4}[\s-]?\d{4}$/, mensaje: 'Formato argentino requerido' },
  horario:  { regex: /^([01]?\d|2[0-3]):([0-5]\d)\s*[-–]\s*([01]?\d|2[0-3]):([0-5]\d)$/, mensaje: 'Formato requerido: HH:MM - HH:MM' },
  archivo: {
    tiposPDF:      ['application/pdf'],
    tiposImagen:   ['image/jpeg', 'image/png'],
    tiposCatalogo: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    maxMBDocumento: 2,
    maxMBImagen:    5,
    maxMBCatalogo:  10,
  },
};
