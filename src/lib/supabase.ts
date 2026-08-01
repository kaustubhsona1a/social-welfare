import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  FOUNDATION_INFO, 
  INITIAL_DRIVES, 
  INITIAL_LEADERSHIP, 
  INITIAL_SUCCESS_STORIES, 
  INITIAL_GALLERY, 
  INITIAL_RECENT_DONORS 
} from '../data/mockData';
import { 
  DonationDrive, 
  OfficeBearer, 
  SuccessStory, 
  GalleryItem, 
  AssistanceRequest, 
  DonorRecord 
} from '../types';

// Read env variables if available
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys
const STORAGE_KEYS = {
  DRIVES: 'swf_drives_v1',
  LEADERSHIP: 'swf_leadership_v1',
  STORIES: 'swf_stories_v1',
  GALLERY: 'swf_gallery_v1',
  DONORS: 'swf_donors_v1',
  ASSISTANCE: 'swf_assistance_v1',
};

// Repository service that handles both Supabase (if configured) and LocalStorage fallback
export class FoundationRepository {
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
        await supabase.from('drives').upsert(drive);
      } catch (err) {
        console.warn('Supabase sync warning:', err);
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
        await supabase.from('drives').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase drive delete warning:', err);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Leadership
  static getLeadership(): OfficeBearer[] {
    const cached = localStorage.getItem(STORAGE_KEYS.LEADERSHIP);
    if (!cached) {
      localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(INITIAL_LEADERSHIP));
      return INITIAL_LEADERSHIP;
    }
    try {
      return JSON.parse(cached);
    } catch {
      return INITIAL_LEADERSHIP;
    }
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
        await supabase.from('gallery').upsert(item);
      } catch (err) {
        console.warn('Supabase gallery sync warning:', err);
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
        await supabase.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase gallery delete warning:', err);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Leadership
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
        await supabase.from('office_bearers').upsert(bearer);
      } catch (err) {
        console.warn('Supabase office_bearers sync warning:', err);
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
        await supabase.from('office_bearers').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase office_bearers delete warning:', err);
      }
    }
    window.dispatchEvent(new Event('repository_updated'));
  }

  // Logo sync
  static async saveCustomLogo(imageUrl: string): Promise<void> {
    localStorage.setItem('custom_app_logo', imageUrl);
    window.dispatchEvent(new Event('logo_updated'));

    if (supabase) {
      try {
        await supabase.from('foundation_settings').upsert({
          key: 'logo_url',
          value: imageUrl,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase logo sync warning:', err);
      }
    }
  }

  // Image File Helper: Uploads to Supabase Storage if bucket exists, or converts to Base64
  static async uploadImage(file: File, folder: string = 'general'): Promise<string> {
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
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
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to Data URL:', err);
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
        await supabase.from('donations').insert(newRecord);
      } catch (err) {
        console.warn('Supabase donation log warning:', err);
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
        await supabase.from('assistance_requests').insert(newRequest);
      } catch (err) {
        console.warn('Supabase request log warning:', err);
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
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SUPABASE DATABASE SCHEMA FOR SOCIAL WELFARE FOUNDATION BABUJANG
-- Copy & Run this SQL script in your Supabase SQL Editor
-- ==========================================

-- 1. Create Drives Table
CREATE TABLE IF NOT EXISTS drives (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT NOT NULL,
  category TEXT NOT NULL,
  description_en TEXT,
  description_or TEXT,
  target_amount NUMERIC NOT NULL,
  raised_amount NUMERIC DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  end_date DATE,
  image_url TEXT,
  items_needed TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  drive_id TEXT REFERENCES drives(id) ON DELETE SET NULL,
  drive_title TEXT,
  payment_method TEXT NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Assistance Requests Table
CREATE TABLE IF NOT EXISTS assistance_requests (
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
CREATE TABLE IF NOT EXISTS office_bearers (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_or TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_or TEXT NOT NULL,
  category TEXT NOT NULL,
  bio_en TEXT,
  bio_or TEXT,
  phone TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0
);

-- 5. Create Photo Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT,
  location TEXT,
  description_en TEXT,
  description_or TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Foundation Settings / Custom Logo Table
CREATE TABLE IF NOT EXISTS foundation_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_settings ENABLE ROW LEVEL SECURITY;

-- Public Full Access Policies (Allow Read, Insert, Update, Delete)
CREATE POLICY "Full access drives" ON drives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access donations" ON donations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access assistance_requests" ON assistance_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access office_bearers" ON office_bearers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access foundation_settings" ON foundation_settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Storage Bucket Setup for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('foundation_images', 'foundation_images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'foundation_images');
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'foundation_images');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'foundation_images');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'foundation_images');
`;
