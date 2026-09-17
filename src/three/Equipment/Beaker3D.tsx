import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MaterialId } from '../../types';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

interface Beaker3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  currentVolume?: number; // 0 to 250 mL
  materialId?: MaterialId | null;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const Beaker3D: React.FC<Beaker3DProps> = ({
  position = [0.0, 0.86, 0.2],
  rotation = [0, 0, 0],
  currentVolume = 0,
  materialId = 'water',
  isSelected = false,
  onSelect,
}) => {
  const liquidSurfaceRef = useRef<THREE.Mesh>(null);
  const maxCapacity = 250;
  const beakerHeight = 0.22;
  const beakerRadius = 0.082;
  const liquidFraction = Math.min(1, Math.max(0, currentVolume / maxCapacity));
  const liquidHeight = liquidFraction * (beakerHeight * 0.85);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.94,
        opacity: 0.9,
        transparent: true,
        roughness: 0.05,
        ior: 1.52,
        thickness: 0.04,
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
      thickness: 0.09,
      reflectivity: 0.7,
    });
  }, [activeMaterialConfig]);

  useFrame(({ clock }) => {
    if (!liquidSurfaceRef.current || currentVolume <= 0) return;
    liquidSurfaceRef.current.scale.set(1 + Math.sin(clock.elapsedTime * 2.4) * 0.025, 1, 1 - Math.sin(clock.elapsedTime * 2.4) * 0.025);
  });

  const tickMarkMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#f8fafc',
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
      {/* Selection Glow Indicator */}
      {isSelected && (
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      )}

      {/* Beaker Glass Base */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[beakerRadius, beakerRadius, 0.016, 32]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Main Cylindrical Glass Wall */}
      <mesh position={[0, beakerHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[beakerRadius, beakerRadius, beakerHeight, 32, 1, true]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      {/* Pouring Spout Rim Flare */}
      <group position={[0, beakerHeight, beakerRadius]}>
        <mesh rotation={[0.45, 0, 0]}>
          <coneGeometry args={[0.022, 0.03, 16, 1, true]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
      </group>

      {/* White Ceramic Graduation Markings (50, 100, 150, 200 mL) */}
      {[50, 100, 150, 200].map((ml) => {
        const fraction = ml / maxCapacity;
        const yPos = 0.016 + fraction * (beakerHeight * 0.85);
        return (
          <group key={ml} position={[0, yPos, beakerRadius + 0.001]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.03, 0.0018, 0.001]} />
              <primitive object={tickMarkMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Dynamic Simulated Liquid in Beaker */}
      {currentVolume > 0 && liquidHeight > 0.005 && (
        <group position={[0, 0.016, 0]}>
          {/* Liquid Bulk */}
          <mesh position={[0, liquidHeight / 2, 0]}>
            <cylinderGeometry
              args={[beakerRadius - 0.003, beakerRadius - 0.003, liquidHeight, 32]}
            />
            <primitive object={liquidMaterial} attach="material" />
          </mesh>

          {/* Meniscus / Liquid Top Surface */}
          <mesh ref={liquidSurfaceRef} position={[0, liquidHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[beakerRadius - 0.003, 32]} />
            <primitive object={liquidMaterial} attach="material" />
          </mesh>
        </group>
      )}
    </group>
  );
};
