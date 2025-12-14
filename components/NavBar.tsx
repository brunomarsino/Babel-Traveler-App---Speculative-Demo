import React from 'react';
import { MapPin, Navigation, Users, Grip, Ticket, Zap, History } from 'lucide-react';
import { Screen } from '../types';

interface NavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
  // Map sub-screens to their parent tab for UI highlighting
  const getActiveTab = (screen: Screen): Screen => {
    switch (screen) {
      case Screen.AUTOMATIONS:
      case Screen.HISTORY:
        return Screen.SYSTEM;
      case Screen.JUMP_DETAILS:
        return Screen.HERE; // Or keep no tab active? Let's highlight Here as context
      default:
        return screen;
    }
  };

  const activeTab = getActiveTab(currentScreen);

  const navItems = [
    { id: Screen.HERE, icon: MapPin, label: 'Here' },
    { id: Screen.PORTALS, icon: Navigation, label: 'Portals' },
    { id: Screen.NETWORK, icon: Users, label: 'Network' },
    { id: Screen.SYSTEM, icon: Grip, label: 'System' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-50/95 backdrop-blur-xl border-t border-stone-200 pb-safe pt-2 px-6 pb-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-300 w-16 h-12 rounded-2xl ${
                isActive 
                  ? 'text-stone-900' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <item.icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;