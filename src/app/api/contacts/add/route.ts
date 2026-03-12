import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { prospectId, email, name, role } = await req.json();

  if (!prospectId || !email) {
    return NextResponse.json({ error: "prospectId and email are required" }, { status: 400 });
  }

  const existing = await prisma.contact.findFirst({ where: { prospectId, email } });
  if (existing) {
    return NextResponse.json({ error: "Contact already exists" }, { status: 409 });
  }

  const contact = await prisma.contact.create({
    data: { prospectId, email, name, role, source: "manual" },
  });

  return NextResponse.json(contact);
}
