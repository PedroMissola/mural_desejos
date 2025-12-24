'use client'

import { useState, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createWish } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Send, Settings2, Star, Circle, Minus, Plus, Loader2, Copy, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      disabled={pending} 
      type="submit" 
      className="w-full bg-[#FFC300] hover:bg-[#FFD600] text-slate-950 font-bold h-12 text-base rounded-xl mt-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,234,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
      ) : (
        <><Send className="w-4 h-4 mr-2" /> Enviar Desejo</>
      )}
    </Button>
  )
}

export function WishForm({ open, onOpenChange, onSuccess }) {
  const router = useRouter()

  // Estados Visuais com Defaults Seguros
  const [starColor, setStarColor] = useState("yellow")
  const [starStyle, setStarStyle] = useState("star")
  const [starSize, setStarSize] = useState([50])
  const [starPoints, setStarPoints] = useState(5)
  const [animationType, setAnimationType] = useState("pulse")

  // Estado da Tela de Sucesso
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdWishId, setCreatedWishId] = useState(null)

  const [state, formAction] = useActionState(createWish, null)

  // Recupera erro visual e Sucesso
  useEffect(() => {
    if (state?.success && state?.wishId) {
      // SUCESSO: Não fecha o modal, mostra a tela de link
      const timer = setTimeout(() => {
        setCreatedWishId(state.wishId)
        setShowSuccess(true)
        toast.success("Estrela criada com sucesso!")
      }, 0)
      return () => clearTimeout(timer)
    } else if (state?.success === false) {
      toast.error("Erro ao enviar", { description: state.message || "Verifique os dados." })
    }
  }, [state])

  // Resetar visual ao fechar totalmente
  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setShowSuccess(false)
        setCreatedWishId(null)
      }, 300)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?wishId=${createdWishId}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado para área de transferência")
  }

  const handleVisitStar = () => {
    // 1. Fecha o modal
    handleOpenChange(false)
    
    // 2. Navega para a URL (isso dispara o useEffect do StarrySky)
    router.push(`/?wishId=${createdWishId}`)
    
    // 3. Callback opcional
    if (onSuccess) onSuccess(createdWishId)
  }

  const colors = [
    { id: "blue", value: "#3B82F6" },
    { id: "red", value: "#EF4444" },
    { id: "white", value: "#FFFFFF" },
    { id: "green", value: "#22C55E" },
    { id: "yellow", value: "#FFC300" },
  ]

  const animations = [
    { id: "pulse", label: "Pulsar", animate: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 2 } } },
    { id: "bounce", label: "Pular", animate: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 1.5 } } },
    { id: "spin", label: "Girar", animate: { rotate: 360, transition: { repeat: Infinity, duration: 4, ease: "linear" } } },
    { id: "shimmer", label: "Brilhar", animate: { opacity: [1, 0.4, 1], transition: { repeat: Infinity, duration: 1.2 } } },
  ]

  const handlePointsChange = (operation) => {
    if (operation === 'inc' && starPoints < 12) setStarPoints(prev => prev + 1)
    if (operation === 'dec' && starPoints > 4) setStarPoints(prev => prev - 1)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        data-lenis-prevent 
        className="sm:max-w-150 max-h-[90vh] overflow-y-auto bg-[#0A1020] backdrop-blur-[100px] border-slate-800 text-slate-200 p-0 gap-0 shadow-2xl outline-none"
      >
        <div className="p-6 pb-2 sticky top-0 bg-[#0A1020] backdrop-blur-md z-20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-serif text-slate-100 select-none">
              {/* <span className="text-[#FFC300]"><Settings2 className="w-5 h-5" /></span>
              {showSuccess ? "Desejo Realizado!" : "Seu Desejo"} */}
            </DialogTitle>
          </DialogHeader>
        </div>

        {showSuccess ? (
          <div className="p-8 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
             <div>
                <Star className="w-16 h-16 text-[#FFC300] fill-current animate-pulse" />
             </div>
             
             <div>
                <h3 className="text-2xl font-serif text-white">Sua estrela nasceu!</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                   Copie o Link e envie para seus amigos, familiares e pessoas importantes para voce, mostre a todos o seu desejos para esse Natal.
                </p>
             </div>

             <div className="w-full bg-[#131B33] p-1.5 pl-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-500 truncate flex-1 font-mono">
                   {`${typeof window !== 'undefined' ? window.location.origin : ''}/?wishId=${createdWishId}`}
                </span>
                <Button size="sm" onClick={handleCopyLink} className="bg-slate-800 hover:bg-slate-700 text-slate-200">
                   <Copy className="w-3 h-3 mr-2" /> Copiar
                </Button>
             </div>

             <Button onClick={handleVisitStar} className="w-full bg-[#FFC300] hover:bg-[#FFD600] text-slate-900 font-bold h-12 rounded-xl text-base">
                Ver minha estrela agora <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </div>
        ) : (
          /* FORMULÁRIO PADRÃO */
          <form action={formAction} className="p-6 pt-2 space-y-6">
            {/* Inputs Ocultos com Fallbacks para evitar erro de validação */}
            <input type="hidden" name="style_color" value={starColor || "yellow"} />
            <input type="hidden" name="style_type" value={starStyle || "star"} />
            <input type="hidden" name="style_size" value={starSize[0] || 50} />
            <input type="hidden" name="style_points" value={starPoints || 5} />
            <input type="hidden" name="style_animation" value={animationType || "pulse"} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author" className="text-slate-400 text-xs uppercase tracking-wider">Autor</Label>
                <Input name="author" defaultValue={state?.inputs?.author} placeholder="Seu nome" className="bg-[#131B33]/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus-visible:border-[#FFC300]/50" required />
                {state?.errors?.author && <p className="text-red-400 text-[10px]">{state.errors.author}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-400 text-xs uppercase tracking-wider">Titulo</Label>
                <Input name="title" defaultValue={state?.inputs?.title} placeholder="Ex: Paz Mundial" className="bg-[#131B33]/50 border-slate-700/50 text-slate-200 placeholder:text-slate-600 focus-visible:border-[#FFC300]/50" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-slate-400 text-xs uppercase tracking-wider">Descrição</Label>
              <Textarea name="description" defaultValue={state?.inputs?.description} placeholder="Conte seu desejo..." className="bg-[#131B33]/50 border-slate-700/50 text-slate-200 min-h-20 resize-none focus-visible:border-[#FFC300]/50" required />
            </div>

            <div className="h-px w-full bg-slate-800/50" />

            {/* Personalização */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium text-slate-100 select-none">
                <Settings2 className="w-5 h-5 text-[#FFC300]" />
                <h3>Personalização</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna Esquerda */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-slate-400 select-none text-xs uppercase tracking-wider">Cor</Label>
                    <div className="flex gap-3">
                      {colors.map((color) => (
                        <motion.button
                          key={color.id}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setStarColor(color.id)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all border-2 border-transparent outline-none ring-0 ring-offset-2 ring-offset-[#0B1224]",
                            starColor === color.id && "border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-transparent"
                          )}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 select-none"><span>Tamanho</span></div>
                    <div className="flex items-center gap-3">
                        <Star className="w-3 h-3 text-slate-600" />
                        <Slider defaultValue={[50]} value={starSize} max={100} step={1} onValueChange={setStarSize} className="cursor-pointer flex-1" />
                        <Star className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Coluna Direita */}
                <div className="space-y-3">
                  <Label className="text-slate-400 select-none text-xs uppercase tracking-wider">Formato</Label>
                  <div className="flex flex-col gap-2">
                     <motion.div onClick={() => setStarStyle("circle")} className={cn("flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors", starStyle === "circle" ? "bg-[#1A233F] border-[#FFC300]" : "bg-[#131B33]/50 border-slate-800")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", starStyle === "circle" ? "bg-[#FFC300] text-black" : "bg-slate-800 text-slate-400")}><Circle className="w-4 h-4 fill-current" /></div>
                        <p className={cn("text-xs font-medium", starStyle === "circle" ? "text-[#FFC300]" : "text-slate-200")}>Círculo</p>
                     </motion.div>
                     <motion.div onClick={() => setStarStyle("star")} className={cn("flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors", starStyle === "star" ? "bg-[#1A233F] border-[#FFC300]" : "bg-[#131B33]/50 border-slate-800")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", starStyle === "star" ? "bg-[#FFC300] text-black" : "bg-slate-800 text-slate-400")}><Star className="w-4 h-4 fill-current" /></div>
                        <p className={cn("text-xs font-medium", starStyle === "star" ? "text-[#FFC300]" : "text-slate-200")}>Estrela</p>
                     </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {starStyle === "star" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-400">Pontas</span>
                          <div className="flex items-center gap-2 bg-[#131B33]/50 rounded-md p-0.5 border border-slate-800">
                            <button type="button" onClick={() => handlePointsChange('dec')} className="w-5 h-5 flex items-center justify-center text-slate-400" disabled={starPoints <= 4}><Minus className="w-3 h-3" /></button>
                            <span className="text-xs text-[#FFC300] font-mono w-4 text-center">{starPoints}</span>
                            <button type="button" onClick={() => handlePointsChange('inc')} className="w-5 h-5 flex items-center justify-center text-slate-400" disabled={starPoints >= 12}><Plus className="w-3 h-3" /></button>
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Posição (Auto) e Animação */}
              <div className="grid grid-cols-[100px_1fr] gap-6 pt-2">
                 <div className="space-y-2">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider">Posição</Label>
                     <div className="flex gap-2">
                         <Input name="posX" placeholder="X" className="h-8 text-[10px] bg-[#131B33]/50 border-slate-800" />
                         <Input name="posY" placeholder="Y" className="h-8 text-[10px] bg-[#131B33]/50 border-slate-800" />
                     </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Animação</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {animations.map((anim) => (
                            <motion.button key={anim.id} type="button" onClick={() => setAnimationType(anim.id)} className={cn("h-8 rounded-md border text-[10px] font-medium transition-colors flex items-center justify-center gap-1", animationType === anim.id ? "bg-[#1A233F] border-[#FFC300] text-[#FFC300]" : "bg-[#131B33]/50 border-slate-800 text-slate-400 hover:bg-slate-800")}>
                                <motion.div animate={anim.animate}><Star className="w-3 h-3 fill-current" /></motion.div>
                                <span className="hidden sm:inline">{anim.label}</span>
                            </motion.button>
                        ))}
                    </div>
                 </div>
              </div>
            </div>

            <SubmitButton />
            
            {!state?.success && state?.message && (
               <p className="text-center text-xs text-red-400 mt-2 bg-red-500/10 py-2 rounded border border-red-500/20">{state.message}</p>
            )}
            <p className="text-center text-[10px] text-slate-600 select-none pb-2">Ao Enviar Um Desejo Voce Concorda Com As Regras.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}