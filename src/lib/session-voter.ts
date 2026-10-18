import { auth } from "@/auth";
import type { VoterIdentity } from "@/lib/types";
import { normalizeUsername } from "@/lib/db";

/** Prefer signed-in display name; fall back to request username. */
export async function resolveVoter(
  fallbackUsername?: string | null,
): Promise<VoterIdentity | null> {
  const session = await auth();
  if (session?.user?.id && session.user.name) {
    return {
      username: normalizeUsername(session.user.name),
      userId: session.user.id,
    };
  }

  const cleaned = fallbackUsername ? normalizeUsername(fallbackUsername) : "";
  if (!cleaned) return null;
  return { username: cleaned, userId: null };
}
