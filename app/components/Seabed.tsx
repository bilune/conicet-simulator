'use client'
import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Mesh, RepeatWrapping, TextureLoader } from 'three'

const SIZE = 60  // largo del piso
const COUNT = 4  // cantidad de mosaicos

export default function Seabed({ speed = 0.5 }) {
    const planes = useRef<Mesh[]>([])

    // useFrame((_, delta) => {
    //     planes.current.forEach((p) => {
    //         p.position.z += speed * delta
    //         if (p.position.z > SIZE / 2) {
    //             p.position.z -= SIZE * COUNT
    //         }
    //     })
    // })

    const [colorMap, dispMap] = useLoader(TextureLoader, [
        '/textures/sand_color.jpg',
        '/textures/sand_disp.png',
    ])

    colorMap.wrapS = colorMap.wrapT = RepeatWrapping
    dispMap.wrapS = dispMap.wrapT = RepeatWrapping
    colorMap.repeat.set(10, 10)
    dispMap.repeat.set(10, 10)

    return (
        <>
            {Array.from({ length: COUNT }).map((_, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        if (el) planes.current[i] = el
                    }}
                    position={[0, -2, -i * SIZE]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow
                >
                    <planeGeometry args={[SIZE, SIZE, 128, 128]} />
                    <meshStandardMaterial map={colorMap}
                        displacementMap={dispMap}
                        displacementScale={0.3}
                        roughness={1}
                        color="#a0ccc0"
                    />
                </mesh>
            ))}
        </>
    )
}
