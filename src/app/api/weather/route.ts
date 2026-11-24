import { getWeather } from "@/lib/weather";
import { locationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = locationSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Enter a valid location." }, { status: 400 });
    return Response.json(await getWeather(parsed.data));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to retrieve weather." }, { status: 502 });
  }
}
