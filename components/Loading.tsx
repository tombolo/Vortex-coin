'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-bounce-in">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-900 rounded-3xl opacity-0 animate-pulse"></div>
            <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl filter blur-3xl opacity-30 animate-float"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-4 animate-fade-in">
          TaskForge
        </h2>
        <p className="text-slate-600 font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Loading your workspace...
        </p>

        {/* Animated Spinner */}
        <div className="flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-cyan-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
