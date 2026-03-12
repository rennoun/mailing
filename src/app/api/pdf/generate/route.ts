import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { createPdfDocument } from "@/lib/pdf-template";
import type { Language } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  const { language = "en" } = await req.json();

  // Get company info from settings
  const settings = await prisma.settings.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const companyInfo = {
    name: settingsMap.company_name || "Your Company",
    email: settingsMap.company_email || "info@company.com",
    phone: settingsMap.company_phone || "+1 234 567 890",
    website: settingsMap.company_website || "www.company.com",
    address: settingsMap.company_address || "Your Address",
  };

  const doc = createPdfDocument(language as Language, companyInfo);
  const buffer = await renderToBuffer(doc);
  const uint8 = new Uint8Array(buffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="presentation-${language}.pdf"`,
    },
  });
}
