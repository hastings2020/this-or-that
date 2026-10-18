import Link from "next/link";
import { QuestionList } from "@/components/QuestionList";
import { countQuestions, listQuestions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const questions = listQuestions();
  const bankSize = countQuestions();

  return (
    <>
      <section className="hero">
        <p className="hero-brand">This or That</p>
        <h1>Pick a side. Softly.</h1>
        <p className="hero-copy">
          Lighthearted questions, one nickname — or a signed-in display name —
          and counts that refresh as friends weigh in.
        </p>
        <div className="cta-row">
          <Link href="#questions" className="btn solid">
            Browse {bankSize} questions
          </Link>
          <Link href="/teams/new" className="btn ghost">
            Share with your team
          </Link>
        </div>
      </section>

      <section id="questions" className="section">
        <div className="section-head">
          <h2>Open questions</h2>
          <p>
            Vote counts sit up front — tap in, choose an option, watch the tally
            sway.
          </p>
        </div>
        <QuestionList questions={questions} />
      </section>
    </>
  );
}
