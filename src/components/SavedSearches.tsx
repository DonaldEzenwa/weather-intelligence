"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { SavedSearch } from "@/lib/types";

export default function SavedSearches() {
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    try { setLoading(true); const response = await fetch("/api/searches"); const json = await response.json(); if (!response.ok) throw new Error(json.error); setItems(json); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load saved searches."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const remove = async (id: string) => { if (!window.confirm("Delete this saved weather search?")) return; const response = await fetch(`/api/searches/${id}`, { method: "DELETE" }); if (!response.ok) setError("Unable to delete this search."); else void load(); };
  const update = async (item: SavedSearch) => { const response = await fetch(`/api/searches/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes }) }); if (!response.ok) setError("Unable to update this search."); else { setEditing(null); void load(); } };
  return <motion.section className="saved-page" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
    <div className="saved-heading"><div><p className="eyebrow">Your collection</p><h1>Saved places.</h1><p className="muted">Keep your favorite skies close at hand.</p></div><div className="export-actions"><a className="btn btn-secondary" href="/api/exports?format=csv">↓ CSV</a><a className="btn btn-secondary" href="/api/exports?format=json">↓ JSON</a><a className="btn btn-secondary" href="/api/exports?format=markdown">↓ Markdown</a></div></div>
    {error && <p className="error" role="alert">{error}</p>}
    {loading ? <div className="glass-card weather-skeleton"><div className="skeleton-line wide" /><div className="skeleton-line" /></div> : items.length === 0 ? <div className="glass-card empty-state"><p className="eyebrow">Nothing here yet</p><h2>Your saved places will appear here.</h2><p className="muted">Search a city and save it to build your personal weather collection.</p><a className="btn btn-primary" href="/">Explore weather</a></div> : <div className="table-wrap"><table><caption className="sr-only">Saved weather searches</caption><thead><tr><th>Place</th><th>Conditions</th><th>Date range</th><th>Notes</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map((item, index) => <motion.tr key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><td><strong>{item.locationName}</strong><br /><small className="muted">{item.country ?? "Unknown country"} · {new Date(item.searchedAt).toLocaleDateString()}</small></td><td><span className="capitalize">{item.weatherCondition}</span><br /><small>{item.temperature}° · {item.humidity}% humidity</small></td><td>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</td><td>{editing === item.id ? <div className="edit-notes"><input aria-label={`Notes for ${item.locationName}`} value={notes} onChange={(event) => setNotes(event.target.value)} /><button className="btn btn-primary" onClick={() => update(item)}>Save</button></div> : item.notes || "—"}</td><td><div className="button-row"><button className="btn btn-secondary" onClick={() => { setEditing(item.id); setNotes(item.notes ?? ""); }}>Edit</button><button className="btn btn-danger" onClick={() => remove(item.id)}>Delete</button></div></td></motion.tr>)}</tbody></table></div>}
  </motion.section>;
}
