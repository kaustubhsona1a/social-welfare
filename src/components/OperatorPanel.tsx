import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Check, 
  FileText, 
  Camera, 
  Users, 
  HeartHandshake, 
  Pencil,
  Save,
  ArrowLeft,
  Sparkles,
  Database,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Lock,
  LogOut,
  User,
  Key,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Video,
  Film,
  Play,
  Newspaper,
  Calendar,
  Megaphone,
  Bell,
  Link as LinkIcon
} from 'lucide-react';
import { Logo } from './Logo';
import { FoundationRepository, isSupabaseConfigured } from '../lib/supabase';
import { GalleryItem, DonationDrive, OfficeBearer, AssistanceRequest, PaymentInfo, NewsEventItem } from '../types';
import { transliterateNameToOdia, translateDesignationToOdia, hasOdiaScript, getOdiaName, getOdiaRole } from '../lib/odiaTranslator';

interface OperatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void;
}

export const OperatorPanel: React.FC<OperatorPanelProps> = ({
  isOpen,
  onClose,
  onDataChange
}) => {
  const [operatorUser, setOperatorUser] = useState(() => FoundationRepository.getOperatorUser());
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'leadership' | 'drives' | 'gallery' | 'news_events' | 'upload' | 'requests'>('leadership');
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- LEADER EDIT / ADD STATE ---
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [editLeaderData, setEditLeaderData] = useState<Partial<OfficeBearer>>({});
  
  const [showAddLeader, setShowAddLeader] = useState(false);
  const [newLeaderNameEn, setNewLeaderNameEn] = useState('');
  const [newLeaderNameOr, setNewLeaderNameOr] = useState('');
  const [newLeaderRoleEn, setNewLeaderRoleEn] = useState('');
  const [newLeaderRoleOr, setNewLeaderRoleOr] = useState('');
  const [newLeaderCategory, setNewLeaderCategory] = useState<'executive' | 'advisory' | 'trustee'>('executive');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
  const [newLeaderDisplayOrder, setNewLeaderDisplayOrder] = useState<number | undefined>(undefined);
  const [leaderImagePreview, setLeaderImagePreview] = useState<string | null>(null);

  // --- DRIVE EDIT / ADD STATE ---
  const [editingDriveId, setEditingDriveId] = useState<string | null>(null);
  const [editDriveData, setEditDriveData] = useState<Partial<DonationDrive>>({});

  const [showAddDrive, setShowAddDrive] = useState(false);
  const [newDriveTitleEn, setNewDriveTitleEn] = useState('');
  const [newDriveTitleOr, setNewDriveTitleOr] = useState('');
  const [newDriveTarget, setNewDriveTarget] = useState<number>(50000);
  const [newDriveCategory, setNewDriveCategory] = useState<'ration' | 'cloth' | 'medical' | 'flood'>('ration');
  const [driveImagePreview, setDriveImagePreview] = useState<string | null>(null);

  // --- GALLERY UPLOAD STATE (PHOTOS & VIDEOS) ---
  const [galleryUploadMode, setGalleryUploadMode] = useState<'photos' | 'video'>('photos');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryItem['category']>('relief');
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Video specific upload state
  const [videoUploadFile, setVideoUploadFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const [videoDirectUrl, setVideoDirectUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<GalleryItem['category']>('relief');
  const [videoCoverPreview, setVideoCoverPreview] = useState<string | null>(null);

  // --- NEWS & EVENTS STATE ---
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editNewsData, setEditNewsData] = useState<Partial<NewsEventItem>>({});
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNewsTitleEn, setNewNewsTitleEn] = useState('');
  const [newNewsTitleHi, setNewNewsTitleHi] = useState('');
  const [newNewsTitleOr, setNewNewsTitleOr] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'news' | 'event' | 'press'>('news');
  const [newNewsDate, setNewNewsDate] = useState('');
  const [newNewsLocation, setNewNewsLocation] = useState('Babujang, Cuttack');
  const [newNewsSummaryEn, setNewNewsSummaryEn] = useState('');
  const [newNewsSummaryHi, setNewNewsSummaryHi] = useState('');
  const [newNewsSummaryOr, setNewNewsSummaryOr] = useState('');
  const [newNewsIsUpcoming, setNewNewsIsUpcoming] = useState(false);
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null);

  // --- BRANDING & BACKGROUND STATE ---
  const [desktopBgPreview, setDesktopBgPreview] = useState<string | null>(FoundationRepository.getDesktopHeroBg());
  const [mobileBgPreview, setMobileBgPreview] = useState<string | null>(FoundationRepository.getMobileHeroBg());
  const [galleryTick, setGalleryTick] = useState(0);

  // --- PAYMENT & UPI BARCODE STATE ---
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(() => FoundationRepository.getPaymentInfo());

  // File Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const desktopBgInputRef = useRef<HTMLInputElement>(null);
  const mobileBgInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoCoverInputRef = useRef<HTMLInputElement>(null);
  const newsCoverInputRef = useRef<HTMLInputElement>(null);
  const newsPhotoInputRef = useRef<HTMLInputElement>(null);
  const leaderPhotoInputRef = useRef<HTMLInputElement>(null);
  const drivePhotoInputRef = useRef<HTMLInputElement>(null);
  const upiQrInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const res = await FoundationRepository.signInOperator(authEmailInput, authPasswordInput);
    setAuthLoading(false);

    if (res.success) {
      setOperatorUser({ isAuthenticated: true, email: res.userEmail || authEmailInput });
      notify(`Authenticated as ${res.userEmail || authEmailInput}`);
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleLogout = async () => {
    await FoundationRepository.signOutOperator();
    setOperatorUser({ isAuthenticated: false, email: null });
    setAuthEmailInput('');
    setAuthPasswordInput('');
    notify('Logged out from Operator Portal');
  };

  const leadership = FoundationRepository.getLeadership();
  const galleryItems = FoundationRepository.getGallery();
  const drives = FoundationRepository.getDrives();
  const newsList = FoundationRepository.getNewsEvents();
  const requests = FoundationRepository.getAssistanceRequests();

  const notify = (msg: string) => {
    setToastMessage(msg);
    onDataChange();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // UNAUTHENTICATED LOCK SCREEN VIEW
  // ----------------------------------------------------
  if (!operatorUser.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 text-center relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Operator Authentication</h3>
            <p className="text-xs text-slate-400 mt-1">Enter operator credentials to access portal</p>
          </div>

          {/* Body Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operator Email / User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Operator Email / User ID"
                  value={authEmailInput}
                  onChange={e => setAuthEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={authPasswordInput}
                  onChange={e => setAuthPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
              )}
              <span>{authLoading ? 'Authenticating...' : 'Authenticate & Enter Portal'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PAYMENT & UPI BARCODE HANDLERS
  // ----------------------------------------------------
  const handleUpiQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await FoundationRepository.uploadImage(file, 'payment_qr');
        const updated = await FoundationRepository.savePaymentInfo({ upiQrUrl: imageUrl });
        setPaymentInfo(updated);
        notify('UPI Barcode / QR Code updated!');
      } catch (err: any) {
        alert('Barcode upload failed.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSavePaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const updated = await FoundationRepository.savePaymentInfo(paymentInfo);
      setPaymentInfo(updated);
      notify('Payment details & UPI ID saved successfully!');
    } catch (err: any) {
      alert('Failed to save payment info.');
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------------------------
  // LOGO & HERO BG UPLOAD
  // ----------------------------------------------------
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await FoundationRepository.uploadImage(file, 'logos');
        await FoundationRepository.saveCustomLogo(imageUrl);
        notify('Logo updated successfully!');
      } catch (err) {
        alert('Upload failed.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Hero background image must be under 8MB.');
        return;
      }
      setUploading(true);
      try {
        const imageUrl = await FoundationRepository.uploadImage(file, 'backgrounds');
        await FoundationRepository.saveDesktopHeroBg(imageUrl);
        setDesktopBgPreview(imageUrl);
        notify('Home background image updated!');
      } catch (err: any) {
        alert(`Hero background upload failed: ${err?.message || 'Error'}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleResetHeroBg = async () => {
    if (window.confirm('Reset home background to default gradient?')) {
      await FoundationRepository.saveDesktopHeroBg('');
      setDesktopBgPreview(null);
      notify('Home background reset to default.');
    }
  };

  // ----------------------------------------------------
  // LEADER PHOTO DIRECT UPLOAD
  // ----------------------------------------------------
  const handleLeaderPhotoUpload = async (leader: OfficeBearer, file: File) => {
    setUploading(true);
    try {
      const url = await FoundationRepository.uploadImage(file, 'leadership');
      const updated = { ...leader, imageUrl: url };
      await FoundationRepository.saveLeadershipMember(updated);
      notify(`Updated photo for ${leader.nameEn}`);
    } catch {
      alert('Photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleMoveLeader = async (id: string, direction: 'up' | 'down') => {
    setUploading(true);
    await FoundationRepository.moveLeader(id, direction);
    setUploading(false);
    notify('Leadership display order updated');
  };

  const handleStartEditLeader = (leader: OfficeBearer) => {
    setEditingLeaderId(leader.id);
    setEditLeaderData(leader);
  };

  const handleSaveLeaderEdit = async () => {
    if (!editingLeaderId) return;
    setUploading(true);

    const nameEn = editLeaderData.nameEn || '';
    const roleEn = editLeaderData.roleEn || '';

    const updatedLeader: OfficeBearer = {
      ...(editLeaderData as OfficeBearer),
      nameEn,
      roleEn,
      nameOr: editLeaderData.nameOr || nameEn,
      roleOr: editLeaderData.roleOr || roleEn,
      displayOrder: editLeaderData.displayOrder !== undefined ? Number(editLeaderData.displayOrder) : undefined
    };

    await FoundationRepository.saveLeadershipMember(updatedLeader);
    setUploading(false);
    setEditingLeaderId(null);
    notify('Leader saved successfully!');
  };

  const handleDeleteLeader = async (id: string, name: string) => {
    if (confirm(`Remove "${name}"?`)) {
      setUploading(true);
      await FoundationRepository.deleteLeadershipMember(id);
      setUploading(false);
      notify(`Removed ${name}`);
    }
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderNameEn || !newLeaderRoleEn) return;

    const defaultImg = leaderImagePreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

    const newMember: OfficeBearer = {
      id: 'leader-' + Date.now(),
      nameEn: newLeaderNameEn,
      nameOr: newLeaderNameOr.trim() || transliterateNameToOdia(newLeaderNameEn),
      roleEn: newLeaderRoleEn,
      roleOr: newLeaderRoleOr.trim() || translateDesignationToOdia(newLeaderRoleEn),
      category: newLeaderCategory,
      imageUrl: defaultImg,
      phone: newLeaderPhone || '9777085775',
      bioEn: 'Dedicated community leader serving Babujang, Cuttack.',
      bioOr: 'ବାବୁଜଙ୍ଗ ଓ କଟକ ଅଞ୍ଚଳରେ ନିଷ୍ଠାପର ଭାବେ ଗ୍ରାମୀଣ ସେବା ପ୍ରଦାନ।',
      displayOrder: newLeaderDisplayOrder !== undefined ? Number(newLeaderDisplayOrder) : undefined
    };

    setUploading(true);
    await FoundationRepository.saveLeadershipMember(newMember);
    setUploading(false);

    setNewLeaderNameEn('');
    setNewLeaderNameOr('');
    setNewLeaderRoleEn('');
    setNewLeaderRoleOr('');
    setNewLeaderPhone('');
    setNewLeaderDisplayOrder(undefined);
    setLeaderImagePreview(null);
    setShowAddLeader(false);

    notify('Added new leader!');
  };

  // ----------------------------------------------------
  // DRIVE EDIT / ADD / PHOTO UPLOAD
  // ----------------------------------------------------
  const handleStartEditDrive = (drive: DonationDrive) => {
    setEditingDriveId(drive.id);
    setEditDriveData(drive);
  };

  const handleSaveDriveEdit = async () => {
    if (!editingDriveId) return;
    setUploading(true);
    await FoundationRepository.saveDrive(editDriveData as DonationDrive);
    setUploading(false);
    setEditingDriveId(null);
    notify('Drive updated successfully!');
  };

  const handleDrivePhotoUpload = async (drive: DonationDrive, file: File) => {
    setUploading(true);
    try {
      const url = await FoundationRepository.uploadImage(file, 'drives');
      const updated = { ...drive, imageUrl: url };
      await FoundationRepository.saveDrive(updated);
      notify(`Updated cover photo for "${drive.titleEn}"`);
    } catch (err: any) {
      alert(`Drive photo upload failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDrive = async (id: string, title: string) => {
    if (confirm(`Delete drive "${title}"?`)) {
      setUploading(true);
      await FoundationRepository.deleteDrive(id);
      setUploading(false);
      notify(`Deleted ${title}`);
    }
  };

  const handleAddDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveTitleEn) return;

    const defaultCover = driveImagePreview || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';

    const newDrive: DonationDrive = {
      id: 'drive-' + Date.now(),
      titleEn: newDriveTitleEn,
      titleOr: newDriveTitleOr || newDriveTitleEn,
      category: newDriveCategory,
      descriptionEn: 'Relief assistance drive organized for community welfare in Babujang, Cuttack.',
      descriptionOr: 'ବାବୁଜଙ୍ଗ ଏବଂ କଟକ ଅଞ୍ଚଳର ଜନସାଧାରଣଙ୍କ ସେବା ପାଇଁ ସାହାଯ୍ୟ ଅଭିଯାନ।',
      targetAmount: Number(newDriveTarget) || 50000,
      raisedAmount: 0,
      donorCount: 0,
      endDate: '31 Dec 2026',
      imageUrl: defaultCover,
      itemsNeeded: ['Free Ration', 'Drinking Water', 'Blankets'],
      isFeatured: true
    };

    setUploading(true);
    await FoundationRepository.saveDrive(newDrive);
    setUploading(false);

    setNewDriveTitleEn('');
    setNewDriveTitleOr('');
    setNewDriveTarget(50000);
    setDriveImagePreview(null);
    setShowAddDrive(false);

    notify('New drive created!');
  };

  // ----------------------------------------------------
  // GALLERY MULTIPLE PHOTO UPLOAD
  // ----------------------------------------------------
  const handleGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedGalleryFiles(prev => [...prev, ...files]);
    const newPreviews = files.map((file: File) => URL.createObjectURL(file));
    setGalleryFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveGalleryPreview = (index: number) => {
    setSelectedGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGalleryFiles.length === 0) {
      alert('Please select at least one photo to upload.');
      return;
    }

    setUploading(true);
    const total = selectedGalleryFiles.length;

    try {
      for (let i = 0; i < total; i++) {
        const file = selectedGalleryFiles[i];
        setUploadProgress(`Uploading photo ${i + 1} of ${total}...`);
        
        const imageUrl = await FoundationRepository.uploadImage(file, 'gallery');
        const itemTitle = newGalleryTitle.trim()
          ? (total > 1 ? `${newGalleryTitle.trim()} #${i + 1}` : newGalleryTitle.trim())
          : 'Community Relief Activity';

        const newItem: GalleryItem = {
          id: `gal-${Date.now()}-${i}`,
          titleEn: itemTitle,
          titleOr: itemTitle,
          category: newGalleryCategory,
          imageUrl,
          date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          location: 'Babujang, Cuttack'
        };

        await FoundationRepository.saveGalleryItem(newItem);
      }

      notify(`Successfully uploaded ${total} photo${total > 1 ? 's' : ''} to Gallery!`);
      setSelectedGalleryFiles([]);
      setGalleryFilePreviews([]);
      setNewGalleryTitle('');
    } catch (err: any) {
      alert(`Gallery upload error: ${err?.message || 'Failed to upload'}`);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Delete this gallery item?')) {
      setUploading(true);
      await FoundationRepository.deleteGalleryItem(id);
      setUploading(false);
      setGalleryTick(prev => prev + 1);
      notify('Gallery item deleted successfully.');
    }
  };

  // ----------------------------------------------------
  // GALLERY VIDEO UPLOAD / EMBED HANDLER
  // ----------------------------------------------------
  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUploadFile && !videoDirectUrl.trim()) {
      alert('Please choose a video file to upload or enter a video URL.');
      return;
    }

    setUploading(true);
    try {
      let finalVideoUrl = videoDirectUrl.trim();
      if (videoUploadFile) {
        setUploadProgress('Uploading video file (this may take a few moments)...');
        finalVideoUrl = await FoundationRepository.uploadMedia(videoUploadFile, 'gallery_videos');
      }

      let finalThumbnail = videoCoverPreview || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';

      const itemTitle = videoTitle.trim() || 'Foundation Field Activity Video';

      const newItem: GalleryItem = {
        id: `gal-vid-${Date.now()}`,
        titleEn: itemTitle,
        titleOr: itemTitle,
        category: videoCategory,
        imageUrl: finalThumbnail,
        videoUrl: finalVideoUrl,
        mediaType: 'video',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        location: 'Babujang, Cuttack'
      };

      await FoundationRepository.saveGalleryItem(newItem);
      notify('Video added to Gallery successfully!');
      
      setVideoUploadFile(null);
      setVideoFilePreview(null);
      setVideoDirectUrl('');
      setVideoTitle('');
      setVideoCoverPreview(null);
    } catch (err: any) {
      alert(`Video upload failed: ${err?.message || 'Error uploading video'}`);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // ----------------------------------------------------
  // NEWS & UPCOMING EVENTS HANDLERS
  // ----------------------------------------------------
  const handleStartEditNews = (item: NewsEventItem) => {
    setEditingNewsId(item.id);
    setEditNewsData(item);
  };

  const handleSaveNewsEdit = async () => {
    if (!editingNewsId) return;
    setUploading(true);

    const titleEn = editNewsData.titleEn || '';
    const updatedNews: NewsEventItem = {
      ...(editNewsData as NewsEventItem),
      titleEn,
      titleHi: editNewsData.titleHi || titleEn,
      titleOr: editNewsData.titleOr || transliterateNameToOdia(titleEn),
      location: editNewsData.location || 'Babujang, Cuttack',
      date: editNewsData.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: editNewsData.category || 'news',
      summaryEn: editNewsData.summaryEn || '',
      summaryHi: editNewsData.summaryHi || editNewsData.summaryEn || '',
      summaryOr: editNewsData.summaryOr || editNewsData.summaryEn || '',
      imageUrl: editNewsData.imageUrl || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
      isUpcoming: !!editNewsData.isUpcoming
    };

    await FoundationRepository.saveNewsEvent(updatedNews);
    setUploading(false);
    setEditingNewsId(null);
    notify('News & Event item saved successfully!');
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      setUploading(true);
      await FoundationRepository.deleteNewsEvent(id);
      setUploading(false);
      notify(`Deleted "${title}"`);
    }
  };

  const handleNewsPhotoUpload = async (newsItem: NewsEventItem, file: File) => {
    setUploading(true);
    try {
      const url = await FoundationRepository.uploadImage(file, 'news');
      const updated = { ...newsItem, imageUrl: url };
      await FoundationRepository.saveNewsEvent(updated);
      notify(`Updated cover photo for "${newsItem.titleEn}"`);
    } catch (err: any) {
      alert(`Photo upload failed: ${err?.message || 'Error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitleEn.trim()) {
      alert('Please enter an event or news title.');
      return;
    }

    setUploading(true);
    const defaultCover = newsImagePreview || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800';

    const newItem: NewsEventItem = {
      id: 'news-' + Date.now(),
      titleEn: newNewsTitleEn.trim(),
      titleHi: newNewsTitleHi.trim() || newNewsTitleEn.trim(),
      titleOr: newNewsTitleOr.trim() || transliterateNameToOdia(newNewsTitleEn.trim()),
      date: newNewsDate.trim() || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: newNewsCategory,
      location: newNewsLocation.trim() || 'Babujang, Cuttack',
      summaryEn: newNewsSummaryEn.trim() || 'Community development and welfare initiative organized by Social Welfare Foundation.',
      summaryHi: newNewsSummaryHi.trim() || newNewsSummaryEn.trim() || 'सोशल वेलफेयर फाउंडेशन द्वारा आयोजित समाज कल्याण कार्यक्रम।',
      summaryOr: newNewsSummaryOr.trim() || newNewsSummaryEn.trim() || 'ସୋସିଆଲ ୱେଲଫେୟାର ଫାଉଣ୍ଡେସନ ଦ୍ୱାରା ଆୟୋଜିତ କଲ୍ୟାଣମୂଳକ କାର୍ଯ୍ୟକ୍ରମ।',
      imageUrl: defaultCover,
      isUpcoming: newNewsIsUpcoming
    };

    await FoundationRepository.saveNewsEvent(newItem);
    setUploading(false);

    setNewNewsTitleEn('');
    setNewNewsTitleHi('');
    setNewNewsTitleOr('');
    setNewNewsDate('');
    setNewNewsLocation('Babujang, Cuttack');
    setNewNewsSummaryEn('');
    setNewNewsSummaryHi('');
    setNewNewsSummaryOr('');
    setNewNewsIsUpcoming(false);
    setNewsImagePreview(null);
    setShowAddNews(false);

    notify('News & Event item published successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col my-4 max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-white font-heading">
              Operator Portal
            </h3>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isSupabaseConfigured ? 'Supabase Auth' : 'Offline Mode'}
            </span>
            {operatorUser.email && (
              <span className="text-[11px] text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1 font-mono">
                <User className="w-3 h-3 text-emerald-400" />
                <span>{operatorUser.email}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Sign Out Operator"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Operator Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-lg border border-emerald-500 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Clean Minimal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'leadership'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Leaders & Team</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'drives'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Relief Drives</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'gallery'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Gallery ({galleryItems.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('news_events')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'news_events'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>News & Events ({newsList.length})</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Branding & Background</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Requests ({requests.length})</span>
            </span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-5">

          {/* ======================================================= */}
          {/* TAB 1: LEADERS & TEAM                                   */}
          {/* ======================================================= */}
          {activeTab === 'leadership' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Foundation Office Bearers ({leadership.length})
                </h4>

                <button
                  onClick={() => setShowAddLeader(!showAddLeader)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Leader</span>
                </button>
              </div>

              {/* Add Leader Form (Collapsible) */}
              {showAddLeader && (
                <form onSubmit={handleAddLeader} className="p-4 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Add New Leader Profile</span>
                    <button type="button" onClick={() => setShowAddLeader(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Leader Full Name (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Das"
                        value={newLeaderNameEn}
                        onChange={e => {
                          const val = e.target.value;
                          setNewLeaderNameEn(val);
                          setNewLeaderNameOr(transliterateNameToOdia(val));
                        }}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Designation / Role (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. President / Treasurer"
                        value={newLeaderRoleEn}
                        onChange={e => {
                          const val = e.target.value;
                          setNewLeaderRoleEn(val);
                          setNewLeaderRoleOr(translateDesignationToOdia(val));
                        }}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 9777085775"
                        value={newLeaderPhone}
                        onChange={e => setNewLeaderPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                        <select
                          value={newLeaderCategory}
                          onChange={e => setNewLeaderCategory(e.target.value as any)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="executive">Executive</option>
                          <option value="advisory">Advisory</option>
                          <option value="trustee">Trustee</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Display Order</label>
                        <input
                          type="number"
                          placeholder="e.g. 1"
                          value={newLeaderDisplayOrder ?? ''}
                          onChange={e => setNewLeaderDisplayOrder(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={leaderPhotoInputRef}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await FoundationRepository.uploadImage(file, 'leadership');
                            setLeaderImagePreview(url);
                            setUploading(false);
                            notify('Leader photo uploaded successfully!');
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => leaderPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg border border-slate-300 font-medium"
                      >
                        {leaderImagePreview ? 'Photo Selected ✓' : 'Upload Photo'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Save Leader
                    </button>
                  </div>
                </form>
              )}

              {/* Clean Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leadership.map((member, index) => {
                  const isEditing = editingLeaderId === member.id;

                  if (isEditing) {
                    return (
                      <div key={member.id} className="bg-white p-4 rounded-xl border border-emerald-400 shadow-md space-y-3 sm:col-span-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-xs font-bold text-slate-800">Edit Leader: {member.nameEn}</span>
                          <button onClick={() => setEditingLeaderId(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Full Name (English)</label>
                            <input
                              type="text"
                              value={editLeaderData.nameEn || ''}
                              onChange={e => {
                                const newName = e.target.value;
                                setEditLeaderData(prev => ({ 
                                  ...prev, 
                                  nameEn: newName,
                                  nameOr: prev.nameOr ? prev.nameOr : transliterateNameToOdia(newName)
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Designation / Role (English)</label>
                            <input
                              type="text"
                              value={editLeaderData.roleEn || ''}
                              onChange={e => {
                                const newRole = e.target.value;
                                setEditLeaderData(prev => ({ 
                                  ...prev, 
                                  roleEn: newRole,
                                  roleOr: prev.roleOr ? prev.roleOr : translateDesignationToOdia(newRole)
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Odia Name</label>
                            <input
                              type="text"
                              value={editLeaderData.nameOr || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, nameOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border font-serif"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Odia Role</label>
                            <input
                              type="text"
                              value={editLeaderData.roleOr || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, roleOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border font-serif"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Phone</label>
                            <input
                              type="text"
                              value={editLeaderData.phone || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, phone: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Display Order (1 = Top)</label>
                            <input
                              type="number"
                              placeholder="e.g. 1"
                              value={editLeaderData.displayOrder !== undefined ? editLeaderData.displayOrder : ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, displayOrder: e.target.value ? Number(e.target.value) : undefined })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t">
                          <button
                            type="button"
                            onClick={() => setEditingLeaderId(null)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveLeaderEdit}
                            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={member.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Order Number Badge */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-mono" title={`Display Order: ${member.displayOrder ?? (index + 1)}`}>
                            #{member.displayOrder ?? (index + 1)}
                          </span>
                        </div>

                        {/* Direct Photo Upload Click */}
                        <div className="relative group shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={member.imageUrl} alt={member.nameEn} className="w-full h-full object-cover" />
                          </div>
                          <label className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleLeaderPhotoUpload(member, file);
                              }}
                            />
                          </label>
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-semibold text-slate-900 text-xs truncate">{member.nameEn}</h5>
                          <p className="text-[11px] text-emerald-700 font-medium truncate">{member.roleEn}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move Up / Down Buttons */}
                        <button
                          type="button"
                          onClick={() => handleMoveLeader(member.id, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg"
                          title="Move Leader Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLeader(member.id, 'down')}
                          disabled={index === leadership.length - 1}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg"
                          title="Move Leader Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEditLeader(member)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Edit Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLeader(member.id, member.nameEn)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Remove Leader"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: RELIEF DRIVES                                    */}
          {/* ======================================================= */}
          {activeTab === 'drives' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Relief Drives & Initiatives ({drives.length})
                </h4>

                <button
                  onClick={() => setShowAddDrive(!showAddDrive)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Drive</span>
                </button>
              </div>

              {/* Add Drive Form */}
              {showAddDrive && (
                <form onSubmit={handleAddDrive} className="p-4 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">New Relief Drive</span>
                    <button type="button" onClick={() => setShowAddDrive(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Title (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Free Ration Kit Drive"
                        value={newDriveTitleEn}
                        onChange={e => setNewDriveTitleEn(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Title (Odia)</label>
                      <input
                        type="text"
                        placeholder="e.g. ରାସନ ସାହାଯ୍ୟ"
                        value={newDriveTitleOr}
                        onChange={e => setNewDriveTitleOr(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Goal Target (₹)</label>
                      <input
                        type="number"
                        value={newDriveTarget}
                        onChange={e => setNewDriveTarget(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                      <select
                        value={newDriveCategory}
                        onChange={e => setNewDriveCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      >
                        <option value="ration">Ration & Relief</option>
                        <option value="cloth">Clothes & Blankets</option>
                        <option value="medical">Medical Camps</option>
                        <option value="flood">Emergency Flood</option>
                      </select>
                    </div>
                  </div>

                  {driveImagePreview && (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <img src={driveImagePreview} alt="Drive Cover Preview" className="w-16 h-12 rounded object-cover border" />
                      <span className="text-xs text-emerald-700 font-medium">Cover Photo Uploaded ✓</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={drivePhotoInputRef}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await FoundationRepository.uploadImage(file, 'drives');
                            setDriveImagePreview(url);
                            setUploading(false);
                            notify('Drive cover photo uploaded successfully!');
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => drivePhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg border font-medium flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>{driveImagePreview ? 'Change Cover Photo' : 'Upload Cover Photo'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Publish Drive
                    </button>
                  </div>
                </form>
              )}

              {/* Drives List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {drives.map(drive => {
                  const isEditing = editingDriveId === drive.id;

                  if (isEditing) {
                    return (
                      <div key={drive.id} className="bg-white p-4 rounded-xl border border-emerald-400 shadow-md space-y-3 sm:col-span-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-xs font-bold text-slate-800">Edit Relief Drive</span>
                          <button onClick={() => setEditingDriveId(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Title (English)</label>
                            <input
                              type="text"
                              value={editDriveData.titleEn || ''}
                              onChange={e => setEditDriveData({ ...editDriveData, titleEn: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Title (Odia)</label>
                            <input
                              type="text"
                              value={editDriveData.titleOr || ''}
                              onChange={e => setEditDriveData({ ...editDriveData, titleOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Target Amount (₹)</label>
                            <input
                              type="number"
                              value={editDriveData.targetAmount || 0}
                              onChange={e => setEditDriveData({ ...editDriveData, targetAmount: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Raised Amount (₹)</label>
                            <input
                              type="number"
                              value={editDriveData.raisedAmount || 0}
                              onChange={e => setEditDriveData({ ...editDriveData, raisedAmount: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer inline-flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Upload New Cover Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploading(true);
                                  const url = await FoundationRepository.uploadImage(file, 'drives');
                                  setEditDriveData({ ...editDriveData, imageUrl: url });
                                  setUploading(false);
                                  notify('Cover photo updated for draft!');
                                }
                              }}
                            />
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingDriveId(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveDriveEdit}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                            >
                              Save Drive Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={drive.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Direct Cover Photo Upload Button on Drive Card */}
                        <div className="relative group shrink-0" title="Click or hover to change drive cover photo">
                          <img src={drive.imageUrl} alt={drive.titleEn} className="w-14 h-14 rounded-lg object-cover" />
                          <label className="absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleDrivePhotoUpload(drive, file);
                              }}
                            />
                          </label>
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-semibold text-slate-900 text-xs truncate">{drive.titleEn}</h5>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ₹{drive.raisedAmount.toLocaleString()} / ₹{drive.targetAmount.toLocaleString()}
                          </p>
                          <label className="inline-block text-[10px] text-emerald-700 hover:underline cursor-pointer mt-1 font-medium">
                            + Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleDrivePhotoUpload(drive, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEditDrive(drive)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Edit Drive Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDrive(drive.id, drive.titleEn)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                          title="Delete Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: GALLERY & MEDIA (PHOTOS + VIDEOS)                */}
          {/* ======================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Toggle between Photo Upload & Video Upload */}
              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Media Upload Mode:</span>
                  <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode('photos')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        galleryUploadMode === 'photos'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Upload Photos</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode('video')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        galleryUploadMode === 'video'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                      </span>
                    </button>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  {galleryItems.filter(g => g.mediaType === 'video').length} Videos • {galleryItems.filter(g => g.mediaType !== 'video').length} Photos
                </span>
              </div>

              {/* Mode A: Batch Photo Upload Form */}
              {galleryUploadMode === 'photos' && (
                <form onSubmit={handleBatchGalleryUpload} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Batch Photo Upload (Multiple Selection)</span>
                    </div>
                    {selectedGalleryFiles.length > 0 && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {selectedGalleryFiles.length} photo{selectedGalleryFiles.length > 1 ? 's' : ''} ready
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Select Photos (Multiple)</label>
                      <input
                        type="file"
                        multiple
                        ref={galleryInputRef}
                        onChange={handleGalleryFilesSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="w-full px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>{selectedGalleryFiles.length > 0 ? `Add More Photos (${selectedGalleryFiles.length})` : 'Choose Photos (Select Multiple)'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Caption / Title Prefix</label>
                      <input
                        type="text"
                        placeholder="e.g. Flood Relief Distribution"
                        value={newGalleryTitle}
                        onChange={e => setNewGalleryTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                      <select
                        value={newGalleryCategory}
                        onChange={e => setNewGalleryCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      >
                        <option value="relief">Relief & Food Drive</option>
                        <option value="medical">Medical Camp</option>
                        <option value="cultural">Cultural & Festival</option>
                        <option value="distribution">Blanket & Clothes</option>
                      </select>
                    </div>
                  </div>

                  {/* Selected Files Preview Grid */}
                  {galleryFilePreviews.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-medium text-slate-500 mb-2">
                        Selected Photos Preview ({galleryFilePreviews.length}):
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {galleryFilePreviews.map((previewUrl, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-300 bg-white">
                            <img src={previewUrl} alt={`Selected preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPreview(idx)}
                              className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress Status */}
                  {uploadProgress && (
                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-center animate-pulse">
                      {uploadProgress}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    {selectedGalleryFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGalleryFiles([]);
                          setGalleryFilePreviews([]);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Clear Selection
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={uploading || selectedGalleryFiles.length === 0}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      {uploading 
                        ? 'Uploading Photos...' 
                        : `Upload ${selectedGalleryFiles.length > 0 ? selectedGalleryFiles.length : ''} Photo${selectedGalleryFiles.length > 1 ? 's' : ''} to Gallery`
                      }
                    </button>
                  </div>
                </form>
              )}

              {/* Mode B: Video Upload Form */}
              {galleryUploadMode === 'video' && (
                <form onSubmit={handleVideoUpload} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Upload Foundation Video (MP4 / WebM or Direct URL)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Video Gallery
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Video Title / Caption</label>
                      <input
                        type="text"
                        placeholder="e.g. Annual Community Service & Food Drive"
                        value={videoTitle}
                        onChange={e => setVideoTitle(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                      <select
                        value={videoCategory}
                        onChange={e => setVideoCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="relief">Relief & Food Drive</option>
                        <option value="medical">Medical Camp</option>
                        <option value="cultural">Cultural & Festival</option>
                        <option value="distribution">Blanket & Clothes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Upload Video File (.mp4, .webm, .mov)</label>
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoUploadFile(file);
                            setVideoFilePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => videoFileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2"
                        >
                          <Video className="w-4 h-4 text-emerald-600" />
                          <span>{videoUploadFile ? videoUploadFile.name : 'Choose Video File (Upload)'}</span>
                        </button>
                        {videoUploadFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setVideoUploadFile(null);
                              setVideoFilePreview(null);
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Or Direct Video URL (YouTube, MP4 Link)</label>
                      <input
                        type="url"
                        placeholder="https://example.com/video.mp4 or YouTube link"
                        value={videoDirectUrl}
                        onChange={e => setVideoDirectUrl(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Optional Custom Cover Photo for Video */}
                  <div className="pt-2 border-t flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={videoCoverInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await FoundationRepository.uploadImage(file, 'gallery');
                            setVideoCoverPreview(url);
                            setUploading(false);
                            notify('Video cover thumbnail set!');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => videoCoverInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg border font-medium flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>{videoCoverPreview ? 'Custom Thumbnail Selected ✓' : 'Add Video Thumbnail (Optional)'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading || (!videoUploadFile && !videoDirectUrl.trim())}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Processing Video...' : 'Publish Video to Gallery'}</span>
                    </button>
                  </div>

                  {/* Video File Preview */}
                  {videoFilePreview && (
                    <div className="mt-2 p-2 bg-slate-900 rounded-xl max-w-sm">
                      <video src={videoFilePreview} controls className="w-full h-36 rounded-lg object-cover" />
                    </div>
                  )}
                </form>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galleryItems.map(item => {
                  const isVideo = item.mediaType === 'video' || Boolean(item.videoUrl);

                  return (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square shadow-2xs">
                      <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Video Indicator Badge */}
                      {isVideo && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/90 text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Video</span>
                        </div>
                      )}

                      {/* ALWAYS VISIBLE Delete Button at Top Right for easy tapping on Mobile & Desktop */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGallery(item.id);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-md z-20 flex items-center justify-center transition-transform"
                        title="Delete Media Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Bottom Caption Bar */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-2 pt-4 text-white text-[11px] font-medium truncate">
                        {item.titleEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: NEWS & UPCOMING EVENTS                           */}
          {/* ======================================================= */}
          {activeTab === 'news_events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>News & Upcoming Events ({newsList.length})</span>
                </h4>

                <button
                  onClick={() => setShowAddNews(!showAddNews)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add News / Event</span>
                </button>
              </div>

              {/* Add News / Event Form */}
              {showAddNews && (
                <form onSubmit={handleAddNews} className="p-4 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Publish News or Upcoming Event</span>
                    <button type="button" onClick={() => setShowAddNews(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Headline / Title (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Free Health & Eye Checkup Camp at Babujang"
                        value={newNewsTitleEn}
                        onChange={e => {
                          const val = e.target.value;
                          setNewNewsTitleEn(val);
                          setNewNewsTitleOr(transliterateNameToOdia(val));
                        }}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Date (Display)</label>
                      <input
                        type="text"
                        placeholder="e.g. 25 Nov 2024"
                        value={newNewsDate}
                        onChange={e => setNewNewsDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Babujang High School Ground"
                        value={newNewsLocation}
                        onChange={e => setNewNewsLocation(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                      <select
                        value={newNewsCategory}
                        onChange={e => setNewNewsCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="event">Upcoming Event</option>
                        <option value="news">Foundation News</option>
                        <option value="health">Medical & Health</option>
                        <option value="education">Education & Youth</option>
                        <option value="relief">Relief & Welfare</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNewsIsUpcoming}
                          onChange={e => setNewNewsIsUpcoming(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs font-semibold text-slate-700">Mark as Upcoming Event (Highlight on Home Page)</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Summary / Details (English)</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of the initiative, key activities, and community impact..."
                        value={newNewsSummaryEn}
                        onChange={e => setNewNewsSummaryEn(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={newsPhotoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await FoundationRepository.uploadImage(file, 'news');
                            setNewsImagePreview(url);
                            setUploading(false);
                            notify('Cover photo uploaded for news item!');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => newsPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg border font-medium flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>{newsImagePreview ? 'Photo Selected ✓' : 'Upload Cover Photo'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Publish Item
                    </button>
                  </div>
                </form>
              )}

              {/* News & Events List */}
              <div className="space-y-3">
                {newsList.map(item => {
                  const isEditing = editingNewsId === item.id;

                  if (isEditing) {
                    return (
                      <div key={item.id} className="bg-white p-4 rounded-xl border border-emerald-400 shadow-md space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-xs font-bold text-slate-800">Edit News / Event: {item.titleEn}</span>
                          <button onClick={() => setEditingNewsId(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Headline (English)</label>
                            <input
                              type="text"
                              value={editNewsData.titleEn || ''}
                              onChange={e => {
                                const newTitle = e.target.value;
                                setEditNewsData({
                                  ...editNewsData,
                                  titleEn: newTitle,
                                  titleOr: transliterateNameToOdia(newTitle)
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Date</label>
                            <input
                              type="text"
                              value={editNewsData.date || ''}
                              onChange={e => setEditNewsData({ ...editNewsData, date: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Location</label>
                            <input
                              type="text"
                              value={editNewsData.location || ''}
                              onChange={e => setEditNewsData({ ...editNewsData, location: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Summary (English)</label>
                            <textarea
                              rows={2}
                              value={editNewsData.summaryEn || ''}
                              onChange={e => setEditNewsData({ ...editNewsData, summaryEn: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Headline (Odia)</label>
                            <input
                              type="text"
                              value={editNewsData.titleOr || ''}
                              onChange={e => setEditNewsData({ ...editNewsData, titleOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-serif"
                            />
                          </div>

                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(editNewsData.isUpcoming)}
                                onChange={e => setEditNewsData({ ...editNewsData, isUpcoming: e.target.checked })}
                                className="w-4 h-4 text-emerald-600 rounded"
                              />
                              <span className="text-xs font-semibold text-slate-700">Mark as Upcoming Event</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer inline-flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Change Cover Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploading(true);
                                  const url = await FoundationRepository.uploadImage(file, 'news');
                                  setEditNewsData({ ...editNewsData, imageUrl: url });
                                  setUploading(false);
                                  notify('Cover photo updated for draft!');
                                }
                              }}
                            />
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingNewsId(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveNewsEdit}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                            >
                              Save News Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Direct Cover Photo Upload Button on News Card */}
                        <div className="relative group shrink-0" title="Click or hover to change cover photo">
                          <img src={item.imageUrl} alt={item.titleEn} className="w-14 h-14 rounded-lg object-cover" />
                          <label className="absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleNewsPhotoUpload(item, file);
                              }}
                            />
                          </label>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-semibold text-slate-900 text-xs truncate max-w-sm">{item.titleEn}</h5>
                            {item.isUpcoming && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Upcoming Event
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.summaryEn}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                            <span>📅 {item.date}</span>
                            <span>📍 {item.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEditNews(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Edit News / Event"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id, item.titleEn)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: BRANDING & PAYMENT QR                            */}
          {/* ======================================================= */}
          {activeTab === 'upload' && (
            <div className="space-y-4 max-w-2xl mx-auto">

              {/* NGO Official Logo Card (Restricted to Operator Portal) */}
              <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Official Foundation Emblem & Logo Settings</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Operator Access Only
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload or change the official Social Welfare Foundation emblem shown on the website header and footer. Viewers on the public website cannot modify or upload logos.
                </p>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <Logo allowUpload={true} size="lg" />
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-slate-800 block">Click logo on the left to upload a custom image</span>
                    <span className="text-slate-500 block">Supports PNG, JPG or WebP (under 5MB). Hover and click the red reset button to revert to the default official emblem anytime.</span>
                  </div>
                </div>
              </div>

              {/* Donate Section UPI Barcode & Payment Details Card */}
              <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <span>NGO Donate UPI Barcode & Payment Settings</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Live in Donate Section
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload the official UPI Payment QR Code Barcode image for donors to scan and pay directly to the foundation bank account.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex flex-col items-center justify-center space-y-2 sm:col-span-1">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center overflow-hidden">
                      <img src={paymentInfo.upiQrUrl} alt="Payment UPI Barcode" className="w-full h-full object-contain" />
                    </div>
                    <input
                      type="file"
                      ref={upiQrInputRef}
                      onChange={handleUpiQrUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => upiQrInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Upload New Barcode</span>
                    </button>
                  </div>

                  <form onSubmit={handleSavePaymentDetails} className="sm:col-span-2 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">UPI ID / VPA Address</label>
                      <input
                        type="text"
                        value={paymentInfo.upiId}
                        onChange={e => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
                        placeholder="e.g. socialwelfare@upi"
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700">Bank Account No.</label>
                        <input
                          type="text"
                          value={paymentInfo.accountNo}
                          onChange={e => setPaymentInfo({ ...paymentInfo, accountNo: e.target.value })}
                          placeholder="e.g. 398201000456"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700">IFSC Code</label>
                        <input
                          type="text"
                          value={paymentInfo.ifscCode}
                          onChange={e => setPaymentInfo({ ...paymentInfo, ifscCode: e.target.value })}
                          placeholder="e.g. SBIN0001234"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700">Bank Name</label>
                        <input
                          type="text"
                          value={paymentInfo.bankName}
                          onChange={e => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                          placeholder="e.g. State Bank of India"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700">Account Holder</label>
                        <input
                          type="text"
                          value={paymentInfo.accountHolder}
                          onChange={e => setPaymentInfo({ ...paymentInfo, accountHolder: e.target.value })}
                          placeholder="e.g. Social Welfare Foundation"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-2xs"
                      >
                        Save Payment & UPI Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Home Page Background Image Upload Card */}
              <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Home Page Hero Backgrounds (Laptop vs Mobile)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Liquid Glass Ready
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  You can set different background photos for Laptop/Desktop screens and Mobile screens so the hero image looks perfectly fitted on both!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Laptop / Desktop Background */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">💻 Laptop / Desktop Background</span>
                    {desktopBgPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-300 h-28 bg-slate-900">
                        <img src={desktopBgPreview} alt="Desktop Hero Background" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-28 bg-slate-200/80 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-xs">
                        Default Stock Hero Active
                      </div>
                    )}
                    <input
                      type="file"
                      ref={desktopBgInputRef}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          const url = await FoundationRepository.uploadImage(file, 'branding');
                          await FoundationRepository.saveDesktopHeroBg(url);
                          setDesktopBgPreview(url);
                          setUploading(false);
                          notify('Laptop background image updated!');
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => desktopBgInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{desktopBgPreview ? 'Change Laptop BG' : 'Upload Laptop BG'}</span>
                    </button>
                  </div>

                  {/* Mobile Screen Background */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">📱 Mobile Screen Background</span>
                    {mobileBgPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-300 h-28 bg-slate-900">
                        <img src={mobileBgPreview} alt="Mobile Hero Background" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-28 bg-slate-200/80 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-xs">
                        Same as Laptop BG
                      </div>
                    )}
                    <input
                      type="file"
                      ref={mobileBgInputRef}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          const url = await FoundationRepository.uploadImage(file, 'branding');
                          await FoundationRepository.saveMobileHeroBg(url);
                          setMobileBgPreview(url);
                          setUploading(false);
                          notify('Mobile background image updated!');
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => mobileBgInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-sky-200" />
                      <span>{mobileBgPreview ? 'Change Mobile BG' : 'Upload Mobile BG'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo Upload Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Official Foundation Emblem / Logo
                </h4>
                <p className="text-xs text-slate-500">
                  Upload custom emblem image to reflect across website headers, certificates, and footer.
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload New Emblem</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Reset logo back to default official emblem?')) {
                        await FoundationRepository.saveCustomLogo('');
                        notify('Logo reset to default emblem.');
                      }
                    }}
                    disabled={uploading}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Logo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 5: ASSISTANCE REQUESTS                              */}
          {/* ======================================================= */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Submitted Public Aid Applications ({requests.length})
              </h4>

              {requests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border">
                  No public assistance applications submitted yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map(req => (
                    <div key={req.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{req.applicantName} ({req.phone})</span>
                        <span className="text-[10px] text-slate-400 font-mono">{req.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600">{req.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono">Location: {req.villagePanchayat}, {req.district}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
