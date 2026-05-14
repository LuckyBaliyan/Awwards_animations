// ============================================================
//  VORTEX SPIN SHADER — 26px — 5 VARIANTS

//  Variant 1 — Classic Vortex        (original spiral sweep)
//  Variant 2 — Double Helix          (two counter-rotating spirals)
//  Variant 3 — Pulsing Rings         (concentric ring dissolve + spin)
//  Variant 4 — Reverse Vortex        (spiral tightens inward, not out)
//  Variant 5 — Chaotic Storm         (high-noise turbulent spin)
// ============================================================

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// ── SHARED NOISE BLOCK (copy into whichever variant you use standalone) ──────
const _noise = `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);  vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy = vec4(Pi0.yy,Pi1.yy);
    vec4 iz0 = Pi0.zzzz, iz1 = Pi1.zzzz;
    vec4 ixy  = permute(permute(ix)+iy);
    vec4 ixy0 = permute(ixy+iz0), ixy1 = permute(ixy+iz1);
    vec4 gx0=ixy0/7.0, gy0=fract(floor(gx0)/7.0)-0.5; gx0=fract(gx0);
    vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.0));
    gx0-=sz0*(step(0.0,gx0)-0.5); gy0-=sz0*(step(0.0,gy0)-0.5);
    vec4 gx1=ixy1/7.0, gy1=fract(floor(gx1)/7.0)-0.5; gx1=fract(gx1);
    vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.0));
    gx1-=sz1*(step(0.0,gx1)-0.5); gy1-=sz1*(step(0.0,gy1)-0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
    g000*=norm0.x; g100*=norm0.y; g010*=norm0.z; g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
    g001*=norm1.x; g101*=norm1.y; g011*=norm1.z; g111*=norm1.w;
    float n000=dot(g000,Pf0), n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)), n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z)), n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz)), n111=dot(g111,Pf1);
    vec3 fxyz=fade(Pf0);
    float nz =mix(mix(n000,n100,fxyz.x),mix(n010,n110,fxyz.x),fxyz.y);
    float ndz=mix(mix(n001,n101,fxyz.x),mix(n011,n111,fxyz.x),fxyz.y);
    return 2.2*mix(nz,ndz,fxyz.z);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 1 — CLASSIC VORTEX
//  Angular sweep from center outward. Outer pixels dissolve last.
//  Noise adds organic tendril fringe to the spiral arm.
// ─────────────────────────────────────────────────────────────────────────────
export const fragmentShader_V1_ClassicVortex = `
  uniform float uTransition;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBorderColor;
  varying vec2  vUv;
  ${_noise}
  void main() {
    vec2 grid        = uResolution / 26.0;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect     = uResolution.x / uResolution.y;
    vec2  cuv        = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    vec2  dUv = cuv + cnoise(vec3(cuv * 5.0, uTime * 0.1)) * 0.15;
    float ns  = cnoise(vec3(dUv * 5.0, uTime * 0.2));

    float angle = atan(cuv.y - 0.5, cuv.x - 0.5);
    float r     = length(cuv - 0.5) / (length(vec2(aspect, 1.0)) * 0.5);
    float swirl = angle / (3.14159265 * 2.0) + 0.5 + r * 1.5;
    swirl       = mod(swirl + ns * 0.3, 1.0);

    float raw      = (swirl - (uTransition * 1.8 - 0.4)) * 8.0 + ns * 0.8;
    float strength = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, 0.7, raw) * smoothstep(2.5, 0.7, raw);
    edge *= min(uTransition * 5.0, 1.0);

    float bp = sin(uTime * 1.5) * 0.5 + 0.5;
    float cr = sin(uTime * 2.3 + 3.14159) * 0.5 + 0.5;
    vec3  g1 = uBorderColor;
    vec3  g2 = vec3(uBorderColor.z, uBorderColor.x, uBorderColor.y);
    vec3  ec = mix(mix(g1,g2,cr)*0.015, mix(g1,g2,cr)*1.5, bp);

    gl_FragColor = vec4(mix(vec3(0.0), ec * 6.5, edge), max(strength, edge));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 2 — DOUBLE HELIX
