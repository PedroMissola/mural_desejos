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
  AlertDialogCancel,
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

  // 1. Carga Inicial + Deep Linking
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const loadInitialData = async () => {
      setLoading(true)
      try {
        const initialWishes = await getWishes(1, 50)
        let currentWishes = [...initialWishes]

        const wishId = searchParams.get("wishId")

        if (wishId) {
          let target = currentWishes.find(w => String(w.id) === String(wishId))

          if (!target) {
            target = await getWishById(wishId)
            if (target) currentWishes.push(target)
          }

          setWishes(currentWishes)

          if (target && transformRef.current) {
            setHighlightedWishId(target.id)
            setTimeout(() => {
              const { x, y } = target
              transformRef.current.setTransform(-x + (window.innerWidth / 2), -y + (window.innerHeight / 2), 2.5, 1500)
              toast.success("Estrela encontrada!", { description: "Vá para baixo e clique na estrela brilhante para ler o desejo." })
            }, 500)
            setTimeout(() => setHighlightedWishId(null), 12000)
          }
        } else {
          setWishes(currentWishes)
        }

        if (initialWishes.length === 0) setHasMore(false)
      } catch (error) {
        console.error("Erro", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [searchParams])

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
    if (!open) setSelectedWish(null)
  }

  const handleShare = () => {
    if (!selectedWish) return
    const url = `${window.location.origin}/?wishId=${selectedWish.id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!", { description: "Pronto para enviar." })
  }

  return (
    <>
      <div className="w-screen h-screen bg-[#0B1224] cursor-grab active:cursor-grabbing fixed inset-0">
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

              {/* REMOVIDO: Texto 2026 de fundo */}

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
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="pointer-events-auto flex items-center gap-2 bg-[#0A1020]/80 backdrop-blur-md text-slate-200 px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              {loading ? "Buscando..." : "Explorar Universo"}
            </button>
          </div>
        )}
      </div>

      <AlertDialog open={!!selectedWish} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="bg-[#0A1020]/50 backdrop-blur-md border border-slate-900 py-12 px-10 max-w-2xl">
          <button
            onClick={() => handleCloseModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CONTAINER PRINCIPAL (FLEX ROW) */}
          <div className="flex flex-row gap-6 items-start">

            {/* --- COLUNA 2: TODO O CONTEÚDO DE TEXTO (DIREITA) --- */}
            <div className="text-left space-y-3 w-full pt-1">

              {/* Título (Diretamente na coluna da direita, sem div extra em volta) */}
              <h2 className="text-2xl font-bold tracking-tight text-[#FFC300] leading-none font-serif">
                Desejo #{selectedWish?.id || "Anônimo"} - {selectedWish?.title}
              </h2>

              {/* Metadados */}
              <div className="flex gap-4 text-sm font-medium text-slate-200 uppercase tracking-wider items-center font-sans">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {selectedWish?.author || "Anônimo"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedWish && new Date(selectedWish.date).toLocaleDateString()}
                </span>
              </div>

              <div className="h-px w-full bg-slate-800" />

              <div className="pt-1">
                <p className="text-lg text-slate-200 leading-relaxed font-light font-sans">
                  {selectedWish?.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleShare}
                  className="text-xs text-slate-500 hover:text-[#FFC300] flex items-center gap-2 transition-colors group font-sans font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  COMPARTILHAR
                </button>
              </div>

            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}