import { Inter, Averia_Serif_Libre } from "next/font/google";
import "./globals.css";

// 1. Configurando a Inter (para textos gerais)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

// 2. Configurando a Averia Serif Libre (para títulos)
const averia = Averia_Serif_Libre({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700"],
  variable: "--font-averia" 
});

// 3. Configuração Completa de SEO e Redes Sociais
export const metadata = {
  // Título base
  title: {
    default: "Natal 2025 - Escreva seu Desejo",
    template: "%s | Natal 2025"
  },
  
  description: "Envie seus sonhos para o Céu estrelado e veja-os brilhar junto com milhares de outros desejos nesta noite mágica.",
  
  keywords: ["Natal", "Desejos", "2025", "Ano Novo", "Mural Digital", "Sonhos"],
  
  authors: [{ name: "Seu Nome" }],
  creator: "Seu Nome",
  
  metadataBase: new URL("https://natal2025-seuexemplo.vercel.app"), 

  openGraph: {
    title: "Natal 2025 - Escreva seu Desejo",
    description: "Torne-se uma estrela no céu de Natal. Deixe seu desejo brilhar!",
    url: "https://natal2025-seuexemplo.vercel.app",
    siteName: "Natal 2025",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Natal 2025 - O céu dos desejos",
      },
    ],
  },

  // Twitter Cards (Para o X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Natal 2025 - Escreva seu Desejo",
    description: "Torne-se uma estrela no céu de Natal.",
    images: ["/og-image.jpg"],
  },

  // Ícones (Favicon)
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/faviconfavicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} ${averia.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}