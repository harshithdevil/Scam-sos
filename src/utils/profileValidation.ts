import type { ReportingProfileData } from '../types';

export const EMPTY_REPORTING_PROFILE: ReportingProfileData = {
  fullName: '',
  phone: '',
  email: '',
  cityState: '',
  bankName: '',
  accountLast4: '',
  scamDateTime: '',
  amountLost: '',
  transactionId: '',
  scammerContact: '',
  shortDescription: '',
};

export const PROFILE_LIMITS = {
  fullName: 100,
  phone: 20,
  email: 120,
  cityState: 100,
  bankName: 80,
  accountLast4: 4,
  scamDateTime: 60,
  amountLost: 20,
  transactionId: 60,
  scammerContact: 120,
  shortDescription: 500,
} as const;

export type ProfileFieldKey = keyof ReportingProfileData;

export type ProfileValidationErrorCode =
  | 'too_long'
  | 'invalid_phone'
  | 'invalid_email'
  | 'invalid_last4'
  | 'invalid_amount'
  | 'forbidden_secret';

/**
 * Strips ASCII control characters and angle brackets so interpolated text
 * remains strictly plain text when exported or displayed.
 */
export function sanitizePlainText(input: string, maxLength: number): string {
  const cleaned = input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Detects if user accidentally typed/pasted sensitive credentials
 * (OTP, PIN, CVV, password, 12-digit Aadhaar, 16-digit card number, or PAN).
 */
export function detectForbiddenSecret(value: string, field?: ProfileFieldKey): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Never allow long digit sequences in last4 or full card/Aadhaar numbers anywhere
  if (field === 'accountLast4' && trimmed.replace(/\D/g, '').length > 4) {
    return true;
  }

  // Detect 12-19 digit card/Aadhaar-like numbers (outside phone and transactionId UTRs)
  if (field !== 'transactionId' && field !== 'phone') {
    const collapsed = trimmed.replace(/[\s-]/g, '');
    if (/(?:^|\D)\d{12,19}(?:\D|$)/.test(collapsed)) {
      return true;
    }
  }

  // Detect Indian PAN format (ABCDE1234F)
  if (/\b[A-Z]{5}[0-9]{4}[A-Z]\b/i.test(trimmed)) {
    return true;
  }

  // Detect explicit credential assignments like "OTP: 4829", "CVV 123", "PIN = 1234", "password: xyz"
  if (/\b(?:cvv|cvc|atm\s*pin|upi\s*pin|mpin|password|passcode)\b\s*[:=\-]?\s*[a-zA-Z0-9@#*$!]{2,}/i.test(trimmed)) {
    return true;
  }
  if (/\botp\b\s*[:=\-]\s*\d{4,8}\b/i.test(trimmed)) {
    return true;
  }

  return false;
}

export function validateProfileField(
  field: ProfileFieldKey,
  rawValue: string
): ProfileValidationErrorCode | null {
  const val = rawValue.trim();
  const max = PROFILE_LIMITS[field];

  if (val.length > max) {
    return 'too_long';
  }

  if (!val) {
    return null; // All fields are optional
  }

  if (detectForbiddenSecret(val, field)) {
    return 'forbidden_secret';
  }

  switch (field) {
    case 'phone': {
      if (!/^[0-9+\-\s()]{6,20}$/.test(val)) {
        return 'invalid_phone';
      }
      const digits = val.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        return 'invalid_phone';
      }
      return null;
    }
    case 'email': {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        return 'invalid_email';
      }
      return null;
    }
    case 'accountLast4': {
      if (!/^[0-9]{4}$/.test(val)) {
        return 'invalid_last4';
      }
      return null;
    }
    case 'amountLost': {
      if (!/^[0-9.,]{1,20}$/.test(val)) {
        return 'invalid_amount';
      }
      const num = Number(val.replace(/,/g, ''));
      if (!Number.isFinite(num) || num < 0 || num > 1_000_000_000) {
        return 'invalid_amount';
      }
      return null;
    }
    default:
      return null;
  }
}

export function sanitizeReportingProfile(
  input: Partial<ReportingProfileData>
): ReportingProfileData {
  return {
    fullName: sanitizePlainText(input.fullName ?? '', PROFILE_LIMITS.fullName),
    phone: sanitizePlainText(input.phone ?? '', PROFILE_LIMITS.phone).replace(
      /[^0-9+\-\s()]/g,
      ''
    ),
    email: sanitizePlainText(input.email ?? '', PROFILE_LIMITS.email),
    cityState: sanitizePlainText(input.cityState ?? '', PROFILE_LIMITS.cityState),
    bankName: sanitizePlainText(input.bankName ?? '', PROFILE_LIMITS.bankName),
    accountLast4: sanitizePlainText(input.accountLast4 ?? '', PROFILE_LIMITS.accountLast4).replace(
      /\D/g,
      ''
    ),
    scamDateTime: sanitizePlainText(input.scamDateTime ?? '', PROFILE_LIMITS.scamDateTime),
    amountLost: sanitizePlainText(input.amountLost ?? '', PROFILE_LIMITS.amountLost).replace(
      /[^0-9.,]/g,
      ''
    ),
    transactionId: sanitizePlainText(input.transactionId ?? '', PROFILE_LIMITS.transactionId),
    scammerContact: sanitizePlainText(input.scammerContact ?? '', PROFILE_LIMITS.scammerContact),
    shortDescription: sanitizePlainText(
      input.shortDescription ?? '',
      PROFILE_LIMITS.shortDescription
    ),
  };
}

export function validateReportingProfile(
  profile: ReportingProfileData
): { valid: boolean; errors: Partial<Record<ProfileFieldKey, ProfileValidationErrorCode>> } {
  const errors: Partial<Record<ProfileFieldKey, ProfileValidationErrorCode>> = {};

  (Object.keys(EMPTY_REPORTING_PROFILE) as ProfileFieldKey[]).forEach((field) => {
    const err = validateProfileField(field, profile[field]);
    if (err) {
      errors[field] = err;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
