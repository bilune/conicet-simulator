'use client'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export default function KeyboardCamera({ speed = 2 }) {
    const { camera } = useThree()
    const direction = useRef(0)
    const [isMobile, setIsMobile] = useState(false)
    const touchStartY = useRef(0)
    const touchActive = useRef(false)

    // Detectar si es mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        // Controles de teclado (desktop)
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 'ArrowUp') direction.current = -1
            if (e.key === 's' || e.key === 'ArrowDown') direction.current = 1
        }
        const onKeyUp = () => {
            direction.current = 0
        }

        // Controles táctiles (mobile)
        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY
            touchActive.current = true
        }

        const onTouchMove = (e: TouchEvent) => {
            if (!touchActive.current) return
            
            const touchY = e.touches[0].clientY
            const deltaY = touchStartY.current - touchY
            
            // Sensibilidad del touch
            if (deltaY > 20) direction.current = -1      // Swipe hacia arriba
            else if (deltaY < -20) direction.current = 1  // Swipe hacia abajo
            else direction.current = 0
        }

        const onTouchEnd = () => {
            direction.current = 0
            touchActive.current = false
        }

        // Event listeners
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchmove', onTouchMove)
            window.removeEventListener('touchend', onTouchEnd)
        }
    }, [])

    useFrame((_, delta) => {
        camera.position.z += direction.current * speed * delta
        camera.rotation.x = -0.6  // Inclinación hacia abajo
        camera.position.y = 4
    })

    return null
}
