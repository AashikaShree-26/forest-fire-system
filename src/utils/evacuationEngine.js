// Rough evacuation-window estimate. This is deliberately simple (linear
// heuristic) and clearly labelled as an ESTIMATE in the UI, not a
// guaranteed prediction. Swap this out for a physics-based / ML model later.
export function estimateEvacuationTime({ riskScore, windSpeed, recommendedRoad }) {
  const fireArrivalMin = Math.max(
    5,
    Math.round(70 - riskScore * 0.5 - windSpeed * 0.8)
  );
  const travelMin = recommendedRoad ? recommendedRoad.travelMin : 10;
  const safeWindowMin = fireArrivalMin - travelMin;

  return {
    fireArrivalMin,
    travelMin,
    safeWindowMin,
    isCritical: safeWindowMin < 5
  };
}
