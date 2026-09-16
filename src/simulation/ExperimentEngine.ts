import { useLabStore } from '../store/labStore';
import { ExperimentId, ObservationRecord, ValidationResult } from '../types';
import { getExperimentById } from '../chemistry/experiments';
import { MeasurementSystem } from './MeasurementSystem';
import { MATERIALS_REGISTRY } from '../chemistry/materials';

export class ExperimentEngine {
  private static instance: ExperimentEngine;

  public static getInstance(): ExperimentEngine {
    if (!ExperimentEngine.instance) {
      ExperimentEngine.instance = new ExperimentEngine();
    }
    return ExperimentEngine.instance;
  }

  public initialize(experimentId: ExperimentId): void {
    const store = useLabStore.getState();
    store.selectExperiment(experimentId);
  }

  public validateSetup(): ValidationResult {
    return useLabStore.getState().validateSetup();
  }

  public start(): void {
    useLabStore.getState().startSimulation();
  }

  public pause(): void {
    useLabStore.getState().pauseSimulation();
  }

  public resume(): void {
    useLabStore.getState().startSimulation();
  }

  public reset(): void {
    useLabStore.getState().resetSimulation();
  }

  public calculateDensity(mass: number, volume: number): number {
    return MeasurementSystem.calculateDensity(mass, volume);
  }

  public recordObservation(notes: string = ''): ObservationRecord | null {
    const store = useLabStore.getState();
    const exp = getExperimentById(store.selectedExperimentId);
    const reading = store.activeMeasurement;

    // Use beaker or cylinder volume depending on which holds liquid
    const containerWithLiquid = store.placedEquipment.find(
      (e) => (e.typeId === 'measuring-cylinder' || e.typeId === 'beaker') && e.currentVolume > 0
    );

    const volume = containerWithLiquid ? containerWithLiquid.currentVolume : reading.liquidVolume;
    const mass = reading.taredMass > 0 ? reading.taredMass : (volume > 0 ? volume * (MATERIALS_REGISTRY[store.selectedMaterialId]?.density || 1.0) : 0);

    if (volume <= 0 && mass <= 0) {
      return null;
    }

    const calculatedDensity = MeasurementSystem.calculateDensity(mass, volume);
    const mat = MATERIALS_REGISTRY[store.selectedMaterialId];
    const theoreticalDensity = mat ? mat.density : 1.0;
    const errorPercentage = MeasurementSystem.calculateErrorPercentage(calculatedDensity, theoreticalDensity);

    const newRecord: Omit<ObservationRecord, 'id' | 'timestamp'> = {
      experimentId: store.selectedExperimentId,
      materialName: mat ? mat.name : 'Unknown Liquid',
      massMeasured: mass,
      volumeMeasured: volume,
      calculatedDensity,
      theoreticalDensity,
      errorPercentage,
      notes: notes || `Trial executed with ${mat ? mat.name : 'Sample'} at 20°C standard conditions.`,
    };

    store.addObservationRecord(newRecord);
    return {
      ...newRecord,
      id: `obs-${Date.now()}`,
      timestamp: Date.now(),
    };
  }

  public complete(): void {
    const store = useLabStore.getState();
    store.setFlowStage('results');
  }
}

export const experimentEngine = ExperimentEngine.getInstance();
