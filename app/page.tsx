'use client'

import { Canvas, GLProps } from '@react-three/fiber'
import { useControls } from 'leva'
import Seabed from './components/Seabed'
import MarineSnow from './components/MarineSnow'
import KeyboardCamera from './components/KeyboardCamera'
import { Fog, SRGBColorSpace, ACESFilmicToneMapping } from 'three'
import { ScreenHUD } from './components/ScreenHUD'
import PatricioModel from './components/PatricioModel'
import Lights from './components/Lights'

export default function Home() {
  // Controles de Leva para la cámara y escena
  const { 
    cameraX, 
    cameraY, 
    cameraZ, 
    cameraFOV,
    fogNear,
    fogFar,
    ambientIntensity
  } = useControls('Cámara y Escena', {
    cameraX: { value: 0, min: -20, max: 20, step: 0.5, label: 'Posición X' },
    cameraY: { value: -2, min: -10, max: 10, step: 0.5, label: 'Posición Y' },
    cameraZ: { value: 20, min: 5, max: 50, step: 1, label: 'Posición Z' },
    cameraFOV: { value: 60, min: 30, max: 120, step: 5, label: 'FOV' },
    fogNear: { value: 8, min: 1, max: 30, step: 1, label: 'Niebla Cerca' },
    fogFar: { value: 15, min: 10, max: 100, step: 5, label: 'Niebla Lejos' },
    ambientIntensity: { value: 0.2, min: 0, max: 2, step: 0.1, label: 'Luz Ambiente' }
  })

  return (
    <main className="relative w-screen h-screen">
      <Canvas shadows camera={{ position: [cameraX, cameraY, cameraZ], fov: cameraFOV }} onCreated={({ gl, scene }) => {
        gl.outputColorSpace = SRGBColorSpace
        gl.toneMapping = ACESFilmicToneMapping   // opcional, queda lindo

        scene.fog = new Fog("#000d1a", fogNear, fogFar);
        gl.setClearColor("#000d1a");
      }}>
        <ambientLight intensity={ambientIntensity} />

        <Lights />
        <Seabed />
        <MarineSnow count={5000} />
        <fog attach="fog" args={['#000d1a', fogNear, fogFar]} />
        <KeyboardCamera speed={2} />
        <PatricioModel position={[0, 0, 0]} scale={0.05} />

      </Canvas>
      <ScreenHUD />
    </main>
  )
}
