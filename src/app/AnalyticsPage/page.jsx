'use client';
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell, ComposedChart, Legend
} from 'recharts';
import { 
  TrendingUp, DollarSign, CreditCard, ArrowUpRight, 
  ArrowDownRight, PieChart as PieIcon, Activity, Zap 
} from 'lucide-react';

// --- ADVANCED MOCK DATA ---
const overallBalanceData = [
  { name: '1', balance: 4000, forecast: 4400 },
  { name: '4', balance: 3000, forecast: 3200 },
  { name: '8', balance: 5000, forecast: 5800 },
  { name: '12', balance: 2780, forecast: 3900 },
  { name: '16', balance: 4890, forecast: 4800 },
  { name: '20', balance: 6390, forecast: 7100 },
  { name: '22', balance: 5490, forecast: 6300 },
];

const spendingTrend = [
  { day: 'Mon', val: 40 }, { day: 'Tue', val: 70 }, { day: 'Wed', val: 45 },
  { day: 'Thu', val: 90 }, { day: 'Fri', val: 65 }, { day: 'Sat', val: 30 },
];

const multiSeriesData = [
  { name: 'Mon', income: 4000, expense: 2400 },
  { name: 'Tue', income: 3000, expense: 1398 },
  { name: 'Wed', income: 2000, expense: 9800 },
  { name: 'Thu', income: 2780, expense: 3908 },
  { name: 'Fri', income: 1890, expense: 4800 },
];

// --- STYLED COMPONENTS ---

const AnalyticsCard = ({ children, title, subtitle, trend, isPositive, className = "" }) => (
  <div className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl ${className}`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{subtitle}</h3>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      )}
    </div>
    {children}
  </div>
);

const MiniCard = ({ label, value, trend, icon: Icon, color }) => (
  <div className="bg-white/5 border border-white/5 rounded-3xl p-5 flex items-center justify-between group hover:border-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl bg-black border border-white/10 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
      {trend}
    </span>
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 overflow-x-hidden min-w-0">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic text-white">ANALYTICS_HUB</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Real-time system financial telemetry</p>
        </div>
        <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-transform">EXPORT_DATA</button>
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniCard label="Total Income" value="$312,134" trend="+19.6%" icon={DollarSign} color="text-emerald-400" />
        <MiniCard label="Active Projects" value="14 Month" trend="+4.3%" icon={Activity} color="text-blue-400" />
        <MiniCard label="Spending Trend" value="87%" trend="+4.5%" icon={TrendingUp} color="text-purple-400" />
        <MiniCard label="Wallet Balance" value="$32,430" trend="+3.1%" icon={CreditCard} color="text-amber-400" />
      </div>

      {/* MAIN ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OVERALL BALANCE (Large Composed Chart) */}
        <AnalyticsCard title="Main Intelligence" subtitle="Overall Balance" trend="+11.5%" isPositive={true} className="lg:col-span-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={overallBalanceData}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={4} fill="url(#balanceFill)" />
                <Bar dataKey="forecast" barSize={10} fill="#1e293b" radius={[10, 10, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        {/* SPENDING TREND (Neon Bar Chart) */}
        <AnalyticsCard title="Weekly Dynamics" subtitle="Spending Trend" trend="72%" isPositive={true}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingTrend}>
                <Bar dataKey="val" radius={[10, 10, 10, 10]}>
                  {spendingTrend.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={index === 3 ? '#3b82f6' : '#1e293b'} 
                      className="transition-all duration-500 hover:fill-blue-400"
                    />
                  ))}
                </Bar>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        {/* MULTI-SERIES COMPARISON */}
        <AnalyticsCard title="Comparison" subtitle="Income vs Expense" trend="Balanced" isPositive={true} className="lg:col-span-1">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={multiSeriesData}>
                <Line type="stepAfter" dataKey="income" stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="stepAfter" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={false} />
                <XAxis dataKey="name" hide />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Income</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Expense</div>
          </div>
        </AnalyticsCard>

        {/* PROJECT PROGRESS CARD */}
        <AnalyticsCard title="Milestones" subtitle="Finance App Progress" className="lg:col-span-2">
            <div className="space-y-6 py-2">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-4xl font-black text-white italic">68%</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Completion Rate</p>
                    </div>
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-black bg-gradient-to-tr from-blue-600 to-purple-600 shadow-xl" />
                        ))}
                    </div>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>13 Tasks Active</span>
                    <span>4/5 Phases</span>
                </div>
            </div>
        </AnalyticsCard>
      </div>

    </div>
  );
}