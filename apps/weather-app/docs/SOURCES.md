# Research Sources & References

## 1. Weather Data Provider
- **Provider:** Open-Meteo (Non-commercial & open-source friendly, free, no API key required).
- **Forecast Endpoint:** `https://api.open-meteo.com/v1/forecast`
  - Docs: https://open-meteo.com/en/docs
  - Parameters used:
    - `current`: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `is_day`, `precipitation`, `weather_code`, `pressure_msl`, `surface_pressure`, `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m`
    - `hourly`: `temperature_2m`, `weather_code`, `precipitation_probability`, `relative_humidity_2m`, `wind_speed_10m`
    - `daily`: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `apparent_temperature_max`, `apparent_temperature_min`, `sunrise`, `sunset`, `uv_index_max`, `precipitation_sum`, `precipitation_probability_max`, `wind_speed_10m_max`
- **Geocoding Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`
  - Parameters: `name`, `count=8`, `language=ru` (or `en`), `format=json`.

## 2. UI/UX Inspirations
- **Apple iOS Weather App:** Frosted glass cards, horizontal hourly scroller, 7-day temperature range bars, atmospheric metric cards (UV, wind compass, daylight arc).
- **Linear App:** Precision typography, dark-mode gradient luminescence, clean borders (`rgba(255, 255, 255, 0.1)`), subtle focus states.
- **WMO Weather Interpretation Codes Table:** Standardized meteorological code mapping (0: Clear sky, 1-3: Partly cloudy / Overcast, 45/48: Fog, 51-55: Drizzle, 61-65: Rain, 71-75: Snow, 80-82: Showers, 95-99: Thunderstorms).

## 3. Libraries & Dependencies
- 100% Zero-dependency Vanilla JavaScript, Semantic HTML5, and Modern CSS.
- Self-contained SVG icon system for all weather conditions, atmospheric indicators, wind compass, and UI controls.
