import Link from "next/link";
import type { QuestionSummary } from "@/lib/types";

export function QuestionList({
  questions,
  teamCode,
}: {
  questions: QuestionSummary[];
  teamCode?: string;
}) {
  if (questions.length === 0) {
    return (
      <p className="empty-note">
        No questions yet. Be the chaos.
      </p>
    );
  }

  return (
    <ul className="question-list">
      {questions.map((question, index) => (
        <li
          key={question.id}
          className="question-row"
          style={{ animationDelay: `${Math.min(index, 20) * 40}ms` }}
        >
          <Link
            href={
              teamCode
                ? `/questions/${question.id}?team=${teamCode}`
                : `/questions/${question.id}`
            }
          >
            <span className="vote-badge" title="Total votes">
              <strong>{question.totalVotes}</strong>
              <small>{question.totalVotes === 1 ? "vote" : "votes"}</small>
            </span>
            <span className="question-copy">
              <span className="question-prompt">{question.prompt}</span>
              <span className="question-meta">
                {question.optionCount} options
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
