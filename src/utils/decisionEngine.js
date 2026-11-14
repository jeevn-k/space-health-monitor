// NASA HRP Clinical Decision Engine
import { HEALTH_THRESHOLDS } from '../data/mockData.js';

export function getMetricStatus(metric, value) {
  const t = HEALTH_THRESHOLDS[metric];
  if (!t) return 'nominal';
  if (value <= t.criticalMin || value >= t.criticalMax) {
    if (metric === 'radiationDose' || metric === 'boneDensityLoss' || metric === 'sansRisk') {
      if (value >= t.criticalMax) return 'critical';
    } else {
      if (value <= t.criticalMin || value >= t.criticalMax) return 'critical';
    }
  }
  if (value < t.min || value > t.max) {
    if (metric === 'radiationDose' || metric === 'boneDensityLoss' || metric === 'sansRisk') {
      if (value >= t.max) return 'warning';
    } else {
      return 'warning';
    }
  }
  return 'nominal';
}

const GUIDANCE = {
  heartRate: {
    warning: { message: 'Heart rate outside nominal range. Cardiovascular deconditioning from microgravity fluid shift detected.', action: 'Begin resistance exercise session. Apply LBNP protocol. Monitor 24h.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Heart rate indicates acute cardiovascular event risk.', action: 'Immediate CMO intervention. Administer cardiac protocol. Emergency telemedicine consultation.', tier: 'IMMEDIATE CMO INTERVENTION' },
  },
  spo2: {
    warning: { message: 'Blood oxygen below nominal. Possible early hypoxia or fluid-shift affecting lung capacity.', action: 'Check cabin O2 levels. Deep breathing exercises. Increase supplemental O2 if below 93%.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: SpO2 indicates hypoxia. Immediate oxygen supplementation required.', action: 'Administer supplemental O2. Evacuate to pressurized safe zone. Ground consultation PRIORITY.', tier: 'IMMEDIATE CMO INTERVENTION' },
  },
  sleepHours: {
    warning: { message: 'Sleep duration below optimal (6–9h). Circadian disruption from space environment noted.', action: 'Activate blue-light mitigation. Adjust lighting to circadian rhythm. Consider melatonin protocol.', tier: 'Crew Peer-Check' },
    critical: { message: 'CRITICAL: Sleep deprivation for 3+ consecutive days. Cognitive performance severely compromised.', action: 'Mandatory 8h sleep block. All non-critical duties suspended. Behavioral health check required.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
  bloodSugar: {
    warning: { message: 'Blood glucose outside nominal range. Metabolic stress from mission demands.', action: 'Adjust meal timing. Increase complex carbohydrate ratio. Monitor every 4 hours.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Blood glucose indicates diabetic emergency.', action: 'Administer appropriate intervention immediately. CMO to assess. Telemedicine consultation required.', tier: 'IMMEDIATE CMO INTERVENTION' },
  },
  radiationDose: {
    warning: { message: 'Radiation dose exceeds monitoring threshold. Solar particle event possible.', action: 'Activate antioxidant supplement protocol (Vitamins C, E, Alpha-Lipoic Acid). Relocate to shielded crew quarters.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Radiation dose exceeds NASA weekly limit. Acute radiation syndrome risk.', action: 'IMMEDIATE shelter in storm shelter module. All EVAs cancelled. Full radiation protocol activated. Ground consultation URGENT.', tier: 'IMMEDIATE CMO INTERVENTION' },
  },
  moodRating: {
    warning: { message: 'Mood score indicates behavioral health concern. Isolation and confinement stress elevated.', action: 'Schedule crew peer check-in session. Increase recreational activity time. Review sleep and exercise compliance.', tier: 'Crew Peer-Check' },
    critical: { message: 'CRITICAL: Mood score indicates acute psychological distress.', action: 'Immediate behavioral health protocol activation. CMO psychological assessment. Encrypted message to Ground Psychologist.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
  exerciseCompliance: {
    warning: { message: 'Exercise compliance below optimal. Musculoskeletal deconditioning accelerating.', action: 'Re-schedule exercise blocks. Mandatory ARED resistance session today. Increase bone density monitoring.', tier: 'Self-Action' },
    critical: { message: 'CRITICAL: Exercise compliance severely compromised. Bone/muscle loss rate is dangerous.', action: 'CMO evaluation of physical capability. Mandatory full exercise protocol. Rehabilitation plan required.', tier: 'CMO Review' },
  },
  sansRisk: {
    warning: { message: 'SANS risk index elevated. Cephalad fluid shift affecting intracranial pressure.', action: 'Perform weekly ocular ultrasound. Check for optic disc edema. Document visual acuity changes. Increase LBNP protocol.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: SANS risk indicates significant neuro-ocular compromise.', action: 'Immediate ophthalmological assessment. Restrict activities causing Valsalva. Priority message to Ground Ophthalmologist.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
  boneDensityLoss: {
    warning: { message: 'Bone density loss approaching critical threshold. Microgravity demineralization ongoing.', action: 'Increase bone-loading exercises. Calcium/Vitamin D supplementation review. Bi-weekly DEXA scan equivalent.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Bone density loss exceeds acceptable mission limit. Fracture risk elevated.', action: 'Mandatory exercise protocol review. Bisphosphonate therapy consideration. Ground medical team consultation.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
  coreTemp: {
    warning: { message: 'Core temperature outside nominal range. Thermoregulation stress detected.', action: 'Check cabin temperature and humidity. Increase fluid intake. Rest from physical activity.', tier: 'Self-Action' },
    critical: { message: 'CRITICAL: Core temperature indicates fever or hypothermia emergency.', action: 'Immediate CMO assessment. Administer temperature regulation protocol. Restrict strenuous activity.', tier: 'IMMEDIATE CMO INTERVENTION' },
  },
  hydration: {
    warning: { message: 'Hydration level below optimal. Fluid intake insufficient.', action: 'Increase water intake to 2.5L/day minimum. Add electrolyte supplement. Track fluid balance.', tier: 'Self-Action' },
    critical: { message: 'CRITICAL: Severe dehydration. Risk of kidney stones and cardiovascular strain.', action: 'Immediate IV fluid consideration. CMO assessment. All exercise suspended until hydration restored.', tier: 'CMO Review' },
  },
  cognitiveScore: {
    warning: { message: 'Cognitive performance below threshold. Sleep deprivation or isolation fatigue likely.', action: 'Mandatory PVT test. Review sleep schedule. Reduce cognitive workload for 24h.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Cognitive performance dangerously low. Mission-critical tasks must not be performed.', action: 'Ground surgeon consultation. Full neurological assessment. Duty restriction until baseline restored.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
  muscleMass: {
    warning: { message: 'Muscle mass declining below baseline. Microgravity atrophy progressing.', action: 'Increase resistance training load. Review protein intake (1.6g/kg/day minimum). Daily muscle assessment.', tier: 'CMO Review' },
    critical: { message: 'CRITICAL: Severe muscle atrophy. Functional mobility may be compromised upon return.', action: 'Emergency rehabilitation protocol. Full nutrition review. Ground surgeon consultation required.', tier: 'DEFERRED GROUND SURGEON MSG' },
  },
};

export function evaluateMetric(metric, value) {
  const t = HEALTH_THRESHOLDS[metric];
  if (!t) return { status: 'nominal', message: 'Metric nominal.', action: 'Continue standard monitoring.', tier: 'Standard' };

  const status = getMetricStatus(metric, value);
  if (status === 'nominal') {
    return { status: 'nominal', message: `${t.label} within nominal range (${value} ${t.unit}).`, action: 'Continue standard monitoring protocol.', tier: 'Standard' };
  }

  const g = GUIDANCE[metric]?.[status] || GUIDANCE[metric]?.['warning'];
  if (!g) return { status, message: `${t.label} out of range.`, action: 'Consult CMO.', tier: 'CMO Review' };

  return { status, message: `${g.message} Current: ${value} ${t.unit}`, action: g.action, tier: g.tier };
}

export function evaluateAllMetrics(healthData) {
  const alerts = [];
  for (const metric of Object.keys(HEALTH_THRESHOLDS)) {
    const value = healthData[metric];
    if (value === undefined || value === null) continue;
    const result = evaluateMetric(metric, value);
    if (result.status !== 'nominal') {
      alerts.push({
        id: `alert-${metric}`,
        metric,
        value,
        label: HEALTH_THRESHOLDS[metric]?.label || metric,
        unit: HEALTH_THRESHOLDS[metric]?.unit || '',
        threshold: HEALTH_THRESHOLDS[metric],
        ...result,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  }
  return alerts.sort((a, b) => (a.status === 'critical' ? -1 : b.status === 'critical' ? 1 : 0));
}

export function getBodyPartStatus(part, healthData) {
  const partMetrics = {
    head: ['sleepHours', 'moodRating', 'cognitiveScore', 'sansRisk'],
    chest: ['heartRate', 'bloodPressureSys', 'bloodPressureDia', 'spo2'],
    abdomen: ['bloodSugar', 'coreTemp', 'hydration', 'radiationDose'],
    musculoskeletal: ['exerciseCompliance', 'boneDensityLoss', 'muscleMass'],
  };
  const metrics = partMetrics[part] || [];
  let worst = 'nominal';
  for (const m of metrics) {
    const v = healthData[m];
    if (v === undefined) continue;
    const s = getMetricStatus(m, v);
    if (s === 'critical') return 'critical';
    if (s === 'warning') worst = 'warning';
  }
  return worst;
}

export function getBodyPartAlerts(part, healthData) {
  const partMetrics = {
    head: ['sleepHours', 'moodRating', 'cognitiveScore', 'sansRisk'],
    chest: ['heartRate', 'bloodPressureSys', 'bloodPressureDia', 'spo2'],
    abdomen: ['bloodSugar', 'coreTemp', 'hydration', 'radiationDose'],
    musculoskeletal: ['exerciseCompliance', 'boneDensityLoss', 'muscleMass'],
  };
  const metrics = partMetrics[part] || [];
  const alerts = [];
  for (const metric of metrics) {
    const value = healthData[metric];
    if (value === undefined) continue;
    const result = evaluateMetric(metric, value);
    if (result.status !== 'nominal') {
      alerts.push({ metric, value, label: HEALTH_THRESHOLDS[metric]?.label || metric, unit: HEALTH_THRESHOLDS[metric]?.unit || '', threshold: HEALTH_THRESHOLDS[metric], ...result });
    }
  }
  return alerts;
}

export function computeCrewHealthIndex(healthData) {
  const weights = { heartRate: 0.15, spo2: 0.15, sleepHours: 0.12, moodRating: 0.10, bloodSugar: 0.08, coreTemp: 0.08, hydration: 0.08, exerciseCompliance: 0.10, radiationDose: 0.07, boneDensityLoss: 0.04, muscleMass: 0.03 };
  let score = 0; let totalWeight = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    const value = healthData[metric];
    if (value === undefined) continue;
    const status = getMetricStatus(metric, value);
    const ms = status === 'nominal' ? 100 : status === 'warning' ? 65 : 20;
    score += ms * weight; totalWeight += weight;
  }
  return totalWeight > 0 ? Math.round(score / totalWeight) : 85;
}
