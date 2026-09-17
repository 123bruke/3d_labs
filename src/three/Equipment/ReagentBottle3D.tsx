import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MaterialId } from '../../types';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

interface ReagentBottle3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  materialId?: MaterialId | null;
  currentVolume?: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ReagentBottle3D: React.FC<ReagentBottle3DProps> = ({
  position = [0.0, 0.86, -0.42],
  rotation = [0, 0, 0],
  materialId = 'water',
  currentVolume = 450,
  isSelected = false,
  onSelect,
}) => {
  const liquidSurfaceRef = useRef<THREE.Mesh>(null);
  const bottleHeight = 0.32;
  const bottleRadius = 0.088;
  const liquidFraction = Math.min(1, Math.max(0, currentVolume / 450));
  const liquidHeight = bottleHeight * 0.68 * liquidFraction;

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e2e8f0',
        transmission: 0.9,
        opacity: 0.9,
        transparent: true,
        roughness: 0.08,
        ior: 1.5,
        thickness: 0.06,
      }),
    []
  );

  const capMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#064e3b',
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );

  const activeMaterialConfig = materialId ? MATERIALS_REGISTRY[materialId] : MATERIALS_REGISTRY.water;

  const liquidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: activeMaterialConfig.color,
      transmission: activeMaterialConfig.transmission,
      transparent: true,
      opacity: 0.92,
      roughness: activeMaterialConfig.roughness,
      ior: activeMaterialConfig.refractiveIndex,
      thickness: 0.1,
    });
  }, [activeMaterialConfig]);

  useFrame(({ clock }) => {
    if (!liquidSurfaceRef.current || currentVolume <= 0) return;
    liquidSurfaceRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.8) * 0.035;
  });

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 24]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      )}

      {/* Main Glass Body */}
      <mesh position={[0, bottleHeight * 0.42, 0]} castShadow>
        <cylinderGeometry args={[bottleRadius, bottleRadius, bottleHeight * 0.75, 32]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Bottle Shoulder curve */}
      <mesh position={[0, bottleHeight * 0.82, 0]} castShadow>
        <cylinderGeometry args={[bottleRadius * 0.4, bottleRadius, bottleHeight * 0.16, 32]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, bottleHeight * 0.94, 0]} castShadow>
        <cylinderGeometry args={[bottleRadius * 0.4, bottleRadius * 0.4, bottleHeight * 0.12, 32]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Polypropylene Dispenser Cap & Nozzle */}
      <group position={[0, bottleHeight * 1.02, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[bottleRadius * 0.44, bottleRadius * 0.44, 0.04, 32]} />
          <primitive object={capMaterial} attach="material" />
        </mesh>
        {/* Angled Dispensing Nozzle Tube */}
        <mesh position={[0.04, 0.04, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 16]} />
          <primitive object={capMaterial} attach="material" />
        </mesh>
      </group>

      {/* Internal liquid follows the real stored volume */}
      {liquidHeight > 0.002 && (
        <group position={[0, 0.03, 0]}>
          <mesh position={[0, liquidHeight / 2, 0]}>
            <cylinderGeometry args={[bottleRadius - 0.005, bottleRadius - 0.005, liquidHeight, 32]} />
            <primitive object={liquidMaterial} attach="material" />
          </mesh>
          <mesh ref={liquidSurfaceRef} position={[0, liquidHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[bottleRadius - 0.006, 32]} />
            <primitive object={liquidMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* Chemical Reagent Label Plate */}
      <group position={[0, bottleHeight * 0.42, bottleRadius + 0.002]}>
        <mesh>
          <planeGeometry args={[0.13, 0.09]} />
          <meshBasicMaterial color="#081c14" />
        </mesh>
        <mesh position={[0, 0, 0.0005]}>
          <planeGeometry args={[0.126, 0.086]} />
          <meshBasicMaterial color="#022c22" />
        </mesh>
      </group>
    </group>
  );
};
