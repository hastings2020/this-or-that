import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createUser } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and display name are required." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const passwordHash = await hash(password, 10);
    const user = createUser({ email, name, passwordHash });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
