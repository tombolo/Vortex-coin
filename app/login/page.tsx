"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaSignInAlt, FaShieldAlt, FaBolt, FaTrophy, FaChartLine } from "react-icons/fa";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [appleLoading, setAppleLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError("Invalid email or password. Please try again.");
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
        setGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            await ensureUserProfile(user.uid, {
                name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                emailVerified: true,
                authProvider: "google",
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            router.push("/");
        } catch (err: any) {
            setError(err?.message || "Google sign in failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleApple = async () => {
        setError("");
        setAppleLoading(true);
        try {
            const provider = new OAuthProvider("apple.com");
            provider.addScope("email");
            provider.addScope("name");
            const { user } = await signInWithPopup(auth, provider);
            await ensureUserProfile(user.uid, {
                name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                emailVerified: true,
                authProvider: "apple",
                updatedAt: new Date(),
                createdAt: new Date(),
            });
            router.push("/");
        } catch (err: any) {
            setError(err?.message || "Apple sign in failed");
        } finally {
            setAppleLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>
                <div className="absolute -bottom-20 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
                {/* Left Side - Branding & Info */}
                <div className="hidden lg:block space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push("/")}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                                <div className="relative bg-gradient-to-br from-blue-900 to-cyan-700 p-3 rounded-2xl shadow-2xl">
                                    <Image src="/FORGE.png" alt="TaskForge" width={48} height={32} className="brightness-0 invert" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                                    TaskForge
                                </h1>
                                <p className="text-sm text-slate-600 font-medium">Professional AI Training Platform</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="p-3 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl">
                                <FaShieldAlt className="text-2xl text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Enterprise Security</h3>
                                <p className="text-sm text-slate-600">Bank-level encryption and data protection for your account</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                            <div className="p-3 bg-gradient-to-br from-cyan-700 to-cyan-600 rounded-xl">
                                <FaBolt className="text-2xl text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Instant Earnings</h3>
                                <p className="text-sm text-slate-600">Complete tasks and see your balance grow in real-time</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                            <div className="p-3 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl">
                                <FaTrophy className="text-2xl text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Premium Tasks</h3>
                                <p className="text-sm text-slate-600">Access exclusive high-paying AI training projects</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900 to-cyan-700 p-6 rounded-2xl text-white shadow-2xl">
                        <div className="flex items-center space-x-2 mb-3">
                            <FaChartLine className="text-2xl" />
                            <h3 className="font-bold text-xl">Join 50,000+ Contributors</h3>
                        </div>
                        <p className="text-blue-100 text-sm">Professionals worldwide earning with TaskForge</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/60 overflow-hidden backdrop-blur-sm">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-sm">
                                        <FaSignInAlt className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold tracking-tight">Welcome back</h2>
                                        <p className="text-xs text-slate-500">Sign in to continue your journey</p>
                                    </div>
                                </div>
                                <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                    Secure login
                                </span>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            {error && (
                                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
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
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email Input */}
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

                                {/* Password Input */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-medium text-slate-600">Password</label>
                                        <Link href="/forgot-password" className="text-xs text-blue-700 hover:text-blue-800 font-medium">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 grid place-items-center text-slate-400">
                                            <FaLock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white text-[13px] font-medium py-2.5 transition flex items-center justify-center shadow-sm"
                                >
                                    {isLoading ? (
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <FaSignInAlt className="h-4 w-4" />
                                            <span className="ml-2">Sign in</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative flex items-center my-6">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink mx-3 text-slate-400 text-xs font-medium">OR</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <p className="text-slate-700 text-sm">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="font-medium text-blue-700 hover:text-blue-800">Create your account</Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50/70 p-4 text-center border-t border-slate-100">
                            <p className="text-[11px] text-slate-500">© {new Date().getFullYear()} TaskForge • Secure login</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}