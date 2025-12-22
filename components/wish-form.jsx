'use client'

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { createWish } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Send, Settings2, Star, Circle, Minus, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Botão de Submit separado
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      disabled={pending} 
      type="submit" 
      className="w-full bg-[#FFEA00] hover:bg-[#FFD600] text-slate-950 font-bold h-12 text-base rounded-xl mt-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,234,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 mr-2" />
          Enviar Desejo
        </>
      )}
    </Button>
  )
}

export function WishForm({ open, onOpenChange }) {
  // Estados Visuais
  const [starColor, setStarColor] = useState("yellow")
  const [starStyle, setStarStyle] = useState("star")
  const [starSize, setStarSize] = useState([50])
  const [starPoints, setStarPoints] = useState(5)
  const [animationType, setAnimationType] = useState("pulse")

  const [state, formAction] = useFormState(createWish, null)

  // 1. Recuperar Estados Visuais em caso de erro (para não resetar slider, cor, etc)
  useEffect(() => {
    if (state?.inputs?.style) {
        const s = state.inputs.style
        if (s.color) setStarColor(s.color)
        if (s.starStyle) setStarStyle(s.starStyle)
        if (s.size) setStarSize([s.size])
        if (s.points) setStarPoints(s.points)
        if (s.animation) setAnimationType(s.animation)
    }
  }, [state])

  // 2. Fechar modal APENAS se sucesso
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
      // Removi os resets aqui. Se você abrir o modal de novo, ele pode estar com os dados antigos
      // ou limpo dependendo se o componente desmontou.
      // Se quiser limpar explicitamente ao fechar com sucesso, descomente abaixo:
      // setStarColor("yellow"); setAnimationType("pulse");
    }
  }, [state, onOpenChange])

  const colors = [
    { id: "blue", value: "#3B82F6" },
    { id: "red", value: "#EF4444" },
    { id: "white", value: "#FFFFFF" },
    { id: "green", value: "#22C55E" },
    { id: "yellow", value: "#FFEA00" },
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        data-lenis-prevent 
        className="sm:max-w-150 max-h-[85vh] overflow-y-auto bg-[#0B1224] border-slate-800 text-slate-100 p-0 gap-0 shadow-2xl outline-none"
      >
        <div className="p-6 pb-2 sticky top-0 bg-[#0B1224] z-20 border-b border-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-serif text-slate-100 select-none">
              <span className="text-[#FFEA00]"><Settings2 className="w-5 h-5" /></span>
              Seu Desejo
            </DialogTitle>
          </DialogHeader>
        </div>

        <form action={formAction} className="p-6 pt-2 space-y-6">
          
          {/* Inputs Ocultos */}
          <input type="hidden" name="style_color" value={starColor} />
          <input type="hidden" name="style_type" value={starStyle} />
          <input type="hidden" name="style_size" value={starSize[0]} />
          <input type="hidden" name="style_points" value={starPoints} />
          <input type="hidden" name="style_animation" value={animationType} />

          {/* Inputs de Texto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-slate-400">Autor</Label>
              <Input 
                id="author"
                name="author" 
                defaultValue={state?.inputs?.author} // Mantém o valor digitado
                placeholder="Usuario" 
                className={cn("bg-[#131B33] border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:border-[#FFEA00]/50", state?.errors?.author && "border-red-500/50 focus-visible:border-red-500")}
              />
              {/* Mensagem de Erro */}
              {state?.errors?.author && <p className="text-red-400 text-[10px] mt-1">{state.errors.author}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-400">Titulo</Label>
              <Input 
                id="title" 
                name="title"
                defaultValue={state?.inputs?.title} // Mantém o valor digitado
                placeholder="Meu sonho para 2026." 
                className={cn("bg-[#131B33] border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:border-[#FFEA00]/50", state?.errors?.title && "border-red-500/50 focus-visible:border-red-500")}
              />
              {state?.errors?.title && <p className="text-red-400 text-[10px] mt-1">{state.errors.title}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-slate-400">Descrição</Label>
            <Textarea 
              id="desc"
              name="description"
              defaultValue={state?.inputs?.description} // Mantém o valor digitado
              placeholder="Conte seu desejo de Natal..." 
              className="bg-[#131B33] border-slate-800 focus-visible:ring-[#FFEA00] text-slate-200 placeholder:text-slate-600 min-h-20 resize-none focus-visible:border-[#FFEA00]/50"
            />
            {state?.errors?.description && <p className="text-red-400 text-[10px] mt-1">{state.errors.description}</p>}
          </div>

          <div className="h-px w-full bg-slate-800/50" />

          {/* Seção de Personalização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-slate-100 select-none">
              <Settings2 className="w-5 h-5 text-[#FFEA00]" />
              <h3>Personalização</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coluna Esquerda: Cores e Tamanho */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-400 select-none">Cor da Estrela</Label>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <motion.button
                        key={color.id}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setStarColor(color.id)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all border-2 border-transparent outline-none ring-0",
                          starColor === color.id && "border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
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
                     <Slider 
                        defaultValue={[50]} 
                        value={starSize} // Agora controlado pelo estado para persistir no erro
                        max={100} step={1} 
                        onValueChange={setStarSize}
                        className="cursor-pointer flex-1"
                      />
                      <Star className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Estilo e Pontas */}
              <div className="space-y-3">
                <Label className="text-slate-400 select-none">Estilo da estrela</Label>
                <div className="flex flex-col gap-2">
                   <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStarStyle("circle")}
                    className={cn("flex items-center gap-3 p-2 rounded-lg border cursor-pointer relative overflow-hidden select-none", starStyle === "circle" ? "bg-[#1A233F] border-[#FFEA00]" : "bg-[#131B33] border-slate-800")}
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors", starStyle === "circle" ? "bg-[#FFEA00] text-black" : "bg-slate-800 text-slate-400")}>
                      <Circle className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className={cn("text-xs font-medium", starStyle === "circle" ? "text-[#FFEA00]" : "text-slate-200")}>Círculo Clássico</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStarStyle("star")}
                    className={cn("flex items-center gap-3 p-2 rounded-lg border cursor-pointer relative overflow-hidden select-none", starStyle === "star" ? "bg-[#1A233F] border-[#FFEA00]" : "bg-[#131B33] border-slate-800")}
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors", starStyle === "star" ? "bg-[#FFEA00] text-black" : "bg-slate-800 text-slate-400")}>
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className={cn("text-xs font-medium", starStyle === "star" ? "text-[#FFEA00]" : "text-slate-200")}>Estrela Brilhante</p>
                    </div>
                  </motion.div>
                </div>
                
                 <AnimatePresence>
                  {starStyle === "star" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between pt-1"
                    >
                       <span className="text-xs text-slate-400 select-none">Pontas</span>
                       <div className="flex items-center gap-2 bg-[#131B33] rounded-md p-0.5 border border-slate-800">
                          <button type="button" onClick={() => handlePointsChange('dec')} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white" disabled={starPoints <= 4}><Minus className="w-3 h-3" /></button>
                          <span className="text-xs text-[#FFEA00] font-mono w-4 text-center select-none">{starPoints}</span>
                          <button type="button" onClick={() => handlePointsChange('inc')} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white" disabled={starPoints >= 12}><Plus className="w-3 h-3" /></button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Posição e Animação */}
            <div className="grid grid-cols-[100px_1fr] gap-6 pt-2">
                <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">Posição</Label>
                    <div className="flex gap-2">
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono select-none">X:</span>
                            <Input 
                              name="posX" 
                              placeholder="0" 
                              type="text" 
                              inputMode="numeric"
                              defaultValue={state?.inputs?.posX} // Mantém valor
                              className="bg-[#131B33] border-slate-800 h-8 w-full pl-6 text-xs text-slate-200 focus-visible:ring-[#FFEA00] focus-visible:border-[#FFEA00]/50" 
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono select-none">Y:</span>
                            <Input 
                              name="posY" 
                              placeholder="0" 
                              type="text"
                              inputMode="numeric"
                              defaultValue={state?.inputs?.posY} // Mantém valor
                              className="bg-[#131B33] border-slate-800 h-8 w-full pl-6 text-xs text-slate-200 focus-visible:ring-[#FFEA00] focus-visible:border-[#FFEA00]/50" 
                            />
                        </div>
                    </div>
                    {/* Erros de Posição */}
                    {(state?.errors?.posX || state?.errors?.posY) && <p className="text-red-400 text-[10px] mt-1">Posição inválida</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">Animação</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {animations.map((anim) => (
                            <motion.button
                                key={anim.id}
                                type="button"
                                onClick={() => setAnimationType(anim.id)}
                                className={cn(
                                    "h-8 rounded-md border text-[10px] font-medium transition-colors flex items-center justify-center gap-1",
                                    animationType === anim.id 
                                        ? "bg-[#1A233F] border-[#FFEA00] text-[#FFEA00]" 
                                        : "bg-[#131B33] border-slate-800 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                <motion.div animate={anim.animate}>
                                    <Star className="w-3 h-3 fill-current" /> 
                                </motion.div>
                                <span className="hidden sm:inline">{anim.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          <SubmitButton />
          
          {/* Mensagem Geral de Erro */}
          {!state?.success && state?.message && (
             <p className="text-center text-xs text-red-400 mt-2 bg-red-500/10 py-2 rounded border border-red-500/20">{state.message}</p>
          )}

          <p className="text-center text-[10px] text-slate-600 select-none pb-2">
            Ao Enviar Um Desejo Voce Concorda Com As Regras.
          </p>

        </form>
      </DialogContent>
    </Dialog>
  )
}