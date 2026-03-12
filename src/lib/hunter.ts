import { prisma } from "./db";

interface HunterEmail {
  email: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  confidence: number;
}

async function getApiKey(): Promise<string | null> {
  const setting = await prisma.settings.findUnique({ where: { key: "hunter_api_key" } });
  return setting?.value || null;
}

export async function findEmails(domain: string): Promise<HunterEmail[]> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("Hunter.io API key not configured. Go to Settings to add it.");

  // Clean domain
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

  const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(cleanDomain)}&api_key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors.map((e: { details: string }) => e.details).join(", "));
  }

  if (!data.data?.emails) return [];

  return data.data.emails.map((e: {
    value: string;
    first_name?: string;
    last_name?: string;
    position?: string;
    confidence: number;
  }) => ({
    email: e.value,
    firstName: e.first_name || undefined,
    lastName: e.last_name || undefined,
    position: e.position || undefined,
    confidence: e.confidence,
  }));
}
