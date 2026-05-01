import React, { useState, useEffect, ElementType } from 'react';
import { motion } from 'motion/react';
import { 
  Video, 
  Radio, 
  Layout, 
  Settings, 
  LogOut, 
  Monitor, 
  Search,
  Plus,
  User as UserIcon,
  Bell,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import VideoCallView from './VideoCallView';
import VideoVault from './VideoVault';
import ProfileView from './ProfileView';
import LiveStreamView from './LiveStreamView';
import SystemManagementView from './SystemManagementView';
import NotificationCenter from './NotificationCenter';
import { useLanguage } from '../context/LanguageContext';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const telemetryData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

interface SidebarItemProps {
  icon: ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isRtl?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-1 text-left",
      active 
        ? "bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    <span className={cn("text-xs truncate", active ? "font-black" : "font-medium")}>{label}</span>
  </button>
);

type View = 'overview' | 'video-calls' | 'live-streams' | 'recordings' | 'settings' | 'profile' | 'management';

export default function Dashboard() {
  const { t, isRtl } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userData, setUserData] = useState<{name: string, avatar: string, role: string} | null>(null);

  useEffect(() => {
    let unsubUser: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        unsubUser = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              name: data.name || user.displayName || 'User',
              avatar: data.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
              role: data.role || 'viewer'
            });
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });
      } else {
        if (unsubUser) unsubUser();
        setUserData(null);
      }
    });

    return () => {
      unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Simple way to reset to landing
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'video-calls':
        return <VideoCallView />;
      case 'live-streams':
        return <LiveStreamView />;
      case 'recordings':
        return <VideoVault />;
      case 'profile':
        return <ProfileView />;
      case 'management':
        return <SystemManagementView />;
      case 'overview':
      default:
        return (
          <div className="max-w-6xl mx-auto text-[#e2e8f0] space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">{t('dashboard.title')} <span className="text-cyan-400 font-light italic">{t('dashboard.subtitle')}</span></h1>
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">{t('dashboard.session')}: AX-7729</p>
              </div>
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <div className="text-xs font-mono text-cyan-400 glow-text uppercase tracking-widest">Core Engine: Operational</div>
                <div className="text-[10px] text-slate-600 mt-1 font-mono">LATENCY: 24MS • BUFFER: 0%</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: t('dashboard.throughput'), value: '4.2 GB/s', trend: '+12%', color: 'text-cyan-400' },
                { label: t('dashboard.activeNodes'), value: '1,284', trend: 'STABLE', color: 'text-purple-400' },
                { label: t('dashboard.latency'), value: '18ms', trend: '-2ms', color: 'text-amber-400' },
                { label: t('dashboard.uptime'), value: '99.98%', trend: 'OPTIMAL', color: 'text-emerald-400' }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass border border-white/5 rounded-3xl p-6 hover:border-cyan-400/20 transition-all group"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                    <div className={cn("text-[9px] font-mono font-black border border-white/5 px-2 py-1 rounded-lg", stat.color)}>
                      {stat.trend}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Telemetry Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass border border-white/5 rounded-[40px] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">{t('dashboard.telemetry')}</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 text-[8px] font-black uppercase rounded-lg border border-cyan-400/20">LIVE DATA STREAM</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '9px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#22d3ee" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass border border-white/5 rounded-[40px] p-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">{t('dashboard.nodeStatus')}</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Edge Node Alpha', status: 'Healthy', val: 92 },
                    { label: 'Satellite Orbital', status: 'Warning', val: 64 },
                    { label: 'Local Mesh Hub', status: 'Healthy', val: 98 },
                    { label: 'Quantum Relay', status: 'Syncing', val: 45 },
                  ].map((node) => (
                    <div key={node.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                        <span className="text-[#e2e8f0]">{node.label}</span>
                        <span className={cn(
                          node.status === 'Healthy' ? 'text-emerald-400' : 
                          node.status === 'Warning' ? 'text-amber-400' : 'text-cyan-400'
                        )}>{node.status}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={cn("h-full", 
                            node.status === 'Healthy' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 
                            node.status === 'Warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-cyan-400'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${node.val}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 glass border border-cyan-400/10 rounded-3xl bg-cyan-400/5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Network Load</div>
                  <div className="text-2xl font-black text-white italic">OPTIMAL.</div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="glass rounded-[40px] overflow-hidden border border-white/5">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{t('dashboard.recentActivity')}</h2>
                <div className="flex gap-4">
                  <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">EXPORT_TELEMETRY</button>
                  <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">CLEAR_BUFFER</button>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { title: 'System Handshake: PROTOCOL_GCM', id: '0x8892...FF', time: '12:44:12', user: 'Admin' },
                  { title: 'Shard Encryption: AES_256', id: '0xBC12...01', time: '12:40:05', user: 'System' },
                  { title: 'Ingestion Pulse: NODE_HUB_01', id: '0x229D...EE', time: '12:38:55', user: 'Edge_4' }
                ].map((log, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-white/2 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-400/5 border border-cyan-400/20 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs shadow-inner">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors uppercase mb-1">{log.title}</div>
                        <div className="text-[10px] font-mono text-slate-600 tracking-tighter uppercase">{log.id} • {log.user}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-[10px] font-mono text-slate-400 tabular-nums">{log.time}</div>
                      <div className="px-4 py-2 rounded-xl bg-cyan-400 text-black text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                        Details
                      </div>
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
    <div className={`flex h-screen bg-[#050608] text-[#e2e8f0] overflow-hidden ${isRtl ? 'font-sans-arabic' : 'font-sans'}`}>
      {/* Sidebar */}
      <aside className={`w-72 flex flex-col p-6 glass shrink-0 relative mt-4 mb-4 rounded-3xl glow-cyan ${isRtl ? 'mr-4' : 'ml-4'} border border-white/5`}>
        <div className="flex items-center gap-3 px-2 mb-12 cursor-pointer" onClick={() => setCurrentView('overview')}>
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]">L</div>
          <span className="text-xl font-black tracking-widest uppercase glow-text">Lumina</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-4 mb-6">{t('dashboard.ops')}</div>
          <SidebarItem 
            icon={Layout} 
            label={t('dashboard.comm')} 
            active={currentView === 'overview'} 
            onClick={() => setCurrentView('overview')}
          />
          <SidebarItem 
            icon={Video} 
            label={t('dashboard.grid')} 
            active={currentView === 'video-calls'} 
            onClick={() => setCurrentView('video-calls')}
          />
          <SidebarItem 
            icon={Radio} 
            label={t('dashboard.nodes')} 
            active={currentView === 'live-streams'} 
            onClick={() => setCurrentView('live-streams')}
          />
          
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-4 mt-12 mb-6">{t('dashboard.security')}</div>
          <SidebarItem 
            icon={Monitor} 
            label={t('dashboard.assets')} 
            active={currentView === 'recordings'} 
            onClick={() => setCurrentView('recordings')}
          />
          <SidebarItem 
            icon={UserIcon} 
            label={t('dashboard.userNode')} 
            active={currentView === 'profile'} 
            onClick={() => setCurrentView('profile')}
          />
          <SidebarItem 
            icon={Settings} 
            label={t('dashboard.config')} 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')}
          />
          {userData?.role === 'admin' && (
            <SidebarItem 
              icon={Shield} 
              label={t('dashboard.mgmt')} 
              active={currentView === 'management'} 
              onClick={() => setCurrentView('management')}
            />
          )}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest ml-3">{t('dashboard.terminate')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 glass mx-4 mt-4 rounded-3xl border border-white/5 shrink-0">
          <div className="flex items-center relative w-full max-lg">
            <Search className="w-4 h-4 text-slate-500 absolute left-4" />
            <input 
              type="text" 
              placeholder={t('dashboard.searchPlaceholder')} 
              className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-mono tracking-widest focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/5 transition-all uppercase"
            />
          </div>

          <div className="flex items-center gap-6 ml-4">
            <div className={`flex flex-col items-end mr-4`}>
              <span className="text-[10px] font-mono text-cyan-400 glow-text">{t('dashboard.node')}: 104.22.4</span>
              <span className="text-[8px] font-mono text-slate-600 uppercase">{t('dashboard.status')}: {t('dashboard.initialized')}</span>
            </div>
            
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative p-3 glass border border-white/5 rounded-xl text-slate-400 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 group"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full glow-red shadow-[0_0_8px_#ef4444]" />
            </button>

            <button className="flex items-center gap-2 bg-cyan-400 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Plus className="w-4 h-4" />
              {t('dashboard.newInstance')}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 border border-white/20 shrink-0 p-0.5">
              <div className="w-full h-full rounded-[9px] bg-[#050608] flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                <img src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`} alt="Avatar" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#050608]">
          {renderContent()}
        </div>

        {/* Call Footer Bar */}
        <footer className="h-16 glass mx-4 mb-4 rounded-3xl flex items-center px-8 justify-between text-[10px] tracking-[0.2em] font-mono text-slate-500 border border-white/5 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
              <span className="text-cyan-400 glow-text font-black">{t('dashboard.systemReady')}</span>
            </div>
            <div className="hidden md:flex space-x-8 opacity-60">
              <span>{t('dashboard.encryption')}: AES-256</span>
              <span>{t('dashboard.ssl')}: ENABLED</span>
              <span>{t('dashboard.uptime')}: 99.998%</span>
            </div>
          </div>
          <div className="font-black text-slate-400 uppercase">{t('dashboard.telemetry')}: <span className="text-cyan-400 italic">{t('dashboard.active')}.</span></div>
        </footer>

        <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      </main>
    </div>
  );
}
