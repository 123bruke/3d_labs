import React from 'react';
import {
  X,
  Scale,
  FlaskConical,
  Beaker as BeakerIcon,
  Droplets,
  RotateCcw,
  Trash2,
  ArrowRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useLabStore } from '../../store/labStore';
import { EQUIPMENT_REGISTRY } from '../../chemistry/equipment';
import { MATERIALS_REGISTRY } from '../../chemistry/materials';
import { GlassCard, GlassBadge } from './GlassCard';
import { GlassButton } from './GlassButton';

export const ObjectInspector: React.FC = () => {
  const selectedInstanceId = useLabStore((state) => state.selectedEquipmentInstanceId);
  const selectEquipmentInstance = useLabStore((state) => state.selectEquipmentInstance);
  const placedEquipment = useLabStore((state) => state.placedEquipment);
  const placeOnBalancePan = useLabStore((state) => state.placeOnBalancePan);
  const removeFromBalancePan = useLabStore((state) => state.removeFromBalancePan);
  const emptyContainer = useLabStore((state) => state.emptyContainer);
  const dispenseLiquid = useLabStore((state) => state.dispenseLiquid);
  const transferLiquid = useLabStore((state) => state.transferLiquid);
  const flowStage = useLabStore((state) => state.flowStage);

  if (!selectedInstanceId) return null;

  const item = placedEquipment.find((e) => e.instanceId === selectedInstanceId);
  if (!item) return null;

  const eqConfig = EQUIPMENT_REGISTRY[item.typeId];
  const activeMaterial = item.currentMaterialId ? MATERIALS_REGISTRY[item.currentMaterialId] : null;

  // Potential transfer targets
  const otherContainers = placedEquipment.filter(
    (e) => e.instanceId !== item.instanceId && (e.typeId === 'beaker' || e.typeId === 'measuring-cylinder')
  );

  return (
    <div className="absolute top-20 right-6 w-84 z-30 pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4 duration-300">
      <GlassCard dense className="p-4 border-emerald-500/30">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              {item.typeId === 'digital-balance' && <Scale className="w-4 h-4" />}
              {item.typeId === 'measuring-cylinder' && <FlaskConical className="w-4 h-4" />}
              {item.typeId === 'beaker' && <BeakerIcon className="w-4 h-4" />}
              {item.typeId === 'reagent-bottle' && <Droplets className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-100 font-display-lab tracking-wider uppercase">
                {eqConfig?.name || item.name}
              </h4>
              <p className="text-xs text-emerald-400/70 font-mono-lab">
                ID: {item.instanceId} • {eqConfig?.category}
              </p>
            </div>
          </div>
          <button
            onClick={() => selectEquipmentInstance(null)}
            className="text-slate-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-emerald-950/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Specifications Table */}
        <div className="py-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-lab">Material</span>
              <span className="text-emerald-200 font-medium">{eqConfig?.material || 'Alloy'}</span>
            </div>
            <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-lab">Empty Mass</span>
              <span className="text-emerald-200 font-mono-lab font-semibold">
                {eqConfig?.emptyMass.toFixed(2)} g
              </span>
            </div>
            <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-lab">Capacity</span>
              <span className="text-emerald-200 font-mono-lab font-semibold">
                {eqConfig?.capacity} {eqConfig?.unit}
              </span>
            </div>
            <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/10">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-lab">Position</span>
              <span className="text-emerald-200 font-mono-lab text-[11px]">
                {item.placedOnBalance ? 'On Balance Pan' : 'Workbench Surface'}
              </span>
            </div>
          </div>

          {/* Current Content Status */}
          {item.typeId !== 'digital-balance' && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  Liquid Contents
                </span>
                <GlassBadge variant={activeMaterial ? 'emerald' : 'slate'}>
                  {item.currentVolume.toFixed(1)} mL
                </GlassBadge>
              </div>

              {activeMaterial ? (
                <div className="text-[11px] space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chemical:</span>
                    <span className="text-emerald-300 font-medium">{activeMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Formula:</span>
                    <span className="text-emerald-200 font-mono-lab">{activeMaterial.formula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Density (20°C):</span>
                    <span className="text-emerald-300 font-mono-lab">{activeMaterial.density.toFixed(3)} g/mL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Content Mass:</span>
                    <span className="text-emerald-200 font-mono-lab font-semibold">
                      {(item.currentVolume * activeMaterial.density).toFixed(2)} g
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">Vessel is currently empty.</p>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-300/80 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
            <strong className="text-emerald-400">Function: </strong>
            {eqConfig?.functionDesc}
          </p>
        </div>

        {/* Object Actions Toolbar */}
        <div className="pt-3 border-t border-emerald-500/20 flex flex-col gap-2">
          {/* Balance Pan Toggle for Vessels */}
          {item.typeId !== 'digital-balance' && item.typeId !== 'reagent-bottle' && (
            <div className="flex gap-2">
              {!item.placedOnBalance ? (
                <GlassButton
                  size="sm"
                  variant="primary"
                  icon={Scale}
                  className="w-full text-xs"
                  onClick={() => placeOnBalancePan(item.instanceId)}
                >
                  Place on Balance Pan
                </GlassButton>
              ) : (
                <GlassButton
                  size="sm"
                  variant="secondary"
                  icon={ArrowRight}
                  className="w-full text-xs"
                  onClick={() => removeFromBalancePan(item.instanceId)}
                >
                  Return to Table
                </GlassButton>
              )}
            </div>
          )}

          {/* Quick Dispense from Reagent to Vessel */}
          {item.typeId !== 'digital-balance' && item.typeId !== 'reagent-bottle' && (
            <div className="grid grid-cols-2 gap-2">
              <GlassButton
                size="sm"
                variant="accent"
                icon={Droplets}
                className="text-xs"
                onClick={() => dispenseLiquid(item.instanceId, 50)}
              >
                +50 mL Reagent
              </GlassButton>

              <GlassButton
                size="sm"
                variant="danger"
                icon={Trash2}
                disabled={item.currentVolume === 0}
                className="text-xs"
                onClick={() => emptyContainer(item.instanceId)}
              >
                Empty Vessel
              </GlassButton>
            </div>
          )}

          {/* Transfer Liquid between vessels */}
          {item.typeId !== 'digital-balance' && item.currentVolume > 0 && otherContainers.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] uppercase font-mono-lab text-slate-400 block mb-1">
                Transfer Liquid To:
              </span>
              <div className="flex flex-col gap-1.5">
                {otherContainers.map((target) => (
                  <GlassButton
                    key={target.instanceId}
                    size="sm"
                    variant="secondary"
                    icon={ArrowRight}
                    className="text-xs justify-between"
                    onClick={() => transferLiquid(item.instanceId, target.instanceId, item.currentVolume)}
                  >
                    <span>Pour into {target.name}</span>
                    <span className="font-mono-lab text-[11px] text-emerald-400">
                      {item.currentVolume} mL
                    </span>
                  </GlassButton>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
