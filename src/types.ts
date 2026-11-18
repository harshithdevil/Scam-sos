export type Language = 'en' | 'hi' | 'te';

export type RoutePath = '/' | '/check' | '/sos' | '/resources' | '/about';

export type ScamCategory =
  | 'upi_collect_request'
  | 'fake_kyc'
  | 'otp_theft'
  | 'job_scam'
  | 'lottery_reward'
  | 'impersonation'
  | 'other_unclear';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';

export type AnalysisMode = 'ai' | 'fallback';

export interface CheckResult {
  scamType: ScamCategory;
  riskLevel: RiskLevel;
  flaggedPhrases: string[];
  explanation: string;
  advice: string[];
}

export interface CheckApiResponse {
  mode: AnalysisMode;
  fallbackReason?: 'no_key' | 'api_error';
  result: CheckResult;
}

export type SosIncidentType =
  | 'shared_otp'
  | 'paid_upi'
  | 'clicked_link'
  | 'shared_card'
  | 'account_hacked'
  | 'other';

export type SosTimeWindow =
  | 'under_15m'
  | '15m_to_1h'
  | '1h_to_6h'
  | 'over_6h';

export interface SosFormData {
  incidents: SosIncidentType[];
  amountLost: string;
  timeSince: SosTimeWindow;
}

export interface SosActionStep {
  id: string;
  priority: number;
  title: string;
  summary: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface SosEvidenceItem {
  id: string;
  label: string;
  hint: string;
}

export interface SosGeneratedOutput {
  steps: SosActionStep[];
  emailSubject: string;
  emailBody: string;
  callScript: string;
  evidenceItems: SosEvidenceItem[];
  urgencyNote: string;
}

export type ConsentStatus = 'undecided' | 'allowed' | 'declined';

export interface ReportingProfileData {
  fullName: string;
  phone: string;
  email: string;
  cityState: string;
  bankName: string;
  accountLast4: string;
  scamDateTime: string;
  amountLost: string;
  transactionId: string;
  scammerContact: string;
  shortDescription: string;
}
