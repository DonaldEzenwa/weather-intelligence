export type LocationInput = { query: string; latitude?: number; longitude?: number };
export type WeatherDay = { date: string; high: number; low: number; condition: string; precipitationChance: number; icon?: string };
export type WeatherResult = {
  location: { name: string; country?: string; latitude?: number; longitude?: number };
  current: { temperature: number; feelsLike: number; condition: string; humidity: number; windSpeed: number; visibility: number; sunrise?: string; sunset?: string; icon?: string; airQuality?: number };
  forecast: WeatherDay[]; source: "openweathermap" | "demo"; recommendation: string; insights: string[];
};
export type SavedSearch = {
  id: string; locationName: string; latitude: number; longitude: number; country?: string | null;
  weatherCondition: string; temperature: number; humidity: number; windSpeed: number;
  startDate: string; endDate: string; searchedAt: string; notes?: string | null;
  createdAt: string; updatedAt: string;
};
