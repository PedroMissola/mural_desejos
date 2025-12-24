'use client'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { getWishes, getWishById } from "@/app/actions"
import { StarShape, CircleShape } from "./star-shapes"
import { Loader2, Plus, Share2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter
} from "@/components/ui/alert-dialog"

export function StarrySky() {
  const [wishes, setWishes] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  
  // ESTADOS DO MODAL E NAVEGAÇÃO
  const [selectedWish, setSelectedWish] = useState(null)
  
  // HOOKS
  const searchParams = useSearchParams()
  const transformRef = useRef(null)
  
  // Ref para controlar se a inicialização já ocorreu e evitar loop do ESLint
  const initialized = useRef(false)

  // 1. Efeito de Carga Inicial + Deep Linking
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const loadInitialData = async () => {
      setLoading(true)
      
      try {
        // Carrega lote inicial
        const initialWishes = await getWishes(1, 50)
        let currentWishes = [...initialWishes]
        
        // Verifica Deep Linking (ID na URL)
        const wishId = searchParams.get("wishId")
        
        if (wishId) {
          let target = currentWishes.find(w => String(w.id) === String(wishId))
          
          // Se não estiver no lote inicial, busca individualmente
          if (!target) {
            target = await getWishById(wishId)
            if (target) {
                currentWishes.push(target)
            }
          }

          setWishes(currentWishes)

          // Zoom na estrela alvo
          if (target && transformRef.current) {
            setSelectedWish(target)
            setTimeout(() => {
                 const { x, y } = target
                 // Como o canvas agora é base 0x0 (centro), o cálculo é direto
                 // Invertemos X e Y para centralizar o viewport no objeto
                 transformRef.current.setTransform(-x + (window.innerWidth / 2), -y + (window.innerHeight / 2), 2, 1000)
            }, 500)
          }
        } else {
            setWishes(currentWishes)
        }
        
        if (initialWishes.length === 0) setHasMore(false)
      } catch (error) {
        console.error("Erro ao carregar estrelas", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [searchParams]) // Dependência apenas do searchParams é segura aqui

  const handleLoadMore = async () => {
    if (loading) return
    setLoading(true)
    const nextPage = page + 1
    const newWishes = await getWishes(nextPage, 50)
    
    if (newWishes.length === 0) {
      setHasMore(false)
      toast("Você explorou todo o universo conhecido.")
    } else {
      setWishes(prev => {
        const newIds = new Set(newWishes.map(w => w.id))
        return [...prev.filter(w => !newIds.has(w.id)), ...newWishes]
      })
      setPage(nextPage)
    }
    setLoading(false)
  }

  const handleStarClick = (wish) => {
    setSelectedWish(wish)
    window.history.pushState(null, '', `?wishId=${wish.id}`)
  }

  const handleCloseModal = (open) => {
    if (!open) {
        setSelectedWish(null)
        const newUrl = window.location.pathname
        window.history.pushState(null, '', newUrl)
    }
  }

  const handleShare = () => {
    if (!selectedWish) return
    const url = `${window.location.origin}/?wishId=${selectedWish.id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!", {
        description: "Compartilhe essa estrela com alguém especial."
    })
  }

  return (
    <>
      {/* Container Infinito Real:
          1. w-screen h-screen: Ocupa a tela toda.
          2. bg-[#0B1224]: A cor de fundo fica aqui, então não importa onde você vá, sempre tem fundo.
      */}
      <div className="w-screen h-screen bg-[#0B1224] cursor-grab active:cursor-grabbing fixed inset-0">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1} // Permite afastar muito para ver o "infinito"
          maxScale={5}
          limitToBounds={false} // PERMITE PAN INFINITO
          centerOnInit={true}
          wheel={{ step: 0.1, activationKeys: ['Control'] }}
          pinch={{ disabled: false }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
            
            <div className="relative w-0 h-0 flex items-center justify-center overflow-visible">

              {wishes.map((wish) => {
                const Component = wish.style.starStyle === "star" ? StarShape : CircleShape
                return (
                  <Component 
                    key={wish.id}
                    title={wish.title}
                    {...wish.style}
                    // As coordenadas vêm do banco. Se forem muito grandes, 
                    // o canvas infinito as renderiza sem cortar.
                    style={{ left: wish.x, top: wish.y }} 
                    onClick={() => handleStarClick(wish)}
                  />
                )
              })}

            </div>

          </TransformComponent>
        </TransformWrapper>

        {/* Botão de Load More Flutuante */}
        {hasMore && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <button 
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="pointer-events-auto flex items-center gap-2 bg-[#0A1020]/80 backdrop-blur-md text-slate-200 px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Plus className="w-3 h-3" />}
                    {loading ? "Buscando..." : "Explorar Universo"}
                </button>
            </div>
        )}
      </div>

      <AlertDialog open={!!selectedWish} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="bg-[#0A1020]/50 backdrop-blur-[100px] border-slate-800 text-slate-200 border max-w-md shadow-2xl">
          <AlertDialogHeader>
            <div className="flex justify-between items-start">
                <AlertDialogTitle className="text-2xl font-serif text-[#FFC300]">
                {selectedWish?.title}
                </AlertDialogTitle>
            </div>
            
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-2">
                <span>Autor: {selectedWish?.author}</span>
                <span className="text-slate-700">•</span>
                <span>{selectedWish && new Date(selectedWish.date).toLocaleDateString()}</span>
            </div>
            
            <AlertDialogDescription className="text-slate-300 text-lg font-light leading-relaxed border-t border-slate-700/50 pt-4 mt-2">
               {selectedWish?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="flex-row gap-2 sm:justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
            <button 
                onClick={handleShare}
                className="text-xs text-slate-400 hover:text-[#FFC300] flex items-center gap-2 transition-colors group"
            >
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Compartilhar
            </button>

            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white m-0">
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}