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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(35);
  const [pendingPayments, setPendingPayments] = useState(0);
  type Payout = {
    date: string | number | Date;
    amount: number;
    description?: string;
  };
  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([]);
  const [username, setUsername] = useState("");
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskTimer, setTaskTimer] = useState<NodeJS.Timeout | null>(null);

  // Sample projects data
  const activeProjects = [
    { id: 'project1', name: "Go Committee", category: "Data Labeling", progress: 65 },
    { id: 'project2', name: "Geranium Mambo V2", category: "Image Annotation", progress: 42 },
    { id: 'project3', name: "Bulba Extensions SxS", category: "Text Classification", progress: 88 },
    { id: 'project4', name: "Crowd Compute Group", category: "Audio Transcription", progress: 23 },
    { id: 'project5', name: "Oval Kettledrum", category: "Sentiment Analysis", progress: 71 }
  ];

  // Expanded available tasks with more variety
  const availableTasks = [
    {
      id: 'survey_demographics',
      title: "Demographics Survey",
      reward: 2.50,
      timeEstimate: "10-15 min",
      category: "Survey",
      description: "Share basic demographic information for research purposes",
      steps: 5,
      duration: 60 // seconds to complete
    },
    {
      id: 'product_feedback',
      title: "Product Feedback Study",
      reward: 5.00,
      timeEstimate: "20-25 min",
      category: "User Testing",
      description: "Provide feedback on a new product interface",
      steps: 8,
      duration: 120
    },
    {
      id: 'data_annotation',
      title: "Image Annotation Task",
      reward: 8.00,
      timeEstimate: "30-35 min",
      category: "Data Labeling",
      description: "Label objects in images for machine learning training",
      steps: 12,
      duration: 180
    },
    {
      id: 'audio_transcription',
      title: "Audio Transcription",
      reward: 12.00,
      timeEstimate: "40-45 min",
      category: "Transcription",
      description: "Transcribe short audio clips to text",
      steps: 15,
      duration: 240
    },
    {
      id: 'sentiment_analysis',
      title: "Sentiment Analysis",
      reward: 6.50,
      timeEstimate: "15-20 min",
      category: "Text Analysis",
      description: "Classify text excerpts by emotional sentiment",
      steps: 10,
      duration: 90
    },
    {
      id: 'market_research',
      title: "Market Research Survey",
      reward: 4.25,
      timeEstimate: "15-18 min",
      category: "Research",
      description: "Share your opinions on current market trends",
      steps: 7,
      duration: 100
    },
    {
      id: 'social_media_review',
      title: "Social Content Review",
      reward: 3.75,
      timeEstimate: "12-15 min",
      category: "Content Moderation",
      description: "Review and categorize social media content",
      steps: 6,
      duration: 80
    },
    {
      id: 'website_testing',
      title: "Website Usability Test",
      reward: 7.50,
      timeEstimate: "25-30 min",
      category: "User Testing",
      description: "Test website functionality and provide feedback",
      steps: 9,
      duration: 150
    },
    {
      id: 'video_tagging',
      title: "Video Content Tagging",
      reward: 9.25,
      timeEstimate: "35-40 min",
      category: "Data Labeling",
      description: "Tag and categorize video content segments",
      steps: 14,
      duration: 200
    },
    {
      id: 'consumer_insights',
      title: "Consumer Insights Study",
      reward: 5.75,
      timeEstimate: "18-22 min",
      category: "Research",
      description: "Provide insights on consumer behavior patterns",
      steps: 8,
      duration: 110
    }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        setUsername(user.displayName || user.email?.split('@')[0] || "User");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.balance || 0);
          setCompletedTasks(data.completedTasks || []);
          setProfileCompletion(data.profileCompletion || 35);
          // Pending payments should be the amount on balance
          setPendingPayments(data.balance || 0);
          setRecentPayouts(data.recentPayouts || []);
          setWithdrawnAmount(data.withdrawnAmount || 0);
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUsername("");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const startTask = (taskId: string, duration: number) => {
    setActiveTask(taskId);
    setTaskProgress(0);

    const interval = 100; // Update progress every 100ms
    const totalSteps = duration / (interval / 1000);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      setTaskProgress(progress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        completeTask(taskId);
      }
    }, interval);

    setTaskTimer(timer);
  };

  const cancelTask = () => {
    if (taskTimer) {
      clearInterval(taskTimer);
      setTaskTimer(null);
    }
    setActiveTask(null);
    setTaskProgress(0);
  };

  const completeTask = async (taskId: string) => {
    if (!userId) return;

    const task = availableTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const userRef = doc(db, "users", userId);

      if (!completedTasks.includes(taskId)) {
        await updateDoc(userRef, {
          balance: balance + task.reward,
          completedTasks: [...completedTasks, taskId],
          // Pending payments should be the updated balance
          pendingPayments: balance + task.reward
        });

        setBalance(balance + task.reward);
        // Update pending payments to match the new balance
        setPendingPayments(balance + task.reward);
        setCompletedTasks([...completedTasks, taskId]);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setActiveTask(null);
      setTaskProgress(0);
      if (taskTimer) {
        clearInterval(taskTimer);
        setTaskTimer(null);
      }
    }
  };

  // Calculate total earnings (balance + withdrawn amount)
  const totalEarnings = balance + withdrawnAmount;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-64 bg-white shadow-md fixed h-full z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">TaskForge</h1>
        </div>
        <nav className="mt-6">
          <div
            className={`p-4 flex items-center cursor-pointer ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </div>
          <div
            className={`p-4 flex items-center cursor-pointer ${activeTab === 'tasks' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('tasks');
              setSidebarOpen(false);
            }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Available Tasks
          </div>
          <div
            className={`p-4 flex items-center cursor-pointer ${activeTab === 'balance' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('balance');
              setSidebarOpen(false);
            }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Balance
          </div>
          <div
            className={`p-4 flex items-center cursor-pointer ${activeTab === 'support' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => {
              setActiveTab('support');
              setSidebarOpen(false);
            }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Support
          </div>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 md:ml-0">
        

        {activeTab === 'dashboard' && (
          <div className="mt-10">
            <h1 className="text-2xl font-bold mb-6">Welcome back, {username}!</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Your Active Projects */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Your Active Projects</h2>
                <div className="space-y-4">
                  {activeProjects.map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-sm md:text-base">{project.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{project.category}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{project.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Account */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Your Account</h2>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm text-gray-500">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Complete your profile to unlock more tasks and higher pay rates.
                  </p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Complete Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Your Pay */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Your Pay</h2>
                <div className="mb-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Available Balance</h3>
                  <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Payments</h3>
                  <p className="text-xl font-semibold">${pendingPayments.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Will be processed within 3-5 business days</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Payouts</h3>
                  {recentPayouts.length > 0 ? (
                    <ul className="space-y-2">
                      {recentPayouts.map((payout, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{new Date(payout.date).toLocaleDateString()}</span>
                          <span className="font-medium">${payout.amount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No recent payouts</p>
                  )}
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Invite your friends</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Refer your friends to apply to be AI trainers! After both you and your referral earn $150 on TaskForge from the date of the referral, you'll each receive a $100 incentive.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-xs text-yellow-800">For the moment we are validating our 1000+ requests, get back soon!</p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Your Referrals
                </button>
              </div>
            </div>

            {/* Help Center */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-lg font-semibold mb-4">Help Center</h2>
              <p className="text-sm text-gray-600 mb-4">Guides, tasking tips and tricks, support forums, and more!</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="#" className="text-center p-4 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                  <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="text-sm font-medium">Guides</span>
                </a>
                <a href="#" className="text-center p-4 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                  <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span className="text-sm font-medium">Tips & Tricks</span>
                </a>
                <a href="#" className="text-center p-4 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                  <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span className="text-sm font-medium">Forums</span>
                </a>
                <a href="#" className="text-center p-4 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                  <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-medium">FAQ</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

            {activeTask && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Task in Progress</h2>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-100"
                      style={{ width: `${taskProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mb-4">Completing task... {Math.round(taskProgress)}%</p>
                  <button
                    onClick={cancelTask}
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                  >
                    Cancel Task
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTasks.map(task => (
                <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div className="mb-3 md:mb-0">
                      <h2 className="text-lg font-semibold">{task.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full self-start md:self-auto">
                      {task.category}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600 font-bold">${task.reward.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{task.timeEstimate}</span>
                      <span className="text-sm text-gray-400">{task.steps} steps</span>
                    </div>

                    <button
                      onClick={() => startTask(task.id, task.duration)}
                      disabled={completedTasks.includes(task.id) || activeTask !== null}
                      className={`px-4 py-2 rounded-md text-sm font-medium w-full md:w-auto ${completedTasks.includes(task.id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : activeTask !== null
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {completedTasks.includes(task.id) ? 'Completed' : 'Start Task'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">Earnings & Balance</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">${balance.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Available Balance</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">${pendingPayments.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">${totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Payout History</h2>
              {recentPayouts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPayouts.map((payout, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payout.date).toLocaleDateString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.description}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payout.amount.toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payout history yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">Support Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Get Help</h2>
                <div className="space-y-4">
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span>Contact Support</span>
                  </a>
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>FAQ</span>
                  </a>
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span>Community Forums</span>
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Resources</h2>
                <div className="space-y-4">
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Tasker Guidelines</span>
                  </a>
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>Tips & Best Practices</span>
                  </a>
                  <a href="#" className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Video Tutorials</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}