"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/store/auth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  // ── All hooks must be declared before any conditional return ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Already logged in → skip to profile (after mount)
  useEffect(() => {
    if (mounted && isLoggedIn()) router.replace("/profile");
  }, [mounted]);

  if (!mounted || isLoggedIn()) return <div className="h-[calc(100vh-52px)]" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await login({ email, password });

      // Accept token as res.token or res.access_token
      const token = res?.token ?? res?.access_token ?? "";
      const user = res?.user ?? res?.data ?? {};
      const isAdmin = res?.isAdmin ?? false;

      setAuth(token, user, isAdmin);
      router.push("/profile");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-52px)] w-full bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <form onSubmit={handleSubmit} className="w-[500px] max-w-[90%]">
          <div className="mb-10">
            <label className="block text-sm tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm tracking-widest mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                required
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-white/70 hover:text-white transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mt-2 mb-2 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition py-3 rounded-full tracking-widest mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                LOGGING IN...
              </>
            ) : (
              "LOGIN"
            )}
          </button>

          <p className="text-center mt-6 text-sm text-white/70">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Create one.
            </Link>
          </p>

          <p className="text-center mt-3 text-sm">
            <Link
              href="/forgot-password"
              className="text-white/70 hover:text-white underline transition-colors"
            >
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
