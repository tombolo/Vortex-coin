"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional data in Firestore with initial balance of 0
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                phone,
                balance: 0,  // Set initial balance to 0
                createdAt: new Date()
            });

            router.push("/login"); // Redirect to login page
        } catch (err: any) {
            setError("Failed to create an account. Try again.");
        }
    };
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black opacity-90"></div>
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            </div>

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center border border-white/20 mx-4">
                <h2 className="text-3xl font-bold text-white">Join Us</h2>
                <p className="text-gray-300 text-sm mt-1">Create an account</p>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-6">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition duration-300">
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-4">
                    Already have an account? <Link href="/login" className="text-teal-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
