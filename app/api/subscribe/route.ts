import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { confirmationEmail } from "@/lib/emails/confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email: string | undefined = body?.email;
  const vertical: string | null = body?.vertical ?? null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("subscribers")
    .insert({ email, vertical });

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "You're already subscribed." }, { status: 409 });
    }
    console.error("Supabase insert error:", dbError.message);
    return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
  }

  const { subject, html, text } = confirmationEmail(email, vertical);

  const { error: emailError } = await resend.emails.send({
    from: "Technical Hire <hello@technicalhire.io>",
    to: email,
    subject,
    html,
    text,
  });

  if (emailError) {
    console.error("Resend error:", emailError.message);
  }

  return NextResponse.json({ ok: true });
}
