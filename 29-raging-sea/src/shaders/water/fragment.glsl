uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiply;

varying float vElevation;

void main() {
  float mixStrength = vElevation * uColorMultiply + uColorOffset;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
}