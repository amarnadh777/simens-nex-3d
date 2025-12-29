'use client';
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Thermometer, Droplets, Activity, Zap, AlertCircle } from 'lucide-react';

// --- STYLED COMPONENTS ---
const StatCard = ({ label, value, subValue, icon: Icon, colorClass }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
    <div className="flex justify-between items-center text-slate-500">
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <Icon size={16} className={colorClass} />
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    {subValue && <div className="text-[10px] text-slate-400 font-mono">{subValue}</div>}
  </div>
);

const MiniPie = ({ data, title, centerValue }) => (
  <div className="flex-1 flex flex-col items-center">
    <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">{title}</p>
    <div className="h-32 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={35} outerRadius={45} dataKey="value" stroke="none">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#000', border: 'none', fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">{centerValue}</div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function DataHallDashboard({ hallName = "Data Hall 01" }) {
  // Mock Data for the 7-day Line Chart
  const environmentalHistory = [
    { day: 'Mon', min: 21, max: 24, avg: 22.5, h_avg: 45 },
    { day: 'Tue', min: 20, max: 23, avg: 21.8, h_avg: 44 },
    { day: 'Wed', min: 22, max: 26, avg: 24.1, h_avg: 48 }, // Peak day
    { day: 'Thu', min: 21, max: 24, avg: 22.2, h_avg: 46 },
    { day: 'Fri', min: 20, max: 22, avg: 21.1, h_avg: 45 },
    { day: 'Sat', min: 21, max: 23, avg: 22.0, h_avg: 44 },
    { day: 'Sun', min: 21, max: 24, avg: 22.4, h_avg: 45 },
  ];

  const severityPie = [
    { name: 'Critical', value: 5, color: '#000000' },
    { name: 'High', value: 12, color: '#ef4444' },
    { name: 'Med', value: 18, color: '#92400e' },
    { name: 'Low', value: 25, color: '#eab308' },
    { name: 'Info', value: 10, color: '#3b82f6' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{hallName}</h2>
          <p className="text-[10px] text-blue-400 font-mono">ENVIRONMENTAL & CAPACITY OVERVIEW</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[8px] text-slate-500 uppercase">IT Load</p>
            <p className="text-lg font-bold text-amber-400 leading-none">850 kW</p>
          </div>
        </div>
      </header>

      {/* TOP ROW: KPI CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Current Temp" value="22.4°C" subValue="Max: 26.1°C" icon={Thermometer} colorClass="text-red-400" />
        <StatCard label="Humidity" value="45.2%" subValue="Max: 48.0%" icon={Droplets} colorClass="text-blue-400" />
        <StatCard label="Total Alarms" value="70" subValue="+12 vs yesterday" icon={AlertCircle} colorClass="text-amber-500" />
      </div>

      {/* MIDDLE ROW: PIE CHARTS */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex gap-4">
        <MiniPie title="Severity" data={severityPie} centerValue="70" />
        <div className="w-[1px] bg-white/10 h-32 self-center" />
        <MiniPie 
          title="Status" 
          centerValue="Active"
          data={[
            { name: 'Alarm', value: 30, color: '#ef4444' },
            { name: 'Ack', value: 25, color: '#eab308' },
            { name: 'Reset', value: 10, color: '#22c55e' },
            { name: 'Disabled', value: 5, color: '#64748b' },
          ]} 
        />
      </div>

      {/* BOTTOM ROW: 7-DAY ENVIRONMENTAL GRAPH */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">7-Day Analysis (Temp & Humidity)</h3>
          <div className="flex gap-4 text-[8px] font-bold uppercase">
            <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-red-500"/> Max</span>
            <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-blue-500"/> Avg</span>
            <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-emerald-500"/> Min</span>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={environmentalHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMPLIANCE BAR CHART (Inline Parameters) */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
         <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Time Inline with Parameters (%)</h3>
         <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', pct: 98 }, { month: 'Aug', pct: 97 }, 
                { month: 'Sep', pct: 99 }, { month: 'Oct', pct: 94 }, 
                { month: 'Nov', pct: 98 }, { month: 'Dec', pct: 99 }
              ]}>
                <Bar dataKey="pct" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}