import React, { useState } from 'react';
import { Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';
import { Automation } from '../types';
import { generateAutomationFromPrompt } from '../services/geminiService';

interface AutomationsScreenProps {
  onBack: () => void;
}

const MOCK_AUTOMATIONS: Automation[] = [
    { id: '1', name: 'Rain Protocol', trigger: 'Precipitation > 50%', action: 'Route: Covered Portals', isActive: true },
    { id: '2', name: 'Morning Commute', trigger: 'Weekdays 08:00', action: 'Queue: Office Portal', isActive: true },
];

const AutomationsScreen: React.FC<AutomationsScreenProps> = ({ onBack }) => {
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRule, setGeneratedRule] = useState<Partial<Automation> | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedRule(null);
    
    const rule = await generateAutomationFromPrompt(prompt);
    
    if (rule) {
        setGeneratedRule(rule);
    }
    setIsGenerating(false);
  };

  const handleSaveRule = () => {
    if (generatedRule && generatedRule.name && generatedRule.trigger && generatedRule.action) {
        const newAutomation: Automation = {
            id: Date.now().toString(),
            name: generatedRule.name,
            trigger: generatedRule.trigger,
            action: generatedRule.action,
            isActive: true,
        };
        setAutomations([newAutomation, ...automations]);
        setGeneratedRule(null);
        setPrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-24 bg-[#fafaf9] animate-enter">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-900 mb-4 transition-colors">
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">System</span>
        </button>
        <h2 className="text-3xl font-serif text-stone-900">Automations</h2>
        <p className="text-stone-500 text-sm mt-1">Smart travel logic</p>
      </div>

      {/* Builder */}
      <div className="bg-stone-900 rounded-3xl p-6 text-stone-50 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20">
            <Sparkles size={48} />
        </div>
        
        <label className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-2 block">
            New Rule
        </label>
        
        <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a rule... (e.g., 'If I leave work late, book a premium portal')"
            className="w-full bg-transparent text-xl font-serif text-stone-100 placeholder:text-stone-600 focus:outline-none resize-none h-24 mb-4"
        />

        {generatedRule ? (
            <div className="bg-stone-800/50 rounded-xl p-4 mb-4 border border-stone-700">
                <p className="text-xs text-stone-400 uppercase mb-1">Preview</p>
                <p className="font-medium text-emerald-400">{generatedRule.name}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-stone-300">
                    <span>{generatedRule.trigger}</span>
                    <ArrowRight size={12} />
                    <span>{generatedRule.action}</span>
                </div>
                <div className="flex gap-2 mt-4">
                    <button onClick={handleSaveRule} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg text-sm font-medium transition-colors">
                        Confirm
                    </button>
                    <button onClick={() => setGeneratedRule(null)} className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isGenerating ? 'bg-stone-700 text-stone-400' : 'bg-stone-50 text-stone-900 hover:bg-stone-200'
                }`}
            >
                {isGenerating ? (
                    <span className="animate-pulse">Reasoning...</span>
                ) : (
                    <>
                        <Sparkles size={16} />
                        <span>Generate Logic</span>
                    </>
                )}
            </button>
        )}
      </div>

      {/* List */}
      <h3 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-4">Active Protocols</h3>
      <div className="space-y-3 overflow-y-auto">
        {automations.map(auto => (
            <div key={auto.id} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="font-serif text-lg text-stone-900 mb-1">{auto.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="bg-stone-100 px-2 py-0.5 rounded">{auto.trigger}</span>
                        <ArrowRight size={10} />
                        <span className="bg-stone-100 px-2 py-0.5 rounded">{auto.action}</span>
                    </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${auto.isActive ? 'bg-emerald-500' : 'bg-stone-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${auto.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationsScreen;