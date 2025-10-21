'use client';
import { useRouter } from 'next/navigation';
import { FaDollarSign, FaChartLine, FaWallet, FaCheckCircle, FaExclamationCircle, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import { SiAlipay } from 'react-icons/si';

interface EarningsProps {
  balance: number;
  totalEarnings: number;
  completedTasks: string[];
  alipayConnected: boolean;
}

export default function Earnings({ balance, totalEarnings, completedTasks, alipayConnected }: EarningsProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl p-5 text-white shadow-lg border-2 border-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <FaChartLine className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Earnings & Balance</h2>
            <p className="text-xs text-blue-100 font-medium">Manage your income and withdrawals</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Available Balance</h3>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-lg">
              <FaWallet className="text-white text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            ${balance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Ready for withdrawal</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Total Earnings</h3>
            <div className="p-2 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-lg shadow-lg">
              <FaChartLine className="text-white text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-2">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Lifetime earnings</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Tasks Completed</h3>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg">
              <FaDollarSign className="text-white text-lg" />
            </div>
          </div>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {completedTasks.length}
          </p>
          <p className="text-xs text-slate-500 font-medium">Total tasks</p>
        </div>
      </div>

      {/* Alipay Connection Status */}
      {!alipayConnected ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationCircle className="text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">Alipay Account Required</h3>
          <p className="text-sm text-amber-800 mb-6 max-w-md mx-auto">
            You need to connect your Alipay account before you can withdraw earnings. This only takes a moment!
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            <SiAlipay className="text-lg" />
            Connect Alipay Account
            <FaArrowRight />
          </button>
          <div className="mt-5 text-amber-900 text-sm">
            <p className="font-semibold mb-3">If you don't have an Alipay account, join our WhatsApp to get one:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://chat.whatsapp.com/GXtKCOh8VZuF5otSjnSH2i?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md"
              >
                <FaWhatsapp className="text-lg" /> WhatsApp Group
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbB2aOZ9WtC5F6muRh3W"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-600 text-white font-bold shadow-md"
              >
                <FaWhatsapp className="text-lg" /> WhatsApp Channel
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Payment Method Info */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <SiAlipay className="text-blue-600 text-xl" />
              Connected Payment Method
            </h3>
            <div className="p-4 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <SiAlipay className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-blue-900 text-sm">Alipay Account Connected</h4>
                    <FaCheckCircle className="text-emerald-600 text-sm" />
                  </div>
                  <p className="text-xs text-slate-700 mb-3">Fast and secure international withdrawal</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <FaCheckCircle className="text-[9px]" /> Instant processing
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <FaCheckCircle className="text-[9px]" /> No fees
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <FaCheckCircle className="text-[9px]" /> USD to CNY conversion
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Guidelines */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-4">
            <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
              <FaExclamationCircle />
              Withdrawal Information
            </h4>
            <ul className="text-xs text-purple-800 space-y-1.5">
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Minimum:</strong> $10.00 USD per withdrawal</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Processing:</strong> Instant to 24 hours</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Fees:</strong> Zero fees for all withdrawals</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Account:</strong> Withdrawals sent to your connected Alipay</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Currency:</strong> Automatic USD to CNY market rate conversion</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
              <p className="text-xs text-purple-900 font-medium">
                💡 <strong>Tip:</strong> Withdraw when balance ≥ $10. Contact support for withdrawal assistance.
              </p>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Earnings Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700 font-medium">Current Balance</span>
                <span className="text-base font-bold text-emerald-700">${balance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700 font-medium">Previously Withdrawn</span>
                <span className="text-base font-bold text-slate-700">${(totalEarnings - balance).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900 to-cyan-700 rounded-lg text-white">
                <span className="text-sm font-medium">Total Lifetime</span>
                <span className="text-base font-bold">${totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}