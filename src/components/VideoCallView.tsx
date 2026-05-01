import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Monitor, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  MoreVertical,
  Shield,
  X,
  StopCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VideoCallView() {
  const { t, isRtl } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startLocalVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    if (!isVideoOff) {
      startLocalVideo();
    } else {
      localStream?.getTracks().forEach(t => t.stop());
      setLocalStream(null);
    }

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, [isVideoOff]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOff]);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        setScreenStream(stream);
        setIsScreenSharing(true);

        // Listen for when the user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    }
  };

  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      screenStream?.getTracks().forEach(track => track.stop());
    };
  }, [screenStream]);

  const participants = [
    { id: 'self', name: 'Alex_77 (You)', role: 'Local Node', status: 'Active', avatar: 'Alex' },
    { id: '1', name: 'Node_01F9', role: 'Remote Peer', status: 'Active', avatar: 'User1' },
    { id: '2', name: 'Node_02F9', role: 'Remote Peer', status: 'Active', avatar: 'User2' },
    { id: '3', name: 'Node_03F9', role: 'Remote Peer', status: 'Inactive', avatar: 'User3' },
    { id: '4', name: 'Node_04F9', role: 'Remote Peer', status: 'Active', avatar: 'User4' },
    { id: '5', name: 'Node_05F9', role: 'Remote Peer', status: 'Active', avatar: 'User5' },
  ];

  return (
    <div className="flex h-full gap-6">
      {/* Main Call Layout */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Participant Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {/* Screen Share Tile (Conditional) */}
          {isScreenSharing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative col-span-1 md:col-span-2 lg:col-span-2 rounded-[40px] overflow-hidden glass border border-cyan-400 shadow-2xl glow-cyan"
            >
              <video 
                ref={screenVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain bg-black"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-3 py-1.5 bg-cyan-400 rounded-xl text-[9px] font-black text-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.4)]">Your Presentation</span>
              </div>
              <button 
                onClick={toggleScreenShare}
                className="absolute top-6 right-6 p-3 glass border border-white/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">End Share</span>
              </button>
            </motion.div>
          )}

          {/* Main User (Self) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[40px] overflow-hidden glass border border-cyan-500/20 group shadow-2xl glow-cyan"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1.5 glass border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400">Local Node</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              <span className="font-black text-[10px] uppercase tracking-widest text-[#e2e8f0]">User: Alex_77</span>
              <div className="flex gap-2">
                <div className={`p-2 glass rounded-lg transition-all ${isMuted ? 'text-red-500 bg-red-500/10' : 'text-cyan-400'}`}>
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </div>
                <div className={`p-2 glass rounded-lg transition-all ${isVideoOff ? 'text-red-500 bg-red-500/10' : 'text-cyan-400'}`}>
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </div>
              </div>
            </div>
            {/* Placeholder for video stream */}
            <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
              {isVideoOff ? (
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full glass border border-cyan-500/30 flex items-center justify-center p-1">
                    <VideoOff className="w-10 h-10 text-slate-700" />
                  </div>
                </div>
              ) : (
                <video 
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror-mode"
                />
              )}
            </div>
          </motion.div>

          {/* Remote Participants */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-[40px] overflow-hidden glass border border-white/5 group border-b-2 border-b-white/5"
            >
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-3 py-1.5 bg-cyan-400 rounded-xl text-[9px] font-black text-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,211,238,0.4)]">Remote</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center glass p-4 border border-white/5 rounded-2xl">
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Node_ID: 0x{i}F9</span>
                <Mic className="w-4 h-4 text-slate-700" />
              </div>
              <div className="w-full h-full flex items-center justify-center bg-[#050608]/40">
                 <Video className="w-10 h-10 text-white/[0.03]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modern Control Center */}
        <div className="h-24 glass border border-white/5 rounded-[40px] px-10 flex items-center justify-between shadow-2xl relative mb-4">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#050608] glass flex items-center justify-center text-[9px] font-black hover:z-10 transition-all hover:scale-110 cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-[#050608] bg-cyan-400 flex items-center justify-center text-[10px] font-black text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer hover:scale-110 transition-all flex-shrink-0">+2</div>
            </div>
            <div className="h-6 w-[1px] bg-white/5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-black glow-text">{t('video.secureCanal')}_04</span>
              <span className="text-[8px] text-slate-600 font-mono tracking-widest uppercase mt-0.5">{t('video.telemetrySpecs')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-2 rounded-[30px] border border-white/5 shadow-inner">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full border transition-all flex items-center justify-center group active:scale-90 ${isMuted ? 'bg-red-500/20 border-red-500/50' : 'border-white/5 glass hover:bg-white/5'}`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-red-500" />
              ) : (
                <Mic className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              )}
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full border transition-all flex items-center justify-center group active:scale-90 ${isVideoOff ? 'bg-red-500/20 border-red-500/50' : 'border-white/5 glass hover:bg-white/5'}`}
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5 text-red-500" />
              ) : (
                <Video className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              )}
            </button>
            <button 
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-90 ${isScreenSharing ? 'bg-cyan-400 text-black' : 'glass border border-white/5 text-slate-500 hover:text-cyan-400'}`}
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button className="w-20 h-12 rounded-[24px] bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-90 font-black text-[10px] uppercase tracking-widest shrink-0">
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-4 glass rounded-2xl text-slate-500 hover:text-cyan-400 transition-all relative group border border-white/5">
              <MessageSquare className="w-5 h-5" />
              <span className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse shadow-[0_0_10px_#22d3ee]`} />
            </button>
            <button 
              onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
              className={`p-4 glass rounded-2xl transition-all border border-white/5 ${isParticipantsOpen ? 'text-cyan-400 bg-cyan-400/5 border-cyan-500/20' : 'text-slate-500 hover:text-cyan-400'}`}
            >
              <Users className="w-5 h-5" />
            </button>
            <button className="p-4 glass rounded-2xl text-slate-500 hover:text-cyan-400 transition-all border border-white/5">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Participant Sidebar */}
      <AnimatePresence>
        {isParticipantsOpen && (
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -20 : 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 320 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20, width: 0 }}
            className={`glass border border-white/5 rounded-[40px] flex flex-col overflow-hidden shadow-2xl shrink-0 ${isRtl ? 'border-r' : 'border-l'}`}
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Node <span className="text-white">Registry.</span></h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Active: {participants.length}</p>
              </div>
              <button 
                onClick={() => setIsParticipantsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto scrollbar-hide">
              {participants.map((p) => (
                <div key={p.id} className="p-4 glass border border-white/5 rounded-3xl flex items-center gap-4 group hover:border-cyan-500/30 transition-all">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl glass border-2 border-white/5 flex items-center justify-center p-0.5 group-hover:border-cyan-500/30 transition-all">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatar}`} alt="Avatar" className="w-full h-full rounded-[9px] object-cover opacity-80" />
                    </div>
                    {p.status === 'Active' && (
                      <span className={`absolute -bottom-1 ${isRtl ? '-left-1' : '-right-1'} w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#050608] shadow-[0_0_8px_#22d3ee]`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-[#e2e8f0] truncate uppercase tracking-tight">{p.name}</div>
                    <div className="text-[9px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                       <Shield className="w-3 h-3 text-cyan-400/40" />
                       {p.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 text-center">
              <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-cyan-400 border border-cyan-500/20 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all">
                Broadcast Invite
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

