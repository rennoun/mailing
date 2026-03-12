import { prisma } from "./db";

interface PlaceResult {
  companyName: string;
  address: string;
  phone?: string;
  website?: string;
  industry?: string;
  placeId?: string;
}

async function getApiKey(): Promise<string | null> {
  const setting = await prisma.settings.findUnique({ where: { key: "google_places_api_key" } });
  return setting?.value || null;
}

export async function searchPlaces(
  query: string,
  city: string,
  country: string
): Promise<PlaceResult[]> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("Google Places API key not configured. Go to Settings to add it.");

  const searchQuery = `${query} in ${city}, ${country}`;
  const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

  const response = await fetch(textSearchUrl);
  const data = await response.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API error: ${data.status} - ${data.error_message || ""}`);
  }

  if (!data.results || data.results.length === 0) return [];

  const results: PlaceResult[] = [];

  for (const place of data.results) {
    const detail = await getPlaceDetails(place.place_id, apiKey);
    results.push({
      companyName: place.name,
      address: place.formatted_address || "",
      phone: detail?.phone,
      website: detail?.website,
      industry: place.types?.filter((t: string) => !["point_of_interest", "establishment"].includes(t)).join(", ") || query,
      placeId: place.place_id,
    });
  }

  return results;
}

async function getPlaceDetails(placeId: string, apiKey: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.result) {
      return {
        phone: data.result.formatted_phone_number,
        website: data.result.website,
      };
    }
  } catch {
    // Silently fail for individual detail lookups
  }
  return null;
}
