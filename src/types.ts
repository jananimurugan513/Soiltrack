export interface SoilData {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  location: string;
  cropType?: string;
}

export interface WeatherDay {
  day: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  rainfall: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

export interface Recommendation {
  crop: string;
  suitabilityScore: number;
  icon: string;
  fertilizer: {
    type: string;
    schedule: string;
    dosage: string;
  };
  irrigation: {
    frequency: string;
    method: string;
    amount: string;
    timeline: { time: string; action: string }[];
  };
  warnings: string[];
  alternatives: string[];
  expectedYield: number; // in tons/hectare
}

export interface AnalysisResult {
  recommendations: Recommendation[];
  summary: string;
  soilHealthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  weatherForecast: WeatherDay[];
  heatmapData: HeatmapPoint[];
  aiInsights: {
    title: string;
    description: string;
    impact: string;
    type: 'warning' | 'tip' | 'insight';
  }[];
}
