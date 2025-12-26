
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile | null;
  onSetup: () => void;
  onCalculate: () => void;
  onViewKnowledge: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onSetup, onCalculate, onViewKnowledge }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVault, setShowVault] = useState(false);

  const calendarEvents = [
    { date: 'Jan 31', title: 'CIT Returns', desc: 'Companies Income Tax returns for previous year.' },
    { date: 'Feb 21', title: 'VAT Remittance', desc: 'Monthly Value Added Tax filing for January.' },
    { date: 'Mar 31', title: 'PIT Deadline', desc: 'Final deadline for Personal Income Tax self-assessment.' },
    { date: 'Apr 21', title: 'VAT Remittance', desc: 'Monthly Value Added Tax filing for March.' },
    { date: 'Jun 30', title: 'Education Tax', desc: 'Tertiary Education Tax payment due.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden bg-emerald-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">Tax Act 2025 Edition</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            {profile?.preferredLanguage === 'pidgin' ? 'Make we calculate your tax correctly.' : 'Precision Tax Compliance for Nigerians.'}
          </h2>
          <p className="text-emerald-100/80 text-lg mb-10 max-w-xl font-medium">
            Personalized guidance based on your {profile?.incomeTypes.length || 0} income streams and eligible deductions.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={profile ? onCalculate : onSetup}
              className="px-10 py-4 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              {profile ? 'Check Calculator' : 'Get Started'}
            </button>
            <button 
              onClick={() => setShowCalendar(true)}
              className="px-10 py-4 bg-emerald-800/40 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all border border-emerald-700/50 backdrop-blur-md"
            >
              Calendar
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-800 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-[30rem] h-[30rem] bg-emerald-600 rounded-full blur-[120px] opacity-20"></div>
      </section>

      {/* Modals */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Tax Calendar 2025</h3>
                <p className="text-slate-400 text-sm">Key deadlines for compliance</p>
              </div>
              <button onClick={() => setShowCalendar(false)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">✕</button>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {calendarEvents.map((event, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="shrink-0 w-16 h-16 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{event.date.split(' ')[0]}</span>
                    <span className="text-xl font-black text-emerald-600">{event.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{event.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showVault && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
             <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-bold">Receipt Vault</h3>
                <button onClick={() => setShowVault(false)} className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700">✕</button>
             </div>
             <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12"></path></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Secure Receipt Management</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">Upload your business expense receipts here to justify your deductions during FIRS audits.</p>
                <div className="pt-8">
                   <label className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl cursor-pointer hover:bg-emerald-700 transition-all inline-block">
                      Select Documents
                      <input type="file" className="hidden" />
                   </label>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Compliance</h3>
          <p className="text-sm text-slate-500 mb-6">FIRS Score 2025</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black text-slate-900">{profile ? '92' : '0'}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: profile ? '92%' : '5%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setShowVault(true)}>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Vault</h3>
          <p className="text-sm text-slate-500 mb-6">Stored Receipts</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black text-slate-900">0</span>
            <span className="text-xs font-bold text-slate-400">Items</span>
          </div>
          <p className="mt-4 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">Manage Vault →</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Deadlines</h3>
          <p className="text-sm text-slate-500 mb-6">Next Filing</p>
          <p className="text-xl font-black text-slate-900">March 31, 2025</p>
          <div className="mt-4 px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-lg inline-block">14 Days Left</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200">
           <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
             <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
             Latest Tax Insights
           </h3>
           <div className="space-y-8">
              {[
                { title: "Music Production Tax Holiday", cat: "Incentive", desc: "Section 190 introduces a 20-year sunset for studio infrastructure..." },
                { title: "USD Earnings Protocol", cat: "Compliance", desc: "New conversion rules for NAFEM-linked tax reporting..." },
                { title: "Electronic Transfer Levy", cat: "Stamp Duty", desc: "Adjustments to ETL for fintech-linked business accounts..." }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer" onClick={onViewKnowledge}>
                   <span className="text-[10px] font-black uppercase text-emerald-600 mb-1 block">{item.cat}</span>
                   <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors mb-2">{item.title}</h4>
                   <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
           <button onClick={onViewKnowledge} className="mt-12 w-full py-4 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Browse Knowledge Base</button>
        </div>

        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200 flex flex-col justify-between">
           <div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Step-by-Step Compliance</h3>
             <p className="text-slate-500 text-sm mb-10">Follow this journey to ensure full 2025 Act adherence.</p>
             <div className="space-y-6">
                {[
                  { label: "TIN Verification", status: "complete" },
                  { label: "Multi-Currency Alignment", status: profile?.employmentDetails.some(e => e.currency !== 'NGN') ? 'complete' : 'pending' },
                  { label: "Deduction Optimization", status: profile?.deductions.pensionEnabled ? 'complete' : 'pending' },
                  { label: "Vault Documentation", status: "pending" }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${step.status === 'complete' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-300'}`}>
                        {step.status === 'complete' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <span className="text-xs font-bold">{i+1}</span>
                        )}
                     </div>
                     <span className={`text-sm font-bold ${step.status === 'complete' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{step.label}</span>
                  </div>
                ))}
             </div>
           </div>
           {!profile && (
             <button onClick={onSetup} className="mt-12 w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-lg transition-all active:scale-95">Complete My Profile</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
