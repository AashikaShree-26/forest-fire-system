import React, { useState } from 'react';
import SensorPanel from './components/SensorPanel.jsx';
import PipelinePanel from './components/PipelinePanel.jsx';
import AlertBanner from './components/AlertBanner.jsx';
import MapView from './components/MapView.jsx';
import HistoryTable from './components/HistoryTable.jsx';
import { ZONES } from './data/zones.js';
import { calculateFireRisk } from './utils/riskEngine.js';
import { estimateFireMovement } from './utils/movementEngine.js';
import { evaluateRoutes } from './utils/routeEngine.js';
import { estimateEvacuationTime } from './utils/evacuationEngine.js';

const DEFAULT_SENSORS = {
  temperature: 39,
  humidity: 28,
  soilMoisture: 18,
  windSpeed: 22,
  windDirection: 'E'
};

function randomIn(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

export default function App() {
  const [sensors, setSensors] = useState(DEFAULT_SENSORS);
  const [fireZoneId, setFireZoneId] = useState('B');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleUpdateData = () => {
    setSensors({
      temperature: randomIn(20, 45),
      humidity: randomIn(10, 70),
      soilMoisture: randomIn(8, 60),
      windSpeed: randomIn(2, 40),
      windDirection: ['N', 'E', 'S', 'W'][randomIn(0, 3)]
    });
  };

  const handleReset = () => {
    setSensors(DEFAULT_SENSORS);
    setFireZoneId('B');
    setResult(null);
  };

  const handleSimulate = () => {
    // ---- The full pipeline runs here, step by step ----
    const risk = calculateFireRisk(sensors);
    const movement = estimateFireMovement(fireZoneId, sensors.windDirection);
    const affectedZone = movement.affectedZoneId ? ZONES[movement.affectedZoneId] : null;

    let routeEval = null;
    let evac = null;
    if (affectedZone) {
      routeEval = evaluateRoutes(affectedZone, movement.direction, risk.level);
      evac = estimateEvacuationTime({
        riskScore: risk.score,
        windSpeed: sensors.windSpeed,
        recommendedRoad: routeEval.recommendedRoad
      });
    }

    const newResult = { risk, movement, affectedZone, routeEval, evac };
    setResult(newResult);

    setHistory((prev) => [
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: risk.level,
        affectedZone: affectedZone ? affectedZone.id : 'None',
        route: routeEval?.recommendedRoad?.name ?? 'None',
        safeWindow: evac ? `~${Math.max(evac.safeWindowMin, 0)} min` : '—'
      },
      ...prev
    ]);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Forest fire early warning &amp; evacuation system</h1>
        <p>Environmental data → fire risk → movement → affected zone → safest route → evacuation window → actionable alert</p>
      </header>

      <AlertBanner result={result} />

      <div className="app-grid">
        <div className="map-column">
          <MapView fireZoneId={fireZoneId} result={result} />
        </div>
        <div className="side-column">
          <SensorPanel
            sensors={sensors}
            onChange={setSensors}
            fireZoneId={fireZoneId}
            onFireZoneChange={setFireZoneId}
            onUpdateData={handleUpdateData}
            onSimulate={handleSimulate}
            onReset={handleReset}
          />
          <PipelinePanel result={result} />
        </div>
      </div>

      <HistoryTable history={history} />
    </div>
  );
}
