import { SAFE_CENTRES } from '../data/zones.js';
import { roadStatusAgainstFire } from './movementEngine.js';

const STATUS_PENALTY = { DANGEROUS: 1000, MEDIUM: 40, SAFE: 0 };
const STATUS_ICON = { DANGEROUS: '❌', MEDIUM: '🟠', SAFE: '✅' };

// Scores every road out of the affected zone, then picks the best one.
// Roads that lead straight to a safe centre are preferred; if none of
// those are viable, any road is considered as a fallback.
export function evaluateRoutes(zone, fireMovementDirection, riskLevel) {
  const congestionFactor = riskLevel === 'CRITICAL' ? 1.3 : riskLevel === 'HIGH' ? 1.15 : 1.0;

  const scored = zone.roads.map((road) => {
    const status = roadStatusAgainstFire(road.direction, fireMovementDirection);
    const travelMin = Math.round(road.travelMinBase * congestionFactor);
    const score = road.distanceKm + travelMin + STATUS_PENALTY[status];
    return {
      ...road,
      status,
      statusIcon: STATUS_ICON[status],
      travelMin,
      score
    };
  });

  const toSafeCentre = scored.filter((r) => r.leadsTo?.type === 'safeCentre');
  const pool = toSafeCentre.length > 0 ? toSafeCentre : scored;
  const recommended = [...pool].sort((a, b) => a.score - b.score)[0];

  const safeCentre = recommended?.leadsTo?.type === 'safeCentre'
    ? SAFE_CENTRES[recommended.leadsTo.id]
    : null;

  return { roads: scored, recommendedRoad: recommended, safeCentre };
}
