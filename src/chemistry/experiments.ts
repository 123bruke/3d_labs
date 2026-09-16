import { ExperimentDef, ExperimentId } from '../types';

export const EXPERIMENTS_REGISTRY: Record<ExperimentId, ExperimentDef> = {
  'mass-volume': {
    id: 'mass-volume',
    title: 'Mass and Volume Measurement',
    category: 'Measurement Fundamentals',
    difficulty: 'Beginner',
    duration: '5–10 minutes',
    shortDesc: 'Master scientific measurement of solid tare mass, liquid volume, meniscus reading, and observational uncertainty.',
    objectives: [
      'Learn how to operate an analytical digital balance and perform a tare reset to subtract container mass.',
      'Accurately read liquid volume at eye-level using the bottom of the concave meniscus in a graduated cylinder.',
      'Correlate the physical volume of pure water directly with its resulting measured mass in grams.',
      'Quantify observational uncertainty and prepare foundational skills for density derivation.'
    ],
    scientificPrinciples: [
      'Tare Principle: Resetting the balance indicator to 0.00 g with a vessel on the pan isolates the net mass of added contents: m_net = m_total - m_vessel.',
      'Meniscus Parallax: Water forms a concave meniscus against borosilicate glass due to adhesive forces exceeding cohesive forces. Readings must always be taken at the nadir (lowest point) of the curve.',
      'Volumetric Calibration: 1.00 mL of pure water at room temperature (20°C) possesses a standard physical mass of approximately 1.000 g.'
    ],
    formula: 'm_{net} = m_{total} - m_{vessel}',
    formulaExplainer: 'Net mass equals total measured mass minus the tare mass of the empty container.',
    requiredEquipment: ['digital-balance', 'measuring-cylinder', 'beaker', 'reagent-bottle'],
    requiredMaterials: ['water'],
    steps: [
      {
        id: 1,
        title: 'Workstation Setup',
        instruction: 'Inspect and position the digital balance, 100 mL graduated cylinder, and 250 mL beaker onto the workbench.',
        targetEquipment: 'digital-balance',
        completed: false,
        hint: 'Use the Generate Experiment button once equipment is positioned to validate the setup.'
      },
      {
        id: 2,
        title: 'Tare Container Mass',
        instruction: 'Place the empty 250 mL beaker on the digital balance pan and press "Tare" to zero the display (0.00 g).',
        targetEquipment: 'beaker',
        completed: false,
        hint: 'Click or drag the beaker onto the balance pan, then press Tare.'
      },
      {
        id: 3,
        title: 'Dispense Water into Beaker',
        instruction: 'Add 60 mL of purified water from the reagent dispenser into the tared beaker.',
        targetEquipment: 'beaker',
        completed: false,
        hint: 'Use the Dispense Liquid action to pour water and observe the mass increase on the balance.'
      },
      {
        id: 4,
        title: 'Transfer to Graduated Cylinder',
        instruction: 'Transfer the water from the beaker into the 100 mL graduated cylinder to measure its volumetric reading.',
        targetEquipment: 'measuring-cylinder',
        completed: false,
        hint: 'Click "Transfer Liquid" from the Beaker to the Graduated Cylinder and inspect the meniscus.'
      },
      {
        id: 5,
        title: 'Record Measurement & Complete',
        instruction: 'Compare the cylinder volume reading with the balance mass readout and log the experimental data.',
        completed: false,
        hint: 'Open the Measurement Log to record your trial and conclude the experiment.'
      }
    ]
  },
  'density-liquids': {
    id: 'density-liquids',
    title: 'Density of Liquids',
    category: 'Physical Properties & Characterization',
    difficulty: 'Beginner',
    duration: '5–10 minutes',
    shortDesc: 'Determine the characteristic density of different liquids (water, ethanol, glycerol, mineral oil) using physical mass-to-volume ratio.',
    objectives: [
      'Investigate the physical relationship between measured mass (m) and measured volume (V) across diverse chemical liquids.',
      'Calculate liquid density dynamically via the scientific formula ρ = m / V.',
      'Compare experimental density values with accepted CRC Handbook literature benchmarks and calculate percentage error.',
      'Understand how molecular cohesion, viscosity, and composition determine liquid density differences.'
    ],
    scientificPrinciples: [
      'Density Definition: Density (ρ) is an intensive physical property defined as mass per unit volume: ρ = m / V, expressed in g/mL or g/cm³.',
      'Temperature Dependence: Liquid volume expands with thermal energy; standard density measurements are calibrated at 20.0°C (293.15 K).',
      'Comparative Densities: Pure water has a density of 1.000 g/mL, ethanol is lighter (~0.789 g/mL), mineral oil floats (~0.845 g/mL), whereas glycerol is dense and sinks (~1.261 g/mL).'
    ],
    formula: 'ρ = \\frac{m}{V}',
    formulaExplainer: 'Density (ρ) = Mass (m in grams) divided by Volume (V in milliliters). Units: g/mL.',
    requiredEquipment: ['digital-balance', 'measuring-cylinder', 'beaker', 'reagent-bottle'],
    requiredMaterials: ['water', 'ethanol', 'glycerol', 'mineral-oil'],
    steps: [
      {
        id: 1,
        title: 'Select Liquid Reagent',
        instruction: 'Choose a chemical liquid to test from the reagent dispenser (Water, Ethanol, Glycerol, or Mineral Oil).',
        completed: false,
        hint: 'Select your liquid of interest in the Materials drawer or the Reagent bottle.'
      },
      {
        id: 2,
        title: 'Dispense Target Volume',
        instruction: 'Dispense a known volume (e.g., 50 mL or 80 mL) into the graduated cylinder or beaker.',
        targetEquipment: 'beaker',
        completed: false,
        hint: 'Pour liquid from the dispenser into the beaker or directly into the cylinder.'
      },
      {
        id: 3,
        title: 'Measure Liquid Mass on Balance',
        instruction: 'Place the liquid-filled container on the balance (with vessel tare subtracted) to determine net mass.',
        targetEquipment: 'digital-balance',
        completed: false,
        hint: 'Record the exact mass displayed on the stabilized digital balance.'
      },
      {
        id: 4,
        title: 'Verify Meniscus Volume',
        instruction: 'Inspect the graduated cylinder at eye-level to read the exact volume in milliliters (mL).',
        targetEquipment: 'measuring-cylinder',
        completed: false,
        hint: 'Switch camera to "Close-up Cylinder" to view the meniscus graduation lines.'
      },
      {
        id: 5,
        title: 'Calculate Density & Record',
        instruction: 'Compute ρ = Mass / Volume in the calculation panel and compare against theoretical literature values.',
        completed: false,
        hint: 'Submit the dynamic density calculation to log your trial in the lab notebook.'
      }
    ]
  }
};

export const getExperimentById = (id: ExperimentId): ExperimentDef => {
  return EXPERIMENTS_REGISTRY[id] || EXPERIMENTS_REGISTRY['mass-volume'];
};
