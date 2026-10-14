import React, { useState, useMemo } from 'react';
import { 
  FolderLock, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Share2, 
  QrCode, 
  Eye, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Lock, 
  CloudCheck, 
  WifiOff, 
  Smartphone, 
  History, 
  Award, 
  UserCheck, 
  ChevronRight, 
  X, 
  Copy, 
  Star, 
  FileBadge, 
  FileSpreadsheet, 
  HeartHandshake, 
  Flame, 
  Landmark, 
  Plane, 
  GraduationCap,
  Sparkles,
  Link,
  Users,
  Check,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { NavSection } from '../../types';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

interface DocumentCenterViewProps {
  onNavigate: (section: NavSection) => void;
}

export interface OfficialDocument {
  id: string;
  docNumber: string;
  name: string;
  hebrewName?: string;
  category: 'Identity' | 'Census' | 'Family' | 'Memorial' | 'Community' | 'Aliyah' | 'Education' | 'Uploads';
  categoryIcon: string;
  issuedDate: string;
  expiryDate?: string;
  issuedBy: string;
  status: 'Verified' | 'Pending Verification' | 'Requires Update';
  version: string;
  qrId: string;
  fileType: 'CERTIFICATE' | 'ID_CARD' | 'LETTER' | 'RECORD';
  hash: string;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  isRecent?: boolean;
  householdName: string;
  description: string;
  revisions: { version: string; date: string; note: string; officer: string }[];
}

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({ onNavigate }) => {
  const { profile } = useSupabaseAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [selectedDocForView, setSelectedDocForView] = useState<OfficialDocument | null>(null);
  const [selectedDocForShare, setSelectedDocForShare] = useState<OfficialDocument | null>(null);
  const [activeVerificationCode, setActiveVerificationCode] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form state
  const [uploadDocType, setUploadDocType] = useState('Passport');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');

  // Share Modal state
  const [sharePermission, setSharePermission] = useState('Household');
  const [shareDuration, setShareDuration] = useState('7 days');
  const [generatedLink, setGeneratedLink] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Document Catalog (source of truth connected across all modules)
  const [documents, setDocuments] = useState<OfficialDocument[]>([
    {
      id: 'doc-id-01',
      docNumber: 'BM-ID-5786-8821',
      name: 'Official Community Identity Pass',
      hebrewName: 'תעודת אזרח בני מנשה',
      category: 'Identity',
      categoryIcon: '🏛',
      issuedDate: '2025-11-14',
      expiryDate: '2030-11-14',
      issuedBy: 'Bnei Menashe Global Registry Node',
      status: 'Verified',
      version: 'v3.2',
      qrId: 'QR-ID-994821',
      fileType: 'ID_CARD',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isFavorite: true,
      isRecent: true,
      isDownloaded: true,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Official biometric cryptographic Community Identity Pass verified by the Beit Din & Regional Council.',
      revisions: [
        { version: 'v3.2', date: '2025-11-14', note: 'Renewed biometric hash & cryptographic seal', officer: 'Rabbi Hanoch Avtzon' },
        { version: 'v3.0', date: '2024-10-01', note: 'Initial Digital ID registration', officer: 'Churachandpur Node Admin' }
      ]
    },
    {
      id: 'doc-census-02',
      docNumber: 'BM-CEN-2026-0419',
      name: 'Verified Household Census Seal & Certificate',
      hebrewName: 'אישור מפקד אוכלוסין 5786',
      category: 'Census',
      categoryIcon: '📊',
      issuedDate: '2026-03-20',
      issuedBy: 'Regional Census Verification Officer',
      status: 'Verified',
      version: 'v1.4',
      qrId: 'QR-CEN-771204',
      fileType: 'CERTIFICATE',
      hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      isFavorite: true,
      isRecent: true,
      isDownloaded: true,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Official census enrollment seal validating residency, tribal lineage, and household composition.',
      revisions: [
        { version: 'v1.4', date: '2026-03-20', note: 'Approved annual household enumeration update', officer: 'District Coordinator' }
      ]
    },
    {
      id: 'doc-fam-03',
      docNumber: 'BM-FAM-5785-1102',
      name: 'Generational Lineage & Family Tree Record',
      hebrewName: 'מגילת יוחסין משפחתית',
      category: 'Family',
      categoryIcon: '👨‍👩‍👧',
      issuedDate: '2025-08-10',
      issuedBy: 'Bnei Menashe Genealogical Repository',
      status: 'Verified',
      version: 'v2.1',
      qrId: 'QR-FAM-443901',
      fileType: 'RECORD',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      isFavorite: false,
      isDownloaded: false,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Certified lineage record linking 4 generations across Mizoram, Manipur, and Israel.',
      revisions: [
        { version: 'v2.1', date: '2025-08-10', note: 'Added maternal grand-patrimonial records', officer: 'Lineage Review Board' }
      ]
    },
    {
      id: 'doc-aliyah-04',
      docNumber: 'BM-ALY-2026-9002',
      name: 'Aliyah Supporting Rabbinical Letter of Status',
      hebrewName: 'מכתב תמיכה לעלייה מבית הדין',
      category: 'Aliyah',
      categoryIcon: '✈️',
      issuedDate: '2026-06-01',
      issuedBy: 'Shavei Israel & Regional Rabbinical Court',
      status: 'Verified',
      version: 'v1.0',
      qrId: 'QR-ALY-882190',
      fileType: 'LETTER',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      isFavorite: true,
      isRecent: true,
      isDownloaded: true,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Official rabbinical recommendation letter verifying communal standing for Ministry of Interior review.',
      revisions: [
        { version: 'v1.0', date: '2026-06-01', note: 'Issued under official seal of Chief Rabbinical Council', officer: 'Rabbi Yehuda Gin' }
      ]
    },
    {
      id: 'doc-mem-05',
      docNumber: 'BM-MEM-5784-3310',
      name: 'Perpetual Yahrzeit & Memorial Board Certificate',
      hebrewName: 'תעודת זכרון והנצחה לדורות',
      category: 'Memorial',
      categoryIcon: '🕯',
      issuedDate: '2024-11-20',
      issuedBy: 'Hevra Kadisha & Synagogue Memorial Board',
      status: 'Verified',
      version: 'v1.0',
      qrId: 'QR-MEM-112049',
      fileType: 'CERTIFICATE',
      hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      isFavorite: false,
      isDownloaded: false,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Commemorative certicate guaranteeing annual Kaddish recitation and sanctuary light illumination.',
      revisions: [
        { version: 'v1.0', date: '2024-11-20', note: 'Registered on permanent digital sanctuary wall', officer: 'Gabbai Shlomo Hangshing' }
      ]
    },
    {
      id: 'doc-edu-06',
      docNumber: 'BM-EDU-2025-6612',
      name: 'Advanced Hebrew & Halacha Course Diploma',
      hebrewName: 'תעודת סיום לימודי עברית והלכה',
      category: 'Education',
      categoryIcon: '📚',
      issuedDate: '2025-12-15',
      issuedBy: 'Bnei Menashe Torah Academy',
      status: 'Verified',
      version: 'v1.0',
      qrId: 'QR-EDU-554109',
      fileType: 'CERTIFICATE',
      hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      isFavorite: false,
      isDownloaded: true,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Honors completion certificate for intensive conversational Hebrew and Shabbat laws curriculum.',
      revisions: [
        { version: 'v1.0', date: '2025-12-15', note: 'Awarded with distinction', officer: 'Academy Dean' }
      ]
    },
    {
      id: 'doc-comm-07',
      docNumber: 'BM-SYN-2026-1004',
      name: 'Beit Shalom Synagogue Membership & Aliyah Honor Deed',
      hebrewName: 'תעודת חברות בקהילת בית שלום',
      category: 'Community',
      categoryIcon: '🕍',
      issuedDate: '2026-01-10',
      issuedBy: 'Beit Shalom Synagogue Committee',
      status: 'Verified',
      version: 'v1.2',
      qrId: 'QR-SYN-990182',
      fileType: 'LETTER',
      hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      isFavorite: false,
      isDownloaded: false,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Good standing certificate verifying active synagogue participation and volunteer service contribution.',
      revisions: [
        { version: 'v1.2', date: '2026-01-10', note: 'Annual good standing confirmation', officer: 'Community Chairman' }
      ]
    },
    {
      id: 'doc-up-08',
      docNumber: 'BM-UPL-2026-4401',
      name: 'Government Indian Passport Scan (Front & Back)',
      hebrewName: 'העתק דרכון הודי לאימות',
      category: 'Uploads',
      categoryIcon: '📁',
      issuedDate: '2026-06-28',
      expiryDate: '2026-10-05',
      issuedBy: 'Self-Uploaded Citizen Document',
      status: 'Pending Verification',
      version: 'v1.0',
      qrId: 'QR-UPL-331029',
      fileType: 'RECORD',
      hash: 'c87893a0d5c805eb3e859b5df1dcf50b868bcce24151a66993146430b80f19fc',
      isFavorite: false,
      isRecent: true,
      isDownloaded: false,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: 'Submitted scan for identity cross-verification and Aliyah travel processing.',
      revisions: [
        { version: 'v1.0', date: '2026-06-28', note: 'Uploaded via Digital Document Center portal', officer: 'System Ingestion' }
      ]
    }
  ]);

  // Categories definitions
  const categoriesList = [
    { name: 'All', icon: '📂', count: documents.length, desc: 'Complete Registry Vault' },
    { name: 'Identity', icon: '🏛', count: documents.filter(d => d.category === 'Identity').length, desc: 'Digital ID & Biometric Seals' },
    { name: 'Census', icon: '📊', count: documents.filter(d => d.category === 'Census').length, desc: 'Household Enumeration Seals' },
    { name: 'Family', icon: '👨‍👩‍👧', count: documents.filter(d => d.category === 'Family').length, desc: 'Lineage & Birth Records' },
    { name: 'Memorial', icon: '🕯', count: documents.filter(d => d.category === 'Memorial').length, desc: 'Yahrzeit & Sanctuary Honors' },
    { name: 'Community', icon: '🕍', count: documents.filter(d => d.category === 'Community').length, desc: 'Synagogue & Volunteer Deeds' },
    { name: 'Aliyah', icon: '✈️', count: documents.filter(d => d.category === 'Aliyah').length, desc: 'Rabbinical Letters & Travel' },
    { name: 'Education', icon: '📚', count: documents.filter(d => d.category === 'Education').length, desc: 'Hebrew & Torah Diplomas' },
  ];

  // Filter pills
  const filtersList = ['All', 'Recent', 'Verified', 'Pending', 'Certificates', 'Letters', 'Identity', 'Favorites', 'Downloaded'];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category match
      if (activeCategory !== 'All' && doc.category !== activeCategory) {
        return false;
      }
      // Filter tab match
      if (activeFilter === 'Recent' && !doc.isRecent) return false;
      if (activeFilter === 'Verified' && doc.status !== 'Verified') return false;
      if (activeFilter === 'Pending' && doc.status !== 'Verified') return false;
      if (activeFilter === 'Certificates' && doc.fileType !== 'CERTIFICATE') return false;
      if (activeFilter === 'Letters' && doc.fileType !== 'LETTER') return false;
      if (activeFilter === 'Identity' && doc.category !== 'Identity') return false;
      if (activeFilter === 'Favorites' && !doc.isFavorite) return false;
      if (activeFilter === 'Downloaded' && !doc.isDownloaded) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchHeb = doc.hebrewName?.toLowerCase().includes(q) || false;
        const matchNum = doc.docNumber.toLowerCase().includes(q);
        const matchCat = doc.category.toLowerCase().includes(q);
        const matchQr = doc.qrId.toLowerCase().includes(q);
        const matchHh = doc.householdName.toLowerCase().includes(q);
        return matchName || matchHeb || matchNum || matchCat || matchQr || matchHh;
      }
      return true;
    });
  }, [documents, activeCategory, activeFilter, searchQuery]);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
    showToast('Updated vault favorites');
  };

  const handleDownloadPdf = (e: React.MouseEvent, doc: OfficialDocument) => {
    e.stopPropagation();
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, isDownloaded: true } : d));
    showToast(`Downloading official encrypted PDF: ${doc.docNumber}.pdf`);
  };

  const handleVerifySeal = (e: React.MouseEvent, doc: OfficialDocument) => {
    e.stopPropagation();
    setActiveVerificationCode(doc.docNumber);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      showToast('Please enter a document title or select a file');
      return;
    }
    const newDoc: OfficialDocument = {
      id: `doc-up-${Date.now()}`,
      docNumber: `BM-UPL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: uploadFileName,
      category: 'Uploads',
      categoryIcon: '📁',
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Citizen Self-Upload',
      status: 'Pending Verification',
      version: 'v1.0',
      qrId: `QR-UPL-${Math.floor(100000 + Math.random() * 900000)}`,
      fileType: 'RECORD',
      hash: 'a3d90210fbe049281a8b002049102940e0a029304910293049102930e9201948',
      isRecent: true,
      householdName: profile?.full_name ? `${profile.full_name} Household` : 'Ben-Menashe Household',
      description: uploadNotes || 'Citizen uploaded record awaiting regional coordinator verification.',
      revisions: [
        { version: 'v1.0', date: new Date().toISOString().split('T')[0], note: 'Uploaded directly to Digital Document Center', officer: 'System Ingestion' }
      ]
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    setUploadFileName('');
    setUploadNotes('');
    showToast('Your document has been safely recorded. Thank you for keeping our community records accurate.');
  };

  const handleCreateShareLink = (e: React.FormEvent) => {
    e.preventDefault();
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = `https://bneimenashe.org/vault/share/${selectedDocForShare?.docNumber}/${token}`;
    setGeneratedLink(link);
    showToast(`Secure time-limited share link generated (${shareDuration})`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in text-slate-100 font-sans">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl animate-bounce border border-amber-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================
          1. HOME DASHBOARD HEADER BANNER ("Apple Wallet + Files")
          ==================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#19223A] to-[#121B2F] p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-inner">
              <FolderLock className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL COMMUNITY DOCUMENT REGISTRY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>📂 Digital Document Center</span>
            </h1>
            <p className="text-base font-bold text-amber-400/90">
              Secure Community Document Vault
            </p>
            <p className="text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Store, organize, verify, and access your official community documents securely. Functioning as the sole official source of truth for Community Identity Passes, census certificates, family lineage deeds, and Aliyah rabbinical letters.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveVerificationCode('BMCI-2026-0001824')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all shadow-md hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify Digital Seal</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-xl hover:scale-105"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>My Digital ID</span>
            </button>
          </div>
        </div>

        {/* SECURITY & STATUS INDICATORS BAR */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Registry</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Lock className="w-4 h-4" />
            <span>AES-256 Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <CloudCheck className="w-4 h-4" />
            <span>Cloud Synced</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Smartphone className="w-4 h-4" />
            <span>Offline Available</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Accessed: Today</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Trusted Device</span>
          </div>
        </div>
      </section>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Digital Document Center?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Digital Document Center is your secure community vault. Here you can keep digital copies of your official Community Identity Passes, census verification certificates, family lineage records, and Rabbinic letters. All records are protected by strong encryption so you can securely present or download them whenever your household needs them.
        </p>
      </div>

      {/* ====================================================
          2. NOTIFICATION ALERTS BANNER
          ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">Passport Status Alert</p>
            <p className="text-slate-300 font-light">Your uploaded Indian Passport scan expires in 90 days.</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-emerald-300">Census Seal Verified</p>
            <p className="text-slate-300 font-light">Regional Council approved your 5786 Household Census record.</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
          <FileBadge className="w-5 h-5 text-blue-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-blue-300">New Certificate Available</p>
            <p className="text-slate-300 font-light">Your Aliyah Supporting Letter v1.0 has been issued.</p>
          </div>
        </div>
      </div>

      {/* ====================================================
          3. DOCUMENT CATEGORIES (Beautiful Apple Folders)
          ==================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
            <span>Document Categories</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">{documents.length} Total Records</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`p-4 rounded-3xl border transition-all text-left flex flex-col justify-between min-h-[115px] group ${
                  isSelected 
                    ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500 shadow-lg scale-[1.02]' 
                    : 'bg-slate-900/80 border-white/10 hover:border-amber-500/40 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300'
                  }`}>
                    {cat.count}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className={`text-xs font-black tracking-tight ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light truncate mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ====================================================
          4. SMART SEARCH & FILTERS
          ==================================================== */}
      <section className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Document Name, Category, QR ID, Hebrew Title, or Household..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-white/10 focus:border-amber-500 text-sm text-white placeholder:text-slate-500 transition-all outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cards Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters:</span>
          </span>
          {filtersList.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeFilter === f 
                  ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow' 
                  : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
          {(activeCategory !== 'All' || activeFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => { setActiveCategory('All'); setActiveFilter('All'); setSearchQuery(''); }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold whitespace-nowrap transition-all shrink-0 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* ====================================================
          5. DOCUMENT CARDS GRID / LIST VIEW ("Apple Wallet + Files")
          ==================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            {activeCategory === 'All' ? 'Complete Vault Catalog' : `${activeCategory} Documents`} ({filteredDocuments.length})
          </h2>
        </div>

        {filteredDocuments.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <FolderLock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">No Documents Matched</h3>
              <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">
                No records found matching your active filter criteria. Try resetting search parameters or uploading a new community document.
              </p>
            </div>
            <button
              onClick={() => { setActiveCategory('All'); setActiveFilter('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="group relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#131C30] to-slate-950 p-6 border border-white/10 hover:border-amber-500/50 shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Watermark badge */}
                <div className="absolute -right-6 -top-6 text-7xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  {doc.categoryIcon}
                </div>

                {/* Top header */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                      <span>{doc.categoryIcon}</span>
                      <span>{doc.category}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleFavorite(e, doc.id)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          doc.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {doc.name}
                    </h3>
                    {doc.hebrewName && (
                      <p className="text-xs text-amber-400/80 font-medium font-serif">{doc.hebrewName}</p>
                    )}
                  </div>

                  {/* Details pill list */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-300 font-light border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-mono">Doc Number:</span>
                      <span className="font-mono text-amber-300 font-bold">{doc.docNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issue Date:</span>
                      <span>{doc.issuedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issued By:</span>
                      <span className="truncate max-w-[160px] text-right font-medium">{doc.issuedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Version:</span>
                      <span className="font-mono text-xs">{doc.version}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Status & Actions bar */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {doc.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Seal</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadPdf(e, doc)}
                      title="Download Official PDF"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedDocForShare(doc); }}
                      title="Share Secure Link"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleVerifySeal(e, doc)}
                      title="Cryptographic Verify"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="rounded-3xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-xl divide-y divide-white/5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                    {doc.categoryIcon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{doc.docNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 font-medium text-slate-300">{doc.category}</span>
                    </div>
                    <h3 className="text-sm font-black text-white truncate mt-0.5">{doc.name}</h3>
                    <p className="text-xs text-slate-400 font-light truncate">Issued: {doc.issuedDate} by {doc.issuedBy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {doc.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  )}

                  <button
                    onClick={(e) => handleDownloadPdf(e, doc)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedDocForShare(doc); }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ====================================================
          6. CROSS-MODULE REGISTRY INTEGRATION FOOTER
          ==================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
        <div className="flex items-center gap-3 text-amber-400 font-bold">
          <Link className="w-5 h-5" />
          <h3 className="text-base tracking-tight text-white">Unified Cross-Module Integration</h3>
        </div>
        <p className="text-xs text-slate-300 font-light leading-relaxed max-w-4xl">
          The Digital Document Center functions as the centralized immutable storage layer. When you update records in the <strong>Citizen Digital ID</strong>, submit data in the <strong>Census & Demographics</strong> portal, log lineage in the <strong>Family Tree</strong>, register memorial candles on the <strong>Memorial Board</strong>, or request assistance from the <strong>Regional Council</strong>, all certificates are auto-indexed here without file duplication.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {['Community Digital ID', 'Community Census', 'Family Tree Repository', 'Perpetual Memorial Board', 'Regional Council Node', 'Global Admin Console', 'Community Wallet'].map((mod) => (
            <span key={mod} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{mod}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ====================================================
          MODAL 1: DOCUMENT VIEWER ("Apple Wallet / Government Seal")
          ==================================================== */}
      {selectedDocForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedDocForView(null)}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 pb-6 border-b border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-3xl mb-1 shadow-inner">
                {selectedDocForView.categoryIcon}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">{selectedDocForView.docNumber}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold">VERIFIED SEAL</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{selectedDocForView.name}</h2>
              {selectedDocForView.hebrewName && (
                <p className="text-base text-amber-300 font-serif">{selectedDocForView.hebrewName}</p>
              )}
            </div>

            {/* Official Document / PDF Canvas Preview */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-950 via-[#11192C] to-slate-950 border-2 border-amber-500/30 relative overflow-hidden shadow-inner space-y-6 text-center font-serif">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-[0.03] pointer-events-none select-none font-bold">
                BNEI MENASHE
              </div>

              <div className="space-y-1 text-slate-300 font-sans text-xs uppercase tracking-widest">
                <p>Official Record of the Bnei Menashe Regional Registry</p>
                <p className="text-[10px] text-slate-500">Issued under Rabbinical Court & Governance Supervision</p>
              </div>

              <div className="py-4 space-y-2 border-y border-amber-500/20 max-w-lg mx-auto font-sans text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Household:</span>
                  <span className="font-bold text-white">{selectedDocForView.householdName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Classification:</span>
                  <span className="font-medium text-amber-300">{selectedDocForView.category} ({selectedDocForView.fileType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuing Authority:</span>
                  <span className="font-medium text-white">{selectedDocForView.issuedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Date:</span>
                  <span>{selectedDocForView.issuedDate}</span>
                </div>
                {selectedDocForView.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className="text-rose-400 font-bold">{selectedDocForView.expiryDate}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 font-sans italic max-w-md mx-auto">
                "{selectedDocForView.description}"
              </p>

              {/* Cryptographic Seal Footer inside preview */}
              <div className="flex items-center justify-between pt-4 font-sans text-[11px] text-slate-400 border-t border-white/10">
                <div className="text-left">
                  <p className="font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Digital Signature Seal</span>
                  </p>
                  <p className="font-mono text-[9px] text-slate-500 truncate max-w-[200px]">SHA256:{selectedDocForView.hash.substring(0, 24)}...</p>
                </div>
                <div className="p-2 rounded-xl bg-white text-slate-950 font-mono text-[9px] font-bold flex flex-col items-center shadow">
                  <QrCode className="w-8 h-8 text-slate-950" />
                  <span>{selectedDocForView.qrId}</span>
                </div>
              </div>
            </div>

            {/* Revision & Audit History */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-400" />
                <span>Document Revision & Verification History</span>
              </h3>
              <div className="space-y-2">
                {selectedDocForView.revisions.map((rev, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-amber-300 font-bold mr-2">{rev.version}</span>
                      <span className="text-slate-200">{rev.note}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{rev.date} • {rev.officer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  showToast(`Preparing official document print layout for ${selectedDocForView.docNumber}...`);
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={(e) => { setSelectedDocForView(null); setSelectedDocForShare(selectedDocForView); }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Secure Share</span>
              </button>
              <button
                onClick={(e) => handleDownloadPdf(e, selectedDocForView)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: UPLOAD DOCUMENT PLACEHOLDER
          ==================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleUploadSubmit} className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-amber-400" />
                <span>Upload Document to Vault</span>
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Uploaded files enter <span className="text-amber-300 font-bold">Pending Verification</span> until validated by your Regional Council coordinator.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Document Placeholder Category</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-500 outline-none"
                >
                  <option value="Passport">Passport (Indian / Israeli)</option>
                  <option value="Aadhaar">Aadhaar National ID Card</option>
                  <option value="Birth Certificate">Official Birth Certificate</option>
                  <option value="Marriage Certificate">Ketubah / Marriage Certificate</option>
                  <option value="Other Documents">Other Community or Educational Record</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Document Title / Description</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Indian Passport Scan - Shlomo Hangshing"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              {/* Drag & Drop Upload Zone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-500/60 transition-colors bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer group">
                <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-amber-400 transition-colors mb-2" />
                <p className="text-xs font-bold text-white group-hover:text-amber-300">Click to upload or drag file here</p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PDF, PNG, JPG (Max 25MB • AES Encrypted)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Submission Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Additional context for regional verification review..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================================================
          MODAL 3: HOUSEHOLD SHARING
          ==================================================== */}
      {selectedDocForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleCreateShareLink} className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedDocForShare(null)}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                <span>Secure Document Sharing</span>
              </h3>
              <p className="text-xs text-slate-400">
                Granting cryptographic access for: <span className="font-bold text-amber-300">{selectedDocForShare.docNumber}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Access Permission Level</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-500 outline-none"
                >
                  <option value="Only Me">Only Me (Private Vault)</option>
                  <option value="Household">Household Members</option>
                  <option value="Regional Council">Regional Council Coordinator</option>
                  <option value="Global Admin">Global Registry Admin</option>
                  <option value="Specific Rabbi">Specific Beit Din Rabbi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Time-Limited Expiration</label>
                <select
                  value={shareDuration}
                  onChange={(e) => setShareDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:border-amber-500 outline-none"
                >
                  <option value="24 hours">24 Hours (Temporary Review)</option>
                  <option value="7 days">7 Days (Standard Share)</option>
                  <option value="30 days">30 Days (Extended Review)</option>
                  <option value="Permanent">Permanent Link</option>
                </select>
              </div>

              {generatedLink ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 animate-fade-in">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Encrypted Link Generated</span>
                  <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-200 break-all select-all">
                    {generatedLink}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      showToast('Copied secure time-limited link to clipboard');
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link to Clipboard</span>
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg"
                >
                  Generate Time-Limited Share Link
                </button>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setSelectedDocForShare(null); setGeneratedLink(''); }}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PUBLIC VERIFICATION MODAL */}
      {activeVerificationCode && (
        <PublicVerificationModal
          initialCode={activeVerificationCode}
          onClose={() => setActiveVerificationCode(null)}
        />
      )}

    </div>
  );
};
