import React, { useState, useMemo } from 'react';
import {
  Building2,
  FileText,
  FolderCheck,
  Users,
  Landmark,
  BarChart2,
  Plane,
  GraduationCap,
  HeartHandshake,
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Send,
  Paperclip,
  Calendar,
  ChevronRight,
  UserCheck,
  ArrowUpRight,
  Sparkles,
  X,
  MessageSquare,
  HelpCircle,
  FolderLock,
  Download,
  Eye,
  Check,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Award,
  Lock,
  CornerDownRight,
  MoreVertical,
  ThumbsUp
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { NavSection } from '../../types';

interface ServiceCenterViewProps {
  onNavigate: (section: NavSection) => void;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  desc: string;
  department: string;
  subServices: string[];
}

export interface ServiceRequest {
  id: string;
  caseNumber: string;
  category: string;
  subService: string;
  title: string;
  description: string;
  status: 'Submitted' | 'Assigned' | 'Under Review' | 'Additional Info Requested' | 'Approved' | 'Completed' | 'Cancelled';
  priority: 'Standard' | 'High' | 'Urgent';
  assignedOffice: string;
  assignedOfficer: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion: string;
  linkedDocuments: { docNumber: string; name: string; category: string }[];
  notes: {
    id: string;
    sender: string;
    role: 'Citizen' | 'Officer' | 'System';
    text: string;
    timestamp: string;
  }[];
}

export const ServiceCenterView: React.FC<ServiceCenterViewProps> = ({ onNavigate }) => {
  const { profile } = useSupabaseAuth();

  // Navigation tab inside Service Center
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_requests' | 'admin_queue' | 'analytics'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<string>('');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestPriority, setRequestPriority] = useState<'Standard' | 'High' | 'Urgent'>('Standard');
  const [selectedOffice, setSelectedOffice] = useState('Bnei Menashe Regional Council (Mizoram/Manipur)');
  const [attachedDocs, setAttachedDocs] = useState<{ docNumber: string; name: string; category: string }[]>([]);

  // Detailed view / modal for existing requests
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin simulation state
  const [adminRole, setAdminRole] = useState<'Regional Officer' | 'Global Admin'>('Regional Officer');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Pre-loaded vault documents available for linking
  const availableVaultDocs = [
    { docNumber: 'BM-ID-5786-8821', name: 'Official Citizen Digital ID Card', category: 'Identity' },
    { docNumber: 'BM-CEN-2026-0419', name: 'Verified Household Census Seal & Certificate', category: 'Census' },
    { docNumber: 'BM-ALY-2026-9002', name: 'Aliyah Supporting Rabbinical Letter of Status', category: 'Aliyah' },
    { docNumber: 'BM-FAM-5785-1102', name: 'Generational Lineage & Family Tree Record', category: 'Family' },
    { docNumber: 'BM-SYN-2026-1004', name: 'Beit Shalom Synagogue Membership & Aliyah Honor Deed', category: 'Community' }
  ];

  // Service Categories Definition (Apple Support + Government layout)
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'cert_letters',
      title: 'Certificates & Letters',
      icon: '📄',
      desc: 'Official communal certification, membership letters, and rabbinic endorsements.',
      department: 'Civil Registry & Rabbinate',
      subServices: [
        'Community Certificate',
        'Membership Letter',
        'Residence Letter',
        'Family Certificate',
        'Volunteer Certificate',
        'Rabbinic Letter',
        'Aliyah Support Letter'
      ]
    },
    {
      id: 'doc_verification',
      title: 'Document Verification',
      icon: '📂',
      desc: 'Government biometric & archival identity verification and cryptographic seal sealing.',
      department: 'Regional Verification Node',
      subServices: [
        'Passport Verification',
        'Aadhaar Record Cross-Check',
        'Birth Certificate Authentication',
        'Marriage Certificate Sealing',
        'Family Records Verification',
        'Identity Verification Seal'
      ]
    },
    {
      id: 'household_services',
      title: 'Household Services',
      icon: '👨‍👩‍👧',
      desc: 'Maintain household composition, register births, marriages, or address changes.',
      department: 'Demographics & Lineage Council',
      subServices: [
        'Update Household Roster',
        'Register New Child',
        'Marriage Update & Registration',
        'Address & District Change',
        'Household Split Request',
        'Household Merge Request'
      ]
    },
    {
      id: 'synagogue_services',
      title: 'Synagogue Services',
      icon: '🕍',
      desc: 'Beit Shalom sanctuary seating, communal prayer memorials, and event bookings.',
      department: 'Synagogue Gabbai & Board',
      subServices: [
        'Synagogue Membership Enrollment',
        'High Holiday Seat Request',
        'Mi Shebeirach / Prayer Request',
        'Volunteer Registration',
        'Life-Cycle Event Registration'
      ]
    },
    {
      id: 'community_census',
      title: 'Community Census',
      icon: '📊',
      desc: 'Official 5786 annual census corrections, appeals, and missing document reviews.',
      department: 'Central Census Authority',
      subServices: [
        'Correct Census Data Record',
        'Annual Household Census Update',
        'Appeal Enumeration Decision',
        'Submit Missing Lineage Documents',
        'Request Formal Census Review'
      ]
    },
    {
      id: 'aliyah_services',
      title: 'Aliyah Services',
      icon: '✈️',
      desc: 'Application support, Ministry of Interior dossier reviews, and travel coordination.',
      department: 'Shavei Israel & Aliyah Committee',
      subServices: [
        'Aliyah Dossier Document Assistance',
        'Rabbinical Court Recommendation Letter',
        'Shavei Israel Application Support',
        'Aliyah Status Review & Expedite'
      ]
    },
    {
      id: 'education_services',
      title: 'Education & Torah',
      icon: '🎓',
      desc: 'Enroll in ulpan Hebrew classes, halacha institutes, and youth scholarship grants.',
      department: 'Torah Academy & Youth Ministry',
      subServices: [
        'Conversational Hebrew Class Enrollment',
        'Advanced Halacha & Torah Course',
        'Bnei Menashe Youth Program',
        'Yeshiva / Seminary Scholarship Request'
      ]
    },
    {
      id: 'community_welfare',
      title: 'Community Welfare',
      icon: '❤️',
      desc: 'Confidential medical assistance, emergency welfare funds, and elder support.',
      department: 'Tzedakah & Welfare Committee',
      subServices: [
        'Medical Care Assistance',
        'Emergency Relief & Food Support',
        'Family Crisis Counseling',
        'Elder Care & Home Support'
      ]
    }
  ];

  // Initial Case Catalog (Rich source of truth)
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'req-01',
      caseNumber: 'SR-2026-000124',
      category: 'Certificates & Letters',
      subService: 'Aliyah Support Letter',
      title: 'Formal Rabbinical Status Recommendation for Ministry Review',
      description: 'Requesting official signed rabbinical endorsement letter certifying active synagogue membership over 5 years for family Aliyah interview scheduled next month.',
      status: 'Under Review',
      priority: 'High',
      assignedOffice: 'Regional Rabbinical Court (Aizawl Node)',
      assignedOfficer: 'Dayan Rabbi Yehuda Gin',
      createdAt: '2026-06-28',
      updatedAt: '2026-07-04',
      estimatedCompletion: '2026-07-09 (3 business days)',
      linkedDocuments: [
        { docNumber: 'BM-ID-5786-8821', name: 'Official Citizen Digital ID Card', category: 'Identity' },
        { docNumber: 'BM-SYN-2026-1004', name: 'Beit Shalom Synagogue Membership Deed', category: 'Community' }
      ],
      notes: [
        { id: 'n-1', sender: 'System Node', role: 'System', text: 'Case SR-2026-000124 automatically ingested and verified against cryptographic ID hash.', timestamp: '2026-06-28 09:14 AM' },
        { id: 'n-2', sender: 'Dayan Rabbi Yehuda Gin', role: 'Officer', text: 'Shalom. We have verified your synagogue attendance record. Please confirm if your spouse will also be named on the same recommendation deed.', timestamp: '2026-07-02 02:30 PM' },
        { id: 'n-3', sender: profile?.full_name || 'Citizen', role: 'Citizen', text: 'Shalom Rabbi, yes please include my spouse Sarah and our newborn son. Thank you for your swift attention.', timestamp: '2026-07-03 10:15 AM' }
      ]
    },
    {
      id: 'req-02',
      caseNumber: 'SR-2026-000089',
      category: 'Document Verification',
      subService: 'Passport Verification',
      title: 'Indian Passport Biometric Cross-Verification Sealing',
      description: 'Submitted renewed passport scan for official verification against our census lineage vault to prevent travel delays.',
      status: 'Additional Info Requested',
      priority: 'Urgent',
      assignedOffice: 'Bnei Menashe Regional Council (Churachandpur Node)',
      assignedOfficer: 'Officer Lalthang Hangshing',
      createdAt: '2026-06-20',
      updatedAt: '2026-07-03',
      estimatedCompletion: 'Awaiting Citizen Response',
      linkedDocuments: [
        { docNumber: 'BM-ID-5786-8821', name: 'Official Citizen Digital ID Card', category: 'Identity' }
      ],
      notes: [
        { id: 'n-4', sender: 'Officer Lalthang Hangshing', role: 'Officer', text: 'The rear page scan of the passport showing the address field is slightly blurry. Please link a clearer PDF from your Document Center.', timestamp: '2026-07-03 11:45 AM' }
      ]
    },
    {
      id: 'req-03',
      caseNumber: 'SR-2026-000041',
      category: 'Household Services',
      subService: 'Register New Child',
      title: 'Registration of Newborn Son (Yoel Ben-Menashe)',
      description: 'Requesting official addition of our newborn baby boy into the 5786 communal household census roll following Brit Milah.',
      status: 'Approved',
      priority: 'Standard',
      assignedOffice: 'Demographics & Lineage Council',
      assignedOfficer: 'Coordinator Chana Fanai',
      createdAt: '2026-05-14',
      updatedAt: '2026-05-20',
      estimatedCompletion: 'Completed on May 20, 2026',
      linkedDocuments: [
        { docNumber: 'BM-FAM-5785-1102', name: 'Generational Lineage & Family Tree Record', category: 'Family' }
      ],
      notes: [
        { id: 'n-5', sender: 'Coordinator Chana Fanai', role: 'Officer', text: 'Mazal Tov! Newborn Yoel has been enrolled into household roll #BM-CEN-2026-0419. Digital ID will issue upon reaching age 16.', timestamp: '2026-05-20 04:00 PM' }
      ]
    },
    {
      id: 'req-04',
      caseNumber: 'SR-2026-000012',
      category: 'Community Welfare',
      subService: 'Emergency Relief & Food Support',
      title: 'Passover Holiday Food Basket & Matzah Allocation',
      description: 'Formal application for Passover festival provisions allocation for our 5-member household.',
      status: 'Completed',
      priority: 'Standard',
      assignedOffice: 'Tzedakah & Welfare Committee',
      assignedOfficer: 'Gabbai Shlomo Kolney',
      createdAt: '2026-03-10',
      updatedAt: '2026-03-22',
      estimatedCompletion: 'Completed on March 22, 2026',
      linkedDocuments: [
        { docNumber: 'BM-CEN-2026-0419', name: 'Verified Household Census Seal & Certificate', category: 'Census' }
      ],
      notes: [
        { id: 'n-6', sender: 'Gabbai Shlomo Kolney', role: 'Officer', text: 'Holiday package allocation approved and distributed at Beit Shalom community center.', timestamp: '2026-03-22 01:15 PM' }
      ]
    }
  ]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'All' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          req.caseNumber.toLowerCase().includes(q) ||
          req.title.toLowerCase().includes(q) ||
          req.category.toLowerCase().includes(q) ||
          req.assignedOfficer.toLowerCase().includes(q) ||
          req.subService.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // Handle Wizard Submit
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubService || !requestTitle.trim()) {
      showToast('Please complete all required fields');
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newCaseNumber = `SR-2026-${randomNum}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      caseNumber: newCaseNumber,
      category: selectedCategory.title,
      subService: selectedSubService,
      title: requestTitle,
      description: requestDesc || `Formal request submitted for ${selectedSubService} under ${selectedCategory.title}.`,
      status: 'Submitted',
      priority: requestPriority,
      assignedOffice: selectedOffice,
      assignedOfficer: 'Assigned to Regional Intake Officer',
      createdAt: todayStr,
      updatedAt: todayStr,
      estimatedCompletion: 'Estimated 3-5 Business Days',
      linkedDocuments: [...attachedDocs],
      notes: [
        {
          id: `n-${Date.now()}`,
          sender: 'System Node',
          role: 'System',
          text: `Official case ${newCaseNumber} logged into immutable government registry. Linked ${attachedDocs.length} vault certificates.`,
          timestamp: `${todayStr} 10:00 AM`
        }
      ]
    };

    setRequests([newRequest, ...requests]);
    setIsWizardOpen(false);
    setWizardStep(1);
    setSelectedCategory(null);
    setSelectedSubService('');
    setRequestTitle('');
    setRequestDesc('');
    setAttachedDocs([]);
    setActiveTab('my_requests');
    setSelectedRequest(newRequest);
    showToast(`Your request (${newCaseNumber}) has been safely recorded. Thank you for staying connected with our community.`);
  };

  // Add message inside request
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedRequest) return;

    const newNote = {
      id: `n-${Date.now()}`,
      sender: profile?.full_name || 'Citizen',
      role: 'Citizen' as const,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: req.status === 'Additional Info Requested' ? ('Under Review' as const) : req.status,
          updatedAt: new Date().toISOString().split('T')[0],
          notes: [...req.notes, newNote]
        };
      }
      return req;
    });

    setRequests(updated);
    setSelectedRequest(updated.find(r => r.id === selectedRequest.id) || null);
    setReplyText('');
    showToast('Your response has been transmitted to the assigned officer.');
  };

  // Admin Actions simulation
  const handleAdminStatusChange = (reqId: string, newStatus: ServiceRequest['status']) => {
    const updated = requests.map(req => {
      if (req.id === reqId) {
        return {
          ...req,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0],
          notes: [
            ...req.notes,
            {
              id: `n-admin-${Date.now()}`,
              sender: `${adminRole} Audit`,
              role: 'Officer' as const,
              text: `Case status formally updated to: [${newStatus}].`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return req;
    });
    setRequests(updated);
    if (selectedRequest?.id === reqId) {
      setSelectedRequest(updated.find(r => r.id === reqId) || null);
    }
    showToast(`Updated case status to ${newStatus}`);
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
          1. HOME HERO BANNER ("Apple Support + Government Portal")
          ==================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#19233C] to-[#111A2E] p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-inner">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL COMMUNITY CASE MANAGEMENT SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🏛 Community Service Center</span>
            </h1>
            <p className="text-base font-bold text-amber-400/90">
              Request official assistance from your Regional Council, Synagogue, or Global Administration.
            </p>
            <p className="text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Every citizen request is securely processed with a unique government case tracker (SR-2026-XXXXX), directly connected with your Digital ID and Document Vault without duplicate uploads or bureaucracy.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-xl hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request New Service</span>
            </button>
            <button
              onClick={() => setActiveTab('my_requests')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Track My Cases ({requests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length})</span>
            </button>
          </div>
        </div>

        {/* METRICS & TRANSPARENCY DASHBOARD BAR */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5">
            <p className="text-slate-400 font-light">Active Open Cases</p>
            <p className="text-lg font-black text-white mt-0.5">{requests.filter(r => r.status !== 'Completed').length} Cases</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5">
            <p className="text-slate-400 font-light">Pending Council Review</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">{requests.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length} Cases</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5">
            <p className="text-slate-400 font-light">Approved / Resolved</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{requests.filter(r => r.status === 'Approved' || r.status === 'Completed').length} Total</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5">
            <p className="text-slate-400 font-light">Avg. Response Time</p>
            <p className="text-lg font-black text-blue-400 mt-0.5">1.8 Business Days</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5">
            <p className="text-slate-400 font-light">Citizen Satisfaction</p>
            <p className="text-lg font-black text-purple-400 mt-0.5">98.4% ★★★★★</p>
          </div>
        </div>
      </section>

      {/* Phase 8: Help Everywhere ("What is this?") */}
      <div className="p-5 rounded-3 border border-amber-500/30 rounded-3xl bg-slate-900/80 text-white space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>What is the Community Service Center?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Community Service Center connects your household directly with Regional Council assistance, Synagogue Gabbaim, and welfare coordinators. You can formally apply for newborn registration, holiday food assistance, Passover Matzah allocations, Aliyah document review, or general Rabbinical inquiries all from one place.
        </p>
      </div>

      {/* ====================================================
          2. PORTAL NAVIGATION TABS
          ==================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Service Catalog ({serviceCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_requests')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'my_requests'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Case Tracker ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_queue')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'admin_queue'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Council Review Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>Service Statistics</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Regional Node: Mizoram/Manipur Central</span>
        </div>
      </div>

      {/* ====================================================
          TAB 1: SERVICE CATALOG ("Apple Support" Large Cards)
          ==================================================== */}
      {activeTab === 'catalog' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Select a Government or Communal Service</h2>
              <p className="text-xs text-slate-400 font-light">Choose the relevant department to open a tracked inquiry or certificate application.</p>
            </div>
            <button
              onClick={() => onNavigate('document_center')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-2 transition-all"
            >
              <FolderLock className="w-4 h-4" />
              <span>View My Vault First</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceCategories.map((cat) => (
              <div
                key={cat.id}
                className="group rounded-3xl bg-gradient-to-br from-slate-900 via-[#131C30] to-slate-950 p-6 border border-white/10 hover:border-amber-500/50 shadow-xl transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Background icon watermark */}
                <div className="absolute -right-4 -top-4 text-7xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                      {cat.subServices.length} Options
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mt-4 group-hover:text-amber-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-light mt-1.5 leading-relaxed min-h-[36px]">
                    {cat.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Common Requests:</p>
                    {cat.subServices.slice(0, 3).map((sub, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-light truncate">
                        <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{sub}</span>
                      </div>
                    ))}
                    {cat.subServices.length > 3 && (
                      <p className="text-[10px] text-amber-400 font-medium pl-5">+ {cat.subServices.length - 3} more services...</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubService(cat.subServices[0]);
                      setRequestTitle(`${cat.subServices[0]} Application`);
                      setIsWizardOpen(true);
                      setWizardStep(1);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 font-black text-xs transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <span>Start Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
          TAB 2: MY CASE TRACKER
          ==================================================== */}
      {activeTab === 'my_requests' && (
        <section className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases by Case Number (SR-2026-XXXXX), Title, Officer, or Category..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-white/10 focus:border-amber-500 text-sm text-white placeholder:text-slate-500 transition-all outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              {['All', 'Submitted', 'Under Review', 'Additional Info Requested', 'Approved', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">No Cases Matched</h3>
              <p className="text-xs text-slate-400 font-light">No cases found matching your criteria. Start a new application to submit an official inquiry.</p>
              <button
                onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg"
              >
                Request New Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131E34] to-slate-900 p-6 border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs tracking-wider">
                        {req.caseNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-200 text-xs font-medium">
                        {req.category}
                      </span>
                      {req.priority === 'Urgent' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase animate-pulse">
                          Urgent Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'Completed' || req.status === 'Approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{req.status}</span>
                        </span>
                      ) : req.status === 'Additional Info Requested' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold animate-bounce">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Action Required by Citizen</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>{req.status}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white hover:text-amber-300 transition-colors">
                      {req.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-light mt-1 line-clamp-2">
                      {req.description}
                    </p>
                  </div>

                  {/* PROGRESS BAR TIMELINE MINI */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Submitted</span>
                      <span>Under Review</span>
                      <span>Council Action</span>
                      <span>Approved / Completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div className="h-full bg-emerald-400 w-1/4" />
                      <div className={`h-full ${req.status !== 'Submitted' ? 'bg-emerald-400' : 'bg-slate-800'} w-1/4 transition-all`} />
                      <div className={`h-full ${req.status === 'Approved' || req.status === 'Completed' || req.status === 'Additional Info Requested' ? 'bg-amber-400' : 'bg-slate-800'} w-1/4 transition-all`} />
                      <div className={`h-full ${req.status === 'Completed' || req.status === 'Approved' ? 'bg-emerald-400' : 'bg-slate-800'} w-1/4 transition-all`} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>Assigned: <strong className="text-slate-200">{req.assignedOfficer}</strong></span>
                      <span>• Office: <strong className="text-slate-200">{req.assignedOffice}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Updated: {req.updatedAt}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <span>Open Details & Messages ({req.notes.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ====================================================
          TAB 3: COUNCIL REVIEW QUEUE (Admin Workflow)
          ==================================================== */}
      {activeTab === 'admin_queue' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>GOVERNANCE COUNCIL WORKFLOW</span>
              </span>
              <h2 className="text-xl font-black text-white">Council Case Review & Allocation Queue</h2>
              <p className="text-xs text-slate-300 font-light mt-1">Review active citizen dossiers, assign regional coordinators, request vault documents, or execute formal approvals.</p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-white/10">
              <button
                onClick={() => setAdminRole('Regional Officer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminRole === 'Regional Officer' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Regional Officer Mode
              </button>
              <button
                onClick={() => setAdminRole('Global Admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminRole === 'Global Admin' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Global Admin Console
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-xl divide-y divide-white/10">
            {requests.map((req) => (
              <div key={req.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-400">{req.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-slate-300">{req.category}</span>
                    <span className="text-xs text-slate-400">• Sub-type: <strong className="text-slate-200">{req.subService}</strong></span>
                  </div>
                  <h3 className="text-sm font-black text-white">{req.title}</h3>
                  <p className="text-xs text-slate-300 font-light line-clamp-1">{req.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Officer: <strong className="text-amber-300">{req.assignedOfficer}</strong></span>
                    <span>Linked Vault Records: <strong className="text-emerald-400">{req.linkedDocuments.length} Verified Docs</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold mr-2 ${
                    req.status === 'Completed' || req.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {req.status}
                  </span>

                  <button
                    onClick={() => handleAdminStatusChange(req.id, 'Under Review')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-slate-200 transition-all"
                  >
                    Set Reviewing
                  </button>
                  <button
                    onClick={() => handleAdminStatusChange(req.id, 'Additional Info Requested')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold text-rose-300 transition-all"
                  >
                    Request Docs
                  </button>
                  <button
                    onClick={() => handleAdminStatusChange(req.id, 'Approved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 transition-all"
                  >
                    Approve Case
                  </button>
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-black transition-all"
                    title="Open Case Dossier"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
          TAB 4: SERVICE STATISTICS DASHBOARD
          ==================================================== */}
      {activeTab === 'analytics' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Case Resolution</p>
              <h3 className="text-4xl font-black text-amber-400">1.8 Days</h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>34% faster than municipal average</span>
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Satisfaction Rating</p>
              <h3 className="text-4xl font-black text-emerald-400">98.4%</h3>
              <p className="text-xs text-slate-300">Based on 1,420 completed service surveys</p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vault Linked Documents</p>
              <h3 className="text-4xl font-black text-blue-400">100%</h3>
              <p className="text-xs text-slate-300">Zero duplicate paper uploads required</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-base font-black text-white">Department Volume & Allocation Breakdown</h3>
            <div className="space-y-3">
              {[
                { dept: 'Certificates & Rabbinical Letters', volume: '38%', count: 412, color: 'bg-amber-400' },
                { dept: 'Document & Passport Verification', volume: '24%', count: 265, color: 'bg-blue-400' },
                { dept: 'Household Census Updates', volume: '18%', count: 198, color: 'bg-emerald-400' },
                { dept: 'Aliyah Dossier Preparation', volume: '12%', count: 134, color: 'bg-purple-400' },
                { dept: 'Welfare & Tzedakah Assistance', volume: '8%', count: 88, color: 'bg-rose-400' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-200">{item.dept}</span>
                    <span className="text-slate-400">{item.count} Cases ({item.volume})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.volume }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================
          MODAL 1: GUIDED WIZARD ("Apple Support Style")
          ==================================================== */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setIsWizardOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Wizard Steps Header */}
            <div className="space-y-2 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-widest">
                <span>Step {wizardStep} of 5</span>
                <span>Government Service Wizard</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {wizardStep === 1 && 'Step 1: Choose Service Category'}
                {wizardStep === 2 && 'Step 2: Describe Your Request'}
                {wizardStep === 3 && 'Step 3: Attach Vault Documents'}
                {wizardStep === 4 && 'Step 4: Review Case Application'}
                {wizardStep === 5 && 'Step 5: Submission Confirmed'}
              </h2>
              <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden flex mt-2">
                <div className="bg-amber-400 h-full transition-all" style={{ width: `${(wizardStep / 5) * 100}%` }} />
              </div>
            </div>

            <form onSubmit={handleWizardSubmit} className="space-y-6">
              {/* STEP 1: CHOOSE SERVICE */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 font-light">Select the general service category followed by the exact sub-service required:</p>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {serviceCategories.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedSubService(cat.subServices[0]);
                          setRequestTitle(`${cat.subServices[0]} Request`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedCategory?.id === cat.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                            : 'bg-slate-950/80 border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <h4 className="text-xs font-black mt-2 text-white">{cat.title}</h4>
                      </button>
                    ))}
                  </div>

                  {selectedCategory && (
                    <div className="space-y-2 pt-3 border-t border-white/10 animate-fade-in">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Select Specific Sub-Service ({selectedCategory.title}):
                      </label>
                      <select
                        value={selectedSubService}
                        onChange={(e) => {
                          setSelectedSubService(e.target.value);
                          setRequestTitle(`${e.target.value} Request`);
                        }}
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-amber-500/40 text-sm font-bold text-white outline-none"
                      >
                        {selectedCategory.subServices.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!selectedCategory}
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs transition-all flex items-center gap-2"
                    >
                      <span>Next: Describe Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DESCRIBE REQUEST */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Inquiry Title</label>
                    <input
                      type="text"
                      required
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      placeholder="e.g., Aliyah Supporting Letter for Ministry Dossier"
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-white/10 focus:border-amber-500 text-sm text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detailed Explanation</label>
                    <textarea
                      rows={4}
                      value={requestDesc}
                      onChange={(e) => setRequestDesc(e.target.value)}
                      placeholder="Explain the background of your application, specific deadlines, or family members to include..."
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-white/10 focus:border-amber-500 text-sm text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Urgency Priority</label>
                      <select
                        value={requestPriority}
                        onChange={(e) => setRequestPriority(e.target.value as any)}
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs font-bold text-white outline-none"
                      >
                        <option value="Standard">Standard Processing (3-5 Days)</option>
                        <option value="High">High Priority (Time Sensitive)</option>
                        <option value="Urgent">Urgent Aliyah / Medical Emergency</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Assigned Office</label>
                      <select
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs font-bold text-white outline-none"
                      >
                        <option value="Bnei Menashe Regional Council (Mizoram/Manipur)">Regional Council (Mizoram/Manipur)</option>
                        <option value="Beit Shalom Synagogue Committee">Beit Shalom Synagogue Committee</option>
                        <option value="Shavei Israel & Aliyah Committee">Shavei Israel & Aliyah Committee</option>
                        <option value="Demographics & Lineage Council">Demographics & Lineage Council</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2"
                    >
                      <span>Next: Attach Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ATTACH DOCUMENTS FROM VAULT */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <FolderLock className="w-6 h-6 text-amber-400 shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-300">Direct Document Vault Linking</p>
                      <p className="text-slate-300 font-light">Link existing verified biometric certificates directly from your Digital Document Center. Zero duplicate file uploads needed.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Select Verified Vault Records to Attach:
                    </label>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {availableVaultDocs.map((doc, idx) => {
                        const isAttached = attachedDocs.some(d => d.docNumber === doc.docNumber);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isAttached) {
                                setAttachedDocs(attachedDocs.filter(d => d.docNumber !== doc.docNumber));
                              } else {
                                setAttachedDocs([...attachedDocs, doc]);
                              }
                            }}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isAttached
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-slate-950 border-white/10 text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className={`w-4 h-4 ${isAttached ? 'text-emerald-400' : 'text-slate-500'}`} />
                              <div>
                                <span className="font-mono text-amber-400 font-bold mr-2">{doc.docNumber}</span>
                                <span className="text-white font-medium">{doc.name}</span>
                              </div>
                            </div>
                            <span>{isAttached ? '✓ Linked' : '+ Link'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2"
                    >
                      <span>Next: Review Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">Service Department:</span>
                      <strong className="text-amber-400 font-bold">{selectedCategory?.title}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">Sub-Service Inquiry:</span>
                      <strong className="text-white font-bold">{selectedSubService}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">Priority Level:</span>
                      <strong className="text-rose-300 font-bold">{requestPriority}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">Target Office:</span>
                      <strong className="text-slate-200">{selectedOffice}</strong>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-slate-400 block">Description / Notes:</span>
                      <p className="text-slate-200 bg-slate-900 p-3 rounded-xl font-light italic">"{requestDesc}"</p>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">Attached Vault Records ({attachedDocs.length}):</span>
                      {attachedDocs.length === 0 ? (
                        <span className="text-slate-500 italic">No certificates attached.</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {attachedDocs.map((d, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                              ✓ {d.docNumber}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl flex items-center gap-2.5"
                    >
                      <Check className="w-5 h-5" />
                      <span>Submit Official Case</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: CASE DETAIL DOSSIER & TIMELINE CONVERSATION
          ==================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Case Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
                    {selectedRequest.caseNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-bold">
                    {selectedRequest.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{selectedRequest.title}</h2>
                <p className="text-xs text-slate-400 font-light mt-0.5">Sub-service: <strong className="text-amber-300">{selectedRequest.subService}</strong></p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedRequest.status}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Created: {selectedRequest.createdAt}</span>
              </div>
            </div>

            {/* FULL TIMELINE TRACKER */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Official Case Timeline Progression</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                {['Submitted', 'Assigned', 'Under Review', 'Additional Info Requested', 'Approved', 'Completed'].map((step, i) => {
                  const isCurrent = selectedRequest.status === step;
                  const isPassed = 
                    (selectedRequest.status === 'Completed') ||
                    (selectedRequest.status === 'Approved' && (i <= 4)) ||
                    (selectedRequest.status === 'Under Review' && (i <= 2)) ||
                    (selectedRequest.status === 'Assigned' && (i <= 1));

                  return (
                    <div key={i} className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-lg scale-105'
                        : isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                          : 'bg-white/5 text-slate-500 border-white/5'
                    }`}>
                      <div className="text-[10px] uppercase font-mono">{i + 1}.</div>
                      <div className="mt-0.5 leading-tight">{step}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-between items-center text-xs text-slate-300 pt-2 border-t border-white/10">
                <span>Assigned Office: <strong className="text-white">{selectedRequest.assignedOffice}</strong></span>
                <span>Assigned Officer: <strong className="text-amber-300">{selectedRequest.assignedOfficer}</strong></span>
                <span>Estimated Completion: <strong className="text-emerald-400">{selectedRequest.estimatedCompletion}</strong></span>
              </div>
            </div>

            {/* Linked Vault Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderLock className="w-4 h-4 text-amber-400" />
                <span>Linked Immutable Vault Documents ({selectedRequest.linkedDocuments.length})</span>
              </h3>
              {selectedRequest.linkedDocuments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No vault documents attached to this case.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRequest.linkedDocuments.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-mono font-bold text-amber-300 truncate">{doc.docNumber}</p>
                          <p className="text-slate-300 truncate">{doc.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRequest(null);
                          onNavigate('document_center');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold shrink-0"
                      >
                        Inspect Vault
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* OFFICER NOTES & CONVERSATION THREAD */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Official Audit Thread & Officer Correspondence</span>
              </h3>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                {selectedRequest.notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      note.role === 'Officer'
                        ? 'bg-purple-950/40 border-purple-500/40 ml-4'
                        : note.role === 'Citizen'
                          ? 'bg-amber-500/10 border-amber-500/30 mr-4'
                          : 'bg-slate-950 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-black ${
                        note.role === 'Officer' ? 'text-purple-300' : note.role === 'Citizen' ? 'text-amber-300' : 'text-slate-300'
                      }`}>
                        {note.sender} ({note.role})
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-light leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Citizen Reply Box */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Transmit official message or clarification to assigned officer..."
                  className="flex-1 p-3.5 rounded-2xl bg-slate-950 border border-white/10 focus:border-amber-500 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
