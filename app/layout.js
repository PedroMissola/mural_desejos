import { Inter, Averia_Serif_Libre } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./smooth-scroll"; // Importando o componente que criamos

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const averia = Averia_Serif_Libre({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700"],
  variable: "--font-averia" 
});

// URL do seu site (substitua quando fizer deploy)
const BASE_URL = "https://natal2025-seuexemplo.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  
  title: {
    default: "Natal 2025 - Escreva seu Desejo",
    template: "%s | Natal 2025"
  },
  
  description: "Envie seus sonhos para o Céu estrelado e veja-os brilhar junto com milhares de outros desejos nesta noite mágica.",
  
  keywords: ["Natal", "Desejos", "2025", "Ano Novo", "Mural Digital", "Sonhos"],
  
  authors: [{ name: "Pedro Escobar" }], // Seu nome atualizado
  creator: "Pedro Escobar",
  
  openGraph: {
    title: "Natal 2025 - Escreva seu Desejo",
    description: "Torne-se uma estrela no céu de Natal. Deixe seu desejo brilhar!",
    url: BASE_URL,
    siteName: "Natal 2025",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Certifique-se de ter essa imagem em public/
        width: 1200,
        height: 630,
        alt: "Natal 2025 - O céu dos desejos",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Natal 2025 - Escreva seu Desejo",
    description: "Torne-se uma estrela no céu de Natal.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} ${averia.variable} antialiased`}>
        {/* Envolvendo a aplicação com o Scroll Isolado */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}