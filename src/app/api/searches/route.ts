import { createSaved, listSaved } from "@/lib/saved-search-store";
import { savedSearchSchema } from "@/lib/validation";

export async function GET() {
  try { return Response.json(await listSaved()); }
  catch { return Response.json({ error: "Unable to load saved searches." }, { status: 503 }); }
}

export async function POST(request: Request) {
  try {
    const parsed = savedSearchSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "A valid search is required." }, { status: 400 });
    return Response.json(await createSaved(parsed.data), { status: 201 });
  } catch { return Response.json({ error: "Unable to save this search." }, { status: 503 }); }
}
