
import React, { useState } from 'react';
import { ForumTopic, ForumReply } from '../types';

const INITIAL_TOPICS: ForumTopic[] = [
  { 
    id: '1', 
    title: 'How to link multiple TINs for mixed income?', 
    author: 'Tunde_Lagos', 
    replies: 3, 
    time: '2h ago', 
    category: 'General', 
    content: "I have both salary and a side hustle. My employer uses one TIN, but I registered my business with another. The 2025 Act says we should consolidate. How do I start the process on TaxPRO-Max?",
    repliesList: [
      { id: 'r1', author: 'Skujy_Bot', text: "Actually, you should apply for consolidation through the JTB portal first. Tip: consolidation takes about 5 working days.", time: '1h ago' },
      { id: 'r2', author: 'TaxPro_99', text: "Just go to your nearest LTO (Local Tax Office). They have a dedicated desk for TIN alignment now.", time: '30m ago' },
      { id: 'r2b', author: 'LuckyMan', text: "I did mine last week. Just bring your NIN and both TIN numbers. Very smooth process.", time: '10m ago' }
    ]
  },
  { 
    id: '2', 
    title: 'VAT exemptions for online tutors - anyone verified?', 
    author: 'GraceEdu', 
    replies: 2, 
    time: '5h ago', 
    category: 'VAT', 
    content: "I run a tutorial center online. I read that education services are zero-rated (0% VAT). Does this apply to virtual classes for students abroad?",
    repliesList: [
      { id: 'r3', author: 'LegalEagle', text: "Section 187 specifically mentions 'Educational Books and Materials'. Virtual classes are often treated as 'Exported Services' if the students are abroad, which is also 0% VAT!", time: '2h ago' },
      { id: 'r3b', author: 'Skujy_Bot', text: "Grace, remember that you still need to register for VAT even if your goods are zero-rated. It helps with input tax claims later.", time: '1h ago' }
    ]
  },
  { 
    id: '3', 
    title: 'Crypto CGT: Are P2P transfers tracked?', 
    author: 'CryptoKing_NG', 
    replies: 4, 
    time: '1d ago', 
    category: 'Digital Assets', 
    content: "With the new 10% Capital Gains Tax on digital assets, how is the government tracking P2P? If I sell USDT for Naira on a decentralized platform, am I still liable?",
    repliesList: [
      { id: 'r4', author: 'FIRS_Watcher', text: "They are tracking bank inflows. Any large unexplained inflow into your account can trigger an audit where you'll have to explain the source and pay the 10% CGT.", time: '12h ago' },
      { id: 'r4b', author: 'HodlHard', text: "Omo, 10% on gains is better than the 30% CIT some people feared. I'll just keep good records.", time: '8h ago' },
      { id: 'r4c', author: 'Skujy_Bot', text: "Correct. Section 4 specifically targets the disposal of assets. Keep your buy/sell receipts.", time: '4h ago' },
      { id: 'r4d', author: 'Timi_Dev', text: "Does this affect swapping one coin for another or only when cashing out to Naira?", time: '2h ago' }
    ]
  },
  {
    id: '4',
    title: 'Fossil Fuel Surcharge: Does it affect CNG users?',
    author: 'EcoDriver',
    replies: 2,
    time: '3h ago',
    category: 'General',
    content: "The 5% surcharge is for fossil fuels. Does CNG (Compressed Natural Gas) count as fossil fuel under Section 159?",
    repliesList: [
      { id: 'r5', author: 'TechyTimi', text: "Good news! Section 159 explicitly exempts 'Renewable energy and Compressed Natural Gas (CNG)' to promote cleaner energy.", time: '1h ago' },
      { id: 'r5b', author: 'GreenPath', text: "This is a great incentive for the CNG conversion kits that are rolling out now.", time: '30m ago' }
    ]
  },
  {
    id: '5',
    title: 'VAT on Netflix and Spotify - Who pays?',
    author: 'StreamMaster',
    replies: 3,
    time: '6h ago',
    category: 'VAT',
    content: "I noticed my Netflix subscription price went up slightly. Is the 7.5% VAT being collected by the bank or the company directly?",
    repliesList: [
      { id: 'r11', author: 'FinanceFix', text: "The FIRS appointed foreign companies as agents. Netflix collects it directly from you and remits it to FIRS.", time: '4h ago' },
      { id: 'r12', author: 'Skujy_Bot', text: "This falls under the 'Significant Economic Presence' rules updated in 2025. Digital services consumed in Nigeria are VATable.", time: '2h ago' },
      { id: 'r13', author: 'Oga_Stream', text: "At least it's only 7.5%, in some countries it's up to 20%!", time: '1h ago' }
    ]
  },
  {
    id: '6',
    title: 'Diaspora Rental Income: Taxing Nigerian assets',
    author: 'London_Lady',
    replies: 3,
    time: '1d ago',
    category: 'General',
    content: "I live in the UK but have 3 flats in Lekki. I pay UK tax on global income. Do I still owe Nigeria PIT on those rentals?",
    repliesList: [
      { id: 'r21', author: 'TaxExpert_NG', text: "Yes. Rental income from property situated in Nigeria is taxable in Nigeria, regardless of where you live.", time: '20h ago' },
      { id: 'r22', author: 'Skujy_Bot', text: "You should look into the UK-Nigeria Double Taxation Agreement. You can likely claim a credit in the UK for tax paid in Nigeria.", time: '15h ago' },
      { id: 'r23', author: 'Ibeju_Landlord', text: "Make sure you have your TCC when you want to sell the property later, otherwise it's a headache!", time: '10h ago' }
    ]
  },
  {
    id: '7',
    title: 'Small Business CIT Exemption: Filing is still mandatory!',
    author: 'BreadSeller',
    replies: 2,
    time: '2d ago',
    category: 'Business',
    content: "My business turnover is only N15m. Since I'm exempt from CIT (0%), do I still need to file anything at all with FIRS?",
    repliesList: [
      { id: 'r31', author: 'Skujy_Bot', text: "ABSOLUTELY. Exemption from payment is not exemption from filing. You must file nil returns or you will face late filing penalties!", time: '1d ago' },
      { id: 'r32', author: 'AuditMan', text: "Don't play with this. Late filing penalty for companies starts from N50,000 and increases daily.", time: '12h ago' }
    ]
  },
  {
    id: '8',
    title: 'SaaS Startup: SEP rules for foreign clients',
    author: 'SoftDev_Ibadan',
    replies: 2,
    time: '3d ago',
    category: 'Business',
    content: "If my Nigerian SaaS company sells to a US company, do I charge VAT? Or is it an 'Exported Service'?",
    repliesList: [
      { id: 'r41', author: 'LegalPro', text: "Services provided to persons outside Nigeria are generally zero-rated. You don't charge VAT to your US client.", time: '2d ago' },
      { id: 'r42', author: 'Skujy_Bot', text: "Keep your proof of export (service agreement and proof of foreign inflow) to justify the 0% VAT during audits.", time: '1d ago' }
    ]
  }
];

