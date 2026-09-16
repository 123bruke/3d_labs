import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei/core/Text';
import { MaterialId } from '../../types';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

interface ReagentBottle3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  materialId?: MaterialId | null;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ReagentBottle3D: React.FC<ReagentBottle3DProps> = ({
  position = [0.0, 0.86, -0.42],
  rotation = [0, 0, 0],
  materialId = 'water',
  isSelected = false,
  onSelect,
}) => {
  const bottleHeight = 0.32;
  const bottleRadius = 0.088;

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

      {/* Internal Liquid Mesh */}
      <mesh position={[0, (bottleHeight * 0.7) / 2, 0]}>
        <cylinderGeometry
          args={[bottleRadius - 0.005, bottleRadius - 0.005, bottleHeight * 0.68, 32]}
        />
        <primitive object={liquidMaterial} attach="material" />
      </mesh>

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
        <Text
          position={[0, 0.024, 0.001]}
          fontSize={0.012}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          {activeMaterialConfig.name.slice(0, 18)}
        </Text>
        <Text
          position={[0, 0.004, 0.001]}
          fontSize={0.016}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {activeMaterialConfig.formula}
        </Text>
        <Text
          position={[0, -0.02, 0.001]}
          fontSize={0.009}
          color="#a7f3d0"
          anchorX="center"
          anchorY="middle"
        >
          ρ = {activeMaterialConfig.density.toFixed(3)} g/mL
        </Text>
      </group>
    </group>
  );
};
