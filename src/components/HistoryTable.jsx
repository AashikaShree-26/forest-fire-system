import React from 'react';
import { RISK_ICON } from '../utils/riskEngine.js';

export default function HistoryTable({ history }) {
  return (
    <div className="card">
      <h2 className="card-title">Simulation history</h2>
      {history.length === 0 ? (
        <p className="card-subtitle">No simulations run yet.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Risk</th>
              <th>Affected zone</th>
              <th>Recommended route</th>
              <th>Safe window</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{h.time}</td>
                <td>{RISK_ICON[h.risk]} {h.risk}</td>
                <td>{h.affectedZone}</td>
                <td>{h.route}</td>
                <td>{h.safeWindow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
