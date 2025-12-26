
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import TaxCalculator from './components/TaxCalculator';
import AIAssistant from './components/AIAssistant';
import KnowledgeBase from './components/KnowledgeBase';
import TaxpayerJourneyMapper from './components/TaxpayerJourneyMapper';
import CommunityForum from './components/CommunityForum';
import { UserProfile, Language } from './types';

type View = 'dashboard' | 'profile' | 'calculator' | 'assistant' | 'knowledge' | 'journey' | 'forum';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('taxguide_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const handleProfileUpdate = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('taxguide_profile', JSON.stringify(newProfile));
    setCurrentView('dashboard');
  };

  const handleLanguageToggle = () => {
    if (!profile) return;
    const nextLang: Language = profile.preferredLanguage === 'english' ? 'pidgin' : 'english';
    const updated = { ...profile, preferredLanguage: nextLang };
    setProfile(updated);
    localStorage.setItem('taxguide_profile', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        language={profile?.preferredLanguage || 'english'}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {currentView === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            onSetup={() => setCurrentView('profile')} 
            onCalculate={() => setCurrentView('calculator')}
            onViewKnowledge={() => setCurrentView('knowledge')}
          />
        )}
        {currentView === 'profile' && (
          <ProfileSetup 
            initialProfile={profile} 
            onSave={handleProfileUpdate} 
          />
        )}
        {currentView === 'calculator' && (
          <TaxCalculator 
            profile={profile} 
            onSetup={() => setCurrentView('profile')} 
          />
        )}
        {currentView === 'assistant' && (
          <AIAssistant profile={profile} />
        )}
        {currentView === 'knowledge' && (
          <KnowledgeBase />
        )}
        {currentView === 'journey' && (
          <TaxpayerJourneyMapper />
        )}
        {currentView === 'forum' && (
          <CommunityForum />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="font-bold">&copy; 2025 TaxGuide NG. Built for Nigeria Tax Act 2025.</p>
          <div className="flex justify-center gap-6 mt-4">
             <button className="hover:text-slate-600 transition-colors">Privacy Policy</button>
             <button className="hover:text-slate-600 transition-colors">Terms of Service</button>
             <button className="hover:text-slate-600 transition-colors">FIRS Resources</button>
          </div>
          <p className="mt-4 italic max-w-2xl mx-auto">This tool provides guidance only and does not constitute professional tax advice. Always verify with a certified accountant.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