//  Two spiral arms rotating in opposite directions. They meet and cancel,
//  creating figure-8 interference patterns at the dissolve boundary.
//  The glow color alternates between uBorderColor and its complement
//  so the two arms visually separate.
// ─────────────────────────────────────────────────────────────────────────────
export const fragmentShader_V2_DoubleHelix = `
  uniform float uTransition;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBorderColor;
  varying vec2  vUv;
  ${_noise}
  void main() {
    vec2 grid        = uResolution / 26.0;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect     = uResolution.x / uResolution.y;
    vec2  cuv        = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    vec2  dUv = cuv + cnoise(vec3(cuv * 4.0, uTime * 0.12)) * 0.12;
    float ns  = cnoise(vec3(dUv * 5.0, uTime * 0.2));

    float angle = atan(cuv.y - 0.5, cuv.x - 0.5);
    float r     = length(cuv - 0.5) / (length(vec2(aspect, 1.0)) * 0.5);
    float PI2   = 3.14159265 * 2.0;

    // Arm A — clockwise
    float swirlA = mod( angle / PI2 + 0.5 + r * 1.5 + ns * 0.25, 1.0);
    // Arm B — counter-clockwise (negate angle)
    float swirlB = mod(-angle / PI2 + 0.5 + r * 1.5 + ns * 0.25, 1.0);

    // Take the minimum — whichever arm is "earlier" wins the dissolve
    float swirl = min(swirlA, swirlB);

    float raw      = (swirl - (uTransition * 1.4 - 0.2)) * 9.0 + ns * 0.7;
    float strength = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, 0.7, raw) * smoothstep(2.5, 0.7, raw);
    edge *= min(uTransition * 5.0, 1.0);

    // Arm membership: +1 if A is closer, -1 if B is closer — drives hue split
    float armSide  = sign(swirlB - swirlA);
    float armBlend = armSide * 0.5 + 0.5;

    float bp = sin(uTime * 1.8) * 0.5 + 0.5;
    vec3  g1 = uBorderColor;
    vec3  g2 = vec3(uBorderColor.z, uBorderColor.x, uBorderColor.y);
    vec3  ec = mix(g1, g2, armBlend) * mix(0.015, 1.5, bp);

    gl_FragColor = vec4(mix(vec3(0.0), ec * 6.5, edge), max(strength, edge));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 3 — PULSING RINGS
//  Concentric rings dissolve outward while the ring pattern itself slowly
//  rotates. Each ring pulses in brightness independently, giving a sonar /
//  shockwave feel. Works great with blue or cyan uBorderColor.
// ─────────────────────────────────────────────────────────────────────────────
export const fragmentShader_V3_PulsingRings = `
  uniform float uTransition;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBorderColor;
  varying vec2  vUv;
  ${_noise}
  void main() {
    vec2 grid        = uResolution / 26.0;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect     = uResolution.x / uResolution.y;
    vec2  cuv        = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    vec2  dUv = cuv + cnoise(vec3(cuv * 3.5, uTime * 0.08)) * 0.10;
    float ns  = cnoise(vec3(dUv * 5.0, uTime * 0.15));

    float r     = length(cuv - 0.5) / (length(vec2(aspect, 1.0)) * 0.5);
    float angle = atan(cuv.y - 0.5, cuv.x - 0.5);

    // Rings: frac of r scaled by ring count + slow angular rotation
    float rings     = fract(r * 5.0 - uTime * 0.15 + angle * 0.12 + ns * 0.4);
    // Map rings to dissolve space: inner rings dissolve first
    float ringMask  = r + rings * 0.18;

    float raw      = (ringMask - (uTransition * 1.6 - 0.1)) * 9.0 + ns * 0.6;
    float strength = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, 0.7, raw) * smoothstep(2.5, 0.7, raw);
    edge *= min(uTransition * 5.0, 1.0);

    // Each ring pulses at a slightly different frequency via ring index
    float ringIdx  = floor(r * 5.0);
    float ringPulse = sin(uTime * 2.0 + ringIdx * 1.3) * 0.5 + 0.5;

    vec3 g1 = uBorderColor;
    vec3 g2 = vec3(uBorderColor.y, uBorderColor.z, uBorderColor.x);
    vec3 ec = mix(g1 * 0.015, g2 * 1.5, ringPulse);

    gl_FragColor = vec4(mix(vec3(0.0), ec * 7.0, edge), max(strength, edge));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 4 — REVERSE VORTEX
