import type { CheckResult, Language, RiskLevel, ScamCategory } from '../types';

export const MAX_MESSAGE_LENGTH = 4000;
export const MIN_MESSAGE_LENGTH = 6;

export interface ValidationResult {
  valid: boolean;
  errorCode?: 'empty' | 'too_short' | 'too_long';
}

export function validateMessageInput(rawText: string): ValidationResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { valid: false, errorCode: 'empty' };
  }
  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return { valid: false, errorCode: 'too_short' };
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, errorCode: 'too_long' };
  }
  return { valid: true };
}

interface SignalRule {
  category: ScamCategory | 'urgency' | 'suspicious_link';
  weight: number;
  patterns: RegExp[];
}

const RULES: SignalRule[] = [
  {
    category: 'otp_theft',
    weight: 4,
    patterns: [
      /\b(share|send|tell|provide|verify|enter|confirm)\s+(your\s+)?(otp|pin|mpin|upi\s*pin|cvv|atm\s*pin|password)\b/i,
      /\b(otp|cvv|mpin|upi\s*pin)\b.{0,25}\b(share|expire|verify|call|send|required)\b/i,
      /ओटीपी|एमपिन|यूपीआई\s*पिन|ఓటీపీ|పిన్/i,
    ],
  },
  {
    category: 'upi_collect_request',
    weight: 4,
    patterns: [
      /\b(upi|gpay|phonepe|paytm|bhim)\b.{0,40}\b(accept|approve|collect|request|pin\s*to\s*receive|scan\s*qr|receive\s*(money|cash|rs|₹))\b/i,
      /\b(enter\s*(your\s*)?(upi\s*)?pin\s*to\s*(receive|claim|get))\b/i,
      /\b(collect\s*request|pay\s*request|cashback\s*credited\s*approve)\b/i,
      /यूपीआई\s*पिन\s*डालें|पैसे\s*पाने\s*के\s*लिए|యూపీఐ\s*పిన్/i,
    ],
  },
  {
    category: 'fake_kyc',
    weight: 3,
    patterns: [
      /\b(kyc|pan\s*card|aadhaar|aadhar|e-kyc|re-kyc)\b.{0,40}\b(suspend|block|expire|update|verify|deactivat|hold|freeze|pending)\b/i,
      /\b(account|sim|card|wallet|electricity|power)\s*(will\s*be\s*|has\s*been\s*)?(blocked|suspended|disconnected|terminated|frozen|closed)\b/i,
      /केवाईसी\s*(अपडेट|बंद|ब्लॉक)|खाता\s*बंद|కేవైసీ\s*(అప్డేట్|బ్లాక్)/i,
    ],
  },
  {
    category: 'lottery_reward',
    weight: 3,
    patterns: [
      /\b(congratulations|winner|won|lottery|jackpot|lucky\s*draw|scratch\s*card|cash\s*prize|bumper\s*offer)\b/i,
      /\b(claim\s*(your\s*)?(prize|reward|bonus|refund|cashback|gift))\b/i,
      /लॉटरी|इनाम|लाख\s*जीते|లాటరీ|బహుమతి/i,
    ],
  },
  {
    category: 'job_scam',
    weight: 3,
    patterns: [
      /\b(part[- ]?time\s*job|work\s*from\s*home|earn\s*(rs\.?|₹|inr)?\s*\d[\d,]*\s*(per\s*day|daily|weekly)|like\s*youtube|review\s*tasks?|prepaid\s*task|telegram\s*hr)\b/i,
      /घर\s*बैठे\s*कमाएं|पार्ट\s*टाइम\s*जॉब|ఇంటి\s*నుండే\s*సంపాదించండి/i,
    ],
  },
  {
    category: 'impersonation',
    weight: 3,
    patterns: [
      /\b(rbi|reserve\s*bank|trai|cbi|ncb|police|cyber\s*cell|income\s*tax|customs|fedex|dhl|digital\s*arrest|sbi|hdfc|icici|axis)\b.{0,50}\b(warrant|case|parcel|seized|arrest|freeze|fine|notice|officer|verification)\b/i,
      /\b(digital\s*arrest|parcel\s*contained|drugs\s*found|money\s*laundering|aadhaar\s*misuse)\b/i,
      /पुलिस|साइबर\s*क्राइम|डिजिटल\s*अरेस्ट|आरबीआई|పోలీసు|డిజిటల్\s*అరెస్ట్/i,
    ],
  },
  {
    category: 'urgency',
    weight: 2,
    patterns: [
      /\b(urgent|immediately|within\s*\d+\s*(min|minute|minutes|hr|hour|hours)|today\s*only|last\s*warning|final\s*notice|act\s*now|right\s*now|avoid\s*penalty)\b/i,
      /तुरंत|अभी\s*करें|अंतिम\s*चेतावनी|24\s*घंटे|తక్షణమే|వెంటనే|చివరి\s*హెచ్చరిక/i,
    ],
  },
  {
    category: 'suspicious_link',
    weight: 2,
    patterns: [
      /https?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|shorturl\.at|is\.gd|goo\.gl)\/\S+/i,
      /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}\S*/i,
      /https?:\/\/[^\s]*\.(?:xyz|top|tk|ml|ga|cf|gq|click|buzz|vip|loan|online)\b[^\s]*/i,
      /\b(?:bit\.ly|tinyurl\.com|cutt\.ly)\/\S+/i,
      /https?:\/\/[^\s]*(?:kyc|verify|update-bank|upi-claim|reward-claim)[^\s]*/i,
    ],
  },
];

