precision highp float;

// three.js uniforms
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute mat4 instanceMatrix;
attribute vec3 instanceColor;
// end of three.js uniforms

varying vec2 vUv;
varying vec4 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;

vec3 transformNormal(vec3 v, mat3 m) {
    return m * (v / vec3(dot(m[0], m[0]), dot(m[1], m[1]), dot(m[2], m[2])));
}

void main() {
    vUv = uv;
    vColor = instanceColor;
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

    vWorldPosition = modelPosition;
    vNormal = transformNormal(vec3(normal), mat3(instanceMatrix));

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}