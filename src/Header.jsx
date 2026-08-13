import { useState, useEffect, useCallback } from "react";
import "./Header.css";

const categories = [
  { label: "General", value: "general" },
  { label: "Health", value: "health" },
  { label: "Business", value: "business" },
  { label: "Science", value: "science" },
  { label: "Technology", value: "tech" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Sports", value: "sports" },
];

export function useWeatherByLocation({ apiKey, units = "metric" } = {}) {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (geoError) => {
        setError(geoErrorMessage(geoError.code));
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (!coords) return;

    if (!apiKey) {
      setError("Missing OpenWeatherMap API key.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      const url = new URL("https://api.openweathermap.org/data/2.5/weather");
      url.searchParams.set("lat", coords.lat);
      url.searchParams.set("lon", coords.lon);
      url.searchParams.set("appid", apiKey);
      url.searchParams.set("units", units);

      try {
        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            body.message || `Weather API error (${response.status})`,
          );
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch weather.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [coords, apiKey, units]);

  return { weather, coords, loading, error, refetch: getLocation };
}

function geoErrorMessage(code) {
  switch (code) {
    case 1:
      return "Location permission was denied.";
    case 2:
      return "Location information is unavailable.";
    case 3:
      return "Getting your location timed out.";
    default:
      return "An unknown geolocation error occurred.";
  }
}

function Header({ selectedCategory, onSelectCategory }) {
  const formattedDate = new Date().toLocaleDateString("en-UK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { weather, loading, error } = useWeatherByLocation({
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: "metric",
  });

  const weatherIconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;

  const weatherDescription =
    weather?.weather?.[0]?.description || "Current weather";

  const weatherText = loading
    ? "Loading weather…"
    : error
      ? error
      : !weather
        ? "Weather unavailable"
        : `${Math.round(weather.main.temp)}°C`;

  return (
    <section className="header-section">
      <div className="header-shell">
        <header className="header">
          <div className="brand-block">
            <p className="eyebrow">Daily briefing</p>
            <h1 className="app-title">Veritas</h1>
            <p className="tagline">
              Trusted stories, clear context, and a calmer way to stay informed.
            </p>
          </div>

          <div className="header-date-group">
            <div
              className="date-pill"
              aria-label="Current date and temperature"
            >
              {formattedDate}
              {weatherIconUrl && (
                <img
                  className="weather-icon"
                  src={weatherIconUrl}
                  alt={weatherDescription}
                  title={weatherDescription}
                />
              )}
              {weatherText}
            </div>
          </div>
        </header>

        <nav className="nav" aria-label="News categories">
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                className={`nav-buttons${isActive ? " active" : ""}`}
                onClick={() => onSelectCategory(category.value)}
                aria-pressed={isActive}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

        <div className="nav-dropdown-wrap">
          <label className="sr-only" htmlFor="category-select">
            Select category
          </label>
          <select
            id="category-select"
            className="nav-dropdown"
            value={selectedCategory || "general"}
            onChange={(event) => onSelectCategory(event.target.value)}
            aria-label="Select news category"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default Header;
