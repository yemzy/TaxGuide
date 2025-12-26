
import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';

const KnowledgeBase: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedSector, setExpandedSector] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) || 
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const prioritySectors = [
    { title: "Aquaculture & Fishing", incentive: "20 Year Sunset", threshold: "N500m", details: "Qualifies for full corporate tax exemption for 20 years from commencement. This includes hatcheries, processing plants, and deep-sea trawling operations. Documentation must show direct investment in core Nigerian infrastructure." },
    { title: "Refined Petroleum", incentive: "20 Year Sunset", threshold: "N100b", details: "Requires minimum investment of N100b in refining infrastructure. Covers modular refineries and large-scale petrochemical plants. Aimed at making Nigeria a self-sufficient energy hub." },
    { title: "Electrical Equipment", incentive: "20 Year Sunset", threshold: "N20b", details: "Manufacturing of power transformers, meters, and industrial cables. Includes components for solar and renewable energy storage systems, exempting them from several custom duties." },
    { title: "Domestic Appliances", incentive: "15 Year Sunset", threshold: "N5b", details: "Local assembly and part manufacturing for household electronics. Covers refrigerators, air conditioners, and kitchen appliances. Mandatory 30% local value addition required." },
    { title: "Music Production", incentive: "20 Year Sunset", threshold: "N250m", details: "Tax holiday for studio infrastructure and music distribution platforms. Includes software development for the creative industry. Aimed at supporting the global growth of Afrobeat and local creative talent." },
  ];

  const handleDownloadGazette = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Download Started: Nigeria_Tax_Act_2025_Gazette_No117.pdf");
    }, 1500);
  };

  const toggleFaqExpand = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleSectorExpand = (index: number) => {
    setExpandedSector(expandedSector === index ? null : index);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tax Act Navigator 2025</h2>
        <p className="text-slate-500 text-lg leading-relaxed">Search the unified fiscal framework in plain English. Click cards to expand for deeper details and real-world scenarios.</p>
        
        <div className="relative mt-8 group">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics (e.g., 'Significant Economic Presence', 'VAT exemption')"
            className="w-full px-14 py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFaqs.length > 0 ? filteredFaqs.map((faq: any, i) => (
          <div 
            key={i} 
            onClick={() => toggleFaqExpand(i)}
            className={`bg-white p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:shadow-xl ${
              expandedFaq === i ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100 hover:border-emerald-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-700">{faq.question}</h4>
              <span className={`text-slate-400 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180 text-emerald-500' : ''}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === i ? 'max-height-visible mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 space-y-4">
                <p>{faq.answer}</p>
                {faq.example && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="font-bold text-emerald-800 text-[10px] uppercase tracking-widest mb-1">Real-World Scenario:</p>
                    <p className="text-emerald-700 italic">{faq.example}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 text-center py-12 text-slate-400 italic">
            No matching topics found in the 2025 Act.
          </div>
        )}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-900">Priority Sector Incentives</h3>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Tenth Schedule</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prioritySectors.map((sector, i) => (
            <div 
              key={i} 
              onClick={() => toggleSectorExpand(i)}
              className={`bg-white p-6 rounded-3xl border transition-all duration-300 cursor-pointer group hover:shadow-lg flex flex-col ${
                expandedSector === i ? 'border-emerald-500 ring-2 ring-emerald-500/10 scale-[1.02]' : 'border-slate-200 hover:border-emerald-400 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className={`font-black text-lg transition-colors ${expandedSector === i ? 'text-emerald-600' : 'text-slate-800 group-hover:text-emerald-600'}`}>
                  {sector.title}
                </h5>
                <span className={`text-slate-300 transition-transform ${expandedSector === i ? 'rotate-180 text-emerald-500' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-tight">{sector.incentive} • {sector.threshold}</p>
              
              <div className={`overflow-hidden transition-all duration-300 ${expandedSector === i ? 'max-h-[300px] mt-2' : 'max-h-0'}`}>
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  {sector.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-emerald-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="shrink-0">
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-5xl shadow-2xl rotate-6">
              📄
            </div>
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-3xl font-bold">Act Navigator PDF</h3>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-xl">Download the complete, searchable version of the Nigeria Tax Act 2025. This document contains all 203 sections and 14 schedules for expert review.</p>
            <button 
              onClick={handleDownloadGazette}
              disabled={isDownloading}
              className="bg-white text-emerald-900 font-extrabold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all flex items-center gap-3 shadow-lg mx-auto md:mx-0 disabled:opacity-70"
            >
              {isDownloading ? (
                <svg className="animate-spin h-5 w-5 text-emerald-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              {isDownloading ? 'Downloading...' : 'Download Gazette (8.4MB)'}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>
      <style>{`
        .max-height-visible {
          max-height: 500px;
        }
      `}</style>
    </div>
  );
};

export default KnowledgeBase;
