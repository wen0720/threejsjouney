precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
  // conatin the color of the fragment
  // vec4(r,g,b,a)
  // vec4 flagColor = texture2D(uTexture, vUv); // texture2D return vec4
  vec4 flagColor = texture2D(uTexture, vUv);
  flagColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = flagColor;
}