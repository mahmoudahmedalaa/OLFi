export type Lang = 'en' | 'ar' | 'ur' | 'hi';

export type Screen =
  | 'welcome' | 'signup' | 'otp'
  | 'kyc_id' | 'kyc_face' | 'open_banking'
  | 'dashboard' | 'debt_detail'
  | 'marketplace' | 'offer_detail'
  | 'apply_status' | 'applications' | 'app_detail'
  | 'score' | 'profile';

export interface DebtData {
  id: string;
  type: string;
  bank: string;
  amount: number;
  rate: number;
  emi: number;
  remaining: number;
  color: string;
}

export interface OfferData {
  id: string;
  bank: string;
  type: string;
  apr: number;
  monthly: number;
  saving: number;
  score: number;
  approvalDays: number;
  tenure: number;
  color: string;
  featured: boolean;
}

export interface ApplicationData {
  id: string;
  bank: string;
  type: string;
  color: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  ref: string;
  amount: number;
  newEmi: number;
  saving: number;
  apr: number;
  tenure: number;
  appliedDate: string;
  acceptedDate?: string;
  declinedDate?: string;
  declineReason?: string;
  paidMonths: number;
  totalMonths: number;
  nextPayment?: string;
  nextAmount?: number;
  payments?: PaymentData[];
}

export interface PaymentData {
  month: string;
  amount: number;
  principal: number;
  profit: number;
  balance: number;
  status: string;
}

export interface ScoreData {
  olfiScore: number;
  cbuaeScore: number;
  loanRepayment: number;
  creditCard: number;
  billPayments: number;
  cashFlow: number;
  employment: number;
  spending: number;
  dbr: number;
}

export interface UserData {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: string;
  lang: string;
}

// Navigation props passed to every screen
export interface NavProps {
  navigate: (to: Screen, data?: unknown) => void;
  onTab: (id: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Record<string, string>;
  user?: UserData | null;
}
