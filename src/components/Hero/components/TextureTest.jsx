import { useRenderedTexture } from '../hooks/useRenderedTexture'
import * as c from '../sceneConfig'

export const TextureTest = () => {
  const { renderedTexture, portal } = useRenderedTexture()

  return (
    <>
      {portal}
      <mesh
        position={[0, 0, c.sceneRadius]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        frustumCulled={false}
      >
        <planeGeometry args={[c.sceneLoopLength, c.sceneLoopLength]} />
        <meshBasicMaterial map={renderedTexture} />
      </mesh>
    </>
  )
}

export const vertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`

export const fragment = /* glsl */ `
uniform sampler2D renderedTexture;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(renderedTexture, vUv);
  gl_FragColor = texColor;
}
`
