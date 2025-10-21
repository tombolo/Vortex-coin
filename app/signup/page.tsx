"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState("");
    const [showVerify, setShowVerify] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setNotice("");
        try {
            console.log("[Signup] Start", {
                email,
                name,
                phoneLength: phone?.length ?? 0,
                hasPassword: Boolean(password),
            });

            // Generate a 6-digit code and save to Firestore for verification (keyed by email)
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            console.log("[Signup] Generated verification code (DEV)", code);
            await setDoc(doc(db, "emailVerifications", email), {
                code,
                email,
                createdAt: new Date(),
                expiresAt,
                attempts: 0,
            });
            console.log("[Signup] Saved verification doc in Firestore", { email, expiresAt: expiresAt.toISOString() });

            // Ask server to email the code (RESEND_API_KEY required in env on server)
            try {
                console.log("[Signup] Sending email via /api/send-code");
                const resp = await fetch("/api/send-code", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, name, code }),
                });
                const text = await resp.text().catch(() => "");
                console.log("[Signup] /api/send-code response", {
                    ok: resp.ok,
                    status: resp.status,
                    statusText: resp.statusText,
                    body: text?.slice(0, 500),
                });
            } catch (mailErr) {
                // Non-blocking: allow manual code delivery in dev
                console.error("[Signup] Mail send failed", mailErr);
            }

            // Save pending signup locally (used by /verify to finalize account creation)
            try {
                sessionStorage.setItem(
                    "pendingSignup",
                    JSON.stringify({ name, email, phone, password })
                );
                sessionStorage.setItem("pendingCode", code);
                console.log("[Signup] Stored pendingSignup and pendingCode in sessionStorage");
            } catch {}

            setNotice("We sent a 6-digit verification code to your email. Enter it below to continue.");
            console.log("[Signup] Showing inline verification section");
            setShowVerify(true);
        } catch (err: any) {
            console.error("[Signup] Failed", err);
            setError(err.message || "Failed to create an account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setVerifying(true);
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

            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

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

            await deleteDoc(vRef);
            try { sessionStorage.removeItem("pendingSignup"); } catch {}

            setNotice("Email verified. Redirecting...");
            setTimeout(() => router.replace("/"), 900);
        } catch (err: any) {
            setError(err?.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
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
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>
                <div className="absolute -bottom-20 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
            </div>
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-start">
                {/* Brand/Context */}
                <div className="hidden lg:flex flex-col gap-8 animate-fade-in">
                    <button
                        onClick={() => router.push("/")}
                        className="w-fit inline-flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                    >
                        <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                            <Image src="/FORGE.png" alt="TaskForge" width={40} height={28} />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-semibold tracking-tight">TaskForge</h1>
                            <p className="text-xs text-slate-500">Professional task rewards platform</p>
                        </div>
                    </button>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800">Create your account</h2>
                        <p className="text-sm text-slate-500 mt-1">Join and start earning in a few minutes.</p>
                        <ul className="mt-6 space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                Secure and compliant
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                Fast payouts
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                24/7 support
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Signup Card */}
                <div className="w-full">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/60 overflow-hidden backdrop-blur-sm">
                        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-sm">
                                        <FaUserPlus className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold tracking-tight">Create your account</h2>
                                        <p className="text-xs text-slate-500">Use a valid email to receive a verification code</p>
                                    </div>
                                </div>
                                <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                    Secure signup
                                </span>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            {error && (
                                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                            {notice && (
                                <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-700">
                                    {notice}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Full name</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 grid place-items-center text-slate-400">
                                            <FaUser className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 grid place-items-center text-slate-400">
                                            <FaEnvelope className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 grid place-items-center text-slate-400">
                                            <FaPhone className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 grid place-items-center text-slate-400">
                                            <FaLock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Create a strong password"
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500">At least 6 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white text-[13px] font-medium py-2.5 transition flex items-center justify-center shadow-sm"
                                >
                                    {isLoading ? (
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <span>Create account</span>
                                    )}
                                </button>
                                <p className="mt-3 text-[11px] text-slate-500 text-center">By continuing you agree to our Terms and Privacy Policy.</p>
                            </form>

                            {showVerify && (
                                <div className="mt-6">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-sm font-semibold text-slate-800">Verify your email</h3>
                                        <p className="text-xs text-slate-500 mt-1">Enter the 6-digit code we sent to {email}.</p>
                                        <form onSubmit={handleVerify} className="mt-4 space-y-3">
                                            <input
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={6}
                                                placeholder="Enter 6-digit code"
                                                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition tracking-widest"
                                                value={codeInput}
                                                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                required
                                            />
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={handleResend}
                                                    disabled={resending}
                                                    className="text-xs text-blue-700 hover:text-blue-800 disabled:text-blue-300 font-medium"
                                                >
                                                    {resending ? "Sending..." : "Resend code"}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={verifying}
                                                    className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white text-[13px] font-medium px-4 py-2.5 transition shadow-sm"
                                                >
                                                    {verifying ? "Verifying..." : "Verify"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-600">
                                    Already have an account?{" "}
                                    <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-center">
                            <p className="text-[11px] text-slate-500">By creating an account you agree to our Terms and Privacy Policy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
