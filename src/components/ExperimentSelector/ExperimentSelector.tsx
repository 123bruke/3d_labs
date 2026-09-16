import React from 'react';
import { Scale, Droplets, X, FlaskConical } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { EXPERIMENTS_REGISTRY } from '../../chemistry/experiments';
import { ExperimentId } from '../../types';
import { GlassCard } from '../UI/GlassCard';

export const ExperimentSelector: React.FC = () => {
  const selectExperiment = useLabStore((state) => state.selectExperiment);
  const setFlowStage = useLabStore((state) => state.setFlowStage);

  const activeExperiments = [
    { ...EXPERIMENTS_REGISTRY['mass-volume'], icon: Scale },
    { ...EXPERIMENTS_REGISTRY['density-liquids'], icon: Droplets },
  ];

  const handleLaunch = (id: ExperimentId) => {
    selectExperiment(id);
    setFlowStage('lab_builder');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg">
        <GlassCard dense className="p-5 border-emerald-500/30 shadow-[0_0_60px_rgba(4,20,14,0.9)]">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Choose Experiment</h2>
            </div>
            <button
              onClick={() => setFlowStage('lab_builder')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3 space-y-2.5">
            {activeExperiments.map((exp) => {
              const Icon = exp.icon;
              return (
                <div
                  key={exp.id}
                  onClick={() => handleLaunch(exp.id as ExperimentId)}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-black/30 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-950/40 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/90 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 truncate">
                      {exp.shortDesc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-lab text-emerald-400 border border-emerald-500/30 rounded-md px-2 py-1 shrink-0">
                    {exp.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};