import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
        <span className="grain" />
      </div>
      <header className="topbar">
        <Link href="/" className="brand-mark">
          This or That
        </Link>
        <nav className="topnav">
          <Link href="/#questions">Browse</Link>
          <Link href="/teams/new">Team pack</Link>
          <Link href="/questions/new" className="nav-cta">
            Ask one
          </Link>
          {session?.user ? (
            <span className="auth-chip">
              <span>{session.user.name}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">Sign out</button>
              </form>
            </span>
          ) : (
            <Link href="/signin">Sign in</Link>
          )}
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        Soft opinions only. Sign in anytime — nickname voting still works.
      </footer>
    </div>
  );
}
