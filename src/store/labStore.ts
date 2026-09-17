import { create } from 'zustand';
import {
  ExperimentId,
  FlowStage,
  CameraPreset,
  MaterialId,
  EquipmentTypeId,
  PlacedEquipment,
  ObservationRecord,
  ValidationResult,
  MeasurementReading,
} from '../types';
import { EXPERIMENTS_REGISTRY, getExperimentById } from '../chemistry/experiments';
import { EQUIPMENT_REGISTRY } from '../chemistry/equipment';
import { MATERIALS_REGISTRY, getMaterialById } from '../chemistry/materials';
import { ValidationSystem } from '../simulation/ValidationSystem';
import { MeasurementSystem } from '../simulation/MeasurementSystem';
import { playLabSound } from '../simulation/labAudio';

const DEFAULT_EQUIPMENT_SETUP: PlacedEquipment[] = [
  {
    instanceId: 'balance-1',
    typeId: 'digital-balance',
    name: 'Precision Digital Balance',
    position: [-0.75, 0.86, 0.05],
    rotation: [0, 0, 0],
    currentVolume: 0,
    currentMaterialId: null,
    placedOnBalance: false,
    selected: false,
  },
  {
    instanceId: 'cylinder-1',
    typeId: 'measuring-cylinder',
    name: '100 mL Graduated Cylinder',
    position: [0.75, 0.86, 0.05],
    rotation: [0, 0, 0],
    currentVolume: 0,
    currentMaterialId: null,
    placedOnBalance: false,
    selected: false,
  },
  {
    instanceId: 'beaker-1',
    typeId: 'beaker',
    name: '250 mL Beaker',
    position: [0.0, 0.86, 0.2],
    rotation: [0, 0, 0],
    currentVolume: 0,
    currentMaterialId: null,
    placedOnBalance: false,
    selected: false,
  },
  {
    instanceId: 'reagent-1',
    typeId: 'reagent-bottle',
    name: 'Reagent Dispenser',
    position: [0.0, 0.86, -0.42],
    rotation: [0, 0, 0],
    currentVolume: 450,
    currentMaterialId: 'water',
    placedOnBalance: false,
    selected: false,
  },
];

const getBalancePosition = (placedEquipment: PlacedEquipment[]): [number, number, number] => {
  const balance = placedEquipment.find((e) => e.typeId === 'digital-balance');
  return balance ? balance.position : [-0.75, 0.86, 0.05];
};

interface LabStoreState {
  flowStage: FlowStage;
  selectedExperimentId: ExperimentId;
  selectedMaterialId: MaterialId;
  selectedEquipmentInstanceId: string | null;
  cameraPreset: CameraPreset;
  placedEquipment: PlacedEquipment[];
  
  // Balance & physics readings
  tareOffset: number;
  isTared: boolean;
  isBalanceStable: boolean;
  activeMeasurement: MeasurementReading;
  
  // Experiment validation & progression
  validationStatus: ValidationResult | null;
  currentStepIndex: number;
  isSimulating: boolean;
  
  // Dynamic Liquid Transfer Animation (4D time-step)
  isPouring: boolean;
  pouringSourceId: string | null;
  pouringTargetId: string | null;
  pouringProgress: number; // 0 to 1

  // Laboratory instruments and environmental effects
  isLampOn: boolean;
  isHeatOn: boolean;
  roomTemperature: number;
  flameTemperature: number;
  
  // Observation logs
  recordedObservations: ObservationRecord[];
  
