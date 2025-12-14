import React from 'react';
import { Zap, History, Shield, ChevronRight, Settings, User, AlertTriangle, FileText, Globe } from 'lucide-react';
import { Screen, RiskMode, Identity } from '../types';

interface SystemScreenProps {
  onNavigate: (screen: Screen) => void;
  riskMode: RiskMode;
  setRiskMode: (mode: RiskMode) => void;
  currentIdentity: Identity;
  identities: Identity[];
  setIdentity: (id: Identity) => void;
}

const SystemScreen: React.FC<SystemScreenProps> = ({ 
    onNavigate, 
    riskMode, 
    setRiskMode, 
    currentIdentity, 
    identities, 
    setIdentity 
}) => {
  return (
    <div className="flex flex-col h-full bg-[#fafaf9] animate-enter">
      <div className="px-6 pt-12 pb-6">
        <h2 className="text-3xl font-serif text-stone-900">System</h2>
        <p className="text-stone-500 text-sm mt-1">Control Center</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-24">
        
        {/* Risk Mode Config (V2 New) */}
        <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Risk Profile</h3>
            <div className="bg-white p-2 rounded-2xl border border-stone-100 shadow-sm flex relative z-0">
                <button 
                    onClick={() => setRiskMode(RiskMode.STRICT)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        riskMode === RiskMode.STRICT 
                        ? 'bg-stone-900 text-stone-50 shadow-lg scale-105 z-10' 
                        : 'text-stone-400 hover:bg-stone-50 scale-100'
                    }`}
                >
                    Strict
                </button>
                <button 
                    onClick={() => setRiskMode(RiskMode.STANDARD)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        riskMode === RiskMode.STANDARD 
                        ? 'bg-stone-900 text-stone-50 shadow-lg scale-105 z-10' 
                        : 'text-stone-400 hover:bg-stone-50 scale-100'
                    }`}
                >
                    Standard
                </button>
                <button 
                    onClick={() => setRiskMode(RiskMode.OPEN)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        riskMode === RiskMode.OPEN 
                        ? 'bg-red-50 text-red-600 shadow-lg scale-105 z-10 border border-red-100' 
                        : 'text-stone-400 hover:bg-stone-50 scale-100'
                    }`}
                >
                    Open
                </button>
            </div>
            {riskMode === RiskMode.STRICT && (
                <p className="text-[10px] text-stone-500 mt-2 ml-1 animate-enter">
                    Strict Mode: Routes restricted to verified hubs. High-risk transfers blocked. Extra confirmation required.
                </p>
            )}
            {riskMode === RiskMode.OPEN && (
                <p className="text-[10px] text-red-500 mt-2 ml-1 animate-enter flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Warning: Open Mode bypasses standard safety filters. Proceed with caution.
                </p>
            )}
        </div>

        {/* Identity Management (V2 New) */}
        <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Active Identity</h3>
            <div className="space-y-4">
                {identities.map(id => {
                    const isCorporate = id.type === 'CORPORATE';
                    const isActive = currentIdentity.id === id.id;
                    
                    // Base transition classes
                    const baseClasses = "w-full flex items-center gap-4 p-4 rounded-2xl border text-left overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]";
                    
                    let styleClasses = "";
                    if (isActive) {
                        // Active State: Pop out, full color, shadow
                        if (isCorporate) {
                            styleClasses = "holo-card text-stone-50 border-stone-700 scale-105 shadow-2xl z-10 ring-4 ring-emerald-500/10";
                        } else {
                            styleClasses = "bg-stone-900 border-stone-900 text-stone-50 scale-105 shadow-2xl z-10 ring-4 ring-stone-900/10";
                        }
                    } else {
                        // Inactive State: Recede, fade, grayscale
                        styleClasses = "bg-white border-stone-100 hover:border-stone-300 text-stone-900 scale-95 opacity-60 hover:opacity-90 grayscale-[0.5] hover:grayscale-0 z-0";
                    }

                    return (
                        <button 
                            key={id.id}
                            onClick={() => setIdentity(id)}
                            className={`${baseClasses} ${styleClasses}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${
                                isActive ? 'bg-stone-700/50 text-emerald-400 backdrop-blur-sm' : 'bg-stone-100 text-stone-400'
                            }`}>
                                {isCorporate ? <BriefcaseIcon /> : <User size={20} />}
                            </div>
                            <div className="flex-1 relative z-10">
                                <p className="font-serif text-lg">
                                    {id.name}
                                </p>
                                <p className={`text-xs transition-colors duration-300 ${isActive ? 'text-stone-400' : 'text-stone-500'}`}>
                                    {id.jurisdiction} • Lvl {id.clearanceLevel}
                                </p>
                            </div>
                            {isActive && (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10 animate-[pulse_2s_ease-in-out_infinite]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Logs & Evidence */}
        <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Logs & Evidence</h3>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <button 
                    onClick={() => onNavigate(Screen.HISTORY)}
                    className="w-full flex items-center justify-between p-4 hover:bg-stone-50 border-b border-stone-50"
                >
                    <div className="flex items-center gap-3 text-stone-600">
                        <History size={18} />
                        <span className="text-sm font-medium">Activity Log</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 border-b border-stone-50">
                    <div className="flex items-center gap-3 text-stone-600">
                        <FileText size={18} />
                        <span className="text-sm font-medium">Export for Legal/Insurance</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50">
                    <div className="flex items-center gap-3 text-stone-600">
                        <Globe size={18} />
                        <span className="text-sm font-medium">Data Sharing Permissions</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                </button>
            </div>
        </div>

        {/* Automations */}
        <button 
            onClick={() => onNavigate(Screen.AUTOMATIONS)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm active:scale-[0.99] transition-transform"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Zap size={20} />
                </div>
                <div className="text-left">
                    <p className="font-serif text-base text-stone-900">Automations</p>
                    <p className="text-xs text-stone-500">Manage protocols</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-stone-300" />
        </button>

      </div>
    </div>
  );
};

const BriefcaseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default SystemScreen;