import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { transliterateNameToOdia, getOdiaName, getOdiaRole } from './odiaTranslator';
import { 
  FOUNDATION_INFO, 
  INITIAL_DRIVES, 
  INITIAL_LEADERSHIP, 
  INITIAL_SUCCESS_STORIES, 
  INITIAL_GALLERY, 
  INITIAL_RECENT_DONORS,
  INITIAL_DOCUMENTS,
  INITIAL_NEWS_EVENTS
} from '../data/mockData';
import { 
  DonationDrive, 
  OfficeBearer, 
  SuccessStory, 
  GalleryItem, 
  AssistanceRequest, 
  DonorRecord,
  PaymentInfo,
  TransparencyDocument,
  NewsEventItem
} from '../types';

// Read env variables if available
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_PROJECT_REF') &&
  !supabaseUrl.includes('YOUR_SUPABASE') &&
  !supabaseUrl.includes('example.supabase')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  upiQrUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop',
  upiId: 'socialwelfare@upi',
  accountNo: '398201000456',
  ifscCode: 'SBIN0001234',
  bankName: 'State Bank of India',
  accountHolder: 'Social Welfare Foundation Babujang',
};

// Local storage keys
const STORAGE_KEYS = {
  DRIVES: 'swf_drives_v1',
  LEADERSHIP: 'swf_leadership_v1',
  STORIES: 'swf_stories_v1',
  GALLERY: 'swf_gallery_v1',
  DONORS: 'swf_donors_v1',
  ASSISTANCE: 'swf_assistance_v1',
  PAYMENT: 'swf_payment_info_v1',
};

// Global error tracker for UI notifications
let lastSupabaseError: string | null = null;

export const getLastSupabaseError = () => lastSupabaseError;

const notifySupabaseError = (msg: string) => {
  lastSupabaseError = msg;
  console.warn('[Supabase Warning]:', msg);
  window.dispatchEvent(new CustomEvent('supabase_error', { detail: msg }));
};

// ==========================================
// DB MAPPERS (camelCase TS <-> snake_case SQL)
// ==========================================

const mapLeaderToDb = (l: OfficeBearer) => {
  const nameEn = l.nameEn || 'Leader';
  const roleEn = l.roleEn || 'Member';
  return {
    id: l.id || 'leader-' + Date.now(),
    name_en: nameEn,
    name_or: getOdiaName(nameEn, l.nameOr),
    role_en: roleEn,
    role_or: getOdiaRole(roleEn, l.roleOr),
    category: l.category || 'executive',
    bio_en: l.bioEn || '',
    bio_or: l.bioOr || '',
    phone: l.phone || '',
    image_url: l.imageUrl || ''
  };
};

const mapLeaderFromDb = (row: any): OfficeBearer => {
  const nameEn = row.name_en || '';
  const roleEn = row.role_en || '';
  return {
    id: row.id,
    nameEn,
    nameOr: getOdiaName(nameEn, row.name_or),
    roleEn,
    roleOr: getOdiaRole(roleEn, row.role_or),
    category: row.category || 'executive',
    bioEn: row.bio_en || '',
    bioOr: row.bio_or || '',
    phone: row.phone || '',
    imageUrl: row.image_url || ''
  };
};

const mapDriveToDb = (d: DonationDrive) => ({
  id: d.id || 'drive-' + Date.now(),
  title_en: d.titleEn || 'Relief Drive',
  title_or: d.titleOr || d.titleEn || 'Relief Drive',
  category: d.category || 'ration',
  description_en: d.descriptionEn || '',
  description_or: d.descriptionOr || '',
  target_amount: d.targetAmount || 0,
  raised_amount: d.raisedAmount || 0,
  donor_count: d.donorCount || 0,
  end_date: d.endDate || '',
  image_url: d.imageUrl || '',
  items_needed: d.itemsNeeded || [],
  is_featured: d.isFeatured || false
});

const mapDriveFromDb = (row: any): DonationDrive => ({
  id: row.id,
  titleEn: row.title_en || '',
  titleOr: row.title_or || row.title_en || '',
  category: row.category || 'ration',
  descriptionEn: row.description_en || '',
  descriptionOr: row.description_or || '',
  targetAmount: Number(row.target_amount) || 0,
  raisedAmount: Number(row.raised_amount) || 0,
  donorCount: Number(row.donor_count) || 0,
  endDate: row.end_date || '',
  imageUrl: row.image_url || '',
  itemsNeeded: row.items_needed || [],
  isFeatured: Boolean(row.is_featured)
});

