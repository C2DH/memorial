import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Pebble from './Pebble'

const HomeThreeLandscape = ({ pebbles = [], availableWidth, availableHeight, ...props }) => {
  const theta = pebbles.length ? (Math.PI * 2) / pebbles.length : 0
  const maxRadius = 20
  const minRadius = 5

  return (
    <div
      id="canvas-container"
      style={{ width: availableWidth, height: availableHeight, zIndex: 0 }}
      className="position-absolute top-0"
    >
      <Canvas shadows camera={{ position: [0, 0, 2], far: 3000, fov: 50 }}>
        <color attach="background" args={['#ffefe5']} />
        <fog attach="fog" args={['#ffefe5', 1000, 3000]} />
        <Suzi rotation={[0, 0, 0]} scale={0.6} position={[0, -400, 0]} />
        <ambientLight intensity={0.25} />
        <directionalLight color="gold" position={[16, 20, 25]} />
        {pebbles.map((p, i) => {
          const dist = minRadius + Math.random() * (maxRadius - minRadius)
          const x = Math.cos(i * theta) * dist
          const y = 2 - Math.random() * 3 //
          const z = Math.sin(i * theta) * dist

          return (
            <Pebble
              key={i}
              geometry={p.geometry}
              scale={p.scale ?? 0.5}
              position={[x, y, z]}
              title={p.title}
            />
          )
        })}

        <OrbitControls autoRotate={false} autoRotateSpeed={0.2} enableZoom={false} />
      </Canvas>
    </div>
  )
}

function Suzi(props) {
  const { scene } = useGLTF('../Landscape.gltf')

  return <primitive object={scene} {...props} />
}

export default HomeThreeLandscape
