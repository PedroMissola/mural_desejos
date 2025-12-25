'use client'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { getWishes, getWishById } from "@/app/actions"
import { StarShape, CircleShape } from "./star-shapes"
import { Loader2, Plus, Share2, X, User, Calendar } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"

export function StarrySky() {
  const [wishes, setWishes] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [selectedWish, setSelectedWish] = useState(null)
  const [highlightedWishId, setHighlightedWishId] = useState(null)

  const searchParams = useSearchParams()
  const transformRef = useRef(null)
  const initialized = useRef(false)

  // 1. Carga Inicial dos Desejos
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const loadInitialData = async () => {
      setLoading(true)
      try {
        const initialWishes = await getWishes(1, 50)
        setWishes(initialWishes)
        if (initialWishes.length === 0) setHasMore(false)
      } catch (error) {
        console.error("Erro", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  // 2. Monitora URL para Deep Linking
  useEffect(() => {
    const focusOnWish = async () => {
      const wishId = searchParams.get("wishId")
      if (!wishId) return

      let target = wishes.find(w => String(w.id) === String(wishId))

      if (!target) {
        try {
          target = await getWishById(wishId)
          if (target) {
            setWishes(prev => {
                if (prev.some(w => w.id === target.id)) return prev
                return [...prev, target]
            })
          }
        } catch (err) {
          console.error("Erro ao buscar desejo específico", err)
        }
      }

      if (target && transformRef.current) {
        setHighlightedWishId(target.id)
        
        setTimeout(() => {
             const { x, y } = target
             transformRef.current.setTransform(
                -x * 2.5 + (window.innerWidth / 2), 
                -y * 2.5 + (window.innerHeight / 2), 
                2.5, 
                1500
             )
             toast.success("Estrela encontrada!", { 
                description: "Sua estrela está brilhando na tela." 
             })
        }, 100)

        setTimeout(() => setHighlightedWishId(null), 12000)
      }
    }

    focusOnWish()
  }, [searchParams, wishes])

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
        window.history.pushState(null, '', window.location.pathname)
    }
  }

  const handleShare = () => {
    if (!selectedWish) return
    const url = `${window.location.origin}/?wishId=${selectedWish.id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!", { description: "Pronto para enviar." })
  }

  return (
    <>
      <div className="w-screen h-screen bg-[#0B1224] cursor-grab active:cursor-grabbing fixed inset-0 touch-none">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          limitToBounds={false}
          centerOnInit={true}
          wheel={{ step: 0.1, activationKeys: ['Control'] }}
          pinch={{ disabled: false }}
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
                    style={{ left: wish.x, top: wish.y }}
                    onClick={() => handleStarClick(wish)}
                    isHighlighted={highlightedWishId === wish.id}
                  />
                )
              })}

            </div>
          </TransformComponent>
        </TransformWrapper>

        {hasMore && (
          <div className="absolute bottom-12 left-8 z-50 pointer-events-none">
            <button onClick={handleLoadMore} disabled={loading} className="pointer-events-auto flex items-center gap-2 bg-[#0A1020]/80 backdrop-blur-md text-slate-200 px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl disabled:opacity-50">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              {loading ? "Buscando..." : "Explorar Universo"}
            </button>
          </div>
        )}
      </div>

      <AlertDialog open={!!selectedWish} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg w-[90%] outline-none focus:outline-none ring-0 flex justify-center">
            
            <div className="relative w-full rounded-[12px] px-8 py-4 text-white bg-[#0A1020]/50">
                
                <button 
                    onClick={() => handleCloseModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    
                    <div className="shrink-0 pt-1">
                        {selectedWish && (() => {
                            const Component = selectedWish.style.starStyle === "star" ? StarShape : CircleShape
                            return (
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <Component 
                                        {...selectedWish.style}
                                        size={40}
                                        style={{ position: 'relative', left: 0, top: 0, transform: 'none', opacity: 1 }}
                                        onClick={() => {}} 
                                    />
                                </div>
                            )
                        })()}
                    </div>

                    <div className="text-left space-y-3 w-full">
                        
                        <h2 className="text-2xl font-bold tracking-tight text-white leading-none font-sans">
                            {selectedWish?.title}
                        </h2>

                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2 font-sans">
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-200" />
                                {selectedWish?.author || "Anônimo"}
                            </span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-200" />
                                {selectedWish && new Date(selectedWish.date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="h-px w-full bg-slate-700" />

                        <div className="pt-1">
                            <p className="text-lg text-gray-200 leading-relaxed font-light font-sans">
                                "{selectedWish?.description}"
                            </p>
                        </div>

                        <div className="pt-2">
                            <button 
                                onClick={handleShare}
                                className="text-xs text-gray-500 hover:text-[#FFD700] flex items-center gap-2 transition-colors group font-sans font-medium"
                            >
                                <Share2 className="w-4 h-4" />
                                COMPARTILHAR
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
