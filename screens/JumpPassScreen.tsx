import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import { ArrowRight, Wifi, Fingerprint, Lock, ShieldCheck, X } from 'lucide-react';
import { JumpPass, JourneyPhase } from '../types';

interface JumpPassScreenProps {
  activeJumpPass: JumpPass | null;
  onBack: () => void;
  journeyPhase: JourneyPhase;
}

const JumpPassScreen: React.FC<JumpPassScreenProps> = ({ activeJumpPass, onBack, journeyPhase }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!activeJumpPass) {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-stone-900 text-stone-50 p-6 animate-enter relative">
            <button onClick={onBack} className="absolute top-12 right-6 p-2 bg-stone-800 rounded-full">
                <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mb-6">
                <Lock size={24} className="text-stone-500" />
            </div>
            <h2 className="text-2xl font-serif mb-2">No Active Sequence</h2>
            <p className="text-stone-400 text-center text-sm">Return to Portals to plan a route.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-24 bg-stone-900 text-stone-50 overflow-y-auto animate-enter">
      <header className="mb-6 flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-serif text-stone-50">Boarding Pass</h2>
            <p className="text-stone-400 text-sm mt-1 font-mono">SEQ: {activeJumpPass.id}</p>
        </div>
        <button onClick={onBack} className="p-2 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors">
            <X size={20} />
        </button>
      </header>

      {/* The Ticket Card */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6">
        <div className="w-full bg-stone-50 text-stone-900 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            {/* Status */}
            <div className="flex justify-between items-center mb-8 mt-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${journeyPhase === JourneyPhase.STATION_MODE ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-500">
                        {journeyPhase === JourneyPhase.STATION_MODE ? 'Ready for Jump' : 'Scheduled'}
                    </span>
                </div>
                <span className="font-mono text-xs text-stone-400">
                    {activeJumpPass.identityUsed.type} ID
                </span>
            </div>

            {/* Route */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wide">Origin</span>
                    <p className="font-serif text-lg font-bold truncate max-w-[80px]">{activeJumpPass.route.originStation.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-stone-500">Sector 4</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                    <div className="w-full h-[1px] bg-stone-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-50 p-1">
                            <ArrowRight size={14} className="text-stone-400" />
                        </div>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-2">{activeJumpPass.route.transitTimeMin}m Jump</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-stone-400 uppercase tracking-wide">Dest</span>
                    <p className="font-serif text-lg font-bold truncate max-w-[80px]">{activeJumpPass.route.destStation.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-stone-500">Global</p>
                </div>
            </div>

            {/* QR Area */}
            <div className="relative h-64 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 border border-stone-200 overflow-hidden select-none">
                <div className={`transition-all duration-300 ease-out ${isRevealed ? 'blur-0 opacity-100 scale-100' : 'blur-xl opacity-20 scale-95'}`}>
                     <QRCodeSVG value={activeJumpPass.qrCode} size={180} />
                </div>

                <div 
                    className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-300 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    onMouseDown={() => setIsRevealed(true)}
                    onMouseUp={() => setIsRevealed(false)}
                    onMouseLeave={() => setIsRevealed(false)}
                    onTouchStart={() => setIsRevealed(true)}
                    onTouchEnd={() => setIsRevealed(false)}
                >
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-400 flex items-center justify-center mb-3 animate-[spin_10s_linear_infinite]">
                         <Fingerprint size={32} className="text-stone-400 animate-none" style={{ animationDirection: 'reverse' }} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Hold to Reveal</p>
                </div>

                <div className={`absolute top-4 right-4 transition-all duration-300 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <ShieldCheck size={24} className="text-emerald-500" />
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-800 text-stone-400">
            <span className="text-xs uppercase mb-1">Gate</span>
            <span className="text-xl font-serif text-stone-200">{activeJumpPass.gate}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-800 text-stone-400">
            <span className="text-xs uppercase mb-1">Time</span>
            <span className="text-xl font-serif text-stone-200">
                {new Date(activeJumpPass.boardingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>
    </div>
  );
};

export default JumpPassScreen;