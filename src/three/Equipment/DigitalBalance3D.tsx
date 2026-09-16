import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei/core/Text';
import { useLabStore } from '../../store/labStore';

interface DigitalBalance3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DigitalBalance3D: React.FC<DigitalBalance3DProps> = ({
  position = [-0.75, 0.86, 0.05],
  rotation = [0, 0, 0],
  isSelected = false,
  onSelect,
}) => {
  const activeMeasurement = useLabStore((state) => state.activeMeasurement);
  const isBalanceStable = useLabStore((state) => state.isBalanceStable);
  const tareBalance = useLabStore((state) => state.tareBalance);
  const zeroBalance = useLabStore((state) => state.zeroBalance);

  // Materials
  const chassisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e2923',
        roughness: 0.35,
        metalness: 0.45,
      }),
    []
  );

  const panMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.15,
        metalness: 0.95,
      }),
    []
  );

  const displayGlassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#06130d',
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );

  const buttonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f3826',
        roughness: 0.4,
        metalness: 0.2,
      }),
    []
  );

  const displayValue = activeMeasurement.isTared
    ? `${activeMeasurement.taredMass.toFixed(2)} g`
    : `${activeMeasurement.rawMass.toFixed(2)} g`;

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
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.01, 32]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      )}

      {/* Main Base Housing */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.44]} />
        <primitive object={chassisMaterial} attach="material" />
      </mesh>

      {/* Rubber Leveling Feet */}
      {[
        [-0.16, -0.01, -0.18],
        [0.16, -0.01, -0.18],
        [-0.16, -0.01, 0.18],
        [0.16, -0.01, 0.18],
      ].map(([fx, fy, fz], idx) => (
        <mesh key={idx} position={[fx, fy, fz]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 12]} />
          <meshStandardMaterial color="#050a07" roughness={0.9} />
        </mesh>
      ))}

      {/* Center Pan Pedestal */}
      <mesh position={[0, 0.09, -0.04]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.02, 24]} />
        <primitive object={chassisMaterial} attach="material" />
      </mesh>

      {/* Stainless Steel Weighing Pan (Platform) */}
      <mesh position={[0, 0.105, -0.04]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.01, 36]} />
        <primitive object={panMaterial} attach="material" />
      </mesh>

      {/* Front Slanted Display Face */}
      <group position={[0, 0.05, 0.16]} rotation={[-Math.PI / 6, 0, 0]}>
        {/* Slanted Bezel */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.07, 0.02]} />
          <primitive object={chassisMaterial} attach="material" />
        </mesh>

        {/* OLED Screen Area */}
        <mesh position={[0, 0.01, 0.012]}>
          <planeGeometry args={[0.26, 0.045]} />
          <primitive object={displayGlassMaterial} attach="material" />
        </mesh>

        {/* Digital Text Readout */}
        <Text
          position={[0.02, 0.01, 0.016]}
          fontSize={0.024}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al0318TUHzf84.woff2"
        >
          {displayValue}
        </Text>

        {/* Stability & Tare Indicators */}
        <Text
          position={[-0.1, 0.01, 0.016]}
          fontSize={0.01}
          color={isBalanceStable ? '#10b981' : '#f59e0b'}
          anchorX="center"
          anchorY="middle"
        >
          {isBalanceStable ? '● STABLE' : '○ SETTLING'}
        </Text>

        {activeMeasurement.isTared && (
          <Text
            position={[-0.1, -0.005, 0.016]}
            fontSize={0.009}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            NET TARE
          </Text>
        )}
      </group>

      {/* Interactive 3D Buttons on front panel */}
      {/* TARE BUTTON */}
      <group
        position={[0.08, 0.025, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          tareBalance();
        }}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.065, 0.02, 0.025]} />
          <primitive object={buttonMaterial} attach="material" />
        </mesh>
        <Text
          position={[0, 0.011, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.009}
          color="#a7f3d0"
          anchorX="center"
          anchorY="middle"
        >
          TARE
        </Text>
      </group>

      {/* ZERO / RESET BUTTON */}
      <group
        position={[-0.08, 0.025, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          zeroBalance();
        }}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.065, 0.02, 0.025]} />
          <primitive object={buttonMaterial} attach="material" />
        </mesh>
        <Text
          position={[0, 0.011, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.009}
          color="#a7f3d0"
          anchorX="center"
          anchorY="middle"
        >
          ZERO
        </Text>
      </group>
    </group>
  );
};
