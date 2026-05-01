import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Bell, Key, Save, Camera, Languages } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileView() {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    email: '',
    avatar: '',
    notificationSettings: {
      messages: true,
      calls: true,
      streams: true
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(prev => ({ 
          ...prev, 
          name: data.name || '',
          bio: data.bio || '',
          email: data.email || '',
          avatar: data.avatar || '',
          notificationSettings: data.notificationSettings || prev.notificationSettings
        }));
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      // Filter fields to match firestore.rules permitted keys
      const updateData = {
        name: profile.name,
        avatar: profile.avatar,
        language: language,
        bio: profile.bio,
        notificationSettings: profile.notificationSettings
      };
      await updateDoc(docRef, updateData);
      // Simulate feedback
      setTimeout(() => setSaving(false), 800);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-cyan-400 animate-pulse">INIT_PROFILE_SYNC...</div>;

  const presets = [
    'Adventurer',
    'Avataaars',
    'Big-Ears',
    'Bottts',
    'Lorelei',
    'Micah',
    'Pixel-Art'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end pb-8 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">{t('profile.title')} <span className="text-cyan-400 font-light italic">{t('profile.subtitle')}</span></h1>
          <p className="text-slate-500 mt-2 uppercase tracking-[0.2em] text-[10px] font-bold">Authenticated ID: {auth.currentUser?.uid.slice(0, 12)}...</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-3 bg-cyan-400 text-black rounded-2xl hover:bg-white transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
        >
          {saving ? <Shield className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Syncing...' : t('profile.update')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-8 glass border border-cyan-500/10 rounded-[40px] relative overflow-hidden group flex flex-col items-center text-center">
             <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full glass border-2 border-cyan-500/30 p-1 relative overflow-hidden">
                   <img 
                    src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                   />
                </div>
             </div>
             <h2 className="text-xl font-black text-[#e2e8f0] uppercase tracking-tight">{profile.name || 'Anonymous User'}</h2>
             <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">Status: Active Node</p>
             
             <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-4">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <Key className="w-4 h-4 text-cyan-400" />
                  {t('profile.shard')}
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  {t('profile.protocol')}
                </div>
             </div>
          </div>

          <div className="glass border border-white/5 rounded-[40px] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">{t('profile.avatar')}</h3>
            <div className="space-y-4">
              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text"
                  value={profile.avatar}
                  onChange={e => setProfile({...profile, avatar: e.target.value})}
                  className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] focus:outline-none focus:border-cyan-400/50 transition-all font-mono text-[#e2e8f0] uppercase tracking-tighter"
                  placeholder={t('profile.avatarPlaceholder')}
                />
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 block mb-4">{t('profile.presets')}</span>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map(style => (
                    <button
                      key={style}
                      onClick={() => setProfile({...profile, avatar: `https://api.dicebear.com/7.x/${style.toLowerCase()}/svg?seed=${auth.currentUser?.uid}`})}
                      className="aspect-square glass border border-white/5 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all p-1 group"
                      title={style}
                    >
                      <img 
                        src={`https://api.dicebear.com/7.x/${style.toLowerCase()}/svg?seed=${auth.currentUser?.uid}`} 
                        alt={style}
                        className="w-full h-full object-cover rounded-md opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass border border-white/5 rounded-[40px] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">{t('profile.lang')}</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setLanguage('en')}
                className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${language === 'en' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">English</span>
                </div>
                {language === 'en' && <Languages className="w-4 h-4 shrink-0" />}
              </button>
              <button 
                onClick={() => setLanguage('ar')}
                className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${language === 'ar' ? 'bg-cyan-400 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">العربية</span>
                </div>
                {language === 'ar' && <Languages className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-8">
          <div className="glass border border-white/5 rounded-[40px] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">{t('profile.credentials')}</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{t('profile.name')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 transition-all font-medium text-[#e2e8f0]"
                  placeholder="..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{t('profile.bio')}</label>
              <textarea 
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-cyan-400/50 transition-all font-medium min-h-[120px] text-[#e2e8f0]"
                placeholder="..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{t('profile.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="glass border border-white/5 rounded-[40px] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">{t('profile.notifications')}</h3>
            
            <div className="space-y-6">
              {[
                { key: 'messages', label: t('profile.notif.messages.label'), desc: t('profile.notif.messages.desc') },
                { key: 'calls', label: t('profile.notif.calls.label'), desc: t('profile.notif.calls.desc') },
                { key: 'streams', label: t('profile.notif.streams.label'), desc: t('profile.notif.streams.desc') }
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-[#e2e8f0]">{pref.label}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setProfile({
                      ...profile, 
                      notificationSettings: {
                        ...profile.notificationSettings,
                        [pref.key]: !profile.notificationSettings[pref.key as keyof typeof profile.notificationSettings]
                      }
                    })}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${profile.notificationSettings[pref.key as keyof typeof profile.notificationSettings] ? 'bg-cyan-400' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${profile.notificationSettings[pref.key as keyof typeof profile.notificationSettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

