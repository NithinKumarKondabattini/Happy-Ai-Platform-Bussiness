import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { downloadReport } from "../lib/downloadReport";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loadingKey, setLoadingKey] = useState("");

  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        setData(res.data);
        setError("");
      })
      .catch(() => setError("Could not load your profile."));
  }, []);

  const handleDownload = async (type, format) => {
    const key = `${type}:${format}`;
    setLoadingKey(key);
    setError("");
    try {
      await downloadReport(type, format);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not download the selected report.");
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <Layout title="Profile">
      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">User Profile</h3>
          <p>Name: {data?.user?.name || "-"}</p>
          <p>Email: {data?.user?.email || "-"}</p>
          <p>Joined: {data?.user?.created_at || "-"}</p>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">Saved Startup Ideas</h3>
          <ul className="space-y-2 text-slate-300">{(data?.saved_startup_ideas || []).map((item, index) => <li key={`${item.idea}-${index}`}>{item.idea} ({item.score}%)</li>)}</ul>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">Uploaded Contracts</h3>
          <ul className="space-y-2 text-slate-300">{(data?.uploaded_contracts || []).map((item, index) => <li key={`${item.file}-${index}`}>{item.file} (risk {item.risk_score})</li>)}</ul>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">Generated Reports</h3>
          <div className="space-y-2 text-slate-300">
            {(data?.generated_reports || []).map((item, index) => {
              const key = `${item.type}:${item.format}`;
              return (
                <div key={`${item.type}-${item.format}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2">
                  <span>{item.type} / {item.format}</span>
                  <button className="rounded-xl border border-cyan-400/40 px-3 py-1 text-sm" onClick={() => handleDownload(item.type, item.format)} disabled={loadingKey === key}>
                    {loadingKey === key ? "Downloading..." : "Download"}
                  </button>
                </div>
              );
            })}
            {(!data?.generated_reports || data.generated_reports.length === 0) && <p>No reports generated yet.</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
