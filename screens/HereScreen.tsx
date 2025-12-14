import React, { useEffect, useState } from 'react';
import { ShieldCheck, Wind, ArrowRight, Ticket, Zap, History, Clock, Navigation, MapPin, AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { Screen, JumpPass, JourneyPhase, RiskMode } from '../types';
import SlideButton from '../components/SlideButton';

interface HereScreenProps {
  onNavigate: (screen: Screen) => void;
  activeJumpPass: JumpPass | null;
  journeyPhase: JourneyPhase;
  onAdvanceJourney: () => void;
  riskMode: RiskMode;
}

const HereScreen: React.FC<HereScreenProps> = ({ 
  onNavigate, 
  activeJumpPass, 
  journeyPhase, 
  onAdvanceJourney,
  riskMode 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!activeJumpPass) return;
    const timer = setInterval(() => {
      const now = new Date();
      const departureTime = new Date(activeJumpPass.boardingTime).getTime();
      const diff = departureTime - now.getTime();
      
      if (diff > 0) {
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${m}m`);
      } else {
        setTimeLeft('NOW');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeJumpPass]);

  // --- RENDER: IN TRANSIT MODE (The Jump) ---
  if (journeyPhase === JourneyPhase.IN_TRANSIT && activeJumpPass) {
    return (
      <div className="flex flex-col h-full bg-black text-emerald-500 items-center justify-center relative overflow-hidden animate-enter">
         {/* Immersive Background */}
         <div className="absolute inset-0 bg-grid opacity-10"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent animate-scanline pointer-events-none"></div>
         
         {/* Central Portal Effect */}
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-64 h-64 rounded-full border border-emerald-500/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="w-48 h-48 rounded-full bg-emerald-500/5 backdrop-blur-md flex items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-emerald-400" />
                </div>
            </div>
            
            <h2 className="text-2xl font-serif text-white mt-8 tracking-widest uppercase glitch-text">Transit Active</h2>
            <p className="text-emerald-500/60 font-mono text-sm mt-2">{activeJumpPass.route.originStation.name} → {activeJumpPass.route.destStation.name}</p>
         </div>

         {/* System Logs */}
         <div className="absolute bottom-12 left-0 right-0 px-8 text-center space-y-1">
             <p className="text-[10px] font-mono text-emerald-800 uppercase animate-pulse">Synchronizing Matter Stream...</p>
             <p className="text-[10px] font-mono text-emerald-700 uppercase">Verifying Integrity 99.9%</p>
         </div>
      </div>
    );
  }

  // --- RENDER: STATION MODE (The "In-Station" Experience) ---
  if (journeyPhase === JourneyPhase.STATION_MODE && activeJumpPass) {
    return (
      <div className="flex flex-col h-full bg-stone-900 text-stone-50 animate-enter relative overflow-hidden">
        {/* Ambient Pulse Beacon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse-ring pointer-events-none" />
        
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 animate-pulse" />
        
        <header className="px-6 pt-12 pb-6 flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <MapPin size={14} className="text-emerald-400" />
               <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Station Mode Active</span>
            </div>
            <h1 className="text-3xl font-serif">{activeJumpPass.route.originStation.name}</h1>
          </div>
        </header>

        <div className="px-6 flex-1 flex flex-col items-center relative z-10">
            {/* Gate Card */}
            <div className="w-full bg-stone-800 rounded-3xl p-8 border border-stone-700 shadow-2xl mb-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-stone-600">
                    <ShieldCheck size={48} opacity={0.2} />
                </div>
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Gate</p>
                        <p className="text-6xl font-serif text-white">{activeJumpPass.gate}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Boarding</p>
                        <p className="text-2xl font-mono text-emerald-400">{timeLeft}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-stone-900/50 p-4 rounded-xl border border-stone-700/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <UserCheckIcon />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-stone-200">Biometric Clearance</p>
                        <p className="text-xs text-stone-500">Identity Verified • No Contaminants</p>
                    </div>
                </div>
            </div>

            <div className="w-full mb-4">
                <SlideButton 
                    onConfirm={onAdvanceJourney} 
                    label={`Proceed to Gate ${activeJumpPass.gate}`} 
                    colorClass="bg-emerald-500" 
                />
            </div>
            
            <button className="text-stone-400 text-sm flex items-center gap-2 hover:text-stone-300">
                <AlertTriangle size={14} />
                Report Safety Issue
            </button>
        </div>
      </div>
    );
  }

  // --- RENDER: ARRIVAL MODE (Post-Jump Decompression) ---
  if (journeyPhase === JourneyPhase.ARRIVAL_MODE && activeJumpPass) {
    return (
      <div className="flex flex-col h-full bg-[#fafaf9] text-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50/50 pointer-events-none opacity-0 animate-fade-in" style={{ animationDuration: '2s' }} />
        
        <header className="px-6 pt-12 pb-6 relative z-10 opacity-0 animate-enter" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Arrival Complete</span>
          </div>
          <h1 className="text-4xl font-serif text-stone-900 mb-2">Welcome to {activeJumpPass.route.destStation.name.split(' ')[0]}</h1>
          <p className="text-stone-500">Local time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </header>

        <div className="px-6 space-y-4 relative z-10">
            {/* Context Card - Dissolve in */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex gap-8 mb-6">
                    <div>
                        <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Weather</p>
                        <p className="text-lg font-medium">18°C Rain</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Time Diff</p>
                        <p className="text-lg font-medium text-stone-400">+3h</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-stone-400 font-bold mb-1">Atmosphere</p>
                        <p className="text-lg font-medium text-emerald-600">Optimal</p>
                    </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Local Advisory:</strong> Heavy rain in sector 4. Pedestrian tunnels recommended for station exit.
                    </p>
                </div>
            </div>

            <div className="opacity-0 animate-enter" style={{ animationDelay: '500ms' }}>
                <button 
                    onClick={onAdvanceJourney}
                    className="w-full bg-stone-900 text-stone-50 py-4 rounded-2xl font-medium shadow-md active:scale-[0.98] animate-pulse-slow"
                >
                    Complete Journey
                </button>
            </div>
            
            <div className="opacity-0 animate-enter" style={{ animationDelay: '600ms' }}>
                <button className="w-full bg-white text-stone-900 border border-stone-200 py-4 rounded-2xl font-medium shadow-sm active:scale-[0.98]">
                    Request Local Transit
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: STANDARD / PRE-STATION ---
  return (
    <div className="flex flex-col h-full bg-[#fafaf9] text-stone-900 overflow-y-auto pb-24 animate-enter">
      {/* Ticker Tape */}
      <div className="bg-stone-900 text-emerald-500 overflow-hidden py-1 border-b border-emerald-900">
         <div className="whitespace-nowrap animate-marquee text-[10px] font-mono tracking-widest flex gap-8">
            <span>SYS: ONLINE</span>
            <span>GRID: STABLE</span>
            <span>ATMOS: CLEAR</span>
            <span>GLOBAL SYNC: 99.8%</span>
            <span>WARNING: SECTOR 4 MAINTENANCE</span>
            <span>SYS: ONLINE</span>
            <span>GRID: STABLE</span>
         </div>
      </div>

      {/* Header */}
      <header className="px-6 pt-8 pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Here</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full ${journeyPhase === JourneyPhase.PRE_STATION ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
             <span className="text-xs font-medium text-stone-500">
                {journeyPhase === JourneyPhase.PRE_STATION ? 'En Route to Station' : 'System Online'}
             </span>
          </div>
        </div>
        {/* Risk Mode Indicator */}
        <div className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
            riskMode === RiskMode.STRICT ? 'bg-stone-900 text-stone-50 border-stone-900' : 
            riskMode === RiskMode.OPEN ? 'bg-red-50 text-red-600 border-red-100' : 
            'bg-white text-stone-400 border-stone-200'
        }`}>
            {riskMode} Mode
        </div>
      </header>

      <div className="px-6 space-y-6">
        
        {/* PRE-STATION CARD (Navigation Phase) */}
        {journeyPhase === JourneyPhase.PRE_STATION && activeJumpPass && (
             <div className="w-full bg-white border-2 border-emerald-500/20 p-5 rounded-3xl shadow-lg flex flex-col gap-4 animate-enter">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">
                        Departure Window
                    </span>
                    <span className="text-xl font-mono font-medium text-stone-900">{timeLeft}</span>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                        <div className="w-2 h-2 rounded-full bg-stone-300" />
                        <div className="w-0.5 h-8 bg-stone-200 my-1" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <div className="mb-4">
                            <p className="text-xs text-stone-400">Navigate to</p>
                            <p className="font-serif text-lg">{activeJumpPass.route.originStation.name}</p>
                            <p className="text-xs text-stone-500">1.2km • 12 min walk</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 bg-stone-100 text-stone-900 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <Navigation size={14} /> Open Maps
                    </button>
                    <button 
                        onClick={onAdvanceJourney} 
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium shadow-md"
                    >
                        I'm at Station
                    </button>
                </div>
            </div>
        )}

        {/* IDLE STATE Primary CTA */}
        {journeyPhase === JourneyPhase.IDLE && (
            <button 
                onClick={() => onNavigate(Screen.PORTALS)}
                className="w-full bg-white border border-stone-200 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98] group"
            >
                <div className="w-16 h-16 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ArrowRight size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-serif text-stone-900">Where to?</h2>
                    <p className="text-stone-500 text-sm mt-1">Plan your next sequence</p>
                </div>
            </button>
        )}

        {/* System Context */}
        <div className="flex gap-3">
             <div className="flex-1 bg-stone-100/50 p-3 rounded-2xl flex items-center gap-3 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-white text-stone-600 flex items-center justify-center shadow-sm">
                    <Zap size={14} />
                </div>
                <div>
                    <p className="text-[10px] uppercase text-stone-400 font-bold">Grid</p>
                    <p className="text-xs font-semibold text-stone-900">Stable</p>
                </div>
             </div>
             <div className="flex-1 bg-stone-100/50 p-3 rounded-2xl flex items-center gap-3 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm">
                    <Wind size={14} />
                </div>
                <div>
                    <p className="text-[10px] uppercase text-stone-400 font-bold">Atmos</p>
                    <p className="text-xs font-semibold text-stone-900">Clear</p>
                </div>
             </div>
             <div className="flex-1 bg-stone-100/50 p-3 rounded-2xl flex items-center gap-3 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-sm">
                    <ShieldCheck size={14} />
                </div>
                <div>
                    <p className="text-[10px] uppercase text-stone-400 font-bold">Lvl</p>
                    <p className="text-xs font-semibold text-stone-900">4</p>
                </div>
             </div>
        </div>
        
        {/* Emergency Action */}
        <button className="w-full border border-red-100 bg-red-50/50 p-3 rounded-xl flex items-center justify-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wide hover:bg-red-50 transition-colors">
            <Lock size={12} />
            Emergency Freeze Account
        </button>

        {/* Quick Access */}
        <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 pl-1">Quick Access</h3>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <History size={18} />
                    </div>
                    <div>
                        <p className="font-serif text-sm font-medium">Last Journey</p>
                        <p className="text-xs text-stone-500">NYC-7 <span className="text-stone-300">→</span> SoHo</p>
                    </div>
                </div>
                <button onClick={() => onNavigate(Screen.HISTORY)} className="text-xs font-bold text-stone-900 px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-stone-200">
                    View Log
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const UserCheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
);

export default HereScreen;