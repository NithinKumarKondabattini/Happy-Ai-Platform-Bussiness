import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { downloadReport } from "../lib/downloadReport";
import useRequireAuth from "../lib/useRequireAuth";

export default function StrategyPage() {
  useRequireAuth();
  const [idea, setIdea] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!idea.trim()) {
      setError("Enter a startup idea first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/business-strategy/generate", { idea });
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not generate the strategy right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      await downloadReport("startup_strategy", "pdf");
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not download the strategy report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout title="Business Strategy Generator">
      <div className="glass-card space-y-3 p-4">
        <textarea className="field min-h-28" placeholder="Enter startup idea" value={idea} onChange={(e) => setIdea(e.target.value)} />
        <div className="flex gap-3">
          <button className="gradient-btn" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Strategy"}</button>
          <button className="rounded-xl border border-cyan-400/40 px-4 py-2" onClick={handleDownload} disabled={downloading}>{downloading ? "Downloading..." : "Download Strategy Report"}</button>
        </div>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>

      {data && (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card p-4"><h3 className="mb-2 text-lg">Business Plan</h3><p className="text-slate-300">{data.business_plan}</p></div>
          <div className="glass-card p-4"><h3 className="mb-2 text-lg">Marketing Strategy</h3><p className="text-slate-300">{data.marketing_strategy}</p></div>
          <div className="glass-card p-4"><h3 className="mb-2 text-lg">Revenue Model</h3><p className="text-slate-300">{data.revenue_model}</p></div>
          <div className="glass-card p-4">
            <h3 className="mb-2 text-lg">Growth Roadmap</h3>
            <ul className="space-y-2 text-slate-300">{(data.growth_roadmap || []).map((item) => <li key={item}>- {item}</li>)}</ul>
          </div>
        </div>
      )}
    </Layout>
  );
}
