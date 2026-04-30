import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Video, Radio, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Notification {
  id: string;
  type: 'message' | 'call' | 'stream';
  title: string;
  body: string;
  time: string;
  encrypted: boolean;
}

export default function NotificationCenter({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t, isRtl } = useLanguage();
  const [notifications] = useState<Notification[]>([
    { 
      id: '1', 
      type: 'message', 
      title: 'INCOMING_CIPHER', 
      body: 'Decrypting 1.2Kb chunk from Peer_0x4F...', 
      time: 'Just now',
      encrypted: true 
    },
    { 
      id: '2', 
      type: 'call', 
      title: 'MISSED_HANDSHAKE', 
      body: 'Peer_Alpha requested RTC tunnel.', 
      time: '12m ago',
      encrypted: true 
    },
    { 
      id: '3', 
      type: 'stream', 
      title: 'BROADCAST_LIVE', 
      body: 'Engineering Node #4 is now ingesting.', 
      time: '45m ago',
      encrypted: false 
    }
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            className={`fixed top-0 ${isRtl ? 'left-0 border-r' : 'right-0 border-l'} h-full w-full max-w-md glass border-white/10 z-[70] shadow-2xl p-8`}
          >
            <div className={`flex justify-between items-center mb-8 ${isRtl? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl font-black tracking-tight uppercase">{t('notif.title')} <span className="text-cyan-400 font-light italic">{t('notif.subtitle')}</span></h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{t('notif.telemetry')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-hide">
              {notifications.map((n) => (
                <div key={n.id} className="p-5 glass border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all shadow-lg overflow-hidden relative">
                   {n.encrypted && (
                     <div className={`absolute top-0 ${isRtl ? 'left-0 rounded-br-0 rounded-bl-xl' : 'right-0 rounded-bl-xl'} px-3 py-1 bg-cyan-400/10 text-cyan-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1`}>
                       <ShieldCheck className="w-3 h-3" />
                       E2EE Active
                     </div>
                   )}
                   <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 border border-white/5 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                       {n.type === 'message' && <MessageSquare className="w-5 h-5" />}
                       {n.type === 'call' && <Video className="w-5 h-5" />}
                       {n.type === 'stream' && <Radio className="w-5 h-5" />}
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#e2e8f0]">{n.title}</h3>
                       <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.body}</p>
                       <span className="text-[9px] font-mono text-slate-600 uppercase mt-3 block">{n.time}</span>
                     </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 glass border border-cyan-500/20 rounded-3xl">
              <div className={`flex items-center gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <ShieldCheck className="w-5 h-5 text-cyan-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Guard</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className={`bg-cyan-400 h-full glow-cyan shadow-[0_0_10px_#22d3ee] ${isRtl ? 'mr-auto' : ''}`}
                />
              </div>
              <p className={`text-[9px] text-slate-600 mt-3 font-mono ${isRtl ? 'text-right' : ''}`}>{t('notif.shard')}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
