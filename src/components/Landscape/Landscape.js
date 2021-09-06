import React from 'react'
import ResizeableCanvas from '../ResizeableCanvas'
import { OrbitControls, Stage } from '@react-three/drei'
// import { Scene, Color, FogExp2, PlaneGeometry } from 'three'
import { TextureLoader } from 'three'
import {
  Canvas, useLoader, fog
} from '@react-three/fiber'
import Terrain from './Terrain'

//
// function Box(props) {
//   // This reference will give us direct access to the THREE.Mesh object
//   const ref = useRef()
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => (ref.current.rotation.x += 0.01))
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={ref}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }

/**
  https://github.com/Mozzius/terrain-fiber/tree/master/src
*/
const LandscapeGenerator = ({ ctx, width, height, textureWidth=100, textureHeight=100 }) => {
  if(!ctx) {
    return null
  }
  const onCreatedHandler = ({ camera }) => {
    camera.zoom=10
    camera.position.set(0,0,0)
    camera.lookAt(10, 0, 0)
  }

  return (
    <div className="LandscapeGenerator position-absolute" style={{ top: 100, height: height, width, zIndex:0 }}>
    <React.Suspense fallback={<div>Loading...</div>}>
    <Canvas
      dpr={window.devicePixelRatio}
      shadows
      onCreated={onCreatedHandler}
      camera={{ position: [0.75, 5.75, 0.75]}}
    >
      <fog args={['black', 100, 700]} />

      <OrbitControls autoRotate autoRotateSpeed={.12} enableZoom={false}/>
      <Stage shadows intensity={1} environment="city" preset="rembrandt">
      <Terrain
          seed={4}
          size={200}
          height={0.2}
          levels={8}
          scale={12}
          offset={{x: 0, z: -400}}
        />
      </Stage>
    </Canvas>
    </React.Suspense>
    </div>
  )
  // const canvas = document.getElementById('debug-canvas')
  //   const c = canvas.getContext('2d')
  //   c.fillStyle = 'black'
  //   c.fillRect(0,0,canvas.width, canvas.height)
  //
  //   for(let i=0; i<canvas.width; i++) {
  //       for(let j=0; j<canvas.height; j++) {
  //           let v =  octave(i/canvas.width,j/canvas.height,16)
  //           const per = (100*v).toFixed(2)+'%'
  //           c.fillStyle = `rgb(${per},${per},${per})`
  //           c.fillRect(i,j,1,1)
  //       }
  //   }
  //   return c.getImageData(0,0,canvas.width,canvas.height)
  //
  // let v =  octave(i/width,j/height,16)
  // return (
  //   <canvas>
  // )
  // return(
  //   <ResizeableCanvas Renderer={LandscapeGenerator} width={width} height={height} />
  // )
}

const Landscape = ({ width, height}) => {
  return(
    <ResizeableCanvas Renderer={LandscapeGenerator} canvasHeight={100} canvasWidth={100} width={width} height={height} />
  )
}

export default Landscape
