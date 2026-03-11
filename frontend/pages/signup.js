import { useState } from "react";
import { useRouter } from "next/router";
import { api, setToken } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (detail === "Email already exists") {
        setError("This email is already registered. Please log in or use a different email.");
      } else {
        setError(detail || err?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <input className="field" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button className="gradient-btn w-full" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
      </form>
    </div>
  );
}