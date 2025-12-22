export default function sitemap() {
  // Substitua pela sua URL final de produção
  const baseUrl = 'https://natal2025-seuexemplo.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly', // Como é um site sazonal, muda pouco
      priority: 1, // Prioridade máxima pois é a Home
    },
    // Se tiver outras páginas, adicione aqui. Ex:
    // {
    //   url: `${baseUrl}/sobre`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}