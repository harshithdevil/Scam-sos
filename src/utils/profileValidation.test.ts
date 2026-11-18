import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectForbiddenSecret,
  EMPTY_REPORTING_PROFILE,
  sanitizePlainText,
  sanitizeReportingProfile,
  validateProfileField,
  validateReportingProfile,
} from './profileValidation';

test('sanitizePlainText removes HTML angle brackets and control characters', () => {
  const clean = sanitizePlainText('  <script>alert(1)</script> SBI Bank\u0000  ', 80);
  assert.equal(clean, 'scriptalert(1)/script SBI Bank');
});

test('validateProfileField enforces last 4 digits only and valid optional fields', () => {
  assert.equal(validateProfileField('accountLast4', '4321'), null);
  assert.equal(validateProfileField('accountLast4', '123'), 'invalid_last4');
  assert.equal(validateProfileField('accountLast4', '4111111111111111'), 'too_long');
  assert.equal(validateProfileField('email', 'victim@example.com'), null);
  assert.equal(validateProfileField('email', 'not-an-email'), 'invalid_email');
  assert.equal(validateProfileField('phone', '+91 9876543210'), null);
  assert.equal(validateProfileField('phone', 'abc'), 'invalid_phone');
});

test('detectForbiddenSecret blocks OTP, PIN, CVV, Aadhaar-length numbers, and PAN', () => {
  assert.equal(detectForbiddenSecret('My UPI PIN 4455 was entered', 'shortDescription'), true);
  assert.equal(detectForbiddenSecret('CVV: 812', 'shortDescription'), true);
  assert.equal(detectForbiddenSecret('OTP: 491022', 'shortDescription'), true);
  assert.equal(detectForbiddenSecret('Aadhaar 4111 2222 3333', 'shortDescription'), true);
  assert.equal(detectForbiddenSecret('ABCDE1234F', 'shortDescription'), true);
  assert.equal(detectForbiddenSecret('Paid via PhonePe QR to merchant link', 'shortDescription'), false);
  // 12-digit UTR is explicitly permitted in transactionId field
  assert.equal(detectForbiddenSecret('412345678901', 'transactionId'), false);
});

test('validateReportingProfile accepts clean partial profiles and rejects unsafe fields', () => {
  const validProfile = sanitizeReportingProfile({
    ...EMPTY_REPORTING_PROFILE,
    fullName: 'Ramesh Kumar',
    bankName: 'HDFC Bank',
    accountLast4: '7890',
    amountLost: '15000',
    transactionId: 'UTR412345678901',
  });
  assert.equal(validateReportingProfile(validProfile).valid, true);

  const badProfile = {
    ...validProfile,
    shortDescription: 'Scammer asked my CVV 321 on call',
  };
  const check = validateReportingProfile(badProfile);
  assert.equal(check.valid, false);
  assert.equal(check.errors.shortDescription, 'forbidden_secret');
});
