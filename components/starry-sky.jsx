'use client'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function StarrySky() {
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Timeout para evitar erro de hidratação (SSR vs Client)
    const timer = setTimeout(() => {
      setStars(
        Array.from({ length: 80 }).map((_, i) => ({
          id: i,
          width: Math.random() > 0.9 ? 4 : 2,
          height: Math.random() > 0.9 ? 4 : 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        }))
      )
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full bg-[#0B1224] cursor-grab active:cursor-grabbing">
      <TransformWrapper
        initialScale={1}
        minScale={1} // MUDANÇA 1: Impede zoom out menor que a tela
        maxScale={3}
        limitToBounds={true} // MUDANÇA 2: Impede arrastar para fora das bordas (aparecer o fundo cinza)
        centerOnInit={true}
        wheel={{ 
          step: 0.1,
          activationKeys: ['Control']
        }}
        pinch={{ disabled: false }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
          
          <div 
            className="relative w-792 h-full flex items-center justify-center bg-[#0B1224]"
          >
            
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                transition={{ 
                    duration: star.duration, 
                    repeat: Infinity,
                    delay: star.delay 
                }}
                className="absolute bg-white rounded-full shadow-[0_0_4px_#fff]"
                style={{
                  width: star.width,
                  height: star.height,
                  left: star.left,
                  top: star.top,
                }}
              />
            ))}

          </div>

        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}