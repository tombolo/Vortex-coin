'use client';
import { useState, useEffect } from 'react';
import { FaRocket, FaTimes } from 'react-icons/fa';

interface TaskCountdownProps {
  onComplete: () => void;
  onCancel: () => void;
  taskNumber: number;
}

export default function TaskCountdown({ onComplete, onCancel, taskNumber }: TaskCountdownProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-slate-200 text-center animate-bounce-in">
        {/* Success Animation */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl animate-pulse">
          <FaRocket className="text-3xl text-white" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
          Great Job! 🎉
        </h2>
        <p className="text-base text-slate-700 mb-6 font-medium">
          Loading next task...
        </p>

        {/* Countdown Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-200 stroke-current"
              strokeWidth="8"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <circle
              className="text-blue-900 stroke-current transition-all duration-1000"
              strokeWidth="8"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * ((5 - countdown) / 5)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
              {countdown}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium mb-5">
          Task {taskNumber} starting in {countdown} seconds...
        </p>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-slate-300"
        >
          <FaTimes />
          Cancel & Return to Projects
        </button>
      </div>
    </div>
  );
}
