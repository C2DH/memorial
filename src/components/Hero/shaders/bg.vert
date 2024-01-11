precision highp float;

// three.js uniforms
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
// end of three.js uniforms

varying vec2 vUv;

uniform float zOffset;

void main() {
    vUv = uv;

    vec3 offsetPosition = position;

    offsetPosition.x += cameraPosition.x;
    offsetPosition.z += cameraPosition.z;

    vec4 modelPosition = modelMatrix * vec4(offsetPosition, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}