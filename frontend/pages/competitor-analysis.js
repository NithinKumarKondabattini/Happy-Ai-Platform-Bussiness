import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

export default function CompetitorAnalysisPage() {
  useRequireAuth();
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!idea.trim()) {
      setError("Enter a startup idea first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/competitor-analysis/generate", { idea });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not generate competitor analysis right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Competitor Analysis">
      <div className="glass-card flex gap-3 p-4">
        <input className="field" placeholder="Enter startup idea" value={idea} onChange={(e) => setIdea(e.target.value)} />
        <button className="gradient-btn" onClick={run} disabled={loading}>{loading ? "Analyzing..." : "Find Competitors"}</button>
      </div>

      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}

      {result?.summary && (
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">AI Competitive Summary</h3>
          <p className="text-slate-300">{result.summary}</p>
        </div>
      )}

      <div className="glass-card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-slate-300"><tr><th>Company</th><th>Pricing</th><th>Features</th><th>Strengths</th><th>Weaknesses</th></tr></thead>
          <tbody>
            {(result?.competitors || []).map((c) => (
              <tr key={c.company} className="border-t border-white/10"><td>{c.company}</td><td>{c.pricing}</td><td>{c.features}</td><td>{c.strengths}</td><td>{c.weaknesses}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-2">Feature Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={result?.competitors || []}>
              <XAxis dataKey="company" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
              <Bar dataKey="feature_score" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2">Pricing Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={result?.pricing_distribution || []}>
              <XAxis dataKey="bucket" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
              <Bar dataKey="count" fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}