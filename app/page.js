'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Search, PenLine, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {

  // Função para rolar suavemente até a vila
  const scrollToVillage = () => {
    const villageSection = document.getElementById('vila-natal');
    if (villageSection) {
      villageSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main className="w-full bg-[#0B1224] overflow-x-hidden">

      {/* SEÇÃO 1: HERO */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative px-4">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.3 } }
          }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 z-10"
        >

          {/* Seu Glow Slate Original */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-700 rounded-full blur-[240px] -z-10 pointer-events-none" />

          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-[#FFEA00] text-xs font-medium tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              Natal 2025
            </span>
          </motion.div>

          {/* Título Principal */}
          <motion.div variants={fadeInUp} className="relative">
            <h1 className="font-serif text-white text-5xl md:text-7xl font-bold tracking-tight mt-2">
              <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                Escreva seu{" "}
              </span>
              <span className="text-[#FFEA00] drop-shadow-[0_0_5px_rgba(255,187,0,0.5)]">
                Desejo
              </span>
            </h1>
          </motion.div>

          {/* Subtítulo */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-lg md:text-xl text-slate-200 font-light">
              Torne-se uma estrela no céu de Natal
            </h2>
          </motion.div>

          {/* Parágrafo */}
          <motion.div variants={fadeInUp} className="max-w-2xl">
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Envie seus sonhos para o Céu estrelado e veja-os brilhar junto com milhares de outros desejos nesta noite mágica. Sua estrela iluminará o caminho para um novo ano.
            </p>
          </motion.div>

          {/* Botões de Ação */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-8 mt-4">

            <Button
              className="bg-[#FFEA00] hover:bg-[#FFEA00] text-slate-950 font-semibold rounded-3xl px-8 h-12 text-base transition-transform hover:scale-105 duration-500"
            >
              <PenLine className="w-4 h-4 mr-1" />
              Escrever Desejo
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white rounded-3xl px-8 h-12 text-base bg-transparent duration-500"
            >
              <Search className="w-4 h-4 mr-1" />
              Achar Desejo
            </Button>

          </motion.div>

          {/* Link de Compartilhar */}
          <motion.div variants={fadeInUp}>
            <Link href="#" className="text-xs text-slate-500 underline decoration-slate-600 hover:text-[#FFEA00] transition-colors mt-2 block">
              Compartilhar este momento
            </Link>
          </motion.div>

        </motion.div>

        {/* Seta com funcionalidade de Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-20 cursor-pointer p-2"
          onClick={scrollToVillage}
        >
          <ArrowDown className="w-6 h-6 text-slate-500 hover:text-[#FFEA00] transition-colors" />
        </motion.div>

      </section>

      {/* SEÇÃO 2: VILAREJO */}
      <section id="vila-natal" className="h-270 w-full relative flex flex-col justify-end bg-[#0B1224]">

        {/* Container da imagem */}
        <div className="relative w-full h-full">
          <Image
            src="/village.png"
            alt="Vilarejo de Natal"
            fill
            priority
            quality={100}
            className="object-contain object-bottom"
            sizes="100vw"
          />
        </div>

      </section>

    </main>
  )
}