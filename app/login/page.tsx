"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/"); // Redirect to home
        } catch (err: any) {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-950 text-white px-4 sm:px-0">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black opacity-90"></div>
            <div className="absolute inset-0">
                <div className="absolute top-10 left-5 sm:top-20 sm:left-20 w-32 h-32 sm:w-40 sm:h-40 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl text-center border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-300 text-sm sm:text-base mt-1">Log in to continue</p>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-3 sm:p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 sm:p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="p-3 sm:p-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-md transition duration-300">
                        Login
                    </button>
                </form>

                <p className="text-sm sm:text-base text-gray-400 mt-4">
                    Don't have an account? <Link href="/signup" className="text-teal-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
