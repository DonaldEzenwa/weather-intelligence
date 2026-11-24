import { deleteSaved, updateSaved } from "@/lib/saved-search-store";
import { savedSearchFields } from "@/lib/validation";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = savedSearchFields.partial().safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid update." }, { status: 400 });
  const item = await updateSaved(id, parsed.data);
  return item ? Response.json(item) : Response.json({ error: "Search not found." }, { status: 404 });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = await deleteSaved(id);
  return deleted ? new Response(null, { status: 204 }) : Response.json({ error: "Search not found." }, { status: 404 });
}
