import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer, type Plugin } from 'vite';
import {
  analyzeMessageRuleBased,
  validateMessageInput,
} from './src/utils/scamDetector';
import type {
  CheckApiResponse,
  CheckResult,
  Language,
  RiskLevel,
  ScamCategory,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_LANGUAGES: Language[] = ['en', 'hi', 'te'];
const ALLOWED_CATEGORIES: ScamCategory[] = [
  'upi_collect_request',
  'fake_kyc',
  'otp_theft',
  'job_scam',
  'lottery_reward',
  'impersonation',
  'other_unclear',
];
const ALLOWED_RISKS: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];

const LANGUAGE_NAME: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi (Devanagari script)',
  te: 'Telugu (Telugu script)',
};

function hasValidApiKey(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key.length > 10);
}

const GEMINI_TIMEOUT_MS = 10_000;

async function analyzeWithGemini(message: string, lang: Language): Promise<CheckResult> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const targetLang = LANGUAGE_NAME[lang];
  const systemInstruction = `You are a fraud-triage classifier helping Indian cybercrime victims inspect suspicious SMS, WhatsApp, or email messages.
Analyze the user's message strictly and return structured JSON.
Rules:
1. Respond with "explanation" and "advice" strictly in ${targetLang}.
2. Classify "scamType" as one of: upi_collect_request, fake_kyc, otp_theft, job_scam, lottery_reward, impersonation, other_unclear.
3. Classify "riskLevel" as one of: Low, Medium, High, Critical, Unknown.
4. NEVER label an inconclusive, vague, or benign-looking message as "safe" in the explanation or riskLevel. If uncertain or lacking context, use riskLevel "Unknown" and explain that automated checks cannot confirm safety.
5. In "flaggedPhrases", return exact verbatim substrings copied from the input message (urls, urgency phrases, OTP/PIN requests, fake rewards, impersonated bank/agency names) so the UI can highlight them. Return [] if none.
6. Provide 2 to 4 concise, actionable bullet items in "advice" in ${targetLang}.`;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Gemini API timeout')), GEMINI_TIMEOUT_MS);
  });

  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: message,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scamType: {
              type: Type.STRING,
              enum: ALLOWED_CATEGORIES,
            },
            riskLevel: {
              type: Type.STRING,
              enum: ALLOWED_RISKS,
            },
            flaggedPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            explanation: {
              type: Type.STRING,
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['scamType', 'riskLevel', 'flaggedPhrases', 'explanation', 'advice'],
        },
      },
    }),
    timeoutPromise,
  ]);

  const rawText = (response.text ?? '').trim();
  const parsed = JSON.parse(rawText) as Partial<CheckResult>;

  const scamType: ScamCategory = ALLOWED_CATEGORIES.includes(parsed.scamType as ScamCategory)
    ? (parsed.scamType as ScamCategory)
    : 'other_unclear';

  let riskLevel: RiskLevel = ALLOWED_RISKS.includes(parsed.riskLevel as RiskLevel)
    ? (parsed.riskLevel as RiskLevel)
    : 'Unknown';

  // Enforce: never classify inconclusive as safe or leave empty explanation
  const explanation =
    typeof parsed.explanation === 'string' && parsed.explanation.trim().length > 0
      ? parsed.explanation.trim()
      : analyzeMessageRuleBased(message, lang).explanation;

  if (scamType === 'other_unclear' && riskLevel === 'Low') {
    riskLevel = 'Unknown';
  }

  const flaggedPhrases = Array.isArray(parsed.flaggedPhrases)
    ? parsed.flaggedPhrases
        .filter((p): p is string => typeof p === 'string' && p.trim().length >= 2)
        .map((p) => p.trim())
        .slice(0, 12)
    : [];

  const advice =
    Array.isArray(parsed.advice) && parsed.advice.length > 0
      ? parsed.advice
          .filter((a): a is string => typeof a === 'string' && a.trim().length > 0)
          .slice(0, 5)
      : analyzeMessageRuleBased(message, lang).advice;

  return {
    scamType,
    riskLevel,
    flaggedPhrases,
    explanation,
    advice,
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '64kb' }));

  // Never store or log message content
  app.post('/api/check-message', async (req, res) => {
    const body = req.body as { message?: unknown; language?: unknown } | undefined;
    const rawMessage = typeof body?.message === 'string' ? body.message : '';
    const lang: Language = ALLOWED_LANGUAGES.includes(body?.language as Language)
      ? (body?.language as Language)
      : 'en';

    const validation = validateMessageInput(rawMessage);
    if (!validation.valid) {
      res.status(400).json({
        error: validation.errorCode ?? 'invalid_input',
      });
      return;
    }

    if (!hasValidApiKey()) {
      const payload: CheckApiResponse = {
        mode: 'fallback',
        fallbackReason: 'no_key',
        result: analyzeMessageRuleBased(rawMessage, lang),
      };
      res.json(payload);
      return;
    }

    try {
      const result = await analyzeWithGemini(rawMessage, lang);
      const payload: CheckApiResponse = {
        mode: 'ai',
        result,
      };
      res.json(payload);
    } catch {
      const payload: CheckApiResponse = {
        mode: 'fallback',
        fallbackReason: 'api_error',
        result: analyzeMessageRuleBased(rawMessage, lang),
      };
      res.json(payload);
    }
  });

  // Never log request payloads or personal details
  app.post('/api/improve-complaint', async (req, res) => {
    const body = req.body as {
      language?: unknown;
      emailSubject?: unknown;
      emailBody?: unknown;
      sharedFields?: unknown;
    } | undefined;

    const lang: Language = ALLOWED_LANGUAGES.includes(body?.language as Language)
      ? (body?.language as Language)
      : 'en';

    const rawSubject = typeof body?.emailSubject === 'string' ? body.emailSubject.trim() : '';
    const rawBody = typeof body?.emailBody === 'string' ? body.emailBody.trim() : '';

    if (!rawBody || rawBody.length < 20 || rawBody.length > 6000 || rawSubject.length > 300) {
      res.status(400).json({ error: 'invalid_input' });
      return;
    }

    const forbiddenPattern =
      /\b(?:cvv|cvc|atm\s*pin|upi\s*pin|mpin|password|passcode)\b\s*[:=\-]?\s*[a-zA-Z0-9@#*$!]{2,}|\botp\b\s*[:=\-]\s*\d{4,8}\b|\b[A-Z]{5}[0-9]{4}[A-Z]\b/i;
    if (forbiddenPattern.test(rawBody) || forbiddenPattern.test(rawSubject)) {
      res.status(400).json({ error: 'forbidden_secret' });
      return;
    }

    if (!hasValidApiKey()) {
      res.status(503).json({ error: 'no_key' });
      return;
    }

    const safeFields =
      body?.sharedFields && typeof body.sharedFields === 'object' && !Array.isArray(body.sharedFields)
        ? Object.entries(body.sharedFields as Record<string, unknown>)
            .slice(0, 12)
            .filter(([, val]) => typeof val === 'string' && val.trim().length > 0)
            .map(([k, val]) => `${k.replace(/[^a-zA-Z0-9_]/g, '')}: ${String(val).replace(/[<>]/g, '').slice(0, 500)}`)
            .join('\n')
        : '';

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const targetLang = LANGUAGE_NAME[lang];
      const systemInstruction = `You are a careful financial cyber-fraud complaint editor helping an Indian scam victim polish their bank dispute email.
Rules:
1. Write both "emailSubject" and "emailBody" strictly in ${targetLang}.
2. Keep every factual detail (amounts, dates, UTR/transaction IDs, bank name, last 4 digits, scammer phone/UPI ID) accurate—never invent details or add fake claim numbers.
3. Keep the tone formal, clear, urgent, and respectful to a bank Nodal Officer / Fraud Dispute team.
4. NEVER promise a guaranteed refund, transaction reversal, or account freeze. Ask the bank to log the unauthorized transaction, secure compromised access, and provide a written dispute reference number.
5. Never ask for or insert OTPs, PINs, CVVs, passwords, Aadhaar, or full card numbers.
6. Return plain text only (no markdown formatting or HTML tags).`;

      const promptContent = `Current Subject:\n${rawSubject}\n\nCurrent Email Draft:\n${rawBody}${
        safeFields ? `\n\nProvided Context Fields:\n${safeFields}` : ''
      }`;

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API timeout')), GEMINI_TIMEOUT_MS);
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: promptContent,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                emailSubject: { type: Type.STRING },
                emailBody: { type: Type.STRING },
              },
              required: ['emailSubject', 'emailBody'],
            },
          },
        }),
        timeoutPromise,
      ]);

      const parsed = JSON.parse((response.text ?? '').trim()) as {
        emailSubject?: unknown;
        emailBody?: unknown;
      };

      const improvedSubject =
        typeof parsed.emailSubject === 'string' && parsed.emailSubject.trim()
          ? parsed.emailSubject.replace(/[<>]/g, '').trim().slice(0, 300)
          : rawSubject;
      const improvedBody =
        typeof parsed.emailBody === 'string' && parsed.emailBody.trim()
          ? parsed.emailBody.replace(/[<>]/g, '').trim().slice(0, 6000)
          : rawBody;

      res.json({
        mode: 'ai',
        emailSubject: improvedSubject,
        emailBody: improvedBody,
      });
    } catch {
      res.status(502).json({ error: 'api_error' });
    }
  });

  const httpServer = http.createServer(app);
  const hmrDisabled = process.env.DISABLE_HMR === 'true';

  if (process.env.NODE_ENV !== 'production') {
    const disableClientWsPlugin: Plugin = {
      name: 'disable-hmr-client-ws',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('vite/dist/client/client.mjs')) {
          return code.replace(
            /const createWebSocketModuleRunnerTransport = \(options\) => \{[\s\S]*?ws\?\.close\(\);\s*\},\s*send\(data\) \{\s*ws\.send\(JSON\.stringify\(data\)\);\s*\}\s*\};\s*\};/,
            `const createWebSocketModuleRunnerTransport = () => ({
              async connect({ onMessage }) {
                onMessage({ type: "custom", event: "vite:ws:connect", data: {} });
              },
              disconnect() {},
              send() {},
            });`
          );
        }
      },
    };

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        hmr: hmrDisabled ? false : { server: httpServer },
        ws: hmrDisabled ? false : { server: httpServer },
      },
      plugins: hmrDisabled ? [disableClientWsPlugin] : [],
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Scam SOS server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Scam SOS server:', err);
  process.exit(1);
});
