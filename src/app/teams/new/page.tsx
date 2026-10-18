import Link from "next/link";
import { auth } from "@/auth";
import { CreateTeamForm } from "@/components/CreateTeamForm";
import { countQuestions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewTeamPage() {
  const session = await auth();
  const questionBankSize = countQuestions();

  return (
    <article className="create-page">
      <Link href="/" className="back-link">
        ← Home
      </Link>
      <p className="eyebrow">Team pack</p>
      <h1>Your team vs. the world. Fight.</h1>
      <p className="hero-copy">
        One link, one shuffled pack. When your crew finishes, stack your leanings
        against everyone else.
      </p>
      <CreateTeamForm
        questionBankSize={questionBankSize}
        signedInName={session?.user?.name}
      />
    </article>
  );
}
