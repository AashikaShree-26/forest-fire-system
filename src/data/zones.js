// Demonstration data for a forest area (coordinates modelled loosely on the
// Mudumalai forest belt, Tamil Nadu, India). All zones, roads and safe
// centres below are FICTIONAL for this prototype — replace with your real
// study area's coordinates when you move past the demo stage.
//
// Each zone is a small polygon on the map. Each road belongs to a zone and
// has a compass "direction" (N/E/S/W) measured FROM that zone's center.
// The risk engine uses that direction, compared against the estimated fire
// movement direction, to decide whether a road is safe, risky, or dangerous.

export const MAP_CENTER = [11.598, 76.552];
export const MAP_ZOOM = 13;

// Safe centres (schools / community halls / relief centres)
export const SAFE_CENTRES = {
  sc1: { id: 'sc1', name: 'School A', position: [11.604, 76.513], capacity: '250 people' },
  sc2: { id: 'sc2', name: 'Community Hall B', position: [11.560, 76.548], capacity: '400 people' },
  sc3: { id: 'sc3', name: 'Relief Centre C', position: [11.572, 76.578], capacity: '600 people' }
};

// Zones. "population" is descriptive only (used for the side panel).
// "polygon" corners are drawn as a translucent overlay on the map.
export const ZONES = {
  A: {
    id: 'A',
    name: 'Zone A — Ridge Settlement',
    description: 'Small hillside settlement west of the forest block.',
    population: '~180 residents',
    center: [11.605, 76.515],
    polygon: [
      [11.612, 76.505], [11.612, 76.526], [11.598, 76.526], [11.598, 76.505]
    ],
    roads: [
      { id: 'A-E', name: 'East Trail (toward forest core)', direction: 'E', distanceKm: 2.2, travelMinBase: 5, leadsTo: { type: 'zone', id: 'B' } },
      { id: 'A-W', name: 'West Road (to School A)', direction: 'W', distanceKm: 2.8, travelMinBase: 6, leadsTo: { type: 'safeCentre', id: 'sc1' } },
      { id: 'A-S', name: 'South Road (to Community Hall B)', direction: 'S', distanceKm: 6.0, travelMinBase: 11, leadsTo: { type: 'safeCentre', id: 'sc2' } }
    ]
  },
  B: {
    id: 'B',
    name: 'Zone B — Forest Core',
    description: 'Dense, largely uninhabited forest block. Fire typically originates here.',
    population: 'Forest watch post only (~6 staff)',
    center: [11.598, 76.552],
    polygon: [
      [11.610, 76.538], [11.610, 76.566], [11.588, 76.566], [11.588, 76.538]
    ],
    roads: [
      { id: 'B-N', name: 'North Fire Track', direction: 'N', distanceKm: 3.0, travelMinBase: 7, leadsTo: { type: 'zone', id: 'A' } },
      { id: 'B-S', name: 'South Fire Track', direction: 'S', distanceKm: 2.6, travelMinBase: 6, leadsTo: { type: 'zone', id: 'D' } }
    ]
  },
  C: {
    id: 'C',
    name: 'Zone C — Eastern Village',
    description: 'Populated village directly east of the forest core.',
    population: '~950 residents',
    center: [11.598, 76.585],
    polygon: [
      [11.610, 76.572], [11.610, 76.598], [11.588, 76.598], [11.588, 76.572]
    ],
    roads: [
      { id: 'C-E', name: 'East Road', direction: 'E', distanceKm: 4.1, travelMinBase: 8, leadsTo: { type: 'zone', id: null } },
      { id: 'C-N', name: 'North Road (toward forest core)', direction: 'N', distanceKm: 3.4, travelMinBase: 7, leadsTo: { type: 'zone', id: 'B' } },
      { id: 'C-S', name: 'South Road (to Relief Centre C)', direction: 'S', distanceKm: 3.0, travelMinBase: 6, leadsTo: { type: 'safeCentre', id: 'sc3' } }
    ]
  },
  D: {
    id: 'D',
    name: 'Zone D — Southern Town',
    description: 'Populated town directly south of the forest core.',
    population: '~1,400 residents',
    center: [11.560, 76.552],
    polygon: [
      [11.572, 76.538], [11.572, 76.566], [11.550, 76.566], [11.550, 76.538]
    ],
    roads: [
      { id: 'D-S', name: 'South Highway', direction: 'S', distanceKm: 5.2, travelMinBase: 9, leadsTo: { type: 'zone', id: null } },
      { id: 'D-N', name: 'North Road (toward forest core)', direction: 'N', distanceKm: 2.1, travelMinBase: 5, leadsTo: { type: 'zone', id: 'B' } },
      { id: 'D-W', name: 'West Road (to Community Hall B)', direction: 'W', distanceKm: 4.5, travelMinBase: 8, leadsTo: { type: 'safeCentre', id: 'sc2' } }
    ]
  }
};

// Which zone is downwind of "B" (the usual fire-origin zone) for each wind
// direction. Also used generically: for any fire zone, "movementMap[zone][dir]"
// gives the neighbouring populated zone that wind blows the fire toward.
// null means "no populated zone that way — fire stays contained in the forest".
export const MOVEMENT_MAP = {
  A: { N: null, E: 'B', S: null, W: null },
  B: { N: 'A', E: 'C', S: 'D', W: 'A' },
  C: { N: 'B', E: null, S: null, W: 'B' },
  D: { N: 'B', E: null, S: null, W: null }
};
