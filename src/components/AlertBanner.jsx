import React from 'react';
import { RISK_ICON } from '../utils/riskEngine.js';

export default function AlertBanner({ result }) {
  if (!result || !result.affectedZone) return null;

  const { risk, movement, affectedZone, routeEval, evac } = result;
  const dangerousRoads = routeEval.roads.filter((r) => r.status === 'DANGEROUS');

  return (
    <div className="alert-banner">
      <div className="alert-header">
        <span className="alert-siren">🚨</span>
        <span>{affectedZone.name.toUpperCase()} ALERT</span>
      </div>
      <div className="alert-grid">
        <div>{RISK_ICON[risk.level]} Fire risk: <strong>{risk.level}</strong></div>
        <div>🔥 Expected movement: <strong>{movement.directionLabel.toUpperCase()}</strong></div>
        {dangerousRoads.length > 0 && (
          <div>❌ Avoid: <strong>{dangerousRoads.map((r) => r.name).join(', ')}</strong></div>
        )}
        <div>➡️ Recommended route: <strong>{routeEval.recommendedRoad?.name ?? 'None available'}</strong></div>
        {routeEval.safeCentre && (
          <div>🏫 Safe centre: <strong>{routeEval.safeCentre.name}</strong></div>
        )}
        <div>⏱️ Estimated safe window: <strong>~{Math.max(evac.safeWindowMin, 0)} minutes</strong></div>
      </div>
    </div>
  );
}
