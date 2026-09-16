import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  X,
  RotateCcw,
  Sparkles,
  Calculator,
  Download,
  Trash2,
  TrendingDown,
  Atom,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabStore } from '../../store/labStore';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';
import { getExperimentById } from '../../chemistry/experiments';
import { GlassCard, GlassBadge } from '../UI/GlassCard';
import { GlassButton } from '../UI/GlassButton';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose }) => {
  const selectedExperimentId = useLabStore((state) => state.selectedExperimentId);
  const selectedMaterialId = useLabStore((state) => state.selectedMaterialId);
  const recordedObservations = useLabStore((state) => state.recordedObservations);
  const removeObservationRecord = useLabStore((state) => state.removeObservationRecord);
  const activeMeasurement = useLabStore((state) => state.activeMeasurement);
  const placedEquipment = useLabStore((state) => state.placedEquipment);
  const setFlowStage = useLabStore((state) => state.setFlowStage);

  const experiment = getExperimentById(selectedExperimentId);
  const activeMaterial = MATERIALS_REGISTRY[selectedMaterialId];

  // Inspect current cylinder or beaker
  const cylinder = placedEquipment.find((e) => e.typeId === 'measuring-cylinder');
  const beaker = placedEquipment.find((e) => e.typeId === 'beaker');
  const currentVolume = cylinder && cylinder.currentVolume > 0 
    ? cylinder.currentVolume 
    : (beaker && beaker.currentVolume > 0 ? beaker.currentVolume : 50);

  const currentMass = activeMeasurement.taredMass > 0
    ? activeMeasurement.taredMass
    : currentVolume * activeMaterial.density;

  // Interactive custom formula calculator
  const [calcMass, setCalcMass] = useState(currentMass.toFixed(2));
  const [calcVolume, setCalcVolume] = useState(currentVolume.toFixed(1));
  const [hasEvaluated, setHasEvaluated] = useState(false);

  if (!isOpen) return null;

  const numMass = parseFloat(calcMass) || 0;
  const numVolume = parseFloat(calcVolume) || 1;
  const calculatedDensity = numVolume > 0 ? (numMass / numVolume).toFixed(4) : '0.0000';
  const numDensity = parseFloat(calculatedDensity);
  const theoreticalDensity = activeMaterial.density;
  const errorPercent = theoreticalDensity > 0
    ? ((Math.abs(numDensity - theoreticalDensity) / theoreticalDensity) * 100).toFixed(2)
    : '0.00';

  const isHighlyAccurate = parseFloat(errorPercent) <= 5.0;

  const triggerCelebration = () => {
    setHasEvaluated(true);
    if (isHighlyAccurate) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24'],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <GlassCard dense className="max-w-3xl w-full p-6 border-emerald-500/30 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-display-lab tracking-wide">
                  Laboratory Analysis & Results
                </h2>
                <GlassBadge variant="emerald">{experiment.title}</GlassBadge>
              </div>
              <p className="text-xs text-slate-300 font-mono-lab">
                Chemical Sample: {activeMaterial.name} ({activeMaterial.formula})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Scientific Calculation Workbench */}
        <div className="py-4 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-200 font-mono-lab">
                  Dynamic Density Calculation (ρ = Mass / Volume)
                </h4>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-mono-lab">
                Literature Standard: {theoreticalDensity.toFixed(3)} g/mL
              </span>
            </div>

            {/* Interactive calculation equation box */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-black/40 p-3 rounded-lg border border-white/5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono-lab block mb-1">
                  Mass (m) [grams]
                </label>
                <input
                  type="number"
                  value={calcMass}
                  onChange={(e) => setCalcMass(e.target.value)}
                  className="w-full bg-[#0a1811] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-emerald-200 font-mono-lab font-bold focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono-lab block mb-1">
                  Volume (V) [mL]
                </label>
                <input
                  type="number"
                  value={calcVolume}
                  onChange={(e) => setCalcVolume(e.target.value)}
                  className="w-full bg-[#0a1811] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-cyan-200 font-mono-lab font-bold focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono-lab block mb-1">
                  Calculated Density (ρ)
                </label>
                <div className="bg-[#0e271c] border border-emerald-400/40 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono-lab font-bold">
                  {calculatedDensity} g/mL
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <GlassButton
                  size="sm"
                  variant="accent"
                  icon={Sparkles}
                  onClick={triggerCelebration}
                  className="w-full text-xs"
                >
                  Verify Result
                </GlassButton>
              </div>
            </div>

            {/* Error Assessment Card */}
            {hasEvaluated && (
              <div
                className={`mt-3 p-3 rounded-lg border flex items-center justify-between text-xs ${
                  isHighlyAccurate
                    ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-100'
                    : 'bg-amber-950/70 border-amber-400/50 text-amber-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">
                      {isHighlyAccurate ? 'Exceptional Experimental Precision!' : 'Measurement Divergence Observed'}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Experimental Density: <strong className="text-white">{calculatedDensity} g/mL</strong> vs CRC Literature: <strong className="text-white">{theoreticalDensity.toFixed(3)} g/mL</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] block font-mono-lab uppercase opacity-80">Relative Error</span>
                  <span className="font-mono-lab text-base font-bold">
                    {errorPercent}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Observation Records History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 font-mono-lab">
                Recorded Experimental Trials ({recordedObservations.length})
              </h4>
            </div>

            {recordedObservations.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-black/20 border border-white/5 text-slate-400">
                <p>No trials recorded yet. Use the "Log" button in the measurement panel during simulation to archive experimental runs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-emerald-950/40 text-emerald-400 font-mono-lab text-[10px] uppercase border-b border-white/10">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Substance</th>
                      <th className="p-2.5">Mass (g)</th>
                      <th className="p-2.5">Volume (mL)</th>
                      <th className="p-2.5">Density (g/mL)</th>
                      <th className="p-2.5">Error (%)</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono-lab">
                    {recordedObservations.map((obs) => (
                      <tr key={obs.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-2.5 text-slate-400">
                          {new Date(obs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="p-2.5 font-medium text-emerald-200">{obs.materialName}</td>
                        <td className="p-2.5">{obs.massMeasured.toFixed(2)}</td>
                        <td className="p-2.5">{obs.volumeMeasured.toFixed(1)}</td>
                        <td className="p-2.5 font-bold text-emerald-300">{obs.calculatedDensity.toFixed(4)}</td>
                        <td className="p-2.5 text-cyan-300">{obs.errorPercentage.toFixed(2)}%</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => removeObservationRecord(obs.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between">
          <GlassButton
            size="sm"
            variant="secondary"
            onClick={() => setFlowStage('selector')}
          >
            ← Switch Experiment
          </GlassButton>

          <div className="flex gap-2">
            <GlassButton size="sm" variant="secondary" onClick={onClose}>
              Return to 3D Lab
            </GlassButton>
            <GlassButton
              size="sm"
              variant="accent"
              onClick={onClose}
            >
              Conclude Phase 1
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
