import { MaterialId, MaterialItem } from '../types';

export const MATERIALS_REGISTRY: Record<MaterialId, MaterialItem> = {
  water: {
    id: 'water',
    name: 'Purified Water (H₂O)',
    formula: 'H₂O',
    state: 'liquid',
    density: 1.000, // g/mL at 20°C
    viscosity: 1.002,
    color: '#38bdf8',
    tintColor: '#a5f3fc',
    roughness: 0.05,
    transmission: 0.94,
    refractiveIndex: 1.333,
    description: 'Standard solvent and reference substance for physical density calibration at room temperature.',
    hazardNote: 'Non-hazardous pure aqueous solvent.',
  },
  ethanol: {
    id: 'ethanol',
    name: 'Ethanol (96% ACS)',
    formula: 'C₂H₅OH',
    state: 'liquid',
    density: 0.789, // g/mL at 20°C
    viscosity: 1.200,
    color: '#818cf8',
    tintColor: '#c7d2fe',
    roughness: 0.04,
    transmission: 0.96,
    refractiveIndex: 1.361,
    description: 'Volatile organic alcohol of lower density than water, displaying characteristic meniscus curvature.',
    hazardNote: 'Flammable liquid. Avoid open flame and vapor inhalation.',
  },
  glycerol: {
    id: 'glycerol',
    name: 'Glycerol (Anhydrous)',
    formula: 'C₃H₈O₃',
    state: 'liquid',
    density: 1.261, // g/mL at 20°C
    viscosity: 1412.0,
    color: '#fbbf24',
    tintColor: '#fef3c7',
    roughness: 0.08,
    transmission: 0.88,
    refractiveIndex: 1.474,
    description: 'High-density, highly viscous polyol with distinct optical refraction and strong surface tension.',
    hazardNote: 'Non-toxic, hygroscopic viscous fluid.',
  },
  'mineral-oil': {
    id: 'mineral-oil',
    name: 'Light Mineral Oil',
    formula: 'CₙH₂ₙ₊₂',
    state: 'liquid',
    density: 0.845, // g/mL at 20°C
    viscosity: 30.5,
    color: '#facc15',
    tintColor: '#fef08a',
    roughness: 0.06,
    transmission: 0.91,
    refractiveIndex: 1.467,
    description: 'Non-polar hydrocarbon oil immiscible with water, demonstrating lower density and buoyancy.',
    hazardNote: 'Mild irritant; avoid contact with mucous membranes.',
  },
};

export const getMaterialById = (id: MaterialId): MaterialItem => {
  return MATERIALS_REGISTRY[id] || MATERIALS_REGISTRY.water;
};
