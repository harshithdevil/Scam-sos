# Scam SOS

**Scammed? Act in the first 60 minutes.**

Scam SOS helps Indian scam victims in the first hour after a UPI, OTP or phishing scam. It gives an emergency action plan, a 1930 helpline script, a bank dispute email generator and a scam message checker. Built for the HackWithAditya hackathon by team Cyber shield, under the "Cybersecurity, FinTech & Digital Trust" theme.

## Live demo
https://scam-sos.ai.studio/

## The problem
Most victims don't know whom to call, what to say, or what evidence to keep. Existing tools only detect scams. None guide the victim through reporting.

## What it does
- **Message checker:** paste an SMS, WhatsApp or email message. Get a scam type, risk level, flagged phrases and plain-language advice.
- **SOS flow:** choose what happened and enter the amount and time. Get an urgency-ordered action plan, a 30-second 1930 call script, an editable bank complaint email and an evidence checklist.
- **Reporting profile (optional):** consent-based, minimal details used to prefill the call script and complaint email. Guests: saved on this device only. Signed in with Google: saved to your account. Deletable anytime.
- **Languages:** English, Hindi, Telugu.
- **Resources:** official links (helpline 1930, cybercrime.gov.in).

## What it does NOT do
- It does **not** submit reports to 1930, cybercrime.gov.in, your bank or the police. It only prepares your details.
- It cannot recover or freeze money. Faster reporting gives your bank the best chance to act, with no guarantee.
- A "Low" risk result is not a safety guarantee.

## Tech stack
React, TypeScript, Tailwind CSS, Node server, Gemini API, Firebase (Auth, Firestore), built in Google AI Studio.

## Run locally
1. Clone the repo: `git clone https://github.com/harshithdevil/Scam-sos.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your own `GEMINI_API_KEY` (in AI Studio, add it in the Secrets panel instead)
4. Start the app: `npm run dev`

Without an API key, the checker runs in a labeled **rule-based fallback mode**.

## Privacy and data
- Message text is not stored by Scam SOS. When AI mode is on, the text is sent to the Gemini API for analysis.
- The reporting profile is optional, needs explicit consent, and can be deleted at any time.
- Never collected: OTPs, PINs, passwords, CVV, full card or account numbers, Aadhaar or PAN.
- No API keys are stored in this repository.

## Known limitations
- Rule-based fallback can give false positives and misses.
- Hindi and Telugu output is machine-generated and not reviewed by native speakers.
- The request cap is basic, not a hardened abuse control.
- Prototype only: not tested with real victims and not reviewed by a security auditor.

## Team
Cyber shield: Harshith Krishna, Durga, Sanjay, Monish. MRTC, Hyderabad.

## Disclaimer
Scam SOS speeds up reporting. It cannot replace your bank or the police. In an emergency, call 1930.

## License
MIT License. See the [LICENSE](LICENSE) file.
