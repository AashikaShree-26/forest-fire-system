import React from 'react';
import { ZONES } from '../data/zones.js';

const DIRECTIONS = [
  { value: 'N', label: 'North' },
  { value: 'E', label: 'East' },
  { value: 'S', label: 'South' },
  { value: 'W', label: 'West' }
];

export default function SensorPanel({ sensors, onChange, fireZoneId, onFireZoneChange, onUpdateData, onSimulate, onReset }) {
  const set = (field) => (e) => {
    const value = e.target.type === 'range' || e.target.type === 'number'
      ? Number(e.target.value)
      : e.target.value;
    onChange({ ...sensors, [field]: value });
  };

  return (
    <div className="card">
      <h2 className="card-title">Simulated sensor data</h2>
      <p className="card-subtitle">No hardware connected — values below stand in for ESP32 + sensor readings (see README for how to wire in real sensors later).</p>

      <div className="field">
        <label>Temperature <span className="field-value">{sensors.temperature}°C</span></label>
        <input type="range" min="15" max="48" value={sensors.temperature} onChange={set('temperature')} />
      </div>

      <div className="field">
        <label>Humidity <span className="field-value">{sensors.humidity}%</span></label>
        <input type="range" min="5" max="90" value={sensors.humidity} onChange={set('humidity')} />
      </div>

      <div className="field">
        <label>Soil moisture <span className="field-value">{sensors.soilMoisture}%</span></label>
        <input type="range" min="3" max="80" value={sensors.soilMoisture} onChange={set('soilMoisture')} />
      </div>

      <div className="field">
        <label>Wind speed <span className="field-value">{sensors.windSpeed} km/h</span></label>
        <input type="range" min="0" max="45" value={sensors.windSpeed} onChange={set('windSpeed')} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Wind direction</label>
          <select value={sensors.windDirection} onChange={set('windDirection')}>
            {DIRECTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Fire location</label>
          <select value={fireZoneId} onChange={(e) => onFireZoneChange(e.target.value)}>
            {Object.values(ZONES).map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onUpdateData}>Update data</button>
        <button className="btn btn-primary" onClick={onSimulate}>Simulate fire risk</button>
        <button className="btn btn-ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
