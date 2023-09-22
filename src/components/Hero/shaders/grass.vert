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

attribute float instaceData;
varying vec2 vUv;

varying float vInstID;
varying float vRandIDa;
varying float vRandIDb;
varying float vWindForce;
varying vec3 vNormal;
varying vec3 vNewPos;
varying vec2 vInstanceUv;
varying mat4 vRotMat;
varying mat4 vRotMat2;
varying float vScale;

uniform float instanceCount;
uniform float radius;

uniform sampler2D renderedTexture;
uniform sampler2D grassDisplacement;
uniform sampler2D texBlade;

uniform float zOffset;

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

mat4 rotationY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat4(c, 0.0, s, 0.0, 0.0, 1.0, 0.0, 0.0, -s, 0.0, c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

void main() {
    // Constants
    float PI = 3.14159265;

    // Varying early proxy
    vUv = uv;

    // Attribute data deconstruction
    float instID = floor(instaceData);
    float randIDa = fract(instaceData);
    float randIDb = fract(instaceData * 10.0);

    vInstID = instID;
    vRandIDa = randIDa;
    vRandIDb = randIDb;

    float randomOffsetX = (randIDa - 0.5) * 0.5;
    float randomOffsetY = (randIDb - 0.5) * 0.5;

    // Square distribution
    float n = sqrt(instanceCount);
    float i = mod(instID, n);
    float j = floor(instID / n);

    float loopLength = radius * 2.0;

    float x = (i / n) * loopLength - radius;
    float z = (j / n) * loopLength - radius;

    // Grid wrapping on x/z axis
    x = mod(x - cameraPosition.x + radius, loopLength) + cameraPosition.x - radius;
    z = mod(z - cameraPosition.z + radius, loopLength) + cameraPosition.z - radius;

    // Normalized texture coordinates
    vec2 instanceUv = vec2((x - (cameraPosition.x - radius)) / loopLength, (z - (cameraPosition.z - radius)) / loopLength);

    vInstanceUv = instanceUv;

    float scaleNoise = smoothNoise(vec2(x, z) * 0.25);
    scaleNoise += smoothNoise(vec2(x, z) * 1.0) * 0.75;
    scaleNoise /= 1.75;

    float scaleValue = mix(0.8, 1.8, scaleNoise);

    vScale = scaleValue;

    // Textures data
    vec4 noiseTexture = texture2D(renderedTexture, instanceUv);
    vec4 bend = texture2D(grassDisplacement, uv);

    vec3 bendVec = vec3(position.x, bend.z, bend.y);

    float heighMap = noiseTexture.r;
    float windForce = (noiseTexture.g);

    vWindForce = windForce;

    vec3 positionGrid = vec3(x + randomOffsetX, 0.0, z + randomOffsetY);
    vec3 positionHeight = vec3(0.0, heighMap, 0.0);

    mat4 rotMat = rotationY(-PI * (0.5 - randIDa * 0.15));
    mat4 rotMat2 = rotationY(PI * (0.1 - randIDb * 0.8));

    vRotMat = rotMat;
    vRotMat2 = rotMat;

    bendVec = (rotMat * vec4(bendVec, 1.0)).xyz;
    vec3 rotPos = (rotMat2 * vec4(position, 1.0)).xyz;

    vec3 bendPosition = mix(rotPos, bendVec, windForce);

    bendPosition *= scaleValue;

    vec3 positionNew = bendPosition + positionGrid + positionHeight;
    positionNew.z += zOffset;

    vNewPos = positionNew;

    gl_Position = projectionMatrix * modelViewMatrix * modelMatrix * vec4(positionNew, 1.0);
}