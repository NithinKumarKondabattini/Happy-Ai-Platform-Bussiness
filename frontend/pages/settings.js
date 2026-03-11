import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api, clearToken } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

export default function SettingsPage() {
  useRequireAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/notifications")
      .then((res) => {
        setNotifications(res.data);
        setError("");
      })
      .catch(() => setError("Could not load your activity timeline."));
  }, []);

  return (
    <Layout title="Settings">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card space-y-3 p-4">
          <h3 className="text-lg">Account Settings</h3>
          <p className="text-sm text-slate-300">Manage preferences, tokens, and workspace controls.</p>
          <button className="rounded-xl border border-rose-400/40 px-4 py-2 text-rose-200" onClick={() => { clearToken(); window.location.href = "/login"; }}>
            Logout
          </button>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-2 text-lg">Activity Timeline</h3>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          {!error && notifications.length === 0 && <p className="text-sm text-slate-300">No activity yet.</p>}
          <ul className="space-y-2 text-sm text-slate-300">
            {notifications.map((item, index) => (
              <li key={`${item.title}-${index}`}>- [{item.category}] {item.title} - {item.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
