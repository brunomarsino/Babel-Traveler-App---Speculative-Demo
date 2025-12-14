import React from 'react';
import { Plus, UserCheck, UserX, Clock, Home } from 'lucide-react';
import { Contact } from '../types';

const CONTACTS: Contact[] = [
    { id: '1', name: 'Elena R.', relation: 'Partner', accessLevel: 'FULL', avatar: 'https://picsum.photos/100/100?random=4' },
    { id: '2', name: 'Marcus K.', relation: 'Colleague', accessLevel: 'GUEST', avatar: 'https://picsum.photos/100/100?random=5' },
    { id: '3', name: 'Dr. Aris', relation: 'Physician', accessLevel: 'NONE', avatar: 'https://picsum.photos/100/100?random=6' },
];

const PeopleScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-24 bg-[#fafaf9] animate-enter">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-serif text-stone-900">People</h2>
            <p className="text-stone-500 text-sm mt-1">Manage spatial access</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center shadow-lg hover:bg-stone-800">
            <Plus size={20} />
        </button>
      </div>

      {/* Active Requests */}
      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Pending Requests</h3>
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-serif font-bold">
                    J
                </div>
                <div>
                    <p className="text-sm font-medium text-stone-900">Julian V.</p>
                    <p className="text-xs text-stone-500">Requesting Studio access</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-full bg-stone-100 text-stone-400 hover:text-red-500 transition-colors">
                    <UserX size={16} />
                </button>
                <button className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                    <UserCheck size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Contacts List */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Trusted Network</h3>
        <div className="space-y-3">
            {CONTACTS.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover grayscale opacity-80" />
                        <div>
                            <p className="font-serif text-lg text-stone-900 leading-none mb-1">{contact.name}</p>
                            <p className="text-xs text-stone-500">{contact.relation}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            contact.accessLevel === 'FULL' ? 'bg-emerald-100 text-emerald-700' : 
                            contact.accessLevel === 'GUEST' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'
                        }`}>
                            {contact.accessLevel}
                        </span>
                        {contact.accessLevel === 'FULL' && <Home size={14} className="text-stone-300" />}
                        {contact.accessLevel === 'GUEST' && <Clock size={14} className="text-stone-300" />}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleScreen;