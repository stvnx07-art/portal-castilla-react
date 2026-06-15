import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'


const GLB_URL = '/models/dental.glb'
const SCROLL_TO_RADIANS = Math.PI / 4

const CAM_Z_FAR = 7.5
const CAM_Z_NEAR = 5.8
const CAM_Y = 0.1
const CAM_FOV = 40

const cameraZRef = { current: CAM_Z_FAR }


/* ── CONSULTORIO CLÍNICO (FONDO) ── */
function ClinicRoom() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 3.5, -4.5]} receiveShadow>
        <planeGeometry args={[26, 10]} />
        <meshStandardMaterial color="#F2F4F6" roughness={0.92} metalness={0.0} />
      </mesh>

      <mesh position={[-7.5, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="#ECEEF1" roughness={0.92} />
      </mesh>

      <mesh position={[-5.5, -0.56, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 1.6, 3.5]} />
        <meshStandardMaterial color="#F8F9FB" roughness={0.55} metalness={0.05} />
      </mesh>

      <mesh position={[-5.5, 0.28, -2.5]} castShadow>
        <boxGeometry args={[3.6, 0.08, 3.6]} />
        <meshStandardMaterial color="#E5E8EC" roughness={0.45} />
      </mesh>

      <mesh position={[-5.8, 2.2, -2.8]} castShadow>
        <boxGeometry args={[3.0, 1.2, 1.5]} />
        <meshStandardMaterial color="#F8F9FB" roughness={0.65} />
      </mesh>

      <group position={[6.5, 1.5, -2]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh>
          <planeGeometry args={[6, 7]} />
          <meshBasicMaterial color="#FAFBFC" />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[6.2, 7.2, 0.1]} />
          <meshStandardMaterial color="#EAEDF1" roughness={0.55} />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.36, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#E8EBEF" roughness={0.65} metalness={0.04} />
      </mesh>
    </group>
  )
}


const PART_PALETTE = {
  ID127: { color: '#B8C4D0', roughness: 0.55, metalness: 0.30 },
  ID185: { color: '#B8C4D0', roughness: 0.45, metalness: 0.40 },
  ID791: { color: '#B8C4D0', roughness: 0.55, metalness: 0.15 },
  ID9: { color: '#B8C4D0', roughness: 0.40, metalness: 0.30 },
  ID905: { color: '#B8C4D0', roughness: 0.45, metalness: 0.40 },
}
const SEAT_PALETTE = { color: '#B8C4D0', roughness: 0.75, metalness: 0.10 }
const ARM_PALETTE = { color: '#B8C4D0', roughness: 0.50, metalness: 0.35 }


/* ── MODELO DE LA SILLA (HIPER-NÍTIDA) ── */
function DentalModel({ groupRef, scrollRef }) {
  const { scene } = useGLTF(GLB_URL)

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      if (!child.material) return
      child.material.needsUpdate = true

      const meshName = child.name || ''
      const palette = PART_PALETTE[meshName]

      if (meshName === 'ID492') {
        const p = SEAT_PALETTE
        child.material.color.set(p.color)
        child.material.roughness = p.roughness
        child.material.metalness = p.metalness
      } else if (meshName === 'ID492_1') {
        const p = ARM_PALETTE
        child.material.color.set(p.color)
        child.material.roughness = p.roughness
        child.material.metalness = p.metalness
      } else if (palette) {
        child.material.color.set(palette.color)
        child.material.roughness = palette.roughness
        child.material.metalness = palette.metalness
      } else {
        child.material.color.set('#98A4B0')
        child.material.roughness = 0.5
        child.material.metalness = 0.2
      }
    })
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const target = (1 - scrollRef.current) * SCROLL_TO_RADIANS
    const k = 1 - Math.exp(-6 * delta)
    groupRef.current.rotation.y += (target - groupRef.current.rotation.y) * k
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, SCROLL_TO_RADIANS, 0]}>
      <group position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.8}>
        <primitive object={scene} />
      </group>
      <ContactShadows
        position={[0, -1.34, 0]}
        opacity={0.65}
        scale={6}
        blur={2.4}
        far={2.5}
        resolution={1024}
        frames={1}
        color="#1e293b"
      />
    </group>
  )
}


/* ── SINCRONIZADOR DE CÁMARA Y ROTACIÓN ── */
function SyncerAndCamera({ chairGroupRef, bgGroupRef, scrollRef }) {
  useFrame(() => {
    const p = scrollRef.current || 0
    cameraZRef.current = CAM_Z_FAR + (CAM_Z_NEAR - CAM_Z_FAR) * p

    if (!chairGroupRef.current || !bgGroupRef.current) return
    bgGroupRef.current.rotation.y = chairGroupRef.current.rotation.y
  })
  return null
}


function BackgroundCanvas({ groupRef }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, CAM_Y, CAM_Z_FAR], fov: CAM_FOV, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, camera }) => {
        if (gl?.domElement) {
          gl.domElement.style.position = 'absolute'
          gl.domElement.style.top = '0'
          gl.domElement.style.left = '0'
          gl.domElement.style.width = '100%'
          gl.domElement.style.height = '100%'
          if (camera) camera.userData._driven = true
        }
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraBinder />
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[6, 5, -1]} intensity={2.4} color="#f1f5f9" />
      <directionalLight position={[-6, 4, 2]} intensity={0.6} color="#94a3b8" />
      <directionalLight position={[0, 1.5, 4]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.25} />
        <group ref={groupRef} rotation={[0, SCROLL_TO_RADIANS, 0]}>
          <ClinicRoom />
        </group>
      </Suspense>
    </Canvas>
  )
}


function CameraBinder() {
  useFrame(({ camera }) => {
    if (!camera) return
    camera.position.z = cameraZRef.current
    camera.position.y = CAM_Y
  })
  return null
}


function ChairCanvas({ scrollRef, groupRef, bgGroupRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, CAM_Y, CAM_Z_FAR], fov: CAM_FOV, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraBinder />
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[6, 5, -1]}
        intensity={2.2}
        color="#f1f5f9"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-6, 4, 2]} intensity={0.35} color="#94a3b8" />
      <directionalLight position={[0, 1.5, 4]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.04} />
        <DentalModel groupRef={groupRef} scrollRef={scrollRef} />
        <SyncerAndCamera
          chairGroupRef={groupRef}
          bgGroupRef={bgGroupRef}
          scrollRef={scrollRef}
        />
      </Suspense>
    </Canvas>
  )
}


export function DentalScene({ scrollRef }) {
  const chairGroupRef = useRef(null)
  const bgGroupRef = useRef(null)

  useEffect(() => {
    useGLTF.preload(GLB_URL)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>

      {/* Escenario de Fondo */}
      <div className="hero__3d-bg" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <BackgroundCanvas groupRef={bgGroupRef} />
      </div>

      {/* Silla Dental */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <ChairCanvas
          scrollRef={scrollRef}
          groupRef={chairGroupRef}
          bgGroupRef={bgGroupRef}
        />
      </div>

    </div>
  )
}


useGLTF.preload(GLB_URL)