interface LocalizedCopy {
  categoryLabels: Record<ScamCategory, string>;
  explanations: Record<ScamCategory, string>;
  unknownExplanation: string;
  lowExplanation: string;
  adviceByRisk: {
    highOrCritical: string[];
    medium: string[];
    lowOrUnknown: string[];
  };
}

const COPY: Record<Language, LocalizedCopy> = {
  en: {
    categoryLabels: {
      upi_collect_request: 'UPI Collect / QR Scam',
      fake_kyc: 'Fake KYC / Account Block',
      otp_theft: 'OTP / PIN Theft',
      job_scam: 'Fake Job / Task Scam',
      lottery_reward: 'Lottery / Fake Reward',
      impersonation: 'Bank / Govt / Police Impersonation',
      other_unclear: 'Unclear / Unverified Pattern',
    },
    explanations: {
      upi_collect_request:
        'This message tries to trick you into approving a UPI collect request or entering your UPI PIN. Remember: you NEVER need to enter a PIN or scan a QR code to receive money.',
      fake_kyc:
        'This uses false urgency about account suspension or KYC expiry to force you onto a phishing link. Genuine Indian banks and utility providers never ask for KYC updates over random shortened links.',
      otp_theft:
        'This message attempts to harvest your OTP, PIN, or CVV. Legitimate bank staff, UPI apps, or government officers never ask for your OTP or PIN.',
      job_scam:
        'This matches common prepaid-task or work-from-home scams that promise easy daily payouts and later demand "registration" or "upgrade" deposits.',
      lottery_reward:
        'This promises an unsolicited prize, refund, or lottery win. Scammers use fake rewards to collect processing fees or steal banking credentials.',
      impersonation:
        'This impersonates law enforcement, regulators (RBI/TRAI), couriers, or bank officials—often threatening arrest, parcel seizure, or legal action to induce panic.',
      other_unclear:
        'Some suspicious or urgent phrasing was detected, or the message does not contain enough context to confirm safety. Treat unsolicited requests for money, links, or personal details with caution.',
    },
    unknownExplanation:
      'The message is too brief or lacks enough context to classify reliably. An inconclusive check does NOT mean the message is safe.',
    lowExplanation:
      'No common Indian scam triggers matched our rule set, but automated checks cannot guarantee safety. Verify the sender through an official app or published helpline before acting.',
    adviceByRisk: {
      highOrCritical: [
        'Do NOT click any links, scan QR codes, or share any OTP/PIN.',
        'If you already shared details or sent money, start the SOS Flow immediately and call 1930.',
        'Block and report the sender inside your SMS/WhatsApp app and verify directly in your official bank app.',
      ],
      medium: [
        'Pause before replying or tapping any link in this message.',
        'Verify independently using the official bank website, app, or customer care number on the back of your card.',
        'Never enter a UPI PIN or share an OTP to claim a refund, reward, or KYC update.',
      ],
      lowOrUnknown: [
        'Inconclusive or low-signal checks are not a guarantee that a message is safe.',
        'Confirm the sender’s identity via an official channel before sharing personal data or making any payment.',
      ],
    },
  },
  hi: {
    categoryLabels: {
      upi_collect_request: 'UPI कलेक्ट / QR धोखाधड़ी',
      fake_kyc: 'फर्जी KYC / खाता बंद धमकी',
      otp_theft: 'OTP / PIN चोरी',
      job_scam: 'फर्जी नौकरी / टास्क स्कैम',
      lottery_reward: 'लॉटरी / फर्जी इनाम',
      impersonation: 'बैंक / सरकारी / पुलिस प्रतिरूपण',
      other_unclear: 'अस्पष्ट / असत्यापित पैटर्न',
    },
    explanations: {
      upi_collect_request:
        'यह संदेश आपसे UPI कलेक्ट रिक्वेस्ट स्वीकार करवाने या पैसे पाने के नाम पर UPI पिन डलवाने की कोशिश कर रहा है। याद रखें: पैसे प्राप्त करने के लिए कभी भी UPI पिन नहीं डालना होता।',
      fake_kyc:
        'यह संदेश खाता बंद होने या KYC समाप्त होने का डर दिखाकर फर्जी लिंक पर क्लिक करवाने की कोशिश कर रहा है। असली बैंक या बिजली/टेलीकॉम कंपनियां अनजान शॉर्ट लिंक से KYC नहीं करातीं।',
      otp_theft:
        'यह संदेश आपका OTP, PIN या CVV चुराने की कोशिश कर रहा है। कोई भी बैंक कर्मचारी या सरकारी अधिकारी कभी OTP या पिन नहीं मांगता।',
      job_scam:
        'यह संदेश आम पार्ट-टाइम या टास्क स्कैम जैसा है, जिसमें रोजाना आसान कमाई का झांसा देकर बाद में पैसे जमा करने को कहा जाता है।',
      lottery_reward:
        'यह संदेश अनचाहे इनाम, रिफंड या लॉटरी का लालच दे रहा है। ठग प्रोसेसिंग फीस या बैंक जानकारी चुराने के लिए इसका उपयोग करते हैं।',
      impersonation:
        'यह संदेश पुलिस, RBI/TRAI, कूरियर या बैंक अधिकारी बनकर डराने (जैसे डिजिटल अरेस्ट या पार्सल जब्ती) की कोशिश कर रहा है।',
      other_unclear:
        'संदेश में कुछ संदिग्ध या जल्दबाजी वाले शब्द दिखे हैं, या सुरक्षित होने की पुष्टि के लिए पर्याप्त जानकारी नहीं है। अनजान लिंक या पैसे की मांग से सावधान रहें।',
    },
    unknownExplanation:
      'यह संदेश बहुत छोटा है या स्पष्ट निष्कर्ष के लिए पर्याप्त संदर्भ नहीं है। अनिश्चित परिणाम का मतलब यह नहीं है कि संदेश सुरक्षित है।',
    lowExplanation:
      'हमारे नियम-आधारित जांच में कोई प्रमुख ठगी संकेत नहीं मिला, लेकिन यह सुरक्षा की गारंटी नहीं है। कोई भी कदम उठाने से पहले आधिकारिक ऐप या नंबर से पुष्टि करें।',
    adviceByRisk: {
      highOrCritical: [
        'किसी भी लिंक पर क्लिक न करें, QR कोड स्कैन न करें और OTP/PIN साझा न करें।',
        'यदि आपने पहले ही पैसे भेजे हैं या OTP बताया है, तो तुरंत SOS फ्लो खोलें और 1930 पर कॉल करें।',
        'भेजने वाले को ब्लॉक/रिपोर्ट करें और केवल अपने आधिकारिक बैंक ऐप में जांच करें।',
      ],
      medium: [
        'जवाब देने या किसी लिंक को खोलने से पहले रुकें।',
        'केवल बैंक की आधिकारिक वेबसाइट या कार्ड के पीछे लिखे नंबर से पुष्टि करें।',
        'रिफंड, इनाम या KYC के लिए कभी भी UPI पिन या OTP न डालें।',
      ],
      lowOrUnknown: [
        'कम जोखिम या अस्पष्ट परिणाम का अर्थ यह नहीं है कि संदेश सुरक्षित है।',
        'पैसे भेजने या जानकारी देने से पहले आधिकारिक माध्यम से भेजने वाले की पुष्टि करें।',
      ],
    },
  },
  te: {
    categoryLabels: {
      upi_collect_request: 'UPI కలెక్ట్ / QR మోసం',
      fake_kyc: 'నకిలీ KYC / ఖాతా బ్లాక్ బెదిరింపు',
      otp_theft: 'OTP / PIN దొంగతనం',
      job_scam: 'నకిలీ ఉద్యోగం / టాస్క్ మోసం',
      lottery_reward: 'లాటరీ / నకిలీ బహుమతి',
      impersonation: 'బ్యాంక్ / ప్రభుత్వ / పోలీసు నకిలీ',
      other_unclear: 'అస్పష్టమైన / ధృవీకరించని సందేశం',
    },
    explanations: {
      upi_collect_request:
        'డబ్బులు పొందడానికి UPI పిన్ ఎంటర్ చేయమని లేదా కలెక్ట్ రిక్వెస్ట్ ఆమోదించమని మిమ్మల్ని మోసగించే ప్రయత్నం ఇది. గుర్తుంచుకోండి: డబ్బులు రావడానికి ఎప్పుడూ UPI PIN అవసరం లేదు.',
      fake_kyc:
        'ఖాతా బ్లాక్ అవుతుందని లేదా KYC గడువు ముగుస్తుందని భయపెట్టి నకిలీ లింక్‌పై క్లిక్ చేయించే ప్రయత్నం ఇది. అసలైన బ్యాంకులు షార్ట్ లింక్‌ల ద్వారా KYC అడగవు.',
      otp_theft:
        'మీ OTP, PIN లేదా CVV వివరాలు దొంగిలించడానికి ఈ సందేశం ప్రయత్నిస్తోంది. బ్యాంక్ సిబ్బంది లేదా ప్రభుత్వ అధికారులు ఎప్పుడూ OTP అడగరు.',
      job_scam:
        'రోజువారీ సులభమైన సంపాదన పేరుతో ఆశచూపి తర్వాత డిపాజిట్లు అడిగే సాధారణ పార్ట్-టైమ్ టాస్క్ మోసాన్ని ఇది పోలి ఉంది.',
      lottery_reward:
        'మీరు అడగని బహుమతి, రీఫండ్ లేదా లాటరీ గెలిచారని చెబుతోంది. ప్రాసెసింగ్ ఫీజు లేదా బ్యాంక్ వివరాలు దొంగిలించడానికి మోసగాళ్లు దీనిని ఉపయోగిస్తారు.',
      impersonation:
        'పోలీసులు, RBI/TRAI, కొరియర్ లేదా బ్యాంక్ అధికారులమని నటిస్తూ అరెస్ట్ లేదా పార్సెల్ సీజ్ పేరుతో భయపెట్టే ప్రయత్నం ఇది.',
      other_unclear:
        'సందేశంలో కొన్ని అనుమానాస్పద లేదా తొందరపెట్టే పదాలు ఉన్నాయి, లేదా పూర్తిగా నిర్ధారించడానికి తగిన వివరాలు లేవు. అపరిచిత లింక్‌ల పట్ల జాగ్రత్తగా ఉండండి.',
    },
    unknownExplanation:
      'సందేశం చాలా చిన్నదిగా ఉంది లేదా ఖచ్చితమైన నిర్ధారణకు తగిన వివరాలు లేవు. ఫలితం స్పష్టంగా లేకపోతే అది సురక్షితమని అర్థం కాదు.',
    lowExplanation:
      'మా నియమాల ఆధారిత తనిఖీలో ప్రధాన మోసపూరిత సంకేతాలు కనిపించలేదు, కానీ ఇది భద్రతకు హామీ కాదు. చర్య తీసుకునే ముందు అధికారిక యాప్ ద్వారా ధృవీకరించండి.',
    adviceByRisk: {
      highOrCritical: [
        'ఏ లింక్‌పైనా క్లిక్ చేయవద్దు, QR కోడ్ స్కాన్ చేయవద్దు మరియు OTP/PIN పంచుకోవద్దు.',
        'మీరు ఇప్పటికే డబ్బు పంపితే లేదా OTP చెబితే, వెంటనే SOS ఫ్లో ప్రారంభించి 1930కు కాల్ చేయండి.',
        'పంపిన నంబర్‌ను బ్లాక్ చేసి రిపోర్ట్ చేయండి మరియు మీ అధికారిక బ్యాంక్ యాప్‌లో మాత్రమే తనిఖీ చేయండి.',
      ],
      medium: [
        'సమాధానం ఇచ్చే ముందు లేదా లింక్ తెరిచే ముందు ఆగండి.',
        'బ్యాంక్ అధికారిక వెబ్‌సైట్ లేదా మీ కార్డ్ వెనుక ఉన్న నంబర్ ద్వారా మాత్రమే నిర్ధారించుకోండి.',
        'రీఫండ్, బహుమతి లేదా KYC కోసం ఎప్పుడూ UPI PIN లేదా OTP ఎంటర్ చేయవద్దు.',
      ],
      lowOrUnknown: [
        'తక్కువ ప్రమాదం లేదా అస్పష్టమైన ఫలితం అంటే సందేశం సురక్షితమని కాదు.',
        'వ్యక్తిగత వివరాలు లేదా డబ్బు పంపే ముందు అధికారిక ఛానల్ ద్వారా పంపినవారిని నిర్ధారించుకోండి.',
      ],
    },
  },
};

