import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMotionValue, type MotionValue } from "framer-motion";
import * as THREE from "three";

type ChainProps = {
  index: number;
  atoms: number;
  radius: number;
  depth: number;
  speed: number;
  opacity?: number;
};

const carbonMaterial = new THREE.MeshPhysicalMaterial({
  color: "#101923",
  roughness: 0.22,
  metalness: 0.82,
  clearcoat: 1,
  clearcoatRoughness: 0.12,
});

const hydrogenMaterial = new THREE.MeshPhysicalMaterial({
  color: "#e9f3f6",
  roughness: 0.16,
  metalness: 0.1,
  clearcoat: 1,
});

const bondMaterial = new THREE.MeshStandardMaterial({
  color: "#3d5a68",
  roughness: 0.32,
  metalness: 0.72,
});

function pointOnChain(
  i: number,
  total: number,
  radius: number,
  depth: number,
  time: number,
  phase: number,
) {
  const progress = i / (total - 1);
  const x = (progress - 0.5) * 10.5;
  const wave = Math.sin(progress * Math.PI * 4 + time * 0.42 + phase) * 0.42;
  const twist = progress * Math.PI * 5.2 + time * 0.34 + phase;
  const y = Math.sin(twist) * radius + wave;
  const z =
    Math.cos(twist) * radius * 0.62 + depth + Math.sin(progress * Math.PI * 2 + phase) * 0.25;
  return new THREE.Vector3(x, y, z);
}

function alignBond(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3) {
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const direction = to.clone().sub(from);
  mesh.position.copy(midpoint);
  mesh.scale.set(1, direction.length() / 2, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function PolymerChain({ index, atoms, radius, depth, speed, opacity = 1 }: ChainProps) {
  const group = useRef<THREE.Group>(null);
  const carbonRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hydrogenRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hydrogenBondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const phase = index * 1.7;
  const initialPoints = useMemo(
    () => Array.from({ length: atoms }, (_, i) => pointOnChain(i, atoms, radius, depth, 0, phase)),
    [atoms, depth, radius, phase],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.22 + phase) * 0.08;
      group.current.rotation.x = Math.cos(time * 0.18 + phase) * 0.04;
    }

    const points = initialPoints.map((_, i) => pointOnChain(i, atoms, radius, depth, time, phase));
    points.forEach((point, i) => {
      const carbon = carbonRefs.current[i];
      if (carbon) carbon.position.copy(point);

      const hydrogen = hydrogenRefs.current[i];
      if (hydrogen) {
        const tangent = i === 0 ? points[1].clone().sub(point) : point.clone().sub(points[i - 1]);
        const side = new THREE.Vector3(-tangent.z, 0.25, tangent.x).normalize();
        hydrogen.position.copy(point).addScaledVector(side, 0.25 + radius * 0.08);
      }

      if (i < points.length - 1) {
        const bond = bondRefs.current[i];
        if (bond) alignBond(bond, point, points[i + 1]);
        const hydrogenBond = hydrogenBondRefs.current[i];
        if (hydrogenBond && hydrogen) alignBond(hydrogenBond, point, hydrogen.position);
      }
    });
  });

  return (
    <group ref={group}>
      {initialPoints.map((_, i) => (
        <mesh
          key={`carbon-${i}`}
          ref={(mesh) => {
            carbonRefs.current[i] = mesh;
          }}
          scale={index === 0 ? 0.17 : 0.1}
          material={carbonMaterial}
        >
          <sphereGeometry args={[1, index === 0 ? 20 : 12, index === 0 ? 20 : 12]} />
        </mesh>
      ))}
      {initialPoints.map((_, i) => (
        <mesh
          key={`hydrogen-${i}`}
          ref={(mesh) => {
            hydrogenRefs.current[i] = mesh;
          }}
          scale={index === 0 ? 0.07 : 0.04}
          material={hydrogenMaterial}
          visible={index === 0}
        >
          <sphereGeometry args={[1, 10, 10]} />
        </mesh>
      ))}
      {initialPoints.slice(0, -1).map((_, i) => (
        <mesh
          key={`bond-${i}`}
          ref={(mesh) => {
            bondRefs.current[i] = mesh;
          }}
          scale={index === 0 ? 1 : 0.7}
          material={bondMaterial}
        >
          <cylinderGeometry
            args={[index === 0 ? 0.045 : 0.025, index === 0 ? 0.045 : 0.025, 1, 8]}
          />
        </mesh>
      ))}
      {initialPoints.map((_, i) => (
        <mesh
          key={`h-bond-${i}`}
          ref={(mesh) => {
            hydrogenBondRefs.current[i] = mesh;
          }}
          material={bondMaterial}
          visible={index === 0}
        >
          <cylinderGeometry args={[0.018, 0.018, 1, 6]} />
        </mesh>
      ))}
      {opacity < 1 && (
        <mesh visible={false}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial transparent opacity={opacity} />
        </mesh>
      )}
    </group>
  );
}

function MolecularDust() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      values[i * 3] = (Math.random() - 0.5) * 16;
      values[i * 3 + 1] = (Math.random() - 0.5) * 8;
      values[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.018;
    points.current.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8bd8e8"
        size={0.025}
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MolecularScene({ progress }: { progress: MotionValue<number> }) {
  const scene = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();

  useFrame((state) => {
    const t = progress.get();
    const elapsed = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.45, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.28, 0.025);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.8 - t * 1.4, 0.02);
    camera.lookAt(0.6, 0, 0);
    if (scene.current) {
      scene.current.rotation.z = Math.sin(elapsed * 0.12) * 0.035;
      scene.current.position.y = Math.sin(elapsed * 0.2) * 0.12;
    }
  });

  return (
    <group ref={scene}>
      <PolymerChain index={2} atoms={26} radius={1.25} depth={-2.4} speed={0.65} />
      <PolymerChain index={1} atoms={30} radius={0.92} depth={-1.3} speed={0.8} />
      <PolymerChain index={0} atoms={34} radius={0.68} depth={0} speed={1} />
      <PolymerChain index={3} atoms={28} radius={1.08} depth={1.4} speed={0.52} />
      <PolymerChain index={4} atoms={24} radius={1.45} depth={2.4} speed={0.4} />
      <MolecularDust />
    </group>
  );
}

export function ParticleField({ progress }: { progress?: MotionValue<number> }) {
  const fallback = useMotionValue(0);
  const p = progress ?? fallback;

  return (
    <Canvas
      camera={{ position: [0, 0, 8.8], fov: 47 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <color attach="background" args={["#061523"]} />
      <fog attach="fog" args={["#061523", 7, 18]} />
      <ambientLight intensity={1.1} color="#a8d2dc" />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#d8f5ff" />
      <directionalLight position={[-5, -2, 2]} intensity={1.5} color="#2774ad" />
      <pointLight position={[0, 1, 4]} intensity={3.5} distance={12} color="#67d9e9" />
      <MolecularScene progress={p} />
    </Canvas>
  );
}
