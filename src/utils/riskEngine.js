// -----------------------------------------------------------------------
// Fire risk engine — RULE BASED (v1).
//
// This function is intentionally isolated from the rest of the app so it
// can be swapped for a call to a Python/ML model later without touching
// any UI code. Just replace the body of calculateFireRisk() with a
// fetch('/api/predict-risk', ...) call that returns the same shape:
//   { level, score, reasons, explanation }
// -----------------------------------------------------------------------

export function calculateFireRisk({ temperature, humidity, soilMoisture, windSpeed }) {
  let score = 0;
  const reasons = [];

  if (temperature >= 38) { score += 25; reasons.push('High temperature'); }
  else if (temperature >= 32) { score += 15; reasons.push('Elevated temperature'); }
  else if (temperature >= 27) { score += 5; }

  if (humidity <= 25) { score += 25; reasons.push('Low humidity'); }
  else if (humidity <= 40) { score += 15; reasons.push('Reduced humidity'); }
  else if (humidity <= 55) { score += 5; }

  if (soilMoisture <= 15) { score += 25; reasons.push('Dry soil'); }
  else if (soilMoisture <= 30) { score += 15; reasons.push('Low soil moisture'); }
  else if (soilMoisture <= 45) { score += 5; }

  if (windSpeed >= 25) { score += 25; reasons.push('Strong wind'); }
  else if (windSpeed >= 15) { score += 15; reasons.push('Moderate wind'); }
  else if (windSpeed >= 8) { score += 5; }

  score = Math.min(score, 100);

  let level = 'LOW';
  if (score >= 70) level = 'CRITICAL';
  else if (score >= 50) level = 'HIGH';
  else if (score >= 25) level = 'MEDIUM';

  const explanation = reasons.length > 0
    ? `${reasons.join(' + ')} → ${level.charAt(0) + level.slice(1).toLowerCase()} fire risk`
    : 'Conditions are within normal range → Low fire risk';

  return { level, score, reasons, explanation };
}

export const RISK_ICON = {
  LOW: '🟢',
  MEDIUM: '🟡',
  HIGH: '🟠',
  CRITICAL: '🔴'
};

export const RISK_COLOR = {
  LOW: '#3B9E63',
  MEDIUM: '#D9B227',
  HIGH: '#D9821F',
  CRITICAL: '#D14343'
};
