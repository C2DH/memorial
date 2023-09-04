precision highp float;

uniform vec3 cam;
uniform float time;
uniform float terrainAmplitude;
uniform float terrainFrequency;
uniform float sceneLoopLength;

varying vec2 vUv;

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

float customGradient(float t) {
  if(t < 0.5)
    return 0.0;
  return (t - 0.5) * 2.5;
}

void main() {
  vec2 camVec = vec2(cam.x, cam.z);
  vec2 timeVec = vec2(time * -0.125 * 0.5);

  vec2 camFactor = vUv + (camVec / sceneLoopLength);

  float displacement = smoothNoise(camFactor * terrainFrequency);

  float wind = smoothNoise((camFactor + timeVec * 0.25) * 48.0);
  wind += smoothNoise((camFactor - timeVec * 0.5) * 128.0) * 0.5;
  wind += smoothNoise((camFactor - timeVec * 0.5) * 8.0) * 0.35;
  wind += smoothNoise((camFactor - timeVec * 0.5) * 6.0) * 0.25;

  wind /= 2.15;

  float clouds = smoothNoise((camFactor) * 42.0);
  clouds += smoothNoise((camFactor) * 120.0) * 0.5;
  clouds += smoothNoise((camFactor) * 8.0) * 0.5;

  wind /= 2.0;

  float fog = 0.0;

  // Calculate the distance from the current UV to the center
  float distFromCenter = length(vec2(vUv.x * 2.0, vUv.y) - vec2(1.0, 0.0));

  // Map this distance to [0,1] range to create a radial gradient
  float radialGradient = customGradient(distFromCenter);

  // Previous noise-based fog calculation
  float noiseFog = smoothNoise((camFactor) * 4.0);
  noiseFog += smoothNoise((camFactor + timeVec) * 12.0) * 0.5;
  noiseFog += smoothNoise((camFactor) * 16.0) * 0.25;
  noiseFog /= 1.75;

  // Multiply the radial gradient with the noise-based fog
  fog = clamp(radialGradient * 1.5 - noiseFog * 1.5, 0.0, 1.0);

  gl_FragColor = vec4(displacement * terrainAmplitude, wind * 1.2, clouds, fog);
}
