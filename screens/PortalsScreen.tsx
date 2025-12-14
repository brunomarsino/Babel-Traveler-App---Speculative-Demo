import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, List, Navigation2, Clock, ShieldAlert, BadgeCheck, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
import { Portal, Screen, Route, Identity, RiskMode } from '../types';
import SlideButton from '../components/SlideButton';

interface PortalsScreenProps {
  onNavigate: (screen: Screen) => void;
  onBook: (route: Route) => void;
  activeIdentity: Identity;
  riskMode: RiskMode;
}

const MOCK_DESTINATIONS = [
  { id: 'd1', name: 'Tokyo Central', region: 'Global-East', risk: 'LOW', visaReq: true },
  { id: 'd2', name: 'SoHo Private Hub', region: 'Local', risk: 'LOW', visaReq: false },
  { id: 'd3', name: 'Alpine Research Station', region: 'Restricted', risk: 'MEDIUM', visaReq: true },
];

const PortalsScreen: React.FC<PortalsScreenProps> = ({ onNavigate, onBook, activeIdentity, riskMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);

  // Calculation Simulation Effect
  useEffect(() => {
    if (selectedDest && isCalculating) {
        const steps = ['Verifying Identity...', 'Checking Gate Capacity...', 'Optimizing Path...', 'Complete'];
        setCalculationStep(0);
        
        const interval = setInterval(() => {
            setCalculationStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setIsCalculating(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 600); // Change text every 600ms

        return () => clearInterval(interval);
    }
  }, [selectedDest, isCalculating]);

  const handleSelectDest = (dest: any) => {
    setSelectedDest(dest);
    setIsCalculating(true);
  };

  // V2: Route Calculation Logic (Mock)
  const calculateRoutes = (dest: any): Route[] => {
    // Check compliance
    const isCompliant = !dest.visaReq || activeIdentity.type === 'CORPORATE' || activeIdentity.jurisdiction === dest.region;
    
    return [{
        id: `R-${dest.id}-1`,
        originStation: {
            id: 'nyc-7', name: 'NYC-7 Sector', type: 'PUBLIC', status: 'ONLINE',
            waitTimeMin: 5, distanceKm: 1.2, image: '', coordinates: '', riskLevel: 'LOW'
        },
        destStation: {
            id: dest.id, name: dest.name, type: 'PUBLIC', status: 'ONLINE',
            waitTimeMin: 10, distanceKm: 0, image: '', coordinates: '', riskLevel: dest.risk
        },
        transitTimeMin: 2,
        totalDurationMin: 45, // Including pre/post travel
        complianceCheck: isCompliant ? 'CLEARED' : 'VISA_REQ'
    }];
  };

  const isCorporateIdentity = activeIdentity.type === 'CORPORATE';
  const calculationSteps = ['Verifying Identity...', 'Checking Gate Capacity...', 'Optimizing Path...', 'Complete'];

  return (
    <div className="flex flex-col h-full bg-[#fafaf9] animate-enter">
      {/* Top Bar */}
      <div className="px-6 pt-12 pb-4 bg-[#fafaf9] sticky top-0 z-20 border-b border-stone-200/50">
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Portals</h2>
        
        {/* Active Identity Indicator */}
        <div className={`flex items-center gap-2 mb-4 p-2 rounded-xl border ${isCorporateIdentity ? 'holo-card text-stone-50 border-stone-700' : 'bg-stone-100 text-stone-900 border-transparent'}`}>
            <div className={`p-1.5 rounded-lg ${isCorporateIdentity ? 'bg-stone-700/50 text-emerald-300' : 'bg-stone-200 text-stone-600'}`}>
                <Briefcase size={14} />
            </div>
            <div className="flex-1 relative z-10">
                <p className={`text-[10px] uppercase font-bold ${isCorporateIdentity ? 'text-stone-300' : 'text-stone-400'}`}>Planning as</p>
                <p className="text-xs font-semibold">{activeIdentity.name}</p>
            </div>
            <button className={`text-xs font-bold uppercase px-2 z-10 ${isCorporateIdentity ? 'text-stone-300' : 'text-stone-400'}`}>Change</button>
        </div>

        <div className="relative">
            <Search className="absolute left-4 top-3 text-stone-400" size={18} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter destination..."
                className="w-full bg-white border border-stone-200 rounded-2xl py-3 pl-12 pr-4 text-stone-800 focus:outline-none focus:border-stone-400 shadow-sm"
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-4">
        {/* Search Results / Suggestions */}
        {!selectedDest ? (
            <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400">Suggestions</h3>
                {MOCK_DESTINATIONS.map(dest => (
                    <button 
                        key={dest.id} 
                        onClick={() => handleSelectDest(dest)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-emerald-200 transition-all text-left"
                    >
                        <div>
                            <p className="font-serif text-lg text-stone-900">{dest.name}</p>
                            <p className="text-xs text-stone-500">{dest.region} • {dest.risk} Risk</p>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-full text-stone-400">
                            <Navigation2 size={18} />
                        </div>
                    </button>
                ))}
            </div>
        ) : (
            <div className="space-y-4 animate-enter">
                <button 
                    onClick={() => setSelectedDest(null)} 
                    className="text-xs font-bold text-stone-400 hover:text-stone-900 mb-2"
                >
                    ← Back to Search
                </button>
                
                <h3 className="text-xl font-serif text-stone-900">Routes to {selectedDest.name}</h3>

                {isCalculating ? (
                    <div className="bg-stone-900 rounded-2xl p-8 flex flex-col items-center justify-center text-stone-50 min-h-[200px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <Loader2 size={32} className="animate-spin text-emerald-500 mb-4" />
                            <p className="text-lg font-serif animate-pulse">{calculationSteps[calculationStep]}</p>
                            <div className="w-48 h-1 bg-stone-800 rounded-full mt-4 overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${(calculationStep + 1) * 25}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {calculateRoutes(selectedDest).map(route => (
                            <div key={route.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden animate-enter">
                                {/* Route Timeline */}
                                <div className="p-4 border-b border-stone-100">
                                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                                        <span className="font-bold text-stone-900">Total: {route.totalDurationMin} min</span>
                                        <span>•</span>
                                        <span>Fastest Option</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-stone-300" />
                                            <div className="w-0.5 h-6 bg-stone-200" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <div className="w-0.5 h-6 bg-emerald-200" />
                                            <div className="w-2 h-2 rounded-full bg-stone-900" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-xs text-stone-400">Pre-Station</p>
                                                <p className="text-sm font-medium">Uber to {route.originStation.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-stone-400">In-Station</p>
                                                <p className="text-sm font-medium">Jump to {route.destStation.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-stone-400">Arrival</p>
                                                <p className="text-sm font-medium">Walk to Final Dest</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Compliance Footer */}
                                <div className="bg-stone-50 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        {route.complianceCheck === 'CLEARED' ? (
                                            <div className="flex items-center gap-2 text-emerald-700">
                                                <BadgeCheck size={16} />
                                                <span className="text-xs font-bold uppercase">Identity Cleared</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-600">
                                                <ShieldAlert size={16} />
                                                <span className="text-xs font-bold uppercase">Visa Required</span>
                                            </div>
                                        )}
                                    </div>

                                    {route.complianceCheck === 'CLEARED' ? (
                                        <SlideButton 
                                            onConfirm={() => onBook(route)} 
                                            label="Slide to Book"
                                            colorClass="bg-stone-900" 
                                        />
                                    ) : (
                                        <button disabled className="w-full py-3 bg-stone-200 text-stone-400 rounded-xl font-bold text-xs uppercase cursor-not-allowed">
                                            Route Unavailable
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {riskMode === RiskMode.STRICT && (
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3 animate-enter">
                                <ShieldAlert size={16} className="text-indigo-600 mt-0.5" />
                                <p className="text-xs text-indigo-800">
                                    Strict Safety Mode active. High-risk transfer hubs have been filtered out.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default PortalsScreen;