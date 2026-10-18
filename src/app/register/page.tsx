import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";

export default function RegisterPage() {
  return (
    <article className="auth-page">
      <Link href="/" className="back-link">
        ← Home
      </Link>
      <RegisterForm />
    </article>
  );
}
