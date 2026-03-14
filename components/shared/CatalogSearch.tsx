'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  type MarcaCatalogo, type ModeloCatalogo,
  buscarMarcas, buscarModelos, getMarcasByRubro,
  getActivosByRubro, ACTIVOS_CATALOGO,
} from '@/data/catalogo';

// ─── MARCA SEARCH ─────────────────────────────────────────────────────────────

export function MarcaSearch({
  value, onChange, rubro, placeholder, inputCls,
}: {
  value:       string;
  onChange:    (nombre: string, id: string) => void;
  rubro?:      string;
  placeholder?: string;
  inputCls?:   string;
}) {
  const [query,   setQuery]   = useState(value);
  const [open,    setOpen]    = useState(false);
  const [results, setResults] = useState<MarcaCatalogo[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim() && rubro) {
      setResults(getMarcasByRubro(rubro).slice(0, 8));
    } else {
      setResults(buscarMarcas(query, rubro));
    }
  }, [query, rubro, open]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const cls = inputCls ?? 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors';

  return (
    <div className="relative" ref={ref}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? 'Buscar marca…'}
        className={cls}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden max-h-52 overflow-y-auto">
          {results.map(m => (
            <li key={m.id}>
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(m.nombre, m.id);
                  setQuery(m.nombre);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 text-left"
              >
                <span className="font-medium text-[#0D0D0D]">{m.nombre}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{m.origen}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── MODELO SEARCH ────────────────────────────────────────────────────────────

export function ModeloSearch({
  value, onChange, marcaId, placeholder, inputCls,
}: {
  value:        string;
  onChange:     (nombreCompleto: string) => void;
  marcaId?:     string;
  placeholder?: string;
  inputCls?:    string;
}) {
  const [query,   setQuery]   = useState(value);
  const [open,    setOpen]    = useState(false);
  const [results, setResults] = useState<ModeloCatalogo[]>([]);
  const disabled = !marcaId;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    if (!open || disabled) return;
    setResults(buscarModelos(query, marcaId));
  }, [query, marcaId, open, disabled]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const cls      = inputCls ?? 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors';
  const clsOff   = 'w-full rounded-lg border border-gray-100 px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed';

  return (
    <div className="relative" ref={ref}>
      <input
        value={disabled ? '' : query}
        disabled={disabled}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { if (!disabled) setOpen(true); }}
        placeholder={disabled ? 'Seleccioná una marca primero' : (placeholder ?? 'Buscar modelo…')}
        className={disabled ? clsOff : cls}
        autoComplete="off"
      />
      {open && results.length > 0 && !disabled && (
        <ul className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden max-h-52 overflow-y-auto">
          {results.map(m => (
            <li key={m.id}>
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(m.nombreCompleto);
                  setQuery(m.nombreCompleto);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 text-left"
              >
                <span className="font-medium text-[#0D0D0D]">{m.nombreCompleto}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{m.categoria}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── ACTIVO SELECT ────────────────────────────────────────────────────────────

export function ActivoSelect({
  value, onChange, rubro, inputCls,
}: {
  value:     string;
  onChange:  (nombre: string) => void;
  rubro?:    string;
  inputCls?: string;
}) {
  const activos = rubro ? getActivosByRubro(rubro) : ACTIVOS_CATALOGO;
  const cls = inputCls ?? 'w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2698D1] transition-colors bg-white';

  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className={cls}>
        <option value="">Seleccioná el tipo de equipo…</option>
        {activos.map(a => (
          <option key={a.id} value={a.nombre}>{a.nombre}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}
