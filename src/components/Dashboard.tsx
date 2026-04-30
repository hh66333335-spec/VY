import React, { useState, ElementType } from 'react';
import { motion } from 'motion/react';
import { 
  Video, 
  Radio, 
  Layout, 
  Settings, 
  LogOut, 
  Monitor, 
  MessageSquare,
  Search,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import VideoCallView from './VideoCallView';
import VideoVault from './VideoVault';
import ProfileView from './ProfileView';
import NotificationCenter from './NotificationCenter';
import { User as UserIcon, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isRtl?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, isRtl }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-1",
      isRtl ? "text-right flex-row-reverse" : "text-left",
      active 
        ? "bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    <span className={cn("text-xs truncate", active ? "font-black" : "font-medium")}>{label}</span>
  </button>
);

type View = 'overview' | 'video-calls' | 'live-streams' | 'recordings' | 'settings' | 'profile';

export default function Dashboard() {
  const { t, isRtl } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'video-calls':
        return <VideoCallView />;
      case 'recordings':
        return <VideoVault />;
      case 'profile':
        return <ProfileView />;
      case 'overview':
      default:
        return (
          <div className={`max-w-6xl mx-auto text-[#e2e8f0] ${isRtl ? 'text-right' : ''}`}>
            {/* Header Section */}
            <div className={`flex justify-between items-end mb-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">{t('dashboard.title')} <span className="text-cyan-400 font-light italic">{t('dashboard.subtitle')}</span></h1>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">{t('dashboard.session')}: AX-7729</p>
              </div>
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <div className="text-xs font-mono text-cyan-400 glow-text uppercase tracking-widest">Core Engine: Operational</div>
                <div className="text-[10px] text-slate-600 mt-1 font-mono">LATENCY: 24MS • BUFFER: 0%</div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setCurrentView('video-calls')}
                className="p-8 glass rounded-3xl glow-cyan group cursor-pointer border border-cyan-500/20"
              >
                <div className={`w-12 h-12 bg-cyan-500 text-black rounded-xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all ${isRtl ? 'mr-auto' : ''}`}>
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 text-cyan-400 uppercase tracking-tight">{t('dashboard.instant')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">Establish low-latency WebRTC peer connection.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="p-8 glass rounded-3xl group cursor-pointer"
              >
                <div className={`w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6 transition-all group-hover:bg-cyan-500 group-hover:text-black ${isRtl ? 'mr-auto' : ''}`}>
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 text-white uppercase tracking-tight">{t('dashboard.broadcast')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">Initialize global HLS/RTMP ingestion pipeline.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setCurrentView('recordings')}
                className="p-8 glass rounded-3xl group cursor-pointer"
              >
                <div className={`w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6 transition-all group-hover:bg-cyan-500 group-hover:text-black ${isRtl ? 'mr-auto' : ''}`}>
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 text-white uppercase tracking-tight">{t('dashboard.vault')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">Access AES-256 encrypted media repository.</p>
              </motion.div>
            </div>

            {/* Recent Activities */}
            <div className="glass rounded-3xl overflow-hidden border border-white/5">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Telemetry Log</h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Export .LOG</button>
              </div>
              <div className="divide-y divide-white/5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-cyan-500/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                        {i < 10 ? `0${i}` : i}
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight group-hover:text-cyan-400 transition-colors uppercase">System Sync: ALPHA_{i*2}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-0.5">PEER_ID: 0x8892...{i}ff • UPTIME: 02:44:12</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-[10px] font-mono text-cyan-500/50">SECURE</div>
                      <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen bg-[#050608] text-[#e2e8f0] overflow-hidden ${isRtl ? 'flex-row-reverse font-sans-arabic text-right' : 'font-sans'}`}>
      {/* Sidebar */}
      <aside className={`w-72 flex flex-col p-6 glass shrink-0 relative mt-4 mb-4 rounded-3xl glow-cyan ${isRtl ? 'mr-4 border-l border-white/5' : 'ml-4 border-r border-white/5'}`}>
        <div className={`flex items-center gap-3 px-2 mb-12 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`} onClick={() => setCurrentView('overview')}>
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]">L</div>
          <span className="text-xl font-black tracking-widest uppercase glow-text">Lumina</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1">
          <div className={`text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-4 mb-6 ${isRtl ? 'text-right' : ''}`}>Operations</div>
          <SidebarItem 
            icon={Layout} 
            label="Comm-Core Ops" 
            active={currentView === 'overview'} 
            onClick={() => setCurrentView('overview')}
            isRtl={isRtl}
          />
          <SidebarItem 
            icon={Video} 
            label="Video Grid" 
            active={currentView === 'video-calls'} 
            onClick={() => setCurrentView('video-calls')}
            isRtl={isRtl}
          />
          <SidebarItem 
            icon={Radio} 
            label="Live Nodes" 
            active={currentView === 'live-streams'} 
            onClick={() => setCurrentView('live-streams')}
            isRtl={isRtl}
          />
          
          <div className={`text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-4 mt-12 mb-6 ${isRtl ? 'text-right' : ''}`}>Security</div>
          <SidebarItem 
            icon={Monitor} 
            label="Asset Vault" 
            active={currentView === 'recordings'} 
            onClick={() => setCurrentView('recordings')}
            isRtl={isRtl}
          />
          <SidebarItem 
            icon={UserIcon} 
            label="User Node" 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')}
            isRtl={isRtl}
          />
          <SidebarItem 
            icon={Settings} 
            label="System Config" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')}
            isRtl={isRtl}
          />
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`text-xs font-bold uppercase tracking-widest ${isRtl ? 'mr-3' : 'ml-3'}`}>Terminate</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className={`h-20 flex items-center justify-between px-10 glass mx-4 mt-4 rounded-3xl border border-white/5 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center relative w-full max-lg ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Search className={`w-4 h-4 text-slate-500 absolute ${isRtl ? 'right-4' : 'left-4'}`} />
            <input 
              type="text" 
              placeholder="QUERY SYSTEM CORE..." 
              className={`w-full bg-slate-900/40 border border-white/5 rounded-xl py-3 pr-4 text-[10px] font-mono tracking-widest focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/5 transition-all uppercase ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12'}`}
            />
          </div>

          <div className={`flex items-center gap-6 ${isRtl ? 'mr-4' : 'ml-4'} ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex flex-col items-end ${isRtl ? 'ml-4 items-start' : 'mr-4'}`}>
              <span className="text-[10px] font-mono text-cyan-400 glow-text">NODE: 104.22.4</span>
              <span className="text-[8px] font-mono text-slate-600 uppercase">Status: Initialized</span>
            </div>
            
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative p-3 glass border border-white/5 rounded-xl text-slate-400 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 group"
            >
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 w-2 h-2 bg-red-500 rounded-full glow-red shadow-[0_0_8px_#ef4444] ${isRtl ? 'left-2' : 'right-2'}`} />
            </button>

            <button className="flex items-center gap-2 bg-cyan-400 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Plus className="w-4 h-4" />
              New Instance
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 border border-white/20 shrink-0 p-0.5">
              <div className="w-full h-full rounded-[9px] bg-[#050608] flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`} alt="Avatar" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#050608]">
          {renderContent()}
        </div>

        {/* Call Footer Bar */}
        <footer className={`h-16 glass mx-4 mb-4 rounded-3xl flex items-center px-8 justify-between text-[10px] tracking-[0.2em] font-mono text-slate-500 border border-white/5 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-8 ${isRtl? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
              <span className="text-cyan-400 glow-text font-black">SYSTEM READY</span>
            </div>
            <div className={`hidden md:flex space-x-8 opacity-60 ${isRtl ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span>ENCRYPTION: AES-256</span>
              <span>SSL: ENABLED</span>
              <span>UPTIME: 99.998%</span>
            </div>
          </div>
          <div className="font-black text-slate-400 uppercase">TELEMETRY: <span className="text-cyan-400 italic">ACTIVE.</span></div>
        </footer>

        <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      </main>
    </div>
  );
}
