import Link from "next/link";
import { QuestionList } from "@/components/QuestionList";
import { listQuestions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const questions = listQuestions();

  return (
    <>
      <section className="hero">
        <div className="hero-collision" aria-label="This or That">
          <span className="sticker-word this">THIS</span>
          <span className="sticker-or">or</span>
          <span className="sticker-word that">THAT</span>
        </div>
        <h1>Pick one. Defend it later.</h1>
        <p className="hero-copy">
          Slap a side on sticky questions, watch the tally stamp itself, and
          drag your crew into a pack vs. the world.
        </p>
        <div className="cta-row">
          <Link href="#questions" className="btn solid">
            Start picking
          </Link>
          <Link href="/teams/new" className="btn ghost">
            Your team vs. the world
          </Link>
        </div>
      </section>

      <section id="questions" className="section">
        <div className="section-head">
          <h2>Open questions</h2>
          <p>
            Counts sit up front — tap in, pick a sticker, watch the price tags
            update.
          </p>
        </div>
        <QuestionList questions={questions} />
      </section>
    </>
  );
}
