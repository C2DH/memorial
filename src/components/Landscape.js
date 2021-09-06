import React, {useRef, useState} from 'react'
import ResizeableCanvas from './ResizeableCanvas'
import { generateTexture } from '../logic/noise'
// import { Scene, Color, FogExp2, PlaneGeometry } from 'three'
import { TextureLoader } from 'three'
import { Canvas, useLoader, meshStandardMaterial, useFrame, mesh, boxGeometry, ambientLight, pointLight
} from '@react-three/fiber'
import { Plane } from '@react-three/drei'


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


const LandscapeGenerator = ({ ctx, width, height, textureWidth=100, textureHeight=100 }) => {
  const displacementMap = useLoader(TextureLoader, "/elevation.png")
  const normalMap = useLoader(TextureLoader, "/normals.png");
  if(!ctx) {
    return null
  }

  return (
    <div className="LandscapeGenerator position-absolute top-0" style={{ height, width, zIndex: -1 }}>
    <Canvas height={height}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />*/}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        args={[64, 64, 64, 64]}
      >
        <meshStandardMaterial
        attach="material"
        color="#61bfad"
        metalness={0.2}
        displacementMap={displacementMap}
        />
      </Plane>
    </Canvas>
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
