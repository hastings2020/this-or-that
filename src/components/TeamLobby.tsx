"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { TeamDetail } from "@/lib/types";
import { getStoredUsername, setStoredUsername } from "@/lib/username";

export function TeamLobby({
  initial,
  signedInName,
}: {
  initial: TeamDetail;
  signedInName?: string | null;
}) {
  const [team, setTeam] = useState(initial);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState(`/t/${initial.code}`);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/t/${initial.code}`);
  }, [initial.code]);

  useEffect(() => {
    const existing = signedInName || getStoredUsername();
    if (!existing) return;
    setUsername(existing);
    void join(existing, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedInName]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh();
    }, 4000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, joined]);

  const nextQuestion = useMemo(() => {
    if (!joined) return null;
    return team.questions.find((q) => !q.userVoteOptionId) ?? null;
  }, [joined, team.questions]);

  const answeredCount = useMemo(
    () => team.questions.filter((q) => q.userVoteOptionId).length,
    [team.questions],
  );

  async function refresh() {
    try {
      const query = username
        ? `?username=${encodeURIComponent(username)}`
        : "";
      const response = await fetch(`/api/teams/${team.code}${query}`);
      const data = (await response.json()) as { team?: TeamDetail };
      if (data.team) setTeam(data.team);
    } catch {
      // keep snapshot
    }
  }

  async function join(name: string, silent = false) {
    setBusy(true);
    if (!silent) setError(null);
    try {
      const cleaned = signedInName || setStoredUsername(name);
      const response = await fetch(`/api/teams/${team.code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleaned }),
      });
      const data = (await response.json()) as {
        team?: TeamDetail;
        error?: string;
      };
      if (!response.ok || !data.team) {
        throw new Error(data.error ?? "Could not join.");
      }
      setUsername(cleaned);
      setTeam(data.team);
      setJoined(true);
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Could not join.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy link — select and copy it manually.");
    }
  }

  return (
    <div className="team-lobby">
      <section className="share-panel">
        <p className="eyebrow">Team pack</p>
        <h1>{team.name}</h1>
        <p className="hero-copy">
          Your team vs. the world. Fight. Same {team.questionCount} questions for
          everyone — then stack the tallies.
        </p>
        <div className="share-row">
          <code className="share-url">{shareUrl}</code>
          <button type="button" className="btn solid" onClick={() => void copyLink()}>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="progress-strip">
          <div>
            <strong>{team.memberCount}</strong>
            <span>joined</span>
          </div>
          <div>
            <strong>{team.completedMemberCount}</strong>
            <span>finished</span>
          </div>
          <div>
            <strong>{team.expectedMembers ?? "—"}</strong>
            <span>expected</span>
          </div>
        </div>
        {team.allComplete ? (
          <p className="status-banner ready">
            Everyone who joined has answered. Open the group dashboard.
          </p>
        ) : (
          <p className="status-banner">
            Waiting on teammates — results stay live as people finish.
          </p>
        )}
        <div className="cta-row">
          <Link href={`/t/${team.code}/results`} className="btn solid">
            See the fight
          </Link>
          {joined && nextQuestion ? (
            <Link
              href={`/questions/${nextQuestion.id}?team=${team.code}`}
              className="btn ghost"
            >
              Keep picking
            </Link>
          ) : null}
        </div>
      </section>

      {!joined ? (
        <form
          className="create-form"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            void join(username);
          }}
        >
          <h2>Join with a nickname</h2>
          <label className="field">
            <span>Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. chaos-pretzel"
              maxLength={32}
              required
              disabled={Boolean(signedInName)}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn solid wide" disabled={busy}>
            {busy ? "Joining…" : "Join this pack"}
          </button>
        </form>
      ) : (
        <section className="section team-progress">
          <div className="section-head">
            <h2>Your progress</h2>
            <p>
              Voting as <strong>{username}</strong> — {answeredCount}/
              {team.questionCount} answered
            </p>
          </div>
          <ul className="member-list">
            {team.members.map((member) => (
              <li key={member.username}>
                <span>{member.username}</span>
                <span className={member.complete ? "pill done" : "pill"}>
                  {member.answeredCount}/{team.questionCount}
                  {member.complete ? " · done" : ""}
                </span>
              </li>
            ))}
          </ul>
          <ul className="question-list">
            {team.questions.map((question, index) => (
              <li
                key={question.id}
                className="question-row"
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
              >
                <Link href={`/questions/${question.id}?team=${team.code}`}>
                  <span className="vote-badge">
                    <strong>{question.totalVotes}</strong>
                    <small>votes</small>
                  </span>
                  <span className="question-copy">
                    <span className="question-prompt">{question.prompt}</span>
                    <span className="question-meta">
                      {question.userVoteOptionId ? "Answered" : "Tap to answer"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
