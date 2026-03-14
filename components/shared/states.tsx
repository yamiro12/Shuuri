'use client';

import { AlertCircle, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

// ─── LOADING SPINNER ─────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SPINNER_SIZE = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function LoadingSpinner({ size = 'md', label = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div
        className={`${SPINNER_SIZE[size]} animate-spin rounded-full border-2 border-gray-200 border-t-[#2698D1]`}
      />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}

// ─── LOADING TABLE ────────────────────────────────────────────────────────────

interface LoadingTableProps {
  rows?: number;
  cols?: number;
}

export function LoadingTable({ rows = 5, cols = 5 }: LoadingTableProps) {
  return (
    <div className="animate-pulse space-y-2">
      {/* header */}
      <div className="flex gap-3 px-4 py-3 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3 px-4 py-3 border-b border-gray-50">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 bg-gray-100 rounded flex-1"
              style={{ opacity: 1 - c * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-4">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <p className="font-bold text-[#0D0D0D] text-lg mb-2">{title}</p>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// ─── ERROR STATE ─────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
}

export function ErrorState({
  title = 'Ocurrió un error',
  description = 'No pudimos cargar la información. Por favor intentá de nuevo.',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <p className="font-bold text-[#0D0D0D] text-lg mb-2">{title}</p>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-5">{description}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
