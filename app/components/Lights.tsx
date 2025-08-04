'use client'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function FollowSpot() {
  const spotRef   = useRef<THREE.SpotLight>(null!)
  // el target lo creo vacío de entrada
  const targetRef = useRef(new THREE.Object3D())
  const { camera, scene } = useThree()

  // Controles de Leva para el foco
  const { 
    intensity, 
    angle, 
    penumbra, 
    distance, 
    decay,
    targetDistance,
    showHelper
  } = useControls('Foco Seguidor', {
    intensity: { value: 120, min: 0, max: 120, step: 1, label: 'Intensidad' },
    angle: { value: 1, min: 0, max: Math.PI / 2, step: 0.1, label: 'Ángulo' },
    penumbra: { value: 0.4, min: 0, max: 1, step: 0.1, label: 'Penumbra' },
    distance: { value: 15, min: 1, max: 100, step: 1, label: 'Distancia' },
    decay: { value: 1.9, min: 0, max: 5, step: 0.1, label: 'Decay' },
    targetDistance: { value: 5, min: 1, max: 20, step: 0.5, label: 'Distancia Target' },
    showHelper: { value: false, label: 'Mostrar Helper' }
  })

  /* 1- Agrego el target a la escena y lo asocio al spot una sola vez */
  useEffect(() => {
    scene.add(targetRef.current)
    if (spotRef.current) {
      spotRef.current.target = targetRef.current
    }
  }, [scene])

  /* 2- En cada frame actualizo posición de luz y target */
  useFrame(() => {
    if (!spotRef.current) return

    // a) mover la luz a la cámara
    spotRef.current.position.copy(camera.position)

    // b) poner el target a la distancia configurada por delante
    const dir = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(targetDistance)

    targetRef.current.position.copy(camera.position).add(dir)

    // c) ¡siempre después de mover el target!
    spotRef.current.target.updateMatrixWorld()
  })

  return (
    <spotLight
      ref={spotRef}
      angle={angle}
      penumbra={penumbra}
      intensity={intensity}
      distance={distance}
      decay={decay}
      castShadow
      receiveShadow
    />
  )
}
