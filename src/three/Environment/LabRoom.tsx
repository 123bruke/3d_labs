import React, { useMemo } from 'react';
import * as THREE from 'three';

export const LabRoom: React.FC = () => {
  // Tile texture grid generator for realistic epoxy lab floor
  const floorMaterials = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2a3a31',
      roughness: 0.55,
      metalness: 0.12,
    });
  }, []);

  const benchTopMaterial = useMemo(() => {
    // Chemical-resistant black phenolic / epoxy resin countertop
    return new THREE.MeshStandardMaterial({
      color: '#1c2b23',
      roughness: 0.3,
      metalness: 0.3,
    });
  }, []);

  const cabinetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2c3e34',
      roughness: 0.5,
      metalness: 0.08,
    });
  }, []);

  const steelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.25,
      metalness: 0.85,
    });
  }, []);

  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a2a21',
      roughness: 0.85,
      metalness: 0.05,
    });
  }, []);

  const accentEmeraldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#10b981',
      emissive: '#059669',
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.5,
    });
  }, []);

  return (
    <group name="LabRoomEnvironment">
      {/* Real 3D Floor Geometry */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <primitive object={floorMaterials} attach="material" />
      </mesh>

      {/* Floor Grid Lines */}
      <gridHelper args={[16, 32, '#10b981', '#1f3327']} position={[0, 0.002, 0]} />

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 3.5, -4]}>
        <planeGeometry args={[16, 7]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow position={[-8, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 7]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Right Wall */}
      <mesh receiveShadow position={[8, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 7]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Background Laboratory Service Trunking / Duct on back wall */}
      <mesh position={[0, 4.8, -3.9]} castShadow>
        <boxGeometry args={[14, 0.4, 0.3]} />
        <primitive object={steelMaterial} attach="material" />
      </mesh>

      {/* Back Wall Overhead LED Strip */}
      <mesh position={[0, 4.5, -3.85]}>
        <boxGeometry args={[12, 0.08, 0.04]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>

      {/* Background Laboratory Storage Shelf */}
      <group position={[0, 2.1, -3.6]}>
        {/* Steel uprights */}
        <mesh position={[-2.4, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 2.2, 0.06]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>
        <mesh position={[2.4, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 2.2, 0.06]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>
        {/* Shelf Planks */}
        <mesh position={[0, 0.6, 0.1]} castShadow>
          <boxGeometry args={[5.2, 0.05, 0.5]} />
          <primitive object={benchTopMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.2, 0.1]} castShadow>
          <boxGeometry args={[5.2, 0.05, 0.5]} />
          <primitive object={benchTopMaterial} attach="material" />
        </mesh>

        {/* Ambient Reagent bottles on background shelf for authenticity */}
        {[-1.8, -1.3, -0.8, 0.7, 1.2, 1.7].map((x, i) => (
          <group key={i} position={[x, 0.85, 0.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? '#38bdf8' : '#fbbf24'}
                roughness={0.15}
                transmission={0.8}
                thickness={0.2}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
              <primitive object={steelMaterial} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* PRIMARY CENTRAL LABORATORY WORKBENCH */}
      <group position={[0, 0, 0]}>
        {/* Workbench Top: 3.4m wide x 1.6m deep x 0.08m thick. Height = 0.86m (standard lab bench height) */}
        <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
          <boxGeometry args={[3.4, 0.08, 1.6]} />
          <primitive object={benchTopMaterial} attach="material" />
        </mesh>

        {/* Emerald Edge Trim along workbench perimeter */}
        <mesh position={[0, 0.84, 0.8]}>
          <boxGeometry args={[3.42, 0.02, 0.02]} />
          <primitive object={accentEmeraldMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.84, -0.8]}>
          <boxGeometry args={[3.42, 0.02, 0.02]} />
          <primitive object={accentEmeraldMaterial} attach="material" />
        </mesh>

        {/* Cabinets underneath Workbench */}
        {/* Left Cabinets */}
        <group position={[-1.15, 0.38, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.76, 1.4]} />
            <primitive object={cabinetMaterial} attach="material" />
          </mesh>
          {/* Cabinet handles */}
          <mesh position={[0, 0.2, 0.71]}>
            <boxGeometry args={[0.25, 0.03, 0.02]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.15, 0.71]}>
            <boxGeometry args={[0.25, 0.03, 0.02]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Cabinets */}
        <group position={[1.15, 0.38, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.76, 1.4]} />
            <primitive object={cabinetMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.2, 0.71]}>
            <boxGeometry args={[0.25, 0.03, 0.02]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.15, 0.71]}>
            <boxGeometry args={[0.25, 0.03, 0.02]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
        </group>

        {/* Center Knee Space Steel Legs */}
        <mesh position={[-0.6, 0.38, 0.65]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.76, 16]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>
        <mesh position={[0.6, 0.38, 0.65]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.76, 16]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.6, 0.38, -0.65]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.76, 16]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>
        <mesh position={[0.6, 0.38, -0.65]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.76, 16]} />
          <primitive object={steelMaterial} attach="material" />
        </mesh>

        {/* Workbench Power / Gas Outlets bar at rear of table */}
        <group position={[0, 0.94, -0.72]}>
          <mesh castShadow>
            <boxGeometry args={[2.8, 0.16, 0.08]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
          {/* Socket indicators */}
          {[-0.9, -0.3, 0.3, 0.9].map((pos, i) => (
            <mesh key={i} position={[pos, 0, 0.045]}>
              <boxGeometry args={[0.14, 0.08, 0.01]} />
              <meshStandardMaterial color="#09130f" roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
