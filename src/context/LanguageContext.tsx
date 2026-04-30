import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.features': 'Core Systems',
    'nav.docs': 'Documentation',
    'nav.protocol': 'Protocol',
    'nav.launch': 'Initialize Studio',
    'hero.title': 'Unified',
    'hero.subtitle': 'Comm-Core.',
    'hero.desc': 'High-performance video architecture, mapping WebRTC handshakes and real-time transcoding pipelines.',
    'hero.cta': 'Access Hub',
    'hero.spec': 'Technical Spec',
    'dashboard.title': 'Terminal',
    'dashboard.subtitle': 'Access.',
    'dashboard.session': 'Authenticated session',
    'dashboard.instant': 'Sync Stream',
    'dashboard.broadcast': 'Broadcast',
    'dashboard.vault': 'Vault',
    'profile.title': 'User',
    'profile.subtitle': 'Identity.',
    'profile.update': 'Update Node',
    'profile.lang': 'Interface Language',
    'profile.bio': 'Neural Bio',
    'profile.notifications': 'Notification Pulse'
  },
  ar: {
    'nav.features': 'الأنظمة الأساسية',
    'nav.docs': 'التوثيق',
    'nav.protocol': 'البروتوكول',
    'nav.launch': 'تشغيل الأستوديو',
    'hero.title': 'اتصالات',
    'hero.subtitle': 'موحدة.',
    'hero.desc': 'هندسة فيديو عالية الأداء، تدير مصافحات WebRTC وخطوط معالجة الفيديو في الوقت الفعلي.',
    'hero.cta': 'دخول المركز',
    'hero.spec': 'المواصفات التقنية',
    'dashboard.title': 'محطة',
    'dashboard.subtitle': 'الوصول.',
    'dashboard.session': 'جلسة مصادقة',
    'dashboard.instant': 'بث متزامن',
    'dashboard.broadcast': 'بث مباشر',
    'dashboard.vault': 'الخزنة',
    'profile.title': 'هوية',
    'profile.subtitle': 'المستخدم.',
    'profile.update': 'تحديث الوحدة',
    'profile.lang': 'لغة الواجهة',
    'profile.bio': 'السيرة الذاتية الرقمية',
    'profile.notifications': 'نبض التنبيهات'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('en');

  useEffect(() => {
    const fetchLang = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().language) {
        setLangState(docSnap.data().language);
      }
    };
    fetchLang();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLangState(lang);
    if (auth.currentUser) {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { language: lang });
    }
  };

  const t = (key: string) => translations[language][key] || key;
  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      <div className={isRtl ? 'font-sans-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
