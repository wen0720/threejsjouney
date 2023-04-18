// 因為 three.js 那邊是用 shaderMaterial，已經有一些內建的參數在裡面了
// 所以不用在定義 uv

varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}