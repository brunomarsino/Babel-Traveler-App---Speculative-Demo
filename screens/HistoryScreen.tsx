import React, { useState, useMemo } from 'react';
import { Clock, ShieldCheck, TrendingUp, ArrowUpRight, ChevronLeft } from 'lucide-react';

interface HistoryScreenProps {
  onBack: () => void;
}

const HISTORY_DATA = [
  { id: 1, date: 'Today', timestamp: 1729845720000, time: '08:42 AM', origin: 'Home (NYC-7)', dest: 'Office (SoHo)', status: 'COMPLETED', distance: 4.2, waitTime: 45 },
  { id: 2, date: 'Yesterday', timestamp: 1729758900000, time: '18:15 PM', origin: 'Office (SoHo)', dest: 'Home (NYC-7)', status: 'COMPLETED', distance: 4.2, waitTime: 30 },
  { id: 3, date: 'Oct 24', timestamp: 1729773000000, time: '12:30 PM', origin: 'NYC-7', dest: 'LDN-2', status: 'COMPLETED', distance: 5585, waitTime: 120 },
  { id: 4, date: 'Oct 22', timestamp: 1729587600000, time: '09:00 AM', origin: 'Home (NYC-7)', dest: 'Gym (Tribeca)', status: 'COMPLETED', distance: 1.8, waitTime: 15 },
  { id: 5, date: 'Oct 20', timestamp: 1729414800000, time: '08:00 PM', origin: 'Gym (Tribeca)', dest: 'Home (NYC-7)', status: 'COMPLETED', distance: 1.8, waitTime: 20 },
];

const SECURITY_LOGS = [
    { id: 1, time: '08:40 AM', event: 'Biometric Scan', status: 'PASSED' },
    { id: 2, time: '08:41 AM', event: 'Contaminant Check', status: 'CLEARED' },
    { id: 3, time: 'Oct 24', event: 'Intl. Visa Token', status: 'VERIFIED' },
];

const DISTANCE_BARS = [
    { label: 'M', value: 35 },
    { label: 'T', value: 65 },
    { label: 'W', value: 45 },
    { label: 'T', value: 80 },
    { label: 'F', value: 60 },
    { label: 'S', value: 45 },
    { label: 'S', value: 70 }
]; 

const WAIT_TIME_VALUE = 42; 
const WAIT_TIME_MAX = 120; 

