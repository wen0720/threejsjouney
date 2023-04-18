varying vec3 vColor;

void main() {
  // Disc
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = step(0.5, strength);
  // strength = 1.0 - strength;

  // Diffuse
  // float strength = 1.0 - (distance(gl_PointCoord, vec2(0.5)) * 2.0);

  // Light
  float strength = pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 5.0);

  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
}
