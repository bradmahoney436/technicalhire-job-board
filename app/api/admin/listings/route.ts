import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("posted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.role_title || !body?.company || !body?.vertical || !body?.apply_url) {
    return NextResponse.json({ error: "role_title, company, vertical, and apply_url are required." }, { status: 400 });
  }

  const { error } = await supabase.from("listings").insert({
    role_title: body.role_title,
    company: body.company,
    vertical: body.vertical,
    location: body.location || null,
    description: body.description || null,
    salary_range: body.salary_range || null,
    apply_url: body.apply_url,
    posted_at: body.posted_at || new Date().toISOString(),
    remote: body.remote ?? false,
    active: true,
    featured: body.featured ?? false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
