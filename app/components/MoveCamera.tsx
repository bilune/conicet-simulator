'use client'
import { useFrame, useThree } from '@react-three/fiber'

export default function CameraMover({ speed = 0.5 }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    camera.position.z += speed * delta
  })
  return null
}
