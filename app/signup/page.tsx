"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRocket, FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <FaRocket className="text-2xl text-white" />
                        <span className="text-2xl font-bold text-white">TaskForge</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join Our Community</h2>
                    <p className="text-indigo-100">Start your earning journey today</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <FaUserPlus className="h-5 w-5" />
                            )}
                            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 hover:underline flex items-center justify-center space-x-1"
                            >
                                <FaSignInAlt className="h-4 w-4" />
                                <span>Sign in here</span>
                            </Link>
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h3 className="text-sm font-semibold text-indigo-900 mb-3">Why join TaskForge?</h3>
                        <ul className="text-xs text-indigo-700 space-y-1">
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span>Earn money completing simple tasks</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span>Flexible work hours</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span>Instant payments</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span>24/7 support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-10 left-20 w-4 h-4 bg-indigo-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '2.5s' }}></div>
        </div>
    );
}