"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TeamResults } from "@/lib/types";

export function TeamResultsDashboard({
  initial,
  code,
}: {
  initial: TeamResults;
  code: string;
}) {
  const [results, setResults] = useState(initial);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/teams/${code}/results`);
          const data = (await response.json()) as { results?: TeamResults };
          if (data.results) setResults(data.results);
        } catch {
          // keep last snapshot
        }
      })();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [code]);

  const { team, members, comparisons } = results;

  return (
    <div className="results-page">
      <Link href={`/t/${code}`} className="back-link">
        ← Back to pack
      </Link>
      <p className="eyebrow">Group dashboard</p>
      <h1>{team.name}</h1>
      <p className="hero-copy">
        {team.allComplete
          ? "Everyone who joined finished the pack. Here’s your group versus the wider world."
          : `${team.completedMemberCount}/${team.memberCount} teammates finished so far — live tallies below.`}
      </p>

      <div className="progress-strip">
        <div>
          <strong>{team.memberCount}</strong>
          <span>in group</span>
        </div>
        <div>
          <strong>{team.completedMemberCount}</strong>
          <span>finished</span>
        </div>
        <div>
          <strong>{team.questionCount}</strong>
          <span>questions</span>
        </div>
      </div>

      <ul className="member-list">
        {members.map((member) => (
          <li key={member.username}>
            <span>{member.username}</span>
            <span className={member.complete ? "pill done" : "pill"}>
              {member.complete
                ? "Complete"
                : `${member.answeredCount}/${team.questionCount}`}
            </span>
          </li>
        ))}
      </ul>

      <div className="comparison-list">
        {comparisons.map((question) => {
          const maxBar = Math.max(
            1,
            ...question.options.flatMap((option) => [
              option.groupVotes,
              option.worldVotes,
            ]),
          );
          return (
            <article key={question.id} className="comparison-card">
              <header>
                <h2>{question.prompt}</h2>
                <p className="question-meta">
                  Group {question.groupTotal} · World {question.worldTotal}
                </p>
                <p className="winner-line">
                  Group leans <strong>{question.groupWinnerLabel ?? "—"}</strong>
                  {" · "}
                  World leans <strong>{question.worldWinnerLabel ?? "—"}</strong>
                </p>
              </header>
              <ul className="comparison-options">
                {question.options.map((option) => (
                  <li key={option.id}>
                    <div className="comparison-label">{option.label}</div>
                    <div className="dual-bars">
                      <div className="bar-row group">
                        <span>Group</span>
                        <span
                          className="bar"
                          style={{
                            width: `${Math.round((option.groupVotes / maxBar) * 100)}%`,
                          }}
                        />
                        <strong>{option.groupVotes}</strong>
                      </div>
                      <div className="bar-row world">
                        <span>World</span>
                        <span
                          className="bar"
                          style={{
                            width: `${Math.round((option.worldVotes / maxBar) * 100)}%`,
                          }}
                        />
                        <strong>{option.worldVotes}</strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
