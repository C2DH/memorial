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

void main() {
    float distanceToCamera = length(vWorldPosition.xyz - cameraPosition);
    float radius = 48.0;

    if(distanceToCamera > radius + zOffset) {
        discard;
    }

    vec3 textureColor = texture2D(diffuseMap, vUv).rgb;

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

    float diffuse = max(dot(sampledNormal, light), 0.05);

    // Shift hue of textureColor
    vec3 hsvCol = rgb2hsv(vColor);
    float hueShiftAmount = -0.66 + hsvCol.x;
    textureColor = shiftHue(textureColor, hueShiftAmount);

    vec3 colorAbove = diffuse * textureColor;
    vec3 colorBelow = groundColor;

    float blendFactor = smoothstep(texNoise.r + 0.0, texNoise.r + 1.5, vWorldPosition.y);

    vec3 color = mix(colorBelow, colorAbove, blendFactor);

    // Fog:
    color = mix(color, skyColor, texNoise.a);

    gl_FragColor = vec4(color, 1.0);
}