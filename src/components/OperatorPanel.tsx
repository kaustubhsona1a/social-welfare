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
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Move,
  Newspaper,
  Calendar,
  MapPin,
  Bell,
  Megaphone,
  Tag,
  Video,
  Play,
  Film,
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

  const [activeTab, setActiveTab] = useState<'leadership' | 'drives' | 'news' | 'gallery' | 'upload' | 'requests'>('leadership');
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- LEADER EDIT / ADD / REORDER STATE ---
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [editLeaderData, setEditLeaderData] = useState<Partial<OfficeBearer>>({});
  const [draggedLeaderIndex, setDraggedLeaderIndex] = useState<number | null>(null);
  const [dragOverLeaderIndex, setDragOverLeaderIndex] = useState<number | null>(null);
  
  const [showAddLeader, setShowAddLeader] = useState(false);
  const [newLeaderNameEn, setNewLeaderNameEn] = useState('');
  const [newLeaderNameOr, setNewLeaderNameOr] = useState('');
  const [newLeaderRoleEn, setNewLeaderRoleEn] = useState('');
  const [newLeaderRoleOr, setNewLeaderRoleOr] = useState('');
  const [newLeaderCategory, setNewLeaderCategory] = useState<'executive' | 'advisory' | 'trustee'>('executive');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
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

  // --- NEWS & UPCOMING EVENTS STATE ---
  const [newsFilter, setNewsFilter] = useState<'all' | 'news' | 'event' | 'press' | 'upcoming'>('all');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editNewsData, setEditNewsData] = useState<Partial<NewsEventItem>>({});

  const [showAddNews, setShowAddNews] = useState(false);
  const [newNewsTitleEn, setNewNewsTitleEn] = useState('');
  const [newNewsTitleHi, setNewNewsTitleHi] = useState('');
  const [newNewsTitleOr, setNewNewsTitleOr] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'news' | 'event' | 'press'>('news');
  const [newNewsDate, setNewNewsDate] = useState('');
  const [newNewsLocation, setNewNewsLocation] = useState('');
  const [newNewsSummaryEn, setNewNewsSummaryEn] = useState('');
  const [newNewsSummaryHi, setNewNewsSummaryHi] = useState('');
  const [newNewsSummaryOr, setNewNewsSummaryOr] = useState('');
  const [newNewsIsUpcoming, setNewNewsIsUpcoming] = useState(false);
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null);

  // --- GALLERY STATE (PHOTOS & VIDEOS) ---
  const [galleryTabMode, setGalleryTabMode] = useState<'photo' | 'video'>('photo');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryItem['category']>('relief');
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Video Upload States
  const [videoUploadMode, setVideoUploadMode] = useState<'file' | 'link'>('file');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoDurationInput, setVideoDurationInput] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoTitleOr, setVideoTitleOr] = useState('');
  const [videoTitleHi, setVideoTitleHi] = useState('');
  const [videoCategory, setVideoCategory] = useState<GalleryItem['category']>('relief');
  const [videoLocation, setVideoLocation] = useState('Babujang, Cuttack');
  const [videoDate, setVideoDate] = useState(new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }));
  const [videoPosterFile, setVideoPosterFile] = useState<File | null>(null);
  const [videoPosterPreview, setVideoPosterPreview] = useState<string | null>(null);
  const [videoPreviewModalItem, setVideoPreviewModalItem] = useState<GalleryItem | null>(null);

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
  const leaderPhotoInputRef = useRef<HTMLInputElement>(null);
  const drivePhotoInputRef = useRef<HTMLInputElement>(null);
  const upiQrInputRef = useRef<HTMLInputElement>(null);
  const newsPhotoInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoPosterInputRef = useRef<HTMLInputElement>(null);

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
  const requests = FoundationRepository.getAssistanceRequests();
  const newsEvents = FoundationRepository.getNewsEvents();

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
      nameOr: getOdiaName(nameEn, editLeaderData.nameOr),
      roleOr: getOdiaRole(roleEn, editLeaderData.roleOr),
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
      nameOr: newLeaderNameOr && hasOdiaScript(newLeaderNameOr) ? newLeaderNameOr : transliterateNameToOdia(newLeaderNameEn),
      roleEn: newLeaderRoleEn,
      roleOr: newLeaderRoleOr && hasOdiaScript(newLeaderRoleOr) ? newLeaderRoleOr : translateDesignationToOdia(newLeaderRoleEn),
      category: newLeaderCategory,
      imageUrl: defaultImg,
      phone: newLeaderPhone || '9777085775',
      bioEn: 'Dedicated community leader serving Babujang, Cuttack.',
      bioOr: 'ବାବୁଜଙ୍ଗ ଓ କଟକ ଅଞ୍ଚଳରେ ନିଷ୍ଠାପର ଭାବେ ଗ୍ରାମୀଣ ସେବା ପ୍ରଦାନ।'
    };

    setUploading(true);
    await FoundationRepository.saveLeadershipMember(newMember);
    setUploading(false);

    setNewLeaderNameEn('');
    setNewLeaderNameOr('');
    setNewLeaderRoleEn('');
    setNewLeaderRoleOr('');
    setNewLeaderPhone('');
    setLeaderImagePreview(null);
    setShowAddLeader(false);

    notify('Added new leader!');
  };

  // ----------------------------------------------------
  // LEADER REORDERING / DRAG & DROP
  // ----------------------------------------------------
  const handleMoveLeader = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= leadership.length || fromIndex === toIndex) return;
    const updated = [...leadership];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    await FoundationRepository.reorderLeadership(updated);
    notify(`Order updated: "${movedItem.nameEn}" is now at position #${toIndex + 1}`);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLeaderIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverLeaderIndex !== index) {
      setDragOverLeaderIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedLeaderIndex !== null ? draggedLeaderIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
    setDraggedLeaderIndex(null);
    setDragOverLeaderIndex(null);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    await handleMoveLeader(sourceIndex, targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedLeaderIndex(null);
    setDragOverLeaderIndex(null);
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
  // GALLERY PHOTO & VIDEO UPLOAD HANDLERS
  // ----------------------------------------------------
  const getYouTubeThumbnail = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
    return null;
  };

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
          mediaType: 'photo',
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

  // Video Handlers
  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      alert('Video file is larger than 150MB. Please choose a smaller video or compress it.');
      return;
    }

    setVideoFile(file);
    const preview = URL.createObjectURL(file);
    setVideoFilePreview(preview);

    // Auto generate video thumbnail from video frame
    try {
      setUploadProgress('Generating video thumbnail...');
      const thumb = await FoundationRepository.generateVideoThumbnail(file);
      setVideoPosterPreview(thumb);
    } catch {
      // ignore
    } finally {
      setUploadProgress(null);
    }
  };

  const handleVideoPosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoPosterFile(file);
      setVideoPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videoUploadMode === 'file' && !videoFile) {
      alert('Please select a video file (MP4, WebM, or MOV).');
      return;
    }

    if (videoUploadMode === 'link' && !videoUrlInput.trim()) {
      alert('Please enter a valid YouTube, Vimeo or MP4 video URL.');
      return;
    }

    if (!videoTitleEn.trim()) {
      alert('Please provide a title for the video.');
      return;
    }

    setUploading(true);
    setUploadProgress('Processing video upload...');

    try {
      let finalVideoUrl = '';

      if (videoUploadMode === 'file' && videoFile) {
        setUploadProgress('Uploading video file to storage...');
        finalVideoUrl = await FoundationRepository.uploadMedia(videoFile, 'videos');
      } else {
        finalVideoUrl = videoUrlInput.trim();
      }

      let finalPosterUrl = videoPosterPreview || '';

      if (videoPosterFile) {
        setUploadProgress('Uploading cover poster...');
        finalPosterUrl = await FoundationRepository.uploadImage(videoPosterFile, 'gallery_posters');
      } else if (!finalPosterUrl) {
        const ytThumb = getYouTubeThumbnail(finalVideoUrl);
        if (ytThumb) {
          finalPosterUrl = ytThumb;
        } else {
          finalPosterUrl = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';
        }
      }

      const newVideoItem: GalleryItem = {
        id: `vid-${Date.now()}`,
        titleEn: videoTitleEn.trim(),
        titleHi: videoTitleHi.trim() || undefined,
        titleOr: videoTitleOr.trim() || videoTitleEn.trim(),
        category: videoCategory,
        mediaType: 'video',
        videoUrl: finalVideoUrl,
        imageUrl: finalPosterUrl,
        date: videoDate.trim() || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        location: videoLocation.trim() || 'Babujang, Cuttack',
        duration: videoDurationInput.trim() || undefined
      };

      await FoundationRepository.saveGalleryItem(newVideoItem);
      notify('Video posted successfully to Gallery!');

      // Reset form
      setVideoFile(null);
      setVideoFilePreview(null);
      setVideoPosterFile(null);
      setVideoPosterPreview(null);
      setVideoUrlInput('');
      setVideoDurationInput('');
      setVideoTitleEn('');
      setVideoTitleHi('');
      setVideoTitleOr('');
    } catch (err: any) {
      alert(`Failed to save video: ${err?.message || 'Error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Delete this item from gallery?')) {
      setUploading(true);
      await FoundationRepository.deleteGalleryItem(id);
      setUploading(false);
      setGalleryTick(prev => prev + 1);
      notify('Gallery item deleted successfully.');
    }
  };

  // ----------------------------------------------------
  // NEWS & UPCOMING EVENTS HANDLERS
  // ----------------------------------------------------
  const handleStartEditNews = (item: NewsEventItem) => {
    setEditingNewsId(item.id);
    setEditNewsData({ ...item });
  };

  const handleCancelNewsEdit = () => {
    setEditingNewsId(null);
    setEditNewsData({});
  };

  const handleSaveNewsEdit = async () => {
    if (!editingNewsId || !editNewsData) return;
    if (!editNewsData.titleEn?.trim()) {
      alert('English title is required.');
      return;
    }

    setUploading(true);
    const existing = newsEvents.find(n => n.id === editingNewsId);
    const updated: NewsEventItem = {
      id: editingNewsId,
      titleEn: editNewsData.titleEn.trim(),
      titleHi: editNewsData.titleHi?.trim() || editNewsData.titleEn.trim(),
      titleOr: editNewsData.titleOr?.trim() || editNewsData.titleEn.trim(),
      date: editNewsData.date?.trim() || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: editNewsData.category || 'news',
      location: editNewsData.location?.trim() || 'Babujang, Cuttack',
      summaryEn: editNewsData.summaryEn?.trim() || '',
      summaryHi: editNewsData.summaryHi?.trim() || editNewsData.summaryEn?.trim() || '',
      summaryOr: editNewsData.summaryOr?.trim() || editNewsData.summaryEn?.trim() || '',
      imageUrl: editNewsData.imageUrl || existing?.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      isUpcoming: Boolean(editNewsData.isUpcoming)
    };

    await FoundationRepository.saveNewsEvent(updated);
    setUploading(false);
    setEditingNewsId(null);
    setEditNewsData({});
    notify('News & Event item updated successfully!');
  };

  const handleToggleUpcomingNews = async (item: NewsEventItem) => {
    const updated: NewsEventItem = {
      ...item,
      isUpcoming: !item.isUpcoming
    };
    setUploading(true);
    await FoundationRepository.saveNewsEvent(updated);
    setUploading(false);
    notify(updated.isUpcoming ? 'Marked as Upcoming Event!' : 'Removed Upcoming badge.');
  };

  const handleDeleteNews = async (id: string, titleEn: string) => {
    if (confirm(`Are you sure you want to delete "${titleEn}"?`)) {
      setUploading(true);
      await FoundationRepository.deleteNewsEvent(id);
      setUploading(false);
      notify('News item deleted.');
    }
  };

  const handleNewsPhotoUpload = async (item: NewsEventItem, file: File) => {
    try {
      setUploading(true);
      const imageUrl = await FoundationRepository.uploadImage(file, 'news');
      const updated: NewsEventItem = { ...item, imageUrl };
      await FoundationRepository.saveNewsEvent(updated);
      setUploading(false);
      notify('News cover photo updated successfully!');
    } catch (err: any) {
      setUploading(false);
      alert(`Photo upload failed: ${err?.message || 'Error uploading image'}`);
    }
  };

  const handleAddNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitleEn.trim()) {
      alert('Please provide a title in English.');
      return;
    }

    const newItem: NewsEventItem = {
      id: `news-${Date.now()}`,
      titleEn: newNewsTitleEn.trim(),
      titleHi: newNewsTitleHi.trim() || newNewsTitleEn.trim(),
      titleOr: newNewsTitleOr.trim() || newNewsTitleEn.trim(),
      date: newNewsDate.trim() || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: newNewsCategory,
      location: newNewsLocation.trim() || 'Babujang, Cuttack',
      summaryEn: newNewsSummaryEn.trim(),
      summaryHi: newNewsSummaryHi.trim() || newNewsSummaryEn.trim(),
      summaryOr: newNewsSummaryOr.trim() || newNewsSummaryEn.trim(),
      imageUrl: newsImagePreview || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      isUpcoming: newNewsIsUpcoming
    };

    setUploading(true);
    await FoundationRepository.saveNewsEvent(newItem);
    setUploading(false);

    // Reset Form
    setNewNewsTitleEn('');
    setNewNewsTitleHi('');
    setNewNewsTitleOr('');
    setNewNewsDate('');
    setNewNewsLocation('');
    setNewNewsSummaryEn('');
    setNewNewsSummaryHi('');
    setNewNewsSummaryOr('');
    setNewNewsIsUpcoming(false);
    setNewsImagePreview(null);
    setShowAddNews(false);

    notify('New News/Event published successfully!');
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
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
              activeTab === 'news'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" />
              <span>News & Events ({newsEvents.length})</span>
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
              <span>Gallery</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span>Foundation Office Bearers ({leadership.length})</span>
                    <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Drag to Reorder
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Leaders at the top appear first on the website. Drag cards or use ↑ / ↓ arrows to rearrange priority.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddLeader(!showAddLeader)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Leader</span>
                </button>
              </div>

              {/* Order Guidance Tip */}
              <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 flex items-center gap-3 text-xs text-sky-950">
                <ArrowUpDown className="w-4 h-4 text-sky-700 shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-sky-900">Live Website Display Order: </span>
                  Grab the <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-300 font-bold">⋮⋮</span> handle on any card to drag up or down, or click the <span className="font-bold">↑</span> and <span className="font-bold">↓</span> buttons. Position <strong className="text-emerald-700">#1</strong> is shown first to website visitors.
                </div>
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
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                      <select
                        value={newLeaderCategory}
                        onChange={e => setNewLeaderCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="executive">Executive Board</option>
                        <option value="advisory">Advisory Board</option>
                        <option value="trustee">Trustee Council</option>
                      </select>
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

              {/* Drag and Drop Cards List */}
              <div className="space-y-2.5">
                {leadership.map((member, index) => {
                  const isEditing = editingLeaderId === member.id;
                  const isBeingDragged = draggedLeaderIndex === index;
                  const isDragTarget = dragOverLeaderIndex === index && draggedLeaderIndex !== index;

                  if (isEditing) {
                    return (
                      <div key={member.id} className="bg-white p-4 rounded-xl border border-emerald-400 shadow-md space-y-3">
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
                                setEditLeaderData({ 
                                  ...editLeaderData, 
                                  nameEn: newName, 
                                  nameOr: transliterateNameToOdia(newName)
                                });
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
                                setEditLeaderData({ 
                                  ...editLeaderData, 
                                  roleEn: newRole, 
                                  roleOr: translateDesignationToOdia(newRole)
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Odia Name (Auto-converted)</label>
                            <input
                              type="text"
                              value={editLeaderData.nameOr || transliterateNameToOdia(editLeaderData.nameEn)}
                              onChange={e => setEditLeaderData({ ...editLeaderData, nameOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border font-serif"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Odia Role (Auto-converted)</label>
                            <input
                              type="text"
                              value={editLeaderData.roleOr || translateDesignationToOdia(editLeaderData.roleEn)}
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
                    <div 
                      key={member.id} 
                      draggable={!isEditing && !uploading}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={() => {
                        if (dragOverLeaderIndex === index) {
                          setDragOverLeaderIndex(null);
                        }
                      }}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 sm:gap-4 ${
                        isBeingDragged
                          ? 'opacity-40 border-dashed border-2 border-emerald-500 bg-emerald-50 scale-[0.99]'
                          : isDragTarget
                          ? 'border-2 border-emerald-500 ring-2 ring-emerald-300/60 bg-emerald-50/70 scale-[1.01] shadow-md'
                          : 'border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Left: Drag Handle & Rank Badge & Photo */}
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {/* Drag Handle */}
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors shrink-0"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        {/* Order Badge */}
                        <div className="shrink-0">
                          {index === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] sm:text-xs font-bold tracking-tight">
                              #1 • Visible First
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] sm:text-xs font-bold font-mono">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Leader Avatar with Hover Camera Upload */}
                        <div className="relative group shrink-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={member.imageUrl} alt={member.nameEn} className="w-full h-full object-cover" />
                          </div>
                          <label className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Camera className="w-3.5 h-3.5 text-white" />
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

                        {/* Leader Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{member.nameEn}</h5>
                            <span className="text-[10px] text-slate-500 font-serif hidden md:inline">({member.nameOr})</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[11px] text-emerald-700 font-medium truncate">{member.roleEn}</p>
                            <span className="text-slate-300 text-[10px]">•</span>
                            <span className="text-[10px] text-slate-400 capitalize truncate">{member.category}</span>
                          </div>
                          {member.phone && (
                            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">{member.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Quick Reorder Buttons (Up/Down) & Edit / Delete */}
                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleMoveLeader(index, index - 1)}
                          disabled={index === 0}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
                            index === 0
                              ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                              : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200'
                          }`}
                          title={index === 0 ? 'Already at top' : 'Move Up (Higher Priority)'}
                        >
                          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleMoveLeader(index, index + 1)}
                          disabled={index === leadership.length - 1}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
                            index === leadership.length - 1
                              ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                              : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200'
                          }`}
                          title={index === leadership.length - 1 ? 'Already at bottom' : 'Move Down (Lower Priority)'}
                        >
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <div className="w-[1px] h-4 bg-slate-200 mx-0.5 hidden sm:block" />

                        {/* Edit Leader */}
                        <button
                          onClick={() => handleStartEditLeader(member)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Edit Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Leader */}
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
          {/* TAB 3: NEWS & UPCOMING EVENTS                           */}
          {/* ======================================================= */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-sky-600" />
                    <h4 className="font-bold text-slate-800 text-sm">News, Events & Press Releases</h4>
                    <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      {newsEvents.length} Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish updates, relief announcements, press releases, and upcoming community drives.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowAddNews(!showAddNews);
                    setEditingNewsId(null);
                  }}
                  className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddNews ? 'Close Add Form' : 'Post News / Event'}</span>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
                {(['all', 'news', 'event', 'press', 'upcoming'] as const).map(tab => {
                  const count = tab === 'all' 
                    ? newsEvents.length 
                    : tab === 'upcoming' 
                    ? newsEvents.filter(n => n.isUpcoming).length 
                    : newsEvents.filter(n => n.category === tab).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setNewsFilter(tab)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                        newsFilter === tab
                          ? 'bg-white text-sky-800 font-semibold shadow-2xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      <span className="capitalize">
                        {tab === 'all' ? 'All Updates' : tab === 'press' ? 'Press Releases' : tab === 'upcoming' ? 'Upcoming Only' : tab}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        newsFilter === tab ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ADD NEWS / EVENT FORM */}
              {showAddNews && (
                <form onSubmit={handleAddNewsSubmit} className="p-4 sm:p-5 bg-sky-50/50 rounded-xl border border-sky-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-sky-700" />
                      Create New Article or Upcoming Event
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Category *</label>
                      <select
                        value={newNewsCategory}
                        onChange={e => setNewNewsCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="news">Community News / Announcement</option>
                        <option value="event">Upcoming Event / Camp</option>
                        <option value="press">Press Release / Media Statement</option>
                      </select>
                    </div>

                    {/* Upcoming Flag */}
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newNewsIsUpcoming}
                          onChange={e => setNewNewsIsUpcoming(e.target.checked)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-red-500" />
                          Mark as Highlighted Upcoming Event
                        </span>
                      </label>
                    </div>

                    {/* English Title */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-slate-700">Headline / Title (English) *</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (newNewsTitleEn.trim()) {
                              if (!newNewsTitleOr) setNewNewsTitleOr(transliterateNameToOdia(newNewsTitleEn));
                              if (!newNewsTitleHi) setNewNewsTitleHi(newNewsTitleEn);
                            }
                          }}
                          className="text-[10px] text-sky-700 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-sky-600" />
                          Auto-fill Odia & Hindi
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Free Eye Checkup & Spectacle Camp in Cuttack"
                        value={newNewsTitleEn}
                        onChange={e => setNewNewsTitleEn(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                      />
                    </div>

                    {/* Odia Title */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Title (Odia / ଓଡ଼ିଆ)</label>
                      <input
                        type="text"
                        placeholder="e.g. କଟକରେ ମାଗଣା ଚକ୍ଷୁ ଚିକିତ୍ସା ଶିବିର"
                        value={newNewsTitleOr}
                        onChange={e => setNewNewsTitleOr(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-odia"
                      />
                    </div>

                    {/* Hindi Title */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Title (Hindi / हिन्दी)</label>
                      <input
                        type="text"
                        placeholder="e.g. कटक में निःशुल्क नेत्र जांच एवं चश्मा वितरण शिविर"
                        value={newNewsTitleHi}
                        onChange={e => setNewNewsTitleHi(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-slate-700">Date Display *</label>
                        <div className="flex gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setNewNewsDate(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))}
                            className="text-sky-700 hover:underline"
                          >
                            Today
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 7);
                              setNewNewsDate(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
                            }}
                            className="text-sky-700 hover:underline"
                          >
                            Next Week
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 15 August 2026 or 24-26 Sept"
                        value={newNewsDate}
                        onChange={e => setNewNewsDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Location / Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Babujang High School Ground, Cuttack"
                        value={newNewsLocation}
                        onChange={e => setNewNewsLocation(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Image Selector */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Cover Photo / Banner</label>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                          {newsImagePreview ? (
                            <img src={newsImagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            ref={newsPhotoInputRef}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading(true);
                                try {
                                  const url = await FoundationRepository.uploadImage(file, 'news');
                                  setNewsImagePreview(url);
                                } catch (err: any) {
                                  alert(`Image upload failed: ${err?.message}`);
                                } finally {
                                  setUploading(false);
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => newsPhotoInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5"
                          >
                            <Camera className="w-3.5 h-3.5 text-sky-600" />
                            <span>{newsImagePreview ? 'Change Photo' : 'Upload Cover Image'}</span>
                          </button>
                          <p className="text-[10px] text-slate-500 mt-1">Recommended: Landscape photo (16:9 ratio, JPG/PNG/WebP)</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary En */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Description / Summary (English) *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Write a brief overview of the news or event..."
                        value={newNewsSummaryEn}
                        onChange={e => setNewNewsSummaryEn(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Summary Odia */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Description (Odia / ଓଡ଼ିଆ)</label>
                      <textarea
                        rows={2}
                        placeholder="ଓଡ଼ିଆ ବିବରଣୀ..."
                        value={newNewsSummaryOr}
                        onChange={e => setNewNewsSummaryOr(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-odia"
                      />
                    </div>

                    {/* Summary Hindi */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Description (Hindi / हिन्दी)</label>
                      <textarea
                        rows={2}
                        placeholder="हिन्दी विवरण..."
                        value={newNewsSummaryHi}
                        onChange={e => setNewNewsSummaryHi(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-sky-200">
                    <button
                      type="button"
                      onClick={() => setShowAddNews(false)}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200/50 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Publishing...' : 'Publish News / Event'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF NEWS ITEMS */}
              <div className="space-y-3">
                {(() => {
                  const filtered = newsEvents.filter(item => {
                    if (newsFilter === 'all') return true;
                    if (newsFilter === 'upcoming') return item.isUpcoming;
                    return item.category === newsFilter;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                        <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">No items found in this category.</p>
                        <button
                          onClick={() => {
                            setNewsFilter('all');
                            setShowAddNews(true);
                          }}
                          className="mt-2 text-xs text-sky-700 hover:underline font-semibold"
                        >
                          + Post an article or upcoming event
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(item => {
                    const isEditing = editingNewsId === item.id;

                    if (isEditing) {
                      return (
                        <div key={item.id} className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5 text-amber-700" />
                              Editing Article: {item.titleEn}
                            </span>
                            <button
                              type="button"
                              onClick={handleCancelNewsEdit}
                              className="text-xs text-slate-500 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
                              <select
                                value={editNewsData.category || item.category}
                                onChange={e => setEditNewsData(prev => ({ ...prev, category: e.target.value as any }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              >
                                <option value="news">Community News</option>
                                <option value="event">Upcoming Event / Camp</option>
                                <option value="press">Press Release</option>
                              </select>
                            </div>

                            <div className="flex items-center pt-5">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={Boolean(editNewsData.isUpcoming)}
                                  onChange={e => setEditNewsData(prev => ({ ...prev, isUpcoming: e.target.checked }))}
                                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                                />
                                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                  <Bell className="w-3.5 h-3.5 text-red-500" />
                                  Mark as Upcoming Event
                                </span>
                              </label>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Title (English) *</label>
                              <input
                                type="text"
                                value={editNewsData.titleEn ?? item.titleEn}
                                onChange={e => setEditNewsData(prev => ({ ...prev, titleEn: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Title (Odia / ଓଡ଼ିଆ)</label>
                              <input
                                type="text"
                                value={editNewsData.titleOr ?? item.titleOr ?? ''}
                                onChange={e => setEditNewsData(prev => ({ ...prev, titleOr: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-odia"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Title (Hindi / हिन्दी)</label>
                              <input
                                type="text"
                                value={editNewsData.titleHi ?? item.titleHi ?? ''}
                                onChange={e => setEditNewsData(prev => ({ ...prev, titleHi: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Date Display</label>
                              <input
                                type="text"
                                value={editNewsData.date ?? item.date}
                                onChange={e => setEditNewsData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Location / Venue</label>
                              <input
                                type="text"
                                value={editNewsData.location ?? item.location}
                                onChange={e => setEditNewsData(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>

                            {/* Photo Picker in Edit */}
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Cover Photo</label>
                              <div className="flex items-center gap-3">
                                <img
                                  src={editNewsData.imageUrl || item.imageUrl}
                                  alt="Cover"
                                  className="w-20 h-14 rounded-lg object-cover border border-slate-300 shrink-0"
                                />
                                <div className="flex-1">
                                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer">
                                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                                    <span>Upload New Image</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setUploading(true);
                                          try {
                                            const url = await FoundationRepository.uploadImage(file, 'news');
                                            setEditNewsData(prev => ({ ...prev, imageUrl: url }));
                                          } catch (err: any) {
                                            alert(`Image upload error: ${err?.message}`);
                                          } finally {
                                            setUploading(false);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Summary (English)</label>
                              <textarea
                                rows={2}
                                value={editNewsData.summaryEn ?? item.summaryEn}
                                onChange={e => setEditNewsData(prev => ({ ...prev, summaryEn: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Summary (Odia)</label>
                              <textarea
                                rows={2}
                                value={editNewsData.summaryOr ?? item.summaryOr ?? ''}
                                onChange={e => setEditNewsData(prev => ({ ...prev, summaryOr: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-odia"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-700 mb-1">Summary (Hindi)</label>
                              <textarea
                                rows={2}
                                value={editNewsData.summaryHi ?? item.summaryHi ?? ''}
                                onChange={e => setEditNewsData(prev => ({ ...prev, summaryHi: e.target.value }))}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                            <button
                              type="button"
                              onClick={handleCancelNewsEdit}
                              className="px-3 py-1 text-slate-600 hover:bg-slate-200/50 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveNewsEdit}
                              disabled={uploading}
                              className="px-4 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{uploading ? 'Saving...' : 'Save Article Changes'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={item.id} 
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                          {/* Direct Cover Photo Upload Button */}
                          <div className="relative group shrink-0" title="Click or hover to change photo">
                            <img 
                              src={item.imageUrl} 
                              alt={item.titleEn} 
                              className="w-16 h-16 rounded-lg object-cover border border-slate-200" 
                            />
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

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                item.category === 'press'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : item.category === 'event'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {item.category === 'press' ? 'Press Release' : item.category === 'event' ? 'Event' : 'News'}
                              </span>

                              {item.isUpcoming && (
                                <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 flex items-center gap-1">
                                  <Bell className="w-2.5 h-2.5" />
                                  Upcoming
                                </span>
                              )}

                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {item.date}
                              </span>

                              {item.location && (
                                <span className="text-[11px] text-slate-500 hidden md:flex items-center gap-1">
                                  <span>•</span>
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span className="truncate max-w-[150px]">{item.location}</span>
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                              {item.titleEn}
                            </h5>

                            {item.titleOr && (
                              <p className="text-[11px] text-slate-600 font-odia line-clamp-1">
                                {item.titleOr}
                              </p>
                            )}

                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.summaryEn}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          {/* Toggle Upcoming button */}
                          <button
                            onClick={() => handleToggleUpcomingNews(item)}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              item.isUpcoming
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title={item.isUpcoming ? 'Remove Upcoming badge' : 'Mark as Upcoming event'}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details button */}
                          <button
                            onClick={() => handleStartEditNews(item)}
                            className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Edit News Article"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteNews(item.id, item.titleEn)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: GALLERY (PHOTOS & VIDEOS)                         */}
          {/* ======================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              
              {/* Gallery Top Navigation: Switch between Photos & Video Posting */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryTabMode('photo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      galleryTabMode === 'photo'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Batch Photo Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGalleryTabMode('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      galleryTabMode === 'video'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Upload Video / Reel / Link</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Filter Media:</span>
                  {(['all', 'photo', 'video'] as const).map((mode) => {
                    const isSelected = galleryFilter === mode;
                    const count = mode === 'all' 
                      ? galleryItems.length 
                      : mode === 'photo'
                      ? galleryItems.filter(i => i.mediaType !== 'video' && !i.videoUrl).length
                      : galleryItems.filter(i => i.mediaType === 'video' || Boolean(i.videoUrl)).length;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setGalleryFilter(mode)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-sky-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {mode === 'all' ? 'All' : mode === 'photo' ? 'Photos' : 'Videos'} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. PHOTO BATCH UPLOAD FORM */}
              {galleryTabMode === 'photo' && (
                <form onSubmit={handleBatchGalleryUpload} className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-3">
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
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500"
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
                        <option value="food">Annadanam / Free Meals</option>
                        <option value="clothing">Vastradaan</option>
                        <option value="community">Community Initiatives</option>
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

              {/* 2. VIDEO UPLOAD / LINK POSTING FORM */}
              {galleryTabMode === 'video' && (
                <form onSubmit={handleVideoUploadSubmit} className="p-4 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Post Field Video / Documentary / Reel</span>
                        <span className="text-[10px] text-slate-500">Upload video files (MP4/WebM) or embed YouTube links with auto thumbnail</span>
                      </div>
                    </div>

                    {/* Mode Toggle: File vs Link */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setVideoUploadMode('file')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                          videoUploadMode === 'file'
                            ? 'bg-white text-rose-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Upload Video File
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoUploadMode('link')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                          videoUploadMode === 'link'
                            ? 'bg-white text-rose-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        YouTube / Video Link
                      </button>
                    </div>
                  </div>

                  {/* Video Source Input Area */}
                  {videoUploadMode === 'file' ? (
                    <div className="p-4 bg-rose-50/50 rounded-xl border border-dashed border-rose-300 text-center space-y-3">
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileSelect}
                        accept="video/mp4,video/webm,video/quicktime,video/ogg"
                        className="hidden"
                      />

                      {videoFilePreview ? (
                        <div className="space-y-3">
                          <div className="relative max-w-sm mx-auto aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-slate-700">
                            <video src={videoFilePreview} controls className="w-full h-full object-contain" />
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-slate-700">
                              Selected: <span className="font-semibold text-rose-900">{videoFile?.name}</span> ({((videoFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setVideoFile(null);
                                setVideoFilePreview(null);
                              }}
                              className="text-xs text-red-600 hover:underline font-semibold ml-2"
                            >
                              Change Video
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Film className="w-8 h-8 text-rose-500 mx-auto mb-2 opacity-80" />
                          <p className="text-xs font-semibold text-slate-800">Select an MP4, WebM, or MOV video file</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Supports up to 150MB. Thumbnail will be auto-generated.</p>
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="mt-3 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Browse Video File</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        YouTube URL or Direct Video Link
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                          value={videoUrlInput}
                          onChange={(e) => {
                            setVideoUrlInput(e.target.value);
                            const ytThumb = getYouTubeThumbnail(e.target.value);
                            if (ytThumb && !videoPosterPreview) {
                              setVideoPosterPreview(ytThumb);
                            }
                          }}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500 font-mono"
                        />
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Paste any YouTube video or direct video link. The thumbnail will be extracted automatically.
                      </p>
                    </div>
                  )}

                  {/* Video Metadata Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Video Title (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Free Ration & Flood Relief Distribution in Babujang"
                        value={videoTitleEn}
                        onChange={e => setVideoTitleEn(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Odia Title (ଶୀର୍ଷକ)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (videoTitleEn) {
                              setVideoTitleOr(transliterateNameToOdia(videoTitleEn));
                            }
                          }}
                          className="text-[10px] text-sky-700 hover:underline flex items-center gap-0.5"
                        >
                          <Sparkles className="w-2.5 h-2.5" /> Auto-transliterate
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="ବାବୁଜଙ୍ଗରେ ରିଲିଫ୍ ବଣ୍ଟନ ଭିଡିଓ..."
                        value={videoTitleOr}
                        onChange={e => setVideoTitleOr(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-oriya"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Hindi Title (वैकल्पिक)
                      </label>
                      <input
                        type="text"
                        placeholder="बाबुजंग में राहत सामग्री वितरण..."
                        value={videoTitleHi}
                        onChange={e => setVideoTitleHi(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={videoCategory}
                        onChange={e => setVideoCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      >
                        <option value="relief">Relief & Food Drive</option>
                        <option value="medical">Medical Camp</option>
                        <option value="cultural">Cultural & Festival</option>
                        <option value="distribution">Blanket & Clothes</option>
                        <option value="food">Annadanam / Free Meals</option>
                        <option value="clothing">Vastradaan</option>
                        <option value="community">Community Initiatives</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Duration Tag (e.g. 2:30, 4:15)</label>
                      <input
                        type="text"
                        placeholder="e.g. 3:20"
                        value={videoDurationInput}
                        onChange={e => setVideoDurationInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={videoLocation}
                        onChange={e => setVideoLocation(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date / Month</label>
                      <input
                        type="text"
                        value={videoDate}
                        onChange={e => setVideoDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Poster / Thumbnail Preview & Custom Upload */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-300 relative">
                        {videoPosterPreview ? (
                          <img src={videoPosterPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                            Auto Frame
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 rounded">
                          Cover
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">Video Cover Thumbnail</div>
                        <div className="text-[10px] text-slate-500">Auto-generated from video or choose custom image</div>
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        ref={videoPosterInputRef}
                        onChange={handleVideoPosterSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoPosterInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 inline-flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>Custom Cover Image</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload Progress Status */}
                  {uploadProgress && (
                    <div className="text-xs font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-center animate-pulse">
                      {uploadProgress}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoFilePreview(null);
                        setVideoPosterFile(null);
                        setVideoPosterPreview(null);
                        setVideoUrlInput('');
                        setVideoDurationInput('');
                        setVideoTitleEn('');
                        setVideoTitleHi('');
                        setVideoTitleOr('');
                      }}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 rounded-lg"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={uploading || (videoUploadMode === 'file' && !videoFile) || (videoUploadMode === 'link' && !videoUrlInput.trim()) || !videoTitleEn.trim()}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Processing & Posting Video...' : 'Publish Video to Gallery'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Filtered Gallery Grid */}
              {(() => {
                const displayedItems = galleryItems.filter(item => {
                  if (galleryFilter === 'all') return true;
                  if (galleryFilter === 'photo') return item.mediaType !== 'video' && !item.videoUrl;
                  if (galleryFilter === 'video') return item.mediaType === 'video' || Boolean(item.videoUrl);
                  return true;
                });

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                      <span>Showing {displayedItems.length} media item{displayedItems.length !== 1 ? 's' : ''}</span>
                      <span>Click any item to preview</span>
                    </div>

                    {displayedItems.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                        No {galleryFilter === 'video' ? 'videos' : galleryFilter === 'photo' ? 'photos' : 'items'} found in gallery.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {displayedItems.map(item => {
                          const isVideo = item.mediaType === 'video' || Boolean(item.videoUrl);

                          return (
                            <div 
                              key={item.id} 
                              onClick={() => setVideoPreviewModalItem(item)}
                              className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square shadow-2xs cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all"
                            >
                              <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100" />
                              
                              {/* Video Indicator Badges */}
                              {isVideo ? (
                                <div className="absolute top-2 left-2 z-10">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs border border-rose-300/40">
                                    <Video className="w-2.5 h-2.5" />
                                    <span>{item.duration || 'Video'}</span>
                                  </span>
                                </div>
                              ) : (
                                <div className="absolute top-2 left-2 z-10">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/70 text-slate-200 text-[9px] font-mono backdrop-blur-xs">
                                    <ImageIcon className="w-2.5 h-2.5" />
                                  </span>
                                </div>
                              )}

                              {/* Play Button Overlay for Videos */}
                              {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                  <div className="w-9 h-9 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/80">
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                  </div>
                                </div>
                              )}

                              {/* Delete Button at Top Right */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGallery(item.id);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-md z-20 flex items-center justify-center transition-transform"
                                title="Delete Media"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Bottom Caption Bar */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-2 pt-5 text-white text-[11px] leading-tight font-medium">
                                <span className="line-clamp-1">{item.titleEn}</span>
                                <span className="text-[9px] text-slate-300 font-light block capitalize">{item.category} • {item.date || 'Babujang'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>
          )}

          {/* Operator Gallery Item Preview Modal */}
          {videoPreviewModalItem && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setVideoPreviewModalItem(null)}
            >
              <div 
                className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 text-white"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setVideoPreviewModalItem(null)}
                  className="absolute top-3 right-3 z-30 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors border border-white/20"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="aspect-video bg-black flex items-center justify-center max-h-[60vh]">
                  {(() => {
                    const isVideo = videoPreviewModalItem.mediaType === 'video' || Boolean(videoPreviewModalItem.videoUrl);
                    const ytMatch = videoPreviewModalItem.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);

                    if (isVideo && ytMatch && ytMatch[1]) {
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`}
                          title={videoPreviewModalItem.titleEn}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }

                    if (isVideo && videoPreviewModalItem.videoUrl) {
                      return (
                        <video
                          src={videoPreviewModalItem.videoUrl}
                          poster={videoPreviewModalItem.imageUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      );
                    }

                    return (
                      <img
                        src={videoPreviewModalItem.imageUrl}
                        alt={videoPreviewModalItem.titleEn}
                        className="w-full h-full object-contain"
                      />
                    );
                  })()}
                </div>

                <div className="p-4 space-y-1.5 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-200 border border-sky-800 uppercase">
                      {videoPreviewModalItem.category}
                    </span>
                    {videoPreviewModalItem.duration && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-200 border border-rose-800">
                        {videoPreviewModalItem.duration}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {videoPreviewModalItem.date} • {videoPreviewModalItem.location}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {videoPreviewModalItem.titleEn}
                  </h4>
                  {videoPreviewModalItem.titleOr && (
                    <p className="text-xs text-sky-200 font-oriya">
                      {videoPreviewModalItem.titleOr}
                    </p>
                  )}
                </div>
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
