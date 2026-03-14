import React from 'react';
import Link from 'next/link';

// ─── BADGE ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  variant: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const BADGE_VARIANTS: Record<BadgeProps['variant'], string> = {
  blue:   'bg-[#2698D1]/10 text-[#2698D1] border border-[#2698D1]/20',
  green:  'bg-green-50 text-green-700 border border-green-200',
  amber:  'bg-amber-50 text-amber-700 border border-amber-200',
  red:    'bg-red-50 text-red-700 border border-red-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

export function Badge({ variant, size = 'md', children }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${BADGE_VARIANTS[variant]}`}>
      {children}
    </span>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  tag?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ tag, title, titleHighlight, subtitle, centered = false }: SectionHeaderProps) {
  const centerClass = centered ? 'text-center items-center' : '';
  return (
    <div className={`flex flex-col gap-2 mb-10 ${centerClass}`}>
      {tag && (
        <span className="inline-flex w-fit items-center rounded-full bg-[#2698D1]/10 text-[#2698D1] border border-[#2698D1]/20 text-xs font-semibold px-3 py-1">
          {tag}
        </span>
      )}
      <h2 className={`font-black text-4xl text-[#0D0D0D] leading-tight ${centered ? 'text-center' : ''}`}>
        {title}
        {titleHighlight && (
          <span className="text-[#2698D1]"> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className={`text-gray-500 text-lg mt-4 max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── CTA GROUP ───────────────────────────────────────────────────────────────

interface CTAGroupProps {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tertiary?: { label: string; href: string };
  centered?: boolean;
}

export function CTAGroup({ primary, secondary, tertiary, centered = false }: CTAGroupProps) {
  const centerClass = centered ? 'justify-center' : '';
  return (
    <div className={`flex flex-wrap items-center gap-4 ${centerClass}`}>
      <Link
        href={primary.href}
        className="inline-flex items-center justify-center bg-[#2698D1] hover:bg-[#2698D1]/90 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200"
      >
        {primary.label}
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className="inline-flex items-center justify-center border-2 border-gray-200 text-[#0D0D0D] hover:border-gray-300 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
        >
          {secondary.label}
        </Link>
      )}
      {tertiary && (
        <Link
          href={tertiary.href}
          className="text-gray-400 hover:text-gray-600 text-sm underline transition-colors duration-200"
        >
          {tertiary.label}
        </Link>
      )}
    </div>
  );
}

// ─── STAT GRID ───────────────────────────────────────────────────────────────

interface StatItem { value: string; label: string }
interface StatGridProps { items: StatItem[]; cols?: 2 | 3 | 4 }

const COLS_MAP: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

export function StatGrid({ items, cols = 4 }: StatGridProps) {
  return (
    <div className={`grid ${COLS_MAP[cols] ?? 'grid-cols-2 sm:grid-cols-4'} gap-0`}>
      {items.map((item, i) => (
        <div key={item.label} className="relative flex flex-col items-center text-center px-6 py-4">
          {i > 0 && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-200 hidden sm:block" />
          )}
          <span className="font-black text-4xl text-[#0D0D0D]">{item.value}</span>
          <span className="text-sm text-gray-500 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
