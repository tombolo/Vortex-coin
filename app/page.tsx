'use client';
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaUserCircle, FaBars, FaTimes, FaHome, FaTasks, FaDollarSign, FaQuestionCircle, FaBrain, FaUsers, FaLightbulb, FaChild, FaRocket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Task as OldTask } from "../data/data"; // Old tasks for compatibility
import Image from "next/image";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ProjectList from "@/components/ProjectList";
import OutlierTaskWorker from "@/components/OutlierTaskWorker";
import TaskCountdown from "@/components/TaskCountdown";
import Earnings from "@/components/Earnings";
import Support from "@/components/Support";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import { getAvailableProjects, Project, generateOutlierTask, OutlierTask } from "@/data/projects";
import AnimatedTiles from "@/components/AnimatedTiles";
import "./AnimatedTiles.css";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTask, setCurrentTask] = useState<OutlierTask | null>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [taskNumber, setTaskNumber] = useState(1);
  const [recentActivities, setRecentActivities] = useState<Array<{
    taskId: string;
    taskTitle: string;
    amount: number;
    completionTime: number;
    completedAt: Date;
  }>>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: string;
  } | null>(null);
  const router = useRouter();

  const totalEarnings = balance + withdrawnAmount;

  useEffect(() => {
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
          setWithdrawnAmount(data.withdrawnAmount || 0);
          setRecentActivities(data.recentActivities || []);
        }

        // Load available projects
        setAvailableProjects(getAvailableProjects());
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

  // Refresh projects when switching to tasks tab
  useEffect(() => {
    if (activeTab === 'tasks' && isLoggedIn) {
      setTabLoading(true);
      setTimeout(() => {
        setAvailableProjects(getAvailableProjects());
        setTabLoading(false);
      }, 500);
    }
  }, [activeTab, isLoggedIn]);

  const handleTabChange = (tab: string) => {
    setTabLoading(true);
    setActiveTab(tab);
    setTimeout(() => setTabLoading(false), 300);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setTaskNumber(1);
    setCurrentTask(generateOutlierTask(project.id));
  };

  const handleCompleteTask = async (answers: Record<string, any>, timeSpent: number) => {
    if (!userId || !currentTask || !currentProject) return;

    // Quality check - ensure explanation is detailed enough
    const explanation = answers.explanation || '';
    const qualityScore = explanation.length >= 50 ? 100 : 50;

    if (qualityScore < currentProject.qualityThreshold) {
      setNotification({
        type: 'error',
        message: `Quality check failed`,
        details: `Please provide more detailed explanation (at least 50 characters required).`
      });
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      const newBalance = balance + currentProject.payPerTask;

      const newActivity = {
        taskId: currentTask.id,
        taskTitle: `${currentProject.name} - Task ${taskNumber}`,
        amount: currentProject.payPerTask,
        completionTime: timeSpent,
        completedAt: new Date()
      };

      const updatedActivities = [newActivity, ...recentActivities].slice(0, 20);

      await updateDoc(userRef, {
        balance: newBalance,
        completedTasks: [...completedTasks, currentTask.id],
        recentActivities: updatedActivities
      });

      setBalance(newBalance);
      setCompletedTasks([...completedTasks, currentTask.id]);
      setRecentActivities(updatedActivities);
      
      setNotification({
        type: 'success',
        message: `Task completed! You earned $${currentProject.payPerTask.toFixed(2)}`,
        details: `Time: ${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s • Task ${taskNumber} of session`
      });

      // Show countdown before next task
      setCurrentTask(null);
      setShowCountdown(true);
    } catch (error) {
      console.error("Error completing task:", error);
      setNotification({
        type: 'error',
        message: 'Error submitting task',
        details: 'Please try again or contact support if the issue persists.'
      });
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setTaskNumber(prev => prev + 1);
    if (currentProject) {
      setCurrentTask(generateOutlierTask(currentProject.id));
    }
  };

  const handleCancelCountdown = () => {
    setShowCountdown(false);
    setCurrentProject(null);
    setCurrentTask(null);
    setTaskNumber(1);
    setActiveTab('tasks');
  };

  const handleCancelTask = () => {
    if (confirm('Are you sure you want to exit this project? Your progress will be saved but you\'ll return to the project list.')) {
      setCurrentTask(null);
      setCurrentProject(null);
      setTaskNumber(1);
    }
  };


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 text-slate-900 flex flex-col">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          details={notification.details}
          onClose={() => setNotification(null)}
        />
      )}
      
      <Header 
        isLoggedIn={isLoggedIn} 
        balance={balance} 
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {!isLoggedIn ? (
        /* Landing Page for Logged Out Users */
        <div className="flex-1">
          {/* Hero Section */}
          <section className="py-20 px-4 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-float"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
            {/* Isometric animated tiles belt */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-140px] w-[1400px] max-w-none opacity-[.9]">
              <AnimatedTiles />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Animated Icon */}
              <div className="w-28 h-28 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-all duration-500 animate-bounce-in relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-900 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow"></div>
                <FaBrain className="text-5xl text-white relative z-10 animate-pulse" />
              </div>

              {/* Hero Title with Animation */}
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight animate-fade-in">
                <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent gradient-animate inline-block">
                  Train AI Models &
                </span>
                <br />
                <span className="text-slate-900 inline-block animate-slide-in-right">Earn Professional Rewards</span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.2s' }}>
                Join TaskForge - the <span className="font-bold text-blue-900">premier professional platform</span> where you contribute to cutting-edge AI development 
                by completing verified tasks and receive <span className="font-bold text-cyan-700">guaranteed compensation</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 hover:from-blue-950 hover:via-blue-900 hover:to-cyan-800 text-white px-12 py-5 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 border-2 border-blue-700 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-blue-800 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <FaRocket className="text-xl" />
                  Get Started - It's Free
                  </span>
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="border-3 border-blue-900 text-blue-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-12 py-5 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Already have an account?
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-700">Verified Platform</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <span className="text-slate-700">Secure Payments</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-cyan-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  <span className="text-slate-700">24/7 Support</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-2">50,000+</div>
                  <div className="text-slate-600 font-semibold">Active Contributors</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-cyan-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-700 to-blue-900 bg-clip-text text-transparent mb-2">$2M+</div>
                  <div className="text-slate-600 font-semibold">Paid to Contributors</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">4.9/5</div>
                  <div className="text-slate-600 font-semibold">User Satisfaction</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white border-y border-slate-200 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-20 left-10 w-64 h-64 bg-cyan-200 rounded-full filter blur-3xl opacity-10"></div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-4 animate-fade-in gradient-animate">
                  Why Choose TaskForge?
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Experience a professional platform built for serious contributors
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                {/* Feature Card 1 */}
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 group animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full filter blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                    <FaUsers className="text-4xl text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-blue-900 transition-colors duration-300">Global Community</h3>
                  <p className="text-slate-600 leading-relaxed">Join thousands of verified contributors worldwide helping to train the next generation of AI models.</p>
                  <div className="mt-6 inline-flex items-center text-blue-900 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                    Learn More →
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="text-center p-8 bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-3xl border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 group animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 rounded-full filter blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                    <FaLightbulb className="text-4xl text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">Diverse Tasks</h3>
                  <p className="text-slate-600 leading-relaxed">From image annotation to sentiment analysis, choose professionally curated tasks that match your expertise.</p>
                  <div className="mt-6 inline-flex items-center text-emerald-900 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                    Learn More →
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="text-center p-8 bg-gradient-to-br from-amber-50 via-white to-yellow-50 rounded-3xl border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 group animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full filter blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                    <FaChild className="text-4xl text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-amber-900 transition-colors duration-300">Secure & Reliable</h3>
                  <p className="text-slate-600 leading-relaxed">Your data is protected with enterprise-grade security and timely payments are 100% guaranteed.</p>
                  <div className="mt-6 inline-flex items-center text-amber-900 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                    Learn More →
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-6">
                How It Works
              </h2>
              <p className="text-slate-600 mb-16 max-w-2xl mx-auto">
                Get started in three simple steps and begin earning professionally
              </p>
              <div className="grid md:grid-cols-3 gap-10 mb-16">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-extrabold shadow-lg">1</div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">Sign Up & Verify</h3>
                  <p className="text-slate-600 leading-relaxed">Create your professional account and complete secure verification to unlock all premium tasks.</p>
                </div>
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-700 to-cyan-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-extrabold shadow-lg">2</div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">Choose Tasks</h3>
                  <p className="text-slate-600 leading-relaxed">Browse curated tasks and select projects that align with your skills and interests.</p>
                </div>
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-extrabold shadow-lg">3</div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">Earn & Get Paid</h3>
                  <p className="text-slate-600 leading-relaxed">Complete tasks, earn rewards instantly, and withdraw your earnings with guaranteed secure payments.</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 hover:from-blue-950 hover:via-blue-900 hover:to-cyan-800 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 border border-blue-700"
              >
                Start Earning Today
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* Logged In User Content */
        <div className="flex-1 flex flex-col">
          {/* Countdown Modal */}
          {showCountdown && (
            <TaskCountdown 
              onComplete={handleCountdownComplete}
              onCancel={handleCancelCountdown}
              taskNumber={taskNumber + 1}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {currentTask && currentProject ? (
                <OutlierTaskWorker 
                  task={currentTask}
                  project={currentProject}
                  onComplete={handleCompleteTask}
                  onCancel={handleCancelTask}
                  taskNumber={taskNumber}
                  totalTasksCompleted={completedTasks.length}
                />
              ) : tabLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <p className="text-lg text-slate-700 font-bold animate-pulse">Loading...</p>
                  </div>
                </div>
              ) : activeTab === 'dashboard' ? (
                <Dashboard 
                  username={username}
                  balance={balance}
                  completedTasks={completedTasks}
                  totalEarnings={totalEarnings}
                  userData={userData}
                  recentActivities={recentActivities}
                />
              ) : activeTab === 'tasks' ? (
                <ProjectList 
                  projects={availableProjects}
                  onSelectProject={handleSelectProject}
                />
              ) : activeTab === 'balance' ? (
              <Earnings 
                balance={balance}
                totalEarnings={totalEarnings}
                completedTasks={completedTasks}
                alipayConnected={userData?.alipayConnected || false}
              />
            ) : activeTab === 'support' ? (
                <Support />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