const mapGalleryToDb = (g: GalleryItem) => ({
  id: g.id || 'gal-' + Date.now(),
  title_en: g.titleEn || 'Photo',
  title_or: g.titleOr || g.titleEn || 'Photo',
  category: g.category || 'relief',
  image_url: g.imageUrl || '',
  date: g.date || '',
  location: g.location || ''
});

const mapGalleryFromDb = (row: any): GalleryItem => ({
  id: row.id,
  titleEn: row.title_en || '',
  titleOr: row.title_or || row.title_en || '',
  category: row.category || 'relief',
  imageUrl: row.image_url || '',
  date: row.date || '',
  location: row.location || ''
});

const mapRequestToDb = (r: AssistanceRequest) => ({
  id: r.id || 'req-' + Date.now(),
  tracking_code: r.trackingCode || `SWF-${Date.now()}`,
  applicant_name: r.applicantName || 'Applicant',
  phone: r.phone || '',
  village_panchayat: r.villagePanchayat || '',
  district: r.district || 'Cuttack',
  category: r.category || 'other',
  description: r.description || '',
  urgency: r.urgency || 'normal',
  status: r.status || 'submitted'
});

const mapRequestFromDb = (row: any): AssistanceRequest => ({
  id: row.id,
  trackingCode: row.tracking_code || '',
  applicantName: row.applicant_name || '',
  phone: row.phone || '',
  villagePanchayat: row.village_panchayat || '',
  district: row.district || 'Cuttack',
  category: row.category || 'other',
  description: row.description || '',
  urgency: row.urgency || 'normal',
  status: row.status || 'submitted',
  createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
});

const mapDonorToDb = (d: DonorRecord) => ({
  id: d.id || 'don-' + Date.now(),
  donor_name: d.donorName || 'Anonymous',
  amount: d.amount || 0,
  drive_id: d.driveId || null,
  drive_title: d.driveTitle || null,
  payment_method: d.paymentMethod || 'UPI',
  message: d.message || null,
  is_anonymous: d.isAnonymous || false,
  transaction_ref: d.transactionRef || null
});

const mapDonorFromDb = (row: any): DonorRecord => ({
  id: row.id,
  donorName: row.donor_name || 'Anonymous',
  amount: Number(row.amount) || 0,
  driveId: row.drive_id || undefined,
  driveTitle: row.drive_title || undefined,
  paymentMethod: row.payment_method || 'UPI',
  message: row.message || undefined,
  isAnonymous: Boolean(row.is_anonymous),
  transactionRef: row.transaction_ref || undefined,
  timestamp: row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'
});

// ==========================================
// REPOSITORY CLASS
// ==========================================

export class FoundationRepository {