  // Actions
  setFlowStage: (stage: FlowStage) => void;
  selectExperiment: (id: ExperimentId) => void;
  selectMaterial: (id: MaterialId) => void;
  selectEquipmentInstance: (id: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleLamp: () => void;
  toggleHeat: () => void;
  
  updateEquipmentPosition: (instanceId: string, position: [number, number, number]) => void;
  moveEquipmentDuringDrag: (instanceId: string, position: [number, number, number]) => void;
  nudgeEquipment: (instanceId: string, dx: number, dz: number) => void;
  updateEquipmentRotation: (instanceId: string, rotation: [number, number, number]) => void;
  placeOnBalancePan: (instanceId: string) => void;
  removeFromBalancePan: (instanceId: string) => void;
  
  tareBalance: () => void;
  zeroBalance: () => void;
  
  dispenseLiquid: (targetInstanceId: string, volumeMl: number) => void;
  addWaterVolume: (targetInstanceId: string, volumeMl: number) => void;
  transferLiquid: (sourceInstanceId: string, targetInstanceId: string, volumeMl: number) => void;
  emptyContainer: (instanceId: string) => void;
  
  validateSetup: () => ValidationResult;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  advanceStep: () => void;
  setStepIndex: (idx: number) => void;
  
  addObservationRecord: (record: Omit<ObservationRecord, 'id' | 'timestamp'>) => void;
  removeObservationRecord: (id: string) => void;
}

export const useLabStore = create<LabStoreState>((set, get) => ({
  flowStage: 'lab_builder',
  selectedExperimentId: 'mass-volume',
  selectedMaterialId: 'water',
  selectedEquipmentInstanceId: null,
  cameraPreset: 'overview',
  placedEquipment: DEFAULT_EQUIPMENT_SETUP,
  
  tareOffset: 0,
  isTared: false,
  isBalanceStable: true,
  activeMeasurement: MeasurementSystem.computeBalanceReading(DEFAULT_EQUIPMENT_SETUP, 0, false),
  
  validationStatus: null,
  currentStepIndex: 0,
  isSimulating: false,
  
  isPouring: false,
  pouringSourceId: null,
  pouringTargetId: null,
  pouringProgress: 0,

  isLampOn: true,
  isHeatOn: false,
  roomTemperature: 22,
  flameTemperature: 22,
  
  recordedObservations: [],

  setFlowStage: (stage) => set({ flowStage: stage }),

  selectExperiment: (id) => {
    const exp = getExperimentById(id);
    const firstMaterial = exp.requiredMaterials[0] || 'water';
    
    // Update reagent bottle material to match the selected experiment's first liquid
    const updatedEquipment = get().placedEquipment.map((item) => {
      if (item.typeId === 'reagent-bottle') {
        return {
          ...item,
          currentMaterialId: firstMaterial,
          currentVolume: 450,
        };
      }
      return {
        ...item,
        currentVolume: 0,
        currentMaterialId: null,
        placedOnBalance: false,
      };
    });

    const reading = MeasurementSystem.computeBalanceReading(updatedEquipment, 0, false);

    set({
      selectedExperimentId: id,
      selectedMaterialId: firstMaterial,
      placedEquipment: updatedEquipment,
      tareOffset: 0,
      isTared: false,
      isBalanceStable: true,
      activeMeasurement: reading,
      currentStepIndex: 0,
      validationStatus: null,
    });
  },

  selectMaterial: (id) => {
    const updated = get().placedEquipment.map((item) => {
      if (item.typeId === 'reagent-bottle') {
        return { ...item, currentMaterialId: id, currentVolume: 450 };
      }
      return item;
    });
    set({
      selectedMaterialId: id,
      placedEquipment: updated,
    });
  },

  selectEquipmentInstance: (id) => {
    const updated = get().placedEquipment.map((item) => ({
      ...item,
      selected: item.instanceId === id,
    }));
    set({
      selectedEquipmentInstanceId: id,
      placedEquipment: updated,
    });
  },

  setCameraPreset: (preset) => set({ cameraPreset: preset }),

  toggleLamp: () => {
    set((state) => ({ isLampOn: !state.isLampOn }));
    playLabSound('click');
  },

  toggleHeat: () => {
    set((state) => ({
      isHeatOn: !state.isHeatOn,
      flameTemperature: state.isHeatOn ? 22 : 860,
    }));
    playLabSound('heat');
  },

  updateEquipmentPosition: (instanceId, position) => {
    const { placedEquipment, tareOffset, isTared } = get();
    const balancePos = getBalancePosition(placedEquipment);

    // Check if close to balance pan
    const dx = Math.abs(position[0] - balancePos[0]);
    const dz = Math.abs(position[2] - balancePos[2]);
    const isOverBalance = dx < 0.22 && dz < 0.22;

    const updated = placedEquipment.map((item) => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          position: isOverBalance && item.typeId !== 'digital-balance'
            ? [balancePos[0], balancePos[1] + 0.12, balancePos[2]] as [number, number, number]
            : position,
          placedOnBalance: isOverBalance && item.typeId !== 'digital-balance',
        };
      }
      return item;
    });

    // 4D dynamic time: simulate brief balance fluctuation then stabilization
    set({
      placedEquipment: updated,
      isBalanceStable: false,
    });

    setTimeout(() => {
      const freshReading = MeasurementSystem.computeBalanceReading(updated, tareOffset, isTared, balancePos);
      set({
        activeMeasurement: freshReading,
        isBalanceStable: true,
      });
    }, 400);
  },

