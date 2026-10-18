"use client";

import { FormEvent, useEffect, useState } from "react";
import { getStoredUsername, setStoredUsername } from "@/lib/username";

type UsernameGateProps = {
  open: boolean;
  onClose: () => void;
  onReady: (username: string) => void;
  title?: string;
};

export function UsernameGate({
  open,
  onClose,
  onReady,
  title = "What should we call you?",
}: UsernameGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const existing = getStoredUsername();
    if (existing) setValue(existing);
  }, [open]);

  if (!open) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const cleaned = value.trim().replace(/\s+/g, " ");
    if (!cleaned) {
      setError("Pick a little nickname first.");
      return;
    }
    if (cleaned.length > 32) {
      setError("Keep it under 32 characters.");
      return;
    }
    onReady(setStoredUsername(cleaned));
    onClose();
  }

  return (
    <div className="username-overlay" role="dialog" aria-modal="true">
      <form className="username-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Friendly nickname</p>
        <h2>{title}</h2>
        <p className="lede">
          Saved in your browser so you can vote once per question — or{" "}
          <a href="/signin">sign in</a> to carry your display name across devices.
        </p>
        <label className="field">
          <span>Username</span>
          <input
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
            placeholder="e.g. soft-pretzel"
            maxLength={32}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="username-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Not now
          </button>
          <button type="submit" className="btn solid">
            Save & continue
          </button>
        </div>
      </form>
    </div>
  );
}
