
import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; next: string | null }[];
}

const JOURNEY_QUESTIONS: Question[] = [
  {
    id: 'primary_source',
    text: 'What is your primary source of income?',
    options: [
      { label: 'Salary (Employment)', value: 'salary', next: 'secondary_income' },
      { label: 'Business Owner / Freelancer', value: 'business', next: 'turnover' },
      { label: 'Both', value: 'both', next: 'turnover' }
    ]
  },
  {
    id: 'turnover',
    text: 'What is your estimated annual business turnover?',
    options: [
      { label: 'Less than N25 Million', value: 'small', next: 'secondary_income' },
      { label: 'N25 Million to N100 Million', value: 'medium', next: 'secondary_income' },
      { label: 'Above N100 Million', value: 'large', next: 'secondary_income' }
    ]
  },
  {
    id: 'secondary_income',
    text: 'Do you have income from any of these specific sources?',
    options: [
      { label: 'Crypto / Digital Assets', value: 'crypto', next: 'residency' },
      { label: 'Real Estate / Rentals', value: 'rental', next: 'residency' },
      { label: 'None of the above', value: 'none', next: 'residency' }
    ]
  },
  {
    id: 'residency',
    text: 'What is your residency status for the current tax year?',
    options: [
      { label: 'Living in Nigeria (>183 days)', value: 'resident', next: 'done' },
      { label: 'Non-Resident (Diaspora)', value: 'non_resident', next: 'done' }
    ]
  }
];

const TaxpayerJourneyMapper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (option: Question['options'][0]) => {
    const newAnswers = { ...answers, [JOURNEY_QUESTIONS[currentStep].id]: option.value };
    setAnswers(newAnswers);

    if (option.next === 'done') {
      setShowResult(true);
    } else {
      const nextIdx = JOURNEY_QUESTIONS.findIndex(q => q.id === option.next);
      if (nextIdx !== -1) setCurrentStep(nextIdx);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Your 2025 Tax Journey</h2>
        <p className="text-slate-500 mb-10">Based on your answers, here is your compliance flowchart.</p>

        <div className="space-y-8 relative">
          <div className="absolute left-[1.35rem] top-8 bottom-8 w-1 bg-emerald-100 hidden md:block"></div>
          
          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg z-10">1</div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex-grow">
              <h4 className="font-bold text-slate-900 mb-2">Personal Income Tax (PIT)</h4>
              <p className="text-sm text-slate-600">You must file your PIT self-assessment by March 31, 2025. Your rates are graduated from 0% to 25%.</p>
            </div>
          </div>

          {(answers.primary_source === 'business' || answers.primary_source === 'both') && (
            <div className="flex gap-6 relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg z-10">2</div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex-grow">
                <h4 className="font-bold text-slate-900 mb-2">Business Compliance</h4>
                {answers.turnover === 'small' ? (
                  <p className="text-sm text-slate-600">Since your turnover is under N25m, you are exempt from charging VAT and 0% Corporate Tax applies, but you MUST still file returns.</p>
                ) : (
                  <p className="text-sm text-slate-600">You are a VAT agent. You must collect 7.5% VAT and remit monthly by the 21st.</p>
                )}
              </div>
            </div>
          )}

          {answers.secondary_income === 'crypto' && (
            <div className="flex gap-6 relative">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg z-10">3</div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex-grow">
                <h4 className="font-bold text-slate-900 mb-2">Digital Asset Taxation</h4>
                <p className="text-sm text-slate-600">You are subject to 10% Capital Gains Tax on all crypto disposals as per Section 4 of the 2025 Act.</p>
              </div>
            </div>
          )}

          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg z-10">✓</div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex-grow">
              <h4 className="font-bold text-emerald-900 mb-2">FIRS Portal Action</h4>
              <p className="text-sm text-emerald-700">Final Step: Log in to TaxPRO-Max to verify your TIN and link these income streams.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={reset}
          className="mt-12 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
        >
          Start New Mapper
        </button>
      </div>
    );
  }

  const question = JOURNEY_QUESTIONS[currentStep];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Taxpayer Journey Mapper</h3>
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / JOURNEY_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-10">
        <h2 className="text-xl font-bold text-slate-800 mb-8">{question.text}</h2>
        <div className="space-y-4">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(opt)}
              className="w-full p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex justify-between items-center"
            >
              <span className="font-bold text-slate-700 group-hover:text-emerald-900">{opt.label}</span>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxpayerJourneyMapper;
