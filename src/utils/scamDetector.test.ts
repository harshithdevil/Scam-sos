import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeMessageRuleBased,
  highlightMessageSegments,
  MAX_MESSAGE_LENGTH,
  validateMessageInput,
} from './scamDetector';

test('validateMessageInput rejects empty, too short, and overly long strings', () => {
  assert.deepEqual(validateMessageInput('   '), { valid: false, errorCode: 'empty' });
  assert.deepEqual(validateMessageInput('hi'), { valid: false, errorCode: 'too_short' });
  assert.deepEqual(validateMessageInput('a'.repeat(MAX_MESSAGE_LENGTH + 1)), {
    valid: false,
    errorCode: 'too_long',
  });
  assert.deepEqual(validateMessageInput('Your KYC is suspended, update now.'), {
    valid: true,
  });
});

test('analyzeMessageRuleBased detects fake KYC with shortened link and urgency', () => {
  const msg =
    'URGENT: Your SBI KYC will be suspended within 2 hours. Update immediately at https://bit.ly/sbi-kyc-99';
  const res = analyzeMessageRuleBased(msg, 'en');
  assert.equal(res.scamType, 'fake_kyc');
  assert.ok(res.riskLevel === 'High' || res.riskLevel === 'Critical');
  assert.ok(res.flaggedPhrases.length >= 2);
});

test('analyzeMessageRuleBased detects UPI collect / PIN-to-receive scams in Hindi', () => {
  const msg = 'बधाई हो! ₹15,000 पैसे पाने के लिए तुरंत अपना यूपीआई पिन डालें और रिक्वेस्ट स्वीकार करें।';
  const res = analyzeMessageRuleBased(msg, 'hi');
  assert.equal(res.scamType, 'upi_collect_request');
  assert.ok(res.riskLevel !== 'Low');
});

test('analyzeMessageRuleBased never returns "safe" for brief/inconclusive inputs', () => {
  const res = analyzeMessageRuleBased('Hello?', 'en');
  assert.equal(res.riskLevel, 'Unknown');
  assert.ok(!res.explanation.toLowerCase().includes('this message is safe'));
});

test('highlightMessageSegments splits text without overlapping or losing characters', () => {
  const input = 'URGENT: Share your OTP at https://bit.ly/verify now.';
  const segments = highlightMessageSegments(input, ['URGENT', 'Share your OTP', 'https://bit.ly/verify']);
  const reconstructed = segments.map((s) => s.text).join('');
  assert.equal(reconstructed, input);
  const flaggedTexts = segments.filter((s) => s.flagged).map((s) => s.text);
  assert.ok(flaggedTexts.includes('URGENT'));
  assert.ok(flaggedTexts.includes('https://bit.ly/verify'));
});
