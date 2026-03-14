"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Search, X, Settings, BookOpen, Wrench, TrendingUp, Zap } from 'lucide-react';
import { BLOG_POSTS, CATEGORIAS, type BlogPost } from '@/data/blog-mock';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });
}

const CATEGORIA_COLORS: Record<string, string> = {
  Gestión:      'bg-blue-50 text-[#2698D1]',
  Guías:        'bg-purple-50 text-purple-700',
  Mantenimiento:'bg-amber-50 text-amber-700',
  Industria:    'bg-gray-100 text-gray-700',
  SHUURI:       'bg-green-50 text-green-700',
};

const CATEGORIA_BG: Record<string, string> = {
  Gestión:       'from-blue-50 to-[#2698D1]/10',
  Guías:         'from-purple-50 to-purple-100',
  Mantenimiento: 'from-amber-50 to-orange-100',
  Industria:     'from-gray-50 to-gray-100',
  SHUURI:        'from-green-50 to-emerald-100',
};

const CATEGORIA_ICON: Record<string, React.ElementType> = {
  Gestión:       TrendingUp,
  Guías:         BookOpen,
  Mantenimiento: Wrench,
  Industria:     Settings,
  SHUURI:        Zap,
};

const CATEGORIA_ICON_COLOR: Record<string, string> = {
  Gestión:       'text-[#2698D1]',
  Guías:         'text-purple-400',
  Mantenimiento: 'text-amber-400',
  Industria:     'text-gray-400',
  SHUURI:        'text-green-500',
};

function catColor(cat: string) {
  return CATEGORIA_COLORS[cat] ?? 'bg-gray-100 text-gray-600';
}

function ImagePlaceholder({ post, className }: { post: BlogPost; className: string }) {
  const bg       = CATEGORIA_BG[post.categoria]  ?? 'from-gray-50 to-gray-100';
  const Icon     = CATEGORIA_ICON[post.categoria] ?? BookOpen;
  const iconCls  = CATEGORIA_ICON_COLOR[post.categoria] ?? 'text-gray-300';
  return (
    <div className={`bg-gradient-to-br ${bg} flex items-center justify-center ${className}`}>
      <Icon className={`h-10 w-10 opacity-30 ${iconCls}`} />
    </div>
  );
}

// ─── FEATURED CARD ────────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid md:grid-cols-2 gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Imagen */}
      <div className="relative min-h-[240px]">
        <ImagePlaceholder post={post} className="h-64 md:h-full absolute inset-0 w-full" />
        <div className="relative h-64 md:h-auto min-h-[240px] flex items-end p-5">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${catColor(post.categoria)}`}>
            {post.categoria}
          </span>
          <span className="ml-2 rounded-full px-3 py-1 text-xs font-bold bg-[#0D0D0D] text-white">
            Destacado
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col p-8 md:p-10">
        <p className="text-xs text-gray-400 mb-3">{formatFecha(post.fecha)}</p>
        <h2 className="font-black text-2xl text-[#0D0D0D] leading-snug mb-4 group-hover:text-[#2698D1] transition-colors">
          {post.titulo}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">
          {post.extracto}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 font-bold text-[#2698D1]">
            Leer artículo <ArrowRight className="h-4 w-4" />
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="h-3 w-3" />
            {post.minutosLectura} min de lectura
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-44">
        <ImagePlaceholder post={post} className="h-44 absolute inset-0 w-full" />
        <div className="relative h-44 flex items-end p-4">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${catColor(post.categoria)}`}>
            {post.categoria}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-bold text-[#0D0D0D] text-base leading-snug mb-2 group-hover:text-[#2698D1] transition-colors line-clamp-2">
          {post.titulo}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {post.extracto}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
          <span>{formatFecha(post.fecha)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.minutosLectura} min
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'loading' | 'success'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEstado('loading');
    setTimeout(() => {
      console.log('[Newsletter] suscripción:', email);
      setEstado('success');
    }, 1000);
  }

  return (
    <section className="bg-[#2698D1] py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-black text-3xl text-white mb-3">
          Recibí los mejores artículos en tu inbox
        </h2>
        <p className="text-blue-100 mb-8 text-sm">
          Una vez por semana. Sin spam. Cancelás cuando quieras.
        </p>

        {estado === 'success' ? (
          <div className="bg-white/20 text-white rounded-xl px-6 py-4 inline-flex items-center gap-2 font-semibold">
            ✓ Te suscribiste correctamente. ¡Gracias!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-white text-[#0D0D0D] placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={estado === 'loading'}
              className="px-6 py-3 bg-[#0D0D0D] text-white font-bold rounded-xl text-sm hover:bg-gray-900 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {estado === 'loading' ? 'Suscribiendo...' : 'Suscribirme'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function BlogContent() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [query, setQuery] = useState('');

  const featuredPost = BLOG_POSTS.find(p => p.destacado) ?? BLOG_POSTS[0];

  const postsFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    return BLOG_POSTS.filter(p => {
      if (p.id === featuredPost.id) return false; // featured shown separately
      if (categoriaActiva !== 'Todos' && p.categoria !== categoriaActiva) return false;
      if (q && !p.titulo.toLowerCase().includes(q) && !p.extracto.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [categoriaActiva, query, featuredPost.id]);

  // When filtering, include featured in results too
  const showFeaturedInGrid = useMemo(() => {
    if (categoriaActiva === 'Todos' && !query) return false;
    const q = query.toLowerCase().trim();
    const matchCat = categoriaActiva === 'Todos' || featuredPost.categoria === categoriaActiva;
    const matchQ = !q || featuredPost.titulo.toLowerCase().includes(q) || featuredPost.extracto.toLowerCase().includes(q);
    return matchCat && matchQ;
  }, [categoriaActiva, query, featuredPost]);

  const allDisplayed = showFeaturedInGrid
    ? [featuredPost, ...postsFiltrados]
    : postsFiltrados;

  return (
    <>
      {/* HEADER */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-black text-5xl sm:text-6xl text-[#0D0D0D] mb-5">
            Blog SHUURI
          </h1>
          <p className="text-xl text-gray-500">
            Mantenimiento, gestión y tecnología para la gastronomía argentina.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      {categoriaActiva === 'Todos' && !query && (
        <section className="bg-white pt-12 pb-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      )}

      {/* SEARCH + FILTROS */}
      <div className="bg-white sticky top-16 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#2698D1] transition-colors bg-gray-50"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-[#0D0D0D] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="bg-gray-50 py-12 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {allDisplayed.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm mb-3">No encontramos artículos con esa búsqueda.</p>
              <button
                onClick={() => { setQuery(''); setCategoriaActiva('Todos'); }}
                className="text-[#2698D1] font-semibold text-sm hover:underline"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : (
            <>
              {(query || categoriaActiva !== 'Todos') && (
                <p className="text-xs text-gray-400 mb-6">
                  {allDisplayed.length} artículo{allDisplayed.length !== 1 ? 's' : ''} encontrado{allDisplayed.length !== 1 ? 's' : ''}
                  {query && <> para <strong className="text-gray-600">"{query}"</strong></>}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDisplayed.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />

      {/* CTA FINAL */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base font-semibold text-[#0D0D0D] mb-2">
            ¿Querés que escribamos sobre tu industria o caso de uso?
          </p>
          <p className="text-sm text-gray-500 mb-5">
            Cubrimos gastronomía, mantenimiento industrial, tecnología B2B y más.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-[#2698D1] font-bold hover:underline text-sm"
          >
            Escribinos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
