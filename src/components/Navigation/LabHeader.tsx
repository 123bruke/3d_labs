import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Camera,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Droplets,
  CheckCircle,
  AlertCircle,
  Eye,
  Menu,
  Sun,
  Flame,
  Minus,
  Volume2,
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { getExperimentById } from '../../chemistry/experiments';
import { GlassButton } from '../UI/GlassButton';
import { CameraPreset } from '../../types';

interface LabHeaderProps {
  onOpenMaterials: () => void;
  onOpenInfo: () => void;
  onOpenResults: () => void;
  onToggleLabData: () => void;
  isLabDataOpen: boolean;
}

export const LabHeader: React.FC<LabHeaderProps> = ({
  onOpenMaterials,
  onOpenInfo,
  onOpenResults,
  onToggleLabData,
  isLabDataOpen,
}) => {
  const flowStage = useLabStore((state) => state.flowStage);
  const setFlowStage = useLabStore((state) => state.setFlowStage);
  const selectedExperimentId = useLabStore((state) => state.selectedExperimentId);
  const cameraPreset = useLabStore((state) => state.cameraPreset);
  const setCameraPreset = useLabStore((state) => state.setCameraPreset);
  const validateSetup = useLabStore((state) => state.validateSetup);
  const validationStatus = useLabStore((state) => state.validationStatus);
  const startSimulation = useLabStore((state) => state.startSimulation);
  const resetSimulation = useLabStore((state) => state.resetSimulation);
  const isLampOn = useLabStore((state) => state.isLampOn);
  const isHeatOn = useLabStore((state) => state.isHeatOn);
  const toggleLamp = useLabStore((state) => state.toggleLamp);
  const toggleHeat = useLabStore((state) => state.toggleHeat);
  const addWaterVolume = useLabStore((state) => state.addWaterVolume);
  const selectedEquipmentInstanceId = useLabStore((state) => state.selectedEquipmentInstanceId);
  const nudgeEquipment = useLabStore((state) => state.nudgeEquipment);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const experiment = getExperimentById(selectedExperimentId);

  const handleGenerate = () => {
    validateSetup();
  };

  const toggleRecording = () => {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const canvas = document.querySelector('canvas');
    if (!canvas || !('MediaRecorder' in window)) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(canvas.captureStream(30), { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `virtual-chemistry-lab-${Date.now()}.webm`;
      link.click();
      URL.revokeObjectURL(url);
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  };

  const cameraOptions: { id: CameraPreset; label: string; icon: any }[] = [
    { id: 'experiment', label: 'Workbench', icon: Layers },
    { id: 'closeup_balance', label: 'Balance', icon: Eye },
    { id: 'closeup_cylinder', label: 'Cylinder', icon: Eye },
    { id: 'overview', label: 'Overview', icon: Camera },
    { id: 'free', label: 'Free Orbit', icon: Maximize2 },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex flex-col gap-2">
      <div className="flex items-center justify-between w-full">
        {/* Left: App Logo & Experiment Name */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div
            onClick={() => setFlowStage('selector')}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/60 border border-emerald-500/30 backdrop-blur-md cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400/80 font-mono-lab uppercase tracking-widest block">
                Virtual 3D Lab
              </span>
              <h1 className="text-sm font-bold text-white font-display-lab tracking-wide">
                {experiment.title}
              </h1>
            </div>
          </div>

        </div>

        <button
          className="lab-white-button pointer-events-auto"
          onClick={() => setIsControlsOpen((open) => !open)}
          title="Show laboratory controls"
        >
          <Menu className="w-4 h-4" />
          <span>{isControlsOpen ? 'Hide controls' : 'Open controls'}</span>
        </button>
      </div>

      {isControlsOpen && (
        <div className="lab-controls-panel pointer-events-auto self-end w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <GlassButton size="sm" variant="secondary" icon={Info} onClick={onOpenInfo}>Briefing</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Menu} onClick={onToggleLabData} active={isLabDataOpen}>Lab data</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Droplets} onClick={onOpenMaterials}>Reagents</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Sun} onClick={toggleLamp} active={isLampOn}>Lamp</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Flame} onClick={toggleHeat} active={isHeatOn}>Heat</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Volume2} onClick={() => addWaterVolume('beaker-1', 10)}>Water +10 mL</GlassButton>
            <GlassButton size="sm" variant="secondary" icon={Minus} onClick={() => addWaterVolume('beaker-1', -10)}>Water -10 mL</GlassButton>
            <GlassButton size="sm" variant={isRecording ? 'danger' : 'secondary'} icon={isRecording ? Square : Circle} onClick={toggleRecording} title="Record only the 3D laboratory canvas">
              {isRecording ? 'Stop & Download' : 'Record Lab'}
            </GlassButton>
            <div className="lab-nudge-pad" title="Move selected object">
              <button onClick={() => selectedEquipmentInstanceId && nudgeEquipment(selectedEquipmentInstanceId, 0, -0.08)}><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => selectedEquipmentInstanceId && nudgeEquipment(selectedEquipmentInstanceId, -0.08, 0)}><ArrowLeft className="w-3.5 h-3.5" /></button>
              <button onClick={() => selectedEquipmentInstanceId && nudgeEquipment(selectedEquipmentInstanceId, 0, 0.08)}><ArrowDown className="w-3.5 h-3.5" /></button>
              <button onClick={() => selectedEquipmentInstanceId && nudgeEquipment(selectedEquipmentInstanceId, 0.08, 0)}><ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
            {cameraOptions.map((opt) => (
              <GlassButton key={opt.id} size="sm" variant="secondary" icon={opt.icon} active={cameraPreset === opt.id} onClick={() => setCameraPreset(opt.id)}>
                {opt.label}
              </GlassButton>
            ))}
            {flowStage !== 'simulation' && <GlassButton size="sm" variant="primary" icon={Sparkles} onClick={handleGenerate}>Generate</GlassButton>}
            {flowStage !== 'simulation' ? <GlassButton size="sm" variant="accent" icon={Play} onClick={startSimulation}>Run</GlassButton> : <GlassButton size="sm" variant="primary" onClick={onOpenResults}>Results</GlassButton>}
            <GlassButton size="sm" variant="secondary" icon={RotateCcw} onClick={resetSimulation} title="Reset Experiment Setup" />
          </div>
        </div>
      )}

      {/* Validation Notification Banner if user clicks Generate Setup */}
      {validationStatus && (
        <div className="pointer-events-auto self-center mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg backdrop-blur-md border ${
              validationStatus.isValid
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            {validationStatus.isValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{validationStatus.message}</span>
            {validationStatus.isValid && flowStage !== 'simulation' && (
              <button
                onClick={startSimulation}
                className="ml-2 px-2 py-0.5 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 cursor-pointer"
              >
                Start Simulation →
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
