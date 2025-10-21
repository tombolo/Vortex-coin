"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setNotice("");

        try {
            // Generate a 6-digit code and save to Firestore for verification (keyed by email)
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            await setDoc(doc(db, "emailVerifications", email), {
                code,
                email,
                createdAt: new Date(),
                expiresAt,
                attempts: 0,
            });

            // Ask server to email the code (RESEND_API_KEY required in env on server)
            try {
                await fetch("/api/send-code", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, name, code }),
                });
            } catch (mailErr) {
                // Non-blocking: allow manual code delivery in dev
                console.error("Mail send failed", mailErr);
            }

            // Save pending signup locally (used by /verify to finalize account creation)
            try {
                sessionStorage.setItem(
                    "pendingSignup",
                    JSON.stringify({ name, email, phone, password })
                );
                sessionStorage.setItem("pendingCode", code);
            } catch {}

            setNotice("We sent a 6-digit verification code to your email. Please verify to continue.");
            router.push("/verify");
        } catch (err: any) {
            setError(err.message || "Failed to create an account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-start">
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
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white grid place-items-center">
                                    <FaUserPlus className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Sign up</h2>
                                    <p className="text-xs text-slate-500">Use a valid email to receive a verification code</p>
                                </div>
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
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:bg-white transition"
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
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:bg-white transition"
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
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:bg-white transition"
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
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:bg-white transition"
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
                                    className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[13px] font-medium py-2.5 transition flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <span>Create account</span>
                                    )}
                                </button>
                            </form>

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
