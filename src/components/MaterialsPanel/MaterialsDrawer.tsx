import React from 'react';
import { Droplets, Check, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';
import { MaterialId } from '../../types';
import { GlassCard, GlassBadge } from '../UI/GlassCard';

interface MaterialsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialsDrawer: React.FC<MaterialsDrawerProps> = ({ isOpen, onClose }) => {
  const selectedMaterialId = useLabStore((state) => state.selectedMaterialId);
  const selectMaterial = useLabStore((state) => state.selectMaterial);

  if (!isOpen) return null;

  const materials = Object.values(MATERIALS_REGISTRY);

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#08130e]/95 border-l border-emerald-500/30 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-emerald-100 font-display-lab tracking-wider uppercase">
                  Chemical Reagent Cabinet
                </h3>
                <p className="text-xs text-emerald-400/70">Select active testing fluid for simulation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liquid Reagent Cards */}
          <div className="space-y-3">
            {materials.map((mat) => {
              const isSelected = mat.id === selectedMaterialId;

              return (
                <div
                  key={mat.id}
                  onClick={() => selectMaterial(mat.id as MaterialId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                      : 'bg-black/30 border-white/5 hover:border-emerald-500/40 hover:bg-emerald-950/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-white/30 shrink-0 shadow-sm"
                        style={{ backgroundColor: mat.color }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
                          {mat.name}
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </h4>
                        <span className="text-xs font-mono-lab text-emerald-400/80">
                          Formula: {mat.formula}
                        </span>
                      </div>
                    </div>
                    <GlassBadge variant={isSelected ? 'emerald' : 'slate'}>
                      ρ = {mat.density.toFixed(3)} g/mL
                    </GlassBadge>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {mat.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/5 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-mono-lab text-[10px]">Viscosity (20°C)</span>
                      <span className="text-emerald-200 font-mono-lab font-medium">
                        {mat.viscosity} mPa·s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono-lab text-[10px]">Refractive Index (n)</span>
                      <span className="text-emerald-200 font-mono-lab font-medium">
                        {mat.refractiveIndex}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-amber-300/80 bg-amber-950/20 px-2 py-1 rounded border border-amber-500/10">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{mat.hazardNote}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-emerald-500/20 text-xs text-slate-400">
          <p className="flex items-center gap-1.5 text-emerald-400/80 font-mono-lab text-[11px]">
            <ShieldCheck className="w-4 h-4" /> CRC Handbook of Chemistry & Physics 104th Ed.
          </p>
        </div>
      </div>
    </div>
  );
};
