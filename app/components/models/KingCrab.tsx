'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PositionalAudio, useGLTF, useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { usePositionalAudio } from '../../hooks/usePositionalAudio'
import * as THREE from 'three'

export default function KingCrab(props: any) {
    // Load the 3D model
    const { scene } = useGLTF('/models/king-crab.glb')
    
    // Load textures (optional - if you have textures for the king crab)
    // const [colorMap, normalMap] = useTexture([
    //     '/textures/king-crab_color.png',
    //     '/textures/king-crab_normal.png',
    // ])

    // Configure positional audio for the king crab
    const { sound, checkDistanceAndPlay, audioUrl } = usePositionalAudio({
        audioUrl: '/audio/king-crab.mp3',
        triggerDistance: 10,    // Distance to start playing
        refDistance: 6,        // Distance for max volume
        maxDistance: 10,        // Distance where audio stops
        rolloffFactor: 1,      // How quickly volume decreases
        loop: false            // Whether to loop the audio
    })

    // Get initial values from props or use defaults
    const initialPosition = props.position || [0, 0, 0]

    // Ref to the root object to track its world position accurately
    const crabRef = useRef<THREE.Object3D>(null!)
    const initialScale = props.scale || 0.2

    // Leva controls for model rotation
    const { rotationX, rotationY, rotationZ } = useControls('King Crab', {
        rotationX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation X' },
        rotationY: { value: -0.7, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation Y' },
        rotationZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation Z' }
    })

    // Leva controls for model position - use props as initial values
    const { positionX, positionY, positionZ } = useControls('King Crab', {
        positionX: { value: initialPosition[0], min: -20, max: 20, step: 0.1, label: 'Position X', },
        positionY: { value: initialPosition[1], min: -20, max: 20, step: 0.1, label: 'Position Y' },
        positionZ: { value: initialPosition[2], min: -20, max: 20, step: 0.1, label: 'Position Z' }
    })

    // Leva controls for model scale - use props as initial value
    const { scale } = useControls('King Crab', {
        scale: { value: initialScale, min: 0.01, max: 2, step: 0.01, label: 'Scale' }
    })

    // Check distance and control audio playback based on the crab's actual world position
    useFrame(() => {
        if (crabRef.current) {
            const modelPosition = new THREE.Vector3()
            crabRef.current.getWorldPosition(modelPosition)
            checkDistanceAndPlay(modelPosition)
        }
    })

    // Apply textures to the model (if textures are available)
    // useEffect(() => {
    //     scene.traverse(obj => {
    //         if ((obj as THREE.Mesh).isMesh) {
    //             const mesh = obj as THREE.Mesh
    //             const mat = mesh.material as THREE.MeshStandardMaterial

    //             // Apply textures
    //             mat.map = colorMap
    //             mat.normalMap = normalMap
    //             mat.map.colorSpace = THREE.SRGBColorSpace
    //             mat.map.anisotropy = 8
    //             mat.normalMap.anisotropy = 8

    //             // Material settings
    //             mat.normalScale.set(1, 1)
    //             mat.roughness = 0.9
    //             mat.metalness = 0
    //             mat.needsUpdate = true
    //         }
    //     })
    // }, [scene])

    // Basic material setup for the model
    useEffect(() => {
        scene.traverse(obj => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh
                const mat = mesh.material as THREE.MeshStandardMaterial

                // Basic material settings for underwater appearance
                mat.roughness = 0.8
                mat.metalness = 0.1
                mat.needsUpdate = true
            }
        })
    }, [scene])

    return (
        <primitive 
            ref={crabRef}
            object={scene} 
            scale={scale} 
            position={[positionX, positionY, positionZ]} 
            rotation={[rotationX, rotationY, rotationZ]}
        >
            {/* Attach positional audio to the model */}
            <PositionalAudio ref={sound} url={audioUrl} />
        </primitive>
    )
}
