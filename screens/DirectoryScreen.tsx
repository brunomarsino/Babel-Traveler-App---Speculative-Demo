import React, { useState } from 'react';
import { Search, Map as MapIcon, List, Navigation2, Star, Clock, Crosshair, X, ArrowRight } from 'lucide-react';
import { Portal, Screen } from '../types';

interface DirectoryScreenProps {
  onNavigate: (screen: Screen) => void;
  onBook: (portal: Portal) => void;
}

// Extended Portal type locally for map positioning
interface MapPortal extends Portal {
  mapPosition: { top: string; left: string };
}

const MOCK_PORTALS: MapPortal[] = [
  {
    id: '1',
    name: 'Grand Central Station',
    type: 'PUBLIC',
    status: 'BUSY',
    waitTimeMin: 12,
    distanceKm: 0.8,
    image: 'https://picsum.photos/400/200?random=1',
    coordinates: '40.7527° N, 73.9772° W',
    riskLevel: 'LOW',
    mapPosition: { top: '35%', left: '45%' }
  },
  {
    id: '2',
    name: 'SoHo Private Hub',
    type: 'PRIVATE',
    status: 'ONLINE',
    waitTimeMin: 0,
    distanceKm: 2.1,
    image: 'https://picsum.photos/400/200?random=2',
    coordinates: '40.7233° N, 74.0030° W',
    riskLevel: 'LOW',
    mapPosition: { top: '55%', left: '38%' }
  },
  {
    id: '3',
    name: 'Brooklyn Heights Deck',
    type: 'PUBLIC',
    status: 'MAINTENANCE',
    waitTimeMin: 45,
    distanceKm: 4.5,
    image: 'https://picsum.photos/400/200?random=3',
    coordinates: '40.6960° N, 73.9933° W',
    riskLevel: 'MEDIUM',
    mapPosition: { top: '65%', left: '60%' }
  }
];

const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ onNavigate, onBook }) => {
  const [viewMode, setViewMode] = useState<'MAP' | 'LIST'>('LIST');
  const [filter, setFilter] = useState('ALL');
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);

  const selectedPortal = MOCK_PORTALS.find(p => p.id === selectedPortalId);

  return (
    <div className="flex flex-col h-full bg-[#fafaf9] animate-enter">
      {/* Top Bar */}
      <div className="px-6 pt-12 pb-4 bg-[#fafaf9] z-20 sticky top-0 border-b border-stone-200/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-serif text-stone-900">Directory</h2>
          <button 
            onClick={() => setViewMode(viewMode === 'MAP' ? 'LIST' : 'MAP')}
            className="p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors"
          >
            {viewMode === 'MAP' ? <List size={20} /> : <MapIcon size={20} />}
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
            <Search className="absolute left-4 top-3 text-stone-400" size={18} />
            <input 
                type="text" 
                placeholder="Search portals, coordinates..."
                className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
            />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['ALL', 'PUBLIC', 'PRIVATE', 'FAVORITES'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all ${
                        filter === f 
                        ? 'bg-stone-900 text-stone-50 border-stone-900' 
                        : 'bg-transparent text-stone-500 border-stone-300'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 relative">
        {viewMode === 'MAP' ? (
            <div className="h-full w-full bg-stone-900 relative flex items-center justify-center overflow-hidden">
                {/* Background Map Image Placeholder */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                  alt="Map View" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                  onClick={() => setSelectedPortalId(null)}
                />
                
                {/* Digital Overlay Grid */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent pointer-events-none"></div>

                {/* Live Topography Badge */}
                <div className="absolute top-4 left-4 z-10 bg-stone-900/90 backdrop-blur px-3 py-1.5 rounded border border-emerald-500/30 flex items-center gap-2 pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">Live Topography</p>
                </div>

                {/* Interactive Markers */}
                {MOCK_PORTALS.map((portal) => {
                    const isSelected = selectedPortalId === portal.id;
                    return (
                        <button
                            key={portal.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPortalId(portal.id);
                            }}
                            className="absolute flex flex-col items-center z-10 group focus:outline-none transition-transform duration-300"
                            style={{ 
                                top: portal.mapPosition.top, 
                                left: portal.mapPosition.left,
                                transform: isSelected ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)'
                            }}
                        >
                             <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'w-8 h-8' : 'w-4 h-4'}`}>
                                {/* Rings */}
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                                    portal.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}></div>
                                <div className={`relative rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-stone-900 transition-all duration-300 ${
                                    isSelected ? 'w-4 h-4' : 'w-2 h-2'
                                } ${
                                    portal.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-500'
                                }`}></div>
                             </div>
                             
                             {/* Label (Visible on hover or selection) */}
                             <span className={`text-[8px] text-stone-300 mt-2 uppercase tracking-wider bg-stone-900/90 px-1.5 py-0.5 rounded border border-stone-700 backdrop-blur transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                {portal.id === '1' ? 'NYC-7' : portal.id === '2' ? 'SOHO' : 'BKL-2'}
                             </span>
                        </button>
                    );
                })}
                
                {/* Scanning Radar Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-emerald-500/20 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none" 
                     style={{ borderTopColor: 'rgba(16, 185, 129, 0.4)' }}></div>

                {/* Selected Portal Detail Card */}
                {selectedPortal && (
                    <div className="absolute bottom-6 left-6 right-6 z-30 animate-enter">
                        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/20">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-stone-900">{selectedPortal.name}</h3>
                                    <p className="text-xs text-stone-500 uppercase tracking-wide">{selectedPortal.type} Access</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedPortalId(null)}
                                    className="p-1 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded-lg">
                                    <Navigation2 size={12} />
                                    <span>{selectedPortal.distanceKm} km</span>
                                </div>
                                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${
                                    selectedPortal.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                    <Clock size={12} />
                                    <span>{selectedPortal.waitTimeMin} min wait</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onBook(selectedPortal)}
                                className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-lg"
                            >
                                <span>Reserve Slot</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="p-6 space-y-4">
                {MOCK_PORTALS.map(portal => (
                    <div key={portal.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group active:scale-95 transition-transform">
                        <div className="h-32 w-full overflow-hidden relative">
                            <img src={portal.image} alt={portal.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-stone-800">
                                {portal.type}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif text-lg font-medium text-stone-900">{portal.name}</h3>
                                {portal.status === 'ONLINE' ? (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-stone-500 text-xs">
                                <div className="flex items-center gap-1">
                                    <Navigation2 size={12} />
                                    <span>{portal.distanceKm} km</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{portal.waitTimeMin} min queue</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onBook(portal)}
                                className="w-full mt-4 bg-stone-100 text-stone-900 py-3 rounded-xl text-sm font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
                            >
                                Reserve Slot
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryScreen;