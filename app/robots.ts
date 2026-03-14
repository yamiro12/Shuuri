import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/restaurante/',
          '/tecnico/',
          '/proveedor/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://shuuri.com/sitemap.xml',
  };
}
