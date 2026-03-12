import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-sender";

export async function POST(req: NextRequest) {
  const { to } = await req.json();

  if (!to) {
    return NextResponse.json({ error: "Recipient email (to) is required" }, { status: 400 });
  }

  const result = await sendEmail({
    to,
    subject: "ProspectPro - Test Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: #0B1D3A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #E8752A; margin: 0; font-size: 24px;">3DS<span style="color: #fff;">.MA</span></h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e6ec;">
          <h2 style="color: #0B1D3A; margin-top: 0;">Email Configuration Working!</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            Your email settings are correctly configured. You can now send prospecting emails from ProspectPro.
          </p>
          <p style="color: #6b7a8d; font-size: 12px; margin-bottom: 0;">
            Sent from ProspectPro at ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `,
  });

  if (result.success) {
    return NextResponse.json({ success: true, message: `Test email sent to ${to}` });
  }

  return NextResponse.json({ success: false, error: result.error }, { status: 400 });
}
