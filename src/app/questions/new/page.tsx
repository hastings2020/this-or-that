import Link from "next/link";
import { CreateQuestionForm } from "@/components/CreateQuestionForm";

export default function NewQuestionPage() {
  return (
    <article className="create-page">
      <Link href="/#questions" className="back-link">
        ← Back to browse
      </Link>
      <p className="eyebrow">New question</p>
      <h1>Toss one into the pile</h1>
      <p className="hero-copy">
        Keep it playful: a few solid options, plus one delightfully odd escape
        hatch.
      </p>
      <CreateQuestionForm />
    </article>
  );
}
