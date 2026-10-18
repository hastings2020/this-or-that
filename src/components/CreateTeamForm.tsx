"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUsername, setStoredUsername } from "@/lib/username";

export function CreateTeamForm({
  questionBankSize,
  signedInName,
}: {
  questionBankSize: number;
  signedInName?: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [expectedMembers, setExpectedMembers] = useState("4");
  const [questionCount, setQuestionCount] = useState(
    String(Math.min(12, Math.max(2, questionBankSize))),
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (signedInName) {
      setCreatedBy(signedInName);
      return;
    }
    const existing = getStoredUsername();
    if (existing) setCreatedBy(existing);
  }, [signedInName]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const username = signedInName || setStoredUsername(createdBy);
      const expected = Number.parseInt(expectedMembers, 10);
      const count = Number.parseInt(questionCount, 10);
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          createdBy: username,
          expectedMembers: Number.isFinite(expected) ? expected : null,
          questionCount: Number.isFinite(count) ? count : 12,
        }),
      });
      const data = (await response.json()) as {
        team?: { code: string };
        error?: string;
      };
      if (!response.ok || !data.team) {
        throw new Error(data.error ?? "Could not create team pack.");
      }
      router.push(`/t/${data.team.code}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create team pack.");
      setBusy(false);
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Team or group name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Design squad lunch opinions"
          required
        />
      </label>

      <label className="field">
        <span>Your nickname {signedInName ? "(from account)" : ""}</span>
        <input
          value={createdBy}
          onChange={(event) => setCreatedBy(event.target.value)}
          placeholder="e.g. chaos-pretzel"
          maxLength={32}
          required
          disabled={Boolean(signedInName)}
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Expected teammates</span>
          <input
            type="number"
            min={1}
            max={100}
            value={expectedMembers}
            onChange={(event) => setExpectedMembers(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Questions in this pack</span>
          <input
            type="number"
            min={2}
            max={questionBankSize}
            value={questionCount}
            onChange={(event) => setQuestionCount(event.target.value)}
          />
        </label>
      </div>
      <p className="hint">
        We’ll shuffle {questionBankSize} bank questions into one shared pack.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn solid wide" disabled={busy}>
        {busy ? "Making link…" : "Create shareable pack"}
      </button>
    </form>
  );
}
