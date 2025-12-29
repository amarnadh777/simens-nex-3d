'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { 
  Activity, Zap, Droplets, Terminal, Server, 
  ArrowLeft, ShieldAlert, Cpu 
} from 'lucide-react';

import { useSelection } from '@/context/SelectionContext';
// IMPORT YOUR MAP
import { dashboardMap } from '@/components/dashboard/dashboardMap';

const ThreeCanvas = dynamic(
  () => import('../../components/ThreeCanvas'),
  { ssr: false }
);

/* -------------------------------------------------------------------------- */
/* 1. MOCK DATA                                */
/* -------------------------------------------------------------------------- */
const SEVERITY_DATA = [
  { name: 'Critical', value: 24, color: '#000000' },
  { name: 'High', value: 40, color: '#ef4444' },
  { name: 'Medium', value: 62, color: '#92400e' },
  { name: 'Low', value: 90, color: '#eab308' },
];

const SLA_DATA = [
  { priority: 'Crit', '<1m': 15, '1-5m': 5, '>5m': 4 },
  { priority: 'High', '<1m': 20, '1-5m': 15, '>5m': 5 },
  { priority: 'Med', '<1m': 30, '1-5m': 20, '>5m': 10 },
];

const OBJECT_INTELLIGENCE = {
  'Shed_Dirty_Wood_Planks_0': {
    type: 'Photovoltaic Array 03',
    primaryMetric: '4.2 kW',
    secondaryMetric: '94% Efficiency',
    health: 98,
    logs: ['Grid sync stable', 'Inverter temp nominal', 'Voltage balanced']
  },
  'Shed_Wood_Planks_0': {
    type: 'Primary Data Hall',
    primaryMetric: '1.2 MW',
    secondaryMetric: 'Temp: 22.4°C',
    health: 72,
    logs: ['Cooling ramped to 80%', 'UPS on bypass', 'Humidity within specs']
  }
};

/* -------------------------------------------------------------------------- */
/* 2. UI COMPONENTS                                */
/* -------------------------------------------------------------------------- */

const GlassPanel = ({ children, title, className = '' }) => (
  <div className={`bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-5 shadow-2xl ${className}`}>
    {title && (
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex justify-between items-center">
        {title}
        <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
      </h3>
    )}
    {children}
  </div>
);

