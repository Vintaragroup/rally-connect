import { useState } from "react";
import { BarChart3, TrendingUp, Users, Calendar, Filter, Download } from "lucide-react";
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

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [selectedSeason, setSelectedSeason] = useState("winter-24-25");

  // Mock data for charts
  const courtUtilizationData = [
    { club: "Merion", utilization: 87 },
    { club: "Radnor", utilization: 72 },
    { club: "Aronimink", utilization: 91 },
    { club: "Wayne", utilization: 65 },
    { club: "Haverford", utilization: 78 },
  ];

  const participationTrendData = [
    { week: "Week 1", players: 45 },
    { week: "Week 2", players: 52 },
    { week: "Week 3", players: 48 },
    { week: "Week 4", players: 61 },
    { week: "Week 5", players: 58 },
    { week: "Week 6", players: 67 },
    { week: "Week 7", players: 72 },
    { week: "Week 8", players: 69 },
  ];

  const ratingDistributionData = [
    { name: "1.0-2.0", value: 8 },
    { name: "2.0-3.0", value: 23 },
    { name: "3.0-4.0", value: 42 },
    { name: "4.0-5.0", value: 27 },
  ];

  const forfeitsByTimeData = [
    { time: "5 PM", forfeits: 2 },
    { time: "6 PM", forfeits: 1 },
    { time: "7 PM", forfeits: 4 },
    { time: "8 PM", forfeits: 7 },
    { time: "9 PM", forfeits: 5 },
  ];

  const COLORS = ["#0ea5e9", "#a3e635", "#f59e0b", "#ef4444"];

  const stats = [
    { label: "Total Matches", value: "156", change: "+12%", trend: "up" },
    { label: "Active Players", value: "328", change: "+8%", trend: "up" },
    { label: "Court Utilization", value: "79%", change: "+5%", trend: "up" },
    { label: "Avg Match Duration", value: "78 min", change: "-3%", trend: "down" },
  ];

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
