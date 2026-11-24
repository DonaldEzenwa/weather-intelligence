import { listSaved } from "@/lib/saved-search-store";

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") ?? "json";
  const data = await listSaved();
  if (format === "json") return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": "attachment; filename=weather-searches.json" } });
  if (format === "csv") {
    const fields = ["id", "locationName", "country", "latitude", "longitude", "weatherCondition", "temperature", "humidity", "windSpeed", "startDate", "endDate", "searchedAt", "notes"];
    const csv = [fields.join(","), ...data.map((item) => fields.map((field) => `"${String(item[field as keyof typeof item] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=weather-searches.csv" } });
  }
  if (format === "markdown") {
    const markdown = ["# Weather searches", "", ...data.map((item) => `## ${item.locationName}${item.country ? `, ${item.country}` : ""}\n- Condition: ${item.weatherCondition}\n- Temperature: ${item.temperature}°\n- Humidity: ${item.humidity}%\n- Wind: ${item.windSpeed} km/h\n- Date range: ${item.startDate} to ${item.endDate}\n- Notes: ${item.notes || "—"}`)].join("\n");
    return new Response(markdown, { headers: { "Content-Type": "text/markdown", "Content-Disposition": "attachment; filename=weather-searches.md" } });
  }
  return Response.json({ error: "Unsupported export format." }, { status: 400 });
}
