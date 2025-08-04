'use client'
import { useEffect, useRef } from 'react'
import { useThree, useLoader, useFrame } from '@react-three/fiber'
import { PositionalAudio, useGLTF, useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

// Hook para desbloquear el AudioContext después del primer gesto del usuario
function useUnlockAudio(listener: THREE.AudioListener) {
  useEffect(() => {
    const resume = () => {
      const ctx = listener.context
      if (ctx.state === 'suspended') ctx.resume()
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
    window.addEventListener('pointerdown', resume)
    window.addEventListener('keydown', resume)
  }, [listener])
}

export default function PatricioModel(props: any) {
    const { camera } = useThree()
    const { scene } = useGLTF('/models/patricio3.glb')
    const [colorMap, normalMap] = useTexture([
        '/textures/patricio_color.png',
        '/textures/patricio_normal.png',
    ])
    const sound = useRef<THREE.PositionalAudio>(null!)
    const audioUnlocked = useRef(false)
    const audioStarted = useRef(false)

    // Crear el listener y desbloquear el audio
    const listener = new THREE.AudioListener()
    camera.add(listener)
    useUnlockAudio(listener)

    // Controles de Leva para la rotación
    const { rotationX, rotationY, rotationZ } = useControls('Rotación Patricio', {
        rotationX: { value: -1.4, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación X' },
        rotationY: { value: 0.33, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Y' },
        rotationZ: { value: 1, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Z' }
    })

    /* cargá el mp3 */
    const buffer = useLoader(THREE.AudioLoader, '/audio/patricio.mp3')

    /* configurá el audio una sola vez */
    useEffect(() => {
        // al montar, seteá el buffer pero NO reproduzcas
        sound.current.setBuffer(buffer)
        sound.current.setLoop(false)
        sound.current.setRefDistance(2)   // volumen 100 % a 2 m
        sound.current.setMaxDistance(8)   // desaparece a 8 m
        sound.current.setRolloffFactor(1) // caída más suave del volumen
        // NO llamar a sound.current.play() aquí
    }, [buffer])

    // Verificar distancia y reproducir audio solo cuando estés cerca
    useFrame(() => {
        if (!sound.current || !buffer) return

        // Verificar si el AudioContext está desbloqueado
        if (!audioUnlocked.current && listener.context.state === 'running') {
            audioUnlocked.current = true
        }

        if (!audioUnlocked.current) return

        // Calcular distancia entre cámara y Patricio usando la posición real del modelo
        const patricioPosition = new THREE.Vector3()
        scene.getWorldPosition(patricioPosition)
        const distance = camera.position.distanceTo(patricioPosition)

        // Solo reproducir si estás dentro del radio de 8m y no se ha iniciado
        if (distance <= 8 && !audioStarted.current) {
            sound.current.play()
            audioStarted.current = true
        }
        // Detener si te alejas demasiado
        else if (distance > 8 && audioStarted.current) {
            sound.current.stop()
            audioStarted.current = false
        }
    })

    useEffect(() => {
        scene.traverse(obj => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh
                const mat = mesh.material as THREE.MeshStandardMaterial

                /* —––  ASIGNAR  –––  */
                mat.map = colorMap
                mat.normalMap = normalMap          // relieve
                mat.map.colorSpace = THREE.SRGBColorSpace
                mat.map.anisotropy = 8
                mat.normalMap.anisotropy = 8

                /* ajustes opcionales */
                mat.normalScale.set(1, 1)
                mat.roughness = 0.9
                mat.metalness = 0
                mat.needsUpdate = true              // <- refresca el shader
            }
        })
    }, [scene])

    return (
        <primitive object={scene} scale={0.2} position={[0, 0, 0]} {...props} rotation={[rotationX, rotationY, rotationZ]}>
            {/* el audio está "pegado" al mesh */}
            <PositionalAudio ref={sound} url="/audio/patricio.mp3" />
        </primitive>
    )
}
