'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Search, PenLine, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { WishForm } from "@/components/wish-form"
import { StarrySky } from "@/components/starry-sky"
import Snowfall from "react-snowfall"
import { Toaster } from "sonner"
import { ShareDialog } from "@/components/share-dialog" // <--- IMPORTANTE

export default function HomeClient() {
  const [isWishFormOpen, setIsWishFormOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false) // <--- ESTADO DO MODAL

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
    <main className="w-full bg-[#0B1224] overflow-x-hidden relative">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 16, 32, 0.8)', // Cor #0A1020 com transparência
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#E2E8F0',
            borderRadius: '12px',
          },
          classNames: {
            toast: 'group toast group-[.toaster]:bg-[#0A1020]/90 group-[.toaster]:text-slate-200 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-slate-400',
            actionButton: 'group-[.toast]:bg-slate-900',
            cancelButton: 'group-[.toast]:bg-slate-100',
          }
        }}
      />

      <div className="fixed inset-0 z-50 pointer-events-none">
        <Snowfall snowflakeCount={60} color="#FFFFFF" style={{ opacity: 0.15 }} />
      </div>

      {/* MODAIS */}
      <WishForm open={isWishFormOpen} onOpenChange={setIsWishFormOpen} />
      <ShareDialog open={isShareOpen} onOpenChange={setIsShareOpen} />

      <section className="h-screen w-full flex flex-col items-center justify-center relative px-4 z-10 bg-[#0B1224]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-700 rounded-full blur-[240px] -z-10 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 z-10"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-[#FFC300] text-xs font-medium tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              Natal 2025
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <h1 className="font-serif text-white text-5xl md:text-7xl font-bold tracking-tight mt-2">
              <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Escreva seu </span>
              <span className="text-[#FFC300] drop-shadow-[0_0_5px_rgba(255,187,0,0.5)]">Desejo</span>
            </h1>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-xl md:text-lg text-slate-200 font-light">Torne-se uma estrela no céu de Natal</h2>
            <p className="text-lg md:text-sm text-slate-400 font-light mt-2 max-w-2xl mx-auto">
              Envie seus sonhos para o Céu estrelado e veja-os brilhar junto com milhares de outros desejos nesta noite mágica.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-8 mt-4">
            <Button
              className="bg-[#FFC300] hover:bg-[#FFC300] text-slate-950 font-semibold rounded-3xl px-8 h-12 text-base transition-transform hover:scale-105 duration-500"
              onClick={() => setIsWishFormOpen(true)}
            >
              <PenLine className="w-4 h-4 mr-1" />
              Escrever Desejo
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white rounded-3xl px-8 h-12 text-base bg-transparent duration-500"
              onClick={scrollToVillage}
            >
              <Search className="w-4 h-4 mr-1" />
              Achar Desejo
            </Button>
          </motion.div>

          {/* BOTÃO DE COMPARTILHAR CONECTADO */}
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-xs text-slate-500 underline decoration-slate-600 hover:text-[#FFC300] transition-colors mt-2 block bg-transparent border-none cursor-pointer"
            >
              Compartilhar este momento
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-20 cursor-pointer p-2"
          onClick={scrollToVillage}
        >
          <ArrowDown className="w-6 h-6 text-slate-500 hover:text-[#FFC300] transition-colors" />
        </motion.div>
      </section>

      <section id="vila-natal" className="h-[200vh] w-full relative bg-[#0B1224] overflow-hidden border-t border-slate-900/50">
        <div className="absolute inset-0 z-0">
          <StarrySky />
        </div>
        <div className="absolute bottom-0 w-full h-[60%] z-10 pointer-events-none">
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