//  Same spiral math as V1 but the mask is inverted: corners dissolve FIRST
//  and the center holds last — like a drain pulling the screen inward.
//  Use when revealing content should feel like it's being "sucked away"
//  rather than opening outward.
// ─────────────────────────────────────────────────────────────────────────────
export const fragmentShader_V4_ReverseVortex = `
  uniform float uTransition;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBorderColor;
  varying vec2  vUv;
  ${_noise}
  void main() {
    vec2 grid        = uResolution / 26.0;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect     = uResolution.x / uResolution.y;
    vec2  cuv        = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    vec2  dUv = cuv + cnoise(vec3(cuv * 5.0, uTime * 0.1)) * 0.15;
    float ns  = cnoise(vec3(dUv * 5.0, uTime * 0.2));

    float angle = atan(cuv.y - 0.5, cuv.x - 0.5);
    float r     = length(cuv - 0.5) / (length(vec2(aspect, 1.0)) * 0.5);

    // Invert r: outer pixels get low value (dissolve first), center gets high
    float swirlR = angle / (3.14159265 * 2.0) + 0.5 + (1.0 - r) * 1.5;
    swirlR       = mod(swirlR + ns * 0.3, 1.0);

    float raw      = (swirlR - (uTransition * 1.8 - 0.4)) * 8.0 + ns * 0.8;
    float strength = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, 0.7, raw) * smoothstep(2.5, 0.7, raw);
    edge *= min(uTransition * 5.0, 1.0);

    float bp = sin(uTime * 1.5) * 0.5 + 0.5;
    float cr = sin(uTime * 2.3 + 3.14159) * 0.5 + 0.5;
    vec3  g1 = uBorderColor;
    vec3  g2 = vec3(uBorderColor.z, uBorderColor.x, uBorderColor.y);
    vec3  ec = mix(mix(g1,g2,cr)*0.015, mix(g1,g2,cr)*1.5, bp);

    gl_FragColor = vec4(mix(vec3(0.0), ec * 6.5, edge), max(strength, edge));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  VARIANT 5 — CHAOTIC STORM
//  High-amplitude multi-octave noise completely overwhelms the angular sweep,
//  turning the spiral into a roiling turbulent storm. The dissolve boundary
//  has no clean spiral arm — instead it fractures into jagged noise islands.
//  The glow flickers rapidly to simulate lightning inside the storm.
// ─────────────────────────────────────────────────────────────────────────────
export const fragmentShader_V5_ChaoticStorm = `
  uniform float uTransition;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBorderColor;
  varying vec2  vUv;
  ${_noise}
  void main() {
    vec2 grid        = uResolution / 26.0;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect     = uResolution.x / uResolution.y;
    vec2  cuv        = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

    // Three noise octaves — each faster and finer than the last
    float ns1 = cnoise(vec3(cuv * 2.5,  uTime * 0.12));  // coarse / slow
    float ns2 = cnoise(vec3(cuv * 6.0,  uTime * 0.30));  // mid
    float ns3 = cnoise(vec3(cuv * 13.0, uTime * 0.65));  // fine / fast

    // Turbulence: sum with decreasing weight (fBm-style)
    float turbulence = ns1 * 0.55 + ns2 * 0.30 + ns3 * 0.15;

    float angle  = atan(cuv.y - 0.5, cuv.x - 0.5);
    float r      = length(cuv - 0.5) / (length(vec2(aspect, 1.0)) * 0.5);
    // Spiral base — but turbulence dominates
    float swirl  = angle / (3.14159265 * 2.0) + 0.5 + r * 0.6;
    swirl        = mod(swirl + turbulence * 1.2, 1.0);

    float raw      = (swirl - (uTransition * 1.8 - 0.4)) * 7.0 + turbulence * 1.4;
    float strength = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, 0.7, raw) * smoothstep(2.5, 0.7, raw);
    edge *= min(uTransition * 5.0, 1.0);

    // Lightning flicker: sharp high-frequency spike
    float flicker = pow(max(0.0, sin(uTime * 22.0 + ns3 * 6.28)), 8.0);

    float bp = sin(uTime * 1.5 + flicker * 2.0) * 0.5 + 0.5;
    float cr = sin(uTime * 3.1 + 3.14159) * 0.5 + 0.5;
    vec3  g1 = uBorderColor;
    vec3  g2 = vec3(uBorderColor.z, uBorderColor.x, uBorderColor.y);
    vec3  gm = mix(g1, g2, cr);
    vec3  ec = mix(gm * 0.015, gm * (1.5 + flicker * 2.5), bp);

    gl_FragColor = vec4(mix(vec3(0.0), ec * 7.0, edge), max(strength, edge));
  }
`;
