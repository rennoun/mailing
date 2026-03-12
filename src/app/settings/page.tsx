"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Key, Mail, Building } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Places API Key</Label>
            <Input
              type="password"
              placeholder="AIza..."
              value={settings.google_places_api_key || ""}
              onChange={(e) => update("google_places_api_key", e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used to search for companies. Get one at console.cloud.google.com
            </p>
          </div>
          <div>
            <Label>Hunter.io API Key</Label>
            <Input
              type="password"
              placeholder="Your Hunter.io key"
              value={settings.hunter_api_key || ""}
              onChange={(e) => update("hunter_api_key", e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used to find email addresses. Get one at hunter.io
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sending Method</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={settings.email_method || "smtp"}
              onChange={(e) => update("email_method", e.target.value)}
            >
              <option value="smtp">SMTP (Gmail, Outlook, etc.)</option>
              <option value="resend">Resend API</option>
            </select>
          </div>

          <Separator />

          <p className="text-sm font-medium">SMTP Settings</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>SMTP Host</Label>
              <Input
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || ""}
                onChange={(e) => update("smtp_host", e.target.value)}
              />
            </div>
            <div>
              <Label>SMTP Port</Label>
              <Input
                placeholder="587"
                value={settings.smtp_port || ""}
                onChange={(e) => update("smtp_port", e.target.value)}
              />
            </div>
            <div>
              <Label>SMTP Username</Label>
              <Input
                placeholder="your@email.com"
                value={settings.smtp_user || ""}
                onChange={(e) => update("smtp_user", e.target.value)}
              />
            </div>
            <div>
              <Label>SMTP Password</Label>
              <Input
                type="password"
                placeholder="App password"
                value={settings.smtp_pass || ""}
                onChange={(e) => update("smtp_pass", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Resend API Key</Label>
            <Input
              type="password"
              placeholder="re_..."
              value={settings.resend_api_key || ""}
              onChange={(e) => update("resend_api_key", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Your Company Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This info will appear on PDF presentations and outgoing emails.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                placeholder="Your Company"
                value={settings.company_name || ""}
                onChange={(e) => update("company_name", e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="contact@company.com"
                value={settings.company_email || ""}
                onChange={(e) => update("company_email", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                placeholder="+1 234 567 890"
                value={settings.company_phone || ""}
                onChange={(e) => update("company_phone", e.target.value)}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                placeholder="www.company.com"
                value={settings.company_website || ""}
                onChange={(e) => update("company_website", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input
              placeholder="123 Street, City, Country"
              value={settings.company_address || ""}
              onChange={(e) => update("company_address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="w-full" size="lg">
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