  // Test Supabase connection and schema health
  static async testSupabaseConnection(): Promise<{ 
    connected: boolean; 
    tablesExist: boolean; 
    bucketExists: boolean; 
    errorDetails?: string 
  }> {
    if (!supabase) {
      return { 
        connected: false, 
        tablesExist: false, 
        bucketExists: false, 
        errorDetails: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.' 
      };
    }

    try {
      // 1. Check office_bearers table
      const { error: tErr } = await supabase.from('office_bearers').select('id').limit(1);
      
      // 2. Check storage bucket
      let bucketOk = false;
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        bucketOk = Boolean(buckets?.some(b => b.name === 'foundation_images' || b.id === 'foundation_images'));
      } catch {
        bucketOk = false;
      }

      if (tErr) {
        return {
          connected: true,
          tablesExist: false,
          bucketExists: bucketOk,
          errorDetails: `Table query error: ${tErr.message} (Code: ${tErr.code}). Please execute the SQL Schema in your Supabase SQL Editor.`
        };
      }

      return {
        connected: true,
        tablesExist: true,
        bucketExists: bucketOk
      };
    } catch (err: any) {
      return {
        connected: false,
        tablesExist: false,
        bucketExists: false,
        errorDetails: err?.message || 'Connection test failed.'
      };
    }
  }

  // Ensure storage bucket exists
  static async ensureBucketExists(): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.storage.createBucket('foundation_images', {
        public: true,
        fileSizeLimit: 52428800
      });
      if (error && !error.message?.includes('already exists')) {
        console.warn('Storage bucket creation notice:', error.message);
      }
      return true;
    } catch (err) {
      console.warn('Bucket initialization notice:', err);
      return false;
    }
  }

  // Synchronize data from Supabase if configured
  static async syncFromSupabase(): Promise<void> {
    if (!supabase) return;

    try {
      // Ensure storage bucket is ready
      this.ensureBucketExists().catch(() => {});

      // 1. Fetch Office Bearers
      const { data: leadersData, error: lErr } = await supabase.from('office_bearers').select('*');
      if (lErr) {
        notifySupabaseError(`office_bearers fetch failed: ${lErr.message}`);
      } else if (leadersData) {
        if (leadersData.length > 0) {
          const mapped = leadersData.map(mapLeaderFromDb);
          localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(mapped));
        } else {
          // Seed defaults if empty in Supabase
          await this.seedSupabaseDefaults();
        }
      }

      // 2. Fetch Drives
      const { data: drivesData, error: dErr } = await supabase.from('drives').select('*');
      if (dErr) {
        notifySupabaseError(`drives fetch failed: ${dErr.message}`);
      } else if (drivesData && drivesData.length > 0) {
        const mapped = drivesData.map(mapDriveFromDb);
        localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(mapped));
      }

      // 3. Fetch Gallery
      const { data: galleryData, error: gErr } = await supabase.from('gallery').select('*');
      if (gErr) {
        notifySupabaseError(`gallery fetch failed: ${gErr.message}`);
      } else if (galleryData && galleryData.length > 0) {
        const mapped = galleryData.map(mapGalleryFromDb);
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(mapped));
      }

      // 4. Fetch Donations
      const { data: donationsData, error: donErr } = await supabase.from('donations').select('*');
      if (donErr) {
        notifySupabaseError(`donations fetch failed: ${donErr.message}`);
      } else if (donationsData && donationsData.length > 0) {
        const mapped = donationsData.map(mapDonorFromDb);
        localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(mapped));
      }

      // 5. Fetch Assistance Requests
      const { data: reqData, error: reqErr } = await supabase.from('assistance_requests').select('*');
      if (reqErr) {
        notifySupabaseError(`assistance_requests fetch failed: ${reqErr.message}`);
      } else if (reqData && reqData.length > 0) {
        const mapped = reqData.map(mapRequestFromDb);
        localStorage.setItem(STORAGE_KEYS.ASSISTANCE, JSON.stringify(mapped));
      }

      // 6. Fetch Settings (Logo URL & Hero BG URL)
      const { data: settingsData, error: sErr } = await supabase.from('foundation_settings').select('*');
      if (sErr) {
        notifySupabaseError(`foundation_settings fetch failed: ${sErr.message}`);
      } else if (settingsData && settingsData.length > 0) {
        const logoSetting = settingsData.find((s: any) => s.key === 'logo_url');
        if (logoSetting) {
          if (logoSetting.value) {
            localStorage.setItem('custom_app_logo', logoSetting.value);
          } else {
            localStorage.removeItem('custom_app_logo');
          }
          window.dispatchEvent(new Event('logo_updated'));
        }

        const heroBgSetting = settingsData.find((s: any) => s.key === 'hero_bg_url');
        if (heroBgSetting) {
          if (heroBgSetting.value) {
            localStorage.setItem('custom_hero_bg', heroBgSetting.value);
          } else {
            localStorage.removeItem('custom_hero_bg');
          }
          window.dispatchEvent(new Event('hero_bg_updated'));
        }

        // Fetch payment settings
        const currentPayment = this.getPaymentInfo();
        const upiQrSetting = settingsData.find((s: any) => s.key === 'upi_qr_url')?.value;
        const upiIdSetting = settingsData.find((s: any) => s.key === 'upi_id')?.value;
        const accNoSetting = settingsData.find((s: any) => s.key === 'bank_account_no')?.value;
        const ifscSetting = settingsData.find((s: any) => s.key === 'bank_ifsc')?.value;
        const bankNameSetting = settingsData.find((s: any) => s.key === 'bank_name')?.value;
        const accHolderSetting = settingsData.find((s: any) => s.key === 'account_holder')?.value;

        if (upiQrSetting !== undefined || upiIdSetting !== undefined) {
          const updatedInfo: PaymentInfo = {
            upiQrUrl: upiQrSetting !== undefined ? upiQrSetting : currentPayment.upiQrUrl,
            upiId: upiIdSetting !== undefined ? upiIdSetting : currentPayment.upiId,
            accountNo: accNoSetting !== undefined ? accNoSetting : currentPayment.accountNo,
            ifscCode: ifscSetting !== undefined ? ifscSetting : currentPayment.ifscCode,
            bankName: bankNameSetting !== undefined ? bankNameSetting : currentPayment.bankName,
            accountHolder: accHolderSetting !== undefined ? accHolderSetting : currentPayment.accountHolder,
          };
          localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(updatedInfo));
          window.dispatchEvent(new Event('payment_info_updated'));
        }
      }

      window.dispatchEvent(new Event('repository_updated'));
    } catch (err: any) {
      notifySupabaseError(`Supabase sync exception: ${err?.message || 'Unknown error'}`);
    }
  }

  // Seed default items to Supabase if database tables are freshly created and empty
  static async seedSupabaseDefaults(): Promise<void> {
    if (!supabase) return;
    try {
      // Seed leaders
      const leadersToDb = INITIAL_LEADERSHIP.map(mapLeaderToDb);
      const { error: lErr } = await supabase.from('office_bearers').upsert(leadersToDb);
      if (lErr) notifySupabaseError(`Seed leaders error: ${lErr.message}`);

      // Seed drives
      const drivesToDb = INITIAL_DRIVES.map(mapDriveToDb);
      const { error: dErr } = await supabase.from('drives').upsert(drivesToDb);
      if (dErr) notifySupabaseError(`Seed drives error: ${dErr.message}`);

      // Seed gallery
      const galleryToDb = INITIAL_GALLERY.map(mapGalleryToDb);
      const { error: gErr } = await supabase.from('gallery').upsert(galleryToDb);
      if (gErr) notifySupabaseError(`Seed gallery error: ${gErr.message}`);

      // Seed logo setting if available in local storage
      const existingLogo = localStorage.getItem('custom_app_logo');
      if (existingLogo) {
        await supabase.from('foundation_settings').upsert({
          key: 'logo_url',
          value: existingLogo,
          updated_at: new Date().toISOString()
        });
      }
    } catch (err: any) {
      notifySupabaseError(`Error seeding Supabase defaults: ${err?.message}`);
    }
  }

  // Drives
  static getDrives(): DonationDrive[] {
    const cached = localStorage.getItem(STORAGE_KEYS.DRIVES);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(INITIAL_DRIVES));
      return INITIAL_DRIVES;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_DRIVES;
    }
  }

  static async saveDrive(drive: DonationDrive): Promise<DonationDrive> {
    const drives = this.getDrives();
    const index = drives.findIndex(d => d.id === drive.id);
    let updated: DonationDrive[];
    if (index >= 0) {
      updated = [...drives];
      updated[index] = drive;
    } else {
      updated = [drive, ...drives];
    }
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(updated));

    if (supabase) {
      try {
        const payload = mapDriveToDb(drive);
        const { error } = await supabase.from('drives').upsert(payload);
        if (error) {
          notifySupabaseError(`Save drive error: ${error.message}`);
        }
      } catch (err: any) {
        notifySupabaseError(`Save drive exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
    return drive;
  }

  static async deleteDrive(id: string): Promise<void> {
    const drives = this.getDrives().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives));

    if (supabase) {
      try {
        const { error } = await supabase.from('drives').delete().eq('id', id);
        if (error) notifySupabaseError(`Delete drive error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Delete drive exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Leadership
  static getLeadership(): OfficeBearer[] {
    const cached = localStorage.getItem(STORAGE_KEYS.LEADERSHIP);
    let list: OfficeBearer[] = INITIAL_LEADERSHIP;
    if (cached) {
      try {
        list = JSON.parse(cached);
      } catch {
        list = INITIAL_LEADERSHIP;
      }
    }

    // Sanitize stale mock data or mismatching Odia names dynamically
    let modified = false;
    list = list.map(l => {
      const updated = { ...l };
      const correctNameOr = getOdiaName(l.nameEn, l.nameOr);
      if (updated.nameOr !== correctNameOr) {
        updated.nameOr = correctNameOr;
        modified = true;
      }
      const correctRoleOr = getOdiaRole(l.roleEn, l.roleOr);
      if (updated.roleOr !== correctRoleOr) {
        updated.roleOr = correctRoleOr;
        modified = true;
      }
      return updated;
    });

    if (modified || !cached) {
      localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(list));
    }
    return list;
  }

  static async saveLeadershipMember(bearer: OfficeBearer): Promise<OfficeBearer> {
    const leadership = this.getLeadership();
    const index = leadership.findIndex(l => l.id === bearer.id);
    let updated: OfficeBearer[];
    if (index >= 0) {
      updated = [...leadership];
      updated[index] = bearer;
    } else {
      updated = [...leadership, bearer];
    }
    localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(updated));

    if (supabase) {
      try {
        const payload = mapLeaderToDb(bearer);
        const { error } = await supabase.from('office_bearers').upsert(payload);
        if (error) {
          notifySupabaseError(`Save office_bearer error: ${error.message}`);
        } else {
          console.log('Successfully saved office bearer to Supabase:', bearer.nameEn);
        }
      } catch (err: any) {
        notifySupabaseError(`Save office_bearer exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
    return bearer;
  }

  static async deleteLeadershipMember(id: string): Promise<void> {
    const leadership = this.getLeadership().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(leadership));

    if (supabase) {
      try {
        const { error } = await supabase.from('office_bearers').delete().eq('id', id);
        if (error) notifySupabaseError(`Delete office_bearer error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Delete office_bearer exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Success Stories
  static getStories(): SuccessStory[] {
    const cached = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_SUCCESS_STORIES));
      return INITIAL_SUCCESS_STORIES;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_SUCCESS_STORIES;
    }
  }

  // Gallery
  static getGallery(): GalleryItem[] {
    const cached = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
      return INITIAL_GALLERY;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_GALLERY;
    }
  }

  static async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const items = this.getGallery();
    const index = items.findIndex(i => i.id === item.id);
    let updated: GalleryItem[];
    if (index >= 0) {
      updated = [...items];
      updated[index] = item;
    } else {
      updated = [item, ...items];
    }
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

    if (supabase) {
      try {
        const payload = mapGalleryToDb(item);
        const { error } = await supabase.from('gallery').upsert(payload);
        if (error) notifySupabaseError(`Save gallery error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Save gallery exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
    return item;
  }

  static async deleteGalleryItem(id: string): Promise<void> {
    const items = this.getGallery().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));

    if (supabase) {
      try {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) notifySupabaseError(`Delete gallery error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Delete gallery exception: ${err?.message}`);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Logo sync
  static async saveCustomLogo(imageUrl: string): Promise<void> {
    if (imageUrl) {
      localStorage.setItem('custom_app_logo', imageUrl);
    } else {
      localStorage.removeItem('custom_app_logo');
    }
    window.dispatchEvent(new Event('logo_updated'));

    if (supabase) {
      try {
        const { error } = await supabase.from('foundation_settings').upsert({
          key: 'logo_url',
          value: imageUrl || '',
          updated_at: new Date().toISOString()
        });
        if (error) {
          notifySupabaseError(`Save logo error: ${error.message}`);
        } else {
          console.log('Successfully saved custom logo to Supabase');
        }
      } catch (err: any) {
        notifySupabaseError(`Save logo exception: ${err?.message}`);
      }
    }
  }

  // Hero Background sync (Desktop & Mobile)
  static getHeroBg(): string | null {
    return localStorage.getItem('custom_desktop_hero_bg') || localStorage.getItem('custom_hero_bg');
  }

  static getDesktopHeroBg(): string | null {
    return localStorage.getItem('custom_desktop_hero_bg') || localStorage.getItem('custom_hero_bg');
  }

  static getMobileHeroBg(): string | null {
    return localStorage.getItem('custom_mobile_hero_bg');
  }

  static async saveHeroBg(imageUrl: string): Promise<void> {
    return this.saveDesktopHeroBg(imageUrl);
  }

  static async saveDesktopHeroBg(imageUrl: string): Promise<void> {
    if (imageUrl) {
      localStorage.setItem('custom_desktop_hero_bg', imageUrl);
      localStorage.setItem('custom_hero_bg', imageUrl);
    } else {
      localStorage.removeItem('custom_desktop_hero_bg');
      localStorage.removeItem('custom_hero_bg');
    }
    window.dispatchEvent(new Event('hero_bg_updated'));

    if (supabase) {
      try {
        await supabase.from('foundation_settings').upsert({
          key: 'hero_bg_url',
          value: imageUrl || '',
          updated_at: new Date().toISOString()
        });
        await supabase.from('foundation_settings').upsert({
          key: 'desktop_hero_bg_url',
          value: imageUrl || '',
          updated_at: new Date().toISOString()
        });
      } catch (err: any) {
        notifySupabaseError(`Save desktop hero bg exception: ${err?.message}`);
      }
    }
  }

  static async saveMobileHeroBg(imageUrl: string): Promise<void> {
    if (imageUrl) {
      localStorage.setItem('custom_mobile_hero_bg', imageUrl);
    } else {
      localStorage.removeItem('custom_mobile_hero_bg');
    }
    window.dispatchEvent(new Event('hero_bg_updated'));

    if (supabase) {
      try {
        await supabase.from('foundation_settings').upsert({
          key: 'mobile_hero_bg_url',
          value: imageUrl || '',
          updated_at: new Date().toISOString()
        });
      } catch (err: any) {
        notifySupabaseError(`Save mobile hero bg exception: ${err?.message}`);
      }
    }
  }

  // Documents Folder / Transparency Data
  static getDocuments(): TransparencyDocument[] {
    const cached = localStorage.getItem('swf_documents_v1');
    if (!cached) {
      localStorage.setItem('swf_documents_v1', JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  }

  // News & Events Data
  static getNewsEvents(): NewsEventItem[] {
    const cached = localStorage.getItem('swf_news_events_v1');
    if (!cached) {
      localStorage.setItem('swf_news_events_v1', JSON.stringify(INITIAL_NEWS_EVENTS));
      return INITIAL_NEWS_EVENTS;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_NEWS_EVENTS;
    }
  }


  // Payment Info & UPI Barcode Sync
  static getPaymentInfo(): PaymentInfo {
    const cached = localStorage.getItem(STORAGE_KEYS.PAYMENT);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(DEFAULT_PAYMENT_INFO));
      return DEFAULT_PAYMENT_INFO;
    }
    try {
      return { ...DEFAULT_PAYMENT_INFO, ...JSON.parse(cached) };
    } catch {
      return DEFAULT_PAYMENT_INFO;
    }
  }

  static async savePaymentInfo(info: Partial<PaymentInfo>): Promise<PaymentInfo> {
    const current = this.getPaymentInfo();
    const updated: PaymentInfo = { ...current, ...info };
    localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(updated));
    window.dispatchEvent(new Event('payment_info_updated'));
    window.dispatchEvent(new Event('repository_updated'));

    if (supabase) {
      try {
        const upsertSettings = [
          { key: 'upi_qr_url', value: updated.upiQrUrl || '' },
          { key: 'upi_id', value: updated.upiId || '' },
          { key: 'bank_account_no', value: updated.accountNo || '' },
          { key: 'bank_ifsc', value: updated.ifscCode || '' },
          { key: 'bank_name', value: updated.bankName || '' },
          { key: 'account_holder', value: updated.accountHolder || '' },
        ].map(item => ({ ...item, updated_at: new Date().toISOString() }));

        const { error } = await supabase.from('foundation_settings').upsert(upsertSettings);
        if (error) {
          notifySupabaseError(`Save payment info error: ${error.message}`);
        } else {
          console.log('Successfully saved payment settings & UPI barcode to Supabase');
        }
      } catch (err: any) {
        notifySupabaseError(`Save payment info exception: ${err?.message}`);
      }
    }

    return updated;
  }

  // Image File Helper: Uploads to Supabase Storage if bucket exists, or converts to Base64
  static async uploadImage(file: File, folder: string = 'general'): Promise<string> {
    if (supabase) {
      try {
        await this.ensureBucketExists();

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        // Attempt upload to 'foundation_images' bucket
        const { data, error } = await supabase.storage
          .from('foundation_images')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('foundation_images')
            .getPublicUrl(fileName);
          
          if (publicUrlData?.publicUrl) {
            console.log('Image uploaded to Supabase Storage:', publicUrlData.publicUrl);
            return publicUrlData.publicUrl;
          }
        } else if (error) {
          notifySupabaseError(`Storage upload failed: ${error.message}. Falling back to Data URL.`);
        }
      } catch (err: any) {
        notifySupabaseError(`Storage exception: ${err?.message}. Falling back to Data URL.`);
      }
    }

    // Fallback: convert file to Base64 Data URL (stored in DB & localStorage)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // Donors
  static getDonors(): DonorRecord[] {
    const cached = localStorage.getItem(STORAGE_KEYS.DONORS);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_RECENT_DONORS));
      return INITIAL_RECENT_DONORS;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_RECENT_DONORS;
    }
  }

  static async addDonor(donor: Omit<DonorRecord, 'id' | 'timestamp'>): Promise<DonorRecord> {
    const newRecord: DonorRecord = {
      ...donor,
      id: 'don-' + Date.now(),
      timestamp: 'Just now',
    };

    const donors = this.getDonors();
    const updatedDonors = [newRecord, ...donors];
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(updatedDonors));

    // Update drive target if driveId exists
    if (donor.driveId) {
      const drives = this.getDrives();
      const drive = drives.find(d => d.id === donor.driveId);
      if (drive) {
        drive.raisedAmount += donor.amount;
        drive.donorCount += 1;
        this.saveDrive(drive);
      }
    }

    if (supabase) {
      try {
        const payload = mapDonorToDb(newRecord);
        const { error } = await supabase.from('donations').insert(payload);
        if (error) notifySupabaseError(`Insert donation error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Insert donation exception: ${err?.message}`);
      }
    }

    return newRecord;
  }

  // Assistance Requests
  static getAssistanceRequests(): AssistanceRequest[] {
    const cached = localStorage.getItem(STORAGE_KEYS.ASSISTANCE);
    if (!cached) return [];
    try {
      return JSON.parse(cached);
    } catch {
      return [];
    }
  }

  static async createAssistanceRequest(data: Omit<AssistanceRequest, 'id' | 'trackingCode' | 'createdAt' | 'status'>): Promise<AssistanceRequest> {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `SWF-2026-${codeNumber}`;
    const newRequest: AssistanceRequest = {
      ...data,
      id: 'req-' + Date.now(),
      trackingCode,
      status: 'submitted',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
    };

    const requests = this.getAssistanceRequests();
    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEYS.ASSISTANCE, JSON.stringify(updated));

    if (supabase) {
      try {
        const payload = mapRequestToDb(newRequest);
        const { error } = await supabase.from('assistance_requests').insert(payload);
        if (error) notifySupabaseError(`Insert request error: ${error.message}`);
      } catch (err: any) {
        notifySupabaseError(`Insert request exception: ${err?.message}`);
      }
    }

    return newRequest;
  }

  // Reset data back to default
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.DRIVES);
    localStorage.removeItem(STORAGE_KEYS.LEADERSHIP);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.ASSISTANCE);
  }

  // ==========================================
  // OPERATOR SUPABASE AUTHENTICATION
  // ==========================================
  static async signInOperator(email: string, password: string): Promise<{ success: boolean; userEmail?: string; error?: string }> {
    if (!email || !password) {
      return { success: false, error: 'Please enter both Operator Email/ID and Password.' };
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
          setTimeout(() => {
            resolve({
              data: null,
              error: { message: 'Authentication network timeout.' }
            });
          }, 3500);
        });

        const authPromise = supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        const { data, error } = await Promise.race([authPromise, timeoutPromise]);

        if (error) {
          const msg = error.message || '';
          if (msg.includes('Invalid login credentials')) {
            return { success: false, error: 'Invalid login credentials. Please check your operator email and password.' };
          }
          if (msg.includes('Load failed') || msg.includes('Failed to fetch') || msg.includes('timeout')) {
            // Network issue or unreachable endpoint - fall back to local auth if valid password
            if (password.trim().length >= 4) {
              const userEmail = email.trim();
              localStorage.setItem('swf_operator_authenticated', 'true');
              localStorage.setItem('swf_operator_email', userEmail);
              return { success: true, userEmail };
            }
            return { success: false, error: 'Could not connect to Supabase auth server. Please check network connection.' };
          }
          return { success: false, error: msg };
        }

        const userEmail = data.user?.email || email;
        localStorage.setItem('swf_operator_authenticated', 'true');
        localStorage.setItem('swf_operator_email', userEmail);
        return { success: true, userEmail };
      } catch (err: any) {
        const errMsg = err?.message || '';
        if (errMsg.includes('Load failed') || errMsg.includes('Failed to fetch')) {
          if (password.trim().length >= 4) {
            const userEmail = email.trim();
            localStorage.setItem('swf_operator_authenticated', 'true');
            localStorage.setItem('swf_operator_email', userEmail);
            return { success: true, userEmail };
          }
          return { success: false, error: 'Could not connect to Supabase auth server. Please check network connection.' };
        }
        return { success: false, error: errMsg || 'Authentication failed' };
      }
    } else {
      // Local development fallback mode when Supabase env keys are not provided
      if (password.trim().length >= 4) {
        const userEmail = email.trim();
        localStorage.setItem('swf_operator_authenticated', 'true');
        localStorage.setItem('swf_operator_email', userEmail);
        return { success: true, userEmail };
      } else {
        return { success: false, error: 'Password must be at least 4 characters long.' };
      }
    }
  }

  static async signOutOperator(): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem('swf_operator_authenticated');
    localStorage.removeItem('swf_operator_email');
  }

  static getOperatorUser(): { isAuthenticated: boolean; email: string | null } {
    const isAuth = localStorage.getItem('swf_operator_authenticated') === 'true';
    const email = localStorage.getItem('swf_operator_email');
    return {
      isAuthenticated: isAuth,
      email: isAuth ? (email || 'Operator') : null
    };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SUPABASE DATABASE, AUTHENTICATION & STORAGE SCHEMA
-- Social Welfare Foundation Babujang
-- Copy & Run this SQL script in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Drives Table
CREATE TABLE IF NOT EXISTS public.drives (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT,
  category TEXT NOT NULL,
  description_en TEXT,
  description_or TEXT,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  raised_amount NUMERIC DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  end_date TEXT,
  image_url TEXT,
  items_needed TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  drive_id TEXT REFERENCES public.drives(id) ON DELETE SET NULL,
  drive_title TEXT,
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Assistance Requests Table
CREATE TABLE IF NOT EXISTS public.assistance_requests (
  id TEXT PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village_panchayat TEXT NOT NULL,
  district TEXT DEFAULT 'Cuttack',
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Office Bearers / Leadership Table
CREATE TABLE IF NOT EXISTS public.office_bearers (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_or TEXT,
  role_en TEXT NOT NULL,
  role_or TEXT,
  category TEXT NOT NULL,
  bio_en TEXT,
  bio_or TEXT,
  phone TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Photo Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Foundation Settings Table
CREATE TABLE IF NOT EXISTS public.foundation_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant privileges to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_settings ENABLE ROW LEVEL SECURITY;

-- Create Open RLS Policies for Anon & Authenticated users
DROP POLICY IF EXISTS "Public access drives" ON public.drives;
CREATE POLICY "Public access drives" ON public.drives FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access donations" ON public.donations;
CREATE POLICY "Public access donations" ON public.donations FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access assistance_requests" ON public.assistance_requests;
CREATE POLICY "Public access assistance_requests" ON public.assistance_requests FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access office_bearers" ON public.office_bearers;
CREATE POLICY "Public access office_bearers" ON public.office_bearers FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access gallery" ON public.gallery;
CREATE POLICY "Public access gallery" ON public.gallery FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access foundation_settings" ON public.foundation_settings;
CREATE POLICY "Public access foundation_settings" ON public.foundation_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- 7. Storage Bucket Setup & Policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('foundation_images', 'foundation_images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'foundation_images' bucket
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'foundation_images');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'foundation_images');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'foundation_images');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'foundation_images');
`;
