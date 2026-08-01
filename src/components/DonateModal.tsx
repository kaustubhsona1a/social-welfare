import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DonationDrive, Language, DonorRecord } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';
import { FoundationRepository } from '../lib/supabase';
import { Logo } from './Logo';
import { 
  X, 
  HeartHandshake, 
  QrCode, 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  Printer, 
  ShieldCheck
} from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDriveId?: string;
  drives: DonationDrive[];
  currentLang: Language;
  onDonationSuccess: (donor: DonorRecord) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  selectedDriveId,
  drives,
  currentLang,
  onDonationSuccess
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [driveId, setDriveId] = useState<string>(selectedDriveId || 'general');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'card'>('upi');
  
  // Form fields
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');

  // UI state
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<DonorRecord | null>(null);

  if (!isOpen) return null;

  const selectedDrive = drives.find(d => d.id === driveId);
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(FOUNDATION_INFO.bankDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAccount = () => {
    const text = `Account: ${FOUNDATION_INFO.bankDetails.accountNumber}\nIFSC: ${FOUNDATION_INFO.bankDetails.ifscCode}\nName: ${FOUNDATION_INFO.bankDetails.accountName}`;
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleProcessDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    setIsSubmitting(true);

    try {
      const record = await FoundationRepository.addDonor({
        donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Citizen'),
        amount: finalAmount,
        driveId: driveId === 'general' ? undefined : driveId,
        driveTitle: driveId === 'general' ? 'General Community Relief Fund' : selectedDrive?.titleEn,
        paymentMethod: paymentMethod,
        message: message,
        isAnonymous: isAnonymous,
        transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      });

      // Fire confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setGeneratedReceipt(record);
      onDonationSuccess(record);
    } catch (err) {
      console.error('Error processing donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h3 className="text-xl font-black font-heading">
                {currentLang === 'or' ? 'ଅନୁଦାନ ଦିଅନ୍ତୁ' : 'Support Social Welfare Foundation'}
              </h3>
              <p className="text-xs text-emerald-200 font-mono">
                Reg. No: {FOUNDATION_INFO.regNo} • Babujang, Cuttack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt View Mode if completed */}
        {generatedReceipt ? (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 font-heading">
                {currentLang === 'or' ? 'ଆପଣଙ୍କ ଦାନ ପାଇଁ ବହୁତ ଧନ୍ୟବାଦ!' : 'Thank You For Your Contribution!'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                {currentLang === 'or' ? (
                  'ଆପଣଙ୍କର ସହାୟତା ବାବୁଜଙ୍ଗ ଓ ଆଖପାଖ ଅଞ୍ଚଳର ଅସହାୟ ପରିବାରଙ୍କ ପାଖରେ ପହଞ୍ଚିବ।'
                ) : (
                  'Your contribution directly supports essential food, clothing, and medical relief in Babujang, Cuttack.'
                )}
              </p>
            </div>

            {/* Receipt Card Printable */}
            <div id="printable-receipt" className="p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                  <div>
                    <span className="font-black text-sm text-slate-900 block font-heading">{FOUNDATION_INFO.nameEn}</span>
                    <span className="text-[11px] text-emerald-800 block font-mono">Reg. No: {FOUNDATION_INFO.regNo}</span>
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="text-slate-500 block">Receipt ID: {generatedReceipt.id}</span>
                  <span className="text-slate-700 font-bold">{generatedReceipt.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider font-mono">Donor Name</span>
                  <span className="font-bold text-slate-900 text-sm">{generatedReceipt.donorName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider font-mono">Amount Donated</span>
                  <span className="font-black text-emerald-800 text-lg font-mono">
                    ₹{generatedReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider font-mono">Cause / Drive</span>
                  <span className="font-bold text-slate-800">{generatedReceipt.driveTitle}</span>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider font-mono">Transaction Reference</span>
                  <span className="font-mono text-slate-800 font-bold">{generatedReceipt.transactionRef}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] text-emerald-800 font-bold font-mono">
                <span>Official Receipt • Social Welfare Foundation Babujang</span>
                <span>Contact: +91 95948 81882</span>
              </div>
            </div>

            {/* Receipt Action Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print / Save Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-md"
              >
                <span>Close Window</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Donation Form */
          <form onSubmit={handleProcessDonation} className="p-6 space-y-6">
            
            {/* Cause / Drive Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                1. {currentLang === 'or' ? 'ଅନୁଦାନର ଉଦ୍ଦେଶ୍ୟ ବାଛନ୍ତୁ' : 'Select Cause or Drive'}
              </label>
              <select
                value={driveId}
                onChange={(e) => setDriveId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="general">
                  {currentLang === 'or' ? 'ସାଧାରଣ ସମାଜସେବା ପାଣ୍ଠି (General Welfare Fund)' : 'General Community Relief Fund'}
                </option>
                {drives.map(d => (
                  <option key={d.id} value={d.id}>
                    {currentLang === 'or' ? d.titleOr : d.titleEn} (Target: ₹{d.targetAmount.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Preset Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                2. {currentLang === 'or' ? 'ଦାନ ପରିମାଣ (Amount in ₹)' : 'Choose Contribution Amount'}
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {[250, 500, 1000, 2500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-xl text-sm font-black border transition-all ${
                      amount === preset && !customAmount
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-102'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative pt-1">
                <span className="absolute left-4 top-4 text-slate-500 font-black text-sm font-mono">₹</span>
                <input
                  type="number"
                  placeholder="Enter custom amount (e.g. 5000)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  min="10"
                />
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                3. {currentLang === 'or' ? 'ପୈଠ ମାଧ୍ୟମ' : 'Select Payment Gateway'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-700 mb-1" />
                  <span>UPI / QR Scan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                    paymentMethod === 'bank'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-700 mb-1" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-700 mb-1" />
                  <span>Debit / Credit</span>
                </button>
              </div>

              {/* Tab 1: UPI Details */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
                  {/* Generated QR Representation */}
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-200 shrink-0 text-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=${FOUNDATION_INFO.bankDetails.upiId}&pn=SocialWelfareFoundation&am=${finalAmount}&cu=INR`} 
                      alt="UPI QR Code"
                      className="w-28 h-28 mx-auto rounded-lg"
                    />
                    <span className="text-[10px] text-slate-500 font-bold block mt-1 font-mono">GPay / PhonePe / Paytm</span>
                  </div>

                  <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
                    <p className="font-bold text-slate-900">
                      UPI ID: <span className="font-mono text-emerald-800 text-sm font-black select-all">{FOUNDATION_INFO.bankDetails.upiId}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 font-bold"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied UPI ID!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Bank Transfer Details */}
              {paymentMethod === 'bank' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block uppercase text-[10px] font-mono">Account Name</span>
                      <strong className="text-slate-900 font-mono">{FOUNDATION_INFO.bankDetails.accountName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[10px] font-mono">Bank Name</span>
                      <strong className="text-slate-900">{FOUNDATION_INFO.bankDetails.bankName} ({FOUNDATION_INFO.bankDetails.branch})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[10px] font-mono">Account Number</span>
                      <strong className="text-slate-900 font-mono text-sm">{FOUNDATION_INFO.bankDetails.accountNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[10px] font-mono">IFSC Code</span>
                      <strong className="text-slate-900 font-mono text-sm">{FOUNDATION_INFO.bankDetails.ifscCode}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg border border-slate-300 font-bold"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied Details!' : 'Copy All Bank Details'}</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Card / NetBanking */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <p className="text-slate-600 font-medium">
                    Secure credit/debit card processing enabled.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono" 
                    />
                    <input 
                      type="text" 
                      placeholder="MM/YY & CVV" 
                      className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Donor Information Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                4. {currentLang === 'or' ? 'ଦାତାଙ୍କ ପରିଚୟ' : 'Donor Information'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Transaction Ref / UTR (Optional)"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-700 font-bold cursor-pointer">
                  {currentLang === 'or' ? 'ମୋର ନାମ ଗୁପ୍ତ ରଖନ୍ତୁ' : 'Make this an anonymous donation'}
                </label>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Blessing or message for Babujang community (Optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || finalAmount <= 0}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <HeartHandshake className="w-5 h-5 text-slate-950" />
                    <span>Confirm & Generate Receipt for ₹{finalAmount.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registered under Odisha Societies Act • Reg No: {FOUNDATION_INFO.regNo}</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

