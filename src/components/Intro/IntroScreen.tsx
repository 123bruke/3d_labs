import React from 'react';
import { FlaskConical, Play } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { GlassCard } from '../UI/GlassCard';
import { GlassButton } from '../UI/GlassButton';

export const IntroScreen: React.FC = () => {
  const setFlowStage = useLabStore((state) => state.setFlowStage);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm">
        <GlassCard dense className="p-6 border-emerald-500/30 text-center shadow-[0_0_60px_rgba(4,20,14,0.9)]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight mb-1">
            Virtual 3D Chemistry Lab
          </h1>

          <p className="text-sm text-slate-300 mb-5">
            Measure mass, volume and density with real 3D equipment.
          </p>

          <div className="flex flex-col gap-2">
            <GlassButton
              size="md"
              variant="accent"
              icon={Play}
              iconPosition="right"
              onClick={() => setFlowStage('lab_builder')}
            >
              Enter Lab
            </GlassButton>
            <GlassButton
              size="sm"
              variant="secondary"
              onClick={() => setFlowStage('selector')}
            >
              Choose Experiment
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};