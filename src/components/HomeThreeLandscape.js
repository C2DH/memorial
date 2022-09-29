import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

const HomeThreeLandscape = ({ availableWidth, availableHeight, ...props }) => {
  return (
    <div
      id="canvas-container"
      style={{ width: availableWidth, height: availableHeight }}
      className="position-absolute"
    >
      <Canvas shadows camera={{ position: [0, 0, 2], far: 3000, fov: 50 }}>
        <color attach="background" args={['#ffefe5']} />
        <fog attach="fog" args={['#ffefe5', 1000, 3000]} />
        <Suzi rotation={[0, 0, 0]} scale={0.6} position={[0, -400, 0]} />
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[16, 20, 25]} />
        <Suspense fallback={null}></Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.2} enableZoom={false} />
      </Canvas>
    </div>
  )
}

function Suzi(props) {
  const { scene } = useGLTF('../Landscape.gltf')

  return <primitive object={scene} {...props} />
}

export default HomeThreeLandscape
