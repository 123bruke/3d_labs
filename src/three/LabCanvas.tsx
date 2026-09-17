import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { LabRoom } from './Environment/LabRoom';
import { LabEffects } from './Environment/LabEffects';
import { EquipmentManager } from './Interaction/EquipmentManager';
import { PouringStream3D } from './Equipment/PouringStream3D';
import { LabCameraController } from './Camera/LabCameraController';

export const LabCanvas: React.FC = () => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows="basic"
        dpr={[1, 2]}
        camera={{ position: [0, 1.9, 3.1], fov: 45, near: 0.05, far: 60 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#0c1512']} />
        <fog attach="fog" args={['#0c1512', 8, 18]} />

        {/* Scientific Laboratory Lighting Rig */}
          <hemisphereLight
            intensity={1.15}
            color="#d9f7ea"
            groundColor="#0d1512"
          />
          <ambientLight intensity={0.85} color="#cfe8dd" />

          {/* Main Overhead Cleanroom Key Light */}
          <directionalLight
            position={[2.5, 5.5, 2.8]}
            intensity={3.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={14}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
            shadow-bias={-0.0001}
          />

          {/* Secondary Fill Light from workbench left */}
          <directionalLight
            position={[-3, 4, 2]}
            intensity={1.6}
            color="#bff5dd"
          />

          {/* Workbench Center Spotlight for scientific clarity */}
          <spotLight
            position={[0, 4.5, 0.5]}
            target-position={[0, 0.86, 0]}
            angle={0.65}
            penumbra={0.6}
            intensity={2.6}
            decay={1}
            color="#f4fff8"
            castShadow
          />

          {/* Front Fill so the bench face is never dark */}
          <directionalLight position={[0, 2, -2]} intensity={0.9} color="#ffffff" />

          {/* Back Rim Light */}
          <pointLight
            position={[0, 3.5, -3.2]}
            intensity={2.5}
            decay={1}
            color="#34d399"
            distance={10}
          />

        {/* 3D Scene Components */}
        <LabRoom />
        <LabEffects />
        <EquipmentManager />
        <PouringStream3D />
        <LabCameraController />
      </Canvas>
    </div>
  );
};
