"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Send, FileDown, Loader2, CheckSquare, Square } from "lucide-react";
import { translations, type Language } from "@/lib/i18n";

interface Prospect {
  id: string;
  companyName: string;
  city: string;
  country: string;
  industry: string | null;
  contacts: { id: string; email: string }[];
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/prospects")
      .then((r) => r.json())
      .then(setProspects);
  }, []);

  // Set default email template when language changes
  useEffect(() => {
    const t = translations[language].email;
    setSubject(t.subject);
    setBody(
      `<p>${t.greeting}</p>
<p>${t.intro}</p>
<p>${t.servicesIntro}</p>
<ul>
  <li>3D Scanning / Numérisation 3D</li>
  <li>3D Printing / Impression 3D</li>
  <li>Reverse Engineering / Rétro-ingénierie</li>
  <li>Prototyping / Prototypage</li>
</ul>
<p>${t.closing}</p>
<p>${t.cta}</p>
<p>${t.regards}<br/>{{contact_name}}</p>`
    );
  }, [language]);

  const toggleProspect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const withContacts = prospects.filter((p) => p.contacts.length > 0);
    if (selectedIds.size === withContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(withContacts.map((p) => p.id)));
    }
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `presentation-${language}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
    setDownloading(false);
  };

  const sendCampaign = async () => {
    if (!name || !subject || !body) {
      toast.error("Please fill in campaign name, subject, and body");
      return;
    }
    if (selectedIds.size === 0) {
      toast.error("Please select at least one prospect");
      return;
    }

    setSending(true);
    try {
      // Create campaign
      const campaignRes = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, language, subject, body }),
      });
      const campaign = await campaignRes.json();

      // Send emails
      const sendRes = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          prospectIds: Array.from(selectedIds),
        }),
      });
      const result = await sendRes.json();

      if (result.sent > 0) {
        toast.success(`Campaign sent! ${result.sent} emails delivered, ${result.failed} failed.`);
        router.push("/campaigns");
      } else {
        toast.error(`All emails failed. ${result.results?.[0]?.error || "Check settings."}`);
      }
    } catch {
      toast.error("Failed to send campaign");
    }
    setSending(false);
  };

  const prospectsWithContacts = prospects.filter((p) => p.contacts.length > 0);
  const prospectsWithoutContacts = prospects.filter((p) => p.contacts.length === 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Campaign</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Campaign Config */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    placeholder="e.g. France Q1 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Use {"{{company}}"} and {"{{industry}}"} for personalization
                </p>
              </div>

              <div>
                <Label>Email Body (HTML)</Label>
                <Textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Variables: {"{{company}}"}, {"{{industry}}"}, {"{{contact_name}}"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Select Prospects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Select Prospects ({selectedIds.size} selected)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedIds.size === prospectsWithContacts.length ? "Deselect All" : "Select All"}
              </Button>
            </CardHeader>
            <CardContent>
              {prospectsWithContacts.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No prospects with contacts. Go find contacts first!
                </p>
              ) : (
                <div className="space-y-2">
                  {prospectsWithContacts.map((p) => (
                    <div
                      key={p.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
                      onClick={() => toggleProspect(p.id)}
                    >
                      {selectedIds.has(p.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{p.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.city}, {p.country} — {p.contacts.length} contact(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {prospectsWithoutContacts.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">
                    {prospectsWithoutContacts.length} prospect(s) without contacts (not selectable)
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PDF Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Download a professional PDF to attach to your emails.
              </p>
              <Button
                onClick={downloadPdf}
                disabled={downloading}
                variant="outline"
                className="w-full"
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                {downloading ? "Generating..." : `Download PDF (${language.toUpperCase()})`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p><strong>Recipients:</strong> {selectedIds.size} prospect(s)</p>
                <p><strong>Language:</strong> {language === "en" ? "English" : "Français"}</p>
              </div>
              <Button
                onClick={sendCampaign}
                disabled={sending || selectedIds.size === 0}
                className="w-full"
                size="lg"
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {sending ? "Sending..." : "Send Campaign"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
