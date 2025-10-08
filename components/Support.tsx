'use client';
import { FaQuestionCircle, FaEnvelope, FaBook, FaComments, FaLifeRing, FaRocket, FaShieldAlt, FaClock } from 'react-icons/fa';

export default function Support() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl p-5 text-white shadow-lg border-2 border-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <FaLifeRing className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Support Center</h2>
              <p className="text-xs text-blue-100 font-medium">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <FaQuestionCircle className="text-xl text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">FAQs</h3>
          <p className="text-xs text-slate-600">Common questions</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <FaEnvelope className="text-xl text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Email</h3>
          <p className="text-xs text-slate-600">24-48h response</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <FaComments className="text-xl text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Live Chat</h3>
          <p className="text-xs text-slate-600">Chat now</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <FaBook className="text-xl text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Help Docs</h3>
          <p className="text-xs text-slate-600">Guides & tutorials</p>
        </div>
      </div>

      {/* Main Support Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-300">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaEnvelope className="text-blue-900 text-lg" />
            Contact Support
          </h3>
          <form className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="What can we help you with?"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Message</label>
              <textarea
                placeholder="Describe your issue..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white py-3 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg border border-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Popular Topics */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-300">
            <h3 className="text-base font-bold text-slate-900 mb-4">Popular Topics</h3>
            <div className="space-y-2">
              {[
                { title: 'How do I withdraw earnings?', icon: '💰', color: 'from-emerald-50 to-green-50' },
                { title: 'What are quality thresholds?', icon: '⭐', color: 'from-amber-50 to-yellow-50' },
                { title: 'How long do tasks take?', icon: '⏱️', color: 'from-blue-50 to-cyan-50' },
                { title: 'When do I get paid?', icon: '💵', color: 'from-purple-50 to-pink-50' },
                { title: 'Account verification help', icon: '🔐', color: 'from-slate-50 to-blue-50' }
              ].map((topic, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 bg-gradient-to-r ${topic.color} rounded-lg border border-slate-300 hover:border-blue-400 hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{topic.icon}</span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 transition-colors">
                      {topic.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-slate-300">
          <div className="flex items-center gap-2 mb-3">
            <FaClock className="text-2xl text-blue-900" />
            <h4 className="text-sm font-bold text-slate-900">Response Time</h4>
          </div>
          <p className="text-xs text-slate-700 font-medium mb-1">Average: 24 hours</p>
          <p className="text-xs text-slate-600">Respond within one business day</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-slate-300">
          <div className="flex items-center gap-2 mb-3">
            <FaShieldAlt className="text-2xl text-emerald-900" />
            <h4 className="text-sm font-bold text-slate-900">Secure Platform</h4>
          </div>
          <p className="text-xs text-slate-700 font-medium mb-1">Enterprise Security</p>
          <p className="text-xs text-slate-600">Bank-level encryption</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-slate-300">
          <div className="flex items-center gap-2 mb-3">
            <FaRocket className="text-2xl text-amber-900" />
            <h4 className="text-sm font-bold text-slate-900">Fast Payouts</h4>
          </div>
          <p className="text-xs text-slate-700 font-medium mb-1">Instant - 24h</p>
          <p className="text-xs text-slate-600">Quick payment processing</p>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-300 rounded-2xl p-5">
        <h3 className="text-base font-bold text-purple-900 mb-4">Community Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white font-bold text-xs">✓</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900 mb-0.5">Quality First</h4>
              <p className="text-xs text-purple-800">Honest, thoughtful responses</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white font-bold text-xs">✓</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900 mb-0.5">Respect Time Limits</h4>
              <p className="text-xs text-purple-800">Complete tasks on time</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white font-bold text-xs">✓</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900 mb-0.5">No Cheating</h4>
              <p className="text-xs text-purple-800">No automated tools or bots</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white font-bold text-xs">✓</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900 mb-0.5">Read Instructions</h4>
              <p className="text-xs text-purple-800">Follow requirements carefully</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
