export type Language = 'en' | 'am' | 'om' | 'ti' | 'so';

export interface Translation {
  langName: string;
  langNative: string;
  welcome: string;
  allInOne: string;
  login: string;
  mobileNumber: string;
  mobilePlaceholder: string;
  next: string;
  dontHaveAccount: string;
  createNewAccount: string;
  teleHub: string;
  help: string;
  termsAndConditions: string;
  copyright: string;
  version: string;
  quickFill: string;
  validating: string;
  phoneError: string;
  otpTitle: string;
  otpSubtitle: string;
  verifyAndContinue: string;
  resendCode: string;
  resendIn: string;
  changeNumber: string;
  loginWithPassword: string;
  enterPin: string;
  or: string;
  portalMode: string;
  desktopView: string;
  mobileView: string;
  customerCare: string;
  ethioTelecomCare: string;
  telebirrCare: string;
  ussdServices: string;
  faq: string;
  dashboardGreeting: string;
  availableBalance: string;
  sendMoney: string;
  buyAirtime: string;
  payBills: string;
  scanQr: string;
  recentTransactions: string;
  logout: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    langName: 'English',
    langNative: 'English',
    welcome: 'Welcome to',
    allInOne: 'All-in-One',
    login: 'Login',
    mobileNumber: 'Mobile Number',
    mobilePlaceholder: '',
    next: 'Next',
    dontHaveAccount: "Don't have an account?",
    createNewAccount: 'Create New Account',
    teleHub: 'teleHub',
    help: 'Help',
    termsAndConditions: 'Terms and Conditions',
    copyright: '@2026 Ethio telecom. All rights reserved',
    version: '1.3.2 version',
    quickFill: 'Prefill screenshot sample (+251 911026439)',
    validating: 'Verifying number...',
    phoneError: 'Please enter a valid 9-digit Ethiopian mobile number (e.g. 911026439 or 712345678)',
    otpTitle: 'Verify Mobile Number',
    otpSubtitle: 'Enter the 6-digit OTP verification code sent to',
    verifyAndContinue: 'Verify & Continue',
    resendCode: 'Resend Code',
    resendIn: 'Resend in',
    changeNumber: 'Change Number',
    loginWithPassword: 'Login with PIN / Password instead',
    enterPin: 'Enter telebirr PIN',
    or: 'or',
    portalMode: 'View Mode',
    desktopView: 'Web Portal',
    mobileView: 'Mobile View',
    customerCare: '24/7 Helpline',
    ethioTelecomCare: 'Ethio Telecom Support',
    telebirrCare: 'telebirr Helpline',
    ussdServices: 'USSD Quick Access',
    faq: 'Frequently Asked Questions',
    dashboardGreeting: 'Welcome back',
    availableBalance: 'Available Balance',
    sendMoney: 'Send Money',
    buyAirtime: 'Buy Airtime & Packages',
    payBills: 'Pay Utility Bills',
    scanQr: 'Scan & Pay Merchant',
    recentTransactions: 'Recent Transactions',
    logout: 'Sign Out',
  },
  am: {
    langName: 'Amharic',
    langNative: 'አማርኛ',
    welcome: 'እንኳን ደህና መጡ ወደ',
    allInOne: 'ሁሉን-አቀፍ',
    login: 'ይግቡ (Login)',
    mobileNumber: 'የሞባይል ቁጥር',
    mobilePlaceholder: '',
    next: 'ቀጣይ',
    dontHaveAccount: 'አካውንት የለዎትም?',
    createNewAccount: 'አዲስ አካውንት ይክፈቱ',
    teleHub: 'ቴሌሃብ (teleHub)',
    help: 'እርዳታ (Help)',
    termsAndConditions: 'ውሎች እና ሁኔታዎች',
    copyright: '@2026 ኢትዮ ቴሌኮም:: መብቱ በህግ የተጠበቀ ነው',
    version: 'የስሪት ቁጥር 1.3.2',
    quickFill: 'የምስሉን ቁጥር ሙላ (+251 911026439)',
    validating: 'ቁጥሩ እየተረጋገጠ ነው...',
    phoneError: 'እባክዎን ትክክለኛ ባለ 9 አሃዝ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (ለምሳሌ 911026439)',
    otpTitle: 'ስልክ ቁጥርዎን ያረጋግጡ',
    otpSubtitle: 'ወደ ስልክዎ የተላከውን ባለ 6 አሃዝ ሚስጥር ቁጥር (OTP) ያስገቡ:',
    verifyAndContinue: 'አረጋግጥና ቀጥል',
    resendCode: 'ኮዱን ደግመህ ላክ',
    resendIn: 'በድጋሚ ለመላክ',
    changeNumber: 'ቁጥር ቀይር',
    loginWithPassword: 'በቴሌብር ሚስጥር ቁጥር (PIN) ይግቡ',
    enterPin: 'የቴሌብር ሚስጥር ቁጥር (PIN) ያስገቡ',
    or: 'ወይም',
    portalMode: 'የእይታ ዓይነት',
    desktopView: 'የድር ፖርታል (Web)',
    mobileView: 'የስልክ እይታ (Mobile)',
    customerCare: 'የደንበኞች አገልግሎት 24/7',
    ethioTelecomCare: 'የኢትዮ ቴሌኮም ድጋፍ ማዕከል',
    telebirrCare: 'የቴሌብር አገልግሎት መስመር',
    ussdServices: 'የአጭር ኮድ (USSD) አገልግሎት',
    faq: 'ተደጋጋሚ ጥያቄዎች',
    dashboardGreeting: 'እንኳን በደህና መጡ',
    availableBalance: 'ያለዎት ሂሳብ',
    sendMoney: 'ገንዘብ ላክ',
    buyAirtime: 'አየር ሰዓት እና ጥቅል ግዛ',
    payBills: 'የአገልግሎት ክፍያ (መብራት/ውሃ)',
    scanQr: 'QR ስካን አድርገህ ክፈል',
    recentTransactions: 'የቅርብ ጊዜ ዝውውሮች',
    logout: 'ውጣ',
  },
  om: {
    langName: 'Afaan Oromoo',
    langNative: 'Afaan Oromoo',
    welcome: 'Baga nagaan dhuftan',
    allInOne: 'Hunda-galeessa',
    login: 'Seensaa (Login)',
    mobileNumber: 'Lakkoofsa Bilbilaa',
    mobilePlaceholder: '',
    next: 'Itti Fufi',
    dontHaveAccount: 'Akkaawuntii hin qabdanii?',
    createNewAccount: 'Akkaawuntii Haaraa Bani',
    teleHub: 'teleHub',
    help: 'Gargaarsa',
    termsAndConditions: 'Waliigaltee fi Haalawwan',
    copyright: '@2026 Itiyoo telekoom. Mirgi hunduu eegamaadha',
    version: 'Gosa 1.3.2',
    quickFill: 'Lakkoofsa fakkeenyaa guuti (+251 911026439)',
    validating: 'Lakkoofsi mirkanaa\'aa jira...',
    phoneError: 'Mee lakkoofsa bilbilaa Itoophiyaa dijitii 9 sirrii galchaa (fakkeenyaaf 911026439)',
    otpTitle: 'Lakkoofsa Bilbilaa Mirkaneessi',
    otpSubtitle: 'Koodii mirkaneessaa dijitii 6 gara bilbila keessanitti ergame galchaa:',
    verifyAndContinue: 'Mirkaneessi & Itti Fufi',
    resendCode: 'Koodii Irra Deebi\'ii Ergi',
    resendIn: 'Irra deebiin',
    changeNumber: 'Lakkoofsa Jijjiiri',
    loginWithPassword: 'Koodii Icitiitiin (PIN) Seenaa',
    enterPin: 'Koodii Icitii telebirr (PIN) Galchaa',
    or: 'yookiin',
    portalMode: 'Haala Ilaalchaa',
    desktopView: 'Web Portal',
    mobileView: 'Ilaalcha Bilbilaa',
    customerCare: 'Tajaajila Maamiltootaa 24/7',
    ethioTelecomCare: 'Gargaarsa Itiyoo telekoom',
    telebirrCare: 'Sarara Gargaarsa telebirr',
    ussdServices: 'Tajaajila USSD',
    faq: 'Gaaffiilee Yeroo Baay\'ee Gaafataman',
    dashboardGreeting: 'Baga nagaan deebitan',
    availableBalance: 'Haftee Herregaa',
    sendMoney: 'Maallaqa Ergaa',
    buyAirtime: 'Yeroo Qilleensaa fi Paakeejii Bitaa',
    payBills: 'Kaffaltii Tajaajilaa',
    scanQr: 'QR Scan Godhaa Kaffalaa',
    recentTransactions: 'Sochii dhihoo',
    logout: 'Bahi',
  },
  ti: {
    langName: 'Tigrinya',
    langNative: 'ትግርኛ',
    welcome: 'እንቋዕ ብደሓን መጻእኩም',
    allInOne: 'ኩለመዳያዊ',
    login: 'እቶ (Login)',
    mobileNumber: 'ቁጽሪ ተንቀሳቓሲ ስልኪ',
    mobilePlaceholder: '',
    next: 'ቀጽል',
    dontHaveAccount: 'ሕሳብ የብልኩምን?',
    createNewAccount: 'ሓድሽ ሕሳብ ክፈት',
    teleHub: 'ቴሌሃብ (teleHub)',
    help: 'ሓገዝ',
    termsAndConditions: 'ውዕላትን ኩነታትን',
    copyright: '@2026 ኢትዮ ቴሌኮም። ኩሉ መሰል ብሕጊ ዝተሓለወ እዩ',
    version: 'ስሪት 1.3.2',
    quickFill: 'ናይ ስእሊ ቁጽሪ ምላእ (+251 911026439)',
    validating: 'ቁጽሪ ይረጋገጽ ኣሎ...',
    phoneError: 'በጃኹም ቅኑዕ 9 ኣሃዝ ዘለዎ ቁጽሪ ስልኪ ኢትዮጵያ የእትዉ (ንኣብነት 911026439)',
    otpTitle: 'ቁጽሪ ስልክኹም ኣረጋግጹ',
    otpSubtitle: 'ናብ ስልክኹም ዝተላእከ 6 ኣሃዝ ዘለዎ ኮድ (OTP) የእትዉ:',
    verifyAndContinue: 'ኣረጋግጽን ቀጽልን',
    resendCode: 'ኮድ ደጊምካ ስደድ',
    resendIn: 'ደጊምካ ንምስዳድ',
    changeNumber: 'ቁጽሪ ቀይር',
    loginWithPassword: 'ብምስጢር ቁጽሪ (PIN) እቶ',
    enterPin: 'ናይ ቴሌብር ሚስጢር ቁጽሪ (PIN) የእትዉ',
    or: 'ወይ',
    portalMode: 'ዓይነት ርእይቶ',
    desktopView: 'ናይ ዌብ ፖርታል',
    mobileView: 'ናይ ሞባይል ርእይቶ',
    customerCare: 'ክንክን ዓማዊል 24/7',
    ethioTelecomCare: 'ደገፍ ኢትዮ ቴሌኮም',
    telebirrCare: 'መስመር ሓገዝ ቴሌብር',
    ussdServices: 'ናይ USSD ኣገልግሎት',
    faq: 'ተደጋጋሚ ሕቶታት',
    dashboardGreeting: 'እንቋዕ ብደሓን መጻእኩም',
    availableBalance: 'ዘሎ ሚዛን ሕሳብ',
    sendMoney: 'ገንዘብ ስደድ',
    buyAirtime: 'ናይ ኣየር ሰዓትን ፓኬጅን ዓድግ',
    payBills: 'ናይ ኣገልግሎት ክፍሊት',
    scanQr: 'QR ስካን ጌርካ ክፈል',
    recentTransactions: 'ናይ ቀረባ ምንቅስቓሳት',
    logout: 'ውጻእ',
  },
  so: {
    langName: 'Somali',
    langNative: 'Soomaali',
    welcome: 'Kusoo dhawoow',
    allInOne: 'Dhammaan-Hal-Meesha',
    login: 'Gal (Login)',
    mobileNumber: 'Lambarka Taleefanka',
    mobilePlaceholder: '',
    next: 'Xiga',
    dontHaveAccount: 'Miyaanad lahayn akoon?',
    createNewAccount: 'Fur Akoon Cusub',
    teleHub: 'teleHub',
    help: 'Caawimaad',
    termsAndConditions: 'Shuruudaha iyo Xeerarka',
    copyright: '@2026 Ethio telecom. Dhammaan xuquuqda way dhowran tahay',
    version: 'Nooca 1.3.2',
    quickFill: 'Ku qor tusaalaha sawirka (+251 911026439)',
    validating: 'Xaqiijinta lambarka...',
    phoneError: 'Fadlan geli lambar taleefan Itoobiya oo 9 lambar ah oo sax ah (tusaale 911026439)',
    otpTitle: 'Xaqiiji Lambarka Taleefankaaga',
    otpSubtitle: 'Geli koodka xaqiijinta 6-lambar ee loo soo diray taleefankaaga:',
    verifyAndContinue: 'Xaqiiji oo Sii wad',
    resendCode: 'Dib u dir koodka',
    resendIn: 'Dib u dirashada',
    changeNumber: 'Bedel Lambarka',
    loginWithPassword: 'Ku gal PIN telebirr',
    enterPin: 'Geli telebirr PIN',
    or: 'ama',
    portalMode: 'Habka Daawashada',
    desktopView: 'Web Portal',
    mobileView: 'Muuqaalka Taleefanka',
    customerCare: 'Adeegga Macaamiisha 24/7',
    ethioTelecomCare: 'Taageerada Ethio Telecom',
    telebirrCare: 'Khadka Caawinta telebirr',
    ussdServices: 'Adeegyada USSD',
    faq: 'Su\'aalaha Badanaa La Isweydiiyo',
    dashboardGreeting: 'Kusoo dhawoow mar kale',
    availableBalance: 'Haraaga Akoonka',
    sendMoney: 'Dir Lacag',
    buyAirtime: 'Iibso Hadal & Xidhmooyin',
    payBills: 'Bixi Biilasha Adeegga',
    scanQr: 'Scan QR & Bixi',
    recentTransactions: 'Dhaqdhaqaaqii ugu Dambeeyay',
    logout: 'Ka Bax',
  },
};