  moveEquipmentDuringDrag: (instanceId, position) => {
    const { placedEquipment } = get();
    const balancePos = getBalancePosition(placedEquipment);
    const dx = Math.abs(position[0] - balancePos[0]);
    const dz = Math.abs(position[2] - balancePos[2]);
    const isOverBalance = dx < 0.22 && dz < 0.22;
    const updated = placedEquipment.map((item) => item.instanceId === instanceId
      ? {
          ...item,
          position: isOverBalance && item.typeId !== 'digital-balance'
            ? [balancePos[0], balancePos[1] + 0.12, balancePos[2]] as [number, number, number]
            : position,
          placedOnBalance: isOverBalance && item.typeId !== 'digital-balance',
        }
      : item
    );
    set({ placedEquipment: updated, isBalanceStable: false });
  },

  nudgeEquipment: (instanceId, dx, dz) => {
    const item = get().placedEquipment.find((equipment) => equipment.instanceId === instanceId);
    if (!item) return;
    const nextPosition: [number, number, number] = [
      Math.max(-1.5, Math.min(1.5, item.position[0] + dx)),
      0.86,
      Math.max(-0.65, Math.min(0.65, item.position[2] + dz)),
    ];
    get().updateEquipmentPosition(instanceId, nextPosition);
  },

  updateEquipmentRotation: (instanceId, rotation) => {
    const updated = get().placedEquipment.map((item) => {
      if (item.instanceId === instanceId) {
        return { ...item, rotation };
      }
      return item;
    });
    set({ placedEquipment: updated });
  },

  placeOnBalancePan: (instanceId) => {
    const { placedEquipment, tareOffset, isTared } = get();
    const balance = placedEquipment.find((e) => e.typeId === 'digital-balance');
    if (!balance) return;

    const [bx, by, bz] = balance.position;
    const updated = placedEquipment.map((item) => {
      if (item.instanceId === instanceId && item.typeId !== 'digital-balance') {
        return {
          ...item,
          position: [bx, by + 0.12, bz] as [number, number, number],
          placedOnBalance: true,
        };
      }
      return item;
    });

    set({ placedEquipment: updated, isBalanceStable: false });

    setTimeout(() => {
      const reading = MeasurementSystem.computeBalanceReading(updated, tareOffset, isTared, balance.position);
      set({ activeMeasurement: reading, isBalanceStable: true });
    }, 450);
  },

  removeFromBalancePan: (instanceId) => {
    const { placedEquipment, tareOffset, isTared } = get();
    const balance = placedEquipment.find((e) => e.typeId === 'digital-balance');

    const updated = placedEquipment.map((item) => {
      if (item.instanceId === instanceId) {
        return {
          ...item,
          position: [0.0, 0.86, 0.2] as [number, number, number],
          placedOnBalance: false,
        };
      }
      return item;
    });

    set({ placedEquipment: updated, isBalanceStable: false });

    setTimeout(() => {
      const reading = MeasurementSystem.computeBalanceReading(
        updated,
        tareOffset,
        isTared,
        getBalancePosition(updated)
      );
      set({ activeMeasurement: reading, isBalanceStable: true });
    }, 350);
  },

