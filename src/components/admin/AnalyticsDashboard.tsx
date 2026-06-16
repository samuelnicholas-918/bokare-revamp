"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, Search, Users } from "lucide-react";

interface AnalyticsData {
  overview: {
    uniqueSessions: number;
    totalEvents: number;
    downloads: number;
    searches: number;
    views: number;
  };
  topDownloads: Array<{
    materialId: string;
    downloads: number;
    uniqueDownloads: number;
    title?: string;
    course?: string;
  }>;
  popularSearches: Array<{ query: string; timesSearched: number; avgResults: number }>;
  traffic: Array<{ date: string; uniqueSessions: number; totalEvents: number }>;
  devices: Array<{ deviceType: string; events: number }>;
}

const COLORS = ["#0D7377", "#00A8E8", "#7B2CBF", "#F4A261"];

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics/overview?days=30")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-muted-foreground">Failed to load analytics.</p>;
  }

  const { overview, topDownloads, popularSearches, traffic, devices } = data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Unique Sessions" value={overview.uniqueSessions} />
        <StatCard icon={Download} label="Downloads" value={overview.downloads} />
        <StatCard icon={Eye} label="Material Views" value={overview.views} />
        <StatCard icon={Search} label="Searches" value={overview.searches} />
      </div>

      <p className="text-xs text-muted-foreground">
        Privacy-first analytics — anonymous sessions only, no personal data collected.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {traffic.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={traffic}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="uniqueSessions" stroke="#0D7377" name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {devices.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="events"
                    nameKey="deviceType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {devices.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            {topDownloads.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDownloads.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={120}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => (v.length > 18 ? `${v.slice(0, 18)}…` : v)}
                    />
                    <Tooltip />
                    <Bar dataKey="downloads" fill="#0D7377" name="Downloads" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            {popularSearches.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-2">
                {popularSearches.slice(0, 10).map((s, i) => (
                  <li key={s.query} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="mr-2 text-muted-foreground">#{i + 1}</span>
                      &ldquo;{s.query}&rdquo;
                    </span>
                    <span className="font-medium">{s.timesSearched}×</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data yet — analytics populate as students use the site.
    </p>
  );
}
