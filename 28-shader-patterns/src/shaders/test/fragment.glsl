#define PI 3.14159265358979329

varying vec2 vUv;


float getStrength(float y) {
    float times = 0.0;
    while(y - times > 0.0) {
        times += 0.1;
    }
    return times;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}



void main()
{
    // pattern 3
    // float strength = vUv.x;

    // pattern 4
    // float strength = vUv.y;

    // pattern 5
    // float strength = 1.0 - vUv.y;

    // pattern 6
    // float strength = vUv.y / 0.15 * 1.0;

    // pattern 7
    // mod 到達某一個檻之後，又會重新開始，有點像 %
    // float strength = mod(vUv.y / 0.1, 1.0);

    // pattern 8
    // float strength = step(0.5, mod(vUv.y / 0.1, 1.0));

    // pattern 9
    // float strength = step(0.8, mod(vUv.y / 0.1, 1.0));

    // pattern 10
    // float strength = step(0.8, mod(vUv.x / 0.1, 1.0));

    // pattern 11
    float strength = step(0.8, mod(vUv.x / 0.1, 1.0)) + step(0.8, mod(vUv.y / 0.1, 1.0));

    // pattern 12
    // 因為值不是1就是0，然後我們要取相乘不為 0 的
    // float strength = step(0.8, mod(vUv.x / 0.1, 1.0)) * step(0.8, mod(vUv.y / 0.1, 1.0));

    // pattern 13
    // float strength = step(0.4, mod(vUv.x / 0.1, 1.0)) * step(0.8, mod(vUv.y / 0.1, 1.0));

    // pattern 14
    // mod 事先區分成小的正方形
    // step 是控制小正方形中，哪些要出現（0 or 1）
    // float barX = step(0.4, mod(vUv.x / 0.1, 1.0)) * step(0.8, mod(vUv.y / 0.1, 1.0));
    // float barY = step(0.8, mod(vUv.x / 0.1, 1.0)) * step(0.4, mod(vUv.y / 0.1, 1.0));
    // float strength = barX + barY;

    // pattern 15
    // float barX = step(0.6, mod(vUv.x / 0.1, 1.0)) * step(0.8, mod(vUv.y / 0.1 + 0.1, 1.0));
    // float barY = step(0.8, mod(vUv.x / 0.1 + 0.1, 1.0)) * step(0.6, mod(vUv.y / 0.1, 1.0));
    // float strength = barX + barY;

    // pattern 16
    // float strength = abs(vUv.x - 0.5);

    // pattern 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // pattern 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // pattern 19
    // float strength = step(0.0, vUv.x) - step(0.3, vUv.x)
    //     + step(0.7, vUv.x) - step(1.0, vUv.x)
    //     + step(0.0, vUv.y) - step(0.3, vUv.y)
    //     + step(0.7, vUv.y) - step(1.0, vUv.y);
    // float strength = step(0.2, abs(vUv.x - 0.5)) + step(0.2, abs(vUv.y - 0.5));

    // pattern 20
    // float strengthOutter = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strengthInner = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = min(strengthInner, strengthOutter);

    // pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // pattern 22
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // pattern 23
    // float strength = random(vUv);

    // pattern 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // pattern 25
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // pattern 26
    // lenth 回傳該向量的長度
    // float strength = length(vUv);

    // pattern 27
    // float strength = length(vUv - vec2(0.5));
    // 只 vUv 與0.5,0.5 的距離
    // float strength = distance(vUv, vec2(0.5));

    // pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // pattern 29
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // pattern 30
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y);
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // pattern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // pattern 32
    // glsl 裡沒有 PI，自己設定
    // vec2 rotateUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // vec2 lightUvX = vec2(rotateUv.x * 0.1 + 0.45, rotateUv.y);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(rotateUv.y * 0.1 + 0.45, rotateUv.x);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // pattern 33
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // pattern 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // pattern 35
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern 36
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern 37
    // vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 38
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 39
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 40
    // float strength = atan(vUv.x, vUv.y);

    // pattern 41
    // float strength = atan(vUv.x - 0.5, vUv.y - 0.5);

    // pattern 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // pattern 43
    // float strength = mod(atan(vUv.x - 0.5, vUv.y - 0.5), 0.2) * 5.0;

    // pattern 44
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0);

    // pattern 45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // pattern 46
    // float strength = cnoise(vUv * 10.0);

    // pattern 47
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // pattern 48
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // pattern 50
    // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));


    // Color Version
    strength = clamp(0.0, 1.0, strength); // 讓 strength 最大不超出 0-1 之間
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    // Black and White Version
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // pattern 200
    // float strength = getStrength(vUv.y);
}