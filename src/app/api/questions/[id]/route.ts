import { NextResponse } from "next/server";
import { getQuestion } from "@/lib/db";
import { resolveVoter } from "@/lib/session-voter";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const voter = await resolveVoter(searchParams.get("username"));
  const question = getQuestion(id, voter?.username);

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  return NextResponse.json({ question });
}
