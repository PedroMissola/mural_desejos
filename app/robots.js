export default function robots() {
  const baseUrl = 'https://natal2025-seuexemplo.vercel.app';

  return {
    rules: {
      userAgent: '*', // Aplica a todos os robôs (Google, Bing, etc)
      allow: '/',     // Permite ler todo o site
      disallow: '/private/', // (Exemplo) Bloqueia pastas privadas se houver
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Indica onde está o mapa do site
  }
}