import React, { useState } from 'react';
import { Plus, UserCheck, UserX, Clock, Home, Building, Briefcase, Settings, ChevronRight, Users, Eye, Lock } from 'lucide-react';
import { Contact, Space, Screen } from '../types';

const SPACES: Space[] = [
    { id: 's1', name: 'Home (NYC-7)', type: 'HOME', accessCount: 3, icon: 'house', securityLevel: 5 },
    { id: 's2', name: 'Studio', type: 'STUDIO', accessCount: 5, icon: 'palette', securityLevel: 3 },
];

const AUDIT_LOGS = [
    { id: '1', action: 'Access Granted', actor: 'Elena R.', timestamp: '2h ago', result: 'ALLOWED' },
    { id: '2', action: 'Jump Arrival', actor: 'Guest #99', timestamp: '5h ago', result: 'DENIED' },
];

const NetworkScreen: React.FC = () => {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  if (selectedSpace) {
      // SPACE DETAIL VIEW
      return (
        <div className="flex flex-col h-full bg-[#fafaf9] animate-enter">
            <header className="px-6 pt-12 pb-4 bg-white border-b border-stone-100">
                <button onClick={() => setSelectedSpace(null)} className="text-xs font-bold text-stone-400 hover:text-stone-900 mb-4">← Back to Network</button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-serif text-stone-900">{selectedSpace.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Lock size={12} className="text-emerald-500" />
                            <span className="text-xs text-stone-500">Security Level {selectedSpace.securityLevel}</span>
                        </div>
                    </div>
                    <button className="bg-stone-100 p-2 rounded-full text-stone-600">
                        <Settings size={18} />
                    </button>
                </div>
            </header>
            
            <div className="p-6 space-y-6 overflow-y-auto pb-24">
                {/* Access List */}
                <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Authorized People</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl">
                            <span className="text-sm font-medium">Elena R.</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">FULL ACCESS</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl">
                            <span className="text-sm font-medium">Marcus K.</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">GUEST (09:00 - 18:00)</span>
                        </div>
                    </div>
                    <button className="w-full mt-3 py-2 border border-dashed border-stone-300 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-600 hover:border-stone-400">
                        + Invite Person or Group
                    </button>
                </div>

                {/* Audit Log */}
                <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Recent Activity</h3>
                    <div className="bg-stone-50 rounded-xl p-4 space-y-3">
                        {AUDIT_LOGS.map(log => (
                            <div key={log.id} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${log.result === 'ALLOWED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="font-medium text-stone-700">{log.action}</span>
                                    <span className="text-stone-400">by {log.actor}</span>
                                </div>
                                <span className="text-stone-400 font-mono">{log.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // MAIN NETWORK VIEW
  return (
    <div className="flex flex-col h-full bg-[#fafaf9] animate-enter">
      <div className="px-6 pt-12 pb-6 border-b border-stone-200/50 sticky top-0 bg-[#fafaf9] z-10">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-serif text-stone-900">Network</h2>
                <p className="text-stone-500 text-sm mt-1">Governance Console</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center shadow-lg hover:bg-stone-800">
                <Plus size={20} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-8">
        
        {/* Groups (V2 New) */}
        <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Groups & Teams</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                    <div className="flex -space-x-2">
                         <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white" />
                         <div className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white" />
                    </div>
                    <div>
                        <p className="font-serif text-stone-900">Family</p>
                        <p className="text-[10px] text-stone-500">4 Members</p>
                    </div>
                </div>
                <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Briefcase size={16} />
                    </div>
                    <div>
                        <p className="font-serif text-stone-900">Babel Eng</p>
                        <p className="text-[10px] text-stone-500">12 Members</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Spaces Management */}
        <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Managed Spaces</h3>
            <div className="space-y-3">
                {SPACES.map(space => (
                    <button 
                        key={space.id} 
                        onClick={() => setSelectedSpace(space)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm active:scale-[0.99] transition-transform text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                                {space.type === 'HOME' && <Home size={18} />}
                                {space.type === 'OFFICE' && <Building size={18} />}
                                {space.type === 'STUDIO' && <Briefcase size={18} />}
                            </div>
                            <div>
                                <p className="font-serif text-base text-stone-900">{space.name}</p>
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Users size={12} />
                                    <span>{space.accessCount} Access</span>
                                    <span>•</span>
                                    <Eye size={12} />
                                    <span>Audit Log</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-stone-300" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkScreen;