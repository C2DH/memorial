precision highp float;

// three.js uniforms
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

// three.js attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute mat4 instanceMatrix;
attribute vec3 instanceColor;

// Varyings to send data to the fragment shader
varying vec2 vUv;
varying vec4 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying mat4 vInstanceMatrix;
varying mat3 vNormalMatrix;
varying mat3 vTest;

void main() {
    vUv = uv;
    vColor = instanceColor;

    vNormal = normal;
    vInstanceMatrix = instanceMatrix;
    vNormalMatrix = normalMatrix;

    vTest = mat3(instanceMatrix);

    vec3 scaledPosition = position;
    scaledPosition *= 1.5;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(scaledPosition, 1.0);
    vWorldPosition = modelPosition;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}