precision highp float;

uniform sampler2D renderedTexture;
uniform vec3 skyColor;
uniform vec3 groundColor;
varying vec2 vUv;

void main() {
    vec4 texNoise = texture2D(renderedTexture, vUv);

    vec3 finalColor = mix(groundColor, skyColor, (texNoise.a));

    gl_FragColor = vec4(vec3(finalColor), 1.0);
}