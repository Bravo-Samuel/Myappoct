import React, { useState, useMemo } from 'react';
import {
  Bell,
  Megaphone,
  Inbox,
  Radio,
  Sliders,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  Send,
  Pin,
  Bookmark,
  Eye,
  Plus,
  Trash2,
  Archive,
  Filter,
  Check,
  Share2,
  ExternalLink,
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  Mail,
  Smartphone,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useSupabaseAuth } from '../../providers/SupabaseAuthProvider';
import { NavSection } from '../../types';
import {
  CommunicationService,
  CommMessage,
  CommChannel,
  InboxCategory,
  CommMessageType,
  SmartDeliveryTarget,
  BroadcastAuthority,
  UserNotificationPreferences
} from '../../services/data/CommunicationService';
import { DigitalSignatureService } from '../../services/data/DigitalSignatureService';
import { PublicVerificationModal } from '../common/PublicVerificationModal';

interface CommunicationsCenterViewProps {
  onNavigate?: (section: NavSection) => void;
}

type CommTab = 'home' | 'inbox' | 'channels' | 'settings' | 'admin';

export const CommunicationsCenterView: React.FC<CommunicationsCenterViewProps> = ({ onNavigate }) => {
  const { profile, role } = useSupabaseAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<CommTab>('home');

  // Messages State
  const [messages, setMessages] = useState<CommMessage[]>(() => CommunicationService.getMessages());
  const [selectedMessage, setSelectedMessage] = useState<CommMessage | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSender, setFilterSender] = useState('All');
  const [filterCategory, setFilterCategory] = useState<InboxCategory>('All');
  const [filterChannel, setFilterChannel] = useState<string>('All');

  // Notification Preferences State
  const [prefs, setPrefs] = useState<UserNotificationPreferences>(() => CommunicationService.getPreferences());

  // Modal States
  const [activeVerifyCode, setActiveVerifyCode] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compose Broadcast State
  const [composeTitle, setComposeTitle] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeChannel, setComposeChannel] = useState<CommChannel>('Official Announcements');
  const [composeInboxCat, setComposeInboxCat] = useState<'Community' | 'Regional Council' | 'Synagogue' | 'Documents' | 'Services'>('Regional Council');
  const [composeMsgType, setComposeMsgType] = useState<CommMessageType>('Information');
  const [composeTarget, setComposeTarget] = useState<SmartDeliveryTarget>('Entire Community');
  const [composeTargetDetail, setComposeTargetDetail] = useState('All Districts');
  const [composeAuthority, setComposeAuthority] = useState<BroadcastAuthority>('Regional Council');
  const [composeIsPinned, setComposeIsPinned] = useState(false);
  const [composeIsImportant, setComposeIsImportant] = useState(false);
  const [composeSelectedDocNumber, setComposeSelectedDocNumber] = useState<string>('');
  const [composeHasCalendar, setComposeHasCalendar] = useState(false);
  const [composeCalTitle, setComposeCalTitle] = useState('');
  const [composeCalDate, setComposeCalDate] = useState('2026-07-15');
  const [composeCalTime, setComposeCalTime] = useState('18:00');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check RBAC status
  const canBroadcast = role === 'GLOBAL_ADMIN' || role === 'REGIONAL_GABBAI' || role === 'SYNAGOGUE_RABBI' || true; // Allowed in demo mode for full inspection

  // Available Official Channels
  const allChannels: { name: CommChannel; icon: React.ReactNode; desc: string; count: number }[] = [
    { name: 'Official Announcements', icon: <Megaphone className="w-4 h-4 text-amber-400" />, desc: 'Primary Bnei Menashe national and regional proclamations', count: messages.filter(m => m.channel === 'Official Announcements').length },
    { name: 'Regional Council', icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, desc: 'Churachandpur, Aizawl, Imphal governance and welfare directives', count: messages.filter(m => m.channel === 'Regional Council').length },
    { name: 'Synagogue Notices', icon: <Building2 className="w-4 h-4 text-emerald-400" />, desc: 'Beit Shalom and local congregation prayer quorums & schedules', count: messages.filter(m => m.channel === 'Synagogue Notices').length },
    { name: 'Holiday Greetings', icon: <Sparkles className="w-4 h-4 text-amber-300" />, desc: 'Rosh Hashanah, Yom Kippur, Sukkot & Shabbat blessings', count: messages.filter(m => m.channel === 'Holiday Greetings').length },
    { name: 'Emergency Alerts', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, desc: 'Critical infrastructure notices, weather alerts & security updates', count: messages.filter(m => m.channel === 'Emergency Alerts').length },
    { name: 'Community Bulletins', icon: <Bell className="w-4 h-4 text-blue-400" />, desc: 'General citizenship updates, welfare stipends & civic news', count: messages.filter(m => m.channel === 'Community Bulletins').length },
    { name: 'Youth Programs', icon: <Users className="w-4 h-4 text-cyan-400" />, desc: 'Torah quizzes, summer camps, and youth directorate notices', count: messages.filter(m => m.channel === 'Youth Programs').length },
    { name: 'Education Updates', icon: <FileText className="w-4 h-4 text-yellow-400" />, desc: 'Hebrew immersion classes, Ulpan registrations & day schools', count: messages.filter(m => m.channel === 'Education Updates').length },
    { name: 'Volunteer Opportunities', icon: <Users className="w-4 h-4 text-teal-400" />, desc: 'Emergency relief task forces, synagogue maintenance & chesed', count: messages.filter(m => m.channel === 'Volunteer Opportunities').length }
  ];

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    let list = messages;

    if (activeTab === 'inbox') {
      list = CommunicationService.getPersonalInbox(filterCategory);
    } else if (activeTab === 'channels' && filterChannel !== 'All') {
      list = list.filter(m => m.channel === filterChannel && m.status === 'Published');
    } else {
      list = list.filter(m => m.status === 'Published');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        m.channel.toLowerCase().includes(q)
      );
    }

    if (filterSender !== 'All') {
      list = list.filter(m => m.authority === filterSender);
    }

    // Sort pinned first, then by date
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [messages, activeTab, filterCategory, filterChannel, searchQuery, filterSender]);

  const handleSelectMessage = (msg: CommMessage) => {
    setSelectedMessage(msg);
    if (msg.receiptStatus === 'Delivered' || msg.receiptStatus === 'Unread') {
      const updated = CommunicationService.updateReceiptStatus(msg.id, 'Read');
      setMessages(updated);
    }
  };

  const handleAcknowledge = (msg: CommMessage) => {
    const updated = CommunicationService.updateReceiptStatus(msg.id, 'Acknowledged');
    setMessages(updated);
    setSelectedMessage({ ...msg, receiptStatus: 'Acknowledged' });
    showToast('Receipt formally acknowledged and recorded in Community Audit Trail.');
  };

  const handleSavePreferences = (newPrefs: UserNotificationPreferences) => {
    setPrefs(newPrefs);
    CommunicationService.savePreferences(newPrefs);
    showToast('Notification and delivery preferences updated securely.');
  };

  const getMessageTypeBadge = (type: CommMessageType) => {
    switch (type) {
      case 'Emergency': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Action Required': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Approval Notice': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Document Ready': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Reminder': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Invitation': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-5 py-3.5 rounded-2xl shadow-2xl font-black text-sm flex items-center gap-2.5 border border-amber-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO BANNER - HOME DISPLAY EXACTLY MATCHING MISSION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E1B38] to-slate-950 p-6 sm:p-8 border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Official Bnei Menashe Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>📢 Community Communications</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Stay connected with official announcements, messages, and community updates.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Not Social Media
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Not WhatsApp
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Government & Rabbinic Grade
              </span>
              <span className="text-slate-500 font-mono">| Signed via Regional Nodes</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {canBroadcast && (
              <button
                onClick={() => setShowComposeModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create Official Broadcast</span>
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('document_center')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Document Center</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setActiveTab('home'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'home'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Official Broadcasts</span>
          </button>
          <button
            onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all relative ${
              activeTab === 'inbox'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Personal Inbox</span>
            {messages.filter(m => m.receiptStatus === 'Delivered' || m.receiptStatus === 'Unread').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                {messages.filter(m => m.receiptStatus === 'Delivered' || m.receiptStatus === 'Unread').length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('channels'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'channels'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>9 Communication Channels</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Settings</span>
          </button>
          {canBroadcast && (
            <button
              onClick={() => { setActiveTab('admin'); setSelectedMessage(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin Tools & Analytics</span>
            </button>
          )}
        </div>

        {/* Search & Authority Filter Bar */}
        {(activeTab === 'home' || activeTab === 'inbox' || activeTab === 'channels') && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-bold focus:outline-none"
            >
              <option value="All">All Senders</option>
              <option value="Regional Council">Regional Council</option>
              <option value="Global Admin">Global Admin</option>
              <option value="Synagogue Leadership">Synagogue Leadership</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB SUB-NAV: PERSONAL INBOX CATEGORIES */}
      {activeTab === 'inbox' && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {(['All', 'Unread', 'Important', 'Community', 'Regional Council', 'Synagogue', 'Documents', 'Services'] as InboxCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterCategory === cat
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-900/40 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* TAB SUB-NAV: 9 COMMUNICATION CHANNELS */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => setFilterChannel('All')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              filterChannel === 'All'
                ? 'bg-slate-800/90 border-amber-500 text-white shadow-lg'
                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/40 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs mb-1">
              <span>All Channels Overview</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{messages.filter(m => m.status === 'Published').length}</span>
            </div>
            <p className="text-[11px] text-slate-400">View all national, regional, and synagogue broadcasts combined.</p>
          </div>
          {allChannels.map(ch => (
            <div
              key={ch.name}
              onClick={() => setFilterChannel(ch.name)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                filterChannel === ch.name
                  ? 'bg-slate-800/90 border-amber-500 text-white shadow-lg'
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  {ch.icon}
                  <span>{ch.name}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{ch.count}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{ch.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* MAIN VIEW AREA: MESSAGE LIST & INSPECTOR */}
      {(activeTab === 'home' || activeTab === 'inbox' || activeTab === 'channels') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages Column */}
          <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Messages Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  There are currently no broadcasts matching your category or search filter.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.receiptStatus === 'Delivered' || msg.receiptStatus === 'Unread';

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500 shadow-xl scale-[1.01]'
                        : isUnread
                        ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500/60 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.isPinned && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black flex items-center gap-1 border border-amber-500/30">
                            <Pin className="w-3 h-3" />
                            PINNED
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getMessageTypeBadge(msg.messageType)}`}>
                          {msg.messageType}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                          {msg.channel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">{msg.createdAt}</span>
                    </div>

                    <h3 className={`text-base font-black tracking-tight mb-1.5 ${isUnread ? 'text-white' : 'text-slate-200'}`}>
                      {msg.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {msg.body}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="font-bold text-slate-300">{msg.senderName}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-[11px]">{msg.senderRole}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {msg.attachments && msg.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{msg.attachments.length} Doc</span>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          msg.receiptStatus === 'Acknowledged'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : msg.receiptStatus === 'Read'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {msg.receiptStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Message Inspector */}
          {selectedMessage && (
            <div className="lg:col-span-6 sticky top-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-fade-in">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getMessageTypeBadge(selectedMessage.messageType)}`}>
                      {selectedMessage.messageType}
                    </span>
                    <span className="text-xs font-bold text-amber-400">{selectedMessage.channel}</span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight">{selectedMessage.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Sender & Smart Delivery Header */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-extrabold text-white">{selectedMessage.senderName}</div>
                  <div className="text-[11px] text-slate-400">{selectedMessage.senderRole} ({selectedMessage.authority})</div>
                </div>
                <div className="text-right sm:text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Target Audience</div>
                  <div className="font-bold text-amber-300">{selectedMessage.target}</div>
                  {selectedMessage.targetDetail && (
                    <div className="text-[10px] text-slate-400">{selectedMessage.targetDetail}</div>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap py-2">
                {selectedMessage.body}
              </div>

              {/* Linked Digital Document Center Attachments */}
              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Linked Official Documents ({selectedMessage.attachments.length})</span>
                  </div>
                  {selectedMessage.attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setActiveVerifyCode(att.docNumber)}
                      className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{att.title}</div>
                          <div className="text-[10px] font-mono text-slate-400">Doc ID: {att.docNumber}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <span>Verify Seal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Calendar Integration Action */}
              {selectedMessage.calendarEventLink && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedMessage.calendarEventLink.eventTitle}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {selectedMessage.calendarEventLink.eventDate} at {selectedMessage.calendarEventLink.eventTime}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`Event "${selectedMessage.calendarEventLink?.eventTitle}" synced directly to your Community Calendar.`);
                      if (onNavigate) onNavigate('calendar');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shrink-0 shadow-lg"
                  >
                    Add to Calendar
                  </button>
                </div>
              )}

              {/* Read Receipt & Acknowledgement Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Status: <strong className="text-white">{selectedMessage.receiptStatus}</strong>
                </div>
                {selectedMessage.receiptStatus !== 'Acknowledged' && (
                  <button
                    onClick={() => handleAcknowledge(selectedMessage)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Send Official Read Receipt</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NOTIFICATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">Notification & Delivery Channels</h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize how you receive official proclamations, synagogue schedules, and welfare notices.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-800/80">
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Email Notifications</div>
                    <div className="text-xs text-slate-400">Daily summaries and emergency bulletins sent to {profile?.email || 'your registered email'}.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.email}
                  onChange={(e) => handleSavePreferences({ ...prefs, email: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Push Notifications</div>
                    <div className="text-xs text-slate-400">Instant device alerts for urgent synagogue notices and High Holy Day updates.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.push}
                  onChange={(e) => handleSavePreferences({ ...prefs, push: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">SMS Broadcasts (Future Phase)</div>
                    <div className="text-xs text-slate-400">Offline cellular text messages for remote villages in Manipur and Mizoram without internet.</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-extrabold text-slate-400">COMING SOON</span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">In-App Only Delivery</div>
                    <div className="text-xs text-slate-400">Silence external alerts and only show badges when logged inside the Community Portal.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.inAppOnly}
                  onChange={(e) => handleSavePreferences({ ...prefs, inAppOnly: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Shabbat & Quiet Hours Protection</div>
                      <div className="text-xs text-slate-400">Suppress non-emergency notifications during nighttime and halachic rest periods.</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.quietHoursEnabled}
                    onChange={(e) => handleSavePreferences({ ...prefs, quietHoursEnabled: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {prefs.quietHoursEnabled && (
                  <div className="flex items-center gap-4 pl-12 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Start:</span>
                      <input
                        type="time"
                        value={prefs.quietHoursStart}
                        onChange={(e) => handleSavePreferences({ ...prefs, quietHoursStart: e.target.value })}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">End:</span>
                      <input
                        type="time"
                        value={prefs.quietHoursEnd}
                        onChange={(e) => handleSavePreferences({ ...prefs, quietHoursEnd: e.target.value })}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN TOOLS & ANALYTICS */}
      {activeTab === 'admin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Total Broadcasts</div>
              <div className="text-2xl font-black text-white mt-1">{messages.length} Proclamations</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">100% Cryptographically Indexed</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Delivered Messages</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {messages.reduce((acc, m) => acc + m.analytics.totalDelivered, 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across 4 Regional Districts</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Read Rate</div>
              <div className="text-2xl font-black text-blue-400 mt-1">
                {Math.round((messages.reduce((acc, m) => acc + m.analytics.readCount, 0) / Math.max(1, messages.reduce((acc, m) => acc + m.analytics.totalDelivered, 0))) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Confirmed Open Views</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Acknowledgement Rate</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {Math.round((messages.reduce((acc, m) => acc + m.analytics.ackCount, 0) / Math.max(1, messages.reduce((acc, m) => acc + m.analytics.totalDelivered, 0))) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Formal Digital Signatures</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Most Active Region</div>
              <div className="text-2xl font-black text-purple-400 mt-1">Churachandpur</div>
              <div className="text-[10px] text-slate-400 mt-0.5">52% Total Reach Share</div>
            </div>
          </div>

          {/* Broadcast Management Table */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Broadcast Management & Lifecycle</h3>
                <p className="text-xs text-slate-400">Draft, schedule, withdraw, pin, or archive official proclamations.</p>
              </div>
              <button
                onClick={() => setShowComposeModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Proclamation</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="p-3.5">Title & Channel</th>
                    <th className="p-3.5">Target Audience</th>
                    <th className="p-3.5">Delivery Stats</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Lifecycle Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {messages.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          {m.isPinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                          <span>{m.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{m.channel} • {m.authority}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-300">
                        {m.target}
                        {m.targetDetail && <div className="text-[10px] font-normal text-slate-500">{m.targetDetail}</div>}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        <div>Delivered: {m.analytics.totalDelivered}</div>
                        <div className="text-[10px] text-emerald-400">Ack: {m.analytics.ackCount}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          m.status === 'Published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : m.status === 'Withdrawn'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const updated = CommunicationService.updateMessageStatus(m.id, m.status, !m.isPinned);
                            setMessages(updated);
                            showToast(m.isPinned ? 'Proclamation unpinned.' : 'Proclamation pinned to top of communications feed.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
                        >
                          {m.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        {m.status === 'Published' && (
                          <button
                            onClick={() => {
                              const updated = CommunicationService.updateMessageStatus(m.id, 'Withdrawn');
                              setMessages(updated);
                              showToast('Proclamation withdrawn from public broadcast feed.');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold"
                          >
                            Withdraw
                          </button>
                        )}
                        {m.status === 'Withdrawn' && (
                          <button
                            onClick={() => {
                              const updated = CommunicationService.updateMessageStatus(m.id, 'Published');
                              setMessages(updated);
                              showToast('Proclamation republished to national feed.');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold"
                          >
                            Republish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE BROADCAST MODAL */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Create Official Proclamation</h3>
                  <p className="text-[11px] text-slate-400">Broadcast to Bnei Menashe citizens, shuls, and regional councils</p>
                </div>
              </div>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!composeTitle.trim() || !composeBody.trim()) return;
                const created = CommunicationService.createBroadcast({
                  title: composeTitle,
                  body: composeBody,
                  senderName: profile?.full_name || 'Regional Officer',
                  senderRole: role || 'Council Secretary',
                  authority: composeAuthority,
                  channel: composeChannel,
                  inboxCategory: composeInboxCat,
                  messageType: composeMsgType,
                  target: composeTarget,
                  targetDetail: composeTargetDetail,
                  status: 'Published',
                  isPinned: composeIsPinned,
                  isImportant: composeIsImportant,
                  attachmentDocNumbers: composeSelectedDocNumber ? [composeSelectedDocNumber] : undefined,
                  calendarEventLink: composeHasCalendar ? {
                    eventTitle: composeCalTitle || composeTitle,
                    eventDate: composeCalDate,
                    eventTime: composeCalTime,
                    location: 'Beit Shalom Community Center'
                  } : undefined
                });
                setMessages(CommunicationService.getMessages());
                setShowComposeModal(false);
                setComposeTitle('');
                setComposeBody('');
                showToast(`Official Proclamation "${created.title}" successfully published to target audience.`);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Issuing Authority</label>
                  <select
                    value={composeAuthority}
                    onChange={(e) => setComposeAuthority(e.target.value as BroadcastAuthority)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Regional Council">Regional Council</option>
                    <option value="Global Admin">Global Admin</option>
                    <option value="Synagogue Leadership">Synagogue Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Channel Category</label>
                  <select
                    value={composeChannel}
                    onChange={(e) => setComposeChannel(e.target.value as CommChannel)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    {allChannels.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Message Type</label>
                  <select
                    value={composeMsgType}
                    onChange={(e) => setComposeMsgType(e.target.value as CommMessageType)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Information">Information</option>
                    <option value="Action Required">Action Required</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Invitation">Invitation</option>
                    <option value="Approval Notice">Approval Notice</option>
                    <option value="Document Ready">Document Ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Smart Delivery Target</label>
                  <select
                    value={composeTarget}
                    onChange={(e) => setComposeTarget(e.target.value as SmartDeliveryTarget)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Entire Community">Entire Community</option>
                    <option value="One Regional Council">One Regional Council</option>
                    <option value="Specific Synagogue">Specific Synagogue</option>
                    <option value="Household">Specific Household</option>
                    <option value="Volunteer Group">Volunteer Group</option>
                    <option value="Youth Group">Youth Group</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Target Specification / Details</label>
                  <input
                    type="text"
                    value={composeTargetDetail}
                    onChange={(e) => setComposeTargetDetail(e.target.value)}
                    placeholder="e.g. Churachandpur District or Beit Shalom Shul"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Proclamation Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter official heading..."
                  value={composeTitle}
                  onChange={(e) => setComposeTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Proclamation Directive / Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed official instructions..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white leading-relaxed"
                />
              </div>

              {/* Attach existing document without duplicating */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Link Official Document (No Duplication)</label>
                <select
                  value={composeSelectedDocNumber}
                  onChange={(e) => setComposeSelectedDocNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">-- No Attached Document --</option>
                  {DigitalSignatureService.getAllCertifiedDocuments().map(d => (
                    <option key={d.documentNumber} value={d.documentNumber}>
                      {d.documentName} ({d.documentNumber}) - {d.recipientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Calendar Integration */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Create Community Calendar Event</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={composeHasCalendar}
                    onChange={(e) => setComposeHasCalendar(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                {composeHasCalendar && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={composeCalTitle}
                      onChange={(e) => setComposeCalTitle(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                    <input
                      type="date"
                      value={composeCalDate}
                      onChange={(e) => setComposeCalDate(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                    <input
                      type="time"
                      value={composeCalTime}
                      onChange={(e) => setComposeCalTime(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={composeIsPinned}
                    onChange={(e) => setComposeIsPinned(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Pin to Top of Feed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={composeIsImportant}
                    onChange={(e) => setComposeIsImportant(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Mark High Importance</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg"
                >
                  Publish Official Proclamation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC VERIFICATION MODAL FOR LINKED DOCUMENTS */}
      {activeVerifyCode && (
        <PublicVerificationModal
          initialCode={activeVerifyCode}
          onClose={() => setActiveVerifyCode(null)}
        />
      )}
    </div>
  );
};
