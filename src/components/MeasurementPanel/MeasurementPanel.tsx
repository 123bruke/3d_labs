import React from 'react';
import { Scale, Droplets, Gauge, Save, CheckCircle, Clock } from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { experimentEngine } from '../../simulation/ExperimentEngine';
import { GlassCard } from '../UI/GlassCard';
import { GlassButton } from '../UI/GlassButton';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';

export const MeasurementPanel: React.FC = () => {
  const activeMeasurement = useLabStore((state) => state.activeMeasurement);
  const isBalanceStable = useLabStore((state) => state.isBalanceStable);
  const tareBalance = useLabStore((state) => state.tareBalance);
  const zeroBalance = useLabStore((state) => state.zeroBalance);
  const selectedMaterialId = useLabStore((state) => state.selectedMaterialId);
  const placedEquipment = useLabStore((state) => state.placedEquipment);

  const activeMaterial = MATERIALS_REGISTRY[selectedMaterialId];

  // Inspect cylinder and beaker for volume
  const cylinder = placedEquipment.find((e) => e.typeId === 'measuring-cylinder');
  const beaker = placedEquipment.find((e) => e.typeId === 'beaker');
  
  const displayVolume = cylinder && cylinder.currentVolume > 0 
    ? cylinder.currentVolume 
    : (beaker && beaker.currentVolume > 0 ? beaker.currentVolume : 0);

  const displayMass = activeMeasurement.isTared
    ? activeMeasurement.taredMass
    : activeMeasurement.rawMass;

  // Dynamic calculated density
  const calculatedDensity = displayVolume > 0
    ? (displayMass / displayVolume).toFixed(3)
    : '—';

  const handleRecord = () => {
    experimentEngine.recordObservation();
  };

  return (
    <div className="absolute top-20 left-6 z-20 pointer-events-auto transition-all animate-in fade-in duration-300">
      <GlassCard dense className="p-3.5 w-76 border-emerald-500/30">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-emerald-100 font-display-lab tracking-wider uppercase">
              Scientific Readouts
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono-lab">
            {isBalanceStable ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> STABLE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 animate-pulse">
                <Clock className="w-3 h-3 text-amber-400" /> SETTLING...
              </span>
            )}
          </div>
        </div>

        {/* Readouts Grid */}
        <div className="space-y-2 text-xs">
          {/* MASS READOUT */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-emerald-500/15">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              Mass {activeMeasurement.isTared ? '(Net)' : '(Gross)'}
            </span>
            <div className="text-right">
              <span className="font-mono-lab text-base font-bold text-emerald-300 glow-emerald">
                {displayMass.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono-lab ml-1">g</span>
            </div>
          </div>

          {/* VOLUME READOUT */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-emerald-500/15">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              Graduated Volume
            </span>
            <div className="text-right">
              <span className="font-mono-lab text-base font-bold text-cyan-300">
                {displayVolume.toFixed(1)}
              </span>
              <span className="text-[11px] text-cyan-400/80 font-mono-lab ml-1">mL</span>
            </div>
          </div>

          {/* DENSITY CALCULATION */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-400/25">
            <span className="text-emerald-300 font-medium">Density (ρ = m/V)</span>
            <div className="text-right">
              <span className="font-mono-lab text-base font-bold text-emerald-200">
                {calculatedDensity}
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono-lab ml-1">g/mL</span>
            </div>
          </div>
        </div>

        {/* Quick Balance Actions */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-emerald-500/15">
          <GlassButton
            size="sm"
            variant="secondary"
            className="text-[11px] px-2 py-1"
            onClick={tareBalance}
          >
            Tare
          </GlassButton>
          <GlassButton
            size="sm"
            variant="secondary"
            className="text-[11px] px-2 py-1"
            onClick={zeroBalance}
          >
            Zero
          </GlassButton>
          <GlassButton
            size="sm"
            variant="primary"
            icon={Save}
            className="text-[11px] px-2 py-1"
            onClick={handleRecord}
          >
            Log
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
};
