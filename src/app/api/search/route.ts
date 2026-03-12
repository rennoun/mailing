import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google-places";
import { scrapeCompanies } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const { query, city, country } = await req.json();

  if (!query || !city || !country) {
    return NextResponse.json({ error: "query, city, and country are required" }, { status: 400 });
  }

  try {
    // Try Google Places first
    const results = await searchPlaces(query, city, country);
    return NextResponse.json({ results, source: "google_places" });
  } catch (error) {
    // Fallback to scraping
    console.log("Google Places failed, falling back to scraping:", error instanceof Error ? error.message : error);
    try {
      const results = await scrapeCompanies(query, city, country);
      return NextResponse.json({ results, source: "scraping" });
    } catch (scrapeError) {
      return NextResponse.json(
        { error: scrapeError instanceof Error ? scrapeError.message : "Search failed" },
        { status: 500 }
      );
    }
  }
}
