import test from 'node:test';
import assert from 'node:assert/strict';
import { formatInrAmount, generateSosPlan, validateSosInput } from './sosGenerator';

test('validateSosInput requires incident selection and valid non-negative amount', () => {
  const emptyRes = validateSosInput({
    incidents: [],
    amountLost: '',
    timeSince: 'under_15m',
  });
  assert.equal(emptyRes.valid, false);
  assert.equal(emptyRes.errors.incidents, 'required');
  assert.equal(emptyRes.errors.amountLost, 'required');

  const invalidAmount = validateSosInput({
    incidents: ['paid_upi'],
    amountLost: '-500',
    timeSince: 'under_15m',
  });
  assert.equal(invalidAmount.valid, false);
  assert.equal(invalidAmount.errors.amountLost, 'invalid');

  const validRes = validateSosInput({
    incidents: ['paid_upi', 'shared_otp'],
    amountLost: '25000',
    timeSince: 'under_15m',
  });
  assert.equal(validRes.valid, true);
});

test('generateSosPlan injects exact user inputs into email and 1930 script across languages', () => {
  const formData = {
    incidents: ['paid_upi', 'shared_otp'] as const,
    amountLost: '25000',
    timeSince: 'under_15m' as const,
  };

  assert.equal(formatInrAmount('25000'), '₹25,000');

  const enPlan = generateSosPlan({ ...formData, incidents: [...formData.incidents] }, 'en');
  assert.equal(enPlan.steps[0].priority, 1);
  assert.ok(enPlan.steps[0].title.includes('1930'));
  assert.ok(enPlan.emailBody.includes('₹25,000'));
  assert.ok(enPlan.emailBody.includes('Paid via UPI'));
  assert.ok(enPlan.emailBody.includes('Under 15 minutes ago'));
  assert.ok(enPlan.callScript.includes('₹25,000'));
  assert.equal(enPlan.evidenceItems.length, 5);

  const hiPlan = generateSosPlan({ ...formData, incidents: [...formData.incidents] }, 'hi');
  assert.ok(hiPlan.emailBody.includes('₹25,000'));
  assert.ok(hiPlan.callScript.includes('15 मिनट से कम समय पहले'));

  const tePlan = generateSosPlan({ ...formData, incidents: [...formData.incidents] }, 'te');
  assert.ok(tePlan.emailBody.includes('₹25,000'));
  assert.ok(tePlan.callScript.includes('15 నిమిషాల లోపు'));
});

test('generateSosPlan prefills ReportingProfile details cleanly into email, script, and checklist', () => {
  const plan = generateSosPlan(
    {
      incidents: ['paid_upi'],
      amountLost: '12000',
      timeSince: 'under_15m',
    },
    'en',
    {
      fullName: 'Anil Sharma',
      phone: '+91 9876543210',
      email: 'anil@example.com',
      cityState: 'Hyderabad, Telangana',
      bankName: 'SBI',
      accountLast4: '4321',
      scamDateTime: '18 Nov 2026, 05:10 PM',
      transactionId: 'UTR412345678901',
      scammerContact: 'scammer@okaxis',
      shortDescription: 'Fake KYC link followed by UPI collect',
    }
  );

  assert.ok(plan.emailBody.includes('SBI'));
  assert.ok(plan.emailBody.includes('XXXX4321'));
  assert.ok(plan.emailBody.includes('UTR412345678901'));
  assert.ok(plan.emailBody.includes('scammer@okaxis'));
  assert.ok(plan.emailBody.includes('Anil Sharma'));
  assert.ok(plan.callScript.includes('Anil Sharma'));
  assert.ok(plan.callScript.includes('UTR412345678901'));
  assert.ok(plan.evidenceItems.find((e) => e.id === 'utr')?.hint.includes('UTR412345678901'));
});
