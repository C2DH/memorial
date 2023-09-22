precision highp float;

uniform vec3 skyColor;

void main() {
    gl_FragColor = vec4(skyColor, 1.0);
}