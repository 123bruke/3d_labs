import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useLabStore } from '../../store/labStore';
import { DigitalBalance3D } from '../Equipment/DigitalBalance3D';
import { MeasuringCylinder3D } from '../Equipment/MeasuringCylinder3D';
import { Beaker3D } from '../Equipment/Beaker3D';
import { ReagentBottle3D } from '../Equipment/ReagentBottle3D';

export const EquipmentManager: React.FC = () => {
  const placedEquipment = useLabStore((state) => state.placedEquipment);
  const selectedEquipmentInstanceId = useLabStore((state) => state.selectedEquipmentInstanceId);
  const selectEquipmentInstance = useLabStore((state) => state.selectEquipmentInstance);
  const updateEquipmentPosition = useLabStore((state) => state.updateEquipmentPosition);
  const moveEquipmentDuringDrag = useLabStore((state) => state.moveEquipmentDuringDrag);

  const { raycaster, mouse, camera } = useThree();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.86)); // Benchtop height Y = 0.86
  const intersectionPoint = useRef(new THREE.Vector3());
  const pendingPosition = useRef<[number, number, number] | null>(null);
  const dragFrame = useRef<number | null>(null);

  // Handle pointer down on an equipment object
  const handlePointerDown = (instanceId: string, e: any) => {
    e.stopPropagation();
    selectEquipmentInstance(instanceId);

    // Allow dragging in builder or simulation mode
    setDraggingId(instanceId);
  };

  // Global pointer move on the workbench
  const handlePointerMove = (e: any) => {
    if (!draggingId) return;
    e.stopPropagation();

    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(planeRef.current, intersectionPoint.current)) {
      const { x, z } = intersectionPoint.current;

      // Constrain within workbench dimensions
      const clampedX = Math.max(-1.5, Math.min(1.5, x));
      const clampedZ = Math.max(-0.65, Math.min(0.65, z));

      pendingPosition.current = [clampedX, 0.86, clampedZ];
      if (dragFrame.current === null) {
        dragFrame.current = requestAnimationFrame(() => {
          if (draggingId && pendingPosition.current) {
            moveEquipmentDuringDrag(draggingId, pendingPosition.current);
          }
          dragFrame.current = null;
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (draggingId) {
      if (dragFrame.current !== null) cancelAnimationFrame(dragFrame.current);
      if (pendingPosition.current) updateEquipmentPosition(draggingId, pendingPosition.current);
      pendingPosition.current = null;
      dragFrame.current = null;
      setDraggingId(null);
    }
  };

  return (
    <group
      name="InteractiveEquipmentScene"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Invisible raycast helper plane along workbench top */}
      <mesh
        visible={false}
        position={[0, 0.86, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial />
      </mesh>

      {placedEquipment.map((item) => {
        const isSelected = item.instanceId === selectedEquipmentInstanceId;

        const commonProps = {
          position: item.position,
          rotation: item.rotation,
          isSelected,
          onSelect: () => selectEquipmentInstance(item.instanceId),
        };

        return (
          <group
            key={item.instanceId}
            onPointerDown={(e) => handlePointerDown(item.instanceId, e)}
          >
            {item.typeId === 'digital-balance' && (
              <DigitalBalance3D {...commonProps} />
            )}

            {item.typeId === 'measuring-cylinder' && (
              <MeasuringCylinder3D
                {...commonProps}
                currentVolume={item.currentVolume}
                materialId={item.currentMaterialId}
              />
            )}

            {item.typeId === 'beaker' && (
              <Beaker3D
                {...commonProps}
                currentVolume={item.currentVolume}
                materialId={item.currentMaterialId}
              />
            )}

            {item.typeId === 'reagent-bottle' && (
              <ReagentBottle3D
                {...commonProps}
                materialId={item.currentMaterialId}
                currentVolume={item.currentVolume}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
