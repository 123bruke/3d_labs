import React, { useState } from 'react';
import { Droplets, Check, ChevronDown } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';
import { MaterialId } from '../../types';

export const MaterialsBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMaterialId = useLabStore((state) => state.selectedMaterialId);
  const selectMaterial = useLabStore((state) => state.selectMaterial);

  const materials = Object.values(MATERIALS_REGISTRY);

  return (
    <div className="absolute bottom-6 right-6 z-20 pointer-events-auto w-52">
      <div className="rounded-2xl bg-[rgba(7,16,12,0.85)] border border-emerald-500/25 shadow-2xl backdrop-blur-xl overflow-hidden">
        <button className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border-b border-blue-400/20" onClick={() => setIsOpen((open) => !open)} title="Show materials">
          <span className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-blue-100 tracking-wider uppercase">Materials</h3>
          </span>
          <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && <div className="p-2 space-y-1.5">
          {materials.map((mat) => {
            const isSelected = mat.id === selectedMaterialId;
            return (
              <button
                key={mat.id}
                onClick={() => selectMaterial(mat.id as MaterialId)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                    : 'bg-black/25 border-white/5 hover:border-emerald-500/40 hover:bg-emerald-950/40'
                }`}
                title={`Select ${mat.name}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: mat.color }}
                  />
                  <span className="text-[11px] font-medium text-emerald-100 truncate">
                    {mat.name.split(' ')[0]}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono-lab text-emerald-400/80">
                      {mat.density.toFixed(3)}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>}
      </div>
    </div>
  );
};