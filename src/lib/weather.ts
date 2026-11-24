import axios from "axios";
import type { LocationInput, WeatherResult } from "./types";

function recommendations(current: WeatherResult["current"]): string[] {
  const result: string[] = [];
  if (current.condition.toLowerCase().includes("rain")) result.push("Carry an umbrella and choose water-resistant footwear.");
  if (current.temperature < 10) result.push("Wear a warm jacket and layer up.");
  if (current.windSpeed > 30) result.push("Strong winds expected; avoid exposed outdoor events.");
  if (current.airQuality !== undefined && current.airQuality >= 4) result.push("Air quality is poor; limit strenuous outdoor exercise.");
  if (!result.length) result.push("Conditions look suitable for most outdoor plans.");
  return result;
}

function demoWeather(input: LocationInput): WeatherResult {
  const forecast = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() + index);
    return { date: date.toISOString(), high: 18 + index, low: 10 + index, condition: index % 2 ? "Partly cloudy" : "Sunny", precipitationChance: index * 10, icon: index % 2 ? "02d" : "01d" };
  });
  const current = { temperature: 18, feelsLike: 17, condition: "Partly cloudy", humidity: 62, windSpeed: 12, visibility: 10, icon: "02d" };
  return { location: { name: input.query, latitude: input.latitude, longitude: input.longitude }, current, forecast, source: "demo", recommendation: recommendations(current)[0], insights: recommendations(current) };
}

export async function getWeather(input: LocationInput): Promise<WeatherResult> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return demoWeather(input);
  try {
    const locationParams = input.latitude !== undefined && input.longitude !== undefined
      ? { lat: input.latitude, lon: input.longitude, appid: key, units: "metric" }
      : { q: input.query, appid: key, units: "metric" };
    const currentResponse = await axios.get("https://api.openweathermap.org/data/2.5/weather", { params: locationParams });
    const { coord, name, sys, main, weather, wind, visibility } = currentResponse.data;
    const forecastResponse = await axios.get("https://api.openweathermap.org/data/2.5/forecast", { params: { lat: coord.lat, lon: coord.lon, appid: key, units: "metric" } });
    const forecast = forecastResponse.data.list.filter((_: unknown, index: number) => index % 8 === 0).slice(0, 5).map((item: { dt: number; main: { temp_max: number; temp_min: number }; weather?: Array<{ description?: string; icon?: string }>; pop?: number }) => ({
      date: new Date(item.dt * 1000).toISOString(), high: Math.round(item.main.temp_max), low: Math.round(item.main.temp_min),
      condition: item.weather?.[0]?.description ?? "Unknown", icon: item.weather?.[0]?.icon, precipitationChance: Math.round((item.pop ?? 0) * 100),
    }));
    let airQuality: number | undefined;
    try {
      const air = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution", { params: { lat: coord.lat, lon: coord.lon, appid: key } });
      airQuality = air.data.list?.[0]?.main?.aqi;
    } catch { /* Air quality is optional. */ }
    const current = {
      temperature: Math.round(main.temp), feelsLike: Math.round(main.feels_like), condition: weather?.[0]?.description ?? "Unknown",
      humidity: main.humidity, windSpeed: Math.round((wind?.speed ?? 0) * 3.6), visibility: Math.round((visibility ?? 10000) / 1000),
      sunrise: sys?.sunrise ? new Date(sys.sunrise * 1000).toISOString() : undefined, sunset: sys?.sunset ? new Date(sys.sunset * 1000).toISOString() : undefined,
      icon: weather?.[0]?.icon, airQuality,
    };
    const insights = recommendations(current);
    return { location: { name, country: sys?.country, latitude: coord?.lat, longitude: coord?.lon }, current, forecast, source: "openweathermap", recommendation: insights[0], insights };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Location not found. Try a city, postal code, or coordinates.");
    throw new Error("Weather service is temporarily unavailable. Please try again.");
  }
}
