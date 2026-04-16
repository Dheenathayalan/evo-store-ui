"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { verifyResetToken, confirmPasswordReset } from "@/lib/api/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [mounted, setMounted] = useState(false);
  const [userid, setUserid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (!token) {
      setError("Invalid or missing reset token.");
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res: any = await verifyResetToken(token);
        setUserid(res?.userid || res?.data?.userid);
        setEmail(res?.email || res?.data?.email);
      } catch (err: any) {
        setError("This reset link is invalid or has expired.");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [mounted, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userid) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await confirmPasswordReset({ userid, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="h-[calc(100vh-52px)] bg-black" />;

  return (
    <div className="relative h-[calc(100vh-52px)] w-full bg-black text-white">
      {/* Background (matching Login/Signup) */}
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
          className="w-full h-full object-cover opacity-60"
          alt="background"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="w-[500px] max-w-[90%] bg-black/40 backdrop-blur-md p-10 rounded-xl border border-white/10">
          <h1 className="text-2xl font-light tracking-[0.3em] text-center mb-10">
            RESET PASSWORD
          </h1>

          {verifying ? (
            <div className="flex flex-col items-center justify-center py-10">
              <span className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-sm tracking-widest text-white/70">VERIFYING TOKEN...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400 mb-6 tracking-wide">{error}</p>
              <Link
                href="/forgot-password"
                className="inline-block border border-white/30 hover:border-white px-8 py-3 rounded-full text-sm tracking-widest transition"
              >
                REQUEST NEW LINK
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                ✓
              </div>
              <p className="text-lg tracking-wide mb-2">PASSWORD RESET SUCCESSFUL</p>
              <p className="text-sm text-white/50 tracking-widest mb-8">Redirecting you to login...</p>
              <Link
                href="/login"
                className="inline-block bg-white text-black px-10 py-3 rounded-full text-sm tracking-widest hover:bg-gray-200 transition"
              >
                LOGIN NOW
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {email && (
                <p className="text-center text-sm text-white/50 tracking-widest mb-4">
                  Resetting password for: <span className="text-white">{email}</span>
                </p>
              )}

              <div className="relative">
                <label className="block text-xs tracking-[0.2em] text-white/50 mb-2 uppercase">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  required
                  className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="relative">
                <label className="block text-xs tracking-[0.2em] text-white/50 mb-2 uppercase">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  required
                  className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition py-4 rounded-full tracking-[0.2em] text-sm mt-4 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    SAVING...
                  </>
                ) : (
                  "UPDATE PASSWORD"
                )}
              </button>
            </form>
          )}

          <div className="mt-10 text-center">
            <Link href="/login" className="text-xs tracking-[0.2em] text-white/30 hover:text-white transition">
              BACK TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
