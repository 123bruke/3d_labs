import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useLabStore } from '../../store/labStore';
import { CameraPreset } from '../../types';

const CAMERA_CONFIGS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    position: [0, 2.5, 3.4],
    target: [0, 0.9, 0],
  },
  experiment: {
    position: [0, 1.45, 1.8],
    target: [0, 0.96, 0.05],
  },
  closeup_balance: {
    position: [-0.75, 1.28, 0.62],
    target: [-0.75, 0.96, 0.05],
  },
  closeup_cylinder: {
    position: [0.75, 1.25, 0.58],
    target: [0.75, 1.05, 0.05],
  },
  free: {
    position: [0, 1.8, 2.5],
    target: [0, 0.95, 0],
  },
};

export const LabCameraController: React.FC = () => {
  const cameraPreset = useLabStore((state) => state.cameraPreset);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetPosRef = useRef(new THREE.Vector3(...CAMERA_CONFIGS[cameraPreset].position));
  const targetLookAtRef = useRef(new THREE.Vector3(...CAMERA_CONFIGS[cameraPreset].target));

  useEffect(() => {
    const config = CAMERA_CONFIGS[cameraPreset];
    targetPosRef.current.set(...config.position);
    targetLookAtRef.current.set(...config.target);
  }, [cameraPreset]);

  useFrame((_, delta) => {
    // Only auto-lerp if not in free camera mode or during transition
    if (cameraPreset !== 'free') {
      const lerpSpeed = Math.min(1.0, delta * 3.5);
      camera.position.lerp(targetPosRef.current, lerpSpeed);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAtRef.current, lerpSpeed);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04} // Do not go below floor
      minDistance={0.4}
      maxDistance={6.0}
      target={CAMERA_CONFIGS[cameraPreset].target}
    />
  );
};
