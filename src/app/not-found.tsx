import Link from "next/link";

export default function NotFound() {
  return (
    <section className="create-page">
      <h1>That one drifted away</h1>
      <p className="hero-copy">We couldn’t find that page.</p>
      <Link href="/" className="btn solid" style={{ width: "fit-content" }}>
        Back home
      </Link>
    </section>
  );
}
