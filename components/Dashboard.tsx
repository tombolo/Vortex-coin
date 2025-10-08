'use client';
import { FaChartLine, FaClock, FaTrophy, FaFire, FaCheckCircle, FaDollarSign, FaStar, FaAward, FaMedal } from 'react-icons/fa';

interface DashboardProps {
  username: string;
  balance: number;
  completedTasks: string[];
  totalEarnings: number;
  userData: any;
  recentActivities?: Array<{
    taskId: string;
    taskTitle: string;
    amount: number;
    completionTime: number;
    completedAt: Date;
  }>;
}

export default function Dashboard({ username, balance, completedTasks, totalEarnings, userData, recentActivities = [] }: DashboardProps) {
  const todayEarnings = recentActivities
    .filter(a => new Date(a.completedAt).toDateString() === new Date().toDateString())
    .reduce((sum, a) => sum + a.amount, 0);
  const streak = 7; // Days in a row
  const rank = completedTasks.length >= 50 ? "Elite" : completedTasks.length >= 20 ? "Gold" : "Silver";
  const accuracy = 96.8;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header - Professional Design */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-300 relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shadow-sm border border-slate-300">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 mb-0.5">
                  Welcome, <span className="text-slate-900">{username}</span>
                </h1>
                <p className="text-xs text-slate-600 font-medium">Ready for quality work today?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-300 shadow-sm">
              <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                <FaTrophy className="text-lg text-amber-500" />
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Rank</p>
                <p className="text-base font-extrabold text-slate-900">{rank}</p>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-300">
                  <FaDollarSign className="text-emerald-600 text-xs" />
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Today</p>
              </div>
              <p className="text-2xl font-extrabold text-emerald-600">${todayEarnings.toFixed(2)}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-300">
                  <FaCheckCircle className="text-slate-600 text-xs" />
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Completed</p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{completedTasks.length}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-300">
                  <FaFire className="text-orange-500 text-xs" />
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Streak</p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{streak}d</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-300">
                  <FaStar className="text-amber-500 text-xs" />
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Accuracy</p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Available Balance */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Available Balance</h3>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-lg">
              <FaDollarSign className="text-white text-base" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
            ${balance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Ready to withdraw</p>
        </div>

        {/* Total Lifetime Earnings */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Total Earnings</h3>
            <div className="p-2 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-lg shadow-lg">
              <FaChartLine className="text-white text-base" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-1">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Lifetime earned</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Completed Tasks</h3>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg">
              <FaCheckCircle className="text-white text-base" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
            {completedTasks.length}
          </p>
          <p className="text-xs text-slate-500 font-medium">Tasks finished</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-lg shadow-lg">
            <FaChartLine className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Activities</h3>
            <p className="text-xs text-slate-600">Your latest completed tasks</p>
          </div>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            {recentActivities.slice(0, 6).map((activity, index) => (
              <div 
                key={index} 
                className="p-3 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-1 w-full sm:w-auto overflow-hidden">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-[9px] font-bold border border-blue-200 flex-shrink-0">
                        #{activity.taskId.slice(-6)}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight break-words">{activity.taskTitle}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] mt-1">
                      <div className="flex items-center gap-1 text-slate-600">
                        <FaClock className="text-blue-600 text-[9px]" />
                        <span className="font-semibold">{formatTime(activity.completionTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="font-medium">{new Date(activity.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-center">
                    <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md">
                      <p className="text-sm font-extrabold text-white">+${activity.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold mb-2">No activities yet</p>
            <p className="text-sm text-slate-500">Complete your first task to see it here</p>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg shadow-lg">
            <FaAward className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Your Achievements</h3>
            <p className="text-xs text-slate-600">Milestones unlocked</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🏆</div>
            <p className="text-xs font-extrabold text-amber-900">{rank}</p>
            <p className="text-[9px] text-amber-700 mt-0.5">Tier</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔥</div>
            <p className="text-xs font-extrabold text-orange-900">{streak}d</p>
            <p className="text-[9px] text-orange-700 mt-0.5">Streak</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">✨</div>
            <p className="text-xs font-extrabold text-emerald-900">{completedTasks.length}</p>
            <p className="text-[9px] text-emerald-700 mt-0.5">Tasks</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">⭐</div>
            <p className="text-xs font-extrabold text-purple-900">{accuracy}%</p>
            <p className="text-[9px] text-purple-700 mt-0.5">Accuracy</p>
          </div>
        </div>

        {/* Performance Badges */}
        {completedTasks.length >= 10 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-900 to-cyan-700 rounded-xl text-white text-center">
            <p className="text-sm font-bold">🎉 You've earned the "{rank} Contributor" badge!</p>
            <p className="text-xs text-blue-100 mt-1">Keep up the excellent work</p>
          </div>
        )}
      </div>
    </div>
  );
}

