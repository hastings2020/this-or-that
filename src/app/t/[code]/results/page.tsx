import { notFound } from "next/navigation";
import { TeamResultsDashboard } from "@/components/TeamResultsDashboard";
import { getTeamResults } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TeamResultsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const results = getTeamResults(code);
  if (!results) notFound();
  return <TeamResultsDashboard initial={results} code={results.team.code} />;
}
