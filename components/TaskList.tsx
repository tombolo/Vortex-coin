'use client';
import { Task } from '@/data/tasks';
import { FaClock, FaDollarSign, FaStar, FaBolt, FaCheckCircle, FaLock } from 'react-icons/fa';

interface TaskListProps {
  tasks: Task[];
  completedTasks: string[];
  onStartTask: (task: Task) => void;
}

export default function TaskList({ tasks, completedTasks, onStartTask }: TaskListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500';
      case 'Medium': return 'from-blue-500 to-cyan-500';
      case 'Hard': return 'from-orange-500 to-amber-500';
      case 'Expert': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-lg border-2 border-slate-200">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-4xl text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">No Tasks Available</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          All tasks are currently assigned. Check back in a few minutes for new opportunities.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Refresh Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-cyan-700 rounded-2xl p-6 text-white shadow-xl border-2 border-blue-700">
        <h2 className="text-2xl font-extrabold mb-2">Available Tasks</h2>
        <p className="text-blue-100">Complete high-quality work to earn rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tasks.map((task, index) => {
          const isCompleted = completedTasks.includes(task.id);
          const timeInMinutes = Math.floor(task.timeLimit / 60);
          
          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in ${
                isCompleted 
                  ? 'border-green-300 bg-green-50/50' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyBadge(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border-2 border-slate-200">
                      {task.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">{task.title}</h3>
                </div>
                
                <div className={`p-4 bg-gradient-to-br ${getDifficultyColor(task.difficulty)} rounded-xl shadow-lg`}>
                  <FaDollarSign className="text-2xl text-white" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{task.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 rounded-xl border-2 border-emerald-200 text-center">
                  <FaDollarSign className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-lg font-extrabold text-emerald-700">${task.reward.toFixed(2)}</p>
                  <p className="text-xs text-emerald-600 font-medium">Reward</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border-2 border-blue-200 text-center">
                  <FaClock className="text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-extrabold text-blue-700">{timeInMinutes}m</p>
                  <p className="text-xs text-blue-600 font-medium">Time Limit</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 rounded-xl border-2 border-amber-200 text-center">
                  <FaStar className="text-amber-600 mx-auto mb-1" />
                  <p className="text-lg font-extrabold text-amber-700">{task.qualityThreshold}%</p>
                  <p className="text-xs text-amber-600 font-medium">Required</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2">Requirements:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {task.requirements.slice(0, 2).map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {isCompleted ? (
                <button
                  disabled
                  className="w-full bg-green-100 text-green-800 py-3 rounded-xl font-bold border-2 border-green-300 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <FaCheckCircle />
                  Completed
                </button>
              ) : (
                <button
                  onClick={() => onStartTask(task)}
                  className="w-full bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 border-2 border-blue-700 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <FaBolt className="relative z-10" />
                  <span className="relative z-10">Start Task</span>
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

