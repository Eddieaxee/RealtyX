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
 * 3D Tesseract (4D Hypercube) - Premium solid aesthetic.
 * Projects a 4D hypercube into 3D space with solid edges, frosted glass material,
 * and floating particles. No orbit rings.
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

/** Floating particles around the tesseract */
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      siz[i] = Math.random() * 0.03 + 0.01;
    }
    return [pos, siz];
  }, []);

  useFrame((state: RootState) => {
    if (!particlesRef.current) return;
    const t = state.clock.elapsedTime;
    const posArray = particlesRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speed = 0.1 + (i % 5) * 0.02;
      const offset = i * 0.1;
      posArray[idx] += Math.sin(t * speed + offset) * 0.002;
      posArray[idx + 1] += Math.cos(t * speed * 0.7 + offset) * 0.002;
      posArray[idx + 2] += Math.sin(t * speed * 0.5 + offset + 1) * 0.002;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#E2B93B"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}


function TesseractWireframe() {
  const vertices = useMemo(() => generateHypercubeVertices(), []);
  const edges = useMemo(() => generateHypercubeEdges(), []);

  // Create tube geometry for solid edges
  const tubeMeshes = useMemo(() => {
    return edges.map(() => {
      const geo = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
      const mat = new THREE.MeshPhysicalMaterial({
        color: "#E2B93B",
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.4,
        emissive: "#E2B93B",
        emissiveIntensity: 0.1,
      });
      return new THREE.Mesh(geo, mat);
    });
  }, [edges]);

  useFrame((state: RootState) => {
    const t = state.clock.elapsedTime;
    const angleXW = t * 0.15;
    const angleYW = t * 0.12;
    const angleZW = t * 0.1;

    // Update solid edges (cylinders)
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

      const mesh = tubeMeshes[i];
      const start = new THREE.Vector3(pA[0], pA[1], pA[2]);
      const end = new THREE.Vector3(pB[0], pB[1], pB[2]);
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(end, start);
      const len = dir.length();

      mesh.position.copy(mid);
      mesh.scale.y = len;
      mesh.lookAt(end);
      mesh.rotateX(Math.PI / 2);
    }

  });

  return (
    <group>
      {/* Solid edges with metallic material - no wireframes */}
      <group>
        {tubeMeshes.map((mesh, i) => (
          <primitive key={i} object={mesh} />
        ))}
      </group>
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial
          color="#E2B93B"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.4}
          emissive="#E2B93B"
          emissiveIntensity={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
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
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#E2B93B" />
          <pointLight position={[-5, -5, -5]} intensity={0.6} color="#B89221" />
          <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />
          <pointLight position={[3, -3, 2]} intensity={0.4} color="#f3c94a" />
          <pointLight position={[-3, 3, -2]} intensity={0.3} color="#E2B93B" />
          <TesseractWireframe />
          <FloatingParticles />
        </Canvas>
      </Suspense>
    </div>
  );
}
