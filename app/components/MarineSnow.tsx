// src/components/MarineSnow.tsx
'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function MarineSnow({ count = 5000 }) {
    const groupRef = useRef<THREE.Group>(null!)
    const pointsRef = useRef<THREE.Points>(null!)
    const { camera } = useThree()
    const texture = useLoader(THREE.TextureLoader, '/textures/snow_particle.png')

    // 1) Parámetros del volumen
    const SPREAD = 50   // ancho XZ
    const HEIGHT = 5    // rango Y (0 → HEIGHT)

    // 2) Posiciones y velocidades
    const { positions, speeds } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const spd = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            pos[3 * i + 0] = (Math.random() - 0.5) * SPREAD      // X
            pos[3 * i + 1] = Math.random() * HEIGHT             // Y
            pos[3 * i + 2] = (Math.random() - 0.5) * SPREAD      // Z
            spd[i] = 0.01 + Math.random() * 0.02               // velocidad
        }
        return { positions: pos, speeds: spd }
    }, [count])

    // 3) Corriente fija (viene de adelante en diagonal)
    const current = useRef(
        new THREE.Vector3(0.145, -0.028, 0.138)
    )

    useFrame(() => {
        // ahora: sólo X y Z (dejamos Y=0, es decir, altura del suelo)
        groupRef.current!.position.set(
            camera.position.x,
            0,
            camera.position.z
        )

        // b) desplazo cada partícula según current
        const attr = pointsRef.current!.geometry.attributes.position
        for (let i = 0; i < count; i++) {
            const i3 = 3 * i
            positions[i3] += current.current.x * speeds[i]
            positions[i3 + 1] += current.current.y * speeds[i]
            positions[i3 + 2] += current.current.z * speeds[i]

            // respawn cuando cae bajo Y=0
            if (positions[i3 + 1] < 0) {
                positions[i3 + 1] = HEIGHT
                positions[i3] = (Math.random() - 0.5) * SPREAD
                positions[i3 + 2] = (Math.random() - 0.5) * SPREAD
            }
        }
        attr.needsUpdate = true
    })

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    color="white"
                    size={0.05}
                    transparent
                    opacity={0.2}
                    depthWrite={false}
                    alphaTest={0.1}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    )
}