const StatMiniCard = ({ label, val, icon: Icon, color }) => (
  <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col gap-1">
    <Icon size={14} className={color} />
    <span className="text-[9px] text-slate-500 uppercase font-bold">{label}</span>
    <p className="text-lg font-bold text-white leading-none">{val}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 3. MAIN DASHBOARD                              */
/* -------------------------------------------------------------------------- */

export default function AlarmDashboard() {
  const { selectedObject, setSelectedObject } = useSelection();

  // 🚩 LOOKUP COMPONENT FROM MAP
  const ComponentToRender = selectedObject ? dashboardMap[selectedObject.name] : null;

  const componentData = selectedObject ? (OBJECT_INTELLIGENCE[selectedObject.name] || {
    type: 'General Asset',
    primaryMetric: 'Active',
    secondaryMetric: 'Standard Mode',
    health: 100,
    logs: ['Telemetry heartbeat active', 'No specific alerts']
  }) : null;

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden text-slate-200 p-6 flex flex-col gap-4">

      {/* ================= TOP SECTION (3D + Overlay) ================= */}
      <div className="flex-1 relative grid grid-cols-12 gap-4 min-h-0 pointer-events-none">

        {/* ✅ BACKGROUND: 3D MODEL */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90 pointer-events-auto">
          <div className="w-full h-full max-w-[80%] max-h-[90%]">
            <ThreeCanvas highlightColor={selectedObject ? "#fbbf24" : "#3b82f6"} />
          </div>
        </div>

        {/* ✅ LEFT SIDEBAR: Context-Aware */}
        <div className="col-span-3 flex flex-col gap-4 z-10 pointer-events-auto">
          {selectedObject ? (
            /* COMPONENT DETAIL VIEW */
            <GlassPanel title="Component Intelligence">
              <button 
                onClick={() => setSelectedObject(null)}
                className="flex items-center gap-2 text-[10px] font-bold text-blue-400 mb-6 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> RETURN TO SITE OVERVIEW
              </button>
              
              {/* 🚩 RENDER THE DYNAMIC COMPONENT HERE */}
              {ComponentToRender ? (
                <ComponentToRender data={selectedObject} telemetry={componentData} />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{selectedObject.name}</h2>
                    <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">{componentData.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <StatMiniCard label="Primary Value" val={componentData.primaryMetric} icon={Zap} color="text-amber-400" />
                    <StatMiniCard label="Efficiency" val={componentData.secondaryMetric} icon={Activity} color="text-emerald-400" />
                  </div>
                </div>
              )}
            </GlassPanel>
          ) : (
            /* GENERAL SITE OVERVIEW */
            <>
              <GlassPanel title="Severity Distribution">
                <div className="h-40 relative text-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SEVERITY_DATA} innerRadius={45} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {SEVERITY_DATA.map((e, i) => <Cell key={i} fill={e.color} stroke="rgba(255,255,255,0.05)" />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-white">231</span>
                    <span className="text-[8px] text-slate-500 tracking-[0.3em]">TOTAL</span>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel title="Priority Matrix" className="flex-1">
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="text-slate-600 border-b border-white/5 uppercase italic">
                      <th className="text-left py-2 font-normal">Zone</th>
                      <th className="text-left py-2 font-normal">Now</th>
                      <th className="text-left py-2 font-normal">Dev.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEVERITY_DATA.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2">{row.name}</td>
                        <td>{row.value}</td>
                        <td className={i % 2 === 0 ? "text-red-500" : "text-emerald-500"}>
                          {i % 2 === 0 ? `+${i+1} 🔺` : `-${i+2} 🔻`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassPanel>
            </>
          )}
        </div>

        {/* ✅ RIGHT SIDEBAR */}
        <div className="col-span-3 col-start-10 flex flex-col gap-4 z-10 pointer-events-auto">
          {selectedObject ? (
             <GlassPanel title="Component Live Feed" className="flex-1">
                <div className="font-mono text-[9px] space-y-3">
                   {componentData.logs.map((log, idx) => (
                     <div key={idx} className="flex gap-2">
                        <span className="text-blue-500/50">[{9 + idx}:45]</span>
                        <span className="text-slate-300 uppercase italic tracking-wider">{log}</span>
                     </div>
                   ))}
                </div>
             </GlassPanel>
          ) : (
            <>
              <GlassPanel title="Response SLA">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SLA_DATA} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="priority" type="category" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                      <Bar dataKey="<1m" stackId="a" fill="#22c55e" radius={[2, 0, 0, 2]} />
                      <Bar dataKey="1-5m" stackId="a" fill="#eab308" />
                      <Bar dataKey=">5m" stackId="a" fill="#ef4444" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassPanel>
              <GlassPanel title="Health & Logistics" className="flex-1 space-y-4">
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex justify-between items-center cursor-pointer">
                  <div>
                    <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Offline Servers</span>
                    <p className="text-2xl font-black text-white mt-1">03</p>
                  </div>
                  <ShieldAlert className="text-red-500 opacity-40" size={20} />
                </div>
              </GlassPanel>
            </>
          )}
        </div>
      </div>

      {/* ================= BOTTOM SECTION (Always Visible) ================= */}
      <div className="h-32 grid grid-cols-12 gap-4 z-20 pointer-events-auto">
        <div className="col-span-5 grid grid-cols-3 gap-3">
          {['PUE', 'WUE', 'Availability'].map((label, i) => (
            <GlassPanel key={i} className="flex flex-col items-center justify-center">
              <Activity size={16} className="text-emerald-400 mb-1" />
              <p className="text-[9px] text-slate-500 font-bold uppercase">{label}</p>
              <p className="text-lg font-black text-white">{i === 0 ? '1.52' : i === 1 ? '1.21' : '98.4%'}</p>
            </GlassPanel>
          ))}
        </div>

        <GlassPanel className="col-span-7 flex gap-4 overflow-hidden border-blue-500/20">
          <div className="flex flex-col border-r border-white/10 pr-4 shrink-0 justify-center text-center">
            <Terminal size={18} className="text-blue-400 mb-1" />
            <span className="text-[8px] font-bold text-blue-500/70 uppercase">Global_Log</span>
          </div>
          <div className="flex-1 font-mono text-[10px] space-y-1 overflow-y-auto">
            <p className="text-emerald-400 flex justify-between"><span>[09:44] SYS_SYNC_SUCCESS</span><span className="opacity-30">NODE_ALPHA</span></p>
            <p className="text-red-400 flex justify-between font-bold animate-pulse"><span>[09:43] RACK_TEMP_HIGH</span><span>ZONE_C</span></p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}