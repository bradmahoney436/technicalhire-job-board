import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Job } from "@/lib/types";

const VERTICALS = [
  { slug: "fintech", label: "Fintech" },
  { slug: "healthtech", label: "Healthtech" },
  { slug: "integration-etl", label: "Integration / ETL" },
  { slug: "insurtech", label: "Insurtech" },
  { slug: "hrtech", label: "HR Tech" },
];

async function getJobs(vertical: string | null): Promise<Job[]> {
  let query = supabase
    .from("listings")
    .select("*")
    .order("posted_at", { ascending: false });

  if (vertical) {
    query = query.eq("vertical", vertical);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string }>;
}) {
  const params = await searchParams;
  const activeVertical = params.vertical ?? null;
  const jobs = await getJobs(activeVertical);

  const activeLabel = VERTICALS.find((v) => v.slug === activeVertical)?.label ?? "All Jobs";

  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Technical Hire
        </Link>
      </nav>

      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        {/* Vertical filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/jobs"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !activeVertical
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            All
          </Link>
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={`/jobs?vertical=${v.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeVertical === v.slug
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {activeLabel}
          <span className="ml-2 text-base font-normal text-gray-400">{jobs.length} listings</span>
        </h1>

        {jobs.map((job) => (
          <script
            key={`ld-${job.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema(job)) }}
          />
        ))}

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No jobs in this vertical yet. Check back soon.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function jobPostingSchema(job: Job) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.role_title,
    description: job.description ?? job.role_title,
    datePosted: job.posted_at.split("T")[0],
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    directApply: true,
    url: job.apply_url,
  };

  if (job.remote) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = { "@type": "Country", name: "US" };
  } else if (job.location) {
    schema.jobLocation = {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    };
  }

  return schema;
}

function JobCard({ job }: { job: Job }) {
  const verticalLabel = VERTICALS.find((v) => v.slug === job.vertical)?.label ?? job.vertical;

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {verticalLabel}
            </span>
            {job.remote && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                Remote
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-gray-900 truncate">{job.role_title}</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
            {job.salary_range ? ` · ${job.salary_range}` : ""}
          </p>
          {job.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.description}</p>
          )}
        </div>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Apply
        </a>
      </div>
    </li>
  );
}
