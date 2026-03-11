import { useState } from "react";
import Layout from "../components/Layout";
import { downloadReport } from "../lib/downloadReport";
import useRequireAuth from "../lib/useRequireAuth";

export default function ReportsPage() {
  useRequireAuth();
  const [loadingKey, setLoadingKey] = useState("");
  const [error, setError] = useState("");

  const openReport = async (type, format) => {
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
    <Layout title="Reports">
      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        {["startup_analysis", "contract_risk", "market_research"].map((type) => (
          <div key={type} className="glass-card space-y-3 p-4">
            <h3 className="text-lg font-medium">{type.replaceAll("_", " ")}</h3>
            <button className="gradient-btn w-full" onClick={() => openReport(type, "pdf")} disabled={loadingKey === `${type}:pdf`}>{loadingKey === `${type}:pdf` ? "Downloading..." : "Download PDF"}</button>
            <button className="rounded-xl border border-cyan-400/40 px-4 py-2" onClick={() => openReport(type, "excel")} disabled={loadingKey === `${type}:excel`}>{loadingKey === `${type}:excel` ? "Downloading..." : "Download Excel"}</button>
            <button className="rounded-xl border border-cyan-400/40 px-4 py-2" onClick={() => openReport(type, "csv")} disabled={loadingKey === `${type}:csv`}>{loadingKey === `${type}:csv` ? "Downloading..." : "Download CSV"}</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
