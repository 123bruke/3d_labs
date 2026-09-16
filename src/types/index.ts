export type ExperimentId = 'mass-volume' | 'density-liquids';

export type FlowStage = 
  | 'intro'
  | 'selector'
  | 'briefing'
  | 'lab_builder'
  | 'simulation'
  | 'results';

export type CameraPreset = 
  | 'free'
  | 'experiment'
  | 'closeup_balance'
  | 'closeup_cylinder'
  | 'overview';

export type MaterialId = 'water' | 'ethanol' | 'glycerol' | 'mineral-oil';

export interface MaterialItem {
  id: MaterialId;
  name: string;
  formula: string;
  state: 'liquid' | 'solid' | 'gas';
  density: number; // g/mL at 20°C
  viscosity: number; // mPa·s
  color: string; // hex or rgb
  tintColor: string; // Three.js color
  roughness: number;
  transmission: number;
  refractiveIndex: number;
  description: string;
  hazardNote: string;
}

export type EquipmentTypeId = 
  | 'digital-balance'
  | 'measuring-cylinder'
  | 'beaker'
  | 'reagent-bottle';

export interface EquipmentItem {
  id: EquipmentTypeId;
  name: string;
  category: 'measurement' | 'glassware' | 'dispenser';
  emptyMass: number; // in grams
  capacity: number; // in mL
  measurements: ('mass' | 'volume')[];
  unit: string;
  description: string;
  material: string;
  functionDesc: string;
  defaultPosition: [number, number, number];
}

export interface PlacedEquipment {
  instanceId: string;
  typeId: EquipmentTypeId;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  currentVolume: number; // mL
  currentMaterialId: MaterialId | null;
  placedOnBalance: boolean;
  selected: boolean;
}

export interface ExperimentStep {
  id: number;
  title: string;
  instruction: string;
  targetEquipment?: EquipmentTypeId;
  completed: boolean;
  hint?: string;
}

export interface ExperimentDef {
  id: ExperimentId;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  shortDesc: string;
  objectives: string[];
  scientificPrinciples: string[];
  formula?: string;
  formulaExplainer?: string;
  requiredEquipment: EquipmentTypeId[];
  requiredMaterials: MaterialId[];
  steps: ExperimentStep[];
}

export interface MeasurementReading {
  rawMass: number; // g
  taredMass: number; // g
  isTared: boolean;
  isStable: boolean;
  liquidVolume: number; // mL
  observedLiquid: MaterialId | null;
}

export interface ObservationRecord {
  id: string;
  timestamp: number;
  experimentId: ExperimentId;
  materialName: string;
  massMeasured: number; // g
  volumeMeasured: number; // mL
  calculatedDensity: number; // g/mL
  theoreticalDensity: number; // g/mL
  errorPercentage: number; // %
  notes: string;
}

export interface ValidationResult {
  isValid: boolean;
  missingEquipment: string[];
  missingMaterials: string[];
  positionErrors: string[];
  message: string;
}
