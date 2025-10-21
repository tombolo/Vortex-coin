"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Load pending signup from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingSignup");
      if (!raw) {
        router.replace("/signup");
        return;
      }
      const pending = JSON.parse(raw);
      if (!pending?.email) {
        router.replace("/signup");
        return;
      }
      setEmail(pending.email || "");
      setName(pending.name || "");
      setPhone(pending.phone || "");
      setPassword(pending.password || "");
    } catch {
      router.replace("/signup");
    }
  }, [router]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const vRef = doc(db, "emailVerifications", email);
      const vSnap = await getDoc(vRef);
      if (!vSnap.exists()) throw new Error("No verification in progress. Please resend code.");
      const data = vSnap.data() as any;
      const now = new Date();
      const exp = data.expiresAt?.toDate ? data.expiresAt.toDate() : (data.expiresAt?.seconds ? new Date(data.expiresAt.seconds * 1000) : null);
      if (exp && exp < now) throw new Error("Code expired. Please resend a new code.");
      const expected = String(data.code);
      if (codeInput.trim() !== expected) {
        const attempts = (data.attempts || 0) + 1;
        await updateDoc(vRef, { attempts });
        throw new Error("Invalid code. Please try again.");
      }

      // Create Auth account now that email is verified
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Create user profile
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        balance: 0,
        profileCompletion: 35,
        completedTasks: [],
        recentPayouts: [],
        withdrawnAmount: 0,
        emailVerified: true,
        createdAt: new Date(),
      });

      // Cleanup verification doc
      await deleteDoc(vRef);

      try { sessionStorage.removeItem("pendingSignup"); } catch {}

      setNotice("Email verified. Redirecting...");
      setTimeout(() => router.replace("/"), 900);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await setDoc(doc(db, "emailVerifications", email), {
        code,
        email,
        createdAt: new Date(),
        expiresAt,
        attempts: 0,
      });
      await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, code }),
      });
      setNotice("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-lg font-semibold">Verify your email</h1>
          <p className="text-xs text-slate-500 mt-1">Enter the 6-digit code we sent to {email || "your email"}.</p>
        </div>
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {notice && (
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-700">{notice}</div>
          )}

          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Verification code</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:bg-white transition tracking-widest"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
              <p className="mt-1 text-[11px] text-slate-500">Code expires in 15 minutes.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[13px] font-medium py-2.5 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              onClick={resend}
              disabled={resending}
              className="text-blue-700 hover:text-blue-800 disabled:text-blue-300 font-medium"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
            <button onClick={() => router.replace("/signup")} className="text-slate-600 hover:text-slate-700">Change email</button>
          </div>
        </div>
      </div>
    </div>
  );
}
