import React, { useState } from 'react';
import { Screen, JumpPass, Route, Identity, JourneyPhase, RiskMode } from './types';
import NavBar from './components/NavBar';
import HereScreen from './screens/HereScreen';
import PortalsScreen from './screens/PortalsScreen';
import NetworkScreen from './screens/NetworkScreen';
import SystemScreen from './screens/SystemScreen';
import JumpPassScreen from './screens/JumpPassScreen';
import AutomationsScreen from './screens/AutomationsScreen';
import HistoryScreen from './screens/HistoryScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HERE);
  
  // V2 System State
  const [journeyPhase, setJourneyPhase] = useState<JourneyPhase>(JourneyPhase.IDLE);
  const [activeJumpPass, setActiveJumpPass] = useState<JumpPass | null>(null);
  const [riskMode, setRiskMode] = useState<RiskMode>(RiskMode.STANDARD);
  
  const [currentIdentity, setCurrentIdentity] = useState<Identity>({
    id: 'id-1',
    type: 'PERSONAL',
    name: 'Traveler #8821',
    clearanceLevel: 4,
    jurisdiction: 'Global-West',
    isDefault: true
  });

  const identities: Identity[] = [
    { id: 'id-1', type: 'PERSONAL', name: 'Traveler #8821', clearanceLevel: 4, jurisdiction: 'Global-West', isDefault: true },
    { id: 'id-2', type: 'CORPORATE', name: 'Babel Systems Eng', clearanceLevel: 5, jurisdiction: 'Corporate-Net', isDefault: false },
  ];

  // Logic to advance the journey simulation
  const advanceJourney = () => {
    if (journeyPhase === JourneyPhase.PRE_STATION) {
      setJourneyPhase(JourneyPhase.STATION_MODE);
    } else if (journeyPhase === JourneyPhase.STATION_MODE) {
      // Start Jump
      setJourneyPhase(JourneyPhase.IN_TRANSIT);
      // Simulate Transit Duration (5 seconds)
      setTimeout(() => {
        setJourneyPhase(JourneyPhase.ARRIVAL_MODE);
      }, 5000);
    } else if (journeyPhase === JourneyPhase.ARRIVAL_MODE) {
      setJourneyPhase(JourneyPhase.IDLE);
      setActiveJumpPass(null);
    }
  };

  const handleBooking = (route: Route) => {
    const newPass: JumpPass = {
      id: `SEQ-${Math.floor(Math.random() * 9000)}-V2`,
      route: route,
      identityUsed: currentIdentity,
      status: 'SCHEDULED',
      gate: 'B-12',
      boardingTime: new Date(Date.now() + 25 * 60000).toISOString(),
      qrCode: `V2-SECURE-${route.id}-${Date.now()}`
    };
    
    setActiveJumpPass(newPass);
    setJourneyPhase(JourneyPhase.PRE_STATION);
    setCurrentScreen(Screen.HERE);
  };

  const goBack = () => {
    if (currentScreen === Screen.JUMP_DETAILS) setCurrentScreen(Screen.HERE);
    else if (currentScreen === Screen.AUTOMATIONS) setCurrentScreen(Screen.SYSTEM);
    else if (currentScreen === Screen.HISTORY) setCurrentScreen(Screen.SYSTEM);
    else if (currentScreen === Screen.SPACE_DETAILS) setCurrentScreen(Screen.NETWORK);
    else setCurrentScreen(Screen.HERE);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HERE:
        return (
          <HereScreen 
            onNavigate={setCurrentScreen} 
            activeJumpPass={activeJumpPass}
            journeyPhase={journeyPhase}
            onAdvanceJourney={advanceJourney}
            riskMode={riskMode}
          />
        );
      case Screen.PORTALS:
        return (
          <PortalsScreen 
            onNavigate={setCurrentScreen}
            onBook={handleBooking}
            activeIdentity={currentIdentity}
            riskMode={riskMode}
          />
        );
      case Screen.NETWORK:
        return <NetworkScreen />;
      case Screen.SYSTEM:
        return (
          <SystemScreen 
            onNavigate={setCurrentScreen}
            riskMode={riskMode}
            setRiskMode={setRiskMode}
            currentIdentity={currentIdentity}
            identities={identities}
            setIdentity={setCurrentIdentity}
          />
        );
      case Screen.JUMP_DETAILS:
        return (
          <JumpPassScreen 
            activeJumpPass={activeJumpPass}
            onBack={goBack}
            journeyPhase={journeyPhase}
          />
        );
      case Screen.AUTOMATIONS:
        return <AutomationsScreen onBack={goBack} />;
      case Screen.HISTORY:
        return <HistoryScreen onBack={goBack} />;
      default:
        return <HereScreen onNavigate={setCurrentScreen} activeJumpPass={activeJumpPass} journeyPhase={journeyPhase} onAdvanceJourney={advanceJourney} riskMode={riskMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <main className="h-screen w-full max-w-md mx-auto relative shadow-2xl overflow-hidden bg-[#fafaf9]">
        {renderScreen()}
        
        {/* Hide NavBar on detail screens and during immersive transit */}
        {currentScreen !== Screen.JUMP_DETAILS && 
         currentScreen !== Screen.AUTOMATIONS && 
         currentScreen !== Screen.HISTORY && 
         journeyPhase !== JourneyPhase.IN_TRANSIT && (
          <NavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </main>
    </div>
  );
};

export default App;