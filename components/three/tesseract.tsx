"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./tesseract.module.css";

/** Graceful fallback when WebGL is not available or loading */
function TesseractFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        <div
          className={`absolute inset-0 rounded-full border border-[#E2B93B]/20 animate-spin ${styles.outerRing}`}
        />
        <div
          className={`absolute inset-0 rounded-full border border-[#E2B93B]/20 animate-spin ${styles.outerRingReverse}`}
        />
        <div
          className={`absolute inset-8 rounded-full border border-[#B89221]/10 animate-spin ${styles.innerRing}`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#E2B93B]/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * 3D Tesseract (4D Hypercube) - Wireframe aesthetic for high-end fintech look.
 * Projects a 4D hypercube into 3D space and rotates it slowly.
 * Uses a clean wireframe with golden accent colors matching the RealtyX brand.
 */

function generateHypercubeVertices() {
  const vertices: number[][] = [];
  for (let i = 0; i < 16; i++) {
    vertices.push([
      i & 1 ? 1 : -1,
      i & 2 ? 1 : -1,
      i & 4 ? 1 : -1,
      i & 8 ? 1 : -1,
    ]);
  }
  return vertices;
}

function generateHypercubeEdges() {
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (((i >> k) & 1) !== ((j >> k) & 1)) diff++;
      }
      if (diff === 1) edges.push([i, j]);
    }
  }
  return edges;
}

function project4Dto3D(
  vertex: number[],
  w: number,
  distance: number = 2,
): [number, number, number] {
  const wCoord = vertex[3] * w;
  const factor = distance / (distance - wCoord);
  return [vertex[0] * factor, vertex[1] * factor, vertex[2] * factor];
}

function rotateXW(vertex: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    vertex[0] * cos - vertex[3] * sin,
    vertex[1],
    vertex[2],
    vertex[0] * sin + vertex[3] * cos,
  ];
}

function rotateYW(vertex: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    vertex[0],
    vertex[1] * cos - vertex[3] * sin,
    vertex[2],
    vertex[1] * sin + vertex[3] * cos,
  ];
}

function rotateZW(vertex: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    vertex[0],
    vertex[1],
    vertex[2] * cos - vertex[3] * sin,
    vertex[2] * sin + vertex[3] * cos,
  ];
}

function TesseractWireframe() {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  const vertices = useMemo(() => generateHypercubeVertices(), []);
  const edges = useMemo(() => generateHypercubeEdges(), []);

  const linePositions = useMemo(
    () => new Float32Array(edges.length * 6),
    [edges],
  );
  const innerLinePositions = useMemo(
    () => new Float32Array(edges.length * 6),
    [edges],
  );

  useFrame((state: RootState) => {
    const t = state.clock.elapsedTime;
    const angleXW = t * 0.15;
    const angleYW = t * 0.12;
    const angleZW = t * 0.1;

    const geo = (groupRef.current?.children[0] as THREE.LineSegments)?.geometry;
    if (geo) {
      const posArray = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const vA = rotateZW(
          rotateYW(rotateXW(vertices[a], angleXW), angleYW),
          angleZW,
        );
        const vB = rotateZW(
          rotateYW(rotateXW(vertices[b], angleXW), angleYW),
          angleZW,
        );
        const pA = project4Dto3D(vA, 0.8);
        const pB = project4Dto3D(vB, 0.8);
        posArray[i * 6] = pA[0];
        posArray[i * 6 + 1] = pA[1];
        posArray[i * 6 + 2] = pA[2];
        posArray[i * 6 + 3] = pB[0];
        posArray[i * 6 + 4] = pB[1];
        posArray[i * 6 + 5] = pB[2];
      }
      geo.attributes.position.needsUpdate = true;
    }

    const innerGeo = (innerGroupRef.current?.children[0] as THREE.LineSegments)
      ?.geometry;
    if (innerGeo) {
      const posArray = innerGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const vA = rotateZW(
          rotateYW(rotateXW(vertices[a], angleXW + 0.5), angleYW + 0.3),
          angleZW + 0.2,
        );
        const vB = rotateZW(
          rotateYW(rotateXW(vertices[b], angleXW + 0.5), angleYW + 0.3),
          angleZW + 0.2,
        );
        const pA = project4Dto3D(vA, 0.5);
        const pB = project4Dto3D(vB, 0.5);
        posArray[i * 6] = pA[0];
        posArray[i * 6 + 1] = pA[1];
        posArray[i * 6 + 2] = pA[2];
        posArray[i * 6 + 3] = pB[0];
        posArray[i * 6 + 4] = pB[1];
        posArray[i * 6 + 5] = pB[2];
      }
      innerGeo.attributes.position.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={edges.length * 2}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#E2B93B" transparent opacity={0.35} />
        </lineSegments>
      </group>
      <group ref={innerGroupRef} scale={0.6}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={edges.length * 2}
              array={innerLinePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#B89221" transparent opacity={0.2} />
        </lineSegments>
      </group>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#E2B93B" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function TesseractOrbitRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state: RootState) => {
    if (ringRef.current) {
      ringRef.current.rotation.x =
        Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.005, 8, 128]} />
      <meshBasicMaterial color="#E2B93B" transparent opacity={0.15} />
    </mesh>
  );
}

function TesseractOrbitRing2() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state: RootState) => {
    if (ringRef.current) {
      ringRef.current.rotation.x =
        Math.PI / 3 + Math.cos(state.clock.elapsedTime * 0.2) * 0.15;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.5, 0.004, 8, 128]} />
      <meshBasicMaterial color="#B89221" transparent opacity={0.1} />
    </mesh>
  );
}

export function Tesseract() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<TesseractFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#E2B93B" />
          <pointLight position={[-5, -5, -5]} intensity={0.2} color="#B89221" />
          <TesseractWireframe />
          <TesseractOrbitRing />
          <TesseractOrbitRing2 />
        </Canvas>
      </Suspense>
    </div>
  );
}
