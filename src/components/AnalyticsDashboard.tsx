import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, Filter, Download, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EmptyState } from "./EmptyState";

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [selectedSeason, setSelectedSeason] = useState("winter-24-25");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/analytics?sport=${selectedSport}&season=${selectedSeason}`);
        // const data = await response.json();
        
        console.log(`⚠️ Analytics API not yet integrated. Sport: ${selectedSport}, Season: ${selectedSeason}`);
        setError("Analytics data not available yet. Backend integration needed.");
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Unable to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedSport, selectedSeason]);

  // Placeholder data for chart rendering (will be replaced with API data)
  const courtUtilizationData = [
    { name: "Court 1", utilization: 85 },
    { name: "Court 2", utilization: 92 },
    { name: "Court 3", utilization: 71 },
    { name: "Court 4", utilization: 88 },
  ];

  const participationTrendData = [
    { week: "Week 1", matches: 12, players: 45 },
    { week: "Week 2", matches: 15, players: 52 },
    { week: "Week 3", matches: 18, players: 61 },
    { week: "Week 4", matches: 16, players: 58 },
  ];

  const ratingDistributionData = [
    { name: "0-999", value: 24 },
    { name: "1000-1199", value: 35 },
    { name: "1200-1399", value: 28 },
    { name: "1400+", value: 13 },
  ];

  const forfeitsByTimeData = [
    { hour: "9-11am", forfeits: 2 },
    { hour: "11-1pm", forfeits: 0 },
    { hour: "1-3pm", forfeits: 1 },
    { hour: "3-5pm", forfeits: 0 },
    { hour: "5-7pm", forfeits: 3 },
  ];

  const COLORS = ["#0ea5e9", "#a3e635", "#f59e0b", "#ef4444"];

  const stats = [
    { label: "Total Matches", value: "156", change: "+12%", trend: "up" },
    { label: "Active Players", value: "328", change: "+8%", trend: "up" },
    { label: "Court Utilization", value: "79%", change: "+5%", trend: "up" },
    { label: "Avg Match Duration", value: "78 min", change: "-3%", trend: "down" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
          <button onClick={onBack} className="text-[var(--color-text-secondary)] mb-4">
            ← Back
          </button>
          <h1>Analytics Dashboard</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState 
            icon={AlertCircle}
            title="Analytics Unavailable"
            description={error}
            actionLabel="Go Back"
            onAction={onBack}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
          <button onClick={onBack} className="text-[var(--color-text-secondary)] mb-4">
            ← Back
          </button>
          <h1>Analytics Dashboard</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--color-bg-elevated)] border-t-[var(--color-primary)] animate-spin mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="mb-1">Analytics Dashboard</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              League Performance Overview
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm bg-white"
          >
            <option value="winter-24-25">Winter 24-25</option>
            <option value="fall-24">Fall 24</option>
            <option value="summer-24">Summer 24</option>
          </select>

          <button
            onClick={() => setSelectedSport("all")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedSport === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)]"
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setSelectedSport("bocce")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedSport === "bocce"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)]"
            }`}
          >
            Bocce
          </button>
          <button
            onClick={() => setSelectedSport("pickleball")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedSport === "pickleball"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)]"
            }`}
          >
            Pickleball
          </button>
          <button
            onClick={() => setSelectedSport("padel")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedSport === "padel"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)]"
            }`}
          >
            Padel
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
              <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                {stat.label}
              </div>
              <div className="text-2xl font-semibold mb-1">{stat.value}</div>
              <div
                className={`text-xs flex items-center gap-1 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Court Utilization by Club */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Court Utilization by Club</h2>
            <Badge variant="secondary">Top Performers</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courtUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="club" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="utilization" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-[var(--color-text-secondary)] mt-2">
            Average utilization: 79% • Target: 85%
          </div>
        </div>

        {/* Player Participation Trend */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Player Participation Trend</h2>
            <Badge className="bg-green-100 text-green-700">+24% Growth</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={participationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="players"
                stroke="var(--color-accent)"
                strokeWidth={3}
                dot={{ fill: "var(--color-accent)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-xs text-[var(--color-text-secondary)] mt-2">
            Weekly active players across all sports
          </div>
        </div>

        {/* Two Column Layout for Smaller Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Rating Distribution */}
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-base mb-4">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ratingDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-xs text-[var(--color-text-secondary)] mt-2">
              Total players: 328
            </div>
          </div>

          {/* Forfeits by Time Slot */}
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-base mb-4">Forfeits by Time Slot</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={forfeitsByTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="forfeits" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-[var(--color-text-secondary)] mt-2">
              Late time slots have higher forfeit rates
            </div>
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-base mb-2 text-blue-900">Key Insights</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Aronimink club shows highest court utilization at 91%</li>
                <li>• Player participation grew 24% over 8 weeks</li>
                <li>• 8-9 PM time slot has highest forfeit rate (needs attention)</li>
                <li>• Most players (42%) are in 3.0-4.0 rating range</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
