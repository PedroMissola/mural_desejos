import { getWishById } from "@/app/actions"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://natal2025-seuexemplo.vercel.app";

export async function constructMetadata({ searchParams }) {
  const { wishId } = await searchParams;

  const defaultMeta = {
    title: "Natal 2025 - O Céu dos Desejos",
    description: "Escreva seu desejo e veja-o brilhar no céu.",
  };

  if (!wishId) return defaultMeta;

  const wish = await getWishById(wishId);

  if (!wish) return defaultMeta;

  const ogImageUrl = `${BASE_URL}/og-image/${wish.id}`;

  return {
    title: `O Desejo de ${wish.author}`,
    description: `"${wish.description}" - Veja este desejo brilhando no céu de Natal.`,
    
    openGraph: {
      title: `O Desejo de ${wish.author}`,
      description: wish.description,
      url: `${BASE_URL}/?wishId=${wish.id}`,
      images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Desejo de Natal de ${wish.author}`,
      }],
    },
    
    twitter: {
      card: "summary_large_image",
      title: `Desejo de ${wish.author}`,
      description: wish.description,
      images: [ogImageUrl],
    },
  };
}