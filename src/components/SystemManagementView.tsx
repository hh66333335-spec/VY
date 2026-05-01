import { useState, useEffect } from 'react';
import { collection, query, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { Search, Edit2, X, Terminal, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { cn } from '../lib/utils';

interface UserNode {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  avatar?: string;
  username?: string;
}

export default function SystemManagementView() {
  const { t, isRtl } = useLanguage();
  const [users, setUsers] = useState<UserNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserNode[];
      setUsers(userData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full text-cyan-400 gap-4">
      <Activity className="w-8 h-8 animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">SYNCING_MANAGEMENT_CORE...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex justify-between items-end pb-10 border-b border-white/5">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            {t('mgmt.title')} <span className="text-cyan-400 font-light italic">{t('mgmt.subtitle')}</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            NODE: AUTHENTICATION_CONTROL_CENTER_V2.0
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-2 glass border border-white/5 rounded-2xl flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Reach</span>
            <span className="text-lg font-black text-white">99.9%</span>
          </div>
          <div className="px-6 py-2 glass border border-cyan-400/20 rounded-2xl flex flex-col items-end bg-cyan-400/5">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Active nodes</span>
            <span className="text-lg font-black text-cyan-400">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/2 p-1 rounded-2xl border border-white/5">
            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('mgmt.search')}
                className="w-full bg-transparent py-5 pl-14 pr-6 text-[10px] focus:outline-none transition-all font-mono uppercase tracking-[0.2em] placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="glass border border-white/5 rounded-[40px] overflow-hidden">
            <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">{t('mgmt.users')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">IDENTITY</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">{t('profile.role')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 text-right">PROTOCOL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-cyan-400/[0.02] transition-colors group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden shrink-0 group-hover:border-cyan-400/50 transition-colors p-0.5">
                          <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover rounded-[14px]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{user.name}</div>
                          <div className="text-[9px] font-mono text-slate-500 tracking-widest">NODE_ID: {user.username || user.id.slice(0, 8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="text-[11px] font-mono text-slate-400 tracking-tighter italic">{user.email}</div>
                    </td>
                    <td className="px-8 py-7">
                      <AnimatePresence mode="wait">
                        {editingId === user.id ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-2"
                          >
                            {['viewer', 'editor', 'admin'].map((r) => (
                              <button
                                key={r}
                                onClick={() => updateRole(user.id, r)}
                                disabled={updatingId === user.id}
                                className={cn(
                                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                  user.role === r 
                                    ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                                    : "bg-slate-900 text-slate-500 hover:text-white border border-white/5"
                                )}
                              >
                                {t(`mgmt.${r}`)}
                              </button>
                            ))}
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2">
                             <div className={cn(
                               "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border",
                               user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                               user.role === 'editor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                               'bg-slate-500/10 text-slate-400 border-slate-500/20'
                             )}>
                               {t(`mgmt.${user.role || 'viewer'}`)}
                             </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <button 
                        onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all ml-auto"
                      >
                        {editingId === user.id ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-32 text-center text-slate-700 font-mono text-[10px] uppercase tracking-[0.4em] bg-white/1">
                ERROR: NO_MATCHING_NODES_IN_BUFFER
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass border border-white/5 rounded-[40px] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 flex items-center gap-3">
              <Activity className="w-4 h-4" />
              TELEMETRY_LOG
            </h3>
            <div className="space-y-6 font-mono text-[10px]">
              {[
                { type: 'AUTH', msg: 'Admin elevated NODE_0x2', status: 'OK' },
                { type: 'SEC', msg: 'Firewall sync complete', status: 'DONE' },
                { type: 'NET', msg: 'Shard rebalancing active', status: 'BUSY' },
                { type: 'SYS', msg: 'Kernel update pending', status: 'WARN' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 group border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-cyan-400/50">[{log.type}]</span>
                  <div className="flex-1">
                    <div className="text-slate-400 truncate group-hover:text-white transition-colors">{log.msg}</div>
                    <div className="text-[8px] text-slate-600 mt-1 uppercase tracking-widest">{log.status} // CLOCK_SYNC_T1</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all border border-white/5">
              DOWNLOAD_FULL_DUMP
            </button>
          </div>

          <div className="glass border border-white/5 rounded-[40px] p-8 bg-cyan-400/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-6 flex items-center gap-3">
              <Zap className="w-4 h-4" />
              SYSTEM_LOAD
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>CPU_THREADS</span>
                <span className="text-white tabular-nums">42.8%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '42.8%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" 
                />
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>MEM_PAGING</span>
                <span className="text-white tabular-nums">18.2%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '18.2%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.4)]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
