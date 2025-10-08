'use client';
import { FaUserCircle, FaWallet, FaSignOutAlt, FaShieldAlt, FaHome, FaBriefcase, FaDollarSign, FaQuestionCircle, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  balance: number;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Header({ isLoggedIn, balance, onLogout, activeTab, onTabChange }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FaHome },
    { id: 'tasks', name: 'Projects', icon: FaBriefcase },
    { id: 'balance', name: 'Earnings', icon: FaDollarSign },
    { id: 'support', name: 'Support', icon: FaQuestionCircle }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-slate-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Row - Logo, Balance, Actions */}
        <div className={`flex justify-between items-center border-b border-slate-100 ${isLoggedIn ? 'py-2.5' : 'py-3'}`}>
          {/* Logo Section */}
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-900 to-cyan-700 p-1.5 rounded-lg shadow-lg">
                <Image 
                  src="/FORGE.png" 
                  alt="TaskForge Logo" 
                  width={32} 
                  height={22} 
                  className="relative brightness-0 invert"
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                TaskForge
              </span>
              <span className="text-[7px] text-slate-500 font-medium tracking-wider uppercase">Professional Platform</span>
            </div>
          </div>

          {/* Mobile Actions */}
          {isLoggedIn ? (
            <div className="flex md:hidden items-center gap-2">
              {/* Profile Button */}
              <button
                onClick={() => router.push("/profile")}
                className="relative p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <FaUserCircle className="text-base text-slate-700" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
              </button>
              
              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-slate-100 rounded-lg border-2 border-slate-300 hover:shadow-md transition-all duration-300"
              >
                {mobileMenuOpen ? <FaTimes className="text-slate-700" /> : <FaBars className="text-slate-700" />}
              </button>
            </div>
          ) : (
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Login Button */}
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-white border-2 border-blue-900/30 rounded-lg hover:bg-blue-50 transition-all duration-300"
              >
                LOGIN
              </button>
              
              {/* Mobile Sign Up Button */}
              <button
                onClick={() => router.push("/signup")}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-cyan-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-700"
              >
                SIGN UP
              </button>
            </div>
          )}

          {/* Desktop Actions Section */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* Balance Display */}
                <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-200/60 px-2.5 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group">
                  <div className="p-1 bg-gradient-to-br from-amber-400 to-yellow-500 rounded group-hover:scale-110 transition-transform duration-300">
                    <FaWallet className="text-white text-[10px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-amber-700 font-bold uppercase tracking-wider">Balance</span>
                    <span className="text-xs font-extrabold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                      ${balance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Profile Button */}
                <button
                  onClick={() => router.push("/profile")}
                  className="relative p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-blue-50 hover:to-cyan-50 border-2 border-slate-300 hover:border-blue-400 rounded-lg transition-all duration-300 hover:shadow-md group"
                  aria-label="Profile"
                >
                  <FaUserCircle className="text-base text-slate-700 group-hover:text-blue-700 transition-colors duration-300" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 border border-white rounded-full">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group border border-slate-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <FaSignOutAlt className="relative z-10 text-[10px]" />
                  <span className="relative z-10 text-[10px]">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => router.push("/login")}
                  className="relative px-6 py-2.5 font-bold text-blue-900 bg-white border-2 border-blue-900/30 rounded-xl overflow-hidden group transition-all duration-300 hover:border-blue-900 hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 text-sm font-extrabold tracking-wide">LOGIN</span>
                </button>

                {/* Sign Up Button */}
                <button
                  onClick={() => router.push("/signup")}
                  className="relative px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 hover:from-blue-950 hover:via-blue-900 hover:to-cyan-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group border border-blue-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-blue-800 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 text-sm font-extrabold flex items-center gap-2 tracking-wide">
                    <FaShieldAlt className="text-amber-400 text-xs" />
                    SIGN UP
                    <svg 
                      className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Row - Only for logged in users */}
        {isLoggedIn && onTabChange && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center gap-2 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Icon className={`text-xs ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-200 py-2 bg-slate-50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`text-sm ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}

