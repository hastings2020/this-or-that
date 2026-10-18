"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { setStoredUsername } from "@/lib/username";

export function SignInForm({ githubEnabled }: { githubEnabled: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Could not sign in — check email and password.");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Welcome back</p>
      <h2>Sign in</h2>
      <p className="lede">
        Your account display name becomes your voting identity. Anonymous
        nicknames still work until you sign in.
      </p>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn solid wide" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {githubEnabled ? (
        <>
          <div className="divider">or</div>
          <button
            type="button"
            className="btn ghost wide"
            onClick={() => void signIn("github", { callbackUrl: "/" })}
          >
            Continue with GitHub
          </button>
        </>
      ) : null}
      <p className="auth-alt">
        New here? <Link href="/register">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await response.json()) as {
        user?: { name: string };
        error?: string;
      };
      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Could not register.");
      }
      setStoredUsername(data.user.name);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error("Account created, but sign-in failed. Try signing in.");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register.");
      setBusy(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Fresh sticker</p>
      <h2>Create an account</h2>
      <p className="lede">
        Pick a display name — that’s how your votes and team packs show up.
      </p>
      <label className="field">
        <span>Display name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={32}
          required
        />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Password (8+ characters)</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn solid wide" disabled={busy}>
        {busy ? "Creating…" : "Create account"}
      </button>
      <p className="auth-alt">
        Already have one? <Link href="/signin">Sign in</Link>
      </p>
    </form>
  );
}
