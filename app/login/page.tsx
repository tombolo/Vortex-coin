"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
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