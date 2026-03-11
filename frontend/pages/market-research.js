import { useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

const colors = ["#22d3ee", "#818cf8", "#f59e0b"];

export default function MarketResearchPage() {
  useRequireAuth();
  const [industry, setIndustry] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!industry.trim()) {
      setError("Enter an industry or startup type first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/market-research/generate", { industry });
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not generate market research right now.");
    } finally {
      setLoading(false);
    }
  };

  const segments = (data?.customer_segments || []).map((segment, index) => ({ name: segment, value: 30 + index * 20 }));

  return (
    <Layout title="Market Research">
      <div className="glass-card flex gap-3 p-4">
        <input className="field" placeholder="Enter industry / startup type" value={industry} onChange={(e) => setIndustry(e.target.value)} />
        <button className="gradient-btn" onClick={generate} type="button">{loading ? "Generating..." : "Generate"}</button>
      </div>
      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="glass-card p-4"><p className="text-sm text-slate-300">Market Size</p><p className="text-2xl text-cyan-200">{data?.market_size || "-"}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-slate-300">Industry Growth</p><p className="text-2xl text-cyan-200">{data?.industry_growth || "-"}</p></div>
        <div className="glass-card p-4"><p className="text-sm text-slate-300">Customer Segments</p><p className="text-lg text-cyan-100">{(data?.customer_segments || []).join(", ") || "-"}</p></div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-2">Demand Prediction</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data?.demand_forecast || []}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
              <Line dataKey="demand" stroke="#22d3ee" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2">Industry Segmentation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={segments} dataKey="value" outerRadius={90}>
                {segments.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