export function getCategoryLabel(category: ScamCategory, lang: Language): string {
  return COPY[lang].categoryLabels[category] ?? COPY.en.categoryLabels[category];
}

export function analyzeMessageRuleBased(message: string, lang: Language): CheckResult {
  const trimmed = message.trim();
  const copy = COPY[lang];

  if (trimmed.length < 12) {
    return {
      scamType: 'other_unclear',
      riskLevel: 'Unknown',
      flaggedPhrases: [],
      explanation: copy.unknownExplanation,
      advice: copy.adviceByRisk.lowOrUnknown,
    };
  }

  let totalScore = 0;
  const categoryScores: Record<ScamCategory, number> = {
    upi_collect_request: 0,
    fake_kyc: 0,
    otp_theft: 0,
    job_scam: 0,
    lottery_reward: 0,
    impersonation: 0,
    other_unclear: 0,
  };
  const phraseSet = new Set<string>();

  for (const rule of RULES) {
    let ruleMatched = false;
    for (const pattern of rule.patterns) {
      const globalPattern = new RegExp(
        pattern.source,
        pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
      );
      const matches = trimmed.match(globalPattern);
      if (matches && matches.length > 0) {
        ruleMatched = true;
        for (const m of matches) {
          const clean = m.trim();
          if (clean.length >= 2) {
            phraseSet.add(clean);
          }
        }
      }
    }
    if (ruleMatched) {
      totalScore += rule.weight;
      if (rule.category !== 'urgency' && rule.category !== 'suspicious_link') {
        categoryScores[rule.category] += rule.weight;
      }
    }
  }

  // Pick top scam category
  let topCategory: ScamCategory = 'other_unclear';
  let topScore = 0;
  (Object.keys(categoryScores) as ScamCategory[]).forEach((cat) => {
    if (categoryScores[cat] > topScore) {
      topScore = categoryScores[cat];
      topCategory = cat;
    }
  });

  // Determine RiskLevel (never label inconclusive as "safe")
  let riskLevel: RiskLevel;
  if (totalScore >= 7) {
    riskLevel = 'Critical';
  } else if (totalScore >= 4) {
    riskLevel = 'High';
  } else if (totalScore >= 2) {
    riskLevel = 'Medium';
  } else {
    // Low signal vs too short/ambiguous
    const hasGenericMoneyOrLink = /https?:\/\/|rs\.?|₹|\binr\b|\bupi\b|\botp\b/i.test(trimmed);
    riskLevel = hasGenericMoneyOrLink ? 'Unknown' : 'Low';
  }

  const flaggedPhrases = Array.from(phraseSet).slice(0, 10);

  let explanation: string;
  if (riskLevel === 'Unknown') {
    explanation = copy.explanations.other_unclear;
  } else if (riskLevel === 'Low' && topCategory === 'other_unclear') {
    explanation = copy.lowExplanation;
  } else {
    explanation = copy.explanations[topCategory];
  }

  const advice =
    riskLevel === 'Critical' || riskLevel === 'High'
      ? copy.adviceByRisk.highOrCritical
      : riskLevel === 'Medium'
        ? copy.adviceByRisk.medium
        : copy.adviceByRisk.lowOrUnknown;

  return {
    scamType: topCategory,
    riskLevel,
    flaggedPhrases,
    explanation,
    advice,
  };
}

