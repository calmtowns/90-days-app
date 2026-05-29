import type { WeatherData } from '@/types';

function wmoToCondition(code: number): WeatherData['condition'] {
  if (code === 0) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain';
  if (code <= 99) return 'storm';
  return 'unknown';
}

function wmoToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 49) return 'Foggy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    );
    const { latitude, longitude } = pos.coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,is_day&wind_speed_unit=ms`;
    const res = await fetch(url);
    const data = await res.json();
    const current = data.current;
    return {
      temp: Math.round(current.temperature_2m),
      condition: wmoToCondition(current.weather_code),
      description: wmoToDescription(current.weather_code),
      isDay: current.is_day === 1,
      feelsLike: Math.round(current.apparent_temperature),
    };
  } catch {
    return null;
  }
}
