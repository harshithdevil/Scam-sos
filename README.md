# Scam SOS

**Scammed? Act in the first 60 minutes.**

Scam SOS helps Indian scam victims in the first hour after a UPI, OTP or phishing scam. Built for the HackWithAditya hackathon by team Cyber shield, under the "Cybersecurity, FinTech & Digital Trust" theme.

## The problem
Most victims don't know whom to call, what to say, or what evidence to keep. Existing tools only detect scams. None guide the victim through reporting.

## What it does
- **Message checker:** paste an SMS/WhatsApp/email. Get a scam type, risk level, flagged phrases and plain-language advice.
- **SOS flow:** choose what happened, enter amount and time. Get an urgency-ordered action plan, a 30-second 1930 call script, an editable bank complaint email, and an evidence checklist.
- **Reporting profile (optional):** consent-based, minimal details to prefill the script and email. [Saved on device only / saved to account: pick one]
- **Languages:** English, Hindi, Telugu.
- **Resources:** official links (1930, cybercrime.gov.in).

## What it does NOT do
- It does **not** submit reports to 1930, cybercrime.gov.in, your bank or the police. It only prepares your details.
- It cannot recover or freeze money. Faster reporting gives your bank the best chance to act, with no guarantee.
- A "Low" risk result is not a safety guarantee.

## Tech stack
React, Tailwind, Gemini API, Firebase Auth used, built in Google AI Studio.

## Run locally
1. Clone the repo: `git clone [your-repo-url]`
2. Install: `npm install`
3. Copy `.env.example` to `.env` and add your own `GEMINI_API_KEY`
4. Start: `npm run dev`

Without an API key the checker runs in a labeled **rule-based fallback mode**.

## Privacy and data
- Message text is not stored.
- The reporting profile is optional, requires explicit consent, and can be deleted at any time.
- Never collected: OTPs, PINs, passwords, CVV, full card or account numbers, Aadhaar or PAN.

## Known limitations
- Rule-based fallback can give false positives and misses.
- Hindi/Telugu output is machine-generated and not reviewed by native speakers.
- Request cap is basic, not a hardened abuse control.
- [Add anything else that's true.]

## prototype 
Link to website 🔗[https://scam-sos.ai.studio/]

## Team
Cyber shield: 
Harshith krishna, Durga, sanjay ,monish.
MRTC, Hyderabad.

## Disclaimer
Scam SOS speeds up reporting. It cannot replace your bank or the police. In an emergency, call 1930.
