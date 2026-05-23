"use client";

import { useState } from "react";
import Link from "next/link";

const VERTICALS = [
  { slug: "devtools", label: "Developer Tools" },
  { slug: "ai-ml", label: "AI / ML" },
  { slug: "security", label: "Security" },
  { slug: "infrastructure", label: "Infrastructure" },
  { slug: "data", label: "Data Engineering" },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [vertical, setVertical] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, vertical: vertical || null }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage("You're on the list. We'll send jobs your way.");
      setEmail("");
      setVertical("");
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Try again.");
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">Technical Hire</span>
        <Link
          href="/jobs"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Browse Jobs &rarr;
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <span className="inline-block mb-4 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Niche job board for technical roles
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Find the right technical job,{" "}
          <span className="text-indigo-600">without the noise</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-gray-500">
          Curated openings across developer tools, AI/ML, security, infrastructure, and data
          engineering. Get matched to roles that fit your stack.
        </p>

        {/* Email signup */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-md flex flex-col gap-3"
        >
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All verticals (optional)</option>
            {VERTICALS.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {status === "loading" ? "Subscribing…" : "Get job alerts"}
          </button>
          {message && (
            <p
              className={`text-sm text-center ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-xs text-gray-400">No spam. Unsubscribe any time.</p>

        {/* Vertical pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={`/jobs?vertical=${v.slug}`}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              {v.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Technical Hire
      </footer>
    </main>
  );
}
