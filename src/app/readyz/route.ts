export function GET() { return Response.json({ status: "ready", databaseConfigured: Boolean(process.env.DATABASE_URL) }); }
