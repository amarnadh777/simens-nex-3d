'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line
} from 'recharts';
import { 
  Activity, Zap, Droplets, Terminal, Server, 
  ArrowLeft, ShieldAlert, Cpu, Globe, Clock, AlertTriangle 
} from 'lucide-react';

import { useSelection } from '@/context/SelectionContext';
import { dashboardMap } from '@/components/dashboard/dashboardMap';

const ThreeCanvas = dynamic(() => import('../../components/ThreeCanvas'), { ssr: false });

/* -------------------------------------------------------------------------- */
/* 1. COMPREHENSIVE MOCK DATA                                                 */
/* -------------------------------------------------------------------------- */

const SEVERITY_DATA = [
  { name: 'Critical', value: 24, color: '#000000' },
  { name: 'High', value: 40, color: '#ef4444' },
  { name: 'Medium', value: 62, color: '#92400e' },
  { name: 'Low', value: 90, color: '#eab308' },
  { name: 'Information', value: 15, color: '#3b82f6' },
];

const STATUS_DATA = [
  { name: 'Acknowledged', value: 85, color: '#eab308' },
  { name: 'Alarm', value: 120, color: '#ef4444' },
  { name: 'Disabled', value: 10, color: '#64748b' },
  { name: 'Reset', value: 45, color: '#22c55e' },
];

const SLA_DATA = [
  { priority: 'Critical', '<1m': 18, '1-5m': 4, '>5m': 2, avg: '0.8m' },
  { priority: 'High', '<1m': 30, '1-5m': 8, '>5m': 2, avg: '1.2m' },
  { priority: 'Medium', '<1m': 40, '1-5m': 15, '>5m': 7, avg: '3.4m' },
  { priority: 'Low', '<1m': 60, '1-5m': 20, '>5m': 10, avg: '5.1m' },
];

const PUE_HISTORY = [
  { time: '00:00', pue: 1.55 }, { time: '04:00', pue: 1.52 },
  { time: '08:00', pue: 1.58 }, { time: '12:00', pue: 1.62 },
  { time: '16:00', pue: 1.54 }, { time: '20:00', pue: 1.51 },
];

/* -------------------------------------------------------------------------- */
/* 2. UI COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

const GlassPanel = ({ children, title, className = '' }) => (
  <div className={`bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 shadow-2xl ${className}`}>
    {title && (
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex justify-between items-center border-b border-white/5 pb-2">
        {title}
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      </h3>
    )}
    {children}
  </div>
);

const KPICard = ({ label, val, subVal, icon: Icon, color, chartData }) => (
  <GlassPanel className="flex flex-col h-full justify-between min-w-[140px]">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon size={16} />
      </div>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-black text-white leading-none">{val}</p>
      {subVal && <p className="text-[10px] text-slate-400 mt-1">{subVal}</p>}
    </div>
    {chartData && (
      <div className="h-10 mt-2 opacity-50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="pue" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </GlassPanel>
);

/* -------------------------------------------------------------------------- */
/* 3. MAIN DASHBOARD                                                          */
/* -------------------------------------------------------------------------- */

