import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Pebble, { Capsule } from './Pebble'
import Terrain from './Terrain'
import { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { Vector3 } from 'three'
import { useSpring, easings } from 'react-spring'
import PlayPauseBtn from './PlayPauseBtn'
import { useStore } from '../store'
import PebbleSideIcon from './PebbleSideIcon'
import CreatePebbleMenu from './CreatePebbleMenu'

const HomeThreeLandscape = ({
  pebbles = [],
  availableWidth,
  availableHeight,
  backgroudnColor = '#fdf8f4',
  withModel = false,
  maxRadius = 20,
  minRadius = 5,
  ...props
}) => {
  const orbitRef = useRef()
  const currentPebbleIdx = useRef(0)

  const [, setCameraPosition] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: {
      duration: 2700,
      easing: easings.easeInOutQuart,
    },
    onChange: (e) => {
      orbitRef.current.target = new Vector3(e.value.x, e.value.y, e.value.z)
    },
  }))
  const setSelectedPebble = useStore((state) => state.setSelectedPebble)
  // get points
  const pebblePositions = useMemo(() => {
    const theta = pebbles.length ? (Math.PI * 2) / pebbles.length : 0
    return pebbles.map((d, i) => {
      const dist = minRadius + Math.random() * (maxRadius - minRadius)
      const x = Math.cos(i * theta) * dist
      const y = 2 - Math.random() * 3 //
      const z = Math.sin(i * theta) * dist
      return [x, y, z]
    })
  }, [pebbles, maxRadius, minRadius])
  const [isPlaying, setIsPlaying] = useState(true)

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
      setSelectedPebble(pebbles[currentPebbleIdx.current])
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
  }, [isPlaying, pebblePositions, setCameraPosition, setSelectedPebble, pebbles])

  //Switch Camera to clicked pebble
  function SwitchCameraToPebble(ind) {
    // for(let j=0;j<pebbles.length;j++){
    //   currentPebbleIdx.current=j;
    //   pebbles[currentPebbleIdx.current].style.scale=2
    // }
    setIsPlaying(false) //Stopping automatical camera switch
    currentPebbleIdx.current = ind
    setSelectedPebble(pebbles[currentPebbleIdx.current])
    setCameraPosition.start({
      x: pebblePositions[currentPebbleIdx.current][0],
      y: pebblePositions[currentPebbleIdx.current][1],
      z: pebblePositions[currentPebbleIdx.current][2],
    })
  }

  return (
    <div
      id="canvas-container"
      style={{ width: availableWidth, height: availableHeight, zIndex: 0 }}
      className="position-absolute top-0"
      {...props}
    >
      <PlayPauseBtn playPause={{ playing: isPlaying, func: setIsPlaying }}></PlayPauseBtn>
      <PebbleSideIcon></PebbleSideIcon>
      <CreatePebbleMenu></CreatePebbleMenu>

      <Canvas>
        <color attach="background" args={[backgroudnColor]} />
        <fog attach="fog" args={[backgroudnColor, 1, 25]} />
        {/* 
        <PerspectiveCamera position={[0, 10, 0]} /> */}
        <hemisphereLight intensity={3} color="#ffeb6b" groundColor="#077105" />
        <directionalLight intensity={0.9} position={[-100, 5, -100]} color="#ffdbae" />
        <directionalLight intensity={0.9} position={[-100, 5, 100]} color="#f3ffc0" />
        <directionalLight intensity={0.3} color="#fff1aa" position={[100, 5, 100]} />
        <directionalLight intensity={0.6} color="#ffb3ef" position={[100, 5, -100]} />
        {/* <Particles amount={333} size={0.01} opacity={0.6} /> */}
        <ErrorBoundary>
          <Suspense fallback={null}>{withModel ? <Suzi /> : <Terrain />}</Suspense>
        </ErrorBoundary>
        {pebbles.map((p, i) => {
          return (
            <Pebble
              myIndex={i}
              funcCamera={SwitchCameraToPebble}
              key={i}
              geometry={p.geometry ?? Capsule}
              scale={p.scale ?? 0.5}
              position={pebblePositions[i]}
              title={p.title}
            />
          )
        })}

        <OrbitControls
          enableDamping
          ref={orbitRef}
          autoRotate={true}
          maxDistance={10}
          minDistance={3}
          autoRotateSpeed={0.12}
          panSpeed={1.25}
          enableZoom={false}
          maxPolarAngle={1.45}
          minPolarAngle={0.2}
        />
      </Canvas>
    </div>
  )
}

function Suzi(props) {
  const { scene } = useGLTF('/Landscape.glb')
  return <primitive object={scene} {...props} />
}

export default HomeThreeLandscape
