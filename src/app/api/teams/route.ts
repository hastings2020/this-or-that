import { NextResponse } from "next/server";
import { createTeam } from "@/lib/db";
import { resolveVoter } from "@/lib/session-voter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      createdBy?: string;
      expectedMembers?: number | null;
      questionCount?: number | null;
      questionIds?: string[] | null;
    };

    const voter = await resolveVoter(body.createdBy);
    if (!voter) {
      return NextResponse.json(
        { error: "Sign in or provide a username." },
        { status: 400 },
      );
    }

    const team = createTeam({
      name: body.name ?? "",
      createdBy: voter.username,
      createdByUserId: voter.userId,
      expectedMembers: body.expectedMembers,
      questionCount: body.questionCount,
      questionIds: body.questionIds,
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create team.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
