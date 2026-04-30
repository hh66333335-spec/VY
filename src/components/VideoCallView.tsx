import { motion } from 'motion/react';
import { Mic, Video, Monitor, PhoneOff, MessageSquare, Users, MoreVertical } from 'lucide-react';

export default function VideoCallView() {
  return (
    <div className="flex flex-col h-full gap-8">
      {/* Participant Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
              <div className="p-2 glass rounded-lg text-cyan-400">
                <Mic className="w-4 h-4" />
              </div>
            </div>
          </div>
          {/* Placeholder for video stream */}
          <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full glass border border-cyan-500/30 flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse opacity-20" />
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover rounded-full absolute opacity-80" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 glass border border-cyan-500/30 rounded-full text-[8px] font-black uppercase tracking-widest text-cyan-400">
                Active
              </div>
            </div>
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
            <div className="w-9 h-9 rounded-full border-2 border-[#050608] bg-cyan-400 flex items-center justify-center text-[10px] font-black text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer hover:scale-110 transition-all">+2</div>
          </div>
          <div className="h-6 w-[1px] bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-black glow-text">Secure Canal_04</span>
            <span className="text-[8px] text-slate-600 font-mono tracking-widest uppercase mt-0.5">4K • 12MBPS • AES-256-GCM ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-[30px] border border-white/5 shadow-inner">
          <button className="w-12 h-12 rounded-full border border-white/5 glass hover:bg-white/5 transition-all flex items-center justify-center group active:scale-90">
            <Mic className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
          <button className="w-12 h-12 rounded-full border border-white/5 glass hover:bg-white/5 transition-all flex items-center justify-center group active:scale-90">
            <Video className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
          <button className="w-12 h-12 rounded-full bg-cyan-400 text-black hover:bg-white transition-all flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-90">
            <Monitor className="w-5 h-5" />
          </button>
          <button className="w-20 h-12 rounded-[24px] bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-90 font-black text-[10px] uppercase tracking-widest">
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-4 glass rounded-2xl text-slate-500 hover:text-cyan-400 transition-all relative group border border-white/5">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse shadow-[0_0_10px_#22d3ee]" />
          </button>
          <button className="p-4 glass rounded-2xl text-slate-500 hover:text-cyan-400 transition-all border border-white/5">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-4 glass rounded-2xl text-slate-500 hover:text-cyan-400 transition-all border border-white/5">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
