import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#0ea5e9", "#6366f1", "#22d3ee", "#f97316"];

export function TrendChart({ data, dataKey = "success" }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
        <Area type="monotone" dataKey={dataKey} stroke="#67e8f9" fill="url(#trend)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PieRiskChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={90}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function GrowthBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="q" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
        <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DemandLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
        <Line type="monotone" dataKey="demand" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

