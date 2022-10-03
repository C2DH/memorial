import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Plane, useHelper, useTexture } from '@react-three/drei'
import Pebble, { Dodecaedron, Sphere, Polyhedron } from './Pebble'
import Terrain from './Terrain'

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
        <fog attach="fog" args={['#ffefe5', 1, 25]} />

        <hemisphereLight intensity={0.5} color="#a1f4ff" groundColor="#713405" />
        <directionalLight intensity={1} position={[-100, 5, -100]} color="#5400bb" />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        {/* <ambientLight intensity={0.25} /> */}
        <Terrain />
        {/* <Environment files="sky.hdr" /> */}

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
         */}

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
              castShadow
              receiveShadow
            />
          )
        })}

        <OrbitControls autoRotate={true} autoRotateSpeed={0.2} enableZoom={false} />
      </Canvas>
    </div>
  )
}

// function Suzi(props) {
//   const { scene } = useGLTF('../Landscape.glb')

//   return <primitive object={scene} {...props} />
// }

export default HomeThreeLandscape
