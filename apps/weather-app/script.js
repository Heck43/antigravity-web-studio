/**
 * Aura Weather — Core Application Logic
 * Integrates Open-Meteo Forecast & Geocoding APIs with zero dependencies.
 */

(() => {
  'use strict';

  // --- Localization Dictionary ---
  const I18N = {
    ru: {
      weather: 'Погода',
      search_placeholder: 'Поиск города или страны...',
      loading_weather: 'Загрузка данных о погоде...',
      error_title: 'Не удалось получить данные',
      error_desc: 'Проверьте подключение к интернету или попробуйте другой город.',
      retry: 'Повторить',
      hourly_forecast: 'ПОЧАСОВОЙ ПРОГНОЗ (24 ЧАСА)',
      scroll_hint: 'Прокрутите вправо →',
      daily_forecast: 'ПРОГНОЗ НА 7 ДНЕЙ',
      wind: 'ВЕТЕР',
      uv_index: 'УФ-ИНДЕКС',
      humidity: 'ВЛАЖНОСТЬ',
      pressure: 'ДАВЛЕНИЕ',
      sun_cycle: 'СОЛНЦЕ',
      precipitation: 'ОСАДКИ',
      sunrise: 'Восход',
      sunset: 'Закат',
      today: 'Сегодня',
      now: 'Сейчас',
      feels_like: 'Ощущается как',
      min: 'Мин',
      max: 'Макс',
      wind_gusts: 'Порывы до',
      dew_point: 'Точка росы',
      cloud_cover: 'Облачность',
      precip_prob: 'Вероятность',
      geo_success: 'Местоположение определено',
      geo_denied: 'Доступ к геолокации запрещен',
      saved_city: 'Город сохранен в избранное',
      removed_city: 'Город удален из избранного',
      wind_units: {
        kmh: 'км/ч',
        ms: 'м/с'
      },
      pressure_units: {
        mmhg: 'мм рт. ст.',
        hpa: 'гПа'
      },
      uv_levels: ['Низкий', 'Умеренный', 'Высокий', 'Очень высокий', 'Экстремальный'],
      uv_tips: [
        'Защита не требуется. Безопасное солнце.',
        'Используйте защиту от солнца в полуденные часы.',
        'Наденьте очки и используйте крем SPF 30+.',
        'Старайтесь оставаться в тени в середине дня.',
        'Опасный уровень! Избегайте нахождения на солнце.'
      ],
      pressure_trends: {
        low: 'Пониженное атмосферное давление.',
        normal: 'Нормальное атмосферное давление.',
        high: 'Повышенное атмосферное давление.'
      },
      days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      wind_dirs: ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'],
      wind_names: [
        'Северный', 'Северо-северо-восточный', 'Северо-восточный', 'Восточно-северо-восточный',
        'Восточный', 'Восточно-юго-восточный', 'Юго-восточный', 'Южно-юго-восточный',
        'Южный', 'Южно-юго-западный', 'Юго-западный', 'Западно-юго-западный',
        'Западный', 'Западно-северо-западный', 'Северо-западный', 'Северо-северо-западный'
      ],
      weather_codes: {
        0: 'Ясно',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Инейный туман',
        51: 'Легкая морось',
        53: 'Умеренная морось',
        55: 'Плотная морось',
        56: 'Ледяная морось',
        57: 'Сильная ледяная морось',
        61: 'Небольшой дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        66: 'Ледяной дождь',
        67: 'Сильный ледяной дождь',
        71: 'Небольшой снегопад',
        73: 'Умеренный снегопад',
        75: 'Сильный снегопад',
        77: 'Снежные зерна',
        80: 'Кратковременный ливень',
        81: 'Умеренный ливень',
        82: 'Сильный ливень',
        85: 'Небольшой снежный заряд',
        86: 'Сильный снежный заряд',
        95: 'Гроза',
        96: 'Гроза с градом',
        99: 'Сильная гроза с градом'
      }
    },
    en: {
      weather: 'Weather',
      search_placeholder: 'Search city or country...',
      loading_weather: 'Loading weather data...',
      error_title: 'Unable to load weather',
      error_desc: 'Check your internet connection or try another location.',
      retry: 'Retry',
      hourly_forecast: '24-HOUR FORECAST',
      scroll_hint: 'Scroll right →',
      daily_forecast: '7-DAY FORECAST',
      wind: 'WIND',
      uv_index: 'UV INDEX',
      humidity: 'HUMIDITY',
      pressure: 'PRESSURE',
      sun_cycle: 'SUN',
      precipitation: 'PRECIPITATION',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      today: 'Today',
      now: 'Now',
      feels_like: 'Feels like',
      min: 'Min',
      max: 'Max',
      wind_gusts: 'Gusts up to',
      dew_point: 'Dew point',
      cloud_cover: 'Cloud cover',
      precip_prob: 'Probability',
      geo_success: 'Current location identified',
      geo_denied: 'Geolocation access denied',
      saved_city: 'City saved to favorites',
      removed_city: 'City removed from favorites',
      wind_units: {
        kmh: 'km/h',
        ms: 'm/s'
      },
      pressure_units: {
        mmhg: 'mmHg',
        hpa: 'hPa'
      },
      uv_levels: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
      uv_tips: [
        'No protection required. Safe sun.',
        'Wear sunglasses and SPF on sunny days.',
        'Protection required. Seek shade during midday.',
        'High risk. Avoid midday direct sun exposure.',
        'Extreme warning. Stay indoors if possible.'
      ],
      pressure_trends: {
        low: 'Low atmospheric pressure.',
        normal: 'Normal atmospheric pressure.',
        high: 'High atmospheric pressure.'
      },
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      wind_dirs: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
      wind_names: [
        'North', 'North-Northeast', 'Northeast', 'East-Northeast',
        'East', 'East-Southeast', 'Southeast', 'South-Southeast',
        'South', 'South-Southwest', 'Southwest', 'West-Southwest',
        'West', 'West-Northwest', 'Northwest', 'North-Northwest'
      ],
      weather_codes: {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      }
    }
  };

  // --- SVG Icons Definition ---
  const SVG_ICONS = {
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="#E0E7FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`,
    cloudSun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="M20 12h2"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
                <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" stroke="#FBBF24"></path>
                <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" stroke="#E2E8F0"></path>
              </svg>`,
    cloudMoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M10.05 7.82a6 6 0 0 1 8.13 8.13" stroke="#A5B4FC"></path>
                 <path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="#E2E8F0"></path>
               </svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
            </svg>`,
    fog: `<svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="8" x2="20" y2="8"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="5" y1="16" x2="19" y2="16"></line>
            <line x1="7" y1="20" x2="17" y2="20"></line>
          </svg>`,
    drizzle: `<svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 16H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="#CBD5E1"></path>
                <line x1="8" y1="19" x2="8" y2="21"></line>
                <line x1="12" y1="19" x2="12" y2="21"></line>
                <line x1="16" y1="19" x2="16" y2="21"></line>
              </svg>`,
    rain: `<svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="#94A3B8"></path>
             <line x1="8" y1="18" x2="6" y2="22" stroke="#38BDF8"></line>
             <line x1="12" y1="18" x2="10" y2="22" stroke="#38BDF8"></line>
             <line x1="16" y1="18" x2="14" y2="22" stroke="#38BDF8"></line>
           </svg>`,
    thunderstorm: `<svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="#64748B"></path>
                     <polygon points="13 15 9 20 12 20 11 23 15 18 12 18 13 15" fill="#FBBF24" stroke="#FBBF24"></polygon>
                   </svg>`,
    snow: `<svg viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="#94A3B8"></path>
             <line x1="8" y1="19" x2="8" y2="19.01" stroke="#BAE6FD" stroke-width="3"></line>
             <line x1="12" y1="21" x2="12" y2="21.01" stroke="#BAE6FD" stroke-width="3"></line>
             <line x1="16" y1="19" x2="16" y2="19.01" stroke="#BAE6FD" stroke-width="3"></line>
           </svg>`
  };

  // Predefined Popular Cities
  const DEFAULT_POPULAR_CITIES = [
    { nameRu: 'Москва', nameEn: 'Moscow', countryRu: 'Россия', countryEn: 'Russia', lat: 55.7522, lon: 37.6156 },
    { nameRu: 'Санкт-Петербург', nameEn: 'Saint Petersburg', countryRu: 'Россия', countryEn: 'Russia', lat: 59.9386, lon: 30.3141 },
    { nameRu: 'Лондон', nameEn: 'London', countryRu: 'Великобритания', countryEn: 'United Kingdom', lat: 51.5085, lon: -0.1257 },
    { nameRu: 'Токио', nameEn: 'Tokyo', countryRu: 'Япония', countryEn: 'Japan', lat: 35.6895, lon: 139.6917 },
    { nameRu: 'Нью-Йорк', nameEn: 'New York', countryRu: 'США', countryEn: 'United States', lat: 40.7143, lon: -74.006 },
    { nameRu: 'Дубай', nameEn: 'Dubai', countryRu: 'ОАЭ', countryEn: 'UAE', lat: 25.0772, lon: 55.3093 },
    { nameRu: 'Париж', nameEn: 'Paris', countryRu: 'Франция', countryEn: 'France', lat: 48.8534, lon: 2.3488 }
  ];

  // --- App State ---
  const state = {
    lang: localStorage.getItem('aura_lang') || 'ru',
    unitTemp: localStorage.getItem('aura_unit_temp') || 'C', // 'C' | 'F'
    currentLocation: {
      name: 'Москва',
      country: 'Россия',
      lat: 55.7522,
      lon: 37.6156
    },
    weatherData: null,
    favorites: JSON.parse(localStorage.getItem('aura_favorites') || '[]'),
    searchDebounceTimer: null
  };

  // --- DOM Elements ---
  const el = {
    body: document.body,
    searchInput: document.getElementById('city-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    searchSpinner: document.getElementById('search-spinner'),
    searchDropdown: document.getElementById('search-results-dropdown'),
    btnGeo: document.getElementById('btn-geolocation'),
    btnUnit: document.getElementById('btn-unit-toggle'),
    unitLabel: document.getElementById('unit-label'),
    btnLang: document.getElementById('btn-lang-toggle'),
    langLabel: document.getElementById('lang-label'),
    btnRefresh: document.getElementById('btn-refresh'),
    quickCitiesList: document.getElementById('quick-cities-list'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    errorMessage: document.getElementById('error-message'),
    errorRetryBtn: document.getElementById('error-retry-btn'),
    weatherContent: document.getElementById('weather-content'),
    currentCity: document.getElementById('current-city'),
    currentCountry: document.getElementById('current-country'),
    currentTime: document.getElementById('current-time'),
    favoriteBtn: document.getElementById('favorite-btn'),
    heroIcon: document.getElementById('hero-weather-icon'),
    currentTemp: document.getElementById('current-temp'),
    currentCondition: document.getElementById('current-condition'),
    feelsLikeText: document.getElementById('feels-like-text'),
    tempHighLow: document.getElementById('temp-high-low'),
    todaySummary: document.getElementById('today-summary'),
    hourlySlider: document.getElementById('hourly-slider'),
    dailyList: document.getElementById('daily-forecast-list'),
    windSpeed: document.getElementById('wind-speed'),
    windUnit: document.getElementById('wind-unit'),
    windGusts: document.getElementById('wind-gusts'),
    windDirectionText: document.getElementById('wind-direction-text'),
    compassArrow: document.getElementById('compass-arrow'),
    uvIndexVal: document.getElementById('uv-index-val'),
    uvCategory: document.getElementById('uv-category'),
    uvProgress: document.getElementById('uv-progress'),
    uvAdvice: document.getElementById('uv-advice'),
    humidityVal: document.getElementById('humidity-val'),
    humidityProgress: document.getElementById('humidity-progress'),
    dewPointText: document.getElementById('dew-point-text'),
    pressureVal: document.getElementById('pressure-val'),
    pressureUnit: document.getElementById('pressure-unit'),
    pressureHpa: document.getElementById('pressure-hpa'),
    pressureStatus: document.getElementById('pressure-status'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    sunPositionDot: document.getElementById('sun-position-dot'),
    precipAmount: document.getElementById('precip-amount'),
    precipProb: document.getElementById('precip-prob'),
    cloudCoverText: document.getElementById('cloud-cover-text'),
    toastContainer: document.getElementById('toast-container')
  };

  // --- Helpers & Conversions ---
  const convertTemp = (tempC) => {
    if (state.unitTemp === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const formatTemp = (tempC) => {
    const val = convertTemp(tempC);
    return `${val > 0 ? '+' : ''}${val}°`;
  };

  const getConditionInfo = (code, isDay = 1) => {
    const dict = I18N[state.lang];
    const text = dict.weather_codes[code] || dict.weather_codes[0];
    let icon = SVG_ICONS.sun;
    let themeClass = isDay ? 'theme-clear-day' : 'theme-clear-night';

    if (code === 0) {
      icon = isDay ? SVG_ICONS.sun : SVG_ICONS.moon;
      themeClass = isDay ? 'theme-clear-day' : 'theme-clear-night';
    } else if (code === 1 || code === 2) {
      icon = isDay ? SVG_ICONS.cloudSun : SVG_ICONS.cloudMoon;
      themeClass = isDay ? 'theme-clouds-day' : 'theme-clouds-night';
    } else if (code === 3) {
      icon = SVG_ICONS.cloud;
      themeClass = isDay ? 'theme-clouds-day' : 'theme-clouds-night';
    } else if (code >= 45 && code <= 48) {
      icon = SVG_ICONS.fog;
      themeClass = 'theme-fog';
    } else if (code >= 51 && code <= 57) {
      icon = SVG_ICONS.drizzle;
      themeClass = 'theme-rain';
    } else if (code >= 61 && code <= 67) {
      icon = SVG_ICONS.rain;
      themeClass = 'theme-rain';
    } else if (code >= 71 && code <= 77) {
      icon = SVG_ICONS.snow;
      themeClass = 'theme-snow';
    } else if (code >= 80 && code <= 82) {
      icon = SVG_ICONS.rain;
      themeClass = 'theme-rain';
    } else if (code >= 85 && code <= 86) {
      icon = SVG_ICONS.snow;
      themeClass = 'theme-snow';
    } else if (code >= 95) {
      icon = SVG_ICONS.thunderstorm;
      themeClass = 'theme-thunderstorm';
    }

    return { text, icon, themeClass };
  };

  const getWindDirection = (degree) => {
    const dict = I18N[state.lang];
    const index = Math.round(degree / 22.5) % 16;
    return {
      short: dict.wind_dirs[index],
      full: dict.wind_names[index]
    };
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  // --- API Integrations ---
  const fetchWeather = async (lat, lon, cityName, countryName) => {
    setLoading(true);
    setError(false);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      state.weatherData = data;
      state.currentLocation = { name: cityName, country: countryName, lat, lon };

      renderWeather();
      updateFavoritesButtonState();
      renderQuickCities();
    } catch (err) {
      console.error('Fetch weather error:', err);
      setError(true, err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchLocations = async (query) => {
    if (!query || query.trim().length < 2) {
      el.searchDropdown.classList.add('hidden');
      el.searchSpinner.classList.add('hidden');
      return;
    }

    el.searchSpinner.classList.remove('hidden');

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=${state.lang}&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      renderSearchResults(data.results || []);
    } catch (err) {
      console.error('Geocoding search error:', err);
      el.searchDropdown.classList.add('hidden');
    } finally {
      el.searchSpinner.classList.add('hidden');
    }
  };

  // --- Render Functions ---
  const renderWeather = () => {
    if (!state.weatherData) return;
    const { current, daily, hourly } = state.weatherData;
    const dict = I18N[state.lang];

    // Current Header
    el.currentCity.textContent = state.currentLocation.name;
    el.currentCountry.textContent = state.currentLocation.country || '';

    // Local time formatting
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    el.currentTime.textContent = `${now.toLocaleDateString(state.lang === 'ru' ? 'ru-RU' : 'en-US', dateOptions)}, ${now.toLocaleTimeString(state.lang === 'ru' ? 'ru-RU' : 'en-US', timeOptions)}`;

    // Current Condition & Theme
    const cond = getConditionInfo(current.weather_code, current.is_day);
    el.body.className = cond.themeClass;
    el.heroIcon.innerHTML = cond.icon;
    el.currentCondition.textContent = cond.text;

    // Current Temperature
    const cTemp = convertTemp(current.temperature_2m);
    el.currentTemp.textContent = `${cTemp > 0 ? '+' : ''}${cTemp}`;
    el.unitLabel.textContent = `°${state.unitTemp}`;

    const feelsLikeVal = formatTemp(current.apparent_temperature);
    el.feelsLikeText.textContent = `${dict.feels_like} ${feelsLikeVal}`;

    const todayMax = formatTemp(daily.temperature_2m_max[0]);
    const todayMin = formatTemp(daily.temperature_2m_min[0]);
    el.tempHighLow.textContent = `${dict.min}: ${todayMin} / ${dict.max}: ${todayMax}`;

    // Summary Text
    let summary = cond.text;
    if (current.precipitation > 0) {
      summary += `. ${state.lang === 'ru' ? 'Идут осадки' : 'Precipitation is falling'}: ${current.precipitation} mm.`;
    } else {
      summary += `. ${state.lang === 'ru' ? 'Осадков в данный момент нет' : 'No current precipitation'}.`;
    }
    el.todaySummary.textContent = summary;

    // Hourly Forecast (Next 24 Hours)
    renderHourlyForecast(hourly);

    // 7-Day Forecast
    renderDailyForecast(daily);

    // Detailed Metric Cards
    renderAtmosphericMetrics(current, daily);
  };

  const renderHourlyForecast = (hourly) => {
    el.hourlySlider.innerHTML = '';
    const now = new Date();
    const currentHour = now.getHours();

    // Find the starting index for current hour
    let startIdx = 0;
    if (hourly.time && hourly.time.length) {
      const nowIsoHour = now.toISOString().slice(0, 13);
      const idx = hourly.time.findIndex(t => t.startsWith(nowIsoHour));
      if (idx !== -1) startIdx = idx;
    }

    const dict = I18N[state.lang];
    const count = Math.min(24, hourly.time.length - startIdx);

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const timeStr = hourly.time[idx];
      const hourDate = new Date(timeStr);
      const isFirst = i === 0;

      const hourLabel = isFirst ? dict.now : `${String(hourDate.getHours()).padStart(2, '0')}:00`;
      const temp = formatTemp(hourly.temperature_2m[idx]);
      const code = hourly.weather_code[idx];
      const isDayHour = hourDate.getHours() >= 6 && hourDate.getHours() < 21 ? 1 : 0;
      const iconHtml = getConditionInfo(code, isDayHour).icon;
      const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;

      const card = document.createElement('div');
      card.className = `hour-card ${isFirst ? 'active' : ''}`;
      card.innerHTML = `
        <span class="hour-time">${hourLabel}</span>
        <div class="hour-icon">${iconHtml}</div>
        <span class="hour-precip-badge">${precipProb > 10 ? `${precipProb}%` : ''}</span>
        <span class="hour-temp">${temp}</span>
      `;
      el.hourlySlider.appendChild(card);
    }
  };

  const renderDailyForecast = (daily) => {
    el.dailyList.innerHTML = '';
    const dict = I18N[state.lang];

    // Find min and max across all 7 days for relative bar rendering
    const allMins = daily.temperature_2m_min.slice(0, 7);
    const allMaxs = daily.temperature_2m_max.slice(0, 7);
    const globalMin = Math.min(...allMins);
    const globalMax = Math.max(...allMaxs);
    const globalRange = Math.max(1, globalMax - globalMin);

    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = new Date(daily.time[i]);
      const dayName = i === 0 ? dict.today : dict.days[date.getDay()];
      const code = daily.weather_code[i];
      const condInfo = getConditionInfo(code, 1);
      const minTemp = daily.temperature_2m_min[i];
      const maxTemp = daily.temperature_2m_max[i];

      // Relative bar coordinates (percentage)
      const leftPercent = Math.max(0, Math.min(90, ((minTemp - globalMin) / globalRange) * 100));
      const rightPercent = Math.max(leftPercent + 10, Math.min(100, ((maxTemp - globalMin) / globalRange) * 100));
      const widthPercent = rightPercent - leftPercent;

      const row = document.createElement('div');
      row.className = 'daily-row';
      row.innerHTML = `
        <span class="daily-day">${dayName}</span>
        <div class="daily-icon">${condInfo.icon}</div>
        <span class="daily-condition" title="${condInfo.text}">${condInfo.text}</span>
        <span class="daily-temp-min">${formatTemp(minTemp)}</span>
        <div class="daily-range-bar-track">
          <div class="daily-range-bar-fill" style="left: ${leftPercent.toFixed(1)}%; width: ${widthPercent.toFixed(1)}%;"></div>
        </div>
        <span class="daily-temp-max">${formatTemp(maxTemp)}</span>
      `;
      el.dailyList.appendChild(row);
    }
  };

  const renderAtmosphericMetrics = (current, daily) => {
    const dict = I18N[state.lang];

    // 1. Wind & Compass
    const windSpeedKmH = Math.round(current.wind_speed_10m);
    const gustsKmH = Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3);
    el.windSpeed.textContent = windSpeedKmH;
    el.windUnit.textContent = dict.wind_units.kmh;
    el.windGusts.textContent = `${dict.wind_gusts} ${gustsKmH} ${dict.wind_units.kmh}`;

    const windDir = getWindDirection(current.wind_direction_10m);
    el.windDirectionText.textContent = `${windDir.full} (${windDir.short})`;
    el.compassArrow.style.transform = `rotate(${current.wind_direction_10m}deg)`;

    // 2. UV Index
    const uvMax = Math.round(daily.uv_index_max ? daily.uv_index_max[0] : 1);
    el.uvIndexVal.textContent = uvMax;

    let uvTier = 0;
    if (uvMax <= 2) uvTier = 0;
    else if (uvMax <= 5) uvTier = 1;
    else if (uvMax <= 7) uvTier = 2;
    else if (uvMax <= 10) uvTier = 3;
    else uvTier = 4;

    el.uvCategory.textContent = dict.uv_levels[uvTier];
    el.uvProgress.style.width = `${Math.min(100, (uvMax / 11) * 100)}%`;
    el.uvAdvice.textContent = dict.uv_tips[uvTier];

    // 3. Humidity & Dew Point
    const humidity = current.relative_humidity_2m;
    el.humidityVal.textContent = humidity;
    el.humidityProgress.style.width = `${humidity}%`;

    // Magnus-Tetens approximation for dew point
    const t = current.temperature_2m;
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * t) / (b + t)) + Math.log(humidity / 100.0);
    const dewPoint = (b * alpha) / (a - alpha);
    el.dewPointText.textContent = `${dict.dew_point}: ${formatTemp(dewPoint)}.`;

    // 4. Pressure
    const pressureHpa = Math.round(current.pressure_msl);
    const pressureMmHg = Math.round(pressureHpa * 0.750062);
    el.pressureVal.textContent = pressureMmHg;
    el.pressureUnit.textContent = dict.pressure_units.mmhg;
    el.pressureHpa.textContent = `${pressureHpa} ${dict.pressure_units.hpa}`;

    if (pressureMmHg < 748) {
      el.pressureStatus.textContent = dict.pressure_trends.low;
    } else if (pressureMmHg > 762) {
      el.pressureStatus.textContent = dict.pressure_trends.high;
    } else {
      el.pressureStatus.textContent = dict.pressure_trends.normal;
    }

    // 5. Sunrise & Sunset Solar Arc
    if (daily.sunrise && daily.sunset) {
      const sunrise = new Date(daily.sunrise[0]);
      const sunset = new Date(daily.sunset[0]);
      const timeFmt = { hour: '2-digit', minute: '2-digit' };
      el.sunriseTime.textContent = sunrise.toLocaleTimeString([], timeFmt);
      el.sunsetTime.textContent = sunset.toLocaleTimeString([], timeFmt);

      const now = new Date();
      const totalDaylightMs = sunset - sunrise;
      const elapsedMs = now - sunrise;
      let ratio = elapsedMs / totalDaylightMs;
      ratio = Math.max(0, Math.min(1, ratio));

      // Calculate SVG point along Quadratic curve: M 20 80 Q 100 10 180 80
      // B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
      const tParam = ratio;
      const p0 = { x: 20, y: 80 };
      const p1 = { x: 100, y: 10 };
      const p2 = { x: 180, y: 80 };

      const cx = Math.round((1 - tParam) * (1 - tParam) * p0.x + 2 * (1 - tParam) * tParam * p1.x + tParam * tParam * p2.x);
      const cy = Math.round((1 - tParam) * (1 - tParam) * p0.y + 2 * (1 - tParam) * tParam * p1.y + tParam * tParam * p2.y);

      el.sunPositionDot.setAttribute('cx', cx);
      el.sunPositionDot.setAttribute('cy', cy);
      el.sunPositionDot.style.opacity = (ratio > 0 && ratio < 1) ? '1' : '0.3';
    }

    // 6. Precipitation & Clouds
    const precipSum = daily.precipitation_sum ? daily.precipitation_sum[0].toFixed(1) : '0.0';
    const precipProbMax = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    el.precipAmount.textContent = precipSum;
    el.precipProb.textContent = `${dict.precip_prob}: ${precipProbMax}%`;

    // Estimate cloud cover from weather code or default
    let cloudPct = 20;
    if (current.weather_code === 3) cloudPct = 95;
    else if (current.weather_code === 2) cloudPct = 60;
    else if (current.weather_code === 1) cloudPct = 35;
    else if (current.weather_code >= 50) cloudPct = 100;
    el.cloudCoverText.textContent = `${dict.cloud_cover}: ${cloudPct}%`;
  };

  const renderSearchResults = (results) => {
    el.searchDropdown.innerHTML = '';

    if (!results || results.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'dropdown-empty';
      empty.textContent = state.lang === 'ru' ? 'Город не найден' : 'No locations found';
      el.searchDropdown.appendChild(empty);
      el.searchDropdown.classList.remove('hidden');
      return;
    }

    results.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.setAttribute('role', 'option');

      const admin = item.admin1 ? `${item.admin1}, ` : '';
      const country = item.country || '';

      li.innerHTML = `
        <div class="dropdown-city">
          <span>${item.name}</span>
        </div>
        <div class="dropdown-meta">${admin}${country}</div>
      `;

      li.addEventListener('click', () => {
        el.searchInput.value = '';
        el.searchClearBtn.classList.add('hidden');
        el.searchDropdown.classList.add('hidden');
        fetchWeather(item.latitude, item.longitude, item.name, item.country || '');
      });

      el.searchDropdown.appendChild(li);
    });

    el.searchDropdown.classList.remove('hidden');
  };

  const renderQuickCities = () => {
    el.quickCitiesList.innerHTML = '';

    // 1. User Favorites
    state.favorites.forEach((fav) => {
      const chip = document.createElement('button');
      chip.className = `quick-chip ${state.currentLocation.name === fav.name ? 'active' : ''}`;
      chip.innerHTML = `
        <svg class="chip-fav-icon" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span>${fav.name}</span>
      `;
      chip.addEventListener('click', () => {
        fetchWeather(fav.lat, fav.lon, fav.name, fav.country);
      });
      el.quickCitiesList.appendChild(chip);
    });

    // 2. Predefined Popular Cities (filter out duplicates)
    DEFAULT_POPULAR_CITIES.forEach((item) => {
      const name = state.lang === 'ru' ? item.nameRu : item.nameEn;
      const country = state.lang === 'ru' ? item.countryRu : item.countryEn;

      // Don't duplicate if already in favorites
      if (state.favorites.some(f => f.name.toLowerCase() === name.toLowerCase())) {
        return;
      }

      const chip = document.createElement('button');
      chip.className = `quick-chip ${state.currentLocation.name === name ? 'active' : ''}`;
      chip.innerHTML = `<span>${name}</span>`;
      chip.addEventListener('click', () => {
        fetchWeather(item.lat, item.lon, name, country);
      });
      el.quickCitiesList.appendChild(chip);
    });
  };

  const updateFavoritesButtonState = () => {
    const isFav = state.favorites.some(
      f => f.name.toLowerCase() === state.currentLocation.name.toLowerCase()
    );
    if (isFav) {
      el.favoriteBtn.classList.add('favorited');
    } else {
      el.favoriteBtn.classList.remove('favorited');
    }
  };

  const toggleFavorite = () => {
    const isFav = state.favorites.some(
      f => f.name.toLowerCase() === state.currentLocation.name.toLowerCase()
    );
    const dict = I18N[state.lang];

    if (isFav) {
      state.favorites = state.favorites.filter(
        f => f.name.toLowerCase() !== state.currentLocation.name.toLowerCase()
      );
      showToast(dict.removed_city);
    } else {
      state.favorites.push({
        name: state.currentLocation.name,
        country: state.currentLocation.country,
        lat: state.currentLocation.lat,
        lon: state.currentLocation.lon
      });
      showToast(dict.saved_city);
    }

    localStorage.setItem('aura_favorites', JSON.stringify(state.favorites));
    updateFavoritesButtonState();
    renderQuickCities();
  };

  const applyLanguage = () => {
    const dict = I18N[state.lang];
    document.documentElement.lang = state.lang;
    el.langLabel.textContent = state.lang.toUpperCase();

    // Update all static i18n data tags
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (dict[key]) node.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (dict[key]) node.setAttribute('placeholder', dict[key]);
    });

    // Re-render UI with new language
    if (state.weatherData) {
      renderWeather();
    }
    renderQuickCities();
  };

  const setLoading = (loading) => {
    if (loading) {
      el.loadingState.classList.remove('hidden');
      el.weatherContent.classList.add('hidden');
      el.errorState.classList.add('hidden');
    } else {
      el.loadingState.classList.add('hidden');
      el.weatherContent.classList.remove('hidden');
    }
  };

  const setError = (hasError, message = '') => {
    if (hasError) {
      el.errorState.classList.remove('hidden');
      el.weatherContent.classList.add('hidden');
      el.loadingState.classList.add('hidden');
      if (message) el.errorMessage.textContent = message;
    } else {
      el.errorState.classList.add('hidden');
    }
  };

  // --- Geolocation ---
  const requestUserLocation = () => {
    const dict = I18N[state.lang];
    if (!navigator.geolocation) {
      showToast('Геолокация не поддерживается вашим браузером');
      return;
    }

    showToast(state.lang === 'ru' ? 'Определяем координаты...' : 'Locating...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocoding lookup
          const revUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)}&count=1&language=${state.lang}&format=json`;
          fetchWeather(latitude, longitude, state.lang === 'ru' ? 'Текущее место' : 'Current Location', '');
          showToast(dict.geo_success);
        } catch (e) {
          fetchWeather(latitude, longitude, 'GPS', '');
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        showToast(dict.geo_denied);
      },
      { timeout: 8000 }
    );
  };

  // --- Event Listeners Setup ---
  const setupEventListeners = () => {
    // Search Input Debouncing
    el.searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length > 0) {
        el.searchClearBtn.classList.remove('hidden');
      } else {
        el.searchClearBtn.classList.add('hidden');
        el.searchDropdown.classList.add('hidden');
      }

      clearTimeout(state.searchDebounceTimer);
      state.searchDebounceTimer = setTimeout(() => {
        searchLocations(query);
      }, 320);
    });

    // Clear Search Input
    el.searchClearBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClearBtn.classList.add('hidden');
      el.searchDropdown.classList.add('hidden');
      el.searchInput.focus();
    });

    // Close Dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        el.searchDropdown.classList.add('hidden');
      }
    });

    // Geolocation button
    el.btnGeo.addEventListener('click', requestUserLocation);

    // Temperature Unit toggle (°C <-> °F)
    el.btnUnit.addEventListener('click', () => {
      state.unitTemp = state.unitTemp === 'C' ? 'F' : 'C';
      localStorage.setItem('aura_unit_temp', state.unitTemp);
      renderWeather();
    });

    // Language toggle (RU <-> EN)
    el.btnLang.addEventListener('click', () => {
      state.lang = state.lang === 'ru' ? 'en' : 'ru';
      localStorage.setItem('aura_lang', state.lang);
      applyLanguage();
    });

    // Refresh button
    el.btnRefresh.addEventListener('click', () => {
      fetchWeather(
        state.currentLocation.lat,
        state.currentLocation.lon,
        state.currentLocation.name,
        state.currentLocation.country
      );
    });

    // Favorite Button
    el.favoriteBtn.addEventListener('click', toggleFavorite);

    // Retry Button in error state
    el.errorRetryBtn.addEventListener('click', () => {
      fetchWeather(
        state.currentLocation.lat,
        state.currentLocation.lon,
        state.currentLocation.name,
        state.currentLocation.country
      );
    });

    // Brand click returns to default city (Moscow)
    document.querySelector('.brand').addEventListener('click', () => {
      fetchWeather(55.7522, 37.6156, state.lang === 'ru' ? 'Москва' : 'Moscow', state.lang === 'ru' ? 'Россия' : 'Russia');
    });
  };

  // --- App Initialization ---
  const init = () => {
    applyLanguage();
    setupEventListeners();
    renderQuickCities();

    // Initial weather load
    fetchWeather(
      state.currentLocation.lat,
      state.currentLocation.lon,
      state.lang === 'ru' ? 'Москва' : 'Moscow',
      state.lang === 'ru' ? 'Россия' : 'Russia'
    );
  };

  // Kickstart on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
