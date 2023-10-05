precision highp float;

uniform sampler2D texBlade;
uniform sampler2D grassNormals;
uniform sampler2D grassBendNormals;
uniform sampler2D renderedTexture;
uniform vec3 skyColor;
uniform vec3 groundColor;
uniform vec3 lightDirection;
uniform float terrainAmplitude;

varying vec2 vUv;
varying float vRandIDa;
varying float vRandIDb;
varying vec2 vInstanceUv;
varying float vWindForce;
varying vec3 vNewPos;
varying mat4 vRotMat;
varying mat4 vRotMat2;

varying float vScale;

void main() {

    vec4 computeTexture = texture2D(renderedTexture, vInstanceUv);

    float height = computeTexture.r;
    float heightFactor = mix(0.25, 1.0, height / terrainAmplitude);

    vec3 yellows = vec3(0.85, 0.65, 0.25) * 1.5;
    vec3 greens = vec3(0.35, 1.0, 0.5) * 1.5;

    vec3 color = mix(yellows, greens, (vScale + vRandIDb * 0.5) / 1.5);
    color = mix(groundColor, color, heightFactor);

    vec3 light = normalize(lightDirection);

    vec3 normals = 2.0 * texture2D(grassNormals, vUv).rgb - 1.0;
    vec3 normalsBend = 2.0 * texture2D(grassBendNormals, vUv).rgb - 1.0;

    vec3 c_normals = vec3(normals.x, normals.z, -normals.y);
    vec3 c_normalsBend = vec3(normalsBend.x, normalsBend.z, -normalsBend.y);

    c_normals = (vRotMat2 * vec4(c_normals, 1.0)).xyz;
    c_normalsBend = (vRotMat * vec4(c_normalsBend, 1.0)).xyz;

    vec3 computedNormals = mix(c_normals, c_normalsBend, vWindForce);

    float diffuse = max(dot(computedNormals, light), 0.25);
    vec3 diffuseColor = diffuse * color;

    float blendFactor = smoothstep(computeTexture.r + 0.0, computeTexture.r + 0.35, vNewPos.y);
    vec3 blendColor = mix(groundColor, diffuseColor, blendFactor);

    float fog = computeTexture.a;
    vec3 fogColor = mix(blendColor, skyColor, fog);

    vec3 finalColor = fogColor;

    gl_FragColor = vec4(finalColor, 1.0);
}