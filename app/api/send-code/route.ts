import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const subject = "Your TaskForge verification code";
    const preview = `Hi${name ? ` ${name}` : ""}, your verification code is ${code}.`;

    const html = `
      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
        <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;">Verify your email</h2>
        <p style="margin:0 0 16px;font-size:14px;">Hi${name ? ` ${name}` : ""}, use the code below to verify your TaskForge account.</p>
        <div style="display:inline-block;padding:10px 16px;border-radius:8px;background:#1d4ed8;color:#fff;font-weight:600;letter-spacing:2px;font-size:16px;">${code}</div>
        <p style="margin:16px 0 0;font-size:12px;color:#475569;">This code expires in 15 minutes. If you didn’t request this, you can ignore this email.</p>
      </div>
    `;

    if (!apiKey) {
      // Dev fallback: don't fail the flow if no key is present.
      console.log("[send-code] Missing RESEND_API_KEY. Would send to:", email, "code:", code);
      return NextResponse.json({ ok: true, dev: true });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TaskForge <no-reply@resend.dev>",
        to: [email],
        subject,
        html,
        text: preview,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[send-code] Resend error:", text);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[send-code] Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
