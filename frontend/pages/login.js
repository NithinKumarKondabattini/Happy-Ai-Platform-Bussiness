import { useState } from "react";
import { useRouter } from "next/router";
import { api, setToken } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button className="gradient-btn w-full">Login</button>
        <p className="text-sm text-slate-300">
          New user? <a href="/signup" className="text-cyan-300">Create account</a>
        </p>
      </form>
    </div>
  );
}
