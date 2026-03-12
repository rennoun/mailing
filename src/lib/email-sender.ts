import nodemailer from "nodemailer";
import { Resend } from "resend";
import { prisma } from "./db";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}

async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.settings.findUnique({ where: { key } });
  return setting?.value || null;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const method = await getSetting("email_method");

  if (method === "resend") {
    return sendViaResend(options);
  }
  return sendViaSMTP(options);
}

async function sendViaSMTP(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const host = await getSetting("smtp_host");
  const port = await getSetting("smtp_port");
  const user = await getSetting("smtp_user");
  const pass = await getSetting("smtp_pass");
  const fromEmail = await getSetting("company_email");
  const fromName = await getSetting("company_name");

  if (!host || !user || !pass) {
    return { success: false, error: "SMTP not configured. Go to Settings." };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"${fromName || "ProspectPro"}" <${fromEmail || user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "SMTP send failed" };
  }
}

async function sendViaResend(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = await getSetting("resend_api_key");
  const fromEmail = await getSetting("company_email");
  const fromName = await getSetting("company_name");

  if (!apiKey) {
    return { success: false, error: "Resend API key not configured. Go to Settings." };
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: `${fromName || "ProspectPro"} <${fromEmail || "onboarding@resend.dev"}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Resend send failed" };
  }
}
