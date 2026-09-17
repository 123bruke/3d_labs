import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, Lightbulb, ChevronDown } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { getExperimentById } from '../../chemistry/experiments';
import { GlassCard } from '../UI/GlassCard';
import { GlassButton } from '../UI/GlassButton';

export const ExperimentTimeline: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedExperimentId = useLabStore((state) => state.selectedExperimentId);
  const currentStepIndex = useLabStore((state) => state.currentStepIndex);
  const advanceStep = useLabStore((state) => state.advanceStep);
  const setStepIndex = useLabStore((state) => state.setStepIndex);
  const setFlowStage = useLabStore((state) => state.setFlowStage);

  const experiment = getExperimentById(selectedExperimentId);
  const currentStep = experiment.steps[currentStepIndex];

  return (
    <div className="absolute bottom-6 left-6 z-20 pointer-events-auto max-w-md w-full transition-all">
      <GlassCard dense className="p-4 border-emerald-500/30">
        <button className="w-full flex items-center justify-between pb-2 mb-2 border-b border-blue-400/20" onClick={() => setIsOpen((open) => !open)} title="Show experiment steps">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h4 className="text-xs font-semibold text-emerald-200 font-display-lab tracking-wider uppercase">
              Step {currentStepIndex + 1} of {experiment.steps.length}: {currentStep?.title}
            </h4>
          </div>
          <span className="text-[10px] font-mono-lab text-emerald-400/80">
            {Math.round(((currentStepIndex + 1) / experiment.steps.length) * 100)}%
          </span>
          <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && <>

        {/* Step Instruction */}
        <p className="text-xs text-slate-200 leading-relaxed min-h-[36px]">
          {currentStep?.instruction}
        </p>

        {/* Hint if present */}
        {currentStep?.hint && (
          <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2 text-[11px] text-emerald-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{currentStep.hint}</span>
          </div>
        )}

        {/* Step Progress Indicators & Controls */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-emerald-500/15">
          <div className="flex items-center gap-1.5">
            {experiment.steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setStepIndex(idx)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono-lab transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                    : idx < currentStepIndex
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-black/40 text-slate-500 border border-white/5'
                }`}
                title={step.title}
              >
                {idx < currentStepIndex ? '✓' : idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex < experiment.steps.length - 1 ? (
              <GlassButton
                size="sm"
                variant="accent"
                icon={ChevronRight}
                iconPosition="right"
                onClick={advanceStep}
                className="text-xs"
              >
                Next Step
              </GlassButton>
            ) : (
              <GlassButton
                size="sm"
                variant="accent"
                onClick={() => setFlowStage('results')}
                className="text-xs"
              >
                Calculate Results
              </GlassButton>
            )}
          </div>
        </div></>}
      </GlassCard>
    </div>
  );
};
