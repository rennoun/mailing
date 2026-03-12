import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [totalProspects, totalContacts, totalEmailsSent, totalCampaigns, recentProspects, recentCampaigns, statusCounts] =
    await Promise.all([
      prisma.prospect.count(),
      prisma.contact.count(),
      prisma.emailSent.count(),
      prisma.campaign.count(),
      prisma.prospect.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { contacts: true } } },
      }),
      prisma.campaign.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { emailsSent: true } } },
      }),
      prisma.prospect.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

  return NextResponse.json({
    totalProspects,
    totalContacts,
    totalEmailsSent,
    totalCampaigns,
    recentProspects,
    recentCampaigns,
    statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
  });
}
