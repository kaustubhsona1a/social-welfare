export type Language = 'en' | 'hi' | 'or';

export interface OfficeBearer {
  id: string;
  nameEn: string;
  nameHi?: string;
  nameOr: string;
  roleEn: string;
  roleHi?: string;
  roleOr: string;
  category: 'executive' | 'advisory' | 'trustee';
  bioEn: string;
  bioHi?: string;
  bioOr: string;
  phone?: string;
  imageUrl: string;
}

export interface DonationDrive {
  id: string;
  titleEn: string;
  titleHi?: string;
  titleOr: string;
  category: 'food' | 'clothing' | 'medical' | 'financial' | 'education';
  descriptionEn: string;
  descriptionHi?: string;
  descriptionOr: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  endDate: string;
  imageUrl: string;
  itemsNeeded?: string[];
  isFeatured?: boolean;
}

export interface SuccessStory {
  id: string;
  titleEn: string;
  titleHi?: string;
  titleOr: string;
  category: string;
  location: string;
  date: string;
  summaryEn: string;
  summaryHi?: string;
  summaryOr: string;
  fullStoryEn: string;
  fullStoryHi?: string;
  fullStoryOr: string;
  beneficiariesCount: number;
  imageUrl: string;
  beforeAfterImage?: {
    before: string;
    after: string;
  };
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleHi?: string;
  titleOr: string;
  category: 'food' | 'clothing' | 'medical' | 'event' | 'community' | 'video' | 'press';
  date: string;
  imageUrl: string;
  location: string;
  mediaType?: 'photo' | 'video' | 'press';
  videoUrl?: string;
}

export interface TransparencyDocument {
  id: string;
  titleEn: string;
  titleHi: string;
  titleOr: string;
  category: 'registration' | 'tax' | 'csr' | 'report' | 'fcra';
  docNumber?: string;
  issueDate?: string;
  status: 'active' | 'approved' | 'under_process' | 'audited';
  fileUrl?: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionOr: string;
}

export interface NewsEventItem {
  id: string;
  titleEn: string;
  titleHi: string;
  titleOr: string;
  date: string;
  category: 'news' | 'event' | 'press';
  location: string;
  summaryEn: string;
  summaryHi: string;
  summaryOr: string;
  imageUrl: string;
  isUpcoming?: boolean;
}

export interface AssistanceRequest {
  id: string;
  trackingCode: string;
  applicantName: string;
  phone: string;
  villagePanchayat: string;
  district: string;
  category: 'food' | 'clothing' | 'medical' | 'financial' | 'education';
  description: string;
  urgency: 'high' | 'medium' | 'normal';
  status: 'submitted' | 'under_review' | 'verified' | 'dispatched' | 'completed';
  createdAt: string;
}

export interface DonorRecord {
  id: string;
  donorName: string;
  amount: number;
  driveId?: string;
  driveTitle?: string;
  paymentMethod: 'upi' | 'bank' | 'card' | 'cash';
  message?: string;
  isAnonymous: boolean;
  timestamp: string;
  transactionRef: string;
}

export interface PaymentInfo {
  upiQrUrl: string;
  upiId: string;
  accountNo: string;
  ifscCode: string;
  bankName: string;
  accountHolder: string;
}


