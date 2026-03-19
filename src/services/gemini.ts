import { GoogleGenAI, Type } from "@google/genai";
import { SoilData, AnalysisResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSoilData(data: SoilData): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Analyze the following soil and field data for a farmer:
    Location: ${data.location}
    Soil pH: ${data.ph}
    Soil Moisture: ${data.moisture}%
    Nutrients (N-P-K): ${data.nitrogen}-${data.phosphorus}-${data.potassium}
    Temperature: ${data.temperature}°C
    Humidity: ${data.humidity}%
    Rainfall: ${data.rainfall}mm

    Provide a comprehensive dashboard analysis including:
    1. Top 3 suitable crops with suitability scores (0-100) and expected yield (tons/hectare).
    2. Fertilizer plan for the best crop.
    3. Irrigation schedule with a 24h timeline.
    4. A 7-day weather forecast based on the location and current conditions.
    5. Heatmap data points (9 points in a 3x3 grid) representing soil variability.
    6. AI Insights (warnings, tips, and predicted yield increases).

    Respond in a friendly, practical tone.
  `;

  const response = await genAI.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                crop: { type: Type.STRING },
                suitabilityScore: { type: Type.NUMBER },
                icon: { type: Type.STRING, description: "Lucide icon name like 'Sprout', 'Wheat', 'Corn'" },
                fertilizer: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    schedule: { type: Type.STRING },
                    dosage: { type: Type.STRING }
                  },
                  required: ["type", "schedule", "dosage"]
                },
                irrigation: {
                  type: Type.OBJECT,
                  properties: {
                    frequency: { type: Type.STRING },
                    method: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    timeline: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING },
                          action: { type: Type.STRING }
                        }
                      }
                    }
                  },
                  required: ["frequency", "method", "amount", "timeline"]
                },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                expectedYield: { type: Type.NUMBER }
              },
              required: ["crop", "suitabilityScore", "icon", "fertilizer", "irrigation", "warnings", "alternatives", "expectedYield"]
            }
          },
          summary: { type: Type.STRING },
          soilHealthStatus: { 
            type: Type.STRING,
            enum: ["Excellent", "Good", "Fair", "Poor"]
          },
          weatherForecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING, enum: ["Sunny", "Cloudy", "Rainy", "Stormy"] },
                rainfall: { type: Type.NUMBER }
              }
            }
          },
          heatmapData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                value: { type: Type.NUMBER },
                label: { type: Type.STRING }
              }
            }
          },
          aiInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["warning", "tip", "insight"] }
              }
            }
          }
        },
        required: ["recommendations", "summary", "soilHealthStatus", "weatherForecast", "heatmapData", "aiInsights"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
