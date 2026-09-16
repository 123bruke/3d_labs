import React, { useState } from 'react';
import { useLabStore } from './store/labStore';
import { LabCanvas } from './three/LabCanvas';
import { LabHeader } from './components/Navigation/LabHeader';
import { MeasurementPanel } from './components/MeasurementPanel/MeasurementPanel';
import { ExperimentTimeline } from './components/ExperimentTimeline/ExperimentTimeline';
import { ObjectInspector } from './components/UI/ObjectInspector';
import { MaterialsDrawer } from './components/MaterialsPanel/MaterialsDrawer';
import { MaterialsBar } from './components/MaterialsPanel/MaterialsBar';
import { ExperimentInfoModal } from './components/ExperimentInfo/ExperimentInfoModal';
import { ResultModal } from './components/ResultPanel/ResultModal';
import { ExperimentSelector } from './components/ExperimentSelector/ExperimentSelector';
import { IntroScreen } from './components/Intro/IntroScreen';

export default function App() {
  const flowStage = useLabStore((state) => state.flowStage);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const showHud = flowStage === 'lab_builder' || flowStage === 'simulation' || flowStage === 'intro' || flowStage === 'results';

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0c1512] relative font-sans text-slate-100">
      {/* 3D Laboratory Canvas (always rendered) */}
      <div className="absolute inset-0 z-0">
        <LabCanvas />
      </div>

      {/* Active Laboratory HUD & Overlays */}
      {showHud && (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
          <LabHeader
            onOpenMaterials={() => setIsMaterialsOpen(true)}
            onOpenInfo={() => setIsInfoOpen(true)}
            onOpenResults={() => setIsResultsOpen(true)}
          />

          <MeasurementPanel />
          <ObjectInspector />
          <MaterialsBar />
          <ExperimentTimeline />
        </div>
      )}

      {/* Intro Welcome Overlay (translucent, lab visible behind) */}
      {flowStage === 'intro' && <IntroScreen />}

      {/* Experiment Selector Overlay */}
      {flowStage === 'selector' && <ExperimentSelector />}

      {/* Modals & Drawers */}
      <MaterialsDrawer
        isOpen={isMaterialsOpen}
        onClose={() => setIsMaterialsOpen(false)}
      />

      <ExperimentInfoModal
        isOpen={isInfoOpen || flowStage === 'briefing'}
        onClose={() => setIsInfoOpen(false)}
      />

      <ResultModal
        isOpen={isResultsOpen || flowStage === 'results'}
        onClose={() => setIsResultsOpen(false)}
      />
    </div>
  );
}