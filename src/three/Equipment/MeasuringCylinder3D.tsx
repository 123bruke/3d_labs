import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei/core/Text';
import { MaterialId } from '../../types';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

interface MeasuringCylinder3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  currentVolume?: number; // 0 to 100 mL
  materialId?: MaterialId | null;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const MeasuringCylinder3D: React.FC<MeasuringCylinder3DProps> = ({
  position = [0.75, 0.86, 0.05],
  rotation = [0, 0, 0],
  currentVolume = 0,
  materialId = 'water',
  isSelected = false,
  onSelect,
}) => {
  // Height of cylinder tube = 0.52m (~52cm lab scale scaled appropriately)
  // Max capacity = 100 mL
  const maxVolume = 100;
  const cylinderHeight = 0.50;
  const cylinderRadius = 0.045;
  const liquidFraction = Math.min(1, Math.max(0, currentVolume / maxVolume));
  const liquidHeight = liquidFraction * (cylinderHeight * 0.88);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f8fafc',
        transmission: 0.95,
        opacity: 0.9,
        transparent: true,
        roughness: 0.04,
        ior: 1.52, // Borosilicate Glass refractive index
        thickness: 0.06,
        reflectivity: 0.6,
      }),
    []
  );

  const activeMaterialConfig = materialId ? MATERIALS_REGISTRY[materialId] : MATERIALS_REGISTRY.water;

  const liquidMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: activeMaterialConfig.color,
      transmission: activeMaterialConfig.transmission,
      transparent: true,
      opacity: 0.88,
      roughness: activeMaterialConfig.roughness,
      ior: activeMaterialConfig.refractiveIndex,
      thickness: 0.08,
      reflectivity: 0.7,
    });
  }, [activeMaterialConfig]);

  const tickMarkMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Selection Ring */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.01, 24]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      )}

      {/* Hexagonal Base to prevent rolling */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.03, 6]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Main Glass Outer Cylinder Body */}
      <mesh position={[0, 0.03 + cylinderHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[cylinderRadius, cylinderRadius, cylinderHeight, 32, 1, true]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Glass Sealed Bottom */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[cylinderRadius - 0.005, cylinderRadius - 0.005, 0.01, 32]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Pouring Spout at Top Rim */}
      <group position={[0, 0.03 + cylinderHeight, cylinderRadius]}>
        <mesh rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.016, 0.03, 16, 1, true]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
      </group>

      {/* Calibrated Graduation Markings on glass (every 10 mL + sub-ticks) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const ml = i * 10;
        const yPos = 0.04 + (i / 10) * (cylinderHeight * 0.88);
        return (
          <group key={ml} position={[0, yPos, cylinderRadius + 0.001]}>
            {/* Major graduation tick */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.022, 0.0015, 0.001]} />
              <primitive object={tickMarkMaterial} attach="material" />
            </mesh>

            {/* Sub-graduation tick (5 mL) */}
            {i < 10 && (
              <mesh position={[0, (cylinderHeight * 0.88) / 20, 0]}>
                <boxGeometry args={[0.012, 0.001, 0.001]} />
                <primitive object={tickMarkMaterial} attach="material" />
              </mesh>
            )}

            {/* Label for major ticks */}
            <Text
              position={[0.024, 0, 0]}
              fontSize={0.011}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
            >
              {ml}
            </Text>
          </group>
        );
      })}

      {/* Units header text */}
      <Text
        position={[0, 0.03 + cylinderHeight - 0.02, cylinderRadius + 0.001]}
        fontSize={0.013}
        color="#a7f3d0"
        anchorX="center"
        anchorY="middle"
      >
        mL (20°C)
      </Text>

      {/* Dynamic Simulated Liquid */}
      {currentVolume > 0 && liquidHeight > 0.005 && (
        <group position={[0, 0.035, 0]}>
          {/* Liquid Column */}
          <mesh position={[0, liquidHeight / 2, 0]}>
            <cylinderGeometry
              args={[cylinderRadius - 0.004, cylinderRadius - 0.004, liquidHeight, 32]}
            />
            <primitive object={liquidMaterial} attach="material" />
          </mesh>

          {/* Meniscus Surface: Concave curve characteristic of water/liquids */}
          <group position={[0, liquidHeight, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.002, cylinderRadius - 0.004, 32]} />
              <primitive object={liquidMaterial} attach="material" />
            </mesh>
            {/* Meniscus bottom reflection line */}
            <mesh position={[0, -0.004, 0]}>
              <cylinderGeometry args={[cylinderRadius - 0.007, cylinderRadius - 0.005, 0.006, 32]} />
              <primitive object={liquidMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
