import { NextResponse } from "next/server";
import { castVote } from "@/lib/db";
import { resolveVoter } from "@/lib/session-voter";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      optionId?: string;
      username?: string;
    };

    if (!body.optionId) {
      return NextResponse.json(
        { error: "optionId is required." },
        { status: 400 },
      );
    }

    const voter = await resolveVoter(body.username);
    if (!voter) {
      return NextResponse.json(
        { error: "Sign in or provide a username to vote." },
        { status: 400 },
      );
    }

    const question = castVote(id, body.optionId, voter);
    return NextResponse.json({ question });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not cast vote.";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
