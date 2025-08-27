"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRocket, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <FaRocket className="text-2xl text-white" />
                        <span className="text-2xl font-bold text-white">TaskForge</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-indigo-100">Sign in to continue your journey</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
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
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <FaSignInAlt className="h-5 w-5" />
                            )}
                            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 hover:underline"
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        © 2024 TaskForge. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-10 left-20 w-4 h-4 bg-indigo-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
    );
}