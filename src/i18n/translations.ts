import type { Language, RiskLevel, ScamCategory } from '../types';

export interface SampleMessage {
  id: string;
  label: string;
  text: string;
}

export interface TranslationBundle {
  brand: string;
  tagline: string;
  disclaimer: string;
  offlineBanner: string;
  offlineCheckNote: string;
  pwa: {
    installLabel: string;
    iosTitle: string;
    iosSteps: string;
    closeLabel: string;
  };
  settings: {
    buttonLabel: string;
    title: string;
    ultraDarkTitle: string;
    ultraDarkDesc: string;
    ultraDarkOn: string;
    ultraDarkOff: string;
    languageLabel: string;
  };
  nav: {
    home: string;
    check: string;
    sos: string;
    resources: string;
    about: string;
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    primaryCta: string;
    secondaryCta: string;
    callBannerTitle: string;
    callBannerSub: string;
    callNowLabel: string;
    howTitle: string;
    howSubtitle: string;
    steps: Array<{ num: string; title: string; desc: string }>;
    scamTypesTitle: string;
    scamTypesSubtitle: string;
    scamTypes: Array<{ key: ScamCategory; title: string; desc: string }>;
    footerHeading: string;
    footerNote: string;
  };
  check: {
    title: string;
    subtitle: string;
    inputLabel: string;
    placeholder: string;
    charLimitHint: string;
    sampleHeading: string;
    sampleBadge: string;
    samples: SampleMessage[];
    analyzeBtn: string;
    analyzingBtn: string;
    clearBtn: string;
    rateLimitNote: string;
    emptyStateTitle: string;
    emptyStateDesc: string;
    errors: {
      empty: string;
      too_short: string;
      too_long: string;
      rate_limited: string;
      network: string;
    };
    modeBadges: {
      ai: string;
      fallback: string;
      fallbackApiNote: string;
      fallbackNoKeyNote: string;
    };
    resultLabels: {
      scamType: string;
      riskLevel: string;
      highlightedText: string;
      noPhrases: string;
      explanation: string;
      advice: string;
      nextActionCta: string;
    };
    riskLabels: Record<RiskLevel, string>;
  };
  sos: {
    title: string;
    subtitle: string;
    step1Label: string;
    step2Label: string;
    whatHappenedLabel: string;
    whatHappenedHint: string;
    amountLabel: string;
    amountPlaceholder: string;
    amountPresets: string[];
    timeSinceLabel: string;
    generateBtn: string;
    editInputsBtn: string;
    printPdfBtn: string;
    validationErrors: {
      incidentsRequired: string;
      amountRequired: string;
      amountInvalid: string;
    };
    step2Sections: {
      actionPlanTitle: string;
      actionPlanSub: string;
      callScriptTitle: string;
      callScriptSub: string;
      copyScriptBtn: string;
      copiedLabel: string;
      emailTitle: string;
      emailSub: string;
      emailSubjectLabel: string;
      emailBodyLabel: string;
      copyEmailBtn: string;
      resetEmailBtn: string;
      evidenceTitle: string;
      evidenceSub: string;
      evidenceProgress: string;
    };
    emptySummaryState: string;
  };
  resources: {
    title: string;
    subtitle: string;
    cards: Array<{
      title: string;
      badge: string;
      desc: string;
      actionText: string;
      href?: string;
    }>;
    bankChecklistTitle: string;
    bankChecklistItems: string[];
  };
  about: {
    title: string;
    subtitle: string;
    doesTitle: string;
    doesItems: string[];
    doesNotTitle: string;
    doesNotItems: string[];
    privacyTitle: string;
    privacyDesc: string;
  };
  auth: {
    signInGoogle: string;
    signOut: string;
    signingIn: string;
    guestBadge: string;
    guestDesc: string;
    signedInAs: string;
    unverifiedEmail: string;
    errors: {
      popup_closed: string;
      popup_blocked: string;
      session_expired: string;
      unverified_email: string;
      generic: string;
    };
  };
  consent: {
    title: string;
    subtitle: string;
    whatLabel: string;
    whatDesc: string;
    whyLabel: string;
    whyDesc: string;
    whereLabel: string;
    whereDescAccount: string;
    whereDescDevice: string;
    neverSharedNote: string;
    allowBtn: string;
    declineBtn: string;
    withdrawBtn: string;
    grantAgainBtn: string;
    settingsHeading: string;
    statusAllowed: string;
    statusDeclined: string;
    statusUndecided: string;
  };
  profile: {
    navBtnLabel: string;
    title: string;
    subtitle: string;
    honestyNotice: string;
    secretWarning: string;
    storageAccountBadge: string;
    storageDeviceBadge: string;
    storageNoneBadge: string;
    saveBtn: string;
    savingBtn: string;
    savedNote: string;
    deleteBtn: string;
    deletedNote: string;
    exportPdfBtn: string;
    openProfileCta: string;
    syncErrorNote: string;
    fields: {
      fullName: string;
      phone: string;
      email: string;
      cityState: string;
      bankName: string;
      accountLast4: string;
      scamDateTime: string;
      amountLost: string;
      transactionId: string;
      scammerContact: string;
      shortDescription: string;
    };
    placeholders: {
      fullName: string;
      phone: string;
      email: string;
      cityState: string;
      bankName: string;
      accountLast4: string;
      scamDateTime: string;
      amountLost: string;
      transactionId: string;
      scammerContact: string;
      shortDescription: string;
    };
    errors: {
      too_long: string;
      invalid_phone: string;
      invalid_email: string;
      invalid_last4: string;
      invalid_amount: string;
      forbidden_secret: string;
    };
  };
  aiImprove: {
    buttonLabel: string;
    modalTitle: string;
    modalNotice: string;
    previewFieldsHeading: string;
    noProfileFieldsNote: string;
    previewDraftHeading: string;
    confirmSendBtn: string;
    cancelBtn: string;
    loadingText: string;
    successNote: string;
    errorNoKey: string;
    errorApi: string;
    errorSecret: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    brand: 'Scam SOS',
    tagline: 'Scammed? Act in the first 60 minutes.',
    disclaimer:
      'Scam SOS speeds up reporting. It cannot recover money or replace your bank or the police.',
    offlineBanner:
      'Limited or offline connection — SOS Guide, 1930 script, and cached resources remain available.',
    offlineCheckNote:
      'Offline mode: network unavailable, so this message was checked locally on your device using our rule-based detector.',
    pwa: {
      installLabel: 'Save app for offline',
      iosTitle: 'Save Scam SOS to Home Screen',
      iosSteps:
        'Tap the Share button in Safari, then scroll down and choose "Add to Home Screen" for offline access.',
      closeLabel: 'Close',
    },
    settings: {
      buttonLabel: 'Settings',
      title: 'Display & Settings',
      ultraDarkTitle: 'Ultra-Dark High-Contrast Mode',
      ultraDarkDesc:
        'Pure black (#000000) canvas, sharper borders, and crisp white text for extreme bright daylight when reporting outdoors.',
      ultraDarkOn: 'Enabled',
      ultraDarkOff: 'Standard',
      languageLabel: 'Language',
    },
    nav: {
      home: 'Home',
      check: 'Check Message',
      sos: 'SOS Guide',
      resources: 'Resources',
      about: 'About',
    },
    home: {
      heroEyebrow: 'First-Hour Cyber Fraud Response · India',
      heroTitle: 'Scammed? Act in the first 60 minutes.',
      heroSubtitle:
        'Generate an urgency-ordered action plan, a ready-to-read 1930 helpline script, and an editable bank dispute email in seconds—or inspect a suspicious SMS/WhatsApp message before clicking.',
      primaryCta: "I've been scammed",
      secondaryCta: 'Check a message',
      callBannerTitle: 'National Cyber Crime Helpline: 1930',
      callBannerSub:
        'If money just left your account, call 1930 immediately. Fast reporting gives your bank the best chance to act, but results are not guaranteed.',
      callNowLabel: 'Call 1930',
      howTitle: 'How the first 60 minutes work',
      howSubtitle: 'Clear steps designed for panic-free execution when every minute counts.',
      steps: [
        {
          num: '01',
          title: 'Log what happened',
          desc: 'Pick how the scam happened, enter the INR amount lost, and select how long ago it occurred.',
        },
        {
          num: '02',
          title: 'Follow the priority sequence',
          desc: 'Get an immediate 1930 call script, card/UPI blocking steps, and an editable complaint email filled with your details.',
        },
        {
          num: '03',
          title: 'Lock down evidence',
          desc: 'Use the evidence checklist for UTR numbers and screenshots, then print or save everything as a PDF.',
        },
      ],
      scamTypesTitle: 'Common Indian scam patterns we cover',
      scamTypesSubtitle: 'Recognize the tactic fast or launch the SOS response if you already interacted.',
      scamTypes: [
        {
          key: 'upi_collect_request',
          title: 'UPI Collect / QR Traps',
          desc: 'Fake refund or buyer requests asking you to enter your UPI PIN to "receive" funds.',
        },
        {
          key: 'fake_kyc',
          title: 'Fake KYC & Account Block',
          desc: 'Urgent SMS threats claiming your bank, PAN, SIM, or electricity will disconnect today.',
        },
        {
          key: 'otp_theft',
          title: 'OTP / Screen-Share Theft',
          desc: 'Callers posing as support asking for OTPs, CVVs, or remote-access apps like AnyDesk.',
        },
        {
          key: 'job_scam',
          title: 'Part-Time & Prepaid Tasks',
          desc: 'Telegram/WhatsApp offers paying for likes or reviews before demanding deposit tiers.',
        },
        {
          key: 'lottery_reward',
          title: 'Lottery & Cashback Baits',
          desc: 'Unsolicited prize links asking for processing charges or UPI approvals.',
        },
        {
          key: 'impersonation',
          title: 'Police / CBI / Courier Threats',
          desc: '"Digital arrest" video calls or fake customs parcel seizures demanding immediate transfers.',
        },
      ],
      footerHeading: 'Official Indian Cyber Fraud Channels',
      footerNote:
        'No login required. Message text is never stored. Built strictly as a rapid-reporting aid.',
    },
    check: {
      title: 'Check a suspicious message',
      subtitle:
        'Paste an SMS, WhatsApp forward, or email to identify common scam tactics and flagged phrases.',
      inputLabel: 'Message text to inspect',
      placeholder:
        'Paste the SMS, WhatsApp message, or email here (e.g. "URGENT: Your KYC is suspended, update at...")',
      charLimitHint: 'Max 4,000 characters · Nothing you paste is stored',
      sampleHeading: 'Try an example',
      sampleBadge: 'Sample data',
      samples: [
        {
          id: 'kyc',
          label: 'Fake Bank KYC SMS',
          text: 'URGENT: Dear customer, your SBI YONO KYC has expired today. Your account will be blocked in 2 hours. Update PAN immediately at https://bit.ly/sbi-kyc-update99 or call +91-9876500000.',
        },
        {
          id: 'upi',
          label: 'UPI PIN-to-Receive Trap',
          text: 'Congratulations! Your ₹12,500 cashback reward is approved. Open your UPI app, accept the collect request, and enter your UPI PIN within 10 minutes to receive money.',
        },
        {
          id: 'arrest',
          label: 'Impersonation / Digital Arrest',
          text: 'FINAL NOTICE from Mumbai Cyber Cell & FedEx: A parcel linked to your Aadhaar was seized with illegal items. Join video verification immediately to avoid arrest warrant.',
        },
      ],
      analyzeBtn: 'Analyze message',
      analyzingBtn: 'Analyzing...',
      clearBtn: 'Clear',
      rateLimitNote: 'Basic client-side cap: up to 10 checks per minute.',
      emptyStateTitle: 'No message analyzed yet',
      emptyStateDesc:
        'Paste a message above or click one of the Sample data examples to inspect risk signals and highlighted red flags.',
      errors: {
        empty: 'Please paste a message before running a check.',
        too_short: 'Message is too short to analyze. Paste the full SMS or WhatsApp text.',
        too_long: 'Message exceeds 4,000 characters. Trim it to the suspicious portion and try again.',
        rate_limited: 'Too many checks, try again in a minute.',
        network: 'Could not reach the analysis service. Check your connection and try again.',
      },
      modeBadges: {
        ai: 'AI mode',
        fallback: 'Rule-based fallback mode',
        fallbackApiNote:
          'The AI service was unavailable, so this result was generated locally using our rule-based detector.',
        fallbackNoKeyNote:
          'AI key is not configured on the server, so this result used our local rule-based detector.',
      },
      resultLabels: {
        scamType: 'Detected pattern',
        riskLevel: 'Risk level',
        highlightedText: 'Message with flagged phrases highlighted',
        noPhrases: 'No specific red-flag phrases isolated.',
        explanation: 'Plain-language assessment',
        advice: 'Recommended next steps',
        nextActionCta: 'Already paid or shared OTP? Open SOS Guide',
      },
      riskLabels: {
        Low: 'Low (Not guaranteed safe)',
        Medium: 'Medium Risk',
        High: 'High Risk',
        Critical: 'Critical Risk',
        Unknown: 'Unknown / Inconclusive',
      },
    },
    sos: {
      title: 'Emergency SOS Action Plan',
      subtitle: 'Answer 3 quick details to generate your 60-minute response kit.',
      step1Label: '01. What happened',
      step2Label: '02. Action kit & email',
      whatHappenedLabel: 'What happened? (Select all that apply)',
      whatHappenedHint: 'Tap every action you took so your plan prioritizes the right blocks.',
      amountLabel: 'Approximate amount lost (INR ₹)',
      amountPlaceholder: 'e.g. 25000 (enter 0 if nothing deducted yet)',
      amountPresets: ['0', '5000', '15000', '50000'],
      timeSinceLabel: 'How long ago did this happen?',
      generateBtn: 'Generate my SOS plan',
      editInputsBtn: 'Edit incident details',
      printPdfBtn: 'Print / Save as PDF',
      validationErrors: {
        incidentsRequired: 'Select at least one option describing what happened.',
        amountRequired: 'Enter the amount lost in INR (enter 0 if no money was deducted yet).',
        amountInvalid: 'Enter a valid non-negative number in INR.',
      },
      step2Sections: {
        actionPlanTitle: 'Urgency-ordered action plan',
        actionPlanSub: 'Execute from #1 to #4 in strict order.',
        callScriptTitle: '30-second script for the 1930 helpline call',
        callScriptSub: 'Read this aloud when the 1930 operator answers.',
        copyScriptBtn: 'Copy script',
        copiedLabel: 'Copied',
        emailTitle: 'Auto-generated bank complaint email',
        emailSub: 'Uses your exact inputs. Edit placeholders in brackets, then copy and send.',
        emailSubjectLabel: 'Subject',
        emailBodyLabel: 'Email body (editable)',
        copyEmailBtn: 'Copy email',
        resetEmailBtn: 'Reset template',
        evidenceTitle: 'Evidence checklist',
        evidenceSub: 'Gather these before filing on cybercrime.gov.in.',
        evidenceProgress: 'ready',
      },
      emptySummaryState: 'Complete Step 1 to generate your custom SOS action plan and bank email.',
    },
    resources: {
      title: 'Official India Reporting Channels',
      subtitle: 'Use only official government and bank channels. Beware of fake "recovery agents" online.',
      cards: [
        {
          title: 'National Cyber Crime Helpline — 1930',
          badge: '24×7 Toll-Free Voice Helpline',
          desc: 'If money just left your account, call 1930 immediately. Fast reporting gives your bank the best chance to act, but results are not guaranteed.',
          actionText: 'Call 1930',
          href: 'tel:1930',
        },
        {
          title: 'National Cyber Crime Portal — cybercrime.gov.in',
          badge: 'Official Government Portal',
          desc: 'File your formal financial cyber fraud complaint online, upload UTR proofs and screenshots, and track your acknowledgement number.',
          actionText: 'Visit cybercrime.gov.in',
          href: 'https://cybercrime.gov.in',
        },
        {
          title: 'Contact your bank immediately',
          badge: 'Card, UPI & NetBanking Block',
          desc: 'Use the toll-free number printed on the back of your debit/credit card or inside your official banking app. Never call helpline numbers found via web search ads.',
          actionText: 'Generate Bank Dispute Email',
        },
      ],
      bankChecklistTitle: 'What to tell your bank immediately',
      bankChecklistItems: [
        'Request immediate blocking of compromised debit/credit cards, UPI ID, or net-banking access.',
        'State clearly that the transaction was an unauthorized / fraudulent transfer and ask for a written dispute ticket number.',
        'Share the 12-digit UTR number and exact timestamp so the bank can log and investigate the transfer.',
      ],
    },
    about: {
      title: 'About Scam SOS',
      subtitle: 'A fast, privacy-first response guide for the critical first hour after cyber fraud.',
      doesTitle: 'What Scam SOS does',
      doesItems: [
        'Structures your first 60 minutes into clear priority steps (1930 helpline, bank notification & card/UPI block, cybercrime.gov.in, evidence).',
        'Generates a customized, editable bank complaint email and 30-second 1930 call script from your inputs.',
        'Analyzes suspicious messages using AI (with an automatic rule-based fallback) and highlights red-flag phrases.',
        'Works in English, Hindi, and Telugu without requiring any account or login.',
      ],
      doesNotTitle: 'What Scam SOS does NOT do',
      doesNotItems: [
        'It cannot recover stolen money, reverse UPI transactions, or freeze bank accounts on your behalf.',
        'It does not replace your bank’s fraud desk, the 1930 helpline, or local police / cybercrime.gov.in.',
        'It never guarantees that a message labeled Low or Unknown risk is safe—always verify independently.',
        'The 10-checks-per-minute request cap is a basic client-side limit to prevent accidental spam, not a security mechanism.',
      ],
      privacyTitle: 'Zero message storage',
      privacyDesc:
        'Messages pasted into Check Message are processed transiently and are never stored in a database or user profile. Your SOS form inputs stay strictly inside your current browser session.',
    },
    auth: {
      signInGoogle: 'Sign in with Google',
      signOut: 'Sign out',
      signingIn: 'Signing in...',
      guestBadge: 'Guest mode (no sign-in required)',
      guestDesc: 'You can use every SOS tool immediately without signing in.',
      signedInAs: 'Signed in as',
      unverifiedEmail: 'Please use a verified Google email address to sync privately.',
      errors: {
        popup_closed: 'Sign-in was cancelled. You can continue using Scam SOS in guest mode.',
        popup_blocked: 'Browser blocked the sign-in popup. Allow popups for this site or continue in guest mode.',
        session_expired: 'Your session has expired. Please sign in again to sync your reporting profile.',
        unverified_email: 'Google account email must be verified before saving privately.',
        generic: 'Sign-in did not complete. You can keep using all tools in guest mode.',
      },
    },
    consent: {
      title: 'Optional Reporting Profile Consent',
      subtitle: 'Scam SOS prepares details for your 1930 call and bank email. Saving details is optional.',
      whatLabel: 'What may be saved (all optional)',
      whatDesc: 'Contact details (name, phone, email, city/state), bank name + last 4 digits only, and scam details (time, amount, UTR/transaction ID, scammer handle, short summary). Never OTP, PIN, CVV, password, Aadhaar, PAN, or full card numbers.',
      whyLabel: 'Why it is used',
      whyDesc: 'Only to prefill your 1930 call script, bank dispute email draft, and evidence checklist.',
      whereLabel: 'Where it is stored',
      whereDescAccount: 'Signed in: stored privately under your own Google account UID and never shared or sold.',
      whereDescDevice: 'Guest mode: Saved on this device only (browser storage), never sent to any server unless you tap "Use AI to improve my complaint".',
      neverSharedNote: 'Never shared, never sold, and never sent to authorities automatically. You can delete everything or withdraw consent anytime in Settings.',
      allowBtn: 'Allow',
      declineBtn: 'No thanks, continue without saving',
      withdrawBtn: 'Withdraw consent & delete saved data',
      grantAgainBtn: 'Review consent to enable Reporting Profile',
      settingsHeading: 'Reporting Profile & Privacy Consent',
      statusAllowed: 'Consent granted — Reporting Profile enabled',
      statusDeclined: 'Consent declined — nothing is saved',
      statusUndecided: 'Not decided yet — nothing is saved',
    },
    profile: {
      navBtnLabel: 'Reporting Profile',
      title: 'Reporting Profile',
      subtitle: 'Optional details that prefill your 1930 script, bank email, and evidence checklist.',
      honestyNotice: 'Honest notice: Scam SOS does NOT submit reports to 1930, cybercrime.gov.in, or your bank. It only prepares your details so you can read them on the call and paste them into official complaints.',
      secretWarning: 'Never enter your OTP, PIN, CVV or password here.',
      storageAccountBadge: 'Synced privately to your Google account',
      storageDeviceBadge: 'Saved on this device only',
      storageNoneBadge: 'Not saved (consent not granted)',
      saveBtn: 'Save & apply to SOS',
      savingBtn: 'Saving...',
      savedNote: 'Reporting profile saved and applied to your SOS kit.',
      deleteBtn: 'Delete my data',
      deletedNote: 'All saved reporting profile data has been deleted immediately.',
      exportPdfBtn: 'Export as PDF',
      openProfileCta: 'Reporting Profile',
      syncErrorNote: 'Could not sync with cloud storage right now. Check your connection or sign in again.',
      fields: {
        fullName: 'Full name',
        phone: 'Phone number',
        email: 'Email address',
        cityState: 'City / State',
        bankName: 'Bank name',
        accountLast4: 'Last 4 digits of account / card only',
        scamDateTime: 'Scam date & time',
        amountLost: 'Amount lost (INR ₹)',
        transactionId: 'Transaction ID / 12-digit UTR',
        scammerContact: "Scammer's phone / UPI ID / website",
        shortDescription: 'Short description of incident',
      },
      placeholders: {
        fullName: 'e.g. Rajesh Kumar',
        phone: 'e.g. +91 98XXXXXXXX',
        email: 'e.g. name@example.com',
        cityState: 'e.g. Hyderabad, Telangana',
        bankName: 'e.g. State Bank of India / HDFC Bank',
        accountLast4: '4 digits only (e.g. 4821)',
        scamDateTime: 'e.g. 18 Nov 2026, 2:15 PM',
        amountLost: 'e.g. 15000',
        transactionId: 'e.g. 432198765432',
        scammerContact: 'e.g. fakehelp@upi or +91-9XXXXXXXXX',
        shortDescription: 'Briefly describe what happened without any OTP, PIN, CVV, or password.',
      },
      errors: {
        too_long: 'Value exceeds the allowed character limit.',
        invalid_phone: 'Enter a valid 7–15 digit phone number.',
        invalid_email: 'Enter a valid email address.',
        invalid_last4: 'Enter exactly 4 numeric digits only.',
        invalid_amount: 'Enter a valid non-negative INR amount.',
        forbidden_secret: 'Blocked: Never enter OTPs, PINs, CVVs, passwords, Aadhaar, PAN, or full card numbers here.',
      },
    },
    aiImprove: {
      buttonLabel: 'Use AI to improve my complaint',
      modalTitle: 'Preview before sending to AI',
      modalNotice: 'Nothing from your profile is sent unless you confirm below. Review the exact draft and fields that will be sent to polish your complaint email:',
      previewFieldsHeading: 'Profile context fields to send',
      noProfileFieldsNote: 'No personal profile fields saved — only your current draft text will be sent.',
      previewDraftHeading: 'Draft text to polish',
      confirmSendBtn: 'Send & improve email',
      cancelBtn: 'Cancel',
      loadingText: 'Polishing your bank complaint draft...',
      successNote: 'Bank complaint draft updated.',
      errorNoKey: 'AI complaint helper is not configured on this server. You can edit the draft directly.',
      errorApi: 'AI service could not process the request right now. Your draft remains unchanged.',
      errorSecret: 'Remove any OTP, PIN, CVV, password, or PAN before sending to AI.',
    },
  },
  hi: {
    brand: 'Scam SOS',
    tagline: 'धोखाधड़ी हुई? पहले 60 मिनट में कदम उठाएं।',
    disclaimer:
      'Scam SOS रिपोर्टिंग को तेज करता है। यह पैसे वापस नहीं दिला सकता और न ही आपके बैंक या पुलिस का विकल्प है।',
    offlineBanner:
      'सीमित या ऑफलाइन कनेक्शन — SOS गाइड, 1930 स्क्रिप्ट और सेव किए गए पेज अभी भी उपलब्ध हैं।',
    offlineCheckNote:
      'ऑफलाइन मोड: नेटवर्क उपलब्ध न होने के कारण यह संदेश आपके डिवाइस पर स्थानीय नियम-आधारित डिटेक्टर से जांचा गया।',
    pwa: {
      installLabel: 'ऑफलाइन के लिए ऐप सेव करें',
      iosTitle: 'होम स्क्रीन पर Scam SOS जोड़ें',
      iosSteps:
        'Safari में Share बटन दबाएं, फिर नीचे स्क्रॉल करके "Add to Home Screen" चुनें।',
      closeLabel: 'बंद करें',
    },
    settings: {
      buttonLabel: 'सेटिंग्स',
      title: 'डिस्प्ले और सेटिंग्स',
      ultraDarkTitle: 'अल्ट्रा-डार्क हाई-कंट्रास्ट मोड',
      ultraDarkDesc:
        'बाहर तेज धूप में रिपोर्ट करते समय अधिकतम पठनीयता के लिए शुद्ध काला (#000000) बैकग्राउंड और तेज बॉर्डर।',
      ultraDarkOn: 'चालू',
      ultraDarkOff: 'सामान्य',
      languageLabel: 'भाषा',
    },
    nav: {
      home: 'होम',
      check: 'संदेश जांचें',
      sos: 'SOS गाइड',
      resources: 'आधिकारिक मदद',
      about: 'परिचय',
    },
    home: {
      heroEyebrow: 'प्रथम-घंटा साइबर फ्रॉड सहायता · भारत',
      heroTitle: 'धोखाधड़ी हुई? पहले 60 मिनट में कदम उठाएं।',
      heroSubtitle:
        'तुरंत प्राथमिकता-आधारित एक्शन प्लान, 1930 हेल्पलाइन कॉल स्क्रिप्ट और बैंक विवाद ईमेल तैयार करें — या किसी संदिग्ध SMS/WhatsApp संदेश की जांच करें।',
      primaryCta: 'मेरे साथ ठगी हुई है',
      secondaryCta: 'संदेश जांचें',
      callBannerTitle: 'राष्ट्रीय साइबर क्राइम हेल्पलाइन: 1930',
      callBannerSub:
        'यदि अभी-अभी आपके खाते से पैसे कटे हैं, तो तुरंत 1930 पर कॉल करें। त्वरित रिपोर्टिंग आपके बैंक को कार्रवाई करने का सबसे अच्छा अवसर देती है, लेकिन परिणाम की गारंटी नहीं है।',
      callNowLabel: '1930 पर कॉल करें',
      howTitle: 'पहले 60 मिनट में कैसे काम करें',
      howSubtitle: 'घबराहट के बिना तुरंत सही कदम उठाने के लिए स्पष्ट प्रक्रिया।',
      steps: [
        {
          num: '01',
          title: 'घटना दर्ज करें',
          desc: 'चुनें कि क्या हुआ, अनुमानित नुकसान (₹) लिखें और बताएं कि कितना समय बीता है।',
        },
        {
          num: '02',
          title: 'प्राथमिकता क्रम अपनाएं',
          desc: 'अपनी जानकारी के साथ तैयार 1930 कॉल स्क्रिप्ट, कार्ड/UPI ब्लॉक निर्देश और संपादन-योग्य ईमेल पाएं।',
        },
        {
          num: '03',
          title: 'सबूत सुरक्षित करें',
          desc: 'UTR नंबर और स्क्रीनशॉट चेकलिस्ट पूरा करें और सब कुछ PDF के रूप में सेव या प्रिंट करें।',
        },
      ],
      scamTypesTitle: 'आम भारतीय साइबर ठगी के तरीके',
      scamTypesSubtitle: 'ठगी के पैटर्न को पहचानें या तुरंत SOS सहायता शुरू करें।',
      scamTypes: [
        {
          key: 'upi_collect_request',
          title: 'UPI कलेक्ट / QR जाल',
          desc: 'पैसे या रिफंड पाने के नाम पर UPI पिन डालने या रिक्वेस्ट स्वीकार करने का झांसा।',
        },
        {
          key: 'fake_kyc',
          title: 'फर्जी KYC और खाता बंद धमकी',
          desc: 'बैंक, पैन, सिम या बिजली आज ही बंद होने की झूठी चेतावनी वाले SMS लिंक।',
        },
        {
          key: 'otp_theft',
          title: 'OTP / स्क्रीन-शेयर चोरी',
          desc: 'कस्टमर केयर बनकर OTP, CVV या AnyDesk जैसे रिमोट ऐप इंस्टॉल करवाना।',
        },
        {
          key: 'job_scam',
          title: 'पार्ट-टाइम व प्रीपेड टास्क ठगी',
          desc: 'टेलीग्राम/व्हाट्सएप पर लाइक या रिव्यू के बदले कमाई और फिर जमा मांगने का जाल।',
        },
        {
          key: 'lottery_reward',
          title: 'लॉटरी और कैशबैक लालच',
          desc: 'अनचाहे इनाम का दावा और प्रोसेसिंग फीस या UPI स्वीकृति मांगना।',
        },
        {
          key: 'impersonation',
          title: 'पुलिस / CBI / कूरियर धमकी',
          desc: '"डिजिटल अरेस्ट" वीडियो कॉल या फर्जी पार्सल जब्ती बताकर तुरंत पैसे मांगना।',
        },
      ],
      footerHeading: 'आधिकारिक भारतीय साइबर सहायता चैनल',
      footerNote:
        'लॉगिन की आवश्यकता नहीं। संदेश सामग्री कभी सेव नहीं की जाती। केवल त्वरित रिपोर्टिंग सहायता।',
    },
    check: {
      title: 'संदिग्ध संदेश जांचें',
      subtitle:
        'संदिग्ध शब्दों और आम ठगी संकेतों की पहचान करने के लिए SMS, WhatsApp संदेश या ईमेल पेस्ट करें।',
      inputLabel: 'जांच के लिए संदेश',
      placeholder:
        'यहाँ SMS, WhatsApp संदेश या ईमेल पेस्ट करें (उदा. "URGENT: Your KYC is suspended...")',
      charLimitHint: 'अधिकतम 4,000 अक्षर · आपका संदेश कहीं सेव नहीं होता',
      sampleHeading: 'उदाहरण आजमाएं',
      sampleBadge: 'Sample data',
      samples: [
        {
          id: 'kyc',
          label: 'फर्जी बैंक KYC SMS',
          text: 'URGENT: Dear customer, your SBI YONO KYC has expired today. Your account will be blocked in 2 hours. Update PAN immediately at https://bit.ly/sbi-kyc-update99 or call +91-9876500000.',
        },
        {
          id: 'upi',
          label: 'UPI पिन-से-पैसे का जाल',
          text: 'बधाई हो! आपका ₹12,500 कैशबैक मंजूर हुआ है। पैसे प्राप्त करने के लिए तुरंत UPI ऐप खोलें, रिक्वेस्ट स्वीकार करें और अपना UPI पिन डालें।',
        },
        {
          id: 'arrest',
          label: 'डिजिटल अरेस्ट धमकी',
          text: 'FINAL NOTICE from Mumbai Cyber Cell & FedEx: A parcel linked to your Aadhaar was seized with illegal items. Join video verification immediately to avoid arrest warrant.',
        },
      ],
      analyzeBtn: 'संदेश जांचें',
      analyzingBtn: 'जांच जारी है...',
      clearBtn: 'साफ करें',
      rateLimitNote: 'बुनियादी क्लाइंट-साइड सीमा: प्रति मिनट अधिकतम 10 जांच।',
      emptyStateTitle: 'अभी कोई संदेश जांचा नहीं गया',
      emptyStateDesc:
        'ऊपर कोई संदेश पेस्ट करें या जोखिम संकेत देखने के लिए Sample data उदाहरणों में से कोई चुनें।',
      errors: {
        empty: 'कृपया जांच से पहले कोई संदेश पेस्ट करें।',
        too_short: 'संदेश बहुत छोटा है। कृपया पूरा SMS या WhatsApp संदेश पेस्ट करें।',
        too_long: 'संदेश 4,000 अक्षरों से अधिक है। कृपया इसे छोटा करें।',
        rate_limited: 'बहुत अधिक जांच हो गईं, कृपया एक मिनट बाद फिर प्रयास करें।',
        network: 'विश्लेषण सेवा से संपर्क नहीं हो सका। कृपया इंटरनेट जांचकर पुनः प्रयास करें।',
      },
      modeBadges: {
        ai: 'AI mode',
        fallback: 'Rule-based fallback mode',
        fallbackApiNote:
          'AI सेवा उपलब्ध न होने के कारण यह परिणाम हमारे स्थानीय नियम-आधारित डिटेक्टर से बना है।',
        fallbackNoKeyNote:
          'सर्वर पर AI कुंजी सेट न होने के कारण स्थानीय नियम-आधारित जांच का उपयोग किया गया है।',
      },
      resultLabels: {
        scamType: 'पहचाना गया पैटर्न',
        riskLevel: 'जोखिम स्तर',
        highlightedText: 'चिह्नित वाक्यांशों के साथ संदेश',
        noPhrases: 'कोई विशेष संदिग्ध वाक्यांश अलग नहीं हुआ।',
        explanation: 'सरल भाषा में विवरण',
        advice: 'सुझाए गए अगले कदम',
        nextActionCta: 'पैसे भेज दिए या OTP साझा किया? SOS गाइड खोलें',
      },
      riskLabels: {
        Low: 'कम (सुरक्षित की गारंटी नहीं)',
        Medium: 'मध्यम जोखिम',
        High: 'उच्च जोखिम',
        Critical: 'गंभीर जोखिम',
        Unknown: 'अज्ञात / अनिश्चित',
      },
    },
    sos: {
      title: 'आपातकालीन SOS एक्शन प्लान',
      subtitle: 'अपनी 60-मिनट की प्रतिक्रिया किट बनाने के लिए 3 त्वरित जानकारी दें।',
      step1Label: '01. क्या हुआ',
      step2Label: '02. एक्शन किट व ईमेल',
      whatHappenedLabel: 'क्या हुआ? (जो लागू हो सभी चुनें)',
      whatHappenedHint: 'आपने जो भी किया हो उसे चुनें ताकि सही ब्लॉक प्राथमिकता तय हो सके।',
      amountLabel: 'अनुमानित नुकसान राशि (INR ₹)',
      amountPlaceholder: 'जैसे 25000 (यदि पैसे नहीं कटे तो 0 लिखें)',
      amountPresets: ['0', '5000', '15000', '50000'],
      timeSinceLabel: 'यह घटना कितने समय पहले हुई?',
      generateBtn: 'मेरा SOS प्लान बनाएं',
      editInputsBtn: 'विवरण बदलें',
      printPdfBtn: 'प्रिंट / PDF सेव करें',
      validationErrors: {
        incidentsRequired: 'कृपया कम से कम एक विकल्प चुनें कि क्या हुआ।',
        amountRequired: 'कृपया नुकसान की राशि दर्ज करें (पैसे न कटे हों तो 0 लिखें)।',
        amountInvalid: 'कृपया INR में सही धनात्मक संख्या दर्ज करें।',
      },
      step2Sections: {
        actionPlanTitle: 'प्राथमिकता क्रम में एक्शन प्लान',
        actionPlanSub: 'क्रम संख्या #1 से #4 तक तुरंत पालन करें।',
        callScriptTitle: '1930 हेल्पलाइन कॉल के लिए 30-सेकंड स्क्रिप्ट',
        callScriptSub: '1930 ऑपरेटर के कॉल उठाते ही इसे पढ़कर सुनाएं।',
        copyScriptBtn: 'स्क्रिप्ट कॉपी करें',
        copiedLabel: 'कॉपी हो गया',
        emailTitle: 'स्वतः तैयार बैंक शिकायत ईमेल',
        emailSub: 'आपकी जानकारी के अनुसार तैयार। कोष्ठक में विवरण भरें, कॉपी करें और भेजें।',
        emailSubjectLabel: 'विषय (Subject)',
        emailBodyLabel: 'ईमेल सामग्री (संपादन योग्य)',
        copyEmailBtn: 'ईमेल कॉपी करें',
        resetEmailBtn: 'रीसेट करें',
        evidenceTitle: 'सबूत चेकलिस्ट',
        evidenceSub: 'cybercrime.gov.in पर शिकायत से पहले इन्हें जुटाएं।',
        evidenceProgress: 'तैयार',
      },
      emptySummaryState: 'अपना कस्टम SOS प्लान और बैंक ईमेल बनाने के लिए चरण 1 पूरा करें।',
    },
    resources: {
      title: 'आधिकारिक भारतीय रिपोर्टिंग माध्यम',
      subtitle: 'केवल आधिकारिक सरकारी और बैंक माध्यमों का उपयोग करें। ऑनलाइन फर्जी "रिकवरी एजेंट" से सावधान रहें।',
      cards: [
        {
          title: 'राष्ट्रीय साइबर क्राइम हेल्पलाइन — 1930',
          badge: '24×7 टोल-फ्री वॉइस हेल्पलाइन',
          desc: 'यदि अभी-अभी आपके खाते से पैसे कटे हैं, तो तुरंत 1930 पर कॉल करें। त्वरित रिपोर्टिंग आपके बैंक को कार्रवाई करने का सबसे अच्छा अवसर देती है, लेकिन परिणाम की गारंटी नहीं है।',
          actionText: '1930 पर कॉल करें',
          href: 'tel:1930',
        },
        {
          title: 'राष्ट्रीय साइबर क्राइम पोर्टल — cybercrime.gov.in',
          badge: 'आधिकारिक सरकारी पोर्टल',
          desc: 'ऑनलाइन वित्तीय साइबर धोखाधड़ी की औपचारिक शिकायत दर्ज करें, UTR प्रमाण और स्क्रीनशॉट अपलोड करें।',
          actionText: 'cybercrime.gov.in खोलें',
          href: 'https://cybercrime.gov.in',
        },
        {
          title: 'तुरंत अपने बैंक से संपर्क करें',
          badge: 'कार्ड, UPI और नेटबैंकिंग ब्लॉक',
          desc: 'अपने डेबिट/क्रेडिट कार्ड के पीछे लिखे नंबर या आधिकारिक बैंक ऐप के नंबर पर ही कॉल करें। सर्च विज्ञापनों में मिले नंबरों पर कॉल न करें।',
          actionText: 'बैंक शिकायत ईमेल बनाएं',
        },
      ],
      bankChecklistTitle: 'अपने बैंक को तुरंत क्या बताएं',
      bankChecklistItems: [
        'प्रभावित डेबिट/क्रेडिट कार्ड, UPI ID या नेटबैंकिंग को तुरंत ब्लॉक करने का अनुरोध करें।',
        'स्पष्ट रूप से बताएं कि यह अनधिकृत/धोखाधड़ी लेन-देन है और लिखित शिकायत टिकट नंबर मांगें।',
        '12 अंकों का UTR नंबर और सटीक समय साझा करें ताकि बैंक लेन-देन की जांच कर सके।',
      ],
    },
    about: {
      title: 'Scam SOS के बारे में',
      subtitle: 'साइबर ठगी के बाद पहले महत्वपूर्ण घंटे के लिए तेज और गोपनीय प्रतिक्रिया गाइड।',
      doesTitle: 'Scam SOS क्या करता है',
      doesItems: [
        'आपके पहले 60 मिनट को स्पष्ट प्राथमिकता चरणों (1930, बैंक सूचना व कार्ड/UPI ब्लॉक, cybercrime.gov.in, सबूत) में व्यवस्थित करता है।',
        'आपकी जानकारी के आधार पर तुरंत संपादन-योग्य बैंक शिकायत ईमेल और 1930 कॉल स्क्रिप्ट तैयार करता है।',
        'AI (और स्वचालित नियम-आधारित बैकअप) से संदिग्ध संदेशों की जांच कर खतरे के संकेत हाईलाइट करता है।',
        'बिना किसी लॉगिन के अंग्रेजी, हिंदी और तेलुगु में काम करता है।',
      ],
      doesNotTitle: 'Scam SOS क्या नहीं करता है',
      doesNotItems: [
        'यह चोरी हुए पैसे वापस नहीं दिला सकता, UPI लेन-देन रद्द नहीं कर सकता और न ही बैंक खाते फ्रीज कर सकता है।',
        'यह आपके बैंक की फ्रॉड टीम, 1930 हेल्पलाइन या पुलिस / cybercrime.gov.in का विकल्प नहीं है।',
        'यह कभी गारंटी नहीं देता कि कम या अज्ञात जोखिम वाला संदेश सुरक्षित है—हमेशा स्वतंत्र पुष्टि करें।',
        'प्रति मिनट 10 जांच की सीमा एक बुनियादी क्लाइंट-साइड नियंत्रण है, कोई सुरक्षा प्रणाली नहीं।',
      ],
      privacyTitle: 'शून्य संदेश संग्रहण',
      privacyDesc:
        'संदेश जांच में पेस्ट किया गया टेक्स्ट अस्थायी रूप से प्रोसेस होता है और किसी डेटाबेस में सेव नहीं किया जाता। SOS फॉर्म की जानकारी केवल आपके वर्तमान ब्राउज़र सत्र में रहती है।',
    },
    auth: {
      signInGoogle: 'Google से साइन इन करें',
      signOut: 'साइन आउट',
      signingIn: 'साइन इन हो रहा है...',
      guestBadge: 'गेस्ट मोड (साइन-इन अनिवार्य नहीं)',
      guestDesc: 'आप बिना साइन इन किए तुरंत सभी SOS टूल उपयोग कर सकते हैं।',
      signedInAs: 'साइन इन खाता',
      unverifiedEmail: 'निजी सिंक के लिए कृपया सत्यापित Google ईमेल उपयोग करें।',
      errors: {
        popup_closed: 'साइन-इन रद्द कर दिया गया। आप गेस्ट मोड में ऐप का उपयोग जारी रख सकते हैं।',
        popup_blocked: 'ब्राउज़र ने साइन-इन पॉपअप रोका है। पॉपअप अनुमति दें या गेस्ट मोड में जारी रखें।',
        session_expired: 'आपका सत्र समाप्त हो गया है। प्रोफ़ाइल सिंक करने के लिए फिर से साइन इन करें।',
        unverified_email: 'निजी रूप से सेव करने के लिए Google ईमेल सत्यापित होना जरूरी है।',
        generic: 'साइन-इन पूरा नहीं हो सका। आप गेस्ट मोड में सभी टूल उपयोग कर सकते हैं।',
      },
    },
    consent: {
      title: 'वैकल्पिक रिपोर्टिंग प्रोफ़ाइल सहमति',
      subtitle: 'Scam SOS आपके 1930 कॉल और बैंक ईमेल के लिए विवरण तैयार करता है। विवरण सेव करना वैकल्पिक है।',
      whatLabel: 'क्या सेव किया जा सकता है (सभी वैकल्पिक)',
      whatDesc: 'संपर्क विवरण (नाम, फोन, ईमेल, शहर/राज्य), बैंक का नाम और खाते के अंतिम 4 अंक, तथा घटना का विवरण (समय, राशि, UTR/ट्रांजेक्शन आईडी, ठग का नंबर/UPI)। कभी भी OTP, PIN, CVV, पासवर्ड, आधार, पैन या पूरा कार्ड नंबर नहीं।',
      whyLabel: 'उपयोग का उद्देश्य',
      whyDesc: 'केवल आपकी 1930 कॉल स्क्रिप्ट, बैंक शिकायत ईमेल और सबूत चेकलिस्ट में विवरण स्वतः भरने के लिए।',
      whereLabel: 'कहाँ सेव होता है',
      whereDescAccount: 'साइन इन होने पर: केवल आपके Google खाते के अंतर्गत निजी रूप से सेव होता है, कभी साझा या बेचा नहीं जाता।',
      whereDescDevice: 'गेस्ट मोड: केवल इसी डिवाइस पर सेव (ब्राउज़र स्टोरेज), जब तक आप "Use AI to improve my complaint" न दबाएं तब तक किसी सर्वर पर नहीं भेजा जाता।',
      neverSharedNote: 'डेटा कभी साझा या बेचा नहीं जाता और अधिकारियों को अपने आप नहीं भेजा जाता। आप सेटिंग्स में कभी भी सहमति वापस ले सकते हैं।',
      allowBtn: 'अनुमति दें (Allow)',
      declineBtn: 'नहीं धन्यवाद, बिना सेव किए जारी रखें',
      withdrawBtn: 'सहमति वापस लें और सेव डेटा हटाएं',
      grantAgainBtn: 'रिपोर्टिंग प्रोफ़ाइल चालू करने के लिए सहमति देखें',
      settingsHeading: 'रिपोर्टिंग प्रोफ़ाइल और गोपनीयता सहमति',
      statusAllowed: 'सहमति दी गई — रिपोर्टिंग प्रोफ़ाइल चालू है',
      statusDeclined: 'सहमति अस्वीकृत — कोई डेटा सेव नहीं किया जाता',
      statusUndecided: 'अभी निर्णय नहीं — कोई डेटा सेव नहीं किया जाता',
    },
    profile: {
      navBtnLabel: 'रिपोर्टिंग प्रोफ़ाइल',
      title: 'रिपोर्टिंग प्रोफ़ाइल',
      subtitle: 'वैकल्पिक विवरण जो आपकी 1930 स्क्रिप्ट, बैंक ईमेल और सबूत चेकलिस्ट को भरते हैं।',
      honestyNotice: 'स्पष्ट सूचना: Scam SOS 1930, cybercrime.gov.in या आपके बैंक को रिपोर्ट सबमिट नहीं करता है। यह केवल आपका विवरण तैयार करता है ताकि आप कॉल पर पढ़ सकें और शिकायत में पेस्ट कर सकें।',
      secretWarning: 'यहाँ कभी भी अपना OTP, PIN, CVV या पासवर्ड दर्ज न करें।',
      storageAccountBadge: 'आपके Google खाते से निजी रूप से सिंक',
      storageDeviceBadge: 'केवल इस डिवाइस पर सेव (Saved on this device only)',
      storageNoneBadge: 'सेव नहीं किया गया (सहमति नहीं दी गई)',
      saveBtn: 'सेव करें और SOS में लागू करें',
      savingBtn: 'सेव हो रहा है...',
      savedNote: 'रिपोर्टिंग प्रोफ़ाइल सेव हो गई और आपकी SOS किट में लागू हो गई।',
      deleteBtn: 'मेरा डेटा हटाएं',
      deletedNote: 'आपकी सभी रिपोर्टिंग प्रोफ़ाइल जानकारी तुरंत हटा दी गई है।',
      exportPdfBtn: 'PDF के रूप में निर्यात करें',
      openProfileCta: 'रिपोर्टिंग प्रोफ़ाइल',
      syncErrorNote: 'क्लाउड स्टोरेज से सिंक नहीं हो सका। कृपया कनेक्शन जांचें या दोबारा साइन इन करें।',
      fields: {
        fullName: 'पूरा नाम',
        phone: 'फोन नंबर',
        email: 'ईमेल पता',
        cityState: 'शहर / राज्य',
        bankName: 'बैंक का नाम',
        accountLast4: 'खाते या कार्ड के केवल अंतिम 4 अंक',
        scamDateTime: 'धोखाधड़ी की तारीख और समय',
        amountLost: 'नुकसान राशि (INR ₹)',
        transactionId: 'ट्रांजेक्शन ID / 12-अंक UTR',
        scammerContact: 'ठग का फोन / UPI ID / वेबसाइट',
        shortDescription: 'घटना का संक्षिप्त विवरण',
      },
      placeholders: {
        fullName: 'जैसे राजेश कुमार',
        phone: 'जैसे +91 98XXXXXXXX',
        email: 'जैसे name@example.com',
        cityState: 'जैसे जयपुर, राजस्थान',
        bankName: 'जैसे State Bank of India / HDFC',
        accountLast4: 'केवल 4 अंक (जैसे 4821)',
        scamDateTime: 'जैसे 18 Nov 2026, 2:15 PM',
        amountLost: 'जैसे 15000',
        transactionId: 'जैसे 432198765432',
        scammerContact: 'जैसे fakehelp@upi या +91-9XXXXXXXXX',
        shortDescription: 'बिना OTP, PIN, CVV या पासवर्ड डाले संक्षेप में बताएं कि क्या हुआ।',
      },
      errors: {
        too_long: 'यह मान अधिकतम अक्षर सीमा से अधिक है।',
        invalid_phone: 'कृपया 7 से 15 अंकों का वैध फोन नंबर दर्ज करें।',
        invalid_email: 'कृपया वैध ईमेल पता दर्ज करें।',
        invalid_last4: 'कृपया केवल 4 अंक दर्ज करें।',
        invalid_amount: 'कृपया INR में सही धनात्मक राशि दर्ज करें।',
        forbidden_secret: 'अवरुद्ध: यहाँ कभी OTP, PIN, CVV, पासवर्ड, आधार, पैन या पूरा कार्ड नंबर न लिखें।',
      },
    },
    aiImprove: {
      buttonLabel: 'शिकायत सुधारने के लिए AI का उपयोग करें',
      modalTitle: 'AI को भेजने से पहले पूर्वावलोकन',
      modalNotice: 'जब तक आप नीचे पुष्टि नहीं करते, आपकी प्रोफ़ाइल का कोई भी डेटा नहीं भेजा जाता। भेजने से पहले सटीक विवरण और ड्राफ्ट देखें:',
      previewFieldsHeading: 'भेजे जाने वाले प्रोफ़ाइल विवरण',
      noProfileFieldsNote: 'कोई व्यक्तिगत प्रोफ़ाइल विवरण सेव नहीं — केवल आपका वर्तमान ईमेल ड्राफ्ट भेजा जाएगा।',
      previewDraftHeading: 'भेजा जाने वाला ईमेल ड्राफ्ट',
      confirmSendBtn: 'भेजें और ईमेल सुधारें',
      cancelBtn: 'रद्द करें',
      loadingText: 'आपका बैंक शिकायत ईमेल सुधारा जा रहा है...',
      successNote: 'बैंक शिकायत ड्राफ्ट अपडेट हो गया।',
      errorNoKey: 'इस सर्वर पर AI सहायता कॉन्फ़िगर नहीं है। आप सीधे ईमेल संपादित कर सकते हैं।',
      errorApi: 'AI सेवा अभी अनुरोध पूरा नहीं कर सकी। आपका ड्राफ्ट सुरक्षित है।',
      errorSecret: 'AI को भेजने से पहले कृपया कोई भी OTP, PIN, CVV, पासवर्ड या PAN हटा दें।',
    },
  },
  te: {
    brand: 'Scam SOS',
    tagline: 'మోసపోయారా? మొదటి 60 నిమిషాల్లో చర్య తీసుకోండి.',
    disclaimer:
      'Scam SOS ఫిర్యాదు ప్రక్రియను వేగవంతం చేస్తుంది. ఇది డబ్బును తిరిగి పొందలేదు లేదా మీ బ్యాంకుకు, పోలీసులకు ప్రత్యామ్నాయం కాదు.',
    offlineBanner:
      'పరిమిత లేదా ఆఫ్‌లైన్ కనెక్షన్ — SOS గైడ్, 1930 స్క్రిప్ట్ మరియు క్యాష్ చేసిన పేజీలు అందుబాటులో ఉన్నాయి.',
    offlineCheckNote:
      'ఆఫ్‌లైన్ మోడ్: నెట్‌వర్క్ లేకపోవడంతో మీ పరికరంలోనే నియమాల ఆధారిత డిటెక్టర్‌తో ఈ సందేశం తనిఖీ చేయబడింది.',
    pwa: {
      installLabel: 'ఆఫ్‌లైన్ కోసం యాప్ సేవ్ చేయండి',
      iosTitle: 'హోమ్ స్క్రీన్‌కు Scam SOS జోడించండి',
      iosSteps:
        'Safariలో Share బటన్ నొక్కి, క్రిందికి స్క్రోల్ చేసి "Add to Home Screen" ఎంచుకోండి.',
      closeLabel: 'మూసివేయి',
    },
    settings: {
      buttonLabel: 'సెట్టింగ్‌లు',
      title: 'డిస్ప్లే & సెట్టింగ్‌లు',
      ultraDarkTitle: 'అల్ట్రా-డార్క్ హై-కాంట్రాస్ట్ మోడ్',
      ultraDarkDesc:
        'బయట ఎండలో ఫిర్యాదు చేసేటప్పుడు స్పష్టమైన దృశ్యమానత కోసం స్వచ్ఛమైన నలుపు (#000000) బ్యాక్‌గ్రౌండ్ మరియు స్పష్టమైన బార్డర్లు.',
      ultraDarkOn: 'ఆన్',
      ultraDarkOff: 'సాధారణం',
      languageLabel: 'భాష',
    },
    nav: {
      home: 'హోమ్',
      check: 'సందేశం తనిఖీ',
      sos: 'SOS గైడ్',
      resources: 'అధికారిక లింకులు',
      about: 'గురించి',
    },
    home: {
      heroEyebrow: 'మొదటి గంట సైబర్ మోసం సహాయం · భారతదేశం',
      heroTitle: 'మోసపోయారా? మొదటి 60 నిమిషాల్లో చర్య తీసుకోండి.',
      heroSubtitle:
        'వెంటనే ప్రాధాన్యతా క్రమంలో యాక్షన్ ప్లాన్, 1930 కాల్ స్క్రిప్ట్ మరియు బ్యాంక్ ఫిర్యాదు ఈమెయిల్ రూపొందించండి — లేదా అనుమానాస్పద SMS/WhatsApp సందేశాన్ని తనిఖీ చేయండి.',
      primaryCta: 'నేను మోసపోయాను',
      secondaryCta: 'సందేశాన్ని తనిఖీ చేయి',
      callBannerTitle: 'నేషనల్ సైబర్ క్రైమ్ హెల్ప్‌లైన్: 1930',
      callBannerSub:
        'మీ ఖాతా నుండి ఇప్పుడే డబ్బు పోయినట్లయితే, వెంటనే 1930కు కాల్ చేయండి. వేగవంతమైన ఫిర్యాదు మీ బ్యాంకుకు చర్య తీసుకునే ఉత్తమ అవకాశాన్ని ఇస్తుంది, కానీ ఫలితాలకు హామీ లేదు.',
      callNowLabel: '1930కు కాల్ చేయండి',
      howTitle: 'మొదటి 60 నిమిషాల్లో ఎలా స్పందించాలి',
      howSubtitle: 'ఆందోళన లేకుండా తక్షణ చర్యలు తీసుకోవడానికి స్పష్టమైన విధానం.',
      steps: [
        {
          num: '01',
          title: 'ఏం జరిగిందో నమోదు చేయండి',
          desc: 'మోసం ఎలా జరిగిందో ఎంచుకుని, పోయిన మొత్తం (₹) మరియు సమయాన్ని నమోదు చేయండి.',
        },
        {
          num: '02',
          title: 'ప్రాధాన్యతా క్రమాన్ని పాటించండి',
          desc: 'మీ వివరాలతో సిద్ధమైన 1930 కాల్ స్క్రిప్ట్, కార్డ్/UPI బ్లాక్ దశలు మరియు ఎడిట్ చేయగల ఈమెయిల్ పొందండి.',
        },
        {
          num: '03',
          title: 'ఆధారాలను భద్రపరచండి',
          desc: 'UTR నంబర్లు మరియు స్క్రీన్‌షాట్ చెక్‌లిస్ట్ పూర్తి చేసి, అంతా PDF గా సేవ్ లేదా ప్రింట్ చేయండి.',
        },
      ],
      scamTypesTitle: 'మేము కవర్ చేసే సాధారణ భారతీయ మోసాలు',
      scamTypesSubtitle: 'మోసం తీరును త్వరగా గుర్తించండి లేదా వెంటనే SOS సహాయం పొందండి.',
      scamTypes: [
        {
          key: 'upi_collect_request',
          title: 'UPI కలెక్ట్ / QR వలలు',
          desc: 'డబ్బు లేదా రీఫండ్ రావడానికి UPI PIN ఎంటర్ చేయమని మోసగించే రిక్వెస్టులు.',
        },
        {
          key: 'fake_kyc',
          title: 'నకిలీ KYC & ఖాతా బ్లాక్ బెదిరింపు',
          desc: 'బ్యాంక్, పాన్, సిమ్ లేదా కరెంటు ఈరోజే బంద్ అవుతాయనే నకిలీ SMS లింకులు.',
        },
        {
          key: 'otp_theft',
          title: 'OTP / స్క్రీన్-షేర్ దొంగతనం',
          desc: 'కస్టమర్ కేర్ పేరుతో OTP, CVV లేదా AnyDesk వంటి రిమోట్ యాప్‌లు అడగడం.',
        },
        {
          key: 'job_scam',
          title: 'పార్ట్-టైమ్ & ప్రీపెయిడ్ టాస్క్ మోసం',
          desc: 'టెలిగ్రామ్/వాట్సాప్‌లో లైక్స్/రివ్యూలకు డబ్బు ఆశచూపి డిపాజిట్లు వసూలు చేయడం.',
        },
        {
          key: 'lottery_reward',
          title: 'లాటరీ & క్యాష్‌బ్యాక్ ఆశలు',
          desc: 'బహుమతి గెలిచారంటూ ప్రాసెసింగ్ ఫీజు లేదా UPI ఆమోదం అడగడం.',
        },
        {
          key: 'impersonation',
          title: 'పోలీసు / CBI / కొరియర్ బెదిరింపులు',
          desc: '"డిజిటల్ అరెస్ట్" వీడియో కాల్స్ లేదా నకిలీ పార్సెల్ సీజ్ పేరుతో డబ్బు డిమాండ్ చేయడం.',
        },
      ],
      footerHeading: 'అధికారిక భారతీయ సైబర్ సహాయ మార్గాలు',
      footerNote:
        'లాగిన్ అవసరం లేదు. సందేశ వివరాలు ఎక్కడా సేవ్ చేయబడవు. త్వరిత ఫిర్యాదు సహాయం మాత్రమే.',
    },
    check: {
      title: 'అనుమానాస్పద సందేశాన్ని తనిఖీ చేయండి',
      subtitle:
        'మోసపూరిత సంకేతాలు మరియు అనుమానాస్పద పదాలను గుర్తించడానికి SMS, WhatsApp లేదా ఈమెయిల్‌ను పేస్ట్ చేయండి.',
      inputLabel: 'తనిఖీ చేయాల్సిన సందేశం',
      placeholder:
        'ఇక్కడ SMS, WhatsApp సందేశం లేదా ఈమెయిల్ పేస్ట్ చేయండి (ఉదా. "URGENT: Your KYC is suspended...")',
      charLimitHint: 'గరిష్టం 4,000 అక్షరాలు · మీరు పేస్ట్ చేసిన సందేశం సేవ్ చేయబడదు',
      sampleHeading: 'ఉదాహరణను ప్రయత్నించండి',
      sampleBadge: 'Sample data',
      samples: [
        {
          id: 'kyc',
          label: 'నకిలీ బ్యాంక్ KYC SMS',
          text: 'URGENT: Dear customer, your SBI YONO KYC has expired today. Your account will be blocked in 2 hours. Update PAN immediately at https://bit.ly/sbi-kyc-update99 or call +91-9876500000.',
        },
        {
          id: 'upi',
          label: 'UPI పిన్ వల',
          text: 'అభినందనలు! మీకు ₹12,500 క్యాష్‌బ్యాక్ మంజూరైంది. డబ్బు పొందడానికి వెంటనే UPI యాప్ తెరిచి కలెక్ట్ రిక్వెస్ట్ ఆమోదించి మీ యూపీఐ పిన్ ఎంటర్ చేయండి.',
        },
        {
          id: 'arrest',
          label: 'డిజిటల్ అరెస్ట్ బెదిరింపు',
          text: 'FINAL NOTICE from Mumbai Cyber Cell & FedEx: A parcel linked to your Aadhaar was seized with illegal items. Join video verification immediately to avoid arrest warrant.',
        },
      ],
      analyzeBtn: 'సందేశం తనిఖీ చేయి',
      analyzingBtn: 'తనిఖీ చేస్తోంది...',
      clearBtn: 'క్లియర్ చేయి',
      rateLimitNote: 'ప్రాథమిక క్లయింట్-సైడ్ పరిమితి: నిమిషానికి గరిష్టంగా 10 తనిఖీలు.',
      emptyStateTitle: 'ఇంకా ఏ సందేశం తనిఖీ చేయబడలేదు',
      emptyStateDesc:
        'ప్రమాద సంకేతాలను చూడటానికి పైన సందేశాన్ని పేస్ట్ చేయండి లేదా Sample data ఉదాహరణల్లో ఒకదాన్ని ఎంచుకోండి.',
      errors: {
        empty: 'దయచేసి తనిఖీ చేసే ముందు సందేశాన్ని పేస్ట్ చేయండి.',
        too_short: 'సందేశం చాలా చిన్నదిగా ఉంది. పూర్తి SMS లేదా WhatsApp టెక్స్ట్ పేస్ట్ చేయండి.',
        too_long: 'సందేశం 4,000 అక్షరాల కంటే ఎక్కువ ఉంది. దయచేసి తగ్గించండి.',
        rate_limited: 'చాలా ఎక్కువ తనిఖీలు జరిగాయి, ఒక నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.',
        network: 'విశ్లేషణ సేవను చేరుకోలేకపోయాము. మీ ఇంటర్నెట్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
      },
      modeBadges: {
        ai: 'AI mode',
        fallback: 'Rule-based fallback mode',
        fallbackApiNote:
          'AI సేవ అందుబాటులో లేనందున మా నియమాల ఆధారిత డిటెక్టర్ ద్వారా ఈ ఫలితం రూపొందించబడింది.',
        fallbackNoKeyNote:
          'సర్వర్‌లో AI కీ సెట్ చేయబడనందున స్థానిక నియమాల ఆధారిత తనిఖీ ఉపయోగించబడింది.',
      },
      resultLabels: {
        scamType: 'గుర్తించిన నమూనా',
        riskLevel: 'ప్రమాద స్థాయి',
        highlightedText: 'అనుమానాస్పద పదాలతో సందేశం',
        noPhrases: 'ప్రత్యేక అనుమానాస్పద పదాలు వేరు చేయబడలేదు.',
        explanation: 'సరళమైన వివరణ',
        advice: 'తదుపరి సూచనలు',
        nextActionCta: 'డబ్బు పంపారా లేదా OTP ఇచ్చారా? SOS గైడ్ తెరవండి',
      },
      riskLabels: {
        Low: 'తక్కువ (సురక్షితమని హామీ లేదు)',
        Medium: 'మధ్యస్థ ప్రమాదం',
        High: 'అధిక ప్రమాదం',
        Critical: 'తీవ్రమైన ప్రమాదం',
        Unknown: 'తెలియని / అస్పష్టమైన',
      },
    },
    sos: {
      title: 'అత్యవసర SOS యాక్షన్ ప్లాన్',
      subtitle: 'మీ 60-నిమిషాల ప్రతిస్పందన కిట్ కోసం 3 వివరాలను నమోదు చేయండి.',
      step1Label: '01. ఏం జరిగింది',
      step2Label: '02. యాక్షన్ కిట్ & ఈమెయిల్',
      whatHappenedLabel: 'ఏం జరిగింది? (వర్తించేవన్నీ ఎంచుకోండి)',
      whatHappenedHint: 'సరైన బ్లాక్ చర్యలను ప్రాధాన్యత క్రమంలో ఉంచడానికి మీరు చేసిన ప్రతిదాన్ని ఎంచుకోండి.',
      amountLabel: 'పోయిన సుమారు మొత్తం (INR ₹)',
      amountPlaceholder: 'ఉదా. 25000 (డబ్బు కట్ కాకపోతే 0 ఎంటర్ చేయండి)',
      amountPresets: ['0', '5000', '15000', '50000'],
      timeSinceLabel: 'ఇది జరిగి ఎంత సమయం అయింది?',
      generateBtn: 'నా SOS ప్లాన్ రూపొందించు',
      editInputsBtn: 'వివరాలు మార్చండి',
      printPdfBtn: 'ప్రింట్ / PDF సేవ్ చేయండి',
      validationErrors: {
        incidentsRequired: 'ఏం జరిగిందో కనీసం ఒక ఎంపికను ఎంచుకోండి.',
        amountRequired: 'దయచేసి పోయిన మొత్తాన్ని నమోదు చేయండి (డబ్బు పోకపోతే 0 రాయండి).',
        amountInvalid: 'దయచేసి INR లో సరైన సంఖ్యను నమోదు చేయండి.',
      },
      step2Sections: {
        actionPlanTitle: 'ప్రాధాన్యతా క్రమంలో యాక్షన్ ప్లాన్',
        actionPlanSub: '#1 నుండి #4 వరకు క్రమంగా అనుసరించండి.',
        callScriptTitle: '1930 హెల్ప్‌లైన్ కాల్ కోసం 30-సెకన్ల స్క్రిప్ట్',
        callScriptSub: '1930 ఆపరేటర్ కాల్ ఎత్తిన వెంటనే దీనిని చదవండి.',
        copyScriptBtn: 'స్క్రిప్ట్ కాపీ చేయి',
        copiedLabel: 'కాపీ అయింది',
        emailTitle: 'ఆటో-జనరేటెడ్ బ్యాంక్ ఫిర్యాదు ఈమెయిల్',
        emailSub: 'మీ వివరాలతో సిద్ధమైంది. బ్రాకెట్లలోని వివరాలు మార్చి, కాపీ చేసి పంపండి.',
        emailSubjectLabel: 'విషయం (Subject)',
        emailBodyLabel: 'ఈమెయిల్ టెక్స్ట్ (మార్చవచ్చు)',
        copyEmailBtn: 'ఈమెయిల్ కాపీ చేయి',
        resetEmailBtn: 'రీసెట్ చేయి',
        evidenceTitle: 'ఆధారాల చెక్‌లిస్ట్',
        evidenceSub: 'cybercrime.gov.in లో ఫిర్యాదు చేయడానికి ముందు వీటిని సేకరించండి.',
        evidenceProgress: 'సిద్ధం',
      },
      emptySummaryState: 'మీ SOS ప్లాన్ మరియు బ్యాంక్ ఈమెయిల్ పొందడానికి దశ 1 పూర్తి చేయండి.',
    },
    resources: {
      title: 'అధికారిక భారతదేశ రిపోర్టింగ్ మార్గాలు',
      subtitle: 'అధికారిక ప్రభుత్వ మరియు బ్యాంక్ మార్గాలను మాత్రమే ఉపయోగించండి. నకిలీ "రికవరీ ఏజెంట్ల" పట్ల జాగ్రత్త.',
      cards: [
        {
          title: 'నేషనల్ సైబర్ క్రైమ్ హెల్ప్‌లైన్ — 1930',
          badge: '24×7 టోల్-ఫ్రీ వాయిస్ హెల్ప్‌లైన్',
          desc: 'మీ ఖాతా నుండి ఇప్పుడే డబ్బు పోయినట్లయితే, వెంటనే 1930కు కాల్ చేయండి. వేగవంతమైన ఫిర్యాదు మీ బ్యాంకుకు చర్య తీసుకునే ఉత్తమ అవకాశాన్ని ఇస్తుంది, కానీ ఫలితాలకు హామీ లేదు.',
          actionText: '1930కు కాల్ చేయండి',
          href: 'tel:1930',
        },
        {
          title: 'నేషనల్ సైబర్ క్రైమ్ పోర్టల్ — cybercrime.gov.in',
          badge: 'అధికారిక ప్రభుత్వ పోర్టల్',
          desc: 'ఆన్‌లైన్‌లో అధికారిక ఆర్థిక మోసం ఫిర్యాదును నమోదు చేసి, UTR ఆధారాలు మరియు స్క్రీన్‌షాట్‌లను అప్‌లోడ్ చేయండి.',
          actionText: 'cybercrime.gov.in తెరవండి',
          href: 'https://cybercrime.gov.in',
        },
        {
          title: 'వెంటనే మీ బ్యాంక్‌ను సంప్రదించండి',
          badge: 'కార్డ్, UPI & నెట్‌బ్యాంకింగ్ బ్లాక్',
          desc: 'మీ డెబిట్/క్రెడిట్ కార్డ్ వెనుక ఉన్న లేదా అధికారిక బ్యాంక్ యాప్‌లోని టోల్-ఫ్రీ నంబర్‌కు మాత్రమే కాల్ చేయండి. సెర్చ్ ప్రకటనల్లోని నంబర్లను నమ్మవద్దు.',
          actionText: 'బ్యాంక్ ఫిర్యాదు ఈమెయిల్ రూపొందించు',
        },
      ],
      bankChecklistTitle: 'మీ బ్యాంక్‌కు వెంటనే ఏం చెప్పాలి',
      bankChecklistItems: [
        'ప్రభావితమైన డెబిట్/క్రెడిట్ కార్డులు, UPI ID లేదా నెట్‌బ్యాంకింగ్ యాక్సెస్‌ను వెంటనే బ్లాక్ చేయమని అడగండి.',
        'ఇది అనధికార / మోసపూరిత లావాదేవీ అని స్పష్టంగా చెప్పి, వ్రాతపూర్వక ఫిర్యాదు టికెట్ నంబర్ తీసుకోండి.',
        '12-అంకెల UTR నంబర్ మరియు ఖచ్చితమైన సమయాన్ని అందించండి.',
      ],
    },
    about: {
      title: 'Scam SOS గురించి',
      subtitle: 'సైబర్ మోసం జరిగిన మొదటి గంటలో త్వరితగతిన స్పందించడానికి గోప్యత-మొదటి సహాయ గైడ్.',
      doesTitle: 'Scam SOS ఏమి చేస్తుంది',
      doesItems: [
        'మొదటి 60 నిమిషాలను స్పష్టమైన ప్రాధాన్యతా దశలుగా (1930, బ్యాంక్ సమాచారం & కార్డ్/UPI బ్లాక్, cybercrime.gov.in, ఆధారాలు) క్రమబద్ధీకరిస్తుంది.',
        'మీ వివరాలతో ఎడిట్ చేయగల బ్యాంక్ ఫిర్యాదు ఈమెయిల్ మరియు 30-సెకన్ల 1930 కాల్ స్క్రిప్ట్ అందిస్తుంది.',
        'AI (మరియు స్వయంచాలక నియమ-ఆధారిత బ్యాకప్) ద్వారా అనుమానాస్పద సందేశాలను తనిఖీ చేసి ప్రమాద పదాలను హైलाइट చేస్తుంది.',
        'లాగిన్ అవసరం లేకుండా ఇంగ్లీష్, హిందీ మరియు తెలుగులో పనిచేస్తుంది.',
      ],
      doesNotTitle: 'Scam SOS ఏమి చేయదు',
      doesNotItems: [
        'ఇది పోయిన డబ్బును తిరిగి రాబట్టలేదు, UPI లావాదేవీలను రద్దు చేయలేదు లేదా బ్యాంక్ ఖాతాలను ఫ్రీజ్ చేయలేదు.',
        'ఇది మీ బ్యాంక్ ఫ్రాడ్ డెస్క్, 1930 హెల్ప్‌లైన్ లేదా పోలీసు / cybercrime.gov.in కు ప్రత్యామ్నాయం కాదు.',
        'తక్కువ లేదా అస్పష్టమైన ప్రమాదం ఉన్న సందేశం సురక్షితమని ఎప్పుడూ హామీ ఇవ్వదు.',
        'నిమిషానికి 10 తనిఖీల పరిమితి ఒక ప్రాథమిక క్లయింట్-సైడ్ నియంత్రణ మాత్రమే, భద్రతా రక్షణ కాదు.',
      ],
      privacyTitle: 'సందేశ నిల్వ లేదు',
      privacyDesc:
        'సందేశ తనిఖీలో పేస్ట్ చేసిన టెక్స్ట్ తాత్కాలికంగా ప్రాసెస్ చేయబడుతుంది మరియు ఏ డేటాబేస్‌లోనూ నిల్వ చేయబడదు. SOS ఫారమ్ వివరాలు మీ ప్రస్తుత బ్రౌజర్ సెషన్‌లో మాత్రమే ఉంటాయి.',
    },
    auth: {
      signInGoogle: 'Google తో సైన్ ఇన్ చేయండి',
      signOut: 'సైన్ అవుట్',
      signingIn: 'సైన్ ఇన్ అవుతోంది...',
      guestBadge: 'గెస్ట్ మోడ్ (సైన్-ఇన్ అవసరం లేదు)',
      guestDesc: 'సైన్ ఇన్ చేయకుండానే మీరు అన్ని SOS టూల్స్ ఉపయోగించవచ్చు.',
      signedInAs: 'సైన్ ఇన్ ఖాతా',
      unverifiedEmail: 'ప్రైవేట్ సింక్ కోసం ధృవీకరించబడిన Google ఈమెయిల్ ఉపయోగించండి.',
      errors: {
        popup_closed: 'సైన్-ఇన్ రద్దు చేయబడింది. మీరు గెస్ట్ మోడ్‌లో కొనసాగవచ్చు.',
        popup_blocked: 'బ్రౌజర్ పాప్-అప్‌ను బ్లాక్ చేసింది. పాప్-అప్‌లను అనుమతించండి లేదా గెస్ట్ మోడ్‌లో కొనసాగండి.',
        session_expired: 'మీ సెషన్ గడువు ముగిసింది. ప్రొఫైల్ సింక్ చేయడానికి మళ్లీ సైన్ ఇన్ చేయండి.',
        unverified_email: 'ప్రైవేట్‌గా సేవ్ చేయడానికి మీ Google ఈమెయిల్ ధృవీకరించబడి ఉండాలి.',
        generic: 'సైన్-ఇన్ పూర్తి కాలేదు. మీరు గెస్ట్ మోడ్‌లో అన్ని టూల్స్ ఉపయోగించవచ్చు.',
      },
    },
    consent: {
      title: 'ఐచ్ఛిక రిపోర్టింగ్ ప్రొఫైల్ సమ్మతి',
      subtitle: 'Scam SOS మీ 1930 కాల్ మరియు బ్యాంక్ ఈమెయిల్ కోసం వివరాలను సిద్ధం చేస్తుంది. వివరాలు సేవ్ చేయడం ఐచ్ఛికం.',
      whatLabel: 'ఏమి సేవ్ చేయబడవచ్చు (అన్నీ ఐచ్ఛికం)',
      whatDesc: 'సంప్రదింపు వివరాలు (పేరు, ఫోన్, ఈమెయిల్, నగరం/రాష్ట్రం), బ్యాంక్ పేరు మరియు ఖాతా చివరి 4 అంకెలు, మోసం వివరాలు (సమయం, మొత్తం, UTR/ట్రాన్సాక్షన్ ID, మోసగాడి ఫోన్/UPI). OTP, PIN, CVV, పాస్‌వర్డ్, ఆధార్, పాన్ లేదా పూర్తి కార్డ్ నంబర్లు ఎప్పుడూ సేకరించబడవు.',
      whyLabel: 'ఎందుకు ఉపయోగించబడుతుంది',
      whyDesc: 'మీ 1930 కాల్ స్క్రిప్ట్, బ్యాంక్ ఫిర్యాదు ఈమెయిల్ మరియు ఆధారాల చెక్‌లిస్ట్‌ను ముందే నింపడానికి మాత్రమే.',
      whereLabel: 'ఎక్కడ నిల్వ చేయబడుతుంది',
      whereDescAccount: 'సైన్ ఇన్ అయినప్పుడు: మీ Google ఖాతా UID క్రింద మాత్రమే ప్రైవేట్‌గా నిల్వ చేయబడుతుంది, ఎప్పుడూ భాగస్వామ్యం చేయబడదు.',
      whereDescDevice: 'గెస్ట్ మోడ్: ఈ పరికరంలో మాత్రమే సేవ్ చేయబడుతుంది (బ్రౌజర్ నిల్వ), మీరు "Use AI to improve my complaint" నొక్కకపోతే ఏ సర్వర్‌కు పంపబడదు.',
      neverSharedNote: 'సమాచారం ఎప్పుడూ ఇతరులతో పంచుకోబడదు, అమ్మబడదు మరియు అధికారులకు ఆటోమేటిక్‌గా పంపబడదు. సెట్టింగ్‌లలో ఎప్పుడైనా సమ్మతిని ఉపసంహరించుకోవచ్చు.',
      allowBtn: 'అనుమతించు (Allow)',
      declineBtn: 'వద్దు, సేవ్ చేయకుండా కొనసాగండి',
      withdrawBtn: 'సమ్మతి ఉపసంహరించి సేవ్ చేసిన డేటాను తొలగించండి',
      grantAgainBtn: 'రిపోర్టింగ్ ప్రొఫైల్ కోసం సమ్మతిని సమీక్షించండి',
      settingsHeading: 'రిపోర్టింగ్ ప్రొఫైల్ & గోప్యతా సమ్మతి',
      statusAllowed: 'సమ్మతి ఇవ్వబడింది — రిపోర్టింగ్ ప్రొఫైల్ సక్రియం',
      statusDeclined: 'సమ్మతి నిరాకరించబడింది — ఏ డేటా సేవ్ చేయబడదు',
      statusUndecided: 'ఇంకా నిర్ణయించలేదు — ఏ డేటా సేవ్ చేయబడదు',
    },
    profile: {
      navBtnLabel: 'రిపోర్టింగ్ ప్రొఫైల్',
      title: 'రిపోర్టింగ్ ప్రొఫైల్',
      subtitle: 'మీ 1930 స్క్రిప్ట్, బ్యాంక్ ఈమెయిల్ మరియు ఆధారాల చెక్‌లిస్ట్‌ను నింపే ఐచ్ఛిక వివరాలు.',
      honestyNotice: 'నిజాయితీ ప్రకటన: Scam SOS 1930, cybercrime.gov.in లేదా మీ బ్యాంకుకు ఫిర్యాదులను సమర్పించదు. మీరు కాల్‌లో చదవడానికి మరియు ఫిర్యాదులలో పేస్ట్ చేయడానికి మాత్రమే వివరాలను సిద్ధం చేస్తుంది.',
      secretWarning: 'ఇక్కడ ఎప్పుడూ మీ OTP, PIN, CVV లేదా పాస్‌వర్డ్ నమోదు చేయవద్దు.',
      storageAccountBadge: 'మీ Google ఖాతాకు ప్రైవేట్‌గా సింక్ చేయబడింది',
      storageDeviceBadge: 'ఈ పరికరంలో మాత్రమే సేవ్ చేయబడింది (Saved on this device only)',
      storageNoneBadge: 'సేవ్ చేయబడలేదు (సమ్మతి ఇవ్వబడలేదు)',
      saveBtn: 'సేవ్ చేసి SOS కు వర్తింపజేయండి',
      savingBtn: 'సేవ్ అవుతోంది...',
      savedNote: 'రిపోర్టింగ్ ప్రొఫైల్ సేవ్ చేయబడింది మరియు మీ SOS కిట్‌కు వర్తింపజేయబడింది.',
      deleteBtn: 'నా డేటాను తొలగించు',
      deletedNote: 'సేవ్ చేసిన అన్ని రిపోర్టింగ్ ప్రొఫైల్ వివరాలు వెంటనే తొలగించబడ్డాయి.',
      exportPdfBtn: 'PDF గా ఎగుమతి చేయండి',
      openProfileCta: 'రిపోర్టింగ్ ప్రొఫైల్',
      syncErrorNote: 'ప్రస్తుతం క్లౌడ్ నిల్వతో సింక్ చేయలేకపోయాము. కనెక్షన్ తనిఖీ చేయండి లేదా మళ్లీ సైన్ ఇన్ చేయండి.',
      fields: {
        fullName: 'పూర్తి పేరు',
        phone: 'ఫోన్ నంబర్',
        email: 'ఈమెయిల్ చిరునామా',
        cityState: 'నగరం / రాష్ట్రం',
        bankName: 'బ్యాంక్ పేరు',
        accountLast4: 'ఖాతా లేదా కార్డ్ చివరి 4 అంకెలు మాత్రమే',
        scamDateTime: 'మోసం జరిగిన తేదీ & సమయం',
        amountLost: 'పోయిన మొత్తం (INR ₹)',
        transactionId: 'ట్రాన్సాక్షన్ ID / 12-అంకెల UTR',
        scammerContact: 'మోసగాడి ఫోన్ / UPI ID / వెబ్‌సైట్',
        shortDescription: 'సంఘటన సంక్షిప్త వివరణ',
      },
      placeholders: {
        fullName: 'ఉదా. రాజేష్ కుమార్',
        phone: 'ఉదా. +91 98XXXXXXXX',
        email: 'ఉదా. name@example.com',
        cityState: 'ఉదా. హైదరాబాద్, తెలంగాణ',
        bankName: 'ఉదా. State Bank of India / HDFC',
        accountLast4: 'చివరి 4 అంకెలు మాత్రమే (ఉదా. 4821)',
        scamDateTime: 'ఉదా. 18 Nov 2026, 2:15 PM',
        amountLost: 'ఉదా. 15000',
        transactionId: 'ఉదా. 432198765432',
        scammerContact: 'ఉదా. fakehelp@upi లేదా +91-9XXXXXXXXX',
        shortDescription: 'OTP, PIN, CVV లేదా పాస్‌వర్డ్ లేకుండా ఏం జరిగిందో సంక్షిప్తంగా రాయండి.',
      },
      errors: {
        too_long: 'నమోదు చేసిన అక్షరాలు పరిమితిని మించాయి.',
        invalid_phone: 'దయచేసి 7–15 అంకెల సరైన ఫోన్ నంబర్ ఇవ్వండి.',
        invalid_email: 'దయచేసి సరైన ఈమెయిల్ చిరునామా ఇవ్వండి.',
        invalid_last4: 'దయచేసి సరిగ్గా 4 అంకెలు మాత్రమే నమోదు చేయండి.',
        invalid_amount: 'దయచేసి INR లో సరైన మొత్తాన్ని నమోదు చేయండి.',
        forbidden_secret: 'నిరోధించబడింది: ఇక్కడ ఎప్పుడూ OTP, PIN, CVV, పాస్‌వర్డ్, ఆధార్, పాన్ లేదా పూర్తి కార్డ్ నంబర్లు రాయవద్దు.',
      },
    },
    aiImprove: {
      buttonLabel: 'ఫిర్యాదును మెరుగుపరచడానికి AI ఉపయోగించండి',
      modalTitle: 'AI కి పంపే ముందు ప్రివ్యూ',
      modalNotice: 'మీరు క్రింద నిర్ధారించే వరకు మీ ప్రొఫైల్ వివరాలు పంపబడవు. మెరుగుపరచడానికి పంపబడే ఖచ్చితమైన వివరాలు మరియు డ్రాఫ్ట్‌ను సమీక్షించండి:',
      previewFieldsHeading: 'పంపబడే ప్రొఫైల్ వివరాలు',
      noProfileFieldsNote: 'వ్యక్తిగత ప్రొఫైల్ వివరాలు సేవ్ కాలేదు — ప్రస్తుత డ్రాఫ్ట్ టెక్స్ట్ మాత్రమే పంపబడుతుంది.',
      previewDraftHeading: 'మెరుగుపరచడానికి పంపే డ్రాఫ్ట్',
      confirmSendBtn: 'పంపి ఈమెయిల్ మెరుగుపరచండి',
      cancelBtn: 'రద్దు చేయి',
      loadingText: 'మీ బ్యాంక్ ఫిర్యాదు ఈమెయిల్‌ను మెరుగుపరుస్తోంది...',
      successNote: 'బ్యాంక్ ఫిర్యాదు డ్రాఫ్ట్ అప్‌డేట్ చేయబడింది.',
      errorNoKey: 'ఈ సర్వర్‌లో AI సహాయకుడు కాన్ఫిగర్ చేయబడలేదు. మీరు నేరుగా ఈమెయిల్ ఎడిట్ చేయవచ్చు.',
      errorApi: 'AI సేవ ప్రస్తుతం అందుబాటులో లేదు. మీ డ్రాఫ్ట్ సురక్షితంగా ఉంది.',
      errorSecret: 'AI కి పంపే ముందు దయచేసి ఏదైనా OTP, PIN, CVV, పాస్‌వర్డ్ లేదా PAN తొలగించండి.',
    },
  },
};
