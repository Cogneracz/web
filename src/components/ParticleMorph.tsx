"use client";
/* eslint-disable react-hooks/refs --
   Imperative React Three Fiber scene: the three.js geometry/material live in a
   lazy ref and are read during render to attach to <points>. The React-Compiler
   refs rule can't model this canonical R3F pattern. */

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT_DESKTOP = 9000;
const COUNT_MOBILE = 4500;
const HOLD = 2.2; // seconds a shape rests
const MORPH = 2.0; // seconds to morph to the next shape

type Vec = Float32Array;

function jitter(amount: number) {
  return (Math.random() - 0.5) * amount;
}

// --- Shape generators: each fills exactly count*3 floats ---

function sphereShape(count: number, r = 1.65): Vec {
  const a = new Float32Array(count * 3);
  const golden = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const phi = Math.acos(1 - 2 * t);
    const theta = golden * i;
    const rr = r + jitter(0.08);
    a[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
    a[i * 3 + 1] = rr * Math.cos(phi);
    a[i * 3 + 2] = rr * Math.sin(phi) * Math.sin(theta);
  }
  return a;
}

function knotShape(count: number, R = 1.05, r = 0.42, p = 2, q = 3): Vec {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const cu = Math.cos(q * t);
    const su = Math.sin(q * t);
    a[i * 3] = (R + r * cu) * Math.cos(p * t) + jitter(0.06);
    a[i * 3 + 1] = (R + r * cu) * Math.sin(p * t) + jitter(0.06);
    a[i * 3 + 2] = r * su + jitter(0.06);
  }
  return a;
}

// Spiral galaxy — a tilted disk with a few arms, denser toward the core.
function galaxyShape(count: number, radius = 1.9, arms = 3, spin = 2.6): Vec {
  const a = new Float32Array(count * 3);
  const tilt = 0.5;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * radius;
    const arm = (i % arms) * ((Math.PI * 2) / arms);
    const spread = (Math.random() - 0.5) * (0.35 + (r / radius) * 0.6);
    const angle = arm + r * spin + spread;
    const x = Math.cos(angle) * r;
    let y = (Math.random() - 0.5) * 0.2 * (1 - (r / radius) * 0.7);
    let z = Math.sin(angle) * r;
    // tilt around X so the disk reads as 3D
    const ny = y * ct - z * st;
    const nz = y * st + z * ct;
    y = ny;
    z = nz;
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = z;
  }
  return a;
}

// DNA double helix — two strands plus connecting rungs, standing vertically.
function helixShape(count: number, radius = 0.62, height = 3, turns = 3.5): Vec {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const frac = i / count;
    const y = (frac - 0.5) * height;
    const t = frac * Math.PI * 2 * turns;
    const bucket = i % 5;
    if (bucket < 2) {
      a[i * 3] = radius * Math.cos(t) + jitter(0.05);
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = radius * Math.sin(t) + jitter(0.05);
    } else if (bucket < 4) {
      a[i * 3] = radius * Math.cos(t + Math.PI) + jitter(0.05);
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = radius * Math.sin(t + Math.PI) + jitter(0.05);
    } else {
      const f = Math.random();
      const ax = radius * Math.cos(t);
      const az = radius * Math.sin(t);
      const bx = radius * Math.cos(t + Math.PI);
      const bz = radius * Math.sin(t + Math.PI);
      a[i * 3] = ax + (bx - ax) * f + jitter(0.03);
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = az + (bz - az) * f + jitter(0.03);
    }
  }
  return a;
}

