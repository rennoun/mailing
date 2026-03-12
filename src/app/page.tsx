"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Mail, Send, BarChart3, Search, Plus } from "lucide-react";

interface Stats {
  totalProspects: number;
  totalContacts: number;
  totalEmailsSent: number;
  totalCampaigns: number;
  recentProspects: {
    id: string;
    companyName: string;
    city: string;
    country: string;
    status: string;
    createdAt: string;
    _count: { contacts: number };
  }[];
  recentCampaigns: {
    id: string;
    name: string;
    language: string;
    createdAt: string;
    _count: { emailsSent: number };
  }[];
  statusCounts: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  replied: "bg-green-100 text-green-800",
  meeting: "bg-purple-100 text-purple-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <div className="py-12 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  const statCards = [
    { title: "Total Prospects", value: stats.totalProspects, icon: Users, color: "text-blue-600" },
    { title: "Total Contacts", value: stats.totalContacts, icon: Mail, color: "text-green-600" },
    { title: "Emails Sent", value: stats.totalEmailsSent, icon: Send, color: "text-orange-600" },
    { title: "Campaigns", value: stats.totalCampaigns, icon: BarChart3, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/search">
            <Button>
              <Search className="mr-2 h-4 w-4" /> Search Companies
            </Button>
          </Link>
          <Link href="/campaigns/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`rounded-lg bg-muted p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.title}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      {stats.statusCounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prospect Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {stats.statusCounts.map((s) => (
                <div key={s.status} className="flex-1 rounded-lg border p-3 text-center">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[s.status] || ""}`}>
                    {s.status}
                  </span>
                  <p className="mt-2 text-2xl font-bold">{s.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Prospects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Prospects</CardTitle>
            <Link href="/prospects">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentProspects.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No prospects yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentProspects.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link href={`/prospects/${p.id}`} className="font-medium hover:underline">
                          {p.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.city}, {p.country}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[p.status] || ""}`}>
                          {p.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Link href="/campaigns">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentCampaigns.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No campaigns yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Emails</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentCampaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c._count.emailsSent}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
