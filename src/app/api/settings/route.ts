import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && value.trim()) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: value.trim() },
        create: { key, value: value.trim() },
      });
    }
  }

  return NextResponse.json({ success: true });
}
