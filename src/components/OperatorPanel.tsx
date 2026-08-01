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
  CheckCircle2
} from 'lucide-react';
import { FoundationRepository, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { GalleryItem, DonationDrive, OfficeBearer, AssistanceRequest } from '../types';

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
  const [activeTab, setActiveTab] = useState<'leadership' | 'drives' | 'gallery' | 'upload' | 'requests'>('leadership');
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

  // --- GALLERY STATE ---
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryItem['category']>('relief');
  const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);

  // File Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const leaderPhotoInputRef = useRef<HTMLInputElement>(null);
  const drivePhotoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const leadership = FoundationRepository.getLeadership();
  const galleryItems = FoundationRepository.getGallery();
  const drives = FoundationRepository.getDrives();
  const requests = FoundationRepository.getAssistanceRequests();

  const notify = (msg: string) => {
    setToastMessage(msg);
    onDataChange();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // LOGO UPLOAD
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
    await FoundationRepository.saveLeadershipMember(editLeaderData as OfficeBearer);
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
      nameOr: newLeaderNameOr || newLeaderNameEn,
      roleEn: newLeaderRoleEn,
      roleOr: newLeaderRoleOr || newLeaderRoleEn,
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
  // DRIVE EDIT / ADD
  // ----------------------------------------------------
  const handleSaveDriveEdit = async () => {
    if (!editingDriveId) return;
    setUploading(true);
    await FoundationRepository.saveDrive(editDriveData as DonationDrive);
    setUploading(false);
    setEditingDriveId(null);
    notify('Drive updated!');
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
  // GALLERY ADD
  // ----------------------------------------------------
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImagePreview) {
      alert('Please select an image file to upload.');
      return;
    }

    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      titleEn: newGalleryTitle || 'Community Activity',
      titleOr: newGalleryTitle || 'ସାମାଜିକ ସେବା କାର୍ଯ୍ୟ',
      category: newGalleryCategory,
      imageUrl: galleryImagePreview,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      location: 'Babujang, Cuttack'
    };

    setUploading(true);
    await FoundationRepository.saveGalleryItem(newItem);
    setUploading(false);

    setNewGalleryTitle('');
    setGalleryImagePreview(null);
    notify('Uploaded gallery image!');
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Delete this image?')) {
      setUploading(true);
      await FoundationRepository.deleteGalleryItem(id);
      setUploading(false);
      notify('Photo deleted.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col my-4 max-h-[90vh]">
        
        {/* Simplified Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-bold text-white font-heading">
              Operator Portal
            </h3>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Active'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
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
              <span>Logo & Database</span>
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
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Name (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Das"
                        value={newLeaderNameEn}
                        onChange={e => setNewLeaderNameEn(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Name (Odia)</label>
                      <input
                        type="text"
                        placeholder="e.g. ରମେଶ ଦାସ"
                        value={newLeaderNameOr}
                        onChange={e => setNewLeaderNameOr(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Designation (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. President / Treasurer"
                        value={newLeaderRoleEn}
                        onChange={e => setNewLeaderRoleEn(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Designation (Odia)</label>
                      <input
                        type="text"
                        placeholder="e.g. ସଭାପତି"
                        value={newLeaderRoleOr}
                        onChange={e => setNewLeaderRoleOr(e.target.value)}
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
                {leadership.map((member) => {
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
                            <label className="block text-[11px] font-medium text-slate-600">Name (English)</label>
                            <input
                              type="text"
                              value={editLeaderData.nameEn || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, nameEn: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Name (Odia)</label>
                            <input
                              type="text"
                              value={editLeaderData.nameOr || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, nameOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Designation (English)</label>
                            <input
                              type="text"
                              value={editLeaderData.roleEn || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, roleEn: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600">Designation (Odia)</label>
                            <input
                              type="text"
                              value={editLeaderData.roleOr || ''}
                              onChange={e => setEditLeaderData({ ...editLeaderData, roleOr: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border"
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
                    <div key={member.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300">
                      <div className="flex items-center gap-3 min-w-0">
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
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => drivePhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg border font-medium"
                      >
                        {driveImagePreview ? 'Photo Uploaded ✓' : 'Upload Cover Photo'}
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
                {drives.map(drive => (
                  <div key={drive.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={drive.imageUrl} alt={drive.titleEn} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-slate-900 text-xs truncate">{drive.titleEn}</h5>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ₹{drive.raisedAmount.toLocaleString()} / ₹{drive.targetAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDrive(drive.id, drive.titleEn)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: GALLERY                                          */}
          {/* ======================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Quick Upload Banner */}
              <form onSubmit={handleAddGalleryItem} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        const url = await FoundationRepository.uploadImage(file, 'gallery');
                        setGalleryImagePreview(url);
                        setUploading(false);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>{galleryImagePreview ? 'Photo Ready ✓' : 'Select Photo to Upload'}</span>
                  </button>

                  <input
                    type="text"
                    placeholder="Photo caption / title"
                    value={newGalleryTitle}
                    onChange={e => setNewGalleryTitle(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 w-full sm:w-48"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !galleryImagePreview}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  Save to Gallery
                </button>
              </form>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryItems.map(item => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square">
                    <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[11px]">
                      <span className="truncate font-medium">{item.titleEn}</span>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="self-end p-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: LOGO & DATABASE                                  */}
          {/* ======================================================= */}
          {activeTab === 'upload' && (
            <div className="space-y-4 max-w-2xl mx-auto">
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
                </div>
              </div>

              {/* Supabase SQL Info */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Production Supabase Database SQL
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                      notify('Copied Production SQL Schema to Clipboard!');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-mono font-medium"
                  >
                    Copy SQL Script
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Ready to deploy to Supabase. Simply create a project in Supabase dashboard and run the copied SQL script in SQL Editor.
                </p>
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
