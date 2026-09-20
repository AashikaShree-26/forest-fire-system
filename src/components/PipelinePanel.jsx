import React from 'react';
import { RISK_ICON, RISK_COLOR } from '../utils/riskEngine.js';
import { ZONES } from '../data/zones.js';

function Step({ number, label, children }) {
  return (
    <div className="pipeline-step">
      <div className="pipeline-step-number">{number}</div>
      <div className="pipeline-step-body">
        <div className="pipeline-step-label">{label}</div>
        {children}
      </div>
    </div>
  );
}

export default function PipelinePanel({ result }) {
  if (!result) {
    return (
      <div className="card">
        <h2 className="card-title">Pipeline</h2>
        <p className="card-subtitle">Set your sensor values and click "Simulate fire risk" to run the full pipeline: risk → movement → affected zone → route → safe centre → evacuation window.</p>
      </div>
    );
  }

  const { risk, movement, affectedZone, routeEval, evac } = result;

  return (
    <div className="card">
      <h2 className="card-title">Pipeline</h2>

      <Step number={1} label="Fire risk">
        <span className="risk-badge" style={{ background: RISK_COLOR[risk.level] + '22', color: RISK_COLOR[risk.level] }}>
          {RISK_ICON[risk.level]} {risk.level} ({risk.score}/100)
        </span>
        <p className="pipeline-note">{risk.explanation}</p>
      </Step>

      <Step number={2} label="Estimated fire movement">
        <p className="pipeline-note">{movement.note} <em>(estimated direction, not an exact fire-spread model)</em></p>
      </Step>

      <Step number={3} label="Affected zone">
        {affectedZone ? (
          <p className="pipeline-note"><strong>{affectedZone.name}</strong> — {affectedZone.population}</p>
        ) : (
          <p className="pipeline-note">No populated zone is currently in the fire's estimated path.</p>
        )}
      </Step>

      {affectedZone && (
        <>
          <Step number={4} label="Route options">
            <table className="route-table">
              <thead>
                <tr><th>Road</th><th>Status</th></tr>
              </thead>
              <tbody>
                {routeEval.roads.map((r) => (
                  <tr key={r.id} className={r.id === routeEval.recommendedRoad?.id ? 'route-recommended' : ''}>
                    <td>{r.name}</td>
                    <td>{r.statusIcon} {r.status.charAt(0) + r.status.slice(1).toLowerCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Step>

          <Step number={5} label="Safe centre">
            <p className="pipeline-note">
              {routeEval.safeCentre
                ? <><strong>{routeEval.safeCentre.name}</strong> — capacity {routeEval.safeCentre.capacity}</>
                : 'No direct safe centre on the recommended road — follow it to the next junction for further instructions.'}
            </p>
          </Step>

          <Step number={6} label="Evacuation window (estimate)">
            <p className="pipeline-note">
              Estimated fire arrival: ~{evac.fireArrivalMin} min · Travel time: ~{evac.travelMin} min
            </p>
            <p className={evac.isCritical ? 'evac-window evac-window-critical' : 'evac-window'}>
              Estimated safe evacuation window: ~{Math.max(evac.safeWindowMin, 0)} minutes
            </p>
          </Step>
        </>
      )}
    </div>
  );
}
