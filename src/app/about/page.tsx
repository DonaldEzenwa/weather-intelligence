"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return <motion.section className="saved-page" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
    <div><p className="eyebrow">The idea behind atmos</p><h1>Weather, with a little more feeling.</h1><p className="muted">A focused weather intelligence experience built for calm decisions and better days outside.</p></div>
    <div className="explore-grid"><article className="glass-card" style={{ padding: 24 }}><p className="eyebrow">01</p><h2>Built for decisions</h2><p className="muted">Search a city, postal code, landmark, or coordinates, then review a concise forecast and practical recommendation.</p></article><article className="glass-card" style={{ padding: 24 }}><p className="eyebrow">02</p><h2>Thoughtful by default</h2><p className="muted">Live weather is supplied by OpenWeather when configured. Searches are stored only when you choose Save.</p></article><article className="glass-card" style={{ padding: 24 }}><p className="eyebrow">03</p><h2>Made for everyone</h2><p className="muted">Semantic landmarks, keyboard-friendly controls, visible errors, and responsive layouts keep the experience welcoming.</p></article></div>
  </motion.section>;
}
