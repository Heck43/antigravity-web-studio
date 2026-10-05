# Design System: Aura Weather

## Visual Concept
"Atmosphere & Clarity" — inspired by Apple iOS Weather, Linear app, and clean Nordic minimalism.
A dynamic ambient backdrop that reflects the real-world condition (sunset orange, stormy deep blue, crisp clear azure, mystical starry midnight) combined with high-contrast frosted glass cards (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.14)`).

## Color Tokens & Palettes
- **Typography:**
  - Font Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Font Display: `'Outfit', 'Inter', sans-serif`
- **Text colors:**
  - High emphasis: `#FFFFFF`
  - Medium emphasis: `rgba(255, 255, 255, 0.75)`
  - Low emphasis / labels: `rgba(255, 255, 255, 0.5)`
  - Accent / highlight: `#38BDF8` (Sky blue), `#FBBF24` (Amber sun), `#34D399` (Mint)
- **Glassmorphism surfaces:**
  - Card background: `rgba(18, 26, 44, 0.55)` with `backdrop-filter: blur(20px) saturate(180%)`
  - Card border: `1px solid rgba(255, 255, 255, 0.12)`
  - Card hover border: `1px solid rgba(255, 255, 255, 0.25)`
  - Elevated modal / dropdown: `rgba(15, 23, 42, 0.85)` with `box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5)`
- **Dynamic Weather Gradients:**
  - Clear Day: `linear-gradient(135deg, #1e3a8a 0%, #0284c7 50%, #38bdf8 100%)`
  - Clear Night: `linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)`
  - Clouds Day: `linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)`
  - Clouds Night: `linear-gradient(135deg, #0b0f19 0%, #1e293b 50%, #334155 100%)`
  - Rain: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)`
  - Thunderstorm: `linear-gradient(135deg, #18181b 0%, #312e81 40%, #0f172a 100%)`
  - Snow: `linear-gradient(135deg, #1e293b 0%, #475569 50%, #94a3b8 100%)`

## Layout & Components
1. **Header & Navigation:**
   - App Logo & Title with live pulse dot indicator.
   - Search input with search icon, clear button, and geocoding auto-complete dropdown.
   - Action controls: "My Location" geolocation button, Settings / Unit toggle modal, Language switch button.
2. **Hero Weather Overview:**
   - City name, country badge, local time.
   - Giant hero temperature (e.g. `18°`), weather status text, and feels-like chip.
   - High/Low range pill for today.
   - Favorite star toggle button.
3. **Hourly Forecast (24 Hours):**
   - Horizontal snap-scrolling rail with hour tags, custom SVG weather icons, precipitation badges (%), and smooth temperature readings.
4. **Main Dashboard 2-Column Grid:**
   - **Left Column:** 7-Day Forecast card with day name, weather icon, condition, and visual temperature min-to-max gradient bar.
   - **Right Column:** Atmospheric detail tiles:
     - Wind tile: speed, gusts, direction compass needle.
     - UV Index tile: current value, max for the day, risk meter gauge.
     - Humidity tile: percentage, dew point calculation.
     - Pressure tile: formatted in mmHg / hPa with trend indicator.
     - Sunrise & Sunset tile: dawn/dusk times with dynamic sun elevation arc.
     - Visibility & Precipitation tiles.
5. **Favorite & Recent Locations Rail:**
   - Quick pills of pinned cities with current temperature preview for rapid switching.

## Micro-interactions & Polish
- Hover lift on cards (`transform: translateY(-2px)`).
- Smooth transitions between weather themes (`transition: background 0.8s ease`).
- Custom scrollbar styling.
- Responsive breakdown: 1-column layout for screens < 768px, 2-column balanced grid for >= 768px.
