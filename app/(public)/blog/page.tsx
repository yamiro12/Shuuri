"use client";
import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS, CATEGORIAS } from '@/data/blog-mock';

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

// ─── CARD ─────────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: typeof BLOG_POSTS[number] }) {
  const colorCls = CATEGORIA_COLORS[post.categoria] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Imagen placeholder */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-semibold text-gray-400 leading-relaxed">
          {post.imageAlt}
        </span>
        {/* Categoría sobre imagen */}
        <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${colorCls}`}>
          {post.categoria}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-bold text-[#0D0D0D] text-base leading-snug mb-2 group-hover:text-[#2698D1] transition-colors line-clamp-2">
          {post.titulo}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {post.extracto}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const postsFiltrados = categoriaActiva === 'Todos'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.categoria === categoriaActiva);

  return (
    <>
      {/* HEADER */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-black text-5xl text-[#0D0D0D] mb-5">
            Blog SHUURI
          </h1>
          <p className="text-xl text-gray-500">
            Mantenimiento, gestión y tecnología para la gastronomía argentina.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="bg-white sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      </section>

      {/* GRID */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {postsFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm italic">
              No hay posts en esta categoría todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsFiltrados.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-[#0D0D0D] mb-3">
            ¿Querés que escribamos sobre tu industria o caso de uso?
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-[#2698D1] font-bold hover:underline"
          >
            Escribinos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
