import React from 'react';
import { X, CheckCircle2, BookOpen, Atom, ArrowRight } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { getExperimentById } from '../../chemistry/experiments';
import { GlassCard, GlassBadge } from '../UI/GlassCard';
import { GlassButton } from '../UI/GlassButton';

interface ExperimentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExperimentInfoModal: React.FC<ExperimentInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const selectedExperimentId = useLabStore((state) => state.selectedExperimentId);
  const setFlowStage = useLabStore((state) => state.setFlowStage);

  if (!isOpen) return null;

  const experiment = getExperimentById(selectedExperimentId);

  const handleEnterLab = () => {
    onClose();
    setFlowStage('lab_builder');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <GlassCard dense className="max-w-2xl w-full p-6 border-emerald-500/30 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <GlassBadge variant="emerald">{experiment.category}</GlassBadge>
              <GlassBadge variant="cyan">{experiment.difficulty}</GlassBadge>
              <span className="text-xs text-slate-400 font-mono-lab">Est: {experiment.duration}</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display-lab tracking-wide">
              {experiment.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {experiment.shortDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs">
          {/* Formula Callout */}
          {experiment.formula && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-400/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-lab text-emerald-400 block mb-0.5">
                  Scientific Governing Equation
                </span>
                <span className="text-base font-mono-lab font-bold text-emerald-200">
                  {experiment.formula}
                </span>
                <p className="text-[11px] text-slate-300 mt-1">{experiment.formulaExplainer}</p>
              </div>
              <Atom className="w-8 h-8 text-emerald-400/40 shrink-0" />
            </div>
          )}

          {/* Learning Objectives */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 font-mono-lab mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Learning Objectives
            </h4>
            <div className="space-y-1.5">
              {experiment.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-black/30 border border-white/5 text-slate-200">
                  <span className="text-emerald-400 font-mono-lab font-semibold">{i + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Principles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 font-mono-lab mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Scientific Principles & Theory
            </h4>
            <div className="space-y-2">
              {experiment.scientificPrinciples.map((principle, i) => (
                <p key={i} className="text-slate-300 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                  {principle}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-mono-lab">
            Ready to interact in 3D environment
          </span>
          <div className="flex gap-2">
            <GlassButton size="md" variant="secondary" onClick={onClose}>
              Dismiss
            </GlassButton>
            <GlassButton
              size="md"
              variant="accent"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleEnterLab}
            >
              Enter Laboratory
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
