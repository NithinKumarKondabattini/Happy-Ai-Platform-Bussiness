import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../components/Layout";
import Gauge from "../charts/Gauge";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

export default function StartupValidatorPage() {
  useRequireAuth();
  const [form, setForm] = useState({ idea: "", target_audience: "", industry: "", revenue_model: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/startup-idea-validator/analyze", form);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not analyze the startup idea.");
    } finally {
      setLoading(false);
    }
  };

  const bars = result
    ? [
        { name: "Market Demand", value: result.market_demand },
        { name: "Competition", value: result.competition_level },
        { name: "Profit", value: result.profit_potential },
      ]
    : [];

  return (
    <Layout title="Startup Idea Validator">
      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card space-y-3 p-4">
          <textarea className="field min-h-24" placeholder="Startup idea description" onChange={(e) => setForm({ ...form, idea: e.target.value })} />
          <input className="field" placeholder="Target audience" onChange={(e) => setForm({ ...form, target_audience: e.target.value })} />
          <input className="field" placeholder="Industry" onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <input className="field" placeholder="Revenue model" onChange={(e) => setForm({ ...form, revenue_model: e.target.value })} />
          <button className="gradient-btn" onClick={submit} disabled={loading}>{loading ? "Analyzing..." : "Analyze Idea"}</button>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-lg">Success Probability Gauge</h3>
          <Gauge value={result?.success_probability || 0} label="Startup Success" />
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="mb-3 text-lg">Market / Competition / Profit</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={bars}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
            <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!!result?.insights?.length && (
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">AI Insights</h3>
          <ul className="space-y-2 text-slate-300">{result.insights.map((item) => <li key={item}>- {item}</li>)}</ul>
        </div>
      )}
    </Layout>
  );
}
