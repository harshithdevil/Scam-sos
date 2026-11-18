import type {
  Language,
  ReportingProfileData,
  SosActionStep,
  SosEvidenceItem,
  SosFormData,
  SosGeneratedOutput,
  SosIncidentType,
  SosTimeWindow,
} from '../types';
import { EMPTY_REPORTING_PROFILE, sanitizeReportingProfile } from './profileValidation';

export interface SosValidationResult {
  valid: boolean;
  errors: {
    incidents?: 'required';
    amountLost?: 'required' | 'invalid';
  };
}

export function validateSosInput(data: SosFormData): SosValidationResult {
  const errors: SosValidationResult['errors'] = {};

  if (!data.incidents || data.incidents.length === 0) {
    errors.incidents = 'required';
  }

  const trimmedAmount = data.amountLost.trim();
  if (!trimmedAmount) {
    errors.amountLost = 'required';
  } else {
    const numeric = Number(trimmedAmount.replace(/,/g, ''));
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 1_000_000_000) {
      errors.amountLost = 'invalid';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatInrAmount(rawAmount: string): string {
  const numeric = Number(rawAmount.replace(/,/g, '').trim());
  if (!Number.isFinite(numeric)) return '₹0';
  return `₹${numeric.toLocaleString('en-IN')}`;
}

export const INCIDENT_LABELS: Record<Language, Record<SosIncidentType, string>> = {
  en: {
    shared_otp: 'Shared OTP / PIN',
    paid_upi: 'Paid via UPI',
    clicked_link: 'Clicked suspicious link',
    shared_card: 'Shared card details / CVV',
    account_hacked: 'Account hacked / SIM swap',
    other: 'Other cyber fraud',
  },
  hi: {
    shared_otp: 'OTP / PIN साझा किया',
    paid_upi: 'UPI से भुगतान किया',
    clicked_link: 'संदिग्ध लिंक पर क्लिक किया',
    shared_card: 'कार्ड विवरण / CVV साझा किया',
    account_hacked: 'खाता हैक / सिम स्वैप',
    other: 'अन्य साइबर धोखाधड़ी',
  },
  te: {
    shared_otp: 'OTP / PIN పంచుకున్నాను',
    paid_upi: 'UPI ద్వారా డబ్బు పంపాను',
    clicked_link: 'అనుమానాస్పద లింక్ క్లిక్ చేశాను',
    shared_card: 'కార్డ్ వివరాలు / CVV ఇచ్చాను',
    account_hacked: 'ఖాతా హ్యాక్ / సిమ్ స్వాప్',
    other: 'ఇతర సైబర్ మోసం',
  },
};

export const TIME_WINDOW_LABELS: Record<Language, Record<SosTimeWindow, string>> = {
  en: {
    under_15m: 'Under 15 minutes ago',
    '15m_to_1h': '15 to 60 minutes ago',
    '1h_to_6h': '1 to 6 hours ago',
    over_6h: 'Over 6 hours ago',
  },
  hi: {
    under_15m: '15 मिनट से कम समय पहले',
    '15m_to_1h': '15 से 60 मिनट पहले',
    '1h_to_6h': '1 से 6 घंटे पहले',
    over_6h: '6 घंटे से अधिक पहले',
  },
  te: {
    under_15m: '15 నిమిషాల లోపు',
    '15m_to_1h': '15 నుండి 60 నిమిషాల క్రితం',
    '1h_to_6h': '1 నుండి 6 గంటల క్రితం',
    over_6h: '6 గంటల కంటే ఎక్కువ సమయం క్రితం',
  },
};

export function generateSosPlan(
  data: SosFormData,
  lang: Language,
  profileInput?: Partial<ReportingProfileData>
): SosGeneratedOutput {
  const profile = sanitizeReportingProfile({
    ...EMPTY_REPORTING_PROFILE,
    ...(profileInput ?? {}),
  });
  const effectiveAmount = data.amountLost.trim() || profile.amountLost.trim() || '0';
  const formattedAmount = formatInrAmount(effectiveAmount);
  const incidentList = data.incidents
    .map((inc) => INCIDENT_LABELS[lang][inc])
    .join(', ');
  const timeLabel = TIME_WINDOW_LABELS[lang][data.timeSince];

  const needsCardFreeze =
    data.incidents.includes('shared_card') || data.incidents.includes('shared_otp');
  const needsSimDeviceCheck =
    data.incidents.includes('clicked_link') || data.incidents.includes('account_hacked');

  if (lang === 'hi') {
    const pBank = profile.bankName || '[अपने बैंक का नाम यहाँ लिखें]';
    const pLast4 = profile.accountLast4 ? `XXXX${profile.accountLast4}` : '[खाता संख्या के अंतिम 4 अंक लिखें]';
    const pUtr = profile.transactionId || '[12 अंकों का UTR नंबर यहाँ लिखें]';
    const pScammer = profile.scammerContact || '[यदि उपलब्ध हो तो लिखें]';
    const pName = profile.fullName || '[आपका पूरा नाम]';
    const pPhone = profile.phone || '[पंजीकृत मोबाइल नंबर]';
    const pEmail = profile.email ? `\nईमेल: ${profile.email}` : '';
    const pCity = profile.cityState ? `\nशहर/राज्य: ${profile.cityState}` : '';
    const pDateTime = profile.scamDateTime || timeLabel;
    const pSummary = profile.shortDescription ? `\n- संक्षिप्त विवरण: ${profile.shortDescription}` : '';

    const steps: SosActionStep[] = [
      {
        id: 'call_1930',
        priority: 1,
        title: 'तुरंत 1930 पर कॉल करें (राष्ट्रीय साइबर हेल्पलाइन)',
        summary: `यदि अभी-अभी आपके खाते से पैसे (${formattedAmount}) कटे हैं, तो तुरंत 1930 पर कॉल करें। त्वरित रिपोर्टिंग आपके बैंक को कार्रवाई करने का सबसे अच्छा अवसर देती है, लेकिन परिणाम की गारंटी नहीं है। कॉल पर नीचे दी गई 30-सेकंड की स्क्रिप्ट पढ़ें।`,
        actionLabel: '1930 डायल करें',
        actionHref: 'tel:1930',
      },
      {
        id: 'contact_bank',
        priority: 2,
        title: needsCardFreeze
          ? 'अपने बैंक को कॉल करें और कार्ड, UPI व नेटबैंकिंग ब्लॉक करें'
          : 'अपने बैंक की फ्रॉड डेस्क से संपर्क करें और कार्ड/UPI ब्लॉक करें',
        summary: needsSimDeviceCheck
          ? 'संदिग्ध ऐप अनइंस्टॉल करें, मोबाइल नेटवर्क बंद न करें, और तुरंत बैंक के आधिकारिक हेल्पलाइन नंबर पर कॉल कर अपना कार्ड व UPI एक्सेस ब्लॉक कराएं।'
          : 'नीचे दिया गया बैंक शिकायत ईमेल अपने बैंक की आधिकारिक कस्टमर केयर/नोडल ईमेल पर तुरंत भेजें और संदर्भ संख्या नोट करें।',
      },
      {
        id: 'cybercrime_portal',
        priority: 3,
        title: 'cybercrime.gov.in पर आधिकारिक शिकायत दर्ज करें',
        summary:
          'राष्ट्रीय साइबर क्राइम रिपोर्टिंग पोर्टल पर जाकर "Report Financial Fraud" चुनें और 1930 से प्राप्त शिकायत नंबर या सभी UTR/ट्रांजेक्शन आईडी अपलोड करें।',
        actionLabel: 'cybercrime.gov.in खोलें',
        actionHref: 'https://cybercrime.gov.in',
      },
      {
        id: 'preserve_evidence',
        priority: 4,
        title: 'सभी डिजिटल सबूत सुरक्षित रखें (चैट या SMS डिलीट न करें)',
        summary:
          'स्क्रीनशॉट, बैंक स्टेटमेंट, UTR नंबर और ठग का नंबर/UPI ID सेव करें। यदि किसी रिमोट-एक्सेस ऐप (AnyDesk/TeamViewer) को इंस्टॉल किया था तो स्क्रीनशॉट के बाद इंटरनेट बंद कर हटाएं।',
      },
    ];

    const emailSubject = `अत्यावश्यक: अनधिकृत साइबर धोखाधड़ी रिपोर्ट — ${formattedAmount} (${incidentList})`;
    const emailBody = `सेवा में,
नोडल अधिकारी / फ्रॉड विवाद टीम,
${pBank}

विषय: अनधिकृत लेन-देन की तत्काल सूचना एवं खाता सुरक्षा अनुरोध (अमाउंट: ${formattedAmount})

महोदय/महोदया,

मैं अपने खाते (${pLast4}) में हुई एक साइबर धोखाधड़ी की तत्काल सूचना दे रहा/रही हूँ।

घटना का विवरण:
- घटना का प्रकार: ${incidentList}
- अनुमानित नुकसान की राशि: ${formattedAmount}
- घटना का समय: ${pDateTime} (${timeLabel})
- लेन-देन / UTR संख्या: ${pUtr}
- संदिग्ध UPI ID / फोन नंबर / वेबसाइट: ${pScammer}${pSummary}

कृपया इस सूचना को तत्काल दर्ज करें, आगे के अनधिकृत उपयोग को रोकने के लिए मेरे प्रभावित UPI/कार्ड/नेटबैंकिंग एक्सेस को ब्लॉक करें, और मुझे आधिकारिक शिकायत संदर्भ संख्या प्रदान करें। मैं 1930 हेल्पलाइन और cybercrime.gov.in पर भी रिपोर्ट दर्ज कर रहा/रही हूँ।

भवदीय,
${pName}
${pPhone}${pEmail}${pCity}
${pDateTime}`;

    const scriptExtras = [
      profile.bankName ? ` मेरा बैंक ${profile.bankName} (अंतिम 4 अंक ${profile.accountLast4 || '____'}) है।` : '',
      profile.transactionId ? ` UTR/ट्रांजेक्शन आईडी ${profile.transactionId} है।` : '',
      profile.scammerContact ? ` संदिग्ध संपर्क ${profile.scammerContact} है।` : '',
    ].join('');

    const callScript = `"नमस्ते${profile.fullName ? `, मेरा नाम ${profile.fullName} है` : ''}। मेरे साथ अभी ${timeLabel}${profile.scamDateTime ? ` (${profile.scamDateTime})` : ''} ऑनलाइन वित्तीय धोखाधड़ी हुई है (${incidentList})। मेरे खाते से ${formattedAmount} की राशि चली गई है।${scriptExtras} मेरे पास लेन-देन और UTR विवरण तैयार है। कृपया तुरंत मेरी साइबर धोखाधड़ी शिकायत दर्ज करें और मुझे एक्नॉलेजमेंट नंबर दें ताकि मैं cybercrime.gov.in और अपने बैंक को दे सकूं।"`;

    const evidenceItems: SosEvidenceItem[] = [
      { id: 'screenshots', label: 'चैट, SMS या कॉल लॉग के स्क्रीनशॉट', hint: 'नंबर, समय और संदेश स्पष्ट दिखें' },
      {
        id: 'txn_id',
        label: 'बैंक / UPI ट्रांजेक्शन ID',
        hint: profile.transactionId ? `तैयार विवरण: ${profile.transactionId}` : 'Google Pay, PhonePe, Paytm या बैंक ऐप से',
      },
      {
        id: 'utr',
        label: '12 अंकों का UTR / रेफरेंस नंबर',
        hint: profile.transactionId ? `नोट किया गया: ${profile.transactionId}` : '1930 और बैंक द्वारा लेन-देन ट्रेस करने के लिए जरूरी',
      },
      {
        id: 'scammer_id',
        label: 'ठग का फोन नंबर, UPI ID या खाता संख्या',
        hint: profile.scammerContact ? `तैयार विवरण: ${profile.scammerContact}` : 'जहाँ पैसा गया या जहाँ से कॉल आया',
      },
      {
        id: 'timestamps',
        label: 'लेन-देन की सटीक तारीख और समय',
        hint: profile.scamDateTime ? `नोट किया गया: ${profile.scamDateTime}` : 'मिनट तक का सही समय नोट करें',
      },
    ];

    const urgencyNote =
      data.timeSince === 'under_15m' || data.timeSince === '15m_to_1h'
        ? 'आप पहले 60 मिनट के भीतर हैं — तुरंत 1930 पर कॉल करें। त्वरित रिपोर्टिंग आपके बैंक को कार्रवाई करने का सबसे अच्छा अवसर देती है, लेकिन परिणाम की गारंटी नहीं है।'
        : '60 मिनट से अधिक समय हो चुका है, लेकिन तुरंत 1930 और cybercrime.gov.in पर रिपोर्ट करना बैंक जांच और पुलिस रिकॉर्ड के लिए अनिवार्य है।';

    return { steps, emailSubject, emailBody, callScript, evidenceItems, urgencyNote };
  }

  if (lang === 'te') {
    const pBank = profile.bankName || '[మీ బ్యాంక్ పేరు ఇక్కడ రాయండి]';
    const pLast4 = profile.accountLast4 ? `XXXX${profile.accountLast4}` : '[ఖాతా చివరి 4 అంకెలు ఇక్కడ రాయండి]';
    const pUtr = profile.transactionId || '[12-అంకెల UTR నంబర్ ఇక్కడ రాయండి]';
    const pScammer = profile.scammerContact || '[తెలిస్తే ఇక్కడ రాయండి]';
    const pName = profile.fullName || '[మీ పూర్తి పేరు]';
    const pPhone = profile.phone || '[రిజిస్టర్డ్ మొబైల్ నంబర్]';
    const pEmail = profile.email ? `\nఈమెయిల్: ${profile.email}` : '';
    const pCity = profile.cityState ? `\nనగరం/రాష్ట్రం: ${profile.cityState}` : '';
    const pDateTime = profile.scamDateTime || timeLabel;
    const pSummary = profile.shortDescription ? `\n- సంక్షిప్త వివరణ: ${profile.shortDescription}` : '';

    const steps: SosActionStep[] = [
      {
        id: 'call_1930',
        priority: 1,
        title: 'వెంటనే 1930కు కాల్ చేయండి (నేషనల్ సైబర్ హెల్ప్‌లైన్)',
        summary: `మీ ఖాతా నుండి ఇప్పుడే ${formattedAmount} పోయినట్లయితే, వెంటనే 1930కు కాల్ చేసి క్రింది 30-సెకన్ల స్క్రిప్ట్ చదవండి. వేగవంతమైన ఫిర్యాదు మీ బ్యాంకుకు చర్య తీసుకునే ఉత్తమ అవకాశాన్ని ఇస్తుంది, కానీ ఫలితాలకు హామీ లేదు.`,
        actionLabel: '1930కు కాల్ చేయండి',
        actionHref: 'tel:1930',
      },
      {
        id: 'contact_bank',
        priority: 2,
        title: needsCardFreeze
          ? 'మీ బ్యాంక్‌కు కాల్ చేసి కార్డ్, UPI మరియు నెట్‌బ్యాంకింగ్ బ్లాక్ చేయండి'
          : 'మీ బ్యాంక్ ఫ్రాడ్ డెస్క్‌ను సంప్రదించి కార్డ్ / UPI యాక్సెస్ బ్లాక్ చేయండి',
        summary: needsSimDeviceCheck
          ? 'అనుమానాస్పద యాప్‌లను తొలగించండి, కానీ సాక్ష్యాలను డిలీట్ చేయవద్దు. మీ బ్యాంక్ అధికారిక హెల్ప్‌లైన్ ద్వారా వెంటనే మీ కార్డ్ మరియు UPI యాక్సెస్ బ్లాక్ చేయించండి.'
          : 'క్రింద ఉన్న బ్యాంక్ ఫిర్యాదు ఈమెయిల్‌ను మీ బ్యాంక్ అధికారిక కస్టమర్ కేర్ / నోడల్ ఆఫీసర్‌కు పంపి కంప్లైంట్ నంబర్ తీసుకోండి.',
      },
      {
        id: 'cybercrime_portal',
        priority: 3,
        title: 'cybercrime.gov.in లో అధికారిక ఫిర్యాదు నమోదు చేయండి',
        summary:
          'జాతీయ సైబర్ క్రైమ్ పోర్టల్‌లో "Report Financial Fraud" ఎంచుకుని 1930 రిఫరెన్స్ నంబర్, UTR నంబర్లు మరియు స్క్రీన్‌షాట్లను అప్‌లోడ్ చేయండి.',
        actionLabel: 'cybercrime.gov.in తెరవండి',
        actionHref: 'https://cybercrime.gov.in',
      },
      {
        id: 'preserve_evidence',
        priority: 4,
        title: 'అన్ని డిజిటల్ ఆధారాలను భద్రపరచండి (చాట్స్/SMS డిలీట్ చేయవద్దు)',
        summary:
          'స్క్రీన్‌షాట్లు, బ్యాంక్ స్టేట్‌మెంట్, 12-అంకెల UTR నంబర్ మరియు మోసగాడి UPI ID/ఫోన్ నంబర్ సేవ్ చేయండి.',
      },
    ];

    const emailSubject = `అత్యవసరం: అనధికార సైబర్ మోసం ఫిర్యాదు — ${formattedAmount} (${incidentList})`;
    const emailBody = `గౌరవనీయ నోడల్ ఆఫీసర్ / ఫ్రాడ్ డిస్ప్యూట్ విభాగం,
${pBank}

విషయం: అనధికార ఆర్థిక మోసం తక్షణ నివేదిక మరియు ఖాతా భద్రతా అభ్యర్థన (మొత్తం: ${formattedAmount})

అయ్యా/అమ్మా,

నా బ్యాంక్ ఖాతా (${pLast4}) లో జరిగిన సైబర్ మోసం గురించి తక్షణమే తెలియజేస్తున్నాను.

సంఘటన వివరాలు:
- మోసం రకం: ${incidentList}
- పోగొట్టుకున్న మొత్తం: ${formattedAmount}
- జరిగిన సమయం: ${pDateTime} (${timeLabel})
- ట్రాన్సాక్షన్ / UTR నంబర్: ${pUtr}
- మోసగాడి UPI ID / ఫోన్ నంబర్ / వెబ్‌సైట్: ${pScammer}${pSummary}

దయచేసి నా ఖాతా / UPI / కార్డ్ నుండి మరిన్ని అనధికార లావాదేవీలు జరగకుండా ప్రభావితమైన కార్డ్ / UPI యాక్సెస్‌ను వెంటనే బ్లాక్ చేయండి మరియు ఈ ఫిర్యాదును నమోదు చేసి అధికారిక రిఫరెన్స్ నంబర్ ఇవ్వగలరు. నేను 1930 హెల్ప్‌లైన్ మరియు cybercrime.gov.in లో కూడా ఫిర్యాదు చేస్తున్నాను.

ఇట్లు,
${pName}
${pPhone}${pEmail}${pCity}
${pDateTime}`;

    const scriptExtras = [
      profile.bankName ? ` నా బ్యాంక్ ${profile.bankName} (చివరి 4 అంకెలు ${profile.accountLast4 || '____'}).` : '',
      profile.transactionId ? ` UTR/ట్రాన్సాక్షన్ ID ${profile.transactionId}.` : '',
      profile.scammerContact ? ` మోసగాడి వివరాలు ${profile.scammerContact}.` : '',
    ].join('');

    const callScript = `"నమస్కారం${profile.fullName ? `, నా పేరు ${profile.fullName}` : ''}. నాకు ${timeLabel}${profile.scamDateTime ? ` (${profile.scamDateTime})` : ''} ఆన్‌లైన్ ఆర్థిక మోసం జరిగింది (${incidentList}). నా ఖాతా నుండి ${formattedAmount} పోయాయి.${scriptExtras} నా దగ్గర ట్రాన్సాక్షన్ మరియు UTR వివరాలు సిద్ధంగా ఉన్నాయి. దయచేసి వెంటనే ఈ సైబర్ మోసం ఫిర్యాదును నమోదు చేసి అక్నాలెడ్జ్‌మెంట్ నంబర్ ఇవ్వండి."`;

    const evidenceItems: SosEvidenceItem[] = [
      { id: 'screenshots', label: 'చాట్, SMS లేదా కాల్ లాగ్ స్క్రీన్‌షాట్లు', hint: 'నంబర్ మరియు సమయం స్పష్టంగా కనిపించాలి' },
      {
        id: 'txn_id',
        label: 'బ్యాంక్ / UPI ట్రాన్సాక్షన్ ID',
        hint: profile.transactionId ? `సిద్ధమైన వివరం: ${profile.transactionId}` : 'GPay, PhonePe, Paytm లేదా బ్యాంక్ యాప్ నుండి',
      },
      {
        id: 'utr',
        label: '12-అంకెల UTR / రిఫరెన్స్ నంబర్',
        hint: profile.transactionId ? `నమోదైనది: ${profile.transactionId}` : '1930 మరియు బ్యాంక్ లావాదేవీని పరిశీలించడానికి అవసరం',
      },
      {
        id: 'scammer_id',
        label: 'మోసగాడి ఫోన్ నంబర్, UPI ID లేదా ఖాతా వివరాలు',
        hint: profile.scammerContact ? `సిద్ధమైన వివరం: ${profile.scammerContact}` : 'డబ్బు వెళ్లిన లేదా కాల్ వచ్చిన వివరాలు',
      },
      {
        id: 'timestamps',
        label: 'ఖచ్చితమైన తేదీ మరియు సమయం',
        hint: profile.scamDateTime ? `నమోదైన సమయం: ${profile.scamDateTime}` : 'లావాదేవీ జరిగిన ఖచ్చితమైన సమయం',
      },
    ];

    const urgencyNote =
      data.timeSince === 'under_15m' || data.timeSince === '15m_to_1h'
        ? 'మీరు మొదటి 60 నిమిషాల్లోనే ఉన్నారు — వెంటనే 1930కు కాల్ చేయండి. వేగవంతమైన ఫిర్యాదు మీ బ్యాంకుకు చర్య తీసుకునే ఉత్తమ అవకాశాన్ని ఇస్తుంది, కానీ ఫలితాలకు హామీ లేదు.'
        : '60 నిమిషాలు దాటినప్పటికీ, బ్యాంక్ విచారణ మరియు పోలీసు కేసు కోసం వెంటనే 1930 మరియు cybercrime.gov.in లో ఫిర్యాదు చేయడం తప్పనిసరి.';

    return { steps, emailSubject, emailBody, callScript, evidenceItems, urgencyNote };
  }

  // English (default)
  const pBank = profile.bankName || '[Enter Your Bank Name]';
  const pLast4 = profile.accountLast4 ? `XXXX${profile.accountLast4}` : '[Last 4 Digits of Account]';
  const pUtr = profile.transactionId || '[Enter UTR / Transaction ID]';
  const pScammer = profile.scammerContact || '[Enter Scammer UPI ID or Phone]';
  const pName = profile.fullName || '[Your Full Name]';
  const pPhone = profile.phone || '[Registered Mobile Number]';
  const pEmail = profile.email ? `\nEmail: ${profile.email}` : '';
  const pCity = profile.cityState ? `\nCity / State: ${profile.cityState}` : '';
  const pDateTime = profile.scamDateTime || timeLabel;
  const pSummary = profile.shortDescription ? `\n- Incident description: ${profile.shortDescription}` : '';

  const steps: SosActionStep[] = [
    {
      id: 'call_1930',
      priority: 1,
      title: 'Call 1930 immediately (National Cyber Crime Helpline)',
      summary: `If money (${formattedAmount}) just left your account, call 1930 immediately and read the 30-second script below. Fast reporting gives your bank the best chance to act, but results are not guaranteed.`,
      actionLabel: 'Dial 1930',
      actionHref: 'tel:1930',
    },
    {
      id: 'contact_bank',
      priority: 2,
      title: needsCardFreeze
        ? 'Call your bank & block your card, UPI, and net banking'
        : 'Contact your bank fraud desk & block compromised UPI / card access',
      summary: needsSimDeviceCheck
        ? 'Turn off mobile data/Wi-Fi temporarily if a remote-access app was installed, call your bank’s official toll-free number on your card/passbook to block compromised access, and send the complaint email below.'
        : 'Send the auto-generated bank dispute email below to your bank’s official fraud/nodal email immediately and record your complaint ticket number.',
    },
    {
      id: 'cybercrime_portal',
      priority: 3,
      title: 'Submit an official complaint at cybercrime.gov.in',
      summary:
        'Go to the National Cyber Crime Reporting Portal, select Financial Fraud, and attach your 1930 reference ID, UTR numbers, and screenshots.',
      actionLabel: 'Open cybercrime.gov.in',
      actionHref: 'https://cybercrime.gov.in',
    },
    {
      id: 'preserve_evidence',
      priority: 4,
      title: 'Preserve all digital evidence (do not delete chats or SMS)',
      summary:
        'Capture full screenshots showing phone numbers, UPI IDs, and timestamps. Save your bank statement showing the 12-digit UTR number.',
    },
  ];

  const emailSubject = `URGENT: Unauthorized Cyber Fraud Report — ${formattedAmount} (${incidentList})`;
  const emailBody = `To: Fraud Dispute / Nodal Officer Team
Bank Name: ${pBank}

Subject: Urgent Reporting of Unauthorized Transaction & Security Block Request (${formattedAmount})

Dear Sir/Madam,

I am writing to immediately report an unauthorized financial fraud incident involving my bank account ending in ${pLast4}.

Incident Summary:
- What happened: ${incidentList}
- Amount lost: ${formattedAmount}
- Date & time of incident: ${pDateTime} (${timeLabel})
- Transaction / 12-digit UTR Reference: ${pUtr}
- Recipient UPI ID / Phone / Website: ${pScammer}${pSummary}

Please log this as an urgent unauthorized transaction report, block my compromised UPI/card/banking credentials as needed to prevent further unauthorized debits, and provide my official complaint reference number.

I am simultaneously reporting this incident on the 1930 helpline and cybercrime.gov.in.

Sincerely,
${pName}
${pPhone}${pEmail}${pCity}
${pDateTime}`;

  const scriptExtras = [
    profile.bankName ? ` My bank is ${profile.bankName} (account ending in ${profile.accountLast4 || '____'}).` : '',
    profile.transactionId ? ` The UTR / Transaction ID is ${profile.transactionId}.` : '',
    profile.scammerContact ? ` The scammer's contact / UPI ID is ${profile.scammerContact}.` : '',
  ].join('');

  const callScript = `"Hello${profile.fullName ? `, my name is ${profile.fullName}` : ''}. I am reporting an online financial fraud that happened ${timeLabel}${profile.scamDateTime ? ` (${profile.scamDateTime})` : ''}. The incident involved ${incidentList}, and I lost ${formattedAmount}.${scriptExtras} I have my transaction and UTR details ready. Please log this cyber fraud report immediately and share the acknowledgement number so I can submit it on cybercrime.gov.in and to my bank."`;

  const evidenceItems: SosEvidenceItem[] = [
    {
      id: 'screenshots',
      label: 'Screenshots of SMS, WhatsApp/Telegram chat, or phishing page',
      hint: 'Ensure sender number, handle, and message text are clearly visible',
    },
    {
      id: 'txn_id',
      label: 'UPI / Payment App Transaction ID',
      hint: profile.transactionId ? `Prefilled ID: ${profile.transactionId}` : 'Found in Google Pay, PhonePe, Paytm, or BHIM transaction history',
    },
    {
      id: 'utr',
      label: '12-digit UTR / IMPS / NEFT Reference Number',
      hint: profile.transactionId ? `Saved reference: ${profile.transactionId}` : 'Required by 1930 and your bank to trace the transaction',
    },
    {
      id: 'scammer_id',
      label: "Scammer's phone number, UPI ID, or bank account",
      hint: profile.scammerContact ? `Prefilled detail: ${profile.scammerContact}` : 'Copy exact spelling from payment receipt and call log',
    },
    {
      id: 'timestamps',
      label: 'Exact date and timestamps of calls and transfers',
      hint: profile.scamDateTime ? `Prefilled time: ${profile.scamDateTime}` : 'Note exact minutes as shown in your bank alert SMS',
    },
  ];

  const urgencyNote =
    data.timeSince === 'under_15m' || data.timeSince === '15m_to_1h'
      ? 'You are inside the critical first 60 minutes — call 1930 immediately. Fast reporting gives your bank the best chance to act, but results are not guaranteed.'
      : 'Even past the first 60 minutes, filing immediately on 1930 and cybercrime.gov.in is essential for bank dispute records and police action.';

  return { steps, emailSubject, emailBody, callScript, evidenceItems, urgencyNote };
}
