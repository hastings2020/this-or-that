import Link from "next/link";
import { githubAuthEnabled } from "@/auth";
import { SignInForm } from "@/components/AuthForms";

export default function SignInPage() {
  return (
    <article className="auth-page">
      <Link href="/" className="back-link">
        ← Home
      </Link>
      <SignInForm githubEnabled={githubAuthEnabled()} />
    </article>
  );
}
