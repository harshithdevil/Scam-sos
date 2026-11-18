import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import type { ConsentStatus, ReportingProfileData } from '../types';
import {
  auth,
  deleteUserReportingProfile,
  googleProvider,
  loadUserReportingProfile,
  saveUserReportingProfile,
} from '../firebase';
import {
  EMPTY_REPORTING_PROFILE,
  type ProfileFieldKey,
  type ProfileValidationErrorCode,
  sanitizeReportingProfile,
  validateReportingProfile,
} from '../utils/profileValidation';

const CONSENT_STORAGE_KEY = 'scam_sos_consent';
const GUEST_PROFILE_STORAGE_KEY = 'scam_sos_guest_profile';

export type AuthErrorCode =
  | 'popup_closed'
  | 'popup_blocked'
  | 'session_expired'
  | 'unverified_email'
  | 'generic';

export type StorageLocation = 'account' | 'device' | 'none';

export interface SaveProfileOutcome {
  ok: boolean;
  fieldErrors?: Partial<Record<ProfileFieldKey, ProfileValidationErrorCode>>;
  syncError?: boolean;
}

interface ReportingProfileContextValue {
  user: User | null;
  authLoading: boolean;
  authActionLoading: boolean;
  authErrorCode: AuthErrorCode | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  consent: ConsentStatus;
  consentSheetOpen: boolean;
  openConsentSheet: () => void;
  closeConsentSheet: () => void;
  grantConsent: () => Promise<void>;
  declineConsent: () => Promise<void>;
  withdrawConsent: () => Promise<void>;
  profileSheetOpen: boolean;
  openReportingProfile: () => void;
  closeReportingProfile: () => void;
  profile: ReportingProfileData;
  profileLoading: boolean;
  profileSaving: boolean;
  profileSyncError: boolean;
  storageLocation: StorageLocation;
  saveProfile: (next: ReportingProfileData) => Promise<SaveProfileOutcome>;
  deleteAllMyData: () => Promise<void>;
}

const ReportingProfileContext = createContext<ReportingProfileContextValue | null>(null);

function readStoredConsent(): ConsentStatus {
  try {
    const val = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === 'allowed' || val === 'declined') return val;
  } catch {
    // Ignore storage failures
  }
  return 'undecided';
}

function readGuestProfile(): ReportingProfileData {
  try {
    const raw = window.localStorage.getItem(GUEST_PROFILE_STORAGE_KEY);
    if (!raw) return EMPTY_REPORTING_PROFILE;
    const parsed = JSON.parse(raw) as Partial<ReportingProfileData>;
    const sanitized = sanitizeReportingProfile({
      ...EMPTY_REPORTING_PROFILE,
      ...parsed,
    });
    const check = validateReportingProfile(sanitized);
    return check.valid ? sanitized : EMPTY_REPORTING_PROFILE;
  } catch {
    return EMPTY_REPORTING_PROFILE;
  }
}

function clearGuestProfileStorage(): void {
  try {
    window.localStorage.removeItem(GUEST_PROFILE_STORAGE_KEY);
  } catch {
    // Ignore storage failures
  }
}

function mapFirebaseAuthError(error: unknown): AuthErrorCode {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'popup_closed';
  }
  if (code === 'auth/popup-blocked') {
    return 'popup_blocked';
  }
  if (
    code === 'auth/user-token-expired' ||
    code === 'auth/requires-recent-login' ||
    code === 'auth/invalid-user-token'
  ) {
    return 'session_expired';
  }
  return 'generic';
}

