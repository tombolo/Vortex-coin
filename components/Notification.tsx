'use client';
import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  details?: string;
  onClose: () => void;
}

export default function Notification({ type, message, details, onClose }: NotificationProps) {
  // Auto-close success notifications after 3 seconds
  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className={`bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 transform animate-bounce-in ${
          type === 'success' ? 'border-emerald-300' : 'border-red-300'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
            type === 'success' 
              ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
              : 'bg-gradient-to-br from-red-500 to-pink-500'
          }`}>
            {type === 'success' ? (
              <FaCheckCircle className="text-4xl text-white" />
            ) : (
              <FaExclamationTriangle className="text-4xl text-white" />
            )}
          </div>

          {/* Message */}
          <h3 className={`text-2xl font-extrabold mb-3 ${
            type === 'success' ? 'text-emerald-900' : 'text-red-900'
          }`}>
            {type === 'success' ? 'Success!' : 'Task Failed'}
          </h3>
          <p className="text-slate-700 font-semibold mb-2">{message}</p>
          {details && (
            <p className="text-sm text-slate-600 mb-6">{details}</p>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              type === 'success'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
            }`}
          >
            {type === 'success' ? 'Continue' : 'Try Again'}
          </button>
        </div>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FaTimes className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
