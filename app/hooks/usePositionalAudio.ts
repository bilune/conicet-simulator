import { useEffect, useRef } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import * as THREE from 'three'

// Hook para desbloquear el AudioContext después del primer gesto del usuario
function useUnlockAudio(listener: THREE.AudioListener) {
  useEffect(() => {
    const unlock = () => {
      const ctx = listener.context
      if (ctx.state === 'suspended') {
        ctx.resume().catch((err) => console.warn('AudioContext resume failed', err))
      }
    }

    // Attach once — y sin passive para poder llamar preventDefault si ya lo usás
    window.addEventListener('pointerdown', unlock, { once: true, passive: false })
    window.addEventListener('touchend', unlock, { once: true, passive: false })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('keyup', unlock, { once: true })

    // Cleanup
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('keyup', unlock)
    }
  }, [listener])
}

// Interfaz para la configuración del audio
interface PositionalAudioConfig {
  audioUrl: string
  triggerDistance?: number
  refDistance?: number
  maxDistance?: number
  rolloffFactor?: number
  loop?: boolean
}

// Hook personalizado para audio posicional
export function usePositionalAudio(config: PositionalAudioConfig) {
  const {
    audioUrl,
    triggerDistance = 8,
    refDistance = 2,
    maxDistance = 8,
    rolloffFactor = 1,
    loop = false
  } = config

  const { camera } = useThree()
  const sound = useRef<THREE.PositionalAudio>(null!)
  const audioUnlocked = useRef(false)
  const audioStarted = useRef(false)

  // Crear el listener y desbloquear el audio
  const listener = new THREE.AudioListener()
  camera.add(listener)
  useUnlockAudio(listener)

  // Cargar el audio
  const buffer = useLoader(THREE.AudioLoader, audioUrl)

  // Configurar el audio
  useEffect(() => {
    sound.current.setBuffer(buffer)
    sound.current.setLoop(loop)
    sound.current.setRefDistance(refDistance)
    sound.current.setMaxDistance(maxDistance)
    sound.current.setRolloffFactor(rolloffFactor)
  }, [buffer, refDistance, maxDistance, rolloffFactor, loop])

  // Función para verificar distancia y controlar reproducción
  const checkDistanceAndPlay = (objectPosition: THREE.Vector3) => {
    if (!sound.current || !buffer) return

    // Verificar si el AudioContext está desbloqueado
    if (!audioUnlocked.current && listener.context.state === 'running') {
      audioUnlocked.current = true
    }

    if (!audioUnlocked.current) return

    const distance = camera.position.distanceTo(objectPosition)

    // Solo reproducir si estás dentro del radio de triggerDistance y no se ha iniciado
    if (distance <= triggerDistance && !audioStarted.current) {
      sound.current.play()
      audioStarted.current = true
    }
    // Detener si te alejas demasiado
    else if (distance > triggerDistance && audioStarted.current) {
      sound.current.stop()
      audioStarted.current = false
    }
  }

  return {
    sound,
    checkDistanceAndPlay,
    audioUrl
  }
}