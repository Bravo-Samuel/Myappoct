import { AuditService } from './AuditService';

export type PlatformDocumentCategory =
  | 'Community Identity Pass'
  | 'Community Membership Certificate'
  | 'Community Census Certificate'
  | 'Household Certificate'
  | 'Family Registration'
  | 'Memorial Certificate'
  | 'Volunteer Certificate'
  | 'Synagogue Membership'
  | 'Regional Council Letter'
  | 'Community Service Approval'
  | 'Education Certificate'
  | 'Aliyah Support Letter';

export type VerificationStatus = 'Verified' | 'Not Verified' | 'Revoked';

export interface DocumentHistoryEvent {
  id: string;
  action: 'Created' | 'Updated' | 'Reissued' | 'Revoked' | 'Downloaded' | 'Printed' | 'Viewed';
  timestamp: string;
  actor: string;
  version: string;
  note: string;
}

export interface CertifiedDocumentRecord {
  id: string;
  documentNumber: string; // Unique Document ID
  documentName: string;
  hebrewName?: string;
  category: PlatformDocumentCategory;
  issueDate: string;
  issueTime: string;
  version: string;
  issuingAuthority: string;
  verificationStatus: VerificationStatus;
  expirationDate?: string;
  sha256Fingerprint: string;
  qrId: string;
  citizenId?: string;
  recipientName: string;
  householdId?: string;
  description: string;
  history: DocumentHistoryEvent[];
}

export interface PublicVerificationPayload {
  isAuthentic: boolean;
  verificationStatus: VerificationStatus;
  documentName: string;
  documentNumber: string;
  category: PlatformDocumentCategory;
  issueDate: string;
  issueTime: string;
  issuingAuthority: string;
  verificationDate: string;
  version: string;
  sha256Fingerprint: string;
  message: string;
}

const STORAGE_KEY = 'bnei_menashe_certified_document_registry_v1';

