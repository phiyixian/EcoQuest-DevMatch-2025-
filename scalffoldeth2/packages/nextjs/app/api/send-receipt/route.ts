export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Env vars: configure a Gmail App Password (2FA) or another SMTP
// NEXT_PUBLIC_FIREBASE_... already set for auth UI; add these server-side:
// EMAIL_FROM, EMAIL_TO (fallback), SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      to,
      subject = "EcoQuest Donation Receipt",
      html,
      pdfBase64,
    }: { to: string; subject?: string; html: string; pdfBase64?: string } = body;

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER as string;
    const pass = process.env.SMTP_PASS as string;
    const from = process.env.EMAIL_FROM || "EcoQuest <jxfong357@gmail.com>";

    if (!to || !user || !pass) {
      return NextResponse.json({ error: "Email configuration missing" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465
      auth: { user, pass },
    });

    const attachments = pdfBase64
      ? [
          {
            filename: "ecoquest-receipt.pdf",
            content: Buffer.from(pdfBase64, "base64"),
            contentType: "application/pdf",
          },
        ]
      : undefined;

    await transporter.sendMail({ from, to, subject, html, attachments });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}


