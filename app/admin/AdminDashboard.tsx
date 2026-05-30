"use client";

import { useState, useEffect, useCallback } from "react";

const VERTICALS = [
  { slug: "fintech", label: "Fintech & Payments" },
  { slug: "insurtech", label: "Insurtech" },
  { slug: "healthtech", label: "Healthtech" },
  { slug: "integration-etl", label: "Data & ETL" },
  { slug: "ai", label: "AI / ML" },
  { slug: "saas", label: "SaaS"},
];

type Listing = {
  id: string;
  role_title: string;
  company: string;
  vertical: string;
  location: string | null;
  description: string | null;
  salary_range: string | null;
  apply_url: string;
  remote: boolean;
  active: boolean;
  featured: boolean;
  posted_at: string;
};

const emptyForm = {
  role_title: "",
  company: "",
  vertical: "fintech",
  location: "",
  description: "",
  salary_range: "",
  apply_url: "",
  remote: false,
  featured: false,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoadingListings(true);
    const res = await fetch("/api/admin/listings");
    if (res.ok) setListings(await res.json());
    setLoadingListings(false);
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    const res = await fetch("/api/admin/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm(emptyForm);
      setFormSuccess(true);
      fetchListings();
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Failed to add listing.");
    }
    setSubmitting(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    fetchListings();
  }

  async function deleteListing(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    fetchListings();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="font-semibold text-gray-900">Technical Hire</span>
          <span className="ml-2 text-sm text-gray-400">Admin</span>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Sign out
          </button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">

        {/* Add Listing */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Add New Listing</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Role Title *">
                <input
                  required
                  value={form.role_title}
                  onChange={(e) => setForm((f) => ({ ...f, role_title: e.target.value }))}
                  className={input}
                />
              </Field>
              <Field label="Company *">
                <input
                  required
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={input}
                />
              </Field>
              <Field label="Vertical *">
                <select
                  value={form.vertical}
                  onChange={(e) => setForm((f) => ({ ...f, vertical: e.target.value }))}
                  className={input}
                >
                  {VERTICALS.map((v) => (
                    <option key={v.slug} value={v.slug}>{v.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location">
                <input
                  placeholder="e.g. New York, NY"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className={input}
                />
              </Field>
              <Field label="Salary Range">
                <input
                  placeholder="e.g. $120k – $160k"
                  value={form.salary_range}
                  onChange={(e) => setForm((f) => ({ ...f, salary_range: e.target.value }))}
                  className={input}
                />
              </Field>
              <Field label="Apply URL *">
                <input
                  required
                  type="url"
                  placeholder="https://…"
                  value={form.apply_url}
                  onChange={(e) => setForm((f) => ({ ...f, apply_url: e.target.value }))}
                  className={input}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={input}
              />
            </Field>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.remote}
                  onChange={(e) => setForm((f) => ({ ...f, remote: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                Remote
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                Featured
              </label>
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {formSuccess && <p className="text-sm text-green-600">Listing added.</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Adding…" : "Add Listing"}
            </button>
          </form>
        </section>

        {/* Listings Table */}
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Listings</h2>
            <span className="text-sm text-gray-400">{listings.length} total</span>
          </div>

          {loadingListings ? (
            <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">No listings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {["Role", "Company", "Vertical", "Posted", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((job) => (
                    <tr key={job.id} className={!job.active ? "opacity-50" : undefined}>
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-[220px]">
                        <span className="block truncate">
                          {job.featured && <span className="mr-1 text-amber-400">★</span>}
                          {job.role_title}
                        </span>
                        {job.remote && (
                          <span className="text-xs text-gray-400">Remote</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{job.company}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {VERTICALS.find((v) => v.slug === job.vertical)?.label ?? job.vertical}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(job.posted_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          job.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {job.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleActive(job.id, job.active)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            {job.active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteListing(job.id, job.role_title)}
                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const input = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