export function ReportingProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authErrorCode, setAuthErrorCode] = useState<AuthErrorCode | null>(null);

  const [consent, setConsent] = useState<ConsentStatus>(() =>
    typeof window !== 'undefined' ? readStoredConsent() : 'undecided'
  );
  const [consentSheetOpen, setConsentSheetOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [pendingOpenProfile, setPendingOpenProfile] = useState(false);

  const [profile, setProfile] = useState<ReportingProfileData>(() => {
    if (typeof window === 'undefined') return EMPTY_REPORTING_PROFILE;
    return readStoredConsent() === 'allowed' ? readGuestProfile() : EMPTY_REPORTING_PROFILE;
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSyncError, setProfileSyncError] = useState(false);

  const clearAuthError = useCallback(() => {
    setAuthErrorCode(null);
  }, []);

  // Listen to Firebase Auth state changes cleanly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
      setProfileSyncError(false);

      if (!nextUser) {
        // Guest mode: only restore local guest profile if consent is allowed
        setProfile(readStoredConsent() === 'allowed' ? readGuestProfile() : EMPTY_REPORTING_PROFILE);
        return;
      }

      if (!nextUser.emailVerified) {
        setAuthErrorCode('unverified_email');
        setProfile(EMPTY_REPORTING_PROFILE);
        return;
      }

      if (readStoredConsent() !== 'allowed') {
        setProfile(EMPTY_REPORTING_PROFILE);
        return;
      }

      setProfileLoading(true);
      try {
        const cloudProfile = await loadUserReportingProfile(nextUser.uid);
        if (cloudProfile) {
          setProfile(cloudProfile);
        } else {
          setProfile(readGuestProfile());
        }
      } catch {
        setProfileSyncError(true);
      } finally {
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const persistConsent = useCallback((next: ConsentStatus) => {
    setConsent(next);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthErrorCode(null);
    setAuthActionLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (!cred.user.emailVerified) {
        setAuthErrorCode('unverified_email');
      }
    } catch (error) {
      setAuthErrorCode(mapFirebaseAuthError(error));
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthErrorCode(null);
    setProfileSyncError(false);
    setAuthActionLoading(true);
    try {
      await signOut(auth);
      setProfile(EMPTY_REPORTING_PROFILE);
    } catch {
      setAuthErrorCode('generic');
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const openConsentSheet = useCallback(() => {
    setPendingOpenProfile(false);
    setConsentSheetOpen(true);
  }, []);

  const closeConsentSheet = useCallback(() => {
    setConsentSheetOpen(false);
    setPendingOpenProfile(false);
  }, []);

  const openReportingProfile = useCallback(() => {
    if (consent !== 'allowed') {
      setPendingOpenProfile(true);
      setConsentSheetOpen(true);
      return;
    }
    setProfileSheetOpen(true);
  }, [consent]);

  const closeReportingProfile = useCallback(() => {
    setProfileSheetOpen(false);
  }, []);

  const grantConsent = useCallback(async () => {
    persistConsent('allowed');
    setConsentSheetOpen(false);

    if (user && user.emailVerified) {
      setProfileLoading(true);
      setProfileSyncError(false);
      try {
        const cloudProfile = await loadUserReportingProfile(user.uid);
        if (cloudProfile) {
          setProfile(cloudProfile);
        }
      } catch {
        setProfileSyncError(true);
      } finally {
        setProfileLoading(false);
      }
    } else {
      setProfile(readGuestProfile());
    }

    if (pendingOpenProfile) {
      setPendingOpenProfile(false);
      setProfileSheetOpen(true);
    }
  }, [pendingOpenProfile, persistConsent, user]);

  const deleteAllMyData = useCallback(async () => {
    setProfileSyncError(false);
    clearGuestProfileStorage();
    setProfile(EMPTY_REPORTING_PROFILE);

    if (user && user.emailVerified) {
      try {
        await deleteUserReportingProfile(user.uid);
      } catch {
        setProfileSyncError(true);
      }
    }
  }, [user]);

  const declineConsent = useCallback(async () => {
    persistConsent('declined');
    setConsentSheetOpen(false);
    setPendingOpenProfile(false);
    setProfileSheetOpen(false);
    await deleteAllMyData();
  }, [deleteAllMyData, persistConsent]);

  const withdrawConsent = useCallback(async () => {
    await declineConsent();
  }, [declineConsent]);

  const saveProfile = useCallback(
    async (next: ReportingProfileData): Promise<SaveProfileOutcome> => {
      if (consent !== 'allowed') {
        setPendingOpenProfile(true);
        setConsentSheetOpen(true);
        return { ok: false };
      }

      const sanitized = sanitizeReportingProfile(next);
      const validation = validateReportingProfile(sanitized);
      if (!validation.valid) {
        return { ok: false, fieldErrors: validation.errors };
      }

      setProfileSaving(true);
      setProfileSyncError(false);
      try {
        if (user && user.emailVerified) {
          const saved = await saveUserReportingProfile(user.uid, sanitized);
          clearGuestProfileStorage();
          setProfile(saved);
        } else {
          try {
            window.localStorage.setItem(GUEST_PROFILE_STORAGE_KEY, JSON.stringify(sanitized));
          } catch {
            // Keep in state even if localStorage quota fails
          }
          setProfile(sanitized);
        }
        return { ok: true };
      } catch {
        setProfileSyncError(true);
        return { ok: false, syncError: true };
      } finally {
        setProfileSaving(false);
      }
    },
    [consent, user]
  );

  const storageLocation: StorageLocation = useMemo(() => {
    if (consent !== 'allowed') return 'none';
    if (user && user.emailVerified) return 'account';
    return 'device';
  }, [consent, user]);

  const value = useMemo<ReportingProfileContextValue>(
    () => ({
      user,
      authLoading,
      authActionLoading,
      authErrorCode,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
      consent,
      consentSheetOpen,
      openConsentSheet,
      closeConsentSheet,
      grantConsent,
      declineConsent,
      withdrawConsent,
      profileSheetOpen,
      openReportingProfile,
      closeReportingProfile,
      profile,
      profileLoading,
      profileSaving,
      profileSyncError,
      storageLocation,
      saveProfile,
      deleteAllMyData,
    }),
    [
      authActionLoading,
      authErrorCode,
      authLoading,
      clearAuthError,
      closeConsentSheet,
      closeReportingProfile,
      consent,
      consentSheetOpen,
      declineConsent,
      deleteAllMyData,
      grantConsent,
      openConsentSheet,
      openReportingProfile,
      profile,
      profileLoading,
      profileSaving,
      profileSheetOpen,
      profileSyncError,
      saveProfile,
      signInWithGoogle,
      signOutUser,
      storageLocation,
      user,
      withdrawConsent,
    ]
  );

  return (
    <ReportingProfileContext.Provider value={value}>
      {children}
    </ReportingProfileContext.Provider>
  );
}

export function useReportingProfile(): ReportingProfileContextValue {
  const ctx = useContext(ReportingProfileContext);
  if (!ctx) {
    throw new Error('useReportingProfile must be used within a ReportingProfileProvider');
  }
  return ctx;
}
