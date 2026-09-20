import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { ZONES, SAFE_CENTRES, MAP_CENTER, MAP_ZOOM } from '../data/zones.js';
import { RISK_COLOR } from '../utils/riskEngine.js';

const ROAD_COLOR = { DANGEROUS: '#D14343', MEDIUM: '#D9821F', SAFE: '#3B9E63' };

function emojiIcon(emoji, size = 28) {
  return L.divIcon({
    html: `<div style="font-size:${size}px; line-height:1; transform: translate(-50%,-100%);">${emoji}</div>`,
    className: 'emoji-marker',
    iconSize: [0, 0]
  });
}

export default function MapView({ fireZoneId, result }) {
  const fireIcon = useMemo(() => emojiIcon('🔥', 30), []);
  const safeIcon = useMemo(() => emojiIcon('🏫', 24), []);

  const affectedZoneId = result?.affectedZone?.id ?? null;
  const recommendedRoadId = result?.routeEval?.recommendedRoad?.id ?? null;
  const roadStatusById = useMemo(() => {
    if (!result?.routeEval) return {};
    return Object.fromEntries(result.routeEval.roads.map((r) => [r.id, r.status]));
  }, [result]);

  return (
    <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.values(ZONES).map((zone) => {
        const isFire = zone.id === fireZoneId;
        const isAffected = zone.id === affectedZoneId;
        let color = '#3B9E63';
        if (isFire) color = '#7A1F1F';
        else if (isAffected) color = RISK_COLOR[result.risk.level];

        return (
          <Polygon
            key={zone.id}
            positions={zone.polygon}
            pathOptions={{ color, fillColor: color, fillOpacity: isFire || isAffected ? 0.35 : 0.15, weight: isFire || isAffected ? 2 : 1 }}
          >
            <Tooltip sticky>{zone.name}</Tooltip>
            <Popup>
              <strong>{zone.name}</strong><br />
              {zone.population}<br />
              {zone.description}
            </Popup>
          </Polygon>
        );
      })}

      {affectedZoneId && ZONES[affectedZoneId].roads.map((road) => {
        const status = roadStatusById[road.id];
        const isRecommended = road.id === recommendedRoadId;
        const zoneCenter = ZONES[affectedZoneId].center;
        const roadEnd = roadEndpoint(zoneCenter, road.direction);
        return (
          <Polyline
            key={road.id}
            positions={[zoneCenter, roadEnd]}
            pathOptions={{
              color: ROAD_COLOR[status] ?? '#888',
              weight: isRecommended ? 6 : 3,
              dashArray: status === 'DANGEROUS' ? '6 6' : undefined,
              opacity: isRecommended ? 1 : 0.7
            }}
          >
            <Tooltip>{road.name} — {status}</Tooltip>
          </Polyline>
        );
      })}

      <Marker position={ZONES[fireZoneId].center} icon={fireIcon}>
        <Popup>Fire location: {ZONES[fireZoneId].name}</Popup>
      </Marker>

      {result?.routeEval?.safeCentre && (
        <Marker position={result.routeEval.safeCentre.position} icon={safeIcon}>
          <Popup>Recommended safe centre: {result.routeEval.safeCentre.name}</Popup>
        </Marker>
      )}

      {!result && Object.values(SAFE_CENTRES).map((sc) => (
        <Marker key={sc.id} position={sc.position} icon={safeIcon}>
          <Popup>{sc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// Draws a short line out of the zone center in the road's compass direction,
// purely so the map has something visual to show for each road.
function roadEndpoint(center, direction) {
  const delta = 0.02;
  const [lat, lng] = center;
  switch (direction) {
    case 'N': return [lat + delta, lng];
    case 'S': return [lat - delta, lng];
    case 'E': return [lat, lng + delta];
    case 'W': return [lat, lng - delta];
    default: return center;
  }
}
