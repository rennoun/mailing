import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { findEmails } from "@/lib/hunter";
import { scrapeContactPage } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const { prospectId } = await req.json();

  if (!prospectId) {
    return NextResponse.json({ error: "prospectId is required" }, { status: 400 });
  }

  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!prospect) return NextResponse.json({ error: "Prospect not found" }, { status: 404 });

  const contacts: { email: string; name?: string; role?: string; source: string }[] = [];

  // Try Hunter.io first
  if (prospect.website) {
    try {
      const hunterResults = await findEmails(prospect.website);
      for (const h of hunterResults) {
        contacts.push({
          email: h.email,
          name: [h.firstName, h.lastName].filter(Boolean).join(" ") || undefined,
          role: h.position,
          source: "hunter",
        });
      }
    } catch (error) {
      console.log("Hunter.io failed:", error instanceof Error ? error.message : error);
    }
  }

  // Fallback: scrape the website
  if (contacts.length === 0 && prospect.website) {
    try {
      const scraped = await scrapeContactPage(prospect.website);
      for (const email of scraped) {
        contacts.push({ email, source: "scraped" });
      }
    } catch (error) {
      console.log("Scraping failed:", error instanceof Error ? error.message : error);
    }
  }

  // Save to database
  const saved = [];
  for (const c of contacts) {
    const existing = await prisma.contact.findFirst({
      where: { prospectId, email: c.email },
    });
    if (!existing) {
      const contact = await prisma.contact.create({
        data: { prospectId, ...c },
      });
      saved.push(contact);
    }
  }

  return NextResponse.json({ found: contacts.length, saved: saved.length, contacts: saved });
}
