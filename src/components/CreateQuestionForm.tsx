"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export function CreateQuestionForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function updateOption(index: number, value: string) {
    setOptions((current) =>
      current.map((option, i) => (i === index ? value : option)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, options }),
      });
      const data = (await response.json()) as {
        question?: { id: string };
        error?: string;
      };
      if (!response.ok || !data.question) {
        throw new Error(data.error ?? "Could not create question.");
      }
      router.push(`/questions/${data.question.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create question.");
      setBusy(false);
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>The question</span>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Coffee or tea… or naps?"
          required
        />
      </label>

      <fieldset className="options-fieldset">
        <legend>Options (2–6)</legend>
        <p className="hint">
          Usual picks plus one out-of-box answer keep things playful.
        </p>
        {options.map((option, index) => (
          <div key={index} className="option-row">
            <label className="field grow">
              <span className="sr-only">Option {index + 1}</span>
              <input
                value={option}
                onChange={(event) => updateOption(index, event.target.value)}
                placeholder={
                  index === options.length - 1
                    ? "What’s the problem / Hand / Kids…"
                    : `Option ${index + 1}`
                }
                required
              />
            </label>
            {options.length > MIN_OPTIONS ? (
              <button
                type="button"
                className="btn ghost"
                onClick={() =>
                  setOptions((current) => current.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
        {options.length < MAX_OPTIONS ? (
          <button
            type="button"
            className="btn ghost"
            onClick={() => setOptions((current) => [...current, ""])}
          >
            Add another option
          </button>
        ) : null}
      </fieldset>

      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn solid wide" disabled={busy}>
        {busy ? "Posting…" : "Post question"}
      </button>
    </form>
  );
}
