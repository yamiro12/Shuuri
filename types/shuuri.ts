/**
 * SHUURI - Definiciones de Tipos Globales
 * Plataforma B2B2B de coordinación técnica gastronómica
 * v2.1 — Marzo 2026
 */

export type UserRole = 'RESTAURANTE' | 'TECNICO' | 'PROVEEDOR' | 'SHUURI_ADMIN';

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
  // Campos originales del type
  zonaDespacho?: string[];
  tiempoEntregaHs?: number;
  esShuuriPro?: boolean;
  // Campos del mock (legajo los provee)
  catalogoItems?: CatalogoItem[];
  legajo?: LegajoProveedor;
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

// ─── EQUIPO / ACTIVO ─────────────────────────────────────────────────────────
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