export default function AlarmDashboard() {
  const { selectedObject, setSelectedObject } = useSelection();
  const ComponentToRender = selectedObject ? dashboardMap[selectedObject.name] : null;

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden text-slate-200 flex flex-col">
      
      {/* BACKGROUND 3D (Always clickable behind panels) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ThreeCanvas highlightColor={selectedObject ? "#fbbf24" : "#3b82f6"} />
      </div>

      <div className="relative z-10 flex h-full p-6 gap-6 pointer-events-none">
        
        {/* LEFT SCROLLABLE TELEMETRY (Overview Data) */}
        <div className="w-[320px] flex flex-col gap-4 overflow-y-auto pr-2 pointer-events-auto custom-scrollbar">
          
          {selectedObject ? (
            <GlassPanel title="Object Intelligence">
              <button onClick={() => setSelectedObject(null)} className="flex items-center gap-2 text-[10px] font-bold text-blue-400 mb-6 hover:text-white transition-colors">
                <ArrowLeft size={14} /> BACK TO OVERVIEW
              </button>
              {ComponentToRender ? <ComponentToRender data={selectedObject} /> : <div className="text-xs italic text-slate-500">Processing asset {selectedObject.name}...</div>}
            </GlassPanel>
          ) : (
            <>
              {/* Severity & Status Pie Charts */}
              <GlassPanel title="Alarms by Severity">
                <div className="h-44 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SEVERITY_DATA} innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={4}>
                        {SEVERITY_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black">231</span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest">Alarms</span>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel title="Alarms by Status">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={STATUS_DATA} innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={4}>
                        {STATUS_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', fontSize: '10px' }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassPanel>

              {/* Alarm Priority Matrix */}
              <GlassPanel title="Priority Matrix (Vs Last Week)">
                <div className="text-[9px] font-mono space-y-2">
                  <table className="w-full">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/5 uppercase">
                        <th className="text-left pb-2">Priority</th>
                        <th className="text-center pb-2">Current</th>
                        <th className="text-center pb-2">L. Week</th>
                        <th className="text-right pb-2">Dev.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { p: 'Critical', c: 24, l: 18, d: '+6', s: '🔺', up: true },
                        { p: 'High', c: 40, l: 45, d: '-5', s: '🔻', up: false },
                        { p: 'Medium', c: 62, l: 60, d: '+2', s: '🔺', up: true },
                        { p: 'Low', c: 90, l: 110, d: '-20', s: '🔻', up: false },
                        { p: 'No Prio', c: 15, l: 10, d: '+5', s: '🔺', up: true },
                      ].map((r, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2">{r.p}</td>
                          <td className="text-center font-bold">{r.c}</td>
                          <td className="text-center text-slate-500">{r.l}</td>
                          <td className={`text-right font-bold ${r.up ? 'text-red-500' : 'text-emerald-500'}`}>{r.d} {r.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>

              {/* SLA Response Time */}
              <GlassPanel title="Response SLA & Ack Time">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SLA_DATA} layout="vertical" margin={{ left: -10 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="priority" type="category" stroke="#666" fontSize={8} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#000', border: 'none' }} />
                      <Bar dataKey="<1m" stackId="a" fill="#22c55e" />
                      <Bar dataKey="1-5m" stackId="a" fill="#eab308" />
                      <Bar dataKey=">5m" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <p className="text-[7px] text-slate-500 uppercase">Avg Ack (Crit)</p>
                    <p className="text-xs font-bold text-emerald-400">0.8 min</p>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <p className="text-[7px] text-slate-500 uppercase">Avg Ack (High)</p>
                    <p className="text-xs font-bold text-white">1.2 min</p>
                  </div>
                </div>
              </GlassPanel>

              {/* System Health (Offline Metrics) */}
              <GlassPanel title="System Availability">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] text-slate-500 uppercase">Equipment Uptime</span>
                    <span className="text-lg font-black text-emerald-400">98.4%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.4%] shadow-[0_0_10px_#10b981]" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center">
                      <p className="text-[8px] text-slate-500 uppercase">Servers</p>
                      <p className="text-xs font-bold text-red-500">03 Offline</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-slate-500 uppercase">Controllers</p>
                      <p className="text-xs font-bold text-amber-500">01 Offline</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-slate-500 uppercase">Interfaces</p>
                      <p className="text-xs font-bold text-emerald-500">0 Faults</p>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </>
          )}
        </div>

        {/* RIGHT SIDE (Dynamic Content or Active Alerts) */}
        <div className="flex-1 flex flex-col justify-end gap-6">
          <div className="flex justify-center gap-4 pointer-events-auto h-32 mb-4">
            <KPICard label="PUE" val="1.52" subVal="Eff. Ratio" icon={Zap} color="text-amber-400" chartData={PUE_HISTORY} />
            <KPICard label="WUE" val="1.21" subVal="L / kWh" icon={Droplets} color="text-blue-400" />
            <KPICard label="CUE" val="0.84" subVal="kgCO2e / kWh" icon={Globe} color="text-emerald-400" />
          </div>

          <GlassPanel className="pointer-events-auto border-blue-500/30">
            <div className="flex gap-4 items-center h-12">
               <div className="flex flex-col border-r border-white/10 pr-4">
                  <Terminal size={18} className="text-blue-400" />
                  <span className="text-[7px] font-bold text-blue-500/70 uppercase">Event_Feed</span>
               </div>
               <div className="flex-1 font-mono text-[10px] overflow-hidden">
                  <div className="flex justify-between text-emerald-400 animate-pulse">
                    <span>[09:44] SYSTEM_PUE_NOMINAL: 1.52 across all halls</span>
                    <span className="opacity-50">#CENTRAL_HUB</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>[09:41] Routine controller check completed. 124 nodes verified.</span>
                    <span className="opacity-50">#LOG_DUMP</span>
                  </div>
               </div>
            </div>
          </GlassPanel>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}