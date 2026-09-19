export type LanguageCode = 'en' | 'am' | 'om' | 'ti' | 'so';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' },
  { code: 'om', label: 'Afaan Oromoo', nativeLabel: 'Afaan Oromoo' },
  { code: 'ti', label: 'Tigrinya', nativeLabel: 'ትግርኛ' },
  { code: 'so', label: 'Somali', nativeLabel: 'Soomaali' },
];

export interface TranslationData {
  welcomeBack: string;
  verifyIdentity: string;
  choosePinLength: string;
  pinPlaceholder: string;
  useBiometrics: string;
  login: string;
  loggingIn: string;
  forgotPin: string;
  useVirtualKeypad: string;
  hideVirtualKeypad: string;
  notificationsTitle: string;
  servicesTitle: string;
  securityNotice: string;
  callCenter: string;
  exchangeRates: string;
  buy: string;
  sell: string;
  biometricPrompt: string;
  biometricTouchDesc: string;
  scanFingerprint: string;
  verifying: string;
  verified: string;
  cancel: string;
  pinError: string;
  quickDemoPin: string;
  footerRights: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationData> = {
  en: {
    welcomeBack: 'Welcome back',
    verifyIdentity: 'Verify Your Identity',
    choosePinLength: 'Please choose the correct PIN length',
    pinPlaceholder: 'PIN',
    useBiometrics: 'USE BIOMETRICS',
    login: 'Login',
    loggingIn: 'Authenticating...',
    forgotPin: 'Forgot PIN?',
    useVirtualKeypad: 'Secure Virtual Keypad',
    hideVirtualKeypad: 'Hide Keypad',
    notificationsTitle: 'Official CBE Alerts',
    servicesTitle: 'CBE Digital Ecosystem',
    securityNotice: 'Always verify you are accessing the official Commercial Bank of Ethiopia banking portal.',
    callCenter: '24/7 Customer Care: 951',
    exchangeRates: 'Daily Foreign Exchange Rates',
    buy: 'Buy (ETB)',
    sell: 'Sell (ETB)',
    biometricPrompt: 'CBE Biometric Authentication',
    biometricTouchDesc: 'Place your finger on the sensor or authenticate with Face ID to sign in securely.',
    scanFingerprint: 'Touch Sensor',
    verifying: 'Scanning Biometrics...',
    verified: 'Identity Confirmed!',
    cancel: 'Cancel',
    pinError: 'Please enter a valid PIN (4–6 digits)',
    quickDemoPin: 'Demo PIN: 1234',
    footerRights: '© Commercial Bank of Ethiopia',
  },
  am: {
    welcomeBack: 'እንኳን ደህና መጡ',
    verifyIdentity: 'ማንነትዎን ያረጋግጡ',
    choosePinLength: 'እባክዎ ትክክለኛውን የፒን ርዝመት ይምረጡ',
    pinPlaceholder: 'የይለፍ ቃል (PIN)',
    useBiometrics: 'ባዮሜትሪክስ ይጠቀሙ',
    login: 'ይግቡ',
    loggingIn: 'በማረጋገጥ ላይ...',
    forgotPin: 'ፒን ረሱ?',
    useVirtualKeypad: 'ደህንነቱ የተጠበቀ ኪቦርድ',
    hideVirtualKeypad: 'ኪቦርድ ደብቅ',
    notificationsTitle: 'የኢትዮጵያ ንግድ ባንክ ማሳወቂያዎች',
    servicesTitle: 'የሲቢኢ ዲጂታል አገልግሎቶች',
    securityNotice: 'ሁልጊዜ በትክክለኛው የባንኩ ድረ-ገጽ ላይ መሆንዎን ያረጋግጡ።',
    callCenter: 'የደንበኞች አገልግሎት ማዕከል፡ 951',
    exchangeRates: 'የዕለቱ የውጭ ምንዛሬ ተመኖች',
    buy: 'መግዣ (ብር)',
    sell: 'መሸጫ (ብር)',
    biometricPrompt: 'የባዮሜትሪክስ ማረጋገጫ',
    biometricTouchDesc: 'ወደ ሂሳብዎ ለመግባት የጣት አሻራዎን በሴንሰሩ ላይ ያድርጉ ወይም Face ID ይጠቀሙ።',
    scanFingerprint: 'አሻራዎን ያስቀምጡ',
    verifying: 'አሻራ በመፈተሽ ላይ...',
    verified: 'ማንነትዎ ተረጋግጧል!',
    cancel: 'ሰርዝ',
    pinError: 'እባክዎ ትክክለኛ ፒን (4-6 አሃዝ) ያስገቡ',
    quickDemoPin: 'የሙከራ ፒን: 1234',
    footerRights: '© የኢትዮጵያ ንግድ ባንክ',
  },
  om: {
    welcomeBack: 'Baga nagaan dhuftan',
    verifyIdentity: 'Eenyummaa keessan mirkaneessaa',
    choosePinLength: 'Mee dheerina PIN sirrii ta\'e filadhaa',
    pinPlaceholder: 'Koodii PIN',
    useBiometrics: 'BAAYOOMETRIIKSII FAYYADAMAA',
    login: 'Seenaa',
    loggingIn: 'Mirkaneessaa jira...',
    forgotPin: 'PIN irraanfattanii?',
    useVirtualKeypad: 'Kiyibordii Nageenyaa',
    hideVirtualKeypad: 'Kiyibordii Dhoksi',
    notificationsTitle: 'Beeksisoota Baankii Daldala Itoophiyaa',
    servicesTitle: 'Tajaajiloota Dijitaalaa CBE',
    securityNotice: 'Yeroo hunda marsariitii sirrii Baankii Daldala Itoophiyaa irra jiraachuu keessan mirkaneeffadhaa.',
    callCenter: 'Tajaajila Maamiltootaa: 951',
    exchangeRates: 'Gatii Sharafa Alaa Har\'aa',
    buy: 'Bitaa (ETB)',
    sell: 'Gurgurtaa (ETB)',
    biometricPrompt: 'Mirkaneessa Baayoomeetiriiksii',
    biometricTouchDesc: 'Gara herrega keessanitti seenuuf ashaaraa qubaa keessan ka\'aa.',
    scanFingerprint: 'Ashaaraa Ka\'aa',
    verifying: 'Qoraa jira...',
    verified: 'Mirkanaa\'eera!',
    cancel: 'Haqi',
    pinError: 'Maaloo koodii PIN sirrii (dijiitii 4-6) galchaa',
    quickDemoPin: 'PIN Yaalii: 1234',
    footerRights: '© Baankii Daldala Itoophiyaa',
  },
  ti: {
    welcomeBack: 'እንቋዕ ብደሓን መጻእኹም',
    verifyIdentity: 'መንነትኩም ኣረጋግጹ',
    choosePinLength: 'በይዘኦም ትኽክለኛ ንውሓት ፒን ይምረጹ',
    pinPlaceholder: 'ናይ ፒን ኮድ',
    useBiometrics: 'ባዮሜትሪክስ ተጠቐሙ',
    login: 'እተው',
    loggingIn: 'የረጋግጽ ኣሎ...',
    forgotPin: 'ፒን ረሲዕኩም?',
    useVirtualKeypad: 'ውሑስ ኪቦርድ',
    hideVirtualKeypad: 'ኪቦርድ ሕባእ',
    notificationsTitle: 'ሓበሬታታት ንግዲ ባንኪ ኢትዮጵያ',
    servicesTitle: 'ናይ CBE ዲጂታል ኣገልግሎታት',
    securityNotice: 'ኩሉ ጊዜ ኣብ ትክክለኛ መርበብ ሓበሬታ ንግዲ ባንኪ ኢትዮጵያ ምዃንኩም ኣረጋግጹ።',
    callCenter: 'ማእከል ኣገልግሎት ዓማዊል: 951',
    exchangeRates: 'ናይ ሎሚ ናይ ወጻኢ ሸርፊ ተመናት',
    buy: 'መግዚኢ (ብር)',
    sell: 'መሸጢ (ብር)',
    biometricPrompt: 'ባዮሜትሪክስ ምርግጋጽ',
    biometricTouchDesc: 'ናብ ሕሳብኩም ንምእታው ኣጻብዕኩም ኣብቲ ሴንሰር ኣንብሩ።',
    scanFingerprint: 'ኣጻብዕቲ ኣንብር',
    verifying: 'ይፍትን ኣሎ...',
    verified: 'ተረጋጊጹ!',
    cancel: 'ሰርዝ',
    pinError: 'በጃኹም ትክክለኛ ፒን (4-6 ኣሃዝ) የእትዉ',
    quickDemoPin: 'ናይ ፈተነ ፒን: 1234',
    footerRights: '© ንግዲ ባንኪ ኢትዮጵያ',
  },
  so: {
    welcomeBack: 'Ku soo dhawoow',
    verifyIdentity: 'Xaqiiji Aqoonsigaaga',
    choosePinLength: 'Fadlan dooro dhererka saxda ah ee PIN-ka',
    pinPlaceholder: 'Geli PIN',
    useBiometrics: 'ADEEGSO BIOMETRICS',
    login: 'Gal',
    loggingIn: 'Hubinta...',
    forgotPin: 'Ma ilowday PIN-ka?',
    useVirtualKeypad: 'Kiiboodhka Amniga',
    hideVirtualKeypad: 'Qari Kiiboodhka',
    notificationsTitle: 'Ogeysiisyada Bangiga CBE',
    servicesTitle: 'Adeegyada Dijitaalka ee CBE',
    securityNotice: 'Had iyo jeer hubi inaad ku jirto bogga rasmiga ah ee CBE.',
    callCenter: 'Adeegga Macmiilka: 951',
    exchangeRates: 'Qiimaha Sarifka Lacagaha Qalaad',
    buy: 'Iibso (ETB)',
    sell: 'Iibi (ETB)',
    biometricPrompt: 'Xaqiijinta Biometrics',
    biometricTouchDesc: 'Farahaaga saar dareenka si aad si ammaan ah ugu gasho akoonkaaga.',
    scanFingerprint: 'Taabo Dareemaha',
    verifying: 'Baadhaya faraha...',
    verified: 'Aqoonsiga waa la xaqiijiyay!',
    cancel: 'Jooji',
    pinError: 'Fadlan geli PIN sax ah (4-6 lambar)',
    quickDemoPin: 'PIN-ka Tusaalaha: 1234',
    footerRights: '© Bangiga Ganacsiga Itoobiya',
  },
};

export interface ExchangeRate {
  currency: string;
  name: string;
  flag: string;
  buy: number;
  sell: number;
  change: string;
}

export const LIVE_EXCHANGE_RATES: ExchangeRate[] = [
  { currency: 'USD', name: 'US Dollar', flag: '🇺🇸', buy: 133.45, sell: 136.12, change: '+0.25%' },
  { currency: 'EUR', name: 'Euro', flag: '🇪🇺', buy: 144.80, sell: 147.70, change: '+0.15%' },
  { currency: 'GBP', name: 'British Pound', flag: '🇬🇧', buy: 172.90, sell: 176.35, change: '+0.40%' },
  { currency: 'AED', name: 'UAE Dirham', flag: '🇦🇪', buy: 36.33, sell: 37.06, change: '0.00%' },
  { currency: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', buy: 35.58, sell: 36.29, change: '+0.05%' },
  { currency: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', buy: 18.52, sell: 18.89, change: '+0.10%' },
];

export interface NotificationItem {
  id: string;
  title: string;
  date: string;
  snippet: string;
  isUrgent?: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'CBE Birr 2.0 Feature Enhancement',
    date: 'Today, 09:30 AM',
    snippet: 'Instant utility payments and national QR code payments are now fully available across all merchants.',
  },
  {
    id: 'notif-2',
    title: 'Security Notice: Beware of Fake SMS & Calls',
    date: 'Yesterday',
    snippet: 'CBE staff will NEVER call or send SMS asking for your 4-digit PIN, OTP, or password.',
    isUrgent: true,
  },
  {
    id: 'notif-3',
    title: 'Foreign Remittance Special Incentive',
    date: 'Sep 08, 2026',
    snippet: 'Enjoy preferential exchange rates and zero fee transfers on incoming diaspora remittances via CBE Noor & CBE Birr.',
  },
];

export interface DigitalService {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const DIGITAL_SERVICES: DigitalService[] = [
  {
    id: 'cbe-birr',
    title: 'CBE Birr',
    category: 'Mobile Money',
    description: 'Send money, buy airtime, pay bills, and merchant shopping directly from your mobile phone.',
    iconName: 'Smartphone',
    badge: 'Popular',
  },
  {
    id: 'internet-banking',
    title: 'Internet Banking',
    category: 'Digital Portal',
    description: 'Corporate and personal banking with bulk transfers, tax settlements, and salary payments.',
    iconName: 'Globe',
    badge: 'Enterprise',
  },
  {
    id: 'cbe-noor',
    title: 'CBE Noor',
    category: 'Interest Free',
    description: 'Sharia-compliant interest-free banking products, Mudarabah savings, and Amanah current accounts.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'diaspora',
    title: 'Diaspora Banking',
    category: 'International',
    description: 'Foreign currency accounts (USD, GBP, EUR) for Ethiopians residing abroad and foreign nationals of Ethiopian origin.',
    iconName: 'Send',
  },
  {
    id: 'branch-atm',
    title: 'Branches & ATMs',
    category: 'Locator',
    description: 'Locate 1,900+ CBE branches and 4,000+ ATM machines across all regional states and Addis Ababa.',
    iconName: 'MapPin',
  },
  {
    id: 'fx-calculator',
    title: 'Forex Exchange',
    category: 'Treasury',
    description: 'Daily indicative exchange rates, treasury bill tenders, and international trade finance services.',
    iconName: 'Coins',
  },
];
