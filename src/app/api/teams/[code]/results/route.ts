import { NextResponse } from "next/server";
import { getTeamResults } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const results = getTeamResults(code);
  if (!results) {
    return NextResponse.json({ error: "Team not found." }, { status: 404 });
  }
  return NextResponse.json({ results });
}
