uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 randomness;

varying vec3 vColor;

void main() {
  /**
  * Position
  */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(modelPosition.x, modelPosition.y);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // 太大了，* 0.2
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.xyz += randomness.xyz;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  /**
  * size
  */
  gl_PointSize = uSize * aScale;

  /* perspective */
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = color;
}
