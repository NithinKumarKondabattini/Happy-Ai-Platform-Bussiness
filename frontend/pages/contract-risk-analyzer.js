import { useRef, useState } from "react";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

export default function ContractRiskPage() {
  useRequireAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!file) {
      setError("Choose a PDF or DOCX file first.");
      return;
    }

    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await api.post("/contract-risk-analyzer/analyze", form, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not analyze this contract.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Contract Risk Analyzer">
      <div className="glass-card space-y-3 p-4">
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <div onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()} className="rounded-xl border border-dashed border-cyan-300/40 p-8 text-center">
          <p className="text-slate-300">Drag & drop PDF/DOCX here</p>
          <input ref={inputRef} className="hidden" type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
          <button className="gradient-btn mt-3" onClick={() => inputRef.current?.click()} type="button">Upload</button>
        </div>
        {file && <p className="text-sm text-cyan-200">Selected: {file.name}</p>}
        <button className="gradient-btn" onClick={analyze} type="button">{loading ? "Analyzing..." : "Analyze Contract"}</button>
      </div>

      {!!result && (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card p-4">
            <h3 className="text-lg">Risk Score: {result.risk_score}</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{result.summary}</p>
            <p className="mt-3 text-sm">Risky Clauses: {(result.risky_clauses || []).join(", ") || "None"}</p>
          </div>
          <div className="glass-card p-4">
            <h3 className="mb-2">Risk Heatmap Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={result.risk_heatmap || []}>
                <XAxis dataKey="clause" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0b1530", border: "1px solid #2a3f6d" }} />
                <Bar dataKey="risk" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  );
}
