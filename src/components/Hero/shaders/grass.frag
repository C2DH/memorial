precision highp float;

uniform sampler2D texBlade;
uniform sampler2D renderedTexture;
uniform vec3 skyColor;
uniform vec3 groundColor;

varying vec2 vUv;
varying float vRandIDa;
varying float vRandIDb;
varying vec2 vInstanceUv;
varying float vWindForce;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float segments = 8.0;
    float segmentWidth = 1.0 / segments;

    float offsetX = mod(floor(vRandIDa * segments), segments) * segmentWidth;

    vec2 texOffset = vec2(vUv.x + offsetX, vUv.y);
    vec4 texColor = texture2D(texBlade, texOffset);
    vec4 texNoise = texture2D(renderedTexture, vInstanceUv);

    if(texColor.g < 0.35)
        discard;

    float stiffness = texColor.r;
    float detail = texColor.g;
    float light = texColor.b;

    float depth = mix(0.1, 0.4, texNoise.r / 6.0);
    float clouds = mix(0.1, -0.1, texNoise.b);

    float hueRange = mix(0.1, 0.25, texNoise.b);
    float satRange = mix(0.75, 0.5, texNoise.b);
    float yelloRange = mix(1.25, 0.85, texNoise.b);

    float brightness = clamp(detail * yelloRange + depth + clouds, 0.2, 0.8);

    float bb = mix(brightness + (light * 0.5 - 0.25), brightness, vWindForce);

    vec3 hsvColor = vec3(hueRange, satRange, bb);
    vec3 rgbColor = hsv2rgb(hsvColor);

    vec3 gradientColor = mix(groundColor, rgbColor, pow(stiffness, 1.5));
    vec3 finalColor = mix(gradientColor, skyColor, texNoise.a);

    gl_FragColor = vec4(finalColor, 1.0);
}