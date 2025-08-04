'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PositionalAudio, useGLTF, useTexture } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { usePositionalAudio } from '../../hooks/usePositionalAudio'
import * as THREE from 'three'

export default function PatricioModel(props: any) {
    const { scene } = useGLTF('/models/patricio3.glb')
    const [colorMap, normalMap] = useTexture([
        '/textures/patricio_color.png',
        '/textures/patricio_normal.png',
    ])

    // Usar el hook de audio posicional
    const { sound, checkDistanceAndPlay, audioUrl } = usePositionalAudio({
        audioUrl: '/audio/patricio.mp3',
        triggerDistance: 8,
        refDistance: 2,
        maxDistance: 8,
        rolloffFactor: 1,
        loop: false
    })

    // Controles de Leva para la rotación
    const { rotationX, rotationY, rotationZ } = useControls('Rotación Patricio', {
        rotationX: { value: -1.4, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación X' },
        rotationY: { value: 0.33, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Y' },
        rotationZ: { value: 1, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotación Z' }
    })

    // Verificar distancia y reproducir audio
    useFrame(() => {
        const patricioPosition = new THREE.Vector3()
        scene.getWorldPosition(patricioPosition)
        checkDistanceAndPlay(patricioPosition)
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
        <>
            <primitive object={scene} scale={0.2} position={[0, 0, 0]} {...props} rotation={[rotationX, rotationY, rotationZ]}>
                {/* el audio está "pegado" al mesh */}
                <PositionalAudio ref={sound} url={audioUrl} />
            </primitive>
        </>
    )
}
