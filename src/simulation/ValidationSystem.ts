import { PlacedEquipment, ExperimentDef, ValidationResult } from '../types';

export class ValidationSystem {
  static validate(
    experiment: ExperimentDef,
    placedEquipment: PlacedEquipment[],
    selectedMaterialId: string | null
  ): ValidationResult {
    const presentTypes = new Set(placedEquipment.map((e) => e.typeId));
    const missingEquipment: string[] = [];
    const missingMaterials: string[] = [];
    const positionErrors: string[] = [];

    // Check required equipment
    for (const reqType of experiment.requiredEquipment) {
      if (!presentTypes.has(reqType)) {
        missingEquipment.push(reqType);
      }
    }

    // Check positions on table (Workbench bounds: X: -1.6 to 1.6, Z: -0.8 to 0.8, Y around 0.86)
    for (const item of placedEquipment) {
      const [x, y, z] = item.position;
      if (Math.abs(x) > 1.8 || Math.abs(z) > 1.0 || y < 0.7) {
        positionErrors.push(`${item.name} is positioned off the laboratory workbench.`);
      }
    }

    // Check required materials
    if (!selectedMaterialId) {
      missingMaterials.push('Please select an active reagent liquid for the experiment.');
    }

    const isValid = missingEquipment.length === 0 && positionErrors.length === 0 && missingMaterials.length === 0;

    let message = '✓ Laboratory setup verified and structurally valid.';
    if (!isValid) {
      if (missingEquipment.length > 0) {
        message = `⚠ Setup incomplete: Missing required equipment (${missingEquipment.join(', ')}).`;
      } else if (positionErrors.length > 0) {
        message = `⚠ Setup warning: ${positionErrors[0]}`;
      } else if (missingMaterials.length > 0) {
        message = `⚠ Material missing: ${missingMaterials[0]}`;
      }
    }

    return {
      isValid,
      missingEquipment,
      missingMaterials,
      positionErrors,
      message,
    };
  }
}
