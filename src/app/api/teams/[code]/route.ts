import { NextResponse } from "next/server";
import { getTeamByCode } from "@/lib/db";
import { resolveVoter } from "@/lib/session-voter";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const { searchParams } = new URL(request.url);
  const voter = await resolveVoter(searchParams.get("username"));
  const team = getTeamByCode(code, voter?.username);

  if (!team) {
    return NextResponse.json({ error: "Team not found." }, { status: 404 });
  }

  return NextResponse.json({ team });
}
