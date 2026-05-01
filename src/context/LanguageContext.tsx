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
    'dashboard.ops': 'Operations',
    'dashboard.security': 'Security',
    'dashboard.comm': 'Comm-Core Ops',
    'dashboard.grid': 'Video Grid',
    'dashboard.nodes': 'Live Nodes',
    'dashboard.assets': 'Asset Vault',
    'dashboard.userNode': 'User Node',
    'dashboard.config': 'System Config',
    'dashboard.terminate': 'Terminate',
    'dashboard.searchPlaceholder': 'QUERY SYSTEM CORE...',
    'dashboard.node': 'NODE',
    'dashboard.status': 'Status',
    'dashboard.initialized': 'Initialized',
    'dashboard.newInstance': 'New Instance',
    'dashboard.systemReady': 'SYSTEM READY',
    'dashboard.encryption': 'ENCRYPTION',
    'dashboard.ssl': 'SSL',
    'dashboard.active': 'ACTIVE',
    'profile.title': 'User',
    'profile.subtitle': 'Identity.',
    'profile.update': 'Update Node',
    'profile.lang': 'Interface Language',
    'profile.bio': 'Neural Bio',
    'profile.notifications': 'Notification Pulse',
    'profile.name': 'Display Name',
    'profile.email': 'Contact Gateway',
    'profile.shard': 'E2EE Shard Active',
    'profile.protocol': 'Secure Protocol',
    'profile.avatar': 'Avatar Interface',
    'profile.avatarPlaceholder': 'Enter avatar URL (e.g., https://...)',
    'profile.presets': 'Signal Presets',
    'profile.credentials': 'Core Credentials',
    'profile.save': 'Commit Changes',
    'profile.role': 'Auth Role',
    'mgmt.title': 'System',
    'mgmt.subtitle': 'Management.',
    'mgmt.users': 'User Directory',
    'mgmt.roleUpdate': 'Update Authority',
    'mgmt.search': 'Filter Nodes...',
    'mgmt.noUsers': 'No matching nodes found.',
    'mgmt.admin': 'Admin',
    'mgmt.editor': 'Editor',
    'mgmt.viewer': 'Viewer',
    'dashboard.mgmt': 'System Management',
    'dashboard.telemetry': 'System Telemetry',
    'dashboard.throughput': 'Data Throughput',
    'dashboard.activeNodes': 'Active Nodes',
    'dashboard.latency': 'Network Latency',
    'dashboard.uptime': 'Core Uptime',
    'dashboard.recentActivity': 'Recent Activity Hub',
    'dashboard.nodeStatus': 'Node Status',
    'profile.username': 'Neural Handle',
    'profile.website': 'Link Gateway',
    'profile.phone': 'Secure Line',
    'profile.privacy': 'Visibility Status',
    'profile.public': 'Public Node',
    'profile.private': 'Private Hub',
    'profile.notif.messages.label': 'Message Telemetry',
    'profile.notif.messages.desc': 'Notify on incoming cipher streams.',
    'profile.notif.calls.label': 'Handshake Requests',
    'profile.notif.calls.desc': 'Alert when peer connections are initialized.',
    'profile.notif.streams.label': 'Broadcast Signals',
    'profile.notif.streams.desc': 'Update when global ingestion nodes go live.',
    'landing.feature1.title': 'RTC Handshakes',
    'landing.feature1.desc': 'Low-latency WebRTC pipelines with adaptive bitrate adaptive mesh active for seamless 4K delivery.',
    'landing.feature2.title': 'Media Ingestion',
    'landing.feature2.desc': 'Professional scale RTMP/HLS ingestion hubs with multi-cam redundancy and integrated WebSocket telemetry.',
    'landing.feature3.title': 'Object Storage',
    'landing.feature3.desc': 'Secure AES-256 encrypted asset management with automated transcoding and AI-driven metadata extraction.',
    'landing.stats.uptime': 'Uptime SLI',
    'landing.stats.latency': 'P99 Latency',
    'landing.stats.throughput': 'Throughput',
    'landing.stats.security': 'Security',
    'video.secureCanal': 'Secure Canal',
    'video.telemetrySpecs': '4K • 12MBPS • AES-256-GCM ACTIVE',
    'video.handshake': 'Handshake Active',
    'video.participants': 'Participants',
    'video.active': 'Active',
    'video.host': 'Host',
    'video.relay': 'Relay',
    'notif.title': 'Event',
    'notif.subtitle': 'Logger.',
    'notif.telemetry': 'Real-time Telemetry',
    'notif.shard': 'System is currently intercepting and verifying all incoming shards.'
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
    'dashboard.ops': 'العمليات',
    'dashboard.security': 'الأمن',
    'dashboard.comm': 'مركز العمليات',
    'dashboard.grid': 'شبكة الفيديو',
    'dashboard.nodes': 'العقد المباشرة',
    'dashboard.assets': 'خزنة الأصول',
    'dashboard.userNode': 'عقدة المستخدم',
    'dashboard.config': 'تكوين النظام',
    'dashboard.terminate': 'إنهاء الجلسة',
    'dashboard.searchPlaceholder': 'استعلام نواة النظام...',
    'dashboard.node': 'العقدة',
    'dashboard.status': 'الحالة',
    'dashboard.initialized': 'تم التهيئة',
    'dashboard.newInstance': 'مثيل جديد',
    'dashboard.systemReady': 'النظام جاهز',
    'dashboard.encryption': 'التشفير',
    'dashboard.ssl': 'بروتوكول SSL',
    'dashboard.active': 'نشط',
    'profile.title': 'هوية',
    'profile.subtitle': 'المستخدم.',
    'profile.update': 'تحديث الوحدة',
    'profile.lang': 'لغة الواجهة',
    'profile.bio': 'السيرة الذاتية الرقمية',
    'profile.notifications': 'نبض التنبيهات',
    'profile.name': 'اسم العرض',
    'profile.email': 'بوابة الاتصال',
    'profile.shard': 'تشفير E2EE نشط',
    'profile.protocol': 'بروتوكول آمن',
    'profile.avatar': 'واجهة الصورة الرمزية',
    'profile.avatarPlaceholder': 'أدخل رابط الصورة (مثلاً: https://...)',
    'profile.presets': 'النماذج المسبقة',
    'profile.credentials': 'الاعتمادات الأساسية',
    'profile.save': 'حفظ التغييرات',
    'profile.role': 'الدور الوظيفي',
    'mgmt.title': 'النظام',
    'mgmt.subtitle': 'الإدارة.',
    'mgmt.users': 'سجل المستخدمين',
    'mgmt.roleUpdate': 'تحديث الصلاحية',
    'mgmt.search': 'تصفية العقد...',
    'mgmt.noUsers': 'لم يتم العثور على عقد مطابقة.',
    'mgmt.admin': 'مدير',
    'mgmt.editor': 'محرر',
    'mgmt.viewer': 'مشاهد',
    'dashboard.mgmt': 'إدارة النظام',
    'dashboard.telemetry': 'القياس عن بعد',
    'dashboard.throughput': 'إنتاجية البيانات',
    'dashboard.activeNodes': 'العقد النشطة',
    'dashboard.latency': 'تأخير الشبكة',
    'dashboard.uptime': 'وقت تشغيل النظام',
    'dashboard.recentActivity': 'مركز النشاط الأخير',
    'dashboard.nodeStatus': 'حالة العقدة',
    'profile.username': 'اسم المستخدم',
    'profile.website': 'رابط الموقع',
    'profile.phone': 'رقم الهاتف',
    'profile.privacy': 'الحصوصية',
    'profile.public': 'عام',
    'profile.private': 'خاص',
    'profile.notif.messages.label': 'بيانات الرسائل',
    'profile.notif.messages.desc': 'تنبيه عند ورود تدفقات الشفرة.',
    'profile.notif.calls.label': 'طلبات المصافحة',
    'profile.notif.calls.desc': 'تنبيه عند تهيئة اتصالات النظراء.',
    'profile.notif.streams.label': 'إشارات البث',
    'profile.notif.streams.desc': 'تحديث عند تشغيل عقد الإرسال العالمية.',
    'landing.feature1.title': 'مصافحات RTC',
    'landing.feature1.desc': 'خطوط WebRTC منخفضة التأخير مع معدل نقل بيانات متكيف لتوصيل 4K سلس.',
    'landing.feature2.title': 'استيعاب الوسائط',
    'landing.feature2.desc': 'مراكز استيعاب RTMP/HLS احترافية مع تكرار الكاميرات المتعددة والقياس عن بعد المدمج.',
    'landing.feature3.title': 'تخزين الكائنات',
    'landing.feature3.desc': 'إدارة أصول مشفرة بـ AES-256 مع تحويل ترميز تلقائي واستخراج البيانات الوصفية بالذكاء الاصطناعي.',
    'landing.stats.uptime': 'وقت التشغيل',
    'landing.stats.latency': 'تأخير P99',
    'landing.stats.throughput': 'الإنتاجية',
    'landing.stats.security': 'الأمن',
    'video.secureCanal': 'قناة آمنة',
    'video.telemetrySpecs': '4K • 12MBPS • تشفير AES-256-GCM نشط',
    'video.handshake': 'المصافحة نشطة',
    'video.participants': 'المشاركون',
    'video.active': 'نشط',
    'video.host': 'المضيف',
    'video.relay': 'تتابع',
    'notif.title': 'سجل',
    'notif.subtitle': 'الأحداث.',
    'notif.telemetry': 'القياس عن بعد المباشر',
    'notif.shard': 'النظام يقوم حالياً باعتراض والتحقق من جميع الأجزاء الواردة.'
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
