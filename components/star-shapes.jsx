'use client'

import { motion } from "framer-motion"
import { memo } from "react"

const variants = {
  pulse: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
  bounce: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
  spin: { rotate: 360, transition: { repeat: Infinity, duration: 8, ease: "linear" } },
  shimmer: { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9], transition: { repeat: Infinity, duration: 2 } },
}

const colors = {
  blue: "#3B82F6", red: "#EF4444", white: "#E2E8F0", green: "#22C55E", yellow: "#FFC300"
}

// Tooltip Component
const Label = ({ text }) => (
  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0A1020]/90 backdrop-blur border border-slate-700 rounded text-[10px] text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
    {text}
  </div>
)

export const CircleShape = memo(function CircleShape({ size, color, animation, style, title, onClick }) {
  const fill = colors[color] || colors.white
  
  return (
    <div 
      className="absolute group cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:z-50"
      style={{ ...style, width: size, height: size }}
      onClick={onClick}
    >
      <Label text={title} />
      <motion.div
        variants={variants}
        animate={animation}
        className="w-full h-full rounded-full"
        style={{ 
          backgroundColor: fill,
          boxShadow: `0 0 ${size/2}px ${fill}`
        }}
      />
    </div>
  )
})

export const StarShape = memo(function StarShape({ size, color, points = 5, animation, style, title, onClick }) {
  const fill = colors[color] || colors.white
  
  // Calculate polygon points once
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
      className="absolute group cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:z-50"
      style={{ ...style, width: size, height: size }}
      onClick={onClick}
    >
      <Label text={title} />
      <motion.svg
        variants={variants}
        animate={animation}
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{ filter: `drop-shadow(0 0 ${size/3}px ${fill})` }}
      >
        <polygon points={polyPoints} fill={fill} />
      </motion.svg>
    </div>
  )
})