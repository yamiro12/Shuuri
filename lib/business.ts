/**
 * SHUURI — Lógica de negocio centralizada
 * v1.0 — Marzo 2026
 *
 * Este es el ÚNICO lugar donde viven las constantes y funciones de comisiones.
 * Ningún componente debe hardcodear 0.30, 0.25, 0.20, "30%", etc.
 * Importar siempre desde '@/lib/business'.
 */

import type { TierCliente } from '@/types/shuuri';

// ─── 1. CONSTANTES DEL MODELO ────────────────────────────────────────────────

/** Porcentaje de comisión que retiene SHUURI sobre el servicio (mano de obra) */
export const COMISION_SERVICIO: Record<TierCliente, number> = {
  FREEMIUM:      0.30,
  CADENA_CHICA:  0.25,
  CADENA_GRANDE: 0.20,
};

/** Comisión SHUURI sobre venta de repuestos en el marketplace */
export const COMISION_REPUESTOS = 0.15;

/** Comisión SHUURI sobre venta de insumos/productos en el marketplace */
export const COMISION_INSUMOS = 0.10;

/** Porcentaje neto que recibe el técnico sobre el servicio */
export const PCT_TECNICO = 0.70;

/** Porcentaje neto que recibe el proveedor sobre la venta de repuesto */
export const PCT_PROVEEDOR_REP = 0.85;

/**
 * Suscripción mensual en USD por local.
 * null = sin suscripción (solo comisión por OT).
 */
export const SUSCRIPCION_MENSUAL: Record<TierCliente, number | null> = {
  FREEMIUM:      null,
  CADENA_CHICA:  75,
  CADENA_GRANDE: 100,
};

// ─── 2. FUNCIONES DE CÁLCULO ─────────────────────────────────────────────────

/**
 * Retorna el porcentaje de comisión de servicio según el tier del restaurante.
 * Default: FREEMIUM (30%) si no se provee tier.
 */
export function getComisionServicioPct(tier?: TierCliente): number {
  return COMISION_SERVICIO[tier ?? 'FREEMIUM'];
}

/**
 * Calcula todos los montos de una OT y retorna un objeto con los valores
 * de comisión y pago listos para generar una Liquidacion.
 *
 * @param totalServicio  - Mano de obra (ARS)
 * @param totalRepuestos - Suma de repuestos vendidos (ARS)
 * @param tier           - Tier del restaurante que generó la OT
 */
export function calcularLiquidacionOT(
  totalServicio: number,
  totalRepuestos: number,
  tier: TierCliente = 'FREEMIUM',
): {
  comisionServicioPct: number;
  comisionServicio:    number;
  comisionRepuestosPct: number;
  comisionRepuestos:   number;
  comisionTotal:       number;
  pagoTecnico:         number;
  pagoProveedor:       number;
} {
  const comServPct = getComisionServicioPct(tier);
  const comServ    = Math.round(totalServicio  * comServPct          * 100) / 100;
  const comRep     = Math.round(totalRepuestos * COMISION_REPUESTOS  * 100) / 100;
  return {
    comisionServicioPct:  comServPct,
    comisionServicio:     comServ,
    comisionRepuestosPct: COMISION_REPUESTOS,
    comisionRepuestos:    comRep,
    comisionTotal:        Math.round((comServ + comRep) * 100) / 100,
    pagoTecnico:          Math.round(totalServicio  * PCT_TECNICO        * 100) / 100,
    pagoProveedor:        Math.round(totalRepuestos * PCT_PROVEEDOR_REP  * 100) / 100,
  };
}

/**
 * Retorna la suscripción mensual en USD del tier indicado.
 * null si es FREEMIUM (no paga suscripción fija).
 */
export function getSuscripcionMensual(tier?: TierCliente): number | null {
  return SUSCRIPCION_MENSUAL[tier ?? 'FREEMIUM'];
}

/**
 * Retorna la etiqueta legible de un tier.
 */
export function getTierLabel(tier?: TierCliente): string {
  const labels: Record<TierCliente, string> = {
    FREEMIUM:      'Freemium',
    CADENA_CHICA:  'Cadena Chica',
    CADENA_GRANDE: 'Cadena Grande',
  };
  return labels[tier ?? 'FREEMIUM'];
}

/**
 * Retorna las clases Tailwind para el badge de un tier.
 */
export function getTierBadgeClass(tier?: TierCliente): string {
  const classes: Record<TierCliente, string> = {
    FREEMIUM:      'bg-gray-100 text-gray-700',
    CADENA_CHICA:  'bg-blue-50 text-blue-700',
    CADENA_GRANDE: 'bg-purple-50 text-purple-700',
  };
  return classes[tier ?? 'FREEMIUM'];
}

// ─── 3. FEATURES POR TIER ────────────────────────────────────────────────────

export interface TierFeatures {
  comisionServicio:      string;
  suscripcionMensual:    string;
  usuarios:              string;
  sucursales:            string;
  preventivo:            boolean;
  dashboardEstadisticas: boolean;
  tecnicosFijos:         boolean;
  soportePrioritario:    boolean;
}

export const TIER_FEATURES: Record<TierCliente, TierFeatures> = {
  FREEMIUM: {
    comisionServicio:      '30% por OT',
    suscripcionMensual:    'Sin costo fijo',
    usuarios:              '1 usuario',
    sucursales:            '1 local',
    preventivo:            false,
    dashboardEstadisticas: false,
    tecnicosFijos:         false,
    soportePrioritario:    false,
  },
  CADENA_CHICA: {
    comisionServicio:      '25% por OT',
    suscripcionMensual:    'USD 75/local/mes',
    usuarios:              'Hasta 5 por local',
    sucursales:            'Hasta 10 locales',
    preventivo:            true,
    dashboardEstadisticas: true,
    tecnicosFijos:         false,
    soportePrioritario:    false,
  },
  CADENA_GRANDE: {
    comisionServicio:      '20% por OT',
    suscripcionMensual:    'USD 100/local/mes',
    usuarios:              'Ilimitados',
    sucursales:            'Ilimitadas',
    preventivo:            true,
    dashboardEstadisticas: true,
    tecnicosFijos:         true,
    soportePrioritario:    true,
  },
};
