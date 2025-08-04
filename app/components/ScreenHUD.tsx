'use client'

import { useState, useEffect } from 'react'

export function ScreenHUD() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setCurrentTime(new Date())
        
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return date.toISOString().slice(0, 19).replace('T', '  ') + ' UTC'
    }

    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Elementos alineados a la izquierda */}
        <div className="absolute bottom-12 sm:bottom-5 left-4 sm:left-5 text-white font-mono text-md sm:text-lg leading-relaxed font-bold w-48" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
          <div className="flex justify-between w-full">
            <span>HEADING</span>
            <span>337 °</span>
          </div>
          <div className="flex justify-between">
            <span>DEPTH</span>
            <span>1969 m</span>
          </div>
          <div className="flex justify-between">
            <span>TEMP.</span>
            <span>2.89 °C</span>
          </div>
          <div className="flex justify-between">
            <span>SALINITY</span>
            <span>34.8 PSU</span>
          </div>
          <div className="flex justify-between">
            <span>O₂ CON.</span>
            <span>194 µM</span>
          </div>
          <div className="flex justify-between">
            <span>O₂ SAT.</span>
            <span>58.0 %</span>
          </div>
        </div>
        
        {/* Fecha centrada abajo */}
        <div className="absolute bottom-2 sm:bottom-5 left-1/2 transform -translate-x-1/2 text-white font-mono text-lg sm:text-2xl font-bold text-center w-full" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
          {mounted && currentTime ? formatTime(currentTime) : 'Loading...'}
        </div>
      </div>
    )
  }
  