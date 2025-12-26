
export type IncomeType = 'employment' | 'business' | 'rental' | 'investment' | 'digital_asset';
export type Language = 'english' | 'pidgin';
export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface EmploymentDetail {
  employer: string;
  grossSalary: number;
  payeDeducted: number;
  currency: Currency;
}

export interface BusinessDetail {
  type: string;
  registrationNumber: string;
  income: number;
  currency: Currency;
  expenses: { category: string; amount: number; receiptUrl?: string }[];
}

export interface Deductions {
  pensionEnabled: boolean;
  nhfEnabled: boolean;
  lifeInsurance: number;
  otherAllowances: number;
}

export interface UserProfile {
  userId: string;
  tin: string;
  incomeTypes: IncomeType[];
  residencyStatus: 'resident' | 'non-resident';
  employmentDetails: EmploymentDetail[];
  businessDetails: BusinessDetail;
  deductions: Deductions;
  preferredLanguage: Language;
}

export interface TaxResult {
  totalIncome: number;
  allowableDeductions: number;
  chargeableIncome: number;
  taxLiability: number;
  taxPayable: number;
  breakdown: { rate: string; amount: number }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ForumReply {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  time: string;
  category: 'General' | 'Business' | 'Digital Assets' | 'VAT';
  content: string;
  repliesList: ForumReply[];
}
