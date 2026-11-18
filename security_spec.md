# Firestore Security Specification — Scam SOS Reporting Profile

## 1. Data Invariants
1. **Strict PII Isolation**: Every `ReportingProfile` document lives exclusively under `/users/{userId}/private/reportingProfile`. No user can read, list, write, or delete another user's document (`request.auth.uid == userId` AND `request.auth.token.email_verified == true`).
2. **Explicit Consent Gate**: `consentGranted` MUST be boolean `true` on every persisted write (`create` and `update`).
3. **No Sensitive Credential Storage**: `accountLast4` strictly matches `^([0-9]{4})?$` (max 4 digits). Full card numbers, full account numbers, OTPs, PINs, CVVs, passwords, Aadhaar, and PAN are never accepted.
4. **Immutable Ownership & Temporal Integrity**: `ownerId` MUST equal `request.auth.uid` and `userId` on create and remain immutable on update. `createdAt == request.time` on create and immutable on update; `updatedAt == request.time` on every write.
5. **No Blanket Reads or Queries**: `list` is explicitly denied (`allow list: if false;`). Only single-document `get` on `docId == 'reportingProfile'` by the owner is allowed.
6. **Zero Ghost Fields**: Strict `keys().hasAll(...) && keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. Unauthenticated read or write (`request.auth == null`).
2. Unverified email write (`request.auth.token.email_verified == false`).
3. Cross-user read/write (`/users/otherUid/private/reportingProfile`).
4. Collection `list` query on `/users/{uid}/private`.
5. Wrong `docId` (`/users/{uid}/private/anythingElse`).
6. Spoofed `ownerId` (`ownerId: "victim_other"`).
7. Consent bypassed (`consentGranted: false` or missing).
8. Ghost/shadow field injection (`{ ..., isAdmin: true, role: "admin" }`).
9. Full card/account number in `accountLast4` (`accountLast4: "4111111111111111"`).
10. Oversized `shortDescription` (`length > 500` Denial-of-Wallet payload).
11. Client-spoofed `createdAt` or `updatedAt` timestamp (`!= request.time`).
12. Mutating `ownerId` or `createdAt` on `update`.