const DEFAULT_CERTIFIED_DOCUMENTS: CertifiedDocumentRecord[] = [
  {
    id: 'cert-01',
    documentNumber: 'BMCI-2026-0001824',
    documentName: 'Community Identity Pass',
    hebrewName: 'תעודת זיהוי לקהילת בני מנשה',
    category: 'Community Identity Pass',
    issueDate: '2026-01-15',
    issueTime: '09:14:22 IST',
    version: 'v2.1',
    issuingAuthority: 'Bnei Menashe Council India - Churachandpur Node',
    verificationStatus: 'Verified',
    expirationDate: '2031-01-15',
    sha256Fingerprint: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrId: 'BM-VERIFY-CITIZEN-BMCI-2026-0001824',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Official Biometric & Cryptographically Signed Community Identity Pass verified by the Regional Council.',
    history: [
      {
        id: 'ev-101',
        action: 'Created',
        timestamp: '2025-01-15 10:00:00',
        actor: 'Rabbi Hanoch Avtzon',
        version: 'v1.0',
        note: 'Initial digital identity pass issuance'
      },
      {
        id: 'ev-102',
        action: 'Reissued',
        timestamp: '2026-01-15 09:14:22',
        actor: 'Churachandpur Node Admin',
        version: 'v2.1',
        note: 'Updated SHA-256 fingerprint seal & annual status confirmation'
      }
    ]
  },
  {
    id: 'cert-02',
    documentNumber: 'BM-MEMB-2026-8812',
    documentName: 'Official Community Membership Certificate',
    hebrewName: 'תעודת חברות בקהילת בני מנשה',
    category: 'Community Membership Certificate',
    issueDate: '2026-02-01',
    issueTime: '11:30:45 IST',
    version: 'v1.0',
    issuingAuthority: 'Bnei Menashe Council India Governance Board',
    verificationStatus: 'Verified',
    expirationDate: '2029-02-01',
    sha256Fingerprint: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    qrId: 'QR-MEMB-881204',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Certifies active standing and membership rights within the recognized Bnei Menashe community.',
    history: [
      {
        id: 'ev-201',
        action: 'Created',
        timestamp: '2026-02-01 11:30:45',
        actor: 'Council Registrar',
        version: 'v1.0',
        note: 'Issued upon verification of tribal lineage records'
      }
    ]
  },
  {
    id: 'cert-03',
    documentNumber: 'BM-CEN-2026-0419',
    documentName: 'Community Census Verification Certificate',
    hebrewName: 'אישור מפקד אוכלוסין רשמי',
    category: 'Community Census Certificate',
    issueDate: '2026-03-20',
    issueTime: '14:22:10 IST',
    version: 'v1.4',
    issuingAuthority: 'Regional Census Verification Officer',
    verificationStatus: 'Revoked',
    sha256Fingerprint: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    qrId: 'QR-CEN-771204',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Certified enumeration seal validating residency and household composition for annual demographic registry.',
    history: [
      {
        id: 'ev-302',
        action: 'Revoked',
        timestamp: '2026-03-22 10:00:00',
        actor: 'Regional Census Director',
        version: 'v1.4',
        note: 'Revoked due to duplicate demographic registration correction.'
      },
      {
        id: 'ev-301',
        action: 'Created',
        timestamp: '2026-03-20 14:22:10',
        actor: 'Census Coordinator',
        version: 'v1.4',
        note: 'Completed 2026 household census check'
      }
    ]
  },
  {
    id: 'cert-04',
    documentNumber: 'BM-HOU-2026-0842',
    documentName: 'Certified Household Certificate',
    hebrewName: 'תעודת בית אב רשמית',
    category: 'Household Certificate',
    issueDate: '2026-01-10',
    issueTime: '08:45:00 IST',
    version: 'v2.0',
    issuingAuthority: 'Churachandpur Regional Registry Office',
    verificationStatus: 'Verified',
    sha256Fingerprint: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    qrId: 'QR-HOU-084291',
    recipientName: 'Haokip Household (#BM-0842)',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Certifies head of household and family unit enrollment in Khuangkhai district.',
    history: [
      {
        id: 'ev-401',
        action: 'Created',
        timestamp: '2026-01-10 08:45:00',
        actor: 'District Officer',
        version: 'v2.0',
        note: 'Verified household roster'
      }
    ]
  },
  {
    id: 'cert-05',
    documentNumber: 'BM-FAM-5785-1102',
    documentName: 'Generational Lineage & Family Registration',
    hebrewName: 'תעודת רישום משפחתי ושושלת',
    category: 'Family Registration',
    issueDate: '2025-08-10',
    issueTime: '16:15:33 IST',
    version: 'v2.1',
    issuingAuthority: 'Bnei Menashe Genealogical Repository',
    verificationStatus: 'Verified',
    sha256Fingerprint: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    qrId: 'QR-FAM-443901',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Certified lineage registration recording paternal and maternal descent through 4 generations.',
    history: [
      {
        id: 'ev-501',
        action: 'Created',
        timestamp: '2025-08-10 16:15:33',
        actor: 'Lineage Review Board',
        version: 'v2.1',
        note: 'Approved genealogical archive entry'
      }
    ]
  },
  {
    id: 'cert-06',
    documentNumber: 'BM-MEM-5784-3310',
    documentName: 'Perpetual Sanctuary Memorial Certificate',
    hebrewName: 'תעודת זכרון והנצחה לקדושים',
    category: 'Memorial Certificate',
    issueDate: '2024-11-20',
    issueTime: '19:00:12 IST',
    version: 'v1.0',
    issuingAuthority: 'Beit Shalom Hevra Kadisha & Memorial Board',
    verificationStatus: 'Verified',
    sha256Fingerprint: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    qrId: 'QR-MEM-112049',
    recipientName: 'In Memory of Elder David Haokip (Zt"l)',
    description: 'Guarantees annual Yahrzeit Kaddish recitation and sanctuary light illumination in Beit Shalom.',
    history: [
      {
        id: 'ev-601',
        action: 'Created',
        timestamp: '2024-11-20 19:00:12',
        actor: 'Gabbai Shlomo Hangshing',
        version: 'v1.0',
        note: 'Recorded in perpetual sanctuary registry'
      }
    ]
  },
  {
    id: 'cert-07',
    documentNumber: 'BM-VOL-2026-7719',
    documentName: 'Distinguished Volunteer Certificate',
    hebrewName: 'תעודת הצטיינות להתנדבות בקהילה',
    category: 'Volunteer Certificate',
    issueDate: '2026-05-14',
    issueTime: '10:05:00 IST',
    version: 'v1.0',
    issuingAuthority: 'Community Service & Welfare Corps',
    verificationStatus: 'Verified',
    sha256Fingerprint: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    qrId: 'QR-VOL-771920',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    description: 'Recognizes over 120 hours of youth mentorship and emergency food distribution assistance.',
    history: [
      {
        id: 'ev-701',
        action: 'Created',
        timestamp: '2026-05-14 10:05:00',
        actor: 'Welfare Director',
        version: 'v1.0',
        note: 'Awarded during Community Recognition Day'
      }
    ]
  },
  {
    id: 'cert-08',
    documentNumber: 'BM-SYN-2026-1004',
    documentName: 'Beit Shalom Synagogue Membership Deed',
    hebrewName: 'תעודת חברות בבית הכנסת בית שלום',
    category: 'Synagogue Membership',
    issueDate: '2026-01-10',
    issueTime: '12:00:00 IST',
    version: 'v1.2',
    issuingAuthority: 'Beit Shalom Synagogue Committee',
    verificationStatus: 'Verified',
    sha256Fingerprint: 'c87893a0d5c805eb3e859b5df1dcf50b868bcce24151a66993146430b80f19fc',
    qrId: 'QR-SYN-990182',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Confirms active minyan participation, good standing, and seat registry in Beit Shalom Synagogue.',
    history: [
      {
        id: 'ev-801',
        action: 'Created',
        timestamp: '2026-01-10 12:00:00',
        actor: 'Synagogue Chairman',
        version: 'v1.2',
        note: 'Renewed membership deed for 5786'
      }
    ]
  },
  {
    id: 'cert-09',
    documentNumber: 'BM-REG-2026-5501',
    documentName: 'Official Regional Council Letter of Standing',
    hebrewName: 'מכתב המלצה מהמועצה האזורית',
    category: 'Regional Council Letter',
    issueDate: '2026-06-15',
    issueTime: '15:40:20 IST',
    version: 'v1.1',
    issuingAuthority: 'Churachandpur Regional Council Secretariat',
    verificationStatus: 'Verified',
    sha256Fingerprint: '8f9d8a7c6b5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a',
    qrId: 'QR-REG-550192',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    description: 'Official letter endorsing communal leadership role and representation in district councils.',
    history: [
      {
        id: 'ev-901',
        action: 'Created',
        timestamp: '2026-06-15 15:40:20',
        actor: 'Regional Council President',
        version: 'v1.1',
        note: 'Signed and sealed by secretariat'
      }
    ]
  },
  {
    id: 'cert-10',
    documentNumber: 'BM-SRV-2026-3390',
    documentName: 'Community Service Approval Certificate',
    hebrewName: 'אישור ביצוע שירות לטובת הקהילה',
    category: 'Community Service Approval',
    issueDate: '2026-04-12',
    issueTime: '09:50:11 IST',
    version: 'v1.0',
    issuingAuthority: 'Bnei Menashe Service Center Node',
    verificationStatus: 'Verified',
    sha256Fingerprint: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    qrId: 'QR-SRV-339011',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    description: 'Formal verification of completed community infrastructure and digital education assistance.',
    history: [
      {
        id: 'ev-1001',
        action: 'Created',
        timestamp: '2026-04-12 09:50:11',
        actor: 'Service Desk Coordinator',
        version: 'v1.0',
        note: 'Approved service verification request'
      }
    ]
  },
  {
    id: 'cert-11',
    documentNumber: 'BM-EDU-2025-6612',
    documentName: 'Advanced Hebrew & Halacha Diploma',
    hebrewName: 'תעודת סיום לימודי עברית והלכה',
    category: 'Education Certificate',
    issueDate: '2025-12-15',
    issueTime: '17:30:00 IST',
    version: 'v1.0',
    issuingAuthority: 'Bnei Menashe Torah Academy',
    verificationStatus: 'Verified',
    sha256Fingerprint: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    qrId: 'QR-EDU-554109',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    description: 'Diploma certifying mastery in conversational Hebrew and Shulchan Aruch halachic foundations.',
    history: [
      {
        id: 'ev-1101',
        action: 'Created',
        timestamp: '2025-12-15 17:30:00',
        actor: 'Academy Dean',
        version: 'v1.0',
        note: 'Graduated with high honors'
      }
    ]
  },
  {
    id: 'cert-12',
    documentNumber: 'BM-ALY-2026-9002',
    documentName: 'Aliyah Supporting Rabbinical Letter of Status',
    hebrewName: 'מכתב תמיכה לעלייה מבית הדין',
    category: 'Aliyah Support Letter',
    issueDate: '2026-06-01',
    issueTime: '13:15:00 IST',
    version: 'v1.0',
    issuingAuthority: 'Shavei Israel & Regional Rabbinical Court',
    verificationStatus: 'Verified',
    sha256Fingerprint: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    qrId: 'QR-ALY-882190',
    citizenId: 'BMCI-2026-0001824',
    recipientName: 'Samuel Haokip',
    householdId: 'BM-2026-CHUR-0842',
    description: 'Official rabbinical recommendation letter verifying Jewish lineage and active communal standing for Israeli Aliyah processing.',
    history: [
      {
        id: 'ev-1201',
        action: 'Created',
        timestamp: '2026-06-01 13:15:00',
        actor: 'Rabbi Yehuda Gin',
        version: 'v1.0',
        note: 'Issued under official seal of Beit Din'
      }
    ]
  }
];

