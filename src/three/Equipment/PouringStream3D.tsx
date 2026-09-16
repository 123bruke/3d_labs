import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLabStore } from '../../store/labStore';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

export const PouringStream3D: React.FC = () => {
  const isPouring = useLabStore((state) => state.isPouring);
  const pouringSourceId = useLabStore((state) => state.pouringSourceId);
  const pouringTargetId = useLabStore((state) => state.pouringTargetId);
  const placedEquipment = useLabStore((state) => state.placedEquipment);
  const selectedMaterialId = useLabStore((state) => state.selectedMaterialId);

  const activeMaterial = MATERIALS_REGISTRY[selectedMaterialId] || MATERIALS_REGISTRY.water;

  const streamMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: activeMaterial.color,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85,
      roughness: 0.05,
      ior: 1.33,
    });
  }, [activeMaterial]);

  // Find coordinates of source and target
  const source = placedEquipment.find((e) => e.instanceId === pouringSourceId);
  const target = placedEquipment.find((e) => e.instanceId === pouringTargetId);

  if (!isPouring || !source || !target) return null;

  // Compute spout position (source) and mouth position (target)
  const sourceSpout: [number, number, number] = [
    source.position[0],
    source.position[1] + (source.typeId === 'reagent-bottle' ? 0.38 : source.typeId === 'beaker' ? 0.22 : 0.52),
    source.position[2] + 0.08,
  ];

  const targetMouth: [number, number, number] = [
    target.position[0],
    target.position[1] + (target.typeId === 'measuring-cylinder' ? 0.48 : 0.2),
    target.position[2],
  ];

  // Midpoint with curve arc
  const midPoint: [number, number, number] = [
    (sourceSpout[0] + targetMouth[0]) / 2,
    Math.max(sourceSpout[1], targetMouth[1]) + 0.06,
    (sourceSpout[2] + targetMouth[2]) / 2,
  ];

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...sourceSpout),
    new THREE.Vector3(...midPoint),
    new THREE.Vector3(...targetMouth)
  );

  return (
    <group name="PouringStreamGroup">
      {/* Liquid Stream Tube */}
      <mesh>
        <tubeGeometry args={[curve, 20, 0.007, 12, false]} />
        <primitive object={streamMaterial} attach="material" />
      </mesh>

      {/* Ripple at target mouth */}
      <mesh position={targetMouth} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.005, 0.035, 16]} />
        <meshBasicMaterial color={activeMaterial.color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};
