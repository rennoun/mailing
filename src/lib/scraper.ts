import * as cheerio from "cheerio";

interface ScrapedCompany {
  companyName: string;
  address: string;
  phone?: string;
  website?: string;
  industry?: string;
}

export async function scrapeCompanies(
  query: string,
  city: string,
  country: string
): Promise<ScrapedCompany[]> {
  // Use DuckDuckGo HTML search as a fallback (no API key needed)
  const searchQuery = `${query} companies factories ${city} ${country}`;
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const results: ScrapedCompany[] = [];

    $(".result").each((_, el) => {
      const title = $(el).find(".result__title a").text().trim();
      const snippet = $(el).find(".result__snippet").text().trim();
      const link = $(el).find(".result__title a").attr("href") || "";

      if (title && !title.includes("...")) {
        results.push({
          companyName: title.replace(/ - .*$/, "").trim(),
          address: `${city}, ${country}`,
          website: link,
          industry: query,
        });
      }
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  }
}

export async function scrapeContactPage(websiteUrl: string): Promise<string[]> {
  const emails: string[] = [];
  try {
    // Try the main page and /contact
    const urls = [websiteUrl];
    if (!websiteUrl.endsWith("/contact") && !websiteUrl.endsWith("/contact/")) {
      urls.push(websiteUrl.replace(/\/$/, "") + "/contact");
      urls.push(websiteUrl.replace(/\/$/, "") + "/about");
    }

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          signal: AbortSignal.timeout(5000),
        });
        const html = await response.text();
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const found = html.match(emailRegex) || [];
        emails.push(...found.filter((e) => !e.includes("example") && !e.includes("test@") && !e.endsWith(".png") && !e.endsWith(".jpg")));
      } catch {
        // Skip failed URLs
      }
    }
  } catch {
    // Silently fail
  }

  return [...new Set(emails)];
}
