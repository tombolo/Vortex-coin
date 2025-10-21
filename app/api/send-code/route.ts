import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

export async function POST(req: NextRequest) {
  try {
    const { email, name, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("[send-code] Missing RESEND_API_KEY. Would send to:", email, "code:", code);
      return NextResponse.json({ ok: true, dev: true });
    }

    console.log("[send-code] Attempting to send email", {
      to: email,
      hasApiKey: Boolean(apiKey),
      nodeEnv: process.env.NODE_ENV,
    });

    const resend = new Resend(apiKey);
    try {
      const { error } = await resend.emails.send({
        from: "TaskForge <onboarding@resend.dev>",
        to: [email],
        subject: "Your TaskForge verification code",
        react: EmailTemplate({ firstName: name, code }),
      });

      if (error) {
        console.error("[send-code] Resend error:", error);
        const detail = {
          name: (error as any)?.name,
          message: (error as any)?.message || String(error),
        };
        const payload =
          process.env.NODE_ENV !== "production"
            ? { error: "Failed to send email", detail }
            : { error: "Failed to send email" };
        return NextResponse.json(payload, { status: 500 });
      }
    } catch (err: any) {
      console.error("[send-code] Exception when calling Resend:", err);
      const detail = { name: err?.name, message: err?.message };
      const payload =
        process.env.NODE_ENV !== "production"
          ? { error: "Unexpected error when sending", detail }
          : { error: "Unexpected error" };
      return NextResponse.json(payload, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[send-code] Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
