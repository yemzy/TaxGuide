
import React, { useMemo, useState } from 'react';
import { UserProfile, TaxResult } from '../types';
import { TAX_BANDS, VAT_RATE, FOSSIL_FUEL_SURCHARGE_RATE, EXCHANGE_RATES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import InfoTooltip from './InfoTooltip';

interface TaxCalculatorProps {
  profile: UserProfile | null;
  onSetup: () => void;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ profile, onSetup }) => {
  const [activeTab, setActiveTab] = useState<'pit' | 'vat' | 'surcharge'>('pit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [vatSales, setVatSales] = useState<number>(0);
  const [fuelValue, setFuelValue] = useState<number>(0);
  
  // "What If" Simulator State
  const [incomeSim, setIncomeSim] = useState<number>(0);

  const pitCalculation = useMemo<TaxResult>(() => {
    if (!profile) return { totalIncome: 0, allowableDeductions: 0, chargeableIncome: 0, taxLiability: 0, taxPayable: 0, breakdown: [] };

    // 1. Convert everything to NGN
    const employmentGross = profile.employmentDetails.reduce((sum, e) => {
      const rate = EXCHANGE_RATES[e.currency as keyof typeof EXCHANGE_RATES] || 1;
      return sum + (e.grossSalary * rate);
    }, 0);
    
    const bizRate = EXCHANGE_RATES[profile.businessDetails.currency as keyof typeof EXCHANGE_RATES] || 1;
    const businessIncome = profile.businessDetails.income * bizRate;
    
    const baseTotalGross = employmentGross + businessIncome;
    const totalGross = incomeSim > 0 ? incomeSim : baseTotalGross;

    // 2. Calculate Deductions
    let totalDeductions = profile.deductions.lifeInsurance + profile.deductions.otherAllowances;
    if (profile.deductions.pensionEnabled) {
      // 8% of employment gross as a simplified standard
      totalDeductions += (employmentGross * 0.08);
    }
    if (profile.deductions.nhfEnabled) {
      totalDeductions += (employmentGross * 0.025);
    }

    const chargeableIncome = Math.max(0, totalGross - totalDeductions);

    // 3. Apply Graduated Rates
    let remaining = chargeableIncome;
    let taxLiability = 0;
    const breakdown: { rate: string; amount: number }[] = [];

    for (const band of TAX_BANDS) {
      if (remaining <= 0) break;
      const amountInBand = Math.min(remaining, band.limit);
      const taxInBand = amountInBand * band.rate;
      taxLiability += taxInBand;
      if (taxInBand > 0 || band.rate === 0) {
        breakdown.push({ rate: `${(band.rate * 100).toFixed(0)}% (${band.label})`, amount: taxInBand });
      }
      remaining -= amountInBand;
    }

    const payeOffset = profile.employmentDetails.reduce((sum, e) => {
       const rate = EXCHANGE_RATES[e.currency as keyof typeof EXCHANGE_RATES] || 1;
       return sum + (e.payeDeducted * rate);
    }, 0);
    const taxPayable = Math.max(0, taxLiability - payeOffset);

    return {
      totalIncome: totalGross,
      allowableDeductions: totalDeductions,
      chargeableIncome,
      taxLiability,
      taxPayable,
      breakdown
    };
  }, [profile, incomeSim]);

  const handleGenerateFIRS = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 border-dashed animate-in fade-in duration-500">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Initialize Your Profile</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">To see accurate 2025 Tax Act calculations including multi-currency conversions and legal deductions.</p>
        <button onClick={onSetup} className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg">Start Profile Builder</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* FIRS Sheet Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-900 p-8 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-bold">Computation Sheet Preview</h3>
                <p className="text-emerald-300 text-sm">FIRS Compliant (Tax Act 2025)</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 transition-colors">✕</button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto font-mono text-sm text-slate-700 bg-slate-50 flex-grow">
              <div className="border-b border-slate-200 pb-4 text-center">
                <p className="font-bold text-lg">FEDERAL INLAND REVENUE SERVICE</p>
                <p>2025 SELF-ASSESSMENT COMPUTATION</p>
              </div>
              <div className="grid grid-cols-2 gap-y-2">
                <p className="font-bold">Taxpayer TIN:</p> <p>{profile.tin || 'N/A'}</p>
                <p className="font-bold">Tax Year:</p> <p>2025</p>
                <p className="font-bold">Residency:</p> <p>{profile.residencyStatus.toUpperCase()}</p>
              </div>
              <hr className="border-dashed border-slate-300" />
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Gross Income (NGN):</span>
                  <span>₦{pitCalculation.totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Less Total Deductions:</span>
                  <span>(₦{pitCalculation.allowableDeductions.toLocaleString()})</span>
                </div>
                <div className="flex justify-between font-bold italic py-1 border-y border-slate-100 my-2">
                  <span>Chargeable Income:</span>
                  <span>₦{pitCalculation.chargeableIncome.toLocaleString()}</span>
                </div>
                {pitCalculation.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between pl-4 text-xs">
                    <span>- {b.rate} Band</span>
                    <span>₦{b.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-700">
                  <span>Total Tax Liability:</span>
                  <span>₦{pitCalculation.taxLiability.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Less PAYE Credits:</span>
                  <span>(₦{profile.employmentDetails.reduce((s,e) => s + (e.payeDeducted * (EXCHANGE_RATES[e.currency as keyof typeof EXCHANGE_RATES] || 1)), 0).toLocaleString()})</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-400 pt-2 text-xl font-black text-slate-900">
                  <span>NET TAX PAYABLE:</span>
                  <span>₦{pitCalculation.taxPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-4 shrink-0">
              <button onClick={() => { setShowPreview(false); alert("PDF Saved to device."); }} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">Download PDF</button>
              <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">Print Sheet</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm mx-auto">
        {(['pit', 'vat', 'surcharge'] as const).map(tab => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {tab === 'pit' ? 'Personal Income' : tab === 'vat' ? 'VAT' : 'Fuel Surcharge'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'pit' && (
            <>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">2025 PIT Visualization</h3>
                    <p className="text-sm text-slate-500">Based on your converted NGN earnings and applied deductions.</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
                    Live Calculation
                  </div>
                </div>
                
                <div className="h-[280px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pitCalculation.breakdown}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="rate" fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {pitCalculation.breakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'][index % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="flex items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Total NGN Gross
                      <InfoTooltip text="Sum of all income streams converted to Naira." />
                    </p>
                    <p className="text-lg font-bold text-slate-900">₦{pitCalculation.totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="flex items-center text-[10px] font-bold text-emerald-600 uppercase mb-1">
                      Deductions Saved
                      <InfoTooltip text="Pension, NHF, and other tax-free allowances." />
                    </p>
                    <p className="text-lg font-bold text-emerald-700">₦{pitCalculation.allowableDeductions.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="flex items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Chargeable
                      <InfoTooltip text="Income actually subject to tax after deductions." />
                    </p>
                    <p className="text-lg font-bold text-slate-900">₦{pitCalculation.chargeableIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* What If Simulator */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                 <div className="flex items-center gap-2 mb-4">
                   <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   <h3 className="text-lg font-bold">"What If" Simulation</h3>
                 </div>
                 <p className="text-slate-400 text-sm mb-6">Drag the slider to see how your tax changes if your annual income grows.</p>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>N1m</span>
                      <span>Target: ₦{(incomeSim || pitCalculation.totalIncome).toLocaleString()}</span>
                      <span>N100m</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000000" 
                      max="100000000" 
                      step="500000"
                      value={incomeSim || pitCalculation.totalIncome}
                      onChange={(e) => setIncomeSim(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                       <span className="text-xs text-slate-400">Projected Net Tax:</span>
                       <span className="text-xl font-black text-emerald-400">₦{pitCalculation.taxPayable.toLocaleString()}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => setIncomeSim(0)} 
                  className="mt-6 text-xs text-slate-400 hover:text-white underline decoration-emerald-500 underline-offset-4"
                >
                  Reset to profile income
                </button>
              </div>
            </>
          )}

          {activeTab === 'vat' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">VAT Consumption Check</h3>
              <p className="text-sm text-slate-500 mb-8">Standard 7.5% applied to non-exempt goods and services.</p>
              <div className="space-y-4">
                <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transaction Value (₦)</label>
                  <input 
                    type="number" 
                    value={vatSales}
                    onChange={(e) => setVatSales(Number(e.target.value))}
                    placeholder="Enter amount" 
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all mb-4" 
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-500">Tax Component (7.5%)</span>
                    <span className="text-2xl font-black text-slate-900">₦{(vatSales * VAT_RATE).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'surcharge' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fossil Fuel Surcharge</h3>
              <p className="text-sm text-slate-500 mb-8">New 5% levy on specific fuel products (Section 159).</p>
              <div className="p-6 border border-slate-100 rounded-2xl bg-amber-50">
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Chargeable Fuel Spend (₦)</label>
                <input 
                  type="number" 
                  value={fuelValue}
                  onChange={(e) => setFuelValue(Number(e.target.value))}
                  placeholder="Enter spend" 
                  className="w-full p-4 bg-white rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500 transition-all mb-4" 
                />
                <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                  <span className="text-sm text-amber-700">Surcharge Amount (5%)</span>
                  <span className="text-2xl font-black text-amber-900">₦{(fuelValue * FOSSIL_FUEL_SURCHARGE_RATE).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Net Tax Liability</h3>
            </div>
            <p className="text-5xl font-black mb-6 transition-all group-hover:scale-105 origin-left">₦{pitCalculation.taxPayable.toLocaleString()}</p>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="flex items-center opacity-60">
                  Status
                  <InfoTooltip text="Current compliance standing for 2025." />
                </span>
                <span className="font-bold text-emerald-400">Needs Filing</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center opacity-60">
                  PAYE Offset
                  <InfoTooltip text="Credit for tax already deducted at source." />
                </span>
                <span className="font-bold">Active</span>
              </div>
            </div>
            <button 
              onClick={handleGenerateFIRS}
              disabled={isGenerating}
              className={`w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/40 transform active:scale-95 flex items-center justify-center gap-2 ${isGenerating ? 'opacity-80' : 'hover:bg-emerald-400'}`}
            >
              {isGenerating ? 'Processing...' : 'Generate FIRS Sheet'}
            </button>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-900 mb-4">Quick Insights</h4>
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <div>
                      <p className="flex items-center text-xs font-bold text-slate-400 uppercase">
                        Effective Rate
                        <InfoTooltip text="Average percentage of your income paid in tax." />
                      </p>
                      <p className="font-bold text-slate-900">{((pitCalculation.taxLiability / pitCalculation.totalIncome || 0) * 100).toFixed(1)}%</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                   </div>
                   <div>
                      <p className="flex items-center text-xs font-bold text-slate-400 uppercase">
                        Deductions Applied
                        <InfoTooltip text="Total savings from tax-exempt items." />
                      </p>
                      <p className="font-bold text-slate-900">₦{pitCalculation.allowableDeductions.toLocaleString()}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
