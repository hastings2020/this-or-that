import Link from "next/link";
import { CreateQuestionForm } from "@/components/CreateQuestionForm";

export default function NewQuestionPage() {
  return (
    <article className="create-page">
      <Link href="/#questions" className="back-link">
        ← Back to browse
      </Link>
      <p className="eyebrow">New question</p>
      <h1>Ask something unhinged</h1>
      <p className="hero-copy">
        A few solid options, plus one delightfully weird escape hatch. Stick it
        on the board.
      </p>
      <CreateQuestionForm />
    </article>
  );
}
