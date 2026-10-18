"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuestionDetail } from "@/lib/types";
import { getStoredUsername } from "@/lib/username";
import { UsernameGate } from "./UsernameGate";

const ACCENTS = ["tomato", "sky", "mint", "sunshine"] as const;

export function VoteBoard({
  initial,
  teamCode,
  signedInName,
}: {
  initial: QuestionDetail;
  teamCode?: string;
  signedInName?: string | null;
}) {
  const [question, setQuestion] = useState(initial);
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(signedInName ?? null);

  useEffect(() => {
    if (signedInName) {
      setUsername(signedInName);
      return;
    }
    const existing = getStoredUsername();
    setUsername(existing);
  }, [signedInName]);

  useEffect(() => {
    const name = signedInName ?? getStoredUsername();
    if (!name) return;

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(
          `/api/questions/${question.id}?username=${encodeURIComponent(name)}`,
        );
        const data = (await response.json()) as { question?: QuestionDetail };
        if (!cancelled && data.question) setQuestion(data.question);
      } catch {
        // Keep initial payload.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [question.id, signedInName]);

  const maxVotes = useMemo(
    () => Math.max(1, ...question.options.map((option) => option.votes)),
    [question.options],
  );

  const submitVote = useCallback(
    async (optionId: string, name: string) => {
      setBusy(true);
      setError(null);
      try {
        const response = await fetch(`/api/questions/${question.id}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ optionId, username: name }),
        });
        const data = (await response.json()) as {
          question?: QuestionDetail;
          error?: string;
        };
        if (!response.ok || !data.question) {
          throw new Error(data.error ?? "Vote failed.");
        }
        setQuestion(data.question);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Vote failed.");
      } finally {
        setBusy(false);
        setPendingOptionId(null);
      }
    },
    [question.id],
  );

  function handleOptionClick(optionId: string) {
    if (busy) return;
    const existing = signedInName ?? username ?? getStoredUsername();
    if (!existing) {
      setPendingOptionId(optionId);
      setGateOpen(true);
      return;
    }
    void submitVote(optionId, existing);
  }

  return (
    <section className="vote-board">
      <div className="vote-status">
        <p>
          {question.totalVotes}{" "}
          {question.totalVotes === 1 ? "opinion stamped" : "opinions stamped"}{" "}
          so far
          {username ? (
            <>
              {" "}
              · voting as <strong>{username}</strong>
              {signedInName ? " (signed in)" : ""}
            </>
          ) : null}
        </p>
        {question.userVoteOptionId ? (
          <p className="locked-in">Locked in. No take-backs (okay, one).</p>
        ) : (
          <p className="hint">Tap a sticker to cast your vote.</p>
        )}
      </div>

      <div className="option-grid" role="list">
        {question.options.map((option, index) => {
          const selected = question.userVoteOptionId === option.id;
          const width = Math.round((option.votes / maxVotes) * 100);
          const accent = ACCENTS[index % ACCENTS.length];
          const letter = String.fromCharCode(65 + index);
          return (
            <button
              key={option.id}
              type="button"
              role="listitem"
              data-accent={accent}
              className={`option-btn${selected ? " selected" : ""}`}
              disabled={busy}
              onClick={() => handleOptionClick(option.id)}
            >
              <span
                className="option-fill"
                style={{ width: `${width}%` }}
                aria-hidden="true"
              />
              <span className="option-main">
                <span className="option-letter" aria-hidden="true">
                  {letter}
                </span>
                <span className="option-label">{option.label}</span>
              </span>
              <span className="price-tag">{option.votes}</span>
            </button>
          );
        })}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {teamCode && question.userVoteOptionId ? (
        <div className="cta-row">
          <Link href={`/t/${teamCode}`} className="btn ghost">
            Back to team pack
          </Link>
          <Link href={`/t/${teamCode}/results`} className="btn solid">
            See the fight
          </Link>
        </div>
      ) : null}

      <UsernameGate
        open={gateOpen}
        onClose={() => {
          setGateOpen(false);
          setPendingOptionId(null);
        }}
        onReady={(name) => {
          setUsername(name);
          if (pendingOptionId) void submitVote(pendingOptionId, name);
        }}
      />
    </section>
  );
}
