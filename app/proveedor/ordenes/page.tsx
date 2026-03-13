"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { formatDate } from '@/components/shared/utils';
import { PROVEEDORES, OCS, getOTById } from '@/data/mock';
import {
  Package, ChevronRight, Search, X,
  Truck, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';

type OC = typeof OCS[number];
type TabEstado = 'todas' | 'CONFIRMADA' | 'DESPACHADA' | 'ENTREGADA';

function EstadoOCBadge({ estado }: { estado: string }) {
  const cfg: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    CONFIRMADA: { label: 'Confirmada',  cls: 'bg-blue-100 text-blue-700',   icon: <Clock className="h-3 w-3" /> },
    DESPACHADA: { label: 'En camino',   cls: 'bg-purple-100 text-purple-700', icon: <Truck className="h-3 w-3" /> },
    ENTREGADA:  { label: 'Entregada',   cls: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    CANCELADA:  { label: 'Cancelada',   cls: 'bg-red-100 text-red-600',     icon: <X className="h-3 w-3" /> },
  };
  const c = cfg[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-500', icon: null };
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold w-fit ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  );
}

function FilaOC({ oc, proveedorId }: { oc: OC; proveedorId: string }) {
  const ot = getOTById(oc.otId);
  return (
    <Link href={`/proveedor/ordenes/${oc.id}?id=${proveedorId}`}>
      <div className="group flex items-center gap-4 border-b last:border-0 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
        {/* Icono */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
          oc.estado === 'ENTREGADA'  ? 'bg-green-50'  :
          oc.estado === 'DESPACHADA' ? 'bg-purple-50' :
          oc.estado === 'CONFIRMADA' ? 'bg-blue-50'   : 'bg-gray-50'
        }`}>
          <Package className={`h-5 w-5 ${
            oc.estado === 'ENTREGADA'  ? 'text-green-500'  :
            oc.estado === 'DESPACHADA' ? 'text-purple-500' :
            oc.estado === 'CONFIRMADA' ? 'text-[#2698D1]'  : 'text-gray-400'
          }`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 font-mono">{oc.id}</span>
            <EstadoOCBadge estado={oc.estado} />
          </div>
          <p className="text-sm font-medium text-[#0D0D0D] truncate">
            {oc.items.slice(0, 2).map(i => i.descripcion).join(' · ')}
            {oc.items.length > 2 && ` +${oc.items.length - 2} más`}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            OT {oc.otId}
            {ot && <> · {ot.equipoTipo} {ot.equipoMarca}</>}
          </p>
        </div>

        {/* Entrega */}
        <div className="hidden md:block text-right shrink-0 w-32">
          {oc.estado === 'ENTREGADA' ? (
            <p className="text-xs text-green-600 font-bold">Entregada</p>
          ) : oc.fechaEntregaEstimada ? (
            <>
              <p className="text-xs text-gray-400">Entrega est.</p>
              <p className="text-xs font-bold text-gray-600">{formatDate(oc.fechaEntregaEstimada)}</p>
            </>
          ) : null}
        </div>

        {/* Monto */}
        <div className="text-right shrink-0 w-24">
          <p className="text-sm font-black text-[#0D0D0D]">USD {oc.montoTotal}</p>
          <p className="text-xs text-gray-400">{oc.items.length} ítem{oc.items.length > 1 ? 's' : ''}</p>
        </div>

        {/* Fecha */}
        <div className="hidden lg:block text-right shrink-0 w-24">
          <p className="text-xs text-gray-400">{formatDate(oc.fechaCreacion)}</p>
        </div>

        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#2698D1] transition-colors shrink-0" />
      </div>
    </Link>
  );
}

export default function ProveedorOrdenes() {
  const searchParams = useSearchParams();
  const proveedorId  = searchParams.get('id') ?? 'P001';
  const proveedor    = PROVEEDORES.find(p => p.id === proveedorId) ?? PROVEEDORES[0];

  const [tab,    setTab]    = useState<TabEstado>('todas');
  const [buscar, setBuscar] = useState('');

  const misOCs = OCS.filter(oc => oc.proveedorId === proveedorId);

  const ocsFiltradas = useMemo(() => {
    let lista = misOCs;
    if (tab !== 'todas') lista = lista.filter(oc => oc.estado === tab);
    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      lista = lista.filter(oc =>
        oc.id.toLowerCase().includes(q) ||
        oc.otId.toLowerCase().includes(q) ||
        oc.items.some(i => i.descripcion.toLowerCase().includes(q))
      );
    }
    return [...lista].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  }, [misOCs, tab, buscar]);

  const cuentas = {
    todas:     misOCs.length,
    CONFIRMADA: misOCs.filter(o => o.estado === 'CONFIRMADA').length,
    DESPACHADA: misOCs.filter(o => o.estado === 'DESPACHADA').length,
    ENTREGADA:  misOCs.filter(o => o.estado === 'ENTREGADA').length,
  };

  // Alerta despacho pendiente
  const pendienteDespacho = misOCs.filter(oc => oc.estado === 'CONFIRMADA');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="PROVEEDOR" userName={proveedor.nombre} />
      <div className="flex-1 ml-64">
        <Header userRole="PROVEEDOR" userName={proveedor.nombre} />
        <main className="p-8">

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0D0D0D]">Órdenes de compra</h1>
              <p className="text-sm text-gray-400 mt-0.5">{proveedor.nombre} · {misOCs.length} órdenes totales</p>
            </div>
          </div>

          {/* Alerta confirmadas pendientes */}
          {pendienteDespacho.length > 0 && (
            <button
              onClick={() => setTab('CONFIRMADA')}
              className="mb-6 w-full flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left hover:bg-blue-100 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-[#2698D1] shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-[#2698D1]">
                  {pendienteDespacho.length} orden{pendienteDespacho.length > 1 ? 'es pendientes' : ' pendiente'} de despacho
                </p>
                <p className="text-xs text-blue-500">SHUURI está coordinando el retiro. Tené los ítems listos.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#2698D1]" />
            </button>
          )}

          {/* TABS */}
          <div className="mb-4 flex items-center gap-1 rounded-xl border bg-white p-1 shadow-sm w-fit">
            {([
              { key: 'todas',      label: 'Todas',       count: cuentas.todas },
              { key: 'CONFIRMADA', label: 'Confirmadas', count: cuentas.CONFIRMADA, alert: true },
              { key: 'DESPACHADA', label: 'En camino',   count: cuentas.DESPACHADA },
              { key: 'ENTREGADA',  label: 'Entregadas',  count: cuentas.ENTREGADA },
            ] as { key: TabEstado; label: string; count: number; alert?: boolean }[]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t.key ? 'bg-[#0D0D0D] text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}>
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key ? 'bg-white/20 text-white' :
                  t.alert && t.count > 0 ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* BÚSQUEDA */}
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={buscar} onChange={e => setBuscar(e.target.value)}
              placeholder="Buscar por ID, OT, producto…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2698D1] transition-colors" />
            {buscar && (
              <button onClick={() => setBuscar('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* LISTA */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="grid border-b bg-gray-50 px-6 py-3" style={{ gridTemplateColumns: '1fr 128px 96px 96px 16px' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Producto / OT</p>
              <p className="hidden md:block text-xs font-bold uppercase tracking-wider text-gray-400">Entrega</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Monto</p>
              <p className="hidden lg:block text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Creada</p>
              <div />
            </div>

            {ocsFiltradas.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                <p className="font-bold text-gray-400">Sin órdenes en esta vista</p>
              </div>
            ) : (
              ocsFiltradas.map(oc => <FilaOC key={oc.id} oc={oc} proveedorId={proveedorId} />)
            )}
          </div>

        </main>
      </div>
    </div>
  );
}