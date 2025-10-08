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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
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
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FaSignInAlt className="text-3xl text-white" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
                                <p className="text-blue-100 font-medium">Sign in to continue your professional journey</p>
                            </div>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Password</label>
                                        <Link href="/forgot-password" className="text-xs text-blue-700 hover:text-cyan-700 font-semibold transition-colors duration-200">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 font-medium"
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
                                    className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 hover:from-blue-950 hover:via-blue-900 hover:to-cyan-800 text-white font-extrabold py-4 px-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 relative overflow-hidden group border border-blue-700"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-blue-800 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    {isLoading ? (
                                        <div className="relative z-10 animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <FaSignInAlt className="h-5 w-5 relative z-10" />
                                            <span className="relative z-10 text-base tracking-wide">SIGN IN NOW</span>
                                        </>
                                    )}
                                    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative flex items-center my-8">
                                <div className="flex-grow border-t-2 border-slate-200"></div>
                                <span className="flex-shrink mx-4 text-slate-400 text-sm font-bold">OR</span>
                                <div className="flex-grow border-t-2 border-slate-200"></div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
                                <p className="text-slate-700 text-sm font-medium">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-blue-900 hover:text-cyan-700 font-extrabold transition-colors duration-200 hover:underline"
                                    >
                                        Create Free Account →
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 text-center border-t-2 border-slate-100">
                            <p className="text-xs text-slate-500 font-medium">
                                🔒 Secured by enterprise-grade encryption | © 2024 TaskForge
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Animated Particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-float"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}
                ></div>
            ))}
        </div>
    );
}