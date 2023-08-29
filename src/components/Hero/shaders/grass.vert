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

uniform float instanceCount;
uniform float radius;

uniform sampler2D renderedTexture;
uniform sampler2D texBlade;

mat3 rotationMatrix(vec3 angles) {
    float s1 = sin(angles.x);
    float s2 = sin(angles.y);
    float s3 = sin(angles.z);
    float c1 = cos(angles.x);
    float c2 = cos(angles.y);
    float c3 = cos(angles.z);

    mat3 rx = mat3(1, 0, 0, 0, c1, -s1, 0, s1, c1);

    mat3 ry = mat3(c2, 0, s2, 0, 1, 0, -s2, 0, c2);

    mat3 rz = mat3(c3, -s3, 0, s3, c3, 0, 0, 0, 1);

    return rz * rx * ry;
}

void main() {
    // Varying early proxy
    vUv = uv;

    // Constants
    float PI = 3.14159265;

    // Attribute data deconstruction
    float instID = floor(instaceData);
    float randIDa = fract(instaceData);
    float randIDb = fract(instaceData * 10.0);

    vInstID = instID;
    vRandIDa = randIDa;
    vRandIDb = randIDb;

    float randomOffsetX = (randIDa - 0.5) * 0.35;
    float randomOffsetY = (randIDb - 0.5) * 0.35;

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

    // Textures data
    vec4 noiseTexture = texture2D(renderedTexture, instanceUv);
    vec4 bladeTexture = texture2D(texBlade, uv);

    float heighMap = noiseTexture.r;
    float windForce = (noiseTexture.g - 0.2) * 2.0;
    float windForceNormal = abs(windForce);
    float flexFactor = bladeTexture.r;

    vWindForce = windForce;

    vec3 positionGrid = vec3(x + randomOffsetX, 0.0, z + randomOffsetY);
    vec3 positionHeight = vec3(0.0, heighMap, 0.0);

    vec3 scaledPosition = position;

    float distCorrection = pow(length(instanceUv - vec2(0.5)), 2.5);

    scaledPosition.x *= 0.5 + randIDa * 0.5;
    scaledPosition.x *= 1.0 + 10.0 * distCorrection;
    scaledPosition.y -= 1.0 * distCorrection;
    scaledPosition.y *= 1.0 + distCorrection + randIDb * 0.75;

    float thetaY = mix(-PI, PI, randIDa);
    float thetaX = mix(-PI * 0.15, PI * 0.15, randIDa);

    vec3 rotationAngles = vec3(thetaX, thetaY, 0.0);
    vec3 rotatedPosition = rotationMatrix(rotationAngles) * scaledPosition;

    vec3 bendPosition = rotatedPosition;

    bendPosition.x += flexFactor * windForce + 0.95;
    bendPosition.y -= pow(flexFactor, 2.0) * windForceNormal * 2.0;
    bendPosition.z += flexFactor * windForce;

    vec3 positionNew = bendPosition + positionGrid + positionHeight;

    vNewPos = positionNew;
    vNormal = normalize(rotationMatrix(rotationAngles) * normal);

    gl_Position = projectionMatrix * modelViewMatrix * modelMatrix * vec4(positionNew, 1.0);
}