import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { DemandLineChart, GrowthBarChart, PieRiskChart, TrendChart } from "../charts/DashboardCharts";
import { api } from "../lib/api";
import useRequireAuth from "../lib/useRequireAuth";

const cardLinks = {
  startup_success_score: "/startup-idea-validator",
  contract_risk_score: "/contract-risk-analyzer",
  market_demand_score: "/market-research",
  competitor_count: "/competitor-analysis",
};

export default function DashboardPage() {
  useRequireAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/summary")
      .then((res) => {
        setData(res.data);
        setError("");
      })
      .catch(() => {
        setError("Could not load dashboard data.");
        router.push("/login");
      });
  }, [router]);

  return (
    <Layout title="Dashboard">
      {error && <div className="glass-card p-4 text-sm text-rose-300">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data &&
          Object.entries(data.cards).map(([key, value]) => (
            <StatCard key={key} title={key.replaceAll("_", " ")} value={value} onClick={() => router.push(cardLinks[key])} />
          ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="mb-3 text-lg font-medium">Startup Success Trend</h3>
          <TrendChart data={data?.charts?.startup_trend || []} dataKey="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="mb-3 text-lg font-medium">Market Demand Analytics</h3>
          <DemandLineChart data={data?.charts?.market_demand || []} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="mb-3 text-lg font-medium">Contract Risk Distribution</h3>
          <PieRiskChart data={data?.charts?.contract_risk_distribution || []} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="mb-3 text-lg font-medium">Competitor Growth</h3>
          <GrowthBarChart data={data?.charts?.competitor_growth || []} />
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="glass-card p-4">
          <h4 className="mb-2 text-base font-medium">Weekly Business Insights</h4>
          <ul className="space-y-2 text-sm text-slate-300">{(data?.widgets?.weekly_insights || []).map((item) => <li key={item}>- {item}</li>)}</ul>
        </div>
        <div className="glass-card p-4">
          <h4 className="mb-2 text-base font-medium">Recent Analyses</h4>
          <ul className="space-y-2 text-sm text-slate-300">{(data?.widgets?.recent_analyses || []).map((item) => <li key={item}>- {item}</li>)}</ul>
        </div>
        <div className="glass-card p-4">
          <h4 className="mb-2 text-base font-medium">AI Recommendations</h4>
          <ul className="space-y-2 text-sm text-slate-300">{(data?.widgets?.recommendations || []).map((item) => <li key={item}>- {item}</li>)}</ul>
        </div>
        <div className="glass-card p-4">
          <h4 className="mb-2 text-base font-medium">Automation Notifications</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {(data?.widgets?.notifications || []).map((item, index) => (
              <li key={`${item.title}-${index}`}>- {item.title}: {item.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
