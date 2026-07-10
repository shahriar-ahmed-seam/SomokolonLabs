import { NextResponse } from "next/server";

// Contact endpoint. Validates input and returns success.
// NOTE: This is a placeholder — wire it to a real email service
// (Resend, SendGrid, or Formspree) before going live. It currently
// just validates and logs server-side; it does NOT send email yet.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // TODO: integrate an email provider here.
    console.log("[contact] new enquiry:", { name, email });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
