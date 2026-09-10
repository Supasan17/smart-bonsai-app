import { BonsaiTelemetry, HealthAnalysis, HealthStatusLevel } from '../types';
import { formatTemp, TempUnit } from '../utils/temperature';

export function calculatePlantHealth(telemetry: BonsaiTelemetry, tempUnit: TempUnit = 'C'): HealthAnalysis {
  const { soilMoisture, temperature, humidity, light, soilFault, dhtFault, lightFault } = telemetry;

  let moistureScore: number | null = 100;
  let moistureStatus = 'Optimal';
  if (soilFault) {
    moistureScore = null;
    moistureStatus = 'Sensor Offline';
  } else if (soilMoisture < 20) {
    moistureScore = 20;
    moistureStatus = 'Critically Low';
  } else if (soilMoisture < 35) {
    moistureScore = 55;
    moistureStatus = 'Dry';
  } else if (soilMoisture > 85) {
    moistureScore = 65;
    moistureStatus = 'Overwatered';
  }

  let tempScore: number | null = 100;
  let tempStatus = 'Optimal';
  if (dhtFault) {
    tempScore = null;
    tempStatus = 'Sensor Offline';
  } else if (temperature < 12) {
    tempScore = 30;
    tempStatus = 'Too Cold';
  } else if (temperature < 18) {
    tempScore = 75;
    tempStatus = 'Cool';
  } else if (temperature > 34) {
    tempScore = 25;
    tempStatus = 'Extreme Heat';
  } else if (temperature > 28) {
    tempScore = 70;
    tempStatus = 'Warm';
  }

  let humidityScore: number | null = 100;
  let humidityStatus = 'Optimal';
  if (dhtFault) {
    humidityScore = null;
    humidityStatus = 'Sensor Offline';
  } else if (humidity < 30) {
    humidityScore = 40;
    humidityStatus = 'Very Dry Air';
  } else if (humidity < 50) {
    humidityScore = 75;
    humidityStatus = 'Low Humidity';
  } else if (humidity > 85) {
    humidityScore = 80;
    humidityStatus = 'High Humidity';
  }

  let lightScore: number | null = 100;
  let lightStatus = 'Optimal';
  if (lightFault) {
    lightScore = null;
    lightStatus = 'Sensor Offline';
  } else if (light < 25) {
    lightScore = 30;
    lightStatus = 'Insufficient Light';
  } else if (light < 50) {
    lightScore = 70;
    lightStatus = 'Moderate Sun';
  } else if (light > 95) {
    lightScore = 75;
    lightStatus = 'Intense Direct Light';
  }

  const weighted: Array<{ score: number | null; weight: number }> = [
    { score: moistureScore, weight: 0.35 },
    { score: tempScore, weight: 0.25 },
    { score: humidityScore, weight: 0.20 },
    { score: lightScore, weight: 0.20 },
  ];
  const available = weighted.filter((f) => f.score !== null) as Array<{ score: number; weight: number }>;
  const availableWeight = available.reduce((sum, f) => sum + f.weight, 0);
  const totalScore = availableWeight > 0
    ? Math.round(available.reduce((sum, f) => sum + f.score * f.weight, 0) / availableWeight)
    : 0;

  let status: HealthStatusLevel = 'Excellent';
  let badgeColor = '#10B981';

  if (totalScore < 45) {
    status = 'Critical';
    badgeColor = '#EF4444';
  } else if (totalScore < 70) {
    status = 'Warning';
    badgeColor = '#F59E0B';
  } else if (totalScore < 85) {
    status = 'Good';
    badgeColor = '#34D399';
  }

  const recommendations: string[] = [];

  if (!soilFault) {
    if (soilMoisture < 30) {
      recommendations.push(`Water the plant now! Soil moisture is low (${soilMoisture}%).`);
    } else if (soilMoisture > 80) {
      recommendations.push(`Soil is saturated (${soilMoisture}%). Pause watering to prevent root rot.`);
    }
  }

  if (!lightFault) {
    if (light < 40) {
      recommendations.push(`Increase sunlight exposure. Current light intensity is ${light}%.`);
    } else if (light > 90) {
      recommendations.push(`Light intensity is high (${light}%). Consider partial shade during midday.`);
    }
  }

  if (!dhtFault) {
    if (temperature > 30) {
      recommendations.push(`High ambient temperature (${formatTemp(temperature, tempUnit)}). Ensure good airflow and mist foliage.`);
    } else if (temperature < 15) {
      recommendations.push(`Low ambient temperature (${formatTemp(temperature, tempUnit)}). Move bonsai away from cold drafts.`);
    }

    if (humidity < 40) {
      recommendations.push(`Air humidity is dry (${humidity}%). Consider misting leaves or using a humidity tray.`);
    }
  }

  if (soilFault) recommendations.push('Soil moisture sensor is not responding — check its wiring/connection.');
  if (dhtFault) recommendations.push('Temperature/humidity (DHT22) sensor is not responding — check its wiring/connection.');
  if (lightFault) recommendations.push('Light sensor is not responding — check its wiring/connection.');

  if (recommendations.length === 0) {
    recommendations.push('Plant environment is optimal. All sensors report excellent growing conditions!');
    recommendations.push('Maintain current light position and automatic watering schedule.');
  }

  return {
    score: totalScore,
    status,
    badgeColor,
    recommendations,
    factors: {
      moisture: { status: moistureStatus, score: moistureScore },
      temperature: { status: tempStatus, score: tempScore },
      humidity: { status: humidityStatus, score: humidityScore },
      light: { status: lightStatus, score: lightScore }
    }
  };
}
