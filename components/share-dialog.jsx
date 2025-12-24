'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Link as LinkIcon, Copy, ArrowRight, Loader2 } from "lucide-react"
import { searchWishesForShare } from "@/app/actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const colorMap = {
  blue: { fill: "#3B82F6", shadow: "0 0 10px #3B82F6" },
  red: { fill: "#EF4444", shadow: "0 0 10px #EF4444" },
  white: { fill: "#FFFFFF", shadow: "0 0 10px #FFFFFF" },
  green: { fill: "#22C55E", shadow: "0 0 10px #22C55E" },
  yellow: { fill: "#FFC300", shadow: "0 0 10px #FFC300" },
}

// Mini componente para desenhar a estrela igual ao canvas
function MiniStarPreview({ style }) {
  const theme = colorMap[style.color] || colorMap.white
  const isStar = style.starStyle === "star"
  const points = style.points || 5

  if (!isStar) {
    // Renderiza Bolinha
    return (
      <div 
        className="w-8 h-8 rounded-full"
        style={{ 
          backgroundColor: theme.fill, 
          boxShadow: theme.shadow 
        }} 
      />
    )
  }

  // Renderiza Estrela (Cálculo de polígono simplificado para preview)
  const calculatePoints = () => {
    const outer = 50, inner = 20, center = 50
    let str = ""
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outer : inner
      const a = i * (Math.PI / points) - Math.PI / 2
      str += `${center + r * Math.cos(a)},${center + r * Math.sin(a)} `
    }
    return str
  }

  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10 overflow-visible" style={{ filter: `drop-shadow(${theme.shadow})` }}>
      <polygon points={calculatePoints()} fill={theme.fill} />
    </svg>
  )
}

export function ShareDialog({ open, onOpenChange }) {
  const [step, setStep] = useState('search') // search | results
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleSearch = async (formData) => {
    setLoading(true)
    const data = await searchWishesForShare(formData)
    setResults(data)
    setLoading(false)
    setStep('results')
  }

  const handleCopyLink = (id) => {
    const url = `${window.location.origin}/?wishId=${id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!", { description: "Pronto para enviar." })
    onOpenChange(false)
    // Reset após fechar
    setTimeout(() => { setStep('search'); setResults([]); }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A1020]/80 backdrop-blur-[100px] border-slate-800 text-slate-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#FFC300] font-serif text-xl flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Compartilhar Momento
          </DialogTitle>
        </DialogHeader>

        {step === 'search' && (
          <form action={handleSearch} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-slate-500">Nome do Autor</Label>
              <Input name="author" placeholder="Ex: Pedro" className="bg-[#131B33]/50 border-slate-700 text-slate-200" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase text-slate-500">Título do Desejo</Label>
              <Input name="title" placeholder="Ex: Paz" className="bg-[#131B33]/50 border-slate-700 text-slate-200" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#FFC300] text-slate-900 font-bold hover:bg-[#FFD600]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar Estrela"}
            </Button>
          </form>
        )}

        {step === 'results' && (
          <div className="space-y-4 pt-2">
             <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400">Selecione para copiar:</p>
                <button onClick={() => setStep('search')} className="text-xs text-[#FFC300] hover:underline">Nova busca</button>
             </div>
             
             <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {results.length === 0 ? (
                    <p className="text-center text-slate-500 py-8 text-sm">Nenhuma estrela encontrada com esses dados.</p>
                ) : (
                    results.map((wish) => (
                        <div 
                            key={wish.id}
                            onClick={() => handleCopyLink(wish.id)}
                            className="group flex items-center gap-4 p-3 rounded-lg border border-slate-800 bg-[#131B33]/30 hover:bg-[#131B33] hover:border-[#FFC300]/50 transition-all cursor-pointer"
                        >
                            {/* Visual Preview da Estrela */}
                            <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-black/20 rounded-md border border-white/5">
                                <MiniStarPreview style={wish.style} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-[#FFC300] truncate">{wish.title}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wide mt-1">
                                    <span className="truncate max-w-[80px]">{wish.author}</span>
                                    <span>•</span>
                                    <span>X: {wish.x} / Y: {wish.y}</span>
                                </div>
                                <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic opacity-70">
                                    {wish.description.split(' ').slice(0, 5).join(' ')}...
                                </p>
                            </div>

                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy className="w-4 h-4 text-[#FFC300]" />
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}