'use client';
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FaUserCircle, FaBars, FaTimes, FaHome, FaTasks, FaDollarSign, FaQuestionCircle, FaChartLine, FaBell, FaRocket, FaBrain, FaUsers, FaLightbulb, FaChild, FaClock, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { availableTasks, Task } from "../data/data"; // Import from external file

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [tasksAvailable, setTasksAvailable] = useState<Task[]>([]);

  type Payout = {
    date: string | number | Date;
    amount: number;
    description?: string;
  };

  type Activity = {
    taskId: string;
    taskTitle: string;
    amount: number;
    completionTime: number; // in seconds
    completedAt: Date;
  };

  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [username, setUsername] = useState("");
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskTimer, setTaskTimer] = useState<NodeJS.Timeout | null>(null);
  const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
  const currentStepRef = useRef(0);
  const router = useRouter();

  // Function to determine which tasks are available
  const getAvailableTasks = () => {
    // 30% chance that no tasks are available
    if (Math.random() < 0.3) {
      return [];
    }

    // Filter tasks - some might not be available
    return availableTasks.filter(task => {
      // 70% chance each task is available
      return Math.random() < 0.7;
    });
  };

  // Calculate completion percentage (same as profile page)
  const calculateCompletion = () => {
    if (!userData) return 0;

    let completed = 0;
    const total = 4; // ID, CV, Bank, Profile info

    if (userData.idStatus === 'verified') completed++;
    if (userData.cvStatus === 'verified') completed++;
    if (userData.bankConnected) completed++;
    if (userData.name && userData.email) completed++;

    return Math.round((completed / total) * 100);
  };

  // Sample projects data
  const activeProjects = [
    { id: 'project1', name: "Go Committee", category: "Data Labeling", progress: 65 },
    { id: 'project2', name: "Geranium Mambo V2", category: "Image Annotation", progress: 42 },
    { id: 'project3', name: "Bulba Extensions SxS", category: "Text Classification", progress: 88 },
    { id: 'project4', name: "Crowd Compute Group", category: "Audio Transcription", progress: 23 },
    { id: 'project5', name: "Oval Kettledrum", category: "Sentiment Analysis", progress: 71 }
  ];

  useEffect(() => {
    // Set initial available tasks
    setTasksAvailable(getAvailableTasks());

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        setUsername(user.displayName || user.email?.split('@')[0] || "User");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setBalance(data.balance || 0);
          setCompletedTasks(data.completedTasks || []);
          setPendingPayments(data.balance || 0);
          setRecentPayouts(data.recentPayouts || []);
          setWithdrawnAmount(data.withdrawnAmount || 0);
          setRecentActivities(data.recentActivities || []);
        }
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUsername("");
        setUserData(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Refresh tasks when switching to tasks tab
  useEffect(() => {
    if (activeTab === 'tasks') {
      setTasksAvailable(getAvailableTasks());
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const startTask = (taskId: string, duration: number) => {
    setActiveTask(taskId);
    setTaskProgress(0);

    const interval = 100;
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
    setTaskStartTime(null);
    currentStepRef.current = 0;
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
          pendingPayments: balance + task.reward
        });

        setBalance(balance + task.reward);
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

  const totalEarnings = balance + withdrawnAmount;

  // Helper to format seconds as "Xm Ys"
  function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800 flex flex-col">
      {/* Modern Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <FaRocket className="text-xl text-indigo-600" />
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskForge
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <span className="text-xs font-medium text-indigo-700">${balance.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push("/profile")}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaUserCircle className="text-xl text-indigo-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors border border-indigo-200 hover:border-indigo-300"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {!isLoggedIn ? (
        /* Landing Page for Logged Out Users */
        <div className="flex-1">
          {/* Hero Section */}
          <section className="py-16 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBrain className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Train AI Models & Earn Rewards
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join TaskForge - the platform where you contribute to AI development by completing simple tasks and get paid for your efforts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started - It's Free
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Already have an account?
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose TaskForge?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-2xl text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Community</h3>
                  <p className="text-gray-600">Join thousands of contributors worldwide helping to train the next generation of AI models.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLightbulb className="text-2xl text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Diverse Tasks</h3>
                  <p className="text-gray-600">From image annotation to sentiment analysis, choose tasks that match your skills and interests.</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChild className="text-2xl text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
                  <p className="text-gray-600">Your data is protected with enterprise-grade security and timely payments are guaranteed.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
                  <h3 className="font-semibold mb-2">Sign Up & Complete Profile</h3>
                  <p className="text-gray-600">Create your account and complete your verification to unlock all tasks.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
                  <h3 className="font-semibold mb-2">Choose Tasks</h3>
                  <p className="text-gray-600">Browse available tasks and select ones that interest you.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
                  <h3 className="font-semibold mb-2">Earn & Get Paid</h3>
                  <p className="text-gray-600">Complete tasks, earn rewards, and withdraw your earnings securely.</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Earning Today
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* Logged In User Content */
        <div className="flex flex-1">
          {/* Mobile menu button */}
          <div className="md:hidden fixed top-16 right-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              {sidebarOpen ? <FaTimes className="text-indigo-600 text-sm" /> : <FaBars className="text-indigo-600 text-sm" />}
            </button>
          </div>

          {/* Sidebar */}
          <div className={`w-64 bg-white/95 backdrop-blur-md fixed h-full z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static shadow-xl`}>
            <nav className="p-4">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Navigation</h2>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <FaHome className={`text-sm ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Dashboard</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('tasks'); setSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'tasks'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <FaTasks className={`text-sm ${activeTab === 'tasks' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Available Tasks</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('balance'); setSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'balance'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <FaDollarSign className={`text-sm ${activeTab === 'balance' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Earnings</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('support'); setSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === 'support'
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <FaQuestionCircle className={`text-sm ${activeTab === 'support' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-sm">Support</span>
                  </button>
                </div>
              </div>

              {isLoggedIn && (
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <FaUserCircle className="text-xl text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-900 text-sm">{username}</h3>
                    <p className="text-xs text-indigo-600 mt-1">Welcome back!</p>
                    <div className="mt-2 bg-white rounded-full px-2 py-0.5 inline-flex items-center space-x-1">
                      <FaDollarSign className="text-emerald-500 text-xs" />
                      <span className="text-xs font-medium text-emerald-700">${balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {username}! 👋</h1>
                  <p className="text-gray-600">Here's what's happening with your tasks today</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-909">Active Projects</h2>
                      <span className="text-sm text-indigo-600 font-medium">{activeProjects.length} projects</span>
                    </div>
                    <div className="space-y-4">
                      {activeProjects.map(project => (
                        <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{project.category}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{project.progress}% complete</span>
                            <span className="text-xs text-indigo-600 font-medium">View</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Progress</h2>
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              className="text-gray-100 stroke-current"
                              strokeWidth="10"
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                            />
                            <circle
                              className="text-indigo-500 stroke-current"
                              strokeWidth="10"
                              strokeLinecap="round"
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 * (1 - calculateCompletion() / 100)}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-indigo-700">{calculateCompletion()}%</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Complete your profile to unlock more opportunities</p>
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Complete Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Earnings Overview</h2>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Available Balance</span>
                          <FaDollarSign className="text-emerald-500" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">${balance.toFixed(2)}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Pending Payments</span>
                          <FaBell className="text-amber-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">${pendingPayments.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">Processing in 3-5 business days</p>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Total Earnings</span>
                          <FaChartLine />
                        </div>
                        <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-3">
                      {recentActivities.length > 0 ? (
                        recentActivities.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{activity.taskTitle}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <FaClock className="mr-1" /> {formatTime(activity.completionTime)}
                                </span>
                                <span className="text-xs text-emerald-600 flex items-center">
                                  <FaDollarSign className="mr-1" /> {activity.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center">
                              <FaCheckCircle className="mr-1" /> Completed
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FaTasks className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No recent activity</p>
                          <p className="text-sm text-gray-400 mt-1">Complete tasks to see your activity here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Tasks</h1>
                  <p className="text-gray-600">Complete tasks and earn rewards</p>
                </div>

                {/* Task progress modal */}
                {activeTask && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                      <h2 className="text-xl font-bold mb-4 text-center">Task in Progress</h2>

                      <div className="mb-4">
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-100"
                            style={{ width: `${taskProgress}%` }}
                          />
                        </div>
                        <p className="text-center text-gray-600">Completing... {Math.round(taskProgress)}%</p>
                      </div>

                      <div className="mb-4 max-h-40 overflow-y-auto">
                        <h3 className="font-medium mb-2">Current Activity:</h3>
                        {availableTasks.find(t => t.id === activeTask)?.activities.map((activity, index) => (
                          <div
                            key={index}
                            className={`text-sm p-2 rounded mb-1 ${index < Math.floor((taskProgress / 100) * (availableTasks.find(t => t.id === activeTask)?.activities.length || 1))
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-50 text-gray-500'}`}
                          >
                            {index < Math.floor((taskProgress / 100) * (availableTasks.find(t => t.id === activeTask)?.activities.length || 1))
                              ? <FaCheckCircle className="inline mr-2 text-emerald-500" />
                              : <span className="inline-block w-5 mr-2"></span>}
                            {activity}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={cancelTask}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors"
                      >
                        Cancel Task
                      </button>
                    </div>
                  </div>
                )}

                {tasksAvailable.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                    <FaTasks className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Available</h3>
                    <p className="text-gray-500 mb-6">Check back later for new tasks to complete.</p>
                    <button
                      onClick={() => setTasksAvailable(getAvailableTasks())}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Refresh Tasks
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasksAvailable.map(task => (
                      <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-600 text-sm">{task.description}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full mr-2">
                                ID: {task.id}
                              </span>
                              <span>{task.steps} steps</span>
                            </div>
                          </div>
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                            {task.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-emerald-600">${task.reward.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{task.timeEstimate}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => startTask(task.id, task.duration)}
                          disabled={completedTasks.includes(task.id) || activeTask !== null}
                          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${completedTasks.includes(task.id)
                            ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                            : activeTask !== null
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm hover:shadow-md'
                            }`}
                        >
                          {completedTasks.includes(task.id) ? 'Completed ✓' : 'Start Task'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'balance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-909 mb-2">Earnings & Balance</h1>
                  <p className="text-gray-600">Track your earnings and payment history</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl text-center border border-indigo-100">
                    <div className="text-3xl font-bold text-emerald-700 mb-2">${balance.toFixed(2)}</div>
                    <div className="text-sm text-indigo-600">Available Balance</div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl text-center border border-amber-100">
                    <div className="text-3xl font-bold text-amber-700 mb-2">${pendingPayments.toFixed(2)}</div>
                    <div className="text-sm text-amber-600">Pending Payments</div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-center text-white">
                    <div className="text-3xl font-bold mb-2">${totalEarnings.toFixed(2)}</div>
                    <div className="text-sm text-indigo-100">Total Earnings</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
                  {recentActivities.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentActivities.slice(0, 10).map((activity, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {activity.taskTitle}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.taskId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatTime(activity.completionTime)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-700">
                                ${activity.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(activity.completedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaTasks className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No activity history yet</p>
                      <p className="text-sm text-gray-400 mt-1">Complete tasks to see your activities here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-909 mb-2">Support Center</h1>
                  <p className="text-gray-600">Get help and find resources</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Get Help</h2>
                    <div className="space-y-4">
                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaQuestionCircle className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">Contact Support</h3>
                          <p className="text-sm text-gray-600">Get direct help from our team</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaHome className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">FAQ</h3>
                          <p className="text-sm text-gray-600">Find answers to common questions</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">Community Forums</h3>
                          <p className="text-sm text-gray-600">Connect with other taskers</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Resources</h2>
                    <div className="space-y-4">
                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaTasks className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-909">Tasker Guidelines</h3>
                          <p className="text-sm text-gray-600">Best practices and rules</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaChartLine className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">Tips & Best Practices</h3>
                          <p className="text-sm text-gray-600">Maximize your earnings</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaRocket className="text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">Video Tutorials</h3>
                          <p className="text-sm text-gray-600">Learn with video guides</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}