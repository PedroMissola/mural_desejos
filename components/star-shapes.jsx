'use client'

import { motion } from "framer-motion"
import { memo } from "react"
import { cn } from "@/lib/utils"

const variants = {
  pulse: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
  bounce: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
  spin: { rotate: 360, transition: { repeat: Infinity, duration: 8, ease: "linear" } },
  shimmer: { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9], transition: { repeat: Infinity, duration: 2 } },
}

const colors = {
  blue: "#3B82F6", red: "#EF4444", white: "#E2E8F0", green: "#22C55E", yellow: "#FFC300"
}

// Tooltip (Rótulo ao passar o mouse)
const Label = ({ text }) => (
  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0A1020]/90 backdrop-blur border border-slate-700 rounded text-[10px] text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
    {text}
  </div>
)

// Ponto Vermelho de Notificação (SEM BORDA)
const RedNotificationDot = () => (
    <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        // Removido: border border-white/10
        className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF0000] rounded-full shadow-[0_0_8px_#FF0000] z-50 pointer-events-none"
    />
)

export const CircleShape = memo(function CircleShape({ size, color, animation, style, title, onClick, isHighlighted }) {
  const fill = colors[color] || colors.white
  
  return (
    <div 
      className={cn("absolute group cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:z-50", isHighlighted && "z-50")}
      style={{ ...style, width: size, height: size }}
      onClick={onClick}
    >
      <Label text={title} />
      
      {/* Ponto Vermelho se estiver destacado */}
      {isHighlighted && <RedNotificationDot />}
      
      <motion.div
        variants={variants}
        animate={animation}
        className="w-full h-full rounded-full"
        style={{ 
          backgroundColor: fill,
          // Se destacado: Sombra Amarela Grande + Sombra original
          boxShadow: isHighlighted 
            ? `0 0 50px #FFC300, 0 0 20px ${fill}` 
            : `0 0 ${size/2}px ${fill}`
        }}
      />
    </div>
  )
})

export const StarShape = memo(function StarShape({ size, color, points = 5, animation, style, title, onClick, isHighlighted }) {
  const fill = colors[color] || colors.white
  
  const polyPoints = (() => {
    const outer = 50, inner = 20;
    const center = 50;
    let str = "";
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = i * (Math.PI / points) - Math.PI / 2;
      str += `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)} `;
    }
    return str;
  })();

  return (
    <div 
      className={cn("absolute group cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:z-50", isHighlighted && "z-50")}
      style={{ ...style, width: size, height: size }}
      onClick={onClick}
    >
      <Label text={title} />
      
      {/* Ponto Vermelho se estiver destacado */}
      {isHighlighted && <RedNotificationDot />}

      <motion.svg
        variants={variants}
        animate={animation}
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{ 
            // Se destacado: Drop Shadow Amarelo Grande (#FFC300)
            filter: isHighlighted 
                ? `drop-shadow(0 0 30px #FFC300) drop-shadow(0 0 10px ${fill})` 
                : `drop-shadow(0 0 ${size/3}px ${fill})` 
        }}
      >
        <polygon points={polyPoints} fill={fill} />
      </motion.svg>
    </div>
  )
})