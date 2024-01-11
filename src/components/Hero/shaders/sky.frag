precision highp float;

uniform sampler2D renderedTexture;
uniform vec3 skyColor;
uniform vec4 groundColor;
varying vec2 vUv;

uniform sampler2D skyMap;

void main() {
    vec4 textureColor = texture2D(skyMap, vUv);

    vec3 texture = textureColor.rgb;

    vec3 finalColor = mix(skyColor, texture, textureColor.a);

    gl_FragColor = vec4(finalColor, 1.0);
}