const CommunityForum: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_TOPICS);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({ title: '', category: 'General', content: '' });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title.trim()) return;

    const topic: ForumTopic = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTopic.title,
      author: 'You',
      replies: 0,
      time: 'Just now',
      category: newTopic.category as any,
      content: newTopic.content || "Join the conversation below.",
      repliesList: []
    };

    setTopics([topic, ...topics]);
    setNewTopic({ title: '', category: 'General', content: '' });
    setShowModal(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReporting(true);
    // Simulate API call
    setTimeout(() => {
      setIsReporting(false);
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(null);
        setReportSuccess(false);
        setReportReason('');
      }, 2000);
    }, 1000);
  };

  const toggleExpand = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Community Forum</h2>
          <p className="text-emerald-100/70">Discuss the 2025 Tax Act with {topics.length + 154} active members. Click cards to expand.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="relative z-10 px-8 py-4 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Create New Topic
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className={`bg-white p-6 rounded-3xl border transition-all flex flex-col group ${
              expandedTopic === topic.id ? 'border-emerald-500 ring-2 ring-emerald-500/5' : 'border-slate-200 shadow-sm hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(topic.id)}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md">
                    {topic.category}
                  </span>
                  {topic.replies > 2 && (
                    <span className="text-[10px] font-black uppercase text-orange-600 px-2 py-0.5 bg-orange-50 rounded-md animate-pulse">
                      Hot Topic 🔥
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {topic.title}
                </h4>
                <p className="text-xs text-slate-400">
                  Started by <span className="font-bold text-slate-600">{topic.author}</span> • {topic.time}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center hidden sm:block">
                  <p className="text-xl font-black text-slate-900">{topic.replies}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Replies</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  expandedTopic === topic.id ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-50 text-slate-400'
                }`}>
                  <svg className={`w-5 h-5 transition-transform ${expandedTopic === topic.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {expandedTopic === topic.id && (
              <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {topic.content}
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Conversation Thread</h5>
                  {topic.repliesList.length > 0 ? topic.repliesList.map(reply => (
                    <div key={reply.id} className="pl-4 border-l-4 border-emerald-100 space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${reply.author === 'Skujy_Bot' ? 'text-orange-600' : 'text-slate-800'}`}>
                          {reply.author} {reply.author === 'Skujy_Bot' && '✨'}
                        </span>
                        <span className="text-[10px] text-slate-400">{reply.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">{reply.text}</p>
                    </div>
                  )) : (
                    <div className="py-4 text-center">
                      <p className="text-xs italic text-slate-400">No replies yet. Be the first to share your expert insight!</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">Reply to thread</button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowReportModal(topic.id); }}
                      className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Report Topic
                    </button>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className={`p-8 text-white flex justify-between items-center transition-colors ${reportSuccess ? 'bg-emerald-600' : 'bg-red-600'}`}>
              <h3 className="text-xl font-bold">{reportSuccess ? 'Report Received' : 'Report Content'}</h3>
              {!reportSuccess && (
                <button onClick={() => setShowReportModal(null)} className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-800 transition-colors">✕</button>
              )}
            </div>
            <div className="p-8">
              {reportSuccess ? (
                <div className="text-center py-6 animate-in zoom-in duration-300">
                   <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <p className="text-slate-600 font-medium">Thank you for keeping the community safe. Our team has been notified.</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <p className="text-sm text-slate-500 italic">"Help us maintain high quality tax discussions."</p>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Reason</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-sm font-medium">
                      <option>Misleading Tax Advice</option>
                      <option>Spam or Commercial Post</option>
                      <option>Inappropriate Language</option>
                      <option>Harassment</option>
                      <option>Other</option>
                    </select>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      rows={4}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      placeholder="Please provide specific details..."
                      required
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(null)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isReporting}
                      className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isReporting ? (
                         <>
                           <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Reporting...
                         </>
                      ) : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Start a Discussion</h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">✕</button>
            </div>
            <form onSubmit={handleCreateTopic} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Category</label>
                  <select
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value as any })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                  >
                    <option value="General">General Questions</option>
                    <option value="Business">Small Business Tax</option>
                    <option value="Digital Assets">Digital Assets & Crypto</option>
                    <option value="VAT">VAT Remittance</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Subject</label>
                  <input
                    type="text"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    placeholder="Summarize your tax concern..."
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Message Body</label>
                <textarea
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Provide context, numbers, or specific sections of the Act you are referencing..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                Publish Topic
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
