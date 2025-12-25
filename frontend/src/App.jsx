import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Check, Eye, Keyboard, Brain } from "lucide-react";
import AuthModal from './components/AuthModal.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.jsx';

const howItWorks = [
  {
    icon: Eye,
    title: "Eye Movement",
    desc: "Tracks gaze patterns and blink rate to detect cognitive overload in real-time.",
  },
  {
    icon: Keyboard,
    title: "Typing Speed",
    desc: "Measures keystroke rhythm and pauses to quantify mental processing load.",
  },
  {
    icon: Brain,
    title: "App Switches",
    desc: "Analyzes context switching frequency and predicts burnout 30min early.",
  },
];

function LandingContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    ScrollReveal().reveal('.sr-hero-left', {
      origin: 'left',
      distance: '60px',
      duration: 900,
      opacity: 0,
    });

    ScrollReveal().reveal('.sr-hero-right', {
      origin: 'right',
      distance: '60px',
      duration: 900,
      opacity: 0,
    });

    ScrollReveal().reveal('.sr-how', {
      origin: 'bottom',
      distance: '50px',
      duration: 800,
      interval: 150,
      opacity: 0,
    });

    ScrollReveal().reveal('.sr-orbit', {
      scale: 0.9,
      opacity: 0,
      duration: 1000,
      easing: 'ease-out',
    });

    ScrollReveal().reveal('.sr-metric', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      interval: 150,
      opacity: 0,
    });

    // ⭐ TEAM PERFORMANCE (important)
    ScrollReveal().reveal('.sr-team', {
      origin: 'bottom',
      distance: '40px',
      duration: 1000,
      interval: 200,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: 0,
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-slate-50">
        {/* top background glow */}
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.28)_0,_transparent_55%)]" />

        {/* main container */}
        <div className="relative z-10">
          {/* NAVBAR - FIXED */}
          <header className="fixed top-0 left-0 w-full bg-[#020617]/95 backdrop-blur-xl z-50 border-b border-slate-800/70">
            <div className="mx-auto flex max-w-7xl items-center px-6 py-4 gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 shadow-2xl shadow-sky-500/50 border-2 border-white/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/95 rounded-lg flex items-center justify-center font-black text-lg tracking-tighter text-purple-900 drop-shadow-lg">
                    NN
                  </div>
                </div>
                <span className="hidden xs:inline text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-100 drop-shadow-2xl">
                  Neural
                  <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-purple-300 bg-clip-text text-transparent">
                    Nest
                  </span>
                </span>
              </div>

              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                {user ? (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl shadow-xl shadow-sky-500/40 hover:from-sky-400 hover:to-blue-400 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all backdrop-blur-sm border border-white/20"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setAuthModalOpen(true)}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-sky-500/10 hover:border-sky-400 hover:scale-[1.02] transition-all shadow-lg shadow-black/20"
                    >
                      Sign up
                    </button>
                    <button 
                      onClick={() => setAuthModalOpen(true)}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl shadow-xl shadow-sky-500/40 hover:from-sky-400 hover:to-blue-400 hover:shadow-sky-500/50 hover:scale-[1.02] transition-all backdrop-blur-sm border border-white/20"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

        {/* HERO - LARGER CONTENT */}
        <section className="border-b border-slate-800/70 bg-gradient-to-b from-[#020617] via-[#020515] to-[#020617] min-h-screen lg:h-screen pt-20 flex items-start lg:items-center overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 w-full h-full flex lg:flex-row flex-col items-center justify-center gap-20 max-lg:gap-14 max-md:gap-10">
            {/* Left - INCREASED SIZE */}
            <div className="sr-hero-left flex-1 text-center lg:text-left space-y-8 max-w-xl flex flex-col justify-start lg:justify-center lg:pr-12 max-lg:items-center max-lg:max-w-2xl">

              {/* Live tag – sleek, single line, animated dot */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/60 px-5 py-2 text-xs md:text-sm text-slate-200 self-start max-lg:self-center backdrop-blur-xl shadow-lg shadow-black/40">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-semibold tracking-wide text-sky-300">
                  Live Now
                </span>
                <span className="text-slate-400 font-medium">
                  AI Cognitive Load Balancer
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                Real-time brain load sensing
                <span className="block bg-gradient-to-r from-sky-300 via-blue-200 to-purple-300 bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl font-bold">
                  tracks eyes, typing, app switches
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                NeuralNest uses browser APIs to compute cognitive load scores,
                auto-sequence low-load tasks, and predict burnout 30 minutes
                early.
              </p>

              {/* Feature tags – smaller + sleeker */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start text-xs md:text-sm text-sky-200">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-slate-700/80 px-4 py-1.5 backdrop-blur-xl shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Eye tracking
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-slate-700/80 px-4 py-1.5 backdrop-blur-xl shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Typing rhythm
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-slate-700/80 px-4 py-1.5 backdrop-blur-xl shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Context switches
                </div>
              </div>

              {/* CTAs – sleeker */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="group rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-10 py-3 text-base md:text-lg font-bold text-slate-900 shadow-xl shadow-sky-500/40 hover:from-sky-400 hover:to-blue-400 hover:shadow-sky-500/60 hover:scale-[1.02] transition-all backdrop-blur-sm"
                >
                  <span>Start Free Scan</span>
                  <span className="ml-2 inline-block w-4 h-4 rounded-full bg-white/20 group-hover:bg-white/40 transition-all" />
                </button>
                <button
                  onClick={() => setShowVideo(true)}
                  className="group rounded-full border-2 border-slate-600/70 bg-slate-950/60 px-10 py-3 text-base md:text-lg font-semibold text-slate-100 hover:border-sky-500/70 hover:bg-sky-500/5 hover:shadow-lg hover:shadow-sky-500/30 transition-all backdrop-blur-xl"
                >
                  Watch Demo →
                </button>
              </div>
            </div>
            {/* Right – LARGER graphic - FIXED BLACK BOX */}
            <div className="sr-hero-right flex-1 flex justify-center relative max-w-2xl h-[500px] flex-shrink-0 max-lg:h-[420px] max-md:h-[360px] max-sm:h-[300px]">
              <div className="relative w-full h-full max-w-lg">
                <div className="absolute inset-0 translate-x-12">
                  <div className="h-80 w-80 rounded-[50px] bg-gradient-to-br from-sky-500 via-blue-500 to-purple-500 opacity-40 blur-3xl animate-pulse" />
                </div>

                <div className="hero-main-enter relative h-72 w-72 -rotate-12 rounded-[40px] bg-gradient-to-r from-sky-500/95 via-blue-500/85 to-purple-500/95 shadow-2xl shadow-sky-500/60 ring-2 ring-white/20 mx-auto max-md:h-64 max-md:w-64 max-sm:h-56 max-sm:w-56">
                  <div className="absolute inset-x-8 top-10 h-14 rounded-3xl bg-white/25 backdrop-blur-xl" />
                  <div className="absolute inset-8 bottom-12 top-28 rounded-3xl bg-white/15 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6">
                    <div className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">73%</div>
                    <div className="text-base font-bold text-white/95 uppercase tracking-widest mt-2">Optimal</div>
                  </div>
                </div>

                <div className="hero-glow-enter absolute right-[-40px] top-[-40px] h-52 w-52 rotate-15 rounded-[40px] bg-gradient-to-br from-sky-500/90 via-purple-500/80 to-blue-500/90 shadow-2xl shadow-sky-500/40 animate-pulse" />
                
                {/* Small block - MUCH CLOSER to main gradient box */}
                <div className="hero-small-enter absolute left-[16px] bottom-[24px] h-44 w-44 -rotate-8 rounded-[35px] bg-black/90 shadow-2xl shadow-black/80 backdrop-blur-xl max-md:left-[50%] max-md:-translate-x-1/2 max-md:bottom-[-12px] max-sm:h-36 max-sm:w-36">
                  {/* FULL inner gradient covering entire block */}
                  <div className="absolute inset-0 rounded-[35px] bg-gradient-to-br from-slate-900/80 via-black/95 to-slate-950/90 shadow-inner" />

                  {/* LARGER content filling the block */}
                  <div className="absolute inset-3 flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/85 border border-slate-800/50 text-sm font-bold text-slate-50 backdrop-blur-sm shadow-xl tracking-tight">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>↓23% Load</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-slate-800/70 bg-[#020618] py-24 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How NeuralNest works
            </h2>
            <p className="text-2xl text-slate-400 mb-24 max-w-3xl mx-auto">
              Three signals → One focus score → Perfect task flow
            </p>

            <div className="grid gap-8 md:grid-cols-3 mb-24">
              {howItWorks.map(({ icon, title, desc }) => {
                const Icon = icon;
                return (
                  <div
                    key={title}
                    className="sr-how space-y-6 p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-sky-500/50 hover:bg-slate-900/70 transition-all group"
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500/30 to-blue-500/30 border border-sky-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-sky-400 drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">
                      {title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-base">
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Concentric circle + orbs */}
            <div className="sr-orbit relative flex flex-col items-center mb-24">
              <div className="relative h-72 w-72 md:h-96 md:w-96 max-sm:h-64 max-sm:w-64">
                <div className="absolute inset-0 rounded-full border-4 border-sky-500/50 animate-pulse" />
                <div
                  className="absolute inset-10 rounded-full border-4 border-sky-500/40 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute inset-20 rounded-full border-4 border-sky-400/60 animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div className="absolute inset-32 flex items-center justify-center rounded-full bg-slate-950/95 shadow-2xl backdrop-blur-xl">
                  <div
                    className="grid grid-cols-3 gap-3 animate-spin-slow"
                    style={{ animationDuration: "25s" }}
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-4 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg animate-pulse"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Orbs ±150px from circle, center-aligned */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-[480px] h-full">
                  <div 
                    onClick={() => window.open('https://github.com/Nakkshh/neuralnest-prod', '_blank')}
                    className="absolute left-[-150px] top-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-gradient-to-br from-black to-gray-800 shadow-2xl shadow-gray-500/60 animate-pulse flex items-center justify-center pointer-events-auto hover:scale-110 hover:cursor-pointer transition-all border-2 border-white/30 max-md:left-[-25px] max-sm:left-[-25px]"
                    title="GitHub Repository"
                  >
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.058-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.176 2.873.171 3.177.768.84 1.238 1.911 1.238 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div 
                    onClick={() => window.open('https://neuralnest-prod.onrender.com/', '_blank')}
                    className="absolute right-[-150px] top-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 shadow-2xl shadow-blue-500/60 animate-pulse flex items-center justify-center pointer-events-auto hover:scale-110 hover:cursor-pointer transition-all border-2 border-white/30 max-md:right-[-25px] max-sm:right-[-25px]"
                    style={{ animationDelay: "0.5s" }}
                    title="REST API Documentation"
                  >
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {/* Outer glow ring */}
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" fill="none"/>
                      {/* Middle pulse ring */}
                      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeOpacity="0.5" fill="none" strokeDasharray="2,2"/>
                      {/* Inner API orb core */}
                      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.8"/>
                      {/* API signal lines */}
                      <path d="M12 4v4M12 16v4M4 12h4M16 12h4M8.5 8.5l3 3m0 0l3-3m-3 3v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Center API dot */}
                      <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Metrics - SLEEKER */}
        <section className="border-b border-slate-800/70 bg-[#020617] py-24 pt-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Live Metrics
            </h2>
            <p className="text-2xl text-slate-400 mb-20 max-w-3xl mx-auto">
              What NeuralNest users are seeing right now
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="sr-metric group bg-slate-900/70 border border-slate-700/60 rounded-3xl p-10 hover:border-sky-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-sky-500/30">
                <div className="text-5xl lg:text-6xl font-black text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                  73%
                </div>
                <div className="text-xl lg:text-2xl font-bold text-slate-100 mb-2">
                  Avg Focus
                </div>
                <div className="text-slate-400 text-sm lg:text-base tracking-wide">
                  Across 2.4K active users
                </div>
              </div>
              <div className="sr-metric group bg-slate-900/70 border border-slate-700/60 rounded-3xl p-10 hover:border-emerald-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30">
                <div className="text-5xl lg:text-6xl font-black text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  ↓42%
                </div>
                <div className="text-xl lg:text-2xl font-bold text-slate-100 mb-2">
                  Load Reduced
                </div>
                <div className="text-slate-400 text-sm lg:text-base tracking-wide">
                  This week across teams
                </div>
              </div>
              <div className="sr-metric group bg-slate-900/70 border border-slate-700/60 rounded-3xl p-10 hover:border-purple-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/30">
                <div className="text-5xl lg:text-6xl font-black text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                  28min
                </div>
                <div className="text-xl lg:text-2xl font-bold text-slate-100 mb-2">
                  Burnout Alert
                </div>
                <div className="text-slate-400 text-sm lg:text-base tracking-wide">
                  Early warning average
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team performance */}
        <section className="border-b border-slate-800/70 bg-[#020618] py-24 pt-32">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Team performance
                </h2>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl">
                  Design your own focus policies, load bands, and alerts. Every
                  card below can map to a squad, pod, or project.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <button className="px-3 py-1.5 rounded-full border border-slate-600 bg-slate-900/70 hover:border-sky-500 hover:text-sky-300 transition-all">
                  Today
                </button>
                <button className="px-3 py-1.5 rounded-full border border-slate-600 bg-slate-900/70 hover:border-sky-500 hover:text-sky-300 transition-all">
                  This week
                </button>
                <button className="px-3 py-1.5 rounded-full border border-slate-600 bg-slate-900/70 hover:border-sky-500 hover:text-sky-300 transition-all">
                  Custom range
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="sr-team group rounded-3xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col gap-4 hover:border-sky-500/60 hover:bg-slate-950/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-sky-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        Build squad
                      </h3>
                      <p className="text-xs text-slate-500">
                        Shipping core product
                      </p>
                    </div>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    Stable
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-sky-300">89%</div>
                    <div className="text-xs text-slate-500">Avg focus score</div>
                  </div>
                  <div className="h-10 w-24 bg-gradient-to-r from-emerald-400/40 to-sky-400/40 rounded-full border border-emerald-400/50" />
                </div>
              </div>

              <div className="sr-team group rounded-3xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col gap-4 hover:border-purple-500/60 hover:bg-slate-950/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        Research pod
                      </h3>
                      <p className="text-xs text-slate-500">
                        Exploring new workloads
                      </p>
                    </div>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/40">
                    Watch
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-300">
                      64%
                    </div>
                    <div className="text-xs text-slate-500">
                      Focus with spikes
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-gradient-to-r from-amber-400/40 to-purple-400/40 rounded-full border border-amber-400/50" />
                </div>
              </div>

              <div className="sr-team group rounded-3xl border border-slate-800 bg-slate-950/60 p-6 flex flex-col gap-4 hover:border-rose-500/60 hover:bg-slate-950/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-rose-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        Ops crew
                      </h3>
                      <p className="text-xs text-slate-500">
                        On-call, incidents, tickets
                      </p>
                    </div>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/40">
                    At risk
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-rose-300">
                      51%
                    </div>
                    <div className="text-xs text-slate-500">
                      Degraded focus
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-gradient-to-r from-rose-400/40 to-amber-400/40 rounded-full border border-rose-400/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - NO EXCESS SPACE */}
        <footer className="border-t border-slate-800/70 bg-[#020617]">
          <div className="mx-auto max-w-7xl px-6 py-8 text-center">
            <div className="text-sm text-slate-500 mb-4">
              © {new Date().getFullYear()} NeuralNest Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <button className="hover:text-sky-400 transition-all px-3 py-1.5 hover:bg-sky-500/10 rounded-lg">
                Privacy
              </button>
              <button className="hover:text-sky-400 transition-all px-3 py-1.5 hover:bg-sky-500/10 rounded-lg">
                Terms
              </button>
              <button className="hover:text-sky-400 transition-all px-3 py-1.5 hover:bg-sky-500/10 rounded-lg">
                Security
              </button>
            </div>
            <div className="text-sm text-slate-500">
              Made with <span className="text-red-400 mx-1">❤️</span> by 
              <a 
                href="https://github.com/nakshh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-all ml-1"
                title="Nakkshh on GitHub"
              >
                Nakkshh
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
    {showVideo && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={() => setShowVideo(false)}>
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700 max-h-[90vh] max-sm:max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 z-50 bg-black/80 hover:bg-red-500/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg transition-all backdrop-blur-sm border border-white/20"
          >
            ✕
          </button>
          {/* YouTube Video */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/bHMfQ8921Kc?autoplay=1&rel=0"
            title="NeuralNest Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )}

    {/* AUTH MODAL */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

function AppContent() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingContent />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return <AppContent />;
}

export default App;
