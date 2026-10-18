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
      <h1>Share one link with your crew</h1>
      <p className="hero-copy">
        Everyone gets the same shuffled set. When they finish, compare your
        group’s leanings with the rest of the world.
      </p>
      <CreateTeamForm
        questionBankSize={questionBankSize}
        signedInName={session?.user?.name}
      />
    </article>
  );
}