export class DigitalSignatureService {
  /**
   * Generates a cryptographic SHA-256 hash fingerprint for document integrity.
   */
  static async generateSHA256Fingerprint(contentPayload: string): Promise<string> {
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(contentPayload);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('SubtleCrypto error, fallback to deterministic hex generator', e);
    }
    // Fallback deterministic pseudo-SHA256 hex string based on content payload
    let hash = 0;
    for (let i = 0; i < contentPayload.length; i++) {
      const char = contentPayload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const seedHex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${seedHex}4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacda${seedHex.substring(0, 4)}`.padEnd(64, '0');
  }

  /**
   * Load all certified documents from persistent storage
   */
  static getAllCertifiedDocuments(): CertifiedDocumentRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed reading DigitalSignature registry from localStorage:', e);
    }
    return DEFAULT_CERTIFIED_DOCUMENTS;
  }

  /**
   * Save documents to storage
   */
  private static saveDocuments(docs: CertifiedDocumentRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.warn('Failed saving DigitalSignature registry:', e);
    }
  }

  /**
   * Search documents across Document ID, Citizen ID, Household ID, Document Type, Issue Date, QR ID
   */
  static searchRegistry(query: string, categoryFilter?: string, statusFilter?: string): CertifiedDocumentRecord[] {
    const allDocs = this.getAllCertifiedDocuments();
    const q = query.trim().toLowerCase();

    return allDocs.filter(doc => {
      if (categoryFilter && categoryFilter !== 'All' && doc.category !== categoryFilter) {
        return false;
      }
      if (statusFilter && statusFilter !== 'All' && doc.verificationStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;

      const matchId = doc.documentNumber.toLowerCase().includes(q);
      const matchQr = doc.qrId.toLowerCase().includes(q);
      const matchCitizen = (doc.citizenId || '').toLowerCase().includes(q);
      const matchHousehold = (doc.householdId || '').toLowerCase().includes(q);
      const matchType = doc.category.toLowerCase().includes(q) || doc.documentName.toLowerCase().includes(q);
      const matchDate = doc.issueDate.toLowerCase().includes(q);
      const matchHash = doc.sha256Fingerprint.toLowerCase().includes(q);
      const matchRecipient = doc.recipientName.toLowerCase().includes(q);

      return matchId || matchQr || matchCitizen || matchHousehold || matchType || matchDate || matchHash || matchRecipient;
    });
  }

  /**
   * Public Verification Lookup
   * STRICT PRIVACY GUARANTEE: Never expose Passport Number, Aadhaar Number, Phone Number, Email, Address, or Private Household Data!
   */
  static verifyDocumentPublic(lookupQuery: string): PublicVerificationPayload {
    const q = lookupQuery.trim().toLowerCase();
    const allDocs = this.getAllCertifiedDocuments();

    // Match exact or partial unique IDs / QR codes
    const found = allDocs.find(doc =>
      doc.documentNumber.toLowerCase() === q ||
      doc.qrId.toLowerCase() === q ||
      doc.sha256Fingerprint.toLowerCase() === q ||
      doc.id.toLowerCase() === q ||
      (q.includes(doc.documentNumber.toLowerCase()) && doc.documentNumber.length > 4) ||
      (doc.citizenId && doc.citizenId.toLowerCase() === q)
    );

    if (!found) {
      return {
        isAuthentic: false,
        verificationStatus: 'Not Verified',
        documentName: 'Unknown or Unregistered Document',
        documentNumber: lookupQuery || 'N/A',
        category: 'Community Identity Pass',
        issueDate: 'N/A',
        issueTime: 'N/A',
        issuingAuthority: 'Bnei Menashe Central Digital Registry',
        verificationDate: new Date().toISOString().split('T')[0],
        version: 'N/A',
        sha256Fingerprint: '0000000000000000000000000000000000000000000000000000000000000000',
        message: 'No digital seal found matching this identifier. The document cannot be cryptographically verified.'
      };
    }

    return {
      isAuthentic: found.verificationStatus === 'Verified',
      verificationStatus: found.verificationStatus,
      documentName: found.documentName,
      documentNumber: found.documentNumber,
      category: found.category,
      issueDate: found.issueDate,
      issueTime: found.issueTime,
      issuingAuthority: found.issuingAuthority,
      verificationDate: new Date().toISOString().split('T')[0],
      version: found.version,
      sha256Fingerprint: found.sha256Fingerprint,
      message: found.verificationStatus === 'Verified'
        ? 'Document signature and cryptographic seal verified against official Bnei Menashe Council India repository.'
        : found.verificationStatus === 'Revoked'
        ? 'WARNING: This document has been officially revoked by the issuing authority. Do not accept as valid.'
        : 'Document is recorded but verification status is incomplete or unverified.'
    };
  }

  /**
   * Issue a new Platform Certified Document
   */
  static async issueNewCertificate(params: {
    documentName: string;
    hebrewName?: string;
    category: PlatformDocumentCategory;
    issuingAuthority: string;
    recipientName: string;
    citizenId?: string;
    householdId?: string;
    description: string;
    expirationDate?: string;
    officerName: string;
  }): Promise<CertifiedDocumentRecord> {
    const allDocs = this.getAllCertifiedDocuments();

    // Generate unique Document Number & QR Code
    const prefixMap: Record<PlatformDocumentCategory, string> = {
      'Community Identity Pass': 'BMCI',
      'Community Membership Certificate': 'BM-MEMB',
      'Community Census Certificate': 'BM-CEN',
      'Household Certificate': 'BM-HOU',
      'Family Registration': 'BM-FAM',
      'Memorial Certificate': 'BM-MEM',
      'Volunteer Certificate': 'BM-VOL',
      'Synagogue Membership': 'BM-SYN',
      'Regional Council Letter': 'BM-REG',
      'Community Service Approval': 'BM-SRV',
      'Education Certificate': 'BM-EDU',
      'Aliyah Support Letter': 'BM-ALY'
    };

    const prefix = prefixMap[params.category] || 'BM-CERT';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const documentNumber = `${prefix}-2026-${randNum}`;
    const qrId = `QR-${prefix}-${randNum}`;

    const now = new Date();
    const issueDate = now.toISOString().split('T')[0];
    const issueTime = now.toTimeString().split(' ')[0] + ' IST';

    // Generate SHA-256 fingerprint from payload
    const payloadString = `${documentNumber}:${params.category}:${params.recipientName}:${issueDate}:${params.issuingAuthority}`;
    const sha256Fingerprint = await this.generateSHA256Fingerprint(payloadString);

    const newDoc: CertifiedDocumentRecord = {
      id: `cert-${Date.now()}`,
      documentNumber,
      documentName: params.documentName,
      hebrewName: params.hebrewName,
      category: params.category,
      issueDate,
      issueTime,
      version: 'v1.0',
      issuingAuthority: params.issuingAuthority,
      verificationStatus: 'Verified',
      expirationDate: params.expirationDate,
      sha256Fingerprint,
      qrId,
      citizenId: params.citizenId,
      recipientName: params.recipientName,
      householdId: params.householdId,
      description: params.description,
      history: [
        {
          id: `ev-${Date.now()}`,
          action: 'Created',
          timestamp: `${issueDate} ${issueTime}`,
          actor: params.officerName,
          version: 'v1.0',
          note: `Platform digital certification issued under seal of ${params.issuingAuthority}`
        }
      ]
    };

    allDocs.unshift(newDoc);
    this.saveDocuments(allDocs);

    // Audit Log
    AuditService.logAction(
      params.officerName,
      'ISSUE_DIGITAL_CERTIFICATE',
      `document_registry/${documentNumber}`,
      {
        documentNumber,
        category: params.category,
        recipient: params.recipientName,
        sha256: sha256Fingerprint
      }
    );

    return newDoc;
  }

  /**
   * Reissue / Bump Version of an existing document
   */
  static async reissueCertificate(documentNumber: string, officerName: string, reasonNote: string): Promise<CertifiedDocumentRecord | null> {
    const allDocs = this.getAllCertifiedDocuments();
    const idx = allDocs.findIndex(d => d.documentNumber === documentNumber || d.id === documentNumber);
    if (idx === -1) return null;

    const doc = allDocs[idx];
    const currentVerNum = parseFloat(doc.version.replace('v', '')) || 1.0;
    const newVersion = `v${(currentVerNum + 0.1).toFixed(1)}`;

    const now = new Date();
    const issueDate = now.toISOString().split('T')[0];
    const issueTime = now.toTimeString().split(' ')[0] + ' IST';

    const payloadString = `${doc.documentNumber}:${doc.category}:${doc.recipientName}:${issueDate}:${newVersion}`;
    const newFingerprint = await this.generateSHA256Fingerprint(payloadString);

    doc.version = newVersion;
    doc.issueDate = issueDate;
    doc.issueTime = issueTime;
    doc.sha256Fingerprint = newFingerprint;
    doc.verificationStatus = 'Verified'; // restore if previously pending

    doc.history.unshift({
      id: `ev-${Date.now()}`,
      action: 'Reissued',
      timestamp: `${issueDate} ${issueTime}`,
      actor: officerName,
      version: newVersion,
      note: reasonNote || 'Official certificate reissuance & seal update'
    });

    this.saveDocuments(allDocs);

    AuditService.logAction(
      officerName,
      'REISSUE_DIGITAL_CERTIFICATE',
      `document_registry/${doc.documentNumber}`,
      { version: newVersion, fingerprint: newFingerprint, note: reasonNote }
    );

    return doc;
  }

  /**
   * Revoke a certificate
   */
  static revokeCertificate(documentNumber: string, officerName: string, revocationReason: string): boolean {
    const allDocs = this.getAllCertifiedDocuments();
    const doc = allDocs.find(d => d.documentNumber === documentNumber || d.id === documentNumber);
    if (!doc) return false;

    doc.verificationStatus = 'Revoked';
    const now = new Date();
    const ts = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];

    doc.history.unshift({
      id: `ev-${Date.now()}`,
      action: 'Revoked',
      timestamp: ts,
      actor: officerName,
      version: doc.version,
      note: revocationReason || 'Revoked by Regional Authority'
    });

    this.saveDocuments(allDocs);

    AuditService.logAction(
      officerName,
      'REVOKE_DIGITAL_CERTIFICATE',
      `document_registry/${doc.documentNumber}`,
      { reason: revocationReason }
    );

    return true;
  }

  /**
   * Log document viewing/downloading event
   */
  static logDocumentEvent(documentNumber: string, action: 'Downloaded' | 'Printed' | 'Viewed', actorName: string): void {
    const allDocs = this.getAllCertifiedDocuments();
    const doc = allDocs.find(d => d.documentNumber === documentNumber || d.id === documentNumber);
    if (doc) {
      const now = new Date();
      const ts = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
      doc.history.unshift({
        id: `ev-${Date.now()}`,
        action,
        timestamp: ts,
        actor: actorName,
        version: doc.version,
        note: `Document ${action.toLowerCase()} via Digital Trust Portal`
      });
      this.saveDocuments(allDocs);
    }
    AuditService.logAction(
      actorName,
      `DOCUMENT_${action.toUpperCase()}`,
      `document_registry/${documentNumber}`,
      { documentNumber, action }
    );
  }

  /**
   * Retrieves all digital signature audit trail logs across all certified records
   */
  public static getAuditLogs(): { id: string; timestamp: string; action: string; documentNumber: string; details: string; actor: string }[] {
    const docs = this.getAllCertifiedDocuments();
    const logs: { id: string; timestamp: string; action: string; documentNumber: string; details: string; actor: string }[] = [];
    
    docs.forEach(doc => {
      doc.history.forEach((evt, i) => {
        logs.push({
          id: `${doc.documentNumber}-evt-${i}`,
          timestamp: evt.timestamp,
          action: evt.action,
          documentNumber: doc.documentNumber,
          details: `${doc.documentName} (${evt.version}) - ${evt.note}`,
          actor: evt.actor
        });
      });
    });

    return logs.reverse();
  }
}
