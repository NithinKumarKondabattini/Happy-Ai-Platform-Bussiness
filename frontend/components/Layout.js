import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Bell, Bot, Briefcase, ClipboardList, FileText, Gauge, Home, LineChart, Moon, Settings, Sun, User } from "lucide-react";
import AssistantDock from "./AssistantDock";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/startup-idea-validator", label: "Startup Idea Validator", icon: Gauge },
  { href: "/contract-risk-analyzer", label: "Contract Risk Analyzer", icon: FileText },
  { href: "/market-research", label: "Market Research", icon: LineChart },
  { href: "/competitor-analysis", label: "Competitor Analysis", icon: Briefcase },
  { href: "/business-strategy-generator", label: "Business Strategy Generator", icon: ClipboardList },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Layout({ title, children, rightAction, hideAssistantDock = false }) {
  const router = useRouter();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-[280px,1fr]">
        <aside className="glass-card h-[calc(100vh-2rem)] p-4 lg:sticky lg:top-4">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Happy Ai</h1>
            <p className="text-xs text-slate-300">AI Business Intelligence</p>
          </div>
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-cyan-500/20 text-cyan-200" : "bg-white/0 text-slate-300 hover:bg-white/10"}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-4 lg:pr-[440px]">
          <div className="glass-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-sm text-slate-300">Production-grade insights cockpit</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-xl border border-white/20 bg-white/5 p-2" onClick={() => setDark((value) => !value)} type="button">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="rounded-xl border border-white/20 bg-white/5 p-2" onClick={() => router.push("/settings")} type="button">
                <Bell size={18} />
              </button>
              {rightAction}
            </div>
          </div>
          {children}
        </main>
      </div>

      {!hideAssistantDock && <AssistantDock />}
    </div>
  );
}
