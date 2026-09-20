import { MOVEMENT_MAP } from '../data/zones.js';

const DIR_LABEL = { N: 'North', E: 'East', S: 'South', W: 'West' };
export const OPPOSITE = { N: 'S', S: 'N', E: 'W', W: 'E' };
const PERPENDICULAR = { N: ['E', 'W'], S: ['E', 'W'], E: ['N', 'S'], W: ['N', 'S'] };

// Estimates which populated zone the fire is likely to threaten next,
// based on the fire's current zone and the wind direction.
// This is a simple heuristic (NOT an exact fire-spread simulation) —
// it is clearly labelled as an estimate in the UI.
export function estimateFireMovement(fireZoneId, windDirection) {
  const target = MOVEMENT_MAP[fireZoneId]?.[windDirection] ?? null;
  return {
    direction: windDirection,
    directionLabel: DIR_LABEL[windDirection],
    affectedZoneId: target,
    note: target
      ? `Wind blowing ${DIR_LABEL[windDirection]} from Zone ${fireZoneId} → estimated movement toward Zone ${target}`
      : `Wind blowing ${DIR_LABEL[windDirection]} from Zone ${fireZoneId} → no populated zone directly downwind; fire likely stays within the forest block`
  };
}

export function roadStatusAgainstFire(roadDirection, fireMovementDirection) {
  if (roadDirection === fireMovementDirection) return 'DANGEROUS';
  if (roadDirection === OPPOSITE[fireMovementDirection]) return 'SAFE';
  if (PERPENDICULAR[fireMovementDirection]?.includes(roadDirection)) return 'MEDIUM';
  return 'MEDIUM';
}
