import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLabStore } from '../../store/labStore';

export const LabEffects: React.FC = () => {
  const isLampOn = useLabStore((state) => state.isLampOn);
  const isHeatOn = useLabStore((state) => state.isHeatOn);
  const flameRef = useRef<THREE.Group>(null);
  const flameMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ff6a1a', transparent: true, opacity: 0.92 }),
    []
  );

  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 12) * 0.08;
    flameRef.current.scale.set(pulse, 0.92 + Math.sin(clock.elapsedTime * 10) * 0.1, pulse);
    flameRef.current.rotation.y += 0.015;
  });

  return (
    <group name="InteractiveLabEffects">
      {/* Four high-output laboratory bulbs */}
      {[-2.6, 2.6].flatMap((x) => [-2.2, 2.2].map((z) => [x, z] as const)).map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 3.8, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.24, 0.12, 24]} />
            <meshStandardMaterial color="#b8c4d1" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <circleGeometry args={[0.16, 24]} />
            <meshBasicMaterial color={isLampOn ? '#fff7bd' : '#334155'} />
          </mesh>
          {isLampOn && <pointLight color="#fff3bf" intensity={7} distance={8} decay={1.7} />}
        </group>
      ))}

      {/* Digital thermometer: sensor beside the burner */}
      <group position={[-1.05, 0.91, -0.38]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.28, 0.06]} />
          <meshStandardMaterial color="#dbeafe" metalness={0.45} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.03, 0.034]}>
          <planeGeometry args={[0.12, 0.09]} />
          <meshBasicMaterial color={isHeatOn ? '#7f1d1d' : '#082f49'} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.28, 12]} />
          <meshStandardMaterial color={isHeatOn ? '#f97316' : '#38bdf8'} emissive={isHeatOn ? '#7c2d12' : '#0c4a6e'} emissiveIntensity={0.5} />
        </mesh>
        <pointLight color={isHeatOn ? '#ef4444' : '#38bdf8'} intensity={0.25} distance={0.7} />
      </group>

      {/* Chemistry markers embedded into the floor */}
      <group position={[0, 0.012, 1.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh><torusGeometry args={[0.42, 0.018, 10, 32]} /><meshBasicMaterial color="#38bdf8" /></mesh>
        <mesh><sphereGeometry args={[0.08, 16, 12]} /><meshBasicMaterial color="#60a5fa" /></mesh>
        <mesh position={[0.24, 0, 0]}><sphereGeometry args={[0.06, 16, 12]} /><meshBasicMaterial color="#93c5fd" /></mesh>
        <mesh position={[-0.24, 0, 0]}><sphereGeometry args={[0.06, 16, 12]} /><meshBasicMaterial color="#93c5fd" /></mesh>
      </group>
      <group position={[2.2, 0.012, 1.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh><torusGeometry args={[0.28, 0.018, 10, 24]} /><meshBasicMaterial color="#2563eb" /></mesh>
        <mesh><torusGeometry args={[0.12, 0.014, 10, 24]} /><meshBasicMaterial color="#93c5fd" /></mesh>
      </group>

      {/* Spirit burner and physically layered flame */}
      <group position={[1.05, 0.9, -0.38]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.12, 20]} />
          <meshStandardMaterial color="#b8c4d1" metalness={0.85} roughness={0.22} />
        </mesh>
        {isHeatOn && (
          <group ref={flameRef} position={[0, 0.18, 0]}>
            <mesh material={flameMaterial} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.075, 0.3, 20]} />
            </mesh>
            <mesh position={[0, -0.035, 0.01]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.045, 0.2, 18]} />
              <meshBasicMaterial color="#ffd166" transparent opacity={0.95} />
            </mesh>
            <mesh position={[0, -0.07, 0.015]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.02, 0.11, 14]} />
              <meshBasicMaterial color="#fff4c2" transparent opacity={0.98} />
            </mesh>
            <pointLight color="#ff7b22" intensity={2.8} distance={3} decay={1.6} />
          </group>
        )}
      </group>
    </group>
  );
};
