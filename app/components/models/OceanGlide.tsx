'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PositionalAudio, useGLTF, useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { usePositionalAudio } from '../../hooks/usePositionalAudio'
import * as THREE from 'three'

export default function OceanGlide(props: any) {
    // Cargar el modelo 3D
    const { scene } = useGLTF('/models/ocean-glide.glb')
    
    // Cargar texturas (opcional - descomenta si tienes texturas para ocean-glide)
    // const [colorMap, normalMap] = useTexture([
    //     '/textures/ocean-glide_color.png',
    //     '/textures/ocean-glide_normal.png',
    // ])

    // Configurar audio posicional (opcional - descomenta si tienes audio para ocean-glide)
    // const { sound, checkDistanceAndPlay, audioUrl } = usePositionalAudio({
    //     audioUrl: '/audio/ocean-glide.mp3',
    //     triggerDistance: 8,    // Distancia para comenzar a reproducir
    //     refDistance: 2,        // Distancia para volumen máximo
    //     maxDistance: 8,        // Distancia donde se detiene el audio
    //     rolloffFactor: 1,      // Qué tan rápido disminuye el volumen
    //     loop: false            // Si el audio debe repetirse
    // })

    // Obtener valores iniciales de props o usar valores por defecto
    const initialPosition = props.position || [0, 0, 0]
    const initialScale = props.scale || 0.2

    // Ref para rastrear la posición real del modelo renderizado
    // Esto asegura que el audio se active desde la posición correcta del modelo
    const modelRef = useRef<THREE.Object3D>(null!)

    // Controles de Leva para la rotación del modelo
    const { rotationX, rotationY, rotationZ } = useControls('Ocean Glide', {
        rotationX: { value: 0.1, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación X' },
        rotationY: { value: -0.5, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Y' },
        rotationZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Z' }
    })

    // Controles de Leva para la posición del modelo - usar props como valores iniciales
    const { positionX, positionY, positionZ } = useControls('Ocean Glide', {
        positionX: { value: initialPosition[0], min: -20, max: 20, step: 0.1, label: 'Posición X' },
        positionY: { value: initialPosition[1], min: -20, max: 20, step: 0.1, label: 'Posición Y' },
        positionZ: { value: initialPosition[2], min: -20, max: 20, step: 0.1, label: 'Posición Z' }
    })

    // Controles de Leva para la escala del modelo - usar props como valor inicial
    const { scale } = useControls('Ocean Glide', {
        scale: { value: initialScale, min: 0.01, max: 2, step: 0.01, label: 'Escala' }
    })

    // Verificar distancia usando la posición real del modelo renderizado
    // Usando modelRef.current.getWorldPosition() en lugar de scene.getWorldPosition()
    // asegura que rastreamos la posición del modelo real renderizado, no la escena interna
    useFrame(() => {
        if (modelRef.current) {
            const modelPosition = new THREE.Vector3()
            modelRef.current.getWorldPosition(modelPosition)
            // Descomenta la siguiente línea si tienes audio configurado
            // checkDistanceAndPlay(modelPosition)
        }
    })

    // Aplicar texturas al modelo (descomenta si tienes texturas)
    // useEffect(() => {
    //     scene.traverse(obj => {
    //         if ((obj as THREE.Mesh).isMesh) {
    //             const mesh = obj as THREE.Mesh
    //             const mat = mesh.material as THREE.MeshStandardMaterial

    //             // Aplicar texturas
    //             mat.map = colorMap
    //             mat.normalMap = normalMap
    //             mat.map.colorSpace = THREE.SRGBColorSpace
    //             mat.map.anisotropy = 8
    //             mat.normalMap.anisotropy = 8

    //             // Configuración de materiales
    //             mat.normalScale.set(1, 1)
    //             mat.roughness = 0.9
    //             mat.metalness = 0
    //             mat.needsUpdate = true
    //         }
    //     })
    // }, [scene])

    // Configuración básica de materiales para el modelo
    useEffect(() => {
        scene.traverse(obj => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh
                const mat = mesh.material as THREE.MeshStandardMaterial

                // Configuración básica de materiales para apariencia submarina
                mat.roughness = 0.8
                mat.metalness = 0.1
                mat.needsUpdate = true
            }
        })
    }, [scene])

    return (
        <primitive 
            ref={modelRef}
            object={scene} 
            scale={scale} 
            position={[positionX, positionY, positionZ]} 
            rotation={[rotationX, rotationY, rotationZ]}
        >
            {/* Adjuntar audio posicional al modelo (descomenta si tienes audio) */}
            {/* <PositionalAudio ref={sound} url={audioUrl} /> */}
        </primitive>
    )
} 