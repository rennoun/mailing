"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Save, Globe, Phone, MapPin, Loader2 } from "lucide-react";
import { matchServices, SERVICES } from "@/lib/service-matcher";

interface SearchResult {
  companyName: string;
  address: string;
  phone?: string;
  website?: string;
  industry?: string;
  saved?: boolean;
}

export default function SearchPage() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [source, setSource] = useState("");

  const search = async () => {
    if (!country || !city || !query) {
      toast.error("Please fill in all fields");
      return;
    }
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, city, country }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setResults(data.results || []);
        setSource(data.source || "");
        if (data.results?.length === 0) toast.info("No results found. Try different keywords.");
      }
    } catch {
      toast.error("Search failed. Check your connection.");
    }
    setSearching(false);
  };

  const saveProspect = async (result: SearchResult, index: number) => {
    try {
      await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: result.companyName,
          country,
          city,
          address: result.address,
          phone: result.phone,
          website: result.website,
          industry: result.industry || query,
        }),
      });
      setResults((prev) => prev.map((r, i) => (i === index ? { ...r, saved: true } : r)));
      toast.success(`${result.companyName} saved!`);
    } catch {
      toast.error("Failed to save prospect");
    }
  };

  const saveAll = async () => {
    const unsaved = results.filter((r) => !r.saved);
    if (unsaved.length === 0) return;
    try {
      await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          unsaved.map((r) => ({
            companyName: r.companyName,
            country,
            city,
            address: r.address,
            phone: r.phone,
            website: r.website,
            industry: r.industry || query,
          }))
        ),
      });
      setResults((prev) => prev.map((r) => ({ ...r, saved: true })));
      toast.success(`${unsaved.length} prospects saved!`);
    } catch {
      toast.error("Failed to save prospects");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Companies</h1>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Find Companies & Factories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Country</Label>
              <Input
                placeholder="e.g. France, Germany, USA"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                placeholder="e.g. Paris, Munich, New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label>Industry / Keywords</Label>
              <Input
                placeholder="e.g. automotive factory, manufacturing"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
            </div>
          </div>
          <Button onClick={search} disabled={searching} className="mt-4" size="lg">
            {searching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {searching ? "Searching..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Results ({results.length})
              </CardTitle>
              {source && (
                <p className="text-sm text-muted-foreground">
                  Source: {source === "google_places" ? "Google Places API" : "Web Search"}
                </p>
              )}
            </div>
            <Button onClick={saveAll} variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" /> Save All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Suggested Services</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, i) => {
                  const services = matchServices(result.industry || query);
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{result.companyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {result.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {result.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {result.phone}
                            </div>
                          )}
                          {result.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <a
                                href={result.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {services.slice(0, 3).map((sid) => {
                            const s = SERVICES.find((x) => x.id === sid);
                            return (
                              <Badge key={sid} variant="secondary" className="text-xs">
                                {s?.name.en}
                              </Badge>
                            );
                          })}
                          {services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={result.saved ? "secondary" : "default"}
                          disabled={result.saved}
                          onClick={() => saveProspect(result, i)}
                        >
                          {result.saved ? "Saved" : "Save"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
