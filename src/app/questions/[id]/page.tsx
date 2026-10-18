import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { VoteBoard } from "@/components/VoteBoard";
import { getQuestion } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function QuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ team?: string }>;
}) {
  const { id } = await params;
  const { team } = await searchParams;
  const session = await auth();
  const question = getQuestion(id, session?.user?.name);

  if (!question) notFound();

  const backHref = team ? `/t/${team}` : "/#questions";
  const backLabel = team ? "← Team pack" : "← All questions";

  return (
    <article className="detail-page">
      <Link href={backHref} className="back-link">
        {backLabel}
      </Link>
      <div className="detail-vote-count">
        <strong>{question.totalVotes}</strong>
        <span>{question.totalVotes === 1 ? "vote" : "votes"} worldwide</span>
      </div>
      <h1>{question.prompt}</h1>
      <VoteBoard
        initial={question}
        teamCode={team}
        signedInName={session?.user?.name}
      />
    </article>
  );
}
