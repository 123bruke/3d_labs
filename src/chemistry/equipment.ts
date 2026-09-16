import { EquipmentTypeId, EquipmentItem } from '../types';

export const EQUIPMENT_REGISTRY: Record<EquipmentTypeId, EquipmentItem> = {
  'digital-balance': {
    id: 'digital-balance',
    name: 'Precision Analytical Digital Balance',
    category: 'measurement',
    emptyMass: 1850.0,
    capacity: 600.0, // max capacity in grams
    measurements: ['mass'],
    unit: 'g',
    material: 'Anodized Aluminum & Stainless Steel Pan',
    description: 'High-precision 0.01 g analytical laboratory balance featuring instant tare subtraction and magnetic force restoration sensor.',
    functionDesc: 'Place beakers or cylinders onto the stainless weighing pan to measure absolute or net tared mass.',
    defaultPosition: [-0.75, 0.86, 0.05],
  },
  'measuring-cylinder': {
    id: 'measuring-cylinder',
    name: 'Graduated Measuring Cylinder (100 mL)',
    category: 'glassware',
    emptyMass: 62.40, // g
    capacity: 100.0, // mL
    measurements: ['volume'],
    unit: 'mL',
    material: 'Borosilicate Glass 3.3 Class A',
    description: 'Calibrated cylindrical glass vessel with sub-milliliter precision graduation lines, hexagonal anti-roll base, and pour spout.',
    functionDesc: 'Fill to read liquid volume at the bottom of the curved concave meniscus at eye level.',
    defaultPosition: [0.75, 0.86, 0.05],
  },
  beaker: {
    id: 'beaker',
    name: 'Griffin Low-Form Beaker (250 mL)',
    category: 'glassware',
    emptyMass: 84.50, // g
    capacity: 250.0, // mL
    measurements: ['volume'],
    unit: 'mL',
    material: 'Heat-Resistant Borosilicate Glass',
    description: 'Standard cylindrical laboratory vessel with spout for stirring, mixing, weighing, and liquid transfer.',
    functionDesc: 'Transfer liquid onto the balance or directly into the graduated cylinder.',
    defaultPosition: [0.0, 0.86, 0.2],
  },
  'reagent-bottle': {
    id: 'reagent-bottle',
    name: 'Chemical Reagent Dispenser Bottle (500 mL)',
    category: 'dispenser',
    emptyMass: 145.0, // g
    capacity: 500.0, // mL
    measurements: ['volume'],
    unit: 'mL',
    material: 'Amber/Clear Glass with Polypropylene Dispenser Nozzle',
    description: 'Precision laboratory reagent reservoir containing prepared pure testing liquids for transfer.',
    functionDesc: 'Dispense selected solvent into the beaker or measuring cylinder for observation.',
    defaultPosition: [-0.0, 0.86, -0.45],
  },
};

export const getEquipmentById = (id: EquipmentTypeId): EquipmentItem => {
  return EQUIPMENT_REGISTRY[id];
};
