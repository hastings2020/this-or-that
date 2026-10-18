import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { TeamLobby } from "@/components/TeamLobby";
import { getTeamByCode } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth();
  const team = getTeamByCode(code, session?.user?.name);
  if (!team) notFound();

  return <TeamLobby initial={team} signedInName={session?.user?.name} />;
}
