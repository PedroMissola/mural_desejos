'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Search, PenLine, ArrowDown } from "lucide-react"
import Link from "next/link"

export default function Home() {

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen w-full bg-[#050A1F] text-white flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Container Principal com Animação Escalonada */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 z-10"
      >

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-700 rounded-full blur-[240px] -z-10 pointer-events-none" />

        {/* Badge do Topo */}
        <motion.div variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-[#FFEA00] text-xs font-medium tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            Natal 2025
          </span>
        </motion.div>

        {/* Título Principal */}
        {/* Título Principal */}
        <motion.div variants={fadeInUp} className="relative">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mt-2">

            {/* Parte 1: Brilho Branco */}
            <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              Escreva seu{" "}
            </span>

            {/* Parte 2: Brilho Amarelo (Dourado) */}
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

        {/* Parágrafo de Descrição */}
        <motion.div variants={fadeInUp} className="max-w-2xl">
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Envie seus sonhos para o Céu estrelado e veja-os brilhar junto com milhares de outros desejos nesta noite mágica. Sua estrela iluminará o caminho para um novo ano.
          </p>
        </motion.div>

        {/* Botões de Ação */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-8 mt-4">

          {/* Botão Primário (Amarelo) */}
          <Button
            className="bg-[#FFEA00] hover:bg-[#FFEA00] text-slate-950 font-semibold rounded-3xl px-8 h-12 text-base transition-transform hover:scale-105 duration-500"
          >
            <PenLine className="w-4 h-4 mr-1" />
            Escrever Desejo
          </Button>

          {/* Botão Secundário (Outline) */}
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

      {/* Seta indicando scroll (Posicionada na parte inferior) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10"
      >
        <ArrowDown className="w-6 h-6 text-slate-500" />
      </motion.div>

    </main>
  )
}