precision highp float;

uniform vec3 lightDirection;

uniform vec3 skyColor;
uniform vec3 groundColor;
uniform vec3 cameraPosition;

uniform sampler2D diffuseMap;
uniform sampler2D renderedTexture;
uniform sampler2D normalMap;

varying vec4 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vColor;

uniform float zOffset;

void main() {
    float distanceToCamera = length(vWorldPosition.xyz - cameraPosition);
    float radius = 48.0;

    if(distanceToCamera > radius + zOffset) {
        discard;
    }

    float loopLength = radius * 2.0;

    float x = vWorldPosition.x;
    float z = vWorldPosition.z - zOffset;

    x = mod(x - cameraPosition.x + radius, loopLength) + cameraPosition.x - radius;
    z = mod(z - cameraPosition.z + radius, loopLength) + cameraPosition.z - radius;

    // Normalized texture coordinates
    vec2 instanceUv = vec2((x - (cameraPosition.x - radius)) / loopLength, (z - (cameraPosition.z - radius)) / loopLength);

    vec4 texNoise = texture2D(renderedTexture, instanceUv);

    vec3 light = normalize(lightDirection);

    // Sample the normal map
    vec3 sampledNormal = texture2D(normalMap, vUv).xyz;
    sampledNormal = 2.0 * sampledNormal - 1.0;

    // Combine with original normal
    vec3 perturbedNormal = normalize(vNormal + sampledNormal);

    // Use perturbedNormal instead of vNormal for shading calculations
    float diffuse = max(dot(perturbedNormal, light), 0.0);

    vec3 textureColor = texture2D(diffuseMap, vUv).rgb;

    // vec3 colorAbove = (0.1 + diffuse) * skyColor * textureColor + 0.1;
    vec3 colorAbove = diffuse * textureColor * 0.5;
    vec3 colorBelow = groundColor;

    float blendFactor = smoothstep(texNoise.r + 0.2, texNoise.r + 1.2, vWorldPosition.y - (textureColor.r - textureColor.g));

    vec3 color = mix(colorBelow, colorAbove, blendFactor);

    vec3 colorClamp = clamp(color * 1.5, vec3(0.0), vec3(1.0));

    color = mix(colorClamp, skyColor, texNoise.a);

    gl_FragColor = vec4(color, 1.0);
}