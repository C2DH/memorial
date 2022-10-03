import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Pebble, { Dodecaedron, Sphere, Polyhedron } from './Pebble'
import { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'

const HomeThreeLandscape = ({
  pebbles = [],
  availableWidth,
  availableHeight,
  backgroudnColor = '#fdf8f4',
  ...props
}) => {
  const theta = pebbles.length ? (Math.PI * 2) / pebbles.length : 0
  const maxRadius = 20
  const minRadius = 5

  return (
    <div
      id="canvas-container"
      style={{ width: availableWidth, height: availableHeight, zIndex: 0 }}
      className="position-absolute top-0"
    >
      <Canvas camera={{ position: [0, 0, 2], far: 3000, fov: 50 }}>
        <color attach="background" args={[backgroudnColor]} />
        <fog attach="fog" args={[backgroudnColor, 1000, 3000]} />
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Suzi rotation={[0, 0, 0]} scale={0.6} position={[0, -400, 0]} />
          </Suspense>
        </ErrorBoundary>
        <ambientLight intensity={0.25} />
        <directionalLight color="gold" position={[16, 20, 25]} />

        {/*  <Pebble scale={0.5} position={[0, 0, -10]} title={'Hello'} />
         <Pebble
           geometry={Dodecaedron}
           color="pink"
           scale={0.5}
           position={[3, 1, -5]}
           title={'Yaroslav'}
         />
         <Pebble geometry={Sphere} scale={0.5} position={[5, -1, -3]} title={'How are you?'} />
         <Pebble geometry={Polyhedron} scale={0.5} position={[5, -1, -1]} title={'How are you?'} />
         <OrbitControls autoRotate={true} autoRotateSpeed={0.2} enableZoom={false} /> */}

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

        <OrbitControls autoRotate={true} autoRotateSpeed={0.2} enableZoom={false} />
      </Canvas>
    </div>
  )
}

function Suzi(props) {
  const { scene } = useGLTF('/Landscape.gltf')

  return <primitive object={scene} {...props} />
}

export default HomeThreeLandscape
