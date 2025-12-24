'use client';
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  BarChart, Bar, Cell, Tooltip, ScatterChart, 
  Scatter, ZAxis, CartesianGrid 
} from 'recharts';
import { 
  ShieldAlert, ShieldCheck, Lock, Globe, 
  Eye, Zap, Fingerprint, Terminal, AlertTriangle 
} from 'lucide-react';

// --- SECURITY MOCK DATA ---
const threatTraffic = [
  { time: '00:00', threats: 12, blocks: 45 },
  { time: '04:00', threats: 45, blocks: 80 },
  { time: '08:00', threats: 25, blocks: 60 },
  { time: '12:00', threats: 90, blocks: 110 },
  { time: '16:00', threats: 55, blocks: 90 },
  { time: '20:00', threats: 30, blocks: 75 },
];

const attackVectorData = [
  { x: 10, y: 30, z: 200, name: 'DDoS' },
  { x: 30, y: 70, z: 400, name: 'SQLi' },
  { x: 45, y: 50, z: 300, name: 'BruteForce' },
  { x: 70, y: 20, z: 150, name: 'XSS' },
  { x: 85, y: 80, z: 500, name: 'Malware' },
];

// --- STYLED COMPONENTS ---

const SecurityCard = ({ children, title, status, icon: Icon, className = "" }) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-red-400">
          <Icon size={18} />
        </div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{title}</h3>
      </div>
      {status && (
        <span className="text-[9px] font-black px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full animate-pulse">
          {status}
        </span>
      )}
    </div>
    {children}
  </div>
);

const ThreatItem = ({ label, ip, level, time }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-1.5 rounded-full ${level === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-amber-500'}`} />
      <div>
        <p className="text-[10px] font-black text-white uppercase">{label}</p>
        <p className="text-[8px] text-slate-500 font-bold font-mono tracking-tighter">{ip}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[9px] font-bold text-slate-400">{time}</p>
      <p className={`text-[8px] font-black uppercase ${level === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>{level}</p>
    </div>
  </div>
);

export default function SecurityPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-700 min-w-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic text-white flex items-center gap-4">
            SECURITY_OPS <ShieldAlert className="text-red-500" size={32} />
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest italic">Global Threat Mitigation Layer active</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</p>
              <p className="text-xl font-black text-emerald-400">DEFCON 5</p>
           </div>
        </div>
      </div>

      {/* TOP ROW: THREAT AREA & SCATTER MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* THREAT DETECTION TREND (Area Chart) */}
        <SecurityCard title="Threat Velocity" icon={Zap} className="lg:col-span-2">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatTraffic}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={3} fill="url(#colorThreat)" />
                <Area type="monotone" dataKey="blocks" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SecurityCard>

        {/* SECURITY STATS MINI GRID */}
        <div className="flex flex-col gap-4">
           <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem] p-6 flex flex-col justify-between flex-1">
              <ShieldCheck className="text-emerald-400 mb-2" size={24} />
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">Firewall_Active</p>
              <h4 className="text-2xl font-black text-white mt-1">99.9% <span className="text-[10px] text-slate-500">Uptime</span></h4>
           </div>
           <div className="bg-red-500/5 border border-red-500/20 rounded-[1.5rem] p-6 flex flex-col justify-between flex-1">
              <AlertTriangle className="text-red-400 mb-2" size={24} />
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest font-mono">Blocked_Attacks</p>
              <h4 className="text-2xl font-black text-white mt-1">12,402 <span className="text-[10px] text-slate-500">Today</span></h4>
           </div>
        </div>
      </div>

      {/* BOTTOM ROW: LOGS & SCANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIVE THREAT LOGS */}
        <div className="lg:col-span-1 space-y-4">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
             <Terminal size={14} /> Intrusion Logs
           </p>
           <ThreatItem label="DDoS_Saturate" ip="192.168.4.12" level="Critical" time="12:44:02" />
           <ThreatItem label="SQL_Injection" ip="45.122.0.8" level="Warning" time="12:42:15" />
           <ThreatItem label="Auth_Brute_Force" ip="102.33.1.4" level="Critical" time="12:40:01" />
           <ThreatItem label="Peer_Auth_Fail" ip="unknown" level="Warning" time="12:38:55" />
        </div>

        {/* ATTACK VECTOR SCATTER MAP */}
        <SecurityCard title="Attack Vector Map" icon={Globe} className="lg:col-span-2">
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis type="number" dataKey="x" hide />
                    <YAxis type="number" dataKey="y" hide />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Scatter name="Attacks" data={attackVectorData} fill="#ef4444">
                       {attackVectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ef4444' : '#f59e0b'} fillOpacity={0.6} />
                       ))}
                    </Scatter>
                 </ScatterChart>
              </ResponsiveContainer>
           </div>
           <div className="flex justify-between mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]" /> External Threats</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_orange]" /> Policy Violations</span>
           </div>
        </SecurityCard>

      </div>

      {/* FLOATING ACTION FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border border-white/5">
            <Fingerprint className="text-blue-400 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[10px] font-black text-white uppercase">Identity Vault</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase">MFA Protocols Active</p>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border border-white/5">
            <Lock className="text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[10px] font-black text-white uppercase">Key Rotation</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase">Last rotated 2h ago</p>
            </div>
         </div>
         <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border border-white/5">
            <Eye className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[10px] font-black text-white uppercase">Traffic Monitor</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase">AES-GCM 256 Stream</p>
            </div>
         </div>
      </div>

    </div>
  );
}