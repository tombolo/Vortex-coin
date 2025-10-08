"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaShieldAlt, FaRocket, FaStar, FaCheckCircle } from "react-icons/fa";

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional data in Firestore with initial balance of 0
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                phone,
                balance: 0,
                profileCompletion: 35,
                completedTasks: [],
                recentPayouts: [],
                withdrawnAmount: 0,
                createdAt: new Date()
            });

            router.push("/"); // Redirect to home page after successful signup
        } catch (err: any) {
            setError(err.message || "Failed to create an account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Benefits */}
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
                                <p className="text-sm text-slate-600 font-medium">Start Earning Today</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-8 rounded-3xl text-white shadow-2xl border-2 border-blue-700">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaRocket className="text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold">Join Elite Contributors</h2>
                                <p className="text-blue-100 text-sm">Get started in under 2 minutes</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 mt-8">
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <FaCheckCircle className="text-2xl text-green-300 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold">$0 to Start</h3>
                                    <p className="text-sm text-blue-100">Completely free to join and start earning</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <FaCheckCircle className="text-2xl text-green-300 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold">Instant Access</h3>
                                    <p className="text-sm text-blue-100">Start completing tasks immediately after signup</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <FaCheckCircle className="text-2xl text-green-300 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold">Verified Payments</h3>
                                    <p className="text-sm text-blue-100">100% guaranteed secure and timely payments</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <FaCheckCircle className="text-2xl text-green-300 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold">24/7 Support</h3>
                                    <p className="text-sm text-blue-100">Professional support team always available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border-2 border-blue-100 text-center shadow-lg">
                            <FaStar className="text-3xl text-amber-500 mx-auto mb-2" />
                            <p className="text-2xl font-extrabold text-blue-900">4.9/5</p>
                            <p className="text-xs text-slate-600 font-medium">User Rating</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border-2 border-cyan-100 text-center shadow-lg">
                            <FaUserPlus className="text-3xl text-cyan-600 mx-auto mb-2" />
                            <p className="text-2xl font-extrabold text-cyan-900">50K+</p>
                            <p className="text-xs text-slate-600 font-medium">Active Users</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border-2 border-green-100 text-center shadow-lg">
                            <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-extrabold text-green-900">100%</p>
                            <p className="text-xs text-slate-600 font-medium">Secure</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-cyan-700 via-blue-800 to-blue-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FaUserPlus className="text-3xl text-white" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
                                <p className="text-cyan-100 font-medium">Join thousands of professional contributors</p>
                            </div>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-5">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaUser className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-600 outline-none transition-all duration-300 font-medium"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-600 outline-none transition-all duration-300 font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaPhone className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-600 outline-none transition-all duration-300 font-medium"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Create a strong password"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-600 outline-none transition-all duration-300 font-medium"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Must be at least 6 characters</p>
                                </div>

                                {/* Sign Up Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-700 via-blue-800 to-blue-900 hover:from-cyan-800 hover:via-blue-900 hover:to-blue-950 text-white font-extrabold py-4 px-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 relative overflow-hidden group border border-cyan-600"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    {isLoading ? (
                                        <div className="relative z-10 animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <FaRocket className="h-5 w-5 relative z-10" />
                                            <span className="relative z-10 text-base tracking-wide">CREATE FREE ACCOUNT</span>
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

                            {/* Login Link */}
                            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-100">
                                <p className="text-slate-700 text-sm font-medium">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-cyan-800 hover:text-blue-900 font-extrabold transition-colors duration-200 hover:underline"
                                    >
                                        Sign In →
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 text-center border-t-2 border-slate-100">
                            <p className="text-xs text-slate-500 font-medium">
                                By creating an account, you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Animated Particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-40 animate-float"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}
                ></div>
            ))}
        </div>
    );
}
