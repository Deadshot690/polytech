import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Cloud({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const count = 260;

  // spherical distribution for small granules
  const items = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        scale: 0.06 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} scale={it.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function SaturnCore({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
    if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.6;
  });

  return (
    <group ref={group}>
      {/* central nucleus */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.5}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* rings */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.6, 0.12, 16, 128]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.6, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.1, 0.06, 8, 128]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* orbiting particles (like electrons or molecules) */}
      <group ref={orbitRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 2.6 + i * 0.05;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6, 0.05 + i * 0.02]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function GranuleSphere({ color }: { color: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 4]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} />
      <pointLight position={[0, 0, 3]} intensity={2} color={color} />
      <Cloud color={color} />
      <SaturnCore color={color} />
    </Canvas>
  );
}
