import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type { ReportingProfileData } from './types';
import {
  EMPTY_REPORTING_PROFILE,
  sanitizeReportingProfile,
  validateReportingProfile,
} from './utils/profileValidation';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) ?? [],
    },
    operationType,
    path,
  };
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase connection unavailable: client is offline.');
    }
  }
}

if (typeof window !== 'undefined') {
  void testConnection();
}

function getProfileDocPath(uid: string): string {
  return `users/${uid}/private/reportingProfile`;
}

export async function loadUserReportingProfile(
  uid: string
): Promise<ReportingProfileData | null> {
  const path = getProfileDocPath(uid);
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'private', 'reportingProfile'));
    if (!snap.exists()) {
      return null;
    }
    const raw = snap.data() as Partial<ReportingProfileData>;
    return sanitizeReportingProfile({
      ...EMPTY_REPORTING_PROFILE,
      ...raw,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserReportingProfile(
  uid: string,
  profile: ReportingProfileData
): Promise<ReportingProfileData> {
  const sanitized = sanitizeReportingProfile(profile);
  const validation = validateReportingProfile(sanitized);
  if (!validation.valid) {
    throw new Error('PROFILE_VALIDATION_FAILED');
  }

  const path = getProfileDocPath(uid);
  const ref = doc(db, 'users', uid, 'private', 'reportingProfile');

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await setDoc(
        ref,
        {
          ...sanitized,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await setDoc(ref, {
        ownerId: uid,
        consentGranted: true,
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return sanitized;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserReportingProfile(uid: string): Promise<void> {
  const path = getProfileDocPath(uid);
  try {
    await deleteDoc(doc(db, 'users', uid, 'private', 'reportingProfile'));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