  tareBalance: () => {
    const { placedEquipment, activeMeasurement } = get();
    const newTareOffset = activeMeasurement.rawMass;
    
    set({ isBalanceStable: false });

    setTimeout(() => {
      const reading = MeasurementSystem.computeBalanceReading(
        placedEquipment,
        newTareOffset,
        true,
        getBalancePosition(placedEquipment)
      );
      set({
        tareOffset: newTareOffset,
        isTared: true,
        activeMeasurement: reading,
        isBalanceStable: true,
      });
    }, 300);
  },

  zeroBalance: () => {
    const { placedEquipment } = get();
    const reading = MeasurementSystem.computeBalanceReading(
      placedEquipment,
      0,
      false,
      getBalancePosition(placedEquipment)
    );
    set({
      tareOffset: 0,
      isTared: false,
      activeMeasurement: reading,
      isBalanceStable: true,
    });
  },

  dispenseLiquid: (targetInstanceId, volumeMl) => {
    const { placedEquipment, selectedMaterialId, tareOffset, isTared } = get();
    const reagent = placedEquipment.find((e) => e.typeId === 'reagent-bottle');
    const target = placedEquipment.find((e) => e.instanceId === targetInstanceId);

    if (!target) return;
    playLabSound('pour');

    // Trigger pouring animation state
    set({
      isPouring: true,
      pouringSourceId: reagent ? reagent.instanceId : 'reagent-1',
      pouringTargetId: targetInstanceId,
      pouringProgress: 0,
      isBalanceStable: false,
    });

    const targetCapacity = EQUIPMENT_REGISTRY[target.typeId]?.capacity || 250;
    const finalVolume = Math.min(targetCapacity, target.currentVolume + volumeMl);

    // Animate progress smoothly
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.15;
      if (progress >= 1.0) {
        clearInterval(interval);
        
        const updated = get().placedEquipment.map((item) => {
          if (item.instanceId === targetInstanceId) {
            return {
              ...item,
              currentVolume: finalVolume,
              currentMaterialId: selectedMaterialId,
            };
          }
          return item;
        });

        const reading = MeasurementSystem.computeBalanceReading(
          updated,
          tareOffset,
          isTared,
          getBalancePosition(updated)
        );

        set({
          placedEquipment: updated,
          isPouring: false,
          pouringSourceId: null,
          pouringTargetId: null,
          pouringProgress: 1.0,
          activeMeasurement: reading,
          isBalanceStable: true,
        });
      } else {
        set({ pouringProgress: progress });
      }
    }, 80);
  },

  addWaterVolume: (targetInstanceId, volumeMl) => {
    if (volumeMl >= 0) {
      get().dispenseLiquid(targetInstanceId, volumeMl);
      return;
    }

    const { placedEquipment, tareOffset, isTared } = get();
    const updated = placedEquipment.map((item) => {
      if (item.instanceId !== targetInstanceId) return item;
      const nextVolume = Math.max(0, item.currentVolume + volumeMl);
      return {
        ...item,
        currentVolume: nextVolume,
        currentMaterialId: nextVolume > 0 ? item.currentMaterialId : null,
      };
    });
    const reading = MeasurementSystem.computeBalanceReading(
      updated,
      tareOffset,
      isTared,
      getBalancePosition(updated)
    );
    set({ placedEquipment: updated, activeMeasurement: reading });
    playLabSound('pour');
  },

  transferLiquid: (sourceInstanceId, targetInstanceId, volumeMl) => {
    const { placedEquipment, tareOffset, isTared } = get();
    const source = placedEquipment.find((e) => e.instanceId === sourceInstanceId);
    const target = placedEquipment.find((e) => e.instanceId === targetInstanceId);

    if (!source || !target || source.currentVolume <= 0) return;
    playLabSound('pour');

    const actualTransfer = Math.min(volumeMl, source.currentVolume);
    const targetCapacity = EQUIPMENT_REGISTRY[target.typeId]?.capacity || 100;
    const finalTargetVolume = Math.min(targetCapacity, target.currentVolume + actualTransfer);
    const finalSourceVolume = Math.max(0, source.currentVolume - actualTransfer);

    set({
      isPouring: true,
      pouringSourceId: sourceInstanceId,
      pouringTargetId: targetInstanceId,
      pouringProgress: 0,
      isBalanceStable: false,
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.15;
      if (progress >= 1.0) {
        clearInterval(interval);

        const updated = get().placedEquipment.map((item) => {
          if (item.instanceId === sourceInstanceId) {
            return {
              ...item,
              currentVolume: finalSourceVolume,
              currentMaterialId: finalSourceVolume > 0 ? item.currentMaterialId : null,
            };
          }
          if (item.instanceId === targetInstanceId) {
            return {
              ...item,
              currentVolume: finalTargetVolume,
              currentMaterialId: source.currentMaterialId || get().selectedMaterialId,
            };
          }
          return item;
        });

        const reading = MeasurementSystem.computeBalanceReading(
          updated,
          tareOffset,
          isTared,
          getBalancePosition(updated)
        );

        set({
          placedEquipment: updated,
          isPouring: false,
          pouringSourceId: null,
          pouringTargetId: null,
          pouringProgress: 1.0,
          activeMeasurement: reading,
          isBalanceStable: true,
        });
      } else {
        set({ pouringProgress: progress });
      }
    }, 80);
  },

  emptyContainer: (instanceId) => {
    const { placedEquipment, tareOffset, isTared } = get();

    const updated = placedEquipment.map((item) => {
      if (item.instanceId === instanceId && item.typeId !== 'reagent-bottle') {
        return {
          ...item,
          currentVolume: 0,
          currentMaterialId: null,
        };
      }
      return item;
    });

    const reading = MeasurementSystem.computeBalanceReading(
      updated,
      tareOffset,
      isTared,
      getBalancePosition(updated)
    );

    set({
      placedEquipment: updated,
      activeMeasurement: reading,
    });
  },

  validateSetup: () => {
    const exp = getExperimentById(get().selectedExperimentId);
    const result = ValidationSystem.validate(exp, get().placedEquipment, get().selectedMaterialId);
    set({ validationStatus: result });
    return result;
  },

  startSimulation: () => {
    playLabSound('complete');
    set({
      flowStage: 'simulation',
      isSimulating: true,
      cameraPreset: 'experiment',
    });
  },

  pauseSimulation: () => set({ isSimulating: false }),

  resetSimulation: () => {
    const exp = getExperimentById(get().selectedExperimentId);
    const firstMaterial = exp.requiredMaterials[0] || 'water';

    const resetEquipment = DEFAULT_EQUIPMENT_SETUP.map((item) => {
      if (item.typeId === 'reagent-bottle') {
        return {
          ...item,
          currentMaterialId: firstMaterial,
          currentVolume: 450,
        };
      }
      return {
        ...item,
        currentVolume: 0,
        currentMaterialId: null,
        placedOnBalance: false,
      };
    });

    const reading = MeasurementSystem.computeBalanceReading(resetEquipment, 0, false);

    set({
      placedEquipment: resetEquipment,
      tareOffset: 0,
      isTared: false,
      isBalanceStable: true,
      activeMeasurement: reading,
      currentStepIndex: 0,
      cameraPreset: 'experiment',
      isPouring: false,
      isLampOn: true,
      isHeatOn: false,
      roomTemperature: 22,
      flameTemperature: 22,
      validationStatus: null,
    });
  },

  advanceStep: () => {
    const exp = getExperimentById(get().selectedExperimentId);
    const nextIdx = Math.min(exp.steps.length - 1, get().currentStepIndex + 1);
    set({ currentStepIndex: nextIdx });
  },

  setStepIndex: (idx) => set({ currentStepIndex: idx }),

  addObservationRecord: (record) => {
    const newRecord: ObservationRecord = {
      ...record,
      id: `obs-${Date.now()}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      recordedObservations: [newRecord, ...state.recordedObservations],
    }));
  },

  removeObservationRecord: (id) => {
    set((state) => ({
      recordedObservations: state.recordedObservations.filter((item) => item.id !== id),
    }));
  },
}));
