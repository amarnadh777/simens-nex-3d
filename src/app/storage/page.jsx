'use client';
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip, RadarChart, 
  PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';
import { 
  Database, HardDrive, Share2, ShieldCheck, 
  AlertCircle, Activity, Box, Search 
} from 'lucide-react';

// --- STORAGE MOCK DATA ---
const clusterHealth = [
  { subject: 'Latency', A: 120, full: 150 },
  { subject: 'I/O Speed', A: 98, full: 150 },
  { subject: 'Reliability', A: 140, full: 150 },
  { subject: 'Temp', A: 85, full: 150 },
  { subject: 'Uptime', A: 150, full: 150 },
];

const driveData = [
  { name: 'SSD_01', used: 80, free: 20 },
  { name: 'SSD_02', used: 45, free: 55 },
  { name: 'NAS_ARC', used: 92, free: 8 },
  { name: 'BKUP_X', used: 30, free: 70 },
];

const distribution = [
  { name: 'Media', value: 400, color: '#3b82f6' },
  { name: 'System', value: 300, color: '#8b5cf6' },
  { name: 'Backups', value: 300, color: '#06b6d4' },
  { name: 'Logs', value: 200, color: '#f59e0b' },
];

// --- STYLED COMPONENTS ---

const StorageCard = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-blue-400">
        <Icon size={18} />
      </div>
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{title}</h3>
    </div>
    {children}
  </div>
);

const NodeRow = ({ label, type, status, load }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
      <div>
        <p className="text-[10px] font-black text-white uppercase">{label}</p>
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{type}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-bold text-white">{load}%</p>
      <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${load}%` }} />
      </div>
    </div>
  </div>
);

export default function StoragePage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-w-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic text-white">STORAGE_CORE</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Distributed Cluster Management v4.0</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex gap-2">
            <div className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-bold">ALL_NODES</div>
            <div className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-bold text-slate-500">ARCHIVE</div>
        </div>
      </div>

      {/* TOP ROW: RADAR & PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CLUSTER HEALTH (Radar Chart) */}
        <StorageCard title="Cluster Telemetry" icon={Activity} className="lg:col-span-1">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={clusterHealth}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                <Radar
                  name="Health"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </StorageCard>

        {/* DRIVE CAPACITY (Stacked Bar Chart) */}
        <StorageCard title="Node Capacities" icon={HardDrive} className="lg:col-span-2">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driveData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                <Bar dataKey="used" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={12} />
                <Bar dataKey="free" stackId="a" fill="#1e293b" radius={[0, 10, 10, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4 justify-center text-[9px] font-bold uppercase tracking-widest">
             <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-sm" /> Used Space</span>
             <span className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-800 rounded-sm" /> Available</span>
          </div>
        </StorageCard>
      </div>

      {/* BOTTOM ROW: NODES & DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ACTIVE NODES LIST */}
        <div className="lg:col-span-1 space-y-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] px-2">Active Nodes</p>
            <NodeRow label="ALPHA_NODE_01" type="NVME_GEN4" status="Online" load={82} />
            <NodeRow label="BETA_STORAGE" type="HDD_RAID_10" status="Online" load={45} />
            <NodeRow label="GAMMA_MIRROR" type="SSD_SATA" status="Online" load={12} />
            <NodeRow label="DELTA_TEMP" type="VIRTUAL_DISK" status="Offline" load={0} />
        </div>

        {/* DATA DISTRIBUTION (Pie Chart) */}
        <StorageCard title="Data Distribution" icon={Box} className="lg:col-span-1">
            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                          data={distribution} 
                          innerRadius={60} 
                          outerRadius={80} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                            {distribution.map((entry, index) => (
                                <Cell key={index} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Database size={20} className="text-slate-700 mb-1" />
                    <span className="text-xs font-black text-white">1.2 TB</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {distribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                    </div>
                ))}
            </div>
        </StorageCard>

        {/* SECURITY & INTEGRITY */}
        <StorageCard title="Integrity Check" icon={ShieldCheck} className="lg:col-span-1 flex flex-col justify-between">
            <div className="py-2">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-emerald-400 italic">SECURE_CLUSTER</span>
                    <ShieldCheck className="text-emerald-500" size={24} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                    All storage nodes are currently synchronized with <span className="text-white">AES-256 bit encryption</span>. No parity errors detected in the last 24 hours.
                </p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500 uppercase">Uptime Score</span>
                        <span className="text-white">99.99%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '99%' }} />
                    </div>
                </div>
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all mt-6">
                RUN_INTEGRITY_SCAN
            </button>
        </StorageCard>

      </div>

    </div>
  );
}