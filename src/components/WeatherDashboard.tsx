"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { LocationForm } from "@/lib/validation";
import type { WeatherResult } from "@/lib/types";

const reveal: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .55, ease: "easeOut" } } };

function weatherTone(condition = "") {
  const value = condition.toLowerCase();
  if (value.includes("thunder") || value.includes("storm")) return "storm";
  if (value.includes("rain") || value.includes("drizzle")) return "rain";
  if (value.includes("clear") || value.includes("sun")) return "sunny";
  return "cloudy";
}

function WeatherImage({ icon, size = "large" }: { icon?: string; size?: "large" | "small" }) {
  if (!icon) return <span aria-hidden="true" className={size === "large" ? "weather-orb" : "weather-dot"}>☼</span>;
  return <img className={size === "large" ? "weather-icon-large" : "weather-icon-small"} alt="" src={`https://openweathermap.org/img/wn/${icon}${size === "large" ? "@2x" : ""}.png`} />;
}

export default function WeatherDashboard() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LocationForm>();
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const search = async (data: LocationForm) => {
    setLoading(true); setError(""); setSaved(false);
    try {
      const response = await fetch("/api/weather", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      setWeather(json);
    } catch (e) { setError(e instanceof Error ? e.message : "Search failed."); }
    finally { setLoading(false); }
  };
  const locate = () => navigator.geolocation?.getCurrentPosition((p) => {
    setValue("query", "My current location");
    void search({ query: "My current location", latitude: p.coords.latitude, longitude: p.coords.longitude });
  }, () => setError("Location access was not available."));
  const save = async () => {
    if (!weather?.location.latitude || !weather.location.longitude) return;
    const now = new Date();
    const response = await fetch("/api/searches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      locationName: weather.location.name, country: weather.location.country, latitude: weather.location.latitude, longitude: weather.location.longitude,
      weatherCondition: weather.current.condition, temperature: weather.current.temperature, humidity: weather.current.humidity, windSpeed: weather.current.windSpeed,
      startDate: now.toISOString(), endDate: new Date(now.getTime() + 4 * 86400000).toISOString(), notes: "",
    }) });
    if (response.ok) setSaved(true); else setError("Unable to save this search.");
  };

  const tone = weatherTone(weather?.current.condition);
  const hourly = weather?.forecast.slice(0, 5) ?? [];
  return (
    <motion.section className="dashboard" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .08 } } }}>
      <motion.div className="dashboard-heading" variants={reveal}>
        <div><p className="eyebrow">Weather intelligence</p><h1>Find your next clear sky.</h1><p className="muted">A calmer way to understand the weather around you.</p></div>
        <p className="micro">Updated moments ago · <span className="status-dot" /> Live forecast</p>
      </motion.div>

      <motion.form className="glass-card search-panel" onSubmit={handleSubmit(search)} aria-label="Weather search" variants={reveal}>
        <div className="search-row">
          <div className="search-input-wrap"><label className="sr-only" htmlFor="query">Search by city, country, postal code, landmark, or coordinates</label><span aria-hidden="true">⌕</span><input id="query" {...register("query", { required: "Enter a location." })} placeholder="Search a city, country, or landmark" /></div>
          <button className="btn btn-primary" disabled={loading}>{loading ? "Searching..." : "Search weather"}</button>
          <button type="button" className="btn btn-secondary" onClick={locate}>⌖ <span className="mobile-hide">Use location</span></button>
        </div>
        {errors.query && <p className="error">{errors.query.message}</p>}{error && <p className="error" role="alert">{error}</p>}
      </motion.form>

      <AnimatePresence mode="wait">
        {loading && <motion.div className="glass-card weather-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="skeleton-line wide" /><div className="skeleton-temp" /><div className="skeleton-line" /></motion.div>}
        {weather && !loading && <motion.div key={weather.location.name} className="dashboard" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .1 } } }}>
          <motion.article className={`glass-card weather-hero ${tone}`} variants={reveal}>
            <div className="hero-top"><div><p className="eyebrow">Current conditions</p><p className="location-label">◉ {weather.location.name}{weather.location.country ? `, ${weather.location.country}` : ""} <span>· Today</span></p></div><button className="btn btn-secondary" onClick={save}>{saved ? "✓ Saved" : "＋ Save place"}</button></div>
            <div className="hero-main"><div className="hero-temp"><strong>{weather.current.temperature}°</strong><sup>C</sup><motion.div animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><WeatherImage icon={weather.current.icon} /></motion.div></div><div className="condition-copy"><p className="capitalize">{weather.current.condition}</p><small>Feels like {weather.current.feelsLike}° · High/low forecast below</small></div></div>
            <div className="metric-strip"><div className="metric"><span>HUMIDITY</span><strong>{weather.current.humidity}%</strong></div><div className="metric"><span>WIND</span><strong>{weather.current.windSpeed} km/h</strong></div><div className="metric"><span>VISIBILITY</span><strong>{weather.current.visibility} km</strong></div><div className="metric"><span>AIR QUALITY</span><strong>{weather.current.airQuality ? `AQI ${weather.current.airQuality}` : "Good"}</strong></div></div>
          </motion.article>

          <motion.section variants={reveal}><div className="section-heading"><h2>Today’s forecast</h2><span className="micro">Hourly outlook</span></div><div className="hourly-scroller">{hourly.map((day, index) => <motion.div className={`hourly-card ${index === 0 ? "active" : ""}`} key={day.date} whileHover={{ y: -5, scale: 1.02 }}><span className="micro">{index === 0 ? "Now" : `${String(index + 1).padStart(2, "0")}:00`}</span><WeatherImage icon={day.icon} size="small" /><strong>{index === 0 ? weather.current.temperature : day.high}°</strong></motion.div>)}</div></motion.section>

          <motion.section variants={reveal}><div className="section-heading"><h2>Five-day forecast</h2><span className="micro">Plan ahead</span></div><div className="forecast-grid">{weather.forecast.map((day, index) => <motion.div className="forecast-card" key={day.date} variants={reveal} whileHover={{ y: -6 }}><div><strong>{new Date(day.date).toLocaleDateString(undefined, { weekday: "long" })}</strong><p className="micro">{new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p></div><WeatherImage icon={day.icon} size="small" /><div><p className="temp"><strong>{day.high}°</strong> <span>/ {day.low}°</span></p><p className="micro capitalize">{day.condition} · {day.precipitationChance}% rain</p></div></motion.div>)}</div></motion.section>

          <motion.section className="insights" variants={reveal}><h3>✦ Weather intelligence</h3>{weather.insights.map((insight) => <p key={insight}>› {insight}</p>)}</motion.section>
          <motion.section variants={reveal}><div className="section-heading"><h2>Explore the area</h2></div><div className="explore-grid"><a className="explore-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weather.location.name)}`}><span>Open map</span><span>↗</span></a><a className="explore-link" target="_blank" rel="noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${weather.location.name} travel`)}`}><span>Travel videos</span><span>↗</span></a><a className="explore-link" target="_blank" rel="noreferrer" href={`https://restcountries.com/v3.1/alpha/${weather.location.country ?? "us"}`}><span>Country context</span><span>↗</span></a></div></motion.section>
        </motion.div>}
      </AnimatePresence>
    </motion.section>
  );
}
