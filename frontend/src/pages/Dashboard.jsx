import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { TaskList } from '../components/TaskList';
import { LogOut, Camera, Eye, Zap, Activity, Shield } from 'lucide-react';
import { useCognitiveLoad } from '../hooks/useCognitiveLoad';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';



const API_BASE = 'http://localhost:8080';

const Dashboard = () => {
  const { user, logout } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [taskLoad, setTaskLoad] = useState(0);
  const [burnoutAlert, setBurnoutAlert] = useState({ timeLeft: 'Safe' });
  
  // ✅ PERSISTENT STATE - Survives refresh
  const [sessionData, setSessionData] = useState(() => {
    const saved = localStorage.getItem('neuralnest-session');
    return saved ? JSON.parse(saved) : {
      totalSwitches: 0,
      totalReports: 0,
      sessionStart: Date.now()
    };
  });

  const [lastBrainLoad, setLastBrainLoad] = useState(() => {
    const saved = localStorage.getItem('nn-last-brain-load');
    return saved ? Number(saved) : 0;
  });

  // ✅ FIX: Destructure hook values
  const {
    isActive,
    eyeData,
    startCamera,
    stopCamera,
    charsPerMinute,
    isFocused,
    switchCount,
    loadScore
  } = useCognitiveLoad(taskLoad);

  const displayLoad = isActive ? loadScore : lastBrainLoad;
  const isDistracted = isActive && !isFocused && switchCount >= 3;

  // 🔥 Save session data to localStorage
  useEffect(() => {
    localStorage.setItem('neuralnest-session', JSON.stringify(sessionData));
  }, [sessionData]);

  useEffect(() => {
  if (isActive) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastBrainLoad(loadScore);
    }
  }, [isActive, loadScore]);

  useEffect(() => {
    localStorage.setItem('nn-last-brain-load', String(lastBrainLoad));
  }, [lastBrainLoad]);

  // Replace the burnout useEffect:
  useEffect(() => {
    if (loadScore > 0 && user?.token) {
      fetch(`${API_BASE}/api/brain/burnout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          eyeScore: loadScore,
          totalLoad: taskLoad
        })
      })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setBurnoutAlert)
      .catch(err => {
        console.error('Burnout API:', err);
        setBurnoutAlert({ timeLeft: 'Safe' });  // Fallback
      });
    }
  }, [loadScore, taskLoad, user?.token]);

  // 🔥 ALL BUTTONS WORK!
  const saveReport = async () => {
    const report = {
      timestamp: new Date().toISOString(),
      brainLoad: Math.round(displayLoad * 100),
      taskLoad: Math.round(taskLoad * 100),
      typing: charsPerMinute,
      switches: switchCount,
      burnout: burnoutAlert,
      status: isDistracted ? 'DISTRACTED' : 'FOCUSED'
    };
    
    // ✅ 1. Save to LOCAL session (YOUR existing logic)
    setSessionData(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1,
      lastReport: report
    }));
    
    // ✅ 2. NEW: Save to DATABASE
    if (user?.token) {
      try {
        await fetch('http://localhost:8080/api/reports/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            brainLoad: displayLoad,           // Raw decimal (0.75)
            switchCount: switchCount,
            charsPerMinute: charsPerMinute,
            burnoutRisk: burnoutAlert.timeLeft
          })
        });
        console.log('✅ Report SAVED to PostgreSQL!');
      } catch (error) {
        console.error('DB Save failed:', error);
        // Don't break PDF - continue
      }
    }
    
    // ✅ 3. YOUR EXISTING PDF logic (unchanged)
    const doc = new jsPDF();
    
    // NeuralNest Logo
    doc.setFontSize(24);
    doc.setTextColor(30, 144, 255);
    doc.text('NeuralNest', 20, 30);
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('AI-Powered Brain Monitoring', 20, 45);
    
    // Session Report Header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Session Report #' + (sessionData.totalReports + 1), 20, 70);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 85);
    doc.text(`User: ${user?.email}`, 20, 95);
    
    // Metrics (manual table layout)
    doc.setFontSize(16);
    doc.text('📊 CURRENT METRICS', 20, 115);
    
    doc.setFontSize(12);
    doc.text('🧠 Brain Load:', 20, 135);
    doc.text(`${report.brainLoad}% ${report.brainLoad > 80 ? 'CRITICAL' : report.brainLoad > 60 ? 'HIGH' : 'OPTIMAL'}`, 80, 135);
    
    doc.text('📝 Task Load:', 20, 150);
    doc.text(`${report.taskLoad}%`, 80, 150);
    
    doc.text('⌨️ Typing Speed:', 20, 165);
    doc.text(`${report.typing} cpm`, 80, 165);
    
    doc.text('🔄 Context Switches:', 20, 180);
    doc.text(`${report.switches}`, 80, 180);
    
    doc.text('🎯 Focus Status:', 20, 195);
    doc.text(`${report.status}`, 80, 195);
    
    doc.text('⚠️ Burnout Risk:', 20, 210);
    doc.text(`${report.burnout.timeLeft}`, 80, 210);
    
    doc.text('⏱️ Session Duration:', 20, 225);
    doc.text(`${Math.round((Date.now() - sessionData.sessionStart) / 60000)} minutes`, 80, 225);
    
    // Save PDF
    doc.save(`NeuralNest-Report-${Date.now()}.pdf`);
    
    // ✅ 4. UPGRADED SUCCESS MESSAGE
    alert(`📊 Report SAVED EVERYWHERE!\n` +
          `🧠 Brain Load: ${report.brainLoad}%\n` +
          `💾 PostgreSQL DATABASE\n` +
          `📄 Downloads folder (PDF)\n` +
          `🎯 Session storage`);
  };

  const viewAnalytics = () => {
    const duration = Math.round((Date.now() - sessionData.sessionStart) / 60000);
    const avgLoad = Math.round(displayLoad * 100);
    const switchesPerMin = duration > 0 ? Math.round(switchCount / duration * 10) / 10 : 0;
    
    alert(`📈 ADVANCED ANALYTICS\n\n` +
      `⏱️ Session: ${duration}min\n` +
      `🧠 Peak Brain Load: ${avgLoad}%\n` +
      `🔄 Switches: ${switchCount} (${switchesPerMin}/min)\n` +
      `📊 Reports: ${sessionData.totalReports}\n` +
      `⌨️ Typing: ${charsPerMinute}cpm\n` +
      `⚠️ Burnout: ${burnoutAlert.timeLeft}\n\n` +
      `🎯 Focus Score: ${isDistracted ? 'LOW' : 'HIGH'}\n` +
      `💾 Last Report: ${sessionData.lastReport ? new Date(sessionData.lastReport.timestamp).toLocaleTimeString() : 'None'}`
    );
  };

  const handleToggleTracking = async () => {
    if (isActive) {
      stopCamera();
    } else {
      await startCamera();
    }
  };

  const setReminder = () => {
    const time = prompt('Break reminder in (minutes):', '15');
    if (time && !isNaN(time)) {
      setTimeout(() => {
        if (confirm('🔔 BREAK TIME! Your brain needs rest.\nBrain Load: ' + Math.round(loadScore * 100) + '%')) {
          setBurnoutAlert({ timeLeft: 'Safe' });
        }
      }, time * 60000);
      alert(`🔔 Reminder set for ${time} minutes!`);
    }
  };

  const resetAllMetrics = () => {
    if (confirm('🔄 Reset ALL metrics and start fresh?')) {
      // Clear localStorage (CORRECT syntax)
      localStorage.removeItem('nn-switch-count');
      localStorage.removeItem('nn-is-focused');
      localStorage.removeItem('nn-last-brain-load');
      localStorage.removeItem('neuralnest-session');
      
      // Reset Dashboard states
      setLastBrainLoad(0);
      setSessionData({
        totalSwitches: 0,
        totalReports: 0,
        sessionStart: Date.now()
      });
      setTaskLoad(0);
      
      // FORCE FULL RESET
      window.location.reload();
    }
  };

  return (
    <>
      {/* CLEAN NAVBAR - NO BACK BUTTON */}
      <header className="fixed top-0 left-0 w-full bg-[#020617]/95 backdrop-blur-xl z-50 border-b border-slate-800/70">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 shadow-2xl shadow-sky-500/50 border-2 border-white/20 flex items-center justify-center">
              <div className="w-8 h-8 bg-white/95 rounded-lg flex items-center justify-center font-black text-lg tracking-tighter text-purple-900 drop-shadow-lg">
                NN
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 drop-shadow-2xl">
              Neural
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-purple-300 bg-clip-text text-transparent">
                Nest
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={resetAllMetrics}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xl backdrop-blur-xl border border-white/20 bg-gradient-to-r from-slate-500/90 to-zinc-500/90 hover:from-slate-600 hover:to-zinc-600 text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Reset all metrics and start fresh"
            >
              🔄 Reset
            </motion.button>

            <motion.button
              onClick={handleToggleTracking}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold shadow-xl backdrop-blur-xl border border-white/20 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white'
                  : 'bg-gradient-to-r from-sky-500/90 to-blue-500/90 text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className="w-4 h-4" />
              {isActive ? 'Stop Tracking' : 'Start Tracking'}
            </motion.button>

            <motion.button
              onClick={logout}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500/90 to-red-600 hover:from-red-600 hover:to-red-700 text-sm font-bold shadow-xl backdrop-blur-xl border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD - RESPONSIVE! */}
      <div className="min-h-screen bg-[#020617] text-slate-50 pt-20">
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.28)_0,_transparent_55%)]" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12">
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/60 px-5 py-2 text-sm text-slate-200 backdrop-blur-xl shadow-lg shadow-black/40 mb-6 mx-auto max-w-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-semibold tracking-wide text-sky-300">Live Dashboard</span>
              <span className="text-slate-400 font-medium">• {user?.email}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tight bg-gradient-to-r from-slate-100 via-sky-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Your Brain Load
              <span className="block text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                Real-time monitoring
              </span>
            </h1>
          </motion.div>

          {/* METRICS - MOBILE STACKED */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* BRAIN LOAD */}
            <motion.div className="group relative bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 sm:p-10 hover:border-sky-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-sky-500/30 overflow-hidden" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 to-purple-500/30 -skew-x-12 -translate-x-20 group-hover:translate-x-0 transition-transform duration-700" />
              <p className="text-xs sm:text-sm text-slate-300 font-mono uppercase tracking-wider mb-3 relative z-10">🧠 Brain Load Score</p>
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black relative z-10 drop-shadow-2xl">
                {Math.round(displayLoad * 100)}<span className="text-2xl sm:text-3xl">%</span>
              </p>
              <p className="text-slate-400 text-xs sm:text-sm font-mono relative z-10 mt-2 tracking-wide uppercase">
                {isActive
                  ? displayLoad > 0.8 ? 'CRITICAL' : displayLoad > 0.6 ? 'HIGH' : 'OPTIMAL'
                  : 'IDLE'}
              </p>
            </motion.div>

            {/* OTHER METRICS */}
            <motion.div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 hover:border-sky-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-xl col-span-1 md:col-span-1 lg:col-span-1" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-xs sm:text-sm text-slate-400 font-mono uppercase tracking-wider mb-3">📝 Task Load</p>
              <p className="text-3xl sm:text-4xl font-black text-sky-400">{Math.round(taskLoad * 100)}%</p>
            </motion.div>

            <motion.div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 hover:border-emerald-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-xl col-span-1 md:col-span-1 lg:col-span-1" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-xs sm:text-sm text-slate-400 font-mono uppercase tracking-wider mb-3">⌨️ Typing</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">{charsPerMinute}cpm</p>
            </motion.div>

            <motion.div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 hover:border-purple-500/70 hover:bg-slate-900/90 backdrop-blur-xl transition-all shadow-xl hover:shadow-xl col-span-1 md:col-span-1 lg:col-span-1" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-xs sm:text-sm text-slate-400 font-mono uppercase tracking-wider mb-3">🔄 Switches</p>
              <p className="text-3xl sm:text-4xl font-black text-purple-400">{switchCount}</p>
            </motion.div>

            <motion.div className={`p-6 rounded-3xl border-4 backdrop-blur-xl shadow-2xl text-center transition-all col-span-1 md:col-span-2 lg:col-span-1 ${
              burnoutAlert.timeLeft === '15min' ? 'bg-red-500/20 border-red-400 shadow-red-500/25' :
              burnoutAlert.timeLeft === '30min' ? 'bg-yellow-500/20 border-yellow-400 shadow-yellow-500/25' :
              'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/25'
            }`} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
              <p className="text-xs sm:text-sm text-slate-300 uppercase tracking-wider mb-3 font-mono">⚠️ Burnout Risk</p>
              <p className="text-2xl sm:text-3xl font-black uppercase tracking-widest drop-shadow-lg">
                {burnoutAlert.timeLeft}
              </p>
            </motion.div>
          </section>

          {/* MAIN CONTENT - FULL RESPONSIVE */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: TASKS + CAMERA */}
            <div className="space-y-8">
              <TaskList onTaskLoadChange={setTaskLoad} />
              
              {/* CAMERA - MOBILE FRIENDLY */}
              <motion.div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 sm:p-8 hover:border-sky-500/70 hover:bg-slate-900/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <Camera className="w-8 h-8 text-sky-400 drop-shadow-lg flex-shrink-0" />
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Tracking</h3>
                </div>
                
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-600 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  <span>{isActive ? 'Tracking active' : 'Tracking stopped'}</span>
                </div>

                {isActive && (  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: isActive ? 1 : 0.4, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                  <div className="relative mb-6 sm:mb-8">
                    {/* <video
                      ref={videoRef}
                      className="w-full max-w-sm sm:max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-sky-500/50 bg-black"
                      autoPlay
                      muted
                      playsInline
                      style={{ transform: 'scaleX(-1)' }}
                    /> */}
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-black/80 px-3 py-1.5 rounded-2xl text-xs font-bold text-emerald-400 border border-emerald-500/50">
                        LIVE FEED
                      </div>
                    )}
                  </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                      <div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 text-center hover:border-blue-500/70 hover:bg-slate-900/90 transition-all">
                        <Eye className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-blue-400 drop-shadow-lg" />
                        <div className="text-2xl sm:text-3xl font-black text-blue-300">{Math.round(eyeData.blinkRate)}/min</div>
                        <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Blinks</div>
                      </div>
                      <div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 text-center hover:border-emerald-500/70 hover:bg-slate-900/90 transition-all">
                        <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-emerald-400 drop-shadow-lg" />
                        <div className="text-2xl sm:text-3xl font-black text-emerald-300">{Math.round(eyeData.fixations)}</div>
                        <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Fixations</div>
                      </div>
                      <div className="bg-slate-900/70 border border-slate-700/60 rounded-3xl p-6 text-center hover:border-purple-500/70 hover:bg-slate-900/90 transition-all">
                        <Eye className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-purple-400 drop-shadow-lg" />
                        <div className="text-2xl sm:text-3xl font-black text-purple-300">{Math.round(eyeData.dilation * 100)}%</div>
                        <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Pupil Dilation</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* RIGHT: FOCUS + WORKING BUTTONS */}
            <div className="space-y-8 lg:sticky lg:top-32 lg:self-start">
              {/* FOCUS STATUS */}
              <motion.div className={`p-6 sm:p-10 rounded-3xl border-2 backdrop-blur-xl shadow-2xl transition-all ${
                isFocused ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/25' : 'bg-red-500/20 border-red-400 shadow-red-500/25'
              }`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
                  <Activity className={`w-8 h-8 sm:w-10 sm:h-10 ${isFocused ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg flex-shrink-0`} />
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Focus Status</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-4xl sm:text-5xl font-black mb-6 sm:mb-8">
                  <span className={`${isDistracted ? 'text-red-400' : 'text-emerald-400'} drop-shadow-2xl text-3xl sm:text-5xl`}>
                    {isDistracted ? '🔴' : '🟢'}
                  </span>
                  <span className="text-2xl sm:text-4xl">
                    {isDistracted ? 'DISTRACTED' : 'FOCUSED'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-base sm:text-lg mb-4 font-mono uppercase tracking-wider">Context Switches</p>
                  <p className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{switchCount}</p>
                </div>
              </motion.div>

              {/* ✅ WORKING BUTTONS */}
              <motion.div className="bg-slate-900/70 border border-slate-700/60 p-6 sm:p-10 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <h3 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 text-slate-100 tracking-tight">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 drop-shadow-lg" />
                  Quick Actions
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <motion.button 
                    onClick={saveReport}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-xl border border-purple-400/50 text-base sm:text-lg transition-all group" 
                    whileHover={{ scale: 1.02 }}
                  >
                    💾 Save Session Report
                  </motion.button>
                  <motion.button 
                    onClick={viewAnalytics}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-xl border border-emerald-400/50 text-base sm:text-lg transition-all group" 
                    whileHover={{ scale: 1.02 }}
                  >
                    📊 View Analytics
                  </motion.button>
                  <motion.button 
                    onClick={setReminder}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl border border-orange-400/50 text-base sm:text-lg transition-all group" 
                    whileHover={{ scale: 1.02 }}
                  >
                    🔔 Set Break Reminder
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