// Wireframe cube — points distributed along the 12 edges (clean structure).
function cubeWireShape(count: number, s = 1.28): Vec {
  const a = new Float32Array(count * 3);
  const c = [
    [-s, -s, -s],
    [s, -s, -s],
    [s, s, -s],
    [-s, s, -s],
    [-s, -s, s],
    [s, -s, s],
    [s, s, s],
    [-s, s, s],
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (let i = 0; i < count; i++) {
    const e = edges[i % 12];
    const A = c[e[0]];
    const B = c[e[1]];
    const f = Math.random();
    a[i * 3] = A[0] + (B[0] - A[0]) * f + jitter(0.03);
    a[i * 3 + 1] = A[1] + (B[1] - A[1]) * f + jitter(0.03);
    a[i * 3 + 2] = A[2] + (B[2] - A[2]) * f + jitter(0.03);
  }
  return a;
}

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aPosB;
  attribute float aRand;
  varying float vRand;
  varying float vDepth;

  void main() {
    float local = clamp((uProgress - aRand * 0.2) / 0.8, 0.0, 1.0);
    local = local * local * (3.0 - 2.0 * local);
    vec3 pos = mix(position, aPosB, local);
    float w = 0.035;
    pos.x += sin(uTime * 0.6 + aRand * 30.0) * w;
    pos.y += cos(uTime * 0.5 + aRand * 24.0) * w;
    pos.z += sin(uTime * 0.7 + aRand * 18.0) * w;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    vRand = aRand;
    gl_PointSize = uSize * (0.5 + aRand) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vRand;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;
    float alpha = smoothstep(0.25, 0.02, d);
    vec3 col = mix(uColorA, uColorB, vRand);
    float depthFade = clamp(1.25 - vDepth * 0.12, 0.4, 1.0);
    gl_FragColor = vec4(col, alpha * depthFade * 0.8);
  }
`;

function buildScene(count: number) {
  const shapes = [
    sphereShape(count),
    galaxyShape(count),
    helixShape(count),
    cubeWireShape(count),
    knotShape(count),
  ];
  const aRand = new Float32Array(count);
  for (let i = 0; i < count; i++) aRand[i] = Math.random();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(shapes[0].slice(), 3),
  );
  geometry.setAttribute("aPosB", new THREE.BufferAttribute(shapes[1].slice(), 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 26 },
      uColorA: { value: new THREE.Color("#2563eb") },
      uColorB: { value: new THREE.Color("#6366f1") },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
  });

  return { geometry, material, shapes, state: { index: 0, elapsed: 0, morphing: false } };
}

function Particles({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const sceneRef = useRef<ReturnType<typeof buildScene> | null>(null);
  if (sceneRef.current === null) sceneRef.current = buildScene(count);
  const { geometry, material, shapes, state } = sceneRef.current;

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((rootState, delta) => {
    const dt = Math.min(delta, 0.05);
    state.elapsed += dt;
    material.uniforms.uTime.value += dt;

    if (!state.morphing) {
      material.uniforms.uProgress.value = 0;
      if (state.elapsed >= HOLD) {
        state.morphing = true;
        state.elapsed = 0;
      }
    } else {
      const p = Math.min(state.elapsed / MORPH, 1);
      material.uniforms.uProgress.value = p;
      if (p >= 1) {
        state.index = (state.index + 1) % shapes.length;
        const cur = shapes[state.index];
        const nxt = shapes[(state.index + 1) % shapes.length];
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const bAttr = geometry.attributes.aPosB as THREE.BufferAttribute;
        (posAttr.array as Float32Array).set(cur);
        (bAttr.array as Float32Array).set(nxt);
        posAttr.needsUpdate = true;
        bAttr.needsUpdate = true;
        material.uniforms.uProgress.value = 0;
        state.morphing = false;
        state.elapsed = 0;
      }
    }

    const points = pointsRef.current;
    if (points) points.rotation.y += dt * 0.08;
    const group = groupRef.current;
    if (group) {
      const px = rootState.pointer.x;
      const py = rootState.pointer.y;
      group.rotation.y += (px * 0.45 - group.rotation.y) * 0.05;
      group.rotation.x += (-py * 0.28 - 0.08 - group.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.08, 0, 0]}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}

// Client-only config (mount + media queries) read via useSyncExternalStore so
// there is no setState-in-effect and SSR/hydration stays clean.
function subscribeMedia(cb: () => void) {
  const a = window.matchMedia("(min-width: 1024px)");
  const b = window.matchMedia("(prefers-reduced-motion: reduce)");
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}
function mediaSnapshot() {
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `${desktop ? "d" : "m"}:${reduced ? "r" : "n"}`;
}
function mediaServerSnapshot() {
  return "server";
}

export default function ParticleMorph({ className = "" }: { className?: string }) {
  const snap = useSyncExternalStore(
    subscribeMedia,
    mediaSnapshot,
    mediaServerSnapshot,
  );

  // Server / pre-hydration: render an empty sized box (no client-only Canvas).
  if (snap === "server") return <div className={className} aria-hidden="true" />;

  const [size, motion] = snap.split(":");
  const count = size === "d" ? COUNT_DESKTOP : COUNT_MOBILE;
  const reduced = motion === "r";

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        key={count}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        frameloop={reduced ? "demand" : "always"}
        style={{ background: "transparent" }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
