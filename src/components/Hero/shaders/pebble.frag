precision highp float;

varying vec2 vUv;
varying vec4 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying mat4 vInstanceMatrix;
varying mat3 vNormalMatrix;
varying mat3 vTest;
varying float vHighlight;

uniform sampler2D normalMap;
uniform sampler2D diffuseMap;
uniform sampler2D renderedTexture;
uniform vec3 lightDirection;
uniform vec3 skyColor;
uniform vec3 groundColor;
uniform vec3 cameraPosition;
uniform float zOffset;

// Convert RGB to HSV
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Shift the hue of a color
vec3 shiftHue(vec3 colorRGB, float hueShift) {
    vec3 colorHSV = rgb2hsv(colorRGB);
    colorHSV.x = mod(colorHSV.x + hueShift, 1.0);
    return hsv2rgb(colorHSV);
}

// Saturation
vec3 desaturate(vec3 color, float amount) {
    float gray = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    return mix(color, vec3(gray), amount);
}

void main() {
    float distanceToCamera = length(vWorldPosition.xyz - cameraPosition);

    float radius = 48.0;
    float loopLength = radius * 2.0;

    if(distanceToCamera > radius + zOffset) {
        discard;
    }

    float x = vWorldPosition.x;
    float z = vWorldPosition.z - zOffset;

    x = mod(x - cameraPosition.x + radius, loopLength) + cameraPosition.x - radius;
    z = mod(z - cameraPosition.z + radius, loopLength) + cameraPosition.z - radius;

    vec2 instanceUv = vec2((x - (cameraPosition.x - radius)) / loopLength, (z - (cameraPosition.z - radius)) / loopLength);

    vec4 computeTexture = texture2D(renderedTexture, instanceUv);

    vec3 color = 2.0 * texture2D(diffuseMap, vUv).xyz - 1.0;

    vec3 light = normalize(lightDirection);

    vec3 normals = 2.0 * texture2D(normalMap, vUv).xyz - 1.0;

    vec3 c_normals = vec3(normals.x, normals.z, -normals.y);

    vec3 transformedNormals = normalize(mat3(vInstanceMatrix) * c_normals);

    // Shift hue of color
    vec3 hsvCol = rgb2hsv(vColor + vHighlight);
    float hueShiftAmount = -0.66 + hsvCol.x;

    color = desaturate(color, 0.5);
    color = shiftHue(color, hueShiftAmount);

    float diffuse = max(dot(transformedNormals, light), 0.15);
    vec3 diffuseColor = mix(diffuse * skyColor, diffuse * color * 1.5, vHighlight);

    float blendFactor = smoothstep(computeTexture.r + 0.0, computeTexture.r + 1.2, vWorldPosition.y);
    vec3 blendColor = mix(groundColor * vec3(0.35, 1.0, 0.5), diffuseColor, blendFactor);

    float fog = computeTexture.a;
    vec3 fogColor = mix(blendColor, skyColor, fog);

    vec3 finalColor = fogColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
