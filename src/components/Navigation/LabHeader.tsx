import React from 'react';
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
} from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { getExperimentById } from '../../chemistry/experiments';
import { GlassButton } from '../UI/GlassButton';
import { CameraPreset } from '../../types';

interface LabHeaderProps {
  onOpenMaterials: () => void;
  onOpenInfo: () => void;
  onOpenResults: () => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({
  onOpenMaterials,
  onOpenInfo,
  onOpenResults,
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

  const experiment = getExperimentById(selectedExperimentId);

  const handleGenerate = () => {
    validateSetup();
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

          <GlassButton
            size="sm"
            variant="secondary"
            icon={Info}
            onClick={onOpenInfo}
            title="Experiment Theory & Objectives"
          >
            Briefing
          </GlassButton>
        </div>

        {/* Center: Camera Presets Bar */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-emerald-500/20 backdrop-blur-md">
          {cameraOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setCameraPreset(opt.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                cameraPreset === opt.id
                  ? 'bg-emerald-500 text-black font-semibold shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                  : 'text-slate-300 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Primary Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reagents Drawer Button */}
          <GlassButton
            size="sm"
            variant="secondary"
            icon={Droplets}
            onClick={onOpenMaterials}
          >
            Reagents
          </GlassButton>

          {/* Generate / Validate Experiment Button */}
          {flowStage !== 'simulation' ? (
            <GlassButton
              size="sm"
              variant="primary"
              icon={Sparkles}
              onClick={handleGenerate}
            >
              Generate
            </GlassButton>
          ) : null}

          {/* Play Experiment Button */}
          {flowStage !== 'simulation' ? (
            <GlassButton
              size="sm"
              variant="accent"
              icon={Play}
              onClick={startSimulation}
            >
              Run
            </GlassButton>
          ) : (
            <GlassButton
              size="sm"
              variant="primary"
              onClick={onOpenResults}
            >
              Results
            </GlassButton>
          )}

          {/* Reset Button */}
          <GlassButton
            size="sm"
            variant="secondary"
            icon={RotateCcw}
            onClick={resetSimulation}
            title="Reset Experiment Setup"
          />
        </div>
      </div>

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
