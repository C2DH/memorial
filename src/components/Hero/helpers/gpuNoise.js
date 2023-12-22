let gl = null
let program = null
let buffer = null
let positionLoc = null
let uvLocation = null

function initializeWebGL() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  gl = canvas.getContext('webgl')

  const vertexSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `

  const fragmentSource = `
        precision highp float;

        uniform vec2 u_uv;
        
        float noise(vec2 uv) {
            return fract(sin(dot(uv, vec2(12.9898, 73.233))) * 43758.5453);
        }
        
        float smoothNoise(vec2 uv) {
            vec2 lv = fract(uv);
            vec2 id = floor(uv);
            lv = lv * lv * (3.0 - 2.0 * lv);
            float bl = noise(id);
            float br = noise(id + vec2(1, 0));
            float tl = noise(id + vec2(0, 1));
            float tr = noise(id + vec2(1, 1));
            float b = mix(bl, br, lv.x);
            float t = mix(tl, tr, lv.x);
            return mix(b, t, lv.y);
        }

        void main() {
          gl_FragColor = vec4(smoothNoise(u_uv), 0.0, 0.0, 1.0);
      }
    `

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexSource)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentSource)
  gl.compileShader(fragmentShader)

  program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  uvLocation = gl.getUniformLocation(program, 'u_uv')

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

  positionLoc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
}

export function getGpuNoise(uv) {
  if (!gl) initializeWebGL()

  gl.useProgram(program)

  gl.uniform2f(uvLocation, uv.x, uv.y)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionLoc)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  const pixel = new Uint8Array(4)
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

  return pixel[0] / 255.0
}
