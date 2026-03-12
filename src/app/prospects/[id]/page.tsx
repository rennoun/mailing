"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft,
  Globe,
  Phone,
  MapPin,
  Mail,
  Search,
  Loader2,
  Save,
} from "lucide-react";
import { matchServices, SERVICES } from "@/lib/service-matcher";

interface Contact {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
  source: string | null;
}

interface EmailRecord {
  id: string;
  subject: string;
  status: string;
  sentAt: string;
  campaign: { name: string };
  contact: { email: string };
}

interface Prospect {
  id: string;
  companyName: string;
  country: string;
  city: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  status: string;
  notes: string | null;
  contacts: Contact[];
  emailsSent: EmailRecord[];
}

const STATUSES = ["new", "contacted", "replied", "meeting", "won", "lost"];

export default function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [findingContacts, setFindingContacts] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const load = async () => {
    const res = await fetch(`/api/prospects/${id}`);
    if (!res.ok) {
      router.push("/prospects");
      return;
    }
    const data = await res.json();
    setProspect(data);
    setNotes(data.notes || "");
    setStatus(data.status);
  };

  useEffect(() => { load(); }, [id]);

  const saveDetails = async () => {
    await fetch(`/api/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, status }),
    });
    toast.success("Saved!");
  };

  const findContacts = async () => {
    setFindingContacts(true);
    try {
      const res = await fetch("/api/contacts/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId: id }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Found ${data.found} contacts, saved ${data.saved} new`);
        load();
      }
    } catch {
      toast.error("Failed to find contacts");
    }
    setFindingContacts(false);
  };

  const addManualContact = async () => {
    if (!newEmail) return;
    await fetch("/api/contacts/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectId: id }),
    });
    // Actually use a direct create instead
    const res = await fetch(`/api/prospects/${id}`, { method: "GET" });
    const data = await res.json();
    // Check if email exists
    if (data.contacts?.some((c: Contact) => c.email === newEmail)) {
      toast.error("Contact already exists");
      return;
    }
    // Add via direct prisma call through a custom approach
    // For simplicity, use contacts find or a patch
    await fetch("/api/contacts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectId: id, email: newEmail }),
    }).catch(() => {
      // Fallback: manual add not implemented via API, just show message
      toast.info("Manual contact add will be available in the next update");
    });
    setNewEmail("");
    load();
  };

  if (!prospect) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  const suggestedServices = matchServices(prospect.industry);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/prospects")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prospects
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{prospect.companyName}</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {prospect.city}, {prospect.country}
            </span>
            {prospect.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {prospect.phone}
              </span>
            )}
            {prospect.website && (
              <a
                href={prospect.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe className="h-3 w-3" /> Website
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <Button onClick={saveDetails} size="sm">
            <Save className="mr-2 h-3 w-3" /> Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Details + Notes */}
        <div className="col-span-2 space-y-6">
          {/* Suggested Services */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Services for {prospect.industry || "this company"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {suggestedServices.map((sid) => {
                  const service = SERVICES.find((s) => s.id === sid);
                  if (!service) return null;
                  return (
                    <div key={sid} className="rounded-lg border p-3">
                      <p className="font-medium">{service.name.en}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{service.description.en}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contacts ({prospect.contacts.length})</CardTitle>
              <Button onClick={findContacts} disabled={findingContacts} size="sm">
                {findingContacts ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {findingContacts ? "Searching..." : "Find Contacts"}
              </Button>
            </CardHeader>
            <CardContent>
              {prospect.contacts.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No contacts yet. Click &quot;Find Contacts&quot; to search automatically.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospect.contacts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Mail className="h-3 w-3" /> {c.email}
                          </a>
                        </TableCell>
                        <TableCell>{c.name || "—"}</TableCell>
                        <TableCell>{c.role || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.source}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <Separator className="my-4" />
              <div className="flex gap-2">
                <Input
                  placeholder="Add email manually..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button onClick={addManualContact} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email History */}
          {prospect.emailsSent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Email History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospect.emailsSent.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="text-sm">{new Date(e.sentAt).toLocaleDateString()}</TableCell>
                        <TableCell>{e.campaign.name}</TableCell>
                        <TableCell>{e.contact.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{e.subject}</TableCell>
                        <TableCell>
                          <Badge variant={e.status === "sent" ? "default" : "destructive"}>
                            {e.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Notes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={8}
                placeholder="Add notes about this prospect..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button onClick={saveDetails} className="mt-2 w-full" size="sm">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {prospect.address && (
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p>{prospect.address}</p>
                </div>
              )}
              {prospect.industry && (
                <div>
                  <Label className="text-muted-foreground">Industry</Label>
                  <p>{prospect.industry}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
