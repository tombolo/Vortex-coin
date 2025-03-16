"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle, FaArrowLeft, FaCoins, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ uid: currentUser.uid, ...userDoc.data() });
                }
            } else {
                router.push("/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p className="animate-pulse text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
            {/* Back Arrow */}
            <div
                className="absolute top-4 left-4 sm:top-6 sm:left-6 p-3 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition duration-300 z-50"
                onClick={() => router.back()}
            >
                <FaArrowLeft className="text-2xl text-teal-400" />
            </div>

            {/* Profile Container */}
            <div className="max-w-4xl mt-16 sm:mt-24 mx-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden p-6 sm:p-8">
                {/* Profile Header */}
                <div className="relative p-6 sm:p-8 bg-gradient-to-r from-teal-600 to-purple-700 text-center">
                    <div className="flex items-center justify-center">
                        <FaUserCircle className="text-6xl text-white drop-shadow-md" />
                    </div>
                    <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                        {user?.name || "Guest User"}
                    </h2>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-8">
                    {/* Email Section */}
                    <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-2xl sm:text-3xl text-teal-400" />
                            <div className="truncate w-full">
                                <h3 className="text-sm sm:text-lg font-semibold text-gray-300">Email</h3>
                                <p className="text-gray-400 break-all text-xs sm:text-base">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Coins Section */}
                    <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4">
                            <FaCoins className="text-2xl sm:text-3xl text-yellow-400" />
                            <div>
                                <h3 className="text-sm sm:text-lg font-semibold text-gray-300">Coins</h3>
                                <p className="text-gray-400 text-xs sm:text-base">{user?.balance || 0} Coins</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="p-4 sm:p-8">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-md transition duration-300"
                    >
                        <FaSignOutAlt className="text-xl" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;