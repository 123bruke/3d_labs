import { PlacedEquipment, MaterialItem, MeasurementReading } from '../types';
import { EQUIPMENT_REGISTRY } from '../chemistry/equipment';
import { MATERIALS_REGISTRY } from '../chemistry/materials';

export class MeasurementSystem {
  static computeBalanceReading(
    placedEquipment: PlacedEquipment[],
    tareOffset: number,
    isTared: boolean,
    balancePosition: [number, number, number] = [-0.75, 0.86, 0.05]
  ): MeasurementReading {
    // Check which equipment is placed on the balance pan
    // Balance pan center is roughly balancePosition [x, y + 0.12, z]
    // A vessel is considered on the balance if its X & Z are within 0.22 units of the balance and Y >= 0.86
    const [bx, , bz] = balancePosition;
    const itemOnBalance = placedEquipment.find((item) => {
      const dx = Math.abs(item.position[0] - bx);
      const dz = Math.abs(item.position[2] - bz);
      return item.typeId !== 'digital-balance' && (item.placedOnBalance || (dx < 0.24 && dz < 0.24));
    });

    if (!itemOnBalance) {
      const rawMass = 0.0;
      const taredMass = isTared ? Math.max(0, rawMass - tareOffset) : rawMass;
      return {
        rawMass,
        taredMass: Number(taredMass.toFixed(2)),
        isTared,
        isStable: true,
        liquidVolume: 0,
        observedLiquid: null,
      };
    }

    const eqConfig = EQUIPMENT_REGISTRY[itemOnBalance.typeId];
    const vesselEmptyMass = eqConfig ? eqConfig.emptyMass : 0;
    
    let liquidMass = 0;
    if (itemOnBalance.currentMaterialId && itemOnBalance.currentVolume > 0) {
      const mat = MATERIALS_REGISTRY[itemOnBalance.currentMaterialId];
      if (mat) {
        liquidMass = itemOnBalance.currentVolume * mat.density;
      }
    }

    const totalRawMass = vesselEmptyMass + liquidMass;
    const netMass = isTared ? Math.max(0, totalRawMass - tareOffset) : totalRawMass;

    return {
      rawMass: Number(totalRawMass.toFixed(2)),
      taredMass: Number(netMass.toFixed(2)),
      isTared,
      isStable: true,
      liquidVolume: itemOnBalance.currentVolume,
      observedLiquid: itemOnBalance.currentMaterialId,
    };
  }

  static calculateDensity(mass: number, volume: number): number {
    if (volume <= 0) return 0;
    return Number((mass / volume).toFixed(4));
  }

  static calculateErrorPercentage(experimental: number, theoretical: number): number {
    if (theoretical <= 0) return 0;
    const error = (Math.abs(experimental - theoretical) / theoretical) * 100;
    return Number(error.toFixed(2));
  }
}
