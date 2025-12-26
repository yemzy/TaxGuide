
import React, { useState } from 'react';
import { UserProfile, IncomeType, EmploymentDetail, Language } from '../types';
import { INDUSTRY_CATEGORIES } from '../constants';
import InfoTooltip from './InfoTooltip';

interface ProfileSetupProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ initialProfile, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>(initialProfile || {
    userId: crypto.randomUUID(),
    tin: '',
    incomeTypes: ['employment'],
    residencyStatus: 'resident',
    preferredLanguage: 'english',
    employmentDetails: [{ employer: '', grossSalary: 0, payeDeducted: 0, currency: 'NGN' }],
    businessDetails: { type: '', registrationNumber: '', income: 0, currency: 'NGN', expenses: [] },
    deductions: { pensionEnabled: true, nhfEnabled: false, lifeInsurance: 0, otherAllowances: 0 }
  });

  const toggleIncomeType = (type: IncomeType) => {
    setFormData(prev => ({
      ...prev,
      incomeTypes: prev.incomeTypes.includes(type)
        ? prev.incomeTypes.filter(t => t !== type)
        : [...prev.incomeTypes, type]
    }));
  };

  const updateEmployment = (index: number, field: keyof EmploymentDetail, value: any) => {
    const newDetails = [...formData.employmentDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, employmentDetails: newDetails });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tax Profile Builder</h2>
          <p className="text-slate-400 text-sm">Step {step} of 4</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-all ${step >= i ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">App Language</label>
                 <div className="flex gap-2">
                    {(['english', 'pidgin'] as Language[]).map(l => (
                      <button 
                        key={l}
                        onClick={() => setFormData({...formData, preferredLanguage: l})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${formData.preferredLanguage === l ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                      >
                        {l}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                Tax Identification Number (TIN)
                <InfoTooltip text="Unique identifier issued by FIRS/JTB. Required for all official filings." />
              </label>
              <input
                type="text"
                value={formData.tin}
                onChange={e => setFormData({ ...formData, tin: e.target.value })}
                placeholder="e.g., 23456789-0001"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Select Income Streams:</label>
              <div className="grid grid-cols-2 gap-4">
                {(['employment', 'business', 'rental', 'investment', 'digital_asset'] as IncomeType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => toggleIncomeType(type)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.incomeTypes.includes(type)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                      formData.incomeTypes.includes(type) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {formData.incomeTypes.includes(type) && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                    </div>
                    {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             {formData.incomeTypes.includes('employment') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Employment Income</h3>
                {formData.employmentDetails.map((emp, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        <label className="text-xs font-bold text-slate-500 uppercase">Employer</label>
                        <input
                          type="text"
                          value={emp.employer}
                          onChange={e => updateEmployment(idx, 'employer', e.target.value)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg mt-1 outline-none"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                        <select 
                          value={emp.currency}
                          onChange={e => updateEmployment(idx, 'currency', e.target.value)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg mt-1 outline-none"
                        >
                          <option value="NGN">NGN</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-xs font-bold text-slate-500 uppercase">
                          Annual Gross
                          <InfoTooltip text="Total earnings before any deductions (Pension, PAYE, etc)." />
                        </label>
                        <input
                          type="number"
                          value={emp.grossSalary}
                          onChange={e => updateEmployment(idx, 'grossSalary', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg mt-1 outline-none"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-xs font-bold text-slate-500 uppercase">
                          PAYE Paid
                          <InfoTooltip text="Tax already deducted by your employer at source." />
                        </label>
                        <input
                          type="number"
                          value={emp.payeDeducted}
                          onChange={e => updateEmployment(idx, 'payeDeducted', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg mt-1 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setFormData({...formData, employmentDetails: [...formData.employmentDetails, { employer: '', grossSalary: 0, payeDeducted: 0, currency: 'NGN' }]})} className="text-emerald-600 text-sm font-bold">+ Add Employer</button>
              </div>
             )}
             {formData.incomeTypes.includes('business') && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Business Revenue</h3>
                <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-2xl">
                   <div className="col-span-2">
                     <label className="flex items-center text-xs font-bold text-slate-500 uppercase">
                       Industry Category
                       <InfoTooltip text="Different industries have specific incentives under the 2025 Act." />
                     </label>
                     <select 
                        value={formData.businessDetails.type}
                        onChange={e => setFormData({...formData, businessDetails: {...formData.businessDetails, type: e.target.value}})}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl mt-1"
                      >
                        <option value="">Select Category</option>
                        {INDUSTRY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Annual Revenue</label>
                      <input
                        type="number"
                        value={formData.businessDetails.income}
                        onChange={e => setFormData({...formData, businessDetails: {...formData.businessDetails, income: Number(e.target.value)}})}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl mt-1"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                      <select 
                        value={formData.businessDetails.currency}
                        onChange={e => setFormData({...formData, businessDetails: {...formData.businessDetails, currency: e.target.value as any}})}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl mt-1"
                      >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                      </select>
                   </div>
                </div>
              </div>
             )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Deduction Optimizer</h3>
            <p className="text-sm text-slate-500">Legal ways to reduce your chargeable income. Check all that apply.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="flex items-center font-bold text-slate-800">
                    Pension Contribution (PENCOM)
                    <InfoTooltip text="Deductible before calculating tax (8% standard)." />
                  </h4>
                  <p className="text-xs text-slate-500">8% of basic salary contribution.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, deductions: {...formData.deductions, pensionEnabled: !formData.deductions.pensionEnabled}})}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.deductions.pensionEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.deductions.pensionEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="flex items-center font-bold text-slate-800">
                    National Housing Fund (NHF)
                    <InfoTooltip text="Statutory contribution that reduces your taxable base." />
                  </h4>
                  <p className="text-xs text-slate-500">2.5% contribution for housing loans.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, deductions: {...formData.deductions, nhfEnabled: !formData.deductions.nhfEnabled}})}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.deductions.nhfEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.deductions.nhfEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-2">
                  Life Insurance Premiums (Annual NGN)
                  <InfoTooltip text="Fully deductible under Section 20 if verifiable." />
                </label>
                <input
                  type="number"
                  value={formData.deductions.lifeInsurance}
                  onChange={e => setFormData({...formData, deductions: {...formData.deductions, lifeInsurance: Number(e.target.value)}})}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Configured & Ready!</h3>
            <p className="text-slate-600 max-w-sm mx-auto">
              We've applied the 2025 Tax Act rules to your specific profile. Your AI Assistant is now context-aware and ready to chat in {formData.preferredLanguage}.
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${step === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Previous
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-10 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-shadow shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => onSave(formData)}
              className="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-shadow shadow-md"
            >
              Finish Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