export interface TextSegment {
  text: string;
  flagged: boolean;
}

export function highlightMessageSegments(
  message: string,
  flaggedPhrases: string[]
): TextSegment[] {
  if (!message) return [];
  const validPhrases = Array.from(
    new Set(
      flaggedPhrases
        .map((p) => p.trim())
        .filter((p) => p.length >= 2)
    )
  ).sort((a, b) => b.length - a.length);

  if (validPhrases.length === 0) {
    return [{ text: message, flagged: false }];
  }

  const lowerMsg = message.toLowerCase();
  const ranges: Array<{ start: number; end: number }> = [];

  for (const phrase of validPhrases) {
    const lowerPhrase = phrase.toLowerCase();
    let idx = 0;
    while (idx < lowerMsg.length) {
      const found = lowerMsg.indexOf(lowerPhrase, idx);
      if (found === -1) break;
      const start = found;
      const end = found + lowerPhrase.length;
      const overlaps = ranges.some((r) => start < r.end && end > r.start);
      if (!overlaps) {
        ranges.push({ start, end });
      }
      idx = end;
    }
  }

  if (ranges.length === 0) {
    return [{ text: message, flagged: false }];
  }

  ranges.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) {
      segments.push({ text: message.slice(cursor, range.start), flagged: false });
    }
    segments.push({ text: message.slice(range.start, range.end), flagged: true });
    cursor = range.end;
  }
  if (cursor < message.length) {
    segments.push({ text: message.slice(cursor), flagged: false });
  }

  return segments;
}
