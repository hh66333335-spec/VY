import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Video, Radio, Share2, ArrowRight, Shield, Zap, Globe, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 glass rounded-2xl glow-cyan"
  >
    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/30">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const { t, isRtl } = useLanguage();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const path = `users/${result.user.uid}`;
      try {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: result.user.displayName || 'Anonymous',
            email: result.user.email || '',
            avatar: result.user.photoURL || '',
            language: isRtl ? 'ar' : 'en',
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
      
      onStart();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050608] text-[#e2e8f0] selection:bg-cyan-500 selection:text-black ${isRtl ? 'font-sans-arabic text-right' : ''}`}>
      {/* Navigation */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 px-6 py-4 flex justify-between items-center glass rounded-2xl glow-cyan ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]">L</div>
          <span className="text-xl font-bold tracking-[0.2em] uppercase glow-text">Lumina</span>
        </div>
        <div className={`hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <a href="#features" className="hover:text-cyan-400 transition-colors">{t('nav.features')}</a>
          <a href="#tech" className="hover:text-cyan-400 transition-colors">{t('nav.docs')}</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">{t('nav.protocol')}</a>
        </div>
        <button 
          onClick={handleGoogleLogin}
          className="px-6 py-2 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all active:scale-95 shadow-[0_0_10px_rgba(34,211,238,0.2)] flex items-center gap-2"
        >
          <LogIn className="w-3 h-3" />
          {t('nav.launch')}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System v1.0.4 Online
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[10vw] md:text-[7vw] font-black leading-[0.8] tracking-tighter uppercase mb-8"
            >
              {t('hero.title')} <br /> <span className="text-cyan-400 font-light opacity-80 italic tracking-[0.1em]">{t('hero.subtitle')}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl text-lg text-slate-400 mb-12 font-light tracking-wide"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`flex flex-col sm:flex-row gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}
            >
              <button 
                onClick={handleGoogleLogin}
                className="group px-8 py-4 bg-cyan-400 text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-white transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                {t('hero.cta')}
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>
              <button className="px-8 py-4 glass text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-xl active:scale-95">
                {t('hero.spec')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Video className="w-6 h-6" />}
              title="RTC Handshakes"
              description="Low-latency WebRTC pipelines with adaptive bitrate adaptive mesh active for seamless 4K delivery."
            />
            <FeatureCard 
              icon={<Radio className="w-6 h-6" />}
              title="Media Ingestion"
              description="Professional scale RTMP/HLS ingestion hubs with multi-cam redundancy and integrated WebSocket telemetry."
            />
            <FeatureCard 
              icon={<Share2 className="w-6 h-6" />}
              title="Object Storage"
              description="Secure AES-256 encrypted asset management with automated transcoding and AI-driven metadata extraction."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="stat-border pl-6 text-left">
            <div className="text-4xl font-black mb-2 glow-text tracking-tighter">99.9%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Uptime SLI</div>
          </div>
          <div className="stat-border pl-6 text-left">
            <div className="text-4xl font-black mb-2 glow-text tracking-tighter">24ms</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">P99 Latency</div>
          </div>
          <div className="stat-border pl-6 text-left">
            <div className="text-4xl font-black mb-2 glow-text tracking-tighter">1.4M</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Throughput</div>
          </div>
          <div className="stat-border pl-6 text-left">
            <div className="text-4xl font-black mb-2 glow-text tracking-tighter">AES</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Security</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 glass mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center font-bold text-black text-xs">L</div>
            <span className="text-lg font-bold tracking-[0.1em] uppercase glow-text">Lumina</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>REGION: US-EAST-1</span>
            <span>STATUS: INITIALIZED</span>
            <span>© 2024 Comm-Core Ops</span>
          </div>
          <div className="flex gap-4 opacity-50">
            <Shield className="w-4 h-4" />
            <Zap className="w-4 h-4" />
            <Globe className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
