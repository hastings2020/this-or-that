import { NextResponse } from "next/server";
import { createQuestion, listQuestions } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ questions: listQuestions() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      options?: string[];
    };
    const question = createQuestion(body.prompt ?? "", body.options ?? []);
    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
