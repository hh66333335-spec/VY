import { motion } from 'motion/react';
import { Play, Upload, Search, Filter, MoreHorizontal, Clock, HardDrive, Share2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { collection, query, addDoc, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

interface Recording {
  id: string;
  title: string;
  duration: string;
  size: string;
  status: string;
  createdAt: any;
  ownerId: string;
}

export default function VideoVault() {
  const [videos, setVideos] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'recordings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recording[];
      setVideos(vids);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recordings');
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    try {
      // Simulate processing time
      await addDoc(collection(db, 'recordings'), {
        title: file.name.toUpperCase().replace(/\.[^/.]+$/, ""),
        duration: "PROCESSING",
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: "Processing",
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isPublic: false
      });
      
      // In a real app, you'd upload to Storage here
      // For this demo, we'll just simulate a successful database entry
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'recordings');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-cyan-400 animate-pulse font-black uppercase tracking-[0.4em]">SYNC_VAULT_METRICS...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="video/*"
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Media <span className="text-cyan-400 font-light italic">Vault.</span></h1>
          <p className="text-slate-500 mt-2 uppercase tracking-[0.2em] text-[10px] font-bold">Node Area: STORAGE_SECURE_RETA_4</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-3 border border-white/10 rounded-2xl glass hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-widest text-[#e2e8f0]">
            <Search className="w-4 h-4 text-cyan-400" />
            Query
          </button>
          <button 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-6 py-3 bg-cyan-400 text-black rounded-2xl hover:bg-white disabled:bg-slate-700 disabled:text-slate-400 transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Ingesting...' : 'Ingest Asset'}
          </button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="p-8 glass border border-cyan-500/10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-cyan-500/10 transition-colors" />
          <HardDrive className="w-6 h-6 text-cyan-400 mb-6" />
          <div className="text-3xl font-black tracking-tighter text-[#e2e8f0]">1.24 <span className="text-sm font-mono text-slate-500">TB</span></div>
          <div className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mt-2">Utilization Metrics</div>
        </div>
        <div className="p-8 glass border border-blue-500/10 rounded-3xl group">
          <Clock className="w-6 h-6 text-blue-400 mb-6" />
          <div className="text-3xl font-black tracking-tighter text-[#e2e8f0]">142.8 <span className="text-sm font-mono text-slate-500">H</span></div>
          <div className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mt-2">Retention Cycle</div>
        </div>
        <div className="p-8 glass border border-white/5 rounded-3xl group">
          <Filter className="w-6 h-6 text-slate-400 mb-6 group-hover:text-cyan-400 transition-colors" />
          <div className="text-3xl font-black tracking-tighter text-[#e2e8f0]">48</div>
          <div className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mt-2">Virtual Shards</div>
        </div>
        <div className="p-8 glass border border-white/5 rounded-3xl group">
          <Share2 className="w-6 h-6 text-slate-400 mb-6 group-hover:text-cyan-400 transition-colors" />
          <div className="text-3xl font-black tracking-tighter text-[#e2e8f0]">1.2 <span className="text-sm font-mono text-slate-500">K</span></div>
          <div className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mt-2">Gateway Peers</div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {videos.map((video, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -8 }}
            className="glass border border-white/5 rounded-[40px] overflow-hidden group cursor-pointer shadow-xl glow-cyan"
          >
            <div className="aspect-video bg-[#0d1117] relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 bg-cyan-900/40">
                <div className="w-16 h-16 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  <Play className="w-8 h-8 fill-black" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 glass border border-white/10 text-[10px] font-mono font-black rounded-lg text-cyan-400 glow-text">
                {video.duration}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-[13px] uppercase tracking-widest text-[#e2e8f0] group-hover:text-cyan-400 transition-all">{video.title}</h3>
                  <p className="text-[10px] font-mono text-slate-600 mt-1.5 uppercase">
                    {video.createdAt?.toDate ? video.createdAt.toDate().toLocaleDateString() : 'Just now'} • {video.size}
                  </p>
                </div>
                <button className="p-2.5 glass border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]",
                  video.status === 'Ready' || video.status === 'Transcoded' 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "bg-white/5 text-slate-500 border border-white/10 animate-pulse"
                )}>
                  {video.status}
                </span>
                <div className="h-4 w-[1px] bg-white/5" />
                <span className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">Codec: AV1_S</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
