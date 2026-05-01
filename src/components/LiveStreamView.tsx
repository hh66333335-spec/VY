import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Radio, 
  Users, 
  MessageSquare, 
  Send, 
  Mic, 
  Video, 
  Circle, 
  X, 
  UserPlus, 
  Settings,
  Heart,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export default function LiveStreamView() {
  const { t, isRtl } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Secure ingest pipeline initialized.', time: '10:00', isSystem: true },
    { id: '2', user: 'Peer_0x99', text: 'The latency is incredible on this node!', time: '10:02' },
    { id: '3', user: 'Admin_Alpha', text: 'Welcome to the secure broadcast session.', time: '10:05' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewerCount] = useState(1284);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    if (isStreaming && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isStreaming, stream]);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      setIsStreaming(true);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        user: 'System', 
        text: 'BROADCAST_START: Global node ingestion active.', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true 
      }]);
    } catch (err) {
      console.error("Failed to get camera:", err);
      // Fallback or error msg
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsStreaming(false);
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      user: 'System', 
      text: 'BROADCAST_TERMINATED: Pipeline flushed.', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true 
    }]);
  };
  const [coHosts, setCoHosts] = useState([
    { id: 'beta', name: 'Peer_Beta', avatar: 'User2', isMuted: false, isVideoOff: false }
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const addCoHost = (name: string, avatar: string) => {
    if (coHosts.length >= 3) return; // Limit co-hosts
    setCoHosts([...coHosts, { id: Date.now().toString(), name, avatar, isMuted: false, isVideoOff: false }]);
    setIsInviteModalOpen(false);
  };

  const removeCoHost = (id: string) => {
    setCoHosts(coHosts.filter(c => c.id !== id));
  };

  const toggleCoHostMute = (id: string) => {
    setCoHosts(coHosts.map(c => c.id === id ? { ...c, isMuted: !c.isMuted } : c));
  };

  const toggleCoHostVideo = (id: string) => {
    setCoHosts(coHosts.map(c => c.id === id ? { ...c, isVideoOff: !c.isVideoOff } : c));
  };

  return (
    <div className={`flex h-full gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
      {/* Main Broadcast Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Video Player Container */}
        <div className="relative aspect-video glass rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
          {/* Main Stream */}
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            {isStreaming ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <Radio className="w-16 h-16 text-cyan-400/20 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Co-Host PIPs */}
          <Reorder.Group 
            axis="y" 
            values={coHosts} 
            onReorder={setCoHosts}
            className="absolute top-8 right-8 flex flex-col gap-4 z-10"
          >
            <AnimatePresence>
              {coHosts.map((host) => (
                <Reorder.Item 
                  key={host.id}
                  value={host}
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-48 aspect-video glass border border-cyan-400/30 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group/host"
                >
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    {host.isVideoOff ? (
                       <Video className="w-8 h-8 text-slate-700" />
                    ) : (
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${host.avatar}`} alt={host.name} className="w-full h-full object-cover opacity-60" />
                    )}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded-md text-[8px] font-black uppercase tracking-widest text-[#e2e8f0]">Co-Host: {host.name}</div>
                  
                  {/* Host Controls */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover/host:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toggleCoHostMute(host.id)}
                      className={`p-2 rounded-lg transition-all ${host.isMuted ? 'bg-red-500 text-white' : 'glass text-cyan-400 hover:bg-white/10'}`}
                    >
                      <Mic className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => toggleCoHostVideo(host.id)}
                      className={`p-2 rounded-lg transition-all ${host.isVideoOff ? 'bg-red-500 text-white' : 'glass text-cyan-400 hover:bg-white/10'}`}
                    >
                      <Video className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeCoHost(host.id)}
                      className="p-2 glass text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Overlays */}
          <div className="absolute top-8 left-8 flex items-center gap-4">
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all",
               isStreaming ? "bg-red-500 shadow-red-500/40" : "bg-slate-800 text-slate-500 border border-white/5"
             )}>
                <Circle className={cn("w-3 h-3 fill-white", isStreaming && "animate-pulse")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{isStreaming ? 'Live' : 'Standby'}</span>
             </div>
             <div className="px-4 py-2 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3 text-cyan-400" />
                {viewerCount.toLocaleString()} Viewers
             </div>
             {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-2 bg-cyan-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  <Circle className="w-2 h-2 fill-black animate-pulse" />
                  Recording
                </motion.div>
             )}
          </div>

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
             <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight uppercase">Stream: <span className="text-cyan-400">Node_Alpha_Master</span></h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Category: Engineering • Quality: 4K Ultra Lossless</p>
             </div>
             <div className="flex items-center gap-3">
                <button className="p-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-cyan-400">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-4 glass border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-[#ef4444]">
                  <Heart className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={`p-6 glass border border-white/5 rounded-[30px] flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
           <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={isStreaming ? stopStream : startStream}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl",
                  isStreaming 
                    ? "bg-slate-800 text-red-500 border border-red-500/30 hover:bg-red-500/10" 
                    : "bg-cyan-400 text-black hover:bg-white shadow-cyan-400/20"
                )}
              >
                {isStreaming ? <Radio className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                {isStreaming ? 'End Broadcast' : 'Start Broadcast'}
              </button>

              <button 
                onClick={toggleRecording}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                <Circle className={cn("w-4 h-4", isRecording && "fill-white")} />
                {isRecording ? 'Stop Recording' : 'Record Stream'}
              </button>

              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest text-slate-400"
              >
                <UserPlus className="w-4 h-4" />
                Invite Co-Host
              </button>
           </div>

           <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button className="p-3 glass border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400 transition-all">
                 <Mic className="w-5 h-5" />
              </button>
              <button className="p-3 glass border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400 transition-all">
                 <Video className="w-5 h-5" />
              </button>
              <button className="p-3 glass border border-white/10 rounded-xl text-slate-400 hover:text-cyan-400 transition-all">
                 <Settings className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass border border-white/10 rounded-[40px] p-8 overflow-hidden glow-cyan"
            >
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase tracking-tight">Invite <span className="text-cyan-400">Co-Host.</span></h3>
                  <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-4">
                  {[
                    { name: 'Peer_Gamma', avatar: 'User3' },
                    { name: 'Peer_Delta', avatar: 'User4' },
                    { name: 'Root_User', avatar: 'User5' }
                  ].map((peer) => (
                    <button 
                      key={peer.name}
                      onClick={() => addCoHost(peer.name, peer.avatar)}
                      className="w-full p-4 glass border border-white/5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/40 transition-all group"
                    >
                       <div className="w-12 h-12 rounded-xl glass border border-white/10 p-0.5 group-hover:border-cyan-400 transition-all">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.avatar}`} alt={peer.name} className="w-full h-full rounded-[9px] object-cover opacity-80" />
                       </div>
                       <div className="text-left font-black uppercase tracking-widest text-[10px]">{peer.name}</div>
                       <UserPlus className="w-4 h-4 ml-auto text-slate-500 group-hover:text-cyan-400" />
                    </button>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            className="w-96 flex flex-col glass border border-white/5 rounded-[40px] overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{t('dashboard.broadcast')} Chat</span>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex flex-col ${msg.user === 'You' ? (isRtl ? 'items-start' : 'items-end') : (isRtl ? 'items-end' : 'items-start')}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                       <span className={`text-[8px] font-black uppercase tracking-widest ${msg.isSystem ? 'text-cyan-400' : 'text-slate-500'}`}>{msg.user}</span>
                       <span className="text-[8px] font-mono text-slate-600">{msg.time}</span>
                    </div>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-[11px] max-w-[85%] leading-relaxed",
                      msg.user === 'You' 
                        ? "bg-cyan-500 text-black font-medium" 
                        : msg.isSystem 
                          ? "bg-slate-900 border border-cyan-500/20 text-cyan-400 italic" 
                          : "bg-white/5 text-slate-300 border border-white/5"
                    )}>
                       {msg.text}
                    </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/5">
               <div className="relative">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs focus:outline-none focus:border-cyan-400 transition-all ${isRtl ? 'text-right' : ''}`}
                  />
                  <button 
                    type="submit"
                    className={`absolute top-1/2 -translate-y-1/2 p-2 bg-cyan-400 text-black rounded-xl hover:bg-white transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] ${isRtl ? 'left-2' : 'right-2'}`}
                  >
                    <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="absolute right-12 bottom-12 w-14 h-14 bg-cyan-400 text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
