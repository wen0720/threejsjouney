// 這邊也是 three.js 提供的
/*
The modelMatrix will apply all transformations relative to the Mesh. If we scale, rotate or move the Mesh, these transformations will be contained in the modelMatrix and applied to the position.
The viewMatrix will apply transformations relative to the camera. If we rotate the camera to the left, the vertices should be on the right. If we move the camera in direction of the Mesh, the vertices should get bigger, etc.
The projectionMatrix will finally transform our coordinates into the final clip space coordinates.
*/

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position; // 這裡是 three.js 的 geometry 提供，就是以前寫過的 position 的 BufferAttribute
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;
  vElevation = elevation;

  // 因為 gl_Position 是 vec4，所以後面這樣寫 vec4(position, 1.0)
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}