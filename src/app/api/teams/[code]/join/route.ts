import { NextResponse } from "next/server";
import { joinTeam } from "@/lib/db";
import { resolveVoter } from "@/lib/session-voter";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await context.params;
    const body = (await request.json()) as { username?: string };
    const voter = await resolveVoter(body.username);
    if (!voter) {
      return NextResponse.json(
        { error: "Sign in or provide a username." },
        { status: 400 },
      );
    }
    const team = joinTeam(code, voter);
    return NextResponse.json({ team });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not join team.";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
