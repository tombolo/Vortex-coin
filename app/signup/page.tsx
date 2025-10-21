"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
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
    const [googleLoading, setGoogleLoading] = useState(false);
    const [appleLoading, setAppleLoading] = useState(false);

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

    const ensureUserProfile = async (uid: string, payload: any) => {
        try {
            await setDoc(doc(db, "users", uid), payload, { merge: true } as any);
        } catch {}
    };

    const handleGoogle = async () => {
        setError("");
        setNotice("");
        setGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            const userEmail = user.email || email || "";
            const userName = user.displayName || name || "";
            await ensureUserProfile(user.uid, {
                name: userName,
                email: userEmail,
                phone: user.phoneNumber || phone || "",
                balance: 0,
                profileCompletion: 50,
                completedTasks: [],
                recentPayouts: [],
                withdrawnAmount: 0,
                emailVerified: true,
                authProvider: "google",
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            router.replace("/");
        } catch (err: any) {
            setError(err?.message || "Google sign in failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleApple = async () => {
        setError("");
        setNotice("");
        setAppleLoading(true);
        try {
            const provider = new OAuthProvider("apple.com");
            provider.addScope("email");
            provider.addScope("name");
            const { user } = await signInWithPopup(auth, provider);
            const userEmail = user.email || email || "";
            const userName = user.displayName || name || "";
            await ensureUserProfile(user.uid, {
                name: userName,
                email: userEmail,
                phone: user.phoneNumber || phone || "",
                balance: 0,
                profileCompletion: 50,
                completedTasks: [],
                recentPayouts: [],
                withdrawnAmount: 0,
                emailVerified: true,
                authProvider: "apple",
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            router.replace("/");
        } catch (err: any) {
            setError(err?.message || "Apple sign in failed");
        } finally {
            setAppleLoading(false);
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={handleGoogle}
                                    disabled={googleLoading}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:bg-white text-slate-800 text-[13px] font-medium py-2.5 transition shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="h-4 w-4" aria-hidden="true"><path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147c-6.3 34-25 62.8-53.3 82.1v68h86.1c50.4-46.5 81.7-115.1 81.7-195z" fill="#4285F4"/><path d="M272 544.3c72.9 0 134.2-24.1 178.9-65.6l-86.1-68c-23.9 16.1-54.5 25.6-92.8 25.6-71 0-131.1-47.9-152.6-112.2H30.1v70.6C74.6 486.2 167.6 544.3 272 544.3z" fill="#34A853"/><path d="M119.4 324.1c-10.8-31.9-10.8-66.4 0-98.3V155.2H30.1c-40.2 80.4-40.2 175.8 0 256.3l89.3-70.6z" fill="#FBBC05"/><path d="M272 107.7c39.6-.6 76.5 13.8 105 40.9l78.4-78.4C405.8 24.5 344.9-.2 272 0 167.6 0 74.6 57.8 30.1 143.1l89.3 70.6C140.9 155.3 200.9 107.7 272 107.7z" fill="#EA4335"/></svg>
                                    <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApple}
                                    disabled={appleLoading}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-black hover:bg-black/90 disabled:bg-black/70 text-white text-[13px] font-medium py-2.5 transition shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="h-4 w-4 fill-white" aria-hidden="true"><path d="M788 779c-14 33-31 64-51 94-27 40-49 67-66 82-26 24-54 37-85 39-22 0-49-6-80-20-31-13-59-20-84-20-26 0-54 7-85 20s-56 20-76 21c-30 1-59-12-87-38-18-16-41-44-69-84-30-44-55-95-74-152-21-64-31-126-31-187 0-69 15-129 44-180 23-41 53-72 89-95 36-22 74-34 115-35 23 0 53 7 91 22 38 14 62 22 72 22 8 0 33-9 74-25 40-15 73-21 98-18 72 6 126 34 164 85-65 39-97 94-96 166 1 56 21 102 60 138 18 18 39 32 64 42-5 15-10 30-16 45ZM560 0c0 39-14 76-41 110-33 39-72 62-115 58-1-5-1-11-1-18 0-37 16-77 45-112 15-18 35-32 60-44 24-12 47-18 68-19 1 8 2 16 2 25Z"/></svg>
                                    <span>{appleLoading ? "Connecting..." : "Continue with Apple"}</span>
                                </button>
                            </div>

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
