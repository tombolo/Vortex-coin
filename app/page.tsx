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
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('free');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const packages = {
    free: {
      name: "Free Package",
      price: 0,
      tasks: [
        { id: 'follow_twitter', name: "Follow us on Twitter", coins: 5 },
        { id: 'join_telegram', name: "Join our Telegram", coins: 5 },
        { id: 'watch_video', name: "Watch tutorial video", coins: 5 },
        { id: 'daily_login', name: "Daily login streak", coins: 5 },
        { id: 'refer_friend', name: "Refer a friend", coins: 5 }
      ]
    },
    premium1: {
      name: "Starter Pack",
      price: 10,
      coins: 100,
      features: ["Daily bonus", "Priority support", "Exclusive tasks"]
    },
    premium2: {
      name: "Pro Pack",
      price: 25,
      coins: 300,
      features: ["All Starter features", "Higher rewards", "Weekly bonus"]
    },
    premium3: {
      name: "Elite Pack",
      price: 50,
      coins: 750,
      features: ["All Pro features", "VIP support", "Monthly airdrops"]
    },
    premium4: {
      name: "Whale Pack",
      price: 100,
      coins: 2000,
      features: ["All Elite features", "Personal manager", "Early access to features"]
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.balance || 0);
          setCompletedTasks(data.completedTasks || []);
          const lastClaimed = data.lastClaimed?.toDate() || null;
          if (lastClaimed) {
            const now = new Date();
            const diff = Math.floor((now.getTime() - lastClaimed.getTime()) / 1000);
            if (diff < 43200) {
              setTimeLeft(43200 - diff);
              setClaimed(true);
              setProgress(((43200 - diff) / 43200) * 100);
            }
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
        setProgress(((timeLeft - 1) / 43200) * 100);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setClaimed(false);
      setProgress(0);
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
        setProgress(100);
      } catch (error) {
        console.error("Error claiming coins:", error);
      }
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const task = packages.free.tasks.find(t => t.id === taskId);

      if (task && !completedTasks.includes(taskId)) {
        await updateDoc(userRef, {
          balance: balance + task.coins,
          completedTasks: [...completedTasks, taskId]
        });

        setBalance(balance + task.coins);
        setCompletedTasks([...completedTasks, taskId]);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 opacity-20 blur-3xl animate-pulse"></div>
      <Header balance={balance} isLoggedIn={isLoggedIn} />
      <div className="relative z-10 text-center max-w-3xl w-full mt-24">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Welcome to VortexCoin 🚀
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300">
            CryptoCoin is the future of decentralized finance. Join us now and be part of the revolution!
          </p>
        </div>

        <div className="mb-8 flex justify-center animate-flip">
          <div className="w-48 h-48 sm:w-64 sm:h-64 relative">
            <Image
              src="/vortex.png"
              alt="Vortex Coin"
              layout="fill"
              objectFit="contain"
              className="rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        </div>

        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">Claim Your Free Coins</h2>
          <p className="mt-2 text-gray-300">Complete the activity below to claim 50 free coins!</p>

          {claimed && (
            <div className="mt-4 progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            onClick={handleClaim}
            disabled={claimed || !isLoggedIn || isLoading}
            className="mt-4 px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : claimed ? `Next claim in ${Math.floor(timeLeft / 3600)}h ${Math.floor((timeLeft % 3600) / 60)}m` : isLoggedIn ? "Claim Now" : "Login to Claim"}
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mt-8 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Earn More Coins
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-6 py-2 mx-2 rounded-t-lg font-medium ${activeTab === 'free' ? 'bg-gray-800 text-purple-400' : 'bg-gray-900 text-gray-400'}`}
          >
            Free Package
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-6 py-2 mx-2 rounded-t-lg font-medium ${activeTab === 'premium' ? 'bg-gray-800 text-purple-400' : 'bg-gray-900 text-gray-400'}`}
          >
            Premium Packages
          </button>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-800">
          {activeTab === 'free' ? (
            <div>
              <h3 className="text-2xl font-semibold mb-4">{packages.free.name}</h3>
              <p className="text-gray-300 mb-6">Complete these simple tasks to earn free coins!</p>

              <div className="space-y-4">
                {packages.free.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${completedTasks.includes(task.id) ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-gray-400">{task.coins} coins reward</p>
                      </div>
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        disabled={completedTasks.includes(task.id)}
                        className={`px-4 py-2 rounded-lg ${completedTasks.includes(task.id) ? 'bg-green-600/50 text-white cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        {completedTasks.includes(task.id) ? 'Completed' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Premium Packages</h3>
              <p className="text-gray-300 mb-8">Upgrade your experience with these premium packages and earn more coins!</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['premium1', 'premium2', 'premium3', 'premium4'].map((pkg) => (
                  <div key={pkg} className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-900/50 hover:border-purple-500 transition-all hover:scale-105">
                    <h4 className="text-xl font-bold mb-2">{packages[pkg].name}</h4>
                    <div className="text-3xl font-bold mb-4 text-purple-400">
                      ${packages[pkg].price}
                    </div>
                    <div className="text-lg mb-6">
                      <span className="text-yellow-400">{packages[pkg].coins} coins</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {packages[pkg].features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Purchase Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-3xl w-full">
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

        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">About VortexCoin</h2>
          <p className="mt-2 text-gray-300">
            VortexCoin is a revolutionary cryptocurrency funded by Bitget, designed to empower users with fast, secure, and decentralized transactions.
          </p>
        </div>

        <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold">Earn More Coins</h2>
          <p className="mt-2 text-gray-300">
            Share your referral link and earn 10 coins for every friend who joins!
          </p>
          <button className="mt-4 px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-all shadow-lg">
            Copy Referral Link
          </button>
        </div>

        <div className="mb-8 p-8 bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl shadow-2xl border border-purple-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-white mb-6">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['bitget', 'okx', 'bybit', 'binance'].map((partner) => (
              <div key={partner} className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
                <div className="w-24 h-16 relative">
                  <Image
                    src={`/${partner}.png`}
                    alt={partner}
                    width={500}
                    height={500}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{partner.charAt(0).toUpperCase() + partner.slice(1)}</h3>
                <p className="text-gray-300 text-sm text-center">
                  {partner === 'bitget' && "Bitget is a leading cryptocurrency exchange offering secure and innovative trading solutions."}
                  {partner === 'okx' && "OKX is a global crypto exchange providing advanced trading tools and DeFi services."}
                  {partner === 'bybit' && "Bybit is a fast-growing crypto derivatives exchange with a focus on user experience."}
                  {partner === 'binance' && "Binance is the world's largest crypto exchange, offering a wide range of trading options."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}