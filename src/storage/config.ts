/**
 * Supabase Storage Buckets Strategy & Configuration Layer
 * Prepares enterprise bucket definitions with MIME type restrictions and max file limits.
 */

export interface StorageBucketDefinition {
  id: string;
  name: string;
  isPublic: boolean;
  fileSizeLimitMB: number;
  allowedMimeTypes: string[];
  description: string;
}

export const SUPABASE_STORAGE_BUCKETS: Record<string, StorageBucketDefinition> = {
  PROFILE_PHOTOS: {
    id: 'profile-photos',
    name: 'Profile Photos',
    isPublic: true,
    fileSizeLimitMB: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: 'User avatar headshots with automated webp resizing.'
  },
  FAMILY_PHOTOS: {
    id: 'family-photos',
    name: 'Family Photos & Genealogy Archives',
    isPublic: false,
    fileSizeLimitMB: 20,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    description: 'Ancestral household portraits and historical lineage certificates.'
  },
  MEMORIAL_IMAGES: {
    id: 'memorial-images',
    name: 'Memorial Images & Yahrzeit Galleries',
    isPublic: true,
    fileSizeLimitMB: 10,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    description: 'Deceased community member tributes and stone inscriptions.'
  },
  TORAH_PDFS: {
    id: 'torah-pdfs',
    name: 'Torah PDFs & Parashah Volumes',
    isPublic: true,
    fileSizeLimitMB: 100,
    allowedMimeTypes: ['application/pdf', 'application/epub+zip'],
    description: 'Halachic commentaries, Talmudic treatises, and Chumash PDFs.'
  },
  DOCUMENTS: {
    id: 'documents',
    name: 'Official Administrative Documents',
    isPublic: false,
    fileSizeLimitMB: 50,
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    description: 'Aliyah applications, Beit Din records, and regional council bylaws.'
  },
  COMMUNITY_FILES: {
    id: 'community-files',
    name: 'Community Files & Synagogue Media',
    isPublic: true,
    fileSizeLimitMB: 50,
    allowedMimeTypes: ['image/*', 'audio/mpeg', 'application/pdf'],
    description: 'Synagogue announcements, Minyan audio guides, and event brochures.'
  },
  AI_UPLOADS: {
    id: 'ai-uploads',
    name: 'AI Grounding Uploads & OCR Scans',
    isPublic: false,
    fileSizeLimitMB: 25,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf', 'text/plain'],
    description: 'Temporary uploads processed by AI Rabbi OCR and embeddings pipeline.'
  },
  FUTURE_MEDIA: {
    id: 'future-media',
    name: 'Future Media & Video Streams',
    isPublic: false,
    fileSizeLimitMB: 500,
    allowedMimeTypes: ['video/mp4', 'audio/*'],
    description: 'Reserved bucket for live Torah lectures and synagogue broadcast recordings.'
  }
};
