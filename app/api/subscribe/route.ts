import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email: string | undefined = body?.email;
  const vertical: string | null = body?.vertical ?? null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("subscribers")
    .insert({ email, vertical });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You're already subscribed." }, { status: 409 });
    }
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
