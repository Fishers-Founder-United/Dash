import type { WeatherData, ForecastDay } from "./types";

const LAT = 39.9556; // Fishers, IN
const LON = -86.0131;

const WMO: Record<number, string> = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function dayLabel(dateStr: string): string {
  // dateStr is YYYY-MM-DD, treat as local date
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const now = new Date();
  const todayStr = [now.getFullYear(), now.getMonth(), now.getDate()].join("-");
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = [
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
  ].join("-");
  const dateNorm = [date.getFullYear(), date.getMonth(), date.getDate()].join(
    "-"
  );
  if (dateNorm === todayStr) return "Today";
  if (dateNorm === tomorrowStr) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function wmoDescription(code: number): string {
  // Lookup exact, then try rounding down to nearest 10
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? "Unknown";
}

export function wmoCategory(
  code: number
): "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog" {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(LAT),
      longitude: String(LON),
      current: "temperature_2m,apparent_temperature,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      timezone: "America/Indiana/Indianapolis",
      forecast_days: "5",
    });
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();

    const forecast: ForecastDay[] = (data.daily.time as string[]).map(
      (dateStr, i) => ({
        label: dayLabel(dateStr),
        weatherCode: data.daily.weather_code[i] as number,
        high: Math.round(data.daily.temperature_2m_max[i] as number),
        low: Math.round(data.daily.temperature_2m_min[i] as number),
      })
    );

    const code = data.current.weather_code as number;
    return {
      temp: Math.round(data.current.temperature_2m as number),
      feelsLike: Math.round(data.current.apparent_temperature as number),
      weatherCode: code,
      description: wmoDescription(code),
      high: forecast[0]?.high ?? 0,
      low: forecast[0]?.low ?? 0,
      forecast,
    };
  } catch {
    return null;
  }
}
