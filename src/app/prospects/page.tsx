"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Eye, Trash2, Search, Download, Users } from "lucide-react";

interface Prospect {
  id: string;
  companyName: string;
  country: string;
  city: string;
  industry: string | null;
  status: string;
  contacts: { id: string; email: string }[];
  _count: { emailsSent: number };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  replied: "bg-green-100 text-green-800",
  meeting: "bg-purple-100 text-purple-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/prospects");
    setProspects(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteProspect = async (id: string) => {
    if (!confirm("Delete this prospect?")) return;
    await fetch(`/api/prospects/${id}`, { method: "DELETE" });
    toast.success("Prospect deleted");
    load();
  };

  const exportCsv = () => {
    const headers = ["Company", "Country", "City", "Industry", "Status", "Contacts", "Emails Sent"];
    const rows = filtered.map((p) => [
      p.companyName,
      p.country,
      p.city,
      p.industry || "",
      p.status,
      p.contacts.map((c) => c.email).join("; "),
      p._count.emailsSent,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospects.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = prospects.filter(
    (p) =>
      p.companyName.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      (p.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prospects ({prospects.length})</h1>
        <Button onClick={exportCsv} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search by company, country, city, industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Prospects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No prospects yet. Start searching!</p>
              <Link href="/search">
                <Button className="mt-4">Go to Search</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contacts</TableHead>
                  <TableHead>Emails</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.companyName}</TableCell>
                    <TableCell>{p.city}, {p.country}</TableCell>
                    <TableCell>
                      {p.industry && <Badge variant="outline">{p.industry}</Badge>}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[p.status] || ""}`}>
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>{p.contacts.length}</TableCell>
                    <TableCell>{p._count.emailsSent}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/prospects/${p.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => deleteProspect(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
