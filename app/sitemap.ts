import type { MetadataRoute } from 'next';

const BASE = 'https://shuuri.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/como-funciona`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/precios`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/gastronomicos`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tecnicos`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/proveedores`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/marketplace`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/blog`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/faq`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/solicitar-tecnico`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contacto`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/legal/terminos`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/legal/privacidad`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/legal/cookies`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return staticRoutes;
}
