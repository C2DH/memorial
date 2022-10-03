import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Pebble, { Dodecaedron } from './Pebble'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { Vector3 } from 'three'
import { Info } from 'react-feather'
import { useSpring, easings } from 'react-spring'

const HomeThreeLandscape = ({
  pebbles = [],
  availableWidth,
  availableHeight,
  backgroudnColor = '#fdf8f4',
  ...props
}) => {
  const [cameraPosition, setCameraPosition] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: {
      duration: 2000,
      easing: easings.easeInOutQuart,
    },
    onChange: (e) => {
      orbitRef.current.target = new Vector3(e.value.x, e.value.y, e.value.z)
    },
  }))
  const orbitRef = useRef()
  const theta = pebbles.length ? (Math.PI * 2) / pebbles.length : 0
  const maxRadius = 20
  const minRadius = 5
  const currentPebbleIdx = useRef(-1)
  // get points
  const pebblePositions = useMemo(
    () =>
      pebbles.map((d, i) => {
        const dist = minRadius + Math.random() * (maxRadius - minRadius)
        const x = Math.cos(i * theta) * dist
        const y = 2 - Math.random() * 3 //
        const z = Math.sin(i * theta) * dist
        return [x, y, z]
      }),
    [pebbles],
  )
  const [isPlaying, setisPlaying] = useState(true)

  useLayoutEffect(() => {
    let t = 0
    const h = () => {
      // if (currentPebbleIdx.current === -1) {
      //   setCameraPosition.set(orbitRef.current.target)
      // }
      if (currentPebbleIdx.current + 1 < pebblePositions.length) {
        currentPebbleIdx.current += 1
      } else {
        currentPebbleIdx.current = 0
      }
      console.debug(
        '[HomeThreeLandscape] done timeout. idx=',
        currentPebbleIdx.current,
        pebblePositions[currentPebbleIdx.current],
      )
      setCameraPosition.start({
        x: pebblePositions[currentPebbleIdx.current][0],
        y: pebblePositions[currentPebbleIdx.current][1],
        z: pebblePositions[currentPebbleIdx.current][2],
      })
      // orbitRef.current.target = pebblePositions[currentPebbleIdx.current]
      t = setTimeout(h, 5000)
    }
    console.debug('[HomeThreeLandscape] playing:', isPlaying)

    if (!isPlaying) {
      clearTimeout(t)
    } else {
      t = setTimeout(h, 5000)
    }
    return () => clearTimeout(t)
  }, [isPlaying])
  // camera.lookAt( point );

  return (
    <div
      id="canvas-container"
      style={{ width: availableWidth, height: availableHeight, zIndex: 0 }}
      className="position-absolute top-0"
      {...props}
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
          return (
            <Pebble
              key={i}
              geometry={p.geometry ?? Dodecaedron}
              scale={p.scale ?? 0.5}
              position={pebblePositions[i]}
              title={p.title}
            />
          )
        })}

        <OrbitControls ref={orbitRef} autoRotate={true} autoRotateSpeed={0.2} enableZoom={false} />
      </Canvas>
    </div>
  )
}

function Suzi(props) {
  const { scene } = useGLTF('/Landscape.glb')

  return <primitive object={scene} {...props} />
}

export default HomeThreeLandscape