type SortOption = 'DATE' | 'DISTANCE' | 'WAIT';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const [sortBy, setSortBy] = useState<SortOption>('DATE');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [showGaugeTooltip, setShowGaugeTooltip] = useState(false);

  const sortedHistory = useMemo(() => {
    return [...HISTORY_DATA].sort((a, b) => {
        switch (sortBy) {
            case 'DISTANCE':
                return b.distance - a.distance;
            case 'WAIT':
                return b.waitTime - a.waitTime;
            case 'DATE':
            default:
                return b.timestamp - a.timestamp;
        }
    });
  }, [sortBy]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (WAIT_TIME_VALUE / WAIT_TIME_MAX) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-24 bg-[#fafaf9] animate-enter">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-900 mb-4 transition-colors">
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">System</span>
        </button>
        <div className="flex justify-between items-end">
             <div>
                <h2 className="text-3xl font-serif text-stone-900">History</h2>
                <p className="text-stone-500 text-sm mt-1">Travel logs & insights</p>
            </div>
        </div>
      </div>

      {/* Visual Insights Section */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        
        {/* Interactive Distance Bar Chart */}
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between h-44 hover:shadow-md transition-shadow duration-300 relative">
            <div className="flex justify-between items-start">
                 <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Total Dist</span>
                    <span className="font-serif text-xl text-stone-900 leading-none">12.4k</span>
                    <span className="text-[10px] text-stone-400 ml-0.5">km</span>
                 </div>
                 <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <TrendingUp size={14} className="text-emerald-600" />
                 </div>
            </div>
            
            <div className="flex items-end justify-between gap-1.5 h-20 mt-2 relative">
                {selectedBar !== null && (
                    <div className="absolute -top-8 left-0 right-0 text-center animate-enter">
                        <span className="bg-stone-900 text-stone-50 text-[10px] py-1 px-2 rounded-md shadow-lg">
                            {DISTANCE_BARS[selectedBar].value * 12} km
                        </span>
                    </div>
                )}
                {DISTANCE_BARS.map((bar, i) => (
                    <button 
                        key={i} 
                        onClick={() => setSelectedBar(i === selectedBar ? null : i)}
                        className="w-full h-full flex items-end overflow-hidden group focus:outline-none"
                    >
                         <div 
                            style={{ height: `${bar.value}%` }} 
                            className={`w-full rounded-t-sm transition-all duration-500 ease-out ${
                                selectedBar === i ? 'bg-emerald-600 scale-y-105' : 'bg-stone-300 hover:bg-stone-400'
                            }`}
                         />
                    </button>
                ))}
            </div>
            <div className="flex justify-between text-[8px] text-stone-400 uppercase tracking-widest mt-1 px-1">
                {DISTANCE_BARS.map((bar, i) => (
                    <span key={i}>{bar.label}</span>
                ))}
            </div>
        </div>

        {/* Interactive Avg Wait Gauge */}
        <button 
            onClick={() => setShowGaugeTooltip(!showGaugeTooltip)}
            className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between h-44 relative overflow-hidden hover:shadow-md transition-shadow duration-300 text-left focus:outline-none"
        >
            <div className="flex justify-between items-start relative z-10 w-full">
                 <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Avg Wait</span>
                    <span className="font-serif text-xl text-stone-900 leading-none">{WAIT_TIME_VALUE}s</span>
                 </div>
                 <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Clock size={14} className="text-blue-600" />
                 </div>
            </div>

            <div className="relative flex items-center justify-center mt-2 z-10 w-full">
                 <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-stone-100"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-emerald-500 transition-all duration-1000 ease-out delay-500"
                    />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    {showGaugeTooltip ? (
                        <span className="text-[10px] font-bold bg-stone-900 text-stone-50 px-2 py-0.5 rounded animate-enter">
                            -8s vs Avg
                        </span>
                    ) : (
                         <span className="text-xs font-bold text-emerald-600 animate-[fadeInUp_0.5s_ease-out_0.5s_forwards] opacity-0">Good</span>
                    )}
                 </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-50 rounded-full blur-xl z-0" />
        </button>
      </div>

      {/* Security Status */}
      <div className="bg-stone-900 text-stone-50 rounded-2xl p-4 mb-8 shadow-md relative overflow-hidden group">
        <div className="flex items-center justify-between relative z-10 mb-3">
            <h3 className="font-serif text-base">Security Status</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-stone-800 px-2 py-1 rounded-full">
                <ShieldCheck size={12} />
                <span>Cleared</span>
            </div>
        </div>
        <div className="space-y-1.5 relative z-10">
             {SECURITY_LOGS.slice(0, 2).map(log => (
                 <div key={log.id} className="flex justify-between items-center text-[10px] border-b border-stone-800 pb-1 last:border-0">
                     <span className="text-stone-400">{log.event}</span>
                     <span className="text-stone-300 font-mono">{log.time}</span>
                 </div>
             ))}
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-900/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400">Recent Jumps</h3>
        <div className="flex gap-2">
            {[
                { id: 'DATE', label: 'Recent' },
                { id: 'DISTANCE', label: 'Dist' },
                { id: 'WAIT', label: 'Wait' }
            ].map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id as SortOption)}
                    className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors border ${
                        sortBy === opt.id 
                        ? 'bg-stone-800 text-stone-50 border-stone-800' 
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
      </div>

      {/* Travel Log List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {sortedHistory.map((trip, index) => (
            <div 
                key={trip.id} 
                className="flex gap-4 group animate-enter opacity-0 fill-mode-forwards"
                style={{ animationDelay: `${index * 75}ms` }}
            >
                <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-emerald-500 transition-colors" />
                    <div className="w-[1px] h-full bg-stone-200 my-1 group-last:hidden" />
                </div>
                <div className="flex-1 pb-2">
                    <p className="text-xs font-bold text-stone-400 uppercase mb-1">{trip.date} • {trip.time}</p>
                    <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm transition-transform active:scale-[0.99] hover:border-emerald-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-serif text-stone-900 text-sm truncate max-w-[100px]">{trip.origin}</span>
                            <ArrowUpRight size={14} className="text-stone-300" />
                            <span className="font-serif text-stone-900 text-sm truncate max-w-[100px]">{trip.dest}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-stone-500 border-t border-stone-50 pt-2 mt-2">
                            <div className="flex items-center gap-1">
                                <TrendingUp size={10} />
                                <span>{trip.distance >= 1000 ? (trip.distance/1000).toFixed(1) + 'k' : trip.distance} km</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={10} />
                                <span>{trip.waitTime}m wait</span>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] tracking-wider uppercase font-medium">{trip.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;