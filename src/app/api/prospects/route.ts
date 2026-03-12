import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const country = searchParams.get("country");

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (country) where.country = country;

  const prospects = await prisma.prospect.findMany({
    where,
    include: { contacts: true, _count: { select: { emailsSent: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(prospects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Support bulk create
  if (Array.isArray(body)) {
    const prospects = await Promise.all(
      body.map((p: { companyName: string; country: string; city: string; address?: string; phone?: string; website?: string; industry?: string }) =>
        prisma.prospect.create({ data: p })
      )
    );
    return NextResponse.json(prospects);
  }

  const prospect = await prisma.prospect.create({ data: body });
  return NextResponse.json(prospect);
}
