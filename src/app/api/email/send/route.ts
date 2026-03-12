import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email-sender";

export async function POST(req: NextRequest) {
  const { campaignId, prospectIds } = await req.json();

  if (!campaignId || !prospectIds?.length) {
    return NextResponse.json({ error: "campaignId and prospectIds are required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const results: { prospectId: string; contactEmail: string; success: boolean; error?: string }[] = [];

  for (const prospectId of prospectIds) {
    const prospect = await prisma.prospect.findUnique({
      where: { id: prospectId },
      include: { contacts: true },
    });

    if (!prospect || prospect.contacts.length === 0) {
      results.push({ prospectId, contactEmail: "", success: false, error: "No contacts found" });
      continue;
    }

    for (const contact of prospect.contacts) {
      // Personalize subject and body
      const subject = campaign.subject
        .replace(/\{\{company\}\}/g, prospect.companyName)
        .replace(/\{\{industry\}\}/g, prospect.industry || "your");
      const body = campaign.body
        .replace(/\{\{company\}\}/g, prospect.companyName)
        .replace(/\{\{industry\}\}/g, prospect.industry || "your")
        .replace(/\{\{contact_name\}\}/g, contact.name || "Sir/Madam");

      const result = await sendEmail({
        to: contact.email,
        subject,
        html: body,
      });

      // Record in database
      await prisma.emailSent.create({
        data: {
          campaignId,
          contactId: contact.id,
          prospectId,
          subject,
          status: result.success ? "sent" : "bounced",
        },
      });

      // Update prospect status
      if (result.success) {
        await prisma.prospect.update({
          where: { id: prospectId },
          data: { status: "contacted" },
        });
      }

      results.push({
        prospectId,
        contactEmail: contact.email,
        success: result.success,
        error: result.error,
      });
    }
  }

  return NextResponse.json({
    total: results.length,
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}
