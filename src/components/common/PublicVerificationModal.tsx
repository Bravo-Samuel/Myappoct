import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  QrCode, 
  Copy, 
  Check, 
  Search, 
  Lock, 
  Award, 
  FileText,
  Building2,
  Calendar,
  Clock
} from 'lucide-react';
import { DigitalSignatureService, PublicVerificationPayload } from '../../services/data/DigitalSignatureService';

interface PublicVerificationModalProps {
  initialCode: string;
  onClose: () => void;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  initialCode,
  onClose
}) => {
  const [query, setQuery] = useState(initialCode || 'BMCI-2026-0001824');
  const [result, setResult] = useState<PublicVerificationPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = (lookupCode: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const res = DigitalSignatureService.verifyDocumentPublic(lookupCode);
      setResult(res);
      setIsSearching(false);
      if (res.documentNumber && res.documentNumber !== 'N/A') {
        DigitalSignatureService.logDocumentEvent(res.documentNumber, 'Viewed', 'Public Auditor / Gabbai');
      }
    }, 300);
  };

  useEffect(() => {
    handleVerify(initialCode || 'BMCI-2026-0001824');
  }, [initialCode]);

  const copyFingerprint = () => {
    if (result?.sha256Fingerprint) {
      navigator.clipboard.writeText(result.sha256Fingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-[#0D152C] to-slate-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Government Style Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-[#131F42] to-slate-900 border-b border-amber-500/30 relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase font-mono">
                Bnei Menashe Council India • Official Trust Registry
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Public Document Verification Page
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close verification page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for manual entry / instant check */}
        <div className="px-6 pt-5 pb-3 bg-slate-900/60 border-b border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(query);
            }}
            className="flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Document Number, QR ID, Citizen ID, or Cryptographic SHA-256..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 focus:border-amber-500 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>{isSearching ? 'Verifying...' : 'Verify Cryptographic Seal'}</span>
            </button>
          </form>

          {/* Sample quick selector pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] text-slate-400">
            <span className="font-bold uppercase text-slate-500">Quick Test IDs:</span>
            {['BMCI-2026-0001824', 'BM-MEMB-2026-8812', 'BM-CEN-2026-0419', 'BM-HOU-2026-0842'].map(code => (
              <button
                key={code}
                onClick={() => {
                  setQuery(code);
                  handleVerify(code);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/10 font-mono transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Status Banner & Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {isSearching ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">Validating SHA-256 Signature Seal...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* STATUS BANNER */}
              <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
                result.verificationStatus === 'Verified'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                  : result.verificationStatus === 'Revoked'
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/50 text-amber-300'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    result.verificationStatus === 'Verified'
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 shadow-lg'
                      : result.verificationStatus === 'Revoked'
                      ? 'bg-rose-500 text-white shadow-rose-500/30 shadow-lg'
                      : 'bg-amber-500 text-slate-950 shadow-amber-500/30 shadow-lg'
                  }`}>
                    {result.verificationStatus === 'Verified' && <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />}
                    {result.verificationStatus === 'Revoked' && <XCircle className="w-8 h-8 stroke-[2.5]" />}
                    {result.verificationStatus === 'Not Verified' && <AlertTriangle className="w-8 h-8 stroke-[2.5]" />}
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                      OFFICIAL CRYPTOGRAPHIC VERIFICATION STATUS
                    </div>
                    <div className="text-2xl font-black tracking-tight mt-0.5 flex items-center gap-2">
                      {result.verificationStatus === 'Verified' && <span>✓ VERIFIED</span>}
                      {result.verificationStatus === 'Revoked' && <span>⚠ REVOKED</span>}
                      {result.verificationStatus === 'Not Verified' && <span>❌ NOT VERIFIED</span>}
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] font-mono font-bold text-slate-300">
                  Version: {result.version}
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-300 italic px-1">
                "{result.message}"
              </p>

              {/* STRICT PUBLIC METADATA GRID */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Public Document Metadata</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Tamper Protected Seal</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Number</span>
                    <span className="font-mono font-black text-amber-300 text-sm bg-white/5 px-2.5 py-1 rounded border border-white/10 inline-block">
                      {result.documentNumber}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Type</span>
                    <span className="font-bold text-white text-sm">
                      {result.documentName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issuing Authority</span>
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{result.issuingAuthority}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Date</span>
                    <span className="font-mono text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{result.issueDate} {result.issueTime && `(${result.issueTime})`}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification Date</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{result.verificationDate} (Live Check)</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Category</span>
                    <span className="font-bold text-slate-200">
                      {result.category}
                    </span>
                  </div>
                </div>

                {/* SHA-256 Fingerprint Box */}
                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SHA-256 Cryptographic Fingerprint</span>
                    <button
                      onClick={copyFingerprint}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied Hash' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-[10px] text-slate-400 break-all select-all">
                    {result.sha256Fingerprint}
                  </div>
                </div>
              </div>

              {/* STRICT PRIVACY NOTICE */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-[11px] text-amber-200/90 leading-relaxed">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5 uppercase tracking-wide text-[10px]">Strict Member Privacy Protection</strong>
                  By design, this verification registry exposes only official document standing and cryptographic authenticity. Under Bnei Menashe Council governance rules, private member data including Passport Number, Aadhaar Number, Phone Number, Email, physical domicile address, and private household records are strictly shielded and never transmitted.
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="text-[10px] text-slate-500 font-mono">
            BNEI MENASHE DIGITAL PLATFORM • TRUST LAYER v2.6
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
