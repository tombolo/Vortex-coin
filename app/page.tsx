'use client';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import Header from "../components/Header";
import "../components/Header.css";
import "./ProgressBar.css";
import Image from "next/image";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [launchTimeLeft, setLaunchTimeLeft] = useState({ days: 60, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0); // Progress bar state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.balance || 0);
          const lastClaimed = data.lastClaimed?.toDate() || null;
          if (lastClaimed) {
            const now = new Date();
            const diff = Math.floor((now.getTime() - lastClaimed.getTime()) / 1000);
            if (diff < 43200) {
              setTimeLeft(43200 - diff);
              setClaimed(true);
              setProgress(((43200 - diff) / 43200) * 100); // Set progress based on time left
            }
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
      setIsLoading(false); // Data loading is complete
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
        setProgress(((timeLeft - 1) / 43200) * 100); // Update progress bar
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setClaimed(false);
      setProgress(0); // Reset progress bar
    }
  }, [timeLeft]);

  useEffect(() => {
    const launchDate = new Date("2025-05-31T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      if (distance > 0) {
        setLaunchTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    if (!claimed && userId) {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          balance: balance + 50,
          lastClaimed: Timestamp.now()
        });
        setBalance(balance + 50);
        setTimeLeft(43200);
        setClaimed(true);
        setProgress(100); // Set progress to 100% after claiming
      } catch (error) {
        console.error("Error claiming coins:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 opacity-20 blur-3xl animate-pulse"></div>
      <Header balance={balance} isLoggedIn={isLoggedIn} />
      <div className="relative z-10 text-center max-w-3xl w-full mt-24">
        {/* Hero Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Welcome to VortexCoin 🚀
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300">
            CryptoCoin is the future of decentralized finance. Join us now and be part of the revolution!
          </p>
        </div>

        {/* Animated Image */}
        <div className="mb-8 flex justify-center animate-flip">
          <div className="w-48 h-48 sm:w-64 sm:h-64 relative">
            <Image
              src="/vortex.png" // Path to your image in the public folder
              alt="Vortex Coin"
              layout="fill"
              objectFit="contain"
              className="rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        </div>

        {/* Claim Section */}
        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">Claim Your Free Coins</h2>
          <p className="mt-2 text-gray-300">Complete the activity below to claim 50 free coins!</p>

          {/* Progress Bar */}
          {claimed && (
            <div className="mt-4 progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={claimed || !isLoggedIn || isLoading} // Disable button while loading
            className="mt-4 px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : claimed ? `Next claim in ${Math.floor(timeLeft / 3600)}h ${Math.floor((timeLeft % 3600) / 60)}m` : isLoggedIn ? "Claim Now" : "Login to Claim"}
          </button>
        </div>

        {/* Launch Countdown */}
        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">Launch Countdown</h2>
          <p className="mt-2 text-gray-300">The project will be launched in:</p>
          <div className="mt-4 flex justify-center gap-4">
            {Object.entries(launchTimeLeft).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-4xl font-bold">{value}</p>
                <p className="text-gray-300 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">About VortexCoin</h2>
          <p className="mt-2 text-gray-300">
            VortexCoin is a revolutionary cryptocurrency funded by Bitget, designed to empower users with fast, secure, and decentralized transactions. It is expected to launch at a price of $0.6590 per coin. Join our community and be part of the future of finance.
          </p>
        </div>

        {/* Referral Section */}
        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">Earn More Coins</h2>
          <p className="mt-2 text-gray-300">
            Share your referral link and earn 10 coins for every friend who joins!
          </p>
          <button className="mt-4 px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-all shadow-lg">
            Copy Referral Link
          </button>
        </div>

        {/* Partners Section */}
        <div className="mb-8 p-8 bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl shadow-2xl border border-purple-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-white mb-6">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bitget */}
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="w-24 h-16 relative">
                <Image
                  src="/bitget.png"
                  alt="Bitget"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bitget</h3>
              <p className="text-gray-300 text-sm text-center">
                Bitget is a leading cryptocurrency exchange offering secure and innovative trading solutions.
              </p>
            </div>

            {/* OKX */}
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="w-24 h-16 relative">
                <Image
                  src="/okx.png"
                  alt="OKX"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">OKX</h3>
              <p className="text-gray-300 text-sm text-center">
                OKX is a global crypto exchange providing advanced trading tools and DeFi services.
              </p>
            </div>

            {/* Bybit */}
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="w-24 h-16 relative">
                <Image
                  src="/bybit.png"
                  alt="Bybit"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bybit</h3>
              <p className="text-gray-300 text-sm text-center">
                Bybit is a fast-growing crypto derivatives exchange with a focus on user experience.
              </p>
            </div>

            {/* Binance */}
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="w-24 h-16 relative">
                <Image
                  src="/binance.png"
                  alt="Binance"
                  width={500}
                  height={500} 
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Binance</h3>
              <p className="text-gray-300 text-sm text-center">
                Binance is the world's largest crypto exchange, offering a wide range of trading